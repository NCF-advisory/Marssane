/** Libellés partagés : module pur, sans dépendance à la base de données. */

/** Étapes du pipeline (migration 010, check `opportunites.etape`). */
export const ETAPE_LABELS: Record<string, string> = {
  contact: "Contact",
  echange: "Échange",
  proposition: "Proposition",
  gagnee: "Gagnée",
  perdue: "Perdue",
};

/** Types d'activité (migration 010, check `activites.type`). */
export const ACTIVITE_TYPE_LABELS: Record<string, string> = {
  appel: "Appel",
  email: "Email",
  rencontre: "Rencontre",
  note: "Note",
  autre: "Autre",
};

/** Rôles d'une personne (migration 010, check `personnes.roles`). */
export const ROLE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  client: "Client",
  prescripteur: "Prescripteur",
  partenaire: "Partenaire",
};

/** Statuts de facture (migration 010) — utilisés par le tableau de bord. */
export const FACTURE_STATUT_LABELS: Record<string, string> = {
  brouillon: "Brouillon",
  emise: "Émise",
  payee: "Payée",
  en_retard: "En retard",
  annulee: "Annulée",
};
