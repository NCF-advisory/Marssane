"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/** Une étape de la frise. `href` mène au détail du niveau (ou à /implementation). */
type Etape = { repere: string; nom: string; promesse: string; href: string };

/** Les quatre étapes du chemin complet, dans l'ordre. Les libellés des trois
 *  niveaux sont ceux de NIVEAUX (@/lib/niveaux), repris à l'identique. */
const ETAPES: Record<string, Etape> = {
  debutant: {
    repere: "01",
    nom: "Débutant",
    promesse: "Prendre en main l'IA au quotidien",
    href: "/formations#debutant",
  },
  confirme: {
    repere: "02",
    nom: "Confirmé",
    promesse: "Structurer ses usages et gagner du temps",
    href: "/formations#confirme",
  },
  expert: {
    repere: "03",
    nom: "Expert",
    promesse: "Construire son propre outil, de A à Z",
    href: "/formations#expert",
  },
  implementation: {
    repere: "→",
    nom: "Implémentation sur mesure",
    promesse: "L'outil dont vous avez besoin, construit avec vous",
    href: "/implementation",
  },
};

/** Les deux entrées par profil : chacune montre SON chemin. */
const CHEMINS: {
  id: string;
  onglet: string;
  etapes: Etape[];
  note?: string;
}[] = [
  {
    id: "debutant",
    onglet: "Je n'ai jamais utilisé l'IA",
    etapes: [
      ETAPES.debutant,
      ETAPES.confirme,
      ETAPES.expert,
      ETAPES.implementation,
    ],
  },
  {
    id: "initie",
    onglet: "J'utilise déjà ChatGPT ou Claude",
    etapes: [ETAPES.confirme, ETAPES.expert, ETAPES.implementation],
    note: "Vous préférez reprendre les bases ? Le niveau 01 · Débutant reste la bonne porte d'entrée.",
  },
];

/**
 * Section « Le parcours » : deux entrées par profil (onglets ARIA) qui affichent
 * chacune leur chemin, en frise horizontale à partir de lg et verticale en
 * dessous. Chaque étape mène au détail du niveau correspondant.
 *
 * Les onglets suivent le motif ARIA « tabs » avec sélection manuelle : tabindex
 * mobile (seul l'onglet actif est tabulable), flèches gauche/droite pour passer
 * de l'un à l'autre, Origine/Fin pour aller au premier ou au dernier.
 */
export function Parcours() {
  const [actif, setActif] = useState(0);
  const idBase = useId();
  const boutons = useRef<(HTMLButtonElement | null)[]>([]);

  const naviguer = (index: number) => {
    setActif(index);
    boutons.current[index]?.focus();
  };

  const auClavier = (e: React.KeyboardEvent) => {
    const dernier = CHEMINS.length - 1;
    if (e.key === "ArrowRight") naviguer(actif === dernier ? 0 : actif + 1);
    else if (e.key === "ArrowLeft") naviguer(actif === 0 ? dernier : actif - 1);
    else if (e.key === "Home") naviguer(0);
    else if (e.key === "End") naviguer(dernier);
    else return;
    e.preventDefault();
  };

  const chemin = CHEMINS[actif];

  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      {/* Décoration motifFond (décorative) */}
      <PlusMark
        variant="grey-sur-ink"
        size={16}
        className="absolute right-[90px] top-[60px] hidden lg:block"
      />

      <div data-apparition="" className="max-w-[680px]">
        <Kicker className="text-faint-sur-ink!">
          Le parcours · par où commencer
        </Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Votre chemin dépend d&apos;où vous{" "}
          <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
            en êtes
          </span>
          .
        </h2>
      </div>

      <div
        data-apparition=""
        style={{ ["--apparition-delai" as string]: "150ms" }}
        className="mt-[26px]"
      >
        {/* Onglets : pleine largeur en colonne sous sm (les deux libellés ne
            tiennent pas côte à côte à 320 px), en ligne dès sm. `min-h-11`
            garantit les 44 px de cible tactile. */}
        <div
          role="tablist"
          aria-label="Votre point de départ"
          onKeyDown={auClavier}
          className="flex flex-col gap-2 sm:inline-flex sm:flex-row sm:rounded-btn sm:border sm:border-line-sur-ink sm:p-1"
        >
          {CHEMINS.map((c, i) => {
            const selectionne = i === actif;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  boutons.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${idBase}-onglet-${c.id}`}
                aria-selected={selectionne}
                // Un seul panneau est rendu à la fois (celui du chemin actif) :
                // les deux onglets pointent donc sur le même identifiant.
                aria-controls={`${idBase}-panneau`}
                tabIndex={selectionne ? 0 : -1}
                onClick={() => setActif(i)}
                className={`min-h-11 cursor-pointer rounded-btn border px-5 py-2.5 text-left text-[14.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise sm:border-0 sm:text-center ${
                  selectionne
                    ? "border-transparent bg-canard text-white"
                    : "border-line-sur-ink text-body-sur-ink hover:text-white"
                }`}
              >
                {c.onglet}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${idBase}-panneau`}
          aria-labelledby={`${idBase}-onglet-${chemin.id}`}
          tabIndex={0}
          className="mt-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquoise"
        >
          {/* Frise : colonne sous lg (les cartes s'empilent, le connecteur passe
              à la verticale), ligne répartie à partir de lg. */}
          <ol className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
            {chemin.etapes.map((etape, i) => (
              <li
                key={etape.nom}
                className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center"
              >
                {i > 0 && <Fleche />}
                <Link
                  href={etape.href}
                  className="flex h-full flex-col rounded-card border border-line-sur-ink bg-surface-sur-ink px-5 py-[18px] transition-[border-color,transform] duration-300 ease-out hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquoise motion-safe:hover:-translate-y-1 lg:flex-1"
                >
                  {/* Le canard manque de contraste sur l'encre : repères en
                      turquoise. */}
                  <span className="font-mono text-[11px] font-semibold text-turquoise">
                    {etape.repere}
                  </span>
                  <span className="mt-[10px] text-[16px] font-bold leading-[1.3] tracking-[-0.01em]">
                    {etape.nom}
                  </span>
                  <span className="mt-1.5 text-[13.5px] leading-[1.5] text-body-sur-ink">
                    {etape.promesse}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {chemin.note && (
            <p className="mt-4 text-[14px] leading-[1.55] text-faint-sur-ink">
              {chemin.note}{" "}
              <Link
                href="/formations#debutant"
                className="font-semibold text-turquoise transition-colors hover:text-white"
              >
                Voir le niveau 01
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Connecteur entre deux étapes : vers le bas quand la frise est empilée, vers
 *  la droite dès qu'elle passe en ligne. Décoratif. */
function Fleche() {
  return (
    <span
      aria-hidden
      className="flex items-center justify-center py-1 font-mono text-[13px] leading-none text-faint-sur-ink lg:px-3 lg:py-0"
    >
      <span className="lg:hidden">↓</span>
      <span className="hidden lg:inline">→</span>
    </span>
  );
}
