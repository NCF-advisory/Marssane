import type { Metadata } from "next";

export const SITE_URL = "https://marssane.fr";

export const HOME_DESCRIPTION =
  "Marssane forme les dirigeants de PME de moins de 20 salariés à utiliser l’IA sur leurs propres dossiers, pour gagner du temps dès leur retour au travail.";

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
