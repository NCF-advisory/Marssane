import { z } from "zod";

/** Métiers proposés (CDC §5.2). « Autre » impose de préciser. */
export const METIERS = [
  "Dirigeant de PME",
  "Avocat",
  "Notaire",
  "Expert-comptable",
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
