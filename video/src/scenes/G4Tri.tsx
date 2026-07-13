import { AbsoluteFill } from "remotion";
import { C, FONT, SHADOW, RADIUS } from "../theme";
import { easeOut, pop } from "../anim";

const CARD_W = 1560;
const CARD_H = 660;

const INTRO = 20; // premier départ
const STEP = 24; // un mail trié toutes les ~0,8 s (rythme resserré)
const FLIGHT = 20; // durée de vol
const ROW_H = 84;
const QX = 56; // colonne des entrants
const QY0 = 214; // premier créneau
const FX = 812; // ancrage d'arrivée (bord des dossiers)

type Email = { from: string; subj: string; folder: number };

const EMAILS: Email[] = [
  { from: "Client · Dupont", subj: "signature du compromis", folder: 0 },
  { from: "Greffe TC", subj: "convocation — 24-118", folder: 1 },
  { from: "Fournisseur", subj: "facture de juillet", folder: 2 },
  { from: "Client · Martin", subj: "pièces manquantes", folder: 0 },
  { from: "Huissier", subj: "délai — 15 jours", folder: 1 },
  { from: "Comptable", subj: "relevé à transmettre", folder: 2 },
  { from: "Client · Bernard", subj: "demande de rendez-vous", folder: 0 },
];

const FOLDERS = [
  { name: "Clients", accent: C.canard, chipBg: C.ecume, chipFg: C.inkEcume },
  { name: "Urgent", accent: C.clay, chipBg: "#F6E1DE", chipFg: "#8A2E22" },
  {
    name: "À déléguer",
    accent: C.lavande,
    chipBg: C.periwinkle,
    chipFg: C.inkPeriwinkle,
  },
];
const FOLDER_CY = [214, 370, 526]; // centres verticaux des dossiers

const departF = (k: number) => INTRO + k * STEP;
const arriveF = (k: number) => departF(k) + FLIGHT;

/**
 * G4 — Le tri de mails en action (20–31 s). Interface de boîte mail épurée :
 * les entrants se trient automatiquement dans « Clients », « Urgent »,
 * « À déléguer », un mail par seconde, avec une courte trajectoire et un check
 * vert à chaque tri. Sous-titre : « Construit par un participant. En une
 * journée. » C'est le livrable concret de la formation, montré en marche.
 */
export function G4Tri({ local, fps }: { local: number; fps: number }) {
  // Progression de vol de chaque mail (0 = en file, 1 = classé).
  const g = EMAILS.map((_, k) =>
    Math.max(0, Math.min(1, (local - departF(k)) / FLIGHT)),
  );
  const landed = g.map((v) => v >= 0.999);
  const total = landed.filter(Boolean).length;

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
          }}
        >
          {/* En-tête */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              height: 110,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 44px",
              borderBottom: "1px solid rgba(16,24,40,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 40,
                color: C.ink,
              }}
            >
              Boîte de réception
            </span>
            <span
              style={{ fontFamily: FONT.mono, fontSize: 30, color: C.inkEcume }}
            >
              {total} / {EMAILS.length} triés
            </span>
          </div>

          {/* Colonne « Entrants » */}
          <span
            style={{
              position: "absolute",
              left: QX,
              top: 150,
              fontFamily: FONT.mono,
              fontSize: 22,
              letterSpacing: "0.04em",
              color: C.faint,
            }}
          >
            Entrants
          </span>

          {/* Dossiers */}
          {FOLDERS.map((f, fi) => {
            const count = landed.filter(
              (l, k) => l && EMAILS[k].folder === fi,
            ).length;
            // Check vert : flash court après la dernière arrivée dans ce dossier.
            const lastArr = EMAILS.reduce((acc, e, k) => {
              if (e.folder === fi && landed[k]) return Math.max(acc, arriveF(k));
              return acc;
            }, -999);
            const flash = Math.min(1, pop(local, fps, lastArr));
            const active = local - lastArr >= 0 && local - lastArr < 16;
            return (
              <div
                key={f.name}
                style={{
                  position: "absolute",
                  left: 800,
                  top: FOLDER_CY[fi] - 64,
                  width: 700,
                  height: 128,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "0 30px",
                  background: C.toile,
                  borderRadius: RADIUS.card,
                  border: `1px solid ${active ? f.accent : "rgba(16,24,40,0.06)"}`,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: f.accent,
                    flex: "none",
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontFamily: FONT.sans,
                    fontWeight: 700,
                    fontSize: 36,
                    color: C.ink,
                  }}
                >
                  {f.name}
                </span>
                {/* Check vert qui flashe à l'arrivée */}
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: C.ecume,
                    color: C.inkEcume,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    fontWeight: 800,
                    opacity: active ? Math.min(1, flash) : 0,
                    transform: `scale(${0.6 + 0.4 * flash})`,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    minWidth: 56,
                    textAlign: "right",
                    fontFamily: FONT.mono,
                    fontWeight: 600,
                    fontSize: 40,
                    color: count > 0 ? C.ink : C.quiet,
                  }}
                >
                  {count}
                </span>
              </div>
            );
          })}

          {/* Mails : en file puis en vol vers leur dossier */}
          {EMAILS.map((e, k) => {
            if (landed[k]) return null;
            // Créneau dans la file : remonte à mesure que les précédents partent.
            const vacated = g.slice(0, k).reduce((a, b) => a + b, 0);
            const slot = k - vacated;
            if (g[k] === 0 && slot > 4.4) return null; // hors fenêtre visible
            const qy = QY0 + slot * ROW_H;
            const e2 = easeOut(g[k]);
            const x = QX + (FX - QX) * e2;
            const y = qy + (FOLDER_CY[e.folder] - 30 - qy) * e2;
            const scale = 1 - 0.32 * e2;
            const opacity = g[k] < 0.85 ? 1 : (1 - g[k]) / 0.15;
            const accent = FOLDERS[e.folder].accent;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 700,
                  height: 68,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "0 22px",
                  background: C.surface,
                  borderRadius: RADIUS.btn,
                  border: "1px solid rgba(16,24,40,0.08)",
                  boxShadow: g[k] > 0 ? SHADOW.float : SHADOW.card,
                  opacity,
                  transform: `scale(${scale})`,
                  transformOrigin: "left center",
                  zIndex: g[k] > 0 ? 50 : 10 - k,
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: accent,
                    flex: "none",
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 700,
                    fontSize: 30,
                    color: C.ink,
                    flex: "none",
                  }}
                >
                  {e.from}
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
                  {e.subj}
                </span>
              </div>
            );
          })}
        </div>
    </AbsoluteFill>
  );
}
