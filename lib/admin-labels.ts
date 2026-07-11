/**
 * Libellés français des statuts (admin). Module pur, sans React ni accès base :
 * partagé par les badges d'affichage et l'export CSV.
 */

export const SESSION_STATUT_LABELS: Record<string, string> = {
  brouillon: "Brouillon",
  publiee: "Publiée",
  complete: "Complète",
  terminee: "Terminée",
};

export const INSCRIPTION_STATUT_LABELS: Record<string, string> = {
  confirme: "Confirmé",
  attente: "Liste d'attente",
  annule: "Annulé",
};

/** Libellé d'un statut, avec repli sur la valeur brute si inconnue. */
export function statutLabel(
  labels: Record<string, string>,
  value: string,
): string {
  return labels[value] ?? value;
}
