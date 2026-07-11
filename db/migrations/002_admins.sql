-- 002_admins.sql — Comptes administrateurs (F3 · CDC §5.3, §6).
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
-- Le runner (scripts/db-migrate.mjs) applique les fichiers dans l'ordre
-- alphabétique : 002 s'exécute après 001 (pgcrypto y est déjà activé).

-- Deux comptes admins maximum (CDC §5.3) : la limite est vérifiée à la création
-- (scripts/create-admin.mjs). Aucune création de compte publique.
create table if not exists admins (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- Unicité insensible à la casse : l'email est normalisé en minuscules côté
-- application, l'index le garantit en base (même approche que les inscriptions).
create unique index if not exists admins_email_uniq
  on admins (lower(email));
