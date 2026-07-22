"use client";

import type { CSSProperties, ReactNode } from "react";

type ReservationTriggerProps = {
  /** Classes du bouton — reprises à l'identique du CTA d'origine (nav, héro,
   *  formation, CTA final) pour zéro changement visuel. `cursor-pointer` est
   *  ajouté d'office par le composant (le preflight Tailwind v4 laisse
   *  `cursor: default` sur les `<button>`). */
  className: string;
  /** Styles inline optionnels (ex. variables CSS d'accent d'un niveau). */
  style?: CSSProperties;
  /** Libellé + flèche éventuelle. */
  children: ReactNode;
};

/**
 * Bouton qui ouvre la modale de pré-inscription (<dialog id="reservation-dialog">
 * rendu une seule fois dans la page). Sans JS, le bouton reste inerte — repli
 * accepté (le CTA n'a plus de cible d'ancre utile).
 */
export function ReservationTrigger({ className, style, children }: ReservationTriggerProps) {
  return (
    <button
      type="button"
      className={`cursor-pointer ${className}`}
      style={style}
      onClick={() => {
        const dialog = document.getElementById(
          "reservation-dialog",
        ) as HTMLDialogElement | null;
        dialog?.showModal();
      }}
    >
      {children}
    </button>
  );
}
