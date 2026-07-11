import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { Kicker } from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "Mentions légales — Marssane",
};

const SECTIONS = [
  { titre: "Éditeur" },
  { titre: "Hébergeur" },
  { titre: "Contact" },
];

export default function MentionsLegales() {
  return (
    <>
      <Nav />
      <main>
        <section className="mx-auto max-w-[1180px] px-10 pb-[80px] pt-[72px]">
          <Kicker>Informations légales</Kicker>
          <h1 className="mt-[14px] text-[38px] font-extrabold leading-[1.08] tracking-[-0.025em]">
            Mentions légales
          </h1>

          <div className="mt-10 flex max-w-[720px] flex-col gap-9">
            {SECTIONS.map((section) => (
              <div key={section.titre}>
                <h2 className="text-[18px] font-bold tracking-[-0.01em]">
                  {section.titre}
                </h2>
                <p className="mt-2 text-[15px] leading-[1.6] text-body">
                  À compléter — en attente des textes définitifs (CDC §10).
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
