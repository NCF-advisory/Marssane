"use client";

import type { ReactNode } from "react";

type ReservationTriggerProps = {
  /** Classes du bouton — reprises à l'identique du CTA d'origine (nav, héro,
   *  formation, CTA final) pour zéro changement visuel. */
  className: string;
  /** Libellé + flèche éventuelle. */
  children: ReactNode;
};

/**
 * Bouton qui ouvre la modale de pré-inscription (<dialog id="reservation-dialog">
 * rendu une seule fois dans la page). Sans JS, le bouton reste inerte — repli
 * accepté (le CTA n'a plus de cible d'ancre utile).
 */
export function ReservationTrigger({ className, children }: ReservationTriggerProps) {
  return (
    <button
      type="button"
      className={className}
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
