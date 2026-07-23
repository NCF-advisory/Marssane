import { PlusMark } from "@/components/ui/PlusMark";
import { ReservationTrigger } from "./ReservationTrigger";

/**
 * Section « Réservation » (ancre #contact) : carte « CTA final » de la maquette
 * (coins « + », titre surligné canard). Le bouton « Réserver ma place » ouvre la
 * modale de pré-inscription (<ReservationDialog>). Décorations motifFond masquées
 * sous lg.
 */
export function Reservation({ mention }: { mention?: string | null }) {
  return (
    <section
      id="contact"
      className="relative isolate mx-auto max-w-[1180px] px-10 pb-[90px] pt-[100px]"
    >
      {/* Décorations motifFond (décoratives) */}
      <span
        aria-hidden
        className="absolute left-[619.25px] top-0 -z-[1] hidden h-[74px] w-[1.5px] bg-repere lg:block"
      />
      <PlusMark
        variant="turquoise"
        size={25}
        className="absolute left-[620px] top-[88px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />

      <div
        className="relative overflow-hidden rounded-card border border-hairline bg-surface px-6 py-12 text-center sm:px-10 sm:py-14"
        style={{ boxShadow: "0 30px 60px -26px rgba(16,24,40,.25)" }}
      >
        <span className="absolute left-[26px] top-[22px] font-mono text-[15px] leading-none text-repere">
          +
        </span>
        <span className="absolute bottom-[22px] right-[26px] font-mono text-[15px] leading-none text-repere">
          +
        </span>

        <h2 className="text-[32px] font-extrabold leading-[1.06] tracking-[-0.028em] sm:text-[42px]">
          Réservez votre place pour
          <br />
          <span className="inline-block">
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              la prochaine session
              <span
                aria-hidden
                className="absolute right-[-0.62em] top-[-0.5em] text-[0.64em] font-medium leading-none text-turquoise"
              >
                +
              </span>
            </span>
            .
          </span>
        </h2>
        <p className="mx-auto mt-[18px] max-w-[460px] text-[16.5px] leading-[1.55] text-body">
          Deux demi-journées la même semaine, de la pratique entre les deux. Le
          vendredi soir, votre boîte se trie toute seule — parce que vous
          l&apos;aurez construit.
        </p>

        <ReservationTrigger className="mt-7 inline-flex items-center gap-2.5 rounded-btn bg-canard px-[30px] py-4 text-[16.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark">
          Réserver ma place
          <span aria-hidden className="text-[18px] leading-none">
            →
          </span>
        </ReservationTrigger>

        <div className="mt-4 text-[13px] text-soft">
          {mention ??
            "10 places par session · pré-inscription sans engagement · réponse sous 48 h."}
        </div>
      </div>
    </section>
  );
}
