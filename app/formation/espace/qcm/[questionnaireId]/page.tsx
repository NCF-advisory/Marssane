import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { getCurrentParticipant } from "@/lib/participant-auth";
import {
  getOuverture,
  getParticipantAnswers,
  getQuestionnaireById,
  type QcmQuestionnaire,
  scoreOf,
} from "@/lib/qcm";
import { parseId } from "@/lib/validation";
import { QcmResults } from "./QcmResults";
import { QcmRunner } from "./QcmRunner";

export const metadata: Metadata = {
  title: "QCM · Formation Marssane",
};

/** En-tête sobre de la page QCM (logo + retour à l'espace). */
function QcmTopbar() {
  return (
    <div className="mb-5 flex items-center justify-between">
      <LogoMarssane size={24} withWordmark />
      <a
        href="/formation/espace"
        className="font-mono text-[12.5px] font-semibold text-soft underline underline-offset-[3px] transition-colors hover:text-canard"
      >
        ← Mon espace
      </a>
    </div>
  );
}

/** Enveloppe carte + message centré (états sans passage : fermé, à venir…). */
function QcmNotice({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-card border border-hairline bg-surface p-7 text-center shadow-card">
      <p className="text-[18px] font-bold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-[440px] text-[14px] leading-[1.5] text-body">
        {body}
      </p>
      <a
        href="/formation/espace"
        className="mt-5 inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
      >
        Retour à mon espace
      </a>
    </section>
  );
}

/**
 * Passage d'un QCM par le participant. Défense en profondeur : session
 * revérifiée ici (en plus du proxy). Un participant ne peut accéder qu'aux
 * questionnaires ayant une ouverture pour SA promotion (`getOuverture` scopé sur
 * `sessionId` du cookie). Selon l'état : récapitulatif (terminé), passage
 * (ouvert, en cours), ou message (fermé / pas encore ouvert).
 */
export default async function QcmPage({
  params,
}: {
  params: Promise<{ questionnaireId: string }>;
}) {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/formation");

  const { questionnaireId: rawId } = await params;
  const questionnaireId = parseId(rawId);
  if (!questionnaireId) notFound();

  // On calcule un état simple dans le try/catch (aucun JSX construit ici, pour
  // que les erreurs de rendu ne soient pas confondues avec une base injoignable).
  type ViewState =
    | { kind: "db-error" }
    | { kind: "not-found" }
    | { kind: "results"; questionnaire: QcmQuestionnaire; answers: Map<string, string[]>; score: number }
    | { kind: "not-open" }
    | { kind: "closed" }
    | {
        kind: "run";
        questions: {
          id: string;
          enonce: string;
          type: "radio" | "checkbox";
          options: { id: string; libelle: string }[];
        }[];
        startIndex: number;
      };

  let state: ViewState;
  try {
    const [questionnaire, ouverture, answers] = await Promise.all([
      getQuestionnaireById(questionnaireId),
      getOuverture(participant.sessionId, questionnaireId),
      getParticipantAnswers(participant.sub, questionnaireId),
    ]);

    if (!questionnaire) {
      state = { kind: "not-found" };
    } else {
      const total = questionnaire.questions.length;
      const completed = total > 0 && answers.size === total;
      if (completed) {
        state = {
          kind: "results",
          questionnaire,
          answers,
          score: scoreOf(questionnaire, answers),
        };
      } else if (!ouverture) {
        state = { kind: "not-open" };
      } else if (ouverture.fermeAt) {
        state = { kind: "closed" };
      } else {
        const firstUnanswered = questionnaire.questions.findIndex(
          (q) => !answers.has(q.id),
        );
        state = {
          kind: "run",
          questions: questionnaire.questions.map((q) => ({
            id: q.id,
            enonce: q.enonce,
            type: q.type,
            options: q.options.map((o) => ({ id: o.id, libelle: o.libelle })),
          })),
          startIndex: firstUnanswered === -1 ? 0 : firstUnanswered,
        };
      }
    }
  } catch {
    console.error("[formation] QCM : base indisponible");
    state = { kind: "db-error" };
  }

  if (state.kind === "not-found") notFound();

  return (
    <main className="mx-auto w-full max-w-[780px] px-4 py-8 sm:px-6">
      <QcmTopbar />
      {state.kind === "db-error" && <DbUnavailable />}
      {state.kind === "results" && (
        <QcmResults
          questionnaire={state.questionnaire}
          answers={state.answers}
          score={state.score}
        />
      )}
      {state.kind === "not-open" && (
        <QcmNotice
          title="QCM pas encore ouvert"
          body="Le formateur ouvrira ce questionnaire en fin de session. Revenez à ce moment-là depuis votre espace."
        />
      )}
      {state.kind === "closed" && (
        <QcmNotice
          title="QCM fermé"
          body="Ce questionnaire est clôturé et n'accepte plus de réponse."
        />
      )}
      {state.kind === "run" && (
        <QcmRunner questions={state.questions} startIndex={state.startIndex} />
      )}
    </main>
  );
}
