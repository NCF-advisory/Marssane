import Link from "next/link";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { ReservationTrigger } from "./ReservationTrigger";

// « Les formations » et « implémenter l'IA » pointent vers leurs pages dédiées.
const links = [
  { href: "/formations", label: "Les formations" },
  { href: "/implementation", label: "Je veux implémenter l'IA" },
];

/**
 * Barre de navigation du héro. Lockup logo (lien vers l'accueil) + liens
 * d'ancrage + CTA secondaire « Réserver ma place ».
 *
 * Responsive minimal (pas de menu burger) : sous ~1024px le groupe de liens
 * se replie sous le logo et ses éléments s'enroulent proprement.
 */
export function Nav() {
  return (
    <header className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-10 pt-[26px]">
      <Link
        href="/"
        aria-label="Marssane · retour à l'accueil"
        className="inline-flex rounded-btn focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canard"
      >
        <LogoMarssane size={34} withWordmark />
      </Link>
      <nav
        aria-label="Navigation principale"
        className="flex flex-wrap items-center gap-x-7 gap-y-3"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[14.5px] font-semibold text-body hover:text-ink"
          >
            {link.label}
          </a>
        ))}
        <ReservationTrigger className="rounded-btn border-[1.5px] border-outline bg-surface px-5 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-toile">
          Réserver ma place
        </ReservationTrigger>
      </nav>
    </header>
  );
}
