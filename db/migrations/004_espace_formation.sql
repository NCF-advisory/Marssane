-- 004_espace_formation.sql — Espace formation : participants, chat, QCM.
-- Modèle des 3 phases posé en une seule migration ; seule la phase 1
-- (participants + invitations) est câblée à l'UI à ce jalon.
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
-- Le runner (scripts/db-migrate.mjs) applique les fichiers dans l'ordre
-- alphabétique : 004 s'exécute après 001-003 (pgcrypto y est déjà activé).

-- ===== Phase 1 · Participants ==========================================
-- Un participant = un inscrit confirmé invité à l'espace formation. La colonne
-- inscription_id (unique) garantit un seul participant par inscription ; le
-- rattachement à la session (promotion) est dupliqué pour l'accès direct.
-- password_hash NULL = compte pas encore activé (invitation en attente).
create table if not exists participants (
  id                uuid primary key default gen_random_uuid(),
  inscription_id    uuid not null unique references inscriptions(id) on delete cascade,
  session_id        uuid not null references sessions(id) on delete cascade,
  email             text not null,
  password_hash     text,
  invite_token_hash text,
  invite_expires_at timestamptz,
  invited_at        timestamptz,
  activated_at      timestamptz,
  created_at        timestamptz not null default now()
);

-- Unicité email insensible à la casse par session (même logique que les
-- inscriptions rattachées à une session). L'email est normalisé en minuscules
-- côté application ; l'index le garantit en base.
create unique index if not exists participants_session_email_uniq
  on participants (session_id, lower(email));

-- Lookup d'activation par empreinte du token d'invitation.
create index if not exists participants_invite_token_idx
  on participants (invite_token_hash)
  where invite_token_hash is not null;

-- ===== Phase 2 · Chat commun de la promotion ===========================
-- Fil de messages par session. participant_id NULL + auteur_admin = message du
-- formateur/administrateur (FAQ du mercredi, mis en évidence et épinglé).
-- claude_quote : réponse de Claude citée par le participant (« d'abord Claude,
-- puis le chat »). attachment_name : nom de la capture éventuelle.
create table if not exists formation_messages (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references sessions(id) on delete cascade,
  participant_id  uuid references participants(id) on delete set null,
  auteur_admin    boolean not null default false,
  contenu         text not null,
  claude_quote    text,
  attachment_name text,
  epingle         boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists formation_messages_session_idx
  on formation_messages (session_id, created_at);

-- ===== Phase 3 · QCM ===================================================
-- Banque de questionnaires : un par demi-journée (numero_session 1 ou 2).
create table if not exists qcm_questionnaires (
  id             uuid primary key default gen_random_uuid(),
  numero_session smallint not null check (numero_session in (1, 2)),
  titre          text not null,
  created_at     timestamptz not null default now()
);

create table if not exists qcm_questions (
  id               uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references qcm_questionnaires(id) on delete cascade,
  ordre            smallint not null,
  enonce           text not null,
  type             text not null check (type in ('radio', 'checkbox'))
);

create index if not exists qcm_questions_questionnaire_idx
  on qcm_questions (questionnaire_id, ordre);

create table if not exists qcm_options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references qcm_questions(id) on delete cascade,
  ordre       smallint not null,
  libelle     text not null,
  correcte    boolean not null default false
);

create index if not exists qcm_options_question_idx
  on qcm_options (question_id, ordre);

-- Ouverture d'un questionnaire pour une promotion (le formateur « ouvre » le
-- QCM en fin de session). Une seule ouverture par couple (session, questionnaire).
create table if not exists qcm_ouvertures (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid not null references sessions(id) on delete cascade,
  questionnaire_id uuid not null references qcm_questionnaires(id) on delete cascade,
  ouvert_at        timestamptz not null default now(),
  ferme_at         timestamptz,
  unique (session_id, questionnaire_id)
);

-- Réponses d'un participant, une ligne par question (option_ids : une ou
-- plusieurs options cochées selon le type). Unicité (participant, question).
create table if not exists qcm_reponses (
  id             uuid primary key default gen_random_uuid(),
  participant_id uuid not null references participants(id) on delete cascade,
  question_id    uuid not null references qcm_questions(id) on delete cascade,
  option_ids     uuid[] not null default '{}',
  repondu_at     timestamptz not null default now(),
  unique (participant_id, question_id)
);
