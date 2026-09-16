import { PageExpertise, type Expertise } from "@/components/site/PageExpertise";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Automatisation des tâches pour les PME | Marssane",
  description: "Reliez vos outils et automatisez les tâches répétitives de votre PME avec Marssane. Mise en place, puis passation accompagnée ou maintenance selon vos besoins.",
  path: "/automatisation",
});

const contenu: Expertise = {
  nom: "Automatisation", path: "/automatisation",
  titre: "Une règle définie", accent: "déclenche une action.",
  heroVisuel: "automatisation",
  introduction: "Une règle définie déclenche une action : si une facture arrive, elle est classée ; si un devis reste sans réponse, une relance part. Nous connectons vos outils pour exécuter ces processus. Une seule automatisation peut déjà répondre à votre besoin.",
  principe: "Les différents cas d’usages",
  parties: [
    {
      id: "devis-nouveaux-clients",
      titre: "Relances automatiques lorsqu’un client ne paie pas",
      texte: "",
      demonstrations: [{
        type: "secretaire",
        titre: "",
        texte: "Si un devis reste sans réponse pendant sept jours, Élise envoie une relance. Dès que le client retourne le devis signé, elle le classe dans son dossier, crée les sous-dossiers prévus et ouvre le projet dans votre outil de suivi.",
      }],
      exemples: [],
    },
    {
      id: "chiffres-pilotage",
      titre: "Compte rendu chaque lundi matin 9h",
      texte: "",
      demonstrations: [{
        type: "pilotage",
        titre: "",
        texte: "Chaque semaine, au créneau défini, l’automatisation rassemble les chiffres de facturation, les devis signés et les projets en cours. Une synthèse PowerPoint est préparée pour votre point d’équipe, sans recopier les données à la main.",
      }],
      exemples: [],
    },
    {
      id: "factures-paiements",
      titre: "Factures et paiements",
      texte: "Des factures rangées au bon endroit et une alerte quand un paiement demande votre attention.",
      exemples: [
        { titre: "Classement des factures reçues", texte: "Si un fournisseur envoie une facture en pièce jointe, elle est enregistrée dans le dossier prévu et le comptable est averti." },
        { titre: "Alerte de retard de paiement fournisseur", texte: "Si l’espace fournisseur affiche un retard de paiement, je reçois un SMS avec le fournisseur, le montant et l’échéance." },
      ],
    },
  ],
  livrables: [
    "Un parcours décrit clairement : déclencheur, règles, actions et exceptions.",
    "Des connexions entre vos outils, selon leurs possibilités et les accès accordés.",
    "Des contrôles sur les doublons et les erreurs, avec un signalement des situations à reprendre.",
    "Une documentation et, au choix, une passation accompagnée ou une maintenance par Marssane pour le suivi et les ajustements convenus.",
  ],
  methode: [
    { titre: "Décrire ce qui se répète", texte: "Nous suivons une tâche du début à la fin : où arrive l’information, qui la reprend, quelles règles s’appliquent. Nous identifions aussi les cas qui doivent rester traités à la main." },
    { titre: "Relier les outils et vérifier les cas réels", texte: "Nous construisons un premier parcours et le testons avec des données représentatives : demande complète, information manquante, doublon ou indisponibilité d’un outil." },
    { titre: "Mettre en route et organiser le suivi", texte: "Le parcours est activé sur le périmètre convenu. Vous choisissez une passation pour que votre équipe apprenne à le gérer, ou une maintenance par Marssane pour le suivi technique et les ajustements définis ensemble." },
  ],
  faq: [
    { question: "L’automatisation utilise-t-elle forcément de l’IA ?", reponse: "Non. Une règle simple suffit pour beaucoup de tâches : créer une fiche, déplacer un fichier ou déclencher un rappel. L’IA peut intervenir lorsqu’il faut interpréter un texte, classer une demande ou préparer une synthèse." },
    { question: "Quels outils peut-on connecter ?", reponse: "Cela dépend des connexions proposées par vos logiciels et de vos droits d’accès. Nous vérifions ces possibilités au diagnostic, avant de nous engager sur le fonctionnement du parcours." },
    { question: "Que se passe-t-il si une étape échoue ?", reponse: "Le traitement des erreurs fait partie du cadrage : arrêt, nouvelle tentative ou alerte selon le cas. Nous définissons qui intervient : votre équipe après une passation accompagnée, ou Marssane dans le cadre de la maintenance choisie. Les opérations sensibles peuvent inclure une validation manuelle." },
    { question: "Peut-on vous confier la maintenance ?", reponse: "Oui. Vous pouvez choisir une maintenance assurée par Marssane pour le suivi technique, les corrections et les ajustements convenus. Si vous préférez gérer le système en interne, nous proposons une passation accompagnée. Le périmètre et le coût de chaque option sont définis sur devis." },
    { question: "Peut-on commencer par une seule tâche ?", reponse: "Oui. Un premier parcours permet de vérifier l’intérêt et le fonctionnement avant d’élargir. Son périmètre et son coût sont définis sur devis, ainsi que les éventuels abonnements nécessaires." },
  ],
  complement: { titre: "Vos tâches demandent aussi de comprendre des documents ?", texte: "Un assistant IA peut analyser une demande, exploiter vos contenus et préparer une réponse au sein de votre parcours.", href: "/implementation", lien: "Découvrir l’implémentation IA" },
};

export default function Automatisation() { return <PageExpertise contenu={contenu} />; }
