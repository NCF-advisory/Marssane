import type { Classement } from "@/lib/benchmarks/aggregate";

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
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-8">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] uppercase tracking-[0.08em] text-faint-sur-ink">
        <span>{sourceLabel}</span>
        <span>Mis à jour le {date}</span>
      </div>

      {classement.degrade ? (
        <p className="mt-4 text-[13px] text-faint-sur-ink">
          Données partielles, en cours d&apos;actualisation.
        </p>
      ) : null}

      <p className="mt-4 max-w-[640px] text-[13px] leading-[1.55] text-faint-sur-ink">
        Certains modèles sont hébergés hors UE (voir le pays) : vérifiez la conformité RGPD et la
        localisation des données avant tout usage professionnel sur des données sensibles.
      </p>
    </section>
  );
}
