import { rendezVousDate, rendezVousHeure, type RendezVousCoordonnees, type RendezVousCreneau } from "./rendez-vous-types";

export type NotificationRendezVous = {
  id: string;
  coordonnees: RendezVousCoordonnees;
  creneau: RendezVousCreneau;
};

function echapper(texte: string) {
  return texte.replace(/[&<>"']/g, caractere => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[caractere]!);
}

export function construireNotificationRendezVous({ coordonnees, creneau }: NotificationRendezVous) {
  const jour = rendezVousDate(creneau.debut);
  const horaires = `${rendezVousHeure(creneau.debut)} – ${rendezVousHeure(creneau.fin)} (heure de Paris)`;
  const lien = "https://erp.marssane.fr/rendez-vous";
  const subject = `Nouveau rendez-vous · ${jour} à ${rendezVousHeure(creneau.debut)}`;
  const text = [
    "Bonjour Cléante,", "", "Un nouveau rendez-vous vient d’être confirmé sur le site Marssane.", "",
    `Nom : ${coordonnees.nom}`, `Adresse mail : ${coordonnees.email}`, `Date : ${jour}`, `Créneau : ${horaires}`, "",
    `Consulter le rendez-vous dans l’ERP : ${lien}`, "", "Vous pouvez répondre à cet e-mail pour contacter directement la personne.",
  ].join("\n");
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head><body style="margin:0;background:#eef1f3;color:#0e0e12;font-family:Arial,sans-serif;line-height:1.6;">
<div style="max-width:560px;margin:24px auto;padding:28px;background:#fff;border:1px solid #dce1e6;">
<p style="color:#0e7291;font-size:12px;letter-spacing:1px;">MARSSANE · RENDEZ-VOUS</p>
<h1 style="font-size:24px;">Un nouveau rendez-vous confirmé</h1>
<p>Bonjour Cléante, une personne vient de réserver un échange sur le site.</p>
<p><strong>Nom :</strong> ${echapper(coordonnees.nom)}<br><strong>Adresse mail :</strong> ${echapper(coordonnees.email)}<br><strong>Date :</strong> ${echapper(jour)}<br><strong>Créneau :</strong> ${echapper(horaires)}</p>
<p style="margin-top:24px;"><a href="${lien}" style="background:#0e7291;color:white;padding:12px 18px;display:inline-block;text-decoration:none;">Voir dans l’ERP</a></p>
<p style="font-size:13px;color:#5b6472;">Vous pouvez répondre à cet e-mail pour contacter directement la personne.</p>
</div></body></html>`;
  return { subject, text, html };
}
