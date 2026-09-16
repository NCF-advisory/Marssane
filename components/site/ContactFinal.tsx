import { ParcoursRendezVous } from "@/components/site/ParcoursRendezVous";
import { PlusMark } from "@/components/ui/PlusMark";

/** Carte de contact finale : même décor, le parcours de prise de rendez-vous
 * de la fenêtre « Parler de mon projet » rendu en ligne dans la page. */
export function ContactFinal() {
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
          hairline blanc suffit à la détacher du fond. Mesure et rembourrage de
          la fenêtre (680 px, px-5 py-7 / sm:px-10 sm:py-9) : ces derniers sont
          portés par le parcours lui-même, la carte n'en ajoute aucun. */}
      <div
        data-apparition=""
        className="relative mx-auto max-w-[680px] overflow-hidden rounded-card border border-line-sur-ink bg-surface-sur-ink"
      >
        {/* Masqués sous sm : le rembourrage resserré de la fenêtre (20/28 px)
            amène le « + » du coin sur le logo Marssane du parcours. */}
        <span className="absolute left-[26px] top-[22px] hidden font-mono text-[15px] leading-none text-line-sur-ink sm:block">
          +
        </span>
        <span className="absolute bottom-[22px] right-[26px] hidden font-mono text-[15px] leading-none text-line-sur-ink sm:block">
          +
        </span>

        <ParcoursRendezVous />
      </div>
    </section>
  );
}
