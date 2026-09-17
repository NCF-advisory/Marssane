import path from 'node:path';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill, renderMedia} from '@remotion/renderer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, '../public/video');
const work = await mkdtemp(path.join(tmpdir(), 'marssane-equipe-'));
console.log(`Previews: ${work}`);
const serveUrl = await bundle({entryPoint: path.join(root, 'src/agents/index.tsx'),
  outDir: path.join(work, 'bundle'), publicDir: path.join(root, 'public')});
const browser = await openBrowser('chrome');
try {
  const composition = await selectComposition({serveUrl, id: 'EquipeAgents', puppeteerInstance: browser});
  const common = {serveUrl, composition, puppeteerInstance: browser, logLevel: 'error', timeoutInMilliseconds: 120000};
  for (const [label, frame] of [['voici', 120], ['jacques', 228], ['camille', 350], ['final', 1920]]) {
    await renderStill({...common, frame, output: path.join(work, `${label}.png`), imageFormat: 'png'});
  }
  if (!process.argv.includes('--preview')) {
    let last = -1;
    await renderMedia({...common, codec: 'h264', muted: true,
      outputLocation: path.join(output, 'marssane-equipe-agents-v12-blanc-pause-web.mp4'),
      crf: 20, pixelFormat: 'yuv420p', colorSpace: 'bt709', concurrency: 2,
      imageFormat: 'jpeg', jpegQuality: 95, x264Preset: 'medium',
      onProgress: ({progress}) => {
        const percent = Math.floor(progress * 20) * 5;
        if (percent !== last) { console.log(`Rendu: ${percent}%`); last = percent; }
      }});
    await renderStill({...common, frame: 1920,
      output: path.join(output, 'marssane-equipe-agents-v12-blanc-poster.jpg'),
      imageFormat: 'jpeg', jpegQuality: 95});
  }
} finally {
  await browser.close({silent: true});
  await rm(path.join(work, 'bundle'), {recursive: true, force: true});
}
