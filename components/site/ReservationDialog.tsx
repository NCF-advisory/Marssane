"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  initialInscriptionState,
  submitInscription,
} from "@/app/actions/inscription";
import { controlClass, Field } from "@/components/ui/Field";
import { LogoMarssane } from "@/components/ui/LogoMarssane";

/** Options du champ « Métier » (CDC §5.2). */
const METIERS = [
  "Dirigeant de PME",
  "Avocat",
  "Notaire",
  "Expert-comptable",
  "Autre",
];

type ReservationDialogProps = {
  /** Libellé du champ « Session » (lecture seule) — date + lieu ou liste d'attente. */
  sessionLabel: string;
  /** `true` si la prochaine session est complète : inscription en liste d'attente. */
  sessionComplete: boolean;
};

/**
 * Modale de pré-inscription (F2). <dialog> natif : focus trap, Esc et ::backdrop
 * gratuits. Ouverte par <ReservationTrigger> via document.getElementById +
 * showModal(). Fermeture : bouton ✕, Esc (natif) ou clic sur le backdrop.
 *
 * Le formulaire est branché sur la server action `submitInscription` via
 * `useActionState` : erreurs par champ + erreur globale, état « pending », et
 * repeuplement des valeurs sans JS (progressive enhancement).
 */
export function ReservationDialog({
  sessionLabel,
  sessionComplete,
}: ReservationDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState(
    submitInscription,
    initialInscriptionState,
  );

  /**
   * Rejoue la séquence d'entrée à chaque ouverture. L'attribut `[open]` seul ne
   * relance pas des animations CSS sur un nœud qui reste monté ; on écoute donc
   * l'événement natif `toggle` du <dialog> et on incrémente `runId`, utilisé
   * comme `key` sur le conteneur .reservation-seq → React le remonte, ce qui
   * relance proprement toutes les animations depuis leur frame 0.
   *
   * L'état du formulaire (valeurs, erreurs) est porté par `useActionState` sur
   * CE composant (hors du sous-arbre remonté) : il survit au remontage — les
   * champs non contrôlés se repeuplent via `defaultValue={values.*}`.
   */
  const [runId, setRunId] = useState(0);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onToggle = () => {
      if (dialog.open) setRunId((n) => n + 1);
    };
    dialog.addEventListener("toggle", onToggle);
    return () => dialog.removeEventListener("toggle", onToggle);
  }, []);

  const close = () => ref.current?.close();
  const fieldErrors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  /** aria-invalid / aria-describedby reliant un champ à son message d'erreur. */
  const errorAttrs = (name: string, id: string) =>
    fieldErrors[name]
      ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` }
      : {};

  return (
    <dialog
      ref={ref}
      id="reservation-dialog"
      aria-labelledby="reservation-dialog-title"
      onClick={(event) => {
        // Clic sur le backdrop : la cible est le <dialog> lui-même.
        if (event.target === ref.current) close();
      }}
      className="relative flex max-h-[calc(100vh-64px)] w-[640px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-card border-0 bg-surface p-0 shadow-hero backdrop:bg-[rgba(14,14,18,0.55)]"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Fermer"
        className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-[18px] leading-none text-soft transition-colors hover:bg-toile hover:text-ink"
      >
        <span aria-hidden>✕</span>
      </button>

      <div
        key={runId}
        className="reservation-seq overflow-y-auto px-6 py-8 sm:px-10 sm:py-10"
      >
        <div className="reservation-seq__logo mb-7 flex justify-center">
          <LogoMarssane withWordmark plusClassName="reservation-seq__plus" />
        </div>

        <div className="reservation-seq__body">
          <h2
            id="reservation-dialog-title"
            className="pr-10 text-[24px] font-extrabold leading-[1.1] tracking-[-0.02em]"
          >
            Réserver ma place
          </h2>

          {sessionComplete && (
            <p className="mt-6 rounded-card bg-toile px-4 py-3 text-[13.5px] leading-[1.5] text-body">
              La session est complète : ce formulaire vous inscrit en liste
              d&apos;attente.
            </p>
          )}

          {/* Formulaire de pré-inscription (F2) */}
          <form
          action={formAction}
          className="mt-7 grid grid-cols-1 gap-x-4 gap-y-[18px] text-left sm:grid-cols-2"
        >
          {state.formError && (
            <div
              role="alert"
              className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-ink-clay sm:col-span-2"
            >
              {state.formError}
            </div>
          )}

          <Field id="f2-prenom" label="Prénom" required error={fieldErrors.prenom}>
            <input
              id="f2-prenom"
              name="prenom"
              type="text"
              required
              autoComplete="given-name"
              defaultValue={values.prenom ?? ""}
              {...errorAttrs("prenom", "f2-prenom")}
              className={controlClass}
            />
          </Field>
          <Field id="f2-nom" label="Nom" required error={fieldErrors.nom}>
            <input
              id="f2-nom"
              name="nom"
              type="text"
              required
              autoComplete="family-name"
              defaultValue={values.nom ?? ""}
              {...errorAttrs("nom", "f2-nom")}
              className={controlClass}
            />
          </Field>
          <Field id="f2-email" label="Email" required error={fieldErrors.email}>
            <input
              id="f2-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              defaultValue={values.email ?? ""}
              {...errorAttrs("email", "f2-email")}
              className={controlClass}
            />
          </Field>
          <Field
            id="f2-telephone"
            label="Téléphone"
            required
            error={fieldErrors.telephone}
          >
            <input
              id="f2-telephone"
              name="telephone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              defaultValue={values.telephone ?? ""}
              {...errorAttrs("telephone", "f2-telephone")}
              className={controlClass}
            />
          </Field>
          <Field id="f2-metier" label="Métier" required error={fieldErrors.metier}>
            <select
              id="f2-metier"
              name="metier"
              required
              defaultValue={values.metier ?? ""}
              {...errorAttrs("metier", "f2-metier")}
              className={controlClass}
            >
              <option value="" disabled>
                Sélectionnez…
              </option>
              {METIERS.map((metier) => (
                <option key={metier} value={metier}>
                  {metier}
                </option>
              ))}
            </select>
          </Field>
          <Field
            id="f2-metier-autre"
            label="Si « Autre », précisez"
            error={fieldErrors.metier_autre}
          >
            <input
              id="f2-metier-autre"
              name="metier_autre"
              type="text"
              autoComplete="off"
              defaultValue={values.metier_autre ?? ""}
              {...errorAttrs("metier_autre", "f2-metier-autre")}
              className={controlClass}
            />
          </Field>
          <Field
            id="f2-entreprise"
            label="Entreprise / cabinet"
            className="sm:col-span-2"
            error={fieldErrors.entreprise}
          >
            <input
              id="f2-entreprise"
              name="entreprise"
              type="text"
              autoComplete="organization"
              defaultValue={values.entreprise ?? ""}
              {...errorAttrs("entreprise", "f2-entreprise")}
              className={controlClass}
            />
          </Field>
          <Field id="f2-session" label="Session" required className="sm:col-span-2">
            <input
              id="f2-session"
              name="session"
              type="text"
              readOnly
              required
              value={sessionLabel}
              className={`${controlClass} cursor-default bg-toile text-muted`}
            />
          </Field>

          {/* Honeypot anti-spam — inerte, hors écran (F2 · CDC §5.2). */}
          <input
            type="text"
            name="site_web"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <label className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-soft sm:col-span-2">
            <input
              type="checkbox"
              name="consentement"
              required
              defaultChecked={values.consentement === "on"}
              className="mt-[3px] h-4 w-4 flex-none accent-canard"
            />
            <span>
              J&apos;accepte que mes données soient utilisées pour ma
              pré-inscription, conformément à la{" "}
              <a
                href="/confidentialite"
                className="text-canard underline hover:text-canard-dark"
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
              className="inline-flex items-center gap-2.5 rounded-btn bg-canard px-[30px] py-4 text-[16.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Envoi…" : "Réserver ma place"}
              {!isPending && (
                <span aria-hidden className="text-[1.1em] leading-none">
                  →
                </span>
              )}
            </button>
          </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
