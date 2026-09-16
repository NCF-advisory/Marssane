import type { RendezVousCoordonnees, RendezVousDisponibilites, RendezVousResultat } from "./rendez-vous-types";

export async function chargerDisponibilites(): Promise<RendezVousDisponibilites> {
  const response = await fetch("/api/rendez-vous", { cache: "no-store" });
  if (!response.ok) throw new Error("Disponibilités indisponibles");
  const resultat: { departs: string[]; message?: string } = await response.json();
  return {
    creneaux: resultat.departs.map(debut => ({ debut, fin: new Date(new Date(debut).getTime() + 3_600_000).toISOString() })),
    message: resultat.message,
  };
}

export async function confirmerRendezVous(
  coordonnees: RendezVousCoordonnees, debut: string, cle: string,
): Promise<RendezVousResultat> {
  const response = await fetch("/api/rendez-vous", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coordonnees, debut, cle }),
  });
  if (!response.ok) throw new Error("Confirmation indisponible");
  return response.json();
}
