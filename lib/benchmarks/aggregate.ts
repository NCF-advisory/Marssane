import type { Modele, Pays } from "./models";

/**
 * Calcul du classement « score = 50 % intelligence + 25 % coût + 25 %
 * réactivité » à partir des données BRUTES stockées par source (table
 * benchmark_sources) :
 *   - intelligence : indice du benchmark, normalisé 0-100 ;
 *   - coût : rapport intelligence ÷ coût (€/M tokens), normalisé 0-100 ;
 *   - réactivité : temps de réflexion avant la première réponse, normalisé
 *     0-100 puis INVERSÉ (100 = le plus prompt à répondre).
 *
 * Les trois termes sont normalisés en min-max sur TOUS les modèles suivis
 * exploitables, AVANT l'application du plancher d'intelligence. C'est essentiel :
 * normaliser sur les seuls survivants du plancher rendait l'échelle — donc le
 * classement entier — dépendante du seuil choisi. Les scores ne bougent plus
 * quand on déplace le plancher ; seule la liste des modèles classés change.
 *
 * Le score est la métrique de tri et de rang ; l'indice d'efficacité-coût reste
 * exposé pour le graphe intelligence × coût. Fonction pure et agnostique de la
 * source : elle prend les lignes brutes + le mapping curé et rend le classement.
 * Aucune I/O ici (la lecture base est dans classement.ts), ce qui permet de
 * recalculer la formule sans re-fetch.
 *
 * Tous les paramètres de la formule sont des constantes documentées ci-dessous,
 * volontairement faciles à ajuster (planchers, pondérations, taux de change).
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
 * Planchers éditoriaux d'intelligence : les modèles en dessous sont EXCLUS du
 * classement (on ne garde que le niveau professionnel, puis on départage par
 * coût et réactivité). Le plancher DÉPEND DE LA SOURCE d'intelligence, parce que
 * l'indice AA (absolu, ~0-100) et l'Elo LMArena (~1450) ne sont pas comparables :
 *   - MIN_INTELLIGENCE_AA s'applique à l'indice AA BRUT. Échelle absolue, donc un
 *     seuil stable même si le catalogue de modèles suivis change.
 *   - MIN_INTELLIGENCE_LMARENA s'applique à l'intelligence NORMALISÉE (min-max
 *     parmi les modèles suivis) : 55 signifie « dans le haut ~45 % de l'éventail
 *     suivi ». C'est le comportement historique, conservé pour le repli LMArena.
 * Déplacer l'un ou l'autre ne change AUCUN score : la normalisation est calculée
 * avant le filtrage (cf. en-tête).
 */
const MIN_INTELLIGENCE_AA = 45;
const MIN_INTELLIGENCE_LMARENA = 55;

/**
 * Score global = POIDS_INTELLIGENCE × intelligence + POIDS_COUT × efficacité-coût
 * + POIDS_REACTIVITE × réactivité, les trois termes étant sur une échelle 0-100
 * commune, donc directement combinables. Pondération 50/25/25 assumée
 * éditorialement (et affichée au visiteur, cf. MethodoSources) : le niveau du
 * modèle décide, le prix et le temps d'attente départagent. Ajustable.
 */
const POIDS_INTELLIGENCE = 0.5;
const POIDS_COUT = 0.25;
const POIDS_REACTIVITE = 0.25;

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
  /** Temps de réflexion en secondes (source `aa` seule) ; null si non mesuré. */
  latence_s: number | null;
  source_date: string | null;
  fetched_at: string;
};

export type ClassementEntry = {
  rang: number;
  cle: string;
  nom: string;
  editeur: string;
  pays: Pays;
  effort?: string;
  /** Intelligence normalisée 0-100 (base du plancher et du calcul). */
  intelligence: number;
  /** Coût mélangé en €/million de tokens. */
  coutEurM: number;
  /** Indice d'efficacité-coût normalisé 0-100 (rapport intelligence ÷ coût). */
  indiceEfficacite: number;
  /** Réactivité normalisée 0-100 (100 = le plus prompt à répondre). */
  reactivite: number;
  /** Temps de réflexion mesuré, en secondes ; null si non mesuré (affichage). */
  latenceS: number | null;
  /** Score global 0-100 (50 % intelligence + 25 % coût + 25 % réactivité) : métrique de rang. */
  score: number;
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

/**
 * Normalisation min-max sur une échelle 0-100. Cas dégénéré (un seul
 * échantillon, ou tous égaux) : 100 pour tous.
 */
function minMax(valeur: number, min: number, max: number): number {
  if (max - min <= 0) return 100;
  return ((valeur - min) / (max - min)) * 100;
}

/** Médiane d'un échantillon non vide (borne haute si l'effectif est pair). */
function mediane(valeurs: number[]): number {
  const tri = [...valeurs].sort((a, b) => a - b);
  return tri[Math.floor(tri.length / 2)];
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

  // Min-max de l'intelligence, PAR SOURCE : l'indice AA (~0-100) et l'Elo
  // LMArena (~1450) ne se mélangent pas dans une même étendue. Le calcul porte
  // sur tous les modèles suivis résolus par cette source, plancher NON appliqué.
  const bornesIntel = (source: "aa" | "lmarena") => {
    const vals = intelResolus
      .filter((r) => r.source === source)
      .map((r) => r.raw);
    if (vals.length === 0) return { min: 0, max: 0 };
    return { min: Math.min(...vals), max: Math.max(...vals) };
  };
  const bornesAa = bornesIntel("aa");
  const bornesLmarena = bornesIntel("lmarena");

  const normaliser = (r: IntelResolue): number => {
    const b = r.source === "aa" ? bornesAa : bornesLmarena;
    return minMax(r.raw, b.min, b.max);
  };

  // --- Passe 2 : coût → candidats (plancher appliqué plus loin) ---------------
  type Candidat = {
    modele: Modele;
    intelSource: "aa" | "lmarena";
    intelligenceRaw: number;
    intelligenceNorm: number;
    coutEurM: number;
    /** Rapport intelligence BRUTE ÷ coût, avant normalisation min-max. */
    indiceRaw: number;
    latenceS: number | null;
    effort: string | null;
    sources: string[];
  };
  const candidats: Candidat[] = [];

  for (const resolu of intelResolus) {
    const intelligenceNorm = normaliser(resolu);
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

    // Efficacité-coût : intelligence BRUTE (échelle absolue de la source) par
    // euro, ce qui garde l'indice indépendant de l'éventail des modèles suivis.
    // Réserve : si le classement mélangeait les deux sources d'intelligence, les
    // ratios ne seraient pas comparables (Elo ~1450/€ contre indice ~50/€). AA
    // couvre aujourd'hui tous les modèles suivis ; LMArena n'est qu'un repli.
    const indiceRaw = resolu.raw / coutEurM;
    const effort =
      resolu.source === "aa" || coutSource === "aa"
        ? (aa?.effort ?? null)
        : null;

    candidats.push({
      modele: resolu.modele,
      intelSource: resolu.source,
      intelligenceRaw: resolu.raw,
      intelligenceNorm,
      coutEurM,
      indiceRaw,
      latenceS: aa?.latence_s ?? null, // seule AA mesure la latence
      effort,
      sources: [resolu.source, coutSource].filter(
        (s, i, arr) => arr.indexOf(s) === i,
      ),
    });
  }

  // --- Normalisation coût + réactivité sur TOUS les candidats -----------------
  // Ces deux étendues se calculent avant le plancher : c'est ce qui rend les
  // scores indépendants du seuil (déplacer le plancher ne change que la liste
  // des modèles classés, pas leurs scores).
  const indices = candidats.map((c) => c.indiceRaw);
  const indiceMin = indices.length ? Math.min(...indices) : 0;
  const indiceMax = indices.length ? Math.max(...indices) : 0;

  // Latence non mesurée → ni bonus ni malus : on attribue la MÉDIANE des
  // latences mesurées, valeur médiane par construction, plutôt que d'exclure le
  // modèle du classement (il resterait pénalisé sur un critère qu'on ignore).
  const latencesMesurees = candidats
    .map((c) => c.latenceS)
    .filter((l): l is number => l != null);
  const latenceParDefaut = latencesMesurees.length
    ? mediane(latencesMesurees)
    : 0;
  const latenceRetenue = (c: Candidat) => c.latenceS ?? latenceParDefaut;
  const latences = candidats.map(latenceRetenue);
  const latenceMin = latences.length ? Math.min(...latences) : 0;
  const latenceMax = latences.length ? Math.max(...latences) : 0;

  // --- Plancher (dépendant de la source) → score + tri + rang -----------------
  const entries: ClassementEntry[] = candidats
    .filter((c) =>
      c.intelSource === "aa"
        ? c.intelligenceRaw >= MIN_INTELLIGENCE_AA
        : c.intelligenceNorm >= MIN_INTELLIGENCE_LMARENA,
    )
    .map((c) => {
      const efficacite = minMax(c.indiceRaw, indiceMin, indiceMax);
      // Réactivité = min-max de la latence NÉGATIVE : une latence basse est
      // meilleure. Équivalent à `100 − minMax(latence)`, mais le cas dégénéré
      // (latences toutes égales, ou aucune mesurée) rend alors 100 pour tous —
      // critère neutralisé — au lieu de 0 pour tous, qui amputerait chaque score.
      const latence = latenceRetenue(c);
      const reactivite = minMax(-latence, -latenceMax, -latenceMin);
      return {
        rang: 0, // assigné après le tri
        cle: c.modele.cle,
        nom: c.modele.nom,
        editeur: c.modele.editeur,
        pays: c.modele.pays,
        effort: c.effort ?? undefined,
        intelligence: arrondi(c.intelligenceNorm, 1),
        coutEurM: arrondi(c.coutEurM, 2),
        indiceEfficacite: arrondi(efficacite, 1),
        reactivite: arrondi(reactivite, 1),
        latenceS: c.latenceS,
        score: arrondi(
          POIDS_INTELLIGENCE * c.intelligenceNorm +
            POIDS_COUT * efficacite +
            POIDS_REACTIVITE * reactivite,
          1,
        ),
        sources: c.sources,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((e, i) => ({ ...e, rang: i + 1 }));

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
