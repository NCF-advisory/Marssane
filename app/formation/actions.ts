"use server";

import { compare, hash } from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { insertParticipantMessage } from "@/lib/formation-chat";
import type { ChatMessage } from "@/lib/formation-chat-display";
import {
  createParticipantSession,
  destroyParticipantSession,
  getCurrentParticipant,
} from "@/lib/participant-auth";
import {
  activateParticipant,
  findParticipantByEmail,
  hashInviteToken,
} from "@/lib/participants";
import { recordAnswer } from "@/lib/qcm";
import { parseChatMessage } from "@/lib/validation";

/**
 * Server actions de l'espace formation (participants). Protections calquées sur
 * l'admin (app/admin/actions.ts), mais séparées : rate-limiting par IP, temps de
 * réponse constant (hash factice), vérification d'origine (CSRF), et message
 * unique anti-énumération au login. Aucune donnée sensible n'est journalisée.
 */

/** Coût bcrypt (identique à l'admin et au script de création). */
const BCRYPT_COST = 12;

/** Longueur minimale du mot de passe participant. */
const PASSWORD_MIN = 8;

/** Message unique pour un échec de connexion (pas d'énumération). */
const IDENTIFIANTS_INCORRECTS = "Identifiants incorrects.";

/**
 * Hash bcrypt factice (mot de passe « ~ », coût 12) comparé quand aucun
 * participant ne correspond ou n'est pas activé, pour égaliser le temps de
 * réponse (même valeur que l'admin).
 */
const DUMMY_HASH = "$2b$12$qymQTq8BTuqdTeL0R17in.0oVl7cbwLqrT2mPFr.KBPzeoIgZgpKS";

/** Rate-limiting en mémoire par IP : 5 tentatives / 15 min (comme l'admin). */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(key);
  }
  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX) return false;
  current.count += 1;
  return true;
}

async function clientIp(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "inconnu";
}

/** Vérifie que l'origine correspond à l'hôte (CSRF, défense en profondeur). */
async function sameOrigin(): Promise<boolean> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/* ===== Connexion ====================================================== */

/** État renvoyé au formulaire de connexion (compatible `useActionState`). */
export type LoginState = {
  status: "idle" | "error";
  formError?: string;
  email?: string;
};

/** Connexion participant (email + mot de passe). */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = (formData.get("email") ?? "").toString().trim().toLowerCase();
  const password = (formData.get("password") ?? "").toString();

  if (!(await sameOrigin())) {
    return { status: "error", formError: "Requête invalide.", email };
  }

  const ip = await clientIp();
  if (!checkRateLimit(ip)) {
    return {
      status: "error",
      formError: "Trop de tentatives, réessayez dans quelques minutes.",
      email,
    };
  }

  if (!email || !password) {
    return { status: "error", formError: IDENTIFIANTS_INCORRECTS, email };
  }

  let session: { id: string; email: string; sessionId: string } | null = null;
  try {
    const participant = await findParticipantByEmail(email);
    // Comparaison factice si absent ou non activé (temps constant).
    const ok = await compare(password, participant?.password_hash ?? DUMMY_HASH);
    if (ok && participant?.password_hash) {
      session = {
        id: participant.id,
        email: participant.email,
        sessionId: participant.session_id,
      };
    }
  } catch {
    console.error("[formation] échec de la vérification des identifiants (incident)");
    return {
      status: "error",
      formError: "Service indisponible, réessayez dans un instant.",
      email,
    };
  }

  if (!session) {
    return { status: "error", formError: IDENTIFIANTS_INCORRECTS, email };
  }

  await createParticipantSession({
    sub: session.id,
    email: session.email,
    sessionId: session.sessionId,
  });
  redirect("/formation/espace");
}

/** Déconnexion : détruit le cookie de session et renvoie à la connexion. */
export async function logoutAction(): Promise<void> {
  await destroyParticipantSession();
  redirect("/formation");
}

/* ===== Chat de promotion (phase 2) ==================================== */

/**
 * Rate-limiting d'envoi de messages, distinct du login : 10 messages / minute
 * par participant (garde-fou anti-spam, pas une contrainte d'usage normal).
 */
const POST_LIMIT_MAX = 10;
const POST_LIMIT_WINDOW_MS = 60 * 1000;
const postAttempts = new Map<string, { count: number; resetAt: number }>();

function checkPostRateLimit(key: string): boolean {
  const now = Date.now();
  for (const [k, entry] of postAttempts) {
    if (entry.resetAt <= now) postAttempts.delete(k);
  }
  const current = postAttempts.get(key);
  if (!current || current.resetAt <= now) {
    postAttempts.set(key, { count: 1, resetAt: now + POST_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= POST_LIMIT_MAX) return false;
  current.count += 1;
  return true;
}

/** Résultat d'un envoi de message (le message créé sert à l'affichage optimiste). */
export type PostMessageResult =
  | { ok: true; message: ChatMessage }
  | { ok: false; error: string };

/**
 * Poste un message dans le chat de la promotion. Participant authentifié
 * (cookie) : la session (promotion) est celle du jeton, jamais du formulaire.
 * Vérification d'origine (CSRF), rate-limit par participant, validation zod.
 * Renvoie le message créé pour un affichage immédiat côté client (dédupliqué à
 * l'arrivée du même id via SSE).
 */
export async function postMessageAction(
  formData: FormData,
): Promise<PostMessageResult> {
  if (!(await sameOrigin())) {
    return { ok: false, error: "Requête invalide." };
  }

  const participant = await getCurrentParticipant();
  if (!participant) {
    return { ok: false, error: "Session expirée, reconnectez-vous." };
  }

  if (!checkPostRateLimit(participant.sub)) {
    return {
      ok: false,
      error: "Vous envoyez des messages trop vite, patientez un instant.",
    };
  }

  const parsed = parseChatMessage(formData);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  try {
    const message = await insertParticipantMessage({
      sessionId: participant.sessionId,
      participantId: participant.sub,
      contenu: parsed.data.contenu,
      claudeQuote: parsed.data.claude_quote ?? null,
      attachmentName: parsed.data.attachment_name ?? null,
    });
    return { ok: true, message };
  } catch {
    console.error("[formation] échec de l'envoi d'un message (incident)");
    return {
      ok: false,
      error: "Envoi impossible, réessayez dans un instant.",
    };
  }
}

/* ===== Activation ===================================================== */

/** État renvoyé au formulaire d'activation (compatible `useActionState`). */
export type ActivationState = {
  status: "idle" | "error";
  formError?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Activation d'un compte participant : vérifie le token + son expiration, exige
 * un mot de passe d'au moins 8 caractères confirmé, pose le hash bcrypt et
 * ouvre la session. L'invalidation du token et l'expiration sont gérées
 * atomiquement côté base (activateParticipant).
 */
export async function activateAction(
  _prevState: ActivationState,
  formData: FormData,
): Promise<ActivationState> {
  const token = (formData.get("token") ?? "").toString();
  const password = (formData.get("password") ?? "").toString();
  const confirm = (formData.get("password_confirm") ?? "").toString();

  if (!(await sameOrigin())) {
    return { status: "error", formError: "Requête invalide." };
  }

  const ip = await clientIp();
  if (!checkRateLimit(ip)) {
    return {
      status: "error",
      formError: "Trop de tentatives, réessayez dans quelques minutes.",
    };
  }

  if (!token) {
    return {
      status: "error",
      formError: "Lien d'activation invalide ou expiré.",
    };
  }

  const fieldErrors: Record<string, string> = {};
  if (password.length < PASSWORD_MIN) {
    fieldErrors.password = `Le mot de passe doit faire au moins ${PASSWORD_MIN} caractères.`;
  } else if (password !== confirm) {
    fieldErrors.password_confirm = "Les mots de passe ne correspondent pas.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  let activated: { id: string; email: string; session_id: string } | null;
  try {
    const passwordHash = await hash(password, BCRYPT_COST);
    activated = await activateParticipant(hashInviteToken(token), passwordHash);
  } catch {
    console.error("[formation] échec de l'activation (incident)");
    return {
      status: "error",
      formError: "Service indisponible, réessayez dans un instant.",
    };
  }

  if (!activated) {
    return {
      status: "error",
      formError:
        "Lien d'activation invalide ou expiré, ou compte déjà activé. Essayez de vous connecter.",
    };
  }

  await createParticipantSession({
    sub: activated.id,
    email: activated.email,
    sessionId: activated.session_id,
  });
  redirect("/formation/espace");
}

/* ===== QCM (phase 3) ================================================== */

/** Entrée d'une réponse de QCM (une question, une ou plusieurs options). */
const answerSchema = z.object({
  questionId: z.uuid(),
  optionIds: z.array(z.uuid()).min(1).max(20),
});

/** Résultat d'un enregistrement de réponse (feedback minimal côté client). */
export type AnswerResult = { ok: true } | { ok: false; error: string };

/**
 * Enregistre au fil de l'eau la réponse du participant à une question de QCM.
 * Participant authentifié (cookie) : la promotion est celle du jeton, jamais du
 * formulaire. `recordAnswer` vérifie côté base que le questionnaire est ouvert
 * (non fermé) pour cette session et que les options appartiennent à la question ;
 * il refuse sinon. Le score n'est jamais calculé ici (uniquement au rendu, côté
 * serveur, à partir des données stockées).
 */
export async function answerQuestionAction(input: {
  questionId: string;
  optionIds: string[];
}): Promise<AnswerResult> {
  if (!(await sameOrigin())) {
    return { ok: false, error: "Requête invalide." };
  }

  const participant = await getCurrentParticipant();
  if (!participant) {
    return { ok: false, error: "Session expirée, reconnectez-vous." };
  }

  const parsed = answerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Réponse invalide." };
  }

  try {
    const ok = await recordAnswer({
      participantId: participant.sub,
      sessionId: participant.sessionId,
      questionId: parsed.data.questionId,
      optionIds: parsed.data.optionIds,
    });
    if (!ok) {
      return {
        ok: false,
        error: "Ce QCM n'est plus ouvert ou la réponse est invalide.",
      };
    }
    return { ok: true };
  } catch {
    console.error("[formation] échec de l'enregistrement d'une réponse (incident)");
    return { ok: false, error: "Enregistrement impossible, réessayez." };
  }
}
