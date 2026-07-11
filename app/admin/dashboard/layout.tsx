import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { getCurrentAdmin } from "@/lib/admin-auth";

/**
 * Gabarit du tableau de bord admin (F3). En-tête commun à toutes les pages du
 * sous-arbre `/admin/dashboard/*` : logo (lien vers l'accueil du tableau de
 * bord), email connecté, bouton de déconnexion.
 *
 * Défense en profondeur : on revérifie la session ici (en plus du proxy). Les
 * pages enfants et les server actions la revérifient également.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-hairline bg-surface">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10">
          <a
            href="/admin/dashboard"
            className="rounded-btn focus:outline-none focus:ring-2 focus:ring-canard/30"
            aria-label="Tableau de bord Marssane"
          >
            <LogoMarssane size={26} withWordmark />
          </a>
          <div className="flex items-center gap-4">
            <span className="hidden text-[13px] text-soft sm:inline">
              {admin.email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1180px] px-6 py-10 sm:px-10">
        {children}
      </main>
    </div>
  );
}
