import { getCurrentAdmin } from "@/lib/admin-auth";
import { toCsv } from "@/lib/csv";
import {
  getQuestionnaireById,
  getSessionResponses,
  isAnswerCorrect,
  scoreOf,
} from "@/lib/qcm";
import { parseId } from "@/lib/validation";

/**
 * Export CSV des résultats d'un QCM pour une promotion (base Qualiopi, archivage
 * par session). Colonnes : participant, score, réussite (%), puis une colonne
 * par question (Juste / Faux / — non répondue).
 *
 * Authentification admin explicite (défense en profondeur, en plus du proxy).
 * Scopé sur (session, questionnaire) : aucune fuite entre promotions. Score et
 * corrections calculés serveur à partir des réponses stockées. Format Excel fr
 * via lib/csv (BOM UTF-8, séparateur `;`, garde-fou anti-injection de formule).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; questionnaireId: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return new Response("Authentification requise.", { status: 401 });
  }

  const { id: rawId, questionnaireId: rawQid } = await params;
  const sessionId = parseId(rawId);
  const questionnaireId = parseId(rawQid);
  if (!sessionId || !questionnaireId) {
    return new Response("Introuvable.", { status: 404 });
  }

  let questionnaire: Awaited<ReturnType<typeof getQuestionnaireById>>;
  let responses: Awaited<ReturnType<typeof getSessionResponses>>;
  try {
    [questionnaire, responses] = await Promise.all([
      getQuestionnaireById(questionnaireId),
      getSessionResponses(sessionId, questionnaireId),
    ]);
  } catch {
    console.error("[admin] export CSV QCM : base indisponible");
    return new Response("Base de données indisponible.", { status: 503 });
  }

  if (!questionnaire) {
    return new Response("Questionnaire introuvable.", { status: 404 });
  }

  const total = questionnaire.questions.length;
  const headers = [
    "Participant",
    "Score",
    "Réussite (%)",
    ...questionnaire.questions.map((_, index) => `Q${index + 1}`),
  ];

  const rows = responses.map((participant) => {
    const score = scoreOf(questionnaire, participant.answers);
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const perQuestion = questionnaire.questions.map((question) => {
      const picked = participant.answers.get(question.id);
      if (!picked) return "—";
      return isAnswerCorrect(question, picked) ? "Juste" : "Faux";
    });
    return [
      `${participant.prenom} ${participant.nom}`,
      `${score}/${total}`,
      String(pct),
      ...perQuestion,
    ];
  });

  const csv = toCsv(headers, rows);
  const filename = `resultats-qcm-session${questionnaire.numeroSession}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
