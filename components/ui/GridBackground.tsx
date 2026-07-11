import type { CSSProperties } from "react";

type GridBackgroundProps = {
  /**
   * Masque dégradé (valeur CSS mask-image), ex.
   * "linear-gradient(to bottom, #000 0 58%, transparent 94%)" ou
   * "radial-gradient(72% 70% at 62% 45%, #000, transparent 78%)".
   */
  mask?: string;
  /** Ligne plus discrète (opacité .42 au lieu de .45). */
  soft?: boolean;
  className?: string;
};

/**
 * Quadrillage de la toile, en fond absolu (inset:0). À placer dans un parent
 * `relative`. Le pas (80 px desktop / 64 px mobile) et la ligne 1 px sont
 * portés par la classe `.grid-toile` (globals.css). Décoratif.
 */
export function GridBackground({ mask, soft, className }: GridBackgroundProps) {
  const style: CSSProperties = {};
  if (soft) {
    (style as Record<string, string>)["--grid-line"] = "rgba(193, 201, 210, 0.42)";
  }
  if (mask) {
    style.WebkitMaskImage = mask;
    style.maskImage = mask;
  }

  return (
    <div aria-hidden className={`grid-toile ${className ?? ""}`} style={style} />
  );
}
