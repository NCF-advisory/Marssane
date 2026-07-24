import { GridBackground } from "@/components/ui/GridBackground";
import { PlusMark } from "@/components/ui/PlusMark";
import { HeroMedia } from "./HeroMedia";
import { ReservationTrigger } from "./ReservationTrigger";

/**
 * Héro « formation » : bloc titre centré pleine largeur (H1, CTA),
 * vidéo pleine largeur (HeroMedia) sous le titre, puis bandeau chiffres. Fond
 * quadrillé masqué + décorations « motifFond » de la maquette.
 */
export function Hero() {
  return (
    <section className="relative isolate mx-auto max-w-[1260px] px-10 pb-10 pt-[96px]">
      <GridBackground
        className="-z-[1]"
        mask="linear-gradient(to bottom, #000 0 58%, transparent 94%)"
      />

      {/* Décorations motifFond (décoratives) — plus-marks d'encadrement du haut */}
      <PlusMark size={16} className="absolute left-14 top-11" />
      <PlusMark size={16} className="absolute right-[120px] top-5" />

      {/* Bloc titre centré, pleine largeur */}
      <div className="mx-auto max-w-[860px] text-center">
        <h1 className="text-[30px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[44px] lg:text-[60px]">
          Dirigeant de PME,
          <br className="hidden sm:block" />{" "}
          <span className="whitespace-nowrap">
            gagnez{" "}
            <span className="inline-block">
              <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
                2&nbsp;h par jour
                <span
                  aria-hidden
                  className="absolute right-[-0.62em] top-[-0.5em] text-[0.64em] font-medium leading-none text-turquoise"
                >
                  +
                </span>
              </span>
              .
            </span>
          </span>
        </h1>
        <div className="mt-[30px] flex flex-wrap items-center justify-center gap-4">
          <ReservationTrigger className="inline-flex items-center gap-2.5 rounded-btn bg-canard px-[27px] py-[15px] text-base font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark">
            Réserver ma place
            <span aria-hidden className="text-[1.1em] leading-none">
              →
            </span>
          </ReservationTrigger>
        </div>
      </div>

      {/* Vidéo pleine largeur sous le titre (bornée + centrée) */}
      <div className="mx-auto mt-9 max-w-[680px]">
        <HeroMedia />
      </div>

      {/* Bandeau chiffres — colonne empilée sous lg (séparateurs masqués),
          ligne répartie à partir de lg. */}
      <div className="mt-10 flex flex-col gap-4 rounded-card border border-hairline-strong bg-white/65 px-7 py-[18px] lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-5">
        <Stat value="2 demi-journées" label="à caler selon votre agenda" />
        <Separator />
        <Stat value="Petit groupe" label="chacun avance sur son cas" />
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
  return (
    <span aria-hidden className="hidden h-[26px] w-px bg-grid-line lg:block" />
  );
}
