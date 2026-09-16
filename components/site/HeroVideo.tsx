"use client";

import { useLoopingVideo } from "./useLoopingVideo";
import type { HeroVideoConfig } from "@/lib/site-config";

type HeroVideoProps = {
  video: HeroVideoConfig;
};

export function HeroVideo({ video }: HeroVideoProps) {
  const { videoRef, reduced, controls } = useLoopingVideo(`${video.mp4}|${video.webm ?? ""}`);

  return (
    <video
      ref={videoRef}
      className="w-full rounded-card object-cover shadow-hero"
      width={video.width ?? 640}
      height={video.height ?? 400}
      style={{ aspectRatio: `${video.width ?? 640} / ${video.height ?? 400}` }}
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
