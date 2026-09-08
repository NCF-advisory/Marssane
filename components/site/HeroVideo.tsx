"use client";

import { useLoopingVideo } from "./useLoopingVideo";

type HeroVideoProps = {
  video: { mp4: string; webm?: string; poster: string };
};

export function HeroVideo({ video }: HeroVideoProps) {
  const { videoRef, reduced, controls } = useLoopingVideo(`${video.mp4}|${video.webm ?? ""}`);

  return (
    <video
      ref={videoRef}
      className="aspect-[16/10] w-full rounded-card object-cover shadow-hero"
      poster={video.poster}
      autoPlay={!reduced}
      controls={controls}
      muted
      loop
      playsInline
      preload={reduced ? "metadata" : "auto"}
    >
      {video.webm && <source src={video.webm} type="video/webm" />}
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}
