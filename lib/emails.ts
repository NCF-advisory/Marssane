import type { InscriptionInput, ProchaineSession } from "./sessions";

export type InscriptionEmailPayload = {
  inscription: InscriptionInput & { statut: "confirme" | "attente" };
  session: ProchaineSession | null;
  placesRestantes: number;
};

/**
 * Emails transactionnels de pré-inscription (F5 · CDC §5.5) : confirmation au
 * client (rappel date/lieu + prérequis) et notification aux administrateurs.
 *
 * NO-OP volontaire. L'envoi réel (Resend, templates, `CONTACT_EMAIL`) est
 * implémenté au jalon 3 tâche 3. Cette fonction existe dès maintenant comme
 * point d'accroche : la server action l'appelle déjà, le branchement sera prêt
 * sans toucher au flux d'inscription.
 */
export async function sendInscriptionEmails(
  payload: InscriptionEmailPayload,
): Promise<void> {
  void payload; // Intentionnellement inutilisé — voir jalon 3 tâche 3.
}
