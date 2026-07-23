import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { easeOut } from "../anim";
import { TextBar } from "../components/primitives";

/**
 * CAS 3 (héro v2) — un process automatisé (relances). Version condensée (~5 s)
 * qui reprend le langage visuel du Cas 3 : une note vocale se transforme en
 * courrier de relance prêt, avec le bouton « Relire & signer » (l'humain valide).
 *
 * Texte d'interface uniquement. Le recul de l'horloge (+35 min) est géré par le
 * calque maître, quand le courrier est au repos.
 */

const CARD_W = 1040;
const CARD_H = 660;
const HEADER_H = 96;
const PAD = 46;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// Hauteurs de la forme d'onde (déterministe, allure d'une voix).
const WAVE = [
  0.3, 0.55, 0.4, 0.8, 0.65, 0.95, 0.5, 0.35, 0.7, 0.85, 0.45, 0.6, 0.9, 0.5,
  0.3, 0.55, 0.75, 0.95, 0.6, 0.4, 0.5, 0.8, 0.65, 0.35, 0.7, 0.9, 0.55, 0.45,
  0.6, 0.85, 0.5, 0.3, 0.65, 0.8, 0.4, 0.55, 0.7, 0.5, 0.35, 0.6,
];

const LETTER_LINES = [
  "Bonjour,",
  "sauf erreur de notre part, la facture n° 2026-118",
  "reste à ce jour en attente de règlement.",
];

export function CaseRelance({ local }: { local: number }) {
  const cardIn = easeOut(clamp01(local / 22));

  const voiceOp = interpolate(local, [60, 80], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const voiceLift = interpolate(local, [60, 80], [0, -26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const letterOp = interpolate(local, [66, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const letterRise = interpolate(local, [66, 92], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  // Tête de lecture qui parcourt la forme d'onde (une seule animation).
  const play = clamp01((local - 30) / 28);

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
        {/* --- Vue note vocale --- */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: voiceOp,
            transform: `translateY(${voiceLift}px)`,
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
              Note vocale · 0:12
            </span>
          </div>

          {/* Lecteur : triangle + forme d'onde */}
          <div
            style={{
              position: "absolute",
              left: PAD,
              right: PAD,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <span
              style={{
                flex: "none",
                width: 84,
                height: 84,
                borderRadius: 999,
                background: C.canard,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: 0,
                  height: 0,
                  marginLeft: 6,
                  borderTop: "18px solid transparent",
                  borderBottom: "18px solid transparent",
                  borderLeft: "30px solid #FFFFFF",
                }}
              />
            </span>
            <div
              style={{
                flex: 1,
                height: 140,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {WAVE.map((h, i) => {
                const played = i / WAVE.length <= play;
                return (
                  <span
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h * 100}%`,
                      borderRadius: 4,
                      background: played ? C.canard : C.periwinkle,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* --- Vue courrier de relance --- */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: letterOp,
            transform: `translateY(${letterRise}px)`,
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
                fontSize: 32,
                letterSpacing: "-0.01em",
                color: C.ink,
              }}
            >
              Relance — facture n° 2026-118
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
              rédigé
            </span>
          </div>

          {/* Corps du courrier */}
          <div
            style={{
              position: "absolute",
              left: PAD,
              right: PAD,
              top: HEADER_H + 44,
            }}
          >
            {LETTER_LINES.map((line, i) => {
              const p = easeOut(clamp01((local - (74 + i * 10)) / 16));
              return (
                <div
                  key={i}
                  style={{
                    marginTop: i === 0 ? 0 : 16,
                    fontFamily: FONT.sans,
                    fontSize: 32,
                    lineHeight: 1.5,
                    color: C.body,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 8}px)`,
                  }}
                >
                  {line}
                </div>
              );
            })}
            <div
              style={{
                marginTop: 34,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                opacity: easeOut(clamp01((local - 100) / 14)),
              }}
            >
              <TextBar width="86%" height={15} />
              <TextBar width="58%" height={15} />
            </div>
          </div>

          {/* Bouton « Relire & signer » */}
          <div
            style={{
              position: "absolute",
              right: PAD,
              bottom: 44,
              opacity: easeOut(clamp01((local - 104) / 14)),
            }}
          >
            <span
              style={{
                display: "inline-flex",
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 28,
                color: "#FFFFFF",
                background: C.canard,
                padding: "16px 30px",
                borderRadius: RADIUS.btn,
                boxShadow: SHADOW.card,
              }}
            >
              Relire &amp; signer
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
