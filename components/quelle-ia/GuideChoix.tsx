import Link from "next/link";

/** Contenu utile et rendu serveur même lorsque les données externes manquent. */
export function GuideChoix() {
  return (
    <section id="choisir" className="mx-auto max-w-[1180px] px-6 pb-2 pt-12 sm:px-10">
      <h2 className="text-[24px] font-bold">Quelle IA choisir pour une PME ?</h2>
      <p className="mt-4 max-w-[760px] text-[15px] leading-[1.7] text-body-sur-ink">
        Partez d’une tâche précise : trier des mails, résumer un dossier ou
        préparer une réponse client. Comparez les assistants sur un même exemple
        anonymisé, puis vérifiez la qualité du résultat, le temps de correction,
        le coût et les possibilités de connexion à vos outils. Un bon score de
        benchmark est un repère ; votre essai métier reste décisif.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {[
          ["Pour rédiger et synthétiser", "Testez la fidélité au document d’origine, les informations omises, les sources citées et le respect de votre ton. Relisez les faits avant d’utiliser la réponse."],
          ["Pour automatiser une tâche", "Vérifiez les connecteurs disponibles, les droits demandés et les étapes que vous souhaitez valider vous-même. Commencez par un processus court et réversible."],
          ["Pour choisir votre budget", "Distinguez abonnement de chat et consommation API. Estimez aussi le temps de préparation et de contrôle : le prix par token ne résume pas le coût réel de votre usage."],
        ].map(([title, text]) => (
          <div key={title}>
            <h3 className="text-[16px] font-semibold">{title}</h3>
            <p className="mt-2 text-[14px] leading-[1.65] text-body-sur-ink">{text}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[14px] text-body-sur-ink">
        Pour mettre cette méthode en pratique, consultez le <Link href="/parcours" className="underline underline-offset-4 hover:text-turquoise">programme de formation IA débutant</Link>.
      </p>
    </section>
  );
}
