import { getSql } from "./db";

/**
 * Traçabilité des emails transactionnels (table `emails_envoyes`, migration 007).
 *
 * Deux usages : connaître le statut réel d'un envoi (mis à jour par le webhook
 * Resend) et empêcher un rappel J-7 / J-1 de partir deux fois.
 *
 * Aucune fonction ne lève : la traçabilité ne doit jamais casser un envoi ni une
 * inscription déjà enregistrée. Les incidents loguent un code, jamais une
 * adresse ni un contenu (RGPD).
 */

/** Types d'emails tracés (miroir du `check` de la migration 007). */
export type EmailType =
  | "confirmation"
  | "attente"
  | "admin"
  | "invitation"
  | "rappel_j7"
  | "rappel_j1"
  | "promotion"
  | "annulation";

/** Statuts Resend traduits (miroir du `check` de la migration 007). */
export type EmailStatut =
  | "envoye"
  | "delivre"
  | "rebond"
  | "plainte"
  | "differe"
  | "echec";

/** Types de rappel avant session (anti-doublon garanti par index unique). */
export type RappelType = "rappel_j7" | "rappel_j1";

/** Violation de contrainte d'unicité Postgres (SQLSTATE 23505). */
function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"
  );
}

/**
 * Enregistre un envoi accepté par l'API Resend (statut initial `envoye`).
 *
 * Une violation d'unicité (23505) est ignorée silencieusement : elle signifie
 * « ce rappel est déjà enregistré » (deux exécutions du cron qui se chevauchent),
 * ce n'est pas un incident.
 */
export async function logEmailEnvoye(input: {
  inscriptionId: string;
  type: EmailType;
  resendId: string | null;
}): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      insert into emails_envoyes (inscription_id, type, resend_id)
      values (${input.inscriptionId}, ${input.type}, ${input.resendId})
    `;
  } catch (err) {
    if (isUniqueViolation(err)) return;
    console.error(`[emails-log] échec de l'enregistrement (${input.type})`);
  }
}

/**
 * Met à jour le statut d'un envoi à partir de son id Resend (webhook). Sans
 * effet si l'id est inconnu (email envoyé avant la mise en place de la table).
 */
export async function updateEmailStatut(
  resendId: string,
  statut: EmailStatut,
): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      update emails_envoyes
      set statut = ${statut}, updated_at = now()
      where resend_id = ${resendId}
    `;
  } catch {
    console.error(`[emails-log] échec de la mise à jour du statut (${statut})`);
  }
}

/**
 * `true` si un rappel de ce type est déjà enregistré pour cette inscription.
 *
 * En cas d'incident base, retourne `true` : mieux vaut sauter un rappel que
 * risquer d'en envoyer un chaque jour, l'anti-doublon n'étant plus vérifiable.
 */
export async function rappelDejaEnvoye(
  inscriptionId: string,
  type: RappelType,
): Promise<boolean> {
  try {
    const sql = getSql();
    const rows = await sql<{ id: string }[]>`
      select id from emails_envoyes
      where inscription_id = ${inscriptionId} and type = ${type}
      limit 1
    `;
    return rows.length > 0;
  } catch {
    console.error(`[emails-log] vérification du rappel impossible (${type})`);
    return true;
  }
}
