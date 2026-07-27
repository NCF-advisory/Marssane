import { PAYS } from "@/lib/pays";

export function BadgePays({ pays }: { pays: "US" | "FR" | "CN" }) {
  const cfg = PAYS[pays];
  return (
    <span
      className="inline-flex items-center gap-[7px] font-mono text-[10px] uppercase tracking-[0.08em] text-slate"
      aria-label={cfg.complet}
    >
      <span className="inline-flex items-center gap-[2px]" aria-hidden="true">
        {cfg.bandes.map((b, i) =>
          b.startsWith("bg-") ? (
            <span key={i} className={`inline-block w-[2.5px] h-[11px] rounded-[1px] ${b}`} />
          ) : (
            <span
              key={i}
              className="inline-block w-[2.5px] h-[11px] rounded-[1px]"
              style={{ backgroundColor: b }}
            />
          )
        )}
      </span>
      {cfg.libelle}
    </span>
  );
}
