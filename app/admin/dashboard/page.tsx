import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Tableau de bord — Administration Marssane",
};

/**
 * Tableau de bord admin (F3). Gabarit minimal — le contenu réel (gestion des
 * sessions, liste des inscrits, export CSV) arrive en tâche 2.
 *
 * L'accès est protégé par le middleware ; on relit ici la session pour afficher
 * l'email connecté (et, par sécurité, on renvoie à la connexion si elle a
 * expiré entre le middleware et le rendu).
 */
export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em]">
            Tableau de bord
          </h1>
          <p className="mt-3 text-[15px] leading-[1.5] text-body">
            Connecté en tant que{" "}
            <span className="font-semibold text-ink">{admin.email}</span>.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-6 py-[13px] text-[15px] font-semibold text-ink transition-colors hover:bg-toile"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </main>
  );
}
