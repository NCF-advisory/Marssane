import { z } from "zod";
import { chargerDisponibilitesRendezVous, confirmerRendezVous } from "@/app/actions/rendez-vous";

const entree = z.object({
  coordonnees: z.object({ nom: z.string(), email: z.string() }),
  debut: z.string(),
  cle: z.string(),
});
const headers = { "Cache-Control": "no-store" };

/** Réponses JSON seules : le calendrier ne déclenche pas de rendu de page. */
export async function GET() {
  const resultat = await chargerDisponibilitesRendezVous();
  // La durée est toujours d'une heure : inutile de transmettre deux dates.
  return Response.json({ departs: resultat.creneaux.map(c => c.debut), message: resultat.message }, { headers });
}

export async function POST(request: Request) {
  // Même protection d'origine que le formulaire : aucun POST depuis un autre site.
  const origine = request.headers.get("origin");
  // Next peut reconstruire request.url avec « localhost » alors que la page
  // a été ouverte sur 127.0.0.1. Host conserve l'adresse demandée par le navigateur.
  let memeOrigine = false;
  try {
    const source = new URL(origine ?? "");
    memeOrigine = ["http:", "https:"].includes(source.protocol) && source.host === request.headers.get("host");
  } catch { /* Une origine absente ou invalide est refusée. */ }
  if (!memeOrigine) {
    return Response.json({ ok: false, message: "Rechargez la page avant de confirmer." }, { status: 403, headers });
  }
  const parsed = entree.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, message: "Vérifiez les informations du rendez-vous." }, { status: 400, headers });
  }
  const { coordonnees, debut, cle } = parsed.data;
  // Validation métier, limitation de tentatives et insertion atomique conservées.
  return Response.json(await confirmerRendezVous(coordonnees, debut, cle), { headers });
}
