import { cookies } from "next/headers";
import {
  createParticipantSessionToken,
  PARTICIPANT_SESSION_COOKIE,
  PARTICIPANT_SESSION_MAX_AGE,
  type ParticipantSessionPayload,
  verifyParticipantSessionToken,
} from "./participant-session";

/**
 * Helpers de session participant côté serveur (composants serveur + server
 * actions). S'appuient sur `next/headers` (cookies) — à ne PAS importer dans le
 * proxy, qui lit le cookie via NextRequest. Calqués sur lib/admin-auth.ts.
 */

/** Retourne le participant connecté (depuis le cookie), ou `null`. */
export async function getCurrentParticipant(): Promise<ParticipantSessionPayload | null> {
  const token = (await cookies()).get(PARTICIPANT_SESSION_COOKIE)?.value;
  return verifyParticipantSessionToken(token);
}

/** Attributs communs du cookie de session participant. */
function cookieOptions() {
  return {
    httpOnly: true,
    // Secure en production (HTTPS partout) ; désactivé en dev (http).
    secure: process.env.NODE_ENV === "production",
    // Strict : jamais envoyé sur une navigation cross-site (neutralise le CSRF
    // sur les routes participant authentifiées).
    sameSite: "strict" as const,
    // Portée limitée à l'espace formation.
    path: "/formation",
  };
}

/** Ouvre une session participant : signe un jeton et pose le cookie (7 j). */
export async function createParticipantSession(
  payload: ParticipantSessionPayload,
): Promise<void> {
  const token = await createParticipantSessionToken(payload);
  (await cookies()).set(PARTICIPANT_SESSION_COOKIE, token, {
    ...cookieOptions(),
    maxAge: PARTICIPANT_SESSION_MAX_AGE,
  });
}

/** Détruit la session participant : supprime le cookie. */
export async function destroyParticipantSession(): Promise<void> {
  (await cookies()).set(PARTICIPANT_SESSION_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
}
