"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { answerQuestionAction } from "@/app/formation/actions";

/** Question transmise au client : jamais le flag « correcte » (score serveur). */
type RunnerOption = { id: string; libelle: string };
type RunnerQuestion = {
  id: string;
  enonce: string;
  type: "radio" | "checkbox";
  options: RunnerOption[];
};

/**
 * Passage d'un QCM côté participant : une question par écran, progression, radio
 * ou checkbox selon le type, bouton Valider (désactivé sans sélection) qui
 * enchaîne. Chaque validation enregistre la réponse en base au fil de l'eau
 * (`answerQuestionAction`) ; la dernière (« Terminer ») rafraîchit la page, qui
 * bascule alors sur le récapitulatif (score et corrections calculés serveur).
 *
 * `startIndex` = première question sans réponse : un rechargement reprend où le
 * participant en était. Le client ne connaît jamais les bonnes réponses.
 */
export function QcmRunner({
  questions,
  startIndex,
}: {
  questions: RunnerQuestion[];
  startIndex: number;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(startIndex);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const question = questions[current];
  const total = questions.length;
  const isLast = current === total - 1;
  const isCheckbox = question.type === "checkbox";

  const toggle = (optionId: string) => {
    setError(null);
    setSelected((prev) => {
      if (isCheckbox) {
        return prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId];
      }
      return [optionId];
    });
  };

  const validate = () => {
    if (isPending || selected.length === 0) return;
    const questionId = question.id;
    const optionIds = selected;
    startTransition(async () => {
      const result = await answerQuestionAction({ questionId, optionIds });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (isLast) {
        // La page serveur re-rend le récapitulatif (participant « terminé »).
        router.refresh();
        return;
      }
      setCurrent((c) => c + 1);
      setSelected([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <section className="rounded-card border border-hairline bg-surface p-7 shadow-card">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[13px] font-semibold text-soft">
          Question {current + 1}/{total}
        </span>
        <span className="text-[12.5px] text-soft">
          {isCheckbox ? "Plusieurs réponses possibles" : "Une seule réponse"}
        </span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-chip bg-bar-track">
        <div
          className="h-full rounded-chip bg-canard transition-[width] duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <p className="mb-1.5 text-[19px] font-bold leading-[1.3] tracking-[-0.01em] text-ink">
        {question.enonce}
      </p>
      <p className="mb-5 text-[13px] text-soft">
        {isCheckbox
          ? "Cochez toutes les bonnes réponses."
          : "Sélectionnez une réponse."}
      </p>

      <div className="mb-6 grid gap-2.5">
        {question.options.map((option) => {
          const checked = selected.includes(option.id);
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-start gap-3 rounded-card border-[1.5px] px-4 py-3 transition-colors ${
                checked
                  ? "border-canard bg-[rgba(14,114,145,0.06)]"
                  : "border-hairline hover:border-[rgba(14,114,145,0.45)]"
              }`}
            >
              <input
                type={isCheckbox ? "checkbox" : "radio"}
                name="qcm-option"
                checked={checked}
                onChange={() => toggle(option.id)}
                className="mt-0.5 h-[17px] w-[17px] flex-none accent-canard"
              />
              <span className="text-[15px] leading-[1.4] text-body">
                {option.libelle}
              </span>
            </label>
          );
        })}
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-chip bg-[rgba(199,90,77,0.14)] px-3.5 py-2.5 text-[13px] leading-[1.4] text-ink-clay"
        >
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={validate}
          disabled={isPending || selected.length === 0}
          aria-busy={isPending}
          className="inline-flex items-center justify-center rounded-btn bg-canard px-[22px] py-2.5 text-[15px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:bg-repere disabled:shadow-none"
        >
          {isPending ? "Enregistrement…" : isLast ? "Terminer" : "Valider"}
        </button>
      </div>
    </section>
  );
}
