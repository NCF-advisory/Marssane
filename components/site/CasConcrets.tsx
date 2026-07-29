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
 * surlignage canard, réservé au H2 du chapeau) → description → chips secteurs →
 * visuel en dessous. Rien d'autre.
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
  secteurs: string[];
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
    secteurs: ["Experts-comptables", "Services B2B", "Juridique"],
    visuel: null,
    composition: <CompositionMails />,
  },
  {
    titreCourt: "Le devis part à 22 h",
    titre: "Le devis part à 22 h, le client a signé ailleurs\u00A0?",
    description:
      "Une note vocale entre deux rendez-vous, et le devis chiffré est prêt à valider. Le premier qui répond signe.",
    secteurs: ["BTP", "Plomberie", "Industrie"],
    visuel: null,
  },
  {
    titreCourt: "Un contrat de 42 pages à éplucher",
    titre: "Un contrat de 42 pages à éplucher avant de signer\u00A0?",
    description:
      "Une synthèse de 12 lignes, les points d’attention sourcés page par page.",
    secteurs: ["Commerce", "Immobilier", "Juridique"],
    visuel: null,
    composition: <CompositionSynthese />,
  },
  {
    titreCourt: "Deux heures de réunion, zéro compte-rendu",
    titre: "Deux heures de réunion, zéro compte-rendu\u00A0?",
    description:
      "L’enregistrement devient un CR structuré : décisions, qui fait quoi, pour quand.",
    secteurs: ["Agences", "Cabinets", "Associations"],
    visuel: null,
  },
  {
    titreCourt: "L’impayé qui traîne depuis 60 jours",
    titre: "L’impayé traîne depuis 60 jours\u00A0?",
    description:
      "Des relances graduées, fermes mais dans votre ton, prêtes à partir au bon rythme.",
    secteurs: ["Artisans", "Services B2B", "Commerce"],
    visuel: null,
  },
  {
    titreCourt: "Le rendez-vous dans 20 minutes",
    titre: "Rendez-vous dans 20 minutes, dossier pas rouvert depuis 3 mois\u00A0?",
    description:
      "Une fiche de synthèse client : historique, encours, points de friction, en une page.",
    secteurs: ["Conseil", "Assurance", "Artisans"],
    visuel: null,
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
          n'est pas une grille : la déclaration y est inerte. */}
      <div
        data-apparition=""
        style={{
          ["--apparition-delai" as string]: "150ms",
          gridTemplateRows: `repeat(${CAS.length}, auto)`,
        }}
        className="mt-[30px] overflow-hidden rounded-card border border-line-sur-ink bg-white/[0.02] lg:grid lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]"
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
                <span
                  aria-hidden
                  className={`flex-none text-[14px] leading-none transition-transform duration-150 group-hover:translate-x-[2px] motion-reduce:transition-none ${
                    ouvert ? "text-turquoise" : "text-faint-sur-ink"
                  }`}
                >
                  →
                </span>
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
                <VecuChez secteurs={cas.secteurs} />
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

/** Connecteur pointillé canard + pastille ↓. Positionné en absolu sous lg. */
function Connector({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`z-[2] flex flex-col items-center gap-[5px] ${className ?? ""}`}
    >
      <span
        className="h-[26px] w-[1.5px]"
        style={{
          background:
            "repeating-linear-gradient(180deg,#0E7291 0 5px,rgba(14,114,145,0) 5px 9px)",
        }}
      />
      <span
        className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-full bg-canard text-[13px] text-white"
        style={{ boxShadow: "0 8px 18px -6px rgba(14,114,145,.6)" }}
      >
        ↓
      </span>
    </div>
  );
}

/** Ligne d'auto-identification sous la description : label « Vécu chez » + chips
 *  secteurs. Aide le lecteur à se reconnaître dans le cas, sans concurrencer le
 *  titre du panneau : filet discret plutôt qu'une surface pleine. */
function VecuChez({ secteurs }: { secteurs: string[] }) {
  return (
    <div className="mt-[14px] flex flex-wrap items-center gap-[6px]">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint-sur-ink">
        Vécu chez
      </span>
      {secteurs.map((s) => (
        <span
          key={s}
          className="rounded-chip border border-line-sur-ink px-[7px] py-[2px] font-mono text-[10px] text-faint-sur-ink"
        >
          {s}
        </span>
      ))}
    </div>
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

      <Connector className="lg:absolute lg:left-[263px] lg:top-[142px]" />

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

      <Connector className="lg:absolute lg:left-[245px] lg:top-[142px]" />

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
