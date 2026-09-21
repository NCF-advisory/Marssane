/**
 * Routes publiques du site — liste unique, tenue ici et nulle part ailleurs.
 *
 * Module JavaScript pur et non TypeScript : `scripts/indexnow.mjs` tourne sous
 * Node sans étape de compilation et doit pouvoir l'importer tel quel. Côté
 * application, `lib/seo.ts` le ré-exporte sous le même nom ; l'annotation
 * `@type {const}` conserve le type `readonly [...]` que donnait `as const`.
 */
export const PUBLIC_PATHS = /** @type {const} */ ([
  "/",
  "/formations",
  "/implementation",
  "/automatisation",
  "/quelle-ia",
  "/mentions-legales",
  "/confidentialite",
]);
