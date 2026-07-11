import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT, SHADOW } from "../theme";
import { Kicker, Titre, Card, TextBar } from "../components/primitives";
import { ramp, easeOut } from "../anim";

const KEEP = [
  { w: "100%", label: "DURÉE" },
  { w: "88%", label: "LOYER" },
  { w: "94%", label: "DÉPÔT" },
  { w: "70%", label: "" },
];
const EXTRA_WIDTHS = ["100%", "92%", "97%", "84%", "95%", "60%"];

/**
 * Cas 2 — Résumer un dossier. Une carte document « 42 pages » dont les lignes
 * grises se compressent en « 12 lignes » (badge écume), mention « chaque point
 * renvoie à sa page ». Wording repris de la maquette (contrat de bail).
 */
export function Scene4Cas2({ local }: { local: number; fps: number }) {
  const t = ramp(local, 36, 86); // 0 = 42 pages / 1 = 12 lignes
  const extraH = interpolate(t, [0, 1], [236, 0]);
  const noteOpacity = ramp(local, 78, 104);

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
        gap: 52,
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
        <Kicker>Cas 02</Kicker>
        <Titre size={100} style={{ textAlign: "center" }}>
          Résumer un dossier
        </Titre>
      </div>

      <Card style={{ width: 780 }} shadow={SHADOW.hero}>
        {/* En-tête : titre + chip qui passe de « 42 pages » à « 12 lignes » */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 34px",
            borderBottom: "1px solid rgba(16,24,40,0.06)",
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "-0.01em",
              color: C.ink,
            }}
          >
            Contrat de bail commercial
          </span>
          <span style={{ position: "relative", width: 210, height: 58 }}>
            <Chip opacity={1 - t} bg={C.barTrack} color={C.slate} text="42 pages" />
            <Chip opacity={t} bg={C.ecume} color={C.inkEcume} text="12 lignes" />
          </span>
        </div>

        <div style={{ padding: "30px 34px 34px" }}>
          {/* Lignes conservées (la synthèse) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {KEEP.map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 26,
                    color: C.quiet,
                    width: 96,
                    flex: "none",
                  }}
                >
                  {l.label}
                </span>
                <TextBar width={l.w} height={18} />
              </div>
            ))}
          </div>

          {/* Lignes excédentaires qui se compressent */}
          <div
            style={{
              overflow: "hidden",
              height: extraH,
              opacity: 1 - t,
              marginTop: extraH > 1 ? 24 : 0,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {EXTRA_WIDTHS.map((w, i) => (
              <TextBar key={i} width={w} height={18} />
            ))}
          </div>

          {/* Mention (ligne pleine largeur) + source dessous à droite */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              opacity: noteOpacity,
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontSize: 32,
                color: C.faint,
                whiteSpace: "nowrap",
              }}
            >
              chaque point renvoie à sa page
            </span>
            <span
              style={{
                alignSelf: "flex-end",
                fontFamily: FONT.mono,
                fontWeight: 600,
                fontSize: 32,
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

function Chip({
  opacity,
  bg,
  color,
  text,
}: {
  opacity: number;
  bg: string;
  color: string;
  text: string;
}) {
  return (
    <span
      style={{
        position: "absolute",
        inset: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        color,
        borderRadius: 999,
        fontFamily: FONT.mono,
        fontWeight: 600,
        fontSize: 32,
        opacity,
      }}
    >
      {text}
    </span>
  );
}
