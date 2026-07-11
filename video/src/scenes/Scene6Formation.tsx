import { AbsoluteFill } from "remotion";
import { C, FONT } from "../theme";
import { Titre } from "../components/primitives";
import { Cadre } from "../components/Cadre";
import { ramp, pop } from "../anim";

const ROWS = [
  { n: "1", label: "journée" },
  { n: "10", label: "places" },
  { n: "1", label: "système fonctionnel" },
];

/**
 * Formation + clôture. Les trois chiffres (1 journée · 10 places · 1 système
 * fonctionnel) apparaissent en cadence, mono canard sombre #006560 ; puis
 * « Réservez votre place » avec le cadre-repère. Le fondu final vers la toile
 * (géré par l'overlay global) raccorde à l'ouverture pour la boucle.
 */
export function Scene6Formation({ local, fps }: { local: number; fps: number }) {
  const rowsOut = ramp(local, 88, 110); // les chiffres s'effacent
  const ctaIn = ramp(local, 96, 122); // le CTA arrive
  const ctaY = (1 - ctaIn) * 30;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Les trois chiffres */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          gap: 34,
          opacity: 1 - rowsOut,
        }}
      >
        {ROWS.map((r, i) => {
          const p = pop(local, fps, i * 18);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 34,
                opacity: Math.min(1, p),
                transform: `translateY(${(1 - Math.min(1, p)) * 24}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontWeight: 600,
                  fontSize: 190,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: C.inkEcume,
                  minWidth: 200,
                  textAlign: "right",
                }}
              >
                {r.n}
              </span>
              <span
                style={{
                  fontFamily: FONT.sans,
                  fontWeight: 700,
                  fontSize: 68,
                  letterSpacing: "-0.01em",
                  color: C.ink,
                }}
              >
                {r.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Clôture : cadre-repère + « Réservez votre place » */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
          opacity: ctaIn,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <Cadre size={210} />
        <Titre size={96} style={{ textAlign: "center" }}>
          Réservez votre place
        </Titre>
      </div>
    </AbsoluteFill>
  );
}
