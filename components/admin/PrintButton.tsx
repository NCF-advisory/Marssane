"use client";

/**
 * Bouton « Imprimer / PDF » des gabarits de documents (Lot 2). Ouvre le
 * dialogue d'impression du navigateur : « Enregistrer au format PDF » y
 * produit le fichier à envoyer au client. Masqué à l'impression.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center rounded-btn bg-canard px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark print:hidden"
    >
      Imprimer / PDF
    </button>
  );
}
