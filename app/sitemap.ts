import type { MetadataRoute } from "next";

/**
 * Plan du site — quatre routes publiques. La page /styleguide (recette interne)
 * en est volontairement exclue.
 *
 * L'URL de base vient de NEXT_PUBLIC_SITE_URL ; à défaut, localhost pour le
 * développement (le domaine définitif sera renseigné à la mise en ligne).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = [
    "/",
    "/formations",
    "/merci",
    "/mentions-legales",
    "/confidentialite",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
  }));
}
