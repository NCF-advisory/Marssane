"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { controlClass, Field } from "@/components/ui/Field";

/** Options du champ « Métier » (CDC §5.2). */
const METIERS = [
  "Dirigeant de PME",
  "Avocat",
  "Notaire",
  "Expert-comptable",
  "Autre",
];

/**
 * Modale de pré-inscription (F2). <dialog> natif : focus trap, Esc et ::backdrop
 * gratuits. Ouverte par <ReservationTrigger> via document.getElementById +
 * showModal(). Fermeture : bouton ✕, Esc (natif) ou clic sur le backdrop.
 * Le formulaire reste jalon 2 (bouton inerte, non branché).
 */
export function ReservationDialog() {
  const ref = useRef<HTMLDialogElement>(null);

  const close = () => ref.current?.close();

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

      <div className="overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
        <h2
          id="reservation-dialog-title"
          className="pr-10 text-[24px] font-extrabold leading-[1.1] tracking-[-0.02em]"
        >
          Réserver ma place
        </h2>

        {/* Formulaire de pré-inscription (F2) */}
        <form className="mt-7 grid grid-cols-1 gap-x-4 gap-y-[18px] text-left sm:grid-cols-2">
          <Field id="f2-prenom" label="Prénom" required>
            <input
              id="f2-prenom"
              name="prenom"
              type="text"
              required
              autoComplete="given-name"
              className={controlClass}
            />
          </Field>
          <Field id="f2-nom" label="Nom" required>
            <input
              id="f2-nom"
              name="nom"
              type="text"
              required
              autoComplete="family-name"
              className={controlClass}
            />
          </Field>
          <Field id="f2-email" label="Email" required>
            <input
              id="f2-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              className={controlClass}
            />
          </Field>
          <Field id="f2-telephone" label="Téléphone" required>
            <input
              id="f2-telephone"
              name="telephone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              className={controlClass}
            />
          </Field>
          <Field id="f2-metier" label="Métier" required>
            <select
              id="f2-metier"
              name="metier"
              required
              defaultValue=""
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
          <Field id="f2-metier-autre" label="Si « Autre », précisez">
            <input
              id="f2-metier-autre"
              name="metier_autre"
              type="text"
              autoComplete="off"
              className={controlClass}
            />
          </Field>
          <Field
            id="f2-entreprise"
            label="Entreprise / cabinet"
            className="sm:col-span-2"
          >
            <input
              id="f2-entreprise"
              name="entreprise"
              type="text"
              autoComplete="organization"
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
              value="Prochaine session — date et lieu bientôt annoncés"
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
            <Button
              variant="primary"
              arrow
              className="px-[30px] py-4 text-[16.5px]"
            >
              Réserver ma place
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
