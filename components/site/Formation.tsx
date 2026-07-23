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
      className="relative isolate mx-auto max-w-[1180px] px-10 pb-5 pt-[96px]"
    >
      {/* Décorations motifFond (décoratives) */}
      <span
        aria-hidden
        className="absolute bottom-0 left-[778.25px] top-0 -z-[1] hidden w-[1.5px] bg-repere lg:block"
      />
      <PlusMark
        size={16}
        className="absolute left-[70px] top-[64px] hidden lg:block"
      />

      <div className="max-w-[640px]">
        <Kicker>La formation · niveau débutant</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Deux demi-journées, et ça{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            tourne
          </span>
          .
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body">
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
              return (
                <li key={etape.jour} className="flex gap-[18px]">
                  <div className="flex w-[52px] flex-none flex-col items-center">
                    <span className="font-mono text-[11px] font-semibold text-canard">
                      {etape.jour}
                    </span>
                    {!dernier && (
                      <span className="mt-[6px] w-[1.5px] flex-1 bg-repere" />
                    )}
                  </div>
                  <div
                    className={`flex-1 rounded-card border border-hairline bg-surface px-[22px] py-5 shadow-card ${dernier ? "" : "mb-[14px]"}`}
                  >
                    <div className="text-[17px] font-bold tracking-[-0.01em]">
                      {etape.titre}
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {etape.puces.map((puce) => (
                        <CheckItem key={puce}>{puce}</CheckItem>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Livrable */}
          <div className="ml-[70px] mt-[22px] flex items-center gap-[14px] rounded-card bg-ecume px-[22px] py-[18px]">
            <span
              aria-hidden
              className="inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-surface text-[13px] font-bold text-ink-ecume"
            >
              ✓
            </span>
            <div className="text-[15px] font-semibold leading-[1.5] text-ink-ecume">
              Vous repartez avec une boîte qui se trie toute seule, le brief de
              vos urgences chaque matin, et la méthode pour automatiser le reste.
            </div>
          </div>
        </div>

        {/* Cadre + prérequis + CTA */}
        <div className="flex flex-col gap-[22px]">
          <div className="rounded-card border border-hairline bg-surface p-6 shadow-card">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-soft">
              Le cadre
            </div>
            <div className="mt-[14px] flex flex-col gap-3 text-[14.5px]">
              {CADRE.map((ligne) => (
                <div key={ligne.label} className="flex justify-between gap-3">
                  <span className="text-body">{ligne.label}</span>
                  <span className="font-mono font-semibold text-ink">{ligne.valeur}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-hairline bg-surface p-6 shadow-card">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-soft">
              Prérequis
            </div>
            <details className="group mt-[14px]">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-[14px] font-semibold text-canard [&::-webkit-details-marker]:hidden">
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
              <div className="mt-[14px] flex flex-col gap-[11px] text-[14px] text-body">
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

/** Ligne de prérequis : pastille ✓ (écume) alignée en haut + texte 14px. */
function PrerequisItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-[10px]">
      <span
        aria-hidden
        className="mt-px inline-flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full bg-ecume text-[11px] font-bold text-ink-ecume"
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}
