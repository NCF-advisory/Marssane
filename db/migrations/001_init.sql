-- 001_init.sql — Schéma initial Marssane (F2 · CDC §5.2, §6).
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).

-- gen_random_uuid() : intégré au cœur depuis Postgres 13, l'extension garantit
-- la disponibilité sur les instances plus anciennes ou verrouillées.
create extension if not exists pgcrypto;

-- Sessions de formation (une journée, 10 places par défaut).
create table if not exists sessions (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  heure_debut time,
  heure_fin   time,
  lieu        text,
  capacite    integer not null default 10,
  statut      text not null default 'brouillon'
                check (statut in ('brouillon', 'publiee', 'complete', 'terminee')),
  created_at  timestamptz not null default now()
);

-- Pré-inscriptions. session_id NULL = liste d'attente générale (aucune session
-- publiée, CDC §5.1 : le formulaire reste actif en mode « liste d'attente »).
create table if not exists inscriptions (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid references sessions(id),
  prenom          text not null,
  nom             text not null,
  email           text not null,
  telephone       text not null,
  metier          text not null,
  metier_autre    text,
  entreprise      text,
  statut          text not null default 'confirme'
                    check (statut in ('confirme', 'attente', 'annule')),
  consentement_at timestamptz not null,
  created_at      timestamptz not null default now()
);

-- Anti-doublon (CDC §5.2 : même email refusé sur une même session).
-- Comparaison insensible à la casse : l'email est normalisé en minuscules côté
-- application, l'index le garantit en base.
create unique index if not exists inscriptions_session_email_uniq
  on inscriptions (session_id, lower(email))
  where session_id is not null;

-- Doublon en liste d'attente générale (sans session rattachée).
create unique index if not exists inscriptions_attente_email_uniq
  on inscriptions (lower(email))
  where session_id is null;

-- Accès fréquent : sessions publiées à venir, triées par date.
create index if not exists sessions_statut_date_idx
  on sessions (statut, date);
