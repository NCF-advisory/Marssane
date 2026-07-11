import { AbsoluteFill } from "remotion";
import { C, FONT } from "../theme";

const STEP = 80;
const LINE = "rgba(193,201,210,0.45)";

/** Intersections où se posent les repères « + » gris (déterministe, ~1/6). */
const REPERES: Array<[number, number]> = [
  [2, 3],
  [9, 2],
  [5, 6],
  [12, 5],
  [3, 10],
  [7, 13],
  [11, 12],
  [1, 15],
  [6, 1],
  [13, 8],
  [8, 9],
];

/**
 * La toile Marssane : fond #EEF1F3, deux washes radiaux (menthe + périwinkle,
 * ≤ 2 par écran), quadrillage 80 px ligne 1 px, et repères « + » gris.
 * Décor constant sur toute la durée — « la grille est la scène, jamais le
 * spectacle ». Reprend exactement les valeurs de app/globals.css.
 */
export function Toile() {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.toile,
        backgroundImage: [
          "radial-gradient(34% 22% at 96% 2%, rgba(199,247,239,0.55), rgba(199,247,239,0) 70%)",
          "radial-gradient(30% 20% at 3% 12%, rgba(199,210,247,0.5), rgba(199,210,247,0) 70%)",
          `repeating-linear-gradient(to right, transparent 0, transparent ${STEP - 1}px, ${LINE} ${STEP - 1}px, ${LINE} ${STEP}px)`,
          `repeating-linear-gradient(to bottom, transparent 0, transparent ${STEP - 1}px, ${LINE} ${STEP - 1}px, ${LINE} ${STEP}px)`,
        ].join(","),
      }}
    >
      {REPERES.map(([col, row], i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: col * STEP,
            top: row * STEP,
            transform: "translate(-50%, -50%)",
            color: C.repere,
            fontFamily: FONT.mono,
            fontSize: 24,
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          +
        </span>
      ))}
    </AbsoluteFill>
  );
}
