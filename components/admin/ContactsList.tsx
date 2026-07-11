import { updateContactTraiteAction } from "@/app/admin/dashboard/actions";
import type { ContactRow } from "@/lib/admin-queries";
import { ContactTraiteBadge } from "./badges";

/** Au-delà de cette longueur, le message est tronqué avec dépliage (details). */
const MESSAGE_TRUNCATE = 160;

const TH =
  "whitespace-nowrap px-3 py-2 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft";
const TD = "px-3 py-2.5 align-top font-mono text-[13px] text-body";

/**
 * Message tronqué au-delà d'un seuil, dépliable via un `<details>` natif
 * (sans JS, accessible). Sous le seuil : rendu en clair. Les retours à la ligne
 * sont préservés (`whitespace-pre-wrap`).
 */
function MessageCell({ message }: { message: string }) {
  if (message.length <= MESSAGE_TRUNCATE) {
    return (
      <p className="whitespace-pre-wrap font-sans text-[13px] leading-[1.5] text-body">
        {message}
      </p>
    );
  }

  return (
    <details className="group font-sans text-[13px] leading-[1.5] text-body">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">
          {message.slice(0, MESSAGE_TRUNCATE).trimEnd()}…{" "}
        </span>
        <span className="font-mono text-[12px] font-medium text-canard">
          <span className="group-open:hidden">voir plus</span>
          <span className="hidden group-open:inline">voir moins</span>
        </span>
      </summary>
      <p className="mt-1.5 whitespace-pre-wrap">{message}</p>
    </details>
  );
}

/**
 * Vue contact admin (CDC §5.3) : liste LECTURE SEULE des demandes reçues via le
 * formulaire « implémentation » (F4). Colonnes : date, prénom nom, email,
 * téléphone, entreprise, message (tronqué + dépliage), état. Seule action :
 * basculer « traité / non traité » (form + server action, sans JS requis). Tri :
 * plus récent d'abord (assuré par la requête). Responsive : défilement horizontal.
 */
export function ContactsList({ rows }: { rows: ContactRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
        Aucune demande de contact pour le moment.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-hairline bg-surface shadow-card">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-hairline">
            <th className={TH}>Date</th>
            <th className={TH}>Nom</th>
            <th className={TH}>Email</th>
            <th className={TH}>Téléphone</th>
            <th className={TH}>Entreprise</th>
            <th className={`${TH} w-[360px]`}>Message</th>
            <th className={TH}>État</th>
            <th className={`${TH} text-right`}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-hairline last:border-0 hover:bg-toile/60"
            >
              <td className={`${TD} whitespace-nowrap text-faint`}>
                {row.created_at}
              </td>
              <td className={`${TD} whitespace-nowrap font-semibold text-ink`}>
                {row.prenom} {row.nom}
              </td>
              <td className={`${TD} whitespace-nowrap`}>{row.email}</td>
              <td className={`${TD} whitespace-nowrap`}>
                {row.telephone ?? "—"}
              </td>
              <td className={`${TD} whitespace-nowrap`}>{row.entreprise}</td>
              <td className={`${TD} max-w-[360px]`}>
                <MessageCell message={row.message} />
              </td>
              <td className="px-3 py-2.5 align-top">
                <ContactTraiteBadge traite={row.traite} />
              </td>
              <td className="px-3 py-2.5 text-right align-top">
                <form action={updateContactTraiteAction} className="inline">
                  <input type="hidden" name="id" value={row.id} />
                  <input
                    type="hidden"
                    name="traite"
                    value={row.traite ? "false" : "true"}
                  />
                  <button
                    type="submit"
                    className="rounded-btn px-2.5 py-1.5 font-mono text-[12px] font-medium text-canard transition-colors hover:bg-ecume hover:text-ink-ecume"
                  >
                    {row.traite ? "Marquer non traité" : "Marquer traité"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
