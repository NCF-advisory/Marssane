import type { ClassementEntry } from "@/lib/benchmarks/aggregate";
import { BadgePays } from "@/components/quelle-ia/BadgePays";

const fmt = (x: number) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x);

function pct(indice: number, max: number) {
  if (!max) return 0;
  return Math.max(4, Math.min(100, Math.round((indice / max) * 100)));
}

export function ResteClassement({ entries }: { entries: ClassementEntry[] }) {
  const reste = entries.slice(3);
  if (reste.length === 0) return null;

  const max = Math.max(...entries.map((e) => e.indiceEfficacite), 1);

  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[84px]">
      <div className="rounded-card border border-hairline bg-surface shadow-card">
        <ul>
          {reste.map((e, i) => (
            <li
              key={e.cle}
              className={`flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:gap-5 ${
                i > 0 ? "border-t border-hairline" : ""
              }`}
            >
              <span className="font-mono text-[14px] font-semibold text-slate sm:w-[42px]">
                #{e.rang}
              </span>
              <div className="min-w-0 sm:w-[220px]">
                <p className="truncate text-[15px] font-semibold">{e.nom}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
                  <span>{e.editeur}</span>
                  <BadgePays pays={e.pays} />
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3">
                <div className="h-2 flex-1 rounded bg-bar-track">
                  <div
                    className="h-full rounded bg-canard"
                    style={{ width: `${pct(e.indiceEfficacite, max)}%` }}
                  />
                </div>
                <span className="font-mono text-[12px] text-ink-ecume">{e.indiceEfficacite}</span>
              </div>
              <span className="font-mono text-[13px] text-slate sm:w-[150px] sm:text-right">
                ≈ {fmt(e.coutEurM)} €/M
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
