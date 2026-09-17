import type { Metadata } from "next";

export const SITE_URL = "https://marssane.fr";

export const HOME_DESCRIPTION =
  "Marssane déploie des agents IA et automatise les tâches de votre PME : devis, mails, relances et reporting. Intégration à vos outils, passation ou maintenance.";

export const HOME_TITLE = "Marssane | Implémentation IA et automatisation pour PME";

/** Une seule origine publique pour les canoniques, le sitemap et le JSON-LD. */
export const PUBLIC_PATHS = [
  "/",
  "/formations",
  "/implementation",
  "/automatisation",
  "/quelle-ia",
  "/mentions-legales",
  "/confidentialite",
] as const;

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).href;
}

const OPEN_GRAPH_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Marssane · La formation IA des dirigeants de PME",
};

/** Métadonnées partagées des pages publiques, avec URL canonique et aperçu social. */
export function createPublicMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: `/${string}` | "/";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      locale: "fr_FR",
      type: "website",
      siteName: "Marssane",
      images: [OPEN_GRAPH_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OPEN_GRAPH_IMAGE],
    },
  };
}
