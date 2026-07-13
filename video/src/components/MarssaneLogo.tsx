import type { CSSProperties } from "react";
import { C, FONT } from "../theme";

/**
 * Lockup Marssane pour la vidéo : reprend à l'identique le symbole du site
 * (components/ui/LogoMarssane) — un « M » (Plus Jakarta 800) tenu par trois
 * équerres canard et un « + » turquoise au coin haut-droit — puis le mot
 * « Marssane » (700). Toutes les cotes dérivent du modèle 34 px de la nav.
 */
export function MarssaneLogo({ size = 96 }: { size?: number }) {
  const k = size / 34;
  const bracket = 7 * k;
  const border = 2 * k;
  const radius = 2 * k;
  const inset = 1 * k;
  const stroke = `${border}px solid ${C.canard}`;

  const eq = (extra: CSSProperties): CSSProperties => ({
    position: "absolute",
    width: bracket,
    height: bracket,
    ...extra,
  });

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 11 * k }}>
      <span
        style={{ position: "relative", width: size, height: size, flex: "none" }}
      >
        <span
          style={eq({
            left: inset,
            top: inset,
            borderLeft: stroke,
            borderTop: stroke,
            borderRadius: `${radius}px 0 0 0`,
          })}
        />
        <span
          style={{
            position: "absolute",
            right: 0,
            top: -inset,
            fontFamily: FONT.sans,
            fontWeight: 500,
            fontSize: 10 * k,
            lineHeight: 1,
            color: C.turquoise,
          }}
        >
          +
        </span>
        <span
          style={eq({
            left: inset,
            bottom: inset,
            borderLeft: stroke,
            borderBottom: stroke,
            borderRadius: `0 0 0 ${radius}px`,
          })}
        />
        <span
          style={eq({
            right: inset,
            bottom: inset,
            borderRight: stroke,
            borderBottom: stroke,
            borderRadius: `0 0 ${radius}px 0`,
          })}
        />
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-52%)",
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 20 * k,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: C.ink,
          }}
        >
          M
        </span>
      </span>
      <span
        style={{
          fontFamily: FONT.sans,
          fontWeight: 700,
          fontSize: 21 * k,
          letterSpacing: "-0.01em",
          color: C.ink,
        }}
      >
        Marssane
      </span>
    </span>
  );
}
