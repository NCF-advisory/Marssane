import type { Modele } from "./models";

/**
 * Connecteur AA : Artificial Analysis (source premium, DÉSACTIVABLE).
 *
 * Payante pour un affichage public → inactive par défaut. Si `AA_API_KEY` est
 * absente, `fetchArtificialAnalysis` retourne un tableau vide SANS erreur (la
 * source est simplement ignorée). Si la clé est présente :
 *   GET https://artificialanalysis.ai/api/v2/language/models
 *   header `x-api-key: <clé>`.
 *
 * Champs exploités par modèle :
 *   - `artificial_analysis_intelligence_index` (indice ~0-100, déjà normalisé) ;
 *   - `price_1m_input_tokens` / `price_1m_output_tokens` ($/million) ;
 *   - un niveau d'effort (high / xhigh / max) — chaque variante d'effort est une
 *     entrée distincte côté AA, mappée via `aaSlug`.
 *
 * NON TESTABLE ici (pas de clé) : code défensif et non bloquant. Les `aaSlug`
 * du mapping sont volontairement indéfinis tant qu'ils ne peuvent pas être
 * validés contre l'API réelle ; un modèle sans `aaSlug` est simplement ignoré
 * par ce connecteur (aucune donnée AA écrite pour lui).
 */

const URL_AA = "https://artificialanalysis.ai/api/v2/language/models";

/** Intelligence + coût + effort d'un modèle, mesurés par Artificial Analysis. */
export type IntelCoutAA = {
  modelKey: string;
  /** Indice d'intelligence AA (~0-100). */
  intelligence: number | null;
  inputUsdM: number | null;
  outputUsdM: number | null;
  /** Niveau d'effort de la variante mesurée (high / xhigh / max…). */
  effort: string | null;
};

type ModeleAA = {
  slug?: string;
  id?: string;
  artificial_analysis_intelligence_index?: number;
  price_1m_input_tokens?: number;
  price_1m_output_tokens?: number;
  effort?: string;
};

function nombreOuNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
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
      intelligence: nombreOuNull(m.artificial_analysis_intelligence_index),
      inputUsdM: nombreOuNull(m.price_1m_input_tokens),
      outputUsdM: nombreOuNull(m.price_1m_output_tokens),
      effort: typeof m.effort === "string" ? m.effort : null,
    });
  }
  return resultats;
}
