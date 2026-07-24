import { Composition } from "remotion";
import { HeroComposition } from "./HeroComposition";
import { HeroV2 } from "./HeroV2";
import { HybridProto } from "./scenes/HybridProto";
import { Cas1Mails } from "./scenes/Cas1Mails";
import { Cas2Synthese } from "./scenes/Cas2Synthese";
import { Cas3Process } from "./scenes/Cas3Process";
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
      {/* Héro v2 « Le compteur de temps » (16:9, 630 f = 21,0 s : rythme ×1,25 + gel final 30 f). */}
      <Composition
        id="HeroV2"
        component={HeroV2}
        durationInFrames={630}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* Cas concret n° 1 : la boîte mail triée en un passage (5:4). */}
      <Composition
        id="Cas1Mails"
        component={Cas1Mails}
        durationInFrames={420}
        fps={FPS}
        width={1350}
        height={1080}
      />
      {/* Cas concret n° 2 : synthèse d'un document dans votre ton (5:4). */}
      <Composition
        id="Cas2Synthese"
        component={Cas2Synthese}
        durationInFrames={420}
        fps={FPS}
        width={1350}
        height={1080}
      />
      {/* Cas concret n° 3 : un process (relances d'impayés) automatisé (5:4). */}
      <Composition
        id="Cas3Process"
        component={Cas3Process}
        durationInFrames={420}
        fps={FPS}
        width={1350}
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
