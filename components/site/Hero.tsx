import { GridBackground } from "@/components/ui/GridBackground";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";
import { HeroMedia } from "./HeroMedia";
import { ReservationTrigger } from "./ReservationTrigger";

/**
 * Héro « formation » : colonne texte (kicker, H1, sous-titre, CTA),
 * média à droite (HeroMedia) et bandeau chiffres sous la grille. Fond quadrillé
 * masqué + décorations « motifFond » de la maquette.
 */
export function Hero() {
  return (
    <section className="relative isolate mx-auto max-w-[1260px] px-10 pb-10 pt-[74px]">
      <GridBackground
        className="-z-[1]"
        mask="linear-gradient(to bottom, #000 0 58%, transparent 94%)"
      />

      {/* Décorations motifFond (décoratives) */}
      <PlusMark
        variant="turquoise"
        size={21}
        className="absolute left-4 top-[90px] -z-[1] -translate-x-1/2 -translate-y-1/2"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-[15.25px] top-[103px] -z-[1] w-[1.5px] bg-repere"
      />
      <PlusMark size={16} className="absolute left-14 top-11" />
      <PlusMark size={16} className="absolute right-[120px] top-5" />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.2fr]">
        <div className="max-w-[530px]">
          <Kicker>
            Formation IA · dirigeants de PME et TPE
          </Kicker>
          <h1 className="mt-[18px] text-[36px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[44px] lg:text-[54px]">
            Une formation IA sur des{" "}
            <span className="inline-block">
              <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
                cas concrets
                <span
                  aria-hidden
                  className="absolute right-[-0.62em] top-[-0.5em] text-[0.64em] font-medium leading-none text-turquoise"
                >
                  +
                </span>
              </span>
              .
            </span>
          </h1>
          <p className="mt-[22px] max-w-[490px] text-[18px] leading-[1.55] text-body">
            Trier vos mails, recevoir chaque matin le compte rendu des urgences,
            automatiser vos propres tâches : deux demi-journées, chacun sur son
            ordinateur. Vous repartez avec un système qui tourne.
          </p>
          <div className="mt-[30px] flex flex-wrap items-center gap-4">
            <ReservationTrigger className="inline-flex items-center gap-2.5 rounded-btn bg-canard px-[27px] py-[15px] text-base font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark">
              Réserver ma place
              <span aria-hidden className="text-[1.1em] leading-none">
                →
              </span>
            </ReservationTrigger>
          </div>
        </div>

        <HeroMedia />
      </div>

      {/* Bandeau chiffres — colonne empilée sous lg (séparateurs masqués),
          ligne répartie à partir de lg. */}
      <div className="mt-16 flex flex-col gap-4 rounded-card border border-hairline-strong bg-white/65 px-7 py-[18px] lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-5">
        <Stat value="8 h 45" label="2 demi-journées, la même semaine" />
        <Separator />
        <Stat value="10 places" label="maximum par session" />
        <Separator />
        <Stat value="2 projets" label="le cas général, puis le vôtre" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[22px] font-semibold text-ink-ecume">
        {value}
      </span>
      <span className="text-[12.5px] text-soft">{label}</span>
    </div>
  );
}

function Separator() {
  return <span aria-hidden className="hidden h-[26px] w-px bg-grid-line lg:block" />;
}
