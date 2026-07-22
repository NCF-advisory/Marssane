"use client";

import { useActionState } from "react";
import { type ActivationState, activateAction } from "@/app/formation/actions";
import { controlClass, Field } from "@/components/ui/Field";

const initialState: ActivationState = { status: "idle" };

/**
 * Formulaire d'activation : choix du mot de passe (+ confirmation). Le token
 * d'invitation est transmis en champ caché. Branché sur `activateAction` via
 * `useActionState` : erreurs par champ (mot de passe, confirmation) et erreur
 * globale en encart clay.
 */
export function ActivationForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    activateAction,
    initialState,
  );
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="mt-7 grid grid-cols-1 gap-y-[18px]">
      <input type="hidden" name="token" value={token} />

      {state.formError && (
        <div
          role="alert"
          className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-ink-clay"
        >
          {state.formError}
        </div>
      )}

      <Field
        id="activation-password"
        label="Mot de passe"
        required
        error={fieldErrors.password}
      >
        <input
          id="activation-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          autoFocus
          aria-invalid={fieldErrors.password ? true : undefined}
          aria-describedby={
            fieldErrors.password ? "activation-password-error" : undefined
          }
          className={controlClass}
        />
      </Field>

      <Field
        id="activation-password-confirm"
        label="Confirmer le mot de passe"
        required
        error={fieldErrors.password_confirm}
      >
        <input
          id="activation-password-confirm"
          name="password_confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          aria-invalid={fieldErrors.password_confirm ? true : undefined}
          aria-describedby={
            fieldErrors.password_confirm
              ? "activation-password-confirm-error"
              : undefined
          }
          className={controlClass}
        />
      </Field>

      <p className="text-[12.5px] leading-[1.4] text-soft">
        Au moins 8 caractères.
      </p>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="mt-1 inline-flex items-center justify-center gap-2.5 rounded-btn bg-canard px-[30px] py-4 text-[16.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Activation…" : "Activer mon compte"}
      </button>
    </form>
  );
}
