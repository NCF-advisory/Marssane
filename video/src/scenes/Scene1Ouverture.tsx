import { AbsoluteFill, interpolate } from "remotion";
import { Cadre } from "../components/Cadre";
import { C, FONT } from "../theme";
import { ramp, pop, easeOut } from "../anim";

/**
 * Ouverture : le cadre-repère se construit (équerres tracées, « M », « + »
 * turquoise qui pop), puis le wordmark « Marssane ». La toile est déjà posée
 * dessous par le décor constant.
 */
export function Scene1Ouverture({ local, fps }: { local: number; fps: number }) {
  const eq = ramp(local, 8, 40);
  const m = ramp(local, 34, 62);
  const plus = pop(local, fps, 58);

  const wordT = interpolate(local, [64, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const wordY = (1 - wordT) * 34;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 56,
      }}
    >
      <Cadre size={440} eq={eq} m={m} plus={plus} />
      <div
        style={{
          fontFamily: FONT.sans,
          fontWeight: 700,
          fontSize: 132,
          letterSpacing: "-0.01em",
          color: C.ink,
          opacity: wordT,
          transform: `translateY(${wordY}px)`,
        }}
      >
        Marssane
      </div>
    </AbsoluteFill>
  );
}
