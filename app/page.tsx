import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* Sections à venir (chacune centrée à max-w 1180, paddings maquette) :
            - T4 : #usages (Pour faire quoi) + les 3 cas d'usage
            - T5 : Pour qui · #formation (La formation) · #implementation
            - T6 : #contact (CTA final) + footer */}
      </main>
    </>
  );
}
