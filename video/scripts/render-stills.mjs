// Rend 8 PNG de revue (1 par séquence + 2 intermédiaires) dans un dossier de sortie.
// Usage : node scripts/render-stills.mjs [dossier_de_sortie]
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_OUT =
  "/private/tmp/claude-501/-Users-ncf-Documents-Marssane-Site-Marssane/ebfa84cb-4a95-4333-bc23-9c3972ac1964/scratchpad/video-stills";

const outDir = resolve(process.argv[2] ?? DEFAULT_OUT);
mkdirSync(outDir, { recursive: true });

// [frame, nom] — 6 séquences (30 fps, 930 frames).
const STILLS = [
  [56, "g1-logos"],
  [112, "g1-question"],
  [280, "g2-pile"],
  [380, "g3-colonnes"],
  [585, "g4-tri"],
  [730, "g6-cartes"],
  [890, "g7-final"],
];

for (const [frame, name] of STILLS) {
  const out = resolve(outDir, `${String(frame).padStart(3, "0")}-${name}.png`);
  console.log(`→ frame ${frame} : ${out}`);
  execFileSync(
    "npx",
    [
      "remotion",
      "still",
      "src/index.ts",
      "HeroVideo",
      out,
      `--frame=${frame}`,
      "--image-format=png",
    ],
    { stdio: "inherit" },
  );
}

console.log(`\n${STILLS.length} stills rendus dans ${outDir}`);
