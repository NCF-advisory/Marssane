import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  clotureDevisAction,
  devisEnFactureAction,
  envoyerDevisAction,
  supprimerDevisAction,
} from "@/app/admin/dashboard/facturation/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { DevisStatutBadge } from "@/components/admin/crm-badges";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { LignesTable } from "@/components/admin/LignesTable";
import {
  getDevisDetail,
  listLignesDevis,
  type DevisDetail,
  type LigneRow,
} from "@/lib/facturation";
import { formatDateLongue } from "@/lib/session-display";
import { parseId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Devis · Administration Marssane",
};

/**
 * Fiche d'un devis (Lot 2, cadrage §4.C). Actions selon le statut :
 * brouillon → envoyer (numéro DE attribué), modifier, supprimer ;
 * envoyé → accepter / refuser ; accepté → transformer en facture.
 * L'impression ouvre le gabarit dans un onglet dédié (hors chrome admin).
 */

const BTN_SECONDAIRE =
  "inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile";
const BTN_PRIMAIRE =
  "inline-flex items-center rounded-btn bg-canard px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark";

export default async function DevisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();

  let devis: DevisDetail | null;
  let lignes: LigneRow[];
  try {
    [devis, lignes] = await Promise.all([getDevisDetail(id), listLignesDevis(id)]);
  } catch {
    console.error("[admin] fiche devis : base indisponible");
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

  if (!devis) notFound();

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
            {devis.numero ? `Devis ${devis.numero}` : "Devis (brouillon)"}
          </h1>
          <DevisStatutBadge statut={devis.statut} />
        </div>
        <p className="text-[14px] text-soft">
          {devis.organisation_nom ?? "Client non renseigné"}
          {devis.objet ? ` · ${devis.objet}` : ""}
          {devis.date_emission
            ? ` · émis le ${formatDateLongue(devis.date_emission)}`
            : ""}
          {devis.date_expiration
            ? ` · valable jusqu'au ${formatDateLongue(devis.date_expiration)}`
            : ""}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {devis.statut === "brouillon" && (
          <>
            <form action={envoyerDevisAction} className="inline">
              <input type="hidden" name="id" value={devis.id} />
              <ConfirmButton
                message="Marquer ce devis comme envoyé ? Le numéro DE lui sera attribué définitivement (validité 30 jours)."
                className={BTN_PRIMAIRE}
              >
                Marquer envoyé
              </ConfirmButton>
            </form>
            <Link
              href={`/admin/dashboard/facturation/devis/${devis.id}/modifier`}
              className={BTN_SECONDAIRE}
            >
              Modifier
            </Link>
            <form action={supprimerDevisAction} className="inline">
              <input type="hidden" name="id" value={devis.id} />
              <ConfirmButton
                message="Supprimer définitivement ce brouillon de devis ?"
                className="inline-flex items-center rounded-btn px-3 py-2.5 font-mono text-[12px] font-medium text-soft transition-colors hover:text-ink-clay"
              >
                Supprimer
              </ConfirmButton>
            </form>
          </>
        )}
        {devis.statut === "envoye" && (
          <>
            <form action={clotureDevisAction} className="inline">
              <input type="hidden" name="id" value={devis.id} />
              <input type="hidden" name="statut" value="accepte" />
              <button type="submit" className={BTN_PRIMAIRE}>
                Marquer accepté
              </button>
            </form>
            <form action={clotureDevisAction} className="inline">
              <input type="hidden" name="id" value={devis.id} />
              <input type="hidden" name="statut" value="refuse" />
              <button type="submit" className={BTN_SECONDAIRE}>
                Marquer refusé
              </button>
            </form>
          </>
        )}
        {devis.statut === "accepte" && (
          <form action={devisEnFactureAction} className="inline">
            <input type="hidden" name="id" value={devis.id} />
            <button type="submit" className={BTN_PRIMAIRE}>
              Transformer en facture
            </button>
          </form>
        )}
        <Link
          href={`/admin/imprimer/devis/${devis.id}`}
          target="_blank"
          rel="noreferrer"
          className={BTN_SECONDAIRE}
        >
          Imprimer / PDF
        </Link>
      </div>

      <LignesTable
        lignes={lignes}
        montantHt={devis.montant_ht}
        montantTva={devis.montant_tva}
        montantTtc={devis.montant_ttc}
      />

      {devis.notes && (
        <section className="rounded-card border border-hairline bg-surface px-6 py-5 shadow-card">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-quiet">
            Notes internes
          </span>
          <p className="mt-1.5 whitespace-pre-wrap text-[13.5px] leading-[1.55] text-body">
            {devis.notes}
          </p>
        </section>
      )}
    </div>
  );
}
