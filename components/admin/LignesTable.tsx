import { formatEuros } from "@/lib/crm-display";
import type { LigneRow } from "@/lib/facturation";

/**
 * Table de lecture des lignes d'un devis ou d'une facture, avec totaux
 * (Lot 2). La colonne TVA est masquée si tout est à 0 (régime exonéré).
 */
export function LignesTable({
  lignes,
  montantHt,
  montantTva,
  montantTtc,
}: {
  lignes: LigneRow[];
  montantHt: string;
  montantTva: string;
  montantTtc: string;
}) {
  const tvaNulle = Number(montantTva) === 0;

  const TH =
    "whitespace-nowrap px-4 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft";
  const TD = "px-4 py-3 text-[14px] text-body";

  return (
    <div className="overflow-x-auto rounded-card border border-hairline bg-surface shadow-card">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-hairline">
            <th className={TH}>Désignation</th>
            <th className={`${TH} text-right`}>Qté</th>
            <th className={`${TH} text-right`}>PU HT</th>
            {!tvaNulle && <th className={`${TH} text-right`}>TVA</th>}
            <th className={`${TH} text-right`}>Total HT</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((l) => (
            <tr key={l.id} className="border-b border-hairline last:border-0">
              <td className={TD}>{l.designation}</td>
              <td className={`${TD} whitespace-nowrap text-right font-mono text-[13px]`}>
                {Number(l.quantite)}
              </td>
              <td className={`${TD} whitespace-nowrap text-right font-mono text-[13px]`}>
                {formatEuros(l.prix_unitaire_ht)}
              </td>
              {!tvaNulle && (
                <td className={`${TD} whitespace-nowrap text-right font-mono text-[13px]`}>
                  {Number(l.tva_pct)} %
                </td>
              )}
              <td className={`${TD} whitespace-nowrap text-right font-mono text-[13px]`}>
                {formatEuros(Number(l.quantite) * Number(l.prix_unitaire_ht))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-hairline">
            <td
              colSpan={tvaNulle ? 3 : 4}
              className="px-4 py-3 text-right text-[13.5px] text-soft"
            >
              {tvaNulle ? (
                <span>Total HT · TVA non applicable</span>
              ) : (
                <span>
                  HT {formatEuros(montantHt)} · TVA {formatEuros(montantTva)}
                </span>
              )}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-[15px] font-semibold text-ink">
              {formatEuros(montantTtc)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
