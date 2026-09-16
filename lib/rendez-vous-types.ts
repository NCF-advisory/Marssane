/** Contrat partagé par la fenêtre et sa source de disponibilités. */
export type RendezVousCreneau = {
  /** Début du rendez-vous au format ISO UTC ; identifiant validé côté serveur. */
  debut: string;
  fin: string;
};

export type RendezVousDisponibilites = {
  creneaux: RendezVousCreneau[];
  message?: string;
};

export type RendezVousCoordonnees = { nom: string; email: string };

export type RendezVousResultat =
  | { ok: true; creneau: RendezVousCreneau }
  | { ok: false; message: string; indisponible?: boolean };

export const RENDEZ_VOUS_DIALOG_ID = "rendez-vous-dialog";
export const RENDEZ_VOUS_OPEN_EVENT = "marssane:rendez-vous-open";
export const RENDEZ_VOUS_TIMEZONE = "Europe/Paris";

// Les formateurs sont réutilisés : leur construction coûte plus que le formatage.
const formatJour = new Intl.DateTimeFormat("fr-CA", {
  timeZone: RENDEZ_VOUS_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit",
});
const formatHeure = new Intl.DateTimeFormat("fr-FR", {
  timeZone: RENDEZ_VOUS_TIMEZONE, hour: "2-digit", minute: "2-digit",
});
const formatDate = new Intl.DateTimeFormat("fr-FR", {
  timeZone: RENDEZ_VOUS_TIMEZONE, weekday: "long", day: "numeric", month: "long", year: "numeric",
});

export function rendezVousJour(iso: string) { return formatJour.format(new Date(iso)); }
export function rendezVousHeure(iso: string) { return formatHeure.format(new Date(iso)); }
export function rendezVousDate(iso: string) { return formatDate.format(new Date(iso)); }
