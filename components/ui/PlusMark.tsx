import type { CSSProperties } from "react";

type PlusMarkProps = {
  /**
   * grey = repère de grille (mono 400, gris de la toile claire) ·
   * grey-sur-ink = le même repère en blanc translucide, pour les pages en
   * tonalité encre (comme les repères en filigrane du héro /quelle-ia) ·
   * turquoise = accent (Plus Jakarta 500), lisible sur les deux tonalités.
   */
  variant?: "grey" | "grey-sur-ink" | "turquoise";
  /** Taille en px. Défaut : 16 (grey) / 21 (turquoise, plage 19–25). */
  size?: number;
  className?: string;
};

/** Le repère décoratif « + » de la toile. Toujours décoratif (aria-hidden). */
export function PlusMark({ variant = "grey", size, className }: PlusMarkProps) {
  const resolved = size ?? (variant === "turquoise" ? 21 : 16);
  const style: CSSProperties =
    variant === "turquoise"
      ? { fontFamily: "var(--font-sans)", fontWeight: 500, color: "var(--color-turquoise)" }
      : {
          fontFamily: "var(--font-mono)",
          fontWeight: 400,
          color:
            variant === "grey-sur-ink"
              ? "var(--color-line-sur-ink)"
              : "var(--color-repere)",
        };

  return (
    <span
      aria-hidden
      className={className}
      style={{ ...style, fontSize: `${resolved}px`, lineHeight: 1 }}
    >
      +
    </span>
  );
}
