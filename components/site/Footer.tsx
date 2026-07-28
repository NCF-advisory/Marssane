import Link from "next/link";
import { DrapeauFrance } from "@/components/ui/DrapeauFrance";
import { LogoMarssane } from "@/components/ui/LogoMarssane";

/**
 * Pied de page du site vitrine : bordure haute et fond encre, qui prolonge sans
 * jointure la page au-dessus. Lockup logo (symbole 28 px + mot 15 px/700) suivi
 * des liens légaux discrets, et drapeau tonal « Conçu et opéré en France » à
 * droite.
 *
 * Une seule tonalité : toutes les pages qui montent ce pied de page sont en
 * encre (les espaces protégés /formation et /admin ont leur propre gabarit).
 */
export function Footer() {
  return (
    <footer className="relative border-t border-line-sur-ink bg-ink">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 py-[30px] sm:px-10">
        {/* Le « M » du logo suit --color-ink : on le repasse en blanc localement,
            comme la Nav. La surcharge est portée par le lockup et non par le
            pied de page, dont le fond `bg-ink` lit ce même token. */}
        {/* `flex-wrap` : à 320 px le lockup et la ligne légale ne tiennent pas
            côte à côte, la mention passe donc sous le logo au lieu d'écraser
            les deux. */}
        <div
          className="flex flex-wrap items-center gap-2.5"
          style={{ ["--color-ink" as string]: "#FFFFFF" }}
        >
          <LogoMarssane size={28} />
          <span className="text-[15px] font-bold">Marssane</span>
          {/* `py-3` sur les liens (et non sur la ligne) : sur un élément inline
              le padding vertical agrandit la zone cliquable — 45 px de cible —
              sans toucher à la hauteur de la ligne, donc au pied de page. */}
          <span className="text-[12.5px] text-faint-sur-ink">
            © 2026 ·{" "}
            <Link href="/mentions-legales" className="py-3 hover:text-turquoise">
              Mentions légales
            </Link>{" "}
            ·{" "}
            <Link href="/confidentialite" className="py-3 hover:text-turquoise">
              Confidentialité
            </Link>
          </span>
        </div>
        {/* La mention du drapeau est en `text-slate` (3,5:1 sur encre) : on la
            surcharge. Les trois bandes restent lisibles telles quelles
            (canard 3,6:1, clay 4,8:1, gris clair). */}
        <DrapeauFrance className="text-faint-sur-ink!" />
      </div>
    </footer>
  );
}
