import { CRENEAU_LIEU, FORMATION_DUREE } from "@/lib/creneaux";

/** Source commune du texte visible et du balisage sémantique. */
export const FORMATION_FAQ = [
  {
    question: "À qui s’adresse la formation IA Marssane ?",
    reponse: "La formation s’adresse aux dirigeants de TPE et PME de moins de 20 salariés et aux entrepreneurs qui souhaitent utiliser l’IA sur leurs dossiers : mails, documents, recherche et tâches répétitives.",
  },
  {
    question: "Faut-il déjà connaître l’IA pour suivre la formation ?",
    reponse: "Non. Le niveau débutant reprend les bases : choisir un modèle, rédiger un prompt et comprendre la confidentialité des échanges. Venez avec votre ordinateur et un abonnement Claude Pro actif ; son coût est distinct de celui de la formation.",
  },
  {
    question: "J’utilise déjà ChatGPT ou Claude, qu’est-ce que ça m’apporte ?",
    reponse: "Si vos usages sont occasionnels, le niveau débutant vous aide à construire un skill réutilisable et à connecter votre messagerie. Les niveaux confirmé et expert sont annoncés ; leurs programmes et leurs dates seront précisés ultérieurement.",
  },
  {
    question: "Combien de temps dure la formation IA ?",
    reponse: `La formation comprend ${FORMATION_DUREE}, en présentiel. Une pratique personnelle accompagnée entre les deux séances permet de transposer les exercices sur vos propres dossiers. Ce travail personnel s’ajoute aux 7 heures en salle.`,
  },
  {
    question: "Où se déroule la formation près de Lyon ?",
    reponse: `La formation a lieu au ${CRENEAU_LIEU}, près de Lyon. Les créneaux proposés se déroulent de 14 h à 17 h 30, en petit groupe, chacun sur son ordinateur.`,
  },
  {
    question: "Que se passe-t-il entre les deux séances ?",
    reponse: "Vous adaptez le système de tri de mails à votre messagerie et repérez une tâche à automatiser lors de la deuxième séance. Un chat commun avec le groupe et le formateur permet de poser vos questions pendant cette pratique.",
  },
  {
    question: "Pourquoi travailler sur Claude pendant la formation ?",
    reponse: "Claude est l’outil utilisé pour les exercices de la formation : travail sur les fichiers, rédaction, skills et connecteurs. La méthode pour préciser une consigne, apporter du contexte et vérifier une réponse reste utile avec d’autres assistants, dont ChatGPT et Mistral. Le choix dépend de vos tâches et des fonctions disponibles.",
  },
  {
    question: "La pré-inscription m’engage-t-elle ?",
    reponse: "Non. La pré-inscription est sans engagement. Vous indiquez vos coordonnées et votre créneau souhaité ; Marssane vous recontacte pour la suite.",
  },
];
