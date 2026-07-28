import type { ReactNode } from "react";
import { CheckItem } from "@/components/ui/CheckItem";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Les quatre lignes du quotidien qui changent après la formation. Reprises des
 * cas concrets vus plus haut, cette fois côte à côte.
 */
const PAIRES: { sans: string; apres: string }[] = [
  {
    sans: "47 mails non triés chaque matin",
    apres: "6 mails à traiter, le reste classé",
  },
  {
    sans: "Le devis part à 22 h",
    apres: "Le devis chiffré part entre deux rendez-vous",
  },
  {
    sans: "Les relances attendent le vendredi soir",
    apres: "Elles partent seules, vous validez",
  },
  {
    sans: "Un abonnement IA qui dort",
    apres: "Des automatismes qui tournent sur votre poste",
  },
];

/**
 * Section « Comparatif avant / après » (entre « Preuves » et « La réponse ») :
 * kicker, H2 38px et quatre paires « Sans la formation » → « Après ».
 *
 * Une carte par paire, et non un tableau : sous sm les deux colonnes s'empilent,
 * et c'est le cadre de la carte qui garde l'avant et l'après d'une même ligne
 * associés — un tableau, lui, aurait dispersé les huit lignes.
 * La colonne « sans » est en retrait (texte atténué, marqueur × en anneau creux)
 * face à la colonne « après », affirmée (blanc semi-gras, pastille ✓ écume).
 */
export function AvantApres() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      {/* Décoration motifFond (décorative) */}
      <PlusMark
        variant="grey-sur-ink"
        size={16}
        className="absolute right-[130px] top-[62px] hidden lg:block"
      />

      <div className="max-w-[640px]">
        <Kicker className="text-faint-sur-ink!">
          Avant / après · votre quotidien, ligne à ligne
        </Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Ce qui{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            change
          </span>{" "}
          après les deux demi-journées.
        </h2>
      </div>

      {/* Même largeur de lecture et même rythme de liste que la FAQ. */}
      <ul className="mt-[34px] flex max-w-[860px] flex-col gap-3">
        {PAIRES.map((paire) => (
          <li
            key={paire.apres}
            className="grid grid-cols-1 gap-3 rounded-card border border-line-sur-ink bg-surface-sur-ink px-5 py-[18px] sm:grid-cols-2 sm:gap-5 sm:px-6 sm:py-5"
          >
            <div>
              <Etiquette>Sans la formation</Etiquette>
              <div className="mt-2 flex items-center gap-2.5 text-[14.5px] leading-[1.5] text-faint-sur-ink">
                {/* Anneau creux, à l'opposé de la pastille ✓ pleine d'en face. */}
                <span
                  aria-hidden
                  className="inline-flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full border border-line-sur-ink text-[11px] font-bold"
                >
                  ×
                </span>
                <span>{paire.sans}</span>
              </div>
            </div>
            {/* Le filet sépare les deux moitiés : horizontal quand elles sont
                empilées, vertical dès qu'elles passent côte à côte. */}
            <div className="border-t border-line-sur-ink pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
              <Etiquette>Après</Etiquette>
              <CheckItem
                className="mt-2 font-semibold"
                dotBg="var(--color-ecume-sur-ink)"
                dotText="var(--color-ecume)"
              >
                {paire.apres}
              </CheckItem>
            </div>
          </li>
        ))}
      </ul>

      {/* CTA intermédiaire : quatre écrans séparent le héro de « La formation »,
          ce lien y ramène sans concurrencer « Réserver ma place ». */}
      <div className="mt-7">
        <LienProgramme />
      </div>
    </section>
  );
}

/** Étiquette de colonne : mono capitales atténué, comme le label « Vécu chez ». */
function Etiquette({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint-sur-ink">
      {children}
    </div>
  );
}

/**
 * Lien secondaire vers « La formation » : idiome du lien turquoise sur l'encre
 * (cf. FAQ) + la flèche des CTA. `min-h-11` porte la cible tactile à 44 px.
 */
function LienProgramme() {
  return (
    <a
      href="#formation"
      className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-turquoise transition-colors hover:text-white motion-reduce:transition-none"
    >
      Voir le programme
      <span aria-hidden className="text-[1.1em] leading-none">
        →
      </span>
    </a>
  );
}
