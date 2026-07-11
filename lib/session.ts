import { jwtVerify, SignJWT } from "jose";

/**
 * Session admin — jeton JWT signé (HS256) stocké dans un cookie httpOnly.
 *
 * Choix « maison » (pas de next-auth) : voir le rapport de la tâche. Avantage
 * ici : ce module ne dépend que de `jose`, il est donc utilisable tel quel dans
 * le middleware (runtime Edge) pour vérifier le cookie, sans embarquer bcrypt
 * ni le client Postgres (Node uniquement).
 */

/** Nom du cookie de session. Portée limitée à /admin (attribut Path). */
export const SESSION_COOKIE = "marssane_admin_session";

/** Durée de vie de la session : 24 h (jeton + cookie). */
export const SESSION_MAX_AGE = 60 * 60 * 24;

/** Charge utile du jeton. `sub` = id admin ; `email` = affichage. */
export type SessionPayload = {
  sub: string;
  email: string;
};

/**
 * Clé de signature dérivée de AUTH_SECRET. Lève si absente : utilisé côté
 * signature (login), où l'absence de secret doit remonter comme un incident.
 * La vérification, elle, ne lève jamais (retourne null) — voir `getSession`.
 */
function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET est absent : renseignez-le dans .env.local (voir .env.example).",
    );
  }
  return new TextEncoder().encode(secret);
}

/** Signe un jeton de session valable 24 h. */
export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

/**
 * Vérifie un jeton et retourne sa charge utile, ou `null` si le jeton est
 * absent, invalide, expiré, ou si AUTH_SECRET n'est pas configuré. Ne lève
 * jamais : une session non vérifiable est simplement traitée comme absente.
 */
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
