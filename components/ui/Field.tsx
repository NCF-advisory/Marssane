import type { ReactNode } from "react";

/**
 * Classe partagée des contrôles de formulaire (input · select · textarea) en
 * tonalité claire (/formation, /admin). Bordure 1,5 px `outline`, rayon 3 px,
 * padding 12/14, texte 16 px, focus canard (bordure + anneau discret). Dérivée
 * des cartes sobres de la charte.
 *
 * 16 px et pas moins : sous ce seuil, Safari iOS zoome sur le champ à la prise
 * de focus et l'utilisateur se retrouve à devoir dézoomer entre deux champs.
 */
export const controlClass =
  "w-full rounded-btn border-[1.5px] border-outline bg-surface px-[14px] py-3 text-[16px] text-ink placeholder:text-quiet transition-colors focus:border-canard focus:outline-none focus:ring-2 focus:ring-canard/20";

/**
 * Même contrôle en tonalité encre (formulaires du site vitrine) : surface et
 * cadre du système `-sur-ink`, texte blanc, focus turquoise (le canard manque de
 * contraste sur l'encre). `color-scheme: dark` fait suivre ce que le navigateur
 * dessine lui-même — liste déroulante d'un <select>, case à cocher, curseur de
 * texte — sans quoi ces éléments restent clairs au milieu du formulaire.
 * Texte 16 px, pour la même raison que ci-dessus (zoom de Safari iOS).
 */
export const controlClassSurInk =
  "w-full rounded-btn border-[1.5px] border-line-sur-ink bg-surface-sur-ink px-[14px] py-3 text-[16px] text-white placeholder:text-faint-sur-ink transition-colors [color-scheme:dark] focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/25";

/**
 * Variantes des deux classes ci-dessus pour un <select>. Un <select> laissé au
 * rendu natif ignore le padding et la line-height du contrôle (WebKit : les
 * deux ; Chromium : la line-height), et son rectangle est donc moins haut que
 * celui des <input> voisins. `.control-select` le ramène à la boîte CSS et
 * lui redessine sa flèche ; `pr-[38px]` dégage la place de celle-ci (voir
 * globals.css).
 */
export const selectClass = `${controlClass} control-select pr-[38px]`;
export const selectClassSurInk = `${controlClassSurInk} control-select control-select-sur-ink pr-[38px]`;

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
 * Bloc label + contrôle. Label 13,5 px / 600 ; astérisque (décoratif) sur les
 * champs obligatoires — l'attribut `required` du contrôle porte l'information
 * pour les technologies d'assistance.
 *
 * Le composant est neutre vis-à-vis de la tonalité : le label hérite la couleur
 * de son contexte (encre sur la toile claire, blanc sur le fond encre) ;
 * l'astérisque suit `--color-requis` et le message d'erreur `--color-erreur`,
 * deux couleurs dont la valeur dépend de la tonalité (voir globals.css).
 *
 * Corollaire du label hérité : tout conteneur qui interrompt l'héritage de
 * `color` doit reposer la couleur de sa tonalité — c'est le cas du <dialog>,
 * auquel le navigateur applique `color: CanvasText` (cf. <ReservationDialog>).
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
        className="mb-[7px] block text-[13.5px] font-semibold"
      >
        {label}
        {required && (
          <span aria-hidden className="text-requis">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-[6px] text-[12.5px] leading-[1.4] text-erreur"
        >
          {error}
        </p>
      )}
    </div>
  );
}
