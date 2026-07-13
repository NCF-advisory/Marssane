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
