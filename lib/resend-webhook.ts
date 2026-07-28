import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Vérification de la signature des webhooks Resend (format Svix).
 *
 * Module pur, sans accès réseau ni base : la route `/api/emails/webhook` lui
 * passe les en-têtes et le corps BRUT (le HMAC porte sur les octets reçus, un
 * `JSON.parse` puis `stringify` invaliderait la signature).
 *
 * Algorithme (Svix) : contenu signé = `<svix-id>.<svix-timestamp>.<corps>`,
 * HMAC-SHA256 dont la clé est le base64 décodé de la partie qui suit `whsec_`,
 * comparé en base64 à chacune des signatures de l'en-tête `svix-signature`
 * (« v1,<sig> », plusieurs valeurs séparées par des espaces). La dépendance
 * `svix` n'est pas nécessaire : node:crypto suffit.
 */

/** Tolérance d'horodatage : au-delà, la requête est refusée (anti-rejeu). */
export const TOLERANCE_MS = 5 * 60 * 1000;

/** Décode la clé du secret `whsec_<base64>` (ou un base64 nu). */
function cleSecrete(secret: string): Buffer {
  const base64 = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  return Buffer.from(base64, "base64");
}

/** Comparaison à temps constant de deux signatures base64. */
function memeSignature(attendue: string, recue: string): boolean {
  const a = Buffer.from(attendue, "base64");
  const b = Buffer.from(recue, "base64");
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * `true` si la requête est authentique ET récente. Refuse toute entrée
 * manquante, un horodatage hors tolérance (rejeu) ou une signature qui ne
 * correspond pas. Ne lève pas : une entrée malformée retourne `false`.
 */
export function verifierSignatureResend(input: {
  secret: string;
  svixId: string | null;
  svixTimestamp: string | null;
  svixSignature: string | null;
  /** Corps brut de la requête (`await request.text()`). */
  body: string;
  /** Instant de référence en millisecondes (injectable pour les tests). */
  maintenant?: number;
}): boolean {
  const { secret, svixId, svixTimestamp, svixSignature, body } = input;
  if (!secret || !svixId || !svixTimestamp || !svixSignature) return false;

  // Horodatage Svix : secondes Unix.
  const timestampMs = Number(svixTimestamp) * 1000;
  if (!Number.isFinite(timestampMs)) return false;
  const maintenant = input.maintenant ?? Date.now();
  if (Math.abs(maintenant - timestampMs) > TOLERANCE_MS) return false;

  let attendue: string;
  try {
    attendue = createHmac("sha256", cleSecrete(secret))
      .update(`${svixId}.${svixTimestamp}.${body}`)
      .digest("base64");
  } catch {
    return false;
  }

  return svixSignature
    .split(" ")
    .filter((part) => part.startsWith("v1,"))
    .some((part) => memeSignature(attendue, part.slice(3)));
}
