import type { Modele } from "./models";

/**
 * Connecteur COÛT : OpenRouter.
 *
 * GET https://openrouter.ai/api/v1/models (public, sans clé). Renvoie ~340
 * modèles avec un objet `pricing` dont `prompt` et `completion` sont des chaînes
 * décimales en $/TOKEN. On convertit en $/MILLION (× 1e6).
 *
 * On ne retient que les modèles de la liste blanche (models.ts), repérés par
 * leur `openrouterId` exact. Les entrées `:free` sont ignorées (variantes
 * gratuites plafonnées, non représentatives du coût réel).
 */

const URL_OPENROUTER = "https://openrouter.ai/api/v1/models";

/** Coût d'un modèle en $/million de tokens. */
export type CoutOpenRouter = {
  modelKey: string;
  inputUsdM: number;
  outputUsdM: number;
};

type ModeleOpenRouter = {
  id: string;
  pricing?: { prompt?: string; completion?: string };
};

/** Chaîne $/token → nombre $/million ; `null` si absente ou non numérique. */
function versUsdParMillion(prix: string | undefined): number | null {
  if (prix == null) return null;
  const n = Number(prix);
  if (!Number.isFinite(n)) return null;
  return n * 1e6;
}

/**
 * Récupère les coûts input/output des modèles suivis. Lève si le fetch échoue
 * ou si la réponse est mal formée (la route de refresh rattrape par source).
 */
export async function fetchOpenRouter(
  modeles: Modele[],
): Promise<CoutOpenRouter[]> {
  const reponse = await fetch(URL_OPENROUTER, {
    headers: { accept: "application/json" },
  });
  if (!reponse.ok) {
    throw new Error(`OpenRouter a répondu ${reponse.status}`);
  }
  const donnees = (await reponse.json()) as { data?: ModeleOpenRouter[] };
  const liste = donnees.data;
  if (!Array.isArray(liste)) {
    throw new Error("OpenRouter : champ `data` absent ou invalide");
  }

  // Index id → pricing, en ignorant les variantes `:free`.
  const parId = new Map<string, ModeleOpenRouter["pricing"]>();
  for (const m of liste) {
    if (typeof m.id !== "string" || m.id.endsWith(":free")) continue;
    parId.set(m.id, m.pricing);
  }

  const resultats: CoutOpenRouter[] = [];
  for (const modele of modeles) {
    const pricing = parId.get(modele.openrouterId);
    if (!pricing) continue; // modèle introuvable chez OpenRouter : ignoré
    const inputUsdM = versUsdParMillion(pricing.prompt);
    const outputUsdM = versUsdParMillion(pricing.completion);
    // Prix nécessaires ET non nuls (un modèle à 0 $ n'est pas exploitable ici).
    if (inputUsdM == null || outputUsdM == null) continue;
    if (inputUsdM <= 0 && outputUsdM <= 0) continue;
    resultats.push({ modelKey: modele.cle, inputUsdM, outputUsdM });
  }
  return resultats;
}
