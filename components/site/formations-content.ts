/**
 * Contenu du parcours de formation (page /formations).
 *
 * Source de vérité : les trois plans de formation Marssane (Débutant, Inter-
 * médiaire, Avancé). Les champs promesse / modules / déroulé / prérequis /
 * livrable sont repris tels quels des plans ; les noms de niveau et sous-titres
 * (« L'étincelle », etc.) viennent du kit « Niveaux de formation ». Les notes
 * internes (tarifs, Qualiopi, points en suspens) ne figurent pas ici.
 *
 * L'accent (couleur de niveau) sert uniquement de ponctuation — badge, repère
 * « + », barre de carte — jamais en aplat de fond.
 */

export type Formation = {
  /** Ancre de la section détaillée. */
  id: string;
  /** Libellé court du niveau (« Débutant »…). */
  niveau: string;
  /** Étiquette de badge mono (« Formation Débutant »). */
  badge: string;
  /** Nom poétique du niveau (kit) — « L'étincelle », « La connexion »… */
  nom: string;
  /** Sous-titre du niveau (kit). */
  sousTitre: string;
  /** Couleur d'accent du niveau (variable CSS de token). */
  accent: string;
  /** Compteur de progression (« 01 / 03 »). */
  compteur: string;
  /** Titre de la section détaillée. */
  titre: string;
  /** Promesse « je saurai » (plan) — section détaillée. */
  promesse: string;
  /** Promesses courtes sans jargon pour la carte de parcours (kit Niveaux). */
  promesseCarte: string[];
  /** Modules (plan) — « Module N : titre — description ». */
  modules: string[];
  /** Déroulé horodaté (plan) — « HH:MM – HH:MM — titre — détails ». */
  deroule: string[];
  /** Prérequis complets (plan). */
  prerequis: string[];
  /** Prérequis d'entrée résumé, pour la carte de parcours. */
  prerequisEntree: string;
  /** Livrable final (plan). */
  livrable: string;
  /** Valeur « Niveau » de l'encart cadre. */
  niveauCadre: string;
};

export const FORMATIONS: Formation[] = [
  {
    id: "debutant",
    niveau: "Débutant",
    badge: "Formation Débutant",
    nom: "L'étincelle",
    sousTitre: "Le premier contact avec l'IA, sur vos cas concrets.",
    accent: "var(--color-turquoise)",
    compteur: "01 / 03",
    titre: "Installer l'IA et trier ses mails, en une journée.",
    promesse:
      "À la fin de la formation, je saurai installer Claude sur mon ordinateur, l'utiliser au quotidien avec Cowork, et créer mon premier skill pour automatiser le tri de mes mails.",
    promesseCarte: [
      "Je comprends ce que l'IA peut faire pour mon métier",
      "Je rédige des demandes qui donnent de bons résultats",
    ],
    modules: [
      "Module 1 : Intégrer Claude à son ordinateur — je saurai installer et connecter Claude à mes outils (ce qu'est Claude, ce qu'il peut / ne peut pas faire ; installation guidée ; connexion aux mails et dossiers ; point confidentialité).",
      "Module 2 : Travailler avec Cowork — je saurai confier des tâches concrètes à Claude sur mes fichiers et mes mails (lire et résumer un document, chercher dans un dossier, rédiger un courrier ; bien formuler une demande et corriger Claude).",
      "Module 3 : Créer son premier skill — je saurai créer une automatisation réutilisable, appliquée au tri de mes mails (concept expliqué par l'exemple, création pas à pas puis chacun crée le sien).",
    ],
    deroule: [
      "09:00 – 09:30 — Accueil et démonstration d'ouverture — tour de table (métier, niveau, attentes) ; démo choc : une boîte mail triée automatiquement par Claude ; annonce de l'objectif « à 17h, vous saurez faire ça »",
      "09:30 – 10:45 — Module 1 : Intégrer Claude à son ordinateur — 15 min max de théorie (ce que Claude peut / ne peut pas faire) ; installation guidée sur chaque poste ; connexion aux mails et aux dossiers ; point confidentialité (où vont les données) ; résultat : chacun termine avec un Claude fonctionnel",
      "10:45 – 11:00 — Pause",
      "11:00 – 12:30 — Module 2 : Travailler avec Cowork — premières tâches (lire et résumer un document, chercher dans un dossier, rédiger un courrier) ; 3 exercices guidés de difficulté croissante, d'abord sur fichiers fournis puis sur les leurs ; apprendre à bien formuler une demande et à corriger Claude",
      "12:30 – 13:30 — Déjeuner",
      "13:30 – 15:15 — Module 3 : Créer son premier skill — concept expliqué par l'exemple (10 min) ; création pas à pas d'un skill simple ensemble, puis chacun crée le sien ; le formateur circule et débloque",
      "15:15 – 15:30 — Pause",
      "15:30 – 16:30 — Atelier final : automatiser le tri de ses mails — chacun applique la méthode sur sa propre boîte mail (définir ses règles de tri, construire le skill, tester en réel) ; livrable : un système de tri fonctionnel qu'on remporte",
      "16:30 – 17:00 — Clôture — vérification des acquis (chacun redémontre son tri, devant le groupe ou en binôme) ; plan d'action personnel « les 3 tâches que j'automatise ce mois-ci » ; questions, évaluation de la formation",
    ],
    prerequis: [
      "Abonnement Claude Pro minimum (20 €/mois) actif — à souscrire avant la formation, pas le jour même",
      "Application Claude installée sur l'ordinateur qui sera apporté",
      "Poste géré par une DSI : faire valider en amont l'installation et l'usage de Claude Cowork (accès fichiers et messagerie) ; sans cette validation, la pratique sur ses propres outils est impossible",
      "Droits d'administrateur ou identifiants nécessaires disponibles",
      "Accès à sa messagerie depuis l'ordinateur apporté",
    ],
    prerequisEntree: "Aucune formation préalable · abonnement Claude Pro actif.",
    livrable:
      "Le participant repart avec un système de tri de mails fonctionnel qu'il a construit lui-même.",
    niveauCadre: "débutant",
  },
  {
    id: "intermediaire",
    niveau: "Intermédiaire",
    badge: "Formation Intermédiaire",
    nom: "La connexion",
    sousTitre: "L'IA reliée à vos outils et à vos dossiers du quotidien.",
    accent: "var(--color-lavande)",
    compteur: "02 / 03",
    titre: "Connecter l'IA à ses outils métiers.",
    promesse:
      "À la fin de la formation, je saurai connecter Claude à mes outils métiers via MCP, faire travailler plusieurs outils IA ensemble, et piloter le tout depuis VS Code.",
    promesseCarte: [
      "Je branche l'IA sur mes documents et mes outils",
      "J'automatise mes tâches répétitives en sécurité",
    ],
    modules: [
      "Module 1 : Les MCP — je saurai brancher Claude sur mes outils (agenda, mails, outil métier) : le concept en 15 min (une prise universelle entre Claude et vos outils), installation guidée de 2 connecteurs, point confidentialité.",
      "Module 2 : Plusieurs outils IA en même temps — je saurai orchestrer une chaîne d'outils IA complémentaires : transcription d'un rendez-vous → analyse Claude → génération de document ; comparer les outils (lequel pour quoi).",
      "Module 3 : VS Code — je saurai centraliser mes skills, prompts et projets dans un espace de travail organisé (sans coder) : prise en main guidée, utiliser Claude dans VS Code, organiser son dossier de travail.",
    ],
    deroule: [
      "09:00 – 09:30 — Accueil et démonstration d'ouverture — démo choc : à partir d'une simple demande, Claude interroge l'agenda, les mails et un outil métier connectés, et produit une fiche dossier complète ; annonce de l'objectif « à 17h, vous saurez faire ça »",
      "09:30 – 10:45 — Module 1 : Les MCP — le concept en 15 min (une prise universelle entre Claude et vos outils) ; installation guidée de 2 connecteurs (ex. Drive/Calendar + un outil métier) ; point confidentialité : ce que voit le connecteur, ce qu'il ne voit pas",
      "10:45 – 11:00 — Pause",
      "11:00 – 12:30 — Module 2 : Plusieurs outils IA en même temps — orchestrer une chaîne : transcription d'un rendez-vous → analyse Claude → génération de document ; comparer les outils (lequel utiliser pour quoi) ; 3 exercices de difficulté croissante, sur données fictives puis sur les leurs",
      "12:30 – 13:30 — Déjeuner",
      "13:30 – 15:15 — Module 3 : VS Code — pourquoi un éditeur : centraliser skills, prompts et projets (sans coder) ; prise en main guidée, utiliser Claude dans VS Code ; organiser son dossier de travail",
      "15:15 – 15:30 — Pause",
      "15:30 – 16:30 — Atelier final : son poste de travail augmenté — chacun assemble sa chaîne complète (MCP + multi-outils, pilotée depuis VS Code) sur un cas de son métier ; livrable : un poste de travail connecté et fonctionnel qu'on remporte",
      "16:30 – 17:00 — Clôture — redémonstration devant le groupe ou en binôme ; plan d'action personnel « les 3 connexions que je mets en place ce mois-ci » ; questions, évaluation de la formation",
    ],
    prerequis: [
      "Avoir suivi la formation débutant (ou maîtriser Cowork + la création de skills)",
      "Abonnement Claude Pro minimum actif",
      "Poste géré par une DSI : faire valider en amont l'installation de VS Code et les connexions MCP aux outils métiers",
      "Accès et identifiants des outils à connecter (agenda, messagerie, outil métier)",
    ],
    prerequisEntree:
      "Avoir suivi la formation débutant (ou maîtriser Cowork + la création de skills).",
    livrable:
      "Un poste de travail augmenté — Claude connecté à 2-3 outils métiers via MCP, orchestré depuis VS Code.",
    niveauCadre: "intermédiaire",
  },
  {
    id: "avance",
    niveau: "Avancé",
    badge: "Formation Avancé",
    nom: "La maîtrise",
    sousTitre: "L'IA pilotée en autonomie, à l'échelle de votre structure.",
    accent: "var(--color-canard)",
    compteur: "03 / 03",
    titre: "Créer des agents qui travaillent seuls.",
    promesse:
      "À la fin de la formation, je saurai créer des agents qui travaillent seuls — tâches planifiées, sub-agents, workflows complets — et les garder sous contrôle.",
    promesseCarte: [
      "Je déploie des cas d'usage dans mon équipe",
      "Je pilote qualité, coûts et confidentialité",
    ],
    modules: [
      "Module 1 : Du skill à l'agent — je saurai programmer une automatisation récurrente qui tourne sans moi : la différence (le skill s'exécute à la demande, l'agent décide et enchaîne) ; tâches planifiées.",
      "Module 2 : Sub-agents et workflows — je saurai découper une mission en agents spécialisés qui coopèrent (un cherche, un rédige, un vérifie) ; construction guidée d'un workflow multi-étapes.",
      "Module 3 : Garder le contrôle — je saurai poser des points de validation et protéger le secret professionnel : points de validation humaine, gestion des erreurs, confidentialité (ce qu'on n'automatise jamais) ; module essentiel pour la cible (avocats, notaires, experts-comptables).",
    ],
    deroule: [
      "09:00 – 09:30 — Accueil et démonstration d'ouverture — démo choc : un agent tourne seul depuis la veille, le formateur ouvre le rapport produit pendant la nuit ; annonce de l'objectif « à 17h, votre agent tournera aussi »",
      "09:30 – 10:45 — Module 1 : Du skill à l'agent — la différence : le skill s'exécute à la demande, l'agent décide et enchaîne ; tâches planifiées : chacun programme sa première automatisation récurrente",
      "10:45 – 11:00 — Pause",
      "11:00 – 12:30 — Module 2 : Sub-agents et workflows — découper une mission en agents spécialisés qui coopèrent (un cherche, un rédige, un vérifie) ; construction guidée d'un workflow multi-étapes",
      "12:30 – 13:30 — Déjeuner",
      "13:30 – 15:15 — Module 3 : Garder le contrôle — points de validation humaine, gestion des erreurs ; confidentialité et secret professionnel : ce qu'on n'automatise jamais ; module essentiel pour la cible (avocats, notaires, experts-comptables)",
      "15:15 – 15:30 — Pause",
      "15:30 – 16:30 — Atelier final : son agent métier — chacun construit son agent de bout en bout et le programme ; livrable : un agent autonome fonctionnel qu'on remporte",
      "16:30 – 17:00 — Clôture — chaque agent tourne en réel devant le groupe ; plan d'action personnel « les 3 processus que j'automatise ce trimestre » ; questions, évaluation de la formation",
    ],
    prerequis: [
      "Avoir suivi la formation intermédiaire (MCP fonctionnels sur le poste apporté)",
      "Abonnement Claude Pro minimum actif",
      "Poste géré par une DSI : validation en amont des automatisations planifiées",
      "Un processus métier récurrent identifié à automatiser (demandé à l'inscription)",
    ],
    prerequisEntree:
      "Avoir suivi la formation intermédiaire (MCP fonctionnels sur le poste apporté).",
    livrable:
      "Un agent autonome fonctionnel sur un cas de son métier (ex. veille juridique + rapport hebdo automatique, préparation des dossiers clients chaque matin).",
    niveauCadre: "avancé",
  },
];

/** Encart « Le cadre » — commun aux trois niveaux (format public de la journée). */
export const CADRE_COMMUN: { label: string; valeur: string }[] = [
  { label: "Durée", valeur: "1 journée · 9 h – 17 h" },
  { label: "Groupe", valeur: "mixte, toutes professions" },
  { label: "Effectif", valeur: "10 places max." },
  { label: "Matériel", valeur: "votre ordinateur" },
];

/** Découpe une ligne de déroulé « HH:MM – HH:MM — titre — détails ». */
export function parseEtape(ligne: string): {
  heure: string;
  titre: string;
  texte: string;
} {
  const parts = ligne.split(" — ");
  return {
    heure: parts[0] ?? "",
    titre: parts[1] ?? "",
    texte: parts.slice(2).join(" — "),
  };
}

/** Découpe un module « Module N : titre — description ». */
export function parseModule(ligne: string): { titre: string; texte: string } {
  const idx = ligne.indexOf(" — ");
  if (idx === -1) return { titre: ligne, texte: "" };
  return { titre: ligne.slice(0, idx), texte: ligne.slice(idx + 3) };
}
