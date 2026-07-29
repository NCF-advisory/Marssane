import type { Niveau } from "@/components/site/NiveauBloc";

/* ===== CONTENU PROVISOIRE — modèle à remplir =====
   Source de vérité unique des trois niveaux, partagée par la page
   « Nos formations » (/formations) et l'escalier d'offres de l'accueil
   (<OffresNiveaux>). Pour mettre à jour, éditez seulement ce tableau (titre,
   accroche, points, infos). Les couleurs (accent/badge) suivent le kit de
   marque et n'ont pas à changer — chaque paire badgeBg/badgeText est choisie
   pour rester lisible sur le fond encre.
   Pas de prix, aucune promesse chiffrée : à préciser plus tard. */
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
      "Vérifier une sortie et savoir ce qu'on peut confier (confidentialité)",
    ],
    infos: {
      duree: "2 demi-journées · selon votre agenda",
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
    // Canard plein + texte blanc (4,6:1) : le canard en texte sur l'encre ne
    // passerait pas (3,6:1), et le surlignage canard est l'idiome du site.
    badgeBg: "var(--color-canard)",
    badgeText: "#fff",
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
