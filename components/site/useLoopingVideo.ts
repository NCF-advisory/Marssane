"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getSnapshot = () => window.matchMedia(QUERY).matches;
// Attendre la préférence réelle avant de démarrer, y compris à l'hydratation.
const getServerSnapshot = () => true;

/** Lecture muette en boucle, avec reprise après chargement ou retour à la page. */
export function useLoopingVideo(source: string) {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    let pending = false;
    // La propriété et l'attribut doivent être présents avant play(), notamment sur iOS.
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    if (reduced) {
      video.pause();
      return;
    }

    function attempt() {
      if (disposed || pending || document.hidden || !video || !video.paused) return;
      pending = true;
      video.play().catch(() => {
        if (!disposed && video?.paused) setBlocked(true);
      }).finally(() => { pending = false; });
    }
    function playing() {
      if (!disposed) setBlocked(false);
    }
    function interaction(event: Event) {
      // Les contrôles natifs restent utilisables sans relancer une pause manuelle.
      if (event.target === video) return;
      attempt();
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) attempt();
    });
    observer.observe(video);
    video.addEventListener("loadeddata", attempt);
    video.addEventListener("canplay", attempt);
    video.addEventListener("playing", playing);
    window.addEventListener("pageshow", attempt);
    document.addEventListener("visibilitychange", attempt);
    document.addEventListener("click", interaction, { passive: true });
    document.addEventListener("keydown", interaction);
    attempt();
    return () => {
      disposed = true;
      observer.disconnect();
      video.removeEventListener("loadeddata", attempt);
      video.removeEventListener("canplay", attempt);
      video.removeEventListener("playing", playing);
      window.removeEventListener("pageshow", attempt);
      document.removeEventListener("visibilitychange", attempt);
      document.removeEventListener("click", interaction);
      document.removeEventListener("keydown", interaction);
    };
  }, [reduced, source]);

  return { videoRef, reduced, controls: reduced || blocked };
}
