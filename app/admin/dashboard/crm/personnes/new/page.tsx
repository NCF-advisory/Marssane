import type { Metadata } from "next";
import Link from "next/link";
import { createPersonneAction } from "@/app/admin/dashboard/crm/actions";
import { PersonneForm } from "@/components/admin/PersonneForm";

export const metadata: Metadata = {
  title: "Nouveau contact · Administration Marssane",
};

/** Création d'une fiche personne (CRM · Lot 1, cadrage §4.B). */
export default function NewPersonnePage() {
  return (
    <div className="max-w-[640px] space-y-8">
      <div className="space-y-3">
        <Link
          href="/admin/dashboard/crm"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← CRM
        </Link>
        <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
          Nouveau contact
        </h1>
        <p className="max-w-[520px] text-[13.5px] leading-[1.5] text-soft">
          Seuls le prénom, le nom et au moins un rôle sont requis. L&apos;entreprise
          est créée automatiquement si elle n&apos;existe pas encore.
        </p>
      </div>
      <PersonneForm action={createPersonneAction} />
    </div>
  );
}
