// Rend 8 PNG de revue (1 par scène + 2 intermédiaires) dans un dossier de sortie.
// Usage : node scripts/render-stills.mjs [dossier_de_sortie]
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_OUT =
  "/private/tmp/claude-501/-Users-ncf-Documents-Marssane-Site-Marssane/7704e8bc-8e2e-4a78-b75b-8e2c493a1c4f/scratchpad/video-stills";

const outDir = resolve(process.argv[2] ?? DEFAULT_OUT);
mkdirSync(outDir, { recursive: true });

// [frame, nom] — voir séquencier (30 fps).
const STILLS = [
  [90, "01-ouverture"],
  [157, "02-promesse"],
  [250, "03-cas1-transition"],
  [325, "03-cas1-final"],
  [470, "04-cas2-synthese"],
  [600, "05-cas3-courrier"],
  [665, "06-chiffres"],
  [748, "06-cloture"],
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
