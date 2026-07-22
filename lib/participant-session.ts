import { jwtVerify, SignJWT } from "jose";

/**
 * Session participant — jeton JWT signé (HS256) stocké dans un cookie httpOnly,
 * distinct de la session admin (voir lib/session.ts).
 *
 * Comme lib/session.ts, ce module ne dépend que de `jose` : il est utilisable
 * tel quel dans le proxy pour vérifier le cookie, sans embarquer bcrypt ni le
 * client Postgres.
 *
 * Isolation admin / participant : la clé de signature est dérivée de AUTH_SECRET
 * avec un suffixe propre au rôle. Un jeton admin ne peut donc pas être présenté
 * comme session participant (et inversement) — les signatures ne coïncident pas.
 * Un claim `role` explicite ajoute une seconde barrière (défense en profondeur).
 */

/** Nom du cookie de session participant. Portée limitée à /formation (Path). */
export const PARTICIPANT_SESSION_COOKIE = "marssane_participant_session";

/** Durée de vie : 7 jours (la semaine de formation). */
export const PARTICIPANT_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** Rôle porté par le jeton (barrière contre la confusion admin/participant). */
const PARTICIPANT_ROLE = "participant";

/**
 * Charge utile du jeton. `sub` = id participant ; `email` = affichage ;
 * `sessionId` = promotion rattachée (évite un aller-retour base au rendu).
 */
export type ParticipantSessionPayload = {
  sub: string;
  email: string;
  sessionId: string;
};

/**
 * Clé de signature dérivée de AUTH_SECRET (suffixe `::participant`). Lève si le
 * secret est absent : utilisé côté signature (login/activation), où l'absence
 * doit remonter comme un incident. La vérification, elle, ne lève jamais.
 */
function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET est absent : renseignez-le dans .env.local (voir .env.example).",
    );
  }
  return new TextEncoder().encode(`${secret}::participant`);
}

/** Signe un jeton de session participant valable 7 jours. */
export async function createParticipantSessionToken(
  payload: ParticipantSessionPayload,
): Promise<string> {
  return new SignJWT({
    email: payload.email,
    sessionId: payload.sessionId,
    role: PARTICIPANT_ROLE,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${PARTICIPANT_SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

/**
 * Vérifie un jeton et retourne sa charge utile, ou `null` si le jeton est
 * absent, invalide, expiré, d'un autre rôle, ou si AUTH_SECRET n'est pas
 * configuré. Ne lève jamais.
 */
export async function verifyParticipantSessionToken(
  token: string | undefined,
): Promise<ParticipantSessionPayload | null> {
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== PARTICIPANT_ROLE) return null;
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.sessionId !== "string"
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    };
  } catch {
    return null;
  }
}
