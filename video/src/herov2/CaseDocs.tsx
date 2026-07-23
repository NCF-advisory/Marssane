import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { easeOut } from "../anim";
import { TextBar } from "../components/primitives";

/**
 * CAS 2 (héro v2) — un document volumineux synthétisé. Version condensée (~5 s)
 * qui reprend le langage visuel du Cas 2 : PDF « 42 pages » → « Synthèse ·
 * 12 lignes » avec rubriques sourcées et points d'attention.
 *
 * Texte d'interface uniquement. Le recul de l'horloge (+40 min) est géré par le
 * calque maître, quand la synthèse est au repos.
 */

const CARD_W = 1040;
const CARD_H = 660;
const HEADER_H = 96;
const PAD = 46;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const DOC_LINES = ["96%", "89%", "93%", "71%", "97%", "85%", "91%", "64%", "94%", "88%"];

const RUBRIQUES = [
  { label: "PRIX", texte: "révision annuelle plafonnée à 3 %", page: "p. 17" },
  { label: "DURÉE", texte: "24 mois, tacite reconduction", page: "p. 4" },
  { label: "RÉSILIATION", texte: "préavis 3 mois", page: "p. 23" },
];

export function CaseDocs({ local }: { local: number }) {
  const cardIn = easeOut(clamp01(local / 22));

  const docOp = interpolate(local, [60, 80], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const docLift = interpolate(local, [60, 80], [0, -26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const synthOp = interpolate(local, [66, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const synthRise = interpolate(local, [66, 92], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          width: CARD_W,
          height: CARD_H,
          background: C.surface,
          borderRadius: RADIUS.card,
          border: "1px solid rgba(16,24,40,0.06)",
          boxShadow: SHADOW.hero,
          overflow: "hidden",
          opacity: cardIn,
          transform: `scale(${0.96 + 0.04 * cardIn})`,
        }}
      >
        {/* --- Vue document --- */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: docOp,
            transform: `translateY(${docLift}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: HEADER_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `0 ${PAD}px`,
              borderBottom: "1px solid rgba(16,24,40,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: 26,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.quiet,
              }}
            >
              Contrat fournisseur · 42 pages
            </span>
            <span style={{ fontFamily: FONT.mono, fontSize: 24, color: C.quiet }}>
              2,4 Mo
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              left: PAD,
              right: PAD,
              top: HEADER_H + 40,
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: "-0.01em",
              color: C.ink,
            }}
          >
            Contrat de prestation — Services SA
          </div>

          <div
            style={{
              position: "absolute",
              left: PAD,
              right: PAD,
              top: HEADER_H + 116,
            }}
          >
            {DOC_LINES.map((w, i) => {
              const p = easeOut(clamp01((local - (10 + i * 3)) / 12));
              return (
                <div
                  key={i}
                  style={{
                    marginTop: i === 0 ? 0 : 22,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 8}px)`,
                  }}
                >
                  <TextBar width={w} height={15} />
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Vue synthèse --- */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: synthOp,
            transform: `translateY(${synthRise}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 4,
              background: C.turquoise,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: HEADER_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `0 ${PAD}px`,
              borderBottom: "1px solid rgba(16,24,40,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: "-0.01em",
                color: C.ink,
              }}
            >
              Synthèse · 12 lignes
            </span>
            <span
              style={{
                background: C.ecume,
                color: C.inkEcume,
                fontFamily: FONT.mono,
                fontSize: 24,
                padding: "8px 18px",
                borderRadius: 999,
              }}
            >
              synthétisé
            </span>
          </div>

          {/* Rubriques */}
          <div
            style={{
              position: "absolute",
              left: PAD,
              right: PAD,
              top: HEADER_H + 40,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {RUBRIQUES.map((r, i) => {
              const p = easeOut(clamp01((local - (74 + i * 12)) / 16));
              return (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 24,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 10}px)`,
                  }}
                >
                  <span
                    style={{
                      flex: "none",
                      width: 240,
                      fontFamily: FONT.mono,
                      fontSize: 24,
                      letterSpacing: "0.06em",
                      color: C.quiet,
                    }}
                  >
                    {r.label}
                  </span>
                  <span
                    style={{ flex: 1, fontFamily: FONT.sans, fontSize: 30, color: C.body }}
                  >
                    {r.texte}
                  </span>
                  <span
                    style={{ flex: "none", fontFamily: FONT.mono, fontSize: 22, color: C.faint }}
                  >
                    {r.page}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Points d'attention */}
          <Attention local={local} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Attention({ local }: { local: number }) {
  const p = easeOut(clamp01((local - 100) / 16));
  return (
    <div
      style={{
        position: "absolute",
        left: PAD,
        right: PAD,
        bottom: 44,
        padding: "22px 28px",
        borderRadius: RADIUS.btn,
        background: "#F5F7F9",
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 26, color: C.clay }}>
        ⚠ 2 points d&apos;attention
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: FONT.sans,
          fontSize: 28,
          lineHeight: 1.5,
          color: C.body,
        }}
      >
        pénalités de retard non plafonnées · exclusivité art. 8
      </div>
    </div>
  );
}
