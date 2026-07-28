"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
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
        <section className="mx-auto max-w-[1180px] px-10 pb-[80px] pt-[72px]">
          <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
            <div className="max-w-[560px]">
              <Kicker>Erreur technique</Kicker>
              <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
                Quelque chose s&apos;est mal passé.
              </h1>
              <p className="mt-[18px] text-[16.5px] leading-[1.58] text-body">
                Ce n&apos;est pas vous, c&apos;est nous. Réessayez — et si ça
                persiste, revenez dans quelques minutes.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2.5 rounded-btn bg-canard px-[27px] py-[15px] text-base font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark"
                >
                  Réessayer
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-canard hover:text-canard-dark"
                >
                  <span aria-hidden className="text-[1.1em] leading-none">
                    ←
                  </span>
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
