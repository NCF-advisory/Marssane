import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  type SessionPayload,
} from "./session";

/**
 * Helpers de session côté serveur (composants serveur + server actions).
 * S'appuient sur `next/headers` (cookies) — à ne PAS importer dans le
 * middleware, qui lit le cookie via NextRequest (voir middleware.ts).
 */

/** Ancien admin fermé : même un ancien jeton valide n'autorise plus d'action. */
export async function getCurrentAdmin(): Promise<SessionPayload | null> {
  return null;
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

/** Détruit la session : supprime le cookie. */
export async function destroySession(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
}
