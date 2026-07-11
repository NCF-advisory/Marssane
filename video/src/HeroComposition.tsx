import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import "./fonts";
import { C } from "./theme";
import { sceneOpacity } from "./anim";
import { Toile } from "./components/Toile";
import { DemoInbox } from "./scenes/DemoInbox";
import { DemoDocument } from "./scenes/DemoDocument";
import { DemoLetter } from "./scenes/DemoLetter";

/**
 * Composition du héro (1080×1350, 30 fps, 720 frames = 24 s).
 *
 * « Le texte promet, la vidéo prouve » : trois démos d'interface enchaînées en
 * fondu, aucun texte narratif ni carton titre. Le seul texte est celui des
 * interfaces (mails, synthèse, courrier).
 *
 * Boucle parfaite : la démo « boîte » (D1) ancre l'état initial à la frame 0.
 * En fin de timeline, une reprise de D1 dans son état initial (localForcé = 0)
 * revient en fondu par-dessus le courrier — donc la dernière frame ≡ frame 0.
 */
export function HeroComposition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fenêtres (frames). D1 est pleine dès la frame 0 (in = 0) = ancre de boucle.
  const opInbox = sceneOpacity(frame, 0, 0, 260, 22);
  const opDoc = sceneOpacity(frame, 248, 20, 486, 20);
  const opLetter = sceneOpacity(frame, 474, 20, 706, 30);

  // Reprise de la boîte (état initial) pour raccorder à la frame 0.
  const opLoop = interpolate(frame, [688, 719], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.toile }}>
      <Toile />

      {opInbox > 0.001 && (
        <AbsoluteFill style={{ opacity: opInbox }}>
          <DemoInbox local={frame} fps={fps} />
        </AbsoluteFill>
      )}
      {opDoc > 0.001 && (
        <AbsoluteFill style={{ opacity: opDoc }}>
          <DemoDocument local={frame - 248} fps={fps} />
        </AbsoluteFill>
      )}
      {opLetter > 0.001 && (
        <AbsoluteFill style={{ opacity: opLetter }}>
          <DemoLetter local={frame - 474} fps={fps} />
        </AbsoluteFill>
      )}
      {opLoop > 0.001 && (
        <AbsoluteFill style={{ opacity: opLoop }}>
          <DemoInbox local={0} fps={fps} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
