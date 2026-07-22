import type { Metadata } from "next";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import {
  findParticipantByInviteHash,
  hashInviteToken,
} from "@/lib/participants";
import { ActivationForm } from "./ActivationForm";

export const metadata: Metadata = {
  title: "Activation · Espace formation Marssane",
};

/** États possibles de la page d'activation (avant soumission du formulaire). */
type ActivationView =
  | { kind: "form"; token: string }
  | { kind: "invalid" }
  | { kind: "expired" }
  | { kind: "activated" }
  | { kind: "unavailable" };

/** Résout l'état de la page à partir du token en query. */
async function resolveView(token: string | undefined): Promise<ActivationView> {
  if (!token) return { kind: "invalid" };
  try {
    const participant = await findParticipantByInviteHash(hashInviteToken(token));
    if (!participant) return { kind: "invalid" };
    if (participant.activated_at) return { kind: "activated" };
    if (
      participant.invite_expires_at &&
      new Date(participant.invite_expires_at).getTime() <= Date.now()
    ) {
      return { kind: "expired" };
    }
    return { kind: "form", token };
  } catch {
    console.error("[formation] activation : base indisponible");
    return { kind: "unavailable" };
  }
}

/** Encart de message (états non-formulaire), avec lien vers la connexion. */
function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-7 space-y-4 text-center">
      <div
        role="alert"
        className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-ink-clay"
      >
        <p className="font-semibold">{title}</p>
        <p className="mt-1">{body}</p>
      </div>
      <a
        href="/formation"
        className="inline-flex items-center text-[14px] font-semibold text-canard transition-colors hover:text-canard-dark"
      >
        Aller à la connexion →
      </a>
    </div>
  );
}

/**
 * Page d'activation d'un compte participant (token en query). Accessible sans
 * session (voir proxy). Le token est vérifié côté serveur avant d'afficher le
 * formulaire ; sinon un message explicite (invalide / expiré / déjà activé /
 * base indisponible) renvoie vers la connexion.
 */
export default async function ActivationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const view = await resolveView(token);

  return (
    <main className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] rounded-card border border-hairline bg-surface p-8 shadow-card sm:p-10">
        <div className="flex flex-col items-center text-center">
          <LogoMarssane size={40} withWordmark />
          <h1 className="mt-6 text-[22px] font-extrabold leading-[1.1] tracking-[-0.02em]">
            Activer mon compte
          </h1>
          {view.kind === "form" && (
            <p className="mt-2 text-[14px] leading-[1.5] text-soft">
              Choisissez un mot de passe pour accéder à votre espace formation.
            </p>
          )}
        </div>

        {view.kind === "form" && <ActivationForm token={view.token} />}

        {view.kind === "invalid" && (
          <Notice
            title="Lien d'activation invalide"
            body="Ce lien n'est pas valide. Vérifiez que vous avez copié l'adresse complète depuis votre e-mail, ou demandez une nouvelle invitation."
          />
        )}

        {view.kind === "expired" && (
          <Notice
            title="Lien d'activation expiré"
            body="Ce lien a expiré. Contactez votre formateur pour recevoir une nouvelle invitation."
          />
        )}

        {view.kind === "activated" && (
          <Notice
            title="Compte déjà activé"
            body="Votre compte est déjà activé. Connectez-vous avec votre e-mail et votre mot de passe."
          />
        )}

        {view.kind === "unavailable" && (
          <Notice
            title="Service indisponible"
            body="La vérification du lien est momentanément impossible. Réessayez dans un instant."
          />
        )}
      </div>
    </main>
  );
}
