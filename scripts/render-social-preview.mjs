import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { mkdir, copyFile } from "node:fs/promises";

// Fournir PLAYWRIGHT_MODULE si Playwright est installé hors du projet.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const output = new URL("../public/images/marssane-hero-partage-20260918.png", import.meta.url);
await mkdir(new URL("../public/images/", import.meta.url), { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(new URL("./social-preview.html", import.meta.url).href);
  await page.evaluate(async () => {
    await document.fonts.ready;
    const video = document.querySelector("video");
    if (video.readyState < 2) {
      await new Promise((resolve) => video.addEventListener("loadeddata", resolve, { once: true }));
    }
    await new Promise((resolve) => {
      video.addEventListener("seeked", resolve, { once: true });
      video.currentTime = 12;
    });
  });
  await page.screenshot({ path: fileURLToPath(output) });
  // Conserver aussi l'ancienne URL pour les aperçus qui la demandent encore.
  await copyFile(output, new URL("../app/opengraph-image.png", import.meta.url));
} finally {
  await browser.close();
}
