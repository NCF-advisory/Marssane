"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import {
  convertirContactEnPersonne,
  insertActivite,
  insertOpportunite,
  insertPersonne,
  marquerRelanceFaite,
  updateOpportuniteEtape,
} from "@/lib/crm";
import {
  parseActivite,
  parseEtape,
  parseOpportunite,
  parsePersonne,
} from "@/lib/crm-validation";
import { parseId } from "@/lib/validation";

/**
 * Server actions du module CRM (ERP · Lot 1, cadrage §4.B).
 *
 * Mêmes conventions que app/admin/dashboard/actions.ts : chaque action
 * revérifie la session admin en première ligne (défense en profondeur), les
 * entrées sont validées (lib/crm-validation), aucune donnée personnelle n'est
 * journalisée, un incident base devient un message générique.
 */

const DASHBOARD = "/admin/dashboard";
const CRM = `${DASHBOARD}/crm`;

/** Redirige vers la connexion si aucune session admin valide. */
async function requireAdmin(): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");
}

/** Rafraîchit le CRM et le tableau de bord (blocs pipeline / relances). */
function revalidateCrm(): void {
  revalidatePath(DASHBOARD);
  revalidatePath(CRM);
}

/** Rafraîchit la fiche d'une personne (et les vues agrégées). */
function revalidatePersonne(personneId: string): void {
  revalidateCrm();
  revalidatePath(`${CRM}/personnes/${personneId}`);
}

/* ===== Personne ========================================================= */

/** État renvoyé au formulaire de fiche personne (compatible `useActionState`). */
export type PersonneFormState = {
  status: "idle" | "error";
  formError?: string;
  fieldErrors?: Record<string, string>;
};

/** Crée une fiche personne, puis redirige vers elle. */
export async function createPersonneAction(
  _prevState: PersonneFormState,
  formData: FormData,
): Promise<PersonneFormState> {
  await requireAdmin();

  const parsed = parsePersonne(formData);
  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  let personneId: string;
  try {
    personneId = await insertPersonne(parsed.data);
  } catch {
    console.error("[admin] échec de la création de fiche personne (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidateCrm();
  redirect(`${CRM}/personnes/${personneId}`);
}

/* ===== Opportunité ====================================================== */

/** État renvoyé au formulaire d'opportunité (compatible `useActionState`). */
export type OpportuniteFormState = {
  status: "idle" | "error";
  formError?: string;
  fieldErrors?: Record<string, string>;
};

/** Crée une opportunité pour une personne (id lié via `.bind`). */
export async function createOpportuniteAction(
  personneId: string,
  _prevState: OpportuniteFormState,
  formData: FormData,
): Promise<OpportuniteFormState> {
  await requireAdmin();

  const id = parseId(personneId);
  if (!id) return { status: "error", formError: "Personne introuvable." };

  const parsed = parseOpportunite(formData);
  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  try {
    const ok = await insertOpportunite(id, parsed.data);
    if (!ok) return { status: "error", formError: "Personne introuvable." };
  } catch {
    console.error("[admin] échec de la création d'opportunité (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidatePersonne(id);
  return { status: "idle" };
}

/**
 * Change l'étape d'une opportunité (select auto-soumis ou formulaire simple).
 * Champs cachés : `id` (opportunité), `personne_id` (revalidation de la fiche),
 * `etape` (nouvelle étape).
 */
export async function updateOpportuniteEtapeAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = parseId(formData.get("id"));
  const personneId = parseId(formData.get("personne_id"));
  const etape = parseEtape(formData.get("etape"));
  if (!id || !etape) return;

  try {
    await updateOpportuniteEtape(id, etape);
  } catch {
    console.error("[admin] échec du changement d'étape (incident)");
    return;
  }

  if (personneId) revalidatePersonne(personneId);
  else revalidateCrm();
}

/* ===== Activité / relance =============================================== */

/** État renvoyé au formulaire d'activité (compatible `useActionState`). */
export type ActiviteFormState = {
  status: "idle" | "error";
  formError?: string;
  fieldErrors?: Record<string, string>;
};

/** Consigne une activité (et sa relance éventuelle) pour une personne. */
export async function createActiviteAction(
  personneId: string,
  _prevState: ActiviteFormState,
  formData: FormData,
): Promise<ActiviteFormState> {
  await requireAdmin();

  const id = parseId(personneId);
  if (!id) return { status: "error", formError: "Personne introuvable." };

  const parsed = parseActivite(formData);
  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  try {
    const ok = await insertActivite(id, parsed.data);
    if (!ok) return { status: "error", formError: "Personne introuvable." };
  } catch {
    console.error("[admin] échec de l'ajout d'activité (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidatePersonne(id);
  return { status: "idle" };
}

/**
 * Marque une relance comme faite. Champs cachés : `id` (activité) et,
 * optionnellement, `personne_id` (revalidation de la fiche).
 */
export async function relanceFaiteAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = parseId(formData.get("id"));
  if (!id) return;
  const personneId = parseId(formData.get("personne_id"));

  try {
    await marquerRelanceFaite(id);
  } catch {
    console.error("[admin] échec du marquage de relance (incident)");
    return;
  }

  if (personneId) revalidatePersonne(personneId);
  else revalidateCrm();
}

/* ===== Conversion d'une demande de contact ============================== */

/**
 * Convertit une demande de contact du site en fiche CRM (cadrage §4.B), puis
 * redirige vers la fiche. Champ caché : `id` (demande de contact).
 */
export async function convertirContactAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = parseId(formData.get("id"));
  if (!id) return;

  let personneId: string | null = null;
  try {
    const result = await convertirContactEnPersonne(id);
    if (result.ok) personneId = result.personneId;
  } catch {
    console.error("[admin] échec de la conversion de contact (incident)");
    return;
  }

  revalidateCrm();
  if (personneId) redirect(`${CRM}/personnes/${personneId}`);
}
