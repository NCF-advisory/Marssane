"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { ReservationTrigger } from "./ReservationTrigger";

// « Les formations » et « implémenter l'IA » pointent vers leurs pages dédiées.
const links = [
  { href: "/formations", label: "Les formations" },
  { href: "/quelle-ia", label: "Quelle IA choisir ?" },
  { href: "/implementation", label: "Je veux implémenter l'IA" },
];

/** Pages du site vitrine qui portent la barre. Liste explicite (et non une
 *  exclusion des espaces /admin, /formation, /styleguide et de la 404) : la nav
 *  est montée dans le layout racine, donc partagée par toutes les routes. */
const PAGES_SITE = [
  "/",
  "/quelle-ia",
  "/formations",
  "/implementation",
  "/confidentialite",
  "/mentions-legales",
  "/merci",
];

/** Pages à héro sombre : la barre passe en tonalité encre. */
const PAGES_ENCRE = ["/quelle-ia"];

/** Pages où la barre doit sortir du flux (`fixed` plutôt que `sticky`) :
 *  /formations, car WebKit gère mal `sticky` + scroll-snap racine. */
const PAGES_FIXED = ["/formations"];

/** Transition de tonalité, partagée par tout ce qui change de couleur.
 *  Même durée / courbe que celle du lockup (voir LogoMarssane). */
const TRANSITION_TON =
  "transition-colors duration-[160ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none";

/**
 * Barre de navigation du site. Lockup logo (lien vers l'accueil) + liens
 * d'ancrage + CTA secondaire « Réserver ma place ».
 *
 * Montée une seule fois dans `app/layout.tsx` : le nœud DOM survit aux
 * changements de route, ce qui permet d'animer le passage d'une tonalité à
 * l'autre. L'URL (`usePathname`) est donc la source unique de vérité pour ses
 * deux axes — la tonalité (clair / encre) et le positionnement (sticky / fixed).
 *
 * Responsive minimal (pas de menu burger) : sous ~1024px le groupe de liens
 * se replie sous le logo et ses éléments s'enroulent proprement.
 */
export function Nav() {
  const pathname = usePathname();
  if (!PAGES_SITE.includes(pathname)) return null;

  const encre = PAGES_ENCRE.includes(pathname);
  const fixed = PAGES_FIXED.includes(pathname);

  return (
    <div
      className={[
        fixed ? "fixed inset-x-0 top-0" : "sticky top-0",
        "z-50",
        // Le flou reste déclaré dans les deux tonalités : en encre le fond est
        // opaque, il n'a donc aucun effet visible, mais le garder évite de
        // basculer `backdrop-filter` en cours de transition (ce qui produirait
        // une rupture au lieu d'un dégradé).
        "backdrop-blur-md",
        // Encre : fond opaque, sinon le fond de page clair remonte au travers et
        // crée une rupture visible à la jointure avec le héro. Clair : voile
        // translucide flouté, comme partout ailleurs.
        encre ? "bg-ink" : "bg-toile/80",
        TRANSITION_TON,
        // Élément persistant du fondu croisé de page : nommée, la barre est
        // sortie de l'instantané de la vue et n'est donc pas happée par le
        // fondu — sa propre transition de tonalité (160 ms) reste visible.
        // Le nom est neutralisé côté CSS (voir globals.css).
        "[view-transition-name:nav-marssane]",
      ].join(" ")}
    >
    <header className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-10 pt-[26px]">
      <Link
        href="/"
        aria-label="Marssane · retour à l'accueil"
        className={`inline-flex rounded-btn focus-visible:outline-2 focus-visible:outline-offset-4 ${
          // Le canard manque de contraste sur l'encre : anneau turquoise en tonalité encre.
          encre ? "focus-visible:outline-turquoise" : "focus-visible:outline-canard"
        }`}
        // Le « M » du logo suit --color-ink : on le repasse en blanc localement.
        style={encre ? ({ ["--color-ink" as string]: "#FFFFFF" }) : undefined}
      >
        <LogoMarssane size={34} withWordmark />
      </Link>
      <nav
        aria-label="Navigation principale"
        className="flex flex-wrap items-center gap-x-7 gap-y-3"
      >
        {/* `Link` et non `<a>` : la navigation doit rester côté client, sinon le
            document est rechargé, la nav remontée, et la transition de tonalité
            n'a pas lieu. */}
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-[14.5px] font-semibold ${TRANSITION_TON} ${
              encre ? "text-white/70 hover:text-white" : "text-body hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <ReservationTrigger
          className={
            encre
              ? `rounded-btn border-[1.5px] border-white/60 px-5 py-2.5 text-[14.5px] font-semibold text-white hover:border-white hover:bg-white hover:text-ink ${TRANSITION_TON}`
              : `rounded-btn border-[1.5px] border-outline bg-surface px-5 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-toile ${TRANSITION_TON}`
          }
        >
          Réserver ma place
        </ReservationTrigger>
      </nav>
    </header>
    </div>
  );
}
