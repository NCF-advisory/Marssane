"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Chevron } from "@/components/ui/Chevron";
import { Kicker } from "@/components/ui/Kicker";

/**
 * Page d'erreur technique (convention Next : client component avec
 * { error, reset }) — même gabarit que /merci et la 404. Le bouton
 * « Réessayer » reprend le style du CTA primaire (Button variant primary),
 * recopié ici car Button ne prend pas de onClick.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log de l'erreur en console (pattern Next standard).
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <main>
        {/* `pt` mobile aligné sur la hauteur de la barre (~75 px) : si l'erreur
            survient sous /formations, la nav y est hors flux et recouvrirait le
            kicker. Le palier lg garde le talon d'origine. */}
        <section className="mx-auto max-w-[1180px] px-6 pb-[80px] pt-[92px] sm:px-10 lg:pt-[72px]">
          <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
            <div className="max-w-[560px]">
              <Kicker className="text-faint-sur-ink!">Erreur technique</Kicker>
              <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
                Quelque chose s&apos;est mal passé.
              </h1>
              <p className="mt-[18px] text-[16.5px] leading-[1.58] text-body-sur-ink">
                Ce n&apos;est pas vous, c&apos;est nous. Réessayez — et si ça
                persiste, revenez dans quelques minutes.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-[13px] rounded-btn bg-canard py-[15px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-white shadow-cta transition-[background-color] duration-[180ms] ease-out hover:bg-canard-dark"
                >
                  Réessayer
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5 text-[15px] font-semibold text-turquoise hover:text-white"
                >
                  <Chevron direction="left" />
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>

            {/* Visuel décoratif : le titre dit déjà l'erreur, d'où alt vide. */}
            <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:justify-self-end">
              <Image
                src="/img/croix-erreur.webp"
                alt=""
                width={1200}
                height={960}
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
