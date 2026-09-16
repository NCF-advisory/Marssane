import assert from 'node:assert/strict';
const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3000';
const routes = {
  implementation: ['marssane-prospection', 'marssane-devis', 'marssane-secretaire-vocal'],
  automatisation: ['marssane-secretaire', 'marssane-pilotage'],
};

for (const browserType of [chromium, webkit]) {
  const browser = await browserType.launch();
  try {
    for (const width of [1440, 390]) {
      for (const [route, tags] of Object.entries(routes)) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`${base}/${route}`, { waitUntil: 'domcontentloaded' });
        await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; }' });
        await page.waitForFunction(tags => tags.every(tag => document.querySelector(tag)?.paths), tags);
        await page.waitForTimeout(300);
        for (const tag of tags) assert.equal(await page.locator(tag).evaluate(s => s.elapsed), 0, `${tag}: attend le scroll`);

        for (const tag of tags) {
          const schema = page.locator(tag);
          // Une petite partie visible ne suffit pas à lancer l’animation.
          await schema.evaluate(s => {
            const r = s.getBoundingClientRect();
            window.scrollTo(0, scrollY + r.top - innerHeight + r.height * 0.25);
          });
          await page.waitForTimeout(200);
          assert.equal(await schema.evaluate(s => s.elapsed), 0, `${tag}: ne démarre pas au bord de l’écran`);
          await schema.evaluate(s => s.scrollIntoView({ block: 'center', behavior: 'instant' }));
          await page.waitForFunction(tag => document.querySelector(tag).elapsed > 0.1, tag);
          assert((await schema.evaluate(s => s.elapsed)) < 1, `${tag}: démarre au début`);

          // Une sortie complète réarme le début, sans exécuter d’images hors champ.
          await schema.evaluate(s => s.seek(5));
          await page.evaluate(() => scrollTo(0, 0));
          await page.waitForFunction(tag => !document.querySelector(tag).inView, tag);
          const stoppedAt = await schema.evaluate(s => s.elapsed);
          await page.waitForTimeout(200);
          assert.equal(await schema.evaluate(s => s.elapsed), stoppedAt, `${tag}: suspendu hors champ`);
          await schema.evaluate(s => s.scrollIntoView({ block: 'center', behavior: 'instant' }));
          await page.waitForFunction(tag => { const s = document.querySelector(tag); return s.elapsed > 0.05 && s.elapsed < 1; }, tag);

          // La pause décidée par l’utilisateur survit à un aller-retour au scroll.
          await schema.getByRole('button', { name: 'Mettre l’animation en pause' }).click();
          const pausedAt = await schema.evaluate(s => s.elapsed);
          await page.evaluate(() => scrollTo(0, 0));
          await page.waitForFunction(tag => !document.querySelector(tag).inView, tag);
          await schema.evaluate(s => s.scrollIntoView({ block: 'center', behavior: 'instant' }));
          await page.waitForFunction(tag => document.querySelector(tag).inView, tag);
          await page.waitForTimeout(150);
          assert.equal(await schema.evaluate(s => s.elapsed), pausedAt, `${tag}: pause manuelle respectée`);
          await page.evaluate(() => scrollTo(0, 0));
        }
        assert.deepEqual(errors, []);
        console.log(`OK ${browserType.name()} ${width}px /${route} : attente, entrée, sortie, retour et pause`);
        await page.close();
      }
    }
    for (const [route, tags] of Object.entries(routes)) {
      const page = await browser.newPage({ reducedMotion: 'reduce' });
      await page.goto(`${base}/${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(tags => tags.every(tag => document.querySelector(tag)?.paths), tags);
      for (const tag of tags) {
        const schema = page.locator(tag);
        await schema.evaluate(s => s.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.waitForTimeout(100);
        assert.deepEqual(await schema.evaluate(s => [s.elapsed, s.running]), [9, false]);
      }
      await page.close();
    }
    console.log(`OK ${browserType.name()} : mouvement réduit, résultat fixe`);
  } finally { await browser.close(); }
}
