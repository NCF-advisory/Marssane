"use client";

import { useActionState } from "react";
import { type LoginState, loginAction } from "@/app/formation/actions";
import { controlClass, Field } from "@/components/ui/Field";

const initialLoginState: LoginState = { status: "idle" };

/**
 * Formulaire de connexion participant (espace formation). Branché sur la server
 * action `loginAction` via `useActionState` : erreur globale en encart clay,
 * état « pending », et repeuplement de l'email après erreur. Même patron que le
 * formulaire admin (app/admin/LoginForm.tsx).
 */
export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialLoginState,
  );

  return (
    <form action={formAction} className="mt-7 grid grid-cols-1 gap-y-[18px]">
      {state.formError && (
        <div
          role="alert"
          className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-ink-clay"
        >
          {state.formError}
        </div>
      )}

      <Field id="participant-email" label="Email" required>
        <input
          id="participant-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          autoFocus
          defaultValue={state.email ?? ""}
          className={controlClass}
        />
      </Field>

      <Field id="participant-password" label="Mot de passe" required>
        <input
          id="participant-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={controlClass}
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="mt-1 inline-flex items-center justify-center gap-2.5 rounded-btn bg-canard px-[30px] py-4 text-[16.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
