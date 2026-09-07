import assert from "node:assert/strict";

// Contrôle du HTML réellement servi : démarrer `npm start`, puis lancer
// `node scripts/check-seo.mjs http://127.0.0.1:3000` (ou l'URL publiée).
// Requêtes GET uniquement ; aucun formulaire ni rafraîchissement de données.
const base = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
const canonicalBase = "https://marssane.fr";
const paths = ["/", "/formations", "/quelle-ia", "/mentions-legales", "/confidentialite"];
const privatePaths = ["/admin", "/formation", "/styleguide", "/merci", "/implementation"];
const attributes = (tag) => Object.fromEntries(
  [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]),
);
const metadata = (html) => Object.fromEntries(
  [...html.matchAll(/<meta\s[^>]*>/g)].map(([tag]) => {
    const attrs = attributes(tag);
    return [attrs.name ?? attrs.property, attrs.content];
  }),
);
const schemas = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap((match) => {
    const parsed = JSON.parse(match[1]);
    return parsed["@graph"] ?? [parsed];
  });

async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  return { response, html: await response.text() };
}

const titles = new Set();
const descriptions = new Set();
for (const path of paths) {
  const { response, html } = await get(path);
  assert.equal(response.status, 200, path);
  const meta = metadata(html);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  assert.ok(title && meta.description, `Titre/description manquant : ${path}`);
  assert.ok(!titles.has(title), `Titre dupliqué : ${path}`);
  assert.ok(!descriptions.has(meta.description), `Description dupliquée : ${path}`);
  titles.add(title);
  descriptions.add(meta.description);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `H1 : ${path}`);
  assert.doesNotMatch(meta.robots ?? "", /noindex/, path);
  assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex/, path);
  const canonicals = [...html.matchAll(/<link\s[^>]*>/g)]
    .map(([tag]) => attributes(tag)).filter((attrs) => attrs.rel === "canonical");
  assert.equal(canonicals.length, 1, `Canonique : ${path}`);
  assert.equal(new URL(canonicals[0].href).href, new URL(path, canonicalBase).href, path);
  assert.equal(new URL(meta["og:url"]).href, new URL(path, canonicalBase).href, `OpenGraph : ${path}`);
  const nodes = schemas(html);
  assert.doesNotMatch(html, /href="(?:https:\/\/marssane\.fr)?\/parcours(?:["/#?])/, `Lien vers la page masquée : ${path}`);
  if (["/", "/formations", "/quelle-ia"].includes(path)) {
    assert.ok(nodes.length > 0, `Données structurées absentes : ${path}`);
  }
  if (path === "/formations") {
    const courses = nodes.filter((node) => node["@type"] === "Course");
    assert.equal(courses.length, 1, `Seul le cours débutant doit être balisé : ${path}`);
    assert.equal(courses[0].timeRequired, "PT7H", path);
  }
  if (path === "/") {
    const faq = nodes.find((node) => [].concat(node["@type"]).includes("FAQPage"));
    assert.ok(faq?.mainEntity.length, "FAQ absente");
    // Le texte visible doit être celui décrit aux moteurs, pas une FAQ cachée.
    for (const question of faq.mainEntity) {
      const escape = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
      assert.ok(html.includes(escape(question.name)), `Question non visible : ${question.name}`);
      assert.ok(html.includes(escape(question.acceptedAnswer.text)), `Réponse non visible : ${question.name}`);
    }
  }
  console.log(`OK ${path}`);
}
for (const path of privatePaths) {
  const { response, html } = await get(path);
  assert.match(metadata(html).robots ?? "", /noindex/, path);
  assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/, path);
}
const { response: sitemapResponse, html: sitemap } = await get("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).href);
assert.deepEqual(locations.sort(), paths.map((path) => new URL(path, canonicalBase).href).sort());
const { html: robots } = await get("/robots.txt");
assert.match(robots, /User-Agent: \*/i);
assert.match(robots, /Allow: \/\s/);
assert.ok(robots.includes(`Sitemap: ${canonicalBase}/sitemap.xml`));
assert.doesNotMatch(robots, /Disallow: \/(?:formations|admin|formation\$|styleguide)(?:\s|$)/);
const { response: missing } = await get("/seo-audit-page-inexistante");
assert.equal(missing.status, 404);
const { response: parcours, html: parcoursHtml } = await get("/parcours");
assert.equal(parcours.status, 404, "La page parcours doit rester masquée");
assert.match(metadata(parcoursHtml).robots ?? "", /noindex/, "Parcours masqué non indexable");
console.log("SEO vérifié : 5 pages publiques, 5 pages noindex, parcours masqué, sitemap, robots, FAQ et durée du cours.");
