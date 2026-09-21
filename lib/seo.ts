import type { Metadata } from "next";
import { PUBLIC_PATHS } from "@/lib/public-paths.mjs";

export const SITE_URL = "https://marssane.fr";

export const HOME_DESCRIPTION =
  "Marssane déploie des agents IA et automatise les tâches de votre PME : devis, mails, relances et reporting. Intégration à vos outils, passation ou maintenance.";

export const HOME_TITLE = "Marssane | Implémentation IA et automatisation pour PME";

/** Une seule origine publique pour les canoniques, le sitemap et le JSON-LD. */
export { PUBLIC_PATHS };

/**
 * Date de dernière modification du contenu de chaque page publique, tenue à la
 * main et publiée dans le sitemap.
 *
 * Règle : quand le contenu d'une page change (texte, visuel, structure ou une
 * source qu'elle affiche — `lib/*-faq.ts`, `lib/niveaux.ts`, `lib/creneaux.ts`,
 * ses composants de section), la date de cette page est mise à jour dans le
 * même commit. Ne jamais y mettre la date du jour par réflexe : un correctif
 * technique, une dépendance ou un changement de balisage ne déplacent pas la
 * date. Une date fausse est pire qu'une date ancienne — les moteurs cessent de
 * s'y fier.
 *
 * Valeurs initiales : date du dernier commit ayant touché la page ou l'un de
 * ses fichiers de contenu (`git log -1 --format=%cs -- …`), au 18/09/2026.
 */
export const LAST_MODIFIED: Record<(typeof PUBLIC_PATHS)[number], string> = {
  "/": "2026-09-17",
  "/formations": "2026-09-17",
  "/implementation": "2026-09-17",
  "/automatisation": "2026-09-17",
  "/quelle-ia": "2026-09-18",
  "/mentions-legales": "2026-09-02",
  "/confidentialite": "2026-09-02",
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).href;
}

export const OPEN_GRAPH_IMAGE = {
  url: "/images/marssane-hero-partage-20260918.png",
  width: 1200,
  height: 630,
  alt: "Marssane · Dirigeant de PME, gagnez 2 h par jour grâce à l’implémentation IA",
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
