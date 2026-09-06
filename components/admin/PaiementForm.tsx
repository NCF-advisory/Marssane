"use client";

import { useActionState } from "react";
import type { PaiementFormState } from "@/app/admin/dashboard/facturation/actions";
import { controlClass, Field, selectClass } from "@/components/ui/Field";
import {
  MOYEN_PAIEMENT_LABELS,
  MOYENS_PAIEMENT,
} from "@/lib/facturation-validation";

const initialState: PaiementFormState = { status: "idle" };

/**
 * Formulaire d'encaissement (Lot 2, cadrage §4.C) : montant, moyen, date de
 * réception, référence. Branché sur `paiementAction.bind(null, factureId)` ;
 * la facture bascule en « payée » quand le total encaissé couvre le TTC.
 */
export function PaiementForm({
  action,
  resteDu,
}: {
  action: (
    state: PaiementFormState,
    formData: FormData,
  ) => Promise<PaiementFormState>;
  /** Montant proposé par défaut (reste dû, en euros). */
  resteDu: number;
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

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field
          id="paiement-montant"
          label="Montant (€)"
          required
          error={errors.montant}
        >
          <input
            id="paiement-montant"
            name="montant"
            type="number"
            required
            min={0.01}
            step="0.01"
            defaultValue={resteDu > 0 ? resteDu : undefined}
            className={controlClass}
          />
        </Field>
        <Field id="paiement-moyen" label="Moyen" required error={errors.moyen}>
          <select
            id="paiement-moyen"
            name="moyen"
            required
            defaultValue="virement"
            className={selectClass}
          >
            {MOYENS_PAIEMENT.map((value) => (
              <option key={value} value={value}>
                {MOYEN_PAIEMENT_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field
          id="paiement-recu"
          label="Reçu le"
          required
          error={errors.recu_le}
        >
          <input
            id="paiement-recu"
            name="recu_le"
            type="date"
            required
            className={controlClass}
          />
        </Field>
        <Field
          id="paiement-reference"
          label="Référence"
          error={errors.reference}
        >
          <input
            id="paiement-reference"
            name="reference"
            type="text"
            maxLength={200}
            placeholder="Ex. VIR-20260915"
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
        {isPending ? "Enregistrement…" : "Enregistrer l'encaissement"}
      </button>
    </form>
  );
}
