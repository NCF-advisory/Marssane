import { AbsoluteFill } from "remotion";
import { C, FONT, SHADOW } from "../theme";
import { Card, Chip, TextBar } from "../components/primitives";
import { ramp, pop } from "../anim";

const N_BARS = 38;
// Hauteurs déterministes de la forme d'onde (motif calme).
const HEIGHTS = Array.from({ length: N_BARS }, (_, i) => {
  const v = Math.sin(i * 0.7) * 0.5 + Math.sin(i * 1.9 + 1) * 0.28;
  return 0.26 + Math.abs(v) * 0.64;
});

const LINES = ["100%", "96%", "92%", "98%", "58%"];

/**
 * Démo 3 — La note vocale qui devient courrier. Forme d'onde qui se joue
 * (barres grises → canard), puis le courrier « Renouvellement de bail » dont les
 * lignes s'écrivent, pied « Brouillon · à valider » + « Relire & signer ».
 */
export function DemoLetter({ local, fps }: { local: number; fps: number }) {
  const play = ramp(local, 6, 52);
  const cta = pop(local, fps, 118);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        {/* Forme d'onde vocale sobre */}
        <Card style={{ width: 900, padding: "40px 48px" }} shadow={SHADOW.float}>
          <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
            <span
              style={{
                fontFamily: FONT.mono,
                fontWeight: 600,
                fontSize: 40,
                color: C.canard,
                flex: "none",
                width: 120,
              }}
            >
              0:42
            </span>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, height: 110 }}>
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

        {/* Courrier généré */}
        <Card style={{ width: 900 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "34px 44px",
              borderBottom: "1px solid rgba(16,24,40,0.06)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 44, color: C.ink }}>
                Courrier — Renouvellement de bail
              </span>
              <span style={{ fontFamily: FONT.mono, fontSize: 30, color: C.faint }}>
                dossier bail · brouillon v1
              </span>
            </div>
          </div>

          <div style={{ padding: "40px 44px 44px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              {LINES.map((w, i) => {
                const start = 54 + i * 12;
                const grow = ramp(local, start, start + 22);
                return (
                  <div key={i} style={{ width: w, height: 24, position: "relative" }}>
                    <TextBar width="100%" height={24} />
                    <TextBar
                      width={`${grow * 100}%`}
                      height={24}
                      color={C.canard}
                      style={{ position: "absolute", inset: 0, opacity: 0.32 }}
                    />
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: FONT.sans, fontSize: 38, color: C.faint }}>
                Brouillon · à valider
              </span>
              <Chip
                bg={C.canard}
                color="#fff"
                size={38}
                style={{
                  opacity: Math.min(1, cta),
                  transform: `scale(${0.92 + 0.08 * Math.min(1, cta)})`,
                }}
              >
                Relire &amp; signer
              </Chip>
            </div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
}
