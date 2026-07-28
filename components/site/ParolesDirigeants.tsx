import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Section « Paroles de dirigeants » (juste sous le héro) : mur de citations
 * de dirigeants français sur les bénéfices concrets de l'IA.
 *
 * IMPORTANT — ce ne sont PAS des avis clients Marssane. Le cadrage éditorial
 * (kicker, H2, mention sous le titre, lien source sur chaque carte, mention
 * légale en pied de section) est là pour qu'aucun visiteur ne puisse les
 * confondre avec des témoignages d'anciens participants. Ne pas retirer ces
 * garde-fous.
 *
 * Chaque `texte` est un verbatim relevé dans la source liée, vérifié le
 * 28/07/2026. Conventions de citation retenues :
 *   - « … » en tête ou en fin = extrait pris au milieu du verbatim source ;
 *   - une coupe en fin de citation après une phrase complète n'est pas signalée.
 * Toute modification d'un `texte` doit être revérifiée sur la source.
 */
type Citation = {
  /** Verbatim, tel qu'il figure dans la source. Ne pas reformuler. */
  texte: string;
  auteur: string;
  fonction: string;
  /** Contexte affiché sous la fonction — doit être étayé par la source. */
  contexte: string;
  /** Éditeur + date de la source, affichés en mono. */
  source: string;
  url: string;
};

const CITATIONS: Citation[] = [
  {
    texte:
      "L’IA ne remplace pas notre expertise, mais elle nous aide à gagner du temps, à réduire les oublis et à mieux sécuriser les premiers échanges avec le client.",
    auteur: "Hugo Jauzac",
    fonction: "Fondateur, Bluetainer",
    contexte: "Aménagement de conteneurs · Occitanie",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/bluetainer",
  },
  {
    texte:
      "Avant ce projet, l’information du planning atelier mettait des heures, voire des jours, à atteindre nos commerciaux. Aujourd’hui, chacun reçoit chaque matin la photo précise de ses dossiers, avec les vrais points d’attention. C’est devenu un outil quotidien indispensable.",
    auteur: "Guillaume Chouvin",
    fonction: "Directeur général, Publiscreen",
    contexte: "PLV & industrie de transformation · Hauts-de-France",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/Publiscreen",
  },
  {
    texte:
      "Comme beaucoup d’entreprises, on accumule des données depuis des années sans vraiment les regarder. En prenant un peu de recul, on se rend compte que l’on est assis sur une véritable mine d’or.",
    auteur: "Quentin De Pelichy",
    fonction: "Dirigeant, Turboself",
    contexte: "Restauration scolaire · Centre-Val de Loire",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/Turboself",
  },
  {
    texte:
      "… Notre objectif avec ces outils d’automatisation était de libérer nos équipes des tâches chronophages pour leur permettre de se focaliser sur leur réelle valeur ajoutée…",
    auteur: "Sébastien Hardy",
    fonction: "Dirigeant, Diadem",
    contexte: "Impression & pré-presse · Nouvelle-Aquitaine",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/diadem",
  },
  {
    texte:
      "… Il n’y a pas de remplacement de l’emploi, il n’y a pas de remplacement de l’humain par l’IA. Il y a une complémentarité et surtout une aide dans le traitement générique des appels. Sautez le pas !…",
    auteur: "David Fayet",
    fonction: "Responsable, OuestCall",
    contexte: "Télésecrétariat médical · Nouvelle-Aquitaine",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/OuestCall",
  },
  {
    texte:
      "Si on ne fait pas de l’IA métier en 2025, on n’est pas bon. Il faut le voir comme de l’innovation.",
    auteur: "Pierre Voirin",
    fonction: "Directeur, Eco-SI",
    contexte: "Éditeur de logiciels · 14 collaborateurs",
    source: "Siparex × Bpifrance · Les audacieux de l’IA · avril 2026",
    url: "https://www.siparex.com/wp-content/uploads/2026/04/Les-audacieux-de-lIA_Livre-Blanc-Siparex-x-BPIFrance_defAvril2026.pdf",
  },
  {
    texte:
      "Beaucoup utilisent l’IA pour remplacer une compétence. Nous avons choisi de l’utiliser pour transmettre et renforcer la nôtre.",
    auteur: "Delphine Cudelou",
    fonction:
      "Directrice générale, Chambre des notaires de la Cour d’appel de Caen",
    contexte: "Profession réglementée · Normandie",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/CNCAC",
  },
  {
    texte:
      "Dans un contexte de forte croissance, le programme IA Booster a permis une transformation dans la fonction Administration des Ventes. Les saisies des commandes clients devenaient de plus en plus répétitives et fastidieuses mais néanmoins primordiales.",
    auteur: "Sylvie Hot",
    fonction: "CEO, Dedienne Aerospace",
    contexte: "Aéronautique · ETI · Occitanie",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/Dedienne-Aerospace",
  },
  {
    texte:
      "Notre objectif était de prendre le train de l’IA sans attendre, en déployant des solutions simples et accessibles rapidement pour répondre concrètement aux besoins et aux usages de nos collaborateurs.",
    auteur: "Jérôme Fossat",
    fonction: "Directeur des SI et de l’organisation, Patrimoine SA",
    contexte: "Immobilier · Occitanie",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/Patrimoine%20SA",
  },
  {
    texte:
      "Concrètement, l’implémentation de l’IA au sein du groupe a permis d’améliorer l’expérience client, de mieux cibler les besoins de nos parties prenantes, d’enrichir les tâches de nos collaborateurs, d’optimiser production et stocks tout en accroissant notre protection cyber. Et nous n’en sommes qu’au démarrage !",
    auteur: "Patrick Martin",
    fonction: "Président du MEDEF",
    contexte: "Distribution BtoB bâtiment & industrie",
    source: "MEDEF · novembre 2024",
    url: "https://www.medef31.fr/fr/actualite/billet-de-patrick-martin-intelligence-artificielle-mais-opportunites-reelles",
  },
  {
    texte:
      "Chez Orange, nous avons fait le choix de mettre l’IA dans la main des collaborateurs. Nous avons formé plus de 50 000 salariés.",
    auteur: "Christel Heydemann",
    fonction: "Directrice générale, Orange",
    contexte: "Télécoms · CAC 40",
    source: "Maddyness · mars 2025",
    url: "https://www.maddyness.com/2025/03/05/christel-heydemann-cest-dans-notre-interet-de-travailler-plus-avec-la-french-tech/",
  },
  {
    texte:
      "Il est urgent d’investir dans les compétences, avec plus de formations pour comprendre les IA avec leurs atouts et leurs limites, et pour pouvoir les intégrer à un niveau bien plus élevé dans les bureaux de travail et les business models.",
    auteur: "Elise Tissier",
    fonction: "Directrice de Bpifrance Le Lab",
    contexte: "Enquête TPE-PME · 3 077 réponses de dirigeants",
    source: "Bpifrance Le Lab · mars 2024",
    url: "https://presse.bpifrance.fr/bpifrance-le-lab-devoile-limpact-des-intelligences-artificielles-generatives-au-sein-des-tpe-pme-francaises-quels-usages-en-font-les-dirigeants-de-ces-entreprises",
  },
];

export function ParolesDirigeants() {
  return (
    <section
      aria-labelledby="paroles-titre"
      className="relative isolate pb-2 pt-[72px]"
    >
      <div className="relative mx-auto max-w-[1180px] px-10">
        {/* Décoration motifFond (décorative) */}
        <PlusMark
          variant="turquoise"
          size={19}
          className="absolute right-[64px] top-[52px] -z-[1] hidden lg:block"
        />

        <div className="max-w-[680px]">
          <Kicker>Paroles de dirigeants · citations sourcées</Kicker>
          <h2
            id="paroles-titre"
            className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]"
          >
            Nous lançons Marssane. Ceux qui s&apos;y sont mis avant nous{" "}
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              en parlent déjà
            </span>
            .
          </h2>
          <p className="mt-[18px] text-[15px] leading-[1.62] text-body">
            Première session à venir : nous n&apos;avons donc pas encore
            d&apos;avis de participants, et nous n&apos;allons pas en inventer. À
            la place, voici {CITATIONS.length} propos de dirigeants français,
            relevés dans la presse et les études publiques. Chaque carte renvoie
            à sa source.
          </p>
        </div>
      </div>

      {/* Mur de citations — défilement horizontal au scroll-snap. Le conteneur
          est focusable pour permettre le défilement au clavier. */}
      <div
        className="mt-[30px] snap-x snap-mandatory overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label={`${CITATIONS.length} citations de dirigeants sur l'IA`}
        tabIndex={0}
      >
        <ul className="flex w-max list-none gap-4 px-10 xl:px-[calc((100vw-1180px)/2+40px)]">
          {CITATIONS.map((c) => (
            <li key={c.auteur} className="snap-start">
              <Carte citation={c} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-4 max-w-[1180px] px-10">
        <p className="max-w-[760px] font-mono text-[10.5px] leading-[1.6] text-soft">
          Citations de tiers, reproduites à titre d&apos;illustration du marché.
          Elles ne constituent pas un avis sur la formation Marssane et
          n&apos;impliquent aucun lien entre ces entreprises et Marssane.
        </p>
      </div>
    </section>
  );
}

function Carte({ citation }: { citation: Citation }) {
  return (
    <figure className="flex h-full w-[318px] flex-col rounded-card border border-hairline-strong bg-white/65 px-6 py-[22px] sm:w-[352px]">
      <span
        aria-hidden
        className="font-mono text-[26px] leading-none text-turquoise"
      >
        &ldquo;
      </span>
      <blockquote className="mt-2.5 grow text-[13.5px] leading-[1.62] text-body">
        {citation.texte}
      </blockquote>
      <figcaption className="mt-4 border-t border-hairline pt-3.5">
        <div className="text-[13px] font-semibold leading-[1.3] text-ink">
          {citation.auteur}
        </div>
        <div className="mt-1 text-[12px] leading-[1.4] text-muted">
          {citation.fonction}
        </div>
        <div className="mt-0.5 text-[11.5px] leading-[1.4] text-faint">
          {citation.contexte}
        </div>
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-2.5 inline-flex items-baseline gap-1 font-mono text-[10.5px] text-soft underline decoration-hairline-strong underline-offset-2 transition-colors hover:text-canard"
        >
          {citation.source}
          <span aria-hidden>↗</span>
          <span className="sr-only">(nouvelle fenêtre)</span>
        </a>
      </figcaption>
    </figure>
  );
}
