import { FORMATION_FAQ } from "@/lib/formation-faq";
import Link from "next/link";
import { KickerPill } from "@/components/ui/KickerPill";

/**
 * Section « FAQ » (ancre #faq), dernière section de la landing. Accordéons
 * `<details>` natifs — même idiome que le bloc « Prérequis » de « La formation »,
 * élargi ici en cartes pleine ligne : la question porte le texte principal (blanc,
 * gras) et le chevron passe à droite, en turquoise.
 *
 * Le padding vertical est asymétrique par rapport aux autres sections : la
 * « Réservation » juste au-dessus referme déjà sa carte sur 90 px, la FAQ n'ajoute
 * donc qu'un talon en haut et reprend le pb de clôture avant le pied de page.
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="relative isolate mx-auto max-w-[1180px] px-6 pb-[90px] pt-2 sm:px-10"
    >
      <div data-apparition="" className="max-w-[640px]">
        <KickerPill>Vos questions</KickerPill>
        <h2 className="mt-[20px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Les questions{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            qu&apos;on nous pose
          </span>
          .
        </h2>
      </div>

      {/* Liste sur une colonne, bornée à une largeur de lecture confortable :
          l'accordéon s'ouvre sans faire sauter de voisin. */}
      <div
        data-apparition=""
        style={{ ["--apparition-delai" as string]: "150ms" }}
        className="mt-[34px] flex max-w-[860px] flex-col gap-3"
      >
        {FORMATION_FAQ.map((item) => (
          <details
            key={item.question}
            className="group rounded-card border border-line-sur-ink bg-surface-sur-ink"
          >
            {/* py-[15px] + interligne : cible tactile ≈ 54 px de haut. */}
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-[15px] text-[15.5px] font-semibold leading-[1.45] tracking-[-0.01em] [&::-webkit-details-marker]:hidden sm:text-[16.5px]">
              {item.question}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-[15px] w-[15px] flex-none text-turquoise transition-transform duration-200 group-open:rotate-90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </summary>
            {/* Le renfoncement à droite (qui dégage la colonne du chevron) n'est
                pris qu'à partir de sm : sur mobile la ligne de texte est déjà
                courte. */}
            <p className="pb-[18px] pl-5 pr-5 text-[14.5px] leading-[1.6] text-body-sur-ink sm:pr-[38px] sm:text-[15px]">
              {item.reponse}
            </p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-[14.5px] text-body-sur-ink">
        <Link href="/parcours" className="underline underline-offset-4 hover:text-turquoise">
          Consulter le programme détaillé de la formation IA débutant
        </Link>
      </p>
    </section>
  );
}
