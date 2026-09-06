import type { Metadata } from "next";
import Link from "next/link";
import {
  DevisStatutBadge,
  FactureStatutBadge,
} from "@/components/admin/crm-badges";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { Button } from "@/components/ui/Button";
import { formatEuros } from "@/lib/crm-display";
import {
  emetteurEstComplet,
  getEmetteur,
  getEncaisseAnnee,
  listDevis,
  listFactures,
  type DevisListRow,
  type EmetteurRow,
  type FactureListRow,
} from "@/lib/facturation";
import { formatDateLongue } from "@/lib/session-display";

export const metadata: Metadata = {
  title: "Facturation · Administration Marssane",
};

/**
 * Module Facturation (ERP · Lot 2, cadrage §4.C, maquette validée le
 * 23/08/2026) : repères chiffrés, liste des devis, liste des factures et
 * avoirs. L'émission est bloquée tant que les paramètres sont incomplets —
 * un bandeau le rappelle avec le lien vers la page Paramètres.
 */

const TH =
  "whitespace-nowrap px-4 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft";
const TD = "whitespace-nowrap px-4 py-3 text-[14px] text-body";

export default async function AdminFacturationPage() {
  let devis: DevisListRow[] | null;
  let factures: FactureListRow[] | null;
  let emetteur: EmetteurRow | null = null;
  let encaisseAnnee = "0";
  try {
    [devis, factures, emetteur, encaisseAnnee] = await Promise.all([
      listDevis(),
      listFactures(),
      getEmetteur(),
      getEncaisseAnnee(),
    ]);
  } catch {
    console.error("[admin] module facturation : base indisponible");
    devis = null;
    factures = null;
  }

  if (devis === null || factures === null) {
    return (
      <div className="space-y-8">
        <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em]">
          Facturation
        </h1>
        <DbUnavailable />
        <p className="text-[13.5px] leading-[1.5] text-soft">
          Si le site fonctionne par ailleurs, les migrations 010-011 ne sont
          probablement pas appliquées : lancez <code>npm run db:migrate</code>.
        </p>
      </div>
    );
  }

  const devisEnCours = devis.filter((d) => d.statut === "envoye");
  const devisEnCoursTotal = devisEnCours.reduce(
    (somme, d) => somme + Number(d.montant_ttc),
    0,
  );
  const enAttente = factures.filter((f) => f.statut === "emise");
  const enAttenteTotal = enAttente.reduce(
    (somme, f) => somme + Number(f.montant_ttc),
    0,
  );
  const enRetard = factures.filter((f) => f.statut === "en_retard");
  const enRetardTotal = enRetard.reduce(
    (somme, f) => somme + Number(f.montant_ttc),
    0,
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em]">
          Facturation
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/dashboard/facturation/parametres"
            className="inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
          >
            Paramètres
          </Link>
          <Link
            href="/admin/dashboard/facturation/factures/new"
            className="inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
          >
            Nouvelle facture
          </Link>
          <Button href="/admin/dashboard/facturation/devis/new" chevron>
            Nouveau devis
          </Button>
        </div>
      </div>

      {!emetteurEstComplet(emetteur) && (
        <div className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-ink-clay">
          Les paramètres de facturation sont incomplets (identité de
          l&apos;émetteur, régime de TVA) : les devis se préparent, mais aucune
          facture ne peut être émise.{" "}
          <Link
            href="/admin/dashboard/facturation/parametres"
            className="font-semibold underline underline-offset-2"
          >
            Compléter les paramètres
          </Link>
          {" "}— à valider avec votre comptable (cadrage §7).
        </div>
      )}

      {/* Reperes */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface px-6 py-5 shadow-card">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-quiet">
            Devis en cours
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[28px] font-semibold leading-none">
              {formatEuros(devisEnCoursTotal)}
            </span>
            <span className="text-[13.5px] text-soft">
              {devisEnCours.length} envoyé{devisEnCours.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface px-6 py-5 shadow-card">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-quiet">
            Factures en attente
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[28px] font-semibold leading-none">
              {formatEuros(enAttenteTotal + enRetardTotal)}
            </span>
            <span
              className={`text-[13.5px] ${enRetard.length > 0 ? "text-ink-clay" : "text-soft"}`}
            >
              {enRetard.length > 0
                ? `dont ${formatEuros(enRetardTotal)} en retard`
                : `${enAttente.length} facture${enAttente.length > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface px-6 py-5 shadow-card">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-quiet">
            Encaissé · {new Date().getFullYear()}
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[28px] font-semibold leading-none text-ink-ecume">
              {formatEuros(encaisseAnnee)}
            </span>
          </div>
        </div>
      </section>

      {/* Devis */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[19px] font-bold tracking-[-0.01em]">Devis</h2>
          <span className="font-mono text-[13px] text-faint">{devis.length}</span>
        </div>
        {devis.length === 0 ? (
          <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
            Aucun devis pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-hairline bg-surface shadow-card">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="border-b border-hairline">
                  <th className={TH}>Numéro</th>
                  <th className={TH}>Client</th>
                  <th className={TH}>Objet</th>
                  <th className={TH}>Émis le</th>
                  <th className={`${TH} text-right`}>Montant TTC</th>
                  <th className={TH}>Statut</th>
                  <th className={`${TH} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {devis.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-hairline align-middle last:border-0 hover:bg-toile/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] font-semibold text-ink">
                      {d.numero ?? "—"}
                    </td>
                    <td className={TD}>{d.organisation_nom ?? "—"}</td>
                    <td className="max-w-[240px] truncate px-4 py-3 text-[14px] text-body">
                      {d.objet ?? "—"}
                    </td>
                    <td className={TD}>
                      {d.date_emission ? formatDateLongue(d.date_emission) : "—"}
                    </td>
                    <td className={`${TD} text-right font-mono text-[13px]`}>
                      {formatEuros(d.montant_ttc)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <DevisStatutBadge statut={d.statut} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        href={`/admin/dashboard/facturation/devis/${d.id}`}
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

      {/* Factures */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[19px] font-bold tracking-[-0.01em]">
            Factures &amp; avoirs
          </h2>
          <span className="font-mono text-[13px] text-faint">
            {factures.length}
          </span>
        </div>
        {factures.length === 0 ? (
          <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
            Aucune facture pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-hairline bg-surface shadow-card">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="border-b border-hairline">
                  <th className={TH}>Numéro</th>
                  <th className={TH}>Client</th>
                  <th className={TH}>Émise le</th>
                  <th className={TH}>Échéance</th>
                  <th className={`${TH} text-right`}>Montant TTC</th>
                  <th className={TH}>Statut</th>
                  <th className={`${TH} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {factures.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-hairline align-middle last:border-0 hover:bg-toile/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] font-semibold text-ink">
                      {f.numero ?? "—"}
                      {f.type === "avoir" && (
                        <span className="ml-2 font-sans text-[11px] font-medium text-soft">
                          avoir
                        </span>
                      )}
                    </td>
                    <td className={TD}>{f.organisation_nom ?? "—"}</td>
                    <td className={TD}>
                      {f.date_emission ? formatDateLongue(f.date_emission) : "—"}
                    </td>
                    <td className={TD}>
                      {f.date_echeance ? formatDateLongue(f.date_echeance) : "—"}
                    </td>
                    <td className={`${TD} text-right font-mono text-[13px]`}>
                      {formatEuros(f.montant_ttc)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <FactureStatutBadge statut={f.statut} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        href={`/admin/dashboard/facturation/factures/${f.id}`}
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
    </div>
  );
}
