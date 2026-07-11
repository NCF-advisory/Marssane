"use client";

import { useSyncExternalStore } from "react";

type HeroVideoProps = {
  video: { mp4: string; webm?: string; poster: string };
};

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Vidéo du héro (CDC F6). Lecture automatique en boucle, sans son.
 *
 * `prefers-reduced-motion: reduce` → pas d'autoplay : on rend le poster et on
 * expose les contrôles natifs pour que l'utilisateur lance la lecture lui-même.
 * Le rendu serveur suppose « pas de réduction » (poster + autoplay) ; côté
 * client, useSyncExternalStore rectifie au montage avant toute lecture.
 */
export function HeroVideo({ video }: HeroVideoProps) {
  const reduced = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <video
      className="aspect-[4/5] w-full rounded-card object-cover shadow-hero"
      poster={video.poster}
      autoPlay={!reduced}
      controls={reduced}
      muted
      loop
      playsInline
      preload="metadata"
    >
      {video.webm && <source src={video.webm} type="video/webm" />}
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}
