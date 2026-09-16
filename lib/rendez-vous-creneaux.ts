import { RENDEZ_VOUS_TIMEZONE, type RendezVousCreneau } from "./rendez-vous-types";

const HEURE = 60 * 60 * 1000;
export const RENDEZ_VOUS_HORIZON_JOURS = 30;
const calendrierParis = new Intl.DateTimeFormat("en-GB", {
  timeZone: RENDEZ_VOUS_TIMEZONE,
  weekday: "short", hour: "2-digit", hourCycle: "h23",
});

/** Départs horaires du lundi au vendredi, 9 h–17 h (fin à 18 h).
 * On parcourt des instants UTC puis on vérifie l'heure de Paris : le passage
 * heure d'été / heure d'hiver est géré par Intl, sans décalage UTC codé en dur.
 * Aucun créneau passé, aucun créneau le week-end. Horizon glissant de 30 jours. */
export function creerCreneauxRendezVous(maintenant = new Date()): RendezVousCreneau[] {
  const creneaux: RendezVousCreneau[] = [];
  const debut = Math.ceil((maintenant.getTime() + 1) / HEURE) * HEURE;
  const limite = maintenant.getTime() + RENDEZ_VOUS_HORIZON_JOURS * 24 * HEURE;
  for (let timestamp = debut; timestamp < limite; timestamp += HEURE) {
    const parties = calendrierParis.formatToParts(new Date(timestamp));
    const jour = parties.find((p) => p.type === "weekday")?.value;
    const heure = Number(parties.find((p) => p.type === "hour")?.value);
    if (jour === "Sat" || jour === "Sun" || heure < 9 || heure >= 18) continue;
    creneaux.push({ debut: new Date(timestamp).toISOString(), fin: new Date(timestamp + HEURE).toISOString() });
  }
  return creneaux;
}
