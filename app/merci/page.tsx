import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { Kicker } from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "Merci — Marssane",
};

export default function Merci() {
  return (
    <>
      <Nav />
      <main>
        <section className="mx-auto max-w-[1180px] px-10 pb-[80px] pt-[72px]">
          <div className="max-w-[560px]">
            <Kicker>Pré-inscription</Kicker>
            <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
              Votre pré-inscription est bien enregistrée.
            </h1>
            <p className="mt-[18px] text-[16.5px] leading-[1.58] text-body">
              Vous recevrez un email de confirmation avec les prérequis de la
              journée (abonnement Claude Pro, ordinateur portable, point DSI si
              votre poste est géré).
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-canard hover:text-canard-dark"
            >
              <span aria-hidden className="text-[1.1em] leading-none">
                ←
              </span>
              Retour à l&apos;accueil
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
