"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

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
 *
 * Autoplay robuste : au montage (hors reduced motion), on force `muted` puis on
 * appelle `play()` explicitement. Si la promesse est rejetée (autoplay bloqué
 * par le navigateur), on passe `blocked` à true pour exposer les contrôles
 * natifs, seul recours pour lancer la vidéo à la main.
 */
export function HeroVideo({ video }: HeroVideoProps) {
  const reduced = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    const attempt = el.play();
    if (attempt) {
      attempt.catch(() => setBlocked(true));
    }
  }, [reduced]);

  return (
    <video
      ref={videoRef}
      className="aspect-[16/10] w-full rounded-card object-cover shadow-hero"
      poster={video.poster}
      autoPlay={!reduced}
      controls={reduced || blocked}
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
