import type { Metadata } from "next";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Espace formation · Marssane",
};

/**
 * Page de connexion à l'espace formation (participants). Sobre : toile (fond
 * global) + carte blanche centrée, logo, formulaire email / mot de passe, et un
 * rappel du parcours d'invitation.
 *
 * La redirection « déjà connecté → /formation/espace » est assurée par le proxy
 * (source unique de la logique d'accès /formation/*).
 */
export default function FormationLoginPage() {
  return (
    <main className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] rounded-card border border-hairline bg-surface p-8 shadow-card sm:p-10">
        <div className="flex flex-col items-center text-center">
          <LogoMarssane size={40} withWordmark />
          <h1 className="mt-6 text-[22px] font-extrabold leading-[1.1] tracking-[-0.02em]">
            Espace formation
          </h1>
          <p className="mt-2 text-[14px] leading-[1.5] text-soft">
            Connectez-vous avec l&apos;e-mail de votre inscription et le mot de
            passe que vous avez choisi.
          </p>
        </div>

        <LoginForm />

        <div className="mt-7 border-t border-hairline pt-5">
          <p className="text-[13px] font-semibold text-ink">
            J&apos;ai reçu une invitation
          </p>
          <p className="mt-1.5 text-[13px] leading-[1.5] text-soft">
            Ouvrez le lien personnel reçu par e-mail pour activer votre compte et
            choisir votre mot de passe. Le lien est valable 14 jours. Une fois
            votre compte activé, revenez ici pour vous connecter.
          </p>
        </div>
      </div>
    </main>
  );
}
