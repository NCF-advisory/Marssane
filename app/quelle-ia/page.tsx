import type { Metadata } from "next";
import { getClassementSafe } from "@/lib/benchmarks/classement";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Kicker } from "@/components/ui/Kicker";
import { HeroClassement } from "@/components/quelle-ia/HeroClassement";
import { PodiumTop3 } from "@/components/quelle-ia/PodiumTop3";
import { ResteClassement } from "@/components/quelle-ia/ResteClassement";
import { GraphiqueEfficacite } from "@/components/quelle-ia/GraphiqueEfficacite";
import { MethodoSources } from "@/components/quelle-ia/MethodoSources";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Quelle IA utiliser aujourd'hui ? · Marssane",
  description:
    "Le classement des IA au meilleur rapport intelligence / coût pour les dirigeants de PME, mis à jour automatiquement.",
};

export default async function Page() {
  const c = await getClassementSafe();

  if (c.entries.length === 0) {
    return (
      <>
        <Nav />
        <main>
          <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[84px]">
            <div className="max-w-[640px]">
              <Kicker>Le comparateur · efficacité par euro</Kicker>
              <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
                Quelle IA utiliser{" "}
                <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
                  aujourd&apos;hui
                </span>{" "}
                ?
              </h1>
              <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body">
                Le classement est en cours d&apos;actualisation. Revenez dans quelques instants pour
                découvrir le meilleur rapport intelligence / coût du moment.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main>
        <HeroClassement top={c.entries[0]} miseAJour={c.miseAJour} />
        <PodiumTop3 entries={c.entries} />
        <ResteClassement entries={c.entries} />
        <GraphiqueEfficacite entries={c.entries} />
        <MethodoSources classement={c} />
      </main>
      <Footer />
    </>
  );
}
