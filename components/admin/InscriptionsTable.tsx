import {
  deleteInscriptionAction,
} from "@/app/admin/dashboard/actions";
import type { InscriptionRow } from "@/lib/admin-queries";
import { ConfirmButton } from "./ConfirmButton";
import { InscriptionStatutSelect } from "./InscriptionStatutSelect";

/** Métier affiché avec sa précision éventuelle (« Autre — … »). */
function metierLabel(row: InscriptionRow): string {
  return row.metier_autre ? `${row.metier} — ${row.metier_autre}` : row.metier;
}

const TH =
  "whitespace-nowrap px-3 py-2 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft";
const TD = "whitespace-nowrap px-3 py-2.5 font-mono text-[13px] text-body";

/**
 * Tableau des inscrits (CDC §5.3) : colonnes nom, prénom, email, téléphone,
 * métier (+ précision), entreprise, date d'inscription, statut. Données en mono
 * 13 px. Par ligne : select de statut (action immédiate) et suppression
 * définitive (avec confirmation, droit à l'effacement RGPD). Tri : plus récent
 * d'abord (assuré par la requête). Responsive : défilement horizontal.
 */
export function InscriptionsTable({
  rows,
  emptyLabel,
}: {
  rows: InscriptionRow[];
  emptyLabel: string;
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
            <th className={TH}>Inscription</th>
            <th className={TH}>Statut</th>
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
              <td className={`${TD} text-faint`}>{row.created_at}</td>
              <td className="px-3 py-2.5">
                <InscriptionStatutSelect id={row.id} statut={row.statut} />
              </td>
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
