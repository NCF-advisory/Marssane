import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DocumentPrint } from "@/components/admin/DocumentPrint";
import { PrintButton } from "@/components/admin/PrintButton";
import { getCurrentAdmin } from "@/lib/admin-auth";
import {
  getFactureDetail,
  getEmetteur,
  getTotalPaye,
  listLignesFacture,
} from "@/lib/facturation";
import { parseId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Impression facture · Marssane",
};

/**
 * Gabarit imprimable d'une facture ou d'un avoir (Lot 2). Hors du chrome
 * admin, protégé par le proxy et revérifié ici (défense en profondeur).
 */
export default async function ImprimerFacturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();

  const [facture, lignes, emetteur, paye] = await Promise.all([
    getFactureDetail(id),
    listLignesFacture(id),
    getEmetteur(),
    getTotalPaye(id),
  ]);
  if (!facture) notFound();

  const estAvoir = facture.type === "avoir";

  return (
    <div className="toile-washes min-h-screen bg-white text-ink">
      <div className="mx-auto flex max-w-[794px] justify-end px-12 pt-6 print:hidden">
        <PrintButton />
      </div>
      <DocumentPrint
        titre={estAvoir ? "Avoir" : "Facture"}
        numero={facture.numero}
        objet={facture.objet}
        date_emission={facture.date_emission}
        echeance={
          estAvoir
            ? undefined
            : { label: "Échéance", date: facture.date_echeance }
        }
        reference={
          estAvoir && facture.facture_liee_numero
            ? `Annule la facture ${facture.facture_liee_numero}`
            : null
        }
        emetteur={emetteur}
        client={{
          nom: facture.organisation_nom,
          siren: facture.organisation_siren,
          adresse: facture.organisation_adresse,
          code_postal: facture.organisation_code_postal,
          ville: facture.organisation_ville,
        }}
        lignes={lignes}
        montant_ht={facture.montant_ht}
        montant_tva={facture.montant_tva}
        montant_ttc={facture.montant_ttc}
        paye={estAvoir ? undefined : paye}
      />
    </div>
  );
}
