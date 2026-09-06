import type { MetadataRoute } from "next";
import { absoluteUrl, PUBLIC_PATHS } from "@/lib/seo";

/**
 * Plan du site — routes publiques. La page /styleguide (recette interne)
 * en est volontairement exclue.
 *
 * Même origine que les URL canoniques, y compris sans variable d'environnement.
 * Pas de lastModified artificiel : seules des dates éditoriales réelles
 * permettraient de le renseigner utilement.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((route) => ({
    url: absoluteUrl(route),
  }));
}
