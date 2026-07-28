import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Kicker } from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "Page introuvable · Marssane",
};

/** Page 404 — même gabarit que /merci : texte à gauche, visuel à droite. */
export default function NotFound() {
  return (
    <>
      <main>
        <section className="mx-auto max-w-[1180px] px-6 pb-[80px] pt-[72px] sm:px-10">
          <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
            <div className="max-w-[560px]">
              <Kicker className="text-faint-sur-ink!">Erreur 404</Kicker>
              <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
                Cette page n&apos;existe pas.
              </h1>
              <p className="mt-[18px] text-[16.5px] leading-[1.58] text-body-sur-ink">
                L&apos;adresse a peut-être changé, ou contient une coquille.
                Rien de grave — tout le reste est à sa place.
              </p>
              <Link
                href="/"
                className="mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-turquoise hover:text-white"
              >
                <span aria-hidden className="text-[1.1em] leading-none">
                  ←
                </span>
                Retour à l&apos;accueil
              </Link>
            </div>

            {/* Visuel décoratif : le titre dit déjà l'erreur, d'où alt vide. */}
            <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:justify-self-end">
              <Image
                src="/img/croix-erreur.webp"
                alt=""
                width={1200}
                height={960}
                priority
                sizes="(min-width: 1024px) 520px, 100vw"
                className="aspect-[5/4] w-full rounded-card object-cover shadow-hero"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
