import Link from "next/link";
import { GridBackground } from "@/components/ui/GridBackground";
import { PlusMark } from "@/components/ui/PlusMark";
import { ReservationTrigger } from "./ReservationTrigger";

type Niveau = {
  titre: string;
  /** Phrase de cadrage, juste sous le titre de la carte. */
  phrase: string;
  /**
   * Prix affiché en pastille sur la ligne du titre. Optionnel : seule la carte
   * débutant l'affiche (décision du propriétaire, 03/09/2026), la carte
   * confirmé n'a pas de tarif arrêté.
   */
  prix?: string;
  cta: {
    libelle: string;
    /**
     * Cible du CTA. Absent = le bouton ouvre la modale de pré-inscription
     * (cas du niveau débutant, seul niveau ouvert aux inscriptions).
     */
    href?: string;
  };
  /** Exactement cinq lignes : les deux cartes gardent la même hauteur. */
  points: [string, string, string, string, string];
};

type FormationsDeuxNiveauxProps = {
  titre?: string;
  /** Extrait de `titre` à surligner en canard. Ignoré s'il n'y figure pas. */
  motSurligne?: string;
  sousTitre?: string;
  /** Exactement deux niveaux : le premier sur carte sombre, le second sur carte claire. */
  niveaux?: [Niveau, Niveau];
};

const NIVEAUX_LANDING: [Niveau, Niveau] = [
  {
    titre: "Niveau débutant",
    phrase:
      "Le point de départ : prendre l’IA en main et repartir le soir avec ses premiers automatismes.",
    // Espace insécable avant l'euro (typographie française).
    prix: "980 € par personne",
    // Pas de `href` : ce CTA ouvre la modale de pré-inscription.
    cta: { libelle: "Réserver ma place" },
    points: [
      "Choisir le bon modèle et formuler le bon prompt",
      "Confier des tâches concrètes : fichiers, mails, recherche",
      "Créer un skill réutilisable et brancher un connecteur",
      "Deux demi-journées, selon votre agenda",
      "Présentiel, dix places, chacun sur son ordinateur",
    ],
  },
  {
    titre: "Niveau confirmé",
    phrase:
      "Vous utilisez déjà l’IA : passer des essais isolés à des méthodes qui tiennent dans la durée.",
    cta: { libelle: "Découvrir ce niveau", href: "/formations#confirme" },
    // TODO contenu niveau confirmé : les cinq lignes ci-dessous sont des
    // gabarits (le programme n'est pas arrêté). Cinq lignes exactement, pour
    // que les deux cartes restent de même hauteur en bureau.
    points: [
      "À définir",
      "À définir",
      "À définir",
      "À définir",
      "À définir",
    ],
  },
];

/**
 * Section « Les formations » de la landing (ancre #formation, cible des liens
 * « Voir le programme » des cas concrets et de /quelle-ia) : deux cartes très
 * arrondies, le niveau débutant sur carte sombre à gauche, le niveau confirmé
 * sur carte claire à droite. Le niveau expert ne figure plus ici — il reste
 * présenté sur /formations, qui garde les trois niveaux.
 *
 * Hiérarchie de chaque carte : titre (+ pastille de prix, débutant seul) →
 * phrase de cadrage → bouton pleine largeur → cinq coches. Le bouton passe
 * AVANT la liste (structure du bloc « programmes » du modèle).
 *
 * Trois écarts locaux revendiqués, qui ne se propagent nulle part ailleurs :
 * — rayon 20 px sur les cartes et boutons pill (999 px), là où la charte pose
 *   4 px / 3 px ;
 * — flèche « → » en fin de libellé de bouton, là où tout le reste du site
 *   utilise le chevron seul (<Chevron />) ;
 * — carte sombre en dégradé vertical (`--color-surface-sur-ink` en haut,
 *   #101013 en bas) et halo blanc sous le bouton clair, là où les autres
 *   cartes sur l'encre posent `bg-surface-sur-ink` à plat.
 *
 * Les pastilles ✓ sont une variante locale (22 px, fond plein, relief) : le
 * composant <CheckItem> du design system n'est volontairement pas touché.
 */
export function FormationsDeuxNiveaux({
  titre = "Commencez par le niveau qui vous correspond.",
  motSurligne = "correspond",
  sousTitre = "Le niveau débutant ouvre les inscriptions ; le niveau confirmé prolonge le chemin.",
  niveaux = NIVEAUX_LANDING,
}: FormationsDeuxNiveauxProps = {}) {
  // Découpe du titre autour du mot surligné (le point final reste dehors).
  const debutSurlignage = titre.indexOf(motSurligne);
  const avant =
    debutSurlignage === -1 ? titre : titre.slice(0, debutSurlignage);
  const apres =
    debutSurlignage === -1
      ? ""
      : titre.slice(debutSurlignage + motSurligne.length);

  // `scroll-mt-[76px]` : la section est la cible de l'ancre #formation et la
  // barre de nav est `sticky` (75 px). Les autres cibles d'ancre de la landing
  // s'en passent parce qu'elles portent 100 px de `pt` ; ici le talon haut
  // descend à 64 px sous 640 px, et le titre passait sous la barre. Le décalage
  // d'ancre garde les cotes de la maquette intactes.
  return (
    <section
      id="formation"
      className="relative isolate overflow-hidden scroll-mt-[76px]"
    >
      <GridBackground
        className="-z-[1]"
        mask="linear-gradient(to bottom, rgba(0,0,0,.8), rgba(0,0,0,0) 55%)"
      />

      {/* La bande est pleine largeur (quadrillage compris) mais sa colonne de
          contenu reprend le gabarit de la landing — `max-w-[1180px]` + le même
          `px` que les sections voisines. Écart assumé à la spec, qui posait un
          `padding` horizontal en `clamp(24px, 6.6vw, 96px)` : à 1440 px, le
          titre aurait démarré 75 px à gauche du bord de texte d'Alignement et
          de Réservation (même arbitrage que le bandeau chiffres). */}
      <div className="relative mx-auto flex max-w-[1180px] flex-col gap-[52px] px-6 pb-[72px] pt-[64px] sm:px-10 sm:pb-[96px] sm:pt-[88px]">
        {/* Décorations motifFond (décoratives), calées en px sur la colonne de
            contenu pour qu'elles suivent le gabarit. Masquées sous lg, comme
            celles des sections voisines. */}
        <PlusMark
          variant="turquoise"
          size={19}
          className="absolute left-[44px] top-[40px] hidden opacity-40 lg:block"
        />
        <PlusMark
          variant="grey-sur-ink"
          size={16}
          className="absolute right-[140px] top-[56px] hidden opacity-[0.13] lg:block"
        />

        <div data-apparition="" className="flex flex-col gap-[22px]">
          <h2 className="max-w-[900px] text-[clamp(34px,6vw,68px)] font-extrabold leading-[1.02] tracking-[-0.032em] min-[1000px]:text-[68px]">
            {avant}
            {debutSurlignage !== -1 && (
              <>
                <span className="mx-[2px] inline-block bg-canard px-[15px] pb-[7px] text-white">
                  {motSurligne}
                </span>
                {/* Ponctuation turquoise (un seul repère, cf. charte). */}
                <span
                  aria-hidden
                  className="ml-[2px] align-super text-[0.42em] font-semibold leading-none text-turquoise"
                >
                  +
                </span>
              </>
            )}
            {apres}
          </h2>
          <p className="max-w-[620px] text-pretty text-[20px] leading-[1.5] text-[#98A1AC]">
            {sousTitre}
          </p>
        </div>

        <div
          data-apparition=""
          style={{ ["--apparition-delai" as string]: "150ms" }}
          className="grid grid-cols-1 items-stretch gap-[20px] min-[1000px]:grid-cols-2 min-[1000px]:gap-[28px]"
        >
          <CarteNiveau niveau={niveaux[0]} ton="sombre" />
          <CarteNiveau niveau={niveaux[1]} ton="clair" />
        </div>
      </div>
    </section>
  );
}

/* Cotes communes aux deux cartes, tonalité mise à part. Les cotes internes
   basculent à 640 px (`sm:`) ; seules la mise en colonnes et la taille du
   titre de section basculent à 1000 px. */
const CARTE =
  "flex flex-col gap-[30px] rounded-[16px] px-[24px] pb-[32px] pt-[28px] sm:rounded-[20px] sm:px-[36px] sm:pb-[42px] sm:pt-[38px]";

const BOUTON =
  "flex w-full items-center justify-center gap-[11px] rounded-full px-[22px] py-[15px] text-[16px] font-bold tracking-[-0.01em] transition-[background-color] duration-150 ease-out sm:px-[28px] sm:py-[17px] sm:text-[16.5px]";

const PASTILLE =
  "mt-px inline-flex h-[20px] w-[20px] flex-none items-center justify-center rounded-full text-[12px] font-bold sm:h-[22px] sm:w-[22px]";

/**
 * Une carte de niveau. `ton` décide de la tonalité complète (fond, texte,
 * bouton, pastilles) ; tout le reste des cotes est partagé, pour que les deux
 * cartes restent strictement symétriques.
 */
function CarteNiveau({ niveau, ton }: { niveau: Niveau; ton: "sombre" | "clair" }) {
  const sombre = ton === "sombre";

  // Le CTA est un lien ou un bouton de modale selon la donnée : mêmes cotes,
  // même contenu, seul l'élément change.
  const classeBouton = `${BOUTON} ${
    sombre
      ? "bg-white text-ink hover:bg-[#EEF1F3]"
      : "bg-ink text-white hover:bg-[#26262E]"
  }`;
  const styleBouton = {
    // Bouton blanc : l'ombre portée est doublée d'un halo lumineux blanc en
    // deux couches (cf. JSDoc), qui détache le pill du fond noir de la carte.
    boxShadow: sombre
      ? "0 2px 10px rgba(0,0,0,.35), 0 0 14px rgba(255,255,255,.16), 0 0 30px rgba(255,255,255,.07)"
      : "0 2px 10px rgba(16,24,40,.28)",
  };
  const libelleBouton = (
    <>
      <span
        aria-hidden
        className="h-[8px] w-[8px] flex-none rounded-full bg-turquoise"
      />
      {niveau.cta.libelle}
      {/* Flèche « → » et non le chevron : écart local revendiqué (cf. JSDoc). */}
      <span aria-hidden className="text-[1.05em] leading-none">
        →
      </span>
    </>
  );

  return (
    <article
      className={`${CARTE} ${
        sombre
          ? "border border-white/[0.08] bg-surface-sur-ink bg-[linear-gradient(180deg,var(--color-surface-sur-ink)_0%,#101013_100%)]"
          : "bg-surface shadow-float"
      }`}
    >
      <div className="flex flex-col gap-[20px]">
        {/* Titre et prix sur la même ligne : la pastille de prix n'ajoute pas
            de hauteur, les deux cartes restent de même hauteur en bureau. En
            deçà de la place nécessaire, elle passe sous le titre, à gauche
            (`justify-between` ne pousse à droite qu'un item accompagné). */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-[16px] gap-y-[10px]">
          <h3
            className={`text-[22px] font-bold leading-[1.15] tracking-[-0.018em] sm:text-[25px] ${
              sombre ? "text-white" : "text-ink"
            }`}
          >
            {niveau.titre}
          </h3>
          {niveau.prix && (
            <p
              className={`inline-flex rounded-chip px-[9px] py-[5px] font-mono text-[11px] font-medium uppercase tracking-[0.1em] sm:text-[11.5px] ${
                sombre
                  ? "border border-white/[0.16] bg-white/[0.07] text-white"
                  : "bg-ecume text-ink-ecume"
              }`}
            >
              {niveau.prix}
            </p>
          )}
        </div>
        <p
          className={`text-[19px] leading-[1.5] ${
            sombre ? "text-[#98A1AC]" : "text-body"
          }`}
        >
          {niveau.phrase}
        </p>
      </div>

      {niveau.cta.href ? (
        <Link
          href={niveau.cta.href}
          className={classeBouton}
          style={styleBouton}
        >
          {libelleBouton}
        </Link>
      ) : (
        <ReservationTrigger className={classeBouton} style={styleBouton}>
          {libelleBouton}
        </ReservationTrigger>
      )}

      <ul className="flex flex-col gap-[24px]">
        {niveau.points.map((point, i) => (
          <li
            key={`${point}-${i}`}
            className={`flex gap-[14px] text-[16px] leading-[1.45] sm:text-[17px] ${
              sombre ? "text-white" : "text-ink"
            }`}
          >
            <span
              aria-hidden
              className={`${PASTILLE} ${
                sombre ? "bg-white text-ink" : "bg-ink text-white"
              }`}
              style={{
                boxShadow: sombre
                  ? "0 2px 6px rgba(0,0,0,.45)"
                  : "0 2px 6px rgba(16,24,40,.3)",
              }}
            >
              ✓
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
