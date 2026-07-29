/**
 * Hero « Quelle IA utiliser aujourd'hui ? » — direction 1d (hero inversé).
 * À déposer dans components/site/HeroRecommandation.tsx puis :
 *   import { HeroRecommandation } from "@/components/site/HeroRecommandation";
 *   <HeroRecommandation modele="Claude Opus 5" effort="medium" score="92,4"
 *                       date="27 juillet 2026" />
 *
 * Dépendances : aucune (styles en ligne). Polices déjà chargées par le site
 * (Plus Jakarta Sans / Spline Sans Mono).
 *
 * Écran unique en fond encre : pas de dark mode ailleurs sur le site, la
 * section suivante repart sur la toile claire.
 */
import React from "react";
import { LogoIA } from "@/components/ui/LogoIA";
import { PAYS } from "@/lib/pays";
import type { Pays } from "@/lib/benchmarks/models";

const INK = "#0E0E12";
const TURQUOISE = "#00D1BE";
const MONO = 'var(--font-mono, "Spline Sans Mono", ui-monospace, monospace)';
const SANS = 'var(--font-sans, "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif)';

/**
 * Libellés français des niveaux d'effort renvoyés par Artificial Analysis.
 * Traduction faite à l'affichage seulement : la prop `effort` reste le reflet
 * fidèle de la donnée source. Une valeur absente de la table est affichée telle
 * quelle — la source peut introduire un niveau qu'on ne connaît pas encore.
 */
const EFFORTS: Record<string, string> = {
  low: "faible",
  medium: "moyen",
  high: "élevé",
  xhigh: "très élevé",
  max: "maximal",
};

type Props = {
  modele?: string;
  effort?: string;
  score?: string;
  date?: string;
  /** Éditeur du modèle — détermine aussi le glyphe de la tuile. */
  editeur?: string;
  /** Code pays de l'éditeur ; le libellé vient de la table partagée `PAYS`. */
  pays?: Pays;
  baseline?: string;
  ancre?: string;
};

/** Repères « + » épars, en filigrane sur le fond encre. */
const REPERES: Array<{ x: string; y: string; c: string; s: number; sans?: boolean }> = [
  { x: "left:80px", y: "top:160px", c: "rgba(255,255,255,.16)", s: 16 },
  { x: "right:80px", y: "top:240px", c: "rgba(255,255,255,.16)", s: 16 },
  { x: "left:240px", y: "bottom:220px", c: "rgba(255,255,255,.12)", s: 16 },
  { x: "right:200px", y: "bottom:300px", c: "rgba(0,209,190,.35)", s: 19, sans: true },
  { x: "left:400px", y: "top:120px", c: "rgba(255,255,255,.13)", s: 16 },
  { x: "left:880px", y: "top:180px", c: "rgba(255,255,255,.10)", s: 16 },
  { x: "left:640px", y: "bottom:180px", c: "rgba(255,255,255,.12)", s: 16 },
  { x: "right:320px", y: "top:400px", c: "rgba(255,255,255,.09)", s: 16 },
  { x: "left:160px", y: "bottom:340px", c: "rgba(255,255,255,.10)", s: 16 },
  { x: "right:560px", y: "bottom:230px", c: "rgba(255,255,255,.08)", s: 16 },
  { x: "left:1040px", y: "bottom:400px", c: "rgba(0,209,190,.22)", s: 17, sans: true },
];

function parse(rule: string): React.CSSProperties {
  const [k, v] = rule.split(":");
  return { [k]: v } as React.CSSProperties;
}

/** Équerre 30 × 30, trait 3 px — même motif que le logo Marssane, à l'échelle. */
const EQUERRE: React.CSSProperties = { position: "absolute", width: "30px", height: "30px" };
const TRAIT = "3px solid rgba(255,255,255,.55)";

/**
 * Tuile du logo de l'éditeur : carré tenu par trois équerres (haut-gauche,
 * bas-gauche, bas-droit) et un « + » turquoise débordant au coin haut-droit,
 * légende éditeur dessous. Cotes pilotées par `--tuile` / `--glyphe`, que les
 * classes utilitaires réduisent sous 1100 px.
 */
function TuileLogo({
  modele,
  editeur,
  pays,
}: {
  modele: string;
  editeur: string;
  pays: Pays;
}) {
  return (
    // Empilée, la tuile plafonne à 240 px mais se réduit jusqu'à 132 px sur les
    // petites largeurs, pour que le premier écran tienne dans la fenêtre. Le
    // glyphe garde la proportion 176/344 ≈ 1/2.
    // C'est le poste vertical le plus lourd du premier écran : sa cote est donc
    // aussi bornée par la hauteur de fenêtre, empilée (20 svh — elle s'ajoute
    // alors au bloc de texte, d'où la borne plus sévère) comme en colonne
    // (34 svh, où elle se compare au texte au lieu de s'y ajouter). Sur les
    // hauteurs confortables les plafonds en px l'emportent : rien ne change.
    <div
      className="flex flex-col items-center justify-self-center [--glyphe:calc(var(--tuile)/2)] [--tuile:clamp(132px,min(24vw,20svh),240px)] min-[1100px]:justify-self-end min-[1100px]:[--tuile:min(344px,34svh)]"
    >
      <div style={{ position: "relative", width: "var(--tuile)", height: "var(--tuile)" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,.035)",
            border: "1px solid rgba(255,255,255,.10)",
            borderRadius: "4px",
            color: "#FFFFFF",
          }}
        >
          <LogoIA editeur={editeur} size="var(--glyphe)" label={modele} />
        </div>
        <span
          aria-hidden
          style={{ ...EQUERRE, left: 0, top: 0, borderLeft: TRAIT, borderTop: TRAIT, borderRadius: "4px 0 0 0" }}
        />
        <span
          aria-hidden
          style={{ ...EQUERRE, left: 0, bottom: 0, borderLeft: TRAIT, borderBottom: TRAIT, borderRadius: "0 0 0 4px" }}
        />
        <span
          aria-hidden
          style={{ ...EQUERRE, right: 0, bottom: 0, borderRight: TRAIT, borderBottom: TRAIT, borderRadius: "0 0 4px 0" }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "-7px",
            top: "-14px",
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: "25px",
            lineHeight: 1,
            color: TURQUOISE,
          }}
        >
          +
        </span>
      </div>
      <div
        style={{
          marginTop: "clamp(10px, 1.8svh, 18px)",
          width: "max-content",
          maxWidth: "100%",
          fontFamily: MONO,
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "#7A828E",
          textAlign: "center",
        }}
      >
        Éditeur · {editeur} ({PAYS[pays].libelle})
      </div>
    </div>
  );
}

export function HeroRecommandation({
  modele = "Claude Opus 5",
  effort = "medium",
  score = "92,4",
  date = "27 juillet 2026",
  editeur = "Anthropic",
  pays = "US",
  baseline = "Le meilleur compromis intelligence / prix du moment.",
  ancre = "#pourquoi",
}: Props) {
  return (
    <section
      // Hauteur du premier écran : la fenêtre moins la barre de navigation
      // (`sticky`, donc dans le flux, juste au-dessus du héro) — 74 px sous
      // `lg`, où elle porte le bouton menu, 70 px au-delà. Le héro se termine
      // ainsi pile au bas du pli : l'amorce de scroll, ancrée en bas de
      // section, est visible sans défiler.
      //
      // `svh` et non `vh` ni `dvh` : `vh` compte la barre d'URL rétractée, et
      // le bas de l'écran passait sous le pli ; `dvh` colle au pli du moment,
      // mais toutes les cotes verticales du héro en dépendent maintenant et
      // elles se seraient recalculées à chaque rétraction de la barre, pendant
      // le défilement. `svh` = le pli le plus petit (barre visible), celui de
      // l'arrivée sur la page : le premier écran tient, sans reflux.
      //
      // `minHeight` et non `height` : sur une fenêtre très basse (moins de
      // ~700 px) le contenu ne peut plus se comprimer davantage, il allonge
      // alors le héro et l'amorce repasse sous le pli — plutôt que d'être
      // rognée.
      className="min-h-[calc(100svh-74px)] lg:min-h-[calc(100svh-70px)]"
      style={{
        position: "relative",
        background: INK,
        overflow: "hidden",
        fontFamily: SANS,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Quadrillage 80px en filigrane (5,5 % de blanc), masqué en radial. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(to right, transparent 0, transparent 79px, rgba(255,255,255,.055) 79px, rgba(255,255,255,.055) 80px)," +
            "repeating-linear-gradient(to bottom, transparent 0, transparent 79px, rgba(255,255,255,.055) 79px, rgba(255,255,255,.055) 80px)",
          WebkitMaskImage:
            "radial-gradient(78% 70% at 50% 42%, rgba(0,0,0,.9), rgba(0,0,0,0) 82%)",
          maskImage:
            "radial-gradient(78% 70% at 50% 42%, rgba(0,0,0,.9), rgba(0,0,0,0) 82%)",
        }}
      />

      {REPERES.map((r, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            ...parse(r.x),
            ...parse(r.y),
            fontFamily: r.sans ? SANS : MONO,
            fontWeight: r.sans ? 500 : 400,
            fontSize: `${r.s}px`,
            lineHeight: 1,
            color: r.c,
          }}
        >
          +
        </span>
      ))}

      {/* Paddings et gouttières en classes (et non en style inline) : sous
          1100 px la tuile passe sous le texte et allonge l'écran, il faut donc
          les resserrer par paliers pour rester dans la fenêtre.
          Chaque cote verticale est en outre proportionnelle à la hauteur de
          fenêtre, plafonnée à sa valeur de référence (atteinte vers 1000 px de
          fenêtre) et planchée pour ne pas coller : sur une fenêtre courte, le
          rythme se resserre au lieu de pousser l'amorce de scroll sous le pli.
          Les cotes horizontales, elles, ne changent pas.
          Les gouttières sont volontairement plus élastiques que les paddings :
          la colonne étant en `space-between`, tout jeu leur revient de toute
          façon — un minimum plus bas ne se voit pas sur une fenêtre confortable
          et sert de réserve sur une fenêtre courte. */}
      <div
        className="gap-[clamp(20px,4.2svh,64px)] p-[clamp(28px,6.4svh,64px)_clamp(24px,6.6vw,96px)_clamp(24px,5.6svh,56px)] max-[1100px]:gap-[clamp(16px,2.4svh,40px)] max-[1100px]:p-[clamp(24px,5.2svh,48px)_clamp(24px,6.6vw,96px)_clamp(20px,4.4svh,40px)] max-[640px]:gap-[clamp(16px,3.4svh,32px)] max-[640px]:p-[clamp(24px,4.8svh,64px)_24px_clamp(20px,3.2svh,28px)]"
        style={{
          position: "relative",
          flex: 1,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Le lockup Marssane est porté par la Nav du site (en tonalité encre sur
            cette page) : ici on ne garde que la date de mise à jour, calée à droite. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "24px" }}>
          <div style={{ fontFamily: MONO, fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "#7A828E", textAlign: "right" }}>
            Recommandation Marssane · {date}
          </div>
        </div>

        {/* Bloc central : texte à gauche, tuile logo dans la colonne de droite
            (centrée verticalement) ; sous 1100 px la tuile passe dessous. */}
        {/* La gouttière ne compte en vertical que sous 1100 px, tuile empilée :
            elle suit alors la hauteur de fenêtre comme le reste du rythme. */}
        <div className="grid items-center gap-[clamp(20px,min(4vw,3svh),64px)] min-[1100px]:grid-cols-[minmax(0,1fr)_344px]">
          <div>
            <div style={{ fontFamily: MONO, fontSize: "clamp(13px, 1.4vw, 20px)", textTransform: "uppercase", letterSpacing: "0.16em", color: "#98A1AC", marginBottom: "clamp(14px, 3svh, 30px)" }}>
              L&apos;IA à utiliser aujourd&apos;hui
            </div>
            {/* Plancher à 34 px (et non 48) : le nom du modèle vient d'une
                source externe, un libellé long comme « gpt-5.1-codex-max »
                débordait de la colonne à 320 px. `break-word` sert de garde-fou
                pour un token qui resterait plus large que la colonne. */}
            <h1 style={{ margin: 0, fontSize: "clamp(34px, 8.8vw, 126px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 0.94, color: "#FFFFFF", overflowWrap: "break-word" }}>
              {modele}
            </h1>
            {/* Effort absent de la source : on masque la ligne plutôt que d'afficher une valeur inventée. */}
            {effort ? (
              <div style={{ marginTop: "clamp(16px, 3.4svh, 34px)", fontFamily: MONO, fontWeight: 600, fontSize: "clamp(18px, 2.1vw, 30px)", textTransform: "uppercase", letterSpacing: "0.14em", color: TURQUOISE }}>
                Effort {EFFORTS[effort.toLowerCase()] ?? effort}
              </div>
            ) : null}
          </div>
          <TuileLogo modele={modele} editeur={editeur} pays={pays} />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-start", flexWrap: "wrap", gap: "32px", borderTop: "1px solid rgba(255,255,255,.14)", paddingTop: "clamp(14px, 2.6svh, 26px)" }}>
          {/* La gouttière ne compte en vertical que sur les petites largeurs,
              où la baseline passe sous le score : elle suit donc la hauteur de
              fenêtre comme le reste du rythme vertical. */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(20px, 4.4svh, 48px)", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "#7A828E", marginBottom: "10px" }}>
                Score global
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: "clamp(40px, 5.6svh, 56px)", letterSpacing: "-0.03em", lineHeight: 1, color: TURQUOISE }}>{score}</span>
                <span style={{ fontFamily: MONO, fontSize: "16px", color: "#6B7480" }}>/100</span>
              </div>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "18px", lineHeight: 1.55, color: "#C9CED6" }}>{baseline}</p>
          </div>
        </div>
      </div>

      {/* Amorce de scroll : bandeau encre + double chevron turquoise. */}
      <a
        href={ancre}
        aria-label="Voir le détail plus bas"
        className="h-[clamp(72px,10.4svh,104px)] shrink-0 max-[640px]:h-[clamp(64px,9svh,88px)]"
        style={{
          position: "relative",
          borderTop: "1px solid rgba(255,255,255,.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span aria-hidden style={{ position: "relative", display: "block", width: "52px", height: "52px" }}>
          <span style={{ position: "absolute", left: "11px", top: "6px", width: "30px", height: "30px", borderRight: `5px solid ${TURQUOISE}`, borderBottom: `5px solid ${TURQUOISE}`, transform: "rotate(45deg)" }} />
          <span style={{ position: "absolute", left: "11px", top: "24px", width: "30px", height: "30px", borderRight: "5px solid rgba(0,209,190,.4)", borderBottom: "5px solid rgba(0,209,190,.4)", transform: "rotate(45deg)" }} />
        </span>
      </a>
    </section>
  );
}
