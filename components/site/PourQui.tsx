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
