/**
 * IndexNow — signale les URL publiques à Bing, Yandex, Naver et Seznam
 * (Google n'utilise pas le protocole).
 *
 * Pourquoi un `postbuild` et pas un envoi à chaque modification : les sept URL
 * publiques sont stables, seul leur contenu bouge. Un ping après le build d'un
 * déploiement de production suffit — les moteurs viennent explorer quelques
 * minutes plus tard, une fois le déploiement promu. Hors production (aperçus,
 * builds locaux), le contenu annoncé ne serait pas celui servi par
 * marssane.fr : le `postbuild` passe `--apres-build` et le script s'arrête si
 * `VERCEL_ENV` ne vaut pas « production ».
 *
 * Usage :
 *   node scripts/indexnow.mjs             ping manuel (npm run indexnow)
 *   node scripts/indexnow.mjs --dry-run   affiche la requête sans l'envoyer
 *   node scripts/indexnow.mjs --apres-build   n'agit qu'en production Vercel
 *
 * Aucune erreur ne doit faire échouer un build : tout est logué et le code de
 * sortie reste 0.
 */
import { readdirSync } from "node:fs";
import { PUBLIC_PATHS } from "../lib/public-paths.mjs";

const HOST = "marssane.fr";
const ORIGINE = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const options = process.argv.slice(2);
const dryRun = options.includes("--dry-run");

if (options.includes("--apres-build") && process.env.VERCEL_ENV !== "production") {
  console.log(
    `IndexNow ignoré : build hors production (VERCEL_ENV=${process.env.VERCEL_ENV ?? "absent"}).`,
  );
  process.exit(0);
}

/**
 * La clé est le nom du fichier publié dans `public/` : un seul endroit à
 * changer si elle est renouvelée, et le fichier de vérification ne peut pas
 * diverger de la clé envoyée.
 */
function lireCle() {
  const fichiers = readdirSync(new URL("../public/", import.meta.url))
    .filter((nom) => /^[0-9a-f]{32}\.txt$/.test(nom));
  if (fichiers.length !== 1) {
    throw new Error(
      `public/ doit contenir exactement un fichier de clé IndexNow (trouvé : ${fichiers.length}).`,
    );
  }
  return fichiers[0].replace(/\.txt$/, "");
}

try {
  const key = lireCle();
  const charge = {
    host: HOST,
    key,
    keyLocation: `${ORIGINE}/${key}.txt`,
    urlList: PUBLIC_PATHS.map((route) => new URL(route, ORIGINE).href),
  };

  if (dryRun) {
    console.log(`POST ${ENDPOINT}`);
    console.log(JSON.stringify(charge, null, 2));
  } else {
    const reponse = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(charge),
      signal: AbortSignal.timeout(15000),
    });
    // 200 et 202 valent acceptation ; tout le reste est signalé sans bloquer.
    console.log(
      `IndexNow ${reponse.status} pour ${charge.urlList.length} URL (clé ${key}).`,
    );
    if (!reponse.ok) console.log(await reponse.text());
  }
} catch (erreur) {
  console.log(`IndexNow non envoyé : ${erreur instanceof Error ? erreur.message : erreur}`);
}
