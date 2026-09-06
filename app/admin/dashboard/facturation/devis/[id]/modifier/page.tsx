import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateDevisAction } from "@/app/admin/dashboard/facturation/actions";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { DocumentForm } from "@/components/admin/DocumentForm";
import {
  getDevisDetail,
  listLignesDevis,
  listOrganisationsChoix,
  type DevisDetail,
  type LigneRow,
  type OrganisationChoix,
} from "@/lib/facturation";
import { parseId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Modifier le devis · Administration Marssane",
};

/** Édition d'un devis BROUILLON (Lot 2). Un devis numéroté ne se modifie plus. */
export default async function ModifierDevisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();

  let devis: DevisDetail | null;
  let lignes: LigneRow[];
  let organisations: OrganisationChoix[];
  try {
    [devis, lignes, organisations] = await Promise.all([
      getDevisDetail(id),
      listLignesDevis(id),
      listOrganisationsChoix(),
    ]);
  } catch {
    console.error("[admin] édition devis : base indisponible");
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
  if (devis.statut !== "brouillon") {
    redirect(`/admin/dashboard/facturation/devis/${devis.id}`);
  }

  return (
    <div className="max-w-[860px] space-y-8">
      <div className="space-y-3">
        <Link
          href={`/admin/dashboard/facturation/devis/${devis.id}`}
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← Devis
        </Link>
        <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
          Modifier le devis
        </h1>
      </div>
      <DocumentForm
        action={updateDevisAction.bind(null, devis.id)}
        organisations={organisations}
        tauxTvaDefaut={lignes[0]?.tva_pct ?? "20"}
        values={{
          organisation_id: devis.organisation_id,
          objet: devis.objet,
          notes: devis.notes,
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
