import type { TransactionSql } from "postgres";
import { getSql } from "./db";
import type { SessionData } from "./validation";

/**
 * Couche d'accès du tableau de bord admin (F3 · CDC §5.3). SQL paramétré
 * postgres.js uniquement (portabilité Postgres standard, CDC §7.4). Aucune
 * donnée personnelle n'est journalisée ici.
 *
 * Toutes les fonctions lèvent si `DATABASE_URL` est absent ou la base
 * injoignable (getSql) : les pages appelantes rattrapent et affichent un encart
 * « base indisponible » plutôt qu'une 500.
 */

/** Ligne de session avec le décompte des inscriptions par statut. */
export type SessionRow = {
  id: string;
  date: string;
  heure_debut: string | null;
  heure_fin: string | null;
  lieu: string | null;
  capacite: number;
  statut: string;
  confirme: number;
  attente: number;
  annule: number;
};

/** Session seule (pour préremplir le formulaire d'édition). */
export type SessionDetail = {
  id: string;
  date: string;
  heure_debut: string | null;
  heure_fin: string | null;
  lieu: string | null;
  capacite: number;
  statut: string;
};

/** Ligne d'inscription (colonnes du suivi + date formatée fr). */
export type InscriptionRow = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  metier: string;
  metier_autre: string | null;
  entreprise: string | null;
  statut: string;
  created_at: string;
};

/** Ligne de demande de contact « implémentation » (F4 · vue contact §5.3). */
export type ContactRow = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  entreprise: string;
  message: string;
  traite: boolean;
  created_at: string;
};

/** Toutes les demandes de contact, de la plus récente à la plus ancienne. */
export async function listContacts(): Promise<ContactRow[]> {
  const sql = getSql();
  return sql<ContactRow[]>`
    select
      id, prenom, nom, email, telephone, entreprise, message, traite,
      to_char(created_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI') as created_at
    from contacts
    order by created_at desc
  `;
}

/** Bascule l'état « traité » d'une demande de contact. */
export async function updateContactTraite(
  id: string,
  traite: boolean,
): Promise<void> {
  const sql = getSql();
  await sql`update contacts set traite = ${traite} where id = ${id}`;
}

/**
 * Toutes les sessions, avec le décompte d'inscriptions par statut. Triées de la
 * plus récente à la plus ancienne (les sessions à venir en tête).
 */
export async function listSessionsWithCounts(): Promise<SessionRow[]> {
  const sql = getSql();
  return sql<SessionRow[]>`
    select
      s.id,
      to_char(s.date, 'YYYY-MM-DD') as date,
      to_char(s.heure_debut, 'HH24:MI') as heure_debut,
      to_char(s.heure_fin, 'HH24:MI') as heure_fin,
      s.lieu,
      s.capacite,
      s.statut,
      coalesce(cnt.confirme, 0) as confirme,
      coalesce(cnt.attente, 0) as attente,
      coalesce(cnt.annule, 0) as annule
    from sessions s
    left join (
      select
        session_id,
        count(*) filter (where statut = 'confirme')::int as confirme,
        count(*) filter (where statut = 'attente')::int as attente,
        count(*) filter (where statut = 'annule')::int as annule
      from inscriptions
      where session_id is not null
      group by session_id
    ) cnt on cnt.session_id = s.id
    order by s.date desc, s.heure_debut desc nulls last
  `;
}

/** Une session par id, ou `null`. */
export async function getSessionById(id: string): Promise<SessionDetail | null> {
  const sql = getSql();
  const rows = await sql<SessionDetail[]>`
    select
      id,
      to_char(date, 'YYYY-MM-DD') as date,
      to_char(heure_debut, 'HH24:MI') as heure_debut,
      to_char(heure_fin, 'HH24:MI') as heure_fin,
      lieu,
      capacite,
      statut
    from sessions
    where id = ${id}
    limit 1
  `;
  return rows[0] ?? null;
}

/** Inscriptions rattachées à une session, de la plus récente à la plus ancienne. */
export async function getInscriptionsBySession(
  sessionId: string,
): Promise<InscriptionRow[]> {
  const sql = getSql();
  return sql<InscriptionRow[]>`
    select
      id, prenom, nom, email, telephone, metier, metier_autre, entreprise, statut,
      to_char(created_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI') as created_at
    from inscriptions
    where session_id = ${sessionId}
    order by created_at desc
  `;
}

/** Inscriptions en liste d'attente générale (aucune session rattachée). */
export async function getWaitlistGenerale(): Promise<InscriptionRow[]> {
  const sql = getSql();
  return sql<InscriptionRow[]>`
    select
      id, prenom, nom, email, telephone, metier, metier_autre, entreprise, statut,
      to_char(created_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI') as created_at
    from inscriptions
    where session_id is null
    order by created_at desc
  `;
}

/** Crée une session et retourne son id. */
export async function insertSession(data: SessionData): Promise<string> {
  const sql = getSql();
  const [row] = await sql<{ id: string }[]>`
    insert into sessions (date, heure_debut, heure_fin, lieu, capacite, statut)
    values (
      ${data.date},
      ${data.heure_debut ?? null},
      ${data.heure_fin ?? null},
      ${data.lieu ?? null},
      ${data.capacite},
      ${data.statut}
    )
    returning id
  `;
  return row.id;
}

/** Met à jour une session. Retourne `true` si la ligne existait. */
export async function updateSession(
  id: string,
  data: SessionData,
): Promise<boolean> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    update sessions set
      date = ${data.date},
      heure_debut = ${data.heure_debut ?? null},
      heure_fin = ${data.heure_fin ?? null},
      lieu = ${data.lieu ?? null},
      capacite = ${data.capacite},
      statut = ${data.statut}
    where id = ${id}
    returning id
  `;
  return rows.length > 0;
}

/** Archive une session : bascule son statut en « terminée ». */
export async function archiveSession(id: string): Promise<void> {
  const sql = getSql();
  await sql`update sessions set statut = 'terminee' where id = ${id}`;
}

/**
 * Recalcule le statut d'une session selon le nombre d'inscrits confirmés
 * (règle complete ↔ publiee, CDC §5.3) :
 *  - `publiee` avec la capacité atteinte → `complete` ;
 *  - `complete` repassée sous la capacité (place libérée) → `publiee`.
 * Les statuts `brouillon` et `terminee` sont laissés tels quels (pilotés à la
 * main par l'admin). Exécuté dans la transaction fournie, avec verrou de ligne.
 */
async function recomputeSessionStatut(
  tx: TransactionSql,
  sessionId: string,
): Promise<void> {
  const [session] = await tx<{ capacite: number; statut: string }[]>`
    select capacite, statut from sessions where id = ${sessionId} for update
  `;
  if (!session) return;

  const [{ confirmes }] = await tx<{ confirmes: number }[]>`
    select count(*)::int as confirmes
    from inscriptions
    where session_id = ${sessionId} and statut = 'confirme'
  `;

  const capacite = Number(session.capacite);
  if (session.statut === "publiee" && Number(confirmes) >= capacite) {
    await tx`update sessions set statut = 'complete' where id = ${sessionId}`;
  } else if (session.statut === "complete" && Number(confirmes) < capacite) {
    await tx`update sessions set statut = 'publiee' where id = ${sessionId}`;
  }
}

/**
 * Change le statut d'une inscription et réévalue le statut de sa session
 * (bascule complete ↔ publiee selon les places). Transaction + verrou de ligne.
 */
export async function updateInscriptionStatut(
  id: string,
  statut: "confirme" | "attente" | "annule",
): Promise<void> {
  const sql = getSql();
  await sql.begin(async (tx) => {
    const [row] = await tx<{ session_id: string | null }[]>`
      update inscriptions set statut = ${statut}
      where id = ${id}
      returning session_id
    `;
    if (row?.session_id) await recomputeSessionStatut(tx, row.session_id);
  });
}

/**
 * Supprime définitivement une inscription (droit à l'effacement, CDC §7.6) et
 * réévalue le statut de sa session (place éventuellement libérée).
 */
export async function deleteInscription(id: string): Promise<void> {
  const sql = getSql();
  await sql.begin(async (tx) => {
    const [row] = await tx<{ session_id: string | null }[]>`
      delete from inscriptions where id = ${id} returning session_id
    `;
    if (row?.session_id) await recomputeSessionStatut(tx, row.session_id);
  });
}
