import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT } from "../theme";
import { pop, ramp, easeOut } from "../anim";
import { AI_LOGOS } from "../logos";
import { AiLogoGlyph } from "../components/AiLogo";

const L1 = ["OK,", "l'IA", "c'est", "cool."];
const L2 = ["Mais", "pour", "faire"]; // « quoi ? » traité à part (accent + rebond)
const L3 = ["Et", "comment"]; // « faire ? » traité à part (accent + rebond)

/** Un mot qui apparaît : opacité + légère montée, spring doux. */
function Word({
  children,
  local,
  fps,
  delay,
  size,
  color,
}: {
  children: string;
  local: number;
  fps: number;
  delay: number;
  size: number;
  color: string;
}) {
  const p = Math.min(1, pop(local, fps, delay));
  return (
    <span
      style={{
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.02em",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px)`,
      }}
    >
      {children}
    </span>
  );
}

/**
 * G1 — Hook typographique (0–5,2 s). « OK, l'IA c'est cool. » s'écrit mot par
 * mot ; les logos des IA (Claude, ChatGPT, Mistral, GLM) apparaissent en dessous
 * en stagger rapide, puis s'estompent quand « Mais pour faire quoi ? » arrive,
 * « quoi ? » en canard avec un léger rebond. Une seconde question « Et comment
 * faire ? » suit juste après, « faire ? » en canard avec le même rebond.
 */
export function G1Hook({ local, fps }: { local: number; fps: number }) {
  const logosOut = interpolate(local, [66, 82], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const line2In = ramp(local, 74, 90);
  const q = Math.min(1.06, pop(local, fps, 82));
  const line3In = ramp(local, 98, 114);
  const q2 = Math.min(1.06, pop(local, fps, 106));

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
          {L1.map((w, i) => (
            <Word
              key={w}
              local={local}
              fps={fps}
              delay={4 + i * 5}
              size={100}
              color={C.ink}
            >
              {w}
            </Word>
          ))}
        </div>

        {/* Slot partagé : logos (phase 1) puis question (phase 2) */}
        <div
          style={{
            position: "relative",
            height: 150,
            width: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Ligne de logos IA */}
          <div
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              gap: 56,
              opacity: logosOut,
            }}
          >
            {AI_LOGOS.map((logo, i) => {
              const p = Math.min(1, pop(local, fps, 22 + i * 4));
              return (
                <span
                  key={logo.label}
                  style={{
                    opacity: p,
                    transform: `translateY(${(1 - p) * 16}px)`,
                  }}
                >
                  <AiLogoGlyph logo={logo} size={78} />
                </span>
              );
            })}
          </div>

          {/* Question */}
          <div
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "baseline",
              gap: 26,
              opacity: line2In,
            }}
          >
            {L2.map((w, i) => (
              <Word
                key={w}
                local={local}
                fps={fps}
                delay={74 + i * 4}
                size={88}
                color={C.ink}
              >
                {w}
              </Word>
            ))}
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 110,
                letterSpacing: "-0.02em",
                color: C.canard,
                opacity: Math.min(1, q),
                transform: `translateY(${(1 - Math.min(1, q)) * 22}px) scale(${
                  0.9 + 0.1 * q
                })`,
                transformOrigin: "left bottom",
              }}
            >
              quoi ?
            </span>
          </div>
        </div>

        {/* Deuxième question */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 22,
            opacity: line3In,
          }}
        >
          {L3.map((w, i) => (
            <Word
              key={w}
              local={local}
              fps={fps}
              delay={98 + i * 4}
              size={72}
              color={C.ink}
            >
              {w}
            </Word>
          ))}
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 90,
              letterSpacing: "-0.02em",
              color: C.canard,
              opacity: Math.min(1, q2),
              transform: `translateY(${(1 - Math.min(1, q2)) * 22}px) scale(${
                0.9 + 0.1 * q2
              })`,
              transformOrigin: "left bottom",
            }}
          >
            faire ?
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
