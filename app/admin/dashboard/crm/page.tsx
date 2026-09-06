import type { Metadata } from "next";
import Link from "next/link";
import { ContactsList } from "@/components/admin/ContactsList";
import { EtapeBadge } from "@/components/admin/crm-badges";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { Button } from "@/components/ui/Button";
import { listContacts, type ContactRow } from "@/lib/admin-queries";
import {
  getPipelineStats,
  listOpportunitesEnCours,
  type OpportuniteRow,
  type PipelineEtape,
} from "@/lib/crm";
import { formatEuros, libelleRelance } from "@/lib/crm-display";

export const metadata: Metadata = {
  title: "CRM · Administration Marssane",
};

/**
 * Module CRM (ERP · Lot 1, cadrage §4.B) : pipeline par étape, opportunités en
 * cours avec leur prochaine relance, et demandes de contact du site (avec
 * conversion en fiche). Maquette validée le 23/08/2026.
 */

const TH =
  "whitespace-nowrap px-4 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft";

/** Étapes actives du strip, dans l'ordre du pipeline. */
const STRIP: { etape: string; titre: string }[] = [
  { etape: "contact", titre: "Contact" },
  { etape: "echange", titre: "Échange" },
  { etape: "proposition", titre: "Proposition" },
  { etape: "gagnee", titre: "Gagnées · année" },
  { etape: "perdue", titre: "Perdues · année" },
];

function statsParEtape(stats: PipelineEtape[]): Record<string, PipelineEtape> {
  const index: Record<string, PipelineEtape> = {};
  for (const s of stats) index[s.etape] = s;
  return index;
}

/** Cellule « prochaine relance » d'une opportunité. */
function RelanceCell({ row }: { row: OpportuniteRow }) {
  if (!row.relance_at) {
    return <span className="text-quiet">À planifier</span>;
  }
  const libelle = libelleRelance(row.relance_at);
  const enRetard = libelle === "En retard";
  const contenu = row.relance_contenu
    ? row.relance_contenu.length > 60
      ? `${row.relance_contenu.slice(0, 60).trimEnd()}…`
      : row.relance_contenu
    : null;
  return (
    <span className={enRetard ? "text-ink-clay" : "text-body"}>
      <span className="font-semibold">{libelle}</span>
      {contenu && <span className="text-soft"> — {contenu}</span>}
    </span>
  );
}

export default async function AdminCrmPage() {
  let stats: PipelineEtape[] | null;
  let opportunites: OpportuniteRow[] | null;
  try {
    [stats, opportunites] = await Promise.all([
      getPipelineStats(),
      listOpportunitesEnCours(),
    ]);
  } catch {
    console.error("[admin] module crm : base indisponible");
    stats = null;
    opportunites = null;
  }

  // Demandes de contact : chargées à part, avec repli propre (table plus
  // ancienne — elle peut être disponible même si la migration 010 manque).
  let contacts: ContactRow[] | null;
  try {
    contacts = await listContacts();
  } catch {
    console.error("[admin] demandes de contact : base indisponible");
    contacts = null;
  }

  const index = stats ? statsParEtape(stats) : {};

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em]">
          CRM
        </h1>
        <Button href="/admin/dashboard/crm/personnes/new" chevron>
          Ajouter un contact
        </Button>
      </div>

      {stats === null || opportunites === null ? (
        <div className="space-y-3">
          <DbUnavailable />
          <p className="text-[13.5px] leading-[1.5] text-soft">
            Si le site fonctionne par ailleurs, la migration 010 n&apos;est
            probablement pas appliquée : lancez <code>npm run db:migrate</code>.
          </p>
        </div>
      ) : (
        <>
          {/* Pipeline par étape (maquette : 5 cartes). */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {STRIP.map(({ etape, titre }) => {
              const s = index[etape];
              const nb = s?.nb ?? 0;
              const montant = Number(s?.montant ?? 0);
              const nombreClasse =
                etape === "gagnee"
                  ? "text-ink-ecume"
                  : etape === "perdue"
                    ? "text-quiet"
                    : "text-ink";
              return (
                <div
                  key={etape}
                  className="flex flex-col gap-2.5 rounded-card border border-hairline bg-surface px-[18px] py-4 shadow-card"
                >
                  <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-quiet">
                    {titre}
                  </span>
                  <span
                    className={`font-mono text-[24px] font-semibold leading-none ${nombreClasse}`}
                  >
                    {nb}
                  </span>
                  <span className="font-mono text-[12px] text-soft">
                    {etape === "perdue" || montant === 0
                      ? "—"
                      : `${formatEuros(montant)} est.`}
                  </span>
                </div>
              );
            })}
          </section>

          {/* Opportunités en cours. */}
          <section className="space-y-4">
            <div className="flex items-baseline gap-3">
              <h2 className="text-[19px] font-bold tracking-[-0.01em]">
                Opportunités en cours
              </h2>
              <span className="font-mono text-[13px] text-faint">
                {opportunites.length}
              </span>
            </div>
            {opportunites.length === 0 ? (
              <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
                Aucune opportunité en cours. Ajoutez un contact, puis ouvrez sa
                fiche pour créer la première.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-card border border-hairline bg-surface shadow-card">
                <table className="w-full min-w-[880px] border-collapse">
                  <thead>
                    <tr className="border-b border-hairline">
                      <th className={TH}>Personne</th>
                      <th className={TH}>Entreprise</th>
                      <th className={TH}>Étape</th>
                      <th className={`${TH} text-right`}>Montant est.</th>
                      <th className={TH}>Prochaine relance</th>
                      <th className={`${TH} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunites.map((op) => (
                      <tr
                        key={op.id}
                        className="border-b border-hairline align-middle last:border-0 hover:bg-toile/60"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-[14px] font-semibold text-ink">
                          {op.personne_prenom} {op.personne_nom}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-[14px] text-body">
                          {op.organisation_nom ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <EtapeBadge etape={op.etape} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-[13px] text-body">
                          {op.montant_estime
                            ? formatEuros(op.montant_estime)
                            : "—"}
                        </td>
                        <td className="max-w-[300px] truncate px-4 py-3 text-[13.5px]">
                          <RelanceCell row={op} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Link
                            href={`/admin/dashboard/crm/personnes/${op.personne_id}`}
                            className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
                          >
                            Ouvrir
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {/* Demandes de contact du site (F4) : conversion en fiche CRM. */}
      <section className="space-y-4 border-t border-hairline pt-8">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[19px] font-bold tracking-[-0.01em]">
            Demandes de contact du site
          </h2>
          {contacts && (
            <span className="font-mono text-[13px] text-faint">
              {contacts.length}
            </span>
          )}
        </div>
        <p className="max-w-[640px] text-[13.5px] leading-[1.5] text-soft">
          Demandes reçues via le formulaire « Aller plus loin ». « Créer la
          fiche » ajoute la personne au CRM avec une opportunité en étape
          Contact, et marque la demande comme traitée.
        </p>
        {contacts === null ? <DbUnavailable /> : <ContactsList rows={contacts} />}
      </section>
    </div>
  );
}
