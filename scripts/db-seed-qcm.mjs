// Seed de la banque de QCM de l'espace formation (phase 3).
//
// Deux questionnaires :
//  - Session 1 « Découvrir Claude » : les 10 questions de maquettes/qcm.html.
//  - Session 2 « Mise en pratique et autonomie » : 10 questions plausibles de
//    fin de semaine (placeholder sobre, à affiner par le formateur).
//
// Idempotent : on ne réinsère pas un questionnaire dont le numero_session existe
// déjà. Relancer le script après un premier seed ne crée donc pas de doublon.
//
// Usage : npm run db:seed:qcm
// (charge .env.local si présent via --env-file-if-exists, voir package.json)

import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "Erreur : DATABASE_URL est absent. Renseignez-le dans .env.local (voir .env.example).",
  );
  process.exit(1);
}

// Banque. Pour chaque question : type (radio|checkbox), énoncé, et options
// (libellé + booléen « correcte »). L'ordre du tableau fait foi (colonne ordre).
const QUESTIONNAIRES = [
  {
    numeroSession: 1,
    titre: "Découvrir Claude",
    questions: [
      {
        type: "radio",
        enonce: "Qu'est-ce que Claude ?",
        options: [
          { libelle: "Un moteur de recherche qui liste des pages web", correcte: false },
          {
            libelle:
              "Un assistant fondé sur un modèle de langage, avec qui on dialogue",
            correcte: true,
          },
          { libelle: "Un tableur pour faire des calculs", correcte: false },
          { libelle: "Un antivirus intelligent", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce: "Pour obtenir une réponse utile, la meilleure approche est de…",
        options: [
          {
            libelle: "Écrire quelques mots-clés comme sur un moteur de recherche",
            correcte: false,
          },
          {
            libelle:
              "Formuler une demande claire et précise, en donnant le contexte et l'objectif",
            correcte: true,
          },
          { libelle: "Poser la question la plus courte possible", correcte: false },
          { libelle: "Tout écrire en majuscules pour insister", correcte: false },
        ],
      },
      {
        type: "checkbox",
        enonce: "Quels éléments aident Claude à mieux répondre ?",
        options: [
          { libelle: "Le contexte de votre situation", correcte: true },
          { libelle: "L'objectif visé et le public destinataire", correcte: true },
          {
            libelle: "Le format de réponse attendu (liste, e-mail, tableau…)",
            correcte: true,
          },
          { libelle: "Un exemple de ce que vous attendez", correcte: true },
        ],
      },
      {
        type: "radio",
        enonce: "Claude peut-il se tromper ou inventer des informations ?",
        options: [
          { libelle: "Non, tout ce qu'il affirme est exact", correcte: false },
          {
            libelle:
              "Oui, il peut produire des informations fausses : il faut les vérifier",
            correcte: true,
          },
          { libelle: "Seulement s'il n'a pas accès à Internet", correcte: false },
          { libelle: "Uniquement sur les sujets scientifiques", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce:
          "La réponse de Claude est à côté de votre demande. Que faites-vous ?",
        options: [
          { libelle: "Vous abandonnez, l'outil n'est pas fait pour ça", correcte: false },
          {
            libelle:
              "Vous reformulez en précisant ce qui manquait et ce que vous attendez",
            correcte: true,
          },
          { libelle: "Vous reposez exactement la même question", correcte: false },
          { libelle: "Vous recopiez la réponse telle quelle", correcte: false },
        ],
      },
      {
        type: "checkbox",
        enonce: "Bonnes pratiques de confidentialité avec Claude :",
        options: [
          {
            libelle:
              "Éviter de coller des données personnelles ou confidentielles sans cadre validé",
            correcte: true,
          },
          {
            libelle: "Anonymiser les informations sensibles (ex. « Client A »)",
            correcte: true,
          },
          {
            libelle: "Publier ses échanges avec des données clients sur les réseaux",
            correcte: false,
          },
          {
            libelle: "Vérifier la politique d'usage de son organisation",
            correcte: true,
          },
        ],
      },
      {
        type: "radio",
        enonce: "Pour faire analyser un document par Claude, vous pouvez…",
        options: [
          {
            libelle: "Lui donner l'adresse du fichier sur votre disque dur",
            correcte: false,
          },
          {
            libelle: "Joindre le fichier (ou le glisser) dans la conversation",
            correcte: true,
          },
          { libelle: "Lui lire le document à voix haute", correcte: false },
          { libelle: "Lui envoyer par e-mail", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce:
          "Parmi ces usages, lequel est un bon cas d'usage bureautique de Claude ?",
        options: [
          { libelle: "Réparer une imprimante à distance", correcte: false },
          {
            libelle:
              "Résumer un compte rendu de réunion et en tirer les actions à mener",
            correcte: true,
          },
          { libelle: "Stocker définitivement vos fichiers", correcte: false },
          { libelle: "Passer un appel téléphonique à votre place", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce: "« Itérer » sur une réponse, cela signifie…",
        options: [
          {
            libelle: "Recommencer une conversation vierge à chaque fois",
            correcte: false,
          },
          {
            libelle:
              "Affiner progressivement en donnant des retours à Claude (« plus court », « ajoute un exemple »)",
            correcte: true,
          },
          { libelle: "Copier la réponse dans un autre outil", correcte: false },
          { libelle: "Attendre que Claude se corrige tout seul", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce:
          "Avant d'utiliser une information factuelle donnée par Claude, vous devez…",
        options: [
          { libelle: "La partager immédiatement à vos collègues", correcte: false },
          { libelle: "La vérifier auprès d'une source fiable", correcte: true },
          { libelle: "La considérer comme définitive", correcte: false },
          { libelle: "L'ignorer, elle est forcément fausse", correcte: false },
        ],
      },
    ],
  },
  {
    numeroSession: 2,
    titre: "Mise en pratique et autonomie",
    questions: [
      {
        type: "radio",
        enonce:
          "Vous avez pratiqué seul cette semaine. Quelle habitude tirer d'une bonne session avec Claude ?",
        options: [
          { libelle: "Poser une seule question et s'en tenir à la première réponse", correcte: false },
          {
            libelle: "Reformuler et itérer jusqu'à obtenir un résultat vraiment utile",
            correcte: true,
          },
          { libelle: "Multiplier les conversations sans jamais préciser le contexte", correcte: false },
          { libelle: "Copier la réponse sans jamais la relire", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce:
          "Vous préparez un e-mail important avec l'aide de Claude. Quel réflexe adopter avant de l'envoyer ?",
        options: [
          { libelle: "L'envoyer tel quel, Claude ne se trompe jamais sur un e-mail", correcte: false },
          {
            libelle: "Le relire et l'ajuster à votre ton et à votre destinataire",
            correcte: true,
          },
          { libelle: "Le traduire d'abord dans une autre langue", correcte: false },
          { libelle: "Le publier sur les réseaux pour avoir des avis", correcte: false },
        ],
      },
      {
        type: "checkbox",
        enonce:
          "Quelles étapes fiabilisent une information factuelle obtenue via Claude ?",
        options: [
          { libelle: "Croiser avec une source fiable et à jour", correcte: true },
          { libelle: "Demander à Claude d'indiquer son raisonnement", correcte: true },
          { libelle: "Accepter le chiffre parce qu'il paraît précis", correcte: false },
          {
            libelle: "Vérifier soi-même les points sensibles avant de décider",
            correcte: true,
          },
        ],
      },
      {
        type: "radio",
        enonce:
          "Vous voulez faire résumer un document confidentiel par Claude. Que faites-vous d'abord ?",
        options: [
          { libelle: "Vous le collez intégralement, données nominatives comprises", correcte: false },
          {
            libelle:
              "Vous vérifiez le cadre d'usage de votre organisation et anonymisez ce qui est sensible",
            correcte: true,
          },
          { libelle: "Vous l'envoyez à un collègue pour qu'il le fasse à votre place", correcte: false },
          { libelle: "Vous renoncez : Claude ne sait pas résumer", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce:
          "Claude vous propose une liste d'actions, mais deux ne vous conviennent pas. Comment réagir ?",
        options: [
          { libelle: "Tout recommencer depuis une conversation vierge", correcte: false },
          {
            libelle:
              "Lui indiquer ce qui ne va pas et lui demander d'ajuster ces deux points",
            correcte: true,
          },
          { libelle: "Garder la liste telle quelle malgré vos réserves", correcte: false },
          { libelle: "Supprimer la conversation et abandonner la tâche", correcte: false },
        ],
      },
      {
        type: "checkbox",
        enonce:
          "Parmi ces tâches de la semaine, lesquelles sont de bons cas d'usage pour Claude ?",
        options: [
          { libelle: "Rédiger un premier jet de compte rendu à partir de vos notes", correcte: true },
          { libelle: "Reformuler un message pour le rendre plus clair", correcte: true },
          { libelle: "Garantir l'exactitude d'un chiffre sans aucune vérification", correcte: false },
          { libelle: "Préparer une trame de réponse à une question fréquente", correcte: true },
        ],
      },
      {
        type: "radio",
        enonce:
          "Une réponse de Claude est trop longue pour votre usage. Quelle demande formuler ?",
        options: [
          { libelle: "« Recommence tout »", correcte: false },
          {
            libelle: "« Résume en trois points l'essentiel pour un dirigeant pressé »",
            correcte: true,
          },
          { libelle: "« Écris encore plus »", correcte: false },
          { libelle: "Rien : on ne peut pas raccourcir une réponse", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce:
          "Pour qu'un collègue reproduise votre bon résultat, que lui transmettez-vous en priorité ?",
        options: [
          { libelle: "Uniquement la réponse finale de Claude", correcte: false },
          {
            libelle:
              "La demande (le contexte et les consignes) qui a mené au bon résultat",
            correcte: true,
          },
          { libelle: "Une capture d'écran de votre bureau", correcte: false },
          { libelle: "Rien, chacun doit repartir de zéro", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce:
          "Vous n'êtes pas sûr d'une réponse de Claude sur un point réglementaire. Le bon réflexe ?",
        options: [
          { libelle: "Appliquer la réponse sans plus vérifier", correcte: false },
          {
            libelle:
              "La traiter comme une piste et confirmer auprès d'une source officielle",
            correcte: true,
          },
          { libelle: "Considérer que le sujet est forcément faux", correcte: false },
          { libelle: "Poser dix fois la même question jusqu'à être rassuré", correcte: false },
        ],
      },
      {
        type: "radio",
        enonce:
          "Quelle attitude reflète le mieux une utilisation autonome et responsable de Claude ?",
        options: [
          { libelle: "Déléguer entièrement la décision finale à l'outil", correcte: false },
          {
            libelle:
              "Utiliser Claude pour gagner du temps, tout en gardant le contrôle et l'esprit critique",
            correcte: true,
          },
          { libelle: "Éviter de vérifier pour aller plus vite", correcte: false },
          { libelle: "Partager systématiquement toutes ses données", correcte: false },
        ],
      },
    ],
  },
];

const sql = postgres(DATABASE_URL, { ssl: "require", prepare: false });

try {
  for (const questionnaire of QUESTIONNAIRES) {
    const existing = await sql`
      select id from qcm_questionnaires
      where numero_session = ${questionnaire.numeroSession}
      limit 1
    `;

    if (existing.length > 0) {
      console.log(
        `↷ Questionnaire session ${questionnaire.numeroSession} déjà présent (id: ${existing[0].id}).`,
      );
      continue;
    }

    const [row] = await sql`
      insert into qcm_questionnaires (numero_session, titre)
      values (${questionnaire.numeroSession}, ${questionnaire.titre})
      returning id
    `;

    let ordreQuestion = 1;
    for (const question of questionnaire.questions) {
      const [q] = await sql`
        insert into qcm_questions (questionnaire_id, ordre, enonce, type)
        values (${row.id}, ${ordreQuestion}, ${question.enonce}, ${question.type})
        returning id
      `;
      let ordreOption = 1;
      for (const option of question.options) {
        await sql`
          insert into qcm_options (question_id, ordre, libelle, correcte)
          values (${q.id}, ${ordreOption}, ${option.libelle}, ${option.correcte})
        `;
        ordreOption += 1;
      }
      ordreQuestion += 1;
    }

    console.log(
      `✓ Questionnaire session ${questionnaire.numeroSession} « ${questionnaire.titre} » créé (${questionnaire.questions.length} questions).`,
    );
  }
} catch (error) {
  console.error("Échec du seed QCM :", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
