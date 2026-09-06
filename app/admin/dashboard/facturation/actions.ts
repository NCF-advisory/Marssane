"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import {
  clotureDevis,
  creerAvoir,
  devisEnFacture,
  emettreFacture,
  enregistrerPaiement,
  envoyerDevis,
  insertDevis,
  insertFacture,
  supprimerDevisBrouillon,
  supprimerFactureBrouillon,
  updateDevisBrouillon,
  updateFactureBrouillon,
  upsertEmetteur,
} from "@/lib/facturation";
import {
  parseDocument,
  parseEmetteur,
  parsePaiement,
} from "@/lib/facturation-validation";
import { parseId } from "@/lib/validation";

/**
 * Server actions du module Facturation (ERP · Lot 2, cadrage §4.C).
 *
 * Mêmes conventions que les autres actions admin : session revérifiée en
 * première ligne, entrées validées (lib/facturation-validation), aucune donnée
 * personnelle journalisée, incident base → message générique. Les règles
 * métier (numérotation, avoirs, émission bloquée sans paramètres) vivent dans
 * lib/facturation.
 */

const DASHBOARD = "/admin/dashboard";
const FACTURATION = `${DASHBOARD}/facturation`;

/** Redirige vers la connexion si aucune session admin valide. */
async function requireAdmin(): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");
}

/** Rafraîchit le module et le tableau de bord (bloc « argent »). */
function revalidateFacturation(): void {
  revalidatePath(DASHBOARD);
  revalidatePath(FACTURATION);
}

function revalidateDevis(id: string): void {
  revalidateFacturation();
  revalidatePath(`${FACTURATION}/devis/${id}`);
}

function revalidateFacture(id: string): void {
  revalidateFacturation();
  revalidatePath(`${FACTURATION}/factures/${id}`);
}

/* ===== Paramètres ======================================================= */

/** État du formulaire de paramètres (compatible `useActionState`). */
export type EmetteurFormState = {
  status: "idle" | "saved" | "error";
  formError?: string;
  fieldErrors?: Record<string, string>;
};

/** Enregistre les paramètres de facturation. */
export async function saveEmetteurAction(
  _prevState: EmetteurFormState,
  formData: FormData,
): Promise<EmetteurFormState> {
  await requireAdmin();

  const parsed = parseEmetteur(formData);
  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  try {
    await upsertEmetteur(parsed.data);
  } catch {
    console.error("[admin] échec de l'enregistrement des paramètres (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidateFacturation();
  revalidatePath(`${FACTURATION}/parametres`);
  return { status: "saved" };
}

/* ===== Devis ============================================================ */

/** État du formulaire de document (compatible `useActionState`). */
export type DocumentFormState = {
  status: "idle" | "error";
  formError?: string;
  fieldErrors?: Record<string, string>;
};

/** Crée un devis brouillon, puis redirige vers lui. */
export async function createDevisAction(
  _prevState: DocumentFormState,
  formData: FormData,
): Promise<DocumentFormState> {
  await requireAdmin();

  const parsed = parseDocument(formData);
  if (!parsed.ok) return { status: "error", fieldErrors: parsed.fieldErrors };

  let id: string;
  try {
    id = await insertDevis(parsed.data);
  } catch {
    console.error("[admin] échec de la création de devis (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidateFacturation();
  redirect(`${FACTURATION}/devis/${id}`);
}

/** Met à jour un devis brouillon (id lié via `.bind`). */
export async function updateDevisAction(
  devisId: string,
  _prevState: DocumentFormState,
  formData: FormData,
): Promise<DocumentFormState> {
  await requireAdmin();

  const id = parseId(devisId);
  if (!id) return { status: "error", formError: "Devis introuvable." };

  const parsed = parseDocument(formData);
  if (!parsed.ok) return { status: "error", fieldErrors: parsed.fieldErrors };

  try {
    const ok = await updateDevisBrouillon(id, parsed.data);
    if (!ok) {
      return {
        status: "error",
        formError: "Seul un devis brouillon peut être modifié.",
      };
    }
  } catch {
    console.error("[admin] échec de la modification de devis (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidateDevis(id);
  redirect(`${FACTURATION}/devis/${id}`);
}

/** Envoie un devis : numéro DE attribué, expiration à 30 jours. */
export async function envoyerDevisAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;

  try {
    await envoyerDevis(id);
  } catch {
    console.error("[admin] échec de l'envoi de devis (incident)");
    return;
  }
  revalidateDevis(id);
}

/** Accepte ou refuse un devis envoyé. Champ caché `statut`. */
export async function clotureDevisAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const statut = formData.get("statut");
  if (!id || (statut !== "accepte" && statut !== "refuse")) return;

  try {
    await clotureDevis(id, statut);
  } catch {
    console.error("[admin] échec de la clôture de devis (incident)");
    return;
  }
  revalidateDevis(id);
}

/** Transforme un devis accepté en facture brouillon, puis y redirige. */
export async function devisEnFactureAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;

  let factureId: string | null = null;
  try {
    factureId = await devisEnFacture(id);
  } catch {
    console.error("[admin] échec de la transformation en facture (incident)");
    return;
  }

  revalidateDevis(id);
  if (factureId) redirect(`${FACTURATION}/factures/${factureId}`);
}

/** Supprime un devis brouillon (jamais un devis numéroté). */
export async function supprimerDevisAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;

  try {
    const ok = await supprimerDevisBrouillon(id);
    if (!ok) return;
  } catch {
    console.error("[admin] échec de la suppression de devis (incident)");
    return;
  }

  revalidateFacturation();
  redirect(FACTURATION);
}

/* ===== Factures ========================================================= */

/** Crée une facture brouillon, puis redirige vers elle. */
export async function createFactureAction(
  _prevState: DocumentFormState,
  formData: FormData,
): Promise<DocumentFormState> {
  await requireAdmin();

  const parsed = parseDocument(formData);
  if (!parsed.ok) return { status: "error", fieldErrors: parsed.fieldErrors };

  let id: string;
  try {
    id = await insertFacture(parsed.data);
  } catch {
    console.error("[admin] échec de la création de facture (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidateFacturation();
  redirect(`${FACTURATION}/factures/${id}`);
}

/** Met à jour une facture brouillon (id lié via `.bind`). */
export async function updateFactureAction(
  factureId: string,
  _prevState: DocumentFormState,
  formData: FormData,
): Promise<DocumentFormState> {
  await requireAdmin();

  const id = parseId(factureId);
  if (!id) return { status: "error", formError: "Facture introuvable." };

  const parsed = parseDocument(formData);
  if (!parsed.ok) return { status: "error", fieldErrors: parsed.fieldErrors };

  try {
    const ok = await updateFactureBrouillon(id, parsed.data);
    if (!ok) {
      return {
        status: "error",
        formError: "Seule une facture brouillon peut être modifiée.",
      };
    }
  } catch {
    console.error("[admin] échec de la modification de facture (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidateFacture(id);
  redirect(`${FACTURATION}/factures/${id}`);
}

/**
 * Émet une facture brouillon. Si les paramètres de l'émetteur sont incomplets,
 * revient sur la facture avec `?emission=emetteur_incomplet` (bandeau).
 */
export async function emettreFactureAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;

  let code: string | null = null;
  try {
    const result = await emettreFacture(id);
    if (!result.ok) code = result.code;
  } catch {
    console.error("[admin] échec de l'émission de facture (incident)");
    return;
  }

  revalidateFacture(id);
  if (code === "emetteur_incomplet") {
    redirect(`${FACTURATION}/factures/${id}?emission=emetteur_incomplet`);
  }
}

/** Supprime une facture brouillon (jamais un document numéroté). */
export async function supprimerFactureAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;

  try {
    const ok = await supprimerFactureBrouillon(id);
    if (!ok) return;
  } catch {
    console.error("[admin] échec de la suppression de facture (incident)");
    return;
  }

  revalidateFacturation();
  redirect(FACTURATION);
}

/** État du formulaire d'encaissement (compatible `useActionState`). */
export type PaiementFormState = {
  status: "idle" | "error";
  formError?: string;
  fieldErrors?: Record<string, string>;
};

/** Enregistre un encaissement sur une facture (id lié via `.bind`). */
export async function paiementAction(
  factureId: string,
  _prevState: PaiementFormState,
  formData: FormData,
): Promise<PaiementFormState> {
  await requireAdmin();

  const id = parseId(factureId);
  if (!id) return { status: "error", formError: "Facture introuvable." };

  const parsed = parsePaiement(formData);
  if (!parsed.ok) return { status: "error", fieldErrors: parsed.fieldErrors };

  try {
    const result = await enregistrerPaiement(id, parsed.data);
    if (!result.ok) {
      return {
        status: "error",
        formError:
          result.code === "non_emise"
            ? "Un encaissement ne peut être saisi que sur une facture émise."
            : "Facture introuvable.",
      };
    }
  } catch {
    console.error("[admin] échec de l'encaissement (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidateFacture(id);
  return { status: "idle" };
}

/** Annule une facture émise par un avoir, puis redirige vers l'avoir. */
export async function creerAvoirAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;

  let avoirId: string | null = null;
  try {
    const result = await creerAvoir(id);
    if (result.ok) avoirId = result.avoirId;
  } catch {
    console.error("[admin] échec de la création d'avoir (incident)");
    return;
  }

  revalidateFacture(id);
  if (avoirId) redirect(`${FACTURATION}/factures/${avoirId}`);
}
