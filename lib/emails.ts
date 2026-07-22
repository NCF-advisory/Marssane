import { Resend } from "resend";
import {
  buildAdminEmail,
  buildClientEmail,
  buildContactEmail,
  buildInvitationEmail,
  type ContactEmailInput,
  type InvitationEmailInput,
} from "./email-templates";
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
    console.warn("[emails] non configurés : envoi sauté");
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

/**
 * E-mail d'invitation à l'espace formation, envoyé à un inscrit confirmé quand
 * le formateur lance la formation (ou lors d'un renvoi). `replyTo` = adresse de
 * contact si configurée.
 *
 * Ne lève jamais : le participant est déjà créé en base (source de vérité) — un
 * échec d'envoi ne doit pas remettre en cause l'invitation. Retourne `true` si
 * l'e-mail est parti, `false` si l'envoi a échoué ou a été sauté (emails non
 * configurés) : l'appelant s'en sert pour le décompte des échecs. Aucun contenu
 * ni destinataire n'est journalisé (RGPD).
 */
export async function sendInvitationEmail(
  input: InvitationEmailInput & { email: string },
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey) {
    console.warn("[emails] non configurés : invitation sautée");
    return false;
  }

  const resend = new Resend(apiKey);
  const mail = buildInvitationEmail(input);

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.email,
      ...(contactEmail ? { replyTo: contactEmail } : {}),
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (error) {
      console.error(`[emails] échec envoi invitation (code: ${error.name})`);
      return false;
    }
    return true;
  } catch {
    console.error("[emails] échec envoi invitation (erreur réseau)");
    return false;
  }
}

/**
 * Email de notification d'une demande de contact « implémentation » (F5 · CDC
 * §5.5), envoyé aux administrateurs (`CONTACT_EMAIL`), `replyTo` = email du
 * demandeur.
 *
 * Ne lève jamais : la demande est déjà enregistrée en base (source de vérité) —
 * un échec d'envoi ne doit pas la remettre en cause. Sans `RESEND_API_KEY` /
 * `CONTACT_EMAIL`, l'envoi est sauté silencieusement. Les erreurs sont attrapées
 * et loguées sous forme de code, jamais avec le contenu ou le destinataire (RGPD).
 */
export async function sendContactEmail(payload: {
  contact: ContactEmailInput;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    console.warn("[emails] non configurés : envoi contact sauté");
    return;
  }

  const resend = new Resend(apiKey);
  const mail = buildContactEmail(payload.contact);

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: contactEmail,
      replyTo: payload.contact.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (error) {
      console.error(`[emails] échec envoi contact (code: ${error.name})`);
    }
  } catch {
    console.error("[emails] échec envoi contact (erreur réseau)");
  }
}
