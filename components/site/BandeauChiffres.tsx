/* ============================================================================
   Chiffres fournis par le propriétaire le 29/07/2026 (impact générique de
   l'IA, plus des chiffres « Marssane »). Aucune source affichée — décision
   propriétaire. À étayer/vérifier avant toute mise en ligne publique.
   ========================================================================= */

import type { ReactNode } from "react";
import { GridBackground } from "@/components/ui/GridBackground";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

type Stat = {
  /** Étiquette courte au-dessus du chiffre (mono capitales, via <Kicker>). */
  label: string;
  /** Le nombre seul, sans son unité : mono, blanc, jamais en couleur. */
  valeur: string;
  /** L'unité, seule touche de turquoise du chiffre. */
  unite: string;
  /** Deux ou trois mots sous le chiffre ; mots porteurs en <strong>. */
  legende: ReactNode;
};

type BandeauChiffresProps = {
  kicker?: string;
  titre?: string;
  /** Extrait de `titre` à surligner en canard. Ignoré s'il n'y figure pas. */
  motSurligne?: string;
  /** Exactement trois entrées : la grille est en `repeat(3, 1fr)`. */
  stats?: [Stat, Stat, Stat];
};

/** Les trois chiffres du bandeau (cf. avertissement en tête de fichier). */
const STATS: [Stat, Stat, Stat] = [
  {
    label: "Dès la formation",
    valeur: "2",
    unite: "h",
    legende: <strong>gagnées chaque semaine</strong>,
  },
  {
    label: "Pour les nouveaux utilisateurs",
    valeur: "+34",
    unite: "%",
    legende: <strong>de productivité</strong>,
  },
  {
    label: "Au total",
    valeur: "10",
    unite: "h",
    legende: <strong>par semaine</strong>,
  },
];

/* Séparation des colonnes, palier par palier — aucune carte, aucun fond, juste
   des filets. À partir de 1100 px : trois colonnes, filets verticaux, 56 px de
   part et d'autre de chaque filet. Entre 640 et 1100 px : deux colonnes, la
   troisième passe dessous et son filet devient horizontal. Sous 640 px : une
   colonne, filets horizontaux.
   Les filets horizontaux tombent au milieu de l'espace entre deux blocs :
   l'espace est coupé en deux, moitié en `row-gap` sur la grille, moitié en
   `padding-top` sur le bloc qui porte le filet (24 + 24 = les 48 px du palier
   téléphone, 28 + 28 = les 56 px du palier tablette).

   `sm:max-[1100px]:` et non `sm:` pour tout ce qui DIFFÈRE entre le palier
   tablette et le palier bureau : Tailwind émet les variantes `min-[…]`
   arbitraires AVANT les points de rupture nommés, donc un `sm:` l'emporterait
   sur le `min-[1100px]:` au-delà de 1100 px. Les deux conditions ci-dessous
   sont exclusives l'une de l'autre — l'ordre d'émission n'a plus de prise. */
const COLONNES: [string, string, string] = [
  "sm:pr-[56px]",
  "border-t pt-[24px] sm:border-t-0 sm:border-l sm:pl-[56px] sm:pt-0 min-[1100px]:pr-[56px]",
  "border-t pt-[24px] sm:max-[1100px]:col-span-2 sm:max-[1100px]:pt-[28px] min-[1100px]:border-t-0 min-[1100px]:border-l min-[1100px]:pl-[56px] min-[1100px]:pt-0",
];

/**
 * Bandeau « Marssane en chiffres » (juste sous les paroles de dirigeants).
 *
 * Bande pleine largeur, arêtes franches : quadrillage en filigrane fondu vers
 * le bas, trois repères « + », puis le bloc titre et les trois chiffres posés
 * à même l'encre — pas de carte, seulement des filets entre les colonnes.
 *
 * Hiérarchie de chaque colonne : étiquette courte (mono capitales) → chiffre
 * en blanc, unité en turquoise → légende de deux ou trois mots. C'est aussi
 * l'ordre de lecture d'un lecteur d'écran.
 */
export function BandeauChiffres({
  kicker = "Marssane en chiffres",
  titre = "L’IA bien utilisée, voilà ce que ça change.",
  motSurligne = "ça change",
  stats = STATS,
}: BandeauChiffresProps = {}) {
  // Découpe du titre autour du mot surligné (le point final reste dehors).
  const debutSurlignage = titre.indexOf(motSurligne);
  const avant =
    debutSurlignage === -1 ? titre : titre.slice(0, debutSurlignage);
  const apres =
    debutSurlignage === -1
      ? ""
      : titre.slice(debutSurlignage + motSurligne.length);

  return (
    <section className="relative isolate">
      <GridBackground
        className="-z-[1]"
        mask="linear-gradient(to bottom, rgba(0,0,0,.9), rgba(0,0,0,0) 78%)"
      />

      {/* La bande est pleine largeur (quadrillage compris) mais sa colonne de
          contenu reprend le gabarit de la landing — `max-w-[1180px]` + le même
          `px` que les sections voisines : sans cela, à 1440 px, le titre et les
          chiffres démarraient 75 px à gauche du bord de texte des sections qui
          les encadrent (écart visible, cf. rapport). */}
      <div className="relative mx-auto flex max-w-[1180px] flex-col gap-[48px] px-6 pb-[56px] pt-[64px] sm:gap-[76px] sm:px-10 sm:pb-[88px] sm:pt-[96px]">
        {/* Décorations motifFond (décoratives), calées en px sur la colonne de
            contenu pour qu'elles suivent le gabarit (idiome du héro). Masquées
            sous lg, comme celles des sections voisines. */}
        <PlusMark
          variant="turquoise"
          size={19}
          className="absolute left-[44px] top-[40px] hidden opacity-40 lg:block"
        />
        <PlusMark
          variant="grey-sur-ink"
          size={16}
          className="absolute right-[120px] top-[52px] hidden opacity-[0.13] lg:block"
        />
        <PlusMark
          variant="grey-sur-ink"
          size={16}
          className="absolute bottom-[44px] left-[640px] hidden opacity-10 lg:block"
        />
        <div className="flex flex-col gap-[26px]">
          <Kicker className="text-faint-sur-ink!">{kicker}</Kicker>
          <h2 className="max-w-[900px] text-[34px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[62px]">
            {avant}
            {debutSurlignage !== -1 && (
              <>
                <span className="mx-[2px] inline-block bg-canard px-[14px] pb-[6px] text-white">
                  {motSurligne}
                </span>
                {/* Ponctuation turquoise (un seul repère, cf. charte). */}
                <span
                  aria-hidden
                  className="ml-[2px] align-super text-[0.42em] font-semibold leading-none text-turquoise"
                >
                  +
                </span>
              </>
            )}
            {apres}
          </h2>
        </div>

        <ul
          data-apparition=""
          style={{ ["--apparition-delai" as string]: "150ms" }}
          className="grid grid-cols-1 gap-x-0 gap-y-[24px] sm:max-[1100px]:grid-cols-2 sm:max-[1100px]:gap-y-[28px] min-[1100px]:grid-cols-3 min-[1100px]:gap-y-0"
        >
          {stats.map((stat, i) => (
            <li
              key={stat.label}
              className={`flex flex-col gap-5 border-line-sur-ink ${COLONNES[i]}`}
            >
              <Kicker className="text-faint-sur-ink!">{stat.label}</Kicker>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[72px] font-semibold leading-[0.9] tracking-[-0.05em] sm:max-[1100px]:text-[84px] min-[1100px]:text-[104px]">
                  {stat.valeur}
                </span>
                <span className="font-mono text-[28px] font-medium leading-none text-turquoise sm:max-[1100px]:text-[32px] min-[1100px]:text-[40px]">
                  {stat.unite}
                </span>
              </div>
              <p className="text-pretty text-[17.5px] leading-[1.5] text-body-sur-ink sm:max-w-[280px] [&_strong]:font-bold [&_strong]:text-white">
                {stat.legende}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
