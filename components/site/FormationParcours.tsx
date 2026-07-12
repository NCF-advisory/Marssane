import { Fragment } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";
import { FORMATIONS, type Formation } from "./formations-content";

/**
 * Vue parcours (ancre #parcours) : les trois niveaux côte à côte, reliés par une
 * flèche de progression (verticale en mobile, horizontale à partir de lg).
 * Chaque carte porte la promesse, le livrable et le prérequis d'entrée. La
 * couleur de niveau ne sert que de ponctuation : barre de carte, repère « + » et
 * pastille du badge — jamais en aplat de fond.
 */
export function FormationParcours() {
  return (
    <section
      id="parcours"
      className="relative isolate mx-auto max-w-[1180px] px-10 pb-5 pt-[96px]"
    >
      <PlusMark
        size={16}
        className="absolute left-[70px] top-[64px] hidden lg:block"
      />

      <div className="max-w-[640px]">
        <Kicker>Le parcours · trois niveaux</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Débutant, intermédiaire, avancé.
        </h2>
        <p className="mt-4 text-[16.5px] leading-[1.58] text-body">
          Trois formations d&apos;une journée qui se suivent. Chacune part du
          niveau atteint à la précédente : on installe, puis on connecte, puis on
          automatise.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3">
        {FORMATIONS.map((formation, i) => (
          <Fragment key={formation.id}>
            <ParcoursCard formation={formation} />
            {i < FORMATIONS.length - 1 && (
              <span
                aria-hidden
                className="flex items-center justify-center self-center text-[24px] leading-none text-repere lg:self-auto"
              >
                <span className="rotate-90 lg:rotate-0">→</span>
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

/** Une carte de niveau du parcours. */
function ParcoursCard({ formation }: { formation: Formation }) {
  return (
    <div className="relative flex flex-1 flex-col rounded-card border border-hairline bg-surface p-6 shadow-card">
      {/* Repère « + » de niveau (accent) */}
      <span
        aria-hidden
        className="absolute right-[18px] top-[16px] font-mono text-[15px] leading-none"
        style={{ color: formation.accent }}
      >
        +
      </span>

      {/* Barre de carte (accent) */}
      <span
        aria-hidden
        className="block h-[3px] w-[36px] rounded-full"
        style={{ backgroundColor: formation.accent }}
      />

      <div className="mt-[18px] flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-chip border border-hairline bg-surface px-[10px] py-[5px] font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
          <span
            aria-hidden
            className="h-[8px] w-[8px] flex-none"
            style={{ backgroundColor: formation.accent }}
          />
          {formation.badge}
        </span>
        <span className="font-mono text-[11px] tracking-[0.14em] text-quiet">
          {formation.compteur}
        </span>
      </div>

      <div className="mt-[14px] text-[20px] font-extrabold tracking-[-0.01em]">
        {formation.nom}
      </div>
      <p className="mt-1.5 text-[13.5px] leading-[1.5] text-soft">
        {formation.sousTitre}
      </p>

      <dl className="mt-5 flex flex-col gap-4 border-t border-hairline pt-5">
        <CardField label="Ce que je saurai faire">
          {formation.promesse}
        </CardField>
        <CardField label="Ce que je remporte">{formation.livrable}</CardField>
        <CardField label="Prérequis d'entrée">
          {formation.prerequisEntree}
        </CardField>
      </dl>

      <a
        href={`#${formation.id}`}
        className="mt-6 inline-flex items-center gap-1.5 self-start text-[14px] font-semibold text-ink transition-colors hover:text-canard"
      >
        Voir le déroulé
        <span aria-hidden className="text-[1.05em] leading-none">
          →
        </span>
      </a>
    </div>
  );
}

/** Paire libellé / valeur d'une carte de parcours. */
function CardField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-soft">
        {label}
      </dt>
      <dd className="mt-1.5 text-[14px] leading-[1.55] text-body">{children}</dd>
    </div>
  );
}
