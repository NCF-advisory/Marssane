import { Button } from "@/components/ui/Button";
import { CheckItem } from "@/components/ui/CheckItem";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/** Barres du mini-reporting : hauteur (% de 52 px) et couleur de la charte. */
const BARRES: { h: string; color: string }[] = [
  { h: "38%", color: "var(--color-periwinkle)" },
  { h: "52%", color: "var(--color-periwinkle)" },
  { h: "46%", color: "var(--color-lavande)" },
  { h: "64%", color: "var(--color-lavande)" },
  { h: "58%", color: "var(--color-canard)" },
  { h: "80%", color: "var(--color-canard)" },
  { h: "100%", color: "var(--color-turquoise)" },
];

/** Lignes horodatées du journal d'audit. */
const JOURNAL: { texte: string; heure: string }[] = [
  { texte: "Brouillon généré", heure: "09:12" },
  { texte: "Relu et modifié par votre équipe", heure: "09:14" },
  { texte: "Validé & envoyé", heure: "09:15" },
];

/**
 * Section « Aller plus loin — implémentation » (ancre #implementation).
 * Grille visuel gauche (cartes reporting + journal d'audit) / texte droite ;
 * le CTA « Parler de votre projet » mène à la page dédiée /implementation.
 * Fond quadrillé masqué + décorations motifFond masqués sous lg.
 */
export function AllerPlusLoin() {
  return (
    <section
      id="implementation"
      className="relative isolate mx-auto max-w-[1180px] px-10 pb-5 pt-[96px]"
    >
      {/* Fond quadrillé masqué radial (décoratif) */}
      <div
        aria-hidden
        className="grid-toile -z-[1] hidden lg:block"
        style={{
          inset: "auto",
          left: 0,
          top: "80px",
          width: "560px",
          height: "440px",
          WebkitMaskImage:
            "radial-gradient(70% 70% at 45% 45%, #000, transparent 78%)",
          maskImage: "radial-gradient(70% 70% at 45% 45%, #000, transparent 78%)",
        }}
      />

      {/* Décorations motifFond (décoratives) */}
      <span
        aria-hidden
        className="absolute left-[778.25px] top-0 -z-[1] hidden h-[48px] w-[1.5px] bg-repere lg:block"
      />
      <span
        aria-hidden
        className="absolute left-[631px] top-[47.25px] -z-[1] hidden h-[1.5px] w-[148px] lg:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,#C4CBD2 0 8px,rgba(196,203,210,0) 8px 15px)",
        }}
      />
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[620px] top-[48px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-[619.25px] top-[59px] -z-[1] hidden w-[1.5px] bg-repere lg:block"
      />
      <PlusMark
        size={16}
        className="absolute left-[70px] top-[70px] hidden lg:block"
      />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        {/* Visuel : reporting + journal d'audit — décoratif (aria-hidden) doublé
            d'un texte sr-only ; empilé en flux sous lg, positions absolues
            restaurées à partir de lg (comme les 3 cas concrets). */}
        <div className="relative">
          <span className="sr-only">
            Illustration : un reporting mensuel et un journal d&apos;audit
            horodaté.
          </span>
          <div
            aria-hidden
            className="relative flex flex-col items-center gap-6 lg:block lg:h-[420px]"
          >
          {/* Carte « Reporting · 30 jours » */}
          <div
            className="w-[262px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface lg:absolute lg:left-0 lg:top-0 lg:z-[2]"
            style={{ boxShadow: "0 24px 50px -18px rgba(16,24,40,.26)" }}
          >
            <div
              className="flex items-center justify-between px-[15px] py-[11px]"
              style={{ background: "linear-gradient(120deg,#A88FEE,#C7D2F7)" }}
            >
              <span className="text-[12px] font-semibold text-ink-periwinkle">
                Reporting · 30 jours
              </span>
              <span className="rounded-chip bg-white/50 px-2 py-[3px] text-[10px] text-ink-periwinkle">
                équipe
              </span>
            </div>
            <div className="px-[15px] py-[14px]">
              <div className="flex h-[52px] items-end gap-1.5">
                {BARRES.map((barre, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-[3px_3px_0_0]"
                    style={{ height: barre.h, background: barre.color }}
                  />
                ))}
              </div>
              <div className="mt-[11px] text-[12px] text-faint">
                Le gain du mois, lu dans votre reporting, pas dans nos slides.
              </div>
            </div>
          </div>

          {/* Carte « Journal d'audit » */}
          <div
            className="w-[286px] max-w-full rounded-card border border-hairline bg-surface p-[18px] lg:absolute lg:bottom-4 lg:right-[10px] lg:z-[3]"
            style={{ boxShadow: "0 28px 56px -18px rgba(16,24,40,.3)" }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-quiet">
              Journal d&apos;audit · ce que vous verrez chez vous
            </div>
            <div className="mt-[13px] flex flex-col gap-2.5 text-[12.5px]">
              {JOURNAL.map((ligne) => (
                <div key={ligne.heure} className="flex justify-between gap-2.5">
                  <span className="text-body">{ligne.texte}</span>
                  <span className="font-mono text-faint">{ligne.heure}</span>
                </div>
              ))}
              <div className="flex justify-between gap-2.5 border-t border-hairline-strong pt-2.5">
                <span className="font-semibold">Chaque action</span>
                <span className="font-mono font-semibold text-ink-ecume">
                  tracée
                </span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Texte */}
        <div className="max-w-[450px] lg:justify-self-end">
          <Kicker>Aller plus loin · implémentation</Kicker>
          <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
            Vous voyez le potentiel ? Nous venons l&apos;installer{" "}
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              chez vous
            </span>
            .
          </h2>
          <p className="mt-[18px] text-[16.5px] leading-[1.58] text-body">
            Vous êtes formé, vous voyez ce que l&apos;IA sait faire. L&apos;étape
            suivante : nous l&apos;installons dans votre entreprise, sur vos
            données, avec vos équipes — gain mesuré chaque mois.
          </p>
          <div className="mt-[22px] flex flex-col gap-2.5">
            <CheckItem>Construit sur vos dossiers réels, avec vos équipes</CheckItem>
            <CheckItem>
              L&apos;agent propose, l&apos;humain valide : chaque flux est tracé
            </CheckItem>
            <CheckItem>Chaque mois, le gain se lit dans votre reporting</CheckItem>
          </div>
          <Button
            variant="secondary"
            href="/implementation"
            arrow
            className="mt-[26px]"
          >
            Parler de votre projet
          </Button>
        </div>
      </div>
    </section>
  );
}
