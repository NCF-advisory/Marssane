import { formatDateLongue } from "./session-display";
import type { InscriptionInput, ProchaineSession } from "./sessions";

/**
 * Rendu des emails transactionnels de pré-inscription (F5 · CDC §5.5).
 *
 * Module pur, sans dépendance d'envoi : chaque fonction retourne `{ subject,
 * html, text }`. Templates sobres, « texte d'abord » (charte) — HTML minimal
 * une colonne, fond blanc, aucune image, aucun asset distant. Les saisies
 * libres (prénom, nom, entreprise, précision métier) sont échappées avant
 * interpolation dans le HTML.
 */

export type RenderedEmail = { subject: string; html: string; text: string };

type Inscription = InscriptionInput & { statut: "confirme" | "attente" };

const TEXT_COLOR = "#0E0E12";

/** Signature commune aux emails destinés au client (version HTML). */
const SIGNATURE_HTML = `<p style="margin:32px 0 0;">L'équipe Marssane</p>`;

const STATUT_LABEL: Record<Inscription["statut"], string> = {
  confirme: "confirmée",
  attente: "liste d'attente",
};

/** Échappe les caractères réservés du HTML pour une interpolation sûre. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** « 09:00:00 » → « 09:00 » ; `null`/vide → `null`. */
function formatHeure(heure: string | null): string | null {
  if (!heure) return null;
  return heure.slice(0, 5);
}

/**
 * Détails d'une session suffisants pour un rappel date / horaire / lieu. Vue
 * réduite de `ProchaineSession` : les rappels sont construits depuis le cron,
 * qui n'a pas besoin du décompte des places.
 */
export type SessionDetails = Pick<
  ProchaineSession,
  "date" | "heure_debut" | "heure_fin" | "lieu"
>;

/** « 09:00 – 17:00 », « à partir de 09:00 », ou `null` si aucune heure. */
function formatHoraires(session: SessionDetails): string | null {
  const debut = formatHeure(session.heure_debut);
  const fin = formatHeure(session.heure_fin);
  if (debut && fin) return `${debut} – ${fin}`;
  if (debut) return `à partir de ${debut}`;
  return null;
}

/** Enveloppe HTML commune : une colonne, fond blanc, styles inline (emails). */
function htmlLayout(contentHtml: string): string {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Marssane</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:${TEXT_COLOR};">
${contentHtml}
</div>
</body>
</html>`;
}

/** Lignes de détail d'une session, pour la version texte. */
function sessionDetailsText(session: SessionDetails): string[] {
  const lignes = [`- Date : ${formatDateLongue(session.date)}`];
  const horaires = formatHoraires(session);
  if (horaires) lignes.push(`- Horaires : ${horaires}`);
  lignes.push(`- Lieu : ${session.lieu ?? "lieu à préciser"}`);
  return lignes;
}

/** Détails d'une session, version HTML (valeurs de session échappées). */
function sessionDetailsHtml(session: SessionDetails): string {
  const items = [`Date : ${esc(formatDateLongue(session.date))}`];
  const horaires = formatHoraires(session);
  if (horaires) items.push(`Horaires : ${esc(horaires)}`);
  items.push(`Lieu : ${esc(session.lieu ?? "lieu à préciser")}`);
  return `<ul style="margin:0 0 16px;padding-left:20px;">${items
    .map((item) => `<li style="margin:0 0 4px;">${item}</li>`)
    .join("")}</ul>`;
}

const PREREQUIS = [
  "un ordinateur portable avec l'application Claude installée",
  "un abonnement Claude Pro actif (20 €/mois)",
];

/**
 * Email destiné à l'inscrit. Identique quel que soit le statut réel
 * (`confirme` ou `attente`) : côté public, une pré-inscription est toujours
 * enregistrée, le tri se fait dans l'admin (qui reçoit, lui, le statut réel via
 * `buildAdminEmail`).
 *
 * Ni date ni horaires : la session n'est pas encore datée côté public (le site
 * affiche « Prochainement »), ce sont les rappels J-7 / J-1 qui portent les
 * détails une fois la date arrêtée.
 */
export function buildClientEmail(args: { prenom: string }): RenderedEmail {
  const { prenom } = args;

  const textLines = [
    `Bonjour ${prenom},`,
    "",
    "Nous confirmons la réception de votre pré-inscription à la formation IA Marssane.",
    "",
    "Pour suivre la formation dans de bonnes conditions, prévoyez :",
    ...PREREQUIS.map((p) => `- ${p}`),
    "",
    "Il s'agit d'une pré-inscription sans engagement : nous revenons vers vous prochainement.",
    "",
    "L'équipe Marssane",
  ];

  const html = htmlLayout(
    `<p style="margin:0 0 16px;">Bonjour ${esc(prenom)},</p>` +
      `<p style="margin:0 0 16px;">Nous confirmons la réception de votre pré-inscription à la formation IA Marssane.</p>` +
      `<p style="margin:0 0 8px;">Pour suivre la formation dans de bonnes conditions, prévoyez :</p>` +
      `<ul style="margin:0 0 16px;padding-left:20px;">${PREREQUIS.map(
        (p) => `<li style="margin:0 0 4px;">${esc(p)}</li>`,
      ).join("")}</ul>` +
      `<p style="margin:0 0 16px;">Il s'agit d'une pré-inscription sans engagement : nous revenons vers vous prochainement.</p>` +
      SIGNATURE_HTML,
  );

  return {
    subject: "Votre pré-inscription · formation IA Marssane",
    html,
    text: textLines.join("\n"),
  };
}

/** Email de notification destiné aux administrateurs (`CONTACT_EMAIL`). */
export function buildAdminEmail(args: {
  inscription: Inscription;
  session: ProchaineSession | null;
  placesRestantes: number;
}): RenderedEmail {
  const { inscription, session, placesRestantes } = args;
  const statutLabel = STATUT_LABEL[inscription.statut];

  const metier =
    inscription.metier === "Autre" && inscription.metier_autre
      ? `Autre (${inscription.metier_autre})`
      : inscription.metier;
  const entreprise = inscription.entreprise || "—";
  const sessionLibelle = session
    ? `${formatDateLongue(session.date)}${session.lieu ? ` · ${session.lieu}` : ""}`
    : "Liste d'attente (aucune session publiée)";

  const champs: [string, string][] = [
    ["Statut", statutLabel],
    ["Prénom", inscription.prenom],
    ["Nom", inscription.nom],
    ["Email", inscription.email],
    ["Téléphone", inscription.telephone],
    ["Métier", metier],
    ["Entreprise", entreprise],
    ["Session", sessionLibelle],
    ["Places restantes", String(placesRestantes)],
  ];

  const text = [
    "Nouvelle pré-inscription",
    "",
    ...champs.map(([label, value]) => `${label} : ${value}`),
  ].join("\n");

  const rows = champs
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:4px 12px 4px 0;color:#5b5b66;vertical-align:top;white-space:nowrap;">${esc(
          label,
        )}</td>` +
        `<td style="padding:4px 0;color:${TEXT_COLOR};">${esc(value)}</td>` +
        `</tr>`,
    )
    .join("");

  const html = htmlLayout(
    `<p style="margin:0 0 16px;font-weight:600;">Nouvelle pré-inscription</p>` +
      `<table style="border-collapse:collapse;font-size:16px;">${rows}</table>`,
  );

  return {
    subject: `Nouvelle pré-inscription · ${inscription.prenom} ${inscription.nom} (${statutLabel})`,
    html,
    text,
  };
}

/* ===== Invitation à l'espace formation (espace formation · phase 1) ==== */

/** Détails d'une invitation à l'espace formation. */
export type InvitationEmailInput = {
  prenom: string;
  /** Lien personnel d'activation (token en query). */
  activationUrl: string;
  /** Session rattachée (date ISO + lieu) pour rappeler la date, le cas échéant. */
  session?: { date: string; lieu: string | null } | null;
};

/**
 * E-mail d'invitation à l'espace formation, envoyé à chaque inscrit confirmé
 * quand le formateur lance la formation. Sobre, « texte d'abord » (charte) :
 * il annonce le lien personnel d'activation (choix du mot de passe) et rappelle
 * la date de la promotion. Le lien n'est pas échappé (URL de confiance, générée
 * côté serveur) ; les saisies libres (prénom) le sont.
 */
export function buildInvitationEmail(input: InvitationEmailInput): RenderedEmail {
  const { prenom, activationUrl, session } = input;

  const dateLigne = session
    ? `Votre formation démarre le ${formatDateLongue(session.date)}${
        session.lieu ? ` à ${session.lieu}` : ""
      }.`
    : null;

  const textLines = [
    `Bonjour ${prenom},`,
    "",
    "Votre espace formation Marssane est prêt.",
  ];
  if (dateLigne) textLines.push("", dateLigne);
  textLines.push(
    "",
    "Pour y accéder, activez votre compte en choisissant un mot de passe :",
    activationUrl,
    "",
    "Ce lien est personnel et valable 14 jours. Une fois votre compte activé, vous vous connecterez avec votre e-mail et votre mot de passe.",
    "",
    "L'équipe Marssane",
  );

  const htmlParts = [
    `<p style="margin:0 0 16px;">Bonjour ${esc(prenom)},</p>`,
    `<p style="margin:0 0 16px;">Votre espace formation Marssane est prêt.</p>`,
  ];
  if (dateLigne) {
    htmlParts.push(`<p style="margin:0 0 16px;">${esc(dateLigne)}</p>`);
  }
  htmlParts.push(
    `<p style="margin:0 0 16px;">Pour y accéder, activez votre compte en choisissant un mot de passe :</p>`,
    `<p style="margin:0 0 16px;"><a href="${activationUrl}" style="color:#0e7291;font-weight:600;">Activer mon compte</a></p>`,
    `<p style="margin:0 0 16px;color:#5b5b66;font-size:14px;">Ce lien est personnel et valable 14 jours. Une fois votre compte activé, vous vous connecterez avec votre e-mail et votre mot de passe.</p>`,
    SIGNATURE_HTML,
  );

  return {
    subject: "Votre espace formation Marssane · activez votre compte",
    html: htmlLayout(htmlParts.join("")),
    text: textLines.join("\n"),
  };
}

/* ===== Rappels avant la session (J-7 / J-1) ============================ */

/** Détails d'un rappel avant session. */
export type RappelEmailInput = {
  prenom: string;
  /** `j7` = rappel utile (prérequis) ; `j1` = rappel court (la veille). */
  variante: "j7" | "j1";
  session: SessionDetails;
};

/**
 * E-mail de rappel envoyé aux inscrits confirmés avant leur session (cron
 * quotidien, voir app/api/rappels). Deux variantes :
 *  - J-7 : le rappel qui laisse encore le temps d'agir — date, horaire, lieu et
 *    prérequis, en insistant sur le point à délai (abonnement Claude Pro
 *    payant) ;
 *  - J-1 : court — date, horaire, lieu, et comment signaler un empêchement.
 * Sobre, « texte d'abord » (charte). Le prénom est échappé côté HTML.
 */
export function buildRappelEmail(input: RappelEmailInput): RenderedEmail {
  const { prenom, variante, session } = input;

  if (variante === "j1") {
    const text = [
      `Bonjour ${prenom},`,
      "",
      "Votre formation IA Marssane a lieu demain.",
      "",
      ...sessionDetailsText(session),
      "",
      "Si un empêchement survient, répondez à cet e-mail pour nous prévenir.",
      "",
      "À demain,",
      "L'équipe Marssane",
    ].join("\n");

    const html = htmlLayout(
      `<p style="margin:0 0 16px;">Bonjour ${esc(prenom)},</p>` +
        `<p style="margin:0 0 8px;">Votre formation IA Marssane a lieu demain.</p>` +
        sessionDetailsHtml(session) +
        `<p style="margin:0 0 16px;">Si un empêchement survient, répondez à cet e-mail pour nous prévenir.</p>` +
        `<p style="margin:32px 0 0;">À demain,<br>L'équipe Marssane</p>`,
    );

    return {
      subject: "C'est demain · formation IA Marssane",
      html,
      text,
    };
  }

  const delaiPhrase =
    "Un de ces points demande parfois du délai : l'abonnement Claude Pro est " +
    "payant et doit être actif le jour de la formation. C'est le bon moment de " +
    "vous en occuper.";

  const text = [
    `Bonjour ${prenom},`,
    "",
    "Votre formation IA Marssane a lieu dans une semaine.",
    "",
    ...sessionDetailsText(session),
    "",
    "À prévoir pour le jour J :",
    ...PREREQUIS.map((p) => `- ${p}`),
    "",
    delaiPhrase,
    "",
    "Si un point vous bloque, répondez à cet e-mail : nous verrons ensemble comment faire.",
    "",
    "L'équipe Marssane",
  ].join("\n");

  const html = htmlLayout(
    `<p style="margin:0 0 16px;">Bonjour ${esc(prenom)},</p>` +
      `<p style="margin:0 0 8px;">Votre formation IA Marssane a lieu dans une semaine.</p>` +
      sessionDetailsHtml(session) +
      `<p style="margin:0 0 8px;">À prévoir pour le jour J :</p>` +
      `<ul style="margin:0 0 16px;padding-left:20px;">${PREREQUIS.map(
        (p) => `<li style="margin:0 0 4px;">${esc(p)}</li>`,
      ).join("")}</ul>` +
      `<p style="margin:0 0 16px;">${esc(delaiPhrase)}</p>` +
      `<p style="margin:0 0 16px;">Si un point vous bloque, répondez à cet e-mail : nous verrons ensemble comment faire.</p>` +
      SIGNATURE_HTML,
  );

  return {
    subject: "Dans une semaine · votre formation IA Marssane",
    html,
    text,
  };
}

/* ===== Décisions de l'admin (promotion / annulation) =================== */

/** Détails d'une promotion depuis la liste d'attente. */
export type PromotionEmailInput = {
  prenom: string;
  /**
   * Session rattachée. `null` couvre le cas théorique d'une inscription
   * confirmée sans session (la base l'autorise) : l'email reste juste, il
   * annonce la confirmation sans inventer de date.
   */
  session: SessionDetails | null;
};

/**
 * E-mail annonçant qu'une place s'est libérée et que l'inscription est
 * désormais confirmée — envoyé quand l'admin promeut quelqu'un de la liste
 * d'attente, ou rattache une inscription de la liste d'attente générale à une
 * session avec de la place.
 *
 * La personne découvre peut-être seulement maintenant qu'elle participe : elle
 * reçoit la même information qu'un inscrit confirmé (date, horaires, lieu,
 * prérequis), plus une invitation à signaler une indisponibilité. Sobre,
 * « texte d'abord » (charte) ; le prénom est échappé côté HTML.
 */
export function buildPromotionEmail(input: PromotionEmailInput): RenderedEmail {
  const { prenom, session } = input;

  const textLines = [
    `Bonjour ${prenom},`,
    "",
    "Une place s'est libérée : votre inscription à la formation IA Marssane est confirmée.",
    "",
  ];
  if (session) {
    textLines.push("Détails de la session :", ...sessionDetailsText(session), "");
  }
  textLines.push(
    "Pour suivre la formation dans de bonnes conditions, prévoyez :",
    ...PREREQUIS.map((p) => `- ${p}`),
    "",
    "Si vous n'êtes plus disponible, répondez à cet e-mail : nous proposerons la place à la personne suivante.",
    "",
    "L'équipe Marssane",
  );

  const htmlParts = [
    `<p style="margin:0 0 16px;">Bonjour ${esc(prenom)},</p>`,
    `<p style="margin:0 0 16px;">Une place s'est libérée : votre inscription à la formation IA Marssane est confirmée.</p>`,
  ];
  if (session) {
    htmlParts.push(
      `<p style="margin:0 0 8px;">Détails de la session :</p>`,
      sessionDetailsHtml(session),
    );
  }
  htmlParts.push(
    `<p style="margin:0 0 8px;">Pour suivre la formation dans de bonnes conditions, prévoyez :</p>`,
    `<ul style="margin:0 0 16px;padding-left:20px;">${PREREQUIS.map(
      (p) => `<li style="margin:0 0 4px;">${esc(p)}</li>`,
    ).join("")}</ul>`,
    `<p style="margin:0 0 16px;">Si vous n'êtes plus disponible, répondez à cet e-mail : nous proposerons la place à la personne suivante.</p>`,
    SIGNATURE_HTML,
  );

  return {
    subject: "Une place s'est libérée · votre inscription est confirmée",
    html: htmlLayout(htmlParts.join("")),
    text: textLines.join("\n"),
  };
}

/**
 * E-mail annonçant l'annulation d'une inscription (décision de l'admin). Bref
 * et neutre : aucun motif n'est avancé (l'admin annule pour des raisons que
 * l'e-mail ignore), aucune excuse appuyée. Indique comment se réinscrire ou
 * nous joindre.
 */
export function buildAnnulationEmail(input: {
  prenom: string;
}): RenderedEmail {
  const text = [
    `Bonjour ${input.prenom},`,
    "",
    "Votre inscription à la formation IA Marssane a été annulée.",
    "",
    "Vous pouvez vous inscrire à une prochaine session sur marssane.fr. Pour toute question, répondez à cet e-mail.",
    "",
    "L'équipe Marssane",
  ].join("\n");

  const html = htmlLayout(
    `<p style="margin:0 0 16px;">Bonjour ${esc(input.prenom)},</p>` +
      `<p style="margin:0 0 16px;">Votre inscription à la formation IA Marssane a été annulée.</p>` +
      `<p style="margin:0 0 16px;">Vous pouvez vous inscrire à une prochaine session sur ` +
      `<a href="https://marssane.fr" style="color:#0e7291;font-weight:600;">marssane.fr</a>. ` +
      `Pour toute question, répondez à cet e-mail.</p>` +
      SIGNATURE_HTML,
  );

  return {
    subject: "Votre inscription a été annulée · formation IA Marssane",
    html,
    text,
  };
}

/** Données d'une demande de contact « implémentation » (F4). */
export type ContactEmailInput = {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  entreprise: string;
  message: string;
};

/**
 * Email de notification d'une demande de contact « implémentation » (F5 · CDC
 * §5.5), destiné aux administrateurs (`CONTACT_EMAIL`). Coordonnées + entreprise
 * + message. Toutes les saisies libres sont échappées avant interpolation HTML ;
 * le message conserve ses retours à la ligne (`white-space:pre-wrap`).
 */
export function buildContactEmail(contact: ContactEmailInput): RenderedEmail {
  const champs: [string, string][] = [
    ["Prénom", contact.prenom],
    ["Nom", contact.nom],
    ["Email", contact.email],
    ["Téléphone", contact.telephone || "—"],
    ["Entreprise", contact.entreprise],
  ];

  const text = [
    "Nouvelle demande d'implémentation",
    "",
    ...champs.map(([label, value]) => `${label} : ${value}`),
    "",
    "Message :",
    contact.message,
  ].join("\n");

  const rows = champs
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:4px 12px 4px 0;color:#5b5b66;vertical-align:top;white-space:nowrap;">${esc(
          label,
        )}</td>` +
        `<td style="padding:4px 0;color:${TEXT_COLOR};">${esc(value)}</td>` +
        `</tr>`,
    )
    .join("");

  const html = htmlLayout(
    `<p style="margin:0 0 16px;font-weight:600;">Nouvelle demande d'implémentation</p>` +
      `<table style="border-collapse:collapse;font-size:16px;margin:0 0 20px;">${rows}</table>` +
      `<p style="margin:0 0 8px;color:#5b5b66;">Message :</p>` +
      `<p style="margin:0;white-space:pre-wrap;">${esc(contact.message)}</p>`,
  );

  return {
    subject: `Nouvelle demande d'implémentation · ${contact.prenom} ${contact.nom}`,
    html,
    text,
  };
}
