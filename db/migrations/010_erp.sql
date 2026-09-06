-- 010_erp.sql — Socle de données ERP (Lot 0 · cadrage-erp-marssane.md §5-6).
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
-- Le runner (scripts/db-migrate.mjs) applique les fichiers dans l'ordre
-- alphabétique : 010 s'exécute après 001-009 (pgcrypto déjà activé en 001).
--
-- Périmètre : tables des modules CRM (organisations, personnes, opportunités,
-- activités/relances), devis & facturation, paiements et suivi documentaire
-- des sessions. Aucune table existante n'est modifiée, à une exception près :
-- `inscriptions` gagne un lien OPTIONNEL vers `personnes` (colonne nullable,
-- migration strictement additive).

-- ---------------------------------------------------------------------------
-- CRM
-- ---------------------------------------------------------------------------

-- Entreprises clientes ou prescriptrices. Les rôles (prospect, client,
-- prescripteur…) sont portés par les personnes, pas par l'organisation.
create table if not exists organisations (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  siren       text,
  adresse     text,
  code_postal text,
  ville       text,
  email       text,
  telephone   text,
  site_web    text,
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists organisations_nom_idx on organisations (lower(nom));

-- Contacts nominatifs. `roles` : une personne peut cumuler plusieurs rôles
-- (ex. prescripteur Novances devenu client). `source` : origine du contact
-- (formulaire du site, réseau, recommandation…), texte libre.
create table if not exists personnes (
  id              uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  prenom          text not null,
  nom             text not null,
  email           text,
  telephone       text,
  fonction        text,
  roles           text[] not null default '{prospect}'
                    check (roles <@ array['prospect','client','prescripteur','partenaire']::text[]),
  source          text,
  notes           text,
  created_at      timestamptz not null default now()
);

create index if not exists personnes_organisation_idx on personnes (organisation_id);
create index if not exists personnes_email_idx on personnes (lower(email));

-- Affaires en cours. Étapes du pipeline (cadrage §4.B) :
-- contact → echange → proposition → gagnee / perdue.
-- `session_id` : rattachement à la session visée quand elle est connue.
create table if not exists opportunites (
  id              uuid primary key default gen_random_uuid(),
  personne_id     uuid not null references personnes(id),
  session_id      uuid references sessions(id),
  titre           text,
  etape           text not null default 'contact'
                    check (etape in ('contact','echange','proposition','gagnee','perdue')),
  montant_estime  numeric(12,2),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists opportunites_etape_idx on opportunites (etape);
create index if not exists opportunites_personne_idx on opportunites (personne_id);

-- Journal des échanges et relances. `relance_at` : prochaine action datée ;
-- le dashboard remonte les lignes où relance_at <= aujourd'hui et
-- relance_faite = false. Une activité peut n'être qu'une relance planifiée
-- (contenu libre).
create table if not exists activites (
  id             uuid primary key default gen_random_uuid(),
  personne_id    uuid not null references personnes(id),
  opportunite_id uuid references opportunites(id),
  type           text not null default 'note'
                   check (type in ('appel','email','rencontre','note','autre')),
  contenu        text,
  effectue_at    timestamptz not null default now(),
  relance_at     date,
  relance_faite  boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists activites_personne_idx on activites (personne_id);
create index if not exists activites_relance_idx
  on activites (relance_at) where relance_at is not null and not relance_faite;

-- ---------------------------------------------------------------------------
-- Devis & facturation
-- ---------------------------------------------------------------------------

-- Devis. `numero` attribué à l'envoi (nullable en brouillon), unique ensuite.
-- Les totaux sont calculés par l'application depuis les lignes et recopiés ici
-- pour le pilotage (dashboard « argent ») — source de vérité : les lignes.
create table if not exists devis (
  id              uuid primary key default gen_random_uuid(),
  numero          text unique,
  organisation_id uuid references organisations(id),
  personne_id     uuid references personnes(id),
  opportunite_id  uuid references opportunites(id),
  statut          text not null default 'brouillon'
                    check (statut in ('brouillon','envoye','accepte','refuse','expire')),
  date_emission   date,
  date_expiration date,
  montant_ht      numeric(12,2) not null default 0,
  montant_tva     numeric(12,2) not null default 0,
  montant_ttc     numeric(12,2) not null default 0,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists devis_statut_idx on devis (statut);

create table if not exists devis_lignes (
  id               uuid primary key default gen_random_uuid(),
  devis_id         uuid not null references devis(id) on delete cascade,
  ordre            integer not null default 0,
  designation      text not null,
  quantite         numeric(10,2) not null default 1,
  prix_unitaire_ht numeric(12,2) not null default 0,
  tva_pct          numeric(5,2) not null default 20
);

create index if not exists devis_lignes_devis_idx on devis_lignes (devis_id);

-- Factures et avoirs. Règles (cadrage §4.C) :
--   - `numero` attribué à l'émission (nullable en brouillon), unique, séquentiel
--     par année (FA-2026-001). L'attribution est faite par l'application ;
--     utilisateur unique, pas de concurrence à gérer.
--   - Jamais de suppression d'une facture émise : annulation par AVOIR
--     (type = 'avoir', montants négatifs, `facture_liee_id` vers l'original).
--   - `statut` 'en_retard' est dérivable (echeance dépassée + non payée) mais
--     stocké pour simplifier les listes ; recalculé par l'application.
create table if not exists factures (
  id              uuid primary key default gen_random_uuid(),
  numero          text unique,
  type            text not null default 'facture'
                    check (type in ('facture','avoir')),
  facture_liee_id uuid references factures(id),
  devis_id        uuid references devis(id),
  organisation_id uuid references organisations(id),
  personne_id     uuid references personnes(id),
  session_id      uuid references sessions(id),
  statut          text not null default 'brouillon'
                    check (statut in ('brouillon','emise','payee','en_retard','annulee')),
  date_emission   date,
  date_echeance   date,
  montant_ht      numeric(12,2) not null default 0,
  montant_tva     numeric(12,2) not null default 0,
  montant_ttc     numeric(12,2) not null default 0,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists factures_statut_idx on factures (statut);
create index if not exists factures_session_idx on factures (session_id);

create table if not exists factures_lignes (
  id               uuid primary key default gen_random_uuid(),
  facture_id       uuid not null references factures(id) on delete cascade,
  ordre            integer not null default 0,
  designation      text not null,
  quantite         numeric(10,2) not null default 1,
  prix_unitaire_ht numeric(12,2) not null default 0,
  tva_pct          numeric(5,2) not null default 20
);

create index if not exists factures_lignes_facture_idx on factures_lignes (facture_id);

-- Encaissements, saisis à la main et rapprochés d'une facture.
create table if not exists paiements (
  id         uuid primary key default gen_random_uuid(),
  facture_id uuid not null references factures(id),
  montant    numeric(12,2) not null,
  moyen      text not null default 'virement'
               check (moyen in ('virement','cheque','carte','autre')),
  recu_le    date not null,
  reference  text,
  created_at timestamptz not null default now()
);

create index if not exists paiements_facture_idx on paiements (facture_id);

-- ---------------------------------------------------------------------------
-- Administratif formation
-- ---------------------------------------------------------------------------

-- Suivi des documents obligatoires par session (cadrage §4.D).
-- `inscription_id` : renseigné pour les documents individuels (convocation,
-- attestation, certificat), NULL pour les documents de session (émargement…).
-- `chemin` : référence du fichier généré (stockage à préciser au Lot 3).
create table if not exists documents_session (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references sessions(id),
  inscription_id uuid references inscriptions(id),
  type           text not null
                   check (type in ('convention','convocation','emargement','attestation','certificat','autre')),
  statut         text not null default 'a_generer'
                   check (statut in ('a_generer','genere','envoye','signe')),
  chemin         text,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists documents_session_session_idx on documents_session (session_id);

-- ---------------------------------------------------------------------------
-- Lien inscriptions → personnes (additif, nullable)
-- ---------------------------------------------------------------------------

-- Unifie l'historique d'un contact : une inscription peut être rattachée à la
-- personne correspondante du CRM. Aucune contrainte sur l'existant.
alter table inscriptions
  add column if not exists personne_id uuid references personnes(id);

create index if not exists inscriptions_personne_idx on inscriptions (personne_id);

-- ---------------------------------------------------------------------------
-- RLS — même politique que 009 : drapeau levé, aucune policy (l'application
-- se connecte en propriétaire et contourne la RLS ; l'API REST Supabase est
-- fermée sur ces tables).
-- ---------------------------------------------------------------------------

alter table organisations     enable row level security;
alter table personnes         enable row level security;
alter table opportunites      enable row level security;
alter table activites         enable row level security;
alter table devis             enable row level security;
alter table devis_lignes      enable row level security;
alter table factures          enable row level security;
alter table factures_lignes   enable row level security;
alter table paiements         enable row level security;
alter table documents_session enable row level security;
