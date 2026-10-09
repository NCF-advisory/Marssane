type CroixErreurProps = {
  className?: string;
};

/**
 * Croix d'erreur : un cercle et une croix tracés au trait, sans fond ni carte.
 * Pendant de la <CocheValidation>, utilisée en visuel des pages 404 et erreur.
 *
 * Décoratif (`aria-hidden`) : le titre de la page dit déjà l'erreur.
 *
 * Le trait est en `currentColor` — comme le <Chevron> —, la couleur vient donc
 * du parent (`text-turquoise` : le flash de la charte). La taille aussi vient
 * du parent, via `className` (`h-…`/`w-…`).
 *
 * L'animation d'apparition (le cercle se trace, puis les deux diagonales l'une
 * après l'autre, puis un léger « pop » d'ensemble) est en CSS pur dans
 * `globals.css` — aucun JS, le composant reste un composant serveur.
 * `pathLength="1"` normalise la longueur des trois tracés : les
 * `stroke-dasharray`/`stroke-dashoffset` de l'animation travaillent en unités
 * de 0 à 1, sans avoir à mesurer le tracé réel.
 */
export function CroixErreur({ className }: CroixErreurProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      fill="none"
      className={`croix-erreur ${className ?? ""}`}
    >
      <circle
        className="croix-erreur__cercle"
        cx="60"
        cy="60"
        r="54"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Diagonales à ±21 du centre : leurs pointes arrivent à la même distance
          du centre que celles de la coche de /merci, la croix tient donc la
          même place dans le cercle, sans venir toucher le trait. */}
      <path
        className="croix-erreur__trait-1"
        d="M39 39 L81 81"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        className="croix-erreur__trait-2"
        d="M81 39 L39 81"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
