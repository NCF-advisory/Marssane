"use client";

import { useActionState } from "react";
import { type ContactState, submitContact } from "@/app/actions/contact";
import { Chevron } from "@/components/ui/Chevron";
import { controlClassSurInk, Field } from "@/components/ui/Field";

/**
 * État initial de `useActionState`. Défini côté client (pas dans le fichier
 * `"use server"`, où Next.js 16 interdit les exports non-async) — même motif
 * que `initialLoginState` dans app/admin/LoginForm.tsx.
 */
const initialContactState: ContactState = { status: "idle" };

/**
 * Formulaire de contact « implémentation » (F4 · CDC §5.4). Extrait de la
 * section <AllerPlusLoin> (qui reste server component) pour porter l'état client.
 *
 * Branché sur la server action `submitContact` via `useActionState` : erreurs
 * par champ (Field error) + erreur globale, état « pending », repeuplement des
 * valeurs sans JS (progressive enhancement). En succès, la confirmation inline
 * remplace le formulaire (pas de redirection, CDC §5.4).
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialContactState,
  );

  const fieldErrors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  /** aria-invalid / aria-describedby reliant un champ à son message d'erreur. */
  const errorAttrs = (name: string, id: string) =>
    fieldErrors[name]
      ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` }
      : {};

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="mt-7 rounded-card bg-ecume-sur-ink px-5 py-4 text-[14.5px] leading-[1.55] text-ecume"
      >
        Votre demande est bien envoyée. Nous revenons vers vous sous 48&nbsp;h.
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-7 grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2"
    >
      {state.formError && (
        <div
          role="alert"
          className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-erreur sm:col-span-2"
        >
          {state.formError}
        </div>
      )}

      <Field id="f4-prenom" label="Prénom" required error={fieldErrors.prenom}>
        <input
          id="f4-prenom"
          name="prenom"
          type="text"
          required
          autoComplete="given-name"
          defaultValue={values.prenom ?? ""}
          {...errorAttrs("prenom", "f4-prenom")}
          className={controlClassSurInk}
        />
      </Field>
      <Field id="f4-nom" label="Nom" required error={fieldErrors.nom}>
        <input
          id="f4-nom"
          name="nom"
          type="text"
          required
          autoComplete="family-name"
          defaultValue={values.nom ?? ""}
          {...errorAttrs("nom", "f4-nom")}
          className={controlClassSurInk}
        />
      </Field>
      <Field id="f4-email" label="Email" required error={fieldErrors.email}>
        <input
          id="f4-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          defaultValue={values.email ?? ""}
          {...errorAttrs("email", "f4-email")}
          className={controlClassSurInk}
        />
      </Field>
      <Field id="f4-telephone" label="Téléphone" error={fieldErrors.telephone}>
        <input
          id="f4-telephone"
          name="telephone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          defaultValue={values.telephone ?? ""}
          {...errorAttrs("telephone", "f4-telephone")}
          className={controlClassSurInk}
        />
      </Field>
      <Field
        id="f4-entreprise"
        label="Entreprise"
        required
        className="sm:col-span-2"
        error={fieldErrors.entreprise}
      >
        <input
          id="f4-entreprise"
          name="entreprise"
          type="text"
          required
          autoComplete="organization"
          defaultValue={values.entreprise ?? ""}
          {...errorAttrs("entreprise", "f4-entreprise")}
          className={controlClassSurInk}
        />
      </Field>
      <Field
        id="f4-message"
        label="Message"
        required
        className="sm:col-span-2"
        error={fieldErrors.message}
      >
        <textarea
          id="f4-message"
          name="message"
          required
          rows={5}
          defaultValue={values.message ?? ""}
          {...errorAttrs("message", "f4-message")}
          className={`${controlClassSurInk} resize-y`}
        />
      </Field>

      {/* Honeypot anti-spam — inerte, hors écran (F4 · CDC §5.4). */}
      <input
        type="text"
        name="site_web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <label className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-faint-sur-ink sm:col-span-2">
        {/* Enveloppe de 24 px autour d'une case laissée à 16 px : cible tactile
            suffisante, alignement inchangé (cf. <ReservationDialog>). */}
        <span className="-mt-px flex h-6 w-6 flex-none items-center justify-center">
          <input
            type="checkbox"
            name="consentement"
            required
            defaultChecked={values.consentement === "on"}
            className="h-4 w-4 accent-turquoise [color-scheme:dark]"
          />
        </span>
        <span>
          J&apos;accepte que mes données soient utilisées pour traiter ma
          demande, conformément à la{" "}
          <a
            href="/confidentialite"
            className="text-turquoise underline hover:text-white"
          >
            politique de confidentialité
          </a>
          .
        </span>
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          // Palier mobile sur le padding et le corps du libellé : dans la carte
          // de /implementation, il ne reste que 230 px à 320 px de large, et
          // « Envoyer ma demande » suivi du chevron passait sur deux lignes.
          // À partir de sm, le bouton reprend exactement le gabarit du CTA
          // primaire (16,5 px / 700, padding 15/26/15/27).
          className="inline-flex items-center gap-[13px] rounded-btn bg-canard px-5 py-[15px] text-[15px] font-bold tracking-[-0.005em] text-white shadow-cta transition-[background-color] duration-[180ms] ease-out hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70 sm:pl-[27px] sm:pr-[26px] sm:text-[16.5px]"
        >
          {isPending ? "Envoi…" : "Envoyer ma demande"}
          {!isPending && <Chevron />}
        </button>
      </div>
    </form>
  );
}
