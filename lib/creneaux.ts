/**
 * Créneaux proposés pour la formation Débutant (décision du propriétaire,
 * 03/09/2026) : trois créneaux de deux après-midis, au même endroit. Source de
 * vérité unique — la modale de pré-inscription (F2), sa validation serveur et
 * la page « Nos formations » lisent toutes ce module. Module pur, sans accès
 * base : sûr à importer côté serveur comme côté client.
 */

/** Les trois créneaux proposés, dans l'ordre d'affichage. */
export const CRENEAUX = [
  "Mardi 15 et jeudi 17 septembre 2026",
  "Mardi 22 et jeudi 24 septembre 2026",
  "Mardi 29 septembre et jeudi 1er octobre 2026",
] as const;

/**
 * Les mêmes créneaux en dates machine, pour le balisage des sessions
 * (`hasCourseInstance` du Course). Aligné index par index sur `CRENEAUX` :
 * début à la première après-midi, fin à la seconde, 14 h – 17 h 30, fuseau
 * Europe/Paris (+02:00 à ces dates). L'assertion ci-dessous interdit qu'une
 * liste évolue sans l'autre.
 */
export const CRENEAUX_DATES = [
  { debut: "2026-09-15T14:00:00+02:00", fin: "2026-09-17T17:30:00+02:00" },
  { debut: "2026-09-22T14:00:00+02:00", fin: "2026-09-24T17:30:00+02:00" },
  { debut: "2026-09-29T14:00:00+02:00", fin: "2026-10-01T17:30:00+02:00" },
] as const satisfies { length: (typeof CRENEAUX)["length"] };

/** Choix laissé au prospect qui n'a pas de préférence. */
export const CRENEAU_SANS_PREFERENCE = "Sans préférence";

/**
 * Options du champ « Créneau souhaité » : les trois créneaux puis « Sans
 * préférence ». Sert aussi d'énumération à la validation (lib/validation).
 */
export const CRENEAUX_OPTIONS = [
  ...CRENEAUX,
  CRENEAU_SANS_PREFERENCE,
] as const;

/** Horaire commun aux trois créneaux. */
export const CRENEAU_HORAIRE = "deux après-midis, de 14 h à 17 h 30";

/** Durée confirmée par le propriétaire le 06/09/2026, hors pratique personnelle. */
export const FORMATION_DUREE = "2 séances de 3 h 30 (7 heures au total)";
export const FORMATION_DUREE_ISO = "PT7H";

/** Lieu de la formation (adresse complète). */
export const CRENEAU_LIEU =
  "13 Rue Claude Chappe, 69370 Saint-Didier-au-Mont-d'Or";

/** Les trois créneaux en version compacte (ligne mono de /formations). */
export const CRENEAUX_COMPACT =
  "15–17 sept · 22–24 sept · 29 sept–1er oct 2026";

/** Lieu en version compacte (ligne mono de /formations). */
export const CRENEAU_LIEU_COURT = "Saint-Didier-au-Mont-d'Or (69)";
