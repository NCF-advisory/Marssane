/**
 * Logo de l'éditeur d'un modèle, rendu monochrome (`currentColor`).
 *
 * Les tracés sont **inlinés** — même parti pris que `video/src/logos.ts`, dont
 * ils sont recopiés (le sous-projet `video/` a son propre `package.json`, on ne
 * peut pas l'importer) : pas de requête supplémentaire, et aucun filtre CSS qui
 * grisserait les bords anti-aliasés.
 *
 * Origine des tracés :
 * - Anthropic, Mistral : paths officiels de `simple-icons` (viewBox 0 0 24 24).
 * - OpenAI : logo officiel (« rotor »), Wikimedia Commons, fichier
 *   « ChatGPT logo.svg » (viewBox 0 0 2406 2406) — un pétale répété par
 *   rotations de 60°.
 *
 * Les éditeurs sans tracé officiel sous la main (Google, DeepSeek, Moonshot,
 * Z.ai, xAI, Alibaba) passent par le **repli typographique** — le nom en Plus
 * Jakarta 800. Aucun `d=` n'est reconstitué de mémoire : ce serait un faux logo.
 */
const SANS = 'var(--font-sans, "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif)';

const CLAUDE_PATH =
  "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z";

const MISTRAL_PATH =
  "M17.143 3.429v3.428h-3.429v3.429h-3.428V6.857H6.857V3.43H3.43v13.714H0v3.428h10.286v-3.428H6.857v-3.429h3.429v3.429h3.429v-3.429h3.428v3.429h-3.428v3.428H24v-3.428h-3.43V3.429z";

const OPENAI_PETAL =
  "M1107.3 299.1c-197.999 0-373.9 127.3-435.2 315.3L650 743.5v427.9c0 21.4 11 40.4 29.4 51.4l344.5 198.515V833.3h.1v-27.9L1372.7 604c33.715-19.52 70.44-32.857 108.47-39.828L1447.6 450.3C1361 353.5 1237.1 298.5 1107.3 299.1zm0 117.5-.6.6c79.699 0 156.3 27.5 217.6 78.4-2.5 1.2-7.4 4.3-11 6.1L952.8 709.3c-18.4 10.4-29.4 30-29.4 51.4V1248l-155.1-89.4V755.8c-.1-187.099 151.601-338.9 339-339.2z";

type Trace = { viewBox: string; paths: { d: string; transform?: string }[] };

/** Tracés officiels disponibles, par éditeur du catalogue. */
const TRACES: Record<string, Trace> = {
  Anthropic: { viewBox: "0 0 24 24", paths: [{ d: CLAUDE_PATH }] },
  Mistral: { viewBox: "0 0 24 24", paths: [{ d: MISTRAL_PATH }] },
  OpenAI: {
    viewBox: "0 0 2406 2406",
    paths: [0, 60, 120, 180, 240, 300].map((a) => ({
      d: OPENAI_PETAL,
      transform: a === 0 ? undefined : `rotate(${a} 1203 1203)`,
    })),
  },
};

type LogoIAProps = {
  /** Éditeur tel qu'il figure au catalogue (« Anthropic », « xAI »…). */
  editeur: string;
  /** Côté du carré occupé par le glyphe — n'importe quelle longueur CSS. */
  size?: string;
  /** Nom accessible du glyphe (en pratique : le nom du modèle). */
  label: string;
};

/**
 * Taille de police du repli, en fraction de la boîte : le nom doit remplir la
 * largeur sans la dépasser (avance moyenne ≈ 0,66 em en Plus Jakarta 800), et
 * les noms très courts (« xAI ») sont plafonnés pour ne pas écraser la tuile.
 */
function fractionPolice(mot: string) {
  return Math.min(0.3, 1 / (0.66 * mot.length));
}

export function LogoIA({ editeur, size = "176px", label }: LogoIAProps) {
  const trace = TRACES[editeur];

  if (trace) {
    return (
      <svg
        role="img"
        aria-label={label}
        viewBox={trace.viewBox}
        width={size}
        height={size}
        fill="currentColor"
        style={{ display: "block" }}
      >
        {trace.paths.map((p, i) => (
          <path key={i} d={p.d} transform={p.transform} />
        ))}
      </svg>
    );
  }

  // Repli typographique — aucun tracé officiel sous la main pour cet éditeur.
  // Un mot pèse moins qu'un glyphe à largeur égale : on lui accorde une boîte
  // un quart plus large pour qu'il occupe la tuile aussi franchement.
  const boite = `calc(${size} * 1.25)`;
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: boite,
        height: size,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: `calc(${boite} * ${fractionPolice(editeur).toFixed(3)})`,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        color: "currentColor",
      }}
    >
      {editeur}
    </span>
  );
}
