"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { RendezVousTrigger } from "./RendezVousTrigger";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import styles from "./Nav.module.css";

// Les expertises et les formations possèdent chacune leur page dédiée.
const links = [
  { href: "/implementation", label: "Implémentation IA" },
  { href: "/automatisation", label: "Automatisation" },
  { href: "/formations", label: "Les formations" },
  { href: "/quelle-ia", label: "Quelle IA choisir ?" },
];

/** Pages du site vitrine qui portent la barre. Liste explicite (et non une
 *  exclusion des espaces /admin, /formation, /styleguide et de la 404) : la nav
 *  est montée dans le layout racine, donc partagée par toutes les routes. */
const PAGES_SITE = [
  "/",
  "/accueil-formation",
  "/quelle-ia",
  "/formations",
  "/implementation",
  "/automatisation",
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
 * d'ancrage + CTA « Discuter de mon projet » vers la prise de rendez-vous.
 *
 * Montée une seule fois dans `app/layout.tsx` : le nœud DOM survit aux
 * changements de route. Tout le site vitrine est en tonalité encre, la barre
 * l'est donc aussi partout ; l'URL (`usePathname`) ne décide plus que de son
 * positionnement (sticky / fixed).
 *
 * Responsive : sous `xl`, la barre tient sur une seule rangée (logo + bouton
 * menu) et les liens passent dans un panneau qui se déplie juste dessous — sans
 * quoi ils s'enroulaient sur quatre rangées et la barre mangeait un tiers de
 * l'écran d'un téléphone. À partir de `xl`, tout revient dans la rangée.
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

  /** Clic sur le lockup logo. Déjà sur l'accueil, un `Link` vers la route
   *  courante ne déclenche ni navigation ni défilement : le clic paraît mort
   *  alors que l'attente est de revenir en haut de page. On remonte donc
   *  nous-mêmes. `scrollTo` sans `behavior` explicite suit le
   *  `scroll-behavior` du document : fluide, et instantané en mouvement
   *  réduit (voir globals.css). Les clics avec modificateur (nouvel onglet,
   *  nouvelle fenêtre) restent des clics de lien normaux. */
  const surLogo = (e: MouseEvent<HTMLAnchorElement>) => {
    fermer();
    if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    window.scrollTo({ top: 0 });
  };

  return (
    <div
      ref={barreRef}
      className={[
        fixed ? "fixed inset-x-0 top-0" : "sticky top-0",
        "z-50",
        // Fond opaque : le contenu de la page ne doit pas remonter au travers de
        // la barre quand il défile dessous.
        "bg-ink",
        // La barre reste dans le DOM interactif pendant le fondu du contenu.
        // Ne pas lui attribuer de view-transition-name : son instantané
        // intercepterait le survol dans WebKit.
      ].join(" ")}
    >
    {/* Le fond opaque couvre aussi les angles du CTA (débord de 5 px) et
        laisse de l'air sous la mention partenaire lors du défilement. */}
    <header className={`${styles.header} mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 pb-[14px] pt-[16px] sm:px-10 xl:pb-5 xl:pt-[26px]`}>
      {/* Lockup + mention de partenariat en colonne. La mention est HORS du
          lien : elle n'est pas un raccourci vers l'accueil, et le lien garde
          exactement sa zone cliquable d'origine. La mention s'aligne sur le
          bord gauche du symbole Marssane. */}
      <div className="flex flex-col items-start gap-[5px]">
        <Link
          href="/"
          aria-label="Marssane · retour à l'accueil"
          onClick={surLogo}
          // Le canard manque de contraste sur l'encre : anneau turquoise.
          className="inline-flex cursor-pointer rounded-btn focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquoise"
          // Le « M » du logo suit --color-ink : on le repasse en blanc localement.
          style={{ ["--color-ink" as string]: "#FFFFFF" }}
        >
          <LogoMarssane size={34} withWordmark />
        </Link>
        {/* Masquée sous sm : à 390 px, la mention (~220 px de large) ne tient
            pas à côté du bouton « Menu » et le poussait sur une seconde rangée
            en WebKit — la barre passait de 79 à 140 px de haut. Sur téléphone,
            le pied de page et le bandeau de la landing la portent. */}
        <span className="hidden font-mono text-[10px] uppercase leading-none tracking-[0.15em] text-faint-sur-ink sm:block">
          Partenaire du Groupe Novances
        </span>
      </div>

      {/* Bouton menu — sous xl seulement. Cadre et graisse du CTA de la barre :
          trois traits sobres + le mot, pour rester dans la typographie du site.
          `min-h-11` garantit les 44 px de cible tactile. */}
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls={ID_PANNEAU}
        onClick={() => setOuvert((o) => !o)}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-btn border-[1.5px] border-white/60 px-4 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:border-white xl:hidden"
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
          // Sous xl : panneau replié sous la barre (hors flux, il ne pousse donc
          // pas le contenu de la page), liens en colonne pleine largeur.
          ouvert ? "flex" : "hidden xl:flex",
          "absolute inset-x-0 top-full flex-col items-stretch gap-y-1 border-y border-line-sur-ink bg-ink px-6 pb-5 pt-2 sm:px-10",
          // À partir de xl : retour dans la rangée, à l'identique de l'origine.
          "xl:static xl:flex-row xl:flex-nowrap xl:items-center xl:gap-x-5 xl:gap-y-3 xl:border-0 xl:bg-transparent xl:p-0",
        ].join(" ")}
      >
        {/* `Link` et non `<a>` : la navigation doit rester côté client, sinon le
            document est rechargé, la nav remontée, et la transition de tonalité
            n'a pas lieu. */}
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            onClick={fermer}
            // Une cible d'au moins 44 px, y compris sur ordinateur : le
            // curseur reste une main autour du texte de chaque onglet.
            className="-mx-2 inline-flex min-h-11 cursor-pointer items-center px-2 py-3 text-[14.5px] font-semibold text-white/70 transition-colors hover:text-white motion-reduce:transition-none aria-[current=page]:text-turquoise xl:py-2.5 xl:text-[13px]"
          >
            {link.label}
          </Link>
        ))}
        <RendezVousTrigger
          onClick={fermer}
          className="cta-projet--compact mt-2 xl:mt-0"
        >
          Discuter de mon projet
        </RendezVousTrigger>
      </nav>
    </header>
    </div>
  );
}
