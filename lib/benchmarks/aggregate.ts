import type { Modele } from "./models";

/**
 * Calcul du classement « efficacité = intelligence ÷ coût » à partir des données
 * BRUTES stockées par source (table benchmark_sources). Fonction pure et
 * agnostique de la source : elle prend les lignes brutes + le mapping curé et
 * rend le classement. Aucune I/O ici (la lecture base est dans classement.ts),
 * ce qui permet de recalculer la formule sans re-fetch.
 *
 * Tous les paramètres de la formule sont des constantes documentées ci-dessous,
 * volontairement faciles à ajuster (plancher, pondérations, taux de change).
 */

// ---------------------------------------------------------------------------
// Paramètres configurables de la formule
// ---------------------------------------------------------------------------

/**
 * Taux de conversion USD → EUR appliqué au coût.
 * TODO : brancher un taux live plus tard (non bloquant ; valeur figée pour l'instant).
 */
const USD_EUR = 0.92;

/**
 * Coût mélangé = (POIDS_INPUT × prix_input + POIDS_OUTPUT × prix_output) / (somme
 * des poids). Pondération volontairement « input-lourde » : la plupart des usages
 * PME envoient beaucoup de contexte pour une réponse courte. Ajustable.
 */
const POIDS_INPUT = 3;
const POIDS_OUTPUT = 1;

/**
 * Plancher éditorial sur l'échelle d'intelligence 0-100 : les modèles en dessous
 * sont EXCLUS du classement. Objectif : ne garder que l'élite puis départager
 * par coût. Défaut 55.
 *
 * Note d'échelle : sans Artificial Analysis, l'intelligence vient de LMArena et
 * est normalisée par min-max PARMI les modèles suivis — 55 signifie donc « dans
 * le haut ~45 % de l'éventail suivi », pas une valeur absolue. Avec AA branché
 * (indice ~0-100 absolu), 55 redevient un seuil absolu. Recalibrer en conséquence.
 */
const MIN_INTELLIGENCE = 55;

/** Une source est « périmée » (stale) si sa date native dépasse ce nb de jours. */
const FRESHNESS_DAYS = 21;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Ligne brute telle que lue en base (source_date/fetched_at en chaînes ISO). */
export type SourceRow = {
  source: string;
  model_key: string;
  intelligence_raw: number | null;
  cost_input_usd_m: number | null;
  cost_output_usd_m: number | null;
  effort: string | null;
  source_date: string | null;
  fetched_at: string;
};

export type ClassementEntry = {
  rang: number;
  cle: string;
  nom: string;
  editeur: string;
  pays: string;
  effort?: string;
  /** Intelligence normalisée 0-100 (base du plancher et du calcul). */
  intelligence: number;
  /** Coût mélangé en €/million de tokens. */
  coutEurM: number;
  /** Indice d'efficacité renormalisé 0-100 (1er = 100). */
  indiceEfficacite: number;
  /** Sources ayant alimenté cette entrée, ex. ["lmarena","openrouter"]. */
  sources: string[];
};

export type Fraicheur = {
  source: string;
  date: string | null;
  stale: boolean;
};

export type Classement = {
  entries: ClassementEntry[];
  /** Date du dernier rafraîchissement (max fetched_at), ISO ou null. */
  miseAJour: string | null;
  fraicheur: Fraicheur[];
  /** true si la source d'intelligence primaire est périmée ou absente. */
  degrade: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function arrondi(n: number, decimales: number): number {
  const f = 10 ** decimales;
  return Math.round(n * f) / f;
}

/** true si `date` (YYYY-MM-DD) est plus vieille que FRESHNESS_DAYS. */
function estPerimee(date: string | null, maintenant: Date): boolean {
  if (!date) return false; // pas de date native → jamais considérée périmée
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  const jours = (maintenant.getTime() - d.getTime()) / 86_400_000;
  return jours > FRESHNESS_DAYS;
}

// Intelligence résolue pour un modèle (avant normalisation min-max).
type IntelResolue = {
  modele: Modele;
  source: "aa" | "lmarena";
  raw: number; // indice AA (~0-100) OU Elo LMArena
};

/**
 * Agrège les lignes brutes en classement. `maintenant` est injectable pour les
 * tests ; par défaut l'instant courant.
 */
export function aggreger(
  rows: SourceRow[],
  modeles: Modele[],
  maintenant: Date = new Date(),
): Classement {
  // Index (model_key → source → ligne).
  const parModele = new Map<string, Map<string, SourceRow>>();
  for (const row of rows) {
    let bySource = parModele.get(row.model_key);
    if (!bySource) {
      bySource = new Map();
      parModele.set(row.model_key, bySource);
    }
    bySource.set(row.source, row);
  }

  // --- Fraîcheur par source présente + mise à jour globale --------------------
  const dateParSource = new Map<string, string | null>();
  let miseAJour: string | null = null;
  for (const row of rows) {
    // Date native max par source.
    const actuelle = dateParSource.get(row.source);
    if (row.source_date && (!actuelle || row.source_date > actuelle)) {
      dateParSource.set(row.source, row.source_date);
    } else if (!dateParSource.has(row.source)) {
      dateParSource.set(row.source, row.source_date ?? null);
    }
    // Mise à jour globale = max fetched_at.
    if (!miseAJour || row.fetched_at > miseAJour) miseAJour = row.fetched_at;
  }
  const fraicheur: Fraicheur[] = [...dateParSource.entries()].map(
    ([source, date]) => ({ source, date, stale: estPerimee(date, maintenant) }),
  );

  if (rows.length === 0) {
    return { entries: [], miseAJour: null, fraicheur: [], degrade: true };
  }

  // --- Passe 1 : résoudre l'intelligence (priorité AA fraîche, sinon LMArena) -
  const intelResolus: IntelResolue[] = [];
  for (const modele of modeles) {
    const bySource = parModele.get(modele.cle);
    if (!bySource) continue;
    const aa = bySource.get("aa");
    const lma = bySource.get("lmarena");

    const aaFraiche =
      aa != null &&
      aa.intelligence_raw != null &&
      !estPerimee(aa.source_date, maintenant);

    if (aaFraiche && aa!.intelligence_raw != null) {
      intelResolus.push({
        modele,
        source: "aa",
        raw: aa!.intelligence_raw,
      });
    } else if (lma != null && lma.intelligence_raw != null) {
      intelResolus.push({ modele, source: "lmarena", raw: lma.intelligence_raw });
    }
    // Aucune intelligence exploitable → modèle non classé (exclu proprement).
  }

  // Min-max de l'Elo LMArena parmi les modèles suivis (pour la normalisation).
  const elos = intelResolus
    .filter((r) => r.source === "lmarena")
    .map((r) => r.raw);
  const eloMin = elos.length ? Math.min(...elos) : 0;
  const eloMax = elos.length ? Math.max(...elos) : 0;
  const eloEtendue = eloMax - eloMin;

  const normaliser = (r: IntelResolue): number => {
    if (r.source === "aa") {
      // Indice AA déjà ~0-100 : on borne par sécurité.
      return Math.max(0, Math.min(100, r.raw));
    }
    // LMArena : min-max parmi les modèles suivis.
    if (eloEtendue <= 0) return 100; // un seul modèle (ou égalité) → tous au max
    return ((r.raw - eloMin) / eloEtendue) * 100;
  };

  // --- Passe 2 : coût + plancher → candidats ---------------------------------
  type Candidat = {
    modele: Modele;
    intelligenceNorm: number;
    coutEurM: number;
    indiceRaw: number;
    effort: string | null;
    sources: string[];
  };
  const candidats: Candidat[] = [];

  for (const resolu of intelResolus) {
    const intelligenceNorm = normaliser(resolu);
    if (intelligenceNorm < MIN_INTELLIGENCE) continue; // plancher

    const bySource = parModele.get(resolu.modele.cle)!;
    const aa = bySource.get("aa");
    const or = bySource.get("openrouter");

    // Coût : AA prioritaire s'il fournit les deux prix, sinon OpenRouter.
    let coutSource: "aa" | "openrouter" | null = null;
    let input: number | null = null;
    let output: number | null = null;
    if (
      aa != null &&
      aa.cost_input_usd_m != null &&
      aa.cost_output_usd_m != null
    ) {
      coutSource = "aa";
      input = aa.cost_input_usd_m;
      output = aa.cost_output_usd_m;
    } else if (
      or != null &&
      or.cost_input_usd_m != null &&
      or.cost_output_usd_m != null
    ) {
      coutSource = "openrouter";
      input = or.cost_input_usd_m;
      output = or.cost_output_usd_m;
    }
    if (coutSource == null || input == null || output == null) continue;

    const coutMixteUsd =
      (POIDS_INPUT * input + POIDS_OUTPUT * output) /
      (POIDS_INPUT + POIDS_OUTPUT);
    const coutEurM = coutMixteUsd * USD_EUR;
    if (coutEurM <= 0) continue; // coût non exploitable

    const indiceRaw = intelligenceNorm / coutEurM;
    const effort =
      resolu.source === "aa" || coutSource === "aa"
        ? (aa?.effort ?? null)
        : null;

    candidats.push({
      modele: resolu.modele,
      intelligenceNorm,
      coutEurM,
      indiceRaw,
      effort,
      sources: [resolu.source, coutSource].filter(
        (s, i, arr) => arr.indexOf(s) === i,
      ),
    });
  }

  // --- Renormalisation 0-100 + tri + rang ------------------------------------
  const indiceMax = candidats.reduce((m, c) => Math.max(m, c.indiceRaw), 0);
  candidats.sort((a, b) => b.indiceRaw - a.indiceRaw);
  const entries: ClassementEntry[] = candidats.map((c, i) => ({
    rang: i + 1,
    cle: c.modele.cle,
    nom: c.modele.nom,
    editeur: c.modele.editeur,
    pays: c.modele.pays,
    effort: c.effort ?? undefined,
    intelligence: arrondi(c.intelligenceNorm, 1),
    coutEurM: arrondi(c.coutEurM, 2),
    indiceEfficacite:
      indiceMax > 0 ? arrondi((c.indiceRaw / indiceMax) * 100, 1) : 0,
    sources: c.sources,
  }));

  // --- Dégradation : la source d'intelligence primaire est-elle fiable ? ------
  const intelligencePrincipale = intelResolus.some((r) => r.source === "aa")
    ? "aa"
    : "lmarena";
  const fraicheurPrincipale = fraicheur.find(
    (f) => f.source === intelligencePrincipale,
  );
  const degrade =
    entries.length === 0 ||
    fraicheurPrincipale == null ||
    fraicheurPrincipale.stale;

  return { entries, miseAJour, fraicheur, degrade };
}
