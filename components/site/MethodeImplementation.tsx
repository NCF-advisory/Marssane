import type { ReactNode } from "react";
import Image from "next/image";
import { ParcoursFondateurTrigger } from "./ParcoursFondateur";
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
    titre: "Diagnostic · votre semaine au crible",
    texte: "Avec vous, je repère ce qui prend du temps : mails, devis, relances, comptes rendus. Nous choisissons les tâches à automatiser en premier.",
    vignette: <VignetteDiagnostic />,
  },
  {
    repere: "01 → 02",
    titre: "Construction · sur vos outils",
    texte: "Je construis vos agents sur vos documents et votre boîte mail. Nous les testons ensemble, sur les situations de votre quotidien.",
    vignette: <VignetteConstruction />,
  },
  {
    repere: "02",
    titre: "La suite · selon vos besoins",
    texte: "Vous choisissez : une passation accompagnée pour votre équipe, ou une maintenance confiée à Marssane pour le suivi technique et les ajustements convenus.",
    vignette: <VignetteReseau />,
  },
];

/**
 * Les trois temps de la mission : diagnostic, construction, accompagnement.
 * Gabarit de l'accompagnement : trois cartes et vignettes révélées en cascade.
 */
export function MethodeImplementation() {
  return (
    <section id="formateur" className="relative isolate mx-auto max-w-[1180px] scroll-mt-8 px-6 pb-2 pt-[84px] sm:px-10">
      {/* Décoration motifFond (décorative) */}
      <PlusMark
        variant="grey-sur-ink"
        size={16}
        className="absolute right-[130px] top-[62px] hidden lg:block"
      />

      <div className="max-w-[680px]">
        <KickerPill>De l&apos;audit au système qui tourne</KickerPill>
        <h2 className="mt-[20px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Nous construisons, vous gardez{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            la main
          </span>
          .
        </h2>
        <div className="mt-6 flex items-start gap-4">
          <Image
            src="/img/formateur/cleante.jpg"
            alt="Cléante Oullion"
            width={64}
            height={64}
            sizes="64px"
            className="h-16 w-16 shrink-0 rounded-full border border-line-sur-ink object-cover"
          />
          <div className="min-w-0">
            <p className="text-[16px] leading-[1.6] text-body-sur-ink">
              Je conçois vos automatisations avec vous, à partir de votre quotidien.
              Du premier diagnostic à la prise en main, je suis votre interlocuteur.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-body-sur-ink">
              <span><strong className="font-semibold text-ink">Cléante Oullion</strong> · Fondateur</span>
              <ParcoursFondateurTrigger className="text-canard" />
            </div>
          </div>
        </div>
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

/** Vignette 1 — les tâches de votre semaine à automatiser. */
function VignetteDiagnostic() {
  return (
    <>
      <div className="w-[248px] max-w-full rounded-card border border-hairline bg-surface shadow-card">
        <div className="flex items-center gap-2.5 px-3.5 py-3">
          <AvatarM size={34} logo={17} />
          <div className="text-[12.5px] font-bold leading-[1.25] text-ink">
            Votre semaine
          </div>
        </div>
        <div className="flex flex-col gap-1.5 border-t border-hairline px-3.5 py-2.5">
          {["mails · 45 min/j", "relances · vendredi soir", "CR · jamais faits"].map((tache) => (
            <span key={tache} className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-slate">
              <span className="flex h-[13px] w-[13px] flex-none items-center justify-center rounded-chip border border-repere text-canard">✓</span>
              {tache}
            </span>
          ))}
        </div>
      </div>
      <PillPoint>à automatiser en premier</PillPoint>
    </>
  );
}

/**
 * Vignette 2 — vos outils, l’agent, puis votre validation.
 * Transposition du flow de diagnostic de 8lab (logo · téléphone · VOUS).
 */
function VignetteConstruction() {
  return (
    <>
      <span className="rounded-full border border-hairline bg-surface px-3 py-[5px] text-[11px] font-semibold text-ink shadow-card">
        Vos outils
      </span>
      <div className="flex items-center">
        <span className="rounded-full border border-hairline bg-surface px-2.5 py-2 font-mono text-[9.5px] text-slate shadow-card">boîte mail</span>
        <Pointille />
        <span className="flex h-[32px] flex-none items-center justify-center rounded-full border border-hairline bg-surface px-2.5 font-mono text-[9.5px] text-slate shadow-card">
          agent
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
          Testé sur vos dossiers
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-1 text-[10.5px] font-semibold text-faint">
          <span className="h-[13px] w-[13px] flex-none rounded-full border border-repere" />
          Ajusté avec vous
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
