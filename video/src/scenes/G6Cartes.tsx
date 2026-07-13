import { AbsoluteFill } from "remotion";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { ramp, pop } from "../anim";

const CARD_W = 1120;

/**
 * G6 — Aller plus loin (30,5–37,5 s). Une carte « Nous vous formons à
 * l'utilisation de l'IA. » glisse au centre ; une seconde se déplie depuis la
 * première, comme une extension naturelle : « Envie d'aller plus loin ? Nous
 * l'implémentons chez vous. » avec une flèche discrète. Installe l'architecture
 * de l'offre (formation → implémentation), sans discours.
 */
export function G6Cartes({ local, fps }: { local: number; fps: number }) {
  const c1 = Math.min(1, pop(local, fps, 8));
  const unfold = ramp(local, 56, 92); // dépliage de la 2e carte
  const arrowT = ramp(local, 48, 68);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Carte 1 — la formation */}
        <div
          style={{
            width: CARD_W,
            background: C.surface,
            borderRadius: RADIUS.card,
            border: "1px solid rgba(16,24,40,0.06)",
            borderLeft: `6px solid ${C.canard}`,
            boxShadow: SHADOW.hero,
            padding: "48px 56px",
            opacity: c1,
            transform: `translateY(${(1 - c1) * 60}px)`,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 24,
              letterSpacing: "0.04em",
              color: C.faint,
            }}
          >
            la formation
          </span>
          <p
            style={{
              margin: "16px 0 0",
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 58,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            Nous vous formons à l&apos;utilisation de l&apos;IA.
          </p>
        </div>

        {/* Flèche discrète de liaison */}
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: arrowT,
            transform: `translateY(${(1 - arrowT) * -10}px)`,
          }}
        >
          <span style={{ fontSize: 40, color: C.canard, lineHeight: 1 }}>↓</span>
        </div>

        {/* Carte 2 — l'implémentation, qui se déplie */}
        <div
          style={{
            width: CARD_W,
            overflow: "hidden",
            opacity: unfold,
            transform: `scaleY(${0.4 + 0.6 * unfold})`,
            transformOrigin: "top center",
          }}
        >
          <div
            style={{
              background: C.ecume,
              borderRadius: RADIUS.card,
              border: `1px solid ${C.turquoise}`,
              padding: "48px 56px",
              display: "flex",
              alignItems: "center",
              gap: 32,
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 24,
                  letterSpacing: "0.04em",
                  color: C.inkEcume,
                }}
              >
                aller plus loin
              </span>
              <p
                style={{
                  margin: "16px 0 0",
                  fontFamily: FONT.sans,
                  fontWeight: 800,
                  fontSize: 58,
                  lineHeight: 1.12,
                  letterSpacing: "-0.02em",
                  color: C.inkEcume,
                }}
              >
                Envie d&apos;aller plus loin ? Nous l&apos;implémentons chez
                vous.
              </p>
            </div>
            <span
              style={{ fontSize: 64, color: C.inkEcume, lineHeight: 1, flex: "none" }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
