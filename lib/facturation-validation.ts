import { z } from "zod";

/**
 * Validation des entrées du module Facturation (ERP · Lot 2). Mêmes
 * conventions que lib/validation.ts : messages en français, champs trimés,
 * aucune valeur journalisée.
 */

/** Régimes de TVA (migration 011). */
export const REGIMES_TVA = [
  "tva_20",
  "exoneration_formation",
  "franchise_base",
] as const;

/** Libellés des régimes de TVA. */
export const REGIME_TVA_LABELS: Record<string, string> = {
  tva_20: "TVA 20 % (régime général)",
  exoneration_formation: "Exonération formation (art. 261-4-4°a du CGI)",
  franchise_base: "Franchise en base (art. 293 B du CGI)",
};

/** Moyens de paiement (migration 010). */
export const MOYENS_PAIEMENT = ["virement", "cheque", "carte", "autre"] as const;

/** Libellés des moyens de paiement. */
export const MOYEN_PAIEMENT_LABELS: Record<string, string> = {
  virement: "Virement",
  cheque: "Chèque",
  carte: "Carte",
  autre: "Autre",
};

const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

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

/** Nombre saisi en texte (virgule acceptée). */
function nombre(message: string) {
  return z.preprocess(
    (value) => {
      if (typeof value !== "string" || value.trim() === "") return undefined;
      const n = Number(value.replace(",", "."));
      return Number.isFinite(n) ? n : value;
    },
    z.number(message),
  );
}

function collecteErreurs(issues: z.ZodError["issues"]): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/* ===== Paramètres de l'émetteur ========================================= */

/** SIREN : 9 chiffres (espaces tolérés à la saisie). */
const SIREN = /^\d{9}$/;

export const emetteurSchema = z.object({
  raison_sociale: optionalTrimmed(
    z.string().max(200, "La raison sociale est trop longue."),
  ),
  forme_juridique: optionalTrimmed(
    z.string().max(100, "La forme juridique est trop longue."),
  ),
  capital: optionalTrimmed(z.string().max(100, "Le capital est trop long.")),
  siren: optionalTrimmed(
    z.preprocess(
      (value) =>
        typeof value === "string" ? value.replace(/\s+/g, "") : value,
      z.string().regex(SIREN, "Le SIREN doit compter 9 chiffres."),
    ),
  ),
  tva_intra: optionalTrimmed(
    z.string().max(20, "Le numéro de TVA est trop long."),
  ),
  adresse: optionalTrimmed(z.string().max(300, "L'adresse est trop longue.")),
  code_postal: optionalTrimmed(
    z.string().max(12, "Le code postal est trop long."),
  ),
  ville: optionalTrimmed(z.string().max(100, "La ville est trop longue.")),
  email: optionalTrimmed(z.email("Adresse email invalide.")),
  telephone: optionalTrimmed(
    z.string().max(30, "Le téléphone est trop long."),
  ),
  regime_tva: optionalTrimmed(z.enum(REGIMES_TVA, { error: "Régime invalide." })),
  taux_tva_defaut: nombre("Taux de TVA invalide.").pipe(
    z
      .number()
      .min(0, "Le taux ne peut pas être négatif.")
      .max(30, "Taux de TVA invraisemblable."),
  ),
  delai_paiement_jours: nombre("Délai invalide.").pipe(
    z
      .number()
      .int("Le délai doit être un entier.")
      .min(0, "Le délai ne peut pas être négatif.")
      .max(120, "Délai de paiement invraisemblable (120 jours max)."),
  ),
  iban: optionalTrimmed(z.string().max(40, "L'IBAN est trop long.")),
  bic: optionalTrimmed(z.string().max(15, "Le BIC est trop long.")),
  mentions_complementaires: optionalTrimmed(
    z.string().max(2000, "Les mentions sont trop longues."),
  ),
});

export type EmetteurData = z.infer<typeof emetteurSchema>;

export type ParseEmetteurResult =
  | { ok: true; data: EmetteurData }
  | { ok: false; fieldErrors: Record<string, string> };

/** Valide les champs du formulaire de paramètres de facturation. */
export function parseEmetteur(formData: FormData): ParseEmetteurResult {
  const result = emetteurSchema.safeParse({
    raison_sociale: asString(formData.get("raison_sociale")),
    forme_juridique: asString(formData.get("forme_juridique")),
    capital: asString(formData.get("capital")),
    siren: asString(formData.get("siren")),
    tva_intra: asString(formData.get("tva_intra")),
    adresse: asString(formData.get("adresse")),
    code_postal: asString(formData.get("code_postal")),
    ville: asString(formData.get("ville")),
    email: asString(formData.get("email")),
    telephone: asString(formData.get("telephone")),
    regime_tva: asString(formData.get("regime_tva")),
    taux_tva_defaut: asString(formData.get("taux_tva_defaut")),
    delai_paiement_jours: asString(formData.get("delai_paiement_jours")),
    iban: asString(formData.get("iban")),
    bic: asString(formData.get("bic")),
    mentions_complementaires: asString(formData.get("mentions_complementaires")),
  });
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, fieldErrors: collecteErreurs(result.error.issues) };
}

/* ===== Devis / facture (document + lignes) ============================== */

/** Une ligne de devis ou de facture. */
export const ligneSchema = z.object({
  designation: z
    .string()
    .trim()
    .min(1, "Chaque ligne doit avoir une désignation.")
    .max(300, "Une désignation est trop longue."),
  quantite: z
    .number()
    .positive("Les quantités doivent être positives.")
    .max(10_000, "Quantité invraisemblable."),
  prix_unitaire_ht: z
    .number()
    .min(-1_000_000, "Prix unitaire invraisemblable.")
    .max(1_000_000, "Prix unitaire invraisemblable."),
  tva_pct: z
    .number()
    .min(0, "Le taux de TVA ne peut pas être négatif.")
    .max(30, "Taux de TVA invraisemblable."),
});

export type LigneData = z.infer<typeof ligneSchema>;

/**
 * Document (devis ou facture) : organisation cliente + lignes. Les lignes
 * arrivent en JSON dans le champ caché `lignes` (éditeur client), et sont
 * validées ici — la validation serveur fait autorité.
 */
export const documentSchema = z.object({
  organisation_id: z.uuid("Sélectionnez un client."),
  objet: optionalTrimmed(z.string().max(300, "L'objet est trop long.")),
  notes: optionalTrimmed(z.string().max(2000, "Les notes sont trop longues.")),
  lignes: z
    .array(ligneSchema)
    .min(1, "Ajoutez au moins une ligne.")
    .max(50, "Trop de lignes (50 maximum)."),
});

export type DocumentData = z.infer<typeof documentSchema>;

export type ParseDocumentResult =
  | { ok: true; data: DocumentData }
  | { ok: false; fieldErrors: Record<string, string> };

/** Valide un `FormData` de devis/facture (lignes en JSON dans `lignes`). */
export function parseDocument(formData: FormData): ParseDocumentResult {
  let lignes: unknown = [];
  try {
    lignes = JSON.parse(asString(formData.get("lignes")) || "[]");
  } catch {
    return {
      ok: false,
      fieldErrors: { lignes: "Lignes illisibles — rechargez la page." },
    };
  }

  const result = documentSchema.safeParse({
    organisation_id: asString(formData.get("organisation_id")),
    objet: asString(formData.get("objet")),
    notes: asString(formData.get("notes")),
    lignes,
  });
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, fieldErrors: collecteErreurs(result.error.issues) };
}

/* ===== Paiement ========================================================= */

export const paiementSchema = z.object({
  montant: nombre("Montant invalide.").pipe(
    z
      .number()
      .positive("Le montant doit être positif.")
      .max(1_000_000, "Montant invraisemblable."),
  ),
  moyen: z.enum(MOYENS_PAIEMENT, { error: "Moyen de paiement invalide." }),
  recu_le: z
    .string()
    .trim()
    .regex(DATE_ISO, "Date de réception invalide."),
  reference: optionalTrimmed(
    z.string().max(200, "La référence est trop longue."),
  ),
});

export type PaiementData = z.infer<typeof paiementSchema>;

export type ParsePaiementResult =
  | { ok: true; data: PaiementData }
  | { ok: false; fieldErrors: Record<string, string> };

/** Valide un `FormData` d'encaissement. */
export function parsePaiement(formData: FormData): ParsePaiementResult {
  const result = paiementSchema.safeParse({
    montant: asString(formData.get("montant")),
    moyen: asString(formData.get("moyen")),
    recu_le: asString(formData.get("recu_le")),
    reference: asString(formData.get("reference")),
  });
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, fieldErrors: collecteErreurs(result.error.issues) };
}
