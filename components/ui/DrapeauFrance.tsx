type DrapeauFranceProps = {
  /** Hauteur des bandes en px (défaut 11, comme le pied de page de la maquette). */
  height?: number;
  className?: string;
};

/**
 * Drapeau tonal + mention « CONÇU ET OPÉRÉ EN FRANCE ».
 * Trois bandes verticales canard / gris / clay (2,5 px · gap 2 · rayon 1),
 * hauteur paramétrable. La bande centrale (#DCE1E6) est un gris propre au
 * drapeau, hors palette de tokens.
 */
export function DrapeauFrance({ height = 11, className }: DrapeauFranceProps) {
  return (
    <span
      className={`inline-flex items-center gap-[9px] font-mono text-[10px] uppercase tracking-[0.08em] text-slate ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="inline-flex gap-[2px]"
        style={{ height: `${height}px` }}
      >
        <i className="w-[2.5px] rounded-[1px] bg-canard" />
        <i className="w-[2.5px] rounded-[1px]" style={{ background: "#dce1e6" }} />
        <i className="w-[2.5px] rounded-[1px] bg-clay" />
      </span>
      Conçu et opéré en France
    </span>
  );
}
