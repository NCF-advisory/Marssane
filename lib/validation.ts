import { z } from "zod";

/** Métiers proposés (CDC §5.2). « Autre » impose de préciser. */
export const METIERS = [
  "Dirigeant de PME/TPE",
  "Entrepreneur",
  "Autre",
] as const;

/**
 * Téléphone français, motif souple : accepte un numéro national (0X…) ou
 * international (+33 / 0033), avec espaces, points ou tirets comme séparateurs
 * optionnels. Objectif : rejeter les saisies manifestement invalides sans
 * frustrer les formats courants.
 */
const TELEPHONE_FR = /^(?:(?:\+|00)33[\s.\-]?|0)[1-9](?:[\s.\-]?\d{2}){4}$/;

/** Schéma de validation d'une pré-inscription (entrées serveur, F2). */
export const inscriptionSchema = z
  .object({
    prenom: z
      .string()
      .trim()
      .min(1, "Le prénom est requis.")
      .max(100, "Le prénom est trop long."),
    nom: z
      .string()
      .trim()
      .min(1, "Le nom est requis.")
      .max(100, "Le nom est trop long."),
    email: z.preprocess(
      (value) =>
        typeof value === "string" ? value.trim().toLowerCase() : value,
      z.email("Adresse email invalide."),
    ),
    telephone: z
      .string()
      .trim()
      .min(1, "Le téléphone est requis.")
      .regex(TELEPHONE_FR, "Numéro de téléphone invalide."),
    metier: z.enum(METIERS, { error: "Sélectionnez un métier." }),
    metier_autre: z
      .string()
      .trim()
      .max(100, "La précision est trop longue.")
      .optional()
      .default(""),
    entreprise: z
      .string()
      .trim()
      .max(200, "Le nom de l'entreprise est trop long.")
      .optional()
      .default(""),
    consentement: z.literal("on", { error: "Le consentement est requis." }),
  })
  .superRefine((data, ctx) => {
    if (data.metier === "Autre" && data.metier_autre.length < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["metier_autre"],
        message: "Veuillez préciser votre métier.",
      });
    }
  });

export type InscriptionData = z.infer<typeof inscriptionSchema>;

export type ParseInscriptionResult =
  | { ok: true; data: InscriptionData }
  | { ok: false; fieldErrors: Record<string, string> };

/**
 * Valide les champs d'un `FormData` de pré-inscription. Retourne les données
 * normalisées (email en minuscules, champs trimés) ou une erreur par champ
 * (premier message rencontré, en français). Ne journalise aucune valeur.
 */
export function parseInscription(formData: FormData): ParseInscriptionResult {
  const raw = {
    prenom: asString(formData.get("prenom")),
    nom: asString(formData.get("nom")),
    email: asString(formData.get("email")),
    telephone: asString(formData.get("telephone")),
    metier: asString(formData.get("metier")),
    metier_autre: asString(formData.get("metier_autre")),
    entreprise: asString(formData.get("entreprise")),
    consentement: asString(formData.get("consentement")),
  };

  const result = inscriptionSchema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

/* ===== Contact « implémentation » (F4 · CDC §5.4) ===================== */

/** Schéma de validation d'une demande de contact (entrées serveur, F4). */
export const contactSchema = z.object({
  prenom: z
    .string()
    .trim()
    .min(1, "Le prénom est requis.")
    .max(100, "Le prénom est trop long."),
  nom: z
    .string()
    .trim()
    .min(1, "Le nom est requis.")
    .max(100, "Le nom est trop long."),
  email: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
    z.email("Adresse email invalide."),
  ),
  // Optionnel, mais s'il est rempli il doit respecter le motif FR (comme F2).
  telephone: optionalTrimmed(
    z.string().regex(TELEPHONE_FR, "Numéro de téléphone invalide."),
  ),
  entreprise: z
    .string()
    .trim()
    .min(1, "L'entreprise est requise.")
    .max(200, "Le nom de l'entreprise est trop long."),
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit faire au moins 10 caractères.")
    .max(5000, "Votre message est trop long (5000 caractères maximum)."),
  consentement: z.literal("on", { error: "Le consentement est requis." }),
});

export type ContactData = z.infer<typeof contactSchema>;

export type ParseContactResult =
  | { ok: true; data: ContactData }
  | { ok: false; fieldErrors: Record<string, string> };

/**
 * Valide les champs d'un `FormData` de contact. Retourne les données
 * normalisées (email en minuscules, champs trimés) ou une erreur par champ
 * (premier message rencontré, en français). Ne journalise aucune valeur.
 */
export function parseContact(formData: FormData): ParseContactResult {
  const raw = {
    prenom: asString(formData.get("prenom")),
    nom: asString(formData.get("nom")),
    email: asString(formData.get("email")),
    telephone: asString(formData.get("telephone")),
    entreprise: asString(formData.get("entreprise")),
    message: asString(formData.get("message")),
    consentement: asString(formData.get("consentement")),
  };

  const result = contactSchema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}

/* ===== Administration (F3 · CDC §5.3) ================================== */

/** Statuts possibles d'une session. */
export const SESSION_STATUTS = [
  "brouillon",
  "publiee",
  "complete",
  "terminee",
] as const;

/** Statuts possibles d'une inscription. */
export const INSCRIPTION_STATUTS = ["confirme", "attente", "annule"] as const;

/** Heure au format « HH:MM » (input natif `type=time`). */
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Une chaîne vide/espaces devient `undefined` (champ optionnel). */
function optionalTrimmed<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() !== ""
        ? value.trim()
        : undefined,
    schema.optional(),
  );
}

/** Schéma de validation d'une session (création / édition admin). */
export const sessionSchema = z
  .object({
    date: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "La date est requise."),
    heure_debut: optionalTrimmed(
      z.string().regex(HEURE, "Heure de début invalide."),
    ),
    heure_fin: optionalTrimmed(
      z.string().regex(HEURE, "Heure de fin invalide."),
    ),
    lieu: optionalTrimmed(z.string().max(200, "Le lieu est trop long.")),
    capacite: z.preprocess(
      (value) => {
        if (typeof value === "string" && value.trim() === "") return undefined;
        const n = Number(value);
        return Number.isFinite(n) ? n : value;
      },
      z
        .number("La capacité est requise.")
        .int("La capacité doit être un entier.")
        .min(1, "La capacité doit être d'au moins 1.")
        .max(1000, "La capacité est trop élevée."),
    ),
    statut: z.enum(SESSION_STATUTS, { error: "Statut invalide." }),
  })
  .superRefine((data, ctx) => {
    if (data.heure_debut && data.heure_fin && data.heure_fin <= data.heure_debut) {
      ctx.addIssue({
        code: "custom",
        path: ["heure_fin"],
        message: "L'heure de fin doit suivre l'heure de début.",
      });
    }
  });

export type SessionData = z.infer<typeof sessionSchema>;

export type ParseSessionResult =
  | { ok: true; data: SessionData }
  | { ok: false; fieldErrors: Record<string, string> };

/** Valide les champs d'un `FormData` de session. */
export function parseSession(formData: FormData): ParseSessionResult {
  const raw = {
    date: asString(formData.get("date")),
    heure_debut: asString(formData.get("heure_debut")),
    heure_fin: asString(formData.get("heure_fin")),
    lieu: asString(formData.get("lieu")),
    capacite: asString(formData.get("capacite")),
    statut: asString(formData.get("statut")),
  };

  const result = sessionSchema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}

/** Valide un identifiant (uuid) transmis par un formulaire d'action. */
export function parseId(value: FormDataEntryValue | null): string | null {
  const parsed = z.uuid().safeParse(asString(value));
  return parsed.success ? parsed.data : null;
}

/* ===== Chat de promotion (phase 2) ==================================== */

/** Longueur maximale du contenu d'un message (aligné sur la colonne texte). */
export const CHAT_CONTENU_MAX = 4000;

/**
 * Schéma d'un message du chat (participant ou formateur). `contenu` requis
 * (1..4000). `claude_quote` et `attachment_name` optionnels (vides → undefined,
 * mappés en NULL en base). Le nom de capture est purement affiché en v1 (pas
 * d'upload de fichier).
 */
export const chatMessageSchema = z.object({
  contenu: z
    .string()
    .trim()
    .min(1, "Votre message est vide.")
    .max(CHAT_CONTENU_MAX, "Votre message est trop long (4000 caractères maximum)."),
  claude_quote: optionalTrimmed(
    z
      .string()
      .max(8000, "La réponse de Claude est trop longue (8000 caractères maximum)."),
  ),
  attachment_name: optionalTrimmed(
    z.string().max(200, "Le nom de la capture est trop long."),
  ),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

export type ParseChatMessageResult =
  | { ok: true; data: ChatMessageInput }
  | { ok: false; error: string };

/**
 * Valide les champs d'un `FormData` de message. Retourne les données
 * normalisées ou le premier message d'erreur (en français). Ne journalise
 * aucune valeur.
 */
export function parseChatMessage(formData: FormData): ParseChatMessageResult {
  const result = chatMessageSchema.safeParse({
    contenu: asString(formData.get("contenu")),
    claude_quote: asString(formData.get("claude_quote")),
    attachment_name: asString(formData.get("attachment_name")),
  });
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    error: result.error.issues[0]?.message ?? "Message invalide.",
  };
}

/** Valide un statut d'inscription transmis par un formulaire d'action. */
export function parseInscriptionStatut(
  value: FormDataEntryValue | null,
): (typeof INSCRIPTION_STATUTS)[number] | null {
  const parsed = z.enum(INSCRIPTION_STATUTS).safeParse(asString(value));
  return parsed.success ? parsed.data : null;
}

/** Valide l'état « traité » d'une demande de contact (formulaire de bascule). */
export function parseTraite(value: FormDataEntryValue | null): boolean {
  return asString(value) === "true";
}
