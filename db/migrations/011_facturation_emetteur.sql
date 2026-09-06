-- 011_facturation_emetteur.sql — Paramètres de facturation (ERP · Lot 2).
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
--
-- Table SINGLETON (une seule ligne, clé `id` booléenne contrainte à true) :
-- identité de l'entité émettrice des devis et factures, régime de TVA et
-- conditions de paiement. Tous les champs d'identité sont nullables : la page
-- « Paramètres » les remplit, et l'application REFUSE d'émettre une facture
-- tant que les champs obligatoires (raison sociale, forme, SIREN, adresse,
-- régime de TVA) ne sont pas renseignés — décision du 24/08/2026, les points
-- du cadrage §7 restant à valider avec le comptable.

create table if not exists facturation_emetteur (
  id                       boolean primary key default true check (id),
  raison_sociale           text,
  forme_juridique          text,
  capital                  text,
  siren                    text,
  tva_intra                text,
  adresse                  text,
  code_postal              text,
  ville                    text,
  email                    text,
  telephone                text,
  -- Régime de TVA (cadrage §7.2) :
  --   tva_20                : régime général, taux par défaut ci-dessous ;
  --   exoneration_formation : art. 261-4-4°a du CGI (suppose la déclaration
  --                           d'activité DREETS et la demande d'exonération) ;
  --   franchise_base        : art. 293 B du CGI.
  regime_tva               text
                             check (regime_tva in ('tva_20','exoneration_formation','franchise_base')),
  taux_tva_defaut          numeric(5,2) not null default 20,
  delai_paiement_jours     integer not null default 30,
  iban                     text,
  bic                      text,
  mentions_complementaires text,
  updated_at               timestamptz not null default now()
);

-- Même politique RLS que 009/010 : drapeau levé, aucune policy.
alter table facturation_emetteur enable row level security;

-- Objet du document (« Formation débutant — session du 24/09 »), affiché en
-- tête des devis et factures. Additif ; distinct des notes internes.
alter table devis    add column if not exists objet text;
alter table factures add column if not exists objet text;
