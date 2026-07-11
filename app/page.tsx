import { CasConcrets } from "@/components/site/CasConcrets";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { PourFaireQuoi } from "@/components/site/PourFaireQuoi";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PourFaireQuoi />
        <CasConcrets />
        {/* Sections à venir (chacune centrée à max-w 1180, paddings maquette) :
            - T5 : Pour qui · #formation (La formation) · #implementation
            - T6 : #contact (CTA final) + footer */}
      </main>
    </>
  );
}
