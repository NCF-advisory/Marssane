export const DEMONSTRATIONS = {
  mails: {
    titre: "Du mail reçu au brouillon prêt à valider",
    etapes: ["Réception", "Classement", "Brouillon"],
    legendes: ["Trois messages arrivent dans votre boîte de réception.", "Chaque demande est classée selon son contenu et vos priorités.", "Une réponse est préparée. Vous la relisez avant l’envoi."],
    resultat: "Les messages sont classés et la réponse est prête à relire.",
  },
  documents: {
    titre: "D’un dossier à ses points essentiels",
    etapes: ["Documents", "Analyse", "Synthèse"],
    legendes: ["Le devis et le cahier des charges sont réunis dans un dossier.", "L’IA repère les informations utiles et les relie à leurs sources.", "Vous retrouvez les points clés et une question à clarifier."],
    resultat: "Une synthèse courte, avec les sources pour vérifier.",
  },
  assistant: {
    titre: "D’une question à une procédure retrouvée",
    etapes: ["Question", "Recherche", "Réponse"],
    legendes: ["Une personne demande comment préparer l’arrivée d’un collègue.", "L’assistant recherche dans les procédures auxquelles il a accès.", "Il propose une liste d’actions et le document de référence."],
    resultat: "L’équipe retrouve la bonne procédure, au moment utile.",
  },
  commercial: {
    titre: "D’une demande à un suivi commercial organisé",
    etapes: ["Demande", "Transfert", "Suivi"],
    legendes: ["Un prospect remplit votre formulaire de contact.", "Ses informations sont transmises au CRM, votre outil de suivi client.", "La fiche est prête et une tâche de rappel est attribuée."],
    resultat: "Une demande, une fiche client, une prochaine action.",
  },
  administratif: {
    titre: "D’une facture à une relance préparée",
    etapes: ["Facture", "Vérification", "Relance"],
    legendes: ["Une facture et sa date d’échéance entrent dans le suivi.", "Le parcours vérifie la date et le statut de règlement.", "Si elle reste impayée, une relance est préparée pour validation."],
    resultat: "L’échéance est suivie et la relance reste sous votre contrôle.",
  },
  pilotage: {
    titre: "De plusieurs outils à une vue d’ensemble",
    etapes: ["Sources", "Collecte", "Tableau"],
    legendes: ["Les données sont réparties entre les ventes, les factures et les projets.", "Les informations sont rassemblées selon les règles définies.", "Le tableau de suivi est actualisé pour préparer votre point d’équipe."],
    resultat: "Les indicateurs sont rassemblés dans un seul tableau.",
  },
} as const;

export type DemonstrationId = keyof typeof DEMONSTRATIONS;
