import { Hero } from "@/components/site/Hero";
import { JsonLd } from "@/components/site/JsonLd";
import { beginnerCourse, COURSE_ID, webPage } from "@/lib/structured-data";
import { Footer } from "@/components/site/Footer";
import { NiveauBloc } from "@/components/site/NiveauBloc";
import { NIVEAUX } from "@/lib/niveaux";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Formation IA à Lyon pour dirigeants : les niveaux | Marssane",
  description:
    "Débutez avec une formation IA de 7 h près de Lyon : Claude, prompts et automatisation métier. Découvrez aussi les niveaux confirmé et expert à venir.",
  path: "/formations",
});

export default function Formations() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { ...webPage({ path: "/formations", name: String(metadata.title), description: String(metadata.description) }), mainEntity: { "@id": COURSE_ID } },
        beginnerCourse(),
      ] }} />
      {/* La navigation est fixe sur /formations. Le défilement reste libre
          pour passer du hero aux trois niveaux sans saut forcé. */}
      <main className="pt-[108px] min-[480px]:pt-[90px] xl:pt-[106px]">
        <Hero />
        <NiveauBloc niveaux={NIVEAUX} />
      </main>
      <Footer />
    </>
  );
}
