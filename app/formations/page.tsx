import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { FormationNiveau } from "@/components/site/FormationNiveau";
import { FormationParcours } from "@/components/site/FormationParcours";
import { FORMATIONS } from "@/components/site/formations-content";
import { Nav } from "@/components/site/Nav";
import { Button } from "@/components/ui/Button";
import { GridBackground } from "@/components/ui/GridBackground";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

export const metadata: Metadata = {
  title: "Formations IA — Marssane",
  description:
    "Un parcours en trois niveaux, de la première installation à l'agent autonome. Trois formations d'une journée sur cas concrets, pour dirigeants de PME, avocats, notaires et experts-comptables.",
};

/**
 * Page /formations : le parcours de formation complet.
 * 1. Héro « Un parcours en trois niveaux ».
 * 2. Vue parcours (les 3 niveaux côte à côte) — <FormationParcours>.
 * 3. Une section détaillée par niveau — <FormationNiveau>.
 * 4. Rappel implémentation + CTA final de réservation.
 *
 * Les CTA « Réserver ma place » renvoient vers la section réservation de la
 * landing (/#contact) ; « Parler de votre projet » vers /#implementation.
 */
export default function FormationsPage() {
  return (
    <>
      <Nav />
      <main>
        {/* 1. Héro */}
        <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-10 pt-[74px]">
          <GridBackground
            className="-z-[1]"
            mask="linear-gradient(to bottom, #000 0 60%, transparent 94%)"
          />
          <PlusMark
            variant="turquoise"
            size={21}
            className="absolute left-4 top-[90px] -z-[1] -translate-x-1/2 -translate-y-1/2"
          />
          <PlusMark size={16} className="absolute left-14 top-11" />

          <div className="max-w-[620px]">
            <Kicker>
              Formations IA · dirigeants de PME, avocats, notaires,
              experts-comptables
            </Kicker>
            <h1 className="mt-[18px] text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[50px]">
              Un parcours en{" "}
              <span className="inline-block">
                <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
                  trois niveaux
                  <span
                    aria-hidden
                    className="absolute right-[-0.62em] top-[-0.5em] text-[0.64em] font-medium leading-none text-turquoise"
                  >
                    +
                  </span>
                </span>
                .
              </span>
            </h1>
            <p className="mt-[22px] max-w-[520px] text-[18px] leading-[1.55] text-body">
              De la première installation à l&apos;agent autonome. Trois
              formations d&apos;une journée, chacune sur votre ordinateur et sur
              vos propres cas : vous montez en autonomie, niveau après niveau.
            </p>
            <div className="mt-[30px] flex flex-wrap items-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2.5 rounded-btn bg-canard px-[27px] py-[15px] text-base font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark"
              >
                Réserver ma place
                <span aria-hidden className="text-[1.1em] leading-none">
                  →
                </span>
              </Link>
              <Button variant="link" href="#parcours" arrow>
                Voir le parcours
              </Button>
            </div>
          </div>
        </section>

        {/* 2. Vue parcours */}
        <FormationParcours />

        {/* 3. Une section détaillée par niveau */}
        {FORMATIONS.map((formation) => (
          <FormationNiveau key={formation.id} formation={formation} />
        ))}

        {/* 4a. Rappel implémentation */}
        <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-5 pt-[96px]">
          <div className="flex flex-col gap-6 rounded-card border border-hairline bg-surface p-8 shadow-card sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-[600px]">
              <Kicker>Aller plus loin · implémentation</Kicker>
              <h2 className="mt-[14px] text-[24px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[28px]">
                Nous vous formons à l&apos;IA. Pour aller plus loin, nous
                l&apos;implémentons chez vous.
              </h2>
              <p className="mt-3 text-[16px] leading-[1.58] text-body">
                Une fois vos équipes formées, nous installons l&apos;IA
                directement dans votre entreprise — sur vos données, avec vos
                équipes, avec un gain mesuré chaque mois.
              </p>
            </div>
            <Button
              variant="secondary"
              href="/#implementation"
              arrow
              className="flex-none"
            >
              Parler de votre projet
            </Button>
          </div>
        </section>

        {/* 4b. CTA final de réservation */}
        <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-[90px] pt-[52px]">
          <span
            aria-hidden
            className="absolute left-[619.25px] top-[10px] -z-[1] hidden h-[64px] w-[1.5px] bg-repere lg:block"
          />
          <PlusMark
            variant="turquoise"
            size={25}
            className="absolute left-[620px] top-[86px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
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
            <p className="mx-auto mt-[18px] max-w-[470px] text-[16.5px] leading-[1.55] text-body">
              Le parcours démarre par la formation débutant : une journée, chacun
              sur son ordinateur. À 17 h, votre boîte mail se trie toute seule —
              parce que vous l&apos;aurez construit.
            </p>

            <Link
              href="/#contact"
              className="mt-7 inline-flex items-center gap-2.5 rounded-btn bg-canard px-[30px] py-4 text-[16.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark"
            >
              Réserver ma place
              <span aria-hidden className="text-[18px] leading-none">
                →
              </span>
            </Link>

            <div className="mt-4 text-[13px] text-soft">
              10 places par session · pré-inscription sans engagement · réponse
              sous 48 h.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
