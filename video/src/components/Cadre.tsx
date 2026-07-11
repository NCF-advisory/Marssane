import { C, FONT } from "../theme";

type CadreProps = {
  /** Côté du cadre en px (base charte : 176). */
  size: number;
  /** 0→1 : apparition des trois équerres canard. */
  eq?: number;
  /** 0→1 : apparition du « M ». */
  m?: number;
  /** 0→1 (spring) : pop du « + » turquoise. */
  plus?: number;
  /** Variante négatif (équerres/M blancs) pour fonds sombres — non utilisée ici. */
  light?: boolean;
};

/**
 * Le cadre-repère Marssane : « M » Plus Jakarta Sans 800 tenu par trois
 * équerres canard, le quatrième coin marqué d'un « + » turquoise (§01 charte).
 * Géométrie mise à l'échelle depuis la version symbole 176 px.
 * Aucun glow, aucune ombre portée sur le signe.
 */
export function Cadre({ size, eq = 1, m = 1, plus = 1, light = false }: CadreProps) {
  const k = size / 176;
  const stroke = 3.5 * k;
  const arm = 30 * k;
  const off = 6 * k;
  const rad = 5 * k;
  const eqColor = light ? "rgba(255,255,255,0.95)" : C.canard;
  const mColor = light ? "#fff" : C.ink;

  // Chaque équerre « se pose » : léger décalage vers l'extérieur + fondu.
  const eqShift = (1 - eq) * 8 * k;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* haut-gauche */}
      <span
        style={{
          position: "absolute",
          left: off - eqShift,
          top: off - eqShift,
          width: arm,
          height: arm,
          borderLeft: `${stroke}px solid ${eqColor}`,
          borderTop: `${stroke}px solid ${eqColor}`,
          borderRadius: `${rad}px 0 0 0`,
          opacity: eq,
        }}
      />
      {/* bas-gauche */}
      <span
        style={{
          position: "absolute",
          left: off - eqShift,
          bottom: off - eqShift,
          width: arm,
          height: arm,
          borderLeft: `${stroke}px solid ${eqColor}`,
          borderBottom: `${stroke}px solid ${eqColor}`,
          borderRadius: `0 0 0 ${rad}px`,
          opacity: eq,
        }}
      />
      {/* bas-droit */}
      <span
        style={{
          position: "absolute",
          right: off - eqShift,
          bottom: off - eqShift,
          width: arm,
          height: arm,
          borderRight: `${stroke}px solid ${eqColor}`,
          borderBottom: `${stroke}px solid ${eqColor}`,
          borderRadius: `0 0 ${rad}px 0`,
          opacity: eq,
        }}
      />
      {/* « + » turquoise (quatrième coin, la mesure) */}
      <span
        style={{
          position: "absolute",
          right: 4 * k,
          top: -1 * k,
          fontFamily: FONT.sans,
          fontWeight: 500,
          fontSize: 53 * k,
          lineHeight: 1,
          color: C.turquoise,
          opacity: Math.min(1, plus),
          transform: `scale(${plus})`,
          transformOrigin: "top right",
        }}
      >
        +
      </span>
      {/* le « M » */}
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%,-52%) scale(${0.92 + 0.08 * m})`,
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: 100 * k,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: mColor,
          opacity: m,
        }}
      >
        M
      </span>
    </div>
  );
}
