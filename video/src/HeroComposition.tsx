import type { ReactElement } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import "./fonts";
import { C } from "./theme";
import { sceneOpacity } from "./anim";
import { Toile } from "./components/Toile";
import { Scene1Ouverture } from "./scenes/Scene1Ouverture";
import { Scene2Promesse } from "./scenes/Scene2Promesse";
import { Scene3Cas1 } from "./scenes/Scene3Cas1";
import { Scene4Cas2 } from "./scenes/Scene4Cas2";
import { Scene5Cas3 } from "./scenes/Scene5Cas3";
import { Scene6Formation } from "./scenes/Scene6Formation";

type SceneFn = (p: { local: number; fps: number }) => ReactElement;

/** Fenêtres de scènes (frames). Les [end/out] chevauchent le [start/in] suivant
 *  → crossfade sur la toile. */
const SCENES: Array<{ C: SceneFn; start: number; in: number; end: number; out: number }> = [
  { C: Scene1Ouverture, start: 0, in: 12, end: 108, out: 16 },
  { C: Scene2Promesse, start: 100, in: 16, end: 210, out: 16 },
  { C: Scene3Cas1, start: 202, in: 16, end: 360, out: 16 },
  { C: Scene4Cas2, start: 352, in: 16, end: 510, out: 16 },
  { C: Scene5Cas3, start: 502, in: 16, end: 630, out: 16 },
  { C: Scene6Formation, start: 622, in: 16, end: 780, out: 0 },
];

/**
 * Composition du héro (1080×1350, 30 fps, 780 frames = 26 s).
 * - Décor toile constant (boucle triviale).
 * - Scènes empilées en crossfade.
 * - Overlay « toile pleine » : opaque à f0, se retire (0–24) pour révéler la
 *   grille (« la toile se pose »), puis revient (754–779) — donc f779 ≡ f0 :
 *   boucle parfaite, la fin raccorde à l'ouverture.
 */
export function HeroComposition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const establish = interpolate(frame, [0, 24, 754, 779], [1, 0, 0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.toile }}>
      <Toile />

      {SCENES.map((s, i) => {
        const opacity = sceneOpacity(frame, s.start, s.in, s.end, s.out);
        if (opacity <= 0.001) return null;
        const Scene = s.C;
        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            <Scene local={frame - s.start} fps={fps} />
          </AbsoluteFill>
        );
      })}

      <AbsoluteFill
        style={{ backgroundColor: C.toile, opacity: establish, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
}
