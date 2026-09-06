import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DocumentPrint } from "@/components/admin/DocumentPrint";
import { PrintButton } from "@/components/admin/PrintButton";
import { getCurrentAdmin } from "@/lib/admin-auth";
import {
  getDevisDetail,
  getEmetteur,
  listLignesDevis,
} from "@/lib/facturation";
import { parseId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Impression devis · Marssane",
};

/**
 * Gabarit imprimable d'un devis (Lot 2). Hors du chrome admin (pas d'en-tête
 * ni de navigation à l'impression) mais protégé comme tout `/admin/*` par le
 * proxy — et revérifié ici (défense en profondeur).
 */
export default async function ImprimerDevisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();

  const [devis, lignes, emetteur] = await Promise.all([
    getDevisDetail(id),
    listLignesDevis(id),
    getEmetteur(),
  ]);
  if (!devis) notFound();

  return (
    <div className="toile-washes min-h-screen bg-white text-ink">
      <div className="mx-auto flex max-w-[794px] justify-end px-12 pt-6 print:hidden">
        <PrintButton />
      </div>
      <DocumentPrint
        titre="Devis"
        numero={devis.numero}
        objet={devis.objet}
        date_emission={devis.date_emission}
        echeance={{ label: "Valable jusqu'au", date: devis.date_expiration }}
        emetteur={emetteur}
        client={{
          nom: devis.organisation_nom,
          siren: devis.organisation_siren,
          adresse: devis.organisation_adresse,
          code_postal: devis.organisation_code_postal,
          ville: devis.organisation_ville,
        }}
        lignes={lignes}
        montant_ht={devis.montant_ht}
        montant_tva={devis.montant_tva}
        montant_ttc={devis.montant_ttc}
      />
    </div>
  );
}
