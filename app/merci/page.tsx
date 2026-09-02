import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Chevron } from "@/components/ui/Chevron";
import { CocheValidation } from "@/components/ui/CocheValidation";
import { Kicker } from "@/components/ui/Kicker";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPublicMetadata({
    title: "Merci · Marssane",
    description: "Votre pré-inscription à la formation Marssane est bien enregistrée.",
    path: "/merci",
  }),
  robots: { index: false, follow: false },
};

/**
 * Page de fin de pré-inscription (F2). Un seul contenu, quel que soit le statut
 * réel enregistré (`confirme` ou `attente`) : côté public, une pré-inscription
 * est toujours enregistrée, le tri se fait dans l'admin.
 */
export default function Merci() {
  return (
    <>
      <main>
        <section className="mx-auto max-w-[1180px] px-6 pb-[80px] pt-[72px] sm:px-10">
          <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
            <div className="max-w-[560px]">
              <Kicker className="text-faint-sur-ink!">Pré-inscription</Kicker>
              <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
                Votre pré-inscription est bien enregistrée.
              </h1>
              <p className="mt-[18px] text-[16.5px] leading-[1.58] text-body-sur-ink">
                Vous recevrez un email de confirmation avec les prérequis de la
                formation : un ordinateur portable avec l&apos;application
                Claude installée et un abonnement Claude Pro (20 €/mois).
              </p>
              <Link
                href="/"
                className="mt-7 inline-flex items-center gap-2.5 text-[15px] font-semibold text-turquoise hover:text-white"
              >
                <Chevron direction="left" />
                Retour à l&apos;accueil
              </Link>
            </div>

            {/* Visuel de confirmation : une coche turquoise qui se trace à
                l'apparition (cercle, puis coche, puis léger « pop » — animation
                CSS dans globals.css). Décoratif : le titre dit déjà la
                confirmation. En desktop, la marge droite la recentre sur la
                zone qu'occupait le visuel précédent. */}
            <div className="flex justify-center lg:justify-end">
              <CocheValidation className="h-[180px] w-[180px] text-turquoise sm:h-[220px] sm:w-[220px] lg:mr-[130px] lg:h-[260px] lg:w-[260px]" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
