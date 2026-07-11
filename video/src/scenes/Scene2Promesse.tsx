import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT } from "../theme";
import { ramp, pop, easeOut } from "../anim";

/**
 * Promesse : le H1 de la landing. « cas concrets » en surlignage canard qui se
 * déploie (le bloc canard + texte blanc se révèle de gauche à droite), puis le
 * « + » turquoise qui pop. Wording strictement identique à la maquette.
 */
export function Scene2Promesse({ local, fps }: { local: number; fps: number }) {
  // Le titre doit être COMPLET à la frame du poster (157 = local 57) :
  // le surlignage se déploie puis le « + » pop, tout terminé avant local ~50.
  const reveal = ramp(local, 18, 44) * 100; // % révélé du surlignage
  const plus = pop(local, fps, 30);
  const titleY = interpolate(local, [0, 22], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", padding: "0 90px" }}
    >
      <h1
        style={{
          margin: 0,
          maxWidth: 900,
          textAlign: "center",
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: 100,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          color: C.ink,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Une formation IA
        <br />
        sur des{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span
            style={{
              background: C.canard,
              color: "#fff",
              padding: "0 0.2em 0.05em",
              clipPath: `inset(0 ${100 - reveal}% 0 0)`,
            }}
          >
            cas concrets
          </span>
          <span
            style={{
              position: "absolute",
              right: "-0.56em",
              top: "-0.5em",
              color: C.turquoise,
              fontWeight: 500,
              fontSize: "0.64em",
              lineHeight: 1,
              opacity: Math.min(1, plus),
              transform: `scale(${plus})`,
              transformOrigin: "center",
            }}
          >
            +
          </span>
        </span>
        {"."}
      </h1>
    </AbsoluteFill>
  );
}
