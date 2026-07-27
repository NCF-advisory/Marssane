import type { ClassementEntry } from "@/lib/benchmarks/aggregate";
import { Kicker } from "@/components/ui/Kicker";
import { BadgeEcume } from "@/components/ui/BadgeEcume";
import { PlusMark } from "@/components/ui/PlusMark";
import { BadgePays } from "@/components/quelle-ia/BadgePays";

const fmt = (x: number) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x);

/** Temps de réflexion en secondes ; « non mesurée » si AA ne l'a pas chronométré. */
const fmtSecondes = (s: number | null) =>
  s == null
    ? "non mesurée"
    : `≈ ${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: s < 10 ? 1 : 0 }).format(s)} s`;

export function HeroClassement({
  top,
  miseAJour,
}: {
  top: ClassementEntry;
  miseAJour: string | null;
}) {
  void miseAJour;
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[84px]">
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[15px] top-[60px] -z-[1] hidden lg:block -translate-x-1/2 -translate-y-1/2"
      />
      <div className="max-w-[640px]">
        <Kicker>Le comparateur · intelligence et prix</Kicker>
        <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Quelle IA utiliser{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            aujourd&apos;hui
          </span>{" "}
          ?
        </h1>
        <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body">
          Le meilleur compromis intelligence / prix du moment, remis à jour automatiquement.
        </p>
      </div>

      <div className="mt-8 max-w-[560px] rounded-card border border-hairline bg-surface shadow-hero p-6">
        <div className="flex items-center gap-3">
          <BadgeEcume>N°1</BadgeEcume>
          <span className="text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
            {top.nom}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted">
          <span>{top.editeur}</span>
          <BadgePays pays={top.pays} />
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="font-mono font-semibold text-ink-ecume tracking-[-0.02em] text-[46px] leading-none">
            {top.score}
          </span>
          <span className="pb-[6px] text-[13px] text-soft">score global</span>
        </div>
        <p className="mt-2 font-mono text-[13px] text-slate">
          ≈ {fmt(top.coutEurM)} €/M tokens
        </p>
        <p className="mt-1 font-mono text-[13px] text-slate">
          réflexion {fmtSecondes(top.latenceS)}
        </p>

        <p className="mt-5 text-[15px] leading-[1.55] text-body">
          En ce moment, le meilleur compromis intelligence / prix, c&apos;est <b>{top.nom}</b> ({top.editeur}).
          {top.effort ? ` · réglage ${top.effort}` : ""}
        </p>
      </div>
    </section>
  );
}
