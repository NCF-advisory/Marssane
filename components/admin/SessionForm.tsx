"use client";

import { useActionState } from "react";
import type { SessionFormState } from "@/app/admin/dashboard/actions";
import { controlClass, Field } from "@/components/ui/Field";
import { SESSION_STATUTS } from "@/lib/validation";
import { SESSION_STATUT_LABELS } from "@/lib/admin-labels";

const initialSessionFormState: SessionFormState = { status: "idle" };

/** Valeurs de préremplissage (édition). Vides en création. */
export type SessionFormValues = {
  date?: string;
  heure_debut?: string | null;
  heure_fin?: string | null;
  lieu?: string | null;
  capacite?: number;
  statut?: string;
};

/**
 * Formulaire de création / édition de session (F3). Branché sur une server
 * action (`createSessionAction` ou `updateSessionAction.bind(null, id)`) via
 * `useActionState` : erreurs par champ sous chaque contrôle, erreur globale en
 * encart. La validation fait autorité côté serveur (lib/validation).
 */
export function SessionForm({
  action,
  values = {},
  submitLabel,
}: {
  action: (
    state: SessionFormState,
    formData: FormData,
  ) => Promise<SessionFormState>;
  values?: SessionFormValues;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialSessionFormState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid grid-cols-1 gap-y-[18px]">
      {state.formError && (
        <div
          role="alert"
          className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-ink-clay"
        >
          {state.formError}
        </div>
      )}

      <Field id="session-date" label="Date" required error={errors.date}>
        <input
          id="session-date"
          name="date"
          type="date"
          required
          defaultValue={values.date ?? ""}
          className={controlClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field
          id="session-heure-debut"
          label="Heure de début"
          error={errors.heure_debut}
        >
          <input
            id="session-heure-debut"
            name="heure_debut"
            type="time"
            defaultValue={values.heure_debut ?? ""}
            className={controlClass}
          />
        </Field>
        <Field
          id="session-heure-fin"
          label="Heure de fin"
          error={errors.heure_fin}
        >
          <input
            id="session-heure-fin"
            name="heure_fin"
            type="time"
            defaultValue={values.heure_fin ?? ""}
            className={controlClass}
          />
        </Field>
      </div>

      <Field id="session-lieu" label="Lieu" error={errors.lieu}>
        <input
          id="session-lieu"
          name="lieu"
          type="text"
          maxLength={200}
          placeholder="Ex. Marseille — centre-ville"
          defaultValue={values.lieu ?? ""}
          className={controlClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field
          id="session-capacite"
          label="Capacité"
          required
          error={errors.capacite}
        >
          <input
            id="session-capacite"
            name="capacite"
            type="number"
            required
            min={1}
            max={1000}
            step={1}
            defaultValue={values.capacite ?? 10}
            className={controlClass}
          />
        </Field>
        <Field id="session-statut" label="Statut" required error={errors.statut}>
          <select
            id="session-statut"
            name="statut"
            required
            defaultValue={values.statut ?? "brouillon"}
            className={controlClass}
          >
            {SESSION_STATUTS.map((value) => (
              <option key={value} value={value}>
                {SESSION_STATUT_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="mt-1 inline-flex w-fit items-center justify-center gap-2.5 rounded-btn bg-canard px-[30px] py-[14px] text-[15.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}
