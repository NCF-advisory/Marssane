"use client";

import type { CSSProperties, ReactNode } from "react";
import { RENDEZ_VOUS_DIALOG_ID, RENDEZ_VOUS_OPEN_EVENT } from "@/lib/rendez-vous-types";

/** Ouvre l'unique fenêtre de rendez-vous, distincte des inscriptions formation. */
export function RendezVousTrigger({
  children, className, style, onClick,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-controls={RENDEZ_VOUS_DIALOG_ID}
      className={`cta-projet ${className ?? ""}`}
      style={style}
      onClick={() => {
        onClick?.();
        const dialog = document.getElementById(RENDEZ_VOUS_DIALOG_ID);
        if (dialog instanceof HTMLDialogElement) {
          dialog.dispatchEvent(new Event(RENDEZ_VOUS_OPEN_EVENT));
          dialog.showModal();
        }
      }}
    >
      <span className="cta-projet__angles" aria-hidden="true" />
      <span className="cta-projet__label">{children}</span>
      <span className="cta-projet__icone" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="m8 5 5 5-5 5" />
        </svg>
      </span>
    </button>
  );
}
