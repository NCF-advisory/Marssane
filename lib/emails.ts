import { Resend } from "resend";
import { buildAdminEmail, buildClientEmail } from "./email-templates";
import type { InscriptionInput, ProchaineSession } from "./sessions";

export type InscriptionEmailPayload = {
  inscription: InscriptionInput & { statut: "confirme" | "attente" };
  session: ProchaineSession | null;
  placesRestantes: number;
};

/**
 * Adresse d'expédition. Défaut : le domaine de test Resend (`onboarding@resend.dev`),
 * qui fonctionne sans domaine vérifié mais n'envoie qu'à l'adresse du compte.
 * À remplacer par une adresse du domaine Marssane une fois SPF/DKIM configurés
 * (variable `EMAIL_FROM`).
 */
const EMAIL_FROM = process.env.EMAIL_FROM || "Marssane <onboarding@resend.dev>";

/**
 * Emails transactionnels de pré-inscription (F5 · CDC §5.5) : confirmation ou
 * liste d'attente à l'inscrit (rappel date/lieu + prérequis) et notification aux
 * administrateurs (`CONTACT_EMAIL`).
 *
 * Ne lève jamais : une inscription déjà enregistrée ne doit pas échouer à cause
 * de l'envoi d'un email. Sans `RESEND_API_KEY`/`CONTACT_EMAIL`, l'envoi est sauté
 * silencieusement. Les erreurs sont attrapées (`Promise.allSettled`) et loguées
 * sous forme de code, jamais avec le contenu ou le destinataire (RGPD).
 */
export async function sendInscriptionEmails(
  payload: InscriptionEmailPayload,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    console.warn("[emails] non configurés — envoi sauté");
    return;
  }

  const { inscription, session, placesRestantes } = payload;
  const resend = new Resend(apiKey);

  const client = buildClientEmail({ inscription, session });
  const admin = buildAdminEmail({ inscription, session, placesRestantes });

  const results = await Promise.allSettled([
    resend.emails.send({
      from: EMAIL_FROM,
      to: inscription.email,
      replyTo: contactEmail,
      subject: client.subject,
      html: client.html,
      text: client.text,
    }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: contactEmail,
      replyTo: inscription.email,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
    }),
  ]);

  results.forEach((result, index) => {
    const cible = index === 0 ? "client" : "admin";
    if (result.status === "rejected") {
      console.error(`[emails] échec envoi ${cible} (erreur réseau)`);
    } else if (result.value.error) {
      console.error(
        `[emails] échec envoi ${cible} (code: ${result.value.error.name})`,
      );
    }
  });
}
