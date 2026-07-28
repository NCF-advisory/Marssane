import type { ReactNode } from "react";
import { CheckItem } from "@/components/ui/CheckItem";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";
import { ReservationTrigger } from "./ReservationTrigger";

/** Les trois temps de la semaine, en puces courtes. */
const ETAPES: { jour: string; titre: string; puces: string[] }[] = [
  {
    jour: "01",
    titre: "Session 1 · le cas mail, de A à Z (3 h 45)",
    puces: [
      "Les bases : Claude, le prompt, la confidentialité",
      "Votre skill de tri construit en salle",
      "Le tri automatique tourne en fin de session",
    ],
  },
  {
    jour: "01 → 02",
    titre: "Entre les deux sessions · pratique chez vous",
    puces: [
      "Vous transposez sur votre propre boîte, à votre rythme",
      "Chat commun ouvert, FAQ groupée du formateur à mi-parcours",
    ],
  },
  {
    jour: "02",
    titre: "Session 2 · votre propre cas (5 h)",
    puces: [
      "Mini-audit de vos tâches, chacun construit son cas",
      "Démonstration au groupe, certificat de participation",
    ],
  },
];

/** Le cadre : cinq lignes libellé / valeur (valeur en mono). */
const CADRE = [
  { label: "Durée", valeur: "2 demi-journées" },
  { label: "Rythme", valeur: "selon votre agenda" },
  { label: "Effectif", valeur: "petit groupe" },
  { label: "Matériel", valeur: "votre ordinateur" },
  { label: "Niveau", valeur: "débutant" },
];

/**
 * Section « La formation » (ancre #formation) : intro puis grille 1.15fr/0.85fr.
 * Colonne gauche : timeline verticale (liste ordonnée) des trois temps + encart
 * livrable écume. Colonne droite : cartes « Le cadre » et « Prérequis » + CTA.
 * Sous lg la grille s'empile (timeline puis cadre/prérequis) ; les décorations
 * motifFond, en positions absolues px, sont masquées.
 */
export function Formation() {
  return (
    <section
      id="formation"
      className="relative isolate mx-auto max-w-[1180px] px-6 pb-5 pt-[96px] sm:px-10"
    >
      {/* Décorations motifFond (décoratives) */}
      <span
        aria-hidden
        className="absolute bottom-0 left-[778.25px] top-0 -z-[1] hidden w-[1.5px] bg-line-sur-ink lg:block"
      />
      <PlusMark
        variant="grey-sur-ink"
        size={16}
        className="absolute left-[70px] top-[64px] hidden lg:block"
      />

      <div className="max-w-[640px]">
        <Kicker className="text-faint-sur-ink!">La formation · niveau débutant</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Deux demi-journées, et ça{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            tourne
          </span>
          .
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body-sur-ink">
          Deux demi-journées en salle, à caler selon votre agenda, avec de la
          pratique chez vous entre les deux. Vous ne regardez pas une
          démonstration : vous construisez.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 items-start gap-11 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Déroulé : timeline verticale */}
        <div>
          <ol className="flex flex-col">
            {ETAPES.map((etape, i) => {
              const dernier = i === ETAPES.length - 1;
              // Sous lg, la gouttière de la timeline (52 px + 18 px de gap)
              // mangeait un quart de la largeur d'un téléphone : le repère de
              // jour passe au-dessus de la carte et le fil vertical, qui n'a
              // plus de colonne à tenir, disparaît.
              return (
                <li key={etape.jour} className="flex flex-col gap-[6px] lg:flex-row lg:gap-[18px]">
                  <div className="flex flex-none flex-col items-start lg:w-[52px] lg:items-center">
                    {/* Le canard manque de contraste sur l'encre : turquoise. */}
                    <span className="font-mono text-[11px] font-semibold text-turquoise">
                      {etape.jour}
                    </span>
                    {!dernier && (
                      <span className="mt-[6px] hidden w-[1.5px] flex-1 bg-line-sur-ink lg:block" />
                    )}
                  </div>
                  <div
                    className={`rounded-card border border-line-sur-ink bg-surface-sur-ink px-[18px] py-5 sm:px-[22px] lg:flex-1 ${dernier ? "" : "mb-[14px]"}`}
                  >
                    <div className="text-[17px] font-bold tracking-[-0.01em]">
                      {etape.titre}
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {/* Pastilles ✓ en écume sur fond écume très atténué : la
                          teinte pleine brûlerait sur l'encre. */}
                      {etape.puces.map((puce) => (
                        <CheckItem
                          key={puce}
                          dotBg="var(--color-ecume-sur-ink)"
                          dotText="var(--color-ecume)"
                        >
                          {puce}
                        </CheckItem>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Livrable — encart écume atténué : seule la pastille garde la teinte
              pleine, en petite touche d'accent. Le retrait de 70 px, qui aligne
              l'encart sur les cartes de la timeline, n'a de sens que là où
              celle-ci a sa gouttière (à partir de lg). */}
          <div className="mt-[22px] flex items-center gap-[14px] rounded-card bg-ecume-sur-ink px-[18px] py-[18px] sm:px-[22px] lg:ml-[70px]">
            <span
              aria-hidden
              className="inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-ecume text-[13px] font-bold text-ink-ecume"
            >
              ✓
            </span>
            <div className="text-[15px] font-semibold leading-[1.5] text-ecume">
              Vous repartez avec une boîte qui se trie toute seule, le brief de
              vos urgences chaque matin, et la méthode pour automatiser le reste.
            </div>
          </div>
        </div>

        {/* Cadre + prérequis + CTA */}
        <div className="flex flex-col gap-[22px]">
          <div className="rounded-card border border-line-sur-ink bg-surface-sur-ink p-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint-sur-ink">
              Le cadre
            </div>
            <div className="mt-[14px] flex flex-col gap-3 text-[14.5px]">
              {CADRE.map((ligne) => (
                <div key={ligne.label} className="flex justify-between gap-3">
                  <span className="text-body-sur-ink">{ligne.label}</span>
                  <span className="font-mono font-semibold text-white">{ligne.valeur}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-line-sur-ink bg-surface-sur-ink p-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint-sur-ink">
              Prérequis
            </div>
            <details className="group mt-[14px]">
              {/* `-my-3 py-3` : 45 px de cible tactile sans rien déplacer (les
                  marges négatives compensent exactement le padding). */}
              <summary className="-my-3 flex cursor-pointer list-none items-center gap-2 py-3 text-[14px] font-semibold text-turquoise [&::-webkit-details-marker]:hidden">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 flex-none transition-transform duration-200 group-open:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
                Prérequis (3)
              </summary>
              <div className="mt-[14px] flex flex-col gap-[11px] text-[14px] text-body-sur-ink">
                <PrerequisItem>
                Un ordinateur portable, celui sur lequel vous travaillez, avec
                l&apos;application Claude installée.
              </PrerequisItem>
              <PrerequisItem>
                Un abonnement Claude Pro actif (20&nbsp;€/mois).
              </PrerequisItem>
              <PrerequisItem>
                L&apos;accès à votre messagerie depuis cet ordinateur.
              </PrerequisItem>
              </div>
            </details>
          </div>

          <ReservationTrigger className="inline-flex w-full items-center justify-center gap-2.5 rounded-btn bg-canard px-[27px] py-[15px] text-[15.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark">
            Réserver ma place
            <span aria-hidden className="text-[17px] leading-none">
              →
            </span>
          </ReservationTrigger>
        </div>
      </div>
    </section>
  );
}

/** Ligne de prérequis : pastille ✓ (écume atténuée) alignée en haut + texte 14px. */
function PrerequisItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-[10px]">
      <span
        aria-hidden
        className="mt-px inline-flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full bg-ecume-sur-ink text-[11px] font-bold text-ecume"
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}
