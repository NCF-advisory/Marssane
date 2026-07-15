import type { CSSProperties, ReactNode } from "react";
import { BadgeEcume } from "@/components/ui/BadgeEcume";
import { CheckItem } from "@/components/ui/CheckItem";
import { CasVideo } from "@/components/site/CasVideo";
import { cas1Video, cas2Video, cas3Video } from "@/lib/site-config";

/**
 * Les trois cas concrets (« Ses mails de bout en bout », « Synthétiser &
 * préparer ses réunions », « Automatiser un process »). Chaque cas : une grille
 * 2 colonnes (texte + visuel)
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
      <Cas3 />
    </>
  );
}

/* ============================ Helpers partagés ============================ */

/** Fond quadrillé (.grid-toile, ligne .42) masqué en radial derrière un visuel. */
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
    ["--grid-line" as string]: "rgba(193, 201, 210, 0.42)",
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

/**
 * Glyphe WhatsApp inline (la maquette référence assets/whatsapp-logo.png,
 * absent du projet — décision propriétaire). Tuile arrondie 23px verte avec
 * combiné téléphonique blanc dans une bulle. Décoratif.
 */
function WhatsAppGlyph() {
  return (
    <svg
      aria-hidden
      width="23"
      height="23"
      viewBox="0 0 23 23"
      className="flex-none"
      style={{ display: "block" }}
    >
      <rect width="23" height="23" rx="5" fill="#25D366" />
      <path
        d="M11.5 4.6a6.6 6.6 0 0 0-5.7 9.9L4.8 18.4l4-1.05a6.6 6.6 0 1 0 2.7-12.75Z"
        fill="#fff"
      />
      <path
        d="M9.1 7.6c-.17-.38-.35-.39-.51-.4h-.44a.84.84 0 0 0-.61.29 2.57 2.57 0 0 0-.8 1.91c0 1.13.82 2.22.94 2.37.11.15 1.59 2.55 3.94 3.47 1.95.77 2.35.62 2.77.58.42-.04 1.36-.56 1.55-1.09.19-.53.19-.99.14-1.09-.06-.09-.21-.15-.44-.27-.23-.11-1.36-.67-1.57-.75-.21-.08-.36-.11-.52.12-.15.23-.59.75-.72.9-.13.15-.27.17-.5.06a6.3 6.3 0 0 1-1.85-1.14 6.94 6.94 0 0 1-1.28-1.59c-.13-.23-.01-.35.1-.47.11-.1.23-.27.35-.41.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.41-.06-.11-.51-1.25-.72-1.71Z"
        fill="#25D366"
      />
    </svg>
  );
}

/* ================================= Cas 1 ================================= */

function Cas1() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-5 pt-[58px]">
      <GridDecor side="right" top={40} height={440} maskX="62%" />
      <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
        <div className="max-w-[450px]">
          <BadgeEcume>01</BadgeEcume>
          <h3 className="mt-[14px] text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]">
            Trier, prioriser, répondre à vos mails : votre boîte tenue en un
            passage.
          </h3>
          <div className="mt-5 flex flex-col gap-[9px]">
            <CheckItem>
              Classé selon <b className="font-semibold">vos</b> priorités, pas des
              règles génériques
            </CheckItem>
            <CheckItem>
              Les réponses récurrentes pré-rédigées dans votre ton — vous relisez,
              vous envoyez
            </CheckItem>
            <CheckItem>
              Rien ne part sans vous ; rien n&apos;est supprimé, tout reste
              retrouvable
            </CheckItem>
          </div>
        </div>

        {cas1Video ? (
          <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:justify-self-end">
            <span className="sr-only">
              Illustration : une boîte de 47 mails triée en 6 à traiter ce matin.
            </span>
            <CasVideo video={cas1Video} />
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
                <MailBrut expediteur="Greffe TC" heure="07:58" objet="Convocation — dossier n° 24-118" />
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
                  titre="Greffe TC — convocation"
                />
                <MailTrie
                  badge="À traiter"
                  badgeClass="bg-ecume text-ink-ecume"
                  titre="Confrère — date d'audience"
                />
                <MailTrie
                  badge="En attente"
                  badgeClass="bg-periwinkle text-ink-periwinkle"
                  titre="Client — pièces manquantes"
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
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-5 pt-[74px]">
      <GridDecor side="left" top={50} height={440} maskX="42%" />
      <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
        {cas2Video ? (
          <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:justify-self-start">
            <span className="sr-only">
              Illustration : un PDF de 42 pages résumé en une synthèse de 12
              lignes.
            </span>
            <CasVideo video={cas2Video} />
          </div>
        ) : (
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
                  Synthèse — bail commercial
                </div>
                <span className="rounded-chip bg-ecume px-2 py-1 font-mono text-[10px] text-ink-ecume">
                  12 lignes
                </span>
              </div>
              <div className="px-4 pb-[15px] pt-[13px]">
                <div className="flex flex-col gap-[10px] text-[12.5px] leading-[1.5] text-body">
                  <Rubrique label="DURÉE">
                    9 ans, résiliation triennale — préavis 6 mois
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
          <BadgeEcume>02</BadgeEcume>
          <h3 className="mt-[14px] text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]">
            Synthétiser vos documents et préparer vos réunions, dans votre ton.
          </h3>
          <div className="mt-5 flex flex-col gap-[9px]">
            <CheckItem>La demande se formule en français, pas en informatique</CheckItem>
            <CheckItem>Mise en forme et ton fidèles à vos rapports habituels</CheckItem>
            <CheckItem>
              Chaque affirmation renvoie à sa page source — vous vérifiez avant de
              présenter
            </CheckItem>
          </div>
        </div>
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

/* ================================= Cas 3 ================================= */

function Cas3() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-5 pt-[74px]">
      <GridDecor side="right" top={40} height={460} maskX="60%" />
      <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
        <div className="max-w-[450px]">
          <BadgeEcume>03</BadgeEcume>
          <h3 className="mt-[14px] text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]">
            Automatiser un process de votre travail.
          </h3>
          <div className="mt-5 flex flex-col gap-[9px]">
            <CheckItem>Relancer les factures impayées et les devis sans réponse</CheckItem>
            <CheckItem>Collecter et classer les pièces d&apos;un nouveau dossier</CheckItem>
            <CheckItem>Préparer le reporting mensuel à partir de vos fichiers</CheckItem>
          </div>
        </div>

        {cas3Video ? (
          <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:justify-self-end">
            <span className="sr-only">
              Illustration : un process répétitif transformé en enchaînement
              automatisé (relances, pièces, reporting).
            </span>
            <CasVideo video={cas3Video} />
          </div>
        ) : (
          <Visuel
            alt="Illustration : un process répétitif transformé en enchaînement automatisé (relances, pièces, reporting)."
            className="lg:h-[452px]"
          >
          {/* Conversation WhatsApp */}
            <div className="w-[262px] max-w-full overflow-hidden rounded-[9px] border border-hairline bg-surface shadow-float lg:absolute lg:left-[2px] lg:top-2 lg:z-[1]">
              <div className="flex items-center gap-[9px] px-3 py-[9px]" style={{ background: "#075E54" }}>
                <WhatsAppGlyph />
                <div className="min-w-0 leading-[1.2]">
                  <div className="text-[12.5px] font-semibold text-white">Mon assistant</div>
                  <div className="text-[9.5px]" style={{ color: "rgba(255,255,255,.62)" }}>
                    en ligne
                  </div>
                </div>
                <span
                  aria-hidden
                  className="ml-auto text-[15px] leading-none"
                  style={{ color: "rgba(255,255,255,.5)" }}
                >
                  ⋮
                </span>
              </div>
              <div
                className="flex flex-col gap-2 px-3 pb-[13px] pt-[14px]"
                style={{ background: "#ECE5DD" }}
              >
                {/* Note vocale */}
                <div
                  className="self-stretch px-[10px] pb-[7px] pt-2"
                  style={{
                    background: "#DCF8C6",
                    borderRadius: "9px 2px 9px 9px",
                    boxShadow: "0 1px 1px rgba(0,0,0,.09)",
                  }}
                >
                  <div className="flex items-center gap-[9px]">
                    <span
                      className="inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full text-[10px] text-white"
                      style={{ background: "#00A884" }}
                    >
                      ▶
                    </span>
                    <div className="relative flex h-[22px] flex-1 items-center gap-[2px]">
                      <Wave h="36%" c="#00A884" />
                      <Wave h="64%" c="#00A884" />
                      <Wave h="48%" c="#00A884" />
                      <Wave h="82%" c="#8FA98B" />
                      <Wave h="56%" c="#8FA98B" />
                      <Wave h="100%" c="#8FA98B" />
                      <Wave h="70%" c="#8FA98B" />
                      <Wave h="44%" c="#8FA98B" />
                      <Wave h="66%" c="#8FA98B" />
                      <Wave h="30%" c="#8FA98B" />
                      <Wave h="52%" c="#8FA98B" />
                      <Wave h="38%" c="#8FA98B" />
                      <span
                        className="absolute left-[24%] top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          background: "#00A884",
                          border: "1.5px solid #fff",
                          boxShadow: "0 0 0 .5px rgba(0,0,0,.08)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-[5px] flex items-center justify-between">
                    <span className="inline-flex items-center gap-[5px] text-[10.5px] text-faint">
                      <span
                        className="relative top-[1px] inline-block h-[9px] w-[5px] rounded-[3px]"
                        style={{ background: "#7A828E" }}
                      />
                      <span className="font-mono">0:42</span>
                    </span>
                    <span className="font-mono text-[9.5px] text-quiet">18:06</span>
                  </div>
                </div>
                {/* Transcription */}
                <div
                  className="max-w-[96%] self-start rounded-[9px] px-[10px] py-2"
                  style={{ background: "#F4F1EA" }}
                >
                  <div
                    className="font-mono text-[8.5px] uppercase tracking-[0.08em]"
                    style={{ color: "#00A884" }}
                  >
                    Transcription auto
                  </div>
                  <div className="mt-1 text-[11.5px] leading-[1.45] text-body">
                    « Courrier au bailleur : rappel de l&apos;échéance du bail,
                    demande de renouvellement, mêmes conditions… »
                  </div>
                </div>
              </div>
            </div>

            <Connector className="lg:absolute lg:left-[330px] lg:top-[80px]" />

            {/* Courrier généré */}
            <div className="w-[308px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface shadow-hero lg:absolute lg:bottom-[6px] lg:right-0 lg:z-[3]">
              <div className="flex items-center justify-between border-b border-hairline px-[17px] pb-3 pt-[14px]">
                <div>
                  <div className="text-[14px] font-bold tracking-[-0.01em]">
                    Courrier — Renouvellement de bail
                  </div>
                  <div className="mt-[2px] font-mono text-[10.5px] text-quiet">
                    dossier bail · brouillon v1
                  </div>
                </div>
                <span className="whitespace-nowrap rounded-chip bg-ecume px-2 py-1 font-mono text-[10px] text-ink-ecume">
                  auto
                </span>
              </div>
              <div className="px-[17px] py-[14px]">
                <div className="text-[12.5px] leading-[1.6] text-body">
                  Madame, Monsieur,
                  <br />
                  Le bail commercial nous liant arrive à échéance le 31 mars
                  prochain. Conformément à nos échanges, nous souhaitons solliciter
                  son renouvellement aux conditions actuelles…
                </div>
                <div className="mt-3 flex flex-col gap-[7px]">
                  <Bar width="100%" />
                  <Bar width="94%" />
                  <Bar width="64%" />
                </div>
                <div className="mt-[14px] flex items-center justify-between">
                  <span className="text-[11px] text-faint">Brouillon · à valider</span>
                  <span className="rounded-[3px] bg-canard px-[15px] py-[7px] text-[12px] font-semibold text-white">
                    Relire &amp; signer
                  </span>
                </div>
              </div>
            </div>
          </Visuel>
        )}
      </div>
    </section>
  );
}

/** Barre de la forme d'onde (note vocale). */
function Wave({ h, c }: { h: string; c: string }) {
  return (
    <i className="flex-1 rounded-[2px]" style={{ height: h, background: c }} />
  );
}
