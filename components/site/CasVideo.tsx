"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type CasVideoProps = {
  video: { mp4: string; webm?: string; poster: string };
  className?: string;
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
 * Vidéo d'un cas concret (5:4). Même logique que le héro : lecture automatique
 * muette en boucle, `prefers-reduced-motion: reduce` → poster + contrôles
 * natifs, et contrôles natifs en secours si l'autoplay est bloqué. Sobre : la
 * largeur est bornée par le conteneur parent, pas ici.
 */
export function CasVideo({ video, className }: CasVideoProps) {
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
      className={`aspect-[5/4] w-full rounded-card object-cover shadow-hero ${className ?? ""}`}
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
