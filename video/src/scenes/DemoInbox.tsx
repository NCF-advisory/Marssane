import { AbsoluteFill } from "remotion";
import { C, FONT } from "../theme";
import { Card, Chip, TextBar } from "../components/primitives";
import { ramp, pop } from "../anim";

/** Boîte non triée (état initial = frame 0 = raccord de boucle). */
const BRUT = [
  { exp: "Greffe TC", heure: "07:58", objet: "Convocation — dossier n° 24-118" },
  { exp: "Newsletter fournisseur", heure: "07:41", objet: "Nos offres du mois de juillet" },
  { exp: "Client · pièces", heure: "07:30", objet: "Re: documents manquants" },
  { exp: "Banque", heure: "07:12", objet: "Relevé mensuel disponible" },
  { exp: "Confrère", heure: "06:54", objet: "Proposition de date d'audience" },
];

/** Boîte triée : un badge par mail (Urgent, À traiter, En attente, Classé). */
const TRIE = [
  { badge: "Urgent", bg: C.canard, fg: "#fff", titre: "Greffe TC — convocation" },
  { badge: "À traiter", bg: C.ecume, fg: C.inkEcume, titre: "Confrère — date d'audience" },
  { badge: "En attente", bg: C.periwinkle, fg: C.inkPeriwinkle, titre: "Client — pièces manquantes" },
  { badge: "Classé", bg: C.toile, fg: C.slate, titre: "Banque · Newsletter · 41 autres" },
];

/**
 * Démo 1 — La boîte qui se trie. La liste brute (compteur 47) se réorganise :
 * les badges se posent un à un, puis pied « 6 / 47 » et badge écume « triée par
 * votre automatisation ». Aucun texte narratif : seul le contenu de l'interface.
 */
export function DemoInbox({ local, fps }: { local: number; fps: number }) {
  const sortT = ramp(local, 46, 82); // 0 = brut, 1 = trié
  const footT = ramp(local, 104, 124);
  const badgeAuto = pop(local, fps, 122);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <Card style={{ width: 968 }}>
          {/* En-tête */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "34px 44px",
              borderBottom: "1px solid rgba(16,24,40,0.06)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 46, color: C.ink }}>
                Boîte de réception
              </span>
              <span style={{ fontFamily: FONT.mono, fontSize: 32, color: C.faint }}>
                08:02
              </span>
            </div>
            <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 60, color: C.slate }}>
              47
            </span>
          </div>

          {/* Zone liste (les deux états se croisent au même endroit) */}
          <div style={{ position: "relative", height: 600 }}>
            {/* Brut */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "8px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 4,
                opacity: 1 - sortT,
                transform: `translateY(${-14 * sortT}px)`,
              }}
            >
              {BRUT.map((m, i) => (
                <div key={i} style={{ padding: "11px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 40, color: C.ink }}>
                      {m.exp}
                    </span>
                    <span style={{ fontFamily: FONT.mono, fontSize: 28, color: C.quiet }}>
                      {m.heure}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 3,
                      fontFamily: FONT.sans,
                      fontSize: 30,
                      color: C.faint,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {m.objet}
                  </div>
                </div>
              ))}
            </div>

            {/* Trié */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "24px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 18,
                opacity: sortT,
                transform: `translateY(${14 * (1 - sortT)}px)`,
              }}
            >
              {TRIE.map((m, i) => {
                const bp = pop(local, fps, 70 + i * 12);
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      padding: "18px 20px",
                    }}
                  >
                    <Chip
                      bg={m.bg}
                      color={m.fg}
                      size={36}
                      style={{
                        flex: "none",
                        minWidth: 188,
                        opacity: Math.min(1, bp),
                        transform: `scale(${0.7 + 0.3 * Math.min(1, bp)})`,
                      }}
                    >
                      {m.badge}
                    </Chip>
                    <span
                      style={{
                        fontFamily: FONT.sans,
                        fontWeight: 700,
                        fontSize: m.badge === "Classé" ? 36 : 42,
                        color: m.badge === "Classé" ? C.faint : C.ink,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {m.titre}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pied : à traiter 6 / 47 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "30px 44px",
              borderTop: "1px solid rgba(16,24,40,0.07)",
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontSize: 38, color: C.faint }}>
              à traiter ce matin
            </span>
            <span
              style={{
                fontFamily: FONT.mono,
                fontWeight: 600,
                fontSize: 54,
                color: C.inkEcume,
                opacity: footT,
              }}
            >
              6 / 47
            </span>
          </div>
        </Card>

        {/* Badge écume de validation */}
        <Chip
          bg={C.ecume}
          color={C.inkEcume}
          size={40}
          style={{
            opacity: Math.min(1, badgeAuto),
            transform: `scale(${0.9 + 0.1 * Math.min(1, badgeAuto)})`,
          }}
        >
          triée par votre automatisation
        </Chip>
      </div>
    </AbsoluteFill>
  );
}
