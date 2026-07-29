"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  type InscriptionState,
  submitInscription,
} from "@/app/actions/inscription";
import { Chevron } from "@/components/ui/Chevron";
import {
  controlClassSurInk,
  Field,
  selectClassSurInk,
} from "@/components/ui/Field";
import { LogoMarssane } from "@/components/ui/LogoMarssane";

/**
 * État initial de `useActionState`. Défini côté client (pas dans le fichier
 * `"use server"`, où Next.js 16 interdit les exports non-async) — même motif
 * que `initialLoginState` dans app/admin/LoginForm.tsx.
 */
const initialInscriptionState: InscriptionState = { status: "idle" };

/** Options du champ « Métier » (CDC §5.2). */
const METIERS = [
  "Dirigeant de PME/TPE",
  "Entrepreneur",
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
   * relance pas des animations CSS sur un nœud qui reste monté ; on incrémente
   * donc `runId`, utilisé comme `key` sur le conteneur .reservation-seq → React
   * le remonte, ce qui relance proprement toutes les animations depuis leur
   * frame 0.
   *
   * Détection de l'ouverture : un `MutationObserver` sur l'attribut `open` du
   * <dialog>. `showModal()` pose cet attribut, `close()` le retire → l'observer
   * se déclenche à chaque bascule ; on n'incrémente que quand `dialog.open`
   * devient vrai. Ce choix (plutôt que l'événement natif `toggle`, récent et
   * inégalement supporté — absent sur d'anciens WebKit/Safari, ce qui figeait la
   * modale à son état final) est universellement supporté : MutationObserver est
   * disponible dans tous les navigateurs cibles depuis 2012.
   *
   * L'état du formulaire (valeurs, erreurs) est porté par `useActionState` sur
   * CE composant (hors du sous-arbre remonté) : il survit au remontage — les
   * champs non contrôlés se repeuplent via `defaultValue={values.*}`.
   */
  const [runId, setRunId] = useState(0);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const observer = new MutationObserver(() => {
      if (dialog.open) setRunId((n) => n + 1);
    });
    observer.observe(dialog, { attributeFilter: ["open"] });
    return () => observer.disconnect();
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
      // Tonalité encre : la carte est un cran plus claire que la page, que le
      // ::backdrop assombrit encore — c'est ce qui la détache, l'ombre portée
      // étant invisible sur l'encre.
      // `text-white` est indispensable et n'est PAS redondant avec l'encre
      // inversée du <body> : la feuille de style du navigateur déclare
      // `dialog { color: CanvasText; background-color: Canvas }`, et une
      // déclaration — même d'origine UA — l'emporte toujours sur une valeur
      // héritée. Sans couleur explicite ici, tout le contenu de la modale qui
      // n'en déclare pas (le titre, les libellés du kit Field) héritait donc du
      // noir de `CanvasText`, illisible sur la carte. Poser la couleur sur le
      // <dialog> rétablit le contexte de tonalité que le contenu suppose.
      // `100dvh` et non `100vh` : sur mobile, `vh` compte la barre d'URL
      // rétractée, et la modale dépassait donc la fenêtre réellement visible.
      className="open:flex max-h-[calc(100dvh-64px)] w-[640px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-card border border-line-sur-ink bg-surface-sur-ink p-0 text-white backdrop:bg-[rgba(14,14,18,0.72)]"
    >
      {/* 44 px de cible tactile, et fond opaque (couleur de la carte) : le
          formulaire défile dessous, le bouton ne doit pas se superposer au
          texte. Le survol ne change donc que la couleur du glyphe. */}
      <button
        type="button"
        onClick={close}
        aria-label="Fermer"
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-sur-ink text-[18px] leading-none text-faint-sur-ink transition-colors hover:text-white"
      >
        <span aria-hidden>✕</span>
      </button>

      <div
        key={runId}
        className="reservation-seq overflow-y-auto px-6 py-8 sm:px-10 sm:py-10"
      >
        {/* Le « M » du logo suit --color-ink : on le repasse en blanc localement,
            comme la nav et le pied de page. */}
        <div
          className="reservation-seq__logo mb-7 flex justify-center"
          style={{ ["--color-ink" as string]: "#FFFFFF" }}
        >
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
            <p className="mt-6 rounded-card bg-ink px-4 py-3 text-[13.5px] leading-[1.5] text-body-sur-ink">
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
              className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-erreur sm:col-span-2"
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
              className={controlClassSurInk}
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
              className={controlClassSurInk}
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
              className={controlClassSurInk}
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
              className={controlClassSurInk}
            />
          </Field>
          <Field id="f2-metier" label="Métier" required error={fieldErrors.metier}>
            <select
              id="f2-metier"
              name="metier"
              required
              defaultValue={values.metier ?? ""}
              {...errorAttrs("metier", "f2-metier")}
              className={selectClassSurInk}
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
              className={controlClassSurInk}
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
              className={controlClassSurInk}
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
              // Champ en lecture seule : fond encre (en creux par rapport aux
              // autres champs) et texte atténué.
              className={`${controlClassSurInk} cursor-default bg-ink! text-body-sur-ink!`}
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

          <label className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-faint-sur-ink sm:col-span-2">
            {/* La case reste visuellement à 16 px, mais son enveloppe de 24 px
                — cliquable puisqu'à l'intérieur du <label> — donne la cible
                tactile qui manquait. Le `-mt-px` conserve l'alignement exact de
                la case sur la première ligne de texte. */}
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
              J&apos;accepte que mes données soient utilisées pour ma
              pré-inscription, conformément à la{" "}
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
              className="inline-flex items-center gap-[13px] rounded-btn bg-canard py-[15px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-white shadow-cta transition-[background-color] duration-[180ms] ease-out hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Envoi…" : "Réserver ma place"}
              {!isPending && <Chevron />}
            </button>
          </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
