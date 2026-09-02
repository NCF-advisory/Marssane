type CocheValidationProps = {
  className?: string;
};

/**
 * Coche de validation : un cercle et une coche tracés au trait, sans fond ni
 * carte. Utilisée en visuel de la page de fin de pré-inscription.
 *
 * Décoratif (`aria-hidden`) : le titre de la page dit déjà la confirmation.
 *
 * Le trait est en `currentColor` — comme le <Chevron> —, la couleur vient donc
 * du parent (`text-turquoise` : le flash de la charte). La taille aussi vient
 * du parent, via `className` (`h-…`/`w-…`).
 *
 * L'animation d'apparition (le cercle se trace, puis la coche, puis un léger
 * « pop » d'ensemble) est en CSS pur dans `globals.css` — aucun JS, le
 * composant reste un composant serveur. `pathLength="1"` normalise la longueur
 * des deux tracés : les `stroke-dasharray`/`stroke-dashoffset` de l'animation
 * travaillent en unités de 0 à 1, sans avoir à mesurer le tracé réel.
 */
export function CocheValidation({ className }: CocheValidationProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      fill="none"
      className={`coche-validation ${className ?? ""}`}
    >
      <circle
        className="coche-validation__cercle"
        cx="60"
        cy="60"
        r="54"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        className="coche-validation__trait"
        d="M36 62 L53 78 L86 44"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
