-- 009_rls.sql — Row-Level Security sur toutes les tables du schéma public.
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
-- Migration STRICTEMENT ADDITIVE et idempotente : seul un drapeau de table est
-- levé, aucun schéma ni aucune donnée n'est touché.
--
-- Motivation — alerte « security advisor » de Supabase (rls_disabled_in_public,
-- sensitive_columns_exposed) : Supabase publie automatiquement le schéma public
-- via son API REST (PostgREST), joignable par les rôles `anon` et
-- `authenticated`. Sans RLS, n'importe qui muni de l'URL du projet pourrait y
-- lire les inscriptions, les contacts, les réponses aux QCM, etc.
--
-- AUCUNE POLICY N'EST CRÉÉE, VOLONTAIREMENT : RLS activée sans policy = aucune
-- ligne visible. C'est exactement l'effet recherché, puisque le site n'utilise
-- pas l'API Supabase — lib/db.ts ouvre une connexion Postgres standard
-- (DATABASE_URL) avec le rôle propriétaire des tables, et le propriétaire
-- contourne la RLS par défaut. L'application continue donc de fonctionner à
-- l'identique, seul l'accès REST est fermé.
--
-- Pour la même raison, on n'écrit ni `revoke ... from anon, authenticated`
-- (ces rôles sont propres à Supabase et n'existent pas sur OVH : la migration
-- échouerait), ni `force row level security` (qui soumettrait le propriétaire
-- à la RLS et couperait l'accès de l'application).
--
-- Conséquence à retenir : toute future connexion faite avec un rôle NON
-- propriétaire (un rôle applicatif dédié, par exemple) ne verra plus rien tant
-- qu'une policy explicite ne sera pas écrite.

alter table _migrations        enable row level security;
alter table admins             enable row level security;
alter table benchmark_sources  enable row level security;
alter table contacts           enable row level security;
alter table emails_envoyes     enable row level security;
alter table formation_messages enable row level security;
alter table inscriptions       enable row level security;
alter table participants       enable row level security;
alter table qcm_options        enable row level security;
alter table qcm_ouvertures     enable row level security;
alter table qcm_questionnaires enable row level security;
alter table qcm_questions      enable row level security;
alter table qcm_reponses       enable row level security;
alter table sessions           enable row level security;
