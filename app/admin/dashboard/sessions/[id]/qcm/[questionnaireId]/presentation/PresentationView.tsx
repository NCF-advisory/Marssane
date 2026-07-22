"use client";

import { useState } from "react";

/** Répartition d'une option (anonymisée) pour le mode présentation. */
type OptionDist = {
  optionId: string;
  libelle: string;
  correcte: boolean;
  count: number;
  pct: number;
};
type QuestionDist = {
  questionId: string;
  enonce: string;
  type: "radio" | "checkbox";
  respondents: number;
  options: OptionDist[];
};

/**
 * Mode présentation projeté en salle (reprise à chaud). Overlay plein écran fond
 * encre (#0e0e12) posé au-dessus du tableau de bord, navigation question par
 * question (Précédent / Suivant) au rythme du formateur. Barre horizontale par
 * option (nombre + %), bonne réponse en turquoise. Réponses anonymisées : aucune
 * identité n'est affichée ici (le détail par participant reste sur la page de
 * session, non projeté).
 */
export function PresentationView({
  title,
  questions,
  exitHref,
}: {
  title: string;
  questions: QuestionDist[];
  exitHref: string;
}) {
  const [current, setCurrent] = useState(0);
  const total = questions.length;

  if (total === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0e0e12] px-6 text-center text-[#f1f2f4]">
        <p className="text-[22px] font-bold">Aucune question à présenter</p>
        <p className="mt-2 text-[15px] text-white/60">{title}</p>
        <a
          href={exitHref}
          className="mt-6 rounded-btn border border-white/20 px-5 py-2.5 text-[14px] transition-colors hover:bg-white/5"
        >
          Quitter
        </a>
      </div>
    );
  }

  const question = questions[current];

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[#0e0e12] text-[#f1f2f4]">
      <div className="mx-auto max-w-[1000px] px-7 pb-10 pt-6">
        <div className="mb-7 flex items-center gap-3.5 border-b border-white/10 pb-4">
          <span className="rounded-chip bg-white/[0.08] px-3 py-1.5 font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#c7d2f7]">
            Mode présentation · reprise à chaud
          </span>
          <span className="font-mono text-[15px] text-white/60">
            Question {current + 1} / {total}
          </span>
          <span className="flex-1" />
          <a
            href={exitHref}
            className="rounded-btn border border-white/20 px-3.5 py-1.5 text-[13.5px] transition-colors hover:bg-white/5"
          >
            Quitter
          </a>
        </div>

        <p className="mb-2 text-[2rem] font-extrabold leading-[1.25] tracking-[-0.02em]">
          {current + 1}. {question.enonce}
        </p>
        <p className="mb-7 font-mono text-[13px] uppercase tracking-[0.1em] text-white/60">
          {question.type === "checkbox"
            ? "Plusieurs réponses attendues · réponses anonymisées"
            : "Une seule bonne réponse · réponses anonymisées"}
        </p>

        <div>
          {question.options.map((option) => (
            <div key={option.optionId} className="mb-[18px]">
              <div className="mb-2 flex items-center gap-2.5 text-[1.15rem]">
                <span>{option.libelle}</span>
                {option.correcte && (
                  <span className="rounded-chip bg-turquoise px-2.5 py-1 font-mono text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink">
                    ✓ Bonne réponse
                  </span>
                )}
                <span className="ml-auto whitespace-nowrap font-mono text-[1.05rem] text-white/60">
                  {option.count}/{question.respondents} · {option.pct}%
                </span>
              </div>
              <div className="h-[30px] overflow-hidden rounded-btn bg-white/[0.08]">
                <div
                  className={`h-full rounded-btn transition-[width] duration-500 ${
                    option.correcte ? "bg-turquoise" : "bg-white/20"
                  }`}
                  style={{ width: `${Math.max(option.pct, option.count > 0 ? 2 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9 flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="rounded-btn bg-canard px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          >
            ← Précédent
          </button>
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            disabled={current === total - 1}
            className="rounded-btn bg-canard px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}
