import {
  deleteInscriptionAction,
} from "@/app/admin/dashboard/actions";
import type {
  InscriptionRow,
  SessionRattachable,
} from "@/lib/admin-queries";
import { formatDateLongueOuADefinir } from "@/lib/session-display";
import { EmailStatutBadge } from "./badges";
import { ConfirmButton } from "./ConfirmButton";
import { InscriptionStatutSelect } from "./InscriptionStatutSelect";
import { RattacherSessionSelect } from "./RattacherSessionSelect";

/** Ligne du tableau : session rattachée facultative (colonne `showSession`). */
type Row = InscriptionRow & {
  session_date?: string | null;
  session_lieu?: string | null;
};

/** Métier affiché avec sa précision éventuelle (« Autre · … »). */
function metierLabel(row: InscriptionRow): string {
  return row.metier_autre ? `${row.metier} · ${row.metier_autre}` : row.metier;
}

/**
 * Session rattachée : « 12 septembre 2026 · Marseille ». « — » si aucune
 * session, « À définir » si la session n'a pas encore de date.
 */
function sessionLabel(row: Row): string {
  if (row.session_date === undefined) return "—";
  const date = formatDateLongueOuADefinir(row.session_date);
  return row.session_lieu ? `${date} · ${row.session_lieu}` : date;
}

const TH =
  "whitespace-nowrap px-3 py-2 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft";
const TD = "whitespace-nowrap px-3 py-2.5 font-mono text-[13px] text-body";

/**
 * Tableau des inscrits (CDC §5.3) : colonnes nom, prénom, email, téléphone,
 * métier (+ précision), entreprise, créneau souhaité, date d'inscription,
 * statut d'envoi du dernier email destiné à l'inscrit, statut. Données en mono
 * 13 px. Par ligne : select de statut (action immédiate) et suppression
 * définitive (avec confirmation, droit à l'effacement RGPD). Tri : plus récent
 * d'abord (assuré par la requête). Responsive : défilement horizontal.
 *
 * `showSession` ajoute une colonne « Session » (listes qui mélangent plusieurs
 * sessions) ; sans elle, le tableau est identique à celui d'une session unique.
 *
 * `sessionsRattachables` ajoute une colonne « Rattacher » (select de session +
 * validation) : réservée à la liste d'attente générale, dont les inscriptions
 * n'ont pas de session.
 */
export function InscriptionsTable({
  rows,
  emptyLabel,
  showSession = false,
  sessionsRattachables,
}: {
  rows: Row[];
  emptyLabel: string;
  showSession?: boolean;
  sessionsRattachables?: SessionRattachable[];
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-hairline bg-surface shadow-card">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-hairline">
            <th className={TH}>Nom</th>
            <th className={TH}>Prénom</th>
            <th className={TH}>Email</th>
            <th className={TH}>Téléphone</th>
            <th className={TH}>Métier</th>
            <th className={TH}>Entreprise</th>
            <th className={TH}>Créneau souhaité</th>
            <th className={TH}>Inscription</th>
            {showSession && <th className={TH}>Session</th>}
            <th className={TH}>E-mail</th>
            <th className={TH}>Statut</th>
            {sessionsRattachables && <th className={TH}>Rattacher</th>}
            <th className={`${TH} text-right`}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-hairline last:border-0 hover:bg-toile/60"
            >
              <td className={`${TD} font-semibold text-ink`}>{row.nom}</td>
              <td className={TD}>{row.prenom}</td>
              <td className={TD}>{row.email}</td>
              <td className={TD}>{row.telephone}</td>
              <td className={`${TD} whitespace-normal`}>{metierLabel(row)}</td>
              <td className={TD}>{row.entreprise ?? "—"}</td>
              <td className={`${TD} whitespace-normal`}>{row.creneau ?? "—"}</td>
              <td className={`${TD} text-faint`}>{row.created_at}</td>
              {showSession && <td className={TD}>{sessionLabel(row)}</td>}
              <td className={TD}>
                <EmailStatutBadge statut={row.email_statut} />
              </td>
              <td className="px-3 py-2.5">
                <InscriptionStatutSelect id={row.id} statut={row.statut} />
              </td>
              {sessionsRattachables && (
                <td className="px-3 py-2.5">
                  <RattacherSessionSelect
                    inscriptionId={row.id}
                    sessions={sessionsRattachables}
                  />
                </td>
              )}
              <td className="px-3 py-2.5 text-right">
                <form action={deleteInscriptionAction} className="inline">
                  <input type="hidden" name="id" value={row.id} />
                  <ConfirmButton
                    message={`Supprimer définitivement l'inscription de ${row.prenom} ${row.nom} ? Cette action est irréversible.`}
                    className="rounded-btn px-2.5 py-1.5 font-mono text-[12px] font-medium text-ink-clay transition-colors hover:bg-[rgba(199,90,77,0.12)]"
                  >
                    Supprimer
                  </ConfirmButton>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
