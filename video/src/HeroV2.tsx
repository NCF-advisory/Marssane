import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { C, FONT } from "./theme";
import { sceneOpacity, easeOut } from "./anim";
import { Toile } from "./components/Toile";
import { MarssaneLogo } from "./components/MarssaneLogo";
import { CaseMails } from "./herov2/CaseMails";
import { CaseDocs } from "./herov2/CaseDocs";
import { CaseRelance } from "./herov2/CaseRelance";

/**
 * Vidéo héro v2 « Le compteur de temps » (1920×1080, 30 fps, 750 frames =
 * 25,000 s). Muette, en boucle. Mêmes dimensions et même encodage que le héro
 * existant (bt709 plage limitée, via remotion.config.ts).
 *
 * Structure (v2.3) :
 *   1. Hook typographique « Nos formations IA / vous font gagner du temps ».
 *   2-4. Trois cas d'usage, chacun précédé d'une mini-phrase d'annonce (kicker
 *        en haut du cadre) ; à la fin de chaque cas, une TRANSITION plein centre
 *        affiche le gain en grand (« +45 min », « +40 min », « +35 min »).
 *   5. Finale : « Tout ça, vous le construisez en formation. » → payoff
 *      « 2 h rendues, chaque jour. » (barre à 100 %) → logo Marssane +
 *      « Formation pour dirigeants de PME » + « 2 demi-journées, selon votre
 *      agenda », puis fondu de boucle.
 *
 * Fil rouge : une BARRE DE PROGRESSION persistante en bas de cadre (piste
 * bar-track, remplissage canard→turquoise) qui se remplit par paliers pendant
 * les transitions de gain : 37 % → 71 % → 100 % (= 2 h). Plus d'horloge.
 *
 * Boucle invisible : la dernière frame se fond vers la toile nue, identique à la
 * première. Storyboard détaillé : `video/storyboard-hero-v2.md`.
 */

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const step = (f: number, a: number, b: number, from: number, to: number) =>
  from + (to - from) * easeOut(clamp01((f - a) / (b - a)));

/* --------------------------- Découpage (frames) -------------------------- */

const CASE1_START = 90;
const CASE2_START = 254;
const CASE3_START = 418;

const SCENES = [
  { Comp: Offer, start: 0, inDur: 0, end: 96, outDur: 10 },
  { Comp: CaseMails, start: CASE1_START, inDur: 10, end: 228, outDur: 12 },
  { Comp: CaseDocs, start: CASE2_START, inDur: 10, end: 392, outDur: 12 },
  { Comp: CaseRelance, start: CASE3_START, inDur: 10, end: 556, outDur: 12 },
  { Comp: Finale, start: 574, inDur: 14, end: 750, outDur: 14 },
] as const;

// Transitions de gain plein centre (dans les intervalles entre les cas).
const GAINS = [
  { label: "+45 min", start: 224, end: 258 },
  { label: "+40 min", start: 388, end: 420 },
  { label: "+35 min", start: 552, end: 584 },
] as const;

// Mini-phrases d'annonce (kickers), en haut, au-dessus de la carte mockup.
const KICKERS = [
  { start: CASE1_START, text: "Répondez automatiquement aux relances des clients" },
  { start: CASE2_START, text: "Retenez seulement l'important de vos réunions" },
  { start: CASE3_START, text: "Automatisez la relance de vos clients" },
] as const;

/** Remplissage de la barre : 0 → 0,37 → 0,71 → 1, par paliers sur les gains. */
function progressFrac(f: number): number {
  if (f < 228) return 0;
  if (f < 252) return step(f, 228, 252, 0, 0.37);
  if (f < 392) return 0.37;
  if (f < 416) return step(f, 392, 416, 0.37, 0.71);
  if (f < 556) return 0.71;
  if (f < 580) return step(f, 556, 580, 0.71, 1);
  return 1;
}

export function HeroV2() {
  const frame = useCurrentFrame();

  const barOp = interpolate(frame, [86, 106, 700, 720], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.toile }}>
      <Toile />

      {SCENES.map(({ Comp, start, inDur, end, outDur }, i) => {
        const op = sceneOpacity(frame, start, inDur, end, outDur);
        if (op <= 0.001) return null;
        return (
          <AbsoluteFill key={i} style={{ opacity: op }}>
            <Comp local={frame - start} />
          </AbsoluteFill>
        );
      })}

      {/* Transitions de gain plein centre */}
      {GAINS.map((g) => (
        <GainBig key={g.label} frame={frame} start={g.start} end={g.end} label={g.label} />
      ))}

      {/* Mini-phrases d'annonce (kickers) */}
      {KICKERS.map((k) => (
        <CaseKicker key={k.start} frame={frame} start={k.start} text={k.text} />
      ))}

      {/* Barre de progression persistante (bas de cadre) */}
      <ProgressBar frac={progressFrac(frame)} opacity={barOp} />
    </AbsoluteFill>
  );
}

/* ---------------------------- Barre de progression ----------------------- */

function ProgressBar({ frac, opacity }: { frac: number; opacity: number }) {
  if (opacity <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 150, right: 150, top: 1004, opacity }}>
      {/* Étiquette de fin de piste */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: -40,
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: "0.04em",
          color: C.slate,
        }}
      >
        2 h
      </div>
      {/* Piste */}
      <div
        style={{
          position: "relative",
          height: 12,
          borderRadius: 999,
          background: C.barTrack,
          overflow: "hidden",
        }}
      >
        {/* Remplissage canard → turquoise */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${frac * 100}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${C.canard}, ${C.turquoise})`,
          }}
        />
      </div>
    </div>
  );
}

/* --------------------------- Transition de gain -------------------------- */

/** Gain plein centre, mono gras : apparition punchy (scale) mais maîtrisée. */
function GainBig({
  frame,
  start,
  end,
  label,
}: {
  frame: number;
  start: number;
  end: number;
  label: string;
}) {
  const op = interpolate(frame, [start, start + 10, end - 10, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0.001) return null;
  const s = interpolate(frame, [start, start + 13], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 168,
          letterSpacing: "-0.02em",
          color: C.canard,
          opacity: op,
          transform: `scale(${s})`,
        }}
      >
        {label}
      </span>
    </AbsoluteFill>
  );
}

/* ---------------------------- Mini-phrase (kicker) ----------------------- */

function CaseKicker({
  frame,
  start,
  text,
}: {
  frame: number;
  start: number;
  text: string;
}) {
  const local = frame - start;
  const op = interpolate(local, [6, 16, 46, 58], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0.001) return null;
  const rise = easeOut(clamp01((local - 6) / 12));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 120,
        display: "flex",
        justifyContent: "center",
        opacity: op,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: FONT.sans,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: "-0.01em",
          color: C.ink,
          textAlign: "center",
          transform: `translateY(${(1 - rise) * -10}px)`,
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ============================ Plan 1 — L'OFFRE =========================== */

function OfferWord({
  children,
  local,
  delay,
  size = 132,
}: {
  children: string;
  local: number;
  delay: number;
  size?: number;
}) {
  const p = easeOut(clamp01((local - delay) / 14));
  return (
    <span
      style={{
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.02em",
        color: C.ink,
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px)`,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Plan 1 (hook) — phrase en deux lignes : « Nos formations IA » (surlignage
 * canard qui balaie + « + » turquoise sur « formations IA ») puis « vous font
 * gagner du temps ». Apparition compressée pour une lecture confortable.
 */
function Offer({ local }: { local: number }) {
  const hp = easeOut(clamp01((local - 16) / 22)); // surlignage canard
  const pp = easeOut(clamp01((local - 32) / 14)); // « + » turquoise
  const l2 = easeOut(clamp01((local - 46) / 22)); // « vous font gagner du temps »

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {/* Ligne 1 : « Nos formations IA » */}
        <div style={{ display: "inline-flex", alignItems: "flex-start", gap: 30 }}>
          <OfferWord local={local} delay={2}>
            Nos
          </OfferWord>
          <span style={{ display: "inline-flex", alignItems: "flex-start" }}>
            {/* « formations IA » avec le surlignage canard qui balaie derrière */}
            <span
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "baseline",
                gap: 26,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -16,
                  right: -16,
                  top: "16%",
                  bottom: "12%",
                  background: "rgba(14,114,145,0.18)",
                  borderRadius: 12,
                  transformOrigin: "left center",
                  transform: `scaleX(${hp})`,
                }}
              />
              <OfferWord local={local} delay={9}>
                formations
              </OfferWord>
              <OfferWord local={local} delay={16}>
                IA
              </OfferWord>
            </span>
            {/* « + » turquoise, comme le logo Marssane */}
            <span
              style={{
                marginTop: 10,
                marginLeft: 8,
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 64,
                lineHeight: 1,
                color: C.turquoise,
                opacity: pp,
                transform: `scale(${0.6 + 0.4 * pp})`,
                transformOrigin: "left top",
              }}
            >
              +
            </span>
          </span>
        </div>

        {/* Ligne 2 : « vous font gagner du temps » */}
        <span
          style={{
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: 56,
            letterSpacing: "-0.01em",
            color: C.muted,
            opacity: l2,
            transform: `translateY(${(1 - l2) * 14}px)`,
          }}
        >
          vous font gagner du temps
        </span>
      </div>
    </AbsoluteFill>
  );
}

/* ===================== Plan 5 — FINALE (payoff + clôture) ================= */

/**
 * Trois temps enchaînés en fondu : (1) « Tout ça, vous le construisez en
 * formation. » — clarifie qu'il s'agit d'une formation, pas d'un logiciel ;
 * (2) payoff « 2 h rendues, chaque jour. » en grand (la barre est à 100 %) ;
 * (3) clôture logo + cible + format, puis fondu de boucle.
 */
function Finale({ local }: { local: number }) {
  const introOp = interpolate(local, [10, 24, 44, 56], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const payoffOp = interpolate(local, [52, 68, 100, 112], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const payoffRise = interpolate(local, [52, 70], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const logoT = easeOut(clamp01((local - 100) / 26));
  const lineA = easeOut(clamp01((local - 122) / 16));
  const lineB = easeOut(clamp01((local - 134) / 16));

  return (
    <AbsoluteFill>
      {/* Temps 1 — c'est une formation */}
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", opacity: introOp }}
      >
        <span
          style={{
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: 52,
            letterSpacing: "-0.01em",
            color: C.ink,
            textAlign: "center",
          }}
        >
          Tout ça, vous le construisez{" "}
          <span style={{ color: C.canard, fontWeight: 700 }}>en formation.</span>
        </span>
      </AbsoluteFill>

      {/* Temps 2 — payoff */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: payoffOp,
          transform: `translateY(${payoffRise}px)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <span
            style={{
              fontFamily: FONT.mono,
              fontWeight: 600,
              fontSize: 168,
              letterSpacing: "-0.02em",
              color: C.canard,
            }}
          >
            2 h
          </span>
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 52,
              color: C.body,
            }}
          >
            rendues, chaque jour.
          </span>
        </div>
      </AbsoluteFill>

      {/* Temps 3 — clôture */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 42 }}>
          <div
            style={{
              opacity: logoT,
              transform: `translateY(${(1 - logoT) * 24}px) scale(${0.84 + 0.16 * logoT})`,
            }}
          >
            <MarssaneLogo size={300} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 46,
                letterSpacing: "-0.01em",
                color: C.canard,
                opacity: lineA,
                transform: `translateY(${(1 - lineA) * 14}px)`,
              }}
            >
              Formation pour dirigeants de PME
            </span>
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 600,
                fontSize: 44,
                letterSpacing: "0.01em",
                color: C.body,
                opacity: lineB,
                transform: `translateY(${(1 - lineB) * 14}px)`,
              }}
            >
              2 demi-journées, selon votre agenda
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
