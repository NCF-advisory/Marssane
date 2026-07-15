import { AI_LOGOS } from "../logos";

/**
 * Glyphe Claude à la couleur voulue. Réutilise le path officiel de `logos.ts`
 * (source unique) mais l'affiche en terracotta (présence de Claude) plutôt qu'en
 * encre — le terracotta reste une constante LOCALE à chaque scène, passée ici.
 */
const CLAUDE = AI_LOGOS.find((l) => l.label === "Claude");

export function ClaudeMark({ size, color }: { size: number; color: string }) {
  if (!CLAUDE || CLAUDE.kind !== "svg") return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox={CLAUDE.viewBox}
      fill={color}
      style={{ display: "block", flex: "none" }}
    >
      {CLAUDE.paths.map((p, i) => (
        <path key={i} d={p.d} transform={p.transform} />
      ))}
    </svg>
  );
}
