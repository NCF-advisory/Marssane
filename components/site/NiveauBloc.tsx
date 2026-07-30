"use client";

import { type CSSProperties, useEffect, useLayoutEffect, useRef } from "react";
import { CheckItem } from "@/components/ui/CheckItem";
import { Chevron } from "@/components/ui/Chevron";
import { LogoNiveau } from "@/components/ui/LogoNiveau";
import { ReservationTrigger } from "./ReservationTrigger";

/** Un niveau de formation (contenu provisoire porté par la page). */
export type Niveau = {
  /** Slug d'ancre (ex. « debutant »). */
  id: string;
  /** Numéro affiché (« 01 », « 02 », « 03 »). */
  numero: string;
  /** Nom du niveau (« Débutant »…). */
  nom: string;
  /** Couleur d'accent — équerres + « + » du logo, liseré, badge, CTA, pastilles. */
  accent: string;
  /** Couleur de texte lisible SUR l'accent (✓ des pastilles, libellé du CTA). */
  accentText: string;
  /** Fond du badge (teinte très claire de l'accent). */
  badgeBg: string;
  /** Texte du badge (encre foncée lisible sur `badgeBg`). */
  badgeText: string;
  titre: string;
  accroche: string;
  points: string[];
  infos: { duree: string; format: string; prochaineSession: string };
};

/** Layout effect côté navigateur seulement (évite l'avertissement SSR). */
const useBrowserLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Diamètre du logo en desktop, en px (attributs width/height du SVG). Sous
 *  1024 px de large, la classe `TAILLE_LOGO` le réduit par-dessus. */
const LOGO_PX = 200;

/** Diamètre effectif du logo : fluide en mobile (où l'écran de niveau dépasse
 *  déjà la hauteur de la fenêtre), 200 px dès que la place le permet — même
 *  idiome que la tuile du héro de /quelle-ia. */
const TAILLE_LOGO = "h-[clamp(104px,28vw,200px)] w-[clamp(104px,28vw,200px)]";

/**
 * « Nos formations » : trois blocs empilés, un par niveau. Chaque bloc est une
 * grille deux colonnes en desktop — logo libre à gauche, carte de contenu à
 * droite (liseré accent en tête) ; en mobile le logo passe au-dessus, centré.
 *
 * Animation « engrenage » à chaque passage dans le viewport : elle rejoue
 * quand un bloc revient à l'écran (y compris en remontant la page). Les trois
 * équerres et le « + » du logo tournent autour du
 * centre du « M » (128,128 en coordonnées viewBox) comme un engrenage qui se
 * verrouille (rotation −120° → 0°, léger sur-scale 1,12 → 1), pendant que le
 * « M » apparaît en fondu ; puis le contenu se dévoile depuis la gauche (en-tête
 * d'abord, corps ensuite).
 *
 * Robustesse : AUCUNE mesure de layout ni rAF en JS. Le JS pose seulement
 * l'attribut `data-reveal` via IntersectionObserver (« pending » avant le
 * paint ; « in » dès qu'un bloc est visible à ≥ 30 % ; retour à « pending »
 * quand il sort entièrement du viewport, ce qui réarme l'animation) ; toute
 * l'animation est portée par des transitions CSS (voir `globals.css`).
 *
 * Repli : sans JS et en `prefers-reduced-motion: reduce`, l'attribut n'est
 * jamais posé (ou reste inerte) → tout est rendu serveur, visible et indexable.
 */
export function NiveauBloc({ niveaux }: { niveaux: Niveau[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useBrowserLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    const blocs = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!blocs.length) return;

    // État pré-animation posé avant le paint : engrenage armé, contenu masqué.
    // La transition n'est définie que pour l'état « in », donc ce passage
    // « (défaut) → pending » est instantané (aucune animation à rebours).
    for (const b of blocs) b.dataset.reveal = "pending";

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const bloc = e.target as HTMLElement;
          if (!e.isIntersecting) {
            // Bloc entièrement sorti : on réarme pour rejouer au prochain
            // passage (dans les deux sens de scroll). Retour instantané, sans
            // animation à rebours.
            bloc.dataset.reveal = "pending";
          } else if (e.intersectionRatio >= 0.3) {
            bloc.dataset.reveal = "in";
          }
          // Entre les deux (partiellement visible) : on ne touche à rien pour
          // éviter que le logo « saute » sous les yeux en scroll lent.
        }
      },
      { threshold: [0, 0.3] },
    );
    for (const b of blocs) io.observe(b);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      {niveaux.map((niveau) => (
        <article
          key={niveau.id}
          id={niveau.id}
          data-reveal=""
          aria-labelledby={`niveau-${niveau.id}-titre`}
          // `scroll-mt-6` (et non 0) sous lg : la nav est hors flux sur cette
          // page, l'ancre atterrirait sous la barre. Neutralisé à partir de lg,
          // où la marge de défilement décalerait aussi le point de snap.
          className="niveau-bloc flex min-h-[100dvh] scroll-mt-6 snap-start items-center lg:scroll-mt-0"
        >
          {/* Contenu centré verticalement ; l'écartement vient du min-height.
              Même largeur/paddings que la section d'intro de la page. */}
          <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:gap-14">
            {/* Logo libre à gauche (au-dessus, centré, en mobile). Le « M » suit
                --color-ink : on le repasse en blanc localement, comme la nav et
                le pied de page. */}
            <div className="flex justify-center lg:justify-start">
              <LogoNiveau
                color={niveau.accent}
                size={LOGO_PX}
                className={TAILLE_LOGO}
                style={{ ["--color-ink" as string]: "#FFFFFF" }}
              />
            </div>

            {/* Carte de contenu à droite. */}
            <div className="relative overflow-hidden rounded-card border border-line-sur-ink bg-surface-sur-ink p-7 sm:p-10">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ backgroundColor: niveau.accent }}
              />

              {/* En-tête — se dévoile en premier. */}
              <div data-reveal-head>
                <span
                  className="inline-flex items-center rounded-chip px-[11px] py-[5px] font-mono text-[11px] uppercase tracking-[0.12em]"
                  style={{ backgroundColor: niveau.badgeBg, color: niveau.badgeText }}
                >
                  Niveau {niveau.numero} · {niveau.nom}
                </span>

                <h2
                  id={`niveau-${niveau.id}-titre`}
                  className="mt-4 text-[24px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[28px]"
                >
                  {niveau.titre}
                </h2>
                <p className="mt-3 max-w-[560px] text-[16px] leading-[1.58] text-body-sur-ink">
                  {niveau.accroche}
                </p>
              </div>

              {/* Corps — se dévoile ensuite. */}
              <div data-reveal-body>
                <ul className="mt-6 flex flex-col gap-3">
                  {niveau.points.map((point, i) => (
                    <li key={`${point}-${i}`}>
                      <CheckItem dotBg={niveau.accent} dotText={niveau.accentText}>
                        {point}
                      </CheckItem>
                    </li>
                  ))}
                </ul>

                {/* Infos pratiques — mono discret. */}
                <dl className="mt-7 flex flex-wrap gap-x-7 gap-y-2 border-t border-line-sur-ink pt-5 font-mono text-[12px] text-faint-sur-ink">
                  <div className="flex items-baseline gap-2">
                    <dt className="uppercase tracking-[0.1em]">Durée</dt>
                    <dd className="font-semibold text-white">{niveau.infos.duree}</dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="uppercase tracking-[0.1em]">Format</dt>
                    <dd className="font-semibold text-white">{niveau.infos.format}</dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="uppercase tracking-[0.1em]">Prochaine session</dt>
                    <dd className="font-semibold text-white">
                      {niveau.infos.prochaineSession}
                    </dd>
                  </div>
                </dl>

                <div className="mt-7">
                  <ReservationTrigger
                    className="inline-flex w-full items-center justify-center gap-[13px] rounded-btn bg-[var(--accent)] py-[15px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-[var(--accent-text)] shadow-cta transition-[background-color] duration-[180ms] ease-out hover:bg-[var(--accent-hover)] sm:w-auto"
                    style={
                      {
                        "--accent": niveau.accent,
                        "--accent-text": niveau.accentText,
                        "--accent-hover": `color-mix(in srgb, ${niveau.accent} 85%, black)`,
                      } as CSSProperties
                    }
                  >
                    Réserver sa place
                    <Chevron />
                  </ReservationTrigger>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
