import { getSql } from "./db";

/**
 * Couche d'accès des QCM de l'espace formation (phase 3). SQL paramétré
 * postgres.js uniquement (portabilité, CDC §7.4).
 *
 * Principe de sûreté : le score et les corrections sont TOUJOURS calculés côté
 * serveur à partir des `option_ids` stockés (jamais d'une donnée client), et un
 * participant ne peut répondre qu'aux questionnaires ouverts (ouverture non
 * fermée) de SA session — la session provient du cookie, jamais du formulaire.
 *
 * Toutes les fonctions lèvent si la base est absente/injoignable (getSql) : les
 * appelants rattrapent et dégradent proprement (repli DbUnavailable).
 */

export type QcmType = "radio" | "checkbox";

/** Option d'une question (avec le flag « correcte », usage serveur uniquement). */
export type QcmOption = {
  id: string;
  ordre: number;
  libelle: string;
  correcte: boolean;
};

/** Question complète avec ses options ordonnées. */
export type QcmQuestion = {
  id: string;
  ordre: number;
  enonce: string;
  type: QcmType;
  options: QcmOption[];
};

/** Questionnaire complet (banque). */
export type QcmQuestionnaire = {
  id: string;
  numeroSession: number;
  titre: string;
  questions: QcmQuestion[];
};

/* ===== Chargement de la banque ======================================== */

type QuestionOptionRow = {
  q_id: string;
  q_ordre: number;
  enonce: string;
  type: QcmType;
  o_id: string;
  o_ordre: number;
  libelle: string;
  correcte: boolean;
};

/** Assemble des lignes (jointure question × option) en questions structurées. */
function assembleQuestions(rows: QuestionOptionRow[]): QcmQuestion[] {
  const byId = new Map<string, QcmQuestion>();
  const order: string[] = [];
  for (const row of rows) {
    let question = byId.get(row.q_id);
    if (!question) {
      question = {
        id: row.q_id,
        ordre: row.q_ordre,
        enonce: row.enonce,
        type: row.type,
        options: [],
      };
      byId.set(row.q_id, question);
      order.push(row.q_id);
    }
    question.options.push({
      id: row.o_id,
      ordre: row.o_ordre,
      libelle: row.libelle,
      correcte: row.correcte,
    });
  }
  return order.map((id) => byId.get(id)!);
}

/** Entrée minimale de la banque (id + libellés), triée par numéro de session. */
export type QcmQuestionnaireInfo = {
  id: string;
  numeroSession: number;
  titre: string;
};

/** Liste des questionnaires de la banque (sessions 1 et 2), sans les questions. */
export async function listQuestionnaires(): Promise<QcmQuestionnaireInfo[]> {
  const sql = getSql();
  const rows = await sql<
    { id: string; numero_session: number; titre: string }[]
  >`
    select id, numero_session, titre
    from qcm_questionnaires
    order by numero_session asc, created_at asc
  `;
  return rows.map((row) => ({
    id: row.id,
    numeroSession: row.numero_session,
    titre: row.titre,
  }));
}

/** Charge un questionnaire complet (questions + options), ou `null` si inconnu. */
export async function getQuestionnaireById(
  id: string,
): Promise<QcmQuestionnaire | null> {
  const sql = getSql();
  const head = await sql<{ numero_session: number; titre: string }[]>`
    select numero_session, titre from qcm_questionnaires where id = ${id} limit 1
  `;
  if (head.length === 0) return null;

  const rows = await sql<QuestionOptionRow[]>`
    select
      qq.id as q_id, qq.ordre as q_ordre, qq.enonce, qq.type,
      o.id as o_id, o.ordre as o_ordre, o.libelle, o.correcte
    from qcm_questions qq
    join qcm_options o on o.question_id = qq.id
    where qq.questionnaire_id = ${id}
    order by qq.ordre asc, o.ordre asc
  `;
  return {
    id,
    numeroSession: head[0].numero_session,
    titre: head[0].titre,
    questions: assembleQuestions(rows),
  };
}

/* ===== Ouverture ====================================================== */

/** État d'ouverture d'un questionnaire pour une promotion. */
export type QcmOuverture = { ouvertAt: string; fermeAt: string | null };

/** Ouverture d'un questionnaire pour une session, ou `null` si jamais ouvert. */
export async function getOuverture(
  sessionId: string,
  questionnaireId: string,
): Promise<QcmOuverture | null> {
  const sql = getSql();
  const rows = await sql<{ ouvertAt: string; fermeAt: string | null }[]>`
    select
      to_char(ouvert_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as "ouvertAt",
      case when ferme_at is null then null
        else to_char(ferme_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
      end as "fermeAt"
    from qcm_ouvertures
    where session_id = ${sessionId} and questionnaire_id = ${questionnaireId}
    limit 1
  `;
  return rows[0] ?? null;
}

/**
 * Ouvre (ou rouvre) un questionnaire pour une promotion : crée la ligne
 * d'ouverture, ou remet `ferme_at` à NULL si elle existait déjà (réouverture).
 */
export async function ouvrirQcm(
  sessionId: string,
  questionnaireId: string,
): Promise<void> {
  const sql = getSql();
  await sql`
    insert into qcm_ouvertures (session_id, questionnaire_id)
    values (${sessionId}, ${questionnaireId})
    on conflict (session_id, questionnaire_id)
    do update set ferme_at = null
  `;
}

/** Ferme un questionnaire ouvert d'une promotion (pose `ferme_at`). */
export async function fermerQcm(
  sessionId: string,
  questionnaireId: string,
): Promise<void> {
  const sql = getSql();
  await sql`
    update qcm_ouvertures set ferme_at = now()
    where session_id = ${sessionId}
      and questionnaire_id = ${questionnaireId}
      and ferme_at is null
  `;
}

/* ===== Réponses ======================================================= */

/**
 * Enregistre (upsert) la réponse d'un participant à une question, au fil de
 * l'eau. Refuse silencieusement (retourne `false`) si :
 *  - le questionnaire de la question n'est pas ouvert pour cette session, ou est
 *    fermé (`ferme_at` posé) ;
 *  - une des options fournies n'appartient pas à la question ;
 *  - aucune option n'est fournie.
 * La session est celle du participant (cookie) — jamais du formulaire.
 */
export async function recordAnswer(args: {
  participantId: string;
  sessionId: string;
  questionId: string;
  optionIds: string[];
}): Promise<boolean> {
  if (args.optionIds.length === 0) return false;
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    with ouverte as (
      select 1
      from qcm_questions qq
      join qcm_ouvertures o on o.questionnaire_id = qq.questionnaire_id
      where qq.id = ${args.questionId}
        and o.session_id = ${args.sessionId}
        and o.ferme_at is null
    ),
    valides as (
      select count(*) as n
      from qcm_options
      where question_id = ${args.questionId}
        and id = any(${args.optionIds}::uuid[])
    )
    insert into qcm_reponses (participant_id, question_id, option_ids)
    select ${args.participantId}::uuid, ${args.questionId}::uuid, ${args.optionIds}::uuid[]
    where exists (select 1 from ouverte)
      and (select n from valides) = ${args.optionIds.length}
    on conflict (participant_id, question_id)
    do update set option_ids = excluded.option_ids, repondu_at = now()
    returning id
  `;
  return rows.length > 0;
}

/** Réponses d'un participant à un questionnaire : questionId → option_ids. */
export async function getParticipantAnswers(
  participantId: string,
  questionnaireId: string,
): Promise<Map<string, string[]>> {
  const sql = getSql();
  const rows = await sql<{ question_id: string; option_ids: string[] }[]>`
    select r.question_id, r.option_ids
    from qcm_reponses r
    join qcm_questions qq on qq.id = r.question_id
    where r.participant_id = ${participantId}
      and qq.questionnaire_id = ${questionnaireId}
  `;
  const map = new Map<string, string[]>();
  for (const row of rows) map.set(row.question_id, row.option_ids);
  return map;
}

/* ===== Scoring (helpers purs) ========================================= */

/** Vrai si les deux ensembles d'ids contiennent exactement les mêmes éléments. */
export function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((id) => set.has(id));
}

/** Ids des options correctes d'une question. */
export function correctOptionIds(question: QcmQuestion): string[] {
  return question.options.filter((o) => o.correcte).map((o) => o.id);
}

/**
 * Vrai si la réponse d'un participant est juste : exactitude d'ensemble (les
 * options cochées correspondent exactement aux options correctes), y compris
 * pour les questions à choix multiple (comme la maquette, `sameSet`).
 */
export function isAnswerCorrect(
  question: QcmQuestion,
  picked: string[],
): boolean {
  return sameSet(correctOptionIds(question), picked);
}

/** Score d'un participant (nombre de questions justes) sur un questionnaire. */
export function scoreOf(
  questionnaire: QcmQuestionnaire,
  answers: Map<string, string[]>,
): number {
  let score = 0;
  for (const question of questionnaire.questions) {
    const picked = answers.get(question.id) ?? [];
    if (isAnswerCorrect(question, picked)) score += 1;
  }
  return score;
}

/* ===== Vue participant (espace) ======================================= */

/** État d'un QCM pour la carte de l'espace participant. */
export type ParticipantQcmCard = {
  questionnaireId: string;
  numeroSession: number;
  titre: string;
  total: number;
  answered: number;
  ouvert: boolean;
  ferme: boolean;
  completed: boolean;
  /** Score calculé serveur, seulement si le participant a terminé. */
  score: number | null;
};

/**
 * Cartes QCM de l'espace d'un participant : un état par questionnaire de la
 * banque (sessions 1 et 2), calculé pour SA promotion. Score renseigné seulement
 * quand le participant a répondu à toutes les questions du questionnaire.
 */
export async function getParticipantQcmCards(
  sessionId: string,
  participantId: string,
): Promise<ParticipantQcmCard[]> {
  const sql = getSql();

  const questionnaires = await sql<
    { id: string; numero_session: number; titre: string }[]
  >`
    select id, numero_session, titre
    from qcm_questionnaires
    order by numero_session asc, created_at asc
  `;

  // Questions avec leurs ids d'options correctes (pour le score des terminés).
  const questions = await sql<
    { id: string; questionnaire_id: string; correct_ids: string[] }[]
  >`
    select
      qq.id, qq.questionnaire_id,
      coalesce(array_agg(o.id) filter (where o.correcte), '{}') as correct_ids
    from qcm_questions qq
    left join qcm_options o on o.question_id = qq.id
    group by qq.id
  `;

  const ouvertures = await sql<
    { questionnaire_id: string; ferme_at: string | null }[]
  >`
    select questionnaire_id, ferme_at
    from qcm_ouvertures
    where session_id = ${sessionId}
  `;

  const answers = await sql<{ question_id: string; option_ids: string[] }[]>`
    select r.question_id, r.option_ids
    from qcm_reponses r
    where r.participant_id = ${participantId}
  `;

  const answerMap = new Map<string, string[]>();
  for (const row of answers) answerMap.set(row.question_id, row.option_ids);
  const ouvertureMap = new Map<string, string | null>();
  for (const row of ouvertures) {
    ouvertureMap.set(row.questionnaire_id, row.ferme_at);
  }

  return questionnaires.map((questionnaire) => {
    const qs = questions.filter(
      (q) => q.questionnaire_id === questionnaire.id,
    );
    const total = qs.length;
    let answered = 0;
    let score = 0;
    for (const q of qs) {
      const picked = answerMap.get(q.id);
      if (picked) {
        answered += 1;
        if (sameSet(q.correct_ids, picked)) score += 1;
      }
    }
    const ouvert = ouvertureMap.has(questionnaire.id);
    const ferme = ouvertureMap.get(questionnaire.id) != null;
    const completed = total > 0 && answered === total;
    return {
      questionnaireId: questionnaire.id,
      numeroSession: questionnaire.numero_session,
      titre: questionnaire.titre,
      total,
      answered,
      ouvert,
      ferme,
      completed,
      score: completed ? score : null,
    };
  });
}

/* ===== Vue formateur (admin) ========================================== */

/** Réponses d'un participant de la promotion (agrégées par question). */
export type SessionParticipantAnswers = {
  participantId: string;
  prenom: string;
  nom: string;
  answers: Map<string, string[]>;
};

/**
 * Réponses de tous les participants d'une promotion à un questionnaire, groupées
 * par participant (triées nom puis prénom). Ne renvoie que les participants ayant
 * au moins une réponse enregistrée.
 */
export async function getSessionResponses(
  sessionId: string,
  questionnaireId: string,
): Promise<SessionParticipantAnswers[]> {
  const sql = getSql();
  const rows = await sql<
    {
      participant_id: string;
      prenom: string;
      nom: string;
      question_id: string;
      option_ids: string[];
    }[]
  >`
    select
      p.id as participant_id, i.prenom, i.nom,
      r.question_id, r.option_ids
    from qcm_reponses r
    join participants p on p.id = r.participant_id
    join inscriptions i on i.id = p.inscription_id
    join qcm_questions qq on qq.id = r.question_id
    where p.session_id = ${sessionId}
      and qq.questionnaire_id = ${questionnaireId}
    order by i.nom asc, i.prenom asc
  `;

  const byParticipant = new Map<string, SessionParticipantAnswers>();
  const order: string[] = [];
  for (const row of rows) {
    let entry = byParticipant.get(row.participant_id);
    if (!entry) {
      entry = {
        participantId: row.participant_id,
        prenom: row.prenom,
        nom: row.nom,
        answers: new Map(),
      };
      byParticipant.set(row.participant_id, entry);
      order.push(row.participant_id);
    }
    entry.answers.set(row.question_id, row.option_ids);
  }
  return order.map((id) => byParticipant.get(id)!);
}

/** Ligne du tableau détail par participant (score /total, terminé ou non). */
export type ParticipantResultRow = {
  participantId: string;
  prenom: string;
  nom: string;
  answered: number;
  total: number;
  score: number;
  completed: boolean;
};

/**
 * Résultats individuels d'une promotion pour un questionnaire : score calculé
 * serveur pour chaque participant ayant répondu. `null` si le questionnaire est
 * inconnu.
 */
export async function getSessionResults(
  sessionId: string,
  questionnaireId: string,
): Promise<{
  questionnaire: QcmQuestionnaire;
  rows: ParticipantResultRow[];
} | null> {
  const questionnaire = await getQuestionnaireById(questionnaireId);
  if (!questionnaire) return null;
  const responses = await getSessionResponses(sessionId, questionnaireId);
  const total = questionnaire.questions.length;

  const rows: ParticipantResultRow[] = responses.map((participant) => ({
    participantId: participant.participantId,
    prenom: participant.prenom,
    nom: participant.nom,
    answered: participant.answers.size,
    total,
    score: scoreOf(questionnaire, participant.answers),
    completed: total > 0 && participant.answers.size === total,
  }));
  return { questionnaire, rows };
}

/** Répartition des réponses du groupe sur une option (mode présentation). */
export type OptionDistribution = {
  optionId: string;
  libelle: string;
  correcte: boolean;
  count: number;
  pct: number;
};

/** Répartition anonymisée par question (mode présentation formateur). */
export type QuestionDistribution = {
  questionId: string;
  ordre: number;
  enonce: string;
  type: QcmType;
  /** Nombre de participants ayant répondu à cette question (dénominateur). */
  respondents: number;
  options: OptionDistribution[];
};

/**
 * Répartition des réponses du groupe pour chaque question d'un questionnaire,
 * calculée sur les réponses réelles de la promotion. Le dénominateur d'une
 * question est le nombre de participants y ayant répondu (anonymisé). `null` si
 * le questionnaire est inconnu.
 */
export async function getSessionDistribution(
  sessionId: string,
  questionnaireId: string,
): Promise<{
  questionnaire: QcmQuestionnaire;
  questions: QuestionDistribution[];
} | null> {
  const questionnaire = await getQuestionnaireById(questionnaireId);
  if (!questionnaire) return null;
  const responses = await getSessionResponses(sessionId, questionnaireId);

  const questions: QuestionDistribution[] = questionnaire.questions.map(
    (question) => {
      const pickedByOption = new Map<string, number>();
      let respondents = 0;
      for (const participant of responses) {
        const picked = participant.answers.get(question.id);
        if (!picked) continue;
        respondents += 1;
        for (const optionId of picked) {
          pickedByOption.set(optionId, (pickedByOption.get(optionId) ?? 0) + 1);
        }
      }
      return {
        questionId: question.id,
        ordre: question.ordre,
        enonce: question.enonce,
        type: question.type,
        respondents,
        options: question.options.map((option) => {
          const count = pickedByOption.get(option.id) ?? 0;
          return {
            optionId: option.id,
            libelle: option.libelle,
            correcte: option.correcte,
            count,
            pct: respondents > 0 ? Math.round((count / respondents) * 100) : 0,
          };
        }),
      };
    },
  );
  return { questionnaire, questions };
}
