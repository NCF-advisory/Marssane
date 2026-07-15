import type { CSSProperties } from "react";

type LogoNiveauProps = {
  /** Couleur du niveau : porte les équerres et le « + ». Le « M » reste encre. */
  color: string;
  /** Côté du carré en px. Défaut 256 (= viewBox). */
  size?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Logo de niveau, tracé du kit de marque officiel (viewBox 256×256).
 * Règle de marque : le « M » reste encre (#0E0E12) ; la couleur du niveau
 * porte les trois équerres et le « + ».
 *
 * Chaque élément animable est isolé dans un `<g data-part>` (bracket-tl,
 * bracket-bl, bracket-br, plus, m) pour pouvoir être transformé
 * individuellement (voir la révélation scrollée de <NiveauScrolly>). En usage
 * statique le logo se rend tel quel. Décoratif : aria-hidden.
 */
export function LogoNiveau({ color, size = 256, className, style }: LogoNiveauProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
      focusable="false"
    >
      <g
        data-part="bracket-tl"
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.5 53 V22 Q13.5 13.5 22 13.5 H53" />
      </g>
      <g
        data-part="bracket-bl"
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.5 203 V234 Q13.5 242.5 22 242.5 H53" />
      </g>
      <g
        data-part="bracket-br"
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M242.5 203 V234 Q242.5 242.5 234 242.5 H203" />
      </g>
      <g
        data-part="plus"
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
      >
        <path d="M194 36 H250 M222 8 V64" />
      </g>
      <g data-part="m">
        <path
          fill="var(--color-ink)"
          transform="translate(53,55.5)"
          d="M0 145 V0 H40 L75 62 L110 0 H150 V145 H118 V50 L88 102 H62 L32 50 V145 Z"
        />
      </g>
    </svg>
  );
}
