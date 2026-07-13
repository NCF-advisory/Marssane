import { AbsoluteFill } from "remotion";
import { C, FONT } from "../theme";
import { ramp } from "../anim";
import { MarssaneLogo } from "../components/MarssaneLogo";

/**
 * G7 — Final (25,5–30 s). Le lockup Marssane monte en fondu, très grand, quasi
 * plein cadre. En dessous, le libellé « Réserver une place » en texte simple,
 * discret — pas de bouton ni de flèche (rien de cliquable dans une vidéo). La
 * scène tient sur une frame fixe puis se fond vers la toile pour boucler.
 */
export function G7Cta({ local }: { local: number; fps: number }) {
  const logoT = ramp(local, 6, 46);
  const textT = ramp(local, 54, 76);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 52,
        }}
      >
        <div
          style={{
            opacity: logoT,
            transform: `translateY(${(1 - logoT) * 26}px) scale(${
              0.82 + 0.18 * logoT
            })`,
          }}
        >
          <MarssaneLogo size={380} />
        </div>

        <span
          style={{
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: "0.01em",
            color: C.slate,
            opacity: textT,
            transform: `translateY(${(1 - textT) * 14}px)`,
          }}
        >
          Réserver une place
        </span>
      </div>
    </AbsoluteFill>
  );
}
