import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../fonts";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { easeOut, pop, countInt } from "../anim";
import { Toile } from "../components/Toile";
import { TextBar } from "../components/primitives";
import { AI_LOGOS } from "../logos";

/**
 * Cas concret n° 1 — « Trier, prioriser, répondre à vos mails ».
 *
 * Composition autonome (1350×1080, 30 fps, 420 frames = 14 s), muette, en
 * boucle. Une SEULE carte « boîte mail » plein cadre qui vit sur la toile
 * Marssane. Contenu générique PME. Texte d'interface uniquement (objets de
 * mails, badges, compteurs, horloge) — aucune phrase narrative, aucun sous-titre.
 *
 * C'est Claude (l'IA) qui agit : présence visible via son logo terracotta et
 * ses libellés (« Claude · tri en cours », « brouillon rédigé par Claude »,
 * « triée par Claude »). Deux acteurs distincts : Claude (terracotta) trie et
 * rédige ; l'humain (pointeur souris noir) valide. Les badges de tri gardent
 * leurs couleurs de charte — le terracotta reste réservé à Claude.
 *
 * Storyboard : 0–3 s accumulation · 3–7 s Claude trie (balayage terracotta,
 * les badges poppent dans son sillage) · 7–11 s Claude rédige / l'humain clique
 * « Relire & envoyer » · 11–14 s résultat, puis retour à l'état vide pour
 * boucler sans à-coup (frame 419 ≈ frame 0).
 */

/* ------------------------------- Géométrie ------------------------------- */

const CARD_W = 1160;
const CARD_H = 968;
const CARD_LEFT = (1350 - CARD_W) / 2; // 95
const CARD_TOP = (1080 - CARD_H) / 2; // 56

const HEADER_H = 116;
const FOOTER_H = 88;
const ROW_LEFT = 40;
const ROW_W = CARD_W - ROW_LEFT * 2;

const ROWS_TOP_RAW = 140;
const ROW_H_RAW = 96;
const ROWS_TOP_SORT = 146;
const ROW_H_SORT = 100;
const STRIP_Y = ROWS_TOP_SORT + 6 * ROW_H_SORT + 8; // 754

/* --------------------------------- Claude -------------------------------- */

/**
 * Terracotta officiel de Claude — constante LOCALE à la scène (proche de
 * `C.clay`, mais la charte du site ne bouge pas). Réservé à la présence de
 * Claude ; les badges de tri gardent leurs couleurs de charte.
 */
const CLAUDE_TERRA = "#D97757";
const CLAUDE_LOGO = AI_LOGOS.find((l) => l.label === "Claude")!;

/** Glyphe Claude en terracotta (le path officiel vient de `logos.ts`). */
function ClaudeMark({ size, color = CLAUDE_TERRA }: { size: number; color?: string }) {
  if (CLAUDE_LOGO.kind !== "svg") return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox={CLAUDE_LOGO.viewBox}
      fill={color}
      style={{ flex: "none", display: "block" }}
    >
      {CLAUDE_LOGO.paths.map((p, i) => (
        <path key={i} d={p.d} />
      ))}
    </svg>
  );
}

/* -------------------------------- Données -------------------------------- */

type Cat = "urgent" | "traiter" | "attente";

const BADGE: Record<Cat, { label: string; bg: string; fg: string; dot: string }> = {
  urgent: { label: "Urgent", bg: C.canard, fg: "#FFFFFF", dot: C.canard },
  traiter: { label: "À traiter", bg: C.ecume, fg: C.inkEcume, dot: C.turquoise },
  attente: { label: "En attente", bg: C.periwinkle, fg: C.inkPeriwinkle, dot: C.lavande },
};

type Mail = { from: string; time: string; subj: string; cat: Cat; pos: number };

// Ordre d'arrivée (chronologique décroissant) ; `pos` = rang une fois trié
// (groupé Urgent · À traiter · En attente).
const MAILS: Mail[] = [
  { from: "Client · Morel", time: "07:58", subj: "Problème sur la livraison de ce matin", cat: "urgent", pos: 0 },
  { from: "Comptable", time: "07:30", subj: "Pièces manquantes pour la TVA", cat: "attente", pos: 4 },
  { from: "Client · Durand", time: "06:54", subj: "Rendez-vous de mardi, 10 h ?", cat: "traiter", pos: 2 },
  { from: "Prospect", time: "06:38", subj: "Souhaite un devis avant vendredi", cat: "urgent", pos: 1 },
  { from: "Client · Petit", time: "06:21", subj: "Devis n° 1042 à renvoyer signé", cat: "traiter", pos: 3 },
  { from: "Fournisseur", time: "06:05", subj: "Facture n° 2026-311", cat: "attente", pos: 5 },
];

// Chutes en stagger, intervalle qui se resserre (rythme légèrement oppressant).
const DEPART = [10, 25, 39, 51, 61, 69];
const DROP_DUR = 16;
// Balayage du tri, une ligne après l'autre, de haut en bas.
const badgeStart = (slot: number) => 100 + slot * 13;
const SORT_DUR = 26;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const arrivalY = (slot: number) => ROWS_TOP_RAW + slot * ROW_H_RAW;
const sortedY = (pos: number) => ROWS_TOP_SORT + pos * ROW_H_SORT;

/* ================================ Scène ================================= */

export function Cas1Mails() {
  const local = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compteur d'en-tête : grimpe 41 → 47 pendant l'accumulation, tient à 47,
  // puis revient à 41 pour la boucle (masqué derrière la puce « triée » entre).
  const counter =
    local < 200 ? countInt(local, 10, 85, 41, 47) : local < 406 ? 47 : 41;

  // Crossfade liste ↔ composeur, et fondu final de la liste pour la boucle.
  const listOp = interpolate(
    local,
    [0, 196, 210, 316, 328, 405, 419],
    [1, 1, 0, 0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const listLift = interpolate(local, [405, 419], [0, -46], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const composerOp = interpolate(local, [196, 210, 312, 326], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pastille « Claude · tri en cours » dans l'en-tête (plan 2). Elle passe à
  // « tri terminé » en fin de balayage, puis s'efface avant le composeur.
  const sortChipOp = interpolate(local, [90, 104, 190, 204], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sortDone = local >= 178;

  // Décorations de l'état « résultat » (apparaissent après l'envoi).
  const resultOp = interpolate(local, [332, 348, 406, 414], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const footerOp = interpolate(local, [338, 352, 406, 414], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Horloge : 08:02 au départ et à la boucle, 08:03 sur le résultat.
  const clockEarly = interpolate(
    local,
    [330, 342, 406, 416],
    [1, 0, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Compteur chiffré : masqué pendant le résultat (la puce « triée » le remplace).
  const numberOp = interpolate(
    local,
    [326, 338, 406, 414],
    [1, 0, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
          {/* Liseré turquoise (état trié) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 4,
              background: C.turquoise,
              opacity: resultOp,
            }}
          />

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
              padding: "0 40px",
              borderBottom: "1px solid rgba(16,24,40,0.06)",
            }}
          >
            <div style={{ position: "relative", display: "flex", alignItems: "baseline" }}>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 26,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: C.quiet,
                }}
              >
                Boîte de réception&nbsp;·&nbsp;
              </span>
              <span style={{ position: "relative", width: 118, height: 30 }}>
                <ClockLabel value="08:02" opacity={clockEarly} />
                <ClockLabel value="08:03" opacity={1 - clockEarly} />
              </span>
            </div>

            {/* Droite : compteur chiffré, puis puce « triée » sur le résultat */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 30,
                  fontWeight: 600,
                  color: C.slate,
                  opacity: numberOp,
                }}
              >
                {counter}
              </span>
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  whiteSpace: "nowrap",
                  background: C.ecume,
                  color: C.inkEcume,
                  fontFamily: FONT.mono,
                  fontSize: 24,
                  padding: "8px 16px",
                  borderRadius: 999,
                  opacity: resultOp,
                }}
              >
                <ClaudeMark size={24} />
                triée par Claude
              </span>
            </div>

            {/* Pastille de statut de Claude pendant le tri (plan 2) */}
            {sortChipOp > 0.001 && (
              <span
                style={{
                  position: "absolute",
                  left: 520,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(217,119,87,0.12)",
                  padding: "8px 18px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  opacity: sortChipOp,
                }}
              >
                <ClaudeMark size={28} />
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 23,
                    color: CLAUDE_TERRA,
                  }}
                >
                  {sortDone ? "Claude · tri terminé" : "Claude · tri en cours"}
                </span>
              </span>
            )}
          </div>

          {/* --- Vue liste (accumulation, tri, résultat) --- */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: listOp,
              transform: `translateY(${listLift}px)`,
            }}
          >
            {MAILS.map((m, slot) => (
              <Row key={slot} mail={m} slot={slot} local={local} fps={fps} />
            ))}
            <ClasseStrip local={local} />
          </div>

          {/* --- Balayage terracotta de Claude (les badges poppent dans son sillage) --- */}
          <SortSweep local={local} />

          {/* --- Vue composeur (réponse pré-rédigée) --- */}
          {composerOp > 0.001 && <Composer local={local} opacity={composerOp} />}

          {/* Pied (état trié) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: FOOTER_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 40px",
              borderTop: "1px solid rgba(16,24,40,0.10)",
              opacity: footerOp,
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontSize: 28, color: C.faint }}>
              à traiter ce matin
            </span>
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: 30,
                fontWeight: 600,
                color: C.inkEcume,
              }}
            >
              6 / 47
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------ Sous-vues ------------------------------- */

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

/**
 * Balayage terracotta qui descend la liste pendant le tri (plan 2). Voile doux
 * (gradient radial, jamais un flash) dont le centre glisse de haut en bas : les
 * badges poppent dans son sillage, rendant l'action de Claude causale.
 */
function SortSweep({ local }: { local: number }) {
  const op = interpolate(local, [90, 104, 188, 204], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0.001) return null;
  // Centre de la bande, en coordonnées locales au corps (sous l'en-tête).
  const bandCenter = interpolate(local, [92, 188], [0, STRIP_Y + 40 - HEADER_H], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: HEADER_H,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: op,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: bandCenter - 150,
          height: 300,
          background:
            "radial-gradient(58% 100% at 50% 50%, rgba(217,119,87,0.17), rgba(217,119,87,0.06) 55%, rgba(217,119,87,0) 78%)",
        }}
      />
    </div>
  );
}

/** Une ligne de mail : brute (2 lignes) qui se mue en ligne triée (badge). */
function Row({
  mail,
  slot,
  local,
  fps,
}: {
  mail: Mail;
  slot: number;
  local: number;
  fps: number;
}) {
  const drop = easeOut(clamp01((local - DEPART[slot]) / DROP_DUR));
  const sp = easeOut(clamp01((local - badgeStart(slot)) / SORT_DUR));

  const y =
    arrivalY(slot) +
    (sortedY(mail.pos) - arrivalY(slot)) * sp -
    (1 - drop) * 46;

  const badge = BADGE[mail.cat];
  const popv = Math.min(1, pop(local, fps, badgeStart(slot)));
  const moving = (drop > 0 && drop < 1) || (sp > 0 && sp < 1);

  return (
    <div
      style={{
        position: "absolute",
        left: ROW_LEFT,
        top: y,
        width: ROW_W,
        height: ROW_H_SORT - 8,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        background: C.surface,
        borderRadius: RADIUS.btn,
        boxShadow: moving ? SHADOW.card : "none",
        opacity: drop,
        // Les lignes plus avancées dans le tri passent au-dessus (occlusion
        // propre pendant les croisements), les lignes en mouvement au-dessus
        // des lignes au repos.
        zIndex: Math.round(sp * 100) + (moving ? 50 : 0) + slot,
      }}
    >
      {/* Contenu brut (2 lignes) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 6,
          padding: "0 4px",
          opacity: 1 - sp,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 30, color: C.ink }}>
            {mail.from}
          </span>
          <span style={{ fontFamily: FONT.mono, fontSize: 22, color: C.quiet }}>
            {mail.time}
          </span>
        </div>
        <span
          style={{
            fontFamily: FONT.sans,
            fontSize: 25,
            color: C.faint,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {mail.subj}
        </span>
      </div>

      {/* Contenu trié (badge + expéditeur + objet en une ligne) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "0 4px",
          opacity: sp,
        }}
      >
        <span
          style={{
            flex: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: badge.bg,
            color: badge.fg,
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: 23,
            padding: "8px 18px",
            borderRadius: 999,
            minWidth: 150,
            transform: `scale(${0.7 + 0.3 * popv})`,
          }}
        >
          {badge.label}
        </span>
        <span
          style={{
            flex: "none",
            fontFamily: FONT.sans,
            fontWeight: 700,
            fontSize: 30,
            color: C.ink,
          }}
        >
          {mail.from}
        </span>
        <span
          style={{
            fontFamily: FONT.sans,
            fontSize: 26,
            color: C.faint,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {mail.subj}
        </span>
      </div>
    </div>
  );
}

/** Ligne compacte « Classé » où se replient newsletters et notifications. */
function ClasseStrip({ local }: { local: number }) {
  const p = easeOut(clamp01((local - 178) / 22));
  return (
    <div
      style={{
        position: "absolute",
        left: ROW_LEFT,
        top: STRIP_Y,
        width: ROW_W,
        height: ROW_H_SORT - 8,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 24px",
        background: C.toile,
        borderRadius: RADIUS.btn,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <span
        style={{
          flex: "none",
          background: C.toile,
          color: C.slate,
          border: `1px solid ${C.repere}`,
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 23,
          padding: "7px 17px",
          borderRadius: 999,
          minWidth: 150,
          textAlign: "center",
        }}
      >
        Classé
      </span>
      <span style={{ flex: 1, fontFamily: FONT.sans, fontSize: 27, color: C.faint }}>
        Banque · Newsletter · 39 autres
      </span>
      <span
        style={{
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 28,
          color: C.slate,
        }}
      >
        41
      </span>
    </div>
  );
}

/* ------------------------------ Composeur ------------------------------- */

const REPLY_1 = "Bonjour,";
const REPLY_2 = "mardi 10 h me convient parfaitement.";
const REPLY_LEN = REPLY_1.length + REPLY_2.length;

function Composer({ local, opacity }: { local: number; opacity: number }) {
  const typed = Math.floor(
    interpolate(local, [226, 292], [0, REPLY_LEN], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const shown1 = REPLY_1.slice(0, Math.min(typed, REPLY_1.length));
  const shown2 = typed > REPLY_1.length ? REPLY_2.slice(0, typed - REPLY_1.length) : "";
  const typing = local >= 226 && local < 292;
  const caretOn = Math.floor(local / 8) % 2 === 0;

  const barsP = easeOut(clamp01((local - 294) / 12));

  // Curseur souris (coordonnées relatives à la racine du composeur) : glisse
  // vers le bouton « Relire & envoyer », puis un appui court au moment du clic.
  const CURSOR_X0 = 430;
  const CURSOR_Y0 = 470;
  // Pointe sur la marge droite du bouton : le clic est lisible sans occulter le
  // libellé « Relire & envoyer » (le corps de la flèche part vers le bas-droite).
  const CURSOR_X1 = 1052;
  const CURSOR_Y1 = 742;
  const moveP = easeOut(clamp01((local - 298) / 14));
  const cx = CURSOR_X0 + (CURSOR_X1 - CURSOR_X0) * moveP;
  const cy = CURSOR_Y0 + (CURSOR_Y1 - CURSOR_Y0) * moveP;
  const pressed = local >= 312 && local < 320;
  const sent = local >= 313;

  return (
    <div
      style={{
        position: "absolute",
        left: ROW_LEFT,
        right: ROW_LEFT,
        top: HEADER_H + 26,
        bottom: 40,
        opacity,
      }}
    >
      {/* En-tête du fil en réponse */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          paddingBottom: 22,
          borderBottom: "1px solid rgba(16,24,40,0.08)",
        }}
      >
        <div style={{ flex: "0 1 auto", minWidth: 0, paddingRight: 24 }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 31,
              color: C.ink,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Client · Durand — Rendez-vous de mardi
          </div>
          <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: 23, color: C.quiet }}>
            Réponse · À : contact@durand-sa.fr
          </div>
        </div>
        <span
          style={{
            flex: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: FONT.mono,
            fontSize: 20,
            padding: "9px 18px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            background: sent ? C.ecume : "rgba(217,119,87,0.12)",
            color: sent ? C.inkEcume : CLAUDE_TERRA,
          }}
        >
          {!sent && <ClaudeMark size={24} />}
          {sent ? "envoyé" : "brouillon rédigé par Claude"}
        </span>
      </div>

      {/* Corps rédigé à la machine à écrire */}
      <div style={{ paddingTop: 30 }}>
        <div style={{ fontFamily: FONT.sans, fontSize: 32, lineHeight: 1.55, color: C.body }}>
          {shown1}
          {typing && typed <= REPLY_1.length && caretOn ? (
            <span style={{ color: CLAUDE_TERRA }}>▍</span>
          ) : null}
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 32, lineHeight: 1.55, color: C.body }}>
          {shown2}
          {typing && typed > REPLY_1.length && caretOn ? (
            <span style={{ color: CLAUDE_TERRA }}>▍</span>
          ) : null}
        </div>
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18, opacity: barsP }}>
          <TextBar width="94%" height={16} />
          <TextBar width="72%" height={16} />
        </div>
      </div>

      {/* Bouton « Relire & envoyer » + curseur souris */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 28,
              color: "#FFFFFF",
              background: sent ? C.inkEcume : C.canard,
              padding: "16px 30px",
              borderRadius: RADIUS.btn,
              transform: `scale(${pressed ? 0.96 : 1})`,
              boxShadow: SHADOW.card,
            }}
          >
            {sent ? "✓ envoyé" : "Relire & envoyer"}
          </span>
        </div>
      </div>

      {/* Curseur souris — positionné dans le repère du composeur */}
      {local >= 296 && <Cursor x={cx} y={cy} pressed={pressed} />}
    </div>
  );
}

/** Curseur souris dessiné (flèche encre) avec un léger « clic ». */
function Cursor({ x, y, pressed }: { x: number; y: number; pressed: boolean }) {
  return (
    <svg
      width="34"
      height="40"
      viewBox="0 0 34 40"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${pressed ? 0.85 : 1})`,
        transformOrigin: "top left",
        filter: "drop-shadow(0 3px 5px rgba(16,24,40,0.30))",
      }}
    >
      <path
        d="M2 2 L2 30 L9.5 23 L14.5 34.5 L19 32.5 L14 21 L24 21 Z"
        fill="#0E0E12"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
