"use server";

import { headers } from "next/headers";
import { insertContact } from "@/lib/contacts";
import { sendContactEmail } from "@/lib/emails";
import { parseContact } from "@/lib/validation";

/** État renvoyé à `useActionState` (branché à l'UI, ContactForm). */
export type ContactState = {
  status: "idle" | "error" | "success";
  /** Erreur globale du formulaire (rate-limit, incident base). */
  formError?: string;
  /** Erreurs par champ (clé = nom du champ). */
  fieldErrors?: Record<string, string>;
  /**
   * Valeurs saisies, réinjectées dans le formulaire en cas d'erreur (utile sans
   * JS : le POST recharge la page et le formulaire doit se repeupler). Ne
   * contient aucune donnée sensible au-delà de ce que l'utilisateur a tapé.
   */
  values?: Record<string, string>;
};

export const initialContactState: ContactState = { status: "idle" };

/** Extrait les valeurs saisies pour les réinjecter dans le formulaire. */
function submittedValues(formData: FormData): Record<string, string> {
  const str = (key: string) => (formData.get(key) ?? "").toString();
  return {
    prenom: str("prenom"),
    nom: str("nom"),
    email: str("email"),
    telephone: str("telephone"),
    entreprise: str("entreprise"),
    message: str("message"),
    consentement: str("consentement") === "on" ? "on" : "",
  };
}

/**
 * Rate-limiting en mémoire par IP : 5 tentatives par heure.
 *
 * CHOIX (dupliqué, non partagé) : le même petit motif que
 * `app/actions/inscription.ts` est reproduit ici plutôt qu'extrait dans un
 * module commun. Deux raisons : (1) garder un compteur INDÉPENDANT par
 * formulaire — mutualiser la Map plafonnerait à 5 requêtes/h les deux
 * formulaires cumulés pour une même IP, ce qui n'est pas voulu ; (2) ne pas
 * toucher à `inscription.ts` (règle « chirurgical » du CLAUDE.md). La même
 * LIMITE CONNUE s'applique : l'état vit dans le processus (par instance en
 * serverless) — acceptable en v1, le honeypot restant la première ligne de
 * défense.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  // Purge des fenêtres expirées (évite la croissance non bornée de la Map).
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

/**
 * Server action du formulaire de contact « implémentation » (F4 · CDC §5.4),
 * compatible `useActionState`.
 *
 * Confirmation INLINE (pas de redirection, CDC §5.4) : en succès l'état porte
 * `status: "success"` et le composant affiche le message de confirmation à la
 * place du formulaire.
 *
 * Source de vérité : l'enregistrement en base. Un échec d'insertion renvoie une
 * erreur « Service indisponible ». À l'inverse l'email admin est secondaire : un
 * échec d'envoi ne remet pas en cause la demande enregistrée.
 *
 * RGPD : aucune donnée personnelle n'est journalisée. Les incidents loguent un
 * code technique, jamais les valeurs saisies.
 */
export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1. Honeypot : un bot a rempli le champ caché. On simule un succès (le
  //    spammeur croit avoir réussi) sans rien enregistrer ni envoyer.
  const honeypot = (formData.get("site_web") ?? "").toString().trim();
  if (honeypot) return { status: "success" };

  const values = submittedValues(formData);

  // 2. Rate-limiting par IP.
  const ip = await clientIp();
  if (!checkRateLimit(ip)) {
    return {
      status: "error",
      formError: "Trop de tentatives, réessayez plus tard.",
      values,
    };
  }

  // 3. Validation.
  const parsed = parseContact(formData);
  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors, values };
  }

  // 4. Enregistrement (source de vérité).
  try {
    await insertContact(parsed.data);
  } catch (error) {
    const code = (error as { code?: string })?.code ?? "inconnu";
    console.error("[contact] échec de l'enregistrement (code:", code + ")");
    return {
      status: "error",
      formError: "Service indisponible, réessayez dans un instant.",
      values,
    };
  }

  // 5. Notification admin (F5). Ne lève jamais : la demande est déjà en base.
  await sendContactEmail({ contact: parsed.data });

  return { status: "success" };
}
