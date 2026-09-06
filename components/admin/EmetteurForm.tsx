"use client";

import { useActionState } from "react";
import type { EmetteurFormState } from "@/app/admin/dashboard/facturation/actions";
import { controlClass, Field, selectClass } from "@/components/ui/Field";
import type { EmetteurRow } from "@/lib/facturation";
import { REGIME_TVA_LABELS, REGIMES_TVA } from "@/lib/facturation-validation";

const initialState: EmetteurFormState = { status: "idle" };

/**
 * Formulaire des paramètres de facturation (Lot 2, cadrage §7) : identité de
 * l'émetteur, régime de TVA, conditions de paiement. Tous les champs sont
 * facultatifs À LA SAISIE — mais l'émission de factures reste bloquée tant que
 * raison sociale, forme, SIREN, adresse et régime de TVA ne sont pas remplis.
 */
export function EmetteurForm({
  action,
  values,
}: {
  action: (
    state: EmetteurFormState,
    formData: FormData,
  ) => Promise<EmetteurFormState>;
  values: EmetteurRow | null;
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
      {state.status === "saved" && (
        <div
          role="status"
          className="rounded-chip bg-ecume px-4 py-3 text-[13.5px] leading-[1.5] text-ink-ecume"
        >
          Paramètres enregistrés.
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field
          id="emetteur-raison"
          label="Raison sociale"
          error={errors.raison_sociale}
        >
          <input
            id="emetteur-raison"
            name="raison_sociale"
            type="text"
            maxLength={200}
            defaultValue={values?.raison_sociale ?? ""}
            className={controlClass}
          />
        </Field>
        <Field
          id="emetteur-forme"
          label="Forme juridique"
          error={errors.forme_juridique}
        >
          <input
            id="emetteur-forme"
            name="forme_juridique"
            type="text"
            maxLength={100}
            placeholder="Ex. SAS"
            defaultValue={values?.forme_juridique ?? ""}
            className={controlClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-3">
        <Field id="emetteur-capital" label="Capital social" error={errors.capital}>
          <input
            id="emetteur-capital"
            name="capital"
            type="text"
            maxLength={100}
            placeholder="Ex. 10 000 €"
            defaultValue={values?.capital ?? ""}
            className={controlClass}
          />
        </Field>
        <Field id="emetteur-siren" label="SIREN" error={errors.siren}>
          <input
            id="emetteur-siren"
            name="siren"
            type="text"
            maxLength={12}
            placeholder="9 chiffres"
            defaultValue={values?.siren ?? ""}
            className={controlClass}
          />
        </Field>
        <Field
          id="emetteur-tva-intra"
          label="TVA intracommunautaire"
          error={errors.tva_intra}
        >
          <input
            id="emetteur-tva-intra"
            name="tva_intra"
            type="text"
            maxLength={20}
            placeholder="FRXX123456789"
            defaultValue={values?.tva_intra ?? ""}
            className={controlClass}
          />
        </Field>
      </div>

      <Field id="emetteur-adresse" label="Adresse" error={errors.adresse}>
        <input
          id="emetteur-adresse"
          name="adresse"
          type="text"
          maxLength={300}
          defaultValue={values?.adresse ?? ""}
          className={controlClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-3">
        <Field
          id="emetteur-cp"
          label="Code postal"
          error={errors.code_postal}
        >
          <input
            id="emetteur-cp"
            name="code_postal"
            type="text"
            maxLength={12}
            defaultValue={values?.code_postal ?? ""}
            className={controlClass}
          />
        </Field>
        <Field id="emetteur-ville" label="Ville" error={errors.ville}>
          <input
            id="emetteur-ville"
            name="ville"
            type="text"
            maxLength={100}
            defaultValue={values?.ville ?? ""}
            className={controlClass}
          />
        </Field>
        <Field id="emetteur-tel" label="Téléphone" error={errors.telephone}>
          <input
            id="emetteur-tel"
            name="telephone"
            type="tel"
            maxLength={30}
            defaultValue={values?.telephone ?? ""}
            className={controlClass}
          />
        </Field>
      </div>

      <Field id="emetteur-email" label="Email" error={errors.email}>
        <input
          id="emetteur-email"
          name="email"
          type="email"
          maxLength={200}
          defaultValue={values?.email ?? ""}
          className={controlClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-3">
        <Field
          id="emetteur-regime"
          label="Régime de TVA"
          error={errors.regime_tva}
          className="sm:col-span-2"
        >
          <select
            id="emetteur-regime"
            name="regime_tva"
            defaultValue={values?.regime_tva ?? ""}
            className={selectClass}
          >
            <option value="">— À valider avec le comptable —</option>
            {REGIMES_TVA.map((value) => (
              <option key={value} value={value}>
                {REGIME_TVA_LABELS[value]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="emetteur-taux"
          label="Taux de TVA par défaut (%)"
          error={errors.taux_tva_defaut}
        >
          <input
            id="emetteur-taux"
            name="taux_tva_defaut"
            type="number"
            min={0}
            max={30}
            step="0.1"
            defaultValue={values?.taux_tva_defaut ?? "20"}
            className={controlClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-3">
        <Field
          id="emetteur-delai"
          label="Délai de paiement (jours)"
          error={errors.delai_paiement_jours}
        >
          <input
            id="emetteur-delai"
            name="delai_paiement_jours"
            type="number"
            min={0}
            max={120}
            step={1}
            defaultValue={values?.delai_paiement_jours ?? 30}
            className={controlClass}
          />
        </Field>
        <Field id="emetteur-iban" label="IBAN" error={errors.iban}>
          <input
            id="emetteur-iban"
            name="iban"
            type="text"
            maxLength={40}
            defaultValue={values?.iban ?? ""}
            className={controlClass}
          />
        </Field>
        <Field id="emetteur-bic" label="BIC" error={errors.bic}>
          <input
            id="emetteur-bic"
            name="bic"
            type="text"
            maxLength={15}
            defaultValue={values?.bic ?? ""}
            className={controlClass}
          />
        </Field>
      </div>

      <Field
        id="emetteur-mentions"
        label="Mentions complémentaires"
        error={errors.mentions_complementaires}
      >
        <textarea
          id="emetteur-mentions"
          name="mentions_complementaires"
          rows={3}
          maxLength={2000}
          placeholder="Ex. numéro de déclaration d'activité de formation, assurance RC pro…"
          defaultValue={values?.mentions_complementaires ?? ""}
          className={controlClass}
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="mt-1 inline-flex w-fit items-center justify-center gap-2.5 rounded-btn bg-canard px-[30px] py-[14px] text-[15.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Enregistrement…" : "Enregistrer les paramètres"}
      </button>
    </form>
  );
}
