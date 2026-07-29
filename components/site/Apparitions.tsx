"use client";

import { useEffect, useLayoutEffect } from "react";

/** Layout effect côté navigateur seulement (évite l'avertissement SSR). */
const useBrowserLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Observateur unique des apparitions au défilement de la landing. Il ramasse
 * tous les `[data-apparition]` de la page, les arme avant le paint
 * (« pending ») puis les bascule sur « in » quand ils entrent dans le viewport.
 * Toute l'animation est portée par des transitions CSS (voir `globals.css`) ;
 * le JS ne fait que poser un attribut — même idiome que <NiveauBloc>.
 *
 * Repli : sans JS, ou en `prefers-reduced-motion: reduce`, l'attribut n'est
 * jamais armé et les règles CSS ne s'appliquent pas → tout le contenu est
 * visible d'emblée (rendu serveur, indexable, aucun décalage).
 *
 * Une seule passe : chaque élément révélé est désobservé (l'animation ne
 * rejoue pas en remontant la page, comme sur le modèle mesuré).
 */
export function Apparitions() {
  useBrowserLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cibles = Array.from(
      document.querySelectorAll<HTMLElement>("[data-apparition]"),
    );
    if (!cibles.length) return;

    // Armement posé avant le paint : la transition n'étant déclarée que pour
    // l'état « in », ce passage est instantané (aucune animation à rebours).
    for (const cible of cibles) cible.dataset.apparition = "pending";

    const observer = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue;
          (entree.target as HTMLElement).dataset.apparition = "in";
          observer.unobserve(entree.target);
        }
      },
      // Le modèle déclenche dès que l'élément entre dans le viewport ; la marge
      // basse de −8 % évite qu'un bloc juste sous la ligne de flottaison
      // s'anime avant d'avoir été amené à l'écran.
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const cible of cibles) observer.observe(cible);

    return () => observer.disconnect();
  }, []);

  return null;
}
