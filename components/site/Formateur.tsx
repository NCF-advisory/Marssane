/* ============================================================================
   GARDE-FOU — les quatre badges ci-dessous sont des certifications suivies à
   l'Anthropic Academy, pas un agrément d'Anthropic : le spark reste décoratif
   (ni sceau, ni wordmark) et le texte ne doit jamais parler de partenariat ni
   d'accréditation. Ne pas retirer ce cadrage. (Photo, nom et certifications
   sont désormais réels : plus rien n'est en attente sur cette section.)
   ========================================================================= */

import Image from "next/image";

import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/** Libellés courts des quatre certifications, dans l'ordre d'affichage. Les
 *  intitulés délivrés en entier sont, respectivement : « Claude Code in
 *  Action », « AI Fluency », « Model Context Protocol (MCP) » et « Claude with
 *  the Anthropic API ». Ils sont raccourcis à l'écran pour que le bloc se lise
 *  d'un coup d'œil ; « Anthropic » ne figure sur aucune tuile, la mention de
 *  l'émetteur tient dans la seule ligne de texte sous les badges. */
const CERTIFICATIONS = ["Claude Code", "AI Fluency", "MCP", "API Claude"];

/** Coordonnée dans le repère 24×24 du spark, arrondie à 2 décimales : sans
 *  cela le DOM se remplit de coordonnées à 17 chiffres. */
const coord = (rayon: number, trigo: number) =>
  Number((12 + rayon * trigo).toFixed(2));

/** Douze branches à 30°, longueurs alternées pour la silhouette étoilée.
 *  Calculé une fois au chargement du module plutôt qu'à chaque rendu. */
const BRANCHES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * Math.PI) / 6;
  const interne = 2.4;
  const externe = i % 2 === 0 ? 10.4 : 7.4;
  return {
    x1: coord(interne, Math.cos(angle)),
    y1: coord(interne, Math.sin(angle)),
    x2: coord(externe, Math.cos(angle)),
    y2: coord(externe, Math.sin(angle)),
  };
});

/** Spark rayonnant des badges de certification : purement décoratif (le sens
 *  est porté par le libellé à côté). Une étoile géométrique tracée au trait,
 *  qui évoque l'univers Claude sans imiter le logo d'Anthropic — aucun sceau,
 *  aucun wordmark : ces badges sont ceux de Marssane, pas ceux d'Anthropic. */
function SparkMark({ size = 17 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="flex-none text-turquoise"
    >
      {BRANCHES.map((branche, i) => (
        <line
          key={i}
          x1={branche.x1}
          y1={branche.y1}
          x2={branche.x2}
          y2={branche.y2}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/**
 * Section « Qui vous forme » : un dirigeant de PME confie ses mails et ses
 * devis à quelqu'un, il veut un visage et un nom. Le bloc se lit donc d'un
 * coup d'œil, du plus visuel au plus verbeux : portrait → nom et rôle →
 * quatre badges de certification → une seule ligne de texte.
 */
export function Formateur() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      {/* Décoration motifFond (décorative) */}
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[15px] top-[60px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />

      <div className="max-w-[640px]">
        <Kicker className="text-faint-sur-ink!">Qui vous forme</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Un formateur qui pratique l&apos;IA{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            au quotidien
          </span>
          .
        </h2>
      </div>

      <div className="mt-[34px] flex max-w-[860px] flex-col gap-6 rounded-card border border-line-sur-ink bg-surface-sur-ink p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
        {/* Le portrait est l'ancrage visuel de la section, d'où une tuile plus
            large que les vignettes du reste de la page. Le fond du cliché est
            un bleu-vert sombre, très proche de la carte : la bordure
            `border-line-sur-ink` est ce qui l'en détache, ne pas la retirer.
            Cadrage centré : le sujet est déjà centré sur une image quasi
            carrée, le recadrage carré ne coupe que quelques pixels. */}
        <Image
          src="/img/formateur/cleante.jpg"
          alt="Cléante Oullion, fondateur de Marssane"
          width={1090}
          height={1127}
          sizes="(min-width: 640px) 208px, 180px"
          className="h-[180px] w-[180px] flex-none rounded-card border border-line-sur-ink object-cover sm:h-[208px] sm:w-[208px]"
        />

        {/* `sm:flex-1` : sans lui, la colonne se dimensionne sur son plus long
            texte (une ligne courte, désormais) et laisse un vide à droite dans
            la carte — les badges occupent la largeur à sa place. */}
        <div className="min-w-0 sm:flex-1">
          <div className="text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[26px]">
            Cléante Oullion
          </div>
          <div className="mt-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-turquoise">
            Fondateur de Marssane
          </div>

          {/* Grille 2×2 de badges : c'est la preuve, elle doit primer sur la
              prose. Fond `bg-ecume-sur-ink` — la carte porte déjà
              `bg-surface-sur-ink`, un fond neutre y serait invisible. */}
          <ul className="mt-[18px] grid grid-cols-2 gap-2.5">
            {CERTIFICATIONS.map((certification) => (
              <li
                key={certification}
                className="flex items-center justify-center gap-2 rounded-card border border-line-sur-ink bg-ecume-sur-ink px-2.5 py-3"
              >
                <SparkMark size={18} />
                <span className="font-mono text-[10.5px] uppercase leading-[1.2] tracking-[0.08em]">
                  {certification}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-[18px] text-[14px] leading-[1.5] text-body-sur-ink">
            Certifié Anthropic Academy sur tout l&apos;écosystème Claude.
          </p>
        </div>
      </div>
    </section>
  );
}
