"use client";

import { useRef } from "react";
import { updateInscriptionStatutAction } from "@/app/admin/dashboard/actions";
import { INSCRIPTION_STATUTS } from "@/lib/validation";
import { INSCRIPTION_STATUT_LABELS } from "@/lib/admin-labels";

/**
 * Select de statut d'une inscription : soumet immédiatement (action serveur)
 * dès qu'une nouvelle valeur est choisie. Sans JS, l'admin peut toujours changer
 * la valeur ; il manquera seulement l'envoi automatique (formulaire à re-soumettre).
 */
export function InscriptionStatutSelect({
  id,
  statut,
}: {
  id: string;
  statut: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateInscriptionStatutAction}>
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`statut-${id}`}>
        Statut de l&apos;inscription
      </label>
      <select
        id={`statut-${id}`}
        name="statut"
        defaultValue={statut}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-btn border-[1.5px] border-outline bg-surface px-2 py-1.5 font-mono text-[12px] text-ink transition-colors focus:border-canard focus:outline-none focus:ring-2 focus:ring-canard/20"
      >
        {INSCRIPTION_STATUTS.map((value) => (
          <option key={value} value={value}>
            {INSCRIPTION_STATUT_LABELS[value]}
          </option>
        ))}
      </select>
    </form>
  );
}
