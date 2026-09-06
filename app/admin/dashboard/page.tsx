import type { Metadata } from "next";
import Link from "next/link";
import { FactureStatutBadge, RelanceBadge } from "@/components/admin/crm-badges";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import {
  getWaitlistGenerale,
  listSessionsWithCounts,
  type SessionRow,
} from "@/lib/admin-queries";
import {
  countRelancesDues,
  getArgentStats,
  getPipelineStats,
  listFacturesASuivre,
  listRelancesAFaire,
  type ArgentStats,
  type FactureSuivi,
  type PipelineEtape,
  type RelanceRow,
} from "@/lib/crm";
import {
  formatDateRelance,
  formatEuros,
  libelleRelance,
  moisEnCours,
} from "@/lib/crm-display";
import { formatDateLongue } from "@/lib/session-display";

export const metadata: Metadata = {
  title: "Tableau de bord · Administration Marssane",
};

/**
 * Tableau de bord de pilotage (ERP · Lot 1, cadrage §4.A, maquette validée le
 * 23/08/2026) : trois blocs — pipeline commercial, sessions & remplissage,
 * argent — puis deux listes d'action (relances à faire, factures à suivre).
 * Pas de bloc conformité (décision du 23/08/2026).
 *
 * Chaque famille de données est chargée avec son propre repli : un incident
 * sur les tables CRM (migration 010 absente) ne masque pas les sessions.
 */

const EYEBROW =
  "font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-quiet";
const CARD =
  "rounded-card border border-hairline bg-surface shadow-card";
const SEEMORE =
  "font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark";

/** Clé de tri : une session sans date compte comme la plus lointaine à venir. */
function cleDate(session: SessionRow): string {
  return session.date ?? "9999-12-31";
}

/** Prochaine session publiée / complète à venir. */
function prochaineSession(sessions: SessionRow[]): SessionRow | null {
  const today = new Date().toISOString().slice(0, 10);
  return (
    sessions
      .filter(
        (s) =>
          (s.statut === "publiee" || s.statut === "complete") &&
          cleDate(s) >= today,
      )
      .sort((a, b) => cleDate(a).localeCompare(cleDate(b)))[0] ?? null
  );
}

/** Répartition « Contact 3 · Échange 2 · Proposition 2 » (étapes actives). */
function repartition(stats: PipelineEtape[]): string {
  const index: Record<string, number> = {};
  for (const s of stats) index[s.etape] = s.nb;
  return [
    `Contact ${index.contact ?? 0}`,
    `Échange ${index.echange ?? 0}`,
    `Proposition ${index.proposition ?? 0}`,
  ].join(" · ");
}

export default async function AdminDashboardPage() {
  // Bloc sessions (tables historiques).
  let prochaine: SessionRow | null = null;
  let attenteGenerale = 0;
  let sessionsOk = true;
  try {
    const [sessions, waitlist] = await Promise.all([
      listSessionsWithCounts(),
      getWaitlistGenerale(),
    ]);
    prochaine = prochaineSession(sessions);
    attenteGenerale = waitlist.length;
  } catch {
    console.error("[admin] tableau de bord : sessions indisponibles");
    sessionsOk = false;
  }

  // Bloc pipeline + relances (tables CRM, migration 010).
  let pipeline: PipelineEtape[] | null = null;
  let relancesDues = 0;
  let relances: RelanceRow[] = [];
  try {
    [pipeline, relancesDues, relances] = await Promise.all([
      getPipelineStats(),
      countRelancesDues(),
      listRelancesAFaire(4),
    ]);
  } catch {
    console.error("[admin] tableau de bord : tables CRM indisponibles");
    pipeline = null;
  }

  // Bloc argent (tables facturation, migration 010 — module au Lot 2).
  let argent: ArgentStats | null = null;
  let factures: FactureSuivi[] = [];
  try {
    [argent, factures] = await Promise.all([
      getArgentStats(),
      listFacturesASuivre(4),
    ]);
  } catch {
    console.error("[admin] tableau de bord : tables facturation indisponibles");
    argent = null;
  }

  const enCours = pipeline
    ? pipeline
        .filter((s) => ["contact", "echange", "proposition"].includes(s.etape))
        .reduce((somme, s) => somme + s.nb, 0)
    : 0;

  const toutIndisponible = !sessionsOk && pipeline === null && argent === null;

  return (
    <div className="space-y-10">
      <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em]">
        Tableau de bord
      </h1>

      {toutIndisponible ? (
        <DbUnavailable />
      ) : (
        <>
          {/* Les 3 blocs de pilotage. */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Pipeline commercial */}
            <div className={`${CARD} flex flex-col gap-3.5 px-6 py-5`}>
              <span className={EYEBROW}>Pipeline commercial</span>
              {pipeline === null ? (
                <p className="text-[13.5px] leading-[1.5] text-soft">
                  Tables CRM indisponibles — appliquez la migration :{" "}
                  <code>npm run db:migrate</code>.
                </p>
              ) : (
                <>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[34px] font-semibold leading-none">
                      {enCours}
                    </span>
                    <span className="text-[14px] text-body">
                      opportunité{enCours > 1 ? "s" : ""} en cours
                    </span>
                  </div>
                  <div className="h-px bg-hairline" />
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/admin/dashboard/crm"
                      className="text-[13.5px] font-semibold text-canard transition-colors hover:text-canard-dark"
                    >
                      {relancesDues > 0
                        ? `${relancesDues} relance${relancesDues > 1 ? "s" : ""} à faire aujourd'hui`
                        : "Aucune relance due aujourd'hui"}
                    </Link>
                    <span className="font-mono text-[12px] text-soft">
                      {repartition(pipeline)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Sessions & remplissage */}
            <div className={`${CARD} flex flex-col gap-3.5 px-6 py-5`}>
              <span className={EYEBROW}>Sessions &amp; remplissage</span>
              {!sessionsOk ? (
                <p className="text-[13.5px] leading-[1.5] text-soft">
                  Base indisponible.
                </p>
              ) : prochaine ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[34px] font-semibold leading-none text-ink-ecume">
                      {prochaine.confirme}
                    </span>
                    <span className="font-mono text-[20px] leading-none text-quiet">
                      / {prochaine.capacite}
                    </span>
                    <span className="text-[14px] text-body">
                      inscrits confirmés
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-[3px] bg-bar-track">
                    <div
                      className="h-1.5 rounded-[3px] bg-canard"
                      style={{
                        width: `${Math.min(100, Math.round((prochaine.confirme / Math.max(1, prochaine.capacite)) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/admin/dashboard/sessions"
                      className="text-[13.5px] text-body transition-colors hover:text-ink"
                    >
                      Session{" "}
                      <span className="font-semibold text-ink">
                        {prochaine.date
                          ? `du ${formatDateLongue(prochaine.date)}`
                          : "à définir"}
                      </span>
                      {prochaine.lieu ? ` · ${prochaine.lieu}` : ""}
                    </Link>
                    <span className="font-mono text-[12px] text-soft">
                      {attenteGenerale} en liste d&apos;attente générale
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-[13.5px] leading-[1.5] text-soft">
                  Aucune session publiée à venir.{" "}
                  <Link href="/admin/dashboard/sessions" className={SEEMORE}>
                    Créer une session →
                  </Link>
                </p>
              )}
            </div>

            {/* Argent */}
            <div className={`${CARD} flex flex-col gap-3.5 px-6 py-5`}>
              <span className={EYEBROW}>Argent</span>
              {argent === null ? (
                <p className="text-[13.5px] leading-[1.5] text-soft">
                  Tables facturation indisponibles — appliquez la migration :{" "}
                  <code>npm run db:migrate</code>.
                </p>
              ) : (
                <>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[34px] font-semibold leading-none">
                      {formatEuros(argent.encaisse_mois)}
                    </span>
                    <span className="text-[14px] text-body">
                      encaissés en {moisEnCours()}
                    </span>
                  </div>
                  <div className="h-px bg-hairline" />
                  <div className="flex flex-col gap-2">
                    <span className="text-[13.5px] text-body">
                      En attente{" "}
                      <span className="font-mono font-semibold">
                        {formatEuros(argent.attente_montant)}
                      </span>{" "}
                      · {argent.attente_nb} facture
                      {argent.attente_nb > 1 ? "s" : ""}
                    </span>
                    <span
                      className={`text-[13.5px] ${argent.retard_nb > 0 ? "text-ink-clay" : "text-body"}`}
                    >
                      En retard{" "}
                      <span className="font-mono font-semibold">
                        {formatEuros(argent.retard_montant)}
                      </span>{" "}
                      · {argent.retard_nb} facture
                      {argent.retard_nb > 1 ? "s" : ""}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Listes d'action. */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Relances à faire */}
            <div className={`${CARD} flex flex-col px-6 py-5`}>
              <div className="flex items-baseline justify-between pb-2.5">
                <h2 className="text-[16px] font-bold tracking-[-0.01em]">
                  Relances à faire
                </h2>
                <Link href="/admin/dashboard/crm" className={SEEMORE}>
                  Tout le pipeline →
                </Link>
              </div>
              {pipeline === null ? (
                <p className="py-3 text-[13.5px] text-soft">
                  Tables CRM indisponibles.
                </p>
              ) : relances.length === 0 ? (
                <p className="py-3 text-[13.5px] text-soft">
                  Aucune relance planifiée. Consignez vos échanges dans le CRM
                  pour ne rien laisser filer.
                </p>
              ) : (
                relances.map((r) => (
                  <Link
                    key={r.activite_id}
                    href={`/admin/dashboard/crm/personnes/${r.personne_id}`}
                    className="flex items-center justify-between gap-4 border-b border-hairline py-3 last:border-0 hover:bg-toile/40"
                  >
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-[14px] font-semibold text-ink">
                        {r.prenom} {r.nom}
                        {r.organisation_nom ? ` · ${r.organisation_nom}` : ""}
                      </span>
                      <span className="truncate text-[13px] text-soft">
                        {r.contenu ?? formatDateRelance(r.relance_at)}
                      </span>
                    </span>
                    <RelanceBadge
                      libelle={libelleRelance(r.relance_at)}
                      enRetard={r.en_retard}
                    />
                  </Link>
                ))
              )}
            </div>

            {/* Factures à suivre */}
            <div className={`${CARD} flex flex-col px-6 py-5`}>
              <div className="flex items-baseline justify-between pb-2.5">
                <h2 className="text-[16px] font-bold tracking-[-0.01em]">
                  Factures à suivre
                </h2>
                <Link href="/admin/dashboard/facturation" className={SEEMORE}>
                  Toutes les factures →
                </Link>
              </div>
              {argent === null ? (
                <p className="py-3 text-[13.5px] text-soft">
                  Tables facturation indisponibles.
                </p>
              ) : factures.length === 0 ? (
                <p className="py-3 text-[13.5px] text-soft">
                  Aucune facture émise pour le moment — le module Facturation
                  arrive au Lot 2.
                </p>
              ) : (
                factures.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between gap-4 border-b border-hairline py-3 last:border-0"
                  >
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate font-mono text-[13px] font-semibold text-ink">
                        {f.numero ?? "—"}
                        {f.organisation_nom ? ` · ${f.organisation_nom}` : ""}
                      </span>
                      <span className="truncate text-[13px] text-soft">
                        {f.date_echeance
                          ? `Échéance le ${formatDateRelance(f.date_echeance)}`
                          : "Sans échéance"}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[13.5px] font-semibold">
                        {formatEuros(f.montant_ttc)}
                      </span>
                      <FactureStatutBadge statut={f.statut} />
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
