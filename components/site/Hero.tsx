import { Chevron } from "@/components/ui/Chevron";
import { GridBackground } from "@/components/ui/GridBackground";
import { PlusMark } from "@/components/ui/PlusMark";
import { HeroMedia } from "./HeroMedia";
import { ReservationTrigger } from "./ReservationTrigger";

/**
 * Héro « formation » : colonne texte (H1, CTA) à gauche, vidéo (HeroMedia) à
 * droite, puis bandeau chiffres sous la grille. Fond quadrillé masqué +
 * décorations « motifFond » de la maquette.
 */
export function Hero() {
  return (
    <section className="relative isolate mx-auto max-w-[1260px] px-6 pb-10 pt-[74px] sm:px-10">
      <GridBackground
        className="-z-[1]"
        mask="linear-gradient(to bottom, #000 0 58%, transparent 94%)"
      />

      {/* Décorations motifFond (décoratives) — plus-marks d'encadrement du haut */}
      <PlusMark variant="grey-sur-ink" size={16} className="absolute left-14 top-11" />
      <PlusMark variant="grey-sur-ink" size={16} className="absolute right-[120px] top-5" />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.2fr]">
        {/* Colonne texte, alignée à gauche */}
        <div className="max-w-[530px]">
          <h1 className="text-[30px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[44px] lg:text-[54px]">
            Dirigeant de PME,{" "}
            {/* L'insécabilité ne vaut qu'à partir de sm : à 320-360 px, les
                281 px de « gagnez 2 h par jour. » dépassaient la colonne et le
                « + » turquoise comme le point étaient rognés. */}
            <span className="sm:whitespace-nowrap">
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
          <div className="mt-[30px] flex flex-wrap items-center gap-4">
            <ReservationTrigger className="inline-flex items-center gap-[13px] rounded-btn bg-canard py-[15px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-white shadow-cta transition-[background-color] duration-[180ms] ease-out hover:bg-canard-dark">
              Réserver ma place
              <Chevron />
            </ReservationTrigger>
          </div>
        </div>

        {/* Colonne média */}
        <HeroMedia />
      </div>

      {/* Accroche sous la grille (remplace l'ancien bandeau chiffres) : une
          seule phrase, en blanc et en grand. */}
      <p className="mt-16 text-center font-mono text-[26px] font-semibold leading-[1.35] text-white sm:text-[38px]">
        La formation IA pensée pour votre quotidien de dirigeant.
      </p>
    </section>
  );
}
