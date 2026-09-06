import { z } from "zod";

/**
 * Validation des entrées du module CRM (ERP · Lot 1). Mêmes conventions que
 * lib/validation.ts : messages en français, champs trimés, email normalisé en
 * minuscules, aucune valeur journalisée.
 */

/** Étapes du pipeline (migration 010). */
export const ETAPES = [
  "contact",
  "echange",
  "proposition",
  "gagnee",
  "perdue",
] as const;

/** Types d'activité (migration 010). */
export const ACTIVITE_TYPES = [
  "appel",
  "email",
  "rencontre",
  "note",
  "autre",
] as const;

/** Rôles d'une personne (migration 010). */
export const ROLES = ["prospect", "client", "prescripteur", "partenaire"] as const;

/** Téléphone français — même motif souple que lib/validation.ts. */
const TELEPHONE_FR = /^(?:(?:\+|00)33[\s.\-]?|0)[1-9](?:[\s.\-]?\d{2}){4}$/;

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

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

/* ===== Personne ========================================================= */

/** Schéma d'une fiche personne (création admin). */
export const personneSchema = z.object({
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
  email: optionalTrimmed(
    z.preprocess(
      (value) => (typeof value === "string" ? value.toLowerCase() : value),
      z.email("Adresse email invalide."),
    ),
  ),
  telephone: optionalTrimmed(
    z.string().regex(TELEPHONE_FR, "Numéro de téléphone invalide."),
  ),
  fonction: optionalTrimmed(z.string().max(120, "La fonction est trop longue.")),
  organisation: optionalTrimmed(
    z.string().max(200, "Le nom de l'entreprise est trop long."),
  ),
  roles: z
    .array(z.enum(ROLES, { error: "Rôle invalide." }))
    .min(1, "Sélectionnez au moins un rôle."),
  source: optionalTrimmed(z.string().max(200, "La source est trop longue.")),
  notes: optionalTrimmed(z.string().max(5000, "Les notes sont trop longues.")),
});

export type PersonneData = z.infer<typeof personneSchema>;

export type ParsePersonneResult =
  | { ok: true; data: PersonneData }
  | { ok: false; fieldErrors: Record<string, string> };

/** Valide les champs d'un `FormData` de fiche personne. */
export function parsePersonne(formData: FormData): ParsePersonneResult {
  const raw = {
    prenom: asString(formData.get("prenom")),
    nom: asString(formData.get("nom")),
    email: asString(formData.get("email")),
    telephone: asString(formData.get("telephone")),
    fonction: asString(formData.get("fonction")),
    organisation: asString(formData.get("organisation")),
    roles: formData.getAll("roles").map((v) => asString(v)),
    source: asString(formData.get("source")),
    notes: asString(formData.get("notes")),
  };

  const result = personneSchema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}

/* ===== Opportunité ====================================================== */

/** Schéma d'une opportunité (création / passage d'étape). */
export const opportuniteSchema = z.object({
  titre: optionalTrimmed(z.string().max(200, "Le titre est trop long.")),
  etape: z.enum(ETAPES, { error: "Étape invalide." }),
  montant_estime: z.preprocess(
    (value) => {
      if (typeof value !== "string" || value.trim() === "") return undefined;
      const n = Number(value.replace(",", "."));
      return Number.isFinite(n) ? n : value;
    },
    z
      .number("Montant invalide.")
      .min(0, "Le montant ne peut pas être négatif.")
      .max(10_000_000, "Le montant est trop élevé.")
      .optional(),
  ),
});

export type OpportuniteData = z.infer<typeof opportuniteSchema>;

export type ParseOpportuniteResult =
  | { ok: true; data: OpportuniteData }
  | { ok: false; fieldErrors: Record<string, string> };

/** Valide les champs d'un `FormData` d'opportunité. */
export function parseOpportunite(formData: FormData): ParseOpportuniteResult {
  const result = opportuniteSchema.safeParse({
    titre: asString(formData.get("titre")),
    etape: asString(formData.get("etape")),
    montant_estime: asString(formData.get("montant_estime")),
  });
  if (result.success) return { ok: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}

/** Valide une étape seule (formulaire de passage d'étape). */
export function parseEtape(
  value: FormDataEntryValue | null,
): (typeof ETAPES)[number] | null {
  const parsed = z.enum(ETAPES).safeParse(asString(value));
  return parsed.success ? parsed.data : null;
}

/* ===== Activité / relance =============================================== */

/**
 * Schéma d'une activité : un échange consigné (contenu requis), avec une
 * relance optionnelle à date. Une « relance seule » se saisit comme une note
 * dont le contenu décrit l'action prévue.
 */
export const activiteSchema = z.object({
  type: z.enum(ACTIVITE_TYPES, { error: "Type invalide." }),
  contenu: z
    .string()
    .trim()
    .min(1, "Le contenu est requis.")
    .max(5000, "Le contenu est trop long."),
  relance_at: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() !== "" ? value.trim() : undefined,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date de relance invalide.")
      .optional(),
  ),
});

export type ActiviteData = z.infer<typeof activiteSchema>;

export type ParseActiviteResult =
  | { ok: true; data: ActiviteData }
  | { ok: false; fieldErrors: Record<string, string> };

/** Valide les champs d'un `FormData` d'activité. */
export function parseActivite(formData: FormData): ParseActiviteResult {
  const result = activiteSchema.safeParse({
    type: asString(formData.get("type")),
    contenu: asString(formData.get("contenu")),
    relance_at: asString(formData.get("relance_at")),
  });
  if (result.success) return { ok: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}
