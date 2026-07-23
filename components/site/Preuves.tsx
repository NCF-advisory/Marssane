import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Section « Preuves » (entre les cas concrets et « Pour qui ») : kicker, H2 38px
 * et grille de trois cartes-statistiques (chiffre mono très grand, libellé,
 * source). Les chiffres proviennent d'études externes ; la ligne de bas de
 * grille rappelle que le gain propre à l'utilisateur se mesure en formation.
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
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[84px]">
      {/* Décorations motifFond (décoratives) */}
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[15px] top-[60px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />
      <PlusMark
        size={16}
        className="absolute right-[90px] top-[60px] hidden lg:block"
      />

      <div className="max-w-[640px]">
        <Kicker>La preuve · ce que mesurent les études</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Pendant ce temps, d&apos;autres dirigeants{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            s&apos;y sont mis
          </span>
          .
        </h2>
      </div>

      <div className="mt-[34px] grid grid-cols-1 gap-[22px] sm:grid-cols-3">
        {STATS.map((s) => (
          <article
            key={s.source}
            className="flex flex-col rounded-card border border-hairline bg-surface p-6 shadow-card"
          >
            <div className="font-mono text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink-ecume">
              {s.chiffre}
            </div>
            <p className="mt-3 flex-1 text-[13.5px] leading-[1.55] text-muted">
              {s.libelle}
            </p>
            <div className="mt-4 font-mono text-[10.5px] text-soft">
              {s.source}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-[18px] text-[13px] leading-[1.55] text-soft">
        Des chiffres d&apos;études, pas les nôtres : le vôtre se mesurera sur
        votre propre cas, pendant la formation.
      </p>
    </section>
  );
}
