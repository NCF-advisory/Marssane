import type { Classement } from "./aggregate";

/**
 * Instantané figé du classement « /quelle-ia ».
 *
 * Origine : relevé manuel du 04/11/2026 sur les pages modèle d'Artificial
 * Analysis — Intelligence Index brut, prix d'API input/output, time to first
 * answer token — pour les 11 modèles du catalogue. Les valeurs sont le résultat
 * de la formule 50 % intelligence + 25 % efficacité-coût + 25 % réactivité de
 * l'ancien `aggregate.ts`, appliquée SANS plancher d'intelligence (les
 * normalisations étant calculées avant le plancher, les scores sont identiques
 * à ceux de la chaîne automatique).
 *
 * Arbitrages du propriétaire, le 04/11/2026 :
 * - Gemini 4 Carbon est écarté du classement. Il tenait le maximum
 *   d'intelligence : les intelligences normalisées ont donc été recalculées sur
 *   la nouvelle étendue.
 * - GPT-6 Astra à effort élevé est le modèle retenu pour OpenAI, à la place de
 *   GPT-6.1 Sol.
 * - Claude Sonnet 5.5 est relevé à effort élevé, au même niveau qu'Opus 5.5, et
 *   non plus à effort maximal. Cette variante est bien plus prompte à répondre :
 *   elle devient le minimum de latence et resserre l'étendue des temps de
 *   réflexion, si bien que TOUTES les réactivités — et le repli des modèles sans
 *   latence mesurée, assis sur la médiane — ont changé.
 *
 * L'indice AA a changé d'échelle entre-temps : les valeurs brutes sont plus
 * basses qu'au relevé précédent, et seul leur min-max relatif compte ici — les
 * intelligences normalisées ne se comparent donc pas d'un relevé à l'autre.
 *
 * Régénération : recalculer à la main à partir des sources — la chaîne
 * automatique (cron, connecteurs, lecture base) a été retirée le 18/09/2026.
 */
export const CLASSEMENT: Classement = {
  miseAJour: "2026-11-04T09:00:00.000Z",
  entries: [
    {
      rang: 1,
      cle: "claude-opus-5-5",
      nom: "Claude Opus 5.5",
      editeur: "Anthropic",
      pays: "US",
      effort: "high",
      intelligence: 90.6,
      coutEurM: 7.36,
      indiceEfficacite: 18.2,
      reactivite: 88.4,
      latenceS: 27.13,
      score: 71.9,
    },
    {
      rang: 2,
      cle: "gpt-6-astra",
      nom: "GPT-6 Astra",
      editeur: "OpenAI",
      pays: "US",
      effort: "high",
      intelligence: 100,
      coutEurM: 18.4,
      indiceEfficacite: 1.3,
      reactivite: 80.6,
      latenceS: 38.37,
      score: 70.5,
    },
    {
      rang: 3,
      cle: "claude-sonnet-5-5",
      nom: "Claude Sonnet 5.5",
      editeur: "Anthropic",
      pays: "US",
      effort: "high",
      intelligence: 59.4,
      coutEurM: 3.68,
      indiceEfficacite: 36.1,
      reactivite: 100,
      latenceS: 10.23,
      score: 63.7,
    },
    {
      rang: 4,
      cle: "gemini-3-8-flash",
      nom: "Gemini 3.8 Flash",
      editeur: "Google",
      pays: "US",
      effort: "high",
      intelligence: 25,
      coutEurM: 1.38,
      indiceEfficacite: 81.6,
      reactivite: 93.2,
      latenceS: 20.15,
      score: 56.2,
    },
    {
      rang: 5,
      cle: "grok-4-7",
      nom: "Grok 4.7",
      editeur: "xAI",
      pays: "US",
      effort: "high",
      intelligence: 37.5,
      coutEurM: 2.76,
      indiceEfficacite: 41.3,
      reactivite: 86.5,
      latenceS: 29.89,
      score: 50.7,
    },
    {
      rang: 6,
      cle: "kimi-k3-1-pro",
      nom: "Kimi K3.1 Pro",
      editeur: "Moonshot",
      pays: "CN",
      intelligence: 71.9,
      coutEurM: 3.68,
      indiceEfficacite: 40.6,
      reactivite: 16.9,
      latenceS: 131.06,
      score: 50.3,
    },
    {
      rang: 7,
      cle: "mistral-large-4",
      nom: "Mistral Large 4",
      editeur: "Mistral",
      pays: "FR",
      effort: "high",
      intelligence: 9.4,
      coutEurM: 0.97,
      indiceEfficacite: 100,
      reactivite: 66.5,
      latenceS: null,
      score: 46.3,
    },
    {
      rang: 8,
      cle: "glm-5-3",
      nom: "GLM-5.3",
      editeur: "Z.ai",
      pays: "CN",
      effort: "max",
      intelligence: 28.1,
      coutEurM: 1.98,
      indiceEfficacite: 55.7,
      reactivite: 58.3,
      latenceS: 70.84,
      score: 42.6,
    },
    {
      rang: 9,
      cle: "claude-fable-5-1",
      nom: "Claude Fable 5.1",
      editeur: "Anthropic",
      pays: "US",
      effort: "max",
      intelligence: 81.3,
      coutEurM: 18.4,
      indiceEfficacite: 0,
      reactivite: 0,
      latenceS: 155.59,
      score: 40.6,
    },
    {
      rang: 10,
      cle: "qwen3-8-max",
      nom: "Qwen3.8 Max",
      editeur: "Alibaba",
      pays: "CN",
      intelligence: 34.4,
      coutEurM: 2.76,
      indiceEfficacite: 39.8,
      reactivite: 26.6,
      latenceS: 116.86,
      score: 33.8,
    },
    {
      rang: 11,
      cle: "deepseek-v4-pro",
      nom: "DeepSeek V4 Pro",
      editeur: "DeepSeek",
      pays: "CN",
      effort: "max",
      intelligence: 0,
      coutEurM: 1.82,
      indiceEfficacite: 41.1,
      reactivite: 66.5,
      latenceS: 58.94,
      score: 26.9,
    },
  ],
};
