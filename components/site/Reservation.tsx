import { Button } from "@/components/ui/Button";
import { controlClass, Field } from "@/components/ui/Field";
import { PlusMark } from "@/components/ui/PlusMark";

/** Options du champ « Métier » (CDC §5.2). */
const METIERS = [
  "Dirigeant de PME",
  "Avocat",
  "Notaire",
  "Expert-comptable",
  "Autre",
];

/**
 * Section « Réservation » (ancre #contact). Reprend la carte du CTA final de la
 * maquette (coins « + », titre surligné canard) et remplace le bouton par le
 * formulaire de pré-inscription F2. Décorations motifFond masquées sous lg.
 */
export function Reservation() {
  return (
    <section
      id="contact"
      className="relative isolate mx-auto max-w-[1180px] px-10 pb-[90px] pt-[100px]"
    >
      {/* Décorations motifFond (décoratives) */}
      <span
        aria-hidden
        className="absolute left-[619.25px] top-0 -z-[1] hidden h-[74px] w-[1.5px] bg-repere lg:block"
      />
      <PlusMark
        variant="turquoise"
        size={25}
        className="absolute left-[620px] top-[88px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />

      <div
        className="relative overflow-hidden rounded-card border border-hairline bg-surface px-6 py-12 text-center sm:px-10 sm:py-14"
        style={{ boxShadow: "0 30px 60px -26px rgba(16,24,40,.25)" }}
      >
        <span className="absolute left-[26px] top-[22px] font-mono text-[15px] leading-none text-repere">
          +
        </span>
        <span className="absolute bottom-[22px] right-[26px] font-mono text-[15px] leading-none text-repere">
          +
        </span>

        <h2 className="text-[32px] font-extrabold leading-[1.06] tracking-[-0.028em] sm:text-[42px]">
          Réservez votre place pour
          <br />
          <span className="inline-block">
            <span className="relative inline-block bg-canard px-[0.26em] pb-[0.05em] pt-0 text-white">
              la prochaine session
              <span
                aria-hidden
                className="absolute right-[-0.62em] top-[-0.5em] text-[0.64em] font-medium leading-none text-turquoise"
              >
                +
              </span>
            </span>
            .
          </span>
        </h2>
        <p className="mx-auto mt-[18px] max-w-[460px] text-[16.5px] leading-[1.55] text-body">
          Formation débutant, une journée, chacun sur son ordinateur. À 17 h,
          votre boîte mail se trie toute seule — parce que vous l&apos;aurez
          construit.
        </p>

        {/* Formulaire de pré-inscription (F2) */}
        <form className="mx-auto mt-9 grid max-w-[640px] grid-cols-1 gap-x-4 gap-y-[18px] text-left sm:grid-cols-2">
          <Field id="f2-prenom" label="Prénom" required>
            <input
              id="f2-prenom"
              name="prenom"
              type="text"
              required
              autoComplete="given-name"
              className={controlClass}
            />
          </Field>
          <Field id="f2-nom" label="Nom" required>
            <input
              id="f2-nom"
              name="nom"
              type="text"
              required
              autoComplete="family-name"
              className={controlClass}
            />
          </Field>
          <Field id="f2-email" label="Email" required>
            <input
              id="f2-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              className={controlClass}
            />
          </Field>
          <Field id="f2-telephone" label="Téléphone" required>
            <input
              id="f2-telephone"
              name="telephone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              className={controlClass}
            />
          </Field>
          <Field id="f2-metier" label="Métier" required>
            <select
              id="f2-metier"
              name="metier"
              required
              defaultValue=""
              className={controlClass}
            >
              <option value="" disabled>
                Sélectionnez…
              </option>
              {METIERS.map((metier) => (
                <option key={metier} value={metier}>
                  {metier}
                </option>
              ))}
            </select>
          </Field>
          <Field id="f2-metier-autre" label="Si « Autre », précisez">
            <input
              id="f2-metier-autre"
              name="metier_autre"
              type="text"
              autoComplete="off"
              className={controlClass}
            />
          </Field>
          <Field
            id="f2-entreprise"
            label="Entreprise / cabinet"
            className="sm:col-span-2"
          >
            <input
              id="f2-entreprise"
              name="entreprise"
              type="text"
              autoComplete="organization"
              className={controlClass}
            />
          </Field>
          <Field id="f2-session" label="Session" required className="sm:col-span-2">
            <input
              id="f2-session"
              name="session"
              type="text"
              readOnly
              required
              value="Prochaine session — date et lieu bientôt annoncés"
              className={`${controlClass} cursor-default bg-toile text-muted`}
            />
          </Field>

          {/* Honeypot anti-spam — inerte, hors écran (F2 · CDC §5.2). */}
          <input
            type="text"
            name="site_web"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <label className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-soft sm:col-span-2">
            <input
              type="checkbox"
              name="consentement"
              required
              className="mt-[3px] h-4 w-4 flex-none accent-canard"
            />
            <span>
              J&apos;accepte que mes données soient utilisées pour ma
              pré-inscription, conformément à la{" "}
              <a
                href="/confidentialite"
                className="text-canard underline hover:text-canard-dark"
              >
                politique de confidentialité
              </a>
              .
            </span>
          </label>

          <div className="sm:col-span-2">
            <Button
              variant="primary"
              arrow
              className="px-[30px] py-4 text-[16.5px]"
            >
              Réserver ma place
            </Button>
          </div>
        </form>

        <div className="mt-4 text-[13px] text-soft">
          10 places par session · pré-inscription sans engagement · réponse sous
          48 h.
        </div>
      </div>
    </section>
  );
}
