import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT } from "../theme";
import { Card, Chip, TextBar } from "../components/primitives";
import { ramp } from "../anim";

const KEEP = [
  { label: "DURÉE", w: "100%" },
  { label: "LOYER", w: "86%" },
  { label: "DÉPÔT", w: "92%" },
];
const EXTRA = ["100%", "92%", "97%", "84%", "95%", "60%", "100%", "88%"];

/**
 * Démo 2 — Le dossier qui se résume. Une carte « Contrat de bail commercial ·
 * 42 pages » aux lignes grises nombreuses se compresse en synthèse
 * DURÉE/LOYER/DÉPÔT, badge « 12 lignes », « source : p. 17 » (nowrap).
 */
export function DemoDocument({ local }: { local: number; fps: number }) {
  const t = ramp(local, 40, 92); // 0 = 42 pages, 1 = 12 lignes
  const extraH = interpolate(t, [0, 1], [430, 0]);
  const note = ramp(local, 84, 108);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: 900 }}>
        {/* En-tête */}
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
            <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 46, color: C.ink }}>
              Contrat de bail commercial
            </span>
            <span style={{ fontFamily: FONT.mono, fontSize: 30, color: C.faint }}>
              PDF · 2,4 Mo
            </span>
          </div>
          <span style={{ position: "relative", width: 240, height: 64, flex: "none" }}>
            <span style={{ position: "absolute", inset: 0, opacity: 1 - t }}>
              <Chip bg={C.barTrack} color={C.slate} mono size={34} style={{ width: "100%" }}>
                42 pages
              </Chip>
            </span>
            <span style={{ position: "absolute", inset: 0, opacity: t }}>
              <Chip bg={C.ecume} color={C.inkEcume} mono size={34} style={{ width: "100%" }}>
                12 lignes
              </Chip>
            </span>
          </span>
        </div>

        <div style={{ padding: "40px 44px 44px" }}>
          {/* Synthèse conservée */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {KEEP.map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 32,
                    color: C.quiet,
                    width: 130,
                    flex: "none",
                  }}
                >
                  {l.label}
                </span>
                <TextBar width={l.w} height={22} />
              </div>
            ))}
          </div>

          {/* Lignes excédentaires qui se compressent */}
          <div
            style={{
              overflow: "hidden",
              height: extraH,
              opacity: 1 - t,
              marginTop: extraH > 1 ? 30 : 0,
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            {EXTRA.map((w, i) => (
              <TextBar key={i} width={w} height={22} />
            ))}
          </div>

          {/* Mention + source (nowrap, source dessous à droite) */}
          <div
            style={{
              marginTop: 38,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              opacity: note,
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontSize: 36, color: C.faint, whiteSpace: "nowrap" }}>
              chaque point renvoie à sa page
            </span>
            <span
              style={{
                alignSelf: "flex-end",
                fontFamily: FONT.mono,
                fontWeight: 600,
                fontSize: 36,
                color: C.inkEcume,
                whiteSpace: "nowrap",
              }}
            >
              source : p. 17
            </span>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
}
