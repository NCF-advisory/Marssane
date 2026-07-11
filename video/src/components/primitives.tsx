import type { CSSProperties, ReactNode } from "react";
import { C, FONT, SHADOW, RADIUS } from "../theme";

/** Carte blanche posée sur la toile : bord hairline, ombre froide, rayon doux. */
export function Card({
  children,
  style,
  shadow = SHADOW.float,
}: {
  children?: ReactNode;
  style?: CSSProperties;
  shadow?: string;
}) {
  return (
    <div
      style={{
        background: C.surface,
        border: "1px solid rgba(16,24,40,0.06)",
        borderRadius: RADIUS.card,
        boxShadow: shadow,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Badge écume (validation) — pastille pleine, texte encre-écume. */
export function BadgeEcume({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        background: C.ecume,
        color: C.inkEcume,
        fontFamily: FONT.sans,
        fontWeight: 600,
        fontSize: 40,
        lineHeight: 1.1,
        padding: "16px 32px",
        borderRadius: 999,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Kicker mono en capitales espacées (label de scène, décoratif). */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontSize: 34,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: C.soft,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

/** Titre de scène (Plus Jakarta Sans 800, une idée). */
export function Titre({
  children,
  size = 104,
  color = C.ink,
  style,
}: {
  children: ReactNode;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: "-0.025em",
        color,
        ...style,
      }}
    >
      {children}
    </h1>
  );
}

/** Barre grise simulant une ligne de texte (comme CasConcrets). */
export function TextBar({
  width,
  height = 16,
  color = C.barTrack,
  style,
}: {
  width: number | string;
  height?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "block",
        width,
        height,
        borderRadius: 6,
        background: color,
        ...style,
      }}
    />
  );
}

/**
 * Jauge : label à gauche, valeur mono à droite, piste + remplissage.
 * `pct` en % (0–100). `fill` = couleur du remplissage (grise ou turquoise/canard).
 */
export function Gauge({
  label,
  value,
  pct,
  fill,
  valueColor = C.ink,
  width = 620,
}: {
  label: string;
  value: string;
  pct: number;
  fill: string;
  valueColor?: string;
  width?: number;
}) {
  return (
    <div style={{ width }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 34,
            color: C.faint,
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: FONT.mono,
            fontWeight: 600,
            fontSize: 40,
            color: valueColor,
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          height: 22,
          borderRadius: 999,
          background: C.barTrack,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 999,
            background: fill,
          }}
        />
      </div>
    </div>
  );
}
