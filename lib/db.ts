import postgres from "postgres";

/**
 * Client Postgres partagé (postgres.js).
 *
 * Portabilité (CDC §7.4) : accès Postgres standard, aucune API propriétaire.
 * On change de base (Supabase → OVH) en changeant `DATABASE_URL`.
 *
 * Le client est créé paresseusement (au premier appel, jamais à l'import) afin
 * que le build et le rendu fonctionnent sans variable d'environnement. Aucune
 * connexion n'est ouverte tant que `getSql()` n'est pas appelé.
 *
 * Options :
 *  - `ssl: "require"` : Supabase (et OVH managé) exigent TLS.
 *  - `prepare: false` : compatibilité avec le pooler pgbouncer de Supabase en
 *    mode transaction (les requêtes préparées y sont incompatibles).
 */
let client: ReturnType<typeof postgres> | null = null;

export function getSql(): ReturnType<typeof postgres> {
  if (client) return client;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL est absent : renseignez la connexion Postgres dans .env.local (voir .env.example).",
    );
  }

  client = postgres(url, { ssl: "require", prepare: false });
  return client;
}
