import { lancerFormationAction } from "@/app/admin/dashboard/actions";

/**
 * Bouton « Lancer la formation » : formulaire simple qui déclenche l'envoi des
 * invitations aux inscrits confirmés sans compte, puis redirige vers le détail
 * de la session (le décompte s'affiche en bandeau côté page). Désactivé quand il
 * n'y a personne à inviter. Progressive enhancement : fonctionne sans JS.
 */
export function LancerFormationButton({
  sessionId,
  pendingCount,
}: {
  sessionId: string;
  pendingCount: number;
}) {
  return (
    <form action={lancerFormationAction}>
      <input type="hidden" name="session_id" value={sessionId} />
      <button
        type="submit"
        disabled={pendingCount === 0}
        className="inline-flex items-center justify-center gap-2.5 rounded-btn bg-canard px-[27px] py-[13px] text-[15px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pendingCount === 0
          ? "Tous les inscrits sont invités"
          : `Lancer la formation (${pendingCount} à inviter)`}
      </button>
    </form>
  );
}
