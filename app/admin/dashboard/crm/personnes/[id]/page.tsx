import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createActiviteAction,
  createOpportuniteAction,
  relanceFaiteAction,
  updateOpportuniteEtapeAction,
} from "@/app/admin/dashboard/crm/actions";
import { ActiviteForm } from "@/components/admin/ActiviteForm";
import { EtapeBadge, RelanceBadge } from "@/components/admin/crm-badges";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { OpportuniteForm } from "@/components/admin/OpportuniteForm";
import {
  ACTIVITE_TYPE_LABELS,
  ETAPE_LABELS,
  getPersonne,
  listActivitesByPersonne,
  listOpportunitesByPersonne,
  ROLE_LABELS,
  type ActiviteRow,
  type OpportuniteRow,
  type PersonneRow,
} from "@/lib/crm";
import { formatEuros, libelleRelance } from "@/lib/crm-display";
import { ETAPES } from "@/lib/crm-validation";
import { parseId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Fiche contact · Administration Marssane",
};

/**
 * Fiche personne (CRM · Lot 1, cadrage §4.B) : coordonnées, opportunités avec
 * passage d'étape, journal d'activités et relances. Les formulaires d'ajout
 * sont repliés dans des <details> natifs (sans JS, accessibles).
 */

const CHIP_NEUTRE =
  "inline-flex items-center rounded-chip border border-outline bg-toile px-[9px] py-[4px] font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-body";

/** Ligne d'information de la carte coordonnées. */
function InfoLigne({ label, valeur }: { label: string; valeur: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-quiet">
        {label}
      </span>
      <span className="text-[14px] text-body">{valeur || "—"}</span>
    </div>
  );
}

export default async function PersonnePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();

  let personne: PersonneRow | null;
  let opportunites: OpportuniteRow[];
  let activites: ActiviteRow[];
  try {
    [personne, opportunites, activites] = await Promise.all([
      getPersonne(id),
      listOpportunitesByPersonne(id),
      listActivitesByPersonne(id),
    ]);
  } catch {
    console.error("[admin] fiche personne : base indisponible");
    return (
      <div className="space-y-8">
        <Link
          href="/admin/dashboard/crm"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← CRM
        </Link>
        <DbUnavailable />
      </div>
    );
  }

  if (!personne) notFound();

  const relancesEnAttente = activites.filter(
    (a) => a.relance_at && !a.relance_faite,
  );

  return (
    <div className="space-y-12">
      {/* En-tete */}
      <div className="space-y-4">
        <Link
          href="/admin/dashboard/crm"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← CRM
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
            {personne.prenom} {personne.nom}
          </h1>
          {personne.roles.map((role) => (
            <span key={role} className={CHIP_NEUTRE}>
              {ROLE_LABELS[role] ?? role}
            </span>
          ))}
        </div>
        {(personne.organisation_nom || personne.fonction) && (
          <p className="text-[14px] text-soft">
            {[personne.fonction, personne.organisation_nom]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </div>

      {/* Coordonnees */}
      <section className="rounded-card border border-hairline bg-surface px-6 py-5 shadow-card">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
          <InfoLigne label="Email" valeur={personne.email} />
          <InfoLigne label="Téléphone" valeur={personne.telephone} />
          <InfoLigne label="Entreprise" valeur={personne.organisation_nom} />
          <InfoLigne label="Source" valeur={personne.source} />
          <InfoLigne label="Fiche créée le" valeur={personne.created_at} />
        </div>
        {personne.notes && (
          <div className="mt-5 border-t border-hairline pt-4">
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-quiet">
              Notes
            </span>
            <p className="mt-1.5 whitespace-pre-wrap text-[13.5px] leading-[1.55] text-body">
              {personne.notes}
            </p>
          </div>
        )}
      </section>

      {/* Opportunites */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[19px] font-bold tracking-[-0.01em]">
            Opportunités
          </h2>
          <span className="font-mono text-[13px] text-faint">
            {opportunites.length}
          </span>
        </div>

        {opportunites.length === 0 ? (
          <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
            Aucune opportunité pour cette personne.
          </p>
        ) : (
          <div className="space-y-3">
            {opportunites.map((op) => (
              <div
                key={op.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-hairline bg-surface px-5 py-4 shadow-card"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="text-[14.5px] font-semibold text-ink">
                    {op.titre ?? "Opportunité"}
                  </span>
                  <span className="flex items-center gap-3">
                    <EtapeBadge etape={op.etape} />
                    <span className="font-mono text-[13px] text-body">
                      {op.montant_estime ? formatEuros(op.montant_estime) : "—"}
                    </span>
                  </span>
                </div>
                {/* Passage d'étape : form simple, sans JS. */}
                <form
                  action={updateOpportuniteEtapeAction}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="id" value={op.id} />
                  <input type="hidden" name="personne_id" value={personne.id} />
                  <label className="sr-only" htmlFor={`etape-${op.id}`}>
                    Nouvelle étape
                  </label>
                  <select
                    id={`etape-${op.id}`}
                    name="etape"
                    defaultValue={op.etape}
                    className="rounded-btn border-[1.5px] border-outline bg-surface px-3 py-2 text-[13.5px] text-ink focus:border-canard focus:outline-none focus:ring-2 focus:ring-canard/20"
                  >
                    {ETAPES.map((value) => (
                      <option key={value} value={value}>
                        {ETAPE_LABELS[value]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-btn border-[1.5px] border-outline bg-surface px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-toile"
                  >
                    Changer
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <details className="rounded-card border border-hairline bg-surface px-5 py-4 shadow-card">
          <summary className="cursor-pointer list-none font-mono text-[12px] font-medium text-canard [&::-webkit-details-marker]:hidden">
            + Nouvelle opportunité
          </summary>
          <div className="mt-4 max-w-[560px]">
            <OpportuniteForm
              action={createOpportuniteAction.bind(null, personne.id)}
            />
          </div>
        </details>
      </section>

      {/* Activites & relances */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[19px] font-bold tracking-[-0.01em]">
            Activités &amp; relances
          </h2>
          <span className="font-mono text-[13px] text-faint">
            {activites.length}
          </span>
          {relancesEnAttente.length > 0 && (
            <span className="font-mono text-[12px] text-soft">
              · {relancesEnAttente.length} relance
              {relancesEnAttente.length > 1 ? "s" : ""} en attente
            </span>
          )}
        </div>

        <details
          className="rounded-card border border-hairline bg-surface px-5 py-4 shadow-card"
          open={activites.length === 0}
        >
          <summary className="cursor-pointer list-none font-mono text-[12px] font-medium text-canard [&::-webkit-details-marker]:hidden">
            + Consigner un échange / planifier une relance
          </summary>
          <div className="mt-4 max-w-[560px]">
            <ActiviteForm action={createActiviteAction.bind(null, personne.id)} />
          </div>
        </details>

        {activites.length > 0 && (
          <div className="rounded-card border border-hairline bg-surface px-6 py-2 shadow-card">
            {activites.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-start justify-between gap-3 border-b border-hairline py-4 last:border-0"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-quiet">
                    {ACTIVITE_TYPE_LABELS[a.type] ?? a.type} · {a.effectue_at}
                  </span>
                  {a.contenu && (
                    <p className="whitespace-pre-wrap text-[13.5px] leading-[1.55] text-body">
                      {a.contenu}
                    </p>
                  )}
                </div>
                {a.relance_at && (
                  <div className="flex items-center gap-3">
                    {a.relance_faite ? (
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-quiet">
                        Relance faite
                      </span>
                    ) : (
                      <>
                        <RelanceBadge
                          libelle={libelleRelance(a.relance_at)}
                          enRetard={libelleRelance(a.relance_at) === "En retard"}
                        />
                        <form action={relanceFaiteAction} className="inline">
                          <input type="hidden" name="id" value={a.id} />
                          <input
                            type="hidden"
                            name="personne_id"
                            value={personne.id}
                          />
                          <button
                            type="submit"
                            className="rounded-btn px-2.5 py-1.5 font-mono text-[12px] font-medium text-canard transition-colors hover:bg-ecume hover:text-ink-ecume"
                          >
                            Relance faite
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
