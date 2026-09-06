import type { TransactionSql } from "postgres";
import { getSql } from "./db";
import type { DocumentData, EmetteurData, LigneData, PaiementData } from "./facturation-validation";

/**
 * Couche d'accès du module Facturation (ERP · Lot 2, cadrage §4.C). SQL
 * paramétré postgres.js uniquement (portabilité Postgres standard, CDC §7.4).
 *
 * Règles métier (cadrage validé le 23/08/2026) :
 *  - numérotation séquentielle PAR ANNÉE, attribuée à l'envoi (devis, DE) ou à
 *    l'émission (facture FA, avoir AV) — jamais en brouillon ;
 *  - jamais de suppression d'un document numéroté : l'annulation d'une facture
 *    émise passe par un AVOIR (montants négatifs, lié à l'original) ;
 *  - les statuts « en retard » (facture) et « expiré » (devis) sont DÉRIVÉS de
 *    l'échéance à la lecture — aucune écriture pendant une lecture ;
 *  - l'émission est refusée tant que les paramètres de l'émetteur sont
 *    incomplets (migration 011).
 */

/* ===== Libellés ========================================================= */

/** Statuts de devis (stockés + dérivé `expire`). */
export const DEVIS_STATUT_LABELS: Record<string, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accepte: "Accepté",
  refuse: "Refusé",
  expire: "Expiré",
};

/* ===== Paramètres de l'émetteur ========================================= */

/** Paramètres de facturation (table singleton, migration 011). */
export type EmetteurRow = {
  raison_sociale: string | null;
  forme_juridique: string | null;
  capital: string | null;
  siren: string | null;
  tva_intra: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  email: string | null;
  telephone: string | null;
  regime_tva: string | null;
  taux_tva_defaut: string;
  delai_paiement_jours: number;
  iban: string | null;
  bic: string | null;
  mentions_complementaires: string | null;
};

/** Les paramètres, ou `null` si jamais renseignés. */
export async function getEmetteur(): Promise<EmetteurRow | null> {
  const sql = getSql();
  const rows = await sql<EmetteurRow[]>`
    select
      raison_sociale, forme_juridique, capital, siren, tva_intra,
      adresse, code_postal, ville, email, telephone,
      regime_tva, taux_tva_defaut::text as taux_tva_defaut,
      delai_paiement_jours, iban, bic, mentions_complementaires
    from facturation_emetteur
    limit 1
  `;
  return rows[0] ?? null;
}

/** Enregistre les paramètres (ligne unique, upsert). */
export async function upsertEmetteur(data: EmetteurData): Promise<void> {
  const sql = getSql();
  await sql`
    insert into facturation_emetteur (
      id, raison_sociale, forme_juridique, capital, siren, tva_intra,
      adresse, code_postal, ville, email, telephone,
      regime_tva, taux_tva_defaut, delai_paiement_jours, iban, bic,
      mentions_complementaires, updated_at
    ) values (
      true,
      ${data.raison_sociale ?? null}, ${data.forme_juridique ?? null},
      ${data.capital ?? null}, ${data.siren ?? null}, ${data.tva_intra ?? null},
      ${data.adresse ?? null}, ${data.code_postal ?? null}, ${data.ville ?? null},
      ${data.email ?? null}, ${data.telephone ?? null},
      ${data.regime_tva ?? null}, ${data.taux_tva_defaut},
      ${data.delai_paiement_jours}, ${data.iban ?? null}, ${data.bic ?? null},
      ${data.mentions_complementaires ?? null}, now()
    )
    on conflict (id) do update set
      raison_sociale = excluded.raison_sociale,
      forme_juridique = excluded.forme_juridique,
      capital = excluded.capital,
      siren = excluded.siren,
      tva_intra = excluded.tva_intra,
      adresse = excluded.adresse,
      code_postal = excluded.code_postal,
      ville = excluded.ville,
      email = excluded.email,
      telephone = excluded.telephone,
      regime_tva = excluded.regime_tva,
      taux_tva_defaut = excluded.taux_tva_defaut,
      delai_paiement_jours = excluded.delai_paiement_jours,
      iban = excluded.iban,
      bic = excluded.bic,
      mentions_complementaires = excluded.mentions_complementaires,
      updated_at = now()
  `;
}

/** Taux de TVA proposé sur les nouvelles lignes, selon le régime configuré. */
export function tauxTvaParDefaut(e: EmetteurRow | null): string {
  if (!e) return "20";
  if (
    e.regime_tva === "exoneration_formation" ||
    e.regime_tva === "franchise_base"
  ) {
    return "0";
  }
  return e.taux_tva_defaut ?? "20";
}

/** Champs indispensables aux mentions légales d'une facture. */
export function emetteurEstComplet(e: EmetteurRow | null): boolean {
  if (!e) return false;
  return Boolean(
    e.raison_sociale &&
      e.forme_juridique &&
      e.siren &&
      e.adresse &&
      e.code_postal &&
      e.ville &&
      e.regime_tva,
  );
}

/* ===== Types documents ================================================== */

/** Organisation proposée comme client d'un document. */
export type OrganisationChoix = { id: string; nom: string };

/** Ligne d'un devis ou d'une facture (lecture). */
export type LigneRow = {
  id: string;
  ordre: number;
  designation: string;
  quantite: string;
  prix_unitaire_ht: string;
  tva_pct: string;
};

/** Ligne de la liste des devis. */
export type DevisListRow = {
  id: string;
  numero: string | null;
  objet: string | null;
  statut: string;
  date_emission: string | null;
  date_expiration: string | null;
  montant_ttc: string;
  organisation_nom: string | null;
};

/** Ligne de la liste des factures. */
export type FactureListRow = {
  id: string;
  numero: string | null;
  type: string;
  objet: string | null;
  statut: string;
  date_emission: string | null;
  date_echeance: string | null;
  montant_ttc: string;
  organisation_nom: string | null;
};

/** Détail d'un devis (en-tête + client). */
export type DevisDetail = {
  id: string;
  numero: string | null;
  objet: string | null;
  statut: string;
  date_emission: string | null;
  date_expiration: string | null;
  montant_ht: string;
  montant_tva: string;
  montant_ttc: string;
  notes: string | null;
  organisation_id: string | null;
  organisation_nom: string | null;
  organisation_siren: string | null;
  organisation_adresse: string | null;
  organisation_code_postal: string | null;
  organisation_ville: string | null;
};

/** Détail d'une facture (en-tête + client + lien avoir). */
export type FactureDetail = {
  id: string;
  numero: string | null;
  type: string;
  facture_liee_id: string | null;
  facture_liee_numero: string | null;
  devis_id: string | null;
  objet: string | null;
  statut: string;
  date_emission: string | null;
  date_echeance: string | null;
  montant_ht: string;
  montant_tva: string;
  montant_ttc: string;
  notes: string | null;
  organisation_id: string | null;
  organisation_nom: string | null;
  organisation_siren: string | null;
  organisation_adresse: string | null;
  organisation_code_postal: string | null;
  organisation_ville: string | null;
};

/** Encaissement rattaché à une facture. */
export type PaiementRow = {
  id: string;
  montant: string;
  moyen: string;
  recu_le: string;
  reference: string | null;
};

/* ===== Lecture ========================================================== */

/** Organisations proposables comme client, par nom. */
export async function listOrganisationsChoix(): Promise<OrganisationChoix[]> {
  const sql = getSql();
  return sql<OrganisationChoix[]>`
    select id, nom from organisations order by lower(nom) asc
  `;
}

/** Statut effectif d'un devis : `expire` dérivé de la date d'expiration. */
const DEVIS_STATUT_EFFECTIF = `
  case
    when d.statut = 'envoye' and d.date_expiration is not null
         and d.date_expiration < current_date
    then 'expire' else d.statut
  end
`;

/** Tous les devis, les plus récents d'abord. */
export async function listDevis(): Promise<DevisListRow[]> {
  const sql = getSql();
  return sql<DevisListRow[]>`
    select
      d.id, d.numero, d.objet,
      ${sql.unsafe(DEVIS_STATUT_EFFECTIF)} as statut,
      to_char(d.date_emission, 'YYYY-MM-DD') as date_emission,
      to_char(d.date_expiration, 'YYYY-MM-DD') as date_expiration,
      d.montant_ttc::text as montant_ttc,
      o.nom as organisation_nom
    from devis d
    left join organisations o on o.id = d.organisation_id
    order by d.created_at desc
  `;
}

/** Statut effectif d'une facture : `en_retard` dérivé de l'échéance. */
const FACTURE_STATUT_EFFECTIF = `
  case
    when f.statut = 'emise' and f.date_echeance is not null
         and f.date_echeance < current_date
    then 'en_retard' else f.statut
  end
`;

/** Toutes les factures et avoirs, les plus récents d'abord. */
export async function listFactures(): Promise<FactureListRow[]> {
  const sql = getSql();
  return sql<FactureListRow[]>`
    select
      f.id, f.numero, f.type, f.objet,
      ${sql.unsafe(FACTURE_STATUT_EFFECTIF)} as statut,
      to_char(f.date_emission, 'YYYY-MM-DD') as date_emission,
      to_char(f.date_echeance, 'YYYY-MM-DD') as date_echeance,
      f.montant_ttc::text as montant_ttc,
      o.nom as organisation_nom
    from factures f
    left join organisations o on o.id = f.organisation_id
    order by f.created_at desc
  `;
}

/** Un devis par id (avec client), ou `null`. */
export async function getDevisDetail(id: string): Promise<DevisDetail | null> {
  const sql = getSql();
  const rows = await sql<DevisDetail[]>`
    select
      d.id, d.numero, d.objet,
      ${sql.unsafe(DEVIS_STATUT_EFFECTIF)} as statut,
      to_char(d.date_emission, 'YYYY-MM-DD') as date_emission,
      to_char(d.date_expiration, 'YYYY-MM-DD') as date_expiration,
      d.montant_ht::text as montant_ht,
      d.montant_tva::text as montant_tva,
      d.montant_ttc::text as montant_ttc,
      d.notes,
      d.organisation_id,
      o.nom as organisation_nom,
      o.siren as organisation_siren,
      o.adresse as organisation_adresse,
      o.code_postal as organisation_code_postal,
      o.ville as organisation_ville
    from devis d
    left join organisations o on o.id = d.organisation_id
    where d.id = ${id}
    limit 1
  `;
  return rows[0] ?? null;
}

/** Une facture par id (avec client et avoir/original lié), ou `null`. */
export async function getFactureDetail(
  id: string,
): Promise<FactureDetail | null> {
  const sql = getSql();
  const rows = await sql<FactureDetail[]>`
    select
      f.id, f.numero, f.type, f.facture_liee_id,
      liee.numero as facture_liee_numero,
      f.devis_id, f.objet,
      ${sql.unsafe(FACTURE_STATUT_EFFECTIF)} as statut,
      to_char(f.date_emission, 'YYYY-MM-DD') as date_emission,
      to_char(f.date_echeance, 'YYYY-MM-DD') as date_echeance,
      f.montant_ht::text as montant_ht,
      f.montant_tva::text as montant_tva,
      f.montant_ttc::text as montant_ttc,
      f.notes,
      f.organisation_id,
      o.nom as organisation_nom,
      o.siren as organisation_siren,
      o.adresse as organisation_adresse,
      o.code_postal as organisation_code_postal,
      o.ville as organisation_ville
    from factures f
    left join organisations o on o.id = f.organisation_id
    left join factures liee on liee.id = f.facture_liee_id
    where f.id = ${id}
    limit 1
  `;
  return rows[0] ?? null;
}

/** Lignes d'un devis, dans l'ordre. */
export async function listLignesDevis(devisId: string): Promise<LigneRow[]> {
  const sql = getSql();
  return sql<LigneRow[]>`
    select id, ordre, designation,
      quantite::text as quantite,
      prix_unitaire_ht::text as prix_unitaire_ht,
      tva_pct::text as tva_pct
    from devis_lignes
    where devis_id = ${devisId}
    order by ordre asc
  `;
}

/** Lignes d'une facture, dans l'ordre. */
export async function listLignesFacture(
  factureId: string,
): Promise<LigneRow[]> {
  const sql = getSql();
  return sql<LigneRow[]>`
    select id, ordre, designation,
      quantite::text as quantite,
      prix_unitaire_ht::text as prix_unitaire_ht,
      tva_pct::text as tva_pct
    from factures_lignes
    where facture_id = ${factureId}
    order by ordre asc
  `;
}

/** Total encaissé sur l'année en cours (repère du module). */
export async function getEncaisseAnnee(): Promise<string> {
  const sql = getSql();
  const [row] = await sql<{ total: string }[]>`
    select coalesce(sum(montant), 0)::text as total
    from paiements
    where date_trunc('year', recu_le) = date_trunc('year', current_date)
  `;
  return row?.total ?? "0";
}

/** Total encaissé sur une facture. */
export async function getTotalPaye(factureId: string): Promise<string> {
  const sql = getSql();
  const [row] = await sql<{ total: string }[]>`
    select coalesce(sum(montant), 0)::text as total
    from paiements
    where facture_id = ${factureId}
  `;
  return row?.total ?? "0";
}

/** Encaissements d'une facture, du plus récent au plus ancien. */
export async function listPaiements(factureId: string): Promise<PaiementRow[]> {
  const sql = getSql();
  return sql<PaiementRow[]>`
    select id, montant::text as montant, moyen,
      to_char(recu_le, 'YYYY-MM-DD') as recu_le, reference
    from paiements
    where facture_id = ${factureId}
    order by recu_le desc, created_at desc
  `;
}

/* ===== Totaux et numérotation =========================================== */

/** Arrondi comptable à 2 décimales. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Totaux HT / TVA / TTC calculés depuis les lignes (source de vérité). */
export function calculerTotaux(lignes: LigneData[]): {
  ht: number;
  tva: number;
  ttc: number;
} {
  let ht = 0;
  let tva = 0;
  for (const l of lignes) {
    const ligneHt = round2(l.quantite * l.prix_unitaire_ht);
    ht = round2(ht + ligneHt);
    tva = round2(tva + round2((ligneHt * l.tva_pct) / 100));
  }
  return { ht, tva, ttc: round2(ht + tva) };
}

/**
 * Prochain numéro « PREFIXE-ANNEE-NNN » pour la table donnée, dans la
 * transaction fournie. Utilisateur unique : pas de concurrence à sérialiser
 * (cadrage §5) — le `max` suffit.
 */
async function prochainNumero(
  tx: TransactionSql,
  table: "devis" | "factures",
  prefixe: "DE" | "FA" | "AV",
): Promise<string> {
  const [row] = await tx<{ suivant: number; annee: string }[]>`
    select
      coalesce(max(nullif(split_part(numero, '-', 3), '')::int), 0) + 1 as suivant,
      to_char(current_date, 'YYYY') as annee
    from ${tx(table)}
    where numero like ${prefixe + "-"} || to_char(current_date, 'YYYY') || '-%'
  `;
  const nnn = String(row.suivant).padStart(3, "0");
  return `${prefixe}-${row.annee}-${nnn}`;
}

/* ===== Écriture — devis ================================================= */

/** Insère les lignes d'un document dans sa table de lignes. */
async function insererLignes(
  tx: TransactionSql,
  table: "devis_lignes" | "factures_lignes",
  fk: "devis_id" | "facture_id",
  documentId: string,
  lignes: LigneData[],
): Promise<void> {
  for (const [ordre, l] of lignes.entries()) {
    await tx`
      insert into ${tx(table)} (${tx(fk)}, ordre, designation, quantite, prix_unitaire_ht, tva_pct)
      values (${documentId}, ${ordre}, ${l.designation}, ${l.quantite}, ${l.prix_unitaire_ht}, ${l.tva_pct})
    `;
  }
}

/** Crée un devis brouillon (lignes + totaux). Retourne son id. */
export async function insertDevis(data: DocumentData): Promise<string> {
  const sql = getSql();
  const totaux = calculerTotaux(data.lignes);
  return sql.begin(async (tx) => {
    const [row] = await tx<{ id: string }[]>`
      insert into devis (organisation_id, objet, notes, montant_ht, montant_tva, montant_ttc)
      values (${data.organisation_id}, ${data.objet ?? null}, ${data.notes ?? null},
              ${totaux.ht}, ${totaux.tva}, ${totaux.ttc})
      returning id
    `;
    await insererLignes(tx, "devis_lignes", "devis_id", row.id, data.lignes);
    return row.id;
  });
}

/** Met à jour un devis BROUILLON (lignes remplacées). `false` sinon. */
export async function updateDevisBrouillon(
  id: string,
  data: DocumentData,
): Promise<boolean> {
  const sql = getSql();
  const totaux = calculerTotaux(data.lignes);
  return sql.begin(async (tx) => {
    const rows = await tx<{ id: string }[]>`
      update devis set
        organisation_id = ${data.organisation_id},
        objet = ${data.objet ?? null},
        notes = ${data.notes ?? null},
        montant_ht = ${totaux.ht}, montant_tva = ${totaux.tva}, montant_ttc = ${totaux.ttc},
        updated_at = now()
      where id = ${id} and statut = 'brouillon'
      returning id
    `;
    if (rows.length === 0) return false;
    await tx`delete from devis_lignes where devis_id = ${id}`;
    await insererLignes(tx, "devis_lignes", "devis_id", id, data.lignes);
    return true;
  });
}

/** Passe un devis brouillon à « envoyé » : numéro + dates. `false` sinon. */
export async function envoyerDevis(id: string): Promise<boolean> {
  const sql = getSql();
  return sql.begin(async (tx) => {
    const [devis] = await tx<{ statut: string }[]>`
      select statut from devis where id = ${id} for update
    `;
    if (!devis || devis.statut !== "brouillon") return false;
    const numero = await prochainNumero(tx, "devis", "DE");
    await tx`
      update devis set
        numero = ${numero},
        statut = 'envoye',
        date_emission = current_date,
        date_expiration = current_date + interval '30 days',
        updated_at = now()
      where id = ${id}
    `;
    return true;
  });
}

/** Accepte ou refuse un devis envoyé (ou expiré). `false` sinon. */
export async function clotureDevis(
  id: string,
  statut: "accepte" | "refuse",
): Promise<boolean> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    update devis set statut = ${statut}, updated_at = now()
    where id = ${id} and statut = 'envoye'
    returning id
  `;
  return rows.length > 0;
}

/** Supprime un devis brouillon (jamais un devis numéroté). `false` sinon. */
export async function supprimerDevisBrouillon(id: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    delete from devis where id = ${id} and statut = 'brouillon' and numero is null
    returning id
  `;
  return rows.length > 0;
}

/**
 * Transforme un devis ACCEPTÉ en facture brouillon (lignes copiées, lien
 * `devis_id`). Retourne l'id de la facture, ou `null` si le devis n'est pas
 * acceptable (introuvable ou pas au statut accepté).
 */
export async function devisEnFacture(devisId: string): Promise<string | null> {
  const sql = getSql();
  return sql.begin(async (tx) => {
    const [devis] = await tx<
      {
        statut: string;
        organisation_id: string | null;
        personne_id: string | null;
        objet: string | null;
        montant_ht: string;
        montant_tva: string;
        montant_ttc: string;
      }[]
    >`
      select statut, organisation_id, personne_id, objet,
             montant_ht::text as montant_ht, montant_tva::text as montant_tva,
             montant_ttc::text as montant_ttc
      from devis where id = ${devisId} for update
    `;
    if (!devis || devis.statut !== "accepte") return null;

    const [facture] = await tx<{ id: string }[]>`
      insert into factures (devis_id, organisation_id, personne_id, objet,
                            montant_ht, montant_tva, montant_ttc)
      values (${devisId}, ${devis.organisation_id}, ${devis.personne_id},
              ${devis.objet}, ${devis.montant_ht}, ${devis.montant_tva},
              ${devis.montant_ttc})
      returning id
    `;
    await tx`
      insert into factures_lignes (facture_id, ordre, designation, quantite, prix_unitaire_ht, tva_pct)
      select ${facture.id}, ordre, designation, quantite, prix_unitaire_ht, tva_pct
      from devis_lignes where devis_id = ${devisId}
      order by ordre asc
    `;
    return facture.id;
  });
}

/* ===== Écriture — factures ============================================== */

/** Crée une facture brouillon (lignes + totaux). Retourne son id. */
export async function insertFacture(data: DocumentData): Promise<string> {
  const sql = getSql();
  const totaux = calculerTotaux(data.lignes);
  return sql.begin(async (tx) => {
    const [row] = await tx<{ id: string }[]>`
      insert into factures (organisation_id, objet, notes, montant_ht, montant_tva, montant_ttc)
      values (${data.organisation_id}, ${data.objet ?? null}, ${data.notes ?? null},
              ${totaux.ht}, ${totaux.tva}, ${totaux.ttc})
      returning id
    `;
    await insererLignes(tx, "factures_lignes", "facture_id", row.id, data.lignes);
    return row.id;
  });
}

/** Met à jour une facture BROUILLON (lignes remplacées). `false` sinon. */
export async function updateFactureBrouillon(
  id: string,
  data: DocumentData,
): Promise<boolean> {
  const sql = getSql();
  const totaux = calculerTotaux(data.lignes);
  return sql.begin(async (tx) => {
    const rows = await tx<{ id: string }[]>`
      update factures set
        organisation_id = ${data.organisation_id},
        objet = ${data.objet ?? null},
        notes = ${data.notes ?? null},
        montant_ht = ${totaux.ht}, montant_tva = ${totaux.tva}, montant_ttc = ${totaux.ttc},
        updated_at = now()
      where id = ${id} and statut = 'brouillon' and type = 'facture'
      returning id
    `;
    if (rows.length === 0) return false;
    await tx`delete from factures_lignes where facture_id = ${id}`;
    await insererLignes(tx, "factures_lignes", "facture_id", id, data.lignes);
    return true;
  });
}

/** Résultat d'une émission de facture. */
export type EmissionResult =
  | { ok: true; numero: string }
  | { ok: false; code: "introuvable" | "pas_brouillon" | "emetteur_incomplet" };

/**
 * Émet une facture brouillon : vérifie les paramètres de l'émetteur, attribue
 * le numéro FA-ANNEE-NNN, la date d'émission (aujourd'hui) et l'échéance
 * (délai des paramètres). Une facture émise ne se supprime plus (avoir).
 */
export async function emettreFacture(id: string): Promise<EmissionResult> {
  const emetteur = await getEmetteur();
  if (!emetteurEstComplet(emetteur)) {
    return { ok: false, code: "emetteur_incomplet" };
  }
  const delai = emetteur?.delai_paiement_jours ?? 30;

  const sql = getSql();
  return sql.begin(async (tx): Promise<EmissionResult> => {
    const [facture] = await tx<{ statut: string; type: string }[]>`
      select statut, type from factures where id = ${id} for update
    `;
    if (!facture) return { ok: false, code: "introuvable" };
    if (facture.statut !== "brouillon" || facture.type !== "facture") {
      return { ok: false, code: "pas_brouillon" };
    }
    const numero = await prochainNumero(tx, "factures", "FA");
    await tx`
      update factures set
        numero = ${numero},
        statut = 'emise',
        date_emission = current_date,
        date_echeance = current_date + make_interval(days => ${delai}),
        updated_at = now()
      where id = ${id}
    `;
    return { ok: true, numero };
  });
}

/** Supprime une facture brouillon (jamais un document numéroté). */
export async function supprimerFactureBrouillon(id: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    delete from factures
    where id = ${id} and statut = 'brouillon' and numero is null
    returning id
  `;
  return rows.length > 0;
}

/** Résultat d'un encaissement. */
export type PaiementResult =
  | { ok: true; payee: boolean }
  | { ok: false; code: "introuvable" | "non_emise" };

/**
 * Enregistre un encaissement sur une facture émise (ou déjà payée — trop-perçu
 * possible) ; bascule la facture en « payée » quand le total encaissé couvre
 * le TTC.
 */
export async function enregistrerPaiement(
  factureId: string,
  data: PaiementData,
): Promise<PaiementResult> {
  const sql = getSql();
  return sql.begin(async (tx): Promise<PaiementResult> => {
    const [facture] = await tx<
      { statut: string; type: string; montant_ttc: string }[]
    >`
      select statut, type, montant_ttc::text as montant_ttc
      from factures where id = ${factureId} for update
    `;
    if (!facture) return { ok: false, code: "introuvable" };
    if (
      facture.type !== "facture" ||
      !["emise", "payee"].includes(facture.statut)
    ) {
      return { ok: false, code: "non_emise" };
    }

    await tx`
      insert into paiements (facture_id, montant, moyen, recu_le, reference)
      values (${factureId}, ${data.montant}, ${data.moyen}, ${data.recu_le},
              ${data.reference ?? null})
    `;

    const [{ total }] = await tx<{ total: string }[]>`
      select coalesce(sum(montant), 0)::text as total
      from paiements where facture_id = ${factureId}
    `;
    const payee = Number(total) >= Number(facture.montant_ttc) - 0.005;
    if (payee && facture.statut !== "payee") {
      await tx`update factures set statut = 'payee', updated_at = now() where id = ${factureId}`;
    }
    return { ok: true, payee };
  });
}

/** Résultat d'une création d'avoir. */
export type AvoirResult =
  | { ok: true; avoirId: string; numero: string }
  | { ok: false; code: "introuvable" | "non_annulable" };

/**
 * Annule une facture émise (ou payée, ou en retard) par un AVOIR : document
 * de type `avoir`, numéroté AV-ANNEE-NNN, émis immédiatement, lignes copiées
 * en négatif. La facture d'origine passe au statut « annulée » — elle n'est
 * jamais supprimée.
 */
export async function creerAvoir(factureId: string): Promise<AvoirResult> {
  const sql = getSql();
  return sql.begin(async (tx): Promise<AvoirResult> => {
    const [facture] = await tx<
      {
        statut: string;
        type: string;
        organisation_id: string | null;
        personne_id: string | null;
        objet: string | null;
        numero: string | null;
        montant_ht: string;
        montant_tva: string;
        montant_ttc: string;
      }[]
    >`
      select statut, type, organisation_id, personne_id, objet, numero,
             montant_ht::text as montant_ht, montant_tva::text as montant_tva,
             montant_ttc::text as montant_ttc
      from factures where id = ${factureId} for update
    `;
    if (!facture) return { ok: false, code: "introuvable" };
    if (
      facture.type !== "facture" ||
      !["emise", "payee"].includes(facture.statut)
    ) {
      return { ok: false, code: "non_annulable" };
    }

    const numero = await prochainNumero(tx, "factures", "AV");
    const [avoir] = await tx<{ id: string }[]>`
      insert into factures (numero, type, facture_liee_id, organisation_id,
                            personne_id, objet, statut, date_emission,
                            montant_ht, montant_tva, montant_ttc)
      values (${numero}, 'avoir', ${factureId}, ${facture.organisation_id},
              ${facture.personne_id},
              ${`Avoir sur facture ${facture.numero ?? ""}`.trim()},
              'emise', current_date,
              ${-Number(facture.montant_ht)}, ${-Number(facture.montant_tva)},
              ${-Number(facture.montant_ttc)})
      returning id
    `;
    await tx`
      insert into factures_lignes (facture_id, ordre, designation, quantite, prix_unitaire_ht, tva_pct)
      select ${avoir.id}, ordre, designation, quantite, -prix_unitaire_ht, tva_pct
      from factures_lignes where facture_id = ${factureId}
      order by ordre asc
    `;
    await tx`update factures set statut = 'annulee', updated_at = now() where id = ${factureId}`;
    return { ok: true, avoirId: avoir.id, numero };
  });
}
