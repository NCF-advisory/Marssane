import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateFactureAction } from "@/app/admin/dashboard/facturation/actions";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { DocumentForm } from "@/components/admin/DocumentForm";
import {
  getFactureDetail,
  listLignesFacture,
  listOrganisationsChoix,
  type FactureDetail,
  type LigneRow,
  type OrganisationChoix,
} from "@/lib/facturation";
import { parseId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Modifier la facture · Administration Marssane",
};

/** Édition d'une facture BROUILLON (Lot 2). Une facture émise ne se modifie plus. */
export default async function ModifierFacturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();

  let facture: FactureDetail | null;
  let lignes: LigneRow[];
  let organisations: OrganisationChoix[];
  try {
    [facture, lignes, organisations] = await Promise.all([
      getFactureDetail(id),
      listLignesFacture(id),
      listOrganisationsChoix(),
    ]);
  } catch {
    console.error("[admin] édition facture : base indisponible");
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
  if (facture.statut !== "brouillon" || facture.type !== "facture") {
    redirect(`/admin/dashboard/facturation/factures/${facture.id}`);
  }

  return (
    <div className="max-w-[860px] space-y-8">
      <div className="space-y-3">
        <Link
          href={`/admin/dashboard/facturation/factures/${facture.id}`}
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← Facture
        </Link>
        <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
          Modifier la facture
        </h1>
      </div>
      <DocumentForm
        action={updateFactureAction.bind(null, facture.id)}
        organisations={organisations}
        tauxTvaDefaut={lignes[0]?.tva_pct ?? "20"}
        values={{
          organisation_id: facture.organisation_id,
          objet: facture.objet,
          notes: facture.notes,
          lignes: lignes.map((l) => ({
            designation: l.designation,
            quantite: l.quantite,
            prix_unitaire_ht: l.prix_unitaire_ht,
            tva_pct: l.tva_pct,
          })),
        }}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}
