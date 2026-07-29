"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Chevron } from "@/components/ui/Chevron";
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

/** Pages où la barre doit sortir du flux (`fixed` plutôt que `sticky`) :
 *  /formations, car WebKit gère mal `sticky` + scroll-snap racine. */
const PAGES_FIXED = ["/formations"];

/** id du panneau replié — cible de l'`aria-controls` du bouton menu. */
const ID_PANNEAU = "nav-menu-mobile";

/**
 * Barre de navigation du site. Lockup logo (lien vers l'accueil) + liens
 * d'ancrage + CTA secondaire « Réserver ma place ».
 *
 * Montée une seule fois dans `app/layout.tsx` : le nœud DOM survit aux
 * changements de route. Tout le site vitrine est en tonalité encre, la barre
 * l'est donc aussi partout ; l'URL (`usePathname`) ne décide plus que de son
 * positionnement (sticky / fixed).
 *
 * Responsive : sous `lg`, la barre tient sur une seule rangée (logo + bouton
 * menu) et les liens passent dans un panneau qui se déplie juste dessous — sans
 * quoi ils s'enroulaient sur quatre rangées et la barre mangeait un tiers de
 * l'écran d'un téléphone. À partir de `lg`, tout revient dans la rangée.
 */
export function Nav() {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const barreRef = useRef<HTMLDivElement>(null);

  // Fermeture au clavier (Escape) et au clic hors de la barre. Les écouteurs ne
  // sont posés que panneau ouvert : rien ne tourne à l'état de repos.
  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    const surPointeur = (e: PointerEvent) => {
      if (!barreRef.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener("keydown", surTouche);
    document.addEventListener("pointerdown", surPointeur);
    return () => {
      document.removeEventListener("keydown", surTouche);
      document.removeEventListener("pointerdown", surPointeur);
    };
  }, [ouvert]);

  if (!PAGES_SITE.includes(pathname)) return null;

  const fixed = PAGES_FIXED.includes(pathname);
  const fermer = () => setOuvert(false);

  return (
    <div
      ref={barreRef}
      className={[
        fixed ? "fixed inset-x-0 top-0" : "sticky top-0",
        "z-50",
        // Fond opaque : le contenu de la page ne doit pas remonter au travers de
        // la barre quand il défile dessous.
        "bg-ink",
        // Élément persistant du fondu croisé de page : nommée, la barre est
        // sortie de l'instantané de la vue et n'est donc pas happée par le
        // fondu — elle reste parfaitement stable d'une page à l'autre.
        // Le nom est neutralisé côté CSS (voir globals.css).
        "[view-transition-name:nav-marssane]",
      ].join(" ")}
    >
    {/* Le `pb` mobile ferme la rangée sous le logo (le panneau se déplie en
        dessous, hors flux) ; à partir de lg on revient au seul `pt-[26px]`
        d'origine, le contenu de la barre refermant lui-même la bande. */}
    <header className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 pb-[14px] pt-[16px] sm:px-10 lg:pb-0 lg:pt-[26px]">
      <Link
        href="/"
        aria-label="Marssane · retour à l'accueil"
        // Le canard manque de contraste sur l'encre : anneau turquoise.
        className="inline-flex rounded-btn focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquoise"
        // Le « M » du logo suit --color-ink : on le repasse en blanc localement.
        style={{ ["--color-ink" as string]: "#FFFFFF" }}
      >
        <LogoMarssane size={34} withWordmark />
      </Link>

      {/* Bouton menu — sous lg seulement. Cadre et graisse du CTA de la barre :
          trois traits sobres + le mot, pour rester dans la typographie du site.
          `min-h-11` garantit les 44 px de cible tactile. */}
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls={ID_PANNEAU}
        onClick={() => setOuvert((o) => !o)}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-btn border-[1.5px] border-white/60 px-4 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:border-white lg:hidden"
      >
        <span aria-hidden className="flex flex-col gap-[4px]">
          <span className="block h-[1.5px] w-[17px] bg-current" />
          <span className="block h-[1.5px] w-[17px] bg-current" />
          <span className="block h-[1.5px] w-[17px] bg-current" />
        </span>
        Menu
      </button>

      <nav
        id={ID_PANNEAU}
        aria-label="Navigation principale"
        className={[
          // Sous lg : panneau replié sous la barre (hors flux, il ne pousse donc
          // pas le contenu de la page), liens en colonne pleine largeur.
          ouvert ? "flex" : "hidden lg:flex",
          "absolute inset-x-0 top-full flex-col items-stretch gap-y-1 border-y border-line-sur-ink bg-ink px-6 pb-5 pt-2 sm:px-10",
          // À partir de lg : retour dans la rangée, à l'identique de l'origine.
          "lg:static lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-7 lg:gap-y-3 lg:border-0 lg:bg-transparent lg:p-0",
        ].join(" ")}
      >
        {/* `Link` et non `<a>` : la navigation doit rester côté client, sinon le
            document est rechargé, la nav remontée, et la transition de tonalité
            n'a pas lieu. */}
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={fermer}
            // `py-3` sous lg : 45 px de cible tactile (le `lg:py-0` rend la
            // rangée desktop identique à l'origine).
            className="py-3 text-[14.5px] font-semibold text-white/70 transition-colors hover:text-white motion-reduce:transition-none lg:py-0"
          >
            {link.label}
          </Link>
        ))}
        <ReservationTrigger
          onClick={fermer}
          // `min-h-11` : 44 px de cible dans le panneau, neutralisé en desktop
          // où le bouton doit rester exactement celui d'origine.
          className="mt-2 flex min-h-11 items-center justify-center gap-[13px] rounded-btn border-[1.5px] border-white/60 px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-ink motion-reduce:transition-none lg:mt-0 lg:min-h-0"
        >
          Réserver ma place
          <Chevron />
        </ReservationTrigger>
      </nav>
    </header>
    </div>
  );
}
