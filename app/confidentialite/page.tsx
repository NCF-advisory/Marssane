import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { Kicker } from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "Politique de confidentialité · Marssane",
};

const SECTIONS: { titre: string; corps: ReactNode }[] = [
  {
    titre: "Finalités",
    corps: (
      <>
        Vos données sont collectées pour deux finalités : la gestion des
        pré-inscriptions aux sessions de formation et la réponse aux demandes
        adressées via le formulaire de contact.
      </>
    ),
  },
  {
    titre: "Durée de conservation",
    corps: (
      <>
        Vos données sont conservées trois ans après le dernier contact, puis
        purgées.
      </>
    ),
  },
  {
    titre: "Vos droits",
    corps: (
      <>
        Vous disposez d&apos;un droit d&apos;accès à vos données et d&apos;un
        droit d&apos;effacement. Pour l&apos;exercer, écrivez-nous : vos données
        seront supprimées.
      </>
    ),
  },
  {
    titre: "Cookies",
    corps: (
      <>Ce site n&apos;utilise ni cookies tiers ni outil de mesure d&apos;audience.</>
    ),
  },
];

export default function Confidentialite() {
  return (
    <>
      <Nav />
      <main>
        <section className="mx-auto max-w-[1180px] px-10 pb-[80px] pt-[72px]">
          <Kicker>Vos données</Kicker>
          <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
            Politique de confidentialité
          </h1>

          <div className="mt-10 flex max-w-[720px] flex-col gap-9">
            {SECTIONS.map((section) => (
              <div key={section.titre}>
                <h2 className="text-[18px] font-bold tracking-[-0.01em]">
                  {section.titre}
                </h2>
                <p className="mt-2 text-[15px] leading-[1.6] text-body">
                  {section.corps}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
