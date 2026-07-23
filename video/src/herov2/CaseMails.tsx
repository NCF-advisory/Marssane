import { AbsoluteFill, interpolate } from "remotion";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { easeOut } from "../anim";

/**
 * CAS 1 (héro v2) — la boîte de réception triée. Version condensée (~5 s) qui
 * reprend le langage visuel du Cas 1 : badges Urgent / À traiter / Classé,
 * balayage canard du tri, chip « triée », pied « 6 à traiter ce matin ».
 *
 * Aucune phrase narrative : uniquement du texte d'interface. Le recul de
 * l'horloge (+45 min) est géré par le calque maître, quand la carte est au repos.
 */

const CARD_W = 1040;
const CARD_H = 660;
const HEADER_H = 96;
const FOOTER_H = 88;
const PAD = 40;
const ROWS_TOP = HEADER_H + 34;
const ROW_H = 84;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

type Cat = "urgent" | "traiter";
const BADGE: Record<Cat, { label: string; bg: string; fg: string }> = {
  urgent: { label: "Urgent", bg: C.canard, fg: "#FFFFFF" },
  traiter: { label: "À traiter", bg: C.ecume, fg: C.inkEcume },
};

const MAILS: { from: string; subj: string; cat: Cat }[] = [
  { from: "Client · Morel", subj: "Livraison de ce matin", cat: "urgent" },
  { from: "Prospect", subj: "Demande de devis", cat: "urgent" },
  { from: "Client · Durand", subj: "Rendez-vous mardi 10 h ?", cat: "traiter" },
  { from: "Comptable", subj: "Pièces pour la TVA", cat: "traiter" },
];

const badgeStart = (i: number) => 40 + i * 11;

export function CaseMails({ local }: { local: number }) {
  const cardIn = easeOut(clamp01(local / 22));

  // Résolution : liseré + chip « triée » + pied.
  const resultOp = interpolate(local, [100, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const numberOp = 1 - resultOp; // le compteur « 47 » cède la place à la chip

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
            Boîte de réception
          </span>
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
              47
            </span>
            <span
              style={{
                position: "absolute",
                right: 0,
                whiteSpace: "nowrap",
                background: C.ecume,
                color: C.inkEcume,
                fontFamily: FONT.mono,
                fontSize: 24,
                padding: "8px 18px",
                borderRadius: 999,
                opacity: resultOp,
              }}
            >
              triée
            </span>
          </div>
        </div>

        {/* Lignes de mails */}
        {MAILS.map((m, i) => (
          <Row key={i} mail={m} i={i} local={local} />
        ))}

        {/* Bande « Classé » */}
        <ClasseStrip local={local} />

        {/* Balayage canard du tri */}
        <Sweep local={local} />

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
            padding: `0 ${PAD}px`,
            borderTop: "1px solid rgba(16,24,40,0.10)",
            opacity: resultOp,
          }}
        >
          <span style={{ fontFamily: FONT.sans, fontSize: 28, color: C.faint }}>
            6 à traiter ce matin
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
  );
}

function Row({
  mail,
  i,
  local,
}: {
  mail: { from: string; subj: string; cat: Cat };
  i: number;
  local: number;
}) {
  const drop = easeOut(clamp01((local - (6 + i * 6)) / 16));
  const sorted = easeOut(clamp01((local - badgeStart(i)) / 20));
  const badge = BADGE[mail.cat];

  return (
    <div
      style={{
        position: "absolute",
        left: PAD,
        right: PAD,
        top: ROWS_TOP + i * ROW_H,
        height: ROW_H - 12,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 12px",
        opacity: drop,
        transform: `translateY(${(1 - drop) * -22}px)`,
      }}
    >
      {/* Badge trié (apparaît dans le sillage du balayage) */}
      <span
        style={{
          flex: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 160,
          background: badge.bg,
          color: badge.fg,
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 24,
          padding: "8px 18px",
          borderRadius: 999,
          opacity: sorted,
          transform: `scale(${0.7 + 0.3 * sorted})`,
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
          fontSize: 27,
          color: C.faint,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {mail.subj}
      </span>
    </div>
  );
}

function ClasseStrip({ local }: { local: number }) {
  const p = easeOut(clamp01((local - 96) / 20));
  return (
    <div
      style={{
        position: "absolute",
        left: PAD,
        right: PAD,
        top: ROWS_TOP + MAILS.length * ROW_H + 6,
        height: ROW_H - 12,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 24px",
        background: C.toile,
        borderRadius: RADIUS.btn,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      <span
        style={{
          flex: "none",
          minWidth: 160,
          textAlign: "center",
          background: C.toile,
          color: C.slate,
          border: `1px solid ${C.repere}`,
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 24,
          padding: "7px 17px",
          borderRadius: 999,
        }}
      >
        Classé
      </span>
      <span style={{ flex: 1, fontFamily: FONT.sans, fontSize: 27, color: C.faint }}>
        Banque · Newsletter · 41 autres
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

/** Voile canard doux qui descend la liste pendant le tri (jamais un flash). */
function Sweep({ local }: { local: number }) {
  const op = interpolate(local, [34, 46, 88, 100], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0.001) return null;
  const y = interpolate(local, [36, 92], [HEADER_H, CARD_H - FOOTER_H], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y - 130,
        height: 260,
        opacity: op,
        pointerEvents: "none",
        background:
          "radial-gradient(58% 100% at 50% 50%, rgba(14,114,145,0.14), rgba(14,114,145,0.05) 55%, rgba(14,114,145,0) 78%)",
      }}
    />
  );
}
