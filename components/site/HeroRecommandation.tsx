/**
 * Hero « Quelle IA utiliser aujourd'hui ? » — direction 1d (hero inversé).
 * À déposer dans components/site/HeroRecommandation.tsx puis :
 *   import { HeroRecommandation } from "@/components/site/HeroRecommandation";
 *   <HeroRecommandation modele="Claude Opus 5" effort="medium" score="92,4"
 *                       cout="≈ 21 €/M tokens" date="27 juillet 2026" />
 *
 * Dépendances : aucune (styles en ligne). Polices déjà chargées par le site
 * (Plus Jakarta Sans / Spline Sans Mono). Le logo réutilise votre composant
 * existant LogoMarssane — ajustez le chemin d'import ci-dessous.
 *
 * Écran unique en fond encre : pas de dark mode ailleurs sur le site, la
 * section suivante repart sur la toile claire.
 */
import React from "react";
import { LogoMarssane } from "@/components/ui/LogoMarssane";

const INK = "#0E0E12";
const TURQUOISE = "#00D1BE";
const MONO = 'var(--font-mono, "Spline Sans Mono", ui-monospace, monospace)';
const SANS = 'var(--font-sans, "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif)';

type Props = {
  modele?: string;
  effort?: string;
  score?: string;
  cout?: string;
  date?: string;
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

export function HeroRecommandation({
  modele = "Claude Opus 5",
  effort = "medium",
  score = "92,4",
  cout = "≈ 21 €/M tokens",
  date = "27 juillet 2026",
  baseline = "Le meilleur compromis intelligence / prix du moment.",
  ancre = "#pourquoi",
}: Props) {
  return (
    <section
      style={{
        position: "relative",
        background: INK,
        overflow: "hidden",
        fontFamily: SANS,
        minHeight: "min(900px, 100vh)",
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

      <div
        style={{
          position: "relative",
          flex: 1,
          boxSizing: "border-box",
          padding: "64px clamp(24px, 6.6vw, 96px) 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
          {/* Le M du logo suit --color-ink : on le repasse en blanc localement. */}
          <span style={{ ["--color-ink" as string]: "#FFFFFF", display: "inline-flex" }}>
            <LogoMarssane size={30} withWordmark />
          </span>
          <div style={{ fontFamily: MONO, fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "#7A828E" }}>
            Recommandation Marssane · {date}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: MONO, fontSize: "clamp(13px, 1.4vw, 20px)", textTransform: "uppercase", letterSpacing: "0.16em", color: "#98A1AC", marginBottom: "30px" }}>
            L&apos;IA à utiliser aujourd&apos;hui
          </div>
          <h1 style={{ margin: 0, fontSize: "clamp(48px, 8.8vw, 126px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 0.94, color: "#FFFFFF" }}>
            {modele}
          </h1>
          {/* Effort absent de la source : on masque la ligne plutôt que d'afficher une valeur inventée. */}
          {effort ? (
            <div style={{ marginTop: "34px", fontFamily: MONO, fontWeight: 600, fontSize: "clamp(18px, 2.1vw, 30px)", textTransform: "uppercase", letterSpacing: "0.14em", color: TURQUOISE }}>
              Effort {effort}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "32px", borderTop: "1px solid rgba(255,255,255,.14)", paddingTop: "26px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "#7A828E", marginBottom: "10px" }}>
                Score global
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: "56px", letterSpacing: "-0.03em", lineHeight: 1, color: TURQUOISE }}>{score}</span>
                <span style={{ fontFamily: MONO, fontSize: "16px", color: "#6B7480" }}>/100</span>
              </div>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "18px", lineHeight: 1.55, color: "#C9CED6" }}>{baseline}</p>
          </div>
          <div style={{ fontFamily: MONO, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#7A828E" }}>
            {cout}
          </div>
        </div>
      </div>

      {/* Amorce de scroll : bandeau encre + double chevron turquoise. */}
      <a
        href={ancre}
        aria-label="Voir le détail plus bas"
        style={{
          position: "relative",
          height: "104px",
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
