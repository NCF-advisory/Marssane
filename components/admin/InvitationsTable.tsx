import { renvoyerInvitationAction } from "@/app/admin/dashboard/actions";
import type { ParticipantInviteRow } from "@/lib/participants";

/**
 * Tableau des inscrits confirmés d'une session avec l'état de leur invitation à
 * l'espace formation : non invité / invité le… / activé le…. Bouton « Renvoyer
 * l'invitation » pour les comptes invités mais pas encore activés (régénère le
 * token). Lecture calquée sur InscriptionsTable (mono 13 px, scroll horizontal).
 */

const TH =
  "whitespace-nowrap px-3 py-2 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft";
const TD = "whitespace-nowrap px-3 py-2.5 font-mono text-[13px] text-body";
const CHIP =
  "inline-flex items-center rounded-chip px-[9px] py-[4px] font-mono text-[10.5px] font-medium uppercase tracking-[0.1em]";

function EtatBadge({ row }: { row: ParticipantInviteRow }) {
  if (row.activated_at) {
    return <span className={`${CHIP} bg-ecume text-ink-ecume`}>Activé</span>;
  }
  if (row.participant_id) {
    return (
      <span className={`${CHIP} bg-periwinkle text-ink-periwinkle`}>Invité</span>
    );
  }
  return (
    <span className={`${CHIP} border border-outline bg-toile text-body`}>
      Non invité
    </span>
  );
}

export function InvitationsTable({
  rows,
  sessionId,
}: {
  rows: ParticipantInviteRow[];
  sessionId: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
        Aucun inscrit confirmé pour cette session.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-hairline bg-surface shadow-card">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-hairline">
            <th className={TH}>Nom</th>
            <th className={TH}>Prénom</th>
            <th className={TH}>Email</th>
            <th className={TH}>État</th>
            <th className={TH}>Invité le</th>
            <th className={TH}>Activé le</th>
            <th className={`${TH} text-right`}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.inscription_id}
              className="border-b border-hairline last:border-0 hover:bg-toile/60"
            >
              <td className={`${TD} font-semibold text-ink`}>{row.nom}</td>
              <td className={TD}>{row.prenom}</td>
              <td className={TD}>{row.email}</td>
              <td className="px-3 py-2.5">
                <EtatBadge row={row} />
              </td>
              <td className={`${TD} text-faint`}>{row.invited_at ?? "—"}</td>
              <td className={`${TD} text-faint`}>{row.activated_at ?? "—"}</td>
              <td className="px-3 py-2.5 text-right">
                {row.participant_id && !row.activated_at ? (
                  <form action={renvoyerInvitationAction} className="inline">
                    <input type="hidden" name="session_id" value={sessionId} />
                    <input
                      type="hidden"
                      name="participant_id"
                      value={row.participant_id}
                    />
                    <button
                      type="submit"
                      className="rounded-btn px-2.5 py-1.5 font-mono text-[12px] font-medium text-canard transition-colors hover:bg-toile"
                    >
                      Renvoyer
                    </button>
                  </form>
                ) : (
                  <span className="font-mono text-[12px] text-faint">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
