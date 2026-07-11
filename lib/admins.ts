import { getSql } from "./db";

/** Compte administrateur (F3 · CDC §5.3, §6). */
export type Admin = {
  id: string;
  email: string;
  password_hash: string;
};

/**
 * Recherche un admin par email (comparaison insensible à la casse, l'email
 * étant normalisé en minuscules côté application). Retourne `null` si aucun.
 * Lève si la base est injoignable : l'appelant (loginAction) traduit cela en
 * « Service indisponible » sans exposer de détail.
 */
export async function findAdminByEmail(email: string): Promise<Admin | null> {
  const sql = getSql();
  const rows = await sql<Admin[]>`
    select id, email, password_hash
    from admins
    where lower(email) = ${email}
    limit 1
  `;
  return rows[0] ?? null;
}
