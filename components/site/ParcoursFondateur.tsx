"use client";

import { useRef, type ReactNode } from "react";
import { Chevron } from "@/components/ui/Chevron";
import styles from "./ParcoursFondateur.module.css";

const DIALOG_ID = "parcours-fondateur";

export function ParcoursFondateurTrigger({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-controls={DIALOG_ID}
      className={`inline-flex min-h-7 cursor-pointer items-center gap-2 py-1 text-[12px] font-semibold underline decoration-current/40 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
      onClick={(event) => {
        const dialog = document.getElementById(DIALOG_ID);
        if (dialog instanceof HTMLDialogElement && !dialog.open) {
          // Safari ne donne pas le focus aux boutons cliqués à la souris.
          event.currentTarget.focus({ preventScroll: true });
          dialog.showModal();
          dialog.scrollTop = 0;
        }
      }}
    >
      Mon parcours
      <Chevron className="h-1.5 w-1.5" />
    </button>
  );
}

export function ParcoursFondateurDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog
      ref={dialogRef}
      id={DIALOG_ID}
      aria-labelledby="parcours-fondateur-titre"
      className={styles.dialog}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) {
          dialogRef.current?.close();
        }
      }}
    >
      <div className={styles.header}>
        <span>Parcours &amp; réalisations</span>
        <button
          type="button"
          aria-label="Fermer mon parcours"
          title="Fermer"
          className={styles.close}
          onClick={() => dialogRef.current?.close()}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      {children}
    </dialog>
  );
}
