import {
  correctOptionIds,
  isAnswerCorrect,
  type QcmQuestionnaire,
} from "@/lib/qcm";

/**
 * Récapitulatif d'un QCM terminé (côté participant). Score et corrections
 * calculés serveur à partir des réponses stockées : bonne réponse en écume,
 * réponse fausse choisie en clay, tags « votre réponse / bonne réponse » (comme
 * la maquette). Le composant reçoit le score déjà calculé et la table des
 * réponses du participant.
 */
export function QcmResults({
  questionnaire,
  answers,
  score,
}: {
  questionnaire: QcmQuestionnaire;
  answers: Map<string, string[]>;
  score: number;
}) {
  const total = questionnaire.questions.length;
  const message =
    score >= 8
      ? "Très bien, les bases sont solides !"
      : score >= 5
        ? "Bon départ, on revoit ensemble les points manqués."
        : "Pas de souci, on reprend les fondamentaux en session suivante.";

  return (
    <section className="rounded-card border border-hairline bg-surface p-7 shadow-card">
      <div className="py-2 text-center">
        <div className="mx-auto mb-3.5 flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full border-[3px] border-canard bg-toile">
          <span className="font-mono text-[2.1rem] font-semibold leading-none text-canard">
            {score}
          </span>
          <span className="text-[14px] text-soft">sur {total}</span>
        </div>
        <p className="text-[16px] text-body">{message}</p>
      </div>

      <h2 className="mb-3.5 mt-6 text-[18px] font-bold">Récapitulatif</h2>
      <div className="space-y-3.5">
        {questionnaire.questions.map((question, index) => {
          const picked = answers.get(question.id) ?? [];
          const ok = isAnswerCorrect(question, picked);
          const correctIds = correctOptionIds(question);
          return (
            <div
              key={question.id}
              className="rounded-card border border-hairline px-[18px] py-4"
            >
              <div className="mb-2.5 flex items-baseline gap-2.5">
                <span
                  className={`flex-none rounded-chip px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.04em] ${
                    ok
                      ? "bg-ecume text-ink-ecume"
                      : "bg-[rgba(199,90,77,0.14)] text-ink-clay"
                  }`}
                >
                  {ok ? "Juste" : "À revoir"}
                </span>
                <span className="font-semibold text-ink">
                  {index + 1}. {question.enonce}
                </span>
              </div>
              <div className="space-y-1">
                {question.options.map((option) => {
                  const isCorrect = correctIds.includes(option.id);
                  const isPicked = picked.includes(option.id);
                  const tone = isCorrect
                    ? "bg-ecume"
                    : isPicked
                      ? "bg-[rgba(199,90,77,0.12)]"
                      : "";
                  const mark = isCorrect ? "✓" : isPicked ? "✗" : "";
                  const markTone = isCorrect
                    ? "text-ink-ecume"
                    : isPicked
                      ? "text-ink-clay"
                      : "";
                  let tag = "";
                  if (isPicked && isCorrect) tag = "votre réponse · bonne réponse";
                  else if (isPicked) tag = "votre réponse";
                  else if (isCorrect) tag = "bonne réponse";
                  return (
                    <div
                      key={option.id}
                      className={`flex items-center gap-2 rounded-chip px-2.5 py-1.5 text-[14px] text-body ${tone}`}
                    >
                      <span
                        className={`w-[18px] flex-none font-bold ${markTone}`}
                        aria-hidden
                      >
                        {mark}
                      </span>
                      <span>{option.libelle}</span>
                      {tag && (
                        <span className="ml-auto whitespace-nowrap font-mono text-[11px] text-faint">
                          {tag}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
