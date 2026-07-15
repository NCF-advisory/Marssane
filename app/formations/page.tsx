import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { NiveauBloc, type Niveau } from "@/components/site/NiveauBloc";
import { ReservationDialog } from "@/components/site/ReservationDialog";
import { Kicker } from "@/components/ui/Kicker";
import { champSession } from "@/lib/session-display";
import { getProchaineSessionSafe } from "@/lib/sessions";

// Dynamique contrôlée (comme l'accueil) : la modale affiche la prochaine session.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nos formations — Marssane",
  description:
    "Trois niveaux de formation à l'IA — Débutant, Confirmé, Expert — pour progresser à son rythme, des premiers usages jusqu'à l'automatisation.",
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
    badgeBg: "var(--color-ecume)",
    badgeText: "var(--color-ink-ecume)",
    titre: "Prendre en main l'IA au quotidien",
    accroche:
      "Découvrir les usages concrets et gagner en aisance sur les tâches de tous les jours.",
    points: [
      "Comprendre ce que l'IA sait faire — et ce qu'elle ne fait pas",
      "Rédiger, résumer et chercher sur ses propres documents",
      "Installer et connecter l'outil en confiance",
      "Repartir avec ses premiers réflexes",
    ],
    infos: {
      duree: "1 journée",
      format: "Présentiel",
      prochaineSession: "À venir",
    },
  },
  {
    id: "confirme",
    numero: "02",
    nom: "Confirmé",
    accent: "var(--color-lavande)",
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
    badgeBg: "rgba(14, 114, 145, 0.1)",
    badgeText: "var(--color-canard)",
    titre: "Automatiser et passer à l'échelle",
    accroche:
      "Concevoir des automatisations robustes et diffuser les bons usages dans l'organisation.",
    points: [
      "Automatiser des processus de bout en bout",
      "Encadrer les usages et la confidentialité",
      "Mesurer et améliorer ses automatisations",
      "Accompagner la montée en compétence des équipes",
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
      <Nav />
      <main className="pt-6">
        <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-6 sm:px-10">
          <div className="max-w-[640px]">
            <Kicker>Nos formations</Kicker>
            <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
              Trois niveaux, un même cap : l&apos;IA au travail.
            </h1>
            <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body">
              Chacun progresse à son rythme, des premiers usages jusqu&apos;à
              l&apos;automatisation.
            </p>
          </div>

          <NiveauBloc niveaux={NIVEAUX} />
        </section>
      </main>
      <Footer />
      <ReservationDialog
        sessionLabel={champSession(session)}
        sessionComplete={session?.complete ?? false}
      />
    </>
  );
}
