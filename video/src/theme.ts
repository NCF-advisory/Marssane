/**
 * Tokens Marssane repris à l'identique de `app/globals.css` et de la charte.
 * Aucune valeur inventée : chaque hex vient des références du site.
 */
export const C = {
  toile: "#EEF1F3",
  surface: "#FFFFFF",
  gridLine: "#E0E4E8",
  repere: "#C4CBD2",
  ink: "#0E0E12",

  canard: "#0E7291",
  canardDark: "#095B73",
  turquoise: "#00D1BE",
  lavande: "#A88FEE",
  periwinkle: "#C7D2F7",
  ecume: "#C7F7EF",
  clay: "#C75A4D",

  body: "#3C4654",
  muted: "#4B5562",
  slate: "#5B6472",
  soft: "#6B7480",
  faint: "#7A828E",
  quiet: "#98A1AC",

  inkEcume: "#006560",
  inkPeriwinkle: "#1B1442",

  barTrack: "#E6E9ED",
} as const;

/** Ombres froides de la charte (jamais colorées, jamais portées dures). */
export const SHADOW = {
  card: "0 14px 34px -20px rgba(16,24,40,.18)",
  float: "0 22px 46px -20px rgba(16,24,40,.24)",
  hero: "0 30px 58px -18px rgba(16,24,40,.32)",
} as const;

export const RADIUS = {
  chip: 4,
  btn: 6,
  card: 12,
} as const;

export const FONT = {
  sans: "Plus Jakarta Sans",
  mono: "Spline Sans Mono",
} as const;

/** Timeline (30 fps). Fenêtres [start, end] en frames, avec crossfades. */
export const FPS = 30;
export const DURATION = 720; // 24,0 s
