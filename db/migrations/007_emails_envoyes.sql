-- 007_emails_envoyes.sql — Traçabilité des emails transactionnels (F5 · CDC §5.5).
-- Deux usages, une seule table :
--  1. statut réel d'un envoi (les événements Resend arrivent par webhook) — un
--     « envoyé » côté API ne prouve rien : une adresse supprimée (suppressed)
--     répond OK avec un id puis rebondit ;
--  2. anti-doublon des rappels J-7 / J-1 (garanti en base, pas dans le code).
-- Postgres standard uniquement (portabilité Supabase → OVH, CDC §7.4).
-- Le runner (scripts/db-migrate.mjs) applique les fichiers dans l'ordre
-- alphabétique : 007 s'exécute après 001-006 (pgcrypto y est déjà activé).

-- inscription_id NOT NULL + on delete cascade : tous les types tracés ici
-- concernent une inscription (l'email « admin » notifie une inscription
-- précise). Une ligne orpheline n'aurait aucun usage — l'inscrit disparaît en
-- même temps de l'admin — et l'effacement RGPD (CDC §7.6) doit emporter la
-- trace avec la donnée. L'index unique partiel ci-dessous exige par ailleurs
-- une valeur non nulle pour protéger quoi que ce soit.
--
-- resend_id : id retourné par l'API Resend, clé de rapprochement des
-- événements du webhook. Nullable : la ligne est écrite pour tracer l'envoi
-- (et bloquer un second rappel) même si la réponse de l'API n'expose pas d'id.
--
-- statut : dernier événement reçu. `envoye` à l'insertion (l'API a accepté),
-- puis mis à jour par le webhook.
create table if not exists emails_envoyes (
  id             uuid primary key default gen_random_uuid(),
  inscription_id uuid not null references inscriptions(id) on delete cascade,
  type           text not null
                   check (type in ('confirmation', 'attente', 'admin',
                                   'invitation', 'rappel_j7', 'rappel_j1',
                                   'promotion', 'annulation')),
  resend_id      text,
  statut         text not null default 'envoye'
                   check (statut in ('envoye', 'delivre', 'rebond', 'plainte',
                                     'differe', 'echec')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Un rappel part une fois et une seule, y compris si deux exécutions du cron se
-- chevauchent : l'unicité est posée en base, l'insertion en doublon échoue
-- (23505) et la couche d'accès l'ignore. Restreint aux rappels — les autres
-- types se répètent légitimement (renvoi d'invitation, plusieurs promotions).
create unique index if not exists emails_envoyes_rappel_uniq
  on emails_envoyes (inscription_id, type)
  where type in ('rappel_j7', 'rappel_j1');

-- Le webhook Resend retrouve la ligne par l'id de l'envoi.
create index if not exists emails_envoyes_resend_id_idx
  on emails_envoyes (resend_id)
  where resend_id is not null;

-- Statut du dernier email destiné à l'inscrit (colonne de l'admin) : lookup par
-- inscription, le plus récent d'abord.
create index if not exists emails_envoyes_inscription_idx
  on emails_envoyes (inscription_id, created_at desc);
