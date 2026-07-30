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
 * Repli neutre quand la session ne peut pas être annoncée telle quelle : mêmes
 * mots que le wording par défaut de la section Réservation.
 */
const MENTION_NEUTRE =
  "Petits groupes · pré-inscription sans engagement · réponse rapide.";

/**
 * Mention affichée sous les CTA (héro, carte finale) pour une session publiée.
 * `null` en amont (aucune session) → chaque composant garde son wording de repli.
 *
 * Une session complète n'est jamais annoncée comme telle : côté public, une
 * pré-inscription est toujours enregistrée (le tri se fait dans l'admin), donc
 * la mention retombe sur le repli neutre.
 */
export function mentionSession(session: ProchaineSession): string {
  if (session.complete) {
    return MENTION_NEUTRE;
  }
  const lieu = session.lieu ?? "lieu à préciser";
  return `Prochaine session le ${formatDateLongue(session.date)} à ${lieu} · ${placesRestantes(
    session.places_restantes,
  )} · sans engagement.`;
}

/**
 * Libellé du champ « Session » (lecture seule) de la modale F2. Toujours
 * « Prochainement » : ni date ni lieu quand une session est publiée, et pas
 * davantage de mention de liste d'attente quand il n'y en a aucune — côté
 * public, le formulaire enregistre toujours une pré-inscription.
 */
export function champSession(): string {
  return "Prochainement";
}
