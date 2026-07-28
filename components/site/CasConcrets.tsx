import type { CSSProperties, ReactNode } from "react";
import { BadgeEcume } from "@/components/ui/BadgeEcume";
import { CasVisuel } from "@/components/site/CasVisuel";
import { cas1Visuel, cas2Visuel } from "@/lib/site-config";

/**
 * Les deux cas concrets (« Ses mails de bout en bout », « Le devis qui part
 * avant la concurrence »). Chaque cas :
 * une grille 2 colonnes (texte + visuel)
 * qui s'empile sous lg (texte d'abord, visuel ensuite). Les visuels sont des
 * compositions purement décoratives (aria-hidden) doublées d'un texte sr-only.
 *
 * Responsive : sous lg, les cartes absolues repassent en flux (flex-col centré,
 * connecteur entre les deux) et sont bornées par max-w-full pour ne jamais
 * déborder à 360px ; le fond quadrillé décoratif est masqué. La passe fine est T7.
 */
export function CasConcrets() {
  return (
    <>
      <Cas1 />
      <Cas2 />
    </>
  );
}

/* ============================ Helpers partagés ============================ */

/** Override écume des badges 01/02 sur fond encre : la teinte pleine
 *  brûlerait, on garde l'écume en texte sur un fond en alpha très faible (même
 *  traitement que la « zone optimale » du graphe de /quelle-ia). */
const BADGE_SUR_INK = "bg-ecume-sur-ink! text-ecume!";

/** Fond quadrillé (.grid-toile, ligne un peu plus discrète que le filigrane par
 *  défaut) masqué en radial derrière un visuel. */
function GridDecor({
  side,
  top,
  height,
  maskX,
}: {
  side: "left" | "right";
  top: number;
  height: number;
  maskX: string;
}) {
  const mask = `radial-gradient(72% 70% at ${maskX} 45%, #000, transparent 78%)`;
  const style: CSSProperties = {
    position: "absolute",
    top: `${top}px`,
    bottom: "auto",
    left: side === "left" ? 0 : "auto",
    right: side === "right" ? 0 : "auto",
    width: "540px",
    height: `${height}px`,
    WebkitMaskImage: mask,
    maskImage: mask,
    ["--grid-line" as string]: "rgba(255, 255, 255, 0.05)",
  };
  return <div aria-hidden className="grid-toile -z-[1] hidden lg:block" style={style} />;
}

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

/** Ligne d'auto-identification sous la phrase-réponse : label « Vécu chez » +
 *  chips secteurs (surface encre). Aide le lecteur à se reconnaître dans le cas. */
function VecuChez({ secteurs }: { secteurs: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint-sur-ink">
        Vécu chez
      </span>
      {secteurs.map((s) => (
        <span
          key={s}
          className="rounded-chip bg-surface-sur-ink px-2 py-[3px] font-mono text-[10.5px] text-faint-sur-ink"
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
 * Colonne visuelle : texte alternatif sr-only + composition décorative.
 * Sous lg, la composition passe en flux (flex-col centré, cartes empilées avec
 * le connecteur au milieu) ; à partir de lg elle redevient un bloc à positions
 * absolues (hauteur fixe portée par `className`).
 */
function Visuel({
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

/* ================================= Cas 1 ================================= */

function Cas1() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-5 pt-[58px] sm:px-10">
      <GridDecor side="right" top={40} height={440} maskX="62%" />
      <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
        <div className="max-w-[450px]">
          <BadgeEcume className={BADGE_SUR_INK}>01</BadgeEcume>
          <h3 className="mt-[14px] text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]">
            Relancé{" "}
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              25 fois
            </span>{" "}
            par le même client ?
          </h3>
          <p className="mt-4 max-w-[420px] text-[16.5px] leading-[1.58] text-body-sur-ink">
            Votre boîte se trie toute seule : il ne reste que les 6 mails qui
            comptent, les réponses pré-rédigées dans votre ton. Rien ne part sans
            vous.
          </p>
          <VecuChez secteurs={["Experts-comptables", "Services B2B", "Juridique"]} />
        </div>

        {cas1Visuel ? (
          <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:justify-self-end">
            <CasVisuel visuel={cas1Visuel} />
          </div>
        ) : (
          <Visuel
            alt="Illustration : une boîte de 47 mails triée en 6 à traiter ce matin."
            className="lg:h-[430px]"
          >
          {/* Boîte brute */}
            <div className="w-[252px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface shadow-float lg:absolute lg:left-0 lg:top-[6px] lg:z-[1]">
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

            <Connector className="lg:absolute lg:left-[296px] lg:top-[88px]" />

            {/* Boîte triée */}
            <div className="w-[280px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface shadow-hero lg:absolute lg:bottom-[6px] lg:right-0 lg:z-[3]">
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
          </Visuel>
        )}
      </div>
    </section>
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

/* ================================= Cas 2 ================================= */

function Cas2() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-5 pt-[74px] sm:px-10">
      <GridDecor side="left" top={50} height={440} maskX="42%" />
      <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
        {cas2Visuel ? (
          <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:justify-self-start">
            <CasVisuel visuel={cas2Visuel} />
          </div>
        ) : (
          /* Composition de secours héritée de l'ancien cas 02 (« synthèse de
             42 pages ») : à retravailler sur le thème du devis si cas2Visuel
             repasse à null. L'alt décrit la composition telle qu'elle est. */
          <Visuel
            alt="Illustration : un PDF de 42 pages résumé en une synthèse de 12 lignes."
            className="lg:h-[430px]"
          >
          {/* Document PDF */}
            <div className="w-[236px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface shadow-float lg:absolute lg:left-[6px] lg:top-0 lg:z-[1]">
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

            <Connector className="lg:absolute lg:left-[290px] lg:top-[76px]" />

            {/* Synthèse */}
            <div className="w-[300px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface shadow-hero lg:absolute lg:bottom-0 lg:right-0 lg:z-[3]">
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
          </Visuel>
        )}

        <div className="order-first max-w-[450px] lg:order-last lg:justify-self-end">
          <BadgeEcume className={BADGE_SUR_INK}>02</BadgeEcume>
          <h3 className="mt-[14px] text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]">
            Le devis part à 22 h, le client a signé{" "}
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              ailleurs
            </span>{" "}
            ?
          </h3>
          <p className="mt-4 max-w-[420px] text-[16.5px] leading-[1.58] text-body-sur-ink">
            Une note vocale entre deux rendez-vous, et le devis chiffré est prêt
            à valider : vos prix, vos conditions, votre mise en page. Le premier
            qui répond signe.
          </p>
          <VecuChez secteurs={["BTP", "Plomberie", "Industrie"]} />
        </div>
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
 * (cf. FAQ) + la flèche des CTA. `min-h-11` porte la cible tactile à 44 px.
 */
function LienProgramme() {
  return (
    <a
      href="#formation"
      className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-turquoise transition-colors hover:text-white motion-reduce:transition-none"
    >
      Voir le programme
      <span aria-hidden className="text-[1.1em] leading-none">
        →
      </span>
    </a>
  );
}
