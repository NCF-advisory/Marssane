import assert from "node:assert/strict";

// Contrôle du HTML réellement servi : démarrer `npm start`, puis lancer
// `node scripts/check-seo.mjs http://127.0.0.1:3000` (ou l'URL publiée).
// Requêtes GET uniquement ; aucun formulaire ni rafraîchissement de données.
const base = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
const canonicalBase = "https://marssane.fr";
const paths = ["/", "/implementation", "/automatisation", "/formations", "/quelle-ia", "/mentions-legales", "/confidentialite"];
const privatePaths = ["/formation", "/styleguide", "/merci"];
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
  const shareImage = `${canonicalBase}/images/marssane-hero-partage-20260918.png`;
  assert.equal(meta["og:image"], shareImage, `Image Open Graph : ${path}`);
  assert.equal(meta["twitter:image"], shareImage, `Image Twitter : ${path}`);
  assert.match(meta["og:image:alt"], /gagnez 2 h par jour/, `Texte de l’aperçu : ${path}`);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  assert.ok(title && meta.description, `Titre/description manquant : ${path}`);
  assert.ok(!titles.has(title), `Titre dupliqué : ${path}`);
  assert.ok(!descriptions.has(meta.description), `Description dupliquée : ${path}`);
  titles.add(title);
  descriptions.add(meta.description);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `H1 : ${path}`);
  assert.doesNotMatch(meta.robots ?? "", /noindex|nofollow/, path);
  assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex|nofollow/, path);
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
  if (["/implementation", "/automatisation"].includes(path)) {
    const service = nodes.find((node) => node["@type"] === "Service");
    assert.ok(service, `Service absent : ${path}`);
    assert.equal(service.url, new URL(path, canonicalBase).href);
    assert.equal(service.provider["@id"], `${canonicalBase}/#organization`);
    assert.ok(nodes.some((node) => node["@id"] === service.provider["@id"]), `Organisation absente : ${path}`);
    const page = nodes.find((node) => node["@type"] === "WebPage");
    assert.equal(page?.mainEntity["@id"], service["@id"]);
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
    assert.ok(visibleHtml.includes(service.description.replaceAll("&", "&amp;").replaceAll("'", "&#x27;")), `Description du service non visible : ${path}`);
  }
  if (path === "/") {
    assert.match(title, /Implémentation IA et automatisation/);
    assert.match(meta.description, /déploie des agents IA et automatise/);
    assert.equal(meta["og:title"], title);
    assert.equal(meta["twitter:title"], title);
    assert.equal(meta["og:description"], meta.description);
    assert.equal(meta["twitter:description"], meta.description);
  }
  if (["/", "/implementation", "/automatisation"].includes(path)) {
    const faq = nodes.find((node) => [].concat(node["@type"]).includes("FAQPage"));
    assert.ok(faq?.mainEntity.length, "FAQ absente");
    // Le texte visible doit être celui décrit aux moteurs, pas une FAQ cachée.
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
    for (const question of faq.mainEntity) {
      const escape = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
      assert.ok(visibleHtml.includes(escape(question.name)), `Question non visible : ${question.name}`);
      assert.ok(visibleHtml.includes(escape(question.acceptedAnswer.text)), `Réponse non visible : ${question.name}`);
    }
  }
  console.log(`OK ${path}`);
}
for (const path of privatePaths) {
  const { response, html } = await get(path);
  assert.match(metadata(html).robots ?? "", /noindex/, path);
  if (["/formation", "/styleguide", "/merci"].includes(path)) {
    assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/, path);
  }
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
const admin = await fetch(new URL("/admin", base), { redirect: "manual", signal: AbortSignal.timeout(30000) });
assert.equal(admin.status, 307, "Ancien admin redirigé");
assert.equal(new URL(admin.headers.get("location")).hostname, "erp.marssane.fr");
console.log("SEO vérifié : 7 pages publiques, 6 pages noindex, admin redirigé, sitemap, robots, services, FAQ et durée du cours.");
