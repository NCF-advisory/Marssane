import { getSql } from "./db";
import { creerCreneauxRendezVous } from "./rendez-vous-creneaux";
import type { RendezVousCoordonnees, RendezVousCreneau, RendezVousResultat } from "./rendez-vous-types";

export async function listerCreneauxDisponibles(): Promise<RendezVousCreneau[]> {
  const candidats = creerCreneauxRendezVous();
  if (!candidats.length) return [];
  const sql = getSql();
  const occupes = await sql<{ debut: Date }[]>`
    select debut from rendez_vous
    where statut = 'confirme' and debut >= ${candidats[0].debut}
      and debut <= ${candidats[candidats.length - 1].debut}
  `;
  const indisponibles = new Set(occupes.map((r) => r.debut.toISOString()));
  return candidats.filter((c) => !indisponibles.has(c.debut));
}

/** La contrainte unique arbitre les confirmations concurrentes en base.
 * La clé de confirmation permet de rejouer une demande dont la réponse réseau
 * a été perdue, sans créer de doublon ni annoncer à tort une indisponibilité. */
export async function enregistrerRendezVous(
  coordonnees: RendezVousCoordonnees,
  creneau: RendezVousCreneau,
  cle: string,
): Promise<RendezVousResultat & { notificationId?: string }> {
  const sql = getSql();
  const cree = await sql<{ id: string; debut: Date; fin: Date }[]>`
    insert into rendez_vous (cle_confirmation, nom, email, debut, fin)
    select ${cle}, ${coordonnees.nom}, ${coordonnees.email}, ${creneau.debut}::timestamptz, ${creneau.fin}::timestamptz
    where ${creneau.debut}::timestamptz > now()
    on conflict do nothing
    returning id, debut, fin
  `;
  if (cree[0]) return { ok: true, notificationId: cree[0].id, creneau: { debut: cree[0].debut.toISOString(), fin: cree[0].fin.toISOString() } };

  const dejaConfirme = await sql<{ debut: Date; fin: Date }[]>`
    select debut, fin from rendez_vous
    where cle_confirmation = ${cle} and statut = 'confirme'
      and nom = ${coordonnees.nom} and email = ${coordonnees.email}
      and debut = ${creneau.debut}::timestamptz
  `;
  if (dejaConfirme[0]) return { ok: true, creneau: { debut: dejaConfirme[0].debut.toISOString(), fin: dejaConfirme[0].fin.toISOString() } };
  return { ok: false, indisponible: true, message: "Ce créneau n'est plus disponible. Choisissez un autre horaire." };
}
