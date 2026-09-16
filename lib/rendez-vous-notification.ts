import { Resend } from "resend";
import { construireNotificationRendezVous, type NotificationRendezVous } from "./rendez-vous-email";

/** Notification immédiate autorisée, réservée à Cléante. Les nouvelles
 * tentatives réutilisent la même clé pour éviter un double envoi. */
export async function envoyerNotificationRendezVous(notification: NotificationRendezVous): Promise<void> {
  const apiKey = process.env.RENDEZ_VOUS_RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[rendez-vous-email] envoi impossible : configuration absente");
    return;
  }
  const resend = new Resend(apiKey);
  const mail = construireNotificationRendezVous(notification);
  for (let tentative = 0; tentative < 3; tentative++) {
    if (tentative > 0) await new Promise(resolve => setTimeout(resolve, tentative * 1000));
    try {
      const { error } = await resend.emails.send({
        from: process.env.RENDEZ_VOUS_EMAIL_FROM || process.env.EMAIL_FROM || "Marssane <contact@marssane.fr>",
        to: "cleante@marssane.fr",
        replyTo: notification.coordonnees.email,
        ...mail,
      }, { idempotencyKey: `rendez-vous-confirme/${notification.id}` });
      if (!error) return;
      const temporaire = error.statusCode === null || error.statusCode === 429 || error.statusCode >= 500 || error.name === "concurrent_idempotent_requests";
      if (!temporaire || tentative === 2) {
        console.error(`[rendez-vous-email] échec notification ${notification.id} (${error.name})`);
        return;
      }
    } catch {
      if (tentative === 2) console.error(`[rendez-vous-email] échec notification ${notification.id} (réseau)`);
    }
  }
}
