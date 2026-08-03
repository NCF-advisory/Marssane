import type { NextRequest } from "next/server";
import { getSql } from "@/lib/db";
import { sendRappelsAValiderEmail } from "@/lib/emails";

/**
 * Rappels avant session (J-7 et J-1) : signalement à l'administrateur.
 *
 * Route CRON quotidienne (voir vercel.json) : une seule passe couvre les deux
 * échéances. Depuis l'incident du 03/08/2026, le cron ne contacte plus jamais
 * les inscrits — il repère les rappels prêts à partir et prévient
 * l'administrateur (`CONTACT_EMAIL`), qui valide et déclenche l'envoi depuis le
 * détail de la session (`envoyerRappels`).
 *
 * Sont repérées les sessions `publiee`/`complete` dont la date vaut exactement
 * `current_date + 7` ou `current_date + 1`, et leurs inscrits `confirme` dont le
 * rappel de ce type n'est pas déjà enregistré dans `emails_envoyes` (rappel
 * tracé = rappel parti). Une notification par (session, échéance) ; aucune si
 * plus personne n'est en attente.
 *
 * Motivation des rappels : la formation exige un abonnement Claude Pro payant,
 * actif le jour J. Le rappel J-7 laisse le temps d'agir ; le J-1 est un simple
 * pense-bête.
 *
 * Protégée par `Authorization: Bearer ${CRON_SECRET}` (en-tête que Vercel Cron
 * envoie automatiquement). Sans clé configurée ou en-tête invalide → 401.
 * Ni la notification ni la réponse JSON ne portent de donnée personnelle : le
 * décompte et la session, rien d'autre (RGPD).
 *
 * Runtime nodejs (client postgres). Jamais mise en cache.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * URL de base pour le lien vers l'admin (même variable que le sitemap). Défaut
 * en production plutôt que localhost : la notification n'est émise que par le
 * cron, et son lien doit rester cliquable depuis une boîte mail.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marssane.fr";

/** Échéance de rappels d'une session, avec son nombre de destinataires. */
type Echeance = {
  session_id: string;
  /** Nombre de jours avant la session : 7 ou 1. */
  jours: number;
  date: string;
  /** Inscrits confirmés dont le rappel n'est pas encore parti. */
  en_attente: number;
};

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Non autorisé.", { status: 401 });
  }

  const sql = getSql();

  const echeances = await sql<Echeance[]>`
    select
      s.id as session_id,
      (s.date - current_date)::int as jours,
      to_char(s.date, 'YYYY-MM-DD') as date,
      count(*)::int as en_attente
    from inscriptions i
    join sessions s on s.id = i.session_id
    where s.statut in ('publiee', 'complete')
      -- Jamais de rappel pour une session sans date arrêtée (migration 008).
      and s.date is not null
      and s.date in (current_date + 7, current_date + 1)
      and i.statut = 'confirme'
      -- Un rappel déjà tracé est un rappel parti : la personne n'est plus en attente.
      and not exists (
        select 1 from emails_envoyes e
        where e.inscription_id = i.id
          and e.type = case
            when s.date = current_date + 7 then 'rappel_j7'
            else 'rappel_j1'
          end
      )
    group by s.id, s.date
    order by s.date asc
  `;

  let destinataires = 0;
  let notifications = 0;
  let echecs = 0;

  for (const echeance of echeances) {
    destinataires += echeance.en_attente;

    const envoyee = await sendRappelsAValiderEmail({
      variante: Number(echeance.jours) === 7 ? "j7" : "j1",
      date: echeance.date,
      enAttente: echeance.en_attente,
      sessionUrl: `${SITE_URL}/admin/dashboard/sessions/${echeance.session_id}`,
    });
    if (envoyee) notifications += 1;
    else echecs += 1;
  }

  return Response.json({
    sessions: echeances.length,
    destinataires,
    notifications,
    echecs,
  });
}
