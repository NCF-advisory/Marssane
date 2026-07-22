"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  archiveSession,
  deleteInscription,
  getSessionById,
  insertSession,
  updateContactTraite,
  updateInscriptionStatut,
  updateSession,
} from "@/lib/admin-queries";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { sendInvitationEmail } from "@/lib/emails";
import { insertAdminMessage, setMessagePinned } from "@/lib/formation-chat";
import {
  createParticipantInvite,
  generateInviteToken,
  INVITE_EXPIRY_MS,
  listConfirmedForInvite,
  refreshParticipantInvite,
} from "@/lib/participants";
import { fermerQcm, ouvrirQcm } from "@/lib/qcm";
import {
  parseChatMessage,
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

/* ===== Espace formation (invitations) ================================= */

/** URL de base pour les liens absolus (même repli que le sitemap). */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Construit le lien personnel d'activation pour un token en clair. */
function activationUrl(token: string): string {
  return `${SITE_URL}/formation/activation?token=${encodeURIComponent(token)}`;
}

/** Rafraîchit la page de détail d'une session (état des invitations). */
function revalidateSessionDetail(id: string): void {
  revalidatePath(`${DASHBOARD}/sessions/${id}`);
}

/**
 * Lance la formation d'une session : pour chaque inscrit confirmé sans
 * participant, crée le compte, génère un token d'invitation (seule l'empreinte
 * est stockée) et envoie l'e-mail d'activation. Redirige vers le détail de la
 * session avec le décompte (invités / déjà invités / échecs) en query, affiché
 * en bandeau. Action de formulaire simple (session_id en champ caché).
 */
export async function lancerFormationAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const sessionId = parseId(formData.get("session_id"));
  if (!sessionId) return;

  let invited = 0;
  let failed = 0;
  let dejaInvites = 0;
  try {
    const session = await getSessionById(sessionId);
    const rows = await listConfirmedForInvite(sessionId);
    const pending = rows.filter((r) => !r.participant_id);
    dejaInvites = rows.length - pending.length;

    const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MS);
    for (const row of pending) {
      const { token, tokenHash } = generateInviteToken();
      const created = await createParticipantInvite({
        inscriptionId: row.inscription_id,
        sessionId,
        email: row.email,
        tokenHash,
        expiresAt,
      });
      // `null` = un participant a été créé entre-temps (course) : on l'ignore.
      if (!created) {
        dejaInvites += 1;
        continue;
      }
      const sent = await sendInvitationEmail({
        email: row.email,
        prenom: row.prenom,
        activationUrl: activationUrl(token),
        session: session ? { date: session.date, lieu: session.lieu } : null,
      });
      if (sent) invited += 1;
      else failed += 1;
    }
  } catch {
    console.error("[admin] échec du lancement de la formation (incident)");
    redirect(`${DASHBOARD}/sessions/${sessionId}?formation=erreur#formation`);
  }

  revalidateSessionDetail(sessionId);
  redirect(
    `${DASHBOARD}/sessions/${sessionId}?formation=ok` +
      `&invites=${invited}&deja=${dejaInvites}&echecs=${failed}#formation`,
  );
}

/**
 * Renvoie l'invitation d'un participant non encore activé : régénère le token
 * et renvoie l'e-mail. Action de formulaire simple (feedback = invited_at
 * rafraîchi dans le tableau).
 */
export async function renvoyerInvitationAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const sessionId = parseId(formData.get("session_id"));
  const participantId = parseId(formData.get("participant_id"));
  if (!sessionId || !participantId) return;

  try {
    const session = await getSessionById(sessionId);
    const { token, tokenHash } = generateInviteToken();
    const target = await refreshParticipantInvite({
      participantId,
      tokenHash,
      expiresAt: new Date(Date.now() + INVITE_EXPIRY_MS),
    });
    if (target) {
      await sendInvitationEmail({
        email: target.email,
        prenom: target.prenom,
        activationUrl: activationUrl(token),
        session: session ? { date: session.date, lieu: session.lieu } : null,
      });
    }
    revalidateSessionDetail(sessionId);
  } catch {
    console.error("[admin] échec du renvoi d'invitation (incident)");
  }
}

/* ===== Chat de promotion (réponses du formateur) ====================== */

/**
 * Publie une réponse du formateur dans le chat d'une promotion, éventuellement
 * épinglée en tête (FAQ du mercredi). Action de formulaire simple : le fil admin
 * n'a pas besoin de SSE, un rechargement suffit (revalidation du détail).
 */
export async function postAdminMessageAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const sessionId = parseId(formData.get("session_id"));
  if (!sessionId) return;

  const parsed = parseChatMessage(formData);
  if (!parsed.ok) return;
  const epingle = formData.get("epingle") === "on";

  try {
    await insertAdminMessage({
      sessionId,
      contenu: parsed.data.contenu,
      epingle,
    });
    revalidateSessionDetail(sessionId);
  } catch {
    console.error("[admin] échec de la publication d'un message (incident)");
  }
}

/**
 * Épingle ou dépingle un message du formateur (restreint côté base aux messages
 * `auteur_admin` de la session). L'état cible est passé en champ caché.
 */
export async function togglePinMessageAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const sessionId = parseId(formData.get("session_id"));
  const messageId = parseId(formData.get("message_id"));
  if (!sessionId || !messageId) return;
  const epingle = formData.get("epingle") === "true";

  try {
    await setMessagePinned({ messageId, sessionId, epingle });
    revalidateSessionDetail(sessionId);
  } catch {
    console.error("[admin] échec de l'épinglage d'un message (incident)");
  }
}

/* ===== QCM (ouverture / fermeture) ==================================== */

/**
 * Ouvre (ou rouvre) un QCM pour une promotion : les participants de la session
 * peuvent alors le passer depuis leur espace. Action de formulaire simple
 * (session_id + questionnaire_id en champs cachés).
 */
export async function ouvrirQcmAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const sessionId = parseId(formData.get("session_id"));
  const questionnaireId = parseId(formData.get("questionnaire_id"));
  if (!sessionId || !questionnaireId) return;

  try {
    await ouvrirQcm(sessionId, questionnaireId);
    revalidateSessionDetail(sessionId);
  } catch {
    console.error("[admin] échec de l'ouverture d'un QCM (incident)");
  }
}

/** Ferme un QCM ouvert d'une promotion (les participants ne peuvent plus répondre). */
export async function fermerQcmAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const sessionId = parseId(formData.get("session_id"));
  const questionnaireId = parseId(formData.get("questionnaire_id"));
  if (!sessionId || !questionnaireId) return;

  try {
    await fermerQcm(sessionId, questionnaireId);
    revalidateSessionDetail(sessionId);
  } catch {
    console.error("[admin] échec de la fermeture d'un QCM (incident)");
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
