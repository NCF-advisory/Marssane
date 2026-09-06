/**
 * Aides d'affichage du module CRM et du tableau de bord (ERP · Lot 1).
 * Fonctions pures, utilisables côté serveur comme côté client.
 */

/**
 * Montant en euros « 4 200 € » (fr-FR, sans décimales — les tarifs de
 * formation sont des montants ronds ; les centimes apparaissent s'il y en a).
 */
export function formatEuros(montant: string | number | null): string {
  const n = typeof montant === "string" ? Number(montant) : montant ?? 0;
  if (!Number.isFinite(n)) return "—";
  const decimales = Number.isInteger(n) ? 0 : 2;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(n);
}

/** Date ISO « YYYY-MM-DD » → « 24 septembre 2026 ». Chaîne vide si invalide. */
export function formatDateRelance(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Étiquette courte d'une échéance de relance par rapport à aujourd'hui :
 * « En retard », « Aujourd'hui », ou la date courte (« 28 août »).
 */
export function libelleRelance(iso: string): string {
  const today = new Date();
  const todayIso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  if (iso < todayIso) return "En retard";
  if (iso === todayIso) return "Aujourd'hui";
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(date);
}

/** Nom du mois en cours (« août »), pour le bloc « argent ». */
export function moisEnCours(): string {
  return new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(new Date());
}
