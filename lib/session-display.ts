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

/**
 * Libellé du champ « Session » (lecture seule) de la modale F2. Toujours
 * « Prochainement » : ni date ni lieu quand une session est publiée, et pas
 * davantage de mention de liste d'attente quand il n'y en a aucune — côté
 * public, le formulaire enregistre toujours une pré-inscription.
 */
export function champSession(): string {
  return "Prochainement";
}
