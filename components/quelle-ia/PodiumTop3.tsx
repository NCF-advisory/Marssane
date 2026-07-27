import type { ClassementEntry } from "@/lib/benchmarks/aggregate";
import { BadgePays } from "@/components/quelle-ia/BadgePays";

const fmt = (x: number) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x);

/** Temps de réflexion en secondes ; « non mesurée » si AA ne l'a pas chronométré. */
const fmtSecondes = (s: number | null) =>
  s == null
    ? "non mesurée"
    : `≈ ${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: s < 10 ? 1 : 0 }).format(s)} s`;

function pct(indice: number, max: number) {
  if (!max) return 0;
  return Math.max(4, Math.min(100, Math.round((indice / max) * 100)));
}

export function PodiumTop3({ entries }: { entries: ClassementEntry[] }) {
  const top3 = entries.slice(0, 3);
  const max = Math.max(...top3.map((e) => e.score), 1);

  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[84px]">
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-3">
        {top3.map((e) => {
          const premier = e.rang === 1;
          return (
            <div
              key={e.cle}
              className={`rounded-card border p-6 shadow-card ${
                premier ? "border-canard bg-ecume" : "border-hairline bg-surface"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-semibold text-ink-ecume tracking-[-0.02em] text-[46px] leading-none">
                  {e.rang}
                </span>
                <span className="text-[13px] text-soft">e</span>
              </div>
              <p className="mt-3 text-[19px] font-extrabold leading-tight tracking-[-0.02em]">
                {e.nom}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
                <span>{e.editeur}</span>
                <BadgePays pays={e.pays} />
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-slate">
                  <span>score</span>
                  <span className="text-ink-ecume">{e.score}</span>
                </div>
                <div className="h-2 rounded bg-bar-track">
                  <div
                    className="h-full rounded bg-canard"
                    style={{ width: `${pct(e.score, max)}%` }}
                  />
                </div>
              </div>

              <p className="mt-3 font-mono text-[13px] text-slate">
                ≈ {fmt(e.coutEurM)} €/M tokens
              </p>
              <p className="mt-1 font-mono text-[13px] text-slate">
                réflexion {fmtSecondes(e.latenceS)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
