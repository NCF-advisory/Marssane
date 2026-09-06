"use client";

import { useActionState } from "react";
import type { OpportuniteFormState } from "@/app/admin/dashboard/crm/actions";
import { controlClass, Field, selectClass } from "@/components/ui/Field";
import { ETAPE_LABELS } from "@/lib/crm-labels";
import { ETAPES } from "@/lib/crm-validation";

const initialState: OpportuniteFormState = { status: "idle" };

/**
 * Formulaire compact de création d'opportunité, sur la fiche personne
 * (CRM · Lot 1). Branché sur `createOpportuniteAction.bind(null, personneId)`
 * via `useActionState`. La validation fait autorité côté serveur.
 */
export function OpportuniteForm({
  action,
}: {
  action: (
    state: OpportuniteFormState,
    formData: FormData,
  ) => Promise<OpportuniteFormState>;
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

      <Field id="opportunite-titre" label="Titre" error={errors.titre}>
        <input
          id="opportunite-titre"
          name="titre"
          type="text"
          maxLength={200}
          placeholder="Ex. Formation débutant — 2 participants"
          className={controlClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field id="opportunite-etape" label="Étape" required error={errors.etape}>
          <select
            id="opportunite-etape"
            name="etape"
            required
            defaultValue="contact"
            className={selectClass}
          >
            {ETAPES.map((value) => (
              <option key={value} value={value}>
                {ETAPE_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="opportunite-montant"
          label="Montant estimé (€ HT)"
          error={errors.montant_estime}
        >
          <input
            id="opportunite-montant"
            name="montant_estime"
            type="number"
            min={0}
            step="0.01"
            placeholder="Ex. 1500"
            className={controlClass}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="inline-flex w-fit items-center justify-center gap-2.5 rounded-btn border-[1.5px] border-outline bg-surface px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Enregistrement…" : "Ajouter l'opportunité"}
      </button>
    </form>
  );
}
