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
    mp4: "/video/hero.mp4",
    webm: "/video/hero.webm",
    poster: "/video/hero-poster.jpg",
  };

/**
 * `cas1Video` pilote le visuel du cas concret n° 1 (« Trier, prioriser,
 * répondre à vos mails »). Même convention que `heroVideo` : `null` → le visuel
 * statique de la maquette ; objet → la vidéo Remotion (5:4). Déposer les
 * fichiers dans `public/video/` suffit à basculer, aucun composant à modifier.
 */
export const cas1Video: { mp4: string; webm?: string; poster: string } | null =
  {
    mp4: "/video/cas1.mp4",
    webm: "/video/cas1.webm",
    poster: "/video/cas1-poster.jpg",
  };

/**
 * `cas2Video` pilote le visuel du cas concret n° 2 (« Synthétiser vos documents
 * et préparer vos réunions, dans votre ton »). Même convention que `heroVideo` :
 * `null` → le visuel statique de la maquette ; objet → la vidéo Remotion (5:4).
 * Déposer les fichiers dans `public/video/` suffit à basculer, aucun composant à
 * modifier.
 */
export const cas2Video: { mp4: string; webm?: string; poster: string } | null =
  {
    mp4: "/video/cas2.mp4",
    webm: "/video/cas2.webm",
    poster: "/video/cas2-poster.jpg",
  };

/**
 * `cas3Video` pilote le visuel du cas concret n° 3 (« Automatiser un process de
 * votre travail »). Même convention que `heroVideo` : `null` → le visuel
 * statique de la maquette ; objet → la vidéo Remotion (5:4). Déposer les
 * fichiers dans `public/video/` suffit à basculer, aucun composant à modifier.
 */
export const cas3Video: { mp4: string; webm?: string; poster: string } | null =
  {
    mp4: "/video/cas3.mp4",
    webm: "/video/cas3.webm",
    poster: "/video/cas3-poster.jpg",
  };
