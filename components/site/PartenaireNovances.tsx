import Image from "next/image";
import { Chevron } from "@/components/ui/Chevron";
import { Kicker } from "@/components/ui/Kicker";

/**
 * Bandeau de réassurance « Partenaire du Groupe Novances », posé entre le héro
 * et les paroles de dirigeants. Ce n'est pas une section pleine : deux
 * hairlines encadrent une seule rangée (tuile logo · phrase · lien sortant),
 * pour qu'il se lise comme un crédit et non comme un chapitre de la page.
 *
 * Rythme vertical : convention de la landing (cf. le docblock de `BandeToile`
 * dans app/page.tsx) — la section ne porte qu'un talon de 8 px en bas, le `pt`
 * des paroles de dirigeants (72 px) tenant seul l'écart qui suit. Le `pt-[48px]`
 * complète les 40 px de `pb` que le héro referme au-dessus.
 *
 * TUILE BLANCHE — et non le fond blanc à 6 % des tuiles de témoignages : le
 * logo Novances est un aplat bleu marine (#0f224d) sur fond transparent, il
 * disparaîtrait sur l'encre. C'est le seul logo du site dans ce cas, d'où un
 * gabarit local plutôt qu'une variante du gabarit des témoignages. La tuile est
 * horizontale (132 × 64) parce que le logo l'est (500 × 188) : à format carré,
 * le wordmark tombait sous les 100 px de large et devenait illisible.
 */
export function PartenaireNovances() {
  return (
    <section aria-label="Partenariat" className="pb-2 pt-[48px]">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        {/* Les hairlines ne sont pas animées : elles posent le cadre, le
            contenu s'y révèle en cascade (0 ms puis 150 ms). */}
        {/* Rangée unique seulement à partir de lg : entre sm et lg, la colonne
            de texte tombait sous 220 px (la phrase s'étirait sur cinq lignes à
            côté d'un vide à droite). Sous sm, la tuile passe au-dessus du texte
            plutôt qu'à côté, pour la même raison. */}
        <div className="flex flex-col gap-5 border-y border-line-sur-ink py-[26px] lg:flex-row lg:items-center lg:gap-8">
          <div
            data-apparition=""
            className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5 lg:grow"
          >
            <span
              aria-hidden
              className="flex h-16 w-[132px] shrink-0 items-center justify-center rounded-[14px] border border-line-sur-ink bg-white"
            >
              <Image
                src="/img/partenaires/novances.png"
                alt=""
                width={500}
                height={188}
                className="w-[104px]"
              />
            </span>
            <div className="min-w-0">
              <Kicker className="text-faint-sur-ink!">Partenaire</Kicker>
              <p className="mt-2.5 max-w-[640px] text-[15.5px] leading-[1.55] text-body-sur-ink">
                Marssane est partenaire du{" "}
                <strong className="font-semibold text-fort">
                  Groupe Novances
                </strong>
                , groupe de conseil multidisciplinaire de 400 personnes :
                expertise comptable, juridique, fiscale et patrimoniale.
              </p>
            </div>
          </div>

          {/* `rel="noopener"` seul : le lien est éditorial, le referrer est
              une information légitime pour le partenaire. */}
          <a
            data-apparition=""
            style={{ ["--apparition-delai" as string]: "150ms" }}
            href="https://novances.fr"
            target="_blank"
            rel="noopener"
            className="inline-flex shrink-0 items-center gap-[11px] self-start rounded-btn py-3 text-[14.5px] font-semibold text-turquoise transition-colors hover:text-fort motion-reduce:transition-none lg:self-auto lg:py-0"
          >
            Découvrir le groupe
            <Chevron />
          </a>
        </div>
      </div>
    </section>
  );
}
