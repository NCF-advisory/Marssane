import { ContactForm } from "@/components/site/ContactForm";
import { Footer } from "@/components/site/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = {
  ...createPublicMetadata({
    title: "Implémenter l'IA · Marssane",
    description:
      "Décrivez votre projet d'implémentation de l'IA dans votre entreprise : nous revenons vers vous prochainement.",
    path: "/implementation",
  }),
  // Page masquée (hors nav et hors sitemap) en attendant le lancement de
  // l'offre : accessible par lien direct, mais exclue des moteurs.
  robots: { index: false, follow: false },
};

export default function Implementation() {
  return (
    <>
      <main>
        <section className="mx-auto max-w-[1180px] px-6 pb-[80px] pt-[72px] sm:px-10">
          <Kicker className="text-faint-sur-ink!">Aller plus loin · implémentation</Kicker>
          <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
            Parlez-nous de votre projet
          </h1>
          <p className="mt-[14px] max-w-[560px] text-[16.5px] leading-[1.58] text-body-sur-ink">
            Décrivez votre besoin en quelques lignes : nous revenons vers vous
            prochainement.
          </p>

          {/* `p-5` en mobile : imbriqué dans la gouttière de section, un `p-8`
              ne laissait que 174 px de champ utile à 320 px. */}
          <div className="mt-10 max-w-[720px] rounded-card border border-line-sur-ink bg-surface-sur-ink p-5 sm:p-10">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
