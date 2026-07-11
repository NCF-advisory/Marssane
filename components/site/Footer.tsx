import Link from "next/link";
import { DrapeauFrance } from "@/components/ui/DrapeauFrance";
import { LogoMarssane } from "@/components/ui/LogoMarssane";

/**
 * Pied de page : bordure haute, fond blanc translucide. Lockup logo (symbole
 * 28 px + mot 15 px/700) suivi des liens légaux discrets, et drapeau tonal
 * « Conçu et opéré en France » à droite.
 */
export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(16,24,40,0.08)] bg-white/55">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-10 py-[30px]">
        <div className="flex items-center gap-2.5">
          <LogoMarssane size={28} />
          <span className="text-[15px] font-bold">Marssane</span>
          <span className="text-[12.5px] text-faint">
            © 2026 ·{" "}
            <Link href="/mentions-legales" className="hover:text-canard">
              Mentions légales
            </Link>{" "}
            ·{" "}
            <Link href="/confidentialite" className="hover:text-canard">
              Confidentialité
            </Link>
          </span>
        </div>
        <DrapeauFrance />
      </div>
    </footer>
  );
}
