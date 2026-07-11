import { cookies } from "next/headers";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionPayload,
  verifySessionToken,
} from "./session";

/**
 * Helpers de session côté serveur (composants serveur + server actions).
 * S'appuient sur `next/headers` (cookies) — à ne PAS importer dans le
 * middleware, qui lit le cookie via NextRequest (voir middleware.ts).
 */

/** Retourne l'admin connecté (depuis le cookie), ou `null`. */
export async function getCurrentAdmin(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Attributs communs du cookie de session. */
function cookieOptions() {
  return {
    httpOnly: true,
    // Secure en production (HTTPS partout, CDC §7.6) ; désactivé en dev (http).
    secure: process.env.NODE_ENV === "production",
    // Strict : le cookie n'est jamais envoyé sur une navigation cross-site,
    // ce qui neutralise le CSRF sur les routes admin authentifiées.
    sameSite: "strict" as const,
    // Portée limitée aux routes admin.
    path: "/admin",
  };
}

/** Ouvre une session : signe un jeton et pose le cookie (24 h). */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload);
  (await cookies()).set(SESSION_COOKIE, token, {
    ...cookieOptions(),
    maxAge: SESSION_MAX_AGE,
  });
}

/** Détruit la session : supprime le cookie. */
export async function destroySession(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
}
