import { C } from "../theme";

/**
 * Horloge minimaliste Marssane — « le compteur de temps » de la vidéo héro v2.
 *
 * Cadran épuré (anneau fin, quatre graduations aux quarts), aiguilles canard,
 * point central turquoise. AUCUN chiffre : l'horloge est symbolique et muette.
 *
 * `back` = minutes « rendues » : les aiguilles RECULENT (sens antihoraire)
 * d'autant. Pose de repos : minute en haut (12 h), heure vers 10 h — une
 * silhouette calme et asymétrique, jamais figée sur midi pile.
 *
 * 100 % tokens de theme.ts (canard, canardDark, turquoise, repere, surface).
 */
export function ClockMarssane({
  size,
  back = 0,
}: {
  size: number;
  back?: number;
}) {
  const r = size / 2;
  const ring = Math.max(2, size * 0.018);
  const tickLen = size * 0.05;
  const tickW = Math.max(1.5, size * 0.012);

  // 0° = aiguille vers le haut ; le recul ajoute un angle négatif (antihoraire).
  const minAngle = -back * 6; // 6° par minute
  const hourAngle = -60 - back * 0.5; // départ 10 h, 0,5° par minute

  // Extrémité d'une aiguille (angle en degrés, 0 = haut).
  const tip = (angleDeg: number, len: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return { x: r + len * Math.sin(a), y: r - len * Math.cos(a) };
  };

  const minTip = tip(minAngle, r * 0.72);
  const hourTip = tip(hourAngle, r * 0.46);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Fond du cadran (surface douce) */}
      <circle cx={r} cy={r} r={r - ring} fill={C.surface} opacity={0.92} />
      {/* Anneau fin */}
      <circle
        cx={r}
        cy={r}
        r={r - ring}
        fill="none"
        stroke={C.canard}
        strokeWidth={ring}
      />
      {/* Graduations aux quarts (12/3/6/9) */}
      {[0, 90, 180, 270].map((deg) => {
        const outer = tip(deg, r - ring * 1.4);
        const inner = tip(deg, r - ring * 1.4 - tickLen);
        return (
          <line
            key={deg}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke={C.repere}
            strokeWidth={tickW}
            strokeLinecap="round"
          />
        );
      })}
      {/* Aiguille des heures (canard foncé, courte et épaisse) */}
      <line
        x1={r}
        y1={r}
        x2={hourTip.x}
        y2={hourTip.y}
        stroke={C.canardDark}
        strokeWidth={Math.max(3, size * 0.032)}
        strokeLinecap="round"
      />
      {/* Aiguille des minutes (canard, longue et fine) */}
      <line
        x1={r}
        y1={r}
        x2={minTip.x}
        y2={minTip.y}
        stroke={C.canard}
        strokeWidth={Math.max(2.5, size * 0.022)}
        strokeLinecap="round"
      />
      {/* Point central turquoise */}
      <circle cx={r} cy={r} r={Math.max(3, size * 0.045)} fill={C.turquoise} />
    </svg>
  );
}
