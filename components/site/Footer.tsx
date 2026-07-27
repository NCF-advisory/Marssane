import Link from "next/link";
import { DrapeauFrance } from "@/components/ui/DrapeauFrance";
import { LogoMarssane } from "@/components/ui/LogoMarssane";

type FooterProps = {
  /** Tonalité, sur le même principe que la Nav : « encre » pour les pages à
   *  fond sombre (/quelle-ia). Contrairement à la Nav, le pied de page est
   *  monté par page : la tonalité est passée en prop, pas déduite de l'URL. */
  ton?: "clair" | "encre";
};

/**
 * Pied de page : bordure haute, fond blanc translucide (ou fond encre opaque en
 * tonalité « encre », pour prolonger sans jointure une page sombre). Lockup logo
 * (symbole 28 px + mot 15 px/700) suivi des liens légaux discrets, et drapeau
 * tonal « Conçu et opéré en France » à droite.
 */
export function Footer({ ton = "clair" }: FooterProps) {
  const encre = ton === "encre";

  return (
    <footer
      className={
        encre
          ? "relative border-t border-line-sur-ink bg-ink"
          : "relative border-t border-[rgba(16,24,40,0.08)] bg-white/55"
      }
    >
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-10 py-[30px]">
        {/* Le « M » du logo suit --color-ink : on le repasse en blanc localement,
            comme la Nav en tonalité encre. La surcharge est portée par le lockup
            et non par le <footer>, dont le fond `bg-ink` lit ce même token. */}
        <div
          className="flex items-center gap-2.5"
          style={encre ? ({ ["--color-ink" as string]: "#FFFFFF" }) : undefined}
        >
          <LogoMarssane size={28} />
          <span className={`text-[15px] font-bold ${encre ? "text-white" : ""}`}>Marssane</span>
          <span className={`text-[12.5px] ${encre ? "text-faint-sur-ink" : "text-slate"}`}>
            © 2026 ·{" "}
            <Link
              href="/mentions-legales"
              className={encre ? "hover:text-turquoise" : "hover:text-canard"}
            >
              Mentions légales
            </Link>{" "}
            ·{" "}
            <Link
              href="/confidentialite"
              className={encre ? "hover:text-turquoise" : "hover:text-canard"}
            >
              Confidentialité
            </Link>
          </span>
        </div>
        {/* La mention du drapeau est en `text-slate` (3,5:1 sur encre) : on la
            surcharge en tonalité encre. Les trois bandes restent lisibles
            telles quelles (canard 3,6:1, clay 4,8:1, gris clair). */}
        <DrapeauFrance className={encre ? "text-faint-sur-ink!" : undefined} />
      </div>
    </footer>
  );
}
