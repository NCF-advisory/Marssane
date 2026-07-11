import type { CSSProperties } from "react";

type LogoMarssaneProps = {
  /** Taille du symbole (carré) en px. Défaut 34, comme la nav de la maquette. */
  size?: number;
  /** Ajoute le mot « Marssane » (700) à droite du symbole — lockup horizontal. */
  withWordmark?: boolean;
  className?: string;
  /** Classe posée sur le « + » turquoise, pour l'animer depuis le parent. */
  plusClassName?: string;
};

/**
 * Le cadre-repère : « M » (Plus Jakarta 800) tenu par 3 équerres canard
 * (haut-gauche, bas-gauche, bas-droite) et un « + » turquoise (500) au coin
 * haut-droit. Toutes les cotes sont dérivées proportionnellement du modèle
 * 34 px de la nav (équerres 7×7 · bord 2 · M 20 · + 10).
 *
 * Le symbole est décoratif (aria-hidden) : le mot « Marssane » du lockup reste
 * lisible ; en usage symbole seul, donnez un nom accessible au parent
 * (ex. lien avec aria-label).
 */
export function LogoMarssane({
  size = 34,
  withWordmark = false,
  className,
  plusClassName,
}: LogoMarssaneProps) {
  const k = size / 34;
  const bracket = 7 * k;
  const border = 2 * k;
  const radius = 2 * k;
  const inset = 1 * k;
  const px = (n: number) => `${n}px`;

  const equerre = (extra: CSSProperties): CSSProperties => ({
    position: "absolute",
    width: px(bracket),
    height: px(bracket),
    ...extra,
  });
  const stroke = `${border}px solid var(--color-canard)`;

  const inner = (
    <>
      <span
        style={equerre({
          left: px(inset),
          top: px(inset),
          borderLeft: stroke,
          borderTop: stroke,
          borderRadius: `${radius}px 0 0 0`,
        })}
      />
      <span
        className={plusClassName}
        style={{
          position: "absolute",
          right: 0,
          top: px(-inset),
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          fontSize: px(10 * k),
          lineHeight: 1,
          color: "var(--color-turquoise)",
        }}
      >
        +
      </span>
      <span
        style={equerre({
          left: px(inset),
          bottom: px(inset),
          borderLeft: stroke,
          borderBottom: stroke,
          borderRadius: `0 0 0 ${radius}px`,
        })}
      />
      <span
        style={equerre({
          right: px(inset),
          bottom: px(inset),
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
          fontFamily: "var(--font-sans)",
          fontWeight: 800,
          fontSize: px(20 * k),
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "var(--color-ink)",
        }}
      >
        M
      </span>
    </>
  );

  const markStyle: CSSProperties = { width: px(size), height: px(size) };

  if (!withWordmark) {
    return (
      <span
        aria-hidden
        className={`relative inline-block flex-none ${className ?? ""}`}
        style={markStyle}
      >
        {inner}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center ${className ?? ""}`}
      style={{ gap: px(11 * k) }}
    >
      <span aria-hidden className="relative block flex-none" style={markStyle}>
        {inner}
      </span>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: px(21 * k),
          letterSpacing: "-0.01em",
          color: "var(--color-ink)",
        }}
      >
        Marssane
      </span>
    </span>
  );
}
