import type { Metadata } from "next";
import Link from "next/link";
import { createDevisAction } from "@/app/admin/dashboard/facturation/actions";
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
  title: "Nouveau devis · Administration Marssane",
};

/** Création d'un devis brouillon (Lot 2, cadrage §4.C). */
export default async function NewDevisPage() {
  let organisations: OrganisationChoix[] | null;
  let emetteur: EmetteurRow | null = null;
  try {
    [organisations, emetteur] = await Promise.all([
      listOrganisationsChoix(),
      getEmetteur(),
    ]);
  } catch {
    console.error("[admin] nouveau devis : base indisponible");
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
          Nouveau devis
        </h1>
        <p className="max-w-[560px] text-[13.5px] leading-[1.5] text-soft">
          Le devis est créé en brouillon, sans numéro : le numéro DE est
          attribué à l&apos;envoi, depuis sa fiche.
        </p>
      </div>
      {organisations === null ? (
        <DbUnavailable />
      ) : (
        <DocumentForm
          action={createDevisAction}
          organisations={organisations}
          tauxTvaDefaut={tauxTvaParDefaut(emetteur)}
          submitLabel="Créer le devis"
        />
      )}
    </div>
  );
}
