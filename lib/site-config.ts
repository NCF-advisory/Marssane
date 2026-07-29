/**
 * Configuration éditoriale du site.
 *
 * `heroVideo` pilote la moitié droite du héro (CDC F6). Tant qu'il vaut `null`,
 * le héro affiche la composition statique de la maquette (placeholder). Pour
 * basculer sur la vidéo une fois produite, il suffit de déposer les fichiers
 * dans `public/` et de renseigner cet objet — aucun composant à modifier.
 */
export const heroVideo: { mp4: string; webm?: string; poster: string } | null =
  {
    mp4: "/video/hero-v2.mp4",
    webm: "/video/hero-v2.webm",
    poster: "/video/hero-v2-poster.jpg",
  };

/**
 * `cas1Video` pilotait le visuel du cas concret n° 1 (« Trier, prioriser,
 * répondre à vos mails »). Même convention que `heroVideo` : `null` → le visuel
 * statique de la maquette ; objet → la vidéo Remotion (5:4). Les vidéos des cas
 * ont été archivées (fichiers retirés de `public/video/`) : `null`.
 */
export const cas1Video: { mp4: string; webm?: string; poster: string } | null =
  null;

/**
 * `cas2Video` pilotait le visuel du cas concret n° 2 (« Synthétiser vos
 * documents et préparer vos réunions, dans votre ton »). Même convention que
 * `heroVideo` ; vidéo archivée, cf. `cas1Video` : `null`.
 */
export const cas2Video: { mp4: string; webm?: string; poster: string } | null =
  null;

/**
 * `cas3Video` pilotait le visuel du cas concret n° 3 (« Automatiser un process
 * de votre travail »). Même convention que `heroVideo` ; vidéo archivée, et le
 * cas n° 3 lui-même a été retiré de la page : `null`.
 */
export const cas3Video: { mp4: string; webm?: string; poster: string } | null =
  null;
