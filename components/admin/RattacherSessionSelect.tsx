import { rattacherInscriptionAction } from "@/app/admin/dashboard/actions";
import type { SessionRattachable } from "@/lib/admin-queries";
import { formatDateLongueOuADefinir } from "@/lib/session-display";

/** « 12 septembre 2026 · Marseille · 3 pl. » (« À définir » si pas de date). */
function optionLabel(session: SessionRattachable): string {
  const date = formatDateLongueOuADefinir(session.date);
  const lieu = session.lieu ? ` · ${session.lieu}` : "";
  return `${date}${lieu} · ${session.places_restantes} pl.`;
}

/**
 * Rattachement d'une inscription de la liste d'attente générale à une session :
 * select des sessions ouvertes + bouton de validation. Pas de soumission
 * automatique ici (contrairement au select de statut) : le rattachement change
 * la session ET le statut, une validation explicite évite le clic malheureux.
 *
 * Sans session rattachable, affiche une mention discrète plutôt qu'un select
 * vide.
 */
export function RattacherSessionSelect({
  inscriptionId,
  sessions,
}: {
  inscriptionId: string;
  sessions: SessionRattachable[];
}) {
  if (sessions.length === 0) {
    return (
      <span className="font-mono text-[12px] text-faint">
        Aucune session ouverte
      </span>
    );
  }

  return (
    <form
      action={rattacherInscriptionAction}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="id" value={inscriptionId} />
      <label className="sr-only" htmlFor={`session-${inscriptionId}`}>
        Session à rattacher
      </label>
      <select
        id={`session-${inscriptionId}`}
        name="session_id"
        defaultValue={sessions[0].id}
        className="rounded-btn border-[1.5px] border-outline bg-surface px-2 py-1.5 font-mono text-[12px] text-ink transition-colors focus:border-canard focus:outline-none focus:ring-2 focus:ring-canard/20"
      >
        {sessions.map((session) => (
          <option key={session.id} value={session.id}>
            {optionLabel(session)}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-btn px-2.5 py-1.5 font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
      >
        Rattacher
      </button>
    </form>
  );
}
