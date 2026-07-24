import type { Modele } from "./models";

/**
 * Connecteur INTELLIGENCE : LMArena (via HuggingFace datasets-server, JSON HTTP).
 *
 * Dataset `lmarena-ai/leaderboard-dataset`, config `text`, split `latest`.
 * Endpoint `/rows` paginé (length max 100). Le split mélange plusieurs
 * catégories (overall, coding, chinese, industry_*, …) et, dans `overall`,
 * chaque modèle apparaît sur ~6 lignes au `rating` légèrement différent (mêmes
 * votes, calculs multiples). On :
 *   1. ne garde que `category === 'overall'` ;
 *   2. déduplique chaque `model_name` par la MÉDIANE de son `rating` (robuste
 *      aux 6 valeurs) ;
 *   3. pour un modèle suivi qui a plusieurs `lmarenaNames` (ex. variante
 *      thinking + variante par défaut), retient la MEILLEURE médiane — on
 *      représente le modèle par sa configuration la plus performante.
 *
 * Vérifié le 2026-07-24 : les lignes `overall` sont contiguës en tête du split
 * (~1113 lignes, ~185 modèles), triées par rang, toutes à la même
 * `leaderboard_publish_date`. On pagine donc en tête et on s'arrête dès qu'une
 * page contient une autre catégorie (garde-fou : plafond de pages). Bien plus
 * robuste qu'une recherche par nom (`/search`), qui trie par pertinence et
 * risque de tronquer les lignes d'un modèle au-delà des 100 premiers résultats.
 */

const BASE_LMARENA =
  "https://datasets-server.huggingface.co/rows" +
  "?dataset=lmarena-ai/leaderboard-dataset&config=text&split=latest";

/** Nombre de lignes par appel (maximum accepté par l'endpoint). */
const TAILLE_PAGE = 100;
/** Plafond de pages (garde-fou : ~1113 lignes overall ≈ 12 pages, marge large). */
const MAX_PAGES = 20;

/** Elo (rating Bradley-Terry) agrégé d'un modèle suivi. */
export type IntelLmarena = { modelKey: string; elo: number };

export type ResultatLmarena = {
  intelligences: IntelLmarena[];
  /** Date native de fraîcheur = max(leaderboard_publish_date) des lignes overall. */
  sourceDate: string | null;
};

type LigneLmarena = {
  model_name: string;
  rating: number;
  category: string;
  leaderboard_publish_date: string;
};

function mediane(valeurs: number[]): number {
  const triees = [...valeurs].sort((a, b) => a - b);
  const milieu = Math.floor(triees.length / 2);
  return triees.length % 2 === 1
    ? triees[milieu]
    : (triees[milieu - 1] + triees[milieu]) / 2;
}

/**
 * Récupère l'Elo overall des modèles suivis. Lève si le fetch échoue ou si la
 * réponse est mal formée (la route de refresh rattrape par source).
 */
export async function fetchLmarena(
  modeles: Modele[],
): Promise<ResultatLmarena> {
  // model_name → liste des ratings overall (à médianiser).
  const ratingsParNom = new Map<string, number[]>();
  let dateMax: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const offset = page * TAILLE_PAGE;
    const reponse = await fetch(
      `${BASE_LMARENA}&offset=${offset}&length=${TAILLE_PAGE}`,
      { headers: { accept: "application/json" } },
    );
    if (!reponse.ok) {
      throw new Error(`LMArena a répondu ${reponse.status}`);
    }
    const donnees = (await reponse.json()) as {
      rows?: { row: LigneLmarena }[];
    };
    const rows = donnees.rows;
    if (!Array.isArray(rows) || rows.length === 0) break;

    let finSectionOverall = false;
    for (const { row } of rows) {
      // Les lignes overall sont en tête : la 1re non-overall marque la fin.
      if (row.category !== "overall") {
        finSectionOverall = true;
        break;
      }
      const liste = ratingsParNom.get(row.model_name);
      if (liste) liste.push(row.rating);
      else ratingsParNom.set(row.model_name, [row.rating]);
      const d = row.leaderboard_publish_date;
      if (d && (dateMax == null || d > dateMax)) dateMax = d;
    }

    if (finSectionOverall) break;
    // Dernière page atteinte : on arrête.
    if (rows.length < TAILLE_PAGE) break;
  }

  // Médiane par nom, puis meilleure médiane parmi les variantes d'un modèle.
  const intelligences: IntelLmarena[] = [];
  for (const modele of modeles) {
    let meilleur: number | null = null;
    for (const nom of modele.lmarenaNames) {
      const ratings = ratingsParNom.get(nom);
      if (!ratings || ratings.length === 0) continue;
      const med = mediane(ratings);
      if (meilleur == null || med > meilleur) meilleur = med;
    }
    if (meilleur != null) {
      intelligences.push({ modelKey: modele.cle, elo: meilleur });
    }
  }

  return { intelligences, sourceDate: dateMax };
}
