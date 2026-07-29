import Link from "next/link";
import { CheckItem } from "@/components/ui/CheckItem";
import { Chevron } from "@/components/ui/Chevron";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";
import { NIVEAUX } from "@/lib/niveaux";
import { ReservationTrigger } from "./ReservationTrigger";

/**
 * Section « Les formations » (ancre #formation, cible des liens « Voir le
 * programme » de la nav, des cas concrets et de l'avant / après) : l'escalier
 * des trois niveaux, une carte chacun. Données prises dans NIVEAUX
 * (@/lib/niveaux, partagé avec /formations).
 *
 * Le niveau 01 est le seul ouvert à la réservation : sa carte porte le CTA
 * canard qui ouvre la modale de pré-inscription. Les niveaux 02 et 03, encore
 * à venir, renvoient à leur écran de détail sur /formations.
 */
export function OffresNiveaux() {
  return (
    <section
      id="formation"
      className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[96px] sm:px-10"
    >
      {/* Décorations motifFond (décoratives) */}
      <PlusMark
        variant="grey-sur-ink"
        size={16}
        className="absolute left-[70px] top-[74px] hidden lg:block"
      />
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute right-[120px] top-[74px] -z-[1] hidden lg:block"
      />

      <div data-apparition="" className="max-w-[680px]">
        <Kicker className="text-faint-sur-ink!">
          Les formations · trois niveaux
        </Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Commencez par le niveau qui vous{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            correspond
          </span>
          .
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body-sur-ink">
          Le niveau débutant ouvre les inscriptions ; les deux suivants
          prolongent le chemin.
        </p>
      </div>

      <div className="mt-[34px] grid grid-cols-1 gap-[22px] lg:grid-cols-3">
        {NIVEAUX.map((niveau, i) => {
          const ouvert = niveau.id === "debutant";
          return (
            <article
              key={niveau.id}
              data-apparition=""
              style={{ ["--apparition-delai" as string]: `${i * 150}ms` }}
              className="flex flex-col overflow-hidden rounded-card border border-line-sur-ink bg-surface-sur-ink"
            >
              {/* Liseré d'accent en tête, comme les blocs de /formations. */}
              <div
                aria-hidden
                className="h-[3px]"
                style={{ backgroundColor: niveau.accent }}
              />
              <div className="flex flex-1 flex-col p-6">
                <span
                  className="inline-flex self-start rounded-chip px-[9px] py-[4px] font-mono text-[10.5px] uppercase tracking-[0.12em]"
                  style={{
                    backgroundColor: niveau.badgeBg,
                    color: niveau.badgeText,
                  }}
                >
                  Niveau {niveau.numero} · {niveau.nom}
                </span>
                <h3 className="mt-3.5 text-[19px] font-bold leading-[1.28] tracking-[-0.015em]">
                  {niveau.titre}
                </h3>

                {/* Trois puces suffisent en vitrine : le détail complet est sur
                    /formations. */}
                <div className="mt-4 flex flex-col gap-2">
                  {niveau.points.slice(0, 3).map((point) => (
                    <CheckItem
                      key={point}
                      className="text-body-sur-ink!"
                      dotBg="var(--color-ecume-sur-ink)"
                      dotText="var(--color-ecume)"
                    >
                      {point}
                    </CheckItem>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-2 border-t border-line-sur-ink pt-4 text-[13.5px]">
                  <Info label="Durée" valeur={niveau.infos.duree} />
                  <Info label="Format" valeur={niveau.infos.format} />
                </div>

                {/* `mt-auto` : les CTA s'alignent en bas quelle que soit la
                    hauteur de texte des trois cartes. */}
                <div className="mt-auto pt-6">
                  {ouvert ? (
                    <ReservationTrigger className="inline-flex w-full min-h-11 items-center justify-center gap-[13px] rounded-btn bg-canard py-[15px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-white shadow-cta transition-[background-color] duration-[180ms] ease-out hover:bg-canard-dark">
                      Réserver ma place
                      <Chevron />
                    </ReservationTrigger>
                  ) : (
                    <Link
                      href={`/formations#${niveau.id}`}
                      className="inline-flex w-full min-h-11 items-center justify-center gap-[13px] rounded-btn border-[1.5px] border-line-sur-ink py-[13.5px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-white transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise"
                    >
                      Découvrir
                      <Chevron />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Le prolongement au-delà des trois niveaux, en une ligne discrète. */}
      <p
        data-apparition=""
        className="mt-7 text-[15px] leading-[1.55] text-body-sur-ink"
      >
        Besoin d&apos;un outil construit pour vous ?{" "}
        <Link
          href="/implementation"
          className="inline-flex min-h-11 items-center gap-2.5 font-semibold text-turquoise transition-colors hover:text-white motion-reduce:transition-none"
        >
          L&apos;implémentation sur mesure
          <Chevron />
        </Link>
      </p>
    </section>
  );
}

/** Ligne d'info du cadre : libellé atténué à gauche, valeur mono à droite. */
function Info({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="flex-none text-faint-sur-ink">{label}</span>
      <span className="text-right font-mono text-[12.5px] font-semibold text-white">
        {valeur}
      </span>
    </div>
  );
}
