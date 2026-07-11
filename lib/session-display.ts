import type { ProchaineSession } from "./sessions";

/**
 * Formatage d'affichage de la prochaine session (CDC §5.1). Module pur, sans
 * accès base : sûr à importer côté serveur comme côté client. Dates en français
 * via Intl.DateTimeFormat (aucune dépendance externe).
 */

const dateLongueFr = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** « 12 septembre 2026 » à partir d'une date ISO « YYYY-MM-DD ». */
export function formatDateLongue(dateISO: string): string {
  // Heure locale explicite : évite le décalage d'un jour dû à l'UTC.
  return dateLongueFr.format(new Date(`${dateISO}T00:00:00`));
}

/** Accord « 1 place restante » / « N places restantes ». */
function placesRestantes(n: number): string {
  const s = n > 1 ? "s" : "";
  return `${n} place${s} restante${s}`;
}

/**
 * Mention affichée sous les CTA (héro, carte finale) pour une session publiée.
 * `null` en amont (aucune session) → chaque composant garde son wording de repli.
 */
export function mentionSession(session: ProchaineSession): string {
  if (session.complete) {
    return "Session complète — inscrivez-vous en liste d'attente.";
  }
  const lieu = session.lieu ?? "lieu à préciser";
  return `Prochaine session le ${formatDateLongue(session.date)} à ${lieu} · ${placesRestantes(
    session.places_restantes,
  )} · sans engagement.`;
}

/** Libellé du champ « Session » (lecture seule) de la modale F2. */
export function champSession(session: ProchaineSession | null): string {
  if (!session) {
    return "Liste d'attente — vous serez prévenu dès qu'une session est publiée";
  }
  const lieu = session.lieu ?? "lieu à préciser";
  return `${formatDateLongue(session.date)} · ${lieu}`;
}
