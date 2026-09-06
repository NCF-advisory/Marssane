import type { Metadata } from "next";
import Link from "next/link";
import { saveEmetteurAction } from "@/app/admin/dashboard/facturation/actions";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { EmetteurForm } from "@/components/admin/EmetteurForm";
import { getEmetteur, type EmetteurRow } from "@/lib/facturation";

export const metadata: Metadata = {
  title: "Paramètres de facturation · Administration Marssane",
};

/**
 * Paramètres de facturation (Lot 2, cadrage §7) : identité de l'émetteur,
 * régime de TVA, conditions de paiement. Tant que les champs indispensables ne
 * sont pas renseignés, l'émission de factures est bloquée.
 */
export default async function ParametresFacturationPage() {
  let emetteur: EmetteurRow | null = null;
  let ok = true;
  try {
    emetteur = await getEmetteur();
  } catch {
    console.error("[admin] paramètres de facturation : base indisponible");
    ok = false;
  }

  return (
    <div className="max-w-[720px] space-y-8">
      <div className="space-y-3">
        <Link
          href="/admin/dashboard/facturation"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← Facturation
        </Link>
        <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
          Paramètres de facturation
        </h1>
        <p className="max-w-[560px] text-[13.5px] leading-[1.5] text-soft">
          Ces informations figurent sur les devis et factures. Le régime de TVA
          et l&apos;identité de l&apos;émetteur sont à valider avec votre
          comptable ; l&apos;émission de factures reste bloquée tant que raison
          sociale, forme juridique, SIREN, adresse et régime de TVA ne sont pas
          renseignés.
        </p>
      </div>
      {ok ? (
        <EmetteurForm action={saveEmetteurAction} values={emetteur} />
      ) : (
        <DbUnavailable />
      )}
    </div>
  );
}
