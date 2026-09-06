import type { ClassementEntry } from "@/lib/benchmarks/aggregate";

const number = (value: number, digits = 1) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits }).format(value);

export function TableauComparatif({ entries }: { entries: ClassementEntry[] }) {
  return (
    <section className="mx-auto max-w-[1180px] px-6 pt-10 sm:px-10">
      <details className="rounded-card border border-line-sur-ink bg-surface-sur-ink p-5">
        <summary className="cursor-pointer text-[16px] font-semibold">Consulter les scores et les coûts des {entries.length} modèles comparés</summary>
        <div className="mt-5 overflow-x-auto" role="region" aria-label="Tableau comparatif des modèles IA" tabIndex={0}>
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <caption className="pb-4 text-left text-body-sur-ink">Classement calculé par Marssane. Coût API indicatif, par million de tokens ; voir la <a href="#methode" className="underline underline-offset-4">méthode de calcul</a>.</caption>
            <thead><tr className="border-b border-line-sur-ink">
              {["Rang", "Modèle", "Score / 100", "Coût API / M tokens", "Délai de réponse"].map((label) => <th key={label} scope="col" className="px-3 py-3 font-semibold">{label}</th>)}
            </tr></thead>
            <tbody>{entries.map((entry) => (
              <tr key={entry.cle} id={`modele-${entry.cle}`} className="scroll-mt-24 border-b border-line-sur-ink text-body-sur-ink">
                <td className="px-3 py-3">{entry.rang}</td>
                <th scope="row" className="px-3 py-3 font-medium">{entry.nom}{entry.effort ? ` (${entry.effort})` : ""}</th>
                <td className="px-3 py-3">{number(entry.score)}</td>
                <td className="px-3 py-3">{number(entry.coutEurM, 2)} €</td>
                <td className="px-3 py-3">{entry.latenceS === null ? "Non mesurée" : `${number(entry.latenceS)} s`}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
