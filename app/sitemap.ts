import type { MetadataRoute } from "next";
import { absoluteUrl, LAST_MODIFIED, PUBLIC_PATHS } from "@/lib/seo";

/**
 * Plan du site — routes publiques. La page /styleguide (recette interne)
 * en est volontairement exclue.
 *
 * Même origine que les URL canoniques, y compris sans variable d'environnement.
 * Les dates viennent de LAST_MODIFIED (lib/seo) : des dates éditoriales
 * réelles, tenues à la main page par page — jamais la date du build.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((route) => ({
    url: absoluteUrl(route),
    lastModified: LAST_MODIFIED[route],
  }));
}
