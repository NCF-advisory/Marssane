import { Fragment } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Section « Preuves » (entre les cas concrets et « Pour qui ») : kicker, H2 38px
 * et grille de trois cartes-statistiques (chiffre mono très grand, libellé,
 * source). Les chiffres proviennent d'études externes.
 */
const STATS: { chiffre: string; libelle: string; source: string }[] = [
  {
    chiffre: "5 h / semaine",
    libelle:
      "de gain déclaré par 58 % des utilisateurs réguliers d'IA générative",
    source: "BCG · AI at Work · 2024",
  },
  {
    chiffre: "1 sur 2",
    libelle:
      "dirigeant de PME utilise déjà personnellement l'IA générative",
    source: "Bpifrance Le Lab · 2025",
  },
  {
    chiffre: "×2 en un an",
    libelle:
      "l'adoption de l'IA a doublé dans les TPE-PME françaises (13 % → 26 %)",
    source: "Baromètre France Num · 2025",
  },
];

export function Preuves() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      {/* Décorations motifFond (décoratives) */}
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

      <div className="max-w-[640px]">
        <Kicker className="text-faint-sur-ink!">La preuve · ce que mesurent les études</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Pendant ce temps, d&apos;autres dirigeants{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            s&apos;y sont mis
          </span>
          .
        </h2>
      </div>

      {/* Bande chiffres — colonne empilée sous lg (séparateurs masqués),
          ligne répartie à partir de lg, calquée sur le bandeau du héro. */}
      <div className="mt-[34px] flex flex-col gap-5 rounded-card border border-line-sur-ink bg-surface-sur-ink px-5 py-[18px] sm:px-7 lg:flex-row lg:items-stretch lg:gap-6">
        {STATS.map((s, i) => (
          <Fragment key={s.source}>
            {i > 0 && <Separator />}
            <div className="flex-1">
              {/* Chiffres en turquoise : sur l'encre, le vert écume s'éteint
                  (même choix que le bandeau du héro). */}
              <div className="font-mono text-[22px] font-semibold leading-[1.1] tracking-[-0.02em] text-turquoise">
                {s.chiffre}
              </div>
              <p className="mt-1.5 text-[12.5px] leading-[1.5] text-body-sur-ink">
                {s.libelle}
              </p>
              <div className="mt-2 font-mono text-[10.5px] text-faint-sur-ink">
                {s.source}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function Separator() {
  return (
    <span aria-hidden className="hidden w-px shrink-0 bg-line-sur-ink lg:block" />
  );
}
