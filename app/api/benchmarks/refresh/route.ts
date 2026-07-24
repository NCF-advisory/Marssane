import type { NextRequest } from "next/server";
import { getSql } from "@/lib/db";
import { fetchArtificialAnalysis } from "@/lib/benchmarks/artificial-analysis";
import { fetchLmarena } from "@/lib/benchmarks/lmarena";
import { MODELES } from "@/lib/benchmarks/models";
import { fetchOpenRouter } from "@/lib/benchmarks/openrouter";

/**
 * Rafraîchissement des données de benchmark (page « /quelle-ia »).
 *
 * Route CRON quotidienne (voir vercel.json). Appelle chaque connecteur, puis
 * upsert les données BRUTES dans benchmark_sources. Gestion d'erreur PAR SOURCE :
 * si une source échoue (réseau, format), on n'upsert rien pour elle — ses
 * lignes précédentes restent en base (dernière valeur connue) — et on continue
 * les autres sources.
 *
 * Protégée par `Authorization: Bearer ${CRON_SECRET}` (en-tête que Vercel Cron
 * envoie automatiquement). Sans clé configurée ou en-tête invalide → 401.
 *
 * Runtime nodejs (client postgres). Jamais mise en cache.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Ligne à upsert (mêmes colonnes que benchmark_sources). */
type LigneBrute = {
  source: string;
  model_key: string;
  intelligence_raw: number | null;
  cost_input_usd_m: number | null;
  cost_output_usd_m: number | null;
  effort: string | null;
  source_date: string | null;
  fetched_at: Date;
};

type Sql = ReturnType<typeof getSql>;

/** Upsert d'un lot de lignes (clé primaire source, model_key). */
async function upsert(sql: Sql, lignes: LigneBrute[]): Promise<void> {
  if (lignes.length === 0) return;
  await sql`
    insert into benchmark_sources ${sql(
      lignes,
      "source",
      "model_key",
      "intelligence_raw",
      "cost_input_usd_m",
      "cost_output_usd_m",
      "effort",
      "source_date",
      "fetched_at",
    )}
    on conflict (source, model_key) do update set
      intelligence_raw  = excluded.intelligence_raw,
      cost_input_usd_m  = excluded.cost_input_usd_m,
      cost_output_usd_m = excluded.cost_output_usd_m,
      effort            = excluded.effort,
      source_date       = excluded.source_date,
      fetched_at        = excluded.fetched_at
  `;
}

type EtatSource = {
  ok: boolean;
  models: number;
  active?: boolean;
  error?: string;
};

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Non autorisé.", { status: 401 });
  }

  const sql = getSql();
  const fetchedAt = new Date();
  const sources: Record<string, EtatSource> = {};

  // --- OpenRouter (coût) -----------------------------------------------------
  try {
    const couts = await fetchOpenRouter(MODELES);
    await upsert(
      sql,
      couts.map((c) => ({
        source: "openrouter",
        model_key: c.modelKey,
        intelligence_raw: null,
        cost_input_usd_m: c.inputUsdM,
        cost_output_usd_m: c.outputUsdM,
        effort: null,
        source_date: null,
        fetched_at: fetchedAt,
      })),
    );
    sources.openrouter = { ok: true, models: couts.length };
  } catch (err) {
    sources.openrouter = { ok: false, models: 0, error: messageErreur(err) };
  }

  // --- LMArena (intelligence) ------------------------------------------------
  try {
    const { intelligences, sourceDate } = await fetchLmarena(MODELES);
    await upsert(
      sql,
      intelligences.map((i) => ({
        source: "lmarena",
        model_key: i.modelKey,
        intelligence_raw: i.elo,
        cost_input_usd_m: null,
        cost_output_usd_m: null,
        effort: null,
        source_date: sourceDate,
        fetched_at: fetchedAt,
      })),
    );
    sources.lmarena = { ok: true, models: intelligences.length };
  } catch (err) {
    sources.lmarena = { ok: false, models: 0, error: messageErreur(err) };
  }

  // --- Artificial Analysis (intelligence + coût, optionnelle) ----------------
  const aaActive = Boolean(process.env.AA_API_KEY);
  try {
    const aa = await fetchArtificialAnalysis(MODELES);
    await upsert(
      sql,
      aa.map((m) => ({
        source: "aa",
        model_key: m.modelKey,
        intelligence_raw: m.intelligence,
        cost_input_usd_m: m.inputUsdM,
        cost_output_usd_m: m.outputUsdM,
        effort: m.effort,
        source_date: null,
        fetched_at: fetchedAt,
      })),
    );
    sources.aa = { ok: true, models: aa.length, active: aaActive };
  } catch (err) {
    sources.aa = {
      ok: false,
      models: 0,
      active: aaActive,
      error: messageErreur(err),
    };
  }

  return Response.json({ fetchedAt: fetchedAt.toISOString(), sources });
}

function messageErreur(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
