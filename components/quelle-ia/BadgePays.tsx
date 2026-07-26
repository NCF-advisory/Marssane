const CONFIG = {
  US: { libelle: "États-Unis", complet: "États-Unis", bandes: ["bg-slate", "#dce1e6", "bg-slate"] },
  FR: { libelle: "France", complet: "France", bandes: ["bg-canard", "#dce1e6", "bg-clay"] },
  CN: { libelle: "Chine · hors UE", complet: "Chine (hors Union européenne)", bandes: ["bg-clay", "#dce1e6", "bg-clay"] },
} as const;

export function BadgePays({ pays }: { pays: "US" | "FR" | "CN" }) {
  const cfg = CONFIG[pays];
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
