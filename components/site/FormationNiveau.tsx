import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/Kicker";
import {
  CADRE_COMMUN,
  type Formation,
  parseEtape,
  parseModule,
} from "./formations-content";

/**
 * Section détaillée d'un niveau (ancre = formation.id). Reprend le gabarit de la
 * section « La formation » de la landing : intro, puis grille timeline / cartes.
 * Colonne gauche : déroulé horodaté (9 h – 17 h) + encart livrable écume.
 * Colonne droite : les trois modules, le cadre et les prérequis. La couleur de
 * niveau ne colore que le badge, le repère « + » et la barre — jamais un aplat.
 */
export function FormationNiveau({ formation }: { formation: Formation }) {
  const etapes = formation.deroule.map(parseEtape);

  return (
    <section
      id={formation.id}
      className="relative isolate mx-auto max-w-[1180px] scroll-mt-8 border-t border-hairline px-10 pb-5 pt-[80px]"
    >
      <div className="max-w-[680px]">
        <span
          className="inline-flex items-center gap-2 rounded-chip border border-hairline bg-surface px-[10px] py-[5px] font-mono text-[11px] uppercase tracking-[0.12em] text-ink"
        >
          <span
            aria-hidden
            className="h-[8px] w-[8px] flex-none"
            style={{ backgroundColor: formation.accent }}
          />
          {formation.badge}
        </span>
        <Kicker className="mt-4">
          {formation.nom} · {formation.sousTitre}
        </Kicker>
        <h2 className="mt-[12px] text-[28px] font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[34px]">
          {formation.titre}
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body">
          {formation.promesse}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 items-start gap-11 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Déroulé : timeline verticale */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-soft">
            Le déroulé de la journée
          </div>
          <ol className="mt-5 flex flex-col">
            {etapes.map((etape, i) => {
              const dernier = i === etapes.length - 1;
              const pause = etape.texte === "";
              const debut = etape.heure.split(" – ")[0] ?? etape.heure;
              return (
                <li key={etape.heure} className="flex gap-[18px]">
                  <div className="flex w-[52px] flex-none flex-col items-center">
                    <span className="font-mono text-[11px] font-semibold text-canard">
                      {debut}
                    </span>
                    {!dernier && (
                      <span className="mt-[6px] w-[1.5px] flex-1 bg-repere" />
                    )}
                  </div>
                  {pause ? (
                    <div
                      className={`flex-1 text-[13px] font-medium text-soft ${dernier ? "" : "mb-[14px]"}`}
                    >
                      {etape.titre}
                      <span className="ml-2 font-mono text-[11px] text-quiet">
                        {etape.heure}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`flex-1 rounded-card border border-hairline bg-surface px-[22px] py-5 shadow-card ${dernier ? "" : "mb-[14px]"}`}
                    >
                      <div className="font-mono text-[11px] text-faint">
                        {etape.heure}
                      </div>
                      <div className="mt-1.5 text-[17px] font-bold tracking-[-0.01em]">
                        {etape.titre}
                      </div>
                      <p className="mt-2 text-[14px] leading-[1.58] text-muted">
                        {etape.texte}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Livrable final */}
          <div className="ml-[70px] mt-[22px] flex items-center gap-[14px] rounded-card bg-ecume px-[22px] py-[18px]">
            <span
              aria-hidden
              className="inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-surface text-[13px] font-bold text-ink-ecume"
            >
              ✓
            </span>
            <div className="text-[15px] font-semibold leading-[1.5] text-ink-ecume">
              {formation.livrable}
            </div>
          </div>
        </div>

        {/* Modules + cadre + prérequis */}
        <div className="flex flex-col gap-[22px]">
          <div className="rounded-card border border-hairline bg-surface p-6 shadow-card">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-soft">
              Les trois modules
            </div>
            <div className="mt-[14px] flex flex-col gap-4">
              {formation.modules.map((module) => {
                const { titre, texte } = parseModule(module);
                return (
                  <div key={titre}>
                    <div className="text-[14.5px] font-bold tracking-[-0.01em]">
                      {titre}
                    </div>
                    {texte && (
                      <p className="mt-1 text-[13.5px] leading-[1.5] text-muted">
                        {texte}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-card border border-hairline bg-surface p-6 shadow-card">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-soft">
              Le cadre
            </div>
            <div className="mt-[14px] flex flex-col gap-3 text-[14.5px]">
              {CADRE_COMMUN.map((ligne) => (
                <div key={ligne.label} className="flex justify-between gap-3">
                  <span className="text-body">{ligne.label}</span>
                  <span className="font-mono font-semibold text-ink">
                    {ligne.valeur}
                  </span>
                </div>
              ))}
              <div className="flex justify-between gap-3">
                <span className="text-body">Niveau</span>
                <span className="font-mono font-semibold text-ink">
                  {formation.niveauCadre}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-hairline bg-surface p-6 shadow-card">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-soft">
              Prérequis
            </div>
            <div className="mt-[14px] flex flex-col gap-[11px] text-[14px] text-body">
              {formation.prerequis.map((item) => (
                <PrerequisItem key={item}>{item}</PrerequisItem>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Ligne de prérequis : pastille ✓ (écume) alignée en haut + texte 14 px. */
function PrerequisItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-[10px]">
      <span
        aria-hidden
        className="mt-px inline-flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full bg-ecume text-[11px] font-bold text-ink-ecume"
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}
