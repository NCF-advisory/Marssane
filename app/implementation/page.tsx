import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { Kicker } from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "Implémenter l'IA · Marssane",
  description:
    "Décrivez votre projet d'implémentation de l'IA dans votre entreprise : nous revenons vers vous sous 48 h.",
};

export default function Implementation() {
  return (
    <>
      <Nav />
      <main>
        <section className="mx-auto max-w-[1180px] px-10 pb-[80px] pt-[72px]">
          <Kicker>Aller plus loin · implémentation</Kicker>
          <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
            Parlez-nous de votre projet
          </h1>
          <p className="mt-[14px] max-w-[560px] text-[16.5px] leading-[1.58] text-body">
            Décrivez votre besoin en quelques lignes : nous revenons vers vous
            sous 48&nbsp;h.
          </p>

          <div className="mt-10 max-w-[720px] rounded-card border border-hairline bg-surface p-8 shadow-card sm:p-10">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
