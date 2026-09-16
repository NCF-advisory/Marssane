import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Hiérarchie destinée aux moteurs de recherche, sans fil d'Ariane visible. */
export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const trail = [{ name: "Accueil", path: "/" }, ...items];
  return (
    <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
    }} />
  );
}
