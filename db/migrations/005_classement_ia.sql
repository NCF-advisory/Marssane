-- 005_classement_ia.sql — Données brutes de benchmark pour la page « /quelle-ia ».
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
-- Le runner (scripts/db-migrate.mjs) applique les fichiers dans l'ordre
-- alphabétique : 005 s'exécute après 001-004. Migration STRICTEMENT ADDITIVE
-- (aucune table existante n'est modifiée ni supprimée).

-- Stocke les mesures BRUTES par (source × modèle), telles que renvoyées par
-- chaque connecteur au dernier rafraîchissement. On ne stocke PAS le classement
-- déjà calculé : la formule (lib/benchmarks/aggregate.ts) est recalculée à la
-- lecture, ce qui permet de l'ajuster (plancher, pondérations, taux €) sans
-- re-fetch des sources externes.
--
-- Une ligne = une source (openrouter | lmarena | aa) pour un modèle suivi
-- (model_key = la clé curée de lib/benchmarks/models.ts). Les colonnes non
-- pertinentes pour une source restent NULL :
--   - openrouter alimente cost_input_usd_m / cost_output_usd_m (prix $/million) ;
--   - lmarena alimente intelligence_raw (Elo Bradley-Terry brut) + source_date ;
--   - aa (si activé) alimente intelligence_raw (indice 0-100), les deux coûts
--     et effort (variante high/xhigh/max mesurée).
-- source_date : date native de fraîcheur de la source (ex. leaderboard LMArena) ;
-- NULL si la source n'en expose pas (OpenRouter). fetched_at : instant du fetch.
create table if not exists benchmark_sources (
  source            text not null,
  model_key         text not null,
  intelligence_raw  double precision,
  cost_input_usd_m  double precision,
  cost_output_usd_m double precision,
  effort            text,
  source_date       date,
  fetched_at        timestamptz not null default now(),
  primary key (source, model_key)
);

-- Lecture du classement : on relit toutes les lignes puis on agrège en mémoire.
-- Index sur model_key pour un futur filtrage par modèle si besoin.
create index if not exists benchmark_sources_model_idx
  on benchmark_sources (model_key);
