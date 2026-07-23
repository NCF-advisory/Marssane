import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/**
 * Intro « Pour faire quoi » (ancre #usages) : kicker, H2 38px et paragraphe.
 * Les décorations « motifFond » prolongent le trajet de mesure du héro
 * (trait vertical, segment pointillé, « + » turquoise, « + » gris). Décoratives.
 */
export function PourFaireQuoi() {
  return (
    <section
      id="usages"
      className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[100px]"
    >
      {/* Décorations motifFond (décoratives) — positions px : masquées sous lg
          pour ne pas déborder de la fenêtre à 360px (cf. autres sections). */}
      <span
        aria-hidden
        className="absolute left-[15.25px] top-0 -z-[1] hidden h-[52px] w-[1.5px] bg-repere lg:block"
      />
      <span
        aria-hidden
        className="absolute left-4 top-[51.25px] -z-[1] hidden h-[1.5px] w-[520px] lg:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,#C4CBD2 0 8px,rgba(196,203,210,0) 8px 15px)",
        }}
      />
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[547px] top-[52px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />
      <span
        aria-hidden
        className="absolute left-[546.25px] top-[63px] -z-[1] hidden h-[34px] w-[1.5px] bg-repere lg:block"
      />
      <PlusMark size={16} className="absolute right-[150px] top-[56px] hidden lg:block" />

      <div className="max-w-[680px]">
        <Kicker>Pour faire quoi · votre semaine type</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Des semaines de 60 heures, et toujours{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            en retard
          </span>{" "}
          ?
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body">
          Trois situations que vous vivez chaque semaine. Pendant la formation,
          vous les réglez sur vos propres documents.
        </p>
      </div>
    </section>
  );
}
