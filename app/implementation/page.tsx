import { PageExpertise, type Expertise } from "@/components/site/PageExpertise";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Implémentation IA pour les PME | Marssane",
  description: "Des agents IA pour votre PME : prospection, devis, demandes clients, réunions et veille. Mise en place, puis passation accompagnée ou maintenance avec Marssane.",
  path: "/implementation",
});

const contenu: Expertise = {
  nom: "Implémentation IA", path: "/implementation",
  titre: "Des agents IA qui travaillent pour", accent: "votre entreprise.",
  introduction: "Vous confiez un objectif à un agent IA. Il analyse la situation, recherche les informations utiles dans vos outils et adapte les actions à mener.",
  heroVisuel: "agents",
  principe: "Les différents cas d’usages",
  parties: [
    {
      id: "prospection-vente",
      titre: "Trouver de nouveaux clients",
      texte: "",
      demonstrations: [{
        type: "prospection",
        titre: "",
        texte: "Définissez votre cible. Noé, votre agent de prospection, consulte votre annuaire professionnel, sélectionne les prospects pertinents et prépare un message personnalisé. Vous le validez avant de contacter le prospect.",
      }],
      exemples: [],
    },
    {
      id: "relation-client",
      titre: "Gagner du temps sur l’administratif",
      texte: "",
      demonstrations: [{
        type: "devis-menuiserie",
        titre: "",
        texte: "Dictez les besoins de votre client. Marco, votre agent IA, transcrit le vocal, consulte votre grille tarifaire et prépare un devis prêt à envoyer. Vous le vérifiez et le validez avant l’envoi.",
      }],
      exemples: [],
    },
    {
      id: "secretaire-vocal",
      titre: "Votre secrétaire vocal",
      texte: "",
      demonstrations: [{
        type: "secretaire-vocal",
        titre: "",
        texte: "Envoyez vos consignes par vocal sur WhatsApp. Alma comprend votre demande, met à jour le dossier client et ajoute les tâches à votre liste. Un changement de date, une précision ou un rappel : les informations sont enregistrées sans ressaisie.",
      }],
      exemples: [],
    },
  ],
  livrables: [
    "Un usage défini avec un objectif concret et un périmètre de données autorisées.",
    "Un assistant ou un agent configuré autour de vos outils et de vos documents.",
    "Des essais sur des cas représentatifs, avec les limites et les points de contrôle identifiés.",
    "Une documentation et, au choix, une passation accompagnée ou une maintenance par Marssane, selon le périmètre convenu.",
  ],
  methode: [
    { titre: "Choisir le bon point de départ", texte: "Nous regardons votre semaine réelle : tâches fréquentes, temps passé, documents disponibles et décisions à conserver. Nous retenons un premier usage et les critères pour juger son utilité." },
    { titre: "Construire et tester avec vous", texte: "Nous configurons l’assistant, ses sources et ses consignes. Vous testez des situations concrètes ; nous ajustons les réponses et les étapes de validation." },
    { titre: "Choisir votre accompagnement", texte: "Vous choisissez une passation pour apprendre à gérer le système avec votre équipe, ou une maintenance confiée à Marssane. Le suivi technique et les ajustements sont définis ensemble, selon vos besoins." },
  ],
  faq: [
    { question: "Faut-il déjà utiliser l’IA dans l’entreprise ?", reponse: "Non. Le premier échange sert à comprendre votre fonctionnement et à choisir un point de départ adapté. La prise en main fait partie du projet." },
    { question: "Doit-on changer tous nos outils ?", reponse: "Nous partons de vos outils existants. Le diagnostic permet de vérifier les connexions possibles, les accès nécessaires et les éventuelles limites avant de définir la solution." },
    { question: "Comment garder le contrôle sur les réponses ?", reponse: "Nous définissons les documents accessibles et les actions autorisées. Les points de validation sont intégrés au parcours ; une réponse importante peut rester à l’état de brouillon jusqu’à votre accord." },
    { question: "Qui s’occupe du système après la mise en place ?", reponse: "Vous avez le choix : une passation accompagnée, avec formation de votre équipe et documentation, ou une maintenance assurée par Marssane. Dans ce second cas, nous prenons en charge le suivi technique, les corrections et les ajustements prévus au devis." },
    { question: "Comment le projet est-il chiffré ?", reponse: "Sur devis, une fois le périmètre cadré : usages, outils, documents et accompagnement. La passation ou la maintenance choisie et les éventuels abonnements aux outils y sont précisés." },
  ],
  complement: { titre: "Vous répétez surtout les mêmes manipulations ?", texte: "L’automatisation relie vos outils et fait avancer les tâches selon des règles définies. Elle peut aussi intégrer une étape d’IA lorsque c’est utile.", href: "/automatisation", lien: "Découvrir l’automatisation" },
};

export default function Implementation() { return <PageExpertise contenu={contenu} />; }
