import type { ReactNode } from "react";
import { JsonLd } from "@/components/site/JsonLd";
import { IMPLEMENTATION_FAQ } from "@/lib/implementation-faq";
import { siteEntities, webPage } from "@/lib/structured-data";
import { MethodeImplementation } from "@/components/site/MethodeImplementation";
import { AlignementImplementation } from "@/components/site/AlignementImplementation";
import { Apparitions } from "@/components/site/Apparitions";
import { AvantApresImplementation } from "@/components/site/AvantApresImplementation";
import { ChiffresImplementation } from "@/components/site/ChiffresImplementation";
import { CasAutomatisations } from "@/components/site/CasAutomatisations";
import { FaqImplementation } from "@/components/site/FaqImplementation";
import { Footer } from "@/components/site/Footer";
import { Formateur } from "@/components/site/Formateur";
import { OffresDeuxVoies } from "@/components/site/OffresDeuxVoies";
import { HeroAgents } from "@/components/site/HeroAgents";
import { ParolesDirigeants } from "@/components/site/ParolesDirigeants";
import { PartenaireNovances } from "@/components/site/PartenaireNovances";
import { ContactFinal } from "@/components/site/ContactFinal";
import { createPublicMetadata, HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo";

/**
 * Bande de tonalité claire : conteneur pleine largeur qui repose la toile sous
 * une ou plusieurs sections (cf. `.sur-toile` dans globals.css, qui remappe les
 * tokens `-sur-ink`). Les sections gardent leur gabarit `max-w-[1180px]`.
 *
 * Le calage vertical est passé en `className` parce qu'il dépend de la section
 * qui précède : les sections de la landing ne portent qu'un talon de 8 px en
 * bas, tout le rythme étant tenu par le `pt` de la suivante. Un changement de
 * tonalité, lui, coupe à la limite exacte de la bande : il faut donc redonner
 * de l'air des deux côtés (`mt` côté encre, `pb` côté toile) pour retrouver les
 * ~160 px que le modèle laisse entre deux sections.
 */
function BandeToile({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`sur-toile ${className}`}>{children}</div>;
}

export default function Home() {
  return (
    <>
      {/* Ordre des sections et alternance de tonalités repris du tunnel 8lab
          (relevé au navigateur le 29/07/2026). Héro et paroles de dirigeants
          restent en encre ; les bandes claires tombent sur la méthode,
          sur l'avant-après, et sur la FAQ. Coupes franches, sans filet de
          séparation — comme sur le modèle. */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          ...siteEntities,
          {
            ...webPage({ path: "/", name: HOME_TITLE, description: HOME_DESCRIPTION }),
            "@type": ["WebPage", "FAQPage"],
            mainEntity: IMPLEMENTATION_FAQ.map(({ question, reponse }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: reponse },
            })),
          },
        ],
      }} />
      <main>
        <HeroAgents />
        <PartenaireNovances />
        <ParolesDirigeants />
        <ChiffresImplementation />
        <BandeToile className="mt-[68px] pb-[76px]">
          <MethodeImplementation />
        </BandeToile>
        <Formateur
          kicker="Qui vous accompagne"
          titre={
            <>
              Un interlocuteur qui pratique l&apos;IA{" "}
              <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
                au quotidien
              </span>
              .
            </>
          }
        />
        <CasAutomatisations />
        <BandeToile className="mt-[68px] pb-[76px]">
          <AvantApresImplementation />
        </BandeToile>
        <AlignementImplementation />
        <OffresDeuxVoies />
        <ContactFinal />
        {/* Le contact referme déjà sur 90 px d'encre : la bande n'a pas
            besoin de marge haute, seulement de rendre à la FAQ (talon de 8 px)
            la respiration que les autres sections tiennent de leur `pt`. */}
        <BandeToile className="pt-[76px]">
          <FaqImplementation />
        </BandeToile>
      </main>
      <Footer />
      <Apparitions />
    </>
  );
}

export const metadata = createPublicMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
});
