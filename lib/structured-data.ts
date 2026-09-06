import { FORMATION_DUREE_ISO } from "@/lib/creneaux";
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
    logo: absoluteUrl("/icon.svg"),
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
    url: absoluteUrl("/#formateur"),
    image: absoluteUrl("/img/formateur/cleante.jpg"),
    jobTitle: "Fondateur et formateur de Marssane",
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

/** Le niveau débutant est le seul programme finalisé et ouvert. */
export function beginnerCourse() {
  const niveau = NIVEAUX[0];
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
    provider: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Marssane",
      url: absoluteUrl("/"),
    },
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
