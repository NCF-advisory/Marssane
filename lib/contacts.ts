import { getSql } from "./db";
import type { ContactData } from "./validation";

/**
 * Enregistrement d'une demande de contact « implémentation » (F4 · CDC §5.4).
 * SQL paramétré postgres.js uniquement (portabilité Postgres standard, §7.4).
 * Symétrique de `createInscription` (lib/sessions.ts) : chemin d'écriture public,
 * distinct des lectures admin (lib/admin-queries.ts).
 *
 * Lève si `DATABASE_URL` est absent ou la base injoignable (getSql) : la server
 * action rattrape et renvoie une erreur « Service indisponible ». Aucune donnée
 * personnelle n'est journalisée.
 */
export async function insertContact(data: ContactData): Promise<void> {
  const sql = getSql();
  await sql`
    insert into contacts
      (prenom, nom, email, telephone, entreprise, message, consentement_at)
    values (
      ${data.prenom},
      ${data.nom},
      ${data.email},
      ${data.telephone ?? null},
      ${data.entreprise},
      ${data.message},
      now()
    )
  `;
}
