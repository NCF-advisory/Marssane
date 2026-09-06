import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Les pages HTML privées portent noindex et restent explorables afin
      // que les moteurs puissent lire cette directive. L'authentification
      // protège toujours les données ; robots.txt n'est pas un contrôle d'accès.
      disallow: ["/api/", "/formation/espace/stream"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
