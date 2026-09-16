// Charge un petit module TypeScript du projet sans ajouter de dépendance de test.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createRequire } from 'node:module';
const resolveModule = createRequire(import.meta.url);
export default function loadTs(filename, overrides = {}) {
  const absolute = path.resolve(filename);
  const source = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} };
  const localRequire = (id) => {
    if (id in overrides) return overrides[id];
    if (id.startsWith('.')) return loadTs(path.resolve(path.dirname(absolute), id + '.ts'), overrides);
    return resolveModule(id);
  };
  new Function('require', 'module', 'exports', source)(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
};
