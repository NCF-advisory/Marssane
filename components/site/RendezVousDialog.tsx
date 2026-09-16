"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ParcoursRendezVous, type PoigneeRendezVous } from "@/components/site/ParcoursRendezVous";
import { RENDEZ_VOUS_DIALOG_ID, RENDEZ_VOUS_OPEN_EVENT } from "@/lib/rendez-vous-types";

/** Coquille de la prise de rendez-vous : la fenêtre elle-même. Le parcours,
 * partagé avec la section contact de l'accueil, est réinitialisé à chaque
 * ouverture (étape 0, champs vides, nouvelle clé d'idempotence,
 * disponibilités rechargées). */
export function RendezVousDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const parcoursRef = useRef<PoigneeRendezVous>(null);
  const confirmationRef = useRef(false);
  const prefixe = useId();
  const [confirme, setConfirme] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const ouvrir = () => {
      // Une réservation en cours ne doit pas être soumise une seconde fois.
      if (confirmationRef.current) return;
      dialog.scrollTop = 0;
      parcoursRef.current?.reinitialiser();
    };
    dialog.addEventListener(RENDEZ_VOUS_OPEN_EVENT, ouvrir);
    return () => dialog.removeEventListener(RENDEZ_VOUS_OPEN_EVENT, ouvrir);
  }, []);

  const fermer = () => {
    if (!confirmationRef.current) dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      id={RENDEZ_VOUS_DIALOG_ID}
      aria-labelledby={`${prefixe}-titre`}
      onCancel={(event) => { if (confirmationRef.current) event.preventDefault(); }}
      onClick={(event) => { if (event.target === event.currentTarget) fermer(); }}
      onClose={() => setConfirme(false)}
      data-confirme={confirme}
      className="rdv-dialog w-[680px] max-w-[calc(100vw-24px)] overflow-y-auto rounded-card border border-line-sur-ink bg-surface-sur-ink p-0 text-white backdrop:bg-[rgba(14,14,18,0.82)]"
    >
      <ParcoursRendezVous
        ref={parcoursRef}
        prefixe={prefixe}
        conteneurRef={dialogRef}
        fermer={fermer}
        onConfirmationEnCours={(enCours) => { confirmationRef.current = enCours; }}
        onConfirme={() => setConfirme(true)}
      />
    </dialog>
  );
}
