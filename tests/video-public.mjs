import assert from 'node:assert/strict';
const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3022';

for (const type of [chromium, webkit]) {
  const browser = await type.launch({ headless: true, ...(type === chromium && process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    const page = await browser.newPage({ reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    const video = page.locator('video').first();
    await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2);
    const initial = await video.evaluate(v => ({ paused: v.paused, muted: v.muted, loop: v.loop, inline: v.playsInline, controls: v.controls }));
    assert.equal(initial.muted, true);
    assert.equal(initial.loop, true);
    assert.equal(initial.inline, true);
    if (type === chromium) assert.equal(initial.paused, false, 'Lecture automatique Chrome');
    if (initial.paused) {
      assert.equal(initial.controls, true, 'Contrôles de secours si le navigateur refuse');
      await page.getByRole('heading', { level: 1 }).click();
    }
    await page.waitForFunction(() => { const v = document.querySelector('video'); return !v.paused && v.currentTime > 0.2; });
    // Passage réel par la fin du fichier, sans attendre les 21 secondes.
    await video.evaluate(v => { v.currentTime = v.duration - 0.25; });
    await page.waitForFunction(() => { const v = document.querySelector('video'); return !v.paused && v.currentTime < 2; });
    // Reprise après interruption du navigateur et restauration de la page.
    await video.evaluate(v => { v.pause(); window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })); });
    await page.waitForFunction(() => !document.querySelector('video').paused);
    assert.deepEqual(errors, []);
    console.log(type.name() + ': lecture, boucle et reprise validées' + (initial.paused ? ' (autorisation initiale par clic requise dans ce navigateur)' : ''));
    await page.close();

    const reduced = await browser.newPage({ reducedMotion: 'reduce' });
    await reduced.goto(base, { waitUntil: 'networkidle' });
    await reduced.getByRole('heading', { level: 1 }).click();
    const state = await reduced.locator('video').first().evaluate(v => ({ paused: v.paused, controls: v.controls, autoplay: v.autoplay }));
    assert.deepEqual(state, { paused: true, controls: true, autoplay: false });
    console.log(type.name() + ': préférence de réduction des animations respectée');
    await reduced.close();
  } finally {
    await browser.close();
  }
}
