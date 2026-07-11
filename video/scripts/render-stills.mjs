// Rend 8 PNG de revue (1 par scène + 2 intermédiaires) dans un dossier de sortie.
// Usage : node scripts/render-stills.mjs [dossier_de_sortie]
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_OUT =
  "/private/tmp/claude-501/-Users-ncf-Documents-Marssane-Site-Marssane/7704e8bc-8e2e-4a78-b75b-8e2c493a1c4f/scratchpad/video-stills";

const outDir = resolve(process.argv[2] ?? DEFAULT_OUT);
mkdirSync(outDir, { recursive: true });

// [frame, nom] — 3 démos d'interface (30 fps, 720 frames).
const STILLS = [
  [20, "d1-boite-brute"],
  [95, "d1-tri-en-cours"],
  [170, "d1-boite-triee"],
  [290, "d2-document-42p"],
  [430, "d2-synthese-12l"],
  [520, "d3-onde-vocale"],
  [660, "d3-courrier"],
  [702, "loop-raccord"],
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
