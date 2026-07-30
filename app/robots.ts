import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/styleguide", "/formation", "/api"],
    },
    sitemap: "https://marssane.fr/sitemap.xml",
  };
}
