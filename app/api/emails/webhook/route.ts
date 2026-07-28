import type { NextRequest } from "next/server";
import { updateEmailStatut, type EmailStatut } from "@/lib/emails-log";
import { verifierSignatureResend } from "@/lib/resend-webhook";

/**
 * Webhook des événements Resend : écrit le statut réel d'un email dans
 * `emails_envoyes` (migration 007). Un envoi accepté par l'API ne prouve rien —
 * une adresse supprimée répond OK puis rebondit ; seuls ces événements disent si
 * l'email est arrivé.
 *
 * Route publique, donc SIGNÉE : sans vérification, n'importe qui pourrait
 * falsifier des statuts. Signature Svix vérifiée sur le corps BRUT (voir
 * lib/resend-webhook), horodatage toléré à 5 minutes (anti-rejeu).
 *  - `RESEND_WEBHOOK_SECRET` absent → 503 (ne jamais accepter du non signé) ;
 *  - signature absente ou invalide → 401 ;
 *  - type d'événement non géré → 200 (ne pas faire réessayer Resend en boucle).
 *
 * Aucune adresse ni contenu n'est journalisé (RGPD) : seuls des codes.
 *
 * Runtime nodejs (node:crypto + client postgres). Jamais mise en cache.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Événements Resend → statuts de la table. */
const STATUT_PAR_EVENEMENT: Record<string, EmailStatut> = {
  "email.sent": "envoye",
  "email.delivered": "delivre",
  "email.bounced": "rebond",
  "email.complained": "plainte",
  "email.delivery_delayed": "differe",
  "email.failed": "echec",
};

type EvenementResend = {
  type?: unknown;
  data?: { email_id?: unknown } | null;
};

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[emails-webhook] RESEND_WEBHOOK_SECRET absent : refusé");
    return new Response("Webhook non configuré.", { status: 503 });
  }

  // Corps brut AVANT tout parsing : le HMAC porte sur les octets reçus.
  const body = await request.text();

  const signatureValide = verifierSignatureResend({
    secret,
    svixId: request.headers.get("svix-id"),
    svixTimestamp: request.headers.get("svix-timestamp"),
    svixSignature: request.headers.get("svix-signature"),
    body,
  });
  if (!signatureValide) {
    console.warn("[emails-webhook] signature absente, invalide ou expirée");
    return new Response("Non autorisé.", { status: 401 });
  }

  let evenement: EvenementResend;
  try {
    evenement = JSON.parse(body) as EvenementResend;
  } catch {
    console.warn("[emails-webhook] corps illisible");
    return new Response("Corps illisible.", { status: 400 });
  }

  const type = typeof evenement.type === "string" ? evenement.type : "";
  const statut = STATUT_PAR_EVENEMENT[type];
  if (!statut) {
    // Type non géré : accusé de réception pour ne pas déclencher de réessais.
    return Response.json({ ignore: true });
  }

  const emailId = evenement.data?.email_id;
  if (typeof emailId !== "string" || !emailId) {
    console.warn(`[emails-webhook] événement sans email_id (${type})`);
    return Response.json({ ignore: true });
  }

  await updateEmailStatut(emailId, statut);
  return Response.json({ ok: true, statut });
}
