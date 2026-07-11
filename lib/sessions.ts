import { getSql } from "./db";

/** Session publiée alimentant la landing (CDC §5.1), avec places restantes. */
export type ProchaineSession = {
  id: string;
  date: string;
  heure_debut: string | null;
  heure_fin: string | null;
  lieu: string | null;
  capacite: number;
  statut: string;
  places_restantes: number;
  /** `true` si la session est complète (statut ou plus aucune place). */
  complete: boolean;
};

/** Données d'une pré-inscription (déjà validées côté server action). */
export type InscriptionInput = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  metier: string;
  metier_autre?: string;
  entreprise?: string;
};

export type CreateInscriptionResult =
  | { ok: true; statut: "confirme" | "attente" }
  | { ok: false; code: "doublon" };

/**
 * Retourne la session `publiee`/`complete` la plus proche à venir, avec le
 * nombre de places restantes (capacité − inscriptions confirmées). `null` s'il
 * n'y en a aucune (mode liste d'attente générale).
 */
export async function getProchaineSession(): Promise<ProchaineSession | null> {
  const sql = getSql();

  const rows = await sql<
    {
      id: string;
      date: string;
      heure_debut: string | null;
      heure_fin: string | null;
      lieu: string | null;
      capacite: number;
      statut: string;
      places_restantes: number;
    }[]
  >`
    select
      s.id,
      to_char(s.date, 'YYYY-MM-DD') as date,
      s.heure_debut,
      s.heure_fin,
      s.lieu,
      s.capacite,
      s.statut,
      (s.capacite - coalesce(c.confirmes, 0)) as places_restantes
    from sessions s
    left join (
      select session_id, count(*)::int as confirmes
      from inscriptions
      where statut = 'confirme'
      group by session_id
    ) c on c.session_id = s.id
    where s.statut in ('publiee', 'complete')
      and s.date >= current_date
    order by s.date asc, s.heure_debut asc nulls last
    limit 1
  `;

  const row = rows[0];
  if (!row) return null;

  const placesRestantes = Math.max(0, Number(row.places_restantes));

  return {
    id: row.id,
    date: row.date,
    heure_debut: row.heure_debut,
    heure_fin: row.heure_fin,
    lieu: row.lieu,
    capacite: Number(row.capacite),
    statut: row.statut,
    places_restantes: placesRestantes,
    complete: row.statut === "complete" || placesRestantes <= 0,
  };
}

/**
 * Enregistre une pré-inscription (CDC §5.2). Transaction avec verrou
 * `FOR UPDATE` sur la ligne session : sérialise le calcul des places pour
 * éviter la course à la dernière place (deux 10ᵉ inscriptions simultanées).
 *
 * Statut retenu : `confirme` si une session est publiée et non complète et
 * qu'il reste de la place ; sinon `attente` (capacité atteinte, session déjà
 * complète, ou aucune session publiée → liste d'attente).
 *
 * Si la capacité est atteinte après cette inscription, la session bascule en
 * `complete`. Un doublon (email déjà inscrit sur la même session, ou déjà en
 * liste d'attente générale) est renvoyé de façon typée, sans exception fuitée.
 */
export async function createInscription(
  data: InscriptionInput,
): Promise<CreateInscriptionResult> {
  const sql = getSql();

  try {
    const statut = await sql.begin(async (tx) => {
      // Verrou sur la session la plus proche (le cas échéant).
      const sessions = await tx<
        { id: string; capacite: number; statut: string }[]
      >`
        select id, capacite, statut
        from sessions
        where statut in ('publiee', 'complete')
          and date >= current_date
        order by date asc, heure_debut asc nulls last
        limit 1
        for update
      `;

      const session = sessions[0] ?? null;
      let sessionId: string | null = null;
      let statutInscription: "confirme" | "attente" = "attente";

      if (session) {
        sessionId = session.id;
        const [{ confirmes }] = await tx<{ confirmes: number }[]>`
          select count(*)::int as confirmes
          from inscriptions
          where session_id = ${session.id} and statut = 'confirme'
        `;
        const capacite = Number(session.capacite);
        if (session.statut === "publiee" && Number(confirmes) < capacite) {
          statutInscription = "confirme";
        }
      }

      await tx`
        insert into inscriptions
          (session_id, prenom, nom, email, telephone, metier, metier_autre, entreprise, statut, consentement_at)
        values (
          ${sessionId},
          ${data.prenom},
          ${data.nom},
          ${data.email},
          ${data.telephone},
          ${data.metier},
          ${data.metier_autre || null},
          ${data.entreprise || null},
          ${statutInscription},
          now()
        )
      `;

      // Bascule la session en « complète » si la capacité est atteinte.
      if (session && statutInscription === "confirme") {
        const [{ confirmes }] = await tx<{ confirmes: number }[]>`
          select count(*)::int as confirmes
          from inscriptions
          where session_id = ${session.id} and statut = 'confirme'
        `;
        if (Number(confirmes) >= Number(session.capacite)) {
          await tx`
            update sessions set statut = 'complete' where id = ${session.id}
          `;
        }
      }

      return statutInscription;
    });

    return { ok: true, statut };
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
