import type { ReactNode } from "react";
import { Accompagnement } from "@/components/site/Accompagnement";
import { Alignement } from "@/components/site/Alignement";
import { Apparitions } from "@/components/site/Apparitions";
import { AvantApres } from "@/components/site/AvantApres";
import { BandeauChiffres } from "@/components/site/BandeauChiffres";
import { CasConcrets } from "@/components/site/CasConcrets";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { Formateur } from "@/components/site/Formateur";
import { FormationsDeuxNiveaux } from "@/components/site/FormationsDeuxNiveaux";
import { Hero } from "@/components/site/Hero";
import { ParolesDirigeants } from "@/components/site/ParolesDirigeants";
import { Reservation } from "@/components/site/Reservation";
import { createPublicMetadata, HOME_DESCRIPTION } from "@/lib/seo";

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
          restent en encre ; les bandes claires tombent sur l'accompagnement,
          sur l'avant-après, et sur la FAQ. Coupes franches, sans filet de
          séparation — comme sur le modèle. */}
      <main>
        <Hero />
        <ParolesDirigeants />
        <BandeauChiffres />
        <BandeToile className="mt-[68px] pb-[76px]">
          <Accompagnement />
        </BandeToile>
        <Formateur />
        <CasConcrets />
        <BandeToile className="mt-[68px] pb-[76px]">
          <AvantApres />
        </BandeToile>
        <Alignement />
        <FormationsDeuxNiveaux />
        <Reservation />
        {/* La réservation referme déjà sur 90 px d'encre : la bande n'a pas
            besoin de marge haute, seulement de rendre à la FAQ (talon de 8 px)
            la respiration que les autres sections tiennent de leur `pt`. */}
        <BandeToile className="pt-[76px]">
          <Faq />
        </BandeToile>
      </main>
      <Footer />
      <Apparitions />
    </>
  );
}

export const metadata = createPublicMetadata({
  title: "Marssane · Formation IA",
  description: HOME_DESCRIPTION,
  path: "/",
});
