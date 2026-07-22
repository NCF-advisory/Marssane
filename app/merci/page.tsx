import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { Kicker } from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "Merci · Marssane",
};

/** Contenu de la page selon le statut renvoyé par la server action (F2). */
const CONTENUS = {
  confirme: {
    titre: "Votre pré-inscription est bien enregistrée.",
    texte:
      "Vous recevrez un email de confirmation avec les prérequis de la formation : un ordinateur portable avec l'application Claude installée, un abonnement Claude Pro (20 €/mois), l'accès à votre messagerie et, si votre poste est géré, un point avec votre DSI.",
  },
  attente: {
    titre: "Vous êtes sur liste d'attente.",
    texte:
      "Nous vous recontactons dès qu'une place ou une session se libère.",
  },
  defaut: {
    titre: "Votre pré-inscription est bien enregistrée.",
    texte:
      "Vous recevrez un email de confirmation avec les prérequis de la formation (ordinateur portable avec l'application Claude, abonnement Claude Pro, accès à votre messagerie, point DSI si votre poste est géré).",
  },
} as const;

export default async function Merci({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut } = await searchParams;
  const contenu =
    statut === "confirme"
      ? CONTENUS.confirme
      : statut === "attente"
        ? CONTENUS.attente
        : CONTENUS.defaut;

  return (
    <>
      <Nav />
      <main>
        <section className="mx-auto max-w-[1180px] px-10 pb-[80px] pt-[72px]">
          <div className="max-w-[560px]">
            <Kicker>Pré-inscription</Kicker>
            <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
              {contenu.titre}
            </h1>
            <p className="mt-[18px] text-[16.5px] leading-[1.58] text-body">
              {contenu.texte}
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
