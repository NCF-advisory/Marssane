import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Hero } from "@/components/site/Hero";
import { JsonLd } from "@/components/site/JsonLd";
import {
  beginnerCourse,
  COURSE_ID,
  siteEntities,
  videoObject,
  webPage,
} from "@/lib/structured-data";
import { Footer } from "@/components/site/Footer";
import { NiveauBloc } from "@/components/site/NiveauBloc";
import { NIVEAUX } from "@/lib/niveaux";
import { createPublicMetadata } from "@/lib/seo";
import { heroVideo } from "@/lib/site-config";

export const metadata = createPublicMetadata({
  title: "Formation IA à Lyon pour dirigeants : les niveaux | Marssane",
  description:
    "Débutez avec une formation IA de 7 h près de Lyon : Claude, prompts et automatisation métier. Découvrez aussi les niveaux confirmé et expert à venir.",
  path: "/formations",
});

export default function Formations() {
  // Vidéo du héro : balisée seulement si la page en affiche une (cf. heroVideo).
  const video = heroVideo && videoObject({
    path: "/formations",
    name: "Le temps gagné grâce à l’IA, en trois cas concrets",
    description:
      "Animation du héro : trois cas d’usage de l’IA au quotidien d’un dirigeant et la barre de progression du temps gagné. Sans parole ni son.",
    contentUrl: heroVideo.mp4,
    thumbnailUrl: heroVideo.poster,
    uploadDate: "2026-07-28",
    duration: "PT21S",
  });
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        ...siteEntities,
        {
          ...webPage({ path: "/formations", name: String(metadata.title), description: String(metadata.description) }),
          mainEntity: { "@id": COURSE_ID },
          ...(video ? { video: { "@id": video["@id"] } } : {}),
        },
        beginnerCourse(),
        ...(video ? [video] : []),
      ] }} />
      {/* La navigation est fixe sur /formations. Le défilement reste libre
          pour passer du hero aux trois niveaux sans saut forcé. */}
      <main className="pt-[108px] min-[480px]:pt-[90px] xl:pt-[106px]">
        <Breadcrumbs items={[{ name: "Formations IA", path: "/formations" }]} />
        <Hero />
        <NiveauBloc niveaux={NIVEAUX} />
      </main>
      <Footer />
    </>
  );
}
