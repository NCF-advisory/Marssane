import { RendezVousTrigger } from "./RendezVousTrigger";
import { GridBackground } from "@/components/ui/GridBackground";
import { PlusMark } from "@/components/ui/PlusMark";
import { HeroMedia } from "./HeroMedia";
import { heroAgentsVideo } from "@/lib/site-config";

/**
 * Héro « implémentation » : colonne texte (H1, CTA) à gauche, vidéo (HeroMedia) à
 * droite, puis bandeau chiffres sous la grille. Fond quadrillé masqué +
 * décorations « motifFond » de la maquette.
 */
export function HeroAgents() {
  return (
    <section className="relative isolate mx-auto max-w-[1340px] px-6 pb-10 pt-[74px] sm:px-10">
      <GridBackground
        className="-z-[1]"
        mask="linear-gradient(to bottom, #000 0 58%, transparent 94%)"
      />

      {/* Décorations motifFond (décoratives) — plus-marks d'encadrement du haut */}
      <PlusMark variant="grey-sur-ink" size={16} className="absolute left-14 top-11" />
      <PlusMark variant="grey-sur-ink" size={16} className="absolute right-[120px] top-5" />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-8">
        {/* Colonne texte, alignée à gauche */}
        <div className="min-w-0 max-w-[460px]">
          <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[44px] lg:text-[36px] xl:text-[44px]">
            Dirigeant de PME,{" "}
            {/* Retour libre sur téléphone et petit ordinateur pour laisser
                davantage de place à la vidéo sans déborder du texte. */}
            <span className="sm:whitespace-nowrap lg:whitespace-normal xl:whitespace-nowrap">
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
            <RendezVousTrigger>
              Parler de mon projet
            </RendezVousTrigger>
          </div>
        </div>

        {/* Colonne média */}
        <HeroMedia video={heroAgentsVideo} />
      </div>

      {/* Accroche sous la grille (remplace l'ancien bandeau chiffres) : une
          seule phrase, en blanc et en grand. */}
      <p className="mt-16 text-center font-mono text-[26px] font-semibold leading-[1.35] text-white sm:text-[38px]">
        L&apos;implémentation IA qui augmente votre rentabilité
      </p>
    </section>
  );
}
