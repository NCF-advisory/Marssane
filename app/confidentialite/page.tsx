import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Politique de confidentialité · Marssane",
  description:
    "Consultez la politique de confidentialité de Marssane : données collectées, finalités, durée de conservation, sous-traitants et exercice de vos droits.",
  path: "/confidentialite",
});

const SECTIONS: { titre: string; corps: ReactNode }[] = [
  {
    titre: "Responsable du traitement",
    corps: (
      <>
        Le responsable du traitement de vos données est NCF Advisory (SAS), dont
        le siège social est situé 3 Cité Rougemont, 75009 Paris, qui exploite la
        marque Marssane. Pour toute question relative à vos données :{" "}
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
    titre: "Données collectées",
    corps: (
      <>
        Lors d&apos;une pré-inscription : prénom, nom, adresse email, téléphone,
        métier et, le cas échéant, entreprise. Via le formulaire de contact
        (« aller plus loin ») : nom, email, entreprise et message. Aucune donnée
        n&apos;est collectée à votre insu.
      </>
    ),
  },
  {
    titre: "Finalités et base légale",
    corps: (
      <>
        Vos données servent à gérer les pré-inscriptions aux sessions de
        formation (base légale : votre consentement) et à répondre aux demandes
        adressées via le formulaire de contact (base légale : notre intérêt
        légitime à traiter votre demande).
      </>
    ),
  },
  {
    titre: "Destinataires et sous-traitants",
    corps: (
      <>
        Vos données sont traitées par NCF Advisory. Elles ne sont ni vendues ni
        cédées à des tiers à des fins commerciales. Leur traitement s&apos;appuie
        sur des prestataires techniques agissant comme sous-traitants
        (hébergement du site, base de données située dans l&apos;Union
        européenne, envoi des emails de confirmation), tenus par contrat à la
        confidentialité. Certains de ces prestataires peuvent opérer hors de
        l&apos;Union européenne, dans le cadre des garanties contractuelles
        appropriées.
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
        Vous disposez d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement, d&apos;opposition et de portabilité de vos données,
        ainsi que du droit de retirer votre consentement à tout moment. Pour
        l&apos;exercer, écrivez-nous à{" "}
        <a
          href="mailto:contact@marssane.fr"
          className="text-turquoise hover:text-white"
        >
          contact@marssane.fr
        </a>
        . Vous pouvez également introduire une réclamation auprès de la CNIL
        (cnil.fr).
      </>
    ),
  },
  {
    titre: "Cookies",
    corps: (
      <>
        Ce site n&apos;utilise ni cookies tiers ni outil de mesure
        d&apos;audience.
      </>
    ),
  },
];

export default function Confidentialite() {
  return (
    <>
      <main>
        <section className="mx-auto max-w-[1180px] px-6 pb-[80px] pt-[72px] sm:px-10">
          <Kicker className="text-faint-sur-ink!">Vos données</Kicker>
          <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
            Politique de confidentialité
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
