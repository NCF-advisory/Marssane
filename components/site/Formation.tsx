import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";
import { ReservationTrigger } from "./ReservationTrigger";

/** Les trois temps de la semaine. Le paragraphe peut contenir un passage en gras. */
const ETAPES: { jour: string; titre: string; texte: ReactNode }[] = [
  {
    jour: "Lundi",
    titre: "Session 1 · le cas mail, de A à Z (3 h 45)",
    texte: (
      <>
        Démonstration d&apos;ouverture, puis les bases : comment fonctionne
        Claude, le prompt, la confidentialité. Ensuite Cowork, votre skill de tri
        et le connecteur, construits en salle sur données fictives.{" "}
        <b className="font-semibold text-ink">
          « À la fin de la session, le tri automatique et le brief du matin
          tournent de bout en bout. »
        </b>
      </>
    ),
  },
  {
    jour: "Mar → jeu",
    titre: "Trois jours de pratique accompagnée",
    texte:
      "Vous transposez le cas mail sur votre propre boîte, depuis chez vous. Le chat commun reste ouvert, et le mercredi le formateur répond à tous dans une FAQ groupée.",
  },
  {
    jour: "Vendredi",
    titre: "Session 2 · votre propre cas (5 h)",
    texte:
      "Mini-audit de vos tâches pour choisir le bon cas, puis chacun construit le sien (skill, connecteur si pertinent) et le démontre au groupe. Validation des acquis et remise du certificat de participation.",
  },
];

/** Le cadre : cinq lignes libellé / valeur (valeur en mono). */
const CADRE = [
  { label: "Durée", valeur: "8 h 45 · 2 demi-journées" },
  { label: "Rythme", valeur: "la même semaine" },
  { label: "Effectif", valeur: "10 places max." },
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
          Une semaine, deux sessions, dix personnes.
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body">
          Deux demi-journées en salle, lundi et vendredi, et trois jours de
          pratique accompagnée entre les deux, chacun sur son propre ordinateur.
          Vous ne regardez pas une démonstration : vous construisez.
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
                    <p className="mt-2 text-[14px] leading-[1.58] text-muted">
                      {etape.texte}
                    </p>
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
              Vous repartez avec une boîte mail qui se trie toute seule, un compte
              rendu des urgences chaque matin, et la méthode pour automatiser vos
              propres tâches.
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
              <PrerequisItem>
                Poste géré par une DSI : validation préalable (fichiers et
                messagerie).
              </PrerequisItem>
            </div>
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
