import type { Modele } from "./models";

/**
 * Connecteur AA : Artificial Analysis (source premium, DÉSACTIVABLE).
 *
 * Si `AA_API_KEY` est absente, `fetchArtificialAnalysis` retourne un tableau
 * vide SANS erreur (la source est simplement ignorée). Si la clé est présente :
 *   GET https://artificialanalysis.ai/api/v2/data/llms/models
 *   header `x-api-key: <clé>` (et non `Authorization: Bearer`, qui répond 401).
 *
 * ATTENTION : `/api/v2/language/models` (et `/api/v2/language/models/{slug}`)
 * exigent un abonnement Pro et répondent 403. Ne pas y revenir. L'endpoint
 * `/api/v2/data/llms/models` ci-dessus est accessible avec une clé gratuite et
 * renvoie l'ensemble du catalogue (~586 entrées au 2026-07-27).
 *
 * Enveloppe de réponse : `{ status, prompt_options, data: [...] }`.
 * Champs exploités par modèle (imbriqués, vérifié le 2026-07-27) :
 *   - `evaluations.artificial_analysis_intelligence_index` (indice ~0-100) ;
 *   - `pricing.price_1m_input_tokens` / `pricing.price_1m_output_tokens`
 *     ($/million). On les lit séparément : le mélange entrée/sortie est fait
 *     par aggregate.ts avec ses propres poids (le `price_1m_blended_3_to_1`
 *     d'AA est volontairement ignoré) ;
 *   - le niveau d'effort n'a PAS de champ dédié : il est encodé entre
 *     parenthèses dans `name` (« GPT-5.4 (xhigh) », « Claude Opus 5 (Adaptive
 *     Reasoning, Max Effort) ») et extrait ici de façon informative ;
 *   - `median_time_to_first_answer_token` (secondes, À LA RACINE de l'entrée) :
 *     temps de réflexion avant la première réponse (cf. `latenceDepuis`).
 *
 * Chaque variante d'effort est une entrée distincte, avec son propre `slug`
 * unique (`claude-opus-5`, `-high`, `-medium`…) ; le slug nu correspond à
 * l'effort Max. Un modèle sans `aaSlug` est simplement ignoré par ce connecteur
 * (aucune donnée AA écrite pour lui).
 */

const URL_AA = "https://artificialanalysis.ai/api/v2/data/llms/models";

/** Intelligence + coût + effort + latence d'un modèle, mesurés par Artificial Analysis. */
export type IntelCoutAA = {
  modelKey: string;
  /** Indice d'intelligence AA (~0-100). */
  intelligence: number | null;
  inputUsdM: number | null;
  outputUsdM: number | null;
  /** Niveau d'effort de la variante mesurée (high / xhigh / max…). */
  effort: string | null;
  /** Temps de réflexion avant la première réponse, en secondes ; null si non mesuré. */
  latenceS: number | null;
};

type ModeleAA = {
  slug?: string;
  id?: string;
  name?: string;
  evaluations?: { artificial_analysis_intelligence_index?: number | null };
  pricing?: {
    price_1m_input_tokens?: number | null;
    price_1m_output_tokens?: number | null;
  };
  median_time_to_first_answer_token?: number | null;
  median_output_tokens_per_second?: number | null;
};

function nombreOuNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/**
 * Latence de réflexion, en secondes — PIÈGE NON ÉVIDENT.
 *
 * AA renvoie `median_time_to_first_answer_token = 0` pour les modèles qu'il n'a
 * pas chronométrés : au 2026-07-27, 421 des 586 entrées sont dans ce cas, et
 * elles ont TOUTES `median_output_tokens_per_second = 0` en même temps. Un 0 sur
 * les deux champs signifie donc « non mesuré », pas « instantané » (aucun modèle
 * ne répond en 0 s). D'où la règle : latence 0 ET débit 0 → `null`. Ne jamais
 * tester la latence seule, sous peine de décerner une réactivité parfaite à un
 * modèle simplement absent des mesures de performance.
 */
function latenceDepuis(m: ModeleAA): number | null {
  const latence = nombreOuNull(m.median_time_to_first_answer_token);
  const debit = nombreOuNull(m.median_output_tokens_per_second);
  if (latence == null) return null;
  if (latence === 0 && (debit == null || debit === 0)) return null;
  return latence;
}

/**
 * Extrait le niveau d'effort du nom AA, seul endroit où il figure. Dans les
 * parenthèses finales, on retient le segment qui mentionne « effort », sinon le
 * dernier ; le mot « effort » est ôté et le reste passé en minuscules :
 *   « GPT-5.4 (xhigh) » → `xhigh`
 *   « Claude Opus 5 (Adaptive Reasoning, Max Effort) » → `max`
 *   « Claude Fable 5 (Adaptive Reasoning, Max Effort, Opus 4.8 Fallback) » → `max`
 * `null` si le nom n'a pas de parenthèses ou que rien d'exploitable n'en sort.
 */
function effortDepuisNom(nom: unknown): string | null {
  if (typeof nom !== "string") return null;
  const parentheses = nom.match(/\(([^)]*)\)\s*$/);
  if (!parentheses) return null;
  const segments = parentheses[1].split(",");
  const segment =
    segments.find((s) => /\beffort\b/i.test(s)) ?? segments[segments.length - 1];
  const effort = segment.toLowerCase().replace(/\beffort\b/g, "").trim();
  return effort || null;
}

/**
 * Récupère intelligence + coût AA des modèles suivis ayant un `aaSlug`.
 * Retourne `[]` si `AA_API_KEY` est absente (source inactive) ou si la réponse
 * est vide/mal formée. Lève uniquement sur erreur réseau/HTTP réelle quand la
 * clé est présente (la route de refresh rattrape par source).
 */
export async function fetchArtificialAnalysis(
  modeles: Modele[],
): Promise<IntelCoutAA[]> {
  const cle = process.env.AA_API_KEY;
  if (!cle) return []; // source inactive, sans bruit

  const reponse = await fetch(URL_AA, {
    headers: { "x-api-key": cle, accept: "application/json" },
  });
  if (!reponse.ok) {
    throw new Error(`Artificial Analysis a répondu ${reponse.status}`);
  }
  const donnees = (await reponse.json()) as { data?: ModeleAA[] };
  const liste = donnees.data;
  if (!Array.isArray(liste)) return [];

  // Index par slug (et id en repli) pour retrouver la variante d'effort exacte.
  const parSlug = new Map<string, ModeleAA>();
  for (const m of liste) {
    if (typeof m.slug === "string") parSlug.set(m.slug, m);
    else if (typeof m.id === "string") parSlug.set(m.id, m);
  }

  const resultats: IntelCoutAA[] = [];
  for (const modele of modeles) {
    if (!modele.aaSlug) continue; // pas de slug validé → on ignore
    const m = parSlug.get(modele.aaSlug);
    if (!m) continue;
    resultats.push({
      modelKey: modele.cle,
      intelligence: nombreOuNull(
        m.evaluations?.artificial_analysis_intelligence_index,
      ),
      inputUsdM: nombreOuNull(m.pricing?.price_1m_input_tokens),
      outputUsdM: nombreOuNull(m.pricing?.price_1m_output_tokens),
      effort: effortDepuisNom(m.name),
      latenceS: latenceDepuis(m),
    });
  }
  return resultats;
}
