"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  archiveSession,
  deleteInscription,
  insertSession,
  updateContactTraite,
  updateInscriptionStatut,
  updateSession,
} from "@/lib/admin-queries";
import { getCurrentAdmin } from "@/lib/admin-auth";
import {
  parseId,
  parseInscriptionStatut,
  parseSession,
  parseTraite,
} from "@/lib/validation";

/**
 * Server actions du tableau de bord admin (F3 · CDC §5.3).
 *
 * Défense en profondeur : chaque action revérifie la session admin en première
 * ligne (`requireAdmin`) — on ne se repose pas sur le seul proxy. Toutes les
 * entrées sont validées avec zod (voir lib/validation). Aucune donnée
 * personnelle n'est journalisée.
 *
 * Revalidation : les mutations de session rafraîchissent la landing (« / »,
 * qui reflète la session publiée) et le tableau de bord.
 */

const DASHBOARD = "/admin/dashboard";

/** Redirige vers la connexion si aucune session admin valide. */
async function requireAdmin(): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");
}

/** Rafraîchit la landing (session publiée) et le tableau de bord. */
function revalidateSessions(): void {
  revalidatePath("/");
  revalidatePath(DASHBOARD);
}

/* ===== Sessions ======================================================== */

/** État renvoyé au formulaire de session (compatible `useActionState`). */
export type SessionFormState = {
  status: "idle" | "error";
  formError?: string;
  fieldErrors?: Record<string, string>;
};

/** Crée une session, puis redirige vers le tableau de bord. */
export async function createSessionAction(
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  await requireAdmin();

  const parsed = parseSession(formData);
  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  try {
    await insertSession(parsed.data);
  } catch {
    console.error("[admin] échec de la création de session (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidateSessions();
  redirect(DASHBOARD);
}

/** Met à jour une session (id lié via `.bind`), puis revient au tableau de bord. */
export async function updateSessionAction(
  id: string,
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  await requireAdmin();

  const parsed = parseSession(formData);
  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  try {
    const ok = await updateSession(id, parsed.data);
    if (!ok) return { status: "error", formError: "Session introuvable." };
  } catch {
    console.error("[admin] échec de la modification de session (incident)");
    return {
      status: "error",
      formError: "Enregistrement impossible : base indisponible.",
    };
  }

  revalidateSessions();
  redirect(DASHBOARD);
}

/** Archive une session (statut → terminée). Action de formulaire simple. */
export async function archiveSessionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;

  try {
    await archiveSession(id);
    revalidateSessions();
  } catch {
    console.error("[admin] échec de l'archivage de session (incident)");
  }
}

/* ===== Inscriptions ==================================================== */

/** Change le statut d'une inscription (confirmé / attente / annulé). */
export async function updateInscriptionStatutAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const statut = parseInscriptionStatut(formData.get("statut"));
  if (!id || !statut) return;

  try {
    await updateInscriptionStatut(id, statut);
    revalidateSessions();
  } catch {
    console.error("[admin] échec du changement de statut (incident)");
  }
}

/** Supprime définitivement une inscription (droit à l'effacement RGPD). */
export async function deleteInscriptionAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;

  try {
    await deleteInscription(id);
    revalidateSessions();
  } catch {
    console.error("[admin] échec de la suppression d'inscription (incident)");
  }
}

/* ===== Contacts ======================================================== */

/** Bascule l'état « traité » d'une demande de contact (vue contact §5.3). */
export async function updateContactTraiteAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;
  const traite = parseTraite(formData.get("traite"));

  try {
    await updateContactTraite(id, traite);
    revalidatePath(DASHBOARD);
  } catch {
    console.error("[admin] échec du changement d'état de contact (incident)");
  }
}
