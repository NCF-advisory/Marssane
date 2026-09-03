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
  /** Date ISO « YYYY-MM-DD », ou `null` : date à définir (migration 008). */
  date: string | null;
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
  date: string | null;
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
  /** Créneau souhaité (migration 012) ; `null` pour les inscriptions antérieures. */
  creneau: string | null;
  statut: string;
  created_at: string;
  /**
   * Statut du dernier email destiné à l'inscrit (`emails_envoyes`, hors
   * notification admin). `null` = aucun email tracé pour cette inscription.
   */
  email_statut: string | null;
};

/** Ligne d'inscription enrichie de la session rattachée (date ISO + lieu). */
export type InscriptionAvecSessionRow = InscriptionRow & {
  session_date: string | null;
  session_lieu: string | null;
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
 * plus récente à la plus ancienne (les sessions à venir en tête). Une session
 * sans date compte comme la plus lointaine : elle vient donc en tête.
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
    order by s.date desc nulls first, s.heure_debut desc nulls last
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

/**
 * Inscriptions rattachées à une session, de la plus récente à la plus ancienne.
 *
 * `email_statut` = statut du DERNIER email destiné à l'inscrit (type `admin`
 * exclu : la notification interne ne dit rien de ce que la personne a reçu).
 */
export async function getInscriptionsBySession(
  sessionId: string,
): Promise<InscriptionRow[]> {
  const sql = getSql();
  return sql<InscriptionRow[]>`
    select
      i.id, i.prenom, i.nom, i.email, i.telephone, i.metier, i.metier_autre,
      i.entreprise, i.creneau, i.statut,
      to_char(i.created_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI') as created_at,
      (
        select e.statut from emails_envoyes e
        where e.inscription_id = i.id and e.type <> 'admin'
        order by e.created_at desc
        limit 1
      ) as email_statut
    from inscriptions i
    where i.session_id = ${sessionId}
    order by i.created_at desc
  `;
}

/**
 * Toutes les inscriptions rattachées à une session, de la plus récente à la plus
 * ancienne, avec la date (ISO) et le lieu de leur session.
 */
export async function listInscriptionsAvecSession(): Promise<
  InscriptionAvecSessionRow[]
> {
  const sql = getSql();
  return sql<InscriptionAvecSessionRow[]>`
    select
      i.id, i.prenom, i.nom, i.email, i.telephone, i.metier, i.metier_autre,
      i.entreprise, i.creneau, i.statut,
      to_char(i.created_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI') as created_at,
      (
        select e.statut from emails_envoyes e
        where e.inscription_id = i.id and e.type <> 'admin'
        order by e.created_at desc
        limit 1
      ) as email_statut,
      to_char(s.date, 'YYYY-MM-DD') as session_date,
      s.lieu as session_lieu
    from inscriptions i
    join sessions s on s.id = i.session_id
    where i.session_id is not null
    order by i.created_at desc
  `;
}

/**
 * État des rappels d'une session, déduit de `emails_envoyes` : un rappel tracé
 * est un rappel parti, les autres inscrits confirmés sont « en attente ». Aucun
 * autre stockage — l'envoi est validé à la main depuis le détail de la session.
 */
export type RappelsEtat = {
  /** `true` si la session est datée et pas encore passée (date de la base). */
  aVenir: boolean;
  j7: { envoyes: number; enAttente: number };
  j1: { envoyes: number; enAttente: number };
};

/** Rappels déjà partis / restant à envoyer pour une session (J-7 et J-1). */
export async function getRappelsEtat(sessionId: string): Promise<RappelsEtat> {
  const sql = getSql();
  const rows = await sql<
    {
      a_venir: boolean;
      j7_envoyes: number;
      j7_attente: number;
      j1_envoyes: number;
      j1_attente: number;
    }[]
  >`
    select
      coalesce(s.date >= current_date, false) as a_venir,
      count(i.id) filter (where e7.id is not null)::int as j7_envoyes,
      count(i.id) filter (where e7.id is null)::int as j7_attente,
      count(i.id) filter (where e1.id is not null)::int as j1_envoyes,
      count(i.id) filter (where e1.id is null)::int as j1_attente
    from sessions s
    left join inscriptions i on i.session_id = s.id and i.statut = 'confirme'
    left join emails_envoyes e7
      on e7.inscription_id = i.id and e7.type = 'rappel_j7'
    left join emails_envoyes e1
      on e1.inscription_id = i.id and e1.type = 'rappel_j1'
    where s.id = ${sessionId}
    group by s.id, s.date
  `;
  const row = rows[0];
  if (!row) {
    return {
      aVenir: false,
      j7: { envoyes: 0, enAttente: 0 },
      j1: { envoyes: 0, enAttente: 0 },
    };
  }
  return {
    aVenir: row.a_venir,
    j7: { envoyes: row.j7_envoyes, enAttente: row.j7_attente },
    j1: { envoyes: row.j1_envoyes, enAttente: row.j1_attente },
  };
}

/** Destinataire possible d'un rappel (données nécessaires à l'e-mail). */
export type RappelCible = {
  inscription_id: string;
  prenom: string;
  email: string;
};

/** Inscrits confirmés d'une session, dans leur ordre d'inscription. */
export async function listConfirmesPourRappel(
  sessionId: string,
): Promise<RappelCible[]> {
  const sql = getSql();
  return sql<RappelCible[]>`
    select i.id as inscription_id, i.prenom, i.email
    from inscriptions i
    where i.session_id = ${sessionId} and i.statut = 'confirme'
    order by i.created_at asc
  `;
}

/** Inscriptions en liste d'attente générale (aucune session rattachée). */
export async function getWaitlistGenerale(): Promise<InscriptionRow[]> {
  const sql = getSql();
  return sql<InscriptionRow[]>`
    select
      i.id, i.prenom, i.nom, i.email, i.telephone, i.metier, i.metier_autre,
      i.entreprise, i.creneau, i.statut,
      to_char(i.created_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI') as created_at,
      (
        select e.statut from emails_envoyes e
        where e.inscription_id = i.id and e.type <> 'admin'
        order by e.created_at desc
        limit 1
      ) as email_statut
    from inscriptions i
    where i.session_id is null
    order by i.created_at desc
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
 * Détails de session nécessaires pour composer un e-mail (date ISO, horaires
 * « HH:MM », lieu). Vue réduite volontairement structurelle : la couche base
 * n'importe rien du rendu des emails.
 */
export type SessionEmailDetails = {
  /** `null` = date à définir : l'email n'annonce alors aucune date. */
  date: string | null;
  heure_debut: string | null;
  heure_fin: string | null;
  lieu: string | null;
};

/** Résultat d'un changement de statut : de quoi décider d'un envoi d'email. */
export type InscriptionStatutChange = {
  /** Statut avant l'écriture : égal à `statut` si l'admin a resoumis la même valeur. */
  statutPrecedent: string;
  statut: "confirme" | "attente" | "annule";
  prenom: string;
  email: string;
  sessionId: string | null;
  /** `null` si l'inscription n'est rattachée à aucune session. */
  session: SessionEmailDetails | null;
};

/** Lignes de détail d'une session, pour un email (date ISO + horaires courts). */
async function getSessionEmailDetails(
  tx: TransactionSql,
  sessionId: string,
): Promise<SessionEmailDetails | null> {
  const [row] = await tx<SessionEmailDetails[]>`
    select
      to_char(date, 'YYYY-MM-DD') as date,
      to_char(heure_debut, 'HH24:MI') as heure_debut,
      to_char(heure_fin, 'HH24:MI') as heure_fin,
      lieu
    from sessions
    where id = ${sessionId}
  `;
  return row ?? null;
}

/**
 * Change le statut d'une inscription et réévalue le statut de sa session
 * (bascule complete ↔ publiee selon les places). Transaction + verrou de ligne.
 *
 * Retourne l'ancien et le nouveau statut, plus l'identité et la session de
 * l'inscrit : l'appelant décide de l'envoi d'un email (promotion, annulation)
 * et ne l'envoie pas si le statut n'a pas changé. `null` si l'inscription
 * n'existe pas.
 */
export async function updateInscriptionStatut(
  id: string,
  statut: "confirme" | "attente" | "annule",
): Promise<InscriptionStatutChange | null> {
  const sql = getSql();
  return sql.begin(async (tx) => {
    const [avant] = await tx<
      { statut: string; session_id: string | null; prenom: string; email: string }[]
    >`
      select statut, session_id, prenom, email
      from inscriptions
      where id = ${id}
      for update
    `;
    if (!avant) return null;

    await tx`update inscriptions set statut = ${statut} where id = ${id}`;
    if (avant.session_id) await recomputeSessionStatut(tx, avant.session_id);

    return {
      statutPrecedent: avant.statut,
      statut,
      prenom: avant.prenom,
      email: avant.email,
      sessionId: avant.session_id,
      session: avant.session_id
        ? await getSessionEmailDetails(tx, avant.session_id)
        : null,
    };
  });
}

/** Session à laquelle on peut rattacher une inscription en attente générale. */
export type SessionRattachable = {
  id: string;
  /** Date ISO « YYYY-MM-DD », ou `null` : date à définir. */
  date: string | null;
  lieu: string | null;
  places_restantes: number;
};

/**
 * Sessions auxquelles une inscription peut être rattachée : `publiee` ou
 * `complete`, à venir (une session sans date en fait partie, en dernier), de la
 * plus proche à la plus lointaine. Une session complète reste proposée (le
 * rattachement se fera en liste d'attente de cette session, ce qui reste plus
 * utile que l'attente générale).
 */
export async function listSessionsRattachables(): Promise<SessionRattachable[]> {
  const sql = getSql();
  return sql<SessionRattachable[]>`
    select
      s.id,
      to_char(s.date, 'YYYY-MM-DD') as date,
      s.lieu,
      greatest(s.capacite - coalesce(c.confirmes, 0), 0)::int as places_restantes
    from sessions s
    left join (
      select session_id, count(*)::int as confirmes
      from inscriptions
      where statut = 'confirme'
      group by session_id
    ) c on c.session_id = s.id
    where s.statut in ('publiee', 'complete')
      and (s.date is null or s.date >= current_date)
    order by s.date asc nulls last, s.heure_debut asc nulls last
  `;
}

/** Résultat d'un rattachement à une session. */
export type RattachementResult =
  | {
      ok: true;
      /** Statut d'arrivée, même règle que l'inscription publique. */
      statut: "confirme" | "attente";
      prenom: string;
      email: string;
      session: SessionEmailDetails;
    }
  | {
      ok: false;
      /**
       * `introuvable` = inscription inconnue ; `deja_rattachee` = elle a déjà
       * une session ; `session_introuvable` = session inconnue ; `doublon` =
       * cet email est déjà inscrit à la session visée.
       */
      code: "introuvable" | "deja_rattachee" | "session_introuvable" | "doublon";
    };

/**
 * Rattache une inscription de la liste d'attente générale (`session_id is
 * null`) à une session. Transaction avec verrou `FOR UPDATE` sur la ligne
 * session : sérialise le calcul des places, comme `createInscription`.
 *
 * Statut d'arrivée : même règle que l'inscription publique (voir
 * `createInscription`) — `confirme` si la session est `publiee` et qu'il reste
 * de la place, `attente` sinon. La session est ensuite réévaluée (bascule en
 * `complete` si la capacité est atteinte).
 *
 * Les refus sont typés, sans exception fuitée : inscription inconnue, déjà
 * rattachée, session inconnue, ou email déjà inscrit à cette session
 * (violation de `inscriptions_session_email_uniq`).
 */
export async function rattacherInscriptionSession(
  inscriptionId: string,
  sessionId: string,
): Promise<RattachementResult> {
  const sql = getSql();

  try {
    return await sql.begin(async (tx): Promise<RattachementResult> => {
      const [session] = await tx<
        ({ capacite: number; statut: string } & SessionEmailDetails)[]
      >`
        select
          capacite,
          statut,
          to_char(date, 'YYYY-MM-DD') as date,
          to_char(heure_debut, 'HH24:MI') as heure_debut,
          to_char(heure_fin, 'HH24:MI') as heure_fin,
          lieu
        from sessions
        where id = ${sessionId}
        for update
      `;
      if (!session) return { ok: false, code: "session_introuvable" };

      const [inscription] = await tx<
        { session_id: string | null; prenom: string; email: string }[]
      >`
        select session_id, prenom, email
        from inscriptions
        where id = ${inscriptionId}
        for update
      `;
      if (!inscription) return { ok: false, code: "introuvable" };
      if (inscription.session_id) return { ok: false, code: "deja_rattachee" };

      const [{ confirmes }] = await tx<{ confirmes: number }[]>`
        select count(*)::int as confirmes
        from inscriptions
        where session_id = ${sessionId} and statut = 'confirme'
      `;
      const statut: "confirme" | "attente" =
        session.statut === "publiee" &&
        Number(confirmes) < Number(session.capacite)
          ? "confirme"
          : "attente";

      await tx`
        update inscriptions
        set session_id = ${sessionId}, statut = ${statut}
        where id = ${inscriptionId}
      `;
      await recomputeSessionStatut(tx, sessionId);

      return {
        ok: true,
        statut,
        prenom: inscription.prenom,
        email: inscription.email,
        session: {
          date: session.date,
          heure_debut: session.heure_debut,
          heure_fin: session.heure_fin,
          lieu: session.lieu,
        },
      };
    });
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, code: "doublon" };
    throw err;
  }
}

/** Violation de contrainte d'unicité Postgres (SQLSTATE 23505). */
function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"
  );
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
