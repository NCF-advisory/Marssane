import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Ce que le client emporte / ce qui l'entoure, en satellites autour de la
 * marque. Position en % du conteneur orbital (centre du chip), calée sur les
 * deux ellipses pour la vue à partir de sm.
 */
const SATELLITES: { nom: string; x: number; y: number }[] = [
  { nom: "Votre système de tri", x: 22, y: 58 },
  { nom: "Chat commun", x: 78, y: 50 },
  { nom: "Petit groupe", x: 17, y: 19 },
  { nom: "Sans engagement", x: 83, y: 19 },
  { nom: "Certificat", x: 14, y: 80 },
  { nom: "Implémentation sur mesure", x: 84, y: 84 },
];

/**
 * Section « Notre modèle » : la réassurance qui précède l'escalier d'offres,
 * sur le format « BrandSystem » de 8lab — titre, UNE ligne de sous-titre, puis
 * une constellation : le chip Marssane au centre, deux orbites en pointillés,
 * et en satellites ce que le client emporte. Halo radial discret au centre.
 *
 * Tout en CSS/JSX : ellipses = éléments `border-dashed rounded-[50%]`
 * positionnés. Sous sm, la constellation s'empile (chip central puis
 * satellites en rangées centrées) — aucun débordement à 320 px.
 */
export function Alignement() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      {/* Décoration motifFond (décorative) */}
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[15px] top-[60px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />

      <div data-apparition="" className="max-w-[680px]">
        <Kicker className="text-faint-sur-ink!">Notre modèle</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Votre autonomie est{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            notre modèle
          </span>
          .
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body-sur-ink">
          Un petit groupe, pas d&apos;abonnement : vous repartez plus productif,
          avec des heures gagnées sur votre semaine.
        </p>
      </div>

      {/* Constellation orbitale, à partir de sm. */}
      <div
        data-apparition=""
        style={{ ["--apparition-delai" as string]: "150ms" }}
        className="relative mx-auto mt-[10px] hidden h-[400px] max-w-[980px] sm:block"
      >
        {/* Halo lumineux discret au centre. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[52%] h-[76%] w-[64%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(closest-side, rgba(0, 209, 190, 0.09), transparent 72%)",
          }}
        />
        {/* Les deux orbites en pointillés. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[52%] h-[60%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-line-sur-ink"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-[52%] h-[94%] w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-line-sur-ink"
        />

        <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2">
          <ChipMarssane />
        </div>
        {SATELLITES.map((s) => (
          <div
            key={s.nom}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <ChipSatellite>{s.nom}</ChipSatellite>
          </div>
        ))}
      </div>

      {/* Repli empilé sous sm : le centre d'abord, puis les satellites. */}
      <div
        data-apparition=""
        style={{ ["--apparition-delai" as string]: "150ms" }}
        className="mt-8 flex flex-col items-center gap-4 sm:hidden"
      >
        <ChipMarssane />
        <div className="flex flex-wrap justify-center gap-2">
          {SATELLITES.map((s) => (
            <ChipSatellite key={s.nom}>{s.nom}</ChipSatellite>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Le chip central : monogramme (repassé en blanc) + nom de la marque. */
function ChipMarssane() {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-card border border-line-sur-ink bg-surface-sur-ink px-4 py-2.5 text-[15px] font-bold">
      <span
        aria-hidden
        className="inline-flex"
        style={{ ["--color-ink" as string]: "#FFFFFF" }}
      >
        <LogoMarssane size={18} />
      </span>
      Marssane
    </span>
  );
}

/** Un satellite : pastille turquoise + libellé, sur carte encre. */
function ChipSatellite({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-card border border-line-sur-ink bg-surface-sur-ink px-3.5 py-2 text-[13px] font-semibold text-body-sur-ink">
      <span
        aria-hidden
        className="h-[6px] w-[6px] flex-none rounded-full bg-turquoise"
      />
      {children}
    </span>
  );
}
