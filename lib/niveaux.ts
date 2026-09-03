import type { Niveau } from "@/components/site/NiveauBloc";
import { CRENEAU_LIEU_COURT, CRENEAUX_COMPACT } from "@/lib/creneaux";

/* ===== CONTENU PROVISOIRE — modèle à remplir =====
   Source de vérité unique des trois niveaux, utilisée par la page
   « Nos formations » (/formations). Pour mettre à
   jour, éditez seulement ce tableau (titre, accroche, points, infos). Les
   couleurs (accent/badge) suivent le kit de marque et n'ont pas à changer —
   chaque paire badgeBg/badgeText est choisie pour rester lisible sur le fond
   encre.
   Pas de prix ici (décision du propriétaire, 29/07/2026 : le prix ne s'annonce
   pas sur le site), aucune promesse chiffrée. Exception du 03/09/2026 : le prix
   « 980 € par personne » s'affiche sur la carte débutant de la section « Les
   formations » de la landing (components/site/FormationsDeuxNiveaux.tsx), et
   nulle part ailleurs — /formations reste sans prix. */
export const NIVEAUX: Niveau[] = [
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
      "Optimiser vos processus",
    ],
    infos: {
      duree: "2 demi-journées · selon votre agenda",
      format: "Présentiel + pratique accompagnée",
      // Créneaux et lieu viennent de lib/creneaux (source de vérité partagée
      // avec la modale de pré-inscription).
      lieu: CRENEAU_LIEU_COURT,
      prochaineSession: CRENEAUX_COMPACT,
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
    // TODO contenu niveau confirmé : les quatre lignes ci-dessous sont des
    // gabarits (le programme n'est pas arrêté).
    points: [
      "Prochainement",
      "Prochainement",
      "Prochainement",
      "Prochainement",
    ],
    infos: {
      duree: "Prochainement",
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
    // Canard plein + texte blanc (4,6:1) : le canard en texte sur l'encre ne
    // passerait pas (3,6:1), et le surlignage canard est l'idiome du site.
    badgeBg: "var(--color-canard)",
    badgeText: "#fff",
    titre: "Construire son propre outil, de A à Z",
    accroche:
      "Concevoir avec l'IA l'outil qui manque à votre entreprise : un ERP maison, bâti sur vos règles métier.",
    // TODO contenu niveau expert : les quatre lignes ci-dessous sont des
    // gabarits (le programme n'est pas arrêté).
    points: [
      "Prochainement",
      "Prochainement",
      "Prochainement",
      "Prochainement",
    ],
    infos: {
      duree: "Prochainement",
      format: "Présentiel",
      prochaineSession: "À venir",
    },
  },
];
