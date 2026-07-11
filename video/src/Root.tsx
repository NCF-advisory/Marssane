import { Composition } from "remotion";
import { HeroComposition } from "./HeroComposition";
import { DURATION, FPS } from "./theme";

/** Enregistrement de la composition. Format 4:5 (1080×1350). */
export function RemotionRoot() {
  return (
    <Composition
      id="HeroVideo"
      component={HeroComposition}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1350}
    />
  );
}
