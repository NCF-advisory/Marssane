import {
  type Classement,
  MIN_INTELLIGENCE_AA,
  MIN_INTELLIGENCE_LMARENA,
  POIDS_COUT,
  POIDS_INPUT,
  POIDS_INTELLIGENCE,
  POIDS_OUTPUT,
  POIDS_REACTIVITE,
  USD_EUR,
} from "@/lib/benchmarks/aggregate";

const SOURCES = [
  { id: "aa", name: "Artificial Analysis", url: "https://artificialanalysis.ai/methodology/intelligence-benchmarking" },
  { id: "lmarena", name: "LMArena", url: "https://lmarena.ai/leaderboard" },
  { id: "openrouter", name: "OpenRouter", url: "https://openrouter.ai/docs/guides/overview/models" },
];

export function MethodoSources({ classement }: { classement: Classement }) {
  const src = new Set(classement.entries.flatMap((e) => e.sources));
  const sources = SOURCES.filter((source) => src.has(source.id));
  const mixedIntelligence = src.has("aa") && src.has("lmarena");

  return (
    <section id="methode" className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-8 sm:px-10">
      <h2 className="text-[22px] font-bold">Comment ce comparateur d’IA est-il calculé ?</h2>
      <p className="mt-3 max-w-[760px] text-[14.5px] leading-[1.65] text-body-sur-ink">
        Marssane compare les modèles suivis selon trois critères : intelligence,
        coût d’utilisation par API et réactivité. Le score combine {POIDS_INTELLIGENCE * 100} %
        d’intelligence, {POIDS_COUT * 100} % d’efficacité par euro et {POIDS_REACTIVITE * 100} %
        de réactivité. Ces pondérations sont un choix éditorial de Marssane.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-body-sur-ink">
        {sources.length > 0 && <span>Sources : {sources.map((source, i) => (
          <span key={source.id}>
            {i > 0 && " · "}
            <a href={source.url} className="underline underline-offset-4 hover:text-turquoise">{source.name}</a>
          </span>
        ))}</span>}
        {classement.miseAJour && <span>Données collectées le <time dateTime={classement.miseAJour}>
          {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(classement.miseAJour))}
        </time></span>}
      </div>
      {classement.degrade && (
        <p className="mt-4 text-[13px] text-body-sur-ink">Données partielles ou anciennes : le classement est à interpréter avec prudence.</p>
      )}
      {mixedIntelligence && (
        <p className="mt-4 text-[13px] text-body-sur-ink">Ce relevé combine deux échelles d’intelligence différentes. Les rapports intelligence/prix ne sont pas directement comparables entre ces sources.</p>
      )}
      <details className="mt-5 max-w-[860px] rounded-card border border-line-sur-ink bg-surface-sur-ink p-5 text-[14px] leading-[1.65] text-body-sur-ink">
        <summary className="cursor-pointer font-semibold">Formule, hypothèses et limites du classement</summary>
        <ul className="mt-4 list-disc space-y-3 pl-5">
          <li>Les indicateurs sont ramenés sur une échelle de 0 à 100 parmi les modèles suivis. L’intelligence est normalisée séparément pour chaque source ; l’efficacité est le rapport entre l’indice brut et le coût. Un score de 100 est relatif à cet échantillon.</li>
          <li>Le coût mélange {POIDS_INPUT} parts de tokens en entrée et {POIDS_OUTPUT} part en sortie. Conversion indicative fixe : 1 dollar = {String(USD_EUR).replace(".", ",")} euro. Il s’agit de tarifs API par million de tokens, pas du prix d’un abonnement à une application de chat.</li>
          <li>La réactivité mesure le délai avant le premier token de réponse. Une latence manquante est remplacée dans le calcul par la médiane des latences connues ; le tableau indique alors « non mesurée ».</li>
          <li>Le filtre retient un indice Artificial Analysis d’au moins {MIN_INTELLIGENCE_AA}, ou un indice LMArena normalisé d’au moins {MIN_INTELLIGENCE_LMARENA}. Le catalogue est une sélection et ne couvre pas tous les modèles du marché.</li>
          <li>Les résultats de benchmarks ne mesurent pas directement la qualité sur vos dossiers, les fonctions d’une application ou les gains de temps de votre entreprise. La recommandation éditoriale mise en avant peut différer du premier rang calculé.</li>
        </ul>
      </details>
      <p className="mt-5 max-w-[760px] text-[13px] leading-[1.6] text-body-sur-ink">
        Le pays indiqué est celui de l’éditeur et ne prouve pas le lieu
        d’hébergement des données. Consultez les conditions du fournisseur avant
        de lui confier des documents professionnels.
      </p>
    </section>
  );
}
