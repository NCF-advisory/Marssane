import { CheckItem } from "@/components/ui/CheckItem";
import { Chevron } from "@/components/ui/Chevron";
import { KickerPill } from "@/components/ui/KickerPill";
import { PlusMark } from "@/components/ui/PlusMark";
import { ReservationTrigger } from "./ReservationTrigger";

/**
 * Les cinq lignes du quotidien qui changent après la formation. Reprises des
 * cas concrets vus plus haut, cette fois en deux colonnes.
 */
const PAIRES: { sans: string; apres: string }[] = [
  {
    sans: "47 mails non triés chaque matin",
    apres: "6 mails à traiter, le reste classé",
  },
  {
    sans: "Le devis part à 22 h",
    apres: "Le devis chiffré part entre deux rendez-vous",
  },
  {
    sans: "Les relances attendent le vendredi soir",
    apres: "Elles partent seules, vous validez",
  },
  {
    sans: "Un abonnement IA qui dort",
    apres: "Des automatismes qui tournent sur votre poste",
  },
  {
    sans: "Le doute sur ce que l'IA peut voir de vos données",
    apres: "Vous savez quoi confier, quoi garder",
  },
];

/**
 * Section « Comparatif avant / après » (seule section de sa bande claire) : le
 * format deux colonnes de 8lab (« Ce qui sépare une marque qui dure d'une
 * boutique de plus ») — H2 à gauche, CTA à droite du titre, puis
 * colonne « Sans » (rangées × au contour discret, texte atténué) face à la
 * colonne « Avec » (rangées ✓ sur cartes blanches pleines). L'asymétrie
 * visuelle — terne contre blanc franc — porte le message.
 *
 * Sous md, les deux colonnes s'empilent : « Sans » d'abord, « Avec » ensuite,
 * dans l'ordre de lecture du récit.
 */
export function AvantApres() {
  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-6 pb-2 pt-[84px] sm:px-10">
      {/* Décoration motifFond (décorative) */}
      <PlusMark
        variant="grey-sur-ink"
        size={16}
        className="absolute right-[130px] top-[62px] hidden lg:block"
      />

      <div
        data-apparition=""
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-[640px]">
          <KickerPill>Avant / après</KickerPill>
          <h2 className="mt-[20px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
            Ce qui{" "}
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              change
            </span>{" "}
            après les deux demi-journées.
          </h2>
        </div>
        {/* CTA à droite du titre, comme le « Rejoindre maintenant » du modèle —
            mais dans la charte : bouton canard, pas de point vert. */}
        <ReservationTrigger className="inline-flex min-h-11 flex-none items-center gap-[13px] self-start rounded-btn bg-canard py-[15px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-white shadow-cta transition-[background-color] duration-[180ms] ease-out hover:bg-canard-dark lg:self-auto">
          Réserver ma place
          <Chevron />
        </ReservationTrigger>
      </div>

      <div className="mt-[34px] grid grid-cols-1 gap-9 md:grid-cols-2 md:gap-8">
        {/* Colonne « Sans » : rangées ternes, contour discret. */}
        <div data-apparition="">
          <h3 className="text-[16px] font-bold tracking-[-0.01em]">
            Sans la formation
          </h3>
          <p className="mt-2 text-[15px] leading-[1.55] text-body-sur-ink">
            Chaque tâche répétitive reste la vôtre, soir après soir.
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {PAIRES.map((paire) => (
              <li
                key={paire.sans}
                className="flex items-center gap-3 rounded-card border border-line-sur-ink px-5 py-[15px] text-[14.5px] leading-[1.5] text-faint-sur-ink"
              >
                {/* Anneau creux, à l'opposé de la pastille ✓ pleine d'en face. */}
                <span
                  aria-hidden
                  className="inline-flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full border border-line-sur-ink text-[11px] font-bold"
                >
                  ×
                </span>
                <span>{paire.sans}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne « Avec » : rangées affirmées sur cartes pleines. */}
        <div
          data-apparition=""
          style={{ ["--apparition-delai" as string]: "150ms" }}
        >
          <h3 className="text-[16px] font-bold tracking-[-0.01em]">
            Avec Marssane
          </h3>
          <p className="mt-2 text-[15px] leading-[1.55] text-body-sur-ink">
            Un système construit par vous, qui tourne dès la deuxième session.
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {PAIRES.map((paire) => (
              <li
                key={paire.apres}
                className="rounded-card border border-line-sur-ink bg-surface-sur-ink px-5 py-[15px]"
              >
                {/* Cette section traverse les deux tonalités (bande claire) :
                    la pastille passe par les tokens `--color-check-*`, que
                    `.sur-toile` repose sur l'écume pleine. */}
                <CheckItem
                  className="font-semibold"
                  dotBg="var(--color-check-bg)"
                  dotText="var(--color-check-mark)"
                >
                  {paire.apres}
                </CheckItem>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
