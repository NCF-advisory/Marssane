import type { NextRequest } from "next/server";
import { getSql } from "@/lib/db";
import { sendRappelEmail } from "@/lib/emails";
import { rappelDejaEnvoye } from "@/lib/emails-log";

/**
 * Rappels avant session (J-7 et J-1).
 *
 * Route CRON quotidienne (voir vercel.json) : une seule passe traite les deux
 * échéances. Sont visées les sessions `publiee`/`complete` dont la date vaut
 * exactement `current_date + 7` ou `current_date + 1`, et leurs inscrits
 * `confirme`. Un rappel déjà enregistré dans `emails_envoyes` est sauté — la
 * table (index unique partiel) garantit qu'un rappel ne part qu'une fois, même
 * si deux exécutions se chevauchent.
 *
 * Motivation : la formation exige un abonnement Claude Pro payant, actif le
 * jour J. Le rappel J-7 laisse le temps d'agir ; le J-1 est un simple
 * pense-bête.
 *
 * Protégée par `Authorization: Bearer ${CRON_SECRET}` (en-tête que Vercel Cron
 * envoie automatiquement). Sans clé configurée ou en-tête invalide → 401.
 * La réponse ne contient que des compteurs, aucune donnée personnelle (RGPD).
 *
 * Runtime nodejs (client postgres). Jamais mise en cache.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Inscrit à rappeler, avec les détails de sa session. */
type Cible = {
  inscription_id: string;
  session_id: string;
  prenom: string;
  email: string;
  /** Nombre de jours avant la session : 7 ou 1. */
  jours: number;
  date: string;
  heure_debut: string | null;
  heure_fin: string | null;
  lieu: string | null;
};

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Non autorisé.", { status: 401 });
  }

  const sql = getSql();

  const cibles = await sql<Cible[]>`
    select
      i.id as inscription_id,
      s.id as session_id,
      i.prenom,
      i.email,
      (s.date - current_date)::int as jours,
      to_char(s.date, 'YYYY-MM-DD') as date,
      to_char(s.heure_debut, 'HH24:MI') as heure_debut,
      to_char(s.heure_fin, 'HH24:MI') as heure_fin,
      s.lieu
    from inscriptions i
    join sessions s on s.id = i.session_id
    where s.statut in ('publiee', 'complete')
      and s.date in (current_date + 7, current_date + 1)
      and i.statut = 'confirme'
    order by s.date asc, i.created_at asc
  `;

  let envoyes = 0;
  let sautes = 0;
  let echecs = 0;

  for (const cible of cibles) {
    const variante = Number(cible.jours) === 7 ? "j7" : "j1";
    const type = variante === "j7" ? "rappel_j7" : "rappel_j1";

    if (await rappelDejaEnvoye(cible.inscription_id, type)) {
      sautes += 1;
      continue;
    }

    const envoye = await sendRappelEmail({
      inscriptionId: cible.inscription_id,
      email: cible.email,
      prenom: cible.prenom,
      variante,
      session: {
        date: cible.date,
        heure_debut: cible.heure_debut,
        heure_fin: cible.heure_fin,
        lieu: cible.lieu,
      },
    });
    if (envoye) envoyes += 1;
    else echecs += 1;
  }

  const sessions = new Set(cibles.map((c) => c.session_id)).size;
  return Response.json({ sessions, envoyes, sautes, echecs });
}
