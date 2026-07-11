import { AllerPlusLoin } from "@/components/site/AllerPlusLoin";
import { CasConcrets } from "@/components/site/CasConcrets";
import { Footer } from "@/components/site/Footer";
import { Formation } from "@/components/site/Formation";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { PourFaireQuoi } from "@/components/site/PourFaireQuoi";
import { PourQui } from "@/components/site/PourQui";
import { Reservation } from "@/components/site/Reservation";

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
        <AllerPlusLoin />
        <Reservation />
      </main>
      <Footer />
    </>
  );
}
