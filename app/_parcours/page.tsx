import Link from "next/link";
import { createPublicMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { beginnerCourse, COURSE_ID, webPage } from "@/lib/structured-data";
import { FORMATION_DUREE, CRENEAU_LIEU } from "@/lib/creneaux";
import { Footer } from "@/components/site/Footer";
import { CheckItem } from "@/components/ui/CheckItem";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

const title = "Programme formation IA débutant : 7 h près de Lyon | Marssane";
const description = "Le programme IA débutant Marssane : 2 séances de 3 h 30, pratique accompagnée, prompts, tri des mails et construction de votre automatisation métier.";
export const metadata = createPublicMetadata({ title, description, path: "/parcours" });

/* ===== PAGE MASQUÉE =====
   Conservée dans un dossier privé Next.js, sans route publique.
   Roadmap visuelle de la formation débutant (parcours v2, grandes étapes).
   Purement informative : aucun CTA de réservation (décision du 29/07/2026).
   Contenu aligné sur `02 Formations/formation-1-debutant-classique.md` —
   à mettre à jour ensemble. */

type Etape = {
  titre: string;
  detail: string;
};

type Phase = {
  /** Libellé du badge mono, repris du vocabulaire de la landing. */
  badge: string;
  /** Durée / rythme, affiché à côté du badge. */
  rythme: string;
  titre: string;
  etapes: Etape[];
  /** Paire fond/texte du badge et couleur d'accent des nœuds, choisies pour
   *  rester lisibles sur l'encre (mêmes paires que les niveaux de formation). */
  badgeBg: string;
  badgeText: string;
  accent: string;
};

const PHASES: Phase[] = [
  {
    badge: "Session 1 · Général",
    rythme: "Séance 1 · 3 h 30",
    titre: "Vous apprenez les bases et construisez le premier système",
    badgeBg: "var(--color-ecume)",
    badgeText: "var(--color-ink-ecume)",
    accent: "var(--color-turquoise)",
    etapes: [
      {
        titre: "Accueil & démonstration",
        detail:
          "Tour de table, puis une démonstration en accroche : voilà où ça peut mener.",
      },
      {
        titre: "Les bases",
        detail:
          "Choisir le bon modèle, poser son contexte métier, formuler et corriger un prompt. Et savoir où vont vos données.",
      },
      {
        titre: "L'IA au travail",
        detail:
          "Confier de premières tâches concrètes : fichiers, mails, recherche.",
      },
      {
        titre: "Votre premier skill",
        detail:
          "Construction guidée du skill de tri de mails — en français, sans code.",
      },
      {
        titre: "Les connecteurs",
        detail:
          "Brancher la messagerie : le tri automatique et le brief du matin tournent de bout en bout, en salle.",
      },
      {
        titre: "Mission & premier quiz",
        detail:
          "La mission à réaliser entre les deux sessions, et un QCM pour valider les acquis à chaud.",
      },
    ],
  },
  {
    badge: "Entre les deux · à votre rythme",
    rythme: "Pratique accompagnée",
    titre: "Vous transposez sur votre propre boîte mail",
    badgeBg: "var(--color-periwinkle)",
    badgeText: "var(--color-ink-periwinkle)",
    accent: "var(--color-lavande)",
    etapes: [
      {
        titre: "Le système chez vous",
        detail:
          "Connecter sa propre messagerie, adapter le skill : le tri et le brief du matin tournent en réel.",
      },
      {
        titre: "Chat commun",
        detail:
          "Un chat ouvert avec le groupe et le formateur pour poser ses questions au fil de l'eau.",
      },
      {
        titre: "FAQ groupée",
        detail:
          "À mi-parcours, le formateur reprend les questions du groupe en une réponse commune.",
      },
      {
        titre: "Repérer sa tâche",
        detail:
          "Chacun identifie la tâche de son quotidien qu'il automatisera en session 2.",
      },
    ],
  },
  {
    badge: "Session 2 · Votre cas",
    rythme: "Séance 2 · 3 h 30",
    titre: "Vous construisez votre cas personnel et le démontrez",
    badgeBg: "var(--color-canard)",
    badgeText: "#fff",
    accent: "var(--color-canard)",
    etapes: [
      {
        titre: "Retour d'expérience",
        detail:
          "Tour des réussites et des blocages, repris en démonstration devant le groupe.",
      },
      {
        titre: "Mini-audit de vos tâches",
        detail:
          "Chacun choisit et cadre son cas d'automatisation personnel : automatisation, skill, connecteur.",
      },
      {
        titre: "Construction de votre cas",
        detail:
          "Construction accompagnée ; le formateur circule, les avancés aident.",
      },
      {
        titre: "Démonstrations croisées",
        detail:
          "Chacun démontre son cas au groupe : dix cas vus au lieu d'un.",
      },
      {
        titre: "Quiz final & clôture",
        detail:
          "Plan d'action personnel, QCM 2, évaluation et remise du certificat de participation.",
      },
    ],
  },
];

/** Ce avec quoi chaque participant repart (promesse du parcours v2). */
const ACQUIS = [
  "Une boîte mail qui se trie toute seule, et le compte rendu des urgences chaque matin",
  "Un cas d'automatisation personnel qui tourne, démontré devant le groupe",
  "La méthode pour recommencer sur vos prochaines tâches",
  "Un certificat de participation",
];

export default function Parcours() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { ...webPage({ path: "/parcours", name: title, description }), mainEntity: { "@id": COURSE_ID } },
        beginnerCourse(),
      ] }} />
      <main>
        <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-[90px] pt-[72px] sm:px-10">
          {/* Repères décoratifs de la toile, comme sur les sections de la landing. */}
          <PlusMark
            variant="grey-sur-ink"
            size={16}
            className="absolute right-[130px] top-[60px] hidden lg:block"
          />

          <Breadcrumbs items={[{ name: "Formations IA", path: "/formations" }, { name: "Programme débutant", path: "/parcours" }]} />
          <div className="max-w-[640px]">
            <Kicker className="text-faint-sur-ink!">
              Formation débutant · le parcours
            </Kicker>
            <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
              Votre formation IA,{" "}
              <span className="inline-block">
                <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
                  étape par étape
                  <span
                    aria-hidden
                    className="absolute right-[-0.62em] top-[-0.5em] text-[0.64em] font-medium leading-none text-turquoise"
                  >
                    +
                  </span>
                </span>
                .
              </span>
            </h1>
            <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body-sur-ink">
              {FORMATION_DUREE}, avec une pratique accompagnée entre les deux.
              Formation en présentiel au {CRENEAU_LIEU}, près de Lyon,
              animée par Cléante Oullion, fondateur de Marssane.
              Voici le chemin, du premier prompt au cas personnel démontré devant le groupe.
            </p>
          </div>

          <p className="mt-5 max-w-[640px] text-[14.5px] leading-[1.6] text-body-sur-ink">
            Ce programme s’adresse aux dirigeants et entrepreneurs débutants.
            Prévoyez votre ordinateur et un abonnement Claude Pro actif.
            Retrouvez les <Link href="/formations#debutant" className="underline underline-offset-4 hover:text-turquoise">dates et modalités de la formation débutant</Link>.
          </p>

          {/* ===== Roadmap ===== */}
          <div className="mt-[44px] flex flex-col gap-[52px]">
            {PHASES.map((phase) => (
              <section key={phase.badge} aria-label={phase.badge}>
                {/* En-tête de phase : badge + rythme, puis titre. */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span
                    className="inline-flex items-center rounded-chip px-[11px] py-[5px] font-mono text-[11px] uppercase tracking-[0.12em]"
                    style={{
                      backgroundColor: phase.badgeBg,
                      color: phase.badgeText,
                    }}
                  >
                    {phase.badge}
                  </span>
                  <span className="font-mono text-[12px] text-faint-sur-ink">
                    {phase.rythme}
                  </span>
                </div>
                <h2 className="mt-4 max-w-[640px] text-[21px] font-extrabold leading-[1.2] tracking-[-0.015em] sm:text-[24px]">
                  {phase.titre}
                </h2>

                {/* Frise : fil vertical à gauche, un nœud numéroté par étape.
                    Le fil est porté par l'`ol` (border-l) ; chaque nœud est un
                    disque posé à cheval sur le fil (`-left`), teinté à
                    l'accent de la phase. */}
                <ol className="mt-6 flex flex-col gap-5 border-l border-line-sur-ink pl-7 sm:pl-9">
                  {phase.etapes.map((etape, j) => (
                    <li key={etape.titre} className="relative">
                      <span
                        aria-hidden
                        className="absolute -left-[41px] top-[2px] inline-flex h-[26px] w-[26px] items-center justify-center rounded-full font-mono text-[11.5px] font-semibold sm:-left-[49px]"
                        style={{
                          backgroundColor: "var(--color-surface-sur-ink)",
                          border: `1.5px solid ${phase.accent}`,
                          color: "#fff",
                        }}
                      >
                        {j + 1}
                      </span>
                      <h3 className="text-[16.5px] font-bold leading-[1.35] tracking-[-0.01em]">
                        {etape.titre}
                      </h3>
                      <p className="mt-1 max-w-[560px] text-[14.5px] leading-[1.55] text-body-sur-ink">
                        {etape.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          {/* ===== Arrivée : ce avec quoi vous repartez ===== */}
          <div className="mt-[52px] max-w-[720px] rounded-card border border-line-sur-ink bg-surface-sur-ink p-6 sm:p-8">
            <Kicker className="text-faint-sur-ink!">À l&apos;arrivée</Kicker>
            <h2 className="mt-3 text-[21px] font-extrabold leading-[1.2] tracking-[-0.015em] sm:text-[24px]">
              Vous repartez avec
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              {ACQUIS.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </div>
          </div>

          <p className="mt-8 max-w-[640px] text-[13px] leading-[1.55] text-faint-sur-ink">
            Groupe de dix participants, chacun sur son ordinateur. Aucun
            prérequis technique.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
