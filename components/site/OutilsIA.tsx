import type { ReactNode } from "react";
import { BadgeEcume } from "@/components/ui/BadgeEcume";
import { Kicker } from "@/components/ui/Kicker";
import { PlusMark } from "@/components/ui/PlusMark";

/* ============================== Logos (inline) ==============================
 * Marques déposées de leurs propriétaires, employées à titre nominatif pour
 * désigner les produits — aucune affiliation ni endossement suggéré.
 * Versions couleur officielles, inline et aria-hidden : le nom de l'outil est
 * écrit en toutes lettres à côté.
 *   • ChatGPT : mark OpenAI (@lobehub/icons-static-svg, MIT), nativement noir
 *     et sans variante couleur officielle ; teinté ici au vert produit ChatGPT
 *     #19C37D (COLOR_GPT_3 de @lobehub/icons).
 *   • Claude : sunburst terracotta #D97757 (@lobehub/icons-static-svg, MIT ;
 *     hex confirmé par Simple Icons, CC0).
 *   • Mistral : mark multicolore 5 bandes (@lobehub/icons-static-svg, MIT ;
 *     Simple Icons, CC0).
 *   • GLM : mark couleur ChatGLM (Zhipu / Z.ai), dégradé #504AF4 → #3485FF
 *     (@lobehub/icons-static-svg, MIT). L'id du dégradé est préfixé
 *     `logo-` pour éviter toute collision d'id dans la page.
 * -------------------------------------------------------------------------- */

/** viewBox commun 24×24, rendu à 26 px. `className` porte la teinte éventuelle. */
function LogoSvg({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-[26px] w-[26px] flex-none${className ? ` ${className}` : ""}`}
    >
      {children}
    </svg>
  );
}

function LogoChatGPT() {
  return (
    <LogoSvg className="text-[#19C37D]">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"
      />
    </LogoSvg>
  );
}

function LogoClaude() {
  return (
    <LogoSvg>
      <path
        fill="#D97757"
        fillRule="nonzero"
        d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
      />
    </LogoSvg>
  );
}

function LogoMistral() {
  return (
    <LogoSvg>
      <path
        fill="gold"
        d="M3.428 3.4h3.429v3.428H3.428V3.4zm13.714 0h3.43v3.428h-3.43V3.4z"
      />
      <path
        fill="#FFAF00"
        d="M3.428 6.828h6.857v3.429H3.429V6.828zm10.286 0h6.857v3.429h-6.857V6.828z"
      />
      <path fill="#FF8205" d="M3.428 10.258h17.144v3.428H3.428v-3.428z" />
      <path
        fill="#FA500F"
        d="M3.428 13.686h3.429v3.428H3.428v-3.428zm6.858 0h3.429v3.428h-3.429v-3.428zm6.856 0h3.43v3.428h-3.43v-3.428z"
      />
      <path
        fill="#E10500"
        d="M0 17.114h10.286v3.429H0v-3.429zm13.714 0H24v3.429H13.714v-3.429z"
      />
    </LogoSvg>
  );
}

function LogoGLM() {
  return (
    <LogoSvg>
      <defs>
        <linearGradient
          id="logo-chatglm-gradient"
          x1="-18.756%"
          x2="70.894%"
          y1="49.371%"
          y2="90.944%"
        >
          <stop offset="0%" stopColor="#504AF4" />
          <stop offset="100%" stopColor="#3485FF" />
        </linearGradient>
      </defs>
      <path
        fill="url(#logo-chatglm-gradient)"
        fillRule="evenodd"
        d="M9.917 2c4.906 0 10.178 3.947 8.93 10.58-.014.07-.037.14-.057.21l-.003-.277c-.083-3-1.534-8.934-8.87-8.934-3.393 0-8.137 3.054-7.93 8.158-.04 4.778 3.555 8.4 7.95 8.332l.073-.001c1.2-.033 2.763-.429 3.1-1.657.063-.031.26.534.268.598.048.256.112.369.192.34.981-.348 2.286-1.222 1.952-2.38-.176-.61-1.775-.147-1.921-.347.418-.979 2.234-.926 3.153-.716.443.102.657.38 1.012.442.29.052.981-.2.96.242-1.5 3.042-4.893 5.41-8.808 5.41C3.654 22 0 16.574 0 11.737 0 5.947 4.959 2 9.917 2zM9.9 5.3c.484 0 1.125.225 1.38.585 3.669.145 4.313 2.686 4.694 5.444.255 1.838.315 2.3.182 1.387l.083.59c.068.448.554.737.982.516.144-.075.254-.231.328-.47a.2.2 0 01.258-.13l.625.22a.2.2 0 01.124.238 2.172 2.172 0 01-.51.92c-.878.917-2.757.664-3.08-.62-.14-.554-.055-.626-.345-1.242-.292-.621-1.238-.709-1.69-.295-.345.315-.407.805-.406 1.282L12.6 15.9a.9.9 0 01-.9.9h-1.4a.9.9 0 01-.9-.9v-.65a1.15 1.15 0 10-2.3 0v.65a.9.9 0 01-.9.9H4.8a.9.9 0 01-.9-.9l.035-3.239c.012-1.884.356-3.658 2.47-4.134.2-.045.252.13.29.342.025.154.043.252.053.294.701 3.058 1.75 4.299 3.144 3.722l.66-.331.254-.13c.158-.082.25-.131.276-.15.012-.01-.165-.206-.407-.464l-1.012-1.067a8.925 8.925 0 01-.199-.216c-.047-.034-.116.068-.208.306-.074.157-.251.252-.272.326-.013.058.108.298.362.72.164.288.22.508-.31.343-1.04-.8-1.518-2.273-1.684-3.725-.004-.035-.162-1.913-.162-1.913a1.2 1.2 0 011.113-1.281L9.9 5.3zm12.994 8.68c.037.697-.403.704-1.213.591l-1.783-.276c-.265-.053-.385-.099-.313-.147.47-.315 3.268-.93 3.31-.168zm-.915-.083l-.926.042c-.85.077-1.452.24.338.336l.103.003c.815.012 1.264-.359.485-.381zm1.667-3.601h.01c.79.398.067 1.03-.65 1.393-.14.07-.491.176-1.052.315-.241.04-.457.092-.333.16l.01.005c1.952.958-3.123 1.534-2.495 1.285l.38-.148c.68-.266 1.614-.682 1.666-1.337.038-.48 1.253-.442 1.493-.968.048-.106 0-.236-.144-.389-.05-.047-.094-.094-.107-.148-.073-.305.7-.431 1.222-.168zm-2.568-.474c-.135 1.198-2.479 4.192-1.949 2.863l.017-.042c.298-.717.376-2.221 1.337-3.221.25-.26.636.035.595.4zm-7.976-.253c.02-.694 1.002-.968 1.346-.347.01-1.274-1.941-.768-1.346.347z"
      />
    </LogoSvg>
  );
}

/**
 * Les quatre assistants présentés en repères. Nom 17px, éditeur/pays en mono,
 * une phrase à 13,5px. `badge` (Claude) affiche « Utilisé en formation ».
 * `brandHex` teinte la tuile du logo (~10 %) — rappel décoratif de la marque.
 */
const OUTILS: {
  nom: string;
  editeur: string;
  texte: string;
  logo: ReactNode;
  brandHex: string;
  badge?: boolean;
}[] = [
  {
    nom: "ChatGPT",
    editeur: "OpenAI · États-Unis",
    logo: <LogoChatGPT />,
    brandHex: "#19C37D",
    texte:
      "Celui qui a fait découvrir l'IA au grand public. Le plus utilisé au monde.",
  },
  {
    nom: "Claude",
    editeur: "Anthropic · États-Unis",
    logo: <LogoClaude />,
    brandHex: "#D97757",
    badge: true,
    texte:
      "Considéré comme l'IA la plus adoptée en entreprise. Rédaction soignée, sérieux sur les documents longs — c'est lui que vous installerez.",
  },
  {
    nom: "Mistral",
    editeur: "Mistral AI · France",
    logo: <LogoMistral />,
    brandHex: "#FA520F",
    texte:
      "L'acteur français, avec son assistant Le Chat. Une alternative européenne, adoptée par des administrations et des entreprises.",
  },
  {
    nom: "GLM",
    editeur: "Z.ai · Chine",
    logo: <LogoGLM />,
    brandHex: "#4268FA",
    texte:
      "L'un des grands modèles « ouverts » : son moteur peut s'installer sur vos propres serveurs.",
  },
];

/**
 * Section « Les outils » (ancre #outils, hors nav) : intro (kicker, H2 38px,
 * chapo) puis grille de 4 cartes assistants IA (4 → 2 → 1 colonnes) et une
 * phrase de clôture rappelant que la formation se fait sur Claude.
 * Les décorations motifFond prolongent le trajet de mesure ; décoratives et
 * masquées sous lg (positions absolues en px qui déborderaient sur mobile).
 */
export function OutilsIA() {
  return (
    <section
      id="outils"
      className="relative isolate mx-auto max-w-[1180px] px-10 pb-2 pt-[84px]"
    >
      {/* Décorations motifFond (décoratives) */}
      <span
        aria-hidden
        className="absolute left-[15.25px] top-0 -z-[1] hidden h-[48px] w-[1.5px] bg-repere lg:block"
      />
      {/* Prolonge le trait continu à x=778.25px entre « Pour qui » et « La formation ». */}
      <span
        aria-hidden
        className="absolute bottom-0 left-[778.25px] top-0 -z-[1] hidden w-[1.5px] bg-repere lg:block"
      />
      <PlusMark
        variant="turquoise"
        size={19}
        className="absolute left-[15px] top-[60px] -z-[1] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      />
      <PlusMark
        size={16}
        className="absolute right-[90px] top-[60px] hidden lg:block"
      />

      <div className="max-w-[640px]">
        <Kicker>Les outils · repères</Kicker>
        <h2 className="mt-[14px] text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[38px]">
          Quatre noms à connaître. Un seul suffit pour commencer.
        </h2>
        <p className="mt-[14px] text-[16.5px] leading-[1.58] text-body">
          ChatGPT, Claude, Mistral, GLM… Derrière les noms, le même principe :
          un assistant qui lit vos documents, résume et rédige. Repères en
          quatre lignes.
        </p>
      </div>

      <div className="mt-[34px] grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
        {OUTILS.map((o) => (
          <article
            key={o.nom}
            className="flex flex-col rounded-card border border-hairline bg-surface p-6 shadow-card"
          >
            <div className="flex items-center gap-[11px]">
              <span
                aria-hidden
                className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[10px]"
                style={{ backgroundColor: `${o.brandHex}1a` }}
              >
                {o.logo}
              </span>
              <div className="text-[17px] font-bold leading-none tracking-[-0.01em]">
                {o.nom}
              </div>
            </div>
            <div className="mt-[10px] font-mono text-[10.5px] text-soft">
              {o.editeur}
            </div>
            {o.badge && (
              <div className="mt-3">
                <BadgeEcume>Utilisé en formation</BadgeEcume>
              </div>
            )}
            <p className="mt-3 text-[13.5px] leading-[1.55] text-muted">
              {o.texte}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-[26px] max-w-[640px] text-[16.5px] leading-[1.58] text-body">
        Les réflexes que vous apprendrez — confier une tâche, vérifier la
        source, automatiser — valent pour les quatre.{" "}
        <b className="font-semibold text-ink">La formation se fait sur Claude.</b>
      </p>
    </section>
  );
}
