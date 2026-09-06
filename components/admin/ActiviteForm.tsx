"use client";

import { useActionState } from "react";
import type { ActiviteFormState } from "@/app/admin/dashboard/crm/actions";
import { controlClass, Field, selectClass } from "@/components/ui/Field";
import { ACTIVITE_TYPE_LABELS } from "@/lib/crm-labels";
import { ACTIVITE_TYPES } from "@/lib/crm-validation";

const initialState: ActiviteFormState = { status: "idle" };

/**
 * Formulaire compact du journal d'activités (CRM · Lot 1) : consigne un
 * échange (appel, email, rencontre, note) et planifie au besoin la prochaine
 * relance. Branché sur `createActiviteAction.bind(null, personneId)` via
 * `useActionState`. La validation fait autorité côté serveur.
 */
export function ActiviteForm({
  action,
}: {
  action: (
    state: ActiviteFormState,
    formData: FormData,
  ) => Promise<ActiviteFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
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

      <Field id="activite-contenu" label="Contenu" required error={errors.contenu}>
        <textarea
          id="activite-contenu"
          name="contenu"
          rows={3}
          required
          maxLength={5000}
          placeholder="Ex. Appel de 20 min : intéressée par la session de septembre, attend le programme."
          className={controlClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field id="activite-type" label="Type" required error={errors.type}>
          <select
            id="activite-type"
            name="type"
            required
            defaultValue="note"
            className={selectClass}
          >
            {ACTIVITE_TYPES.map((value) => (
              <option key={value} value={value}>
                {ACTIVITE_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="activite-relance"
          label="Relance le"
          error={errors.relance_at}
        >
          <input
            id="activite-relance"
            name="relance_at"
            type="date"
            aria-describedby="activite-relance-aide"
            className={controlClass}
          />
          <p
            id="activite-relance-aide"
            className="mt-[6px] text-[12.5px] leading-[1.4] text-soft"
          >
            Optionnel — la relance remonte au tableau de bord à cette date.
          </p>
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="inline-flex w-fit items-center justify-center gap-2.5 rounded-btn border-[1.5px] border-outline bg-surface px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Enregistrement…" : "Consigner"}
      </button>
    </form>
  );
}
