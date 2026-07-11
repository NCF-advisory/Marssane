"use client";

import type { ReactNode } from "react";

/**
 * Bouton de soumission avec confirmation native (`window.confirm`). Placé dans
 * un `<form action={…}>`, il n'envoie le formulaire que si l'admin confirme —
 * garde-fou minimal pour les actions destructrices (suppression, archivage).
 * Sans JS, le bouton reste un submit standard (la confirmation est alors sautée).
 */
export function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
