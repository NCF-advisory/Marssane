import Image from "next/image";
import { Chevron } from "@/components/ui/Chevron";
import { Kicker } from "@/components/ui/Kicker";

// Source : https://groupe.novances.fr/le-groupe/qui-sommes-nous/
// Consultation du 17 septembre 2026 ; le CA consolidé porte sur 2025.
const CHIFFRES = [
  { valeur: "40 M€", label: "de CA consolidé en 2025" },
  { valeur: "350+", label: "collaborateurs" },
  { valeur: "8 000+", label: "clients accompagnés" },
  { valeur: "17", label: "bureaux en France" },
];

export function PartenaireNovances() {
  return (
    <section id="novances" aria-labelledby="novances-titre" className="scroll-mt-16 pb-2 pt-12">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        <div className="border-y border-line-sur-ink py-9 sm:py-11">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <a
              href="https://novances.fr"
              target="_blank"
              rel="noopener"
              aria-label="Découvrir le Groupe Novances (nouvel onglet)"
              className="flex h-[92px] w-[216px] shrink-0 items-center justify-center rounded-[6px] bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquoise"
            >
              <Image
                src="/img/partenaires/novances.png"
                alt="Groupe Novances"
                width={500}
                height={188}
                sizes="176px"
                className="h-auto w-[176px]"
              />
            </a>
            <div className="min-w-0">
              <Kicker className="text-turquoise!">Notre partenaire</Kicker>
              <h2 id="novances-titre" className="mt-3 text-[28px] font-extrabold leading-[1.15] text-fort sm:text-[34px]">
                Le Groupe Novances
              </h2>
              <p className="mt-3 max-w-[640px] text-[15.5px] leading-[1.65] text-body-sur-ink">
                Marssane est partenaire d’un groupe de conseil qui accompagne
                les dirigeants dans toutes les dimensions de leur entreprise :
                finance, expertise comptable, juridique et transformation digitale.
              </p>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line-sur-ink pt-7 lg:grid-cols-4 lg:gap-x-8">
            {CHIFFRES.map(({ valeur, label }) => (
              <div key={label} className="flex min-w-0 flex-col gap-2">
                <dt className="order-2 text-[13px] leading-[1.5] text-body-sur-ink">{label}</dt>
                <dd className="text-[30px] font-extrabold leading-none text-fort sm:text-[38px]">{valeur}</dd>
              </div>
            ))}
          </dl>

          <a
            href="https://novances.fr"
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex min-h-11 items-center gap-3 text-[14px] font-semibold text-turquoise transition-colors hover:text-fort focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquoise"
          >
            Découvrir le groupe sur novances.fr
            <Chevron />
          </a>
        </div>
      </div>
    </section>
  );
}
