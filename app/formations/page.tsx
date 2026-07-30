import { Footer } from "@/components/site/Footer";
import { NiveauBloc } from "@/components/site/NiveauBloc";
import { ScrollCue } from "@/components/site/ScrollCue";
import { Kicker } from "@/components/ui/Kicker";
import { LogoNiveau } from "@/components/ui/LogoNiveau";
import { NIVEAUX } from "@/lib/niveaux";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Nos formations · Marssane",
  description:
    "Trois niveaux de formation à l'IA (Débutant, Confirmé, Expert) pour progresser à son rythme, des premiers usages jusqu'à l'outil construit sur mesure.",
  path: "/formations",
});

export default function Formations() {
  return (
    <>
      {/* `snap-page-formations` active le scroll-snap racine, ciblé sur cette
          page via `html:has(...)` dans globals.css (aucune fuite ailleurs). */}
      <main className="snap-page-formations">
        {/* Écran 1 : intro + sommaire des trois niveaux. Le `pt` réserve la
            bande de la nav, qui est hors flux sur cette page et démarre donc
            l'écran à y=0. Deux paliers seulement depuis le menu replié : la
            barre tient sur une rangée de hauteur constante sous lg (mesurée :
            ~75 px, et ~71 px dès 1024 px). */}
        <section className="flex min-h-[100dvh] flex-col snap-start">
          <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col justify-between px-6 pb-12 pt-[92px] sm:px-10 sm:pb-14 lg:pt-[118px]">
            {/* Colonne qui guide l'œil vers le bas : intro en haut, sommaire
                juste dessous, chevrons calés en bas de l'écran (`mt-auto`). */}
            <div>
              <div className="max-w-[640px]">
                <Kicker className="text-faint-sur-ink!">Nos formations</Kicker>
                <h1 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[40px]">
                  Trois niveaux, un même cap :{" "}
                  <span className="inline-block">
                    <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
                      l&apos;IA au travail
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
                <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body-sur-ink">
                  Chacun progresse à son rythme, des premiers usages
                  jusqu&apos;à l&apos;outil construit sur mesure. Trois niveaux
                  à découvrir juste en dessous.
                </p>
              </div>
            </div>

            {/* Sommaire cliquable : une carte par niveau, ancrée sur son écran
                de détail. Elle remplit le premier écran ET donne la raison de
                scroller ; le scroll-snap fait le reste. Données prises dans
                NIVEAUX (@/lib/niveaux, partagé avec l'accueil). */}
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 lg:grid-cols-3 lg:gap-5">
              {NIVEAUX.map((niveau) => (
                <li key={niveau.id}>
                  <a
                    href={`#${niveau.id}`}
                    className="flex h-full items-center gap-4 rounded-card border border-line-sur-ink bg-surface-sur-ink p-4 transition-[transform,border-color] duration-300 ease-out hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquoise motion-safe:hover:-translate-y-1 lg:p-5"
                  >
                    {/* Le « M » du logo suit --color-ink : on le repasse en
                        blanc localement, comme la nav et le pied de page. */}
                    <LogoNiveau
                      color={niveau.accent}
                      size={46}
                      className="shrink-0"
                      style={{ ["--color-ink" as string]: "#FFFFFF" }}
                    />
                    <span className="min-w-0">
                      <span
                        className="inline-flex items-center rounded-chip px-[9px] py-[4px] font-mono text-[10.5px] uppercase tracking-[0.12em]"
                        style={{
                          backgroundColor: niveau.badgeBg,
                          color: niveau.badgeText,
                        }}
                      >
                        Niveau {niveau.numero} · {niveau.nom}
                      </span>
                      <span className="mt-2 block text-[15px] font-bold leading-[1.28] tracking-[-0.01em]">
                        {niveau.titre}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Chevrons en bas de l'écran, sous le sommaire : le
                `justify-between` du parent les colle au bas de la zone utile,
                `pt-8` garantit qu'ils ne touchent pas les cartes quand la
                fenêtre est courte (le `mt-8` du sommaire joue le même rôle
                au-dessus). Centrés
                (et non alignés à gauche comme à l'origine) car ils ne closent
                plus une colonne de texte mais une bande de trois cartes qui
                occupe toute la largeur : l'axe de la composition est le milieu.
                Le chevron est un carré pivoté à 45°, sa pointe dépasse
                symétriquement à gauche et à droite : centrer sa boîte le centre
                aussi visuellement (pas de compensation à la `pl-[7px]` de
                l'alignement à gauche). */}
            <div className="flex justify-center pt-8">
              <ScrollCue cibleId="debutant" />
            </div>
          </div>
        </section>

        {/* Écrans 2–4 : un plein écran snappé par niveau. */}
        <NiveauBloc niveaux={NIVEAUX} />
      </main>
      {/* Un dernier cran de scroll amène le pied de page en vue. */}
      <div className="snap-end">
        <Footer />
      </div>
    </>
  );
}
