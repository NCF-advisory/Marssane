import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents · Administration Marssane",
};

/**
 * Module Documents (ERP · Lot 0, cadrage §4.D). Emplacement réservé : la
 * génération et le suivi des documents obligatoires par session (convention,
 * convocations, émargement, attestations, certificats) sont développés au
 * Lot 3. La table `documents_session` est déjà créée par la migration 010.
 */
export default function AdminDocumentsPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em]">
          Documents
        </h1>
        <p className="max-w-[640px] text-[13.5px] leading-[1.5] text-soft">
          Documents administratifs de formation par session — convention,
          convocations, feuille d&apos;émargement, attestations, certificats —
          avec checklist générés / envoyés / signés. Prévu au Lot 3.
        </p>
      </div>
      <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
        Module à venir — Lot 3.
      </p>
    </div>
  );
}
