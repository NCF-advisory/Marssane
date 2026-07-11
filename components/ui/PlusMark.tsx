import type { CSSProperties } from "react";

type PlusMarkProps = {
  /** grey = repère de grille (mono 400) · turquoise = accent (Plus Jakarta 500). */
  variant?: "grey" | "turquoise";
  /** Taille en px. Défaut : 16 (grey) / 21 (turquoise, plage 19–25). */
  size?: number;
  className?: string;
};

/** Le repère décoratif « + » de la toile. Toujours décoratif (aria-hidden). */
export function PlusMark({ variant = "grey", size, className }: PlusMarkProps) {
  const resolved = size ?? (variant === "grey" ? 16 : 21);
  const style: CSSProperties =
    variant === "grey"
      ? { fontFamily: "var(--font-mono)", fontWeight: 400, color: "var(--color-repere)" }
      : { fontFamily: "var(--font-sans)", fontWeight: 500, color: "var(--color-turquoise)" };

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
