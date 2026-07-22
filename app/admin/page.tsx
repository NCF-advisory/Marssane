import type { Metadata } from "next";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion · Administration Marssane",
};

/**
 * Page de connexion admin (F3 · CDC §5.3). Sobre : toile (fond global) + carte
 * blanche centrée, logo, formulaire email / mot de passe.
 *
 * La redirection « déjà connecté → /admin/dashboard » est assurée par le
 * middleware (source unique de la logique d'accès /admin/*), qui protège aussi
 * toutes les autres routes admin.
 */
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] rounded-card border border-hairline bg-surface p-8 shadow-card sm:p-10">
        <div className="flex flex-col items-center text-center">
          <LogoMarssane size={40} withWordmark />
          <h1 className="mt-6 text-[22px] font-extrabold leading-[1.1] tracking-[-0.02em]">
            Administration
          </h1>
          <p className="mt-2 text-[14px] leading-[1.5] text-soft">
            Connectez-vous pour accéder au tableau de bord.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
