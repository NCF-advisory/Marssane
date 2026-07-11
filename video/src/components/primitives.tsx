import type { CSSProperties, ReactNode } from "react";
import { C, SHADOW, RADIUS, FONT } from "../theme";

/** Carte blanche posée sur la toile : bord hairline, ombre froide, rayon doux. */
export function Card({
  children,
  style,
  shadow = SHADOW.hero,
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

/** Pastille / badge pilulaire. */
export function Chip({
  children,
  bg,
  color,
  mono = false,
  size = 40,
  style,
}: {
  children: ReactNode;
  bg: string;
  color: string;
  mono?: boolean;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        background: bg,
        color,
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.1,
        padding: "12px 24px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Barre grise simulant une ligne de texte. */
export function TextBar({
  width,
  height = 18,
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
