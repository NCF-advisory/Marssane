import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { TextBar } from "../components/primitives";
import { pop, easeOut } from "../anim";

/** Documents des professions cibles, empilés de plus en plus vite. */
type Doc = {
  title: string;
  sub: string;
  lines: [string, string];
  alert?: boolean;
};

const DOCS: Doc[] = [
  { title: "Acte notarié", sub: "minute · 32 p.", lines: ["94%", "70%"] },
  { title: "Bilan comptable", sub: "exercice 2025", lines: ["88%", "62%"] },
  { title: "Dossier juridique", sub: "conclusions", lines: ["96%", "74%"] },
  { title: "Boîte mail", sub: "247 non lus", lines: ["90%", "58%"], alert: true },
  { title: "Contrat de bail", sub: "renouvellement", lines: ["92%", "66%"] },
  { title: "Relevé bancaire", sub: "juillet", lines: ["84%", "54%"] },
  { title: "Parapheur", sub: "8 à signer", lines: ["78%", "60%"] },
  { title: "Note d'honoraires", sub: "à émettre", lines: ["86%", "50%"] },
  { title: "Assignation", sub: "délai 15 jours", lines: ["95%", "72%"] },
];

// Position finale sur la pile (centre écran = 960,540). Étalé pour couvrir large.
const PLACE: Array<{ x: number; y: number; r: number }> = [
  { x: -40, y: -250, r: -5 },
  { x: 300, y: -120, r: 5 },
  { x: -360, y: -90, r: -4 },
  { x: 80, y: 30, r: 3 },
  { x: -200, y: 210, r: -6 },
  { x: 360, y: 190, r: 6 },
  { x: -420, y: -260, r: -3 },
  { x: 420, y: -250, r: 7 },
  { x: 20, y: -40, r: -2 },
];

// Instants d'apparition qui accélèrent (intervalles décroissants).
const APPEAR = [8, 28, 46, 62, 76, 88, 98, 106, 112];

const CARD_W = 560;

function ClockFace({ local }: { local: number }) {
  // Aiguilles qui tournent en accéléré ; la minute file, l'heure suit.
  const minute = local * 11;
  const hour = local * 1.4;
  const r = 70;
  const cx = 90;
  const cy = 90;
  return (
    <svg
      width={180}
      height={180}
      viewBox="0 0 180 180"
      style={{ position: "absolute", right: 92, top: 84 }}
    >
      <circle cx={cx} cy={cy} r={r} fill={C.surface} stroke={C.repere} strokeWidth={3} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx + Math.sin(a) * (r - 8)}
            y1={cy - Math.cos(a) * (r - 8)}
            x2={cx + Math.sin(a) * (r - 2)}
            y2={cy - Math.cos(a) * (r - 2)}
            stroke={C.quiet}
            strokeWidth={2}
          />
        );
      })}
      <line
        x1={cx}
        y1={cy}
        x2={cx + Math.sin((hour * Math.PI) / 180) * 34}
        y2={cy - Math.cos((hour * Math.PI) / 180) * 34}
        stroke={C.ink}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={cx + Math.sin((minute * Math.PI) / 180) * 52}
        y2={cy - Math.cos((minute * Math.PI) / 180) * 52}
        stroke={C.canard}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={5} fill={C.ink} />
    </svg>
  );
}

/**
 * G2 — La journée surchargée (6–14 s). Des documents professionnels stylisés
 * (acte, bilan, dossier, boîte mail « 247 non lus »…) s'empilent au centre en
 * s'accumulant de plus en plus vite, pendant qu'une horloge minimaliste tourne
 * en accéléré dans un coin. Fin : la pile occupe l'écran. Style flat premium.
 */
export function G2Pile({ local, fps }: { local: number; fps: number }) {
  // Léger « débordement » de la pile en fin de séquence.
  const swell = interpolate(local, [112, 150], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      <ClockFace local={local} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `scale(${swell})` }}>
          {DOCS.map((d, i) => {
            const p = Math.min(1, pop(local, fps, APPEAR[i]));
            if (p <= 0.001) return null;
            const place = PLACE[i];
            return (
              <div
                key={d.title}
                style={{
                  position: "absolute",
                  left: -CARD_W / 2 + place.x,
                  top: -110 + place.y,
                  width: CARD_W,
                  background: C.surface,
                  border: "1px solid rgba(16,24,40,0.06)",
                  borderRadius: RADIUS.card,
                  boxShadow: SHADOW.card,
                  padding: "22px 26px",
                  opacity: p,
                  transform: `translateY(${(1 - p) * -46}px) rotate(${place.r * p}deg)`,
                  zIndex: i,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT.sans,
                      fontWeight: 700,
                      fontSize: 32,
                      color: C.ink,
                    }}
                  >
                    {d.title}
                  </span>
                  {d.alert ? (
                    <span
                      style={{
                        fontFamily: FONT.sans,
                        fontWeight: 600,
                        fontSize: 22,
                        color: "#fff",
                        background: C.clay,
                        borderRadius: 999,
                        padding: "6px 16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.sub}
                    </span>
                  ) : (
                    <span
                      style={{ fontFamily: FONT.mono, fontSize: 22, color: C.faint }}
                    >
                      {d.sub}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <TextBar width={d.lines[0]} height={14} />
                  <TextBar width={d.lines[1]} height={14} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
