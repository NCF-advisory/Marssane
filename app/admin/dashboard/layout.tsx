import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { getCurrentAdmin } from "@/lib/admin-auth";

/**
 * Gabarit de l'administration (F3, étendu ERP · Lot 0). En-tête commun à
 * toutes les pages du sous-arbre `/admin/dashboard/*` : logo (lien vers
 * l'accueil), email connecté, déconnexion, puis navigation par modules
 * (Tableau de bord, CRM, Sessions, Facturation, Documents — cadrage §6).
 *
 * Défense en profondeur : on revérifie la session ici (en plus du proxy). Les
 * pages enfants et les server actions la revérifient également.
 *
 * `toile-washes text-ink` : le tableau de bord reste en tonalité claire, alors
 * que le site vitrine est en encre (portée par le body).
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  return (
    <div className="toile-washes flex min-h-full flex-1 flex-col text-ink">
      <header className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
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
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1180px] px-6 py-10 sm:px-10">
        {children}
      </main>
    </div>
  );
}
