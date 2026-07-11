import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT, SHADOW } from "../theme";
import { Kicker, Titre, Card, TextBar } from "../components/primitives";
import { ramp, pop, easeOut } from "../anim";

const N_BARS = 34;
// Hauteurs déterministes de la forme d'onde (0.2–1), motif calme.
const HEIGHTS = Array.from({ length: N_BARS }, (_, i) => {
  const v = Math.sin(i * 0.7) * 0.5 + Math.sin(i * 1.9 + 1) * 0.28;
  return 0.28 + Math.abs(v) * 0.62;
});

const LINES = ["100%", "94%", "97%", "62%"];

/**
 * Cas 3 — Dicter un courrier. Forme d'onde sobre (barres grises qui passent en
 * canard au fil de la lecture), puis une carte courrier dont les lignes
 * s'écrivent, badge « Brouillon · à valider ». Pas de code visuel WhatsApp.
 */
export function Scene5Cas3({ local, fps }: { local: number; fps: number }) {
  const play = ramp(local, 6, 48); // progression de la lecture
  const badge = pop(local, fps, 100);

  const headY = interpolate(local, [0, 20], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 48,
        padding: "0 90px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transform: `translateY(${headY}px)`,
        }}
      >
        <Kicker>Cas 03</Kicker>
        <Titre size={100} style={{ textAlign: "center" }}>
          Dicter un courrier
        </Titre>
      </div>

      {/* Forme d'onde vocale sobre */}
      <Card style={{ width: 780, padding: "34px 40px" }} shadow={SHADOW.float}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <span
            style={{
              fontFamily: FONT.mono,
              fontWeight: 600,
              fontSize: 30,
              color: C.canard,
              flex: "none",
              width: 96,
            }}
          >
            0:42
          </span>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 96,
            }}
          >
            {HEIGHTS.map((h, i) => {
              const played = i / N_BARS < play;
              return (
                <span
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h * 100}%`,
                    borderRadius: 4,
                    background: played ? C.canard : C.repere,
                  }}
                />
              );
            })}
          </div>
        </div>
      </Card>

      {/* Courrier généré, lignes qui s'écrivent */}
      <Card style={{ width: 780 }} shadow={SHADOW.hero}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 34px",
            borderBottom: "1px solid rgba(16,24,40,0.06)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 38,
                letterSpacing: "-0.01em",
                color: C.ink,
              }}
            >
              Courrier — Renouvellement de bail
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: FONT.mono,
                fontSize: 26,
                color: C.quiet,
              }}
            >
              dossier bail · brouillon v1
            </div>
          </div>
        </div>

        <div style={{ padding: "34px 34px 34px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {LINES.map((w, i) => {
              const start = 48 + i * 12;
              const grow = ramp(local, start, start + 22);
              return (
                <div
                  key={i}
                  style={{ width: w, height: 20, position: "relative" }}
                >
                  <TextBar width="100%" height={20} />
                  <TextBar
                    width={`${grow * 100}%`}
                    height={20}
                    color={C.canard}
                    style={{ position: "absolute", inset: 0, opacity: 0.35 }}
                  />
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontSize: 32, color: C.faint }}>
              Brouillon · à valider
            </span>
            <span
              style={{
                background: C.canard,
                color: "#fff",
                fontFamily: FONT.sans,
                fontWeight: 600,
                fontSize: 32,
                padding: "16px 30px",
                borderRadius: 999,
                opacity: Math.min(1, badge),
                transform: `scale(${0.92 + 0.08 * Math.min(1, badge)})`,
              }}
            >
              Relire &amp; signer
            </span>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
}
