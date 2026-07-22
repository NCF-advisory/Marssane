import { fermerQcmAction, ouvrirQcmAction } from "@/app/admin/dashboard/actions";
import type { ParticipantResultRow } from "@/lib/qcm";

/**
 * Un bloc QCM prêt à afficher côté formateur : état d'ouverture, décompte des
 * participants ayant terminé, et résultats individuels (score /total). Assemblé
 * par la page de détail de session.
 */
export type QcmBlock = {
  questionnaireId: string;
  numeroSession: number;
  titre: string;
  total: number;
  ouvert: boolean;
  ferme: boolean;
  completedCount: number;
  rows: ParticipantResultRow[];
};

/**
 * Section QCM du détail de session (formateur). Pour chaque questionnaire : état
 * (fermé / ouvert / pas encore ouvert), boutons Ouvrir / Fermer, compteur de
 * participants ayant terminé, tableau détail par participant (confidentiel,
 * jamais projeté), export CSV et accès au mode présentation. Composant serveur.
 */
export function FormationQcm({
  sessionId,
  blocks,
}: {
  sessionId: string;
  blocks: QcmBlock[];
}) {
  if (blocks.length === 0) {
    return (
      <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
        Aucun questionnaire dans la banque. Lancez le seed des QCM
        (`npm run db:seed:qcm`) pour créer les questionnaires des sessions 1 et 2.
      </p>
    );
  }
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <QcmBlockCard key={block.questionnaireId} sessionId={sessionId} block={block} />
      ))}
    </div>
  );
}

function StateBadge({ block }: { block: QcmBlock }) {
  if (block.ferme) {
    return (
      <span className="rounded-chip bg-toile px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
        Fermé
      </span>
    );
  }
  if (block.ouvert) {
    return (
      <span className="rounded-chip bg-ecume px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-ecume">
        Ouvert
      </span>
    );
  }
  return (
    <span className="rounded-chip bg-toile px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-slate">
      Pas encore ouvert
    </span>
  );
}

function QcmBlockCard({
  sessionId,
  block,
}: {
  sessionId: string;
  block: QcmBlock;
}) {
  const presentationHref = `/admin/dashboard/sessions/${sessionId}/qcm/${block.questionnaireId}/presentation`;
  const exportHref = `/admin/dashboard/sessions/${sessionId}/qcm/${block.questionnaireId}/export`;
  return (
    <article className="space-y-4 rounded-card border border-hairline bg-surface p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-canard">
            Session {block.numeroSession}
          </p>
          <p className="text-[16px] font-bold text-ink">{block.titre}</p>
        </div>
        <StateBadge block={block} />
        <span className="ml-auto font-mono text-[13px] text-faint">
          {block.completedCount} terminé{block.completedCount > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Ouvrir / rouvrir : disponible tant que le QCM n'est pas déjà ouvert. */}
        {(!block.ouvert || block.ferme) && (
          <form action={ouvrirQcmAction}>
            <input type="hidden" name="session_id" value={sessionId} />
            <input type="hidden" name="questionnaire_id" value={block.questionnaireId} />
            <button
              type="submit"
              className="inline-flex items-center rounded-btn bg-canard px-4 py-2 text-[13.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark"
            >
              {block.ferme ? "Rouvrir le QCM" : "Ouvrir le QCM"}
            </button>
          </form>
        )}
        {block.ouvert && !block.ferme && (
          <form action={fermerQcmAction}>
            <input type="hidden" name="session_id" value={sessionId} />
            <input type="hidden" name="questionnaire_id" value={block.questionnaireId} />
            <button
              type="submit"
              className="inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
            >
              Fermer le QCM
            </button>
          </form>
        )}
        <a
          href={presentationHref}
          className="inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
        >
          Mode présentation
        </a>
        <a
          href={exportHref}
          className="inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
        >
          Export CSV
        </a>
      </div>

      <DetailTable block={block} />
    </article>
  );
}

/** Classe de pastille de réussite (calquée sur la maquette). */
function pillClass(pct: number): string {
  if (pct >= 80) return "bg-[rgba(0,209,190,0.18)] text-ink-ecume";
  if (pct >= 60) return "bg-[rgba(199,210,247,0.35)] text-ink-periwinkle";
  return "bg-[rgba(199,90,77,0.16)] text-ink-clay";
}

function DetailTable({ block }: { block: QcmBlock }) {
  if (block.rows.length === 0) {
    return (
      <p className="text-[13.5px] text-soft">
        Aucun participant n&apos;a encore répondu.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
        Détail par participant · confidentiel, non projeté
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-hairline text-left">
              <th className="py-2 pr-3 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-soft">
                Participant
              </th>
              <th className="py-2 pr-3 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-soft">
                Score
              </th>
              <th className="py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-soft">
                Réussite
              </th>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => {
              const pct =
                row.total > 0 ? Math.round((row.score / row.total) * 100) : 0;
              return (
                <tr key={row.participantId} className="border-b border-hairline">
                  <td className="py-2 pr-3 text-ink">
                    {row.prenom} {row.nom}
                    {!row.completed && (
                      <span className="ml-2 font-mono text-[11px] text-faint">
                        en cours ({row.answered}/{row.total})
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3 font-mono font-semibold text-ink">
                    {row.score}/{row.total}
                  </td>
                  <td className="py-2">
                    <span
                      className={`inline-block min-w-[44px] rounded-chip px-2 py-1 text-center font-mono text-[12.5px] font-semibold ${pillClass(pct)}`}
                    >
                      {pct}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
