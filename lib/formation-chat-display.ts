/**
 * Types et helpers d'affichage du chat de promotion (phase 2). Module pur, sans
 * accès base ni API serveur : importable côté serveur (requêtes, admin) comme
 * côté client (composant de chat + messages arrivés en SSE). Le même
 * `ChatMessage` circule partout (rendu initial, retour d'action, événement SSE),
 * afin que la déduplication par `id` soit fiable.
 */

/** Un message du fil, normalisé (camelCase) pour l'UI et le transport SSE. */
export type ChatMessage = {
  id: string;
  /** `null` pour un message du formateur (auteurAdmin) ou un auteur effacé. */
  participantId: string | null;
  /** `true` = message du formateur/administrateur (mis en évidence). */
  auteurAdmin: boolean;
  /** Prénom/nom de l'auteur (via l'inscription) ; `null` si formateur. */
  prenom: string | null;
  nom: string | null;
  contenu: string;
  /** Réponse de Claude citée par le participant, ou `null`. */
  claudeQuote: string | null;
  /** Nom de la capture jointe (v1 : nom seul, pas de fichier), ou `null`. */
  attachmentName: string | null;
  /** Épinglé en tête de fil (FAQ du mercredi). */
  epingle: boolean;
  /** Horodatage ISO 8601 en UTC (suffixe `Z`), aussi utilisé comme curseur SSE. */
  createdIso: string;
};

/** Libellé affiché pour le formateur (aucune identité nominative en base). */
export const FORMATEUR_LABEL = "Formateur";

/**
 * Initiales de l'avatar : première lettre du prénom + première lettre du nom.
 * Formateur → « F ». Repli « ? » si aucune donnée (auteur effacé).
 */
export function chatInitials(message: ChatMessage): string {
  if (message.auteurAdmin) return "F";
  const p = message.prenom?.trim()?.[0] ?? "";
  const n = message.nom?.trim()?.[0] ?? "";
  const initials = `${p}${n}`.toUpperCase();
  return initials || "?";
}

/**
 * Nom affiché de l'auteur : « Vous » pour le participant courant, « Formateur »
 * pour l'admin, sinon « Prénom Nom ». Repli « Participant » si l'auteur a été
 * effacé (participant_id passé à NULL).
 */
export function chatAuthorName(
  message: ChatMessage,
  currentParticipantId: string,
): string {
  if (message.auteurAdmin) return FORMATEUR_LABEL;
  if (message.participantId && message.participantId === currentParticipantId) {
    return "Vous";
  }
  const full = `${message.prenom ?? ""} ${message.nom ?? ""}`.trim();
  return full || "Participant";
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
});

const heureFmt = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

/** « lundi 13 juillet, 16 h 05 » (fuseau Europe/Paris) à partir d'un ISO UTC. */
export function formatChatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const date = dateFmt.format(d);
  const heure = heureFmt.format(d).replace(":", " h ");
  return `${date}, ${heure}`;
}

/**
 * Insère un message dans une liste triée (created_at puis id croissants) en
 * évitant les doublons par `id`. Retourne la même référence si le message est
 * déjà présent (permet un court-circuit côté React).
 */
export function mergeMessage(
  list: ChatMessage[],
  message: ChatMessage,
): ChatMessage[] {
  if (list.some((m) => m.id === message.id)) return list;
  const next = [...list, message];
  next.sort((a, b) => {
    if (a.createdIso < b.createdIso) return -1;
    if (a.createdIso > b.createdIso) return 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  return next;
}

/** Curseur SSE encodé « <iso>~<id> » à partir du dernier message connu. */
export function cursorFor(message: ChatMessage | undefined): string {
  return message ? `${message.createdIso}~${message.id}` : "";
}
