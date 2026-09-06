"use client";

import { useActionState } from "react";
import type { PersonneFormState } from "@/app/admin/dashboard/crm/actions";
import { controlClass, Field } from "@/components/ui/Field";
import { ROLE_LABELS } from "@/lib/crm-labels";
import { ROLES } from "@/lib/crm-validation";

const initialState: PersonneFormState = { status: "idle" };

/**
 * Formulaire de création d'une fiche personne (CRM · Lot 1). Branché sur
 * `createPersonneAction` via `useActionState` : erreurs par champ sous chaque
 * contrôle, erreur globale en encart. La validation fait autorité côté serveur
 * (lib/crm-validation). L'entreprise est saisie en texte libre : l'organisation
 * est créée ou retrouvée par nom côté serveur.
 */
export function PersonneForm({
  action,
}: {
  action: (
    state: PersonneFormState,
    formData: FormData,
  ) => Promise<PersonneFormState>;
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
        <Field id="personne-prenom" label="Prénom" required error={errors.prenom}>
          <input
            id="personne-prenom"
            name="prenom"
            type="text"
            required
            maxLength={100}
            className={controlClass}
          />
        </Field>
        <Field id="personne-nom" label="Nom" required error={errors.nom}>
          <input
            id="personne-nom"
            name="nom"
            type="text"
            required
            maxLength={100}
            className={controlClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field id="personne-email" label="Email" error={errors.email}>
          <input
            id="personne-email"
            name="email"
            type="email"
            maxLength={200}
            className={controlClass}
          />
        </Field>
        <Field id="personne-telephone" label="Téléphone" error={errors.telephone}>
          <input
            id="personne-telephone"
            name="telephone"
            type="tel"
            maxLength={20}
            placeholder="06 12 34 56 78"
            className={controlClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field
          id="personne-organisation"
          label="Entreprise"
          error={errors.organisation}
        >
          <input
            id="personne-organisation"
            name="organisation"
            type="text"
            maxLength={200}
            placeholder="Ex. Ateliers Fabre"
            className={controlClass}
          />
        </Field>
        <Field id="personne-fonction" label="Fonction" error={errors.fonction}>
          <input
            id="personne-fonction"
            name="fonction"
            type="text"
            maxLength={120}
            placeholder="Ex. Dirigeante"
            className={controlClass}
          />
        </Field>
      </div>

      {/* Rôles : cases à cocher (une personne peut en cumuler plusieurs). */}
      <div>
        <span className="mb-[7px] block text-[13.5px] font-semibold">
          Rôles
          <span aria-hidden className="text-requis">
            {" "}
            *
          </span>
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {ROLES.map((role) => (
            <label
              key={role}
              className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-body"
            >
              <input
                type="checkbox"
                name="roles"
                value={role}
                defaultChecked={role === "prospect"}
                className="h-4 w-4 accent-canard"
              />
              {ROLE_LABELS[role]}
            </label>
          ))}
        </div>
        {errors.roles && (
          <p className="mt-[6px] text-[12.5px] leading-[1.4] text-erreur">
            {errors.roles}
          </p>
        )}
      </div>

      <Field id="personne-source" label="Source" error={errors.source}>
        <input
          id="personne-source"
          name="source"
          type="text"
          maxLength={200}
          placeholder="Ex. réseau Novances, recommandation…"
          className={controlClass}
        />
      </Field>

      <Field id="personne-notes" label="Notes" error={errors.notes}>
        <textarea
          id="personne-notes"
          name="notes"
          rows={4}
          maxLength={5000}
          className={controlClass}
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="mt-1 inline-flex w-fit items-center justify-center gap-2.5 rounded-btn bg-canard px-[30px] py-[14px] text-[15.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Enregistrement…" : "Créer la fiche"}
      </button>
    </form>
  );
}
