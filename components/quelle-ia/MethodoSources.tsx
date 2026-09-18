import {
  type Classement,
  POIDS_COUT,
  POIDS_INPUT,
  POIDS_INTELLIGENCE,
  POIDS_OUTPUT,
  POIDS_REACTIVITE,
  USD_EUR,
} from "@/lib/benchmarks/aggregate";

const SOURCE_AA = "https://artificialanalysis.ai/methodology/intelligence-benchmarking";

export function MethodoSources({ classement }: { classement: Classement }) {
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
        <span>Sources : <a href={SOURCE_AA} className="underline underline-offset-4 hover:text-turquoise">Artificial Analysis</a></span>
        <span>Données collectées le <time dateTime={classement.miseAJour}>
          {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(classement.miseAJour))}
        </time></span>
      </div>
      <details className="mt-5 max-w-[860px] rounded-card border border-line-sur-ink bg-surface-sur-ink p-5 text-[14px] leading-[1.65] text-body-sur-ink">
        <summary className="cursor-pointer font-semibold">Formule, hypothèses et limites du classement</summary>
        <ul className="mt-4 list-disc space-y-3 pl-5">
          <li>Les indicateurs sont ramenés sur une échelle de 0 à 100 parmi les modèles suivis. L’efficacité est le rapport entre l’indice brut d’intelligence et le coût. Un score de 100 est relatif à cet échantillon.</li>
          <li>Le coût mélange {POIDS_INPUT} parts de tokens en entrée et {POIDS_OUTPUT} part en sortie. Conversion indicative fixe : 1 dollar = {String(USD_EUR).replace(".", ",")} euro. Il s’agit de tarifs API par million de tokens, pas du prix d’un abonnement à une application de chat.</li>
          <li>La réactivité mesure le délai avant le premier token de réponse. Une latence manquante est remplacée dans le calcul par la médiane des latences connues ; le tableau indique alors « non mesurée ».</li>
          <li>Le catalogue est une sélection de 15 modèles et ne couvre pas tous les modèles du marché. Les données sont un relevé arrêté au 18 septembre 2026.</li>
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
