import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Ce que le dirigeant gagne, en quatre points. Volontairement centré sur la
 * valeur et non sur la logistique (format, prérequis, livrable) : « La
 * formation », juste en dessous, s'en charge.
 */
const POINTS: { titre: string; precision: string }[] = [
  {
    titre: "Vous travaillez sur vos propres dossiers",
    precision: "Vos mails, vos contrats, vos relances. Pas des exemples génériques.",
  },
  {
    titre: "Vous repartez avec des automatismes déjà en place",
    precision: "Pas des notes à relire : des choses qui tournent sur votre poste.",
  },
  {
    titre: "Vous gardez ces réflexes quel que soit l'outil",
    precision:
      "Ils valent pour n'importe quel assistant, aujourd'hui comme dans un an.",
  },
  {
    titre: "Vous savez où s'arrête la confidentialité",
    precision: "Quelles données confier, lesquelles jamais. Traité dès la première heure.",
  },
];

/**
 * Section « La réponse » : bascule des problèmes exposés plus haut (situations,
 * cas concrets, chiffres) vers la solution — se former. Intro puis quatre
 * cartes de valeur en 2 × 2.
 *
 * Elle porte aussi l'origine du fil conducteur vertical à x = 778,25 px : le
 * repère « + » turquoise en marque la naissance, le trait démarre juste dessous
 * et se prolonge sans rupture jusqu'à « La formation ». Décorations en
 * positions absolues px, donc masquées sous lg.
 */
export function Reponse() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      {/* Décorations motifFond (décoratives) */}
      <span
        aria-hidden
        className="absolute left-[15.25px] top-0 -z-[1] hidden h-[48px] w-[1.5px] bg-line-sur-ink lg:block"
      />
      {/* Naissance du trait continu à x=778.25px, prolongé jusqu'à « La formation ».
          Le repère turquoise marque son origine ; le trait démarre juste dessous
          (55px) pour partir en retrait du haut de section plutôt qu'au ras du bord. */}
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[779px] top-[44px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-[778.25px] top-[55px] -z-[1] hidden w-[1.5px] bg-line-sur-ink lg:block"
      />
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[15px] top-[60px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />
      <PlusMark
        variant="grey-sur-ink"
        size={16}
        className="absolute right-[90px] top-[60px] hidden lg:block"
      />

      <div className="max-w-[680px]">
        <Kicker className="text-faint-sur-ink!">La réponse · vous former</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Ces situations, vous apprenez à les régler{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            vous-même
          </span>
          .
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body-sur-ink">
          Pas un logiciel à installer, pas un prestataire à rappeler : des
          réflexes que vous gardez.
        </p>
      </div>

      {/* 2 × 2 à partir de sm ; les cartes sont opaques, le fil conducteur passe
          derrière elles et réapparaît dans les gouttières. */}
      <div className="mt-[34px] grid grid-cols-1 gap-[22px] sm:grid-cols-2">
        {POINTS.map((point, i) => (
          <article
            key={point.titre}
            className="rounded-card border border-line-sur-ink bg-surface-sur-ink p-6"
          >
            {/* Le canard manque de contraste sur l'encre : numéros en turquoise. */}
            <div className="font-mono text-[11px] font-semibold text-turquoise">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-[10px] text-[17px] font-bold leading-[1.35] tracking-[-0.01em]">
              {point.titre}
            </h3>
            <p className="mt-2 text-[14.5px] leading-[1.55] text-body-sur-ink">
              {point.precision}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
