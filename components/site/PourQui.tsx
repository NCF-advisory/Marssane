import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/** Les professions visées. Titre 17px, sous-titre mono, paragraphe 13,5px. */
const PROFESSIONS = [
  {
    titre: "Dirigeants de PME et TPE",
    sousTitre: "industrie · services · négoce",
    texte:
      "Mails, courriers, suivi des dossiers : reprenez la main sur votre journée, sans recruter.",
  },
  {
    titre: "Entrepreneurs",
    sousTitre: "indépendants · créateurs · startups",
    texte:
      "Devis, relances, administratif : abattez les tâches chronophages et gardez votre temps pour développer.",
  },
];

/**
 * Section « Pour qui » : intro (kicker, H2 38px, paragraphe confidentialité)
 * et grille de 4 cartes professions (4 → 2 → 1 colonnes).
 * Les décorations motifFond prolongent le trajet de mesure ; décoratives et
 * masquées sous lg (positions absolues en px qui déborderaient sur mobile).
 */
export function PourQui() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[84px]">
      {/* Décorations motifFond (décoratives) */}
      <span
        aria-hidden
        className="absolute left-[546.25px] top-0 -z-[1] hidden h-[44px] w-[1.5px] bg-repere lg:block"
      />
      <span
        aria-hidden
        className="absolute left-[558px] top-[43.25px] -z-[1] hidden h-[1.5px] w-[210px] lg:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,#C4CBD2 0 8px,rgba(196,203,210,0) 8px 15px)",
        }}
      />
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[779px] top-[44px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-[778.25px] top-[55px] -z-[1] hidden w-[1.5px] bg-repere lg:block"
      />
      <PlusMark
        size={16}
        className="absolute right-[90px] top-[60px] hidden lg:block"
      />

      <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2">
        <div className="max-w-[640px]">
          <Kicker>Pour qui</Kicker>
          <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
            Vous partez deux semaines, tout{" "}
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              s&apos;arrête
            </span>{" "}
            ?
          </h2>
          <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body">
            La confidentialité n&apos;est pas une option chez vous : elle est
            traitée dès la première heure de formation.
          </p>
        </div>

        <div className="lg:justify-self-end">
          <ToutPasseParVous />
        </div>
      </div>

      <div className="mt-[34px] grid grid-cols-1 gap-[22px] sm:grid-cols-2">
        {PROFESSIONS.map((p) => (
          <article
            key={p.titre}
            className="rounded-card border border-hairline bg-surface p-6 shadow-card"
          >
            <div className="text-[17px] font-bold tracking-[-0.01em]">{p.titre}</div>
            <div className="mt-1 font-mono text-[10.5px] text-soft">{p.sousTitre}</div>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-muted">{p.texte}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Chips « ce qui passe par vous », posées en couronne autour de la pastille
 *  sur desktop (positions absolues, coordonnées alignées sur le viewBox du SVG),
 *  et empilées en flux centré sous lg. Positions en classes littérales pour que
 *  le scanner Tailwind les voie. */
const CHIPS: { label: string; tone: string; pos: string }[] = [
  { label: "Devis", tone: "bg-toile text-slate", pos: "lg:left-[90px] lg:top-[80px]" },
  { label: "Mails", tone: "bg-ecume text-ink-ecume", pos: "lg:left-[330px] lg:top-[80px]" },
  { label: "Relances", tone: "bg-periwinkle text-ink-periwinkle", pos: "lg:left-[35px] lg:top-[190px]" },
  { label: "Banque", tone: "bg-toile text-slate", pos: "lg:left-[385px] lg:top-[190px]" },
  { label: "Client mécontent", tone: "bg-ecume text-ink-ecume", pos: "lg:left-[90px] lg:top-[300px]" },
  { label: "Embauche", tone: "bg-periwinkle text-ink-periwinkle", pos: "lg:left-[330px] lg:top-[300px]" },
];

/**
 * Composition « tout passe par vous » : une pastille centrale « VOUS » (canard)
 * reliée par de fins traits pointillés canard à six chips (devis, mails…).
 * Décorative (aria-hidden) + texte sr-only. Bornée à 420×380 sur lg, flux
 * empilé centré sous lg (rien ne déborde à 360px).
 */
function ToutPasseParVous() {
  return (
    <div className="relative">
      <span className="sr-only">
        Illustration : toutes les décisions de l&apos;entreprise convergent vers
        le dirigeant.
      </span>
      <div
        aria-hidden
        className="relative mx-auto flex max-w-full flex-col items-center gap-6 lg:block lg:h-[380px] lg:w-[420px]"
      >
        {/* Traits pointillés canard (desktop) reliant le centre à chaque chip. */}
        <svg
          viewBox="0 0 420 380"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          fill="none"
          stroke="#0E7291"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1 6"
          opacity="0.55"
        >
          <line x1="210" y1="190" x2="90" y2="80" />
          <line x1="210" y1="190" x2="330" y2="80" />
          <line x1="210" y1="190" x2="35" y2="190" />
          <line x1="210" y1="190" x2="385" y2="190" />
          <line x1="210" y1="190" x2="90" y2="300" />
          <line x1="210" y1="190" x2="330" y2="300" />
        </svg>

        {/* Pastille centrale « VOUS ». */}
        <span
          className="inline-flex h-[76px] w-[76px] flex-none items-center justify-center rounded-full bg-canard font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-cta lg:absolute lg:left-[210px] lg:top-[190px] lg:z-[3] lg:-translate-x-1/2 lg:-translate-y-1/2"
        >
          Vous
        </span>

        {/* Chips (couronne sur lg, flux empilé sous lg via lg:contents). */}
        <div className="flex flex-wrap justify-center gap-2 lg:contents">
          {CHIPS.map((chip) => (
            <span
              key={chip.label}
              className={`whitespace-nowrap rounded-chip border border-hairline px-[10px] py-[5px] font-mono text-[10.5px] shadow-card lg:absolute lg:z-[2] lg:-translate-x-1/2 lg:-translate-y-1/2 ${chip.tone} ${chip.pos}`}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
