import {
  CRENEAU_LIEU_COURT,
  CRENEAUX_DATES,
  FORMATION_DUREE_ISO,
} from "@/lib/creneaux";
import { NIVEAUX } from "@/lib/niveaux";
import { absoluteUrl, HOME_DESCRIPTION } from "@/lib/seo";

export const ORGANIZATION_ID = absoluteUrl("/#organization");
export const PERSON_ID = absoluteUrl("/#formateur");
export const WEBSITE_ID = absoluteUrl("/#website");
export const COURSE_ID = absoluteUrl("/formations#debutant");

// Seulement les informations publiées sur le site ; pas d'avis clients,
// d'agrément, de profils sociaux ni d'établissement local supposés.
export const siteEntities = [
  {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Marssane",
    url: absoluteUrl("/"),
    description: HOME_DESCRIPTION,
    email: "contact@marssane.fr",
    legalName: "NCF Advisory",
    // Raster de 180 px : Google demande au moins 112 px, l'icône SVG du site
    // (327 octets) ne convient pas comme logo d'organisation.
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/apple-icon.png"),
      width: 180,
      height: 180,
    },
    // Coordonnées et identifiant repris mot pour mot des mentions légales.
    address: {
      "@type": "PostalAddress",
      streetAddress: "3 Cité Rougemont",
      postalCode: "75009",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
    identifier: {
      "@type": "PropertyValue",
      propertyID: "SIREN",
      value: "800 285 363",
    },
    areaServed: "FR",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Contact",
      email: "contact@marssane.fr",
      availableLanguage: "fr",
    },
    // Mêmes @id et mêmes noms que les Service émis par serviceEntities() :
    // les deux entités fusionnent sur les pages métiers.
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": absoluteUrl("/implementation#service"),
          name: "Implémentation IA pour les PME",
          url: absoluteUrl("/implementation"),
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": absoluteUrl("/automatisation#service"),
          name: "Automatisation pour les PME",
          url: absoluteUrl("/automatisation"),
        },
      },
    ],
    founder: { "@id": PERSON_ID },
    parentOrganization: {
      "@type": "Organization",
      name: "NCF Advisory",
      url: absoluteUrl("/mentions-legales"),
    },
  },
  {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Cléante Oullion",
    url: absoluteUrl("/"),
    image: absoluteUrl("/img/formateur/cleante.jpg"),
    jobTitle: "Fondateur de Marssane",
    knowsAbout: ["Implémentation IA", "Automatisation des tâches métier", "Formation IA"],
    // Les quatre certifications affichées sur l'accueil. Ce sont des
    // certifications suivies à l'Anthropic Academy, pas un agrément d'Anthropic
    // (cf. le garde-fou de components/site/Formateur.tsx).
    hasCredential: [
      "Claude Code in Action",
      "AI Fluency",
      "Model Context Protocol (MCP)",
      "Claude with the Anthropic API",
    ].map((name) => ({
      "@type": "EducationalOccupationalCredential",
      name,
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "Anthropic Academy" },
    })),
    sameAs: ["https://fr.linkedin.com/in/cl%C3%A9ante-oullion-a555291a1"],
    worksFor: { "@id": ORGANIZATION_ID },
  },
  {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Marssane",
    url: absoluteUrl("/"),
    inLanguage: "fr-FR",
    publisher: { "@id": ORGANIZATION_ID },
  },
];

/** Le balisage réutilise le contenu affiché, sans ajouter de résultats supposés. */
export function serviceEntities({
  path,
  name,
  description,
  faq,
}: {
  path: string;
  name: string;
  description: string;
  faq: { question: string; reponse: string }[];
}) {
  const serviceId = absoluteUrl(`${path}#service`);
  return [
    ...siteEntities,
    {
      ...webPage({ path, name, description }),
      mainEntity: { "@id": serviceId },
      hasPart: { "@id": absoluteUrl(`${path}#faq`) },
    },
    {
      "@type": "Service",
      "@id": serviceId,
      url: absoluteUrl(path),
      name: `${name} pour les PME`,
      serviceType: name,
      description,
      provider: { "@id": ORGANIZATION_ID },
      audience: { "@type": "BusinessAudience", audienceType: "PME" },
      mainEntityOfPage: { "@id": absoluteUrl(`${path}#webpage`) },
    },
    {
      "@type": "FAQPage",
      "@id": absoluteUrl(`${path}#faq`),
      isPartOf: { "@id": absoluteUrl(`${path}#webpage`) },
      mainEntity: faq.map(({ question, reponse }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: reponse },
      })),
    },
  ];
}

/** Adresse du lieu de formation, dérivée de CRENEAU_LIEU. */
const LIEU_FORMATION = {
  "@type": "Place",
  name: CRENEAU_LIEU_COURT,
  address: {
    "@type": "PostalAddress",
    streetAddress: "13 Rue Claude Chappe",
    postalCode: "69370",
    addressLocality: "Saint-Didier-au-Mont-d'Or",
    addressCountry: "FR",
  },
};

/** Le niveau débutant est le seul programme finalisé et ouvert. */
export function beginnerCourse() {
  const niveau = NIVEAUX[0];
  // Seuls les créneaux dont la fin n'est pas passée au moment du build sont
  // annoncés : un créneau écoulé n'est plus une session à laquelle s'inscrire.
  // Pas d'`offers` : le prix n'est pas affiché sur /formations.
  const maintenant = Date.now();
  const sessions = CRENEAUX_DATES
    .filter(({ fin }) => new Date(fin).getTime() > maintenant)
    .map(({ debut, fin }) => ({
      "@type": "CourseInstance",
      courseMode: "Onsite",
      courseWorkload: FORMATION_DUREE_ISO,
      startDate: debut,
      endDate: fin,
      location: LIEU_FORMATION,
      instructor: { "@id": PERSON_ID },
    }));
  return {
    "@type": "Course",
    "@id": COURSE_ID,
    url: COURSE_ID,
    name: `Formation IA débutant : ${niveau.titre}`,
    description: niveau.accroche,
    inLanguage: "fr-FR",
    educationalLevel: niveau.nom,
    timeRequired: FORMATION_DUREE_ISO,
    teaches: niveau.points,
    ...(sessions.length ? { hasCourseInstance: sessions } : {}),
    provider: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Marssane",
      url: absoluteUrl("/"),
    },
  };
}

/**
 * Vidéo de héro : métadonnées seules, aucun contenu nouveau. `duration` est
 * relevée dans l'en-tête `mvhd` du MP4 (et recoupée avec le nombre d'images de
 * la composition Remotion), `uploadDate` est la date des fichiers livrés.
 * À rattacher à la WebPage de la page par `video: { "@id": … }`.
 */
export function videoObject({
  path,
  name,
  description,
  contentUrl,
  thumbnailUrl,
  uploadDate,
  duration,
}: {
  path: string;
  name: string;
  description: string;
  contentUrl: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
}) {
  return {
    "@type": "VideoObject",
    "@id": absoluteUrl(`${path}#video`),
    name,
    description,
    thumbnailUrl: [absoluteUrl(thumbnailUrl)],
    contentUrl: absoluteUrl(contentUrl),
    uploadDate,
    duration,
    inLanguage: "fr-FR",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function webPage({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@type": "WebPage",
    "@id": absoluteUrl(`${path}#webpage`),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}
