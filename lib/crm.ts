import { getSql } from "./db";
import type { ActiviteData, OpportuniteData, PersonneData } from "./crm-validation";

/**
 * Couche d'accès du module CRM (ERP · Lot 1, cadrage §4.B et §5). SQL paramétré
 * postgres.js uniquement (portabilité Postgres standard, CDC §7.4). Aucune
 * donnée personnelle n'est journalisée ici.
 *
 * Toutes les fonctions lèvent si `DATABASE_URL` est absent, la base injoignable
 * ou la migration 010 non appliquée : les pages appelantes rattrapent et
 * affichent l'encart « base indisponible » plutôt qu'une 500.
 */

/* ===== Libellés ======================================================== */

export { ETAPE_LABELS, ACTIVITE_TYPE_LABELS, ROLE_LABELS, FACTURE_STATUT_LABELS } from "./crm-labels";

/* ===== Types ============================================================ */

/** Personne du CRM, avec le nom de son organisation. */
export type PersonneRow = {
  id: string;
  prenom: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  fonction: string | null;
  roles: string[];
  source: string | null;
  notes: string | null;
  created_at: string;
  organisation_id: string | null;
  organisation_nom: string | null;
};

/** Opportunité enrichie de la personne et de l'organisation. */
export type OpportuniteRow = {
  id: string;
  personne_id: string;
  titre: string | null;
  etape: string;
  montant_estime: string | null;
  notes: string | null;
  personne_prenom: string;
  personne_nom: string;
  organisation_nom: string | null;
  /** Prochaine relance non faite de la personne (date ISO), ou `null`. */
  relance_at: string | null;
  /** Contenu de cette relance, ou `null`. */
  relance_contenu: string | null;
};

/** Ligne du journal d'activités d'une personne. */
export type ActiviteRow = {
  id: string;
  type: string;
  contenu: string | null;
  effectue_at: string;
  relance_at: string | null;
  relance_faite: boolean;
};

/** Décompte et montant estimé d'une étape du pipeline. */
export type PipelineEtape = {
  etape: string;
  nb: number;
  montant: string;
};

/** Relance à faire (tableau de bord + CRM). */
export type RelanceRow = {
  activite_id: string;
  personne_id: string;
  prenom: string;
  nom: string;
  organisation_nom: string | null;
  contenu: string | null;
  /** Date ISO « YYYY-MM-DD ». */
  relance_at: string;
  en_retard: boolean;
};

/** Bloc « argent » du tableau de bord (tables du Lot 2, vides avant lui). */
export type ArgentStats = {
  encaisse_mois: string;
  attente_montant: string;
  attente_nb: number;
  retard_montant: string;
  retard_nb: number;
};

/** Facture à suivre (liste du tableau de bord). */
export type FactureSuivi = {
  id: string;
  numero: string | null;
  statut: string;
  montant_ttc: string;
  organisation_nom: string | null;
  date_echeance: string | null;
};

/* ===== Lecture ========================================================== */

/** Une personne par id (avec son organisation), ou `null`. */
export async function getPersonne(id: string): Promise<PersonneRow | null> {
  const sql = getSql();
  const rows = await sql<PersonneRow[]>`
    select
      p.id, p.prenom, p.nom, p.email, p.telephone, p.fonction, p.roles,
      p.source, p.notes,
      to_char(p.created_at at time zone 'Europe/Paris', 'DD/MM/YYYY') as created_at,
      p.organisation_id,
      o.nom as organisation_nom
    from personnes p
    left join organisations o on o.id = p.organisation_id
    where p.id = ${id}
    limit 1
  `;
  return rows[0] ?? null;
}

/**
 * Pipeline par étape : décompte et somme des montants estimés. Les étapes
 * `gagnee` et `perdue` sont limitées à l'année en cours (bilan annuel) ; les
 * étapes actives couvrent tout l'encours. Les étapes sans ligne sont absentes
 * du résultat — l'appelant complète avec zéro.
 */
export async function getPipelineStats(): Promise<PipelineEtape[]> {
  const sql = getSql();
  return sql<PipelineEtape[]>`
    select
      etape,
      count(*)::int as nb,
      coalesce(sum(montant_estime), 0)::text as montant
    from opportunites
    where etape in ('contact', 'echange', 'proposition')
      or (etape in ('gagnee', 'perdue')
          and date_trunc('year', updated_at) = date_trunc('year', now()))
    group by etape
  `;
}

/**
 * Opportunités en cours (étapes actives), avec la prochaine relance non faite
 * de la personne. Tri : relance la plus urgente d'abord, puis les plus
 * récentes.
 */
export async function listOpportunitesEnCours(): Promise<OpportuniteRow[]> {
  const sql = getSql();
  return sql<OpportuniteRow[]>`
    select
      op.id, op.personne_id, op.titre, op.etape,
      op.montant_estime::text as montant_estime, op.notes,
      p.prenom as personne_prenom, p.nom as personne_nom,
      o.nom as organisation_nom,
      to_char(r.relance_at, 'YYYY-MM-DD') as relance_at,
      r.contenu as relance_contenu
    from opportunites op
    join personnes p on p.id = op.personne_id
    left join organisations o on o.id = p.organisation_id
    left join lateral (
      select a.relance_at, a.contenu
      from activites a
      where a.personne_id = op.personne_id
        and a.relance_at is not null and not a.relance_faite
      order by a.relance_at asc
      limit 1
    ) r on true
    where op.etape in ('contact', 'echange', 'proposition')
    order by r.relance_at asc nulls last, op.created_at desc
  `;
}

/** Opportunités d'une personne, les plus récentes d'abord. */
export async function listOpportunitesByPersonne(
  personneId: string,
): Promise<OpportuniteRow[]> {
  const sql = getSql();
  return sql<OpportuniteRow[]>`
    select
      op.id, op.personne_id, op.titre, op.etape,
      op.montant_estime::text as montant_estime, op.notes,
      p.prenom as personne_prenom, p.nom as personne_nom,
      o.nom as organisation_nom,
      null as relance_at,
      null as relance_contenu
    from opportunites op
    join personnes p on p.id = op.personne_id
    left join organisations o on o.id = p.organisation_id
    where op.personne_id = ${personneId}
    order by op.created_at desc
  `;
}

/** Journal d'activités d'une personne, le plus récent d'abord. */
export async function listActivitesByPersonne(
  personneId: string,
): Promise<ActiviteRow[]> {
  const sql = getSql();
  return sql<ActiviteRow[]>`
    select
      id, type, contenu,
      to_char(effectue_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI') as effectue_at,
      to_char(relance_at, 'YYYY-MM-DD') as relance_at,
      relance_faite
    from activites
    where personne_id = ${personneId}
    order by effectue_at desc
  `;
}

/** Relances à faire (non faites), les plus urgentes d'abord. */
export async function listRelancesAFaire(limit: number): Promise<RelanceRow[]> {
  const sql = getSql();
  return sql<RelanceRow[]>`
    select
      a.id as activite_id,
      p.id as personne_id,
      p.prenom, p.nom,
      o.nom as organisation_nom,
      a.contenu,
      to_char(a.relance_at, 'YYYY-MM-DD') as relance_at,
      (a.relance_at < current_date) as en_retard
    from activites a
    join personnes p on p.id = a.personne_id
    left join organisations o on o.id = p.organisation_id
    where a.relance_at is not null and not a.relance_faite
    order by a.relance_at asc, a.created_at asc
    limit ${limit}
  `;
}

/** Nombre de relances dues (aujourd'hui ou en retard). */
export async function countRelancesDues(): Promise<number> {
  const sql = getSql();
  const [row] = await sql<{ nb: number }[]>`
    select count(*)::int as nb
    from activites
    where relance_at is not null and not relance_faite
      and relance_at <= current_date
  `;
  return row?.nb ?? 0;
}

/**
 * Bloc « argent » du tableau de bord : encaissé du mois (paiements), montants
 * et décomptes des factures en attente et en retard. « En retard » est DÉRIVÉ
 * de l'échéance (facture émise dont l'échéance est passée) — aucune écriture
 * en lecture, même règle que lib/facturation. Le bloc affiche zéro tant
 * qu'aucune facture n'existe (module du Lot 2).
 */
export async function getArgentStats(): Promise<ArgentStats> {
  const sql = getSql();
  const [row] = await sql<ArgentStats[]>`
    select
      coalesce((
        select sum(montant) from paiements
        where date_trunc('month', recu_le) = date_trunc('month', current_date)
      ), 0)::text as encaisse_mois,
      coalesce((
        select sum(montant_ttc) from factures
        where statut = 'emise'
          and (date_echeance is null or date_echeance >= current_date)
      ), 0)::text as attente_montant,
      (
        select count(*)::int from factures
        where statut = 'emise'
          and (date_echeance is null or date_echeance >= current_date)
      ) as attente_nb,
      coalesce((
        select sum(montant_ttc) from factures
        where statut = 'emise' and date_echeance < current_date
      ), 0)::text as retard_montant,
      (
        select count(*)::int from factures
        where statut = 'emise' and date_echeance < current_date
      ) as retard_nb
  `;
  return (
    row ?? {
      encaisse_mois: "0",
      attente_montant: "0",
      attente_nb: 0,
      retard_montant: "0",
      retard_nb: 0,
    }
  );
}

/**
 * Dernières factures hors brouillon (liste « à suivre » du tableau de bord).
 * Le statut « en retard » est dérivé de l'échéance, comme dans lib/facturation.
 */
export async function listFacturesASuivre(limit: number): Promise<FactureSuivi[]> {
  const sql = getSql();
  return sql<FactureSuivi[]>`
    select
      f.id, f.numero,
      case
        when f.statut = 'emise' and f.date_echeance is not null
             and f.date_echeance < current_date
        then 'en_retard' else f.statut
      end as statut,
      f.montant_ttc::text as montant_ttc,
      o.nom as organisation_nom,
      to_char(f.date_echeance, 'YYYY-MM-DD') as date_echeance
    from factures f
    left join organisations o on o.id = f.organisation_id
    where f.statut <> 'brouillon'
    order by
      case
        when f.statut = 'emise' and f.date_echeance < current_date then 0
        when f.statut = 'emise' then 1
        else 2
      end,
      f.date_echeance asc nulls last,
      f.created_at desc
    limit ${limit}
  `;
}

/** Nombre de demandes de contact du site non traitées. */
export async function countContactsNonTraites(): Promise<number> {
  const sql = getSql();
  const [row] = await sql<{ nb: number }[]>`
    select count(*)::int as nb from contacts where not traite
  `;
  return row?.nb ?? 0;
}

/* ===== Écriture ========================================================= */

/**
 * Retourne l'id de l'organisation portant ce nom (insensible à la casse), en
 * la créant au besoin. `null` si le nom est vide. Utilisé dans la transaction
 * de l'appelant quand il y en a une.
 */
async function findOrCreateOrganisation(
  sql: ReturnType<typeof getSql>,
  nom: string | undefined,
): Promise<string | null> {
  const propre = nom?.trim();
  if (!propre) return null;
  const [existante] = await sql<{ id: string }[]>`
    select id from organisations where lower(nom) = lower(${propre}) limit 1
  `;
  if (existante) return existante.id;
  const [creee] = await sql<{ id: string }[]>`
    insert into organisations (nom) values (${propre}) returning id
  `;
  return creee.id;
}

/** Crée une personne (et son organisation si besoin). Retourne son id. */
export async function insertPersonne(data: PersonneData): Promise<string> {
  const sql = getSql();
  const organisationId = await findOrCreateOrganisation(sql, data.organisation);
  const [row] = await sql<{ id: string }[]>`
    insert into personnes (organisation_id, prenom, nom, email, telephone, fonction, roles, source, notes)
    values (
      ${organisationId},
      ${data.prenom},
      ${data.nom},
      ${data.email ?? null},
      ${data.telephone ?? null},
      ${data.fonction ?? null},
      ${data.roles},
      ${data.source ?? null},
      ${data.notes ?? null}
    )
    returning id
  `;
  return row.id;
}

/** Crée une opportunité pour une personne. Retourne `false` si elle n'existe pas. */
export async function insertOpportunite(
  personneId: string,
  data: OpportuniteData,
): Promise<boolean> {
  const sql = getSql();
  try {
    await sql`
      insert into opportunites (personne_id, titre, etape, montant_estime)
      values (${personneId}, ${data.titre ?? null}, ${data.etape}, ${data.montant_estime ?? null})
    `;
    return true;
  } catch (err) {
    if (isForeignKeyViolation(err)) return false;
    throw err;
  }
}

/** Change l'étape d'une opportunité. Retourne `true` si la ligne existait. */
export async function updateOpportuniteEtape(
  id: string,
  etape: string,
): Promise<boolean> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    update opportunites set etape = ${etape}, updated_at = now()
    where id = ${id}
    returning id
  `;
  return rows.length > 0;
}

/** Ajoute une activité (échange passé et/ou relance planifiée) à une personne. */
export async function insertActivite(
  personneId: string,
  data: ActiviteData,
): Promise<boolean> {
  const sql = getSql();
  try {
    await sql`
      insert into activites (personne_id, type, contenu, relance_at)
      values (${personneId}, ${data.type}, ${data.contenu ?? null}, ${data.relance_at ?? null})
    `;
    return true;
  } catch (err) {
    if (isForeignKeyViolation(err)) return false;
    throw err;
  }
}

/** Marque la relance d'une activité comme faite. */
export async function marquerRelanceFaite(activiteId: string): Promise<void> {
  const sql = getSql();
  await sql`update activites set relance_faite = true where id = ${activiteId}`;
}

/** Résultat de la conversion d'une demande de contact en fiche CRM. */
export type ConversionResult =
  | { ok: true; personneId: string; deja: boolean }
  | { ok: false; code: "introuvable" };

/**
 * Convertit une demande de contact du site en fiche CRM (cadrage §4.B) :
 * crée ou retrouve la personne (même email), crée son organisation au besoin,
 * ouvre une opportunité en étape « contact » s'il n'en existe aucune en cours,
 * et marque la demande comme traitée. Transaction ; idempotente sur l'email.
 */
export async function convertirContactEnPersonne(
  contactId: string,
): Promise<ConversionResult> {
  const sql = getSql();
  return sql.begin(async (tx): Promise<ConversionResult> => {
    const [contact] = await tx<
      {
        prenom: string;
        nom: string;
        email: string;
        telephone: string | null;
        entreprise: string;
        message: string;
      }[]
    >`
      select prenom, nom, email, telephone, entreprise, message
      from contacts
      where id = ${contactId}
      for update
    `;
    if (!contact) return { ok: false, code: "introuvable" };

    // Personne existante (même email) : on la réutilise plutôt que dupliquer.
    const [existante] = await tx<{ id: string }[]>`
      select id from personnes
      where email is not null and lower(email) = lower(${contact.email})
      limit 1
    `;

    let personneId: string;
    const deja = Boolean(existante);
    if (existante) {
      personneId = existante.id;
    } else {
      const [organisation] = await tx<{ id: string }[]>`
        insert into organisations (nom)
        select ${contact.entreprise}
        where not exists (
          select 1 from organisations where lower(nom) = lower(${contact.entreprise})
        )
        returning id
      `;
      const [orgExistante] = organisation
        ? [organisation]
        : await tx<{ id: string }[]>`
            select id from organisations
            where lower(nom) = lower(${contact.entreprise})
            limit 1
          `;
      const [personne] = await tx<{ id: string }[]>`
        insert into personnes (organisation_id, prenom, nom, email, telephone, source, notes)
        values (
          ${orgExistante?.id ?? null},
          ${contact.prenom},
          ${contact.nom},
          ${contact.email},
          ${contact.telephone},
          'site — formulaire implémentation',
          ${contact.message}
        )
        returning id
      `;
      personneId = personne.id;
    }

    // Une seule opportunité active à la fois pour une conversion automatique.
    const [enCours] = await tx<{ id: string }[]>`
      select id from opportunites
      where personne_id = ${personneId}
        and etape in ('contact', 'echange', 'proposition')
      limit 1
    `;
    if (!enCours) {
      await tx`
        insert into opportunites (personne_id, titre, etape)
        values (${personneId}, 'Demande via le site', 'contact')
      `;
    }

    await tx`update contacts set traite = true where id = ${contactId}`;
    return { ok: true, personneId, deja };
  });
}

/** Violation de clé étrangère Postgres (SQLSTATE 23503). */
function isForeignKeyViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23503"
  );
}
