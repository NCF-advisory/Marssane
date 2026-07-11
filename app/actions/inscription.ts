"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendInscriptionEmails } from "@/lib/emails";
import { createInscription, getProchaineSession } from "@/lib/sessions";
import { parseInscription } from "@/lib/validation";

/** État renvoyé à `useActionState` (branché à l'UI en tâche 2). */
export type InscriptionState = {
  status: "idle" | "error";
  /** Erreur globale du formulaire (rate-limit, doublon, incident). */
  formError?: string;
  /** Erreurs par champ (clé = nom du champ). */
  fieldErrors?: Record<string, string>;
};

export const initialInscriptionState: InscriptionState = { status: "idle" };

/**
 * Rate-limiting en mémoire par IP : 5 tentatives par heure.
 *
 * LIMITE CONNUE : l'état vit dans le processus. En environnement serverless
 * (Vercel), chaque instance a sa propre Map — la limite est donc par instance,
 * pas globale. C'est acceptable en v1 : le honeypot est la première ligne de
 * défense et le formulaire n'a pas d'enjeu financier. À revoir (store partagé)
 * si l'abus devient réel.
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
 * Server action de pré-inscription (F2 · CDC §5.2), compatible `useActionState`.
 *
 * RGPD : aucune donnée personnelle n'est journalisée. Les incidents loguent un
 * code technique, jamais les valeurs saisies.
 */
export async function submitInscription(
  _prevState: InscriptionState,
  formData: FormData,
): Promise<InscriptionState> {
  // 1. Honeypot : un bot a rempli le champ caché. On simule un succès (le
  //    spammeur croit avoir réussi) sans rien enregistrer.
  const honeypot = (formData.get("site_web") ?? "").toString().trim();
  if (honeypot) redirect("/merci");

  // 2. Rate-limiting par IP.
  const ip = await clientIp();
  if (!checkRateLimit(ip)) {
    return {
      status: "error",
      formError: "Trop de tentatives, réessayez plus tard.",
    };
  }

  // 3. Validation.
  const parsed = parseInscription(formData);
  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  // 4. Enregistrement.
  let result;
  try {
    result = await createInscription(parsed.data);
  } catch (error) {
    const code =
      (error as { code?: string })?.code ?? "inconnu";
    console.error("[inscription] échec de l'enregistrement (code:", code + ")");
    return {
      status: "error",
      formError: "Une erreur est survenue. Réessayez dans un instant.",
    };
  }

  if (!result.ok) {
    return {
      status: "error",
      formError: "Vous êtes déjà inscrit pour cette session.",
    };
  }

  // Emails transactionnels (no-op jusqu'au jalon 3 tâche 3). Un échec d'envoi
  // ne doit pas bloquer l'inscription déjà enregistrée.
  try {
    const session = await getProchaineSession();
    await sendInscriptionEmails({
      inscription: { ...parsed.data, statut: result.statut },
      session,
      placesRestantes: session?.places_restantes ?? 0,
    });
  } catch {
    console.error("[inscription] échec de l'envoi des emails");
  }

  // redirect() lève une exception : appelé hors de tout try/catch.
  redirect(`/merci?statut=${result.statut}`);
}
