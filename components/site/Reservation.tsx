import { Chevron } from "@/components/ui/Chevron";
import { PlusMark } from "@/components/ui/PlusMark";
import { ReservationTrigger } from "./ReservationTrigger";

/**
 * Section « Réservation » (ancre #contact) : carte « CTA final » de la maquette
 * (coins « + », titre surligné canard). Le bouton « Réserver ma place » ouvre la
 * modale de pré-inscription (<ReservationDialog>). Décorations motifFond masquées
 * sous lg.
 */
export function Reservation() {
  return (
    <section
      id="contact"
      className="relative isolate mx-auto max-w-[1180px] px-6 pb-[90px] pt-[100px] sm:px-10"
    >
      {/* Décorations motifFond (décoratives) */}
      <span
        aria-hidden
        className="absolute left-[619.25px] top-0 -z-[1] hidden h-[74px] w-[1.5px] bg-line-sur-ink lg:block"
      />
      <PlusMark
        variant="turquoise"
        size={25}
        className="absolute left-[620px] top-[88px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />

      {/* Carte encre : pas d'ombre portée (invisible sur l'encre), le cadre
          hairline blanc suffit à la détacher du fond. */}
      <div
        data-apparition=""
        className="relative overflow-hidden rounded-card border border-line-sur-ink bg-surface-sur-ink px-6 py-12 text-center sm:px-10 sm:py-14"
      >
        <span className="absolute left-[26px] top-[22px] font-mono text-[15px] leading-none text-line-sur-ink">
          +
        </span>
        <span className="absolute bottom-[22px] right-[26px] font-mono text-[15px] leading-none text-line-sur-ink">
          +
        </span>

        {/* Palier mobile à 26 px et retour à la ligne forcé seulement à partir
            de sm : dans les ~192 px de large qui restaient à 320 px, le titre
            en 32 px se hachait sur sept lignes de deux ou trois mots. */}
        <h2 className="text-[26px] font-extrabold leading-[1.06] tracking-[-0.028em] sm:text-[32px] md:text-[42px]">
          Réservez votre place pour{" "}
          <br className="hidden sm:inline" />
          <span className="inline-block">
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              la prochaine session
              <span
                aria-hidden
                className="absolute right-[-0.62em] top-[-0.5em] text-[0.64em] font-medium leading-none text-turquoise"
              >
                +
              </span>
            </span>
            .
          </span>
        </h2>
        <p className="mx-auto mt-[18px] max-w-[460px] text-[16.5px] leading-[1.55] text-body-sur-ink">
          Deux demi-journées à caler selon votre agenda : vous repartez plus
          productif, avec des heures gagnées chaque semaine.
        </p>

        <ReservationTrigger className="mt-7 inline-flex items-center gap-[13px] rounded-btn bg-canard py-[15px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-white shadow-cta transition-[background-color] duration-[180ms] ease-out hover:bg-canard-dark">
          Réserver ma place
          <Chevron />
        </ReservationTrigger>

        {/* Mention neutre, jamais la date ni le compteur de places : côté
            public, le site n'annonce pas de session datée. */}
        <div className="mt-4 text-[13px] text-faint-sur-ink">
          Petits groupes · pré-inscription sans engagement · réponse rapide.
        </div>
      </div>
    </section>
  );
}
