import { loadFont } from "@remotion/fonts";
import { staticFile, delayRender, continueRender } from "remotion";
import { FONT } from "./theme";

/**
 * Chargement local des polices variables du repo (aucun appel réseau).
 * Les woff2 sont copiés dans `public/fonts/` (staticFile les résout depuis là).
 * Un delayRender bloque le rendu tant que les deux polices ne sont pas prêtes,
 * pour éviter tout FOUT sur les stills et l'export.
 */
const handle = delayRender("Chargement des polices Marssane");

Promise.all([
  loadFont({
    family: FONT.sans,
    url: staticFile("fonts/plus-jakarta-sans-latin-variable.woff2"),
    weight: "400 800",
  }),
  loadFont({
    family: FONT.mono,
    url: staticFile("fonts/spline-sans-mono-latin-variable.woff2"),
    weight: "400 600",
  }),
])
  .then(() => continueRender(handle))
  .catch((err) => {
    // On libère quand même le rendu : mieux vaut une police de repli qu'un blocage.
    console.error("Échec du chargement des polices", err);
    continueRender(handle);
  });
