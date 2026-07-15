/**
 * Pointeur souris humain (flèche encre) avec un léger « clic ». Motif repris de
 * la vidéo du Cas 1 : l'humain valide, il est toujours noir. Positionné en
 * absolu par ses coordonnées `x`/`y` dans le repère parent.
 */
export function Cursor({
  x,
  y,
  pressed = false,
}: {
  x: number;
  y: number;
  pressed?: boolean;
}) {
  return (
    <svg
      width="34"
      height="40"
      viewBox="0 0 34 40"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${pressed ? 0.85 : 1})`,
        transformOrigin: "top left",
        filter: "drop-shadow(0 3px 5px rgba(16,24,40,0.30))",
        zIndex: 60,
      }}
    >
      <path
        d="M2 2 L2 30 L9.5 23 L14.5 34.5 L19 32.5 L14 21 L24 21 Z"
        fill="#0E0E12"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
