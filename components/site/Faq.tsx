import Link from "next/link";
import type { ReactNode } from "react";
import { KickerPill } from "@/components/ui/KickerPill";

/**
 * Les huit questions qui reviennent avant une pré-inscription, dans l'ordre où
 * on se les pose : le niveau, puis le déroulé, puis ce qu'on en retire, puis les
 * réserves (données, outil, engagement).
 */
const QUESTIONS: { question: string; reponse: ReactNode }[] = [
  {
    question: "Faut-il déjà connaître l'IA pour suivre la formation ?",
    reponse: (
      <>
        Non. C&apos;est une formation de niveau débutant : la première session
        reprend les bases — Claude, le prompt, la confidentialité. Seuls
        prérequis : votre ordinateur et un abonnement Claude Pro actif
        (20&nbsp;€/mois).
      </>
    ),
  },
  {
    question: "J'utilise déjà ChatGPT ou Claude, qu'est-ce que ça m'apporte ?",
    reponse: (
      <>
        Si vous en êtes aux usages occasionnels, la formation débutant vous fera
        passer du chat aux automatismes qui tournent seuls. Si vous êtes déjà à
        l&apos;aise, le niveau confirmé est fait pour vous : structurer vos
        usages et gagner du temps sur vos vrais dossiers.{" "}
        <Link href="/formations" className="text-turquoise underline hover:text-fort">
          Voir les trois niveaux
        </Link>
        .
      </>
    ),
  },
  {
    question: "Comment la formation se déroule-t-elle concrètement ?",
    reponse: (
      <>
        Deux demi-journées en salle (3 h 45 puis 5 h), à caler selon votre
        agenda, avec de la pratique chez vous entre les deux. Vous ne regardez
        pas une démonstration : vous construisez.
      </>
    ),
  },
  {
    question: "Que se passe-t-il entre les deux sessions ?",
    reponse: (
      <>
        Vous transposez le cas mail sur votre propre boîte, à votre rythme. Un
        chat commun reste ouvert et le formateur publie une FAQ groupée à
        mi-parcours.
      </>
    ),
  },
  {
    question: "Avec quoi est-ce que je repars ?",
    reponse: (
      <>
        Un tri automatique de votre boîte mail qui tourne réellement, construit
        par vous en salle, puis votre propre cas d&apos;usage démontré au groupe
        — et un certificat de participation.
      </>
    ),
  },
  {
    question: "Mes données restent-elles confidentielles ?",
    reponse: (
      <>
        La question est traitée dès les premières heures de la formation : ce que
        Claude fait de vos données, les réglages à activer, ce qu&apos;on lui
        confie ou pas.
      </>
    ),
  },
  {
    question: "Pourquoi Claude et pas ChatGPT ?",
    reponse: (
      <>
        Les réflexes que vous apprendrez valent pour les quatre grands outils —
        ChatGPT, Claude, Mistral, GLM. La formation se fait sur Claude, considéré
        comme l&apos;IA la plus efficace en entreprise en ce moment : rédaction
        soignée, sérieux sur les documents longs.
      </>
    ),
  },
  {
    question: "La pré-inscription m'engage-t-elle ?",
    reponse: (
      <>
        Non. Elle est sans engagement, en petit groupe, avec une réponse sous
        48&nbsp;h.
      </>
    ),
  },
];

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
        {QUESTIONS.map((item) => (
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
    </section>
  );
}
