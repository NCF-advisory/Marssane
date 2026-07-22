"use client";

import type { CSSProperties } from "react";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Indicateur de scroll du héro /formations : double chevron turquoise emboîté,
 * signé du « + » du logo. Au clic, défilement fluide vers la section cible
 * (`cibleId`, non codé en dur). Le « + » « pop » une seule fois au montage
 * (charte) — voir `.scroll-cue__plus` dans globals.css, hors reduced-motion et
 * sans boucle. Chevrons et « + » décoratifs (aria-hidden) ; le bouton porte le
 * libellé accessible.
 */
export function ScrollCue({ cibleId }: { cibleId: string }) {
  return (
    <button
      type="button"
      aria-label="Voir les formations"
      onClick={() =>
        document
          .getElementById(cibleId)
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="flex cursor-pointer flex-col items-center"
    >
      <span aria-hidden className="relative inline-block">
        <Chevron />
        <PlusMark
          variant="turquoise"
          size={36}
          className="scroll-cue__plus absolute -right-[36px] -top-[18px]"
        />
      </span>
      <Chevron faded />
    </button>
  );
}

/** Chevron « v » : carré bordé bas-droite, pivoté à 45°. `faded` = 2ᵉ chevron. */
function Chevron({ faded = false }: { faded?: boolean }) {
  const style: CSSProperties = {
    width: 36,
    height: 36,
    borderRight: "6px solid var(--color-turquoise)",
    borderBottom: "6px solid var(--color-turquoise)",
    transform: "rotate(45deg)",
    ...(faded ? { opacity: 0.45, marginTop: -10 } : {}),
  };
  return <span aria-hidden className="block" style={style} />;
}
