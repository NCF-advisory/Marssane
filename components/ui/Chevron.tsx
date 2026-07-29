type ChevronProps = {
  /** Sens de la pointe. `left` pour les liens de retour. */
  direction?: "right" | "left";
  className?: string;
};

/**
 * Chevron des CTA : carré de 8 px dont deux côtés seulement sont tracés
 * (1,5 px), pivoté à 45°. Dessiné en CSS, sans icône de bibliothèque.
 *
 * Le trait est en `currentColor` : le chevron suit la couleur du bouton ou du
 * lien qui le porte, donc aussi la tonalité de la bande (encre ou `.sur-toile`)
 * sans surcharge. Il ne bouge pas au survol — seul le fond du bouton change.
 *
 * Décoratif (`aria-hidden`) : le libellé du CTA porte seul le sens.
 */
export function Chevron({ direction = "right", className }: ChevronProps) {
  return (
    <span
      aria-hidden
      className={[
        "block h-2 w-2 flex-none rotate-45 border-current",
        direction === "right"
          ? "border-r-[1.5px] border-t-[1.5px]"
          : "border-b-[1.5px] border-l-[1.5px]",
        className ?? "",
      ].join(" ")}
    />
  );
}
