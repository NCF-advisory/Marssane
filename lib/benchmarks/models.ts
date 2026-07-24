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
 *   - `aaSlug` : identifiant Artificial Analysis (optionnel, source premium
 *     désactivée par défaut). À renseigner quand une clé AA_API_KEY est branchée
 *     — laissé indéfini tant qu'on ne peut pas le vérifier contre l'API réelle.
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
    cle: "claude-opus-4-8",
    nom: "Claude Opus 4.8",
    editeur: "Anthropic",
    pays: "US",
    openrouterId: "anthropic/claude-opus-4.8",
    lmarenaNames: ["claude-opus-4-8-thinking", "claude-opus-4-8"],
  },
  {
    cle: "claude-fable-5",
    nom: "Claude Fable 5",
    editeur: "Anthropic",
    pays: "US",
    openrouterId: "anthropic/claude-fable-5",
    lmarenaNames: ["claude-fable-5"],
  },
  {
    cle: "claude-sonnet-5",
    nom: "Claude Sonnet 5",
    editeur: "Anthropic",
    pays: "US",
    openrouterId: "anthropic/claude-sonnet-5",
    lmarenaNames: ["claude-sonnet-5-high"],
  },
  {
    cle: "gpt-5-5",
    nom: "GPT-5.5",
    editeur: "OpenAI",
    pays: "US",
    openrouterId: "openai/gpt-5.5",
    lmarenaNames: ["gpt-5.5-high", "gpt-5.5"],
  },
  {
    cle: "gpt-5-4",
    nom: "GPT-5.4",
    editeur: "OpenAI",
    pays: "US",
    openrouterId: "openai/gpt-5.4",
    lmarenaNames: ["gpt-5.4-high", "gpt-5.4"],
  },
  {
    cle: "gemini-3-6-flash",
    nom: "Gemini 3.6 Flash",
    editeur: "Google",
    pays: "US",
    openrouterId: "google/gemini-3.6-flash",
    lmarenaNames: ["gemini-3.6-flash"],
  },
  {
    cle: "gemini-3-5-flash",
    nom: "Gemini 3.5 Flash",
    editeur: "Google",
    pays: "US",
    openrouterId: "google/gemini-3.5-flash",
    lmarenaNames: ["gemini-3.5-flash-high", "gemini-3.5-flash-medium"],
  },
  {
    cle: "gemini-3-1-pro",
    nom: "Gemini 3.1 Pro",
    editeur: "Google",
    pays: "US",
    openrouterId: "google/gemini-3.1-pro-preview",
    lmarenaNames: ["gemini-3.1-pro-preview"],
  },
  {
    cle: "mistral-large-3",
    nom: "Mistral Large 3",
    editeur: "Mistral",
    pays: "FR",
    openrouterId: "mistralai/mistral-large-2512",
    lmarenaNames: ["mistral-large-3"],
  },
  {
    cle: "deepseek-v4-pro",
    nom: "DeepSeek V4 Pro",
    editeur: "DeepSeek",
    pays: "CN",
    openrouterId: "deepseek/deepseek-v4-pro",
    lmarenaNames: ["deepseek-v4-pro"],
  },
  {
    cle: "kimi-k3",
    nom: "Kimi K3",
    editeur: "Moonshot",
    pays: "CN",
    openrouterId: "moonshotai/kimi-k3",
    lmarenaNames: ["kimi-k3"],
  },
  {
    cle: "glm-5-2",
    nom: "GLM-5.2",
    editeur: "Z.ai",
    pays: "CN",
    openrouterId: "z-ai/glm-5.2",
    lmarenaNames: ["glm-5.2 (max)"],
  },
  {
    cle: "grok-4-5",
    nom: "Grok 4.5",
    editeur: "xAI",
    pays: "US",
    openrouterId: "x-ai/grok-4.5",
    lmarenaNames: ["grok-4.5"],
  },
  {
    cle: "qwen3-max",
    nom: "Qwen3 Max",
    editeur: "Alibaba",
    pays: "CN",
    openrouterId: "qwen/qwen3-max",
    lmarenaNames: ["qwen3-max-2025-09-23", "qwen3-max-preview"],
  },
];
