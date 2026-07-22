import { heroVideo } from "@/lib/site-config";
import { HeroVideo } from "./HeroVideo";

/**
 * Moitié droite du héro. Bascule pilotée par `heroVideo` (lib/site-config) :
 * - null  → composition statique de la maquette (placeholder, 470 px de haut) ;
 * - objet → vidéo (voir HeroVideo).
 * La bascule ne demande aucune modification de ce composant.
 */
export function HeroMedia() {
  if (heroVideo) {
    return (
      <div className="relative">
        <HeroVideo video={heroVideo} />
      </div>
    );
  }
  return <HeroComposition />;
}

function HeroComposition() {
  return (
    <div className="relative mx-auto flex max-w-[340px] flex-col items-center gap-6 lg:mx-0 lg:block lg:h-[470px] lg:max-w-none">
      {/* Photo — placeholder « photographie » hachuré 45° */}
      <div
        className="h-[300px] w-[300px] max-w-full overflow-hidden rounded-card lg:absolute lg:right-0 lg:top-[26px] lg:z-[1] lg:h-[350px]"
        style={{
          boxShadow: "0 28px 58px -22px rgba(16,24,40,.30)",
          border: "1px solid rgba(16,24,40,.05)",
        }}
      >
        <div
          className="flex h-full w-full items-end p-3.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #E4E8EC 0 11px, #EDF0F3 11px 22px)",
          }}
        >
          <span className="rounded-chip bg-white/75 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-quiet">
            une session de formation
          </span>
        </div>
      </div>

      {/* Carte « Votre boîte mail » */}
      <div
        className="w-[296px] max-w-full rounded-card border border-hairline bg-surface p-5 lg:absolute lg:bottom-[10px] lg:left-0 lg:z-[3]"
        style={{ boxShadow: "0 26px 52px -18px rgba(16,24,40,.28)" }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-quiet">
            Votre boîte mail
          </div>
          <span className="font-mono text-[10px] text-quiet">09:00</span>
        </div>
        <div className="mt-[13px] flex flex-col gap-[9px] text-[13px]">
          <div className="flex items-center gap-[9px]">
            <span className="h-2 w-2 flex-none rounded-full bg-canard" />
            <span className="flex-1 text-ink">À traiter aujourd&apos;hui</span>
            <span className="font-mono font-semibold text-ink">6</span>
          </div>
          <div className="flex items-center gap-[9px]">
            <span className="h-2 w-2 flex-none rounded-full bg-periwinkle" />
            <span className="flex-1 text-body">
              En attente d&apos;une réponse
            </span>
            <span className="font-mono text-body">4</span>
          </div>
          <div className="flex items-center gap-[9px]">
            <span className="h-2 w-2 flex-none rounded-full bg-repere" />
            <span className="flex-1 text-body">Classés automatiquement</span>
            <span className="font-mono text-body">37</span>
          </div>
        </div>
        <div className="mt-[15px] flex flex-col gap-[9px]">
          <div>
            <div className="mb-[5px] flex justify-between text-[11.5px] text-faint">
              <span>Ce matin · non triés</span>
              <span className="font-mono">47</span>
            </div>
            <div className="h-[7px] rounded-chip bg-bar-track">
              <div className="h-[7px] w-full rounded-chip bg-repere" />
            </div>
          </div>
          <div>
            <div className="mb-[5px] flex justify-between text-[11.5px] text-faint">
              <span>Après le tri · à traiter</span>
              <span className="font-mono text-ink-ecume">6</span>
            </div>
            <div className="h-[7px] rounded-chip bg-bar-track">
              <div className="h-[7px] w-[13%] rounded-chip bg-turquoise" />
            </div>
          </div>
        </div>
        <div className="mt-[14px] inline-flex items-center gap-1.5 rounded-chip bg-ecume px-[11px] py-[5px] text-[12px] font-semibold text-ink-ecume">
          triée par votre automatisation
        </div>
      </div>

      {/* Carte « Votre première automatisation » */}
      <div
        className="w-[216px] max-w-full overflow-hidden rounded-card border border-hairline bg-surface lg:absolute lg:right-[24px] lg:top-[-14px] lg:z-[2]"
        style={{ boxShadow: "0 22px 42px -16px rgba(16,24,40,.26)" }}
      >
        <div
          className="px-[14px] py-2.5 text-[12px] font-semibold text-ink-periwinkle"
          style={{ background: "linear-gradient(120deg,#A88FEE,#C7D2F7)" }}
        >
          Votre première automatisation
        </div>
        <div className="flex flex-col gap-2 px-[14px] py-3 text-[12.5px]">
          <AutoLine>Lire les nouveaux mails</AutoLine>
          <AutoLine>Classer par priorité</AutoLine>
          <AutoLine>Signaler les urgences</AutoLine>
          <div className="mt-0.5 font-mono text-[10px] text-quiet">
            construite par vous · pas à pas
          </div>
        </div>
      </div>
    </div>
  );
}

function AutoLine({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-[9px]">
      <span
        aria-hidden
        className="inline-flex h-[17px] w-[17px] flex-none items-center justify-center rounded-full bg-ecume text-[10px] font-bold text-ink-ecume"
      >
        ✓
      </span>
      {children}
    </div>
  );
}
