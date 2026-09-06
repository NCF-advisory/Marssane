import type { Metadata } from "next";
import Link from "next/link";
import { createFactureAction } from "@/app/admin/dashboard/facturation/actions";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { DocumentForm } from "@/components/admin/DocumentForm";
import {
  getEmetteur,
  listOrganisationsChoix,
  tauxTvaParDefaut,
  type EmetteurRow,
  type OrganisationChoix,
} from "@/lib/facturation";

export const metadata: Metadata = {
  title: "Nouvelle facture · Administration Marssane",
};

/** Création d'une facture brouillon (Lot 2, cadrage §4.C). */
export default async function NewFacturePage() {
  let organisations: OrganisationChoix[] | null;
  let emetteur: EmetteurRow | null = null;
  try {
    [organisations, emetteur] = await Promise.all([
      listOrganisationsChoix(),
      getEmetteur(),
    ]);
  } catch {
    console.error("[admin] nouvelle facture : base indisponible");
    organisations = null;
  }

  return (
    <div className="max-w-[860px] space-y-8">
      <div className="space-y-3">
        <Link
          href="/admin/dashboard/facturation"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← Facturation
        </Link>
        <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
          Nouvelle facture
        </h1>
        <p className="max-w-[560px] text-[13.5px] leading-[1.5] text-soft">
          La facture est créée en brouillon, sans numéro ni valeur comptable :
          le numéro FA, la date d&apos;émission et l&apos;échéance sont fixés à
          l&apos;émission, depuis sa fiche.
        </p>
      </div>
      {organisations === null ? (
        <DbUnavailable />
      ) : (
        <DocumentForm
          action={createFactureAction}
          organisations={organisations}
          tauxTvaDefaut={tauxTvaParDefaut(emetteur)}
          submitLabel="Créer la facture"
        />
      )}
    </div>
  );
}
