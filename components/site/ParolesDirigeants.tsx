import Image from "next/image";

import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Section « Paroles de dirigeants » (juste sous le héro) : mur de citations
 * de dirigeants français sur les bénéfices concrets de l'IA.
 *
 * IMPORTANT — ce ne sont PAS des avis clients Marssane.
 *
 * Tous les garde-fous d'affichage (mention d'intro sous le titre, lien de source
 * sur chaque carte, note légale en pied de section) ont été retirés sur
 * décisions du propriétaire du 29/07/2026 ; seul le kicker « citations
 * sourcées » subsiste — ne pas le retirer. Les données conservent la
 * traçabilité complète des sources (`fonction`, `contexte`, `source`, `url`).
 *
 * AVERTISSEMENT : avant mise en ligne publique, vérifier le cadrage juridique
 * (propos et marques de tiers présentés sous un titre « témoignent »).
 *
 * Tonalité encre : `*-sur-ink` partout (cf. Preuves / AvantApres).
 *
 * Deux rendus, exclusifs l'un de l'autre : le mur de pistes verticales animées
 * à partir de lg quand le mouvement est autorisé, le rail horizontal à
 * défilement manuel sous lg et en mouvement réduit. Voir les commentaires des
 * deux blocs plus bas et `.paroles-piste` dans globals.css.
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
  /**
   * Société seule, affichée sous le nom. Champ propre plutôt qu'un découpage de
   * `fonction` : « Directrice générale, Orange » → « Orange ».
   */
  societe: string;
  /**
   * Fichier de `public/img/logos-temoignages/` : logo officiel de la société,
   * normalisé en 256 × 256 transparent (cf. le tableau des sources dans le
   * rapport de mise à jour du 29/07/2026). 256 px et non 96 : `next/image`
   * demande la variante 2× sur un écran Retina, et l'optimiseur ne suragrandit
   * JAMAIS — un fichier source trop petit plafonne la variante 2× à sa propre
   * taille, et ça se voit. C'est ce qui rend l'agrandissement de la tuile à
   * 64 px indolore : le logo affiché à 50 px reçoit toujours 256 px réels.
   */
  logo: string;
  /* Les trois champs suivants ne sont PLUS affichés : sources conservées en
     données pour vérification, non affichées — décision propriétaire du
     29/07/2026. Ils restent la traçabilité de chaque verbatim ; ne pas les
     supprimer, ne pas les modifier sans revérifier la source. */
  /** Fonction exacte du dirigeant dans la source. */
  fonction: string;
  /** Contexte de l'entreprise — doit être étayé par la source. */
  contexte: string;
  /** Éditeur + date de la source. */
  source: string;
  url: string;
};

const CITATIONS: Citation[] = [
  {
    texte:
      "L’IA ne remplace pas notre expertise, mais elle nous aide à gagner du temps, à réduire les oublis et à mieux sécuriser les premiers échanges avec le client.",
    auteur: "Hugo Jauzac",
    societe: "Bluetainer",
    logo: "bluetainer.png",
    fonction: "Fondateur, Bluetainer",
    contexte: "Aménagement de conteneurs · Occitanie",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/bluetainer",
  },
  {
    texte:
      "Avant ce projet, l’information du planning atelier mettait des heures, voire des jours, à atteindre nos commerciaux. Aujourd’hui, chacun reçoit chaque matin la photo précise de ses dossiers, avec les vrais points d’attention. C’est devenu un outil quotidien indispensable.",
    auteur: "Guillaume Chouvin",
    societe: "Publiscreen",
    logo: "publiscreen.png",
    fonction: "Directeur général, Publiscreen",
    contexte: "PLV & industrie de transformation · Hauts-de-France",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/Publiscreen",
  },
  {
    texte:
      "Comme beaucoup d’entreprises, on accumule des données depuis des années sans vraiment les regarder. En prenant un peu de recul, on se rend compte que l’on est assis sur une véritable mine d’or.",
    auteur: "Quentin De Pelichy",
    societe: "Turboself",
    logo: "turboself.png",
    fonction: "Dirigeant, Turboself",
    contexte: "Restauration scolaire · Centre-Val de Loire",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/Turboself",
  },
  {
    texte:
      "… Notre objectif avec ces outils d’automatisation était de libérer nos équipes des tâches chronophages pour leur permettre de se focaliser sur leur réelle valeur ajoutée…",
    auteur: "Sébastien Hardy",
    societe: "Diadem",
    logo: "diadem.png",
    fonction: "Dirigeant, Diadem",
    contexte: "Impression & pré-presse · Nouvelle-Aquitaine",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/diadem",
  },
  {
    texte:
      "… Il n’y a pas de remplacement de l’emploi, il n’y a pas de remplacement de l’humain par l’IA. Il y a une complémentarité et surtout une aide dans le traitement générique des appels. Sautez le pas !…",
    auteur: "David Fayet",
    societe: "OuestCall",
    logo: "ouestcall.png",
    fonction: "Responsable, OuestCall",
    contexte: "Télésecrétariat médical · Nouvelle-Aquitaine",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/OuestCall",
  },
  {
    texte:
      "Si on ne fait pas de l’IA métier en 2025, on n’est pas bon. Il faut le voir comme de l’innovation.",
    auteur: "Pierre Voirin",
    societe: "Eco-SI",
    logo: "eco-si.png",
    fonction: "Directeur, Eco-SI",
    contexte: "Éditeur de logiciels · 14 collaborateurs",
    source: "Siparex × Bpifrance · Les audacieux de l’IA · avril 2026",
    url: "https://www.siparex.com/wp-content/uploads/2026/04/Les-audacieux-de-lIA_Livre-Blanc-Siparex-x-BPIFrance_defAvril2026.pdf",
  },
  {
    texte:
      "Beaucoup utilisent l’IA pour remplacer une compétence. Nous avons choisi de l’utiliser pour transmettre et renforcer la nôtre.",
    auteur: "Delphine Cudelou",
    societe: "Chambre des notaires de la Cour d’appel de Caen",
    logo: "chambre-notaires-caen.png",
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
    societe: "Dedienne Aerospace",
    logo: "dedienne-aerospace.png",
    fonction: "CEO, Dedienne Aerospace",
    contexte: "Aéronautique · ETI · Occitanie",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/Dedienne-Aerospace",
  },
  {
    texte:
      "Notre objectif était de prendre le train de l’IA sans attendre, en déployant des solutions simples et accessibles rapidement pour répondre concrètement aux besoins et aux usages de nos collaborateurs.",
    auteur: "Jérôme Fossat",
    societe: "Patrimoine SA",
    logo: "patrimoine-sa.png",
    fonction: "Directeur des SI et de l’organisation, Patrimoine SA",
    contexte: "Immobilier · Occitanie",
    source: "Bpifrance · Osez l’IA · juin 2026",
    url: "https://conseil.bpifrance.fr/accelerez-ia/cas-usage/Patrimoine%20SA",
  },
  {
    texte:
      "Concrètement, l’implémentation de l’IA au sein du groupe a permis d’améliorer l’expérience client, de mieux cibler les besoins de nos parties prenantes, d’enrichir les tâches de nos collaborateurs, d’optimiser production et stocks tout en accroissant notre protection cyber. Et nous n’en sommes qu’au démarrage !",
    auteur: "Patrick Martin",
    societe: "MEDEF",
    logo: "medef.png",
    fonction: "Président du MEDEF",
    contexte: "Distribution BtoB bâtiment & industrie",
    source: "MEDEF · novembre 2024",
    url: "https://www.medef31.fr/fr/actualite/billet-de-patrick-martin-intelligence-artificielle-mais-opportunites-reelles",
  },
  {
    texte:
      "Chez Orange, nous avons fait le choix de mettre l’IA dans la main des collaborateurs. Nous avons formé plus de 50 000 salariés.",
    auteur: "Christel Heydemann",
    societe: "Orange",
    logo: "orange.png",
    fonction: "Directrice générale, Orange",
    contexte: "Télécoms · CAC 40",
    source: "Maddyness · mars 2025",
    url: "https://www.maddyness.com/2025/03/05/christel-heydemann-cest-dans-notre-interet-de-travailler-plus-avec-la-french-tech/",
  },
  {
    texte:
      "Il est urgent d’investir dans les compétences, avec plus de formations pour comprendre les IA avec leurs atouts et leurs limites, et pour pouvoir les intégrer à un niveau bien plus élevé dans les bureaux de travail et les business models.",
    auteur: "Elise Tissier",
    societe: "Bpifrance Le Lab",
    logo: "bpifrance-le-lab.png",
    fonction: "Directrice de Bpifrance Le Lab",
    contexte: "Enquête TPE-PME · 3 077 réponses de dirigeants",
    source: "Bpifrance Le Lab · mars 2024",
    url: "https://presse.bpifrance.fr/bpifrance-le-lab-devoile-limpact-des-intelligences-artificielles-generatives-au-sein-des-tpe-pme-francaises-quels-usages-en-font-les-dirigeants-de-ces-entreprises",
  },
];

/**
 * Répartition des citations dans les trois colonnes du mur animé, en
 * tourniquet (`i % 3`). Distribution volontairement mécanique plutôt que
 * réglée à la main : elle conserve l'ordre éditorial en lecture verticale.
 *
 * Les cartes étant de hauteur libre (cf. `Carte`), les trois colonnes ne font
 * plus exactement la même hauteur. Le tourniquet les laisse malgré tout très
 * proches — 1 002 / 1 067 / 1 002 px de cycle mesurés au format du mur, soit 6 %
 * d'écart de vitesse entre la colonne la plus longue et les deux autres,
 * invisible à l'œil : rien à régler à la main. Si une modification des
 * verbatims déséquilibrait franchement une colonne, c'est ici qu'il faudrait
 * reprendre la répartition.
 */
const COLONNES = [0, 1, 2].map((colonne) =>
  CITATIONS.filter((_, i) => i % 3 === colonne),
);

export function ParolesDirigeants() {
  return (
    <section
      aria-labelledby="paroles-titre"
      className="relative isolate pb-2 pt-[72px]"
    >
      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-10">
        {/* Décoration motifFond (décorative) */}
        <PlusMark
          variant="turquoise"
          size={19}
          className="absolute right-[64px] top-[52px] -z-[1] hidden lg:block"
        />

        <div className="max-w-[680px]">
          <Kicker className="text-faint-sur-ink!">
            Paroles de dirigeants · citations sourcées
          </Kicker>
          <h2
            id="paroles-titre"
            className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]"
          >
            Les dirigeants d&apos;entreprise{" "}
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              témoignent
            </span>
            .
          </h2>
        </div>
      </div>

      {/* Mur animé (≥ lg, mouvement autorisé) : trois pistes verticales en
          boucle, sens alternés. La mécanique — hauteur fixe qui rogne, piste
          absolue, séquence dupliquée pour fermer la boucle à −50 %, marge basse
          plutôt que `gap`, pause au survol et au focus — est décrite en détail
          au-dessus de `.paroles-piste` dans globals.css.

          `overflow-clip` et non `hidden` : `hidden` ferait du mur un conteneur
          de défilement, que le navigateur pourrait faire défiler de plusieurs
          centaines de pixels pour amener un contenu dans le cadre — la piste
          resterait décalée pour de bon. `clip` rogne à l'identique sans créer ce
          contexte de défilement. */}
      <div
        className="paroles-mur relative mt-[30px] hidden h-[600px] overflow-clip motion-safe:lg:block"
        role="group"
        aria-label={`${CITATIONS.length} citations de dirigeants sur l'IA`}
      >
        <div className="mx-auto grid h-full max-w-[1180px] grid-cols-3 gap-4 px-6 sm:px-10">
          {COLONNES.map((colonne, iColonne) => (
            <div key={iColonne} className="relative h-full">
              <ul
                className="paroles-piste absolute inset-x-0 top-0 flex list-none flex-col"
                data-sens={iColonne % 2 === 1 ? "bas" : "haut"}
              >
                {/* La séquence est rendue deux fois : le second exemplaire ne
                    sert qu'à fermer la boucle, il est donc retiré aux
                    technologies d'assistance. Les cartes ne contiennent plus
                    d'élément focusable, rien à sortir de la tabulation. */}
                {[false, true].map((duplicata) =>
                  colonne.map((c) => (
                    <li
                      key={`${duplicata}-${c.auteur}`}
                      className="mb-4"
                      aria-hidden={duplicata || undefined}
                    >
                      <Carte citation={c} />
                    </li>
                  )),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Rail horizontal à défilement manuel : rendu sous lg, et rendu de
          repli en mouvement réduit à toutes les tailles (le mur animé, lui,
          disparaît dans les deux cas). Le conteneur est focusable pour
          permettre le défilement au clavier. */}
      <div
        className="mt-[30px] snap-x snap-mandatory overflow-x-auto pb-1 [scrollbar-width:none] motion-safe:lg:hidden [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label={`${CITATIONS.length} citations de dirigeants sur l'IA`}
        tabIndex={0}
      >
        {/* `items-start` : les cartes n'ont plus la même hauteur, elles
            s'alignent en haut du rail au lieu de s'étirer sur la plus haute. */}
        <ul className="flex w-max list-none items-start gap-4 px-6 sm:px-10 xl:px-[calc((100vw-1180px)/2+40px)]">
          {CITATIONS.map((c) => (
            <li key={c.auteur} className="w-[286px] snap-start sm:w-[352px]">
              <Carte citation={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Carte de citation. Sa largeur est décidée par le conteneur (fixe dans le
 * rail, pleine colonne dans le mur), pas par la carte.
 *
 * Composition voulue par le propriétaire le 29/07/2026 : le logo domine, le
 * texte passe au second plan. D'où l'identité en TÊTE de carte (`figcaption`
 * premier enfant du `figure`, ce que la spec autorise au même titre que
 * dernier) — tuile logo de 64 px, soit un peu moins d'un tiers de la hauteur de
 * carte, avec nom et société à côté — puis la citation sous un filet.
 *
 * Le guillemet turquoise est passé en tête de paragraphe au lieu d'occuper sa
 * propre ligne : il garde l'accent de couleur sans coûter les ~34 px de hauteur
 * qui servent maintenant à la tuile.
 *
 * HAUTEUR LIBRE — la carte n'a plus de plancher de hauteur (décision
 * propriétaire du 29/07/2026, asymétrie à la Trustpilot / 8lab) : seul l'en-tête
 * est de gabarit fixe, la citation prend la place qu'il lui faut et la carte
 * suit. Au format du mur (306 px de texte), ça donne des cartes de 2 à 6 lignes,
 * soit 185 à 273 px.
 *
 * TRONCATURE — `line-clamp-6` est un choix d'AFFICHAGE, pas une coupe
 * éditoriale : les verbatims restent intégraux dans `CITATIONS` (convention du
 * fichier : ne pas reformuler, cf. le docblock en tête). Le clamp CSS a été
 * préféré à une coupe dans les données parce qu'il n'engage aucune réécriture
 * des citations et qu'il est réversible d'une classe. Il ne sert plus qu'à
 * plafonner les citations les plus longues : au format du mur, seule celle de
 * Patrick Martin (7 lignes) est rognée ; dans le rail mobile (286 px de carte),
 * plus étroit, quatre le sont — Chouvin, Hot, Martin, Tissier.
 *
 * La tuile est la même pour les douze logos : filet + fond blanc à 6 %, et non
 * un fond blanc franc. Testé sur la carte encre, le blanc franc efface les
 * trois logos clairs (Bluetainer en filaire blanc, le bonhomme crème de Diadem,
 * le sceau blanc des notaires de Caen) alors que le fond discret laisse lire les
 * douze — un seul gabarit, un seul fond, mur homogène.
 */
function Carte({ citation }: { citation: Citation }) {
  return (
    <figure className="flex h-full w-full flex-col rounded-card border border-line-sur-ink bg-surface-sur-ink px-5 py-[18px] sm:px-6 sm:py-5">
      <figcaption className="flex items-center gap-3.5">
        <span
          aria-hidden
          className="flex size-16 shrink-0 items-center justify-center rounded-[14px] border border-line-sur-ink bg-white/[0.06]"
        >
          <Image
            src={`/img/logos-temoignages/${citation.logo}`}
            alt=""
            width={128}
            height={128}
            className="size-[50px] object-contain"
          />
        </span>
        <div className="min-w-0">
          <div className="text-[14px] font-semibold leading-[1.25] text-white">
            {citation.auteur}
          </div>
          <div className="mt-1 line-clamp-2 text-[12.5px] leading-[1.35] text-body-sur-ink">
            {citation.societe}
          </div>
        </div>
      </figcaption>
      <blockquote className="mt-[18px] grow border-t border-line-sur-ink pt-4">
        {/* Aucun plancher de hauteur : une citation courte donne une carte
            courte. Le clamp à 6 lignes n'est plus qu'un plafond pour les
            citations les plus longues. */}
        <p className="line-clamp-6 text-[13.5px] leading-[1.62] text-body-sur-ink">
          <span aria-hidden className="font-mono text-turquoise">
            &ldquo;
          </span>
          {citation.texte}
        </p>
      </blockquote>
    </figure>
  );
}
