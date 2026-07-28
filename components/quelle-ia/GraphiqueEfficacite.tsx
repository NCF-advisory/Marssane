import type { ClassementEntry } from "@/lib/benchmarks/aggregate";
import { Kicker } from "@/components/ui/Kicker";

// Géométrie du repère (viewBox 760 × 440)
const VB_W = 760;
const VB_H = 440;
const M_LEFT = 56;
const M_RIGHT = 24;
const M_TOP = 24;
const M_BOTTOM = 48;

const PLOT_X0 = M_LEFT;
const PLOT_X1 = VB_W - M_RIGHT;
const PLOT_Y0 = M_TOP; // haut (intelligence max)
const PLOT_Y1 = VB_H - M_BOTTOM; // bas (intelligence min)

const X_TICKS = [1, 3, 10, 30];

/** Nombres du repli lecteur d'écran : une décimale, virgule française. */
const fmt1 = (x: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(x);
const fmt2 = (x: number) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x);

export function GraphiqueEfficacite({ entries }: { entries: ClassementEntry[] }) {
  if (entries.length === 0) return null;

  // --- Échelle X : log10 du coût, avec marge de part et d'autre ---
  const logs = entries.map((e) => Math.log10(Math.max(e.coutEurM, 0.01)));
  const logMin = Math.min(...logs, Math.log10(1));
  const logMax = Math.max(...logs, Math.log10(30));
  const logPad = (logMax - logMin) * 0.08 || 0.2;
  const xDomMin = logMin - logPad;
  const xDomMax = logMax + logPad;
  const scaleX = (cout: number) => {
    const t = (Math.log10(Math.max(cout, 0.01)) - xDomMin) / (xDomMax - xDomMin);
    return PLOT_X0 + t * (PLOT_X1 - PLOT_X0);
  };

  // --- Échelle Y : intelligence, croissante vers le haut ---
  const intels = entries.map((e) => e.intelligence);
  const yMin = Math.min(...intels);
  const yMax = Math.max(...intels);
  const yPad = (yMax - yMin) * 0.12 || 5;
  const yDomMin = yMin - yPad;
  const yDomMax = yMax + yPad;
  const scaleY = (intel: number) => {
    const t = (intel - yDomMin) / (yDomMax - yDomMin);
    return PLOT_Y1 - t * (PLOT_Y1 - PLOT_Y0); // inversion : haut = grand
  };

  const top = [...entries].sort((a, b) => a.rang - b.rang)[0];

  // Zone de performance maximale : quart supérieur du repère
  const zoneY = PLOT_Y0;
  const zoneH = (PLOT_Y1 - PLOT_Y0) * 0.25;

  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      <div className="max-w-[640px]">
        <Kicker className="text-faint-sur-ink!">D&apos;où vient ce classement</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] text-white sm:text-[38px]">
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

      {/* Amorce de défilement, posée AVANT le repère : haut de 394 px en
          mobile, celui-ci renverrait la mention sous le pli si elle le
          suivait. Même discrétion que les lignes de source. */}
      <p className="mt-6 font-mono text-[10.5px] text-faint-sur-ink lg:hidden">
        Glissez pour parcourir le graphe →
      </p>

      {/* Sous lg, le repère est plus large que la fenêtre : il se parcourt
          horizontalement plutôt que d'être contracté (à 320 px, l'échelle
          tombait à ×0,39 et les libellés se rendaient à moins de 4 px).
          `tabIndex` rend la zone défilable au clavier aussi. */}
      <div className="mt-2 overflow-x-auto lg:mt-8" tabIndex={0}>
        <svg
          className="h-auto w-full min-w-[680px] lg:min-w-0"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          role="img"
          aria-label={`Nuage intelligence contre coût ; en tête : ${top.nom}`}
        >
          {/* Zone optimale — écume en alpha très faible : sur fond encre, la
              teinte pleine brûlerait la zone et écraserait les points. */}
          <rect
            x={PLOT_X0}
            y={zoneY}
            width={PLOT_X1 - PLOT_X0}
            height={zoneH}
            fill="var(--color-ecume)"
            opacity={0.1}
          />
          <text
            x={PLOT_X0 + 8}
            y={zoneY + 14}
            className="font-mono text-[9px]"
            fill="var(--color-ecume)"
          >
            zone optimale
          </text>

          {/* Cadre / axes */}
          <line
            x1={PLOT_X0}
            y1={PLOT_Y0}
            x2={PLOT_X0}
            y2={PLOT_Y1}
            stroke="var(--color-line-sur-ink)"
          />
          <line
            x1={PLOT_X0}
            y1={PLOT_Y1}
            x2={PLOT_X1}
            y2={PLOT_Y1}
            stroke="var(--color-line-sur-ink)"
          />

          {/* Graduations X + libellés */}
          {X_TICKS.map((v) => {
            const x = scaleX(v);
            if (x < PLOT_X0 || x > PLOT_X1) return null;
            return (
              <g key={v}>
                <line
                  x1={x}
                  y1={PLOT_Y1}
                  x2={x}
                  y2={PLOT_Y1 + 5}
                  stroke="var(--color-line-sur-ink)"
                />
                <text
                  x={x}
                  y={PLOT_Y1 + 17}
                  textAnchor="middle"
                  className="font-mono text-[10px]"
                  fill="var(--color-faint-sur-ink)"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* Libellé axe X */}
          <text
            x={(PLOT_X0 + PLOT_X1) / 2}
            y={VB_H - 6}
            textAnchor="middle"
            className="font-mono text-[10px]"
            fill="var(--color-faint-sur-ink)"
          >
            coût €/M tokens · échelle log
          </text>

          {/* Libellé axe Y (vertical) */}
          <text
            transform={`translate(16 ${(PLOT_Y0 + PLOT_Y1) / 2}) rotate(-90)`}
            textAnchor="middle"
            className="font-mono text-[10px]"
            fill="var(--color-faint-sur-ink)"
          >
            intelligence
          </text>

          {/* Points */}
          {entries.map((e) => {
            const cx = scaleX(e.coutEurM);
            const cy = scaleY(e.intelligence);
            const isTop = e.rang <= 3;
            // Décalage du label pour rester dans le viewBox
            const labelRight = cx > PLOT_X1 - 90;
            const labelX = labelRight ? cx - 10 : cx + 10;
            const labelAnchor = labelRight ? "end" : "start";
            return (
              <g key={e.cle}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isTop ? 7 : 4.5}
                  // Sur encre le canard s'éteint : le TOP 3 passe en turquoise
                  // (10,1:1), les autres restent en gris clair (8,2:1).
                  fill={isTop ? "var(--color-turquoise)" : "var(--color-quiet)"}
                />
                {isTop ? (
                  <text
                    x={labelX}
                    y={cy + 3.5}
                    textAnchor={labelAnchor}
                    className="font-mono text-[10px]"
                    fill="#FFFFFF"
                  >
                    {e.nom}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Repli lecteurs d'écran : on annonce les deux axes du nuage (intelligence
          et coût) et le score de rang. Pas l'indice d'efficacité-coût, qui n'est
          qu'un terme intermédiaire normalisé en min-max — le dernier du
          classement vaut 0, ce qui serait trompeur annoncé tel quel. */}
      <ul className="absolute h-px w-px overflow-hidden">
        {entries.map((e) => (
          <li key={e.cle}>
            {e.nom} : score {fmt1(e.score)} sur 100, intelligence {fmt1(e.intelligence)} sur 100,
            coût {fmt2(e.coutEurM)} € par million de tokens.
          </li>
        ))}
      </ul>
    </section>
  );
}
