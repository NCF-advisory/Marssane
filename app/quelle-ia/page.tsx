import type { Metadata } from "next";
import Link from "next/link";
import { getClassementSafe } from "@/lib/benchmarks/classement";
import { Footer } from "@/components/site/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { HeroRecommandation } from "@/components/site/HeroRecommandation";
import { GraphiqueEfficacite } from "@/components/quelle-ia/GraphiqueEfficacite";
import { MethodoSources } from "@/components/quelle-ia/MethodoSources";

export const revalidate = 3600;

/** Score au dixième, virgule décimale (ex. 73,3). */
const fmtScore = (x: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(x);

/** Même formatage de date que « Méthode & sources », pour rester cohérent. */
const fmtDate = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(iso),
      )
    : "—";

export const metadata: Metadata = {
  title: "Quelle IA utiliser aujourd'hui ? · Marssane",
  description:
    "Le classement des IA au meilleur compromis intelligence, prix et réactivité pour les dirigeants de PME, mis à jour automatiquement.",
};

export default async function Page() {
  const c = await getClassementSafe();

  if (c.entries.length === 0) {
    return (
      <>
        {/* `flex-1` fait couvrir au <main> toute la hauteur restante du body
            (min-h-full flex flex-col), pour que le pied de page reste en bas
            quand le contenu est court. Le fond encre est porté par le body. */}
        <main className="flex-1">
          <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
            <div className="max-w-[640px]">
              <Kicker className="text-faint-sur-ink!">
                Le comparateur · intelligence et prix
              </Kicker>
              <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] text-white sm:text-[38px]">
                Quelle IA utiliser{" "}
                <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
                  aujourd&apos;hui
                </span>{" "}
                ?
              </h1>
              <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body-sur-ink">
                Le classement est en cours d&apos;actualisation. Revenez dans quelques instants pour
                découvrir le meilleur compromis intelligence, prix et réactivité du moment.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const top = c.entries[0];

  return (
    <>
      {/* `flex-1` : cf. la branche « classement vide » ci-dessus. */}
      <main className="flex-1">
        {/* effort : chaîne vide si la source ne l'a pas fourni — le hero masque alors la ligne
            (passer la prop évite le repli « medium », qui serait faux). */}
        <HeroRecommandation
          modele={top.nom}
          effort={top.effort ?? ""}
          score={fmtScore(top.score)}
          date={fmtDate(c.miseAJour)}
          editeur={top.editeur}
          pays={top.pays}
          baseline="Le meilleur compromis intelligence, prix et réactivité du moment."
          ancre="#pourquoi"
        />
        {/* Cible de l'amorce de scroll du hero. `scroll-mt` dégage le kicker du
            graphe de la barre collante ; depuis le menu replié, celle-ci fait
            ~75 px sous lg et ~71 px au-delà — le `pt` de la section du graphe
            (84 px) suffit alors à passer sous la barre, une seule valeur
            partout. */}
        <div id="pourquoi" className="scroll-mt-6">
          <GraphiqueEfficacite entries={c.entries} />
        </div>
        <MethodoSources classement={c} />
        <PontFormation />
      </main>
      <Footer />
    </>
  );
}

/**
 * Pont vers l'offre en clôture de page : le comparateur répond à « quelle IA »,
 * la formation à « comment s'en servir ». Carte encre (mêmes gabarit et filet que
 * les cartes du site) et CTA canard plein, l'idiome CTA du site.
 *
 * `Link` et non `<a>` : la navigation vers l'accueil doit rester côté client,
 * sinon le document est rechargé et le fondu croisé entre pages n'a pas lieu.
 */
function PontFormation() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-[90px] pt-14 sm:px-10">
      <div className="rounded-card border border-line-sur-ink bg-surface-sur-ink px-6 py-9 sm:px-10 sm:py-10">
        <p className="max-w-[560px] text-[18px] font-semibold leading-[1.45] tracking-[-0.01em] sm:text-[20px]">
          Savoir quelle IA choisir, c&apos;est le début. Savoir s&apos;en servir
          sur vos dossiers, c&apos;est la formation.
        </p>
        <Link
          href="/#formation"
          className="mt-6 inline-flex items-center gap-2.5 rounded-btn bg-canard px-[27px] py-[15px] text-base font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark"
        >
          Découvrir la formation
          <span aria-hidden className="text-[1.1em] leading-none">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
