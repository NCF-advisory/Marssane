-- 003_contacts.sql — Demandes de contact « implémentation » (F4 · CDC §5.4, §6).
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
-- Le runner (scripts/db-migrate.mjs) applique les fichiers dans l'ordre
-- alphabétique : 003 s'exécute après 001/002 (pgcrypto y est déjà activé).

-- Demandes reçues via le formulaire « Aller plus loin » de la landing.
--
-- consentement_at : le CDC §5.4 impose un consentement RGPD explicite sur le
-- formulaire ; cette colonne trace l'horodatage du consentement. Elle complète
-- le modèle indicatif du §6 (qui ne la listait pas) — même choix que la table
-- inscriptions, pour conserver une preuve de consentement (CDC §7.6).
create table if not exists contacts (
  id              uuid primary key default gen_random_uuid(),
  prenom          text not null,
  nom             text not null,
  email           text not null,
  telephone       text,
  entreprise      text not null,
  message         text not null,
  traite          boolean not null default false,
  consentement_at timestamptz not null,
  created_at      timestamptz not null default now()
);

-- Accès admin : liste triée de la plus récente à la plus ancienne.
create index if not exists contacts_created_at_idx on contacts (created_at desc);
