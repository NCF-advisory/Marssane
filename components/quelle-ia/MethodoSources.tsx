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
          On croise trois critères, mesurés par des benchmarks indépendants : l&apos;intelligence des
          modèles, leur coût réel par million de tokens et leur réactivité — le temps que le modèle
          passe à réfléchir avant de commencer à répondre. Le score global pèse 50 %
          l&apos;intelligence, 25 % le coût et 25 % la réactivité : le niveau décide, le prix et
          l&apos;attente départagent. Cette pondération est un choix éditorial, assumé et affiché
          plutôt que caché. Nous ne gardons que les modèles de niveau professionnel : en dessous
          d&apos;un plancher d&apos;intelligence, un modèle n&apos;est pas classé, même s&apos;il est
          rapide ou peu coûteux. Claude Opus 5 est suivi à son réglage <i>high</i>, nettement plus
          réactif que le réglage <i>max</i> pour un niveau d&apos;intelligence quasi identique.
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
