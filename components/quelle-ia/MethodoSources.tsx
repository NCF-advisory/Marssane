import type { Classement } from "@/lib/benchmarks/aggregate";
import { Kicker } from "@/components/ui/Kicker";

export function MethodoSources({ classement }: { classement: Classement }) {
  const src = [...new Set(classement.entries.flatMap((e) => e.sources))];
  const sourceLabel = src.includes("aa")
    ? "Source : Artificial Analysis"
    : "Sources : LMArena · OpenRouter";

  const date = classement.miseAJour
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(classement.miseAJour))
    : "—";

  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[84px]">
      <div className="max-w-[640px]">
        <Kicker>Méthode &amp; sources</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Comment on{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            classe
          </span>
          .
        </h2>
        <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body">
          On croise l&apos;intelligence des modèles (benchmarks indépendants) et leur coût réel par
          million de tokens, en ne gardant que les modèles de niveau professionnel. L&apos;indice
          d&apos;efficacité rapporte l&apos;intelligence au coût : 100 = meilleur rapport du moment.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] uppercase tracking-[0.08em] text-slate">
        <span>{sourceLabel}</span>
        <span>Mis à jour le {date}</span>
      </div>

      {classement.degrade ? (
        <p className="mt-4 text-[13px] text-soft">
          Données partielles, en cours d&apos;actualisation.
        </p>
      ) : null}

      <p className="mt-4 max-w-[640px] text-[13px] leading-[1.55] text-soft">
        Certains modèles sont hébergés hors UE (voir le pays) : vérifiez la conformité RGPD et la
        localisation des données avant tout usage professionnel sur des données sensibles.
      </p>
    </section>
  );
}
