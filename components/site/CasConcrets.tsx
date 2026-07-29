"use client";

import { useState, type ReactNode } from "react";
import { CasVisuel } from "@/components/site/CasVisuel";
import { Chevron } from "@/components/ui/Chevron";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Section « Les cas » (ancre #usages), sur le modèle du sélecteur de cas de
 * 8lab-ecosystem : une liste verticale de situations à gauche, le détail du cas
 * sélectionné à droite. Un seul cas est ouvert à la fois, le premier par défaut.
 *
 * Ordre strict du panneau, comme sur le modèle : titre descriptif sobre (pas de
 * surlignage canard, réservé au H2 du chapeau) → description → visuel en
 * dessous. Rien d'autre.
 *
 * À partir de lg, la carte garde la même hauteur quel que soit le cas ouvert :
 * les six panneaux sont empilés dans la même zone de grille et les inactifs sont
 * seulement rendus invisibles (cf. le commentaire du panneau). Aucune hauteur en
 * dur : c'est le panneau le plus haut qui fait foi, la copy peut changer.
 *
 * Responsive : sous lg, la colonne de droite n'existe pas — le détail se déplie
 * directement sous l'item actif (accordéon). Un seul panneau en DOM par cas :
 * l'enveloppe de chaque cas passe en `display: contents` à partir de lg, ce qui
 * fait du bouton et de son panneau des enfants directs de la grille de la carte
 * (bouton en colonne 1, panneau actif en colonne 2 sur toute la hauteur).
 *
 * Accessibilité : idiome accordéon (bouton `aria-expanded` + panneau
 * `role="region"` étiqueté par son bouton), navigation clavier native. Les
 * compositions décoratives sont `aria-hidden` et doublées d'un texte sr-only.
 */

type Cas = {
  /** Titre court de la liste de gauche. */
  titreCourt: string;
  /**
   * Titre descriptif du panneau. Volontairement sobre : le surlignage canard
   * reste réservé au H2 du chapeau, un seul par section. L'espace insécable
   * (` `) devant le « ? » évite de laisser la ponctuation seule en fin de
   * ligne quand le titre se replie (mobile).
   */
  titre: string;
  description: string;
  /**
   * Visuel 3D du cas (WebP 5:4 dans `public/img/cas/`, même convention que
   * `heroVideo` dans lib/site-config.ts) : `null` → la composition de la
   * maquette si le cas en a une, sinon la zone d'attente.
   */
  visuel: { src: string; alt: string } | null;
  /** Composition de la maquette, quand ce cas en a une. */
  composition?: ReactNode;
};

const CAS: Cas[] = [
  {
    titreCourt: "Relancé 25 fois par le même client",
    titre: "Relancé 25 fois par le même client\u00A0?",
    description:
      "Votre boîte se trie toute seule : restent les 6 mails qui comptent, les réponses pré-rédigées dans votre ton.",
    visuel: null,
    composition: <CompositionMails />,
  },
  {
    titreCourt: "Le devis part à 22 h",
    titre: "Le devis part à 22 h, le client a signé ailleurs\u00A0?",
    description:
      "Une note vocale entre deux rendez-vous, et le devis chiffré est prêt à valider. Le premier qui répond signe.",
    visuel: null,
    composition: <CompositionDevis />,
  },
  {
    titreCourt: "Un contrat de 42 pages à éplucher",
    titre: "Un contrat de 42 pages à éplucher avant de signer\u00A0?",
    description:
      "Une synthèse de 12 lignes, les points d’attention sourcés page par page.",
    visuel: null,
    composition: <CompositionSynthese />,
  },
  {
    titreCourt: "Deux heures de réunion, zéro compte-rendu",
    titre: "Deux heures de réunion, zéro compte-rendu\u00A0?",
    description:
      "L’enregistrement devient un CR structuré : décisions, qui fait quoi, pour quand.",
    visuel: null,
    composition: <CompositionReunion />,
  },
  {
    titreCourt: "L’impayé qui traîne depuis 60 jours",
    titre: "L’impayé traîne depuis 60 jours\u00A0?",
    description:
      "Des relances graduées, fermes mais dans votre ton, prêtes à partir au bon rythme.",
    visuel: null,
    composition: <CompositionImpaye />,
  },
  {
    titreCourt: "Le rendez-vous dans 20 minutes",
    titre: "Rendez-vous dans 20 minutes, dossier pas rouvert depuis 3 mois\u00A0?",
    description:
      "Une fiche de synthèse client : historique, encours, points de friction, en une page.",
    visuel: null,
    composition: <CompositionFicheClient />,
  },
];

export function CasConcrets() {
  const [actif, setActif] = useState(0);

  return (
    <section
      id="usages"
      className="relative isolate mx-auto max-w-[1180px] px-6 pb-5 pt-[100px] sm:px-10"
    >
      {/* Décorations motifFond (décoratives) — positions px : masquées sous lg
          pour ne pas déborder de la fenêtre à 360px (cf. autres sections). */}
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[15px] top-[112px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />
      <PlusMark
        variant="grey-sur-ink"
        size={16}
        className="absolute right-[150px] top-[108px] hidden lg:block"
      />

      <div data-apparition="" className="max-w-[680px]">
        <Kicker className="text-faint-sur-ink!">
          Les cas · six situations de votre semaine
        </Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Les cas auxquels vous{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            répondez
          </span>{" "}
          pendant la formation.
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body-sur-ink">
          Six situations de votre semaine, réglées en salle sur vos propres
          documents.
        </p>
      </div>

      {/* Carte du sélecteur : surface très discrète sur l'encre (le blanc plein
          est réservé aux compositions intérieures).

          `gridTemplateRows` est posé en style inline parce qu'il dépend du
          nombre de cas : une ligne par cas, le panneau les couvrant toutes en
          colonne 2. La hauteur du panneau étant la plus grande, elle se répartit
          entre les lignes — les items de la liste s'étirent donc pour remplir la
          carte au lieu de laisser un vide sous le dernier. Sous lg le conteneur
          n'est pas une grille : la déclaration y est inerte.

          Colonnes : c'est la colonne des titres qui est élastique et le panneau
          de droite qui est borné, à l'inverse de l'usage. Les compositions
          mesurent 580px et leurs cartes sont posées en absolu à des offsets en
          dur : en dessous, elles se chevauchent. 580 + 2 × 24px de padding =
          628px, arrondis à 636 pour la marge de sécurité — la liste prend tout
          ce qui reste, soit ~42 % de la carte à partir de 1180px (largeur
          maximale du conteneur) et ~33 % à 1024px, où il n'y a pas plus de
          place. */}
      <div
        data-apparition=""
        style={{
          ["--apparition-delai" as string]: "150ms",
          gridTemplateRows: `repeat(${CAS.length}, auto)`,
        }}
        className="mt-[30px] overflow-hidden rounded-card border border-line-sur-ink bg-white/[0.02] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,636px)]"
      >
        {CAS.map((cas, i) => {
          const ouvert = i === actif;
          const dernier = i === CAS.length - 1;
          return (
            <div
              key={cas.titreCourt}
              className={`${dernier ? "" : "border-b border-line-sur-ink"} lg:contents`}
            >
              <button
                type="button"
                id={`cas-onglet-${i}`}
                aria-expanded={ouvert}
                aria-controls={`cas-panneau-${i}`}
                onClick={() => setActif(i)}
                className={`group flex min-h-[52px] w-full items-center gap-3 px-5 py-[11px] text-left text-[14.5px] font-semibold leading-[1.35] tracking-[-0.01em] transition-colors duration-150 lg:col-start-1 motion-reduce:transition-none ${
                  dernier ? "" : "lg:border-b lg:border-line-sur-ink"
                } ${
                  ouvert
                    ? "bg-white/[0.05] text-white"
                    : "text-body-sur-ink hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <span className="min-w-0 flex-1">{cas.titreCourt}</span>
                {/* Même chevron que le connecteur des compositions, à l'échelle
                    du texte : blanc sur les items au repos, turquoise sur l'item
                    ouvert (le turquoise est la ponctuation de l'état actif, déjà
                    porté par l'ancienne flèche). */}
                <ChevronTrait
                  className={`h-[15px] w-[15px] transition-transform duration-150 group-hover:translate-x-[2px] motion-reduce:transition-none ${
                    ouvert ? "text-turquoise" : "text-white"
                  }`}
                />
              </button>

              {/* Panneau de détail : sous l'item en accordéon sous lg, en
                  colonne de droite à partir de lg (placement en style inline,
                  inerte hors grille).

                  Masquage à deux régimes, pour que le rectangle de la carte ne
                  change pas de taille d'un cas à l'autre : sous lg le panneau
                  inactif est retiré du flux (`hidden`, l'accordéon se replie) ;
                  à partir de lg les six panneaux occupent tous la même zone de
                  grille et restent posés (`lg:block`), les inactifs seulement
                  rendus invisibles. C'est donc le panneau le plus haut qui
                  dimensionne la colonne, quelle que soit la sélection.
                  `visibility: hidden` les sort aussi de l'arbre d'accessibilité
                  et du parcours de tabulation, comme `display: none`. */}
              <div
                id={`cas-panneau-${i}`}
                role="region"
                aria-labelledby={`cas-onglet-${i}`}
                style={{ gridColumn: 2, gridRow: `1 / ${CAS.length + 1}` }}
                className={`border-t border-line-sur-ink px-5 pb-5 pt-4 lg:border-l lg:border-t-0 lg:p-6 ${
                  ouvert ? "" : "hidden lg:invisible lg:block"
                }`}
              >
                <h3 className="text-[19px] font-bold leading-[1.25] tracking-[-0.015em] sm:text-[21px]">
                  {cas.titre}
                </h3>
                <p className="mt-3 max-w-[460px] text-[15px] leading-[1.5] text-body-sur-ink">
                  {cas.description}
                </p>
                <div className="mt-5">
                  {cas.visuel ? (
                    <div className="w-full max-w-[460px]">
                      <CasVisuel visuel={cas.visuel} />
                    </div>
                  ) : (
                    (cas.composition ?? <VisuelEnAttente />)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA intermédiaire, à la sortie des cas : quatre écrans séparent
          le héro de « La formation », ce lien y ramène sans concurrencer
          « Réserver ma place ». */}
      <div className="mt-7">
        <LienProgramme />
      </div>
    </section>
  );
}

/* ============================ Helpers partagés ============================ */

/**
 * Chevron « > » à trait épais et bouts arrondis, décoratif : le connecteur des
 * compositions et la flèche des items de la liste sont la même forme, à deux
 * échelles. `stroke-current` : la couleur vient du `text-*` posé par l'appelant,
 * comme le fait `components/ui/Chevron`. La taille aussi (`h-*`/`w-*`) — le
 * viewBox de 24 s'y adapte, l'épaisseur du trait suit donc l'échelle.
 *
 * Dessiné ici plutôt qu'avec `components/ui/Chevron` : celui-ci est le chevron
 * des CTA, un carré de 8 px tracé à la bordure — angles vifs, taille figée dans
 * ses classes de base, il ne monte pas à cette échelle et il est partagé par
 * tous les CTA du site.
 */
function ChevronTrait({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={`flex-none stroke-current ${className ?? ""}`}
    >
      <path
        d="m9 5 7 7-7 7"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Connecteur entre les deux cartes d'une composition : le chevron en turquoise,
 * pointant vers la droite dans la diagonale (à partir de lg) et pivoté vers le
 * bas quand les cartes s'empilent. Positionné en absolu à partir de lg (le
 * `className` porte les offsets, propres à chaque composition), simple élément
 * de la colonne en dessous.
 */
function Connector({ className }: { className?: string }) {
  return (
    <ChevronTrait
      className={`z-[2] h-[22px] w-[22px] rotate-90 text-turquoise lg:rotate-0 ${className ?? ""}`}
    />
  );
}

/** Barre grise simulant une ligne de texte. */
function Bar({ width, className }: { width: string; className?: string }) {
  return (
    <span
      className={`h-[6px] rounded-chip bg-bar-track ${className ?? ""}`}
      style={{ width }}
    />
  );
}

/**
 * Enveloppe d'une composition décorative : texte alternatif sr-only + cadre.
 * Sous lg la composition passe en flux (flex-col centré, cartes empilées avec
 * le connecteur au milieu) ; à partir de lg elle redevient un bloc à positions
 * absolues (hauteur fixe portée par `className`).
 */
function Composition({
  alt,
  className,
  children,
}: {
  alt: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <span className="sr-only">{alt}</span>
      <div
        aria-hidden
        className={`relative flex flex-col items-center gap-6 lg:block ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Zone d'attente des cas dont le visuel n'est pas encore produit : quadrillage
 * de la toile au même format que les visuels 3D (5:4), sans rien affirmer.
 */
function VisuelEnAttente() {
  return (
    <div className="relative w-full max-w-[460px] overflow-hidden rounded-card border border-dashed border-line-sur-ink">
      <div
        aria-hidden
        className="grid-toile"
        style={{
          ["--grid-step" as string]: "40px",
          ["--grid-line" as string]: "rgba(255, 255, 255, 0.05)",
        }}
      />
      {/* 5:4 (format des visuels 3D) en mobile ; à partir de lg, la même
          hauteur que les compositions de la maquette, pour que les panneaux
          restent de hauteurs voisines. */}
      <div className="flex aspect-[5/4] items-center justify-center lg:aspect-auto lg:h-[350px]">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint-sur-ink">
          Visuel à venir
        </span>
      </div>
    </div>
  );
}

/* =========================== Compositions maquette =========================== */

/** Cas « mails » : une boîte de 47 mails triée en 6 à traiter. */
function CompositionMails() {
  return (
    <Composition
      alt="Illustration : une boîte de 47 mails triée en 6 à traiter ce matin."
      className="w-full max-w-[580px] lg:h-[350px]"
    >
      {/* Boîte brute */}
      <div className="w-[252px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-float lg:absolute lg:left-0 lg:top-0 lg:z-[1]">
        <div className="flex items-center justify-between border-b border-[rgba(16,24,40,0.05)] px-[14px] py-[11px]">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-quiet">
            Boîte de réception · 08:02
          </span>
          <span className="font-mono text-[10px] text-quiet">47</span>
        </div>
        <div className="flex flex-col px-2 pb-2 pt-[6px]">
          <MailBrut expediteur="Greffe TC" heure="07:58" objet="Convocation : dossier n° 24-118" />
          <MailBrut expediteur="Newsletter fournisseur" heure="07:41" objet="Nos offres du mois de juillet" />
          <MailBrut expediteur="Client · pièces" heure="07:30" objet="Re: documents manquants pour le dossier" />
          <MailBrut expediteur="Banque" heure="07:12" objet="Relevé mensuel disponible" />
          <MailBrut expediteur="Confrère" heure="06:54" objet="Proposition de date d'audience" />
        </div>
      </div>

      <Connector className="lg:absolute lg:left-[265px] lg:top-[160px]" />

      {/* Boîte triée */}
      <div className="w-[280px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-hero lg:absolute lg:bottom-0 lg:right-0 lg:z-[3]">
        <div className="h-[3px] bg-turquoise" />
        <div className="flex items-center justify-between border-b border-[rgba(16,24,40,0.05)] px-[15px] py-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-quiet">
            Boîte de réception · 08:03
          </span>
          <span className="rounded-chip bg-ecume px-[7px] py-[3px] font-mono text-[10px] text-ink-ecume">
            triée
          </span>
        </div>
        <div className="flex flex-col gap-[2px] px-[10px] pb-3 pt-2">
          <MailTrie
            badge="Urgent"
            badgeClass="bg-canard text-white"
            titre="Greffe TC · convocation"
          />
          <MailTrie
            badge="À traiter"
            badgeClass="bg-ecume text-ink-ecume"
            titre="Confrère · date d'audience"
          />
          <MailTrie
            badge="En attente"
            badgeClass="bg-periwinkle text-ink-periwinkle"
            titre="Client · pièces manquantes"
          />
          <MailTrie
            badge="Classé"
            badgeClass="bg-toile text-slate"
            titre="Banque · Newsletter · 41 autres"
            titreClass="text-faint"
          />
        </div>
        <div className="flex items-center justify-between border-t border-hairline-strong px-[15px] py-[10px] text-[11.5px]">
          <span className="text-faint">à traiter ce matin</span>
          <span className="font-mono font-semibold text-ink-ecume">6 / 47</span>
        </div>
      </div>
    </Composition>
  );
}

function MailBrut({
  expediteur,
  heure,
  objet,
}: {
  expediteur: string;
  heure: string;
  objet: string;
}) {
  return (
    <div className="rounded-[3px] p-2">
      <div className="flex justify-between">
        <span className="text-[12.5px] font-semibold">{expediteur}</span>
        <span className="font-mono text-[9.5px] text-quiet">{heure}</span>
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-faint">
        {objet}
      </div>
    </div>
  );
}

function MailTrie({
  badge,
  badgeClass,
  titre,
  titreClass,
}: {
  badge: string;
  badgeClass: string;
  titre: string;
  titreClass?: string;
}) {
  return (
    <div className="flex items-center gap-[9px] p-2">
      <span
        className={`flex-none rounded-chip px-2 py-[2px] text-[10.5px] font-semibold ${badgeClass}`}
      >
        {badge}
      </span>
      <div className="min-w-0">
        <div className={`text-[12.5px] ${titreClass ?? "font-semibold"}`}>{titre}</div>
      </div>
    </div>
  );
}

/** Cas « contrat » : un PDF de 42 pages résumé en 12 lignes sourcées. */
function CompositionSynthese() {
  return (
    <Composition
      alt="Illustration : un PDF de 42 pages résumé en une synthèse de 12 lignes."
      className="w-full max-w-[580px] lg:h-[350px]"
    >
      {/* Document PDF */}
      <div className="w-[236px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-float lg:absolute lg:left-0 lg:top-0 lg:z-[1]">
        <div className="flex items-center justify-between border-b border-[rgba(16,24,40,0.05)] px-[15px] py-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-quiet">
            PDF · 42 pages
          </span>
          <span className="font-mono text-[10px] text-quiet">2,4 Mo</span>
        </div>
        <div className="px-[15px] pb-[18px] pt-4">
          <div className="text-[14px] font-bold tracking-[-0.01em]">
            Contrat de bail commercial
          </div>
          <div className="mt-[13px] flex flex-col gap-[7px]">
            <Bar width="100%" />
            <Bar width="92%" />
            <Bar width="97%" />
            <Bar width="88%" />
            <Bar width="95%" />
            <Bar width="60%" />
            <Bar width="100%" className="mt-2" />
            <Bar width="94%" />
            <Bar width="90%" />
            <Bar width="72%" />
          </div>
          <div className="mt-[14px] font-mono text-[10px] text-quiet">
            « Résume-moi ce bail, points d&apos;attention. »
          </div>
        </div>
      </div>

      <Connector className="lg:absolute lg:left-[247px] lg:top-[160px]" />

      {/* Synthèse */}
      <div className="w-[300px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-hero lg:absolute lg:bottom-0 lg:right-0 lg:z-[3]">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-[13px]">
          <div className="text-[13.5px] font-bold tracking-[-0.01em]">
            Synthèse · bail commercial
          </div>
          <span className="rounded-chip bg-ecume px-2 py-1 font-mono text-[10px] text-ink-ecume">
            12 lignes
          </span>
        </div>
        <div className="px-4 pb-[15px] pt-[13px]">
          <div className="flex flex-col gap-[10px] text-[12.5px] leading-[1.5] text-body">
            <Rubrique label="DURÉE">
              9 ans, résiliation triennale, préavis 6 mois
            </Rubrique>
            <Rubrique label="LOYER">Indexation ILC, révision annuelle</Rubrique>
            <Rubrique label="DÉPÔT">3 mois de loyer HT</Rubrique>
          </div>
          <div className="mt-[13px] rounded-[3px] px-3 py-[10px]" style={{ background: "#F5F7F9" }}>
            <div className="text-[11px] font-bold text-ink">⚠ 2 points d&apos;attention</div>
            <div className="mt-[5px] text-[11.5px] leading-[1.5] text-body">
              Clause d&apos;échelle mobile non plafonnée · travaux à charge
              preneur (art. 12)
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-faint">chaque point renvoie à sa page</span>
            <span className="font-mono font-semibold text-ink-ecume">source : p. 17</span>
          </div>
        </div>
      </div>
    </Composition>
  );
}

function Rubrique({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-[10px]">
      <span className="flex-none pt-[2px] font-mono text-[10px] text-quiet">{label}</span>
      <span>{children}</span>
    </div>
  );
}

/** Hauteurs (px) des barres de la forme d'onde de la note vocale. */
const ONDE_NOTE_VOCALE = [
  6, 11, 17, 23, 14, 9, 20, 27, 16, 10, 24, 30, 13, 8, 18, 22, 12, 26, 19, 7,
  15, 28, 21, 11, 25, 9, 17, 29, 14, 10, 20, 7,
];

/** Cas « devis » : une note vocale du soir devenue un devis chiffré. */
function CompositionDevis() {
  return (
    <Composition
      alt="Illustration : une note vocale dictée le soir devient un devis chiffré de 3 540 € HT, prêt à valider cinq minutes plus tard."
      className="w-full max-w-[580px] lg:h-[350px]"
    >
      {/* Note vocale */}
      <div className="w-[252px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-float lg:absolute lg:left-0 lg:top-0 lg:z-[1]">
        <div className="flex items-center justify-between border-b border-[rgba(16,24,40,0.05)] px-[15px] py-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-quiet">
            Note vocale · 18:47
          </span>
          <span className="font-mono text-[10px] text-quiet">1:12</span>
        </div>
        <div className="px-[15px] pb-[18px] pt-4">
          <div className="text-[13.5px] font-bold tracking-[-0.01em]">
            Chaudière · M. Duverger
          </div>
          <div className="mt-[13px] flex h-[30px] items-center justify-between">
            {ONDE_NOTE_VOCALE.map((hauteur, i) => (
              <span
                key={i}
                className="w-[2px] rounded-chip bg-bar-track"
                style={{ height: hauteur }}
              />
            ))}
          </div>
          <div className="mt-[7px] flex items-center justify-between font-mono text-[9.5px] text-quiet">
            <span>0:00</span>
            <span>1:12</span>
          </div>
          <div className="mt-[13px] text-[11px] italic leading-[1.5] text-faint">
            « …remplacement chaudière, comptez la dépose, le client veut… »
          </div>
        </div>
      </div>

      <Connector className="lg:absolute lg:left-[265px] lg:top-[160px]" />

      {/* Devis chiffré */}
      <div className="w-[280px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-hero lg:absolute lg:bottom-0 lg:right-0 lg:z-[3]">
        <div className="h-[3px] bg-turquoise" />
        <div className="flex items-center justify-between border-b border-hairline px-4 py-[13px]">
          <div className="text-[13.5px] font-bold tracking-[-0.01em]">
            Devis n°&nbsp;2026-084
          </div>
          <span className="rounded-chip bg-ecume px-2 py-1 font-mono text-[10px] text-ink-ecume">
            3 postes
          </span>
        </div>
        <div className="px-4 pb-[15px] pt-[13px]">
          <div className="flex flex-col gap-[9px]">
            <LigneDevis
              designation="Dépose ancienne chaudière"
              montant="380 €"
            />
            <LigneDevis designation="Fourniture et pose" montant="2 940 €" />
            <LigneDevis designation="Mise en service" montant="220 €" />
          </div>
          <div className="mt-[11px] flex items-center justify-between border-t border-hairline-strong pt-[11px] text-[12.5px] font-bold">
            <span>Total</span>
            <span className="font-mono">3&nbsp;540&nbsp;€&nbsp;HT</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-hairline-strong px-4 py-[10px] text-[11px]">
          <span className="text-faint">prêt à valider</span>
          <span className="font-mono font-semibold text-ink-ecume">
            18:52 · 5 min
          </span>
        </div>
      </div>
    </Composition>
  );
}

function LigneDevis({
  designation,
  montant,
}: {
  designation: string;
  montant: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
      <span className="min-w-0 text-body">{designation}</span>
      <span className="flex-none font-mono text-[11.5px] font-semibold">
        {montant}
      </span>
    </div>
  );
}

/** Cas « réunion » : 1 h 54 d'enregistrement devenues un CR d'une page. */
function CompositionReunion() {
  return (
    <Composition
      alt="Illustration : 1 h 54 d'enregistrement de réunion de chantier devient un compte-rendu d'une page — décisions, actions, suivi."
      className="w-full max-w-[580px] lg:h-[350px]"
    >
      {/* Enregistrement */}
      <div className="w-[252px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-float lg:absolute lg:left-0 lg:top-0 lg:z-[1]">
        <div className="flex items-center justify-between border-b border-[rgba(16,24,40,0.05)] px-[15px] py-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-quiet">
            Enregistrement
          </span>
          <span className="font-mono text-[10px] text-quiet">réunion chantier</span>
        </div>
        <div className="px-[15px] pb-[18px] pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[18px] font-semibold tracking-[-0.02em]">
              1&nbsp;h&nbsp;54
            </span>
            <span className="text-[11px] text-faint">4 intervenants</span>
          </div>
          <div className="mt-[15px] flex items-center gap-[3px]">
            <Bar width="17%" className="flex-none" />
            <Bar width="8%" className="flex-none" />
            <Bar width="23%" className="flex-none" />
            <Bar width="6%" className="flex-none" />
            <Bar width="13%" className="flex-none" />
            <Bar width="19%" className="flex-none" />
            <Bar width="7%" className="flex-none" />
          </div>
          <div className="mt-[7px] flex items-center justify-between font-mono text-[9.5px] text-quiet">
            <span>0:00</span>
            <span>1:54</span>
          </div>
          <div className="mt-[14px] font-mono text-[10px] text-quiet">
            « Sors-moi les décisions et les actions. »
          </div>
        </div>
      </div>

      <Connector className="lg:absolute lg:left-[265px] lg:top-[160px]" />

      {/* Compte-rendu */}
      <div className="w-[280px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-hero lg:absolute lg:bottom-0 lg:right-0 lg:z-[3]">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-[13px]">
          <div className="text-[13.5px] font-bold tracking-[-0.01em]">
            Compte-rendu · 12 juin
          </div>
          <span className="rounded-chip bg-ecume px-2 py-1 font-mono text-[10px] text-ink-ecume">
            à diffuser
          </span>
        </div>
        <div className="px-4 pb-[15px] pt-[13px]">
          <div className="flex flex-col gap-[10px] text-[12.5px] leading-[1.5] text-body">
            <Rubrique label="DÉCISIONS">
              Livraison lot B avancée au 3 juillet
            </Rubrique>
            <Rubrique label="ACTIONS">
              M. Rivière&nbsp;: devis étanchéité → vendredi
            </Rubrique>
            <Rubrique label="SUIVI">Point hebdo fixé au mardi 9&nbsp;h</Rubrique>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-hairline-strong px-4 py-[10px] text-[11px]">
          <span className="text-faint">décisions · qui · pour quand</span>
          <span className="font-mono font-semibold text-ink-ecume">1 page</span>
        </div>
      </div>
    </Composition>
  );
}

/** Cas « impayé » : une facture à +60 jours devenue une séquence de relances. */
function CompositionImpaye() {
  return (
    <Composition
      alt="Illustration : une facture de 4 820 € impayée depuis 60 jours devient une séquence de trois relances graduées, prêtes à partir."
      className="w-full max-w-[580px] lg:h-[350px]"
    >
      {/* Facture impayée */}
      <div className="w-[252px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-float lg:absolute lg:left-0 lg:top-0 lg:z-[1]">
        <div className="flex items-center justify-between border-b border-[rgba(16,24,40,0.05)] px-[15px] py-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-quiet">
            Facture F-2026-031
          </span>
          <span className="font-mono text-[10px] text-quiet">Sarl Ledoux</span>
        </div>
        <div className="px-[15px] pb-[18px] pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[17px] font-bold tracking-[-0.02em]">
              4&nbsp;820&nbsp;€
            </span>
            <span className="flex-none rounded-chip bg-canard px-2 py-[2px] text-[10.5px] font-semibold text-white">
              +60&nbsp;j
            </span>
          </div>
          <div className="mt-[11px] text-[11px] leading-[1.5] text-faint">
            échéance&nbsp;: 28 mai · 2 relances sans réponse
          </div>
          <div className="mt-[14px] font-mono text-[10px] text-quiet">
            « Relance-la, fermement mais correctement. »
          </div>
        </div>
      </div>

      <Connector className="lg:absolute lg:left-[265px] lg:top-[160px]" />

      {/* Séquence de relance */}
      <div className="w-[280px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-hero lg:absolute lg:bottom-0 lg:right-0 lg:z-[3]">
        <div className="h-[3px] bg-turquoise" />
        <div className="flex items-center justify-between border-b border-hairline px-4 py-[13px]">
          <div className="text-[13.5px] font-bold tracking-[-0.01em]">
            Séquence de relance
          </div>
          <span className="font-mono text-[10px] text-quiet">F-2026-031</span>
        </div>
        <div className="flex flex-col gap-[9px] px-4 pb-[15px] pt-[13px]">
          <EtapeRelance
            etat="Envoyée · J+62"
            etatClass="bg-ecume text-ink-ecume"
            extrait="« Sauf erreur de notre part, cette facture reste impayée. »"
          />
          <EtapeRelance
            etat="Programmée · J+70"
            etatClass="bg-periwinkle text-ink-periwinkle"
            extrait="« Sans règlement sous 8 jours, nous suspendons les livraisons. »"
          />
          <EtapeRelance
            etat="Si besoin · J+80"
            etatClass="bg-toile text-slate"
            extrait="Mise en demeure — dernier rappel amiable"
          />
        </div>
        <div className="flex items-center justify-between border-t border-hairline-strong px-4 py-[10px] text-[11px]">
          <span className="text-faint">fermes, dans votre ton</span>
          <span className="font-mono font-semibold text-ink-ecume">
            3 relances prêtes
          </span>
        </div>
      </div>
    </Composition>
  );
}

function EtapeRelance({
  etat,
  etatClass,
  extrait,
}: {
  etat: string;
  etatClass: string;
  extrait: string;
}) {
  return (
    <div className="border-t border-[rgba(16,24,40,0.05)] pt-[9px] first:border-t-0 first:pt-0">
      <span
        className={`inline-block rounded-chip px-2 py-[2px] text-[10.5px] font-semibold ${etatClass}`}
      >
        {etat}
      </span>
      <div className="mt-[5px] text-[11.5px] leading-[1.5] text-body">
        {extrait}
      </div>
    </div>
  );
}

/** Cas « fiche client » : un dossier dormant devenu une fiche d'une page. */
function CompositionFicheClient() {
  return (
    <Composition
      alt="Illustration : un dossier client resté fermé depuis trois mois devient une fiche de synthèse d'une page — historique, encours, points de friction."
      className="w-full max-w-[580px] lg:h-[350px]"
    >
      {/* Dossier client */}
      <div className="w-[252px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-float lg:absolute lg:left-0 lg:top-0 lg:z-[1]">
        <div className="flex items-center justify-between border-b border-[rgba(16,24,40,0.05)] px-[15px] py-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-quiet">
            Dossier client
          </span>
          <span className="font-mono text-[10px] text-quiet">Sarl Bréhat</span>
        </div>
        <div className="px-[15px] pb-[18px] pt-4">
          <div className="flex flex-col gap-[13px]">
            <PileDocuments intitule="Devis 2024" largeurs={["100%", "82%"]} />
            <PileDocuments intitule="Mails · 132" largeurs={["94%", "100%", "71%"]} />
            <PileDocuments intitule="CR visite 03/2025" largeurs={["100%", "88%"]} />
          </div>
          <div className="mt-[14px] text-[11px] leading-[1.5] text-faint">
            dernière ouverture&nbsp;: il y a 3 mois
          </div>
        </div>
      </div>

      <Connector className="lg:absolute lg:left-[265px] lg:top-[160px]" />

      {/* Fiche de synthèse */}
      <div className="w-[280px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface text-ink shadow-hero lg:absolute lg:bottom-0 lg:right-0 lg:z-[3]">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-[13px]">
          <div className="text-[13.5px] font-bold tracking-[-0.01em]">
            Fiche de synthèse
          </div>
          <span className="font-mono text-[10px] text-quiet">Sarl Bréhat</span>
        </div>
        <div className="px-4 pb-[15px] pt-[13px]">
          <div className="flex flex-col gap-[10px] text-[12.5px] leading-[1.5] text-body">
            <Rubrique label="HISTORIQUE">
              Client depuis 2019 · 11 commandes
            </Rubrique>
            <Rubrique label="ENCOURS">
              12&nbsp;400&nbsp;€ · règlement à 45&nbsp;j
            </Rubrique>
            <Rubrique label="FRICTION">
              Litige livraison sept. 2025, résolu
            </Rubrique>
          </div>
          <div
            className="mt-[13px] rounded-[3px] px-3 py-[10px]"
            style={{ background: "#F5F7F9" }}
          >
            <div className="text-[11px] font-bold text-ink">À aborder</div>
            <div className="mt-[5px] text-[11.5px] leading-[1.5] text-body">
              Renouvellement du contrat cadre · échéance octobre
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-hairline-strong px-4 py-[10px] text-[11px]">
          <span className="text-faint">une page, à jour</span>
          <span className="font-mono font-semibold text-ink-ecume">
            prête en 4 min
          </span>
        </div>
      </div>
    </Composition>
  );
}

function PileDocuments({
  intitule,
  largeurs,
}: {
  intitule: string;
  largeurs: string[];
}) {
  return (
    <div>
      <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
        {intitule}
      </div>
      <div className="mt-[7px] flex flex-col gap-[5px]">
        {largeurs.map((largeur, i) => (
          <Bar key={i} width={largeur} />
        ))}
      </div>
    </div>
  );
}

/**
 * Lien secondaire vers « La formation » : idiome du lien turquoise sur l'encre
 * (cf. FAQ) + le chevron des CTA. `min-h-11` porte la cible tactile à 44 px.
 */
function LienProgramme() {
  return (
    <a
      href="#formation"
      className="inline-flex min-h-11 items-center gap-2.5 text-[15px] font-semibold text-turquoise transition-colors hover:text-white motion-reduce:transition-none"
    >
      Voir le programme
      <Chevron />
    </a>
  );
}
