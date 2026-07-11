import { interpolate, Easing, spring } from "remotion";

/** Ease-out doux, réutilisé partout (mouvements amples et lents). */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Opacité d'une scène sur la timeline globale : fondu d'entrée puis de sortie.
 * Les fenêtres des scènes se chevauchent légèrement -> crossfade sur la toile.
 */
export function sceneOpacity(
  frame: number,
  start: number,
  inDur: number,
  end: number,
  outDur: number,
): number {
  const opts = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
    easing: easeOut,
  };
  // Sans fondu d'entrée (inDur ≤ 0) : pleine dès le départ (ancre de boucle).
  if (inDur <= 0) {
    return interpolate(frame, [start, end - outDur, end], [1, 1, 0], opts);
  }
  // Sans fondu de sortie (outDur ≤ 0) : la scène reste pleine jusqu'à la fin.
  if (outDur <= 0) {
    return interpolate(frame, [start, start + inDur, end], [0, 1, 1], opts);
  }
  return interpolate(
    frame,
    [start, start + inDur, end - outDur, end],
    [0, 1, 1, 0],
    opts,
  );
}

/** Rampe 0→1 sur [a,b] avec ease-out et clamp. */
export function ramp(frame: number, a: number, b: number): number {
  return interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
}

/** Spring doux normalisé (0→1), pour les « pop ». */
export function pop(frame: number, fps: number, delay = 0): number {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 120 },
  });
}

/** Interpole un entier compté (ex. 47 → 6) et l'arrondit. */
export function countInt(
  frame: number,
  a: number,
  b: number,
  from: number,
  to: number,
): number {
  const t = interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return Math.round(from + (to - from) * t);
}
