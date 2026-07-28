import { Resend } from "resend";
import {
  buildAdminEmail,
  buildAnnulationEmail,
  buildClientEmail,
  buildContactEmail,
  buildInvitationEmail,
  buildPromotionEmail,
  buildRappelEmail,
  type ContactEmailInput,
  type InvitationEmailInput,
  type PromotionEmailInput,
  type RappelEmailInput,
  type RenderedEmail,
} from "./email-templates";
import { logEmailEnvoye, type EmailType } from "./emails-log";
import type { InscriptionInput, ProchaineSession } from "./sessions";

export type InscriptionEmailPayload = {
  /** Id de l'inscription enregistrée : rattache les envois à leur trace. */
  inscriptionId: string;
  inscription: InscriptionInput & { statut: "confirme" | "attente" };
  session: ProchaineSession | null;
  placesRestantes: number;
};

/**
 * Adresse d'expédition. `EMAIL_FROM` est renseignée en production
 * (`Marssane <contact@marssane.fr>`, domaine vérifié chez Resend — DKIM + SPF sur
 * `send.marssane.fr`). Le défaut `onboarding@resend.dev` n'est qu'un repli de
 * développement local : il ne délivre qu'à l'adresse du titulaire du compte Resend.
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
 *
 * Chaque envoi accepté par l'API est tracé (`emails_envoyes`) avec son id
 * Resend : le webhook y écrira ensuite le statut réel (délivré, rebond…), un
 * « accepté » ne prouvant pas la réception.
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

  // Index 0 = email de l'inscrit (type selon son statut), index 1 = admin.
  const types: EmailType[] = [
    inscription.statut === "attente" ? "attente" : "confirmation",
    "admin",
  ];

  for (const [index, result] of results.entries()) {
    const cible = index === 0 ? "client" : "admin";
    if (result.status === "rejected") {
      console.error(`[emails] échec envoi ${cible} (erreur réseau)`);
      continue;
    }
    if (result.value.error) {
      console.error(
        `[emails] échec envoi ${cible} (code: ${result.value.error.name})`,
      );
      continue;
    }
    await logEmailEnvoye({
      inscriptionId: payload.inscriptionId,
      type: types[index],
      resendId: result.value.data?.id ?? null,
    });
  }
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
  input: InvitationEmailInput & { email: string; inscriptionId: string },
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
    const { data, error } = await resend.emails.send({
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
    await logEmailEnvoye({
      inscriptionId: input.inscriptionId,
      type: "invitation",
      resendId: data?.id ?? null,
    });
    return true;
  } catch {
    console.error("[emails] échec envoi invitation (erreur réseau)");
    return false;
  }
}

/**
 * E-mail de rappel avant la session (J-7 ou J-1), envoyé par le cron quotidien
 * (`/api/rappels`) aux inscrits confirmés. `replyTo` = adresse de contact si
 * configurée (le rappel invite à répondre en cas d'empêchement ou de prérequis
 * manquant).
 *
 * Ne lève jamais : retourne `true` si l'e-mail est parti (et a été tracé),
 * `false` s'il a échoué ou a été sauté (emails non configurés). L'enregistrement
 * dans `emails_envoyes` fait aussi office d'anti-doublon : un rappel non tracé
 * repartira le lendemain, un rappel tracé ne repart jamais. Aucun contenu ni
 * destinataire n'est journalisé (RGPD).
 */
export async function sendRappelEmail(
  input: RappelEmailInput & { email: string; inscriptionId: string },
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey) {
    console.warn("[emails] non configurés : rappel sauté");
    return false;
  }

  const resend = new Resend(apiKey);
  const mail = buildRappelEmail(input);

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.email,
      ...(contactEmail ? { replyTo: contactEmail } : {}),
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (error) {
      console.error(`[emails] échec envoi rappel (code: ${error.name})`);
      return false;
    }
    await logEmailEnvoye({
      inscriptionId: input.inscriptionId,
      type: input.variante === "j7" ? "rappel_j7" : "rappel_j1",
      resendId: data?.id ?? null,
    });
    return true;
  } catch {
    console.error("[emails] échec envoi rappel (erreur réseau)");
    return false;
  }
}

/**
 * Envoi d'un e-mail déjà rendu à un inscrit, tracé dans `emails_envoyes`.
 * Même discipline que les envois ci-dessus : ne lève jamais, retourne `true`
 * si l'e-mail est parti, `false` s'il a échoué ou a été sauté (emails non
 * configurés). `libelle` n'apparaît que dans les logs (jamais de destinataire
 * ni de contenu, RGPD).
 */
async function sendToInscrit(input: {
  email: string;
  inscriptionId: string;
  type: EmailType;
  libelle: string;
  mail: RenderedEmail;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey) {
    console.warn(`[emails] non configurés : ${input.libelle} sauté`);
    return false;
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.email,
      ...(contactEmail ? { replyTo: contactEmail } : {}),
      subject: input.mail.subject,
      html: input.mail.html,
      text: input.mail.text,
    });
    if (error) {
      console.error(
        `[emails] échec envoi ${input.libelle} (code: ${error.name})`,
      );
      return false;
    }
    await logEmailEnvoye({
      inscriptionId: input.inscriptionId,
      type: input.type,
      resendId: data?.id ?? null,
    });
    return true;
  } catch {
    console.error(`[emails] échec envoi ${input.libelle} (erreur réseau)`);
    return false;
  }
}

/**
 * E-mail de promotion : une place s'est libérée, l'inscription est confirmée.
 * Envoyé quand l'admin fait passer une inscription de la liste d'attente à
 * « confirmé », ou rattache une inscription de la liste d'attente générale à
 * une session où il reste de la place.
 */
export async function sendPromotionEmail(
  input: PromotionEmailInput & { email: string; inscriptionId: string },
): Promise<boolean> {
  return sendToInscrit({
    email: input.email,
    inscriptionId: input.inscriptionId,
    type: "promotion",
    libelle: "promotion",
    mail: buildPromotionEmail(input),
  });
}

/**
 * E-mail d'annulation, envoyé quand l'admin bascule une inscription en
 * « annulé ».
 */
export async function sendAnnulationEmail(input: {
  email: string;
  inscriptionId: string;
  prenom: string;
}): Promise<boolean> {
  return sendToInscrit({
    email: input.email,
    inscriptionId: input.inscriptionId,
    type: "annulation",
    libelle: "annulation",
    mail: buildAnnulationEmail({ prenom: input.prenom }),
  });
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
