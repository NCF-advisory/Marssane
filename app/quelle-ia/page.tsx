import type { Metadata } from "next";
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
        {/* Page en tonalité encre : `flex-1` fait couvrir au <main> toute la
            hauteur restante du body (min-h-full flex flex-col), sinon le fond
            toile clair réapparaîtrait sous un contenu court. */}
        <main className="flex-1 bg-ink">
          <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[84px]">
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
        <Footer ton="encre" />
      </>
    );
  }

  const top = c.entries[0];

  return (
    <>
      {/* Page en tonalité encre : `flex-1` fait couvrir au <main> toute la
          hauteur restante du body (min-h-full flex flex-col), sinon le fond
          toile clair réapparaîtrait sous un contenu court. */}
      <main className="flex-1 bg-ink">
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
            graphe de la barre collante, qui se replie sur plusieurs lignes sous
            lg (mesurée : ~70px à partir de 1024px, jusqu'à ~221px à 320px). */}
        <div id="pourquoi" className="scroll-mt-[168px] lg:scroll-mt-6">
          <GraphiqueEfficacite entries={c.entries} />
        </div>
        <MethodoSources classement={c} />
      </main>
      <Footer ton="encre" />
    </>
  );
}
