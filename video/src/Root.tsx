import { Composition } from "remotion";
import { HeroComposition } from "./HeroComposition";
import { HybridProto } from "./scenes/HybridProto";
import { DURATION, FPS } from "./theme";

/** Enregistrement des compositions. Format 16:9 (1920×1080). */
export function RemotionRoot() {
  return (
    <>
      <Composition
        id="HeroVideo"
        component={HeroComposition}
        durationInFrames={DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* PROTOTYPE isolé : plan réel + UI G4 en overlay. Non branché au site. */}
      <Composition
        id="HybridProto"
        component={HybridProto}
        durationInFrames={270}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
}
