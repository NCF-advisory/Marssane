import { C, FONT } from "../theme";
import type { AiLogo } from "../logos";

/**
 * Glyphe d'un logo IA à taille homogène, monochrome encre. Utilisé sans label
 * dans G1 (ligne de logos) et avec label dans G3 (colonne « Installer »).
 */
export function AiLogoGlyph({ logo, size }: { logo: AiLogo; size: number }) {
  if (logo.kind === "word") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: size,
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: size * 0.64,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: C.ink,
        }}
      >
        {logo.word}
      </span>
    );
  }
  return (
    <svg width={size} height={size} viewBox={logo.viewBox} fill={C.ink}>
      {logo.paths.map((p, i) => (
        <path key={i} d={p.d} transform={p.transform} />
      ))}
    </svg>
  );
}
