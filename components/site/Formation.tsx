import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/** Les cinq temps de la journée. Le paragraphe peut contenir un passage en gras. */
const ETAPES: { heure: string; titre: string; texte: ReactNode }[] = [
  {
    heure: "09:00",
    titre: "La démonstration d'ouverture",
    texte: (
      <>
        Une boîte mail se trie automatiquement, sous vos yeux.{" "}
        <b className="font-semibold text-ink">« À 17 h, vous saurez faire ça. »</b>
      </>
    ),
  },
  {
    heure: "09:30",
    titre: "Installer et connecter Claude",
    texte:
      "Sur votre ordinateur : vos mails, vos dossiers. Avec un point clair sur la confidentialité — ce que voit l'outil, ce qu'il ne voit pas.",
  },
  {
    heure: "11:00",
    titre: "Confier ses premières tâches",
    texte:
      "Résumer, chercher, rédiger : exercices guidés, sur vos propres documents.",
  },
  {
    heure: "14:00",
    titre: "Créer sa première automatisation",
    texte:
      "Pas à pas, vous construisez une « skill » : une consigne que l'outil sait rejouer, tous les jours, sans vous.",
  },
  {
    heure: "15:30",
    titre: "L'atelier final",
    texte:
      "Chacun construit et teste le tri automatique de sa propre boîte mail — et repart quand ça fonctionne.",
  },
];

/** Le cadre : quatre lignes libellé / valeur (valeur en mono). */
const CADRE = [
  { label: "Durée", valeur: "1 journée · 9 h – 17 h" },
  { label: "Effectif", valeur: "10 places max." },
  { label: "Matériel", valeur: "votre ordinateur" },
  { label: "Niveau", valeur: "débutant" },
];

/**
 * Section « La formation » (ancre #formation) : intro puis grille 1.15fr/0.85fr.
 * Colonne gauche : timeline verticale (liste ordonnée) des cinq temps + encart
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
        <h2 className="mt-[14px] text-[38px] font-extrabold leading-[1.08] tracking-[-0.025em]">
          Une journée, cinq temps, dix personnes.
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body">
          De 9 h à 17 h, chacun sur son propre ordinateur. Vous ne regardez pas une
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
                <li key={etape.heure} className="flex gap-[18px]">
                  <div className="flex w-[52px] flex-none flex-col items-center">
                    <span className="font-mono text-[11px] font-semibold text-canard">
                      {etape.heure}
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
              Vous repartez avec un système fonctionnel — que vous avez construit
              vous-même.
            </div>
          </div>
        </div>

        {/* Cadre + prérequis + CTA */}
        <div className="flex flex-col gap-[22px]">
          <div className="rounded-card border border-hairline bg-surface p-6 shadow-card">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-quiet">
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
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-quiet">
              Prérequis
            </div>
            <div className="mt-[14px] flex flex-col gap-[11px] text-[14px] text-body">
              <PrerequisItem>
                Un ordinateur portable — celui sur lequel vous travaillez.
              </PrerequisItem>
              <PrerequisItem>
                Un abonnement Claude Pro actif (20&nbsp;€/mois).
              </PrerequisItem>
              <PrerequisItem>
                Poste géré par une DSI : validation préalable de l&apos;installation.
              </PrerequisItem>
            </div>
          </div>

          <a
            href="#contact"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-btn bg-canard px-[27px] py-[15px] text-[15.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark"
          >
            Réserver ma place
            <span aria-hidden className="text-[17px] leading-none">
              →
            </span>
          </a>
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
