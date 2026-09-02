import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Mentions légales · Marssane",
  description:
    "Consultez les mentions légales de Marssane : éditeur NCF Advisory, hébergeur du site, directeur de publication, contact et règles de propriété intellectuelle.",
  path: "/mentions-legales",
});

const SECTIONS: { titre: string; corps: ReactNode }[] = [
  {
    titre: "Éditeur",
    corps: (
      <>
        Le présent site est édité par NCF Advisory, société par actions
        simplifiée (SAS) au capital de 1 000 euros, dont le siège social est
        situé 3 Cité Rougemont, 75009 Paris. Société immatriculée au Registre du
        commerce et des sociétés de Paris sous le numéro 800 285 363 (SIRET
        800 285 363 00019). Marssane est une marque exploitée par NCF Advisory.
      </>
    ),
  },
  {
    titre: "Directeur de la publication",
    corps: <>Le représentant légal de NCF Advisory.</>,
  },
  {
    titre: "Hébergeur",
    corps: (
      <>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
        91789, États-Unis (vercel.com).
      </>
    ),
  },
  {
    titre: "Contact",
    corps: (
      <>
        Pour toute question relative au site ou à la formation :{" "}
        <a
          href="mailto:contact@marssane.fr"
          className="text-turquoise hover:text-white"
        >
          contact@marssane.fr
        </a>
        .
      </>
    ),
  },
  {
    titre: "Propriété intellectuelle",
    corps: (
      <>
        L&apos;ensemble des contenus du site (textes, visuels, logo Marssane)
        est protégé par le droit de la propriété intellectuelle et demeure la
        propriété de NCF Advisory, sauf mention contraire. Toute reproduction ou
        représentation, totale ou partielle, sans autorisation préalable est
        interdite.
      </>
    ),
  },
];

export default function MentionsLegales() {
  return (
    <>
      <main>
        <section className="mx-auto max-w-[1180px] px-6 pb-[80px] pt-[72px] sm:px-10">
          <Kicker className="text-faint-sur-ink!">Informations légales</Kicker>
          <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
            Mentions légales
          </h1>

          <div className="mt-10 flex max-w-[720px] flex-col gap-9">
            {SECTIONS.map((section) => (
              <div key={section.titre}>
                <h2 className="text-[18px] font-bold tracking-[-0.01em]">
                  {section.titre}
                </h2>
                <p className="mt-2 text-[15px] leading-[1.6] text-body-sur-ink">
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
