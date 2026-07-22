import type { Metadata } from "next";
import { BadgeEcume } from "@/components/ui/BadgeEcume";
import { Button } from "@/components/ui/Button";
import { CheckItem } from "@/components/ui/CheckItem";
import { DrapeauFrance } from "@/components/ui/DrapeauFrance";
import { GridBackground } from "@/components/ui/GridBackground";
import { Kicker } from "@/components/ui/Kicker";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { PlusMark } from "@/components/ui/PlusMark";

export const metadata: Metadata = {
  title: "Styleguide · Marssane",
};

const palette: { name: string; hex: string }[] = [
  { name: "Toile", hex: "#EEF1F3" },
  { name: "Surface", hex: "#FFFFFF" },
  { name: "Lignes de grille", hex: "#E0E4E8" },
  { name: "Repères", hex: "#C4CBD2" },
  { name: "Encre", hex: "#0E0E12" },
  { name: "Canard · action", hex: "#0E7291" },
  { name: "Canard sombre · hover", hex: "#095B73" },
  { name: "Turquoise · flash", hex: "#00D1BE" },
  { name: "Lavande · data", hex: "#A88FEE" },
  { name: "Périwinkle · wash", hex: "#C7D2F7" },
  { name: "Écume · validation", hex: "#C7F7EF" },
  { name: "Clay · France", hex: "#C75A4D" },
];

const greys: { name: string; hex: string }[] = [
  { name: "Corps", hex: "#3C4654" },
  { name: "Muted", hex: "#4B5562" },
  { name: "Slate", hex: "#5B6472" },
  { name: "Soft · kicker", hex: "#6B7480" },
  { name: "Faint", hex: "#7A828E" },
  { name: "Quiet", hex: "#98A1AC" },
];

const inks: { name: string; hex: string }[] = [
  { name: "Sur écume", hex: "#006560" },
  { name: "Validé (charte)", hex: "#0E5A3C" },
  { name: "Sur clay", hex: "#8C3A30" },
  { name: "Sur lavande", hex: "#1B1442" },
  { name: "Fond de barre", hex: "#E6E9ED" },
];

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div>
      <div
        className="h-16 rounded-[10px] border border-hairline-strong"
        style={{ background: hex }}
      />
      <div className="mt-[7px] font-mono text-[11px] font-semibold text-ink">
        {hex}
      </div>
      <div className="text-[11px] text-faint">{name}</div>
    </div>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <Kicker>{index}</Kicker>
      <h2 className="mt-2.5 text-[26px] font-extrabold tracking-[-0.02em]">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

const card = "rounded-card border border-hairline bg-surface p-6 shadow-card";

export default function StyleguidePage() {
  return (
    <main className="toile-washes min-h-screen text-ink">
      <div className="mx-auto max-w-[1100px] px-10 py-14">
        <header>
          <Kicker>Marssane · recette interne · design system</Kicker>
          <h1 className="mt-3.5 text-[40px] font-extrabold leading-[1.06] tracking-[-0.025em]">
            Styleguide
          </h1>
          <p className="mt-4 max-w-[620px] text-[15.5px] leading-[1.58] text-muted">
            Page temporaire de recette : tokens, échelle typographique et
            composants primitifs, à comparer aux références.
          </p>
        </header>

        {/* ===== Couleurs ===== */}
        <Section index="01 · Couleurs" title="Palette & tokens">
          <div className={card}>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.15em] text-quiet">
              Palette
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {palette.map((c) => (
                <Swatch key={c.name} {...c} />
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className={card}>
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.15em] text-quiet">
                Textes secondaires
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {greys.map((c) => (
                  <Swatch key={c.name} {...c} />
                ))}
              </div>
            </div>
            <div className={card}>
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.15em] text-quiet">
                Encres sur pastels & barres
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {inks.map((c) => (
                  <Swatch key={c.name} {...c} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ===== Typographie ===== */}
        <Section index="02 · Typographie" title="Échelle">
          <div className={`${card} flex flex-col`}>
            <TypeRow spec="Display · 56 · 800 · -0.03em">
              <span className="text-[56px] font-extrabold leading-[1.02] tracking-[-0.03em]">
                Croissance mesurée.
              </span>
            </TypeRow>
            <TypeRow spec="H2 · 38 · 800 · -0.025em">
              <span className="text-[38px] font-extrabold leading-[1.08] tracking-[-0.025em]">
                Une formation IA sur des cas concrets
              </span>
            </TypeRow>
            <TypeRow spec="H3 · 32 · 800 · -0.02em">
              <span className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em]">
                Des gains que vous pouvez auditer
              </span>
            </TypeRow>
            <TypeRow spec="Lead · 18 · 400">
              <span className="text-[18px] leading-[1.5] text-body">
                Méthode cadrée, preuves réelles, décision humaine.
              </span>
            </TypeRow>
            <TypeRow spec="Corps · 16 · 400">
              <span className="text-[16px] leading-[1.6] text-body">
                Chaque déploiement est cadré, mesuré en heures gagnées, et validé
                par vos équipes avant d&apos;être généralisé.
              </span>
            </TypeRow>
            <TypeRow spec="Data · Spline Sans Mono · 500" last>
              <span className="font-mono text-[14px] font-medium">
                −5,5 h / dossier · 71 % → 91 % · 12/12
              </span>
            </TypeRow>
          </div>
        </Section>

        {/* ===== Boutons ===== */}
        <Section index="03 · Boutons" title="Actions">
          <div className={`${card} flex flex-wrap items-center gap-4`}>
            <Button variant="primary" href="#" arrow>
              Réserver ma place
            </Button>
            <Button variant="secondary" href="#" arrow>
              Parler de votre projet
            </Button>
            <Button variant="link" href="#" arrow>
              Voir le déroulé de la journée
            </Button>
            <Button variant="primary">Sans flèche</Button>
          </div>
          <p className="mt-3 font-mono text-[10.5px] text-quiet">
            rayon 3 · primaire : padding 15/27 + ombre CTA · hover primaire &amp;
            lien : canard sombre #095B73
          </p>
        </Section>

        {/* ===== Badges & états ===== */}
        <Section index="04 · Badges & états" title="Signaux">
          <div className="grid gap-5 md:grid-cols-2">
            <div className={`${card} flex flex-wrap items-start gap-3`}>
              <BadgeEcume>01 · Trier ses mails</BadgeEcume>
              <BadgeEcume>02 · Analyser &amp; résumer</BadgeEcume>
              <BadgeEcume>Triée</BadgeEcume>
            </div>
            <div className={`${card} flex flex-col gap-2.5`}>
              <CheckItem>Classé selon vos priorités, pas des règles génériques</CheckItem>
              <CheckItem>Rien n&apos;est supprimé : tout est rangé, retrouvable</CheckItem>
              <CheckItem>Construit par vous, pas à pas, pendant l&apos;atelier</CheckItem>
            </div>
          </div>
          <div className={`${card} mt-5`}>
            <div className="mb-1.5 flex justify-between text-[11.5px] text-faint">
              <span>Après</span>
              <span className="font-mono">2,5 h</span>
            </div>
            <div className="h-[7px] rounded-[4px] bg-bar-track">
              <div className="h-[7px] w-[31%] rounded-[4px] bg-canard" />
            </div>
          </div>
        </Section>

        {/* ===== Logo ===== */}
        <Section index="05 · Logo" title="Le cadre-repère">
          <div className={`${card} flex flex-wrap items-end gap-12`}>
            <div className="flex flex-col items-center gap-3">
              <LogoMarssane size={34} />
              <span className="font-mono text-[10.5px] text-quiet">34 px</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <LogoMarssane size={58} />
              <span className="font-mono text-[10.5px] text-quiet">58 px</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <LogoMarssane size={96} />
              <span className="font-mono text-[10.5px] text-quiet">96 px</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <LogoMarssane size={34} withWordmark />
              <span className="font-mono text-[10.5px] text-quiet">lockup</span>
            </div>
          </div>
        </Section>

        {/* ===== Drapeau ===== */}
        <Section index="06 · Rappel France" title="Le drapeau tonal">
          <div className={`${card} flex flex-wrap items-center gap-10`}>
            <DrapeauFrance />
            <DrapeauFrance height={20} />
          </div>
        </Section>

        {/* ===== Toile & repères ===== */}
        <Section index="07 · Toile" title="Grille & repères">
          <div className="relative h-[260px] overflow-hidden rounded-card border border-hairline bg-toile">
            <GridBackground mask="radial-gradient(72% 70% at 50% 45%, #000, transparent 78%)" />
            <PlusMark
              variant="turquoise"
              className="absolute left-[80px] top-[80px]"
            />
            <PlusMark className="absolute left-[240px] top-[48px]" />
            <PlusMark className="absolute left-[400px] top-[160px]" />
            <div className="absolute bottom-4 right-4 w-[170px] rounded-card border border-hairline bg-surface p-3 shadow-float">
              <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-quiet">
                gain / dossier
              </div>
              <div className="mt-1 font-mono text-[21px] font-semibold">
                −5,5 h
              </div>
            </div>
            <div className="absolute left-4 top-4 rounded-[8px] bg-white/85 px-2.5 py-1.5 font-mono text-[10px] text-muted">
              pas 80 px · ligne 1 px · masque radial
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}

function TypeRow({
  spec,
  last,
  children,
}: {
  spec: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-5 py-3.5 ${
        last ? "" : "border-b border-hairline"
      }`}
    >
      {children}
      <span className="whitespace-nowrap font-mono text-[10.5px] text-quiet">
        {spec}
      </span>
    </div>
  );
}
