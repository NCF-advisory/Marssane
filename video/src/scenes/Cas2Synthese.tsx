import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import "../fonts";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { easeOut, countInt } from "../anim";
import { Toile } from "../components/Toile";
import { TextBar } from "../components/primitives";
import { ClaudeMark } from "../components/ClaudeMark";
import { Cursor } from "../components/Cursor";

/**
 * Cas concret n° 2 — « Synthétiser vos documents et préparer vos réunions,
 * dans votre ton ».
 *
 * Composition autonome (1350×1080, 30 fps, 420 frames = 14 s), muette, en
 * boucle. Une seule carte plein cadre sur la toile Marssane, qui bascule du
 * document brut vers sa synthèse. Texte d'interface uniquement (en-têtes,
 * rubriques, compteurs, sources) — aucune phrase narrative.
 *
 * Deux acteurs : Claude lit et synthétise (présence terracotta), l'humain
 * vérifie (pointeur noir). Storyboard : 0–3 s le document s'assemble · 3–5 s la
 * demande en français (machine à écrire) · 5–10 s Claude lit puis construit la
 * synthèse · 10–14 s l'humain ouvre la source p. 17, puis retour au document
 * pour boucler (frame 419 ≈ frame 0).
 */

/* -------------------------------- Terracotta ------------------------------ */
// Présence de Claude, constante LOCALE (jamais dans theme.ts).
const CLAUDE_TERRA = "#D97757";
const CLAUDE_TERRA_SOFT = "rgba(217,119,87,0.14)";
const CLAUDE_HALO =
  "linear-gradient(180deg, rgba(217,119,87,0) 0%, rgba(217,119,87,0.22) 50%, rgba(217,119,87,0) 100%)";

/* ------------------------------- Géométrie ------------------------------- */

const CARD_W = 1160;
const CARD_H = 968;
const PAD = 48;
const HEADER_H = 112;

// Corps du document : titre puis barres empilées (volume).
const BODY_TOP = HEADER_H + 40;
const TITLE_H = 58;
const BARS_TOP = BODY_TOP + TITLE_H + 22;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/* -------------------------------- Données -------------------------------- */

const QUERY = "Résume ce contrat, points d'attention.";

// Barres du document : largeurs + saut de paragraphe (volume d'un long PDF).
const DOC_LINES: { w: string; para?: boolean }[] = [
  { w: "96%" },
  { w: "89%" },
  { w: "93%" },
  { w: "71%" },
  { w: "97%", para: true },
  { w: "85%" },
  { w: "91%" },
  { w: "64%" },
  { w: "94%", para: true },
  { w: "88%" },
  { w: "96%" },
  { w: "78%" },
  { w: "83%", para: true },
  { w: "90%" },
  { w: "69%" },
];

type Rubrique = { label: string; texte: string; page: string };
const RUBRIQUES: Rubrique[] = [
  { label: "PRIX", texte: "révision annuelle plafonnée à 3 %", page: "p. 17" },
  { label: "DURÉE", texte: "24 mois, tacite reconduction", page: "p. 4" },
  { label: "RÉSILIATION", texte: "préavis 3 mois", page: "p. 23" },
];

/* ================================ Scène ================================= */

export function Cas2Synthese() {
  const local = useCurrentFrame();

  // Vue document : pleine au départ, s'efface quand la synthèse arrive, puis
  // revient en toute fin pour boucler (frame 419 ≈ frame 0).
  const docOp = interpolate(
    local,
    [0, 196, 216, 398, 412, 419],
    [1, 1, 0, 0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const docLift = interpolate(local, [196, 216], [0, -26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const synthOp = interpolate(local, [198, 218, 394, 406], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const synthRise = interpolate(local, [198, 220], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  // Pastille « Claude · lecture en cours » (pendant la lecture + halo).
  const pastilleOp = interpolate(
    local,
    [148, 160, 220, 234],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const readingPage = countInt(local, 152, 196, 1, 42);

  // Halo terracotta qui parcourt les barres du document (5–10 s, début).
  const haloY = interpolate(local, [152, 196], [BARS_TOP - 8, BARS_TOP + 470], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const haloOp = interpolate(local, [150, 162, 188, 198], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Extrait source (p. 17) ouvert par l'humain.
  const extractOp = interpolate(local, [332, 348, 392, 406], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.toile }}>
      <Toile />
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
          }}
        >
          {/* --- Vue document (plans 1–2 + lecture) --- */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: docOp,
              transform: `translateY(${docLift}px)`,
            }}
          >
            <DocView local={local} />

            {/* Halo de lecture terracotta */}
            <div
              style={{
                position: "absolute",
                left: PAD,
                right: PAD,
                top: haloY,
                height: 96,
                background: CLAUDE_HALO,
                opacity: haloOp,
                borderRadius: 8,
              }}
            />
          </div>

          {/* --- Vue synthèse (plans 3–4) --- */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: synthOp,
              transform: `translateY(${synthRise}px)`,
            }}
          >
            <SynthView local={local} />
          </div>

          {/* --- Extrait source p. 17 (plan 4) --- */}
          {extractOp > 0.001 && <Extract local={local} opacity={extractOp} />}

          {/* Pastille « Claude · lecture en cours » */}
          <div
            style={{
              position: "absolute",
              top: 22,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 22px",
              borderRadius: 999,
              background: C.surface,
              border: `1px solid ${CLAUDE_TERRA_SOFT}`,
              boxShadow: SHADOW.float,
              opacity: pastilleOp,
              zIndex: 40,
            }}
          >
            <ClaudeMark size={30} color={CLAUDE_TERRA} />
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 600,
                fontSize: 26,
                color: C.ink,
              }}
            >
              Claude · lecture en cours
            </span>
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: 24,
                color: CLAUDE_TERRA,
              }}
            >
              p. {readingPage} / 42
            </span>
          </div>

          {/* Pointeur humain (plan 4) : clique « source : p. 17 » */}
          <PlanCursor local={local} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------ Vue document ----------------------------- */

function DocView({ local }: { local: number }) {
  const docPage = countInt(local, 8, 68, 1, 42);
  // Le compteur de chargement et les barres retombent en fin de plan pour que
  // la vue document qui revient (boucle) soit identique à la frame 0 : en-tête
  // + titre seuls, corps vierge.
  const pageOp = interpolate(local, [4, 14, 70, 84], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barsGroupOp = interpolate(local, [405, 419], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      {/* En-tête */}
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

      {/* Titre du document */}
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          top: BODY_TOP,
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: 42,
          letterSpacing: "-0.01em",
          color: C.ink,
        }}
      >
        Contrat de prestation — Services SA
      </div>

      {/* Corps : barres qui s'empilent (volume) */}
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          top: BARS_TOP,
          opacity: barsGroupOp,
        }}
      >
        {DOC_LINES.map((l, i) => {
          const p = easeOut(clamp01((local - (4 + i * 3)) / 12));
          return (
            <div
              key={i}
              style={{
                marginTop: i === 0 ? 0 : l.para ? 34 : 16,
                opacity: p,
                transform: `translateY(${(1 - p) * 8}px)`,
              }}
            >
              <TextBar width={l.w} height={16} />
            </div>
          );
        })}
      </div>

      {/* Indicateur de pages (chargement du document) */}
      <span
        style={{
          position: "absolute",
          right: PAD,
          bottom: 128,
          fontFamily: FONT.mono,
          fontSize: 24,
          color: C.quiet,
          opacity: pageOp,
        }}
      >
        p. {docPage} / 42
      </span>

      {/* Champ de demande (plan 2) */}
      <Prompt local={local} />
    </>
  );
}

/* -------------------------------- Prompt --------------------------------- */

function Prompt({ local }: { local: number }) {
  const inP = easeOut(clamp01((local - 78) / 14));
  // Fenêtre d'affichage : arrive au plan 2, disparaît avant le retour de la vue
  // document (boucle) pour que la frame 419 reste vierge comme la frame 0.
  const showOp = interpolate(local, [78, 92, 196, 212], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const typed = Math.floor(
    interpolate(local, [96, 140], [0, QUERY.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typing = local >= 96 && local < 140;
  const caretOn = Math.floor(local / 8) % 2 === 0;
  const sent = local >= 142;
  const shown = QUERY.slice(0, typed);

  return (
    <div
      style={{
        position: "absolute",
        left: PAD,
        right: PAD,
        bottom: 40,
        height: 76,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 12px 0 24px",
        background: C.toile,
        border: `1px solid ${C.gridLine}`,
        borderRadius: RADIUS.btn,
        opacity: showOp,
        transform: `translateY(${(1 - inP) * 12}px)`,
      }}
    >
      <span
        style={{
          flex: 1,
          fontFamily: FONT.sans,
          fontSize: 28,
          color: C.body,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {shown}
        <span style={{ color: CLAUDE_TERRA }}>
          {typing && caretOn ? "▍" : ""}
        </span>
      </span>
      <span
        style={{
          flex: "none",
          fontFamily: FONT.sans,
          fontWeight: 700,
          fontSize: 25,
          color: "#FFFFFF",
          background: sent ? C.inkEcume : C.canard,
          padding: "13px 26px",
          borderRadius: RADIUS.btn,
        }}
      >
        {sent ? "✓ envoyé" : "Envoyer"}
      </span>
    </div>
  );
}

/* ------------------------------ Vue synthèse ----------------------------- */

function SynthView({ local }: { local: number }) {
  return (
    <>
      {/* Liseré turquoise (résultat) */}
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

      {/* En-tête synthèse */}
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
            fontSize: 36,
            letterSpacing: "-0.01em",
            color: C.ink,
          }}
        >
          Synthèse — contrat de prestation
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: CLAUDE_TERRA_SOFT,
            color: CLAUDE_TERRA,
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: 24,
            padding: "10px 18px",
            borderRadius: 999,
          }}
        >
          <ClaudeMark size={26} color={CLAUDE_TERRA} />
          rédigée par Claude
        </span>
      </div>

      {/* Rubriques */}
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          top: BODY_TOP,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {RUBRIQUES.map((r, i) => {
          const p = easeOut(clamp01((local - (218 + i * 16)) / 16));
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
                  width: 220,
                  fontFamily: FONT.mono,
                  fontSize: 24,
                  letterSpacing: "0.06em",
                  color: C.quiet,
                }}
              >
                {r.label}
              </span>
              <span
                style={{
                  flex: 1,
                  fontFamily: FONT.sans,
                  fontSize: 32,
                  color: C.body,
                }}
              >
                {r.texte}
              </span>
              <span
                style={{
                  flex: "none",
                  fontFamily: FONT.mono,
                  fontSize: 22,
                  color: C.faint,
                }}
              >
                {r.page}
              </span>
            </div>
          );
        })}
      </div>

      {/* Encadré points d'attention */}
      <Attention local={local} />

      {/* Ligne source + bouton cliquable « source : p. 17 » */}
      <SourceBar local={local} />
    </>
  );
}

function Attention({ local }: { local: number }) {
  const p = easeOut(clamp01((local - 268) / 18));
  return (
    <div
      style={{
        position: "absolute",
        left: PAD,
        right: PAD,
        top: BODY_TOP + 240,
        padding: "22px 28px",
        borderRadius: RADIUS.btn,
        background: "#F5F7F9",
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT.sans,
          fontWeight: 700,
          fontSize: 26,
          color: C.clay,
        }}
      >
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

const SRC_BTN_W = 250;
const SRC_BTN_H = 56;
const SRC_BTN_RIGHT = PAD;
const SRC_BTN_BOTTOM = 44;

function SourceBar({ local }: { local: number }) {
  const p = easeOut(clamp01((local - 288) / 16));
  return (
    <>
      <span
        style={{
          position: "absolute",
          left: PAD,
          bottom: SRC_BTN_BOTTOM + 14,
          fontFamily: FONT.sans,
          fontSize: 26,
          color: C.faint,
          opacity: p,
        }}
      >
        chaque affirmation renvoie à sa page source
      </span>
      <span
        style={{
          position: "absolute",
          right: SRC_BTN_RIGHT,
          bottom: SRC_BTN_BOTTOM,
          width: SRC_BTN_W,
          height: SRC_BTN_H,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.ecume,
          color: C.inkEcume,
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 24,
          whiteSpace: "nowrap",
          borderRadius: RADIUS.btn,
          opacity: p,
        }}
      >
        source : p. 17
      </span>
    </>
  );
}

/* ------------------------------- Extrait --------------------------------- */

function Extract({ local, opacity }: { local: number; opacity: number }) {
  const rise = interpolate(local, [332, 350], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const scale = interpolate(local, [332, 350], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <>
      {/* Voile sur la synthèse */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(16,24,40,0.28)",
          opacity,
          zIndex: 45,
        }}
      />
      {/* Panneau extrait */}
      <div
        style={{
          position: "absolute",
          left: (CARD_W - 760) / 2,
          top: (CARD_H - 540) / 2,
          width: 760,
          height: 540,
          background: C.surface,
          borderRadius: RADIUS.card,
          boxShadow: SHADOW.hero,
          overflow: "hidden",
          opacity,
          transform: `translateY(${rise}px) scale(${scale})`,
          zIndex: 46,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 32px",
            borderBottom: "1px solid rgba(16,24,40,0.08)",
          }}
        >
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 24,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: C.quiet,
            }}
          >
            Contrat de prestation
          </span>
          <span style={{ fontFamily: FONT.mono, fontSize: 24, color: C.slate }}>
            p. 17 / 42
          </span>
        </div>
        <div
          style={{
            padding: "30px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <TextBar width="94%" height={15} />
          <TextBar width="88%" height={15} />
          <TextBar width="70%" height={15} />
          {/* Passage surligné (référence de la rubrique PRIX) */}
          <div style={{ marginTop: 10, marginBottom: 6 }}>
            <span
              style={{
                fontFamily: FONT.sans,
                fontSize: 30,
                lineHeight: 1.5,
                color: C.inkEcume,
                background: C.ecume,
                padding: "4px 8px",
                borderRadius: 4,
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              Le prix fait l&apos;objet d&apos;une révision annuelle plafonnée à
              3 %.
            </span>
          </div>
          <TextBar width="92%" height={15} style={{ marginTop: 10 }} />
          <TextBar width="84%" height={15} />
          <TextBar width="58%" height={15} />
        </div>
      </div>
    </>
  );
}

/* -------------------------------- Curseur -------------------------------- */

function PlanCursor({ local }: { local: number }) {
  // Présent seulement au plan 4 (clic source), retiré avant le retour de la
  // vue document pour une boucle propre.
  if (local < 300 || local > 392) return null;
  // Cible : juste à gauche du bouton « source : p. 17 » (sans occulter le libellé).
  const targetX = CARD_W - SRC_BTN_RIGHT - SRC_BTN_W - 14;
  const targetY = CARD_H - SRC_BTN_BOTTOM - SRC_BTN_H / 2 - 6;
  const x0 = 470;
  const y0 = 690;
  const p = easeOut(clamp01((local - 304) / 22));
  const x = x0 + (targetX - x0) * p;
  const y = y0 + (targetY - y0) * p;
  const pressed = local >= 330 && local < 340;
  return <Cursor x={x} y={y} pressed={pressed} />;
}
