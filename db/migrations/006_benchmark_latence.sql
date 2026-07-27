-- 006_benchmark_latence.sql — Réactivité des modèles pour la page « /quelle-ia ».
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
-- Migration STRICTEMENT ADDITIVE et idempotente : une seule colonne ajoutée à
-- benchmark_sources, aucune donnée existante touchée.

-- latence_s : temps de réflexion avant la première réponse, EN SECONDES
-- (médiane mesurée par Artificial Analysis, champ
-- `median_time_to_first_answer_token`). Pour un modèle à raisonnement, c'est le
-- temps passé à réfléchir avant de commencer à répondre — c'est le troisième
-- terme du score (cf. lib/benchmarks/aggregate.ts).
-- Alimentée par la source `aa` SEULE : openrouter et lmarena n'exposent rien
-- d'équivalent et laissent la colonne NULL.
-- NULL signifie « non mesurée par AA », jamais « instantané » : l'agrégation
-- traite ce cas sans bonus ni malus.
alter table benchmark_sources
  add column if not exists latence_s double precision;
