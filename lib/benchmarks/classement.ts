import { getSql } from "../db";
import { aggreger, type Classement, type SourceRow } from "./aggregate";
import { MODELES } from "./models";

/**
 * Lecture du classement « /quelle-ia ».
 *
 * `getClassement` lit les données brutes (benchmark_sources) et applique la
 * formule (aggregate.ts). `getClassementSafe` est la variante « sûre » que la
 * future page consommera : en cas de base absente/injoignable, de table vide ou
 * de toute erreur, elle renvoie un objet vide sûr (`{ entries: [] }`) au lieu de
 * lever — même philosophie que `getProchaineSessionSafe` (lib/sessions.ts), pour
 * que la page se rende et que `npm run build` passe sans base.
 */

/** Classement vide et sûr (repli quand la base est indisponible). */
const CLASSEMENT_VIDE: Classement = {
  entries: [],
  miseAJour: null,
  fraicheur: [],
  degrade: true,
};

export async function getClassement(): Promise<Classement> {
  const sql = getSql();

  // source_date::text → 'YYYY-MM-DD' (chaîne attendue par aggregate) ; fetched_at
  // reste un timestamptz (Date côté postgres.js), converti en ISO ci-dessous.
  const rows = await sql<
    {
      source: string;
      model_key: string;
      intelligence_raw: number | null;
      cost_input_usd_m: number | null;
      cost_output_usd_m: number | null;
      effort: string | null;
      source_date: string | null;
      fetched_at: Date;
    }[]
  >`
    select
      source,
      model_key,
      intelligence_raw,
      cost_input_usd_m,
      cost_output_usd_m,
      effort,
      source_date::text as source_date,
      fetched_at
    from benchmark_sources
  `;

  const sourceRows: SourceRow[] = rows.map((r) => ({
    source: r.source,
    model_key: r.model_key,
    intelligence_raw: r.intelligence_raw,
    cost_input_usd_m: r.cost_input_usd_m,
    cost_output_usd_m: r.cost_output_usd_m,
    effort: r.effort,
    source_date: r.source_date,
    fetched_at: r.fetched_at.toISOString(),
  }));

  return aggreger(sourceRows, MODELES);
}

export async function getClassementSafe(): Promise<Classement> {
  try {
    return await getClassement();
  } catch {
    console.error("[benchmarks] classement indisponible : repli vide");
    return CLASSEMENT_VIDE;
  }
}
