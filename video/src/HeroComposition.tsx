import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { C, FONT } from "./theme";
import { sceneOpacity } from "./anim";
import { Toile } from "./components/Toile";
import { G1Hook } from "./scenes/G1Hook";
import { G2Pile } from "./scenes/G2Pile";
import { G3Colonnes } from "./scenes/G3Colonnes";
import { G4Tri } from "./scenes/G4Tri";
import { G6Cartes } from "./scenes/G6Cartes";
import { G7Cta } from "./scenes/G7Cta";

/**
 * Composition du héro (1920×1080, 30 fps, 930 frames = 31,0 s).
 *
 * Vidéo narrative de présentation, muette, guidée par le texte animé. Six
 * séquences enchaînées en crossfade court sur la toile (le brief G5 « compteur
 * de preuve » est retiré tant que le chiffre n'est pas mesuré) :
 *   G1 Hook · G2 Pile · G3 Colonnes · G4 Tri · G6 Cartes · G7 CTA.
 *
 * Une bande de sous-titres identique en bas d'écran affiche, à chaque nouvelle
 * séquence (sauf le hook et le final), une puce canard + une ligne courte. Les
 * scènes concernées sont légèrement remontées (SAFE_LIFT) pour ne jamais
 * empiéter sur cette bande.
 *
 * Boucle : G1 démarre pleine dès la frame 0 sur une toile quasi vide (les mots
 * n'apparaissent qu'ensuite) ; G7 se fond vers la toile en toute fin. La
 * dernière frame ≈ la première (toile nue), donc la boucle est sans à-coup.
 */
const SCENES = [
  { Comp: G1Hook, start: 0, inDur: 0, end: 156, outDur: 11, sub: null },
  { Comp: G2Pile, start: 145, inDur: 11, end: 301, outDur: 11, sub: "Le quotidien : tout s'accumule" },
  { Comp: G3Colonnes, start: 290, inDur: 11, end: 446, outDur: 11, sub: "Trois étapes, une seule journée" },
  { Comp: G4Tri, start: 435, inDur: 11, end: 657, outDur: 11, sub: "Le tri des mails — construit par un participant" },
  { Comp: G6Cartes, start: 646, inDur: 11, end: 790, outDur: 11, sub: "Formation, puis implémentation chez vous" },
  { Comp: G7Cta, start: 779, inDur: 11, end: 930, outDur: 14, sub: null },
] as const;

const SAFE_LIFT = 38; // remontée des scènes sous-titrées, hors de la bande

/** Bande de sous-titres identique sur toutes les scènes concernées. */
function SubtitleBand({ text, opacity }: { text: string; opacity: number }) {
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 66,
        opacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            background: C.canard,
            flex: "none",
          }}
        />
        <span
          style={{
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: "-0.01em",
            color: C.body,
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
}

export function HeroComposition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: C.toile }}>
      <Toile />

      {SCENES.map(({ Comp, start, inDur, end, outDur, sub }, i) => {
        const opacity = sceneOpacity(frame, start, inDur, end, outDur);
        if (opacity <= 0.001) return null;
        const lift = sub ? -SAFE_LIFT : 0;
        return (
          <AbsoluteFill key={i} style={{ opacity, transform: `translateY(${lift}px)` }}>
            <Comp local={frame - start} fps={fps} />
          </AbsoluteFill>
        );
      })}

      {/* Bande de sous-titres — fenêtre resserrée pour ne pas se chevaucher
          entre deux scènes pendant le crossfade. */}
      {SCENES.map(({ start, end, sub }, i) => {
        if (!sub) return null;
        const op = interpolate(
          frame,
          [start + 16, start + 28, end - 22, end - 10],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        if (op <= 0.001) return null;
        return <SubtitleBand key={i} text={sub} opacity={op} />;
      })}
    </AbsoluteFill>
  );
}
