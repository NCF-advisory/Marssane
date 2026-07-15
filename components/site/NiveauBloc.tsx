"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { CheckItem } from "@/components/ui/CheckItem";
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
  /** Couleur d'accent — équerres + « + » du logo, liseré, badge. */
  accent: string;
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

/** Diamètre du logo, en px. */
const LOGO_PX = 200;

/**
 * « Nos formations » : trois blocs empilés, un par niveau. Chaque bloc est une
 * grille deux colonnes en desktop — logo libre à gauche, carte de contenu à
 * droite (liseré accent en tête) ; en mobile le logo passe au-dessus, centré.
 *
 * Animation « engrenage » au premier passage dans le viewport (une seule fois
 * par chargement) : les trois équerres et le « + » du logo tournent autour du
 * centre du « M » (128,128 en coordonnées viewBox) comme un engrenage qui se
 * verrouille (rotation −120° → 0°, léger sur-scale 1,12 → 1), pendant que le
 * « M » apparaît en fondu ; puis le contenu se dévoile depuis la gauche (en-tête
 * d'abord, corps ensuite).
 *
 * Robustesse : AUCUNE mesure de layout ni rAF en JS. Le JS pose seulement
 * l'attribut `data-reveal` (« pending » avant le paint, « in » au passage dans
 * le viewport via IntersectionObserver) ; toute l'animation est portée par des
 * transitions CSS (voir `globals.css`).
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
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.reveal = "in";
          io.unobserve(e.target);
        }
      },
      { threshold: 0.3 },
    );
    for (const b of blocs) io.observe(b);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="mt-12 flex flex-col gap-14 sm:mt-14 sm:gap-20">
      {niveaux.map((niveau) => (
        <article
          key={niveau.id}
          id={niveau.id}
          data-reveal=""
          aria-labelledby={`niveau-${niveau.id}-titre`}
          className="niveau-bloc grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:gap-14"
        >
          {/* Logo libre à gauche (au-dessus, centré, en mobile). */}
          <div className="flex justify-center lg:justify-start">
            <LogoNiveau color={niveau.accent} size={LOGO_PX} />
          </div>

          {/* Carte de contenu à droite. */}
          <div className="relative overflow-hidden rounded-card border border-hairline bg-surface p-7 shadow-card sm:p-10">
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
              <p className="mt-3 max-w-[560px] text-[16px] leading-[1.58] text-body">
                {niveau.accroche}
              </p>
            </div>

            {/* Corps — se dévoile ensuite. */}
            <div data-reveal-body>
              <ul className="mt-6 flex flex-col gap-3">
                {niveau.points.map((point) => (
                  <li key={point}>
                    <CheckItem>{point}</CheckItem>
                  </li>
                ))}
              </ul>

              {/* Infos pratiques — mono discret. */}
              <dl className="mt-7 flex flex-wrap gap-x-7 gap-y-2 border-t border-hairline pt-5 font-mono text-[12px] text-soft">
                <div className="flex items-baseline gap-2">
                  <dt className="uppercase tracking-[0.1em]">Durée</dt>
                  <dd className="font-semibold text-ink">{niveau.infos.duree}</dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="uppercase tracking-[0.1em]">Format</dt>
                  <dd className="font-semibold text-ink">{niveau.infos.format}</dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="uppercase tracking-[0.1em]">Prochaine session</dt>
                  <dd className="font-semibold text-ink">
                    {niveau.infos.prochaineSession}
                  </dd>
                </div>
              </dl>

              <div className="mt-7">
                <ReservationTrigger className="inline-flex w-full items-center justify-center gap-2.5 rounded-btn bg-canard px-[27px] py-[15px] text-[15.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark sm:w-auto">
                  Réserver sa place
                  <span aria-hidden className="text-[17px] leading-none">
                    →
                  </span>
                </ReservationTrigger>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
