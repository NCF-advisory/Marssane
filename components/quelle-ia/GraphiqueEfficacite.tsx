import type { ClassementEntry } from "@/lib/benchmarks/aggregate";

/**
 * Nuage intelligence × coût, sur le modèle du graphique « Benchmark :
 * efficience des modèles » du deck NCF x Marssane : carte blanche sur l'encre,
 * en-tête mono + légende par éditeur, quadrillage horizontal, frontière
 * d'efficience en pointillés, zone de performance maximale en écume, tous les
 * points étiquetés, le TOP 2 du classement cerclé de turquoise et étiqueté en
 * clay. Tout est calculé depuis les entrées live (aucune donnée en dur) : le
 * graphe suit le classement quand les sources se rafraîchissent.
 */

// Géométrie du repère (viewBox 880 × 470)
const VB_W = 880;
const VB_H = 470;
const M_LEFT = 64;
const M_RIGHT = 30;
const M_TOP = 22;
const M_BOTTOM = 58;

const PLOT_X0 = M_LEFT;
const PLOT_X1 = VB_W - M_RIGHT;
const PLOT_Y0 = M_TOP; // haut (intelligence max)
const PLOT_Y1 = VB_H - M_BOTTOM; // bas (intelligence min)

/** Graduations candidates de l'axe log (motif 1-3-10), filtrées au domaine. */
const X_TICK_CANDIDATES = [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 100, 300];

/**
 * Couleurs par éditeur, celles du deck : Anthropic en clay, OpenAI en encre,
 * Google en vert (seule couleur hors charte — le vert n'existe pas dans les
 * tokens et l'ink-ecume tirerait vers le sarcelle), le reste en gris quiet.
 */
const GOOGLE_GREEN = "#2f8a4c";
const couleurEditeur = (editeur: string): string => {
  if (editeur === "Anthropic") return "var(--color-clay)";
  if (editeur === "OpenAI") return "var(--color-ink)";
  if (editeur === "Google") return GOOGLE_GREEN;
  return "var(--color-quiet)";
};

/** Nombres du repli lecteur d'écran : une décimale, virgule française. */
const fmt1 = (x: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(x);
const fmt2 = (x: number) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x);
/** Graduations X : jusqu'à 2 décimales utiles (0,03 · 0,3 · 1 · 3…). */
const fmtTick = (x: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(x);

// ---------------------------------------------------------------------------
// Placement des étiquettes (anti-collision)
// ---------------------------------------------------------------------------

type Box = { x0: number; y0: number; x1: number; y1: number };

const chevauche = (a: Box, b: Box) =>
  a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

/**
 * Étiquette : 4 positions candidates (droite, gauche, dessus, dessous), la
 * première qui ne heurte ni le repère ni une étiquette/point déjà posé gagne.
 * Largeur estimée (pas de mesure de texte côté serveur) : ~6,6 px/caractère à
 * 11,5 px — assez pour éviter les chevauchements sans sur-écarter.
 */
const LABEL_H = 13;
const CHAR_W = 6.6;

function placeLabel(
  cx: number,
  cy: number,
  nom: string,
  occupes: Box[],
  prefereDessus: boolean,
): { x: number; y: number; anchor: "start" | "end" | "middle"; box: Box } {
  const w = nom.length * CHAR_W;
  const candidats: { x: number; y: number; anchor: "start" | "end" | "middle"; box: Box }[] = [
    { x: cx + 10, y: cy + 4, anchor: "start", box: { x0: cx + 9, y0: cy - 7, x1: cx + 10 + w, y1: cy + 6 } },
    { x: cx - 10, y: cy + 4, anchor: "end", box: { x0: cx - 10 - w, y0: cy - 7, x1: cx - 9, y1: cy + 6 } },
    { x: cx, y: cy - 12, anchor: "middle", box: { x0: cx - w / 2, y0: cy - 12 - LABEL_H + 3, x1: cx + w / 2, y1: cy - 8 } },
    { x: cx, y: cy + 19, anchor: "middle", box: { x0: cx - w / 2, y0: cy + 9, x1: cx + w / 2, y1: cy + 21 } },
  ];
  if (prefereDessus) candidats.unshift(candidats.splice(2, 1)[0]);

  for (const c of candidats) {
    const dansRepere =
      c.box.x0 >= PLOT_X0 - 40 && c.box.x1 <= PLOT_X1 + 8 && c.box.y0 >= PLOT_Y0 - 14 && c.box.y1 <= PLOT_Y1 + 2;
    if (dansRepere && !occupes.some((o) => chevauche(o, c.box))) return c;
  }
  // Dernier recours : à droite, décalé sous les gêneurs.
  const repli = candidats[0];
  let dy = 0;
  while (occupes.some((o) => chevauche(o, { ...repli.box, y0: repli.box.y0 + dy, y1: repli.box.y1 + dy })) && dy < 60) {
    dy += LABEL_H;
  }
  return { ...repli, y: repli.y + dy, box: { ...repli.box, y0: repli.box.y0 + dy, y1: repli.box.y1 + dy } };
}

// ---------------------------------------------------------------------------

export function GraphiqueEfficacite({ entries }: { entries: ClassementEntry[] }) {
  if (entries.length === 0) return null;

  // --- Échelle X : log10 du coût, avec marge de part et d'autre ---
  const logs = entries.map((e) => Math.log10(Math.max(e.coutEurM, 0.01)));
  const logPad = (Math.max(...logs) - Math.min(...logs)) * 0.1 || 0.2;
  const xDomMin = Math.min(...logs) - logPad;
  const xDomMax = Math.max(...logs) + logPad;
  const scaleX = (cout: number) => {
    const t = (Math.log10(Math.max(cout, 0.01)) - xDomMin) / (xDomMax - xDomMin);
    return PLOT_X0 + t * (PLOT_X1 - PLOT_X0);
  };

  // --- Échelle Y : intelligence, croissante vers le haut ---
  const intels = entries.map((e) => e.intelligence);
  const yMin = Math.min(...intels);
  const yMax = Math.max(...intels);
  const yPad = (yMax - yMin) * 0.14 || 5;
  const yDomMin = yMin - yPad;
  const yDomMax = yMax + yPad;
  const scaleY = (intel: number) => {
    const t = (intel - yDomMin) / (yDomMax - yDomMin);
    return PLOT_Y1 - t * (PLOT_Y1 - PLOT_Y0); // inversion : haut = grand
  };

  // Graduations Y : multiples de 5 dans le domaine (quadrillage horizontal).
  const yTicks: number[] = [];
  for (let v = Math.ceil(yDomMin / 5) * 5; v <= yDomMax; v += 5) yTicks.push(v);

  const xTicks = X_TICK_CANDIDATES.filter(
    (v) => Math.log10(v) >= xDomMin && Math.log10(v) <= xDomMax,
  );

  // --- Frontière d'efficience : maximum courant d'intelligence, coût croissant ---
  const parCout = [...entries].sort((a, b) => a.coutEurM - b.coutEurM);
  const frontiere: ClassementEntry[] = [];
  let maxIntel = -Infinity;
  for (const e of parCout) {
    if (e.intelligence > maxIntel) {
      frontiere.push(e);
      maxIntel = e.intelligence;
    }
  }
  const cheminFrontiere = frontiere
    .map((e, i) => `${i === 0 ? "M" : "L"} ${scaleX(e.coutEurM).toFixed(1)} ${scaleY(e.intelligence).toFixed(1)}`)
    .join(" ");

  // --- Zone de performance maximale : boîte englobante du quart supérieur ---
  const seuilZone = yMax - (yMax - yMin) * 0.25;
  const ptsZone = entries.filter((e) => e.intelligence >= seuilZone);
  const zoneX0 = Math.max(PLOT_X0, Math.min(...ptsZone.map((e) => scaleX(e.coutEurM))) - 26);
  const zoneX1 = Math.min(PLOT_X1, Math.max(...ptsZone.map((e) => scaleX(e.coutEurM))) + 26);
  const zoneY0 = Math.max(PLOT_Y0, Math.min(...ptsZone.map((e) => scaleY(e.intelligence))) - 20);
  const zoneY1 = Math.min(PLOT_Y1, Math.max(...ptsZone.map((e) => scaleY(e.intelligence))) + 20);

  // --- Légende : éditeurs connus dans un ordre fixe, le reste en « Autres » ---
  const editeursPresents = new Set(entries.map((e) => e.editeur));
  const legende: { nom: string; couleur: string }[] = ["Anthropic", "OpenAI", "Google"]
    .filter((n) => editeursPresents.has(n))
    .map((n) => ({ nom: n, couleur: couleurEditeur(n) }));
  if ([...editeursPresents].some((n) => !["Anthropic", "OpenAI", "Google"].includes(n))) {
    legende.push({ nom: "Autres", couleur: "var(--color-quiet)" });
  }

  const top = [...entries].sort((a, b) => a.rang - b.rang)[0];

  // --- Étiquettes : cerclés d'abord (meilleures places), puis rang croissant.
  //     Les points eux-mêmes sont déclarés occupés d'entrée. ---
  const ordre = [...entries].sort((a, b) => a.rang - b.rang);
  const occupes: Box[] = ordre.map((e) => {
    const cx = scaleX(e.coutEurM);
    const cy = scaleY(e.intelligence);
    const r = e.rang <= 2 ? 10 : 6;
    return { x0: cx - r, y0: cy - r, x1: cx + r, y1: cy + r };
  });

  // Légende de la zone, comme sur le deck : sous le coin bas-gauche de
  // préférence, sinon à l'intérieur du rectangle — première position qui ne
  // recouvre aucun point. ~7,2 px/caractère : mono 10 px + interlettrage.
  const CAPTION = "Zone de performance maximale";
  const captionW = CAPTION.length * 7.2;
  const captionBox = (x: number, y: number): Box => ({ x0: x - 4, y0: y - 11, x1: x + captionW, y1: y + 3 });
  const captionCandidats: [number, number][] = [
    [zoneX0 + 4, Math.min(zoneY1 + 16, PLOT_Y1 - 4)],
    [zoneX0 + 4, zoneY1 - 8],
    [zoneX0 + 4, zoneY0 + 15],
    [Math.max(PLOT_X0 + 4, zoneX1 - captionW - 4), Math.min(zoneY1 + 16, PLOT_Y1 - 4)],
  ];
  const [captionX, captionY] =
    captionCandidats.find(([x, y]) => !occupes.some((o) => chevauche(o, captionBox(x, y)))) ??
    captionCandidats[0];
  occupes.push(captionBox(captionX, captionY));
  const etiquettes = ordre.map((e) => {
    const cerne = e.rang <= 2;
    const pos = placeLabel(scaleX(e.coutEurM), scaleY(e.intelligence), e.nom, occupes, cerne);
    occupes.push(pos.box);
    return { e, cerne, ...pos };
  });

  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      <div className="max-w-[640px]">
        <h2 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] text-white sm:text-[38px]">
          Intelligence ×{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            coût
          </span>
          .
        </h2>
        <p className="mt-[14px] text-[16.5px] text-body-sur-ink">
          Chaque point est un modèle. Plus il est haut et à gauche, meilleur est
          son rapport intelligence-coût.
        </p>
      </div>

      {/* Amorce de défilement, posée AVANT la carte (cf. version précédente). */}
      <p className="mt-6 font-mono text-[10.5px] text-faint-sur-ink lg:hidden">
        Glissez pour parcourir le graphe →
      </p>

      {/* Carte blanche du deck : en-tête mono + légende, puis le repère. */}
      <div className="mt-2 overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-hero lg:mt-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 pb-1 pt-[18px] sm:px-7">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate">
            Intelligence index × coût €/M tokens · échelle log
          </span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {legende.map((l) => (
              <span key={l.nom} className="flex items-center gap-[6px]">
                <span
                  aria-hidden
                  className="h-[8px] w-[8px] rounded-full"
                  style={{ background: l.couleur }}
                />
                <span className="font-mono text-[11px] text-body">{l.nom}</span>
              </span>
            ))}
          </span>
        </div>

        {/* Sous lg, le repère se parcourt horizontalement plutôt que d'être
            contracté. `tabIndex` rend la zone défilable au clavier aussi. */}
        <div className="overflow-x-auto px-2 pb-2 sm:px-4" tabIndex={0}>
          <svg
            className="h-auto w-full min-w-[680px] lg:min-w-0"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label={`Nuage intelligence contre coût ; en tête : ${top.nom}`}
          >
            {/* Zone de performance maximale (écume, sous les points) */}
            <rect
              x={zoneX0}
              y={zoneY0}
              width={zoneX1 - zoneX0}
              height={zoneY1 - zoneY0}
              fill="var(--color-ecume)"
              opacity={0.38}
            />
            <text
              x={captionX}
              y={captionY}
              className="font-mono text-[10px] font-semibold uppercase"
              style={{ letterSpacing: "0.12em" }}
              fill="var(--color-ink-ecume)"
            >
              {CAPTION}
            </text>

            {/* Quadrillage horizontal + graduations Y */}
            {yTicks.map((v) => (
              <g key={v}>
                <line
                  x1={PLOT_X0}
                  y1={scaleY(v)}
                  x2={PLOT_X1}
                  y2={scaleY(v)}
                  stroke="var(--color-grid-line)"
                />
                <text
                  x={PLOT_X0 - 10}
                  y={scaleY(v) + 3.5}
                  textAnchor="end"
                  className="font-mono text-[11px]"
                  fill="var(--color-faint)"
                >
                  {v}
                </text>
              </g>
            ))}

            {/* Graduations X */}
            {xTicks.map((v) => (
              <text
                key={v}
                x={scaleX(v)}
                y={PLOT_Y1 + 22}
                textAnchor="middle"
                className="font-mono text-[11px]"
                fill="var(--color-faint)"
              >
                {fmtTick(v)}&#8239;€
              </text>
            ))}

            {/* Libellés d'axes */}
            <text
              x={(PLOT_X0 + PLOT_X1) / 2}
              y={VB_H - 8}
              textAnchor="middle"
              className="font-mono text-[10.5px]"
              fill="var(--color-faint)"
            >
              Coût €/M tokens
            </text>
            <text
              transform={`translate(16 ${(PLOT_Y0 + PLOT_Y1) / 2}) rotate(-90)`}
              textAnchor="middle"
              className="font-mono text-[10.5px]"
              fill="var(--color-faint)"
            >
              Intelligence (0-100)
            </text>

            {/* Frontière d'efficience en pointillés */}
            <path
              d={cheminFrontiere}
              fill="none"
              stroke="var(--color-repere)"
              strokeWidth={1.4}
              strokeDasharray="2 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points + étiquettes (cerclés en dernier pour passer dessus) */}
            {[...etiquettes].reverse().map(({ e, cerne, x, y, anchor }) => {
              const cx = scaleX(e.coutEurM);
              const cy = scaleY(e.intelligence);
              return (
                <g key={e.cle}>
                  {cerne ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={10}
                      fill="none"
                      stroke="var(--color-turquoise)"
                      strokeWidth={2.2}
                    />
                  ) : null}
                  <circle cx={cx} cy={cy} r={cerne ? 6.5 : 5} fill={couleurEditeur(e.editeur)} />
                  <text
                    x={x}
                    y={y}
                    textAnchor={anchor}
                    className={cerne ? "text-[12px] font-semibold" : "text-[11.5px]"}
                    fill={cerne ? "var(--color-ink-clay)" : "var(--color-ink)"}
                  >
                    {e.nom}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Repli lecteurs d'écran : on annonce les deux axes du nuage (intelligence
          et coût) et le score de rang. Pas l'indice d'efficacité-coût, qui n'est
          qu'un terme intermédiaire normalisé en min-max — le dernier du
          classement vaut 0, ce qui serait trompeur annoncé tel quel. */}
      <ul className="absolute h-px w-px overflow-hidden">
        {entries.map((e) => (
          <li key={e.cle}>
            {e.nom} ({e.editeur}) : score {fmt1(e.score)} sur 100, intelligence{" "}
            {fmt1(e.intelligence)} sur 100, coût {fmt2(e.coutEurM)} € par million de tokens.
          </li>
        ))}
      </ul>
    </section>
  );
}
