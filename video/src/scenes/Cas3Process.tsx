import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import "../fonts";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { easeOut } from "../anim";
import { Toile } from "../components/Toile";
import { TextBar } from "../components/primitives";
import { ClaudeMark } from "../components/ClaudeMark";
import { Cursor } from "../components/Cursor";

/**
 * Cas concret n° 3 — « Automatiser un process de votre travail » (angle :
 * relances d'impayés).
 *
 * Composition autonome (1350×1080, 30 fps, 420 frames = 14 s), muette, en
 * boucle. Une seule carte plein cadre sur la toile Marssane. Texte d'interface
 * uniquement (tableau, badges, objets, compteurs) — aucune phrase narrative.
 *
 * Deux acteurs : Claude enchaîne le process (présence terracotta), l'humain
 * valide (pointeur noir). Storyboard : 0–3 s trois factures basculent en retard
 * · 3–8 s Claude rédige trois relances en cascade · 8–11 s l'humain envoie les
 * trois · 11–14 s le tableau passe en « relancé », le process tourne seul, puis
 * retour à l'état initial pour boucler (frame 419 ≈ frame 0).
 */

/* -------------------------------- Terracotta ------------------------------ */
const CLAUDE_TERRA = "#D97757";
const CLAUDE_TERRA_SOFT = "rgba(217,119,87,0.14)";

/* ------------------------------- Géométrie ------------------------------- */

const CARD_W = 1160;
const CARD_H = 968;
const PAD = 44;
const HEADER_H = 108;

// Tableau des factures.
const TABLE_TOP = HEADER_H + 28;
const COL_NUM = PAD;
const COL_CLIENT = PAD + 250;
const COL_ECH = PAD + 620;
const ROW_H = 92;
const HEAD_ROW_H = 60;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/* -------------------------------- Données -------------------------------- */

type Facture = {
  num: string;
  client: string;
  ech: string;
  jour: string; // badge de retard (clay)
  email: string;
  subj: string;
  ligne: string; // demi-ligne polie rédigée à la machine à écrire
};

// Trois factures en retard (les seules relancées). Arithmétique : échéance +
// J = ~28/07 pour les trois.
const LATE: Facture[] = [
  {
    num: "2026-118",
    client: "Morel Bâtiment",
    ech: "28/06",
    jour: "J+30",
    email: "compta@morel-batiment.fr",
    subj: "Relance — facture n° 2026-118",
    ligne: "Bonjour, sauf erreur de notre part, la facture",
  },
  {
    num: "2026-124",
    client: "Duval & Fils",
    ech: "06/07",
    jour: "J+22",
    email: "compta@duval-fils.fr",
    subj: "Relance — facture n° 2026-124",
    ligne: "Bonjour, la facture n° 2026-124 reste à ce jour",
  },
  {
    num: "2026-131",
    client: "Atelier Lenoir",
    ech: "13/07",
    jour: "J+15",
    email: "compta@atelier-lenoir.fr",
    subj: "Relance — facture n° 2026-131",
    ligne: "Bonjour, nous revenons vers vous au sujet de la",
  },
];

// Deux factures à jour (jamais relancées).
const OK_ROWS = [
  { num: "2026-138", client: "Services SA", ech: "25/07" },
  { num: "2026-142", client: "Cabinet Roy", ech: "30/07" },
];

// Fenêtres d'apparition (frames) des trois cartes de relance.
const RELANCE_IN = [96, 134, 172];
const SENT_AT = [258, 270, 282];

/* ================================ Scène ================================= */

export function Cas3Process() {
  const local = useCurrentFrame();

  // Horloge : 08:02 (plans 1–3) puis 08:04 (résultat), retour 08:02 pour boucler.
  const clockEarly = interpolate(
    local,
    [300, 314, 404, 416],
    [1, 0, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Overlay de rédaction des relances (plans 2–3), au-dessus du tableau.
  const overlayOp = interpolate(local, [86, 104, 300, 320], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pastille « Claude · relances en cours ».
  const pastilleOp = interpolate(
    local,
    [88, 102, 286, 300],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Bandeau résultat + mention « prochain passage ».
  const bannerOp = interpolate(local, [312, 328, 404, 414], [0, 1, 1, 0], {
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
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 26,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: C.quiet,
                }}
              >
                Factures émises&nbsp;·&nbsp;
              </span>
              <span style={{ position: "relative", width: 118, height: 30 }}>
                <ClockLabel value="08:02" opacity={clockEarly} />
                <ClockLabel value="08:04" opacity={1 - clockEarly} />
              </span>
            </div>
            <HeaderStatus local={local} />
          </div>

          {/* Tableau des factures */}
          <Table local={local} />

          {/* Bandeau résultat */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `0 ${PAD}px`,
              borderTop: "1px solid rgba(16,24,40,0.10)",
              opacity: bannerOp,
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 600,
                fontSize: 30,
                color: C.inkEcume,
              }}
            >
              3 relances envoyées · 08:04
            </span>
            <span
              style={{ fontFamily: FONT.mono, fontSize: 25, color: C.faint }}
            >
              prochain passage : demain 08:00
            </span>
          </div>

          {/* Overlay de rédaction des relances */}
          {overlayOp > 0.001 && <RelanceOverlay local={local} opacity={overlayOp} />}

          {/* Pastille Claude */}
          <div
            style={{
              position: "absolute",
              top: 20,
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
              zIndex: 50,
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
              Claude · relances en cours
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------- En-tête --------------------------------- */

function ClockLabel({ value, opacity }: { value: string; opacity: number }) {
  return (
    <span
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        fontFamily: FONT.mono,
        fontSize: 26,
        letterSpacing: "0.08em",
        color: C.body,
        opacity,
      }}
    >
      {value}
    </span>
  );
}

function HeaderStatus({ local }: { local: number }) {
  const impayeesOp = interpolate(local, [56, 70, 88, 100], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ajourOp = interpolate(local, [312, 326, 404, 414], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <span
        style={{
          position: "absolute",
          right: 0,
          whiteSpace: "nowrap",
          background: "rgba(199,90,77,0.14)",
          color: C.clay,
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 24,
          padding: "8px 18px",
          borderRadius: 999,
          opacity: impayeesOp,
        }}
      >
        3 impayées
      </span>
      <span
        style={{
          position: "absolute",
          right: 0,
          whiteSpace: "nowrap",
          background: C.ecume,
          color: C.inkEcume,
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 24,
          padding: "8px 18px",
          borderRadius: 999,
          opacity: ajourOp,
        }}
      >
        à jour
      </span>
    </span>
  );
}

/* -------------------------------- Tableau -------------------------------- */

function Table({ local }: { local: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: TABLE_TOP }}>
      {/* En-tête de colonnes */}
      <div
        style={{
          position: "relative",
          height: HEAD_ROW_H,
          margin: `0 ${PAD}px`,
          borderBottom: `1px solid ${C.gridLine}`,
        }}
      >
        <ColHead x={COL_NUM - PAD} label="N° FACTURE" />
        <ColHead x={COL_CLIENT - PAD} label="CLIENT" />
        <ColHead x={COL_ECH - PAD} label="ÉCHÉANCE" />
        <span
          style={{
            position: "absolute",
            right: 0,
            top: 20,
            fontFamily: FONT.mono,
            fontSize: 20,
            letterSpacing: "0.08em",
            color: C.quiet,
          }}
        >
          STATUT
        </span>
      </div>

      {/* Lignes en retard puis relancées */}
      {LATE.map((f, i) => (
        <LateRow key={f.num} facture={f} index={i} local={local} />
      ))}
      {/* Lignes à jour */}
      {OK_ROWS.map((r, i) => (
        <div
          key={r.num}
          style={{
            position: "relative",
            height: ROW_H,
            margin: `0 ${PAD}px`,
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid rgba(16,24,40,0.05)`,
          }}
        >
          <Cell x={0}>{r.num}</Cell>
          <Cell x={COL_CLIENT - PAD} strong>
            {r.client}
          </Cell>
          <Cell x={COL_ECH - PAD} mono>
            {r.ech}
          </Cell>
          <span
            style={{
              position: "absolute",
              right: 0,
              fontFamily: FONT.mono,
              fontSize: 24,
              color: C.quiet,
            }}
          >
            émise
          </span>
        </div>
      ))}
    </div>
  );
}

function ColHead({ x, label }: { x: number; label: string }) {
  return (
    <span
      style={{
        position: "absolute",
        left: x,
        top: 20,
        fontFamily: FONT.mono,
        fontSize: 20,
        letterSpacing: "0.08em",
        color: C.quiet,
      }}
    >
      {label}
    </span>
  );
}

function Cell({
  x,
  children,
  strong,
  mono,
}: {
  x: number;
  children: React.ReactNode;
  strong?: boolean;
  mono?: boolean;
}) {
  return (
    <span
      style={{
        position: "absolute",
        left: x,
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontWeight: strong ? 700 : 400,
        fontSize: mono ? 26 : 30,
        color: strong ? C.ink : mono ? C.slate : C.body,
      }}
    >
      {children}
    </span>
  );
}

function LateRow({
  facture,
  index,
  local,
}: {
  facture: Facture;
  index: number;
  local: number;
}) {
  const flip = 12 + index * 18; // bascule en retard, en cascade
  // Badge « émise » (neutre) → « J+xx » (clay) → « relancé » (écume).
  const emiseOp = interpolate(
    local,
    [0, flip, flip + 16, 404, 416],
    [1, 1, 0, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const jourOp = interpolate(
    local,
    [flip + 4, flip + 18, 306 + index * 8, 320 + index * 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const relanceOp = interpolate(
    local,
    [306 + index * 8, 320 + index * 8, 404, 416],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "relative",
        height: ROW_H,
        margin: `0 ${PAD}px`,
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid rgba(16,24,40,0.05)`,
      }}
    >
      <Cell x={0}>{facture.num}</Cell>
      <Cell x={COL_CLIENT - PAD} strong>
        {facture.client}
      </Cell>
      <Cell x={COL_ECH - PAD} mono>
        {facture.ech}
      </Cell>
      {/* Statut : trois badges superposés qui se relaient */}
      <span
        style={{ position: "absolute", right: 0, display: "inline-flex" }}
      >
        <StatusBadge opacity={emiseOp} bg="transparent" fg={C.quiet} mono>
          émise
        </StatusBadge>
        <StatusBadge opacity={jourOp} bg="rgba(199,90,77,0.14)" fg={C.clay}>
          {facture.jour}
        </StatusBadge>
        <StatusBadge opacity={relanceOp} bg={C.ecume} fg={C.inkEcume}>
          relancé
        </StatusBadge>
      </span>
    </div>
  );
}

function StatusBadge({
  opacity,
  bg,
  fg,
  mono,
  children,
}: {
  opacity: number;
  bg: string;
  fg: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  const pill = bg !== "transparent";
  return (
    <span
      style={{
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
        background: bg,
        color: fg,
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontWeight: mono ? 400 : 600,
        fontSize: mono ? 24 : 23,
        padding: pill ? "8px 18px" : 0,
        borderRadius: 999,
        opacity,
      }}
    >
      {children}
    </span>
  );
}

/* --------------------------- Overlay relances ---------------------------- */

const CARD_GAP = 18;
const R_CARD_W = 940;
const R_CARD_H = 178;
const R_STACK_TOP = 150;

function RelanceOverlay({
  local,
  opacity,
}: {
  local: number;
  opacity: number;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, opacity, zIndex: 30 }}>
      {/* Voile sur le tableau */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(16,24,40,0.55)",
        }}
      />
      {/* Pile des brouillons */}
      {LATE.map((f, i) => (
        <RelanceCard key={f.num} facture={f} index={i} local={local} />
      ))}
      {/* Barre d'action + curseur */}
      <ActionBar local={local} />
    </div>
  );
}

function RelanceCard({
  facture,
  index,
  local,
}: {
  facture: Facture;
  index: number;
  local: number;
}) {
  const start = RELANCE_IN[index];
  const p = easeOut(clamp01((local - start) / 18));
  const typed = Math.floor(
    interpolate(local, [start + 4, start + 30], [0, facture.ligne.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typing = local >= start + 4 && local < start + 30;
  const caretOn = Math.floor(local / 8) % 2 === 0;
  const barsP = easeOut(clamp01((local - (start + 30)) / 12));
  const sent = local >= SENT_AT[index];
  const shown = facture.ligne.slice(0, typed);

  const left = (CARD_W - R_CARD_W) / 2;
  const top = R_STACK_TOP + index * (R_CARD_H + CARD_GAP);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: R_CARD_W,
        height: R_CARD_H,
        background: C.surface,
        borderRadius: RADIUS.card,
        boxShadow: SHADOW.float,
        padding: "20px 28px",
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      {/* En-tête du brouillon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 28,
              color: C.ink,
            }}
          >
            {facture.subj}
          </span>
          <span
            style={{ fontFamily: FONT.mono, fontSize: 22, color: C.quiet }}
          >
            À : {facture.email}
          </span>
        </div>
        {/* Chip état : brouillon Claude → envoyé */}
        <span
          style={{
            flex: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: sent ? C.ecume : CLAUDE_TERRA_SOFT,
            color: sent ? C.inkEcume : CLAUDE_TERRA,
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: 22,
            padding: "9px 18px",
            borderRadius: 999,
          }}
        >
          {sent ? (
            "✓ envoyé"
          ) : (
            <>
              <ClaudeMark size={24} color={CLAUDE_TERRA} />
              brouillon rédigé par Claude
            </>
          )}
        </span>
      </div>

      {/* Corps : demi-ligne polie + barres grises */}
      <div style={{ marginTop: 18 }}>
        <span
          style={{
            fontFamily: FONT.sans,
            fontSize: 26,
            color: C.body,
          }}
        >
          {shown}
          <span style={{ color: CLAUDE_TERRA }}>
            {typing && caretOn ? "▍" : ""}
          </span>
        </span>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            opacity: barsP,
          }}
        >
          <TextBar width="88%" height={13} />
          <TextBar width="62%" height={13} />
        </div>
      </div>
    </div>
  );
}

const ACTION_BTN_W = 360;
const ACTION_BTN_H = 64;

function ActionBar({ local }: { local: number }) {
  const inP = easeOut(clamp01((local - 176) / 16));
  const anySent = local >= SENT_AT[0];
  const allSent = local >= SENT_AT[2];

  const btnLeft = (CARD_W - ACTION_BTN_W) / 2;
  const btnTop = R_STACK_TOP + 3 * (R_CARD_H + CARD_GAP) + 20;

  // Curseur : glisse juste à gauche du bouton (sans occulter le libellé) puis
  // appuie, centré sur sa hauteur.
  const targetX = btnLeft - 10;
  const targetY = btnTop + ACTION_BTN_H / 2 - 8;
  const mv = easeOut(clamp01((local - 216) / 24));
  const cx = 470 + (targetX - 470) * mv;
  const cy = 560 + (targetY - 560) * mv;
  const pressed = local >= 246 && local < 256;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: btnLeft,
          top: btnTop,
          width: ACTION_BTN_W,
          height: ACTION_BTN_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: anySent ? C.inkEcume : C.canard,
          color: "#FFFFFF",
          fontFamily: FONT.sans,
          fontWeight: 700,
          fontSize: 28,
          borderRadius: RADIUS.btn,
          boxShadow: SHADOW.card,
          opacity: inP,
          transform: `scale(${pressed ? 0.96 : 1})`,
        }}
      >
        {allSent ? "✓ 3 relances envoyées" : "Envoyer les 3 relances"}
      </div>
      {local >= 214 && <Cursor x={cx} y={cy} pressed={pressed} />}
    </>
  );
}
