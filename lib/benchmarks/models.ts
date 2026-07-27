/**
 * Liste blanche curée des modèles suivis par la page « /quelle-ia ».
 *
 * Ce mapping fait aussi office de plancher éditorial : seuls les modèles listés
 * ici sont classés (on ne suit pas les ~340 modèles d'OpenRouter). Chaque entrée
 * relie une clé stable (`cle`, utilisée comme `model_key` en base) aux
 * identifiants des sources externes :
 *   - `openrouterId` : id exact dans GET https://openrouter.ai/api/v1/models (COÛT) ;
 *   - `lmarenaNames` : noms exacts dans le leaderboard LMArena, catégorie
 *     `overall` (INTELLIGENCE). Plusieurs variantes possibles (thinking / high /
 *     medium…) ; l'agrégation retient la meilleure (cf. lib/benchmarks/lmarena.ts) ;
 *   - `aaSlug` : slug Artificial Analysis (INTELLIGENCE + COÛT, source premium
 *     active seulement si `AA_API_KEY` est branchée). Vérifiés le 2026-07-27
 *     contre GET https://artificialanalysis.ai/api/v2/data/llms/models : chaque
 *     variante d'effort a son slug, le slug nu correspond à l'effort Max — c'est
 *     celui qu'on retient, sauf pour Claude Opus 5 (suivi à `high`, cf. plus bas).
 *
 * `pays` alimentera un futur badge de souveraineté (US / FR / CN / …).
 *
 * Identifiants vérifiés le 2026-07-24 contre les API réelles (OpenRouter +
 * LMArena, accessibles sans clé). Corrections notables vs l'amorce :
 *   - GLM-5.2 : OpenRouter `z-ai/glm-5.2` ; LMArena `glm-5.2 (max)` (le nom
 *     contient réellement une espace et des parenthèses ; pas de `glm-5.2` nu).
 *   - Grok 4.5 : OpenRouter `x-ai/grok-4.5`.
 *   - Claude Sonnet 5 : LMArena n'expose que `claude-sonnet-5-high`.
 *   - Qwen3 Max : LMArena n'a pas de `qwen3-max` nu ; les entrées de la même
 *     génération sont `qwen3-max-2025-09-23` (GA) et `qwen3-max-preview`.
 *
 * Côté Artificial Analysis (vérifié le 2026-07-27), les `aaSlug` décalquent la
 * `cle` sauf :
 *   - Gemini 3.1 Pro : `gemini-3-1-pro-preview` (pas de `gemini-3-1-pro` nu).
 *   - Claude Sonnet 5 : seul le slug nu porte une note d'intelligence ; ses
 *     variantes `-high` / `-medium` / `-low` / `-xhigh` l'ont à `null`.
 */
export type Pays = "US" | "FR" | "CN";

export type Modele = {
  /** Clé stable = model_key en base et dans le classement. */
  cle: string;
  /** Nom d'affichage. */
  nom: string;
  editeur: string;
  pays: Pays;
  /** Id exact OpenRouter (source coût). */
  openrouterId: string;
  /** Noms exacts LMArena (catégorie overall). La meilleure variante est retenue. */
  lmarenaNames: string[];
  /** Slug Artificial Analysis (source premium, optionnelle). */
  aaSlug?: string;
};

export const MODELES: Modele[] = [
  {
    // Prix OpenRouter vérifiés le 2026-07-27 : 5 $/M en entrée, 25 $/M en sortie
    // (identiques à Opus 4.8). Les `lmarenaNames` sont PROSPECTIFS : au 2026-07-27
    // le dernier classement LMArena (21/07/2026) s'arrête à `claude-opus-4-8`.
    // Ils suivent la convention observée pour 4.6 / 4.7 / 4.8 (nom nu + suffixe
    // `-thinking`), de sorte que le modèle entrera seul dans le classement dès sa
    // publication. En attendant, aggregate.ts l'exclut proprement faute
    // d'intelligence exploitable : c'est le comportement attendu, pas un bug.
    cle: "claude-opus-5",
    nom: "Claude Opus 5",
    editeur: "Anthropic",
    pays: "US",
    openrouterId: "anthropic/claude-opus-5",
    lmarenaNames: ["claude-opus-5-thinking", "claude-opus-5"],
    // Réglage suivi : `high` (et non `max`, le slug nu). À `max`, le modèle
    // réfléchit 28,7 s avant de répondre contre 10,05 s à `high`, pour 1,8 point
    // d'intelligence de plus — un compromis que le projet ne retient pas.
    aaSlug: "claude-opus-5-high",
  },
  {
    cle: "claude-opus-4-8",
    nom: "Claude Opus 4.8",
    editeur: "Anthropic",
    pays: "US",
    openrouterId: "anthropic/claude-opus-4.8",
    lmarenaNames: ["claude-opus-4-8-thinking", "claude-opus-4-8"],
    aaSlug: "claude-opus-4-8",
  },
  {
    cle: "claude-fable-5",
    nom: "Claude Fable 5",
    editeur: "Anthropic",
    pays: "US",
    openrouterId: "anthropic/claude-fable-5",
    lmarenaNames: ["claude-fable-5"],
    aaSlug: "claude-fable-5",
  },
  {
    cle: "claude-sonnet-5",
    nom: "Claude Sonnet 5",
    editeur: "Anthropic",
    pays: "US",
    openrouterId: "anthropic/claude-sonnet-5",
    lmarenaNames: ["claude-sonnet-5-high"],
    aaSlug: "claude-sonnet-5",
  },
  {
    cle: "gpt-5-5",
    nom: "GPT-5.5",
    editeur: "OpenAI",
    pays: "US",
    openrouterId: "openai/gpt-5.5",
    lmarenaNames: ["gpt-5.5-high", "gpt-5.5"],
    aaSlug: "gpt-5-5",
  },
  {
    cle: "gpt-5-4",
    nom: "GPT-5.4",
    editeur: "OpenAI",
    pays: "US",
    openrouterId: "openai/gpt-5.4",
    lmarenaNames: ["gpt-5.4-high", "gpt-5.4"],
    aaSlug: "gpt-5-4",
  },
  {
    cle: "gemini-3-6-flash",
    nom: "Gemini 3.6 Flash",
    editeur: "Google",
    pays: "US",
    openrouterId: "google/gemini-3.6-flash",
    lmarenaNames: ["gemini-3.6-flash"],
    aaSlug: "gemini-3-6-flash",
  },
  {
    cle: "gemini-3-5-flash",
    nom: "Gemini 3.5 Flash",
    editeur: "Google",
    pays: "US",
    openrouterId: "google/gemini-3.5-flash",
    lmarenaNames: ["gemini-3.5-flash-high", "gemini-3.5-flash-medium"],
    aaSlug: "gemini-3-5-flash",
  },
  {
    cle: "gemini-3-1-pro",
    nom: "Gemini 3.1 Pro",
    editeur: "Google",
    pays: "US",
    openrouterId: "google/gemini-3.1-pro-preview",
    lmarenaNames: ["gemini-3.1-pro-preview"],
    aaSlug: "gemini-3-1-pro-preview",
  },
  {
    cle: "mistral-large-3",
    nom: "Mistral Large 3",
    editeur: "Mistral",
    pays: "FR",
    openrouterId: "mistralai/mistral-large-2512",
    lmarenaNames: ["mistral-large-3"],
    aaSlug: "mistral-large-3",
  },
  {
    cle: "deepseek-v4-pro",
    nom: "DeepSeek V4 Pro",
    editeur: "DeepSeek",
    pays: "CN",
    openrouterId: "deepseek/deepseek-v4-pro",
    lmarenaNames: ["deepseek-v4-pro"],
    aaSlug: "deepseek-v4-pro",
  },
  {
    cle: "kimi-k3",
    nom: "Kimi K3",
    editeur: "Moonshot",
    pays: "CN",
    openrouterId: "moonshotai/kimi-k3",
    lmarenaNames: ["kimi-k3"],
    aaSlug: "kimi-k3",
  },
  {
    cle: "glm-5-2",
    nom: "GLM-5.2",
    editeur: "Z.ai",
    pays: "CN",
    openrouterId: "z-ai/glm-5.2",
    lmarenaNames: ["glm-5.2 (max)"],
    aaSlug: "glm-5-2",
  },
  {
    cle: "grok-4-5",
    nom: "Grok 4.5",
    editeur: "xAI",
    pays: "US",
    openrouterId: "x-ai/grok-4.5",
    lmarenaNames: ["grok-4.5"],
    aaSlug: "grok-4-5",
  },
  {
    cle: "qwen3-max",
    nom: "Qwen3 Max",
    editeur: "Alibaba",
    pays: "CN",
    openrouterId: "qwen/qwen3-max",
    lmarenaNames: ["qwen3-max-2025-09-23", "qwen3-max-preview"],
    aaSlug: "qwen3-max",
  },
];
