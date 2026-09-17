/* ============================================================================
   GARDE-FOU — les quatre badges ci-dessous sont des certifications suivies à
   l'Anthropic Academy, pas un agrément d'Anthropic : le spark reste décoratif
   (ni sceau, ni wordmark) et le texte ne doit jamais parler de partenariat ni
   d'accréditation. Ne pas retirer ce cadrage. (Photo, nom et certifications
   sont désormais réels : plus rien n'est en attente sur cette section.)
   ========================================================================= */

import Image from "next/image";
import { Kicker } from "@/components/ui/Kicker";

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

export function Formateur({
  kicker = "Qui vous forme",
  compact = false,
}: {
  kicker?: string;
  compact?: boolean;
} = {}) {
  return (
    <section
      id={compact ? undefined : "formateur"}
      aria-labelledby={compact ? "parcours-fondateur-titre" : "formateur-titre"}
      className={compact ? "px-6 pb-8 pt-6 sm:px-8" : "mx-auto max-w-[1180px] scroll-mt-8 px-6 pb-2 pt-[84px] sm:px-10"}
    >
      <div className={compact ? "grid items-start gap-6 sm:grid-cols-[128px_minmax(0,1fr)]" : "grid items-start gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14"}>
        <div className={compact ? "w-[96px] sm:w-[128px]" : "w-full max-w-[340px]"}>
          <Image
            src="/img/formateur/cleante.jpg"
            alt="Cléante Oullion, fondateur de Marssane"
            width={1090}
            height={1127}
            sizes={compact ? "(min-width: 640px) 128px, 96px" : "(min-width: 1024px) 340px, (min-width: 768px) 280px, (max-width: 388px) calc(100vw - 48px), 340px"}
            className="aspect-[1090/1127] h-auto w-full rounded-[6px] border border-line-sur-ink object-cover"
          />
          {!compact && <p className="mt-4 text-[13px] leading-[1.6] text-body-sur-ink">
            Fondateur de Marssane<br />
            Analyste en valorisation d’entreprises chez NCF
          </p>}
        </div>

        <div className="min-w-0">
          <Kicker className="text-turquoise!">{kicker}</Kicker>
          <h2 id={compact ? "parcours-fondateur-titre" : "formateur-titre"} className={`mt-3 font-extrabold leading-[1.15] text-fort ${compact ? "text-[26px]" : "text-[30px] sm:text-[38px]"}`}>
            Cléante Oullion
          </h2>
          <p className="mt-4 text-[20px] font-semibold leading-[1.4] text-fort">
            L’IA que je vous propose, je l’utilise d’abord dans mon métier.
          </p>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-body-sur-ink">
            Analyste en valorisation d’entreprises et en fusions-acquisitions
            chez NCF, je travaille au contact des dirigeants de PME. J’ai commencé
            par automatiser mon propre travail : les rapports, les notes de réunion
            et les supports de présentation.
          </p>
          <p className="mt-3 text-[15.5px] leading-[1.75] text-body-sur-ink">
            J’ai créé Marssane pour mettre cette pratique au service de votre
            entreprise. Je conçois vos automatisations et vous forme à les utiliser,
            à partir de vos outils et de vos besoins réels.
          </p>

          <h3 className="mt-7 text-[15px] font-semibold text-fort">Mes réalisations au quotidien</h3>
          <ul className="mt-3 divide-y divide-line-sur-ink border-y border-line-sur-ink text-[14px] leading-[1.6] text-body-sur-ink">
            <li className="py-3"><strong className="font-semibold text-fort">Rapports :</strong> automatisation des vérifications de cohérence et de mise en forme, avec une revue humaine finale.</li>
            <li className="py-3"><strong className="font-semibold text-fort">Réunions :</strong> traitement automatique des notes et préparation des comptes rendus.</li>
            <li className="py-3"><strong className="font-semibold text-fort">Présentations :</strong> automatisation de la création des visuels de rapports.</li>
          </ul>

          <ul aria-label="Certifications Anthropic Academy" className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
            {CERTIFICATIONS.map((certification) => (
              <li key={certification} className="flex items-center gap-2">
                <SparkMark size={18} />
                <span className="font-mono text-[11px] leading-[1.4]">
                  {certification}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] leading-[1.5] text-body-sur-ink">
            Certifié Anthropic Academy sur tout l&apos;écosystème Claude.
          </p>
        </div>
      </div>
    </section>
  );
}
