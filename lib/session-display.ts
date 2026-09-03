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
 * Même formatage, mais « À définir » quand la date n'est pas arrêtée (NULL en
 * base, migration 008). Réservé aux écrans d'administration : côté public, la
 * session en base n'est jamais annoncée par sa date.
 */
export function formatDateLongueOuADefinir(dateISO: string | null): string {
  return dateISO ? formatDateLongue(dateISO) : "À définir";
}
