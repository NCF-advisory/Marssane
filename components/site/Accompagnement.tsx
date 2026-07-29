import type { ReactNode } from "react";
import { KickerPill } from "@/components/ui/KickerPill";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { PlusMark } from "@/components/ui/PlusMark";

/** Les trois temps de l'accompagnement, dans l'ordre où ils se vivent. */
const TEMPS: {
  repere: string;
  titre: string;
  texte: string;
  vignette: ReactNode;
}[] = [
  {
    repere: "01",
    titre: "Session 1 · Général",
    texte: "Vous apprenez les bases : contexte, prompt, modèles.",
    vignette: <VignetteFormateur />,
  },
  {
    repere: "01 → 02",
    titre: "Entre les deux · à votre rythme",
    texte: "Un chat ouvert sur lequel vous pouvez poser vos questions.",
    vignette: <VignetteEntreDeux />,
  },
  {
    repere: "02",
    titre: "Session 2 · votre cas",
    texte: "Chacun construit sur son cas personnalisé : automatisation, skill, MCP.",
    vignette: <VignetteReseau />,
  },
];

/**
 * Section « L'accompagnement » : les trois temps de la formation présentés non
 * comme un programme mais comme une présence continue — on ne vous laisse à
 * aucun moment seul devant l'outil. Trois cartes (une colonne sous lg, trois à
 * partir de lg) révélées en cascade, chacune ouverte par une vignette
 * illustrative en fausse UI — même famille que la composition du héro et les
 * visuels de repli des cas concrets (cartes blanches, ombres douces, mono).
 * Modèle : les trois cartes « one-one » de 8lab (vignette en moitié haute,
 * titre court, une ligne de texte).
 */
export function Accompagnement() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      {/* Décoration motifFond (décorative) */}
      <PlusMark
        variant="grey-sur-ink"
        size={16}
        className="absolute right-[130px] top-[62px] hidden lg:block"
      />

      <div className="max-w-[680px]">
        <KickerPill>Vous n&apos;êtes jamais seul</KickerPill>
        <h2 className="mt-[20px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Vous construisez, le formateur{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            valide
          </span>{" "}
          chaque étape.
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body-sur-ink">
          Deux sessions en salle. Entre les deux, le chat commun reste ouvert.
        </p>
      </div>

      <ol className="mt-[34px] grid grid-cols-1 gap-[22px] lg:grid-cols-3">
        {TEMPS.map((temps, i) => (
          <li
            key={temps.repere}
            data-apparition=""
            style={{ ["--apparition-delai" as string]: `${i * 150}ms` }}
            className="flex flex-col overflow-hidden rounded-card border border-line-sur-ink bg-surface-sur-ink"
          >
            {/* Vignette décorative : le titre et la ligne de texte en dessous
                portent l'information. Fond toile dans la carte blanche, comme
                la zone d'asset des cartes 8lab. */}
            <div
              aria-hidden
              className="flex h-[212px] flex-none flex-col items-center justify-center gap-3 overflow-hidden bg-toile px-4"
            >
              {temps.vignette}
            </div>
            <div className="flex flex-1 flex-col p-6">
              {/* Le canard manque de contraste sur l'encre : repères en turquoise. */}
              <div className="font-mono text-[11px] font-semibold text-turquoise">
                {temps.repere}
              </div>
              <h3 className="mt-[10px] text-[17px] font-bold leading-[1.35] tracking-[-0.01em]">
                {temps.titre}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.55] text-body-sur-ink">
                {temps.texte}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* =========================== Vignettes fausse UI ==========================
   Idiome maison (HeroMedia, visuels de repli des cas concrets) : cartes
   blanches sur hairline, ombres douces, mono pour les labels, pastilles.
   Palette de la toile claire directement — ces vignettes sont claires par
   construction, comme les assets de 8lab. */

/** Avatar rond au monogramme : tuile encre, « M » repassé en blanc.
 *  La surcharge de token est portée par un span intérieur et non par la
 *  tuile, dont le fond `bg-ink` lit ce même token (cf. Formateur). */
function AvatarM({ size, logo }: { size: number; logo: number }) {
  return (
    <span
      className="flex flex-none items-center justify-center rounded-full bg-ink"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <span
        className="inline-flex"
        style={{ ["--color-ink" as string]: "#FFFFFF" }}
      >
        <LogoMarssane size={logo} />
      </span>
    </span>
  );
}

/** Pastille de synthèse sous les vignettes : point canard + libellé. */
function PillPoint({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-[6px] text-[11px] font-semibold text-body shadow-card">
      <span className="h-[6px] w-[6px] flex-none rounded-full bg-canard" />
      {children}
    </span>
  );
}

/**
 * Vignette 1 — le widget « Votre formateur » : avatar au monogramme, rangée
 * du groupe (initiales) et pastille « petit groupe · chacun sur son cas ».
 * Transposition du widget de chat « Votre coach : Théo » de 8lab.
 */
function VignetteFormateur() {
  const groupe: { initiales: string; bg: string; text: string }[] = [
    { initiales: "JD", bg: "var(--color-periwinkle)", text: "var(--color-ink-periwinkle)" },
    { initiales: "ML", bg: "var(--color-ecume)", text: "var(--color-ink-ecume)" },
    { initiales: "PA", bg: "var(--color-lavande)", text: "var(--color-ink-periwinkle)" },
    { initiales: "SC", bg: "var(--color-bar-track)", text: "var(--color-slate)" },
    { initiales: "RB", bg: "var(--color-ecume)", text: "var(--color-ink-ecume)" },
  ];
  return (
    <>
      <div className="w-[248px] max-w-full rounded-card border border-hairline bg-surface shadow-card">
        <div className="flex items-center gap-2.5 px-3.5 py-3">
          <AvatarM size={34} logo={17} />
          <div className="min-w-0">
            <div className="text-[12.5px] font-bold leading-[1.25] text-ink">
              Votre formateur
            </div>
            <div className="text-[10.5px] leading-[1.35] text-faint">
              construit avec vous, en salle
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-hairline px-3.5 py-2.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
            Le groupe
          </span>
          <span className="flex">
            {groupe.map((p, i) => (
              <span
                key={p.initiales}
                className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-surface text-[7.5px] font-bold"
                style={{
                  backgroundColor: p.bg,
                  color: p.text,
                  marginLeft: i > 0 ? "-5px" : 0,
                }}
              >
                {p.initiales}
              </span>
            ))}
          </span>
        </div>
      </div>
      <PillPoint>petit groupe · chacun sur son cas</PillPoint>
    </>
  );
}

/**
 * Vignette 2 — le fil entre les deux sessions : carte « Le chat commun »,
 * flow M ↔ bulle ↔ « VOUS », puis la checklist du travail à distance.
 * Transposition du flow de diagnostic de 8lab (logo · téléphone · VOUS).
 */
function VignetteEntreDeux() {
  return (
    <>
      <span className="rounded-full border border-hairline bg-surface px-3 py-[5px] text-[11px] font-semibold text-ink shadow-card">
        Le chat commun
      </span>
      <div className="flex items-center">
        <AvatarM size={38} logo={19} />
        <Pointille />
        <span className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-full border border-hairline bg-surface text-slate shadow-card">
          <BulleChat />
        </span>
        <Pointille />
        <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-canard text-[8.5px] font-bold tracking-[0.04em] text-white shadow-cta">
          VOUS
        </span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-1 text-[10.5px] font-semibold text-ink shadow-card">
          <span className="flex h-[13px] w-[13px] flex-none items-center justify-center rounded-full bg-ink text-[7.5px] font-bold text-white">
            ✓
          </span>
          Transposé sur votre boîte
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-1 text-[10.5px] font-semibold text-faint">
          <span className="h-[13px] w-[13px] flex-none rounded-full border border-repere" />
          FAQ groupée à mi-parcours
        </span>
      </div>
    </>
  );
}

/** Connecteur horizontal en pointillés entre deux pastilles du flow. */
function Pointille() {
  return (
    <span
      className="h-[1.5px] w-[22px] flex-none"
      style={{
        background:
          "repeating-linear-gradient(90deg,#C4CBD2 0 4px,rgba(196,203,210,0) 4px 8px)",
      }}
    />
  );
}

/** Bulle de chat minimale (SVG inline, décoratif). */
function BulleChat() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 2.8C2 2.1 2.6 1.5 3.3 1.5h7.4c.7 0 1.3.6 1.3 1.3v5.4c0 .7-.6 1.3-1.3 1.3H6.2L3.4 12V9.5h-.1C2.6 9.5 2 8.9 2 8.2V2.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Vignette 3 — le mini-réseau de la session 2 : les nœuds du quotidien
 * (mails · devis · relances) reliés en pointillés au monogramme central.
 * Transposition du diagramme réseau de 8lab (constellation autour du logo).
 */
function VignetteReseau() {
  // Coordonnées (viewBox 248 × 132) partagées entre les traits SVG et les
  // nœuds HTML positionnés en % au-dessus.
  const C = { x: 124, y: 64 };
  const noeuds = [
    { x: 40, y: 24, label: "mails" },
    { x: 210, y: 28, label: "devis" },
    { x: 56, y: 106, label: "relances" },
    { x: 196, y: 100 },
    { x: 124, y: 12 },
    { x: 18, y: 64 },
  ];
  return (
    <>
      <div className="relative h-[132px] w-[248px] max-w-full">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 248 132"
          fill="none"
          aria-hidden
        >
          {noeuds.map((n) => (
            <line
              key={`${n.x}-${n.y}`}
              x1={C.x}
              y1={C.y}
              x2={n.x}
              y2={n.y}
              stroke="#C4CBD2"
              strokeWidth="1.3"
              strokeDasharray="3 5"
            />
          ))}
          {/* Deux liaisons périphériques, comme le circuit du modèle. */}
          <line x1={40} y1={24} x2={124} y2={12} stroke="#C4CBD2" strokeWidth="1.3" strokeDasharray="3 5" />
          <line x1={196} y1={100} x2={210} y2={28} stroke="#C4CBD2" strokeWidth="1.3" strokeDasharray="3 5" />
        </svg>
        {noeuds.map((n) =>
          n.label ? (
            <span
              key={n.label}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-hairline bg-surface px-2 py-[3px] font-mono text-[9.5px] text-slate shadow-card"
              style={{ left: `${(n.x / 248) * 100}%`, top: `${(n.y / 132) * 100}%` }}
            >
              {n.label}
            </span>
          ) : (
            <span
              key={`${n.x}-${n.y}`}
              className="absolute h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-repere bg-surface"
              style={{ left: `${(n.x / 248) * 100}%`, top: `${(n.y / 132) * 100}%` }}
            />
          ),
        )}
        <span
          className="absolute flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface shadow-float"
          style={{ left: "50%", top: `${(C.y / 132) * 100}%` }}
        >
          <LogoMarssane size={22} />
        </span>
      </div>
      <PillPoint>votre système démarre</PillPoint>
    </>
  );
}
