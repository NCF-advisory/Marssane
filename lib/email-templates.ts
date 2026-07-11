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

/** « 09:00 – 17:00 », « à partir de 09:00 », ou `null` si aucune heure. */
function formatHoraires(session: ProchaineSession): string | null {
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
function sessionDetailsText(session: ProchaineSession): string[] {
  const lignes = [`- Date : ${formatDateLongue(session.date)}`];
  const horaires = formatHoraires(session);
  if (horaires) lignes.push(`- Horaires : ${horaires}`);
  lignes.push(`- Lieu : ${session.lieu ?? "lieu à préciser"}`);
  return lignes;
}

/** Détails d'une session, version HTML (valeurs de session échappées). */
function sessionDetailsHtml(session: ProchaineSession): string {
  const items = [`Date : ${esc(formatDateLongue(session.date))}`];
  const horaires = formatHoraires(session);
  if (horaires) items.push(`Horaires : ${esc(horaires)}`);
  items.push(`Lieu : ${esc(session.lieu ?? "lieu à préciser")}`);
  return `<ul style="margin:0 0 16px;padding-left:20px;">${items
    .map((item) => `<li style="margin:0 0 4px;">${item}</li>`)
    .join("")}</ul>`;
}

const PREREQUIS = [
  "un ordinateur portable",
  "un abonnement Claude Pro actif (20 €/mois)",
  "la validation de votre DSI si votre poste est géré par votre entreprise",
];

/** Email destiné à l'inscrit (confirmation ou liste d'attente). */
export function buildClientEmail(args: {
  inscription: Inscription;
  session: ProchaineSession | null;
}): RenderedEmail {
  const { inscription, session } = args;
  const prenom = inscription.prenom;

  if (inscription.statut === "attente") {
    const text = [
      `Bonjour ${prenom},`,
      "",
      "Merci pour votre pré-inscription à la formation IA Marssane.",
      "",
      "La session actuelle est complète : vous êtes inscrit sur la liste d'attente. Nous vous recontactons dès qu'une place se libère ou qu'une nouvelle session est ouverte.",
      "",
      "Il s'agit d'une pré-inscription sans engagement.",
      "",
      "L'équipe Marssane",
    ].join("\n");

    const html = htmlLayout(
      `<p style="margin:0 0 16px;">Bonjour ${esc(prenom)},</p>` +
        `<p style="margin:0 0 16px;">Merci pour votre pré-inscription à la formation IA Marssane.</p>` +
        `<p style="margin:0 0 16px;">La session actuelle est complète : vous êtes inscrit sur la liste d'attente. Nous vous recontactons dès qu'une place se libère ou qu'une nouvelle session est ouverte.</p>` +
        `<p style="margin:0 0 16px;">Il s'agit d'une pré-inscription sans engagement.</p>` +
        SIGNATURE_HTML,
    );

    return {
      subject: "Vous êtes sur liste d'attente — Marssane",
      html,
      text,
    };
  }

  // Statut « confirme ».
  const textLines = [
    `Bonjour ${prenom},`,
    "",
    "Nous confirmons la réception de votre pré-inscription à la formation IA Marssane.",
    "",
  ];
  if (session) {
    textLines.push("Détails de la session :", ...sessionDetailsText(session), "");
  }
  textLines.push(
    "Pour suivre la formation dans de bonnes conditions, prévoyez :",
    ...PREREQUIS.map((p) => `- ${p}`),
    "",
    "Il s'agit d'une pré-inscription sans engagement — nous revenons vers vous sous 48 h.",
    "",
    "L'équipe Marssane",
  );

  const htmlParts = [
    `<p style="margin:0 0 16px;">Bonjour ${esc(prenom)},</p>`,
    `<p style="margin:0 0 16px;">Nous confirmons la réception de votre pré-inscription à la formation IA Marssane.</p>`,
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
    `<p style="margin:0 0 16px;">Il s'agit d'une pré-inscription sans engagement — nous revenons vers vous sous 48 h.</p>`,
    SIGNATURE_HTML,
  );

  return {
    subject: "Votre pré-inscription — formation IA Marssane",
    html: htmlLayout(htmlParts.join("")),
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
    subject: `Nouvelle pré-inscription — ${inscription.prenom} ${inscription.nom} (${statutLabel})`,
    html,
    text,
  };
}
