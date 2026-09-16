-- Rendez-vous projet : planning distinct des sessions de formation.
-- Un seul rendez-vous confirmé par heure ; annuler libère le créneau.
create table if not exists rendez_vous (
  id uuid primary key default gen_random_uuid(),
  cle_confirmation uuid not null unique,
  nom text not null check (char_length(nom) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  debut timestamptz not null,
  fin timestamptz not null,
  statut text not null default 'confirme' check (statut in ('confirme', 'annule')),
  created_at timestamptz not null default now(),
  annule_at timestamptz,
  constraint rendez_vous_duree check (fin = debut + interval '1 hour'),
  constraint rendez_vous_heure check (extract(minute from debut at time zone 'Europe/Paris') = 0 and extract(second from debut at time zone 'Europe/Paris') = 0),
  constraint rendez_vous_ouverture check (
    extract(isodow from debut at time zone 'Europe/Paris') between 1 and 5
    and extract(hour from debut at time zone 'Europe/Paris') between 9 and 17
  )
);

create unique index if not exists rendez_vous_creneau_confirme
  on rendez_vous (debut) where statut = 'confirme';
create index if not exists rendez_vous_debut_idx on rendez_vous (debut);

-- Comme les autres tables du site : accès par le serveur Postgres uniquement.
-- Aucune donnée personnelle accessible via les rôles publics de l'API REST.
alter table rendez_vous enable row level security;
