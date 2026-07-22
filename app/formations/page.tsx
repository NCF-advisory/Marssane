import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { NiveauBloc, type Niveau } from "@/components/site/NiveauBloc";
import { ReservationDialog } from "@/components/site/ReservationDialog";
import { ScrollCue } from "@/components/site/ScrollCue";
import { Kicker } from "@/components/ui/Kicker";
import { champSession } from "@/lib/session-display";
import { getProchaineSessionSafe } from "@/lib/sessions";

// Dynamique contrôlée (comme l'accueil) : la modale affiche la prochaine session.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nos formations · Marssane",
  description:
    "Trois niveaux de formation à l'IA (Débutant, Confirmé, Expert) pour progresser à son rythme, des premiers usages jusqu'à l'outil construit sur mesure.",
};

/* ===== CONTENU PROVISOIRE — modèle à remplir =====
   Source de vérité unique de la page : un objet par niveau. Pour mettre à jour,
   éditez seulement ce tableau (titre, accroche, points, infos). Les couleurs
   (accent/badge) suivent le kit de marque et n'ont pas à changer.
   Pas de prix, aucune promesse chiffrée : à préciser plus tard. */
const NIVEAUX: Niveau[] = [
  {
    id: "debutant",
    numero: "01",
    nom: "Débutant",
    accent: "var(--color-turquoise)",
    accentText: "var(--color-ink-ecume)",
    badgeBg: "var(--color-ecume)",
    badgeText: "var(--color-ink-ecume)",
    titre: "Prendre en main l'IA au quotidien",
    accroche:
      "Construire son premier système : une boîte mail qui se trie toute seule, et la méthode pour recommencer.",
    points: [
      "Choisir le bon modèle et formuler le bon prompt",
      "Confier à Claude des tâches concrètes : fichiers, mails, recherche",
      "Créer un skill réutilisable et brancher un connecteur",
      "Vérifier une sortie et savoir ce qu'on peut confier (confidentialité)",
    ],
    infos: {
      duree: "2 demi-journées · 8 h 45",
      format: "Présentiel + pratique accompagnée",
      prochaineSession: "À venir",
    },
  },
  {
    id: "confirme",
    numero: "02",
    nom: "Confirmé",
    accent: "var(--color-lavande)",
    accentText: "var(--color-ink-periwinkle)",
    badgeBg: "var(--color-periwinkle)",
    badgeText: "var(--color-ink-periwinkle)",
    titre: "Structurer ses usages et gagner du temps",
    accroche:
      "Passer des usages ponctuels à des méthodes fiables, réutilisables au fil des journées.",
    points: [
      "Construire des consignes réutilisables",
      "Enchaîner plusieurs tâches sans se perdre",
      "Fiabiliser ses résultats et savoir les vérifier",
      "Partager ses méthodes avec son équipe",
    ],
    infos: {
      duree: "1 journée",
      format: "Présentiel",
      prochaineSession: "À venir",
    },
  },
  {
    id: "expert",
    numero: "03",
    nom: "Expert",
    accent: "var(--color-canard)",
    accentText: "#fff",
    badgeBg: "rgba(14, 114, 145, 0.1)",
    badgeText: "var(--color-canard)",
    titre: "Construire son propre outil, de A à Z",
    accroche:
      "Concevoir avec l'IA l'outil qui manque à votre entreprise : un ERP maison, bâti sur vos règles métier.",
    points: [
      "Cadrer son outil : besoins, données, règles métier",
      "Construire un ERP maison avec Claude, sans être développeur",
      "Le connecter à ses données réelles : mails, fichiers, tableurs",
      "Fiabiliser, faire évoluer et garder le contrôle",
    ],
    infos: {
      duree: "À définir",
      format: "Présentiel",
      prochaineSession: "À venir",
    },
  },
];

export default async function Formations() {
  const session = await getProchaineSessionSafe();

  return (
    <>
      {/* `snap-page-formations` active le scroll-snap racine, ciblé sur cette
          page via `html:has(...)` dans globals.css (aucune fuite ailleurs). */}
      <main className="snap-page-formations">
        {/* Nav figée hors flux (fixed) : reste visible en haut pendant tout le
            scroll. `fixed` plutôt que `sticky` car WebKit gère mal sticky +
            scroll-snap racine (la nav était défilée hors écran dans Safari).
            Fond de page translucide + flou pour rester lisible sur les cartes. */}
        <div className="fixed inset-x-0 top-0 z-50 bg-toile/80 backdrop-blur-md">
          <Nav />
        </div>
        {/* Écran 1 : intro centrée verticalement (reste sous la nav grâce au
            centrage ; la nav est hors flux et démarre l'intro à y=0). */}
        <section className="flex min-h-[100dvh] flex-col snap-start">
          <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col justify-center px-6 pb-16 sm:px-10">
            <div className="max-w-[640px]">
              <Kicker>Nos formations</Kicker>
              <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
                Trois niveaux, un même cap : l&apos;IA au travail.
              </h1>
              <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body">
                Chacun progresse à son rythme, des premiers usages jusqu&apos;à
                l&apos;outil construit sur mesure.
              </p>
            </div>
            <div className="mt-16 flex justify-center">
              <ScrollCue cibleId="debutant" />
            </div>
          </div>
        </section>

        {/* Écrans 2–4 : un plein écran snappé par niveau. */}
        <NiveauBloc niveaux={NIVEAUX} />
      </main>
      {/* Un dernier cran de scroll amène le pied de page en vue. */}
      <div className="snap-end">
        <Footer />
      </div>
      <ReservationDialog
        sessionLabel={champSession(session)}
        sessionComplete={session?.complete ?? false}
      />
    </>
  );
}
