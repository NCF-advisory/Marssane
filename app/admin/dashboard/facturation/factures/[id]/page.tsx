import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  creerAvoirAction,
  emettreFactureAction,
  paiementAction,
  supprimerFactureAction,
} from "@/app/admin/dashboard/facturation/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { FactureStatutBadge } from "@/components/admin/crm-badges";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { LignesTable } from "@/components/admin/LignesTable";
import { PaiementForm } from "@/components/admin/PaiementForm";
import { formatEuros } from "@/lib/crm-display";
import {
  getFactureDetail,
  getTotalPaye,
  listLignesFacture,
  listPaiements,
  type FactureDetail,
  type LigneRow,
  type PaiementRow,
} from "@/lib/facturation";
import { MOYEN_PAIEMENT_LABELS } from "@/lib/facturation-validation";
import { formatDateLongue } from "@/lib/session-display";
import { parseId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Facture · Administration Marssane",
};

/**
 * Fiche d'une facture ou d'un avoir (Lot 2, cadrage §4.C). Actions selon le
 * statut : brouillon → émettre (numéro FA + échéance), modifier, supprimer ;
 * émise / en retard → encaissements, annulation par avoir ; payée → avoir.
 * Un avoir est en lecture seule (référence croisée vers l'original).
 */

const BTN_SECONDAIRE =
  "inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile";
const BTN_PRIMAIRE =
  "inline-flex items-center rounded-btn bg-canard px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark";

export default async function FacturePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ emission?: string }>;
}) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();
  const { emission } = await searchParams;

  let facture: FactureDetail | null;
  let lignes: LigneRow[];
  let paiements: PaiementRow[];
  let paye: string;
  try {
    [facture, lignes, paiements, paye] = await Promise.all([
      getFactureDetail(id),
      listLignesFacture(id),
      listPaiements(id),
      getTotalPaye(id),
    ]);
  } catch {
    console.error("[admin] fiche facture : base indisponible");
    return (
      <div className="space-y-8">
        <Link
          href="/admin/dashboard/facturation"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← Facturation
        </Link>
        <DbUnavailable />
      </div>
    );
  }

  if (!facture) notFound();

  const estAvoir = facture.type === "avoir";
  const resteDu =
    Math.round((Number(facture.montant_ttc) - Number(paye)) * 100) / 100;
  const titre = estAvoir
    ? `Avoir ${facture.numero ?? ""}`
    : facture.numero
      ? `Facture ${facture.numero}`
      : "Facture (brouillon)";

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Link
          href="/admin/dashboard/facturation"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← Facturation
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
            {titre.trim()}
          </h1>
          <FactureStatutBadge statut={facture.statut} />
        </div>
        <p className="text-[14px] text-soft">
          {facture.organisation_nom ?? "Client non renseigné"}
          {facture.objet ? ` · ${facture.objet}` : ""}
          {facture.date_emission
            ? ` · émise le ${formatDateLongue(facture.date_emission)}`
            : ""}
          {facture.date_echeance
            ? ` · échéance le ${formatDateLongue(facture.date_echeance)}`
            : ""}
          {facture.facture_liee_numero
            ? ` · annule la facture ${facture.facture_liee_numero}`
            : ""}
        </p>
      </div>

      {emission === "emetteur_incomplet" && (
        <div className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-ink-clay">
          Émission refusée : les paramètres de facturation sont incomplets
          (raison sociale, forme juridique, SIREN, adresse, régime de TVA).{" "}
          <Link
            href="/admin/dashboard/facturation/parametres"
            className="font-semibold underline underline-offset-2"
          >
            Compléter les paramètres
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {!estAvoir && facture.statut === "brouillon" && (
          <>
            <form action={emettreFactureAction} className="inline">
              <input type="hidden" name="id" value={facture.id} />
              <ConfirmButton
                message="Émettre cette facture ? Le numéro FA, la date d'émission et l'échéance seront fixés définitivement — elle ne pourra plus être modifiée ni supprimée (annulation par avoir uniquement)."
                className={BTN_PRIMAIRE}
              >
                Émettre la facture
              </ConfirmButton>
            </form>
            <Link
              href={`/admin/dashboard/facturation/factures/${facture.id}/modifier`}
              className={BTN_SECONDAIRE}
            >
              Modifier
            </Link>
            <form action={supprimerFactureAction} className="inline">
              <input type="hidden" name="id" value={facture.id} />
              <ConfirmButton
                message="Supprimer définitivement ce brouillon de facture ?"
                className="inline-flex items-center rounded-btn px-3 py-2.5 font-mono text-[12px] font-medium text-soft transition-colors hover:text-ink-clay"
              >
                Supprimer
              </ConfirmButton>
            </form>
          </>
        )}
        {!estAvoir &&
          ["emise", "en_retard", "payee"].includes(facture.statut) && (
            <form action={creerAvoirAction} className="inline">
              <input type="hidden" name="id" value={facture.id} />
              <ConfirmButton
                message="Annuler cette facture par un avoir ? Un avoir AV du même montant (en négatif) sera émis et la facture passera au statut « Annulée »."
                className={BTN_SECONDAIRE}
              >
                Annuler par avoir
              </ConfirmButton>
            </form>
          )}
        <Link
          href={`/admin/imprimer/facture/${facture.id}`}
          target="_blank"
          rel="noreferrer"
          className={BTN_SECONDAIRE}
        >
          Imprimer / PDF
        </Link>
      </div>

      <LignesTable
        lignes={lignes}
        montantHt={facture.montant_ht}
        montantTva={facture.montant_tva}
        montantTtc={facture.montant_ttc}
      />

      {/* Encaissements */}
      {!estAvoir && facture.statut !== "brouillon" && (
        <section className="space-y-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[19px] font-bold tracking-[-0.01em]">
              Encaissements
            </h2>
            <span className="font-mono text-[13px] text-faint">
              {paiements.length}
            </span>
            <span className="font-mono text-[12px] text-soft">
              · réglé {formatEuros(paye)}
              {resteDu > 0 ? ` · reste dû ${formatEuros(resteDu)}` : ""}
            </span>
          </div>

          {paiements.length > 0 && (
            <div className="rounded-card border border-hairline bg-surface px-6 py-2 shadow-card">
              {paiements.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline py-3 last:border-0"
                >
                  <span className="text-[13.5px] text-body">
                    {formatDateLongue(p.recu_le)} ·{" "}
                    {MOYEN_PAIEMENT_LABELS[p.moyen] ?? p.moyen}
                    {p.reference ? ` · ${p.reference}` : ""}
                  </span>
                  <span className="font-mono text-[13.5px] font-semibold text-ink">
                    {formatEuros(p.montant)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {["emise", "en_retard"].includes(facture.statut) && (
            <details
              className="rounded-card border border-hairline bg-surface px-5 py-4 shadow-card"
              open={paiements.length === 0}
            >
              <summary className="cursor-pointer list-none font-mono text-[12px] font-medium text-canard [&::-webkit-details-marker]:hidden">
                + Enregistrer un encaissement
              </summary>
              <div className="mt-4 max-w-[560px]">
                <PaiementForm
                  action={paiementAction.bind(null, facture.id)}
                  resteDu={resteDu}
                />
              </div>
            </details>
          )}
        </section>
      )}

      {facture.notes && (
        <section className="rounded-card border border-hairline bg-surface px-6 py-5 shadow-card">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-quiet">
            Notes internes
          </span>
          <p className="mt-1.5 whitespace-pre-wrap text-[13.5px] leading-[1.55] text-body">
            {facture.notes}
          </p>
        </section>
      )}
    </div>
  );
}
