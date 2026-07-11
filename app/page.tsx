import { CasConcrets } from "@/components/site/CasConcrets";
import { Formation } from "@/components/site/Formation";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { PourFaireQuoi } from "@/components/site/PourFaireQuoi";
import { PourQui } from "@/components/site/PourQui";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PourFaireQuoi />
        <CasConcrets />
        <PourQui />
        <Formation />
        {/* Sections à venir (chacune centrée à max-w 1180, paddings maquette) :
            - T5 : #implementation (Aller plus loin)
            - T6 : #contact (CTA final) + footer */}
      </main>
    </>
  );
}
