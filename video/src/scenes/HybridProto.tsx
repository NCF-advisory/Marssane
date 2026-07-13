import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../fonts";
import { C } from "../theme";
import { easeOut } from "../anim";
import { G4Tri } from "./G4Tri";

/**
 * PROTOTYPE — scène hybride « plan réel + UI en overlay » (façon vidéo héro
 * Skello). Composition séparée, ne touche pas à HeroVideo.
 *
 * Un plan réel sobre de bureau (laptop, main, écran vierge) sert de fond ;
 * par-dessus, la boîte mail de la scène G4 (tri automatique des mails) apparaît
 * en carte UI flottante, avec une légère perspective 3D, une ombre froide et
 * une entrée scale/fade premium. L'UI reste 100 % dans la charte : elle réutilise
 * le composant `G4Tri` tel quel.
 *
 * Fond : Pexels vidéo #4064869 (« man hands desk laptop »), licence Pexels
 * (usage commercial libre, sans attribution). Refroidi + désaturé + assombri
 * en CSS pour faire ressortir la carte.
 */

// Décalage de la timeline interne de G4 : la carte apparaît d'abord, puis le
// tri démarre (G4 lance son premier mail à local = 20).
const G4_OFFSET = 18;

export function HybridProto() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // --- Fond : léger push-in (Ken Burns) pour la profondeur ---
  const bgScale = interpolate(frame, [0, durationInFrames], [1.06, 1.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Entrée de la carte : fade + scale + légère montée ---
  const appear = interpolate(frame, [8, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const cardScale = 0.78 * (0.94 + 0.06 * appear); // pose finale à ~0.78
  const cardRise = (1 - appear) * 26;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      {/* Plan réel */}
      <AbsoluteFill style={{ transform: `scale(${bgScale})` }}>
        <OffthreadVideo
          src={staticFile("footage/desk-laptop-pexels-4064869.mp4")}
          trimBefore={45}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // Grade charte : désaturation, refroidissement, assombrissement.
            filter: "saturate(0.66) brightness(0.84) contrast(1.06)",
          }}
        />
      </AbsoluteFill>

      {/* Cast froid unifiant (teinte canard sombre) */}
      <AbsoluteFill
        style={{ background: "#0A2A33", opacity: 0.16, mixBlendMode: "multiply" }}
      />

      {/* Vignette : assombrit les bords, concentre le regard sur la carte */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 100% at 50% 42%, rgba(16,24,40,0) 38%, rgba(16,24,40,0.5) 100%)",
        }}
      />

      {/* Halo doux derrière la carte : donne l'impression qu'elle est éclairée */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(46% 46% at 50% 47%, rgba(199,247,239,0.22) 0%, rgba(199,247,239,0) 70%)",
          mixBlendMode: "screen",
          opacity: appear,
        }}
      />

      {/* Carte UI (G4) flottante avec perspective + ombre froide */}
      <AbsoluteFill style={{ perspective: 2200 }}>
        <AbsoluteFill
          style={{
            transformStyle: "preserve-3d",
            transform: `translateY(${cardRise}px) rotateX(4deg) rotateY(-9deg) scale(${cardScale})`,
            transformOrigin: "50% 50%",
            opacity: appear,
            filter: "drop-shadow(0 46px 66px rgba(16,24,40,0.5))",
          }}
        >
          <G4Tri local={frame - G4_OFFSET} fps={fps} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
