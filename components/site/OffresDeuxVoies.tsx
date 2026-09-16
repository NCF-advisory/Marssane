import Link from "next/link";
import { RendezVousTrigger } from "./RendezVousTrigger";
import { GridBackground } from "@/components/ui/GridBackground";
import { PlusMark } from "@/components/ui/PlusMark";

type Niveau = {
  titre: string;
  /** Phrase de cadrage, juste sous le titre de la carte. */
  phrase: string;
  /** Tarif affiché dans la pastille de la carte. */
  prix?: string;
  cta: {
    libelle: string;
    /** Ancre de contact ou page des formations. */
    href: string;
  };
  /** Exactement cinq lignes : les deux cartes gardent la même hauteur. */
  points: [string, string, string, string, string];
};

type OffresDeuxVoiesProps = {
  titre?: string;
  /** Extrait de `titre` à surligner en canard. Ignoré s'il n'y figure pas. */
  motSurligne?: string;
  sousTitre?: string;
  /** Exactement deux niveaux : le premier sur carte sombre, le second sur carte claire. */
  niveaux?: [Niveau, Niveau];
};

const NIVEAUX_LANDING: [Niveau, Niveau] = [
  {
    titre: "Les formations",
    prix: "Dès 980 € par personne",
    phrase: "Vous préférez apprendre à faire vous-même : prenez l'IA en main et repartez avec vos premiers automatismes.",
    cta: { libelle: "Découvrir les formations", href: "/formations" },
    points: [
      "2 séances de 3h30",
      "Présentiel près de Lyon, dix places",
      "Chacun sur son ordinateur, sur son propre cas",
      "Pré-inscription sans engagement",
      "Niveau confirmé : prochainement",
    ],
  },
  {
    titre: "Implémentation sur mesure",
    prix: "Sur devis",
    phrase: "Nous installons des agents IA sur vos outils : vous récupérez du temps dès les premières semaines.",
    cta: { libelle: "Parler de mon projet", href: "#contact" },
    points: [
      "Diagnostic de vos tâches répétitives",
      "Des agents construits sur vos outils : mails, devis, relances",
      "Testé sur vos vrais dossiers avant la mise en route",
      "Au choix : passation accompagnée ou maintenance par Marssane",
      "Périmètre et coût de l’accompagnement définis sur devis",
    ],
  },
];

/**
 * Section « Les offres » (ancre #offres) : formation sur carte sombre,
 * implémentation sur carte claire. Gabarits repris des deux niveaux de formation.
 *
 * Hiérarchie de chaque carte : titre et pastille de tarif →
 * phrase de cadrage → bouton pleine largeur → cinq coches. Le bouton passe
 * AVANT la liste (structure du bloc « programmes » du modèle).
 *
 * Cartes arrondies et carte sombre en dégradé vertical. Les deux CTA reprennent
 * le bouton animé partagé de la landing : le CTA projet ouvre la fenêtre de
 * rendez-vous, le CTA formation est un lien de navigation au même rendu.
 *
 * Les pastilles ✓ sont une variante locale (22 px, fond plein, relief) : le
 * composant <CheckItem> du design system n'est volontairement pas touché.
 */
export function OffresDeuxVoies({
  titre = "Commencez par la voie qui vous correspond.",
  motSurligne = "correspond",
  sousTitre = "L'implémentation livre des résultats immédiats ; la formation rend votre équipe autonome.",
  niveaux = NIVEAUX_LANDING,
}: OffresDeuxVoiesProps = {}) {
  // Découpe du titre autour du mot surligné (le point final reste dehors).
  const debutSurlignage = titre.indexOf(motSurligne);
  const avant =
    debutSurlignage === -1 ? titre : titre.slice(0, debutSurlignage);
  const apres =
    debutSurlignage === -1
      ? ""
      : titre.slice(debutSurlignage + motSurligne.length);

  // `scroll-mt-[76px]` : la section est la cible de l'ancre #offres et la
  // barre de nav est `sticky` (75 px). Les autres cibles d'ancre de la landing
  // s'en passent parce qu'elles portent 100 px de `pt` ; ici le talon haut
  // descend à 64 px sous 640 px, et le titre passait sous la barre. Le décalage
  // d'ancre garde les cotes de la maquette intactes.
  return (
    <section
      id="offres"
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
          className="grid grid-cols-1 items-stretch gap-[20px] min-[1000px]:grid-cols-2 min-[1000px]:grid-rows-[auto_auto_auto] min-[1000px]:gap-[28px]"
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
   titre de section basculent à 1000 px.

   En deux colonnes, la carte devient une `subgrid` de trois rangées (cadrage,
   bouton, coches) posée sur les rangées du conteneur : les deux boutons — et
   donc les deux listes de coches — démarrent à la même ordonnée quel que soit
   le nombre de lignes des phrases de cadrage. Le `gap-[30px]` de la carte
   l'emporte sur le `row-gap` du conteneur dans l'axe sous-grillé, les cotes
   internes restent celles de la maquette. Sous 1000 px, colonne unique : la
   carte reste en `flex`, rien ne change. */
const CARTE =
  "flex flex-col gap-[30px] rounded-[16px] px-[24px] pb-[32px] pt-[28px] sm:rounded-[20px] sm:px-[36px] sm:pb-[42px] sm:pt-[38px] min-[1000px]:grid min-[1000px]:grid-rows-subgrid min-[1000px]:row-span-3";

const PASTILLE =
  "mt-px inline-flex h-[20px] w-[20px] flex-none items-center justify-center rounded-full text-[12px] font-bold sm:h-[22px] sm:w-[22px]";

/**
 * Une carte de niveau. `ton` décide de la tonalité complète (fond, texte,
 * pastilles) ; tout le reste des cotes est partagé, pour que les deux cartes
 * restent strictement symétriques.
 */
function CarteNiveau({ niveau, ton }: { niveau: Niveau; ton: "sombre" | "clair" }) {
  const sombre = ton === "sombre";
  // Sur la carte sombre, le fond de base du CTA se confond avec le haut du
  // dégradé (#16161a de part et d'autre) : variante éclaircie du même bouton.
  const classeCta = sombre ? "cta-projet--sur-carte w-full" : "w-full";

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
              className={`inline-flex rounded-chip px-[11px] py-[6px] font-mono text-[13px] font-semibold uppercase tracking-[0.08em] sm:text-[13.5px] ${
                sombre
                  ? "border border-turquoise/40 bg-turquoise/10 text-turquoise"
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

      {/* Rendez-vous pour le projet, Link pour la page des formations. Le
          balisage du bouton est redupliqué ici plutôt que partagé : le
          composant de rendez-vous est client, cette section reste serveur. */}
      {niveau.cta.href.startsWith("#") ? (
        <RendezVousTrigger className={classeCta}>
          {niveau.cta.libelle}
        </RendezVousTrigger>
      ) : (
        <Link href={niveau.cta.href} className={`cta-projet ${classeCta}`}>
          <span className="cta-projet__angles" aria-hidden="true" />
          <span className="cta-projet__label">{niveau.cta.libelle}</span>
          <span className="cta-projet__icone" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="m8 5 5 5-5 5" />
            </svg>
          </span>
        </Link>
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
