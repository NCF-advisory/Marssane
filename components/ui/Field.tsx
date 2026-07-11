import type { ReactNode } from "react";

/**
 * Classe partagée des contrôles de formulaire (input · select · textarea).
 * Bordure 1,5 px `outline`, rayon 3 px, padding 12/14, texte 15 px, focus
 * canard (bordure + anneau discret). Dérivée des cartes sobres de la charte.
 */
export const controlClass =
  "w-full rounded-btn border-[1.5px] border-outline bg-surface px-[14px] py-3 text-[15px] text-ink placeholder:text-quiet transition-colors focus:border-canard focus:outline-none focus:ring-2 focus:ring-canard/20";

type FieldProps = {
  /** id du contrôle — relie le <label> (htmlFor) au champ. */
  id: string;
  label: string;
  required?: boolean;
  className?: string;
  /**
   * Message d'erreur du champ. Rendu sous le contrôle avec l'id `${id}-error` ;
   * le contrôle doit le référencer via `aria-describedby` + `aria-invalid`.
   */
  error?: string;
  /** Le contrôle (input / select / textarea) portant `id` et `controlClass`. */
  children: ReactNode;
};

/**
 * Bloc label + contrôle. Label 13,5 px / 600 encre ; astérisque canard
 * (décoratif) sur les champs obligatoires — l'attribut `required` du contrôle
 * porte l'information pour les technologies d'assistance.
 */
export function Field({
  id,
  label,
  required = false,
  className,
  error,
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-[7px] block text-[13.5px] font-semibold text-ink"
      >
        {label}
        {required && (
          <span aria-hidden className="text-canard">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-[6px] text-[12.5px] leading-[1.4] text-ink-clay"
        >
          {error}
        </p>
      )}
    </div>
  );
}
