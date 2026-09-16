"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { creerCreneauxRendezVous } from "@/lib/rendez-vous-creneaux";
import { enregistrerRendezVous, listerCreneauxDisponibles } from "@/lib/rendez-vous";
import { envoyerNotificationRendezVous } from "@/lib/rendez-vous-notification";
import type { RendezVousCoordonnees, RendezVousDisponibilites, RendezVousResultat } from "@/lib/rendez-vous-types";

const demandeSchema = z.object({
  nom: z.string().trim().min(2).max(120),
  email: z.email().trim().max(254).transform((s) => s.toLowerCase()),
  debut: z.iso.datetime(),
  cle: z.uuid(),
});

// Limite par instance, comme les autres formulaires publics du site.
const tentatives = new Map<string, { nombre: number; expiration: number }>();
async function autoriserTentative() {
  const maintenant = Date.now();
  for (const [ip, valeur] of tentatives) if (valeur.expiration <= maintenant) tentatives.delete(ip);
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnu";
  const valeur = tentatives.get(ip);
  if (valeur && valeur.nombre >= 10) return false;
  tentatives.set(ip, { nombre: (valeur?.nombre ?? 0) + 1, expiration: valeur?.expiration ?? maintenant + 3_600_000 });
  return true;
}

export async function chargerDisponibilitesRendezVous(): Promise<RendezVousDisponibilites> {
  try {
    return { creneaux: await listerCreneauxDisponibles() };
  } catch {
    console.error("[rendez-vous] disponibilités indisponibles");
    return { creneaux: [], message: "Les disponibilités sont momentanément indisponibles. Veuillez réessayer dans un instant." };
  }
}

export async function confirmerRendezVous(
  coordonnees: RendezVousCoordonnees,
  debut: string,
  cle: string,
): Promise<RendezVousResultat> {
  const parsed = demandeSchema.safeParse({ ...coordonnees, debut, cle });
  if (!parsed.success) return { ok: false, message: "Vérifiez votre nom, votre adresse mail et le créneau sélectionné." };
  if (!(await autoriserTentative())) return { ok: false, message: "Trop de tentatives. Veuillez réessayer plus tard." };

  // Le navigateur transmet seulement un début : durée et ouverture viennent
  // du planning serveur, jamais des données fournies par le visiteur.
  const creneau = creerCreneauxRendezVous().find((c) => c.debut === parsed.data.debut);
  if (!creneau) return { ok: false, indisponible: true, message: "Ce créneau n'est plus disponible. Choisissez un autre horaire." };
  try {
    const coordonneesValidees = { nom: parsed.data.nom, email: parsed.data.email };
    const { notificationId, ...resultat } = await enregistrerRendezVous(coordonneesValidees, creneau, parsed.data.cle);
    if (resultat.ok && notificationId) {
      // L’envoi suit la réponse : il ne ralentit pas l’animation de validation.
      // Seule une insertion nouvelle le déclenche, jamais une demande rejouée.
      after(() => envoyerNotificationRendezVous({ id: notificationId, coordonnees: coordonneesValidees, creneau: resultat.creneau }));
    }
    return resultat;
  } catch {
    console.error("[rendez-vous] confirmation indisponible");
    return { ok: false, message: "La réservation n'a pas pu être confirmée. Veuillez réessayer." };
  }
}
