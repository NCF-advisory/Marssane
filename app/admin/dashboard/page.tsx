import type { Metadata } from "next";
import { archiveSessionAction } from "@/app/admin/dashboard/actions";
import { SessionStatutBadge } from "@/components/admin/badges";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ContactsList } from "@/components/admin/ContactsList";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { InscriptionsTable } from "@/components/admin/InscriptionsTable";
import { Button } from "@/components/ui/Button";
import {
  getWaitlistGenerale,
  listContacts,
  listSessionsWithCounts,
  type ContactRow,
  type InscriptionRow,
  type SessionRow,
} from "@/lib/admin-queries";
import { formatDateLongue } from "@/lib/session-display";

export const metadata: Metadata = {
  title: "Tableau de bord — Administration Marssane",
};

/** Horaires « 09:30 – 17:00 » (ou « 09:30 », ou « — »). */
function horaires(row: SessionRow): string {
  if (row.heure_debut && row.heure_fin) {
    return `${row.heure_debut} – ${row.heure_fin}`;
  }
  return row.heure_debut ?? "—";
}

/** Prochaine session publiée / complète à venir (pour le compteur en tête). */
function prochaineSession(sessions: SessionRow[]): SessionRow | null {
  const today = new Date().toISOString().slice(0, 10);
  return (
    sessions
      .filter(
        (s) =>
          (s.statut === "publiee" || s.statut === "complete") &&
          s.date >= today,
      )
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
  );
}

const ACTION_LINK =
  "font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark";

export default async function AdminDashboardPage() {
  let sessions: SessionRow[];
  let waitlist: InscriptionRow[];
  try {
    [sessions, waitlist] = await Promise.all([
      listSessionsWithCounts(),
      getWaitlistGenerale(),
    ]);
  } catch {
    console.error("[admin] tableau de bord : base indisponible");
    return (
      <div className="space-y-8">
        <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em]">
          Tableau de bord
        </h1>
        <DbUnavailable />
      </div>
    );
  }

  const prochaine = prochaineSession(sessions);

  // Demandes de contact : chargées à part, avec repli propre. Ainsi la vue
  // contact peut dégrader indépendamment (ex. migration 003 pas encore
  // appliquée) sans masquer les sessions déjà chargées ci-dessus.
  let contacts: ContactRow[] | null;
  try {
    contacts = await listContacts();
  } catch {
    console.error("[admin] demandes de contact : base indisponible");
    contacts = null;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em]">
          Tableau de bord
        </h1>
        <Button href="/admin/dashboard/sessions/new" arrow>
          Créer une session
        </Button>
      </div>

      {/* Compteur de la prochaine session publiée (bandeau chiffres). */}
      <div className="rounded-card border border-hairline bg-surface px-6 py-5 shadow-card">
        {prochaine ? (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[34px] font-semibold leading-none text-ink-ecume">
              {prochaine.confirme}
            </span>
            <span className="font-mono text-[20px] leading-none text-quiet">
              / {prochaine.capacite}
            </span>
            <span className="text-[14px] text-body">
              inscrits confirmés — session du{" "}
              <span className="font-semibold text-ink">
                {formatDateLongue(prochaine.date)}
              </span>
            </span>
          </div>
        ) : (
          <p className="text-[14px] text-soft">
            Aucune session publiée à venir. Créez ou publiez une session pour
            qu&apos;elle alimente la page d&apos;accueil.
          </p>
        )}
      </div>

      {/* Liste des sessions. */}
      <section className="space-y-4">
        <h2 className="text-[19px] font-bold tracking-[-0.01em]">Sessions</h2>
        {sessions.length === 0 ? (
          <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
            Aucune session pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-hairline bg-surface shadow-card">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                    Horaires
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                    Lieu
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                    Statut
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                    Inscrits
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-right font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-hairline last:border-0 align-middle hover:bg-toile/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-[14px] font-semibold text-ink">
                      {formatDateLongue(s.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-body">
                      {horaires(s)}
                    </td>
                    <td className="px-4 py-3 text-[14px] text-body">
                      {s.lieu ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <SessionStatutBadge statut={s.statut} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-body">
                      {s.confirme} / {s.capacite}
                      {s.attente > 0 && (
                        <span className="ml-2 text-faint">
                          +{s.attente} att.
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1.5">
                        <a
                          href={`/admin/dashboard/sessions/${s.id}`}
                          className={ACTION_LINK}
                        >
                          Modifier
                        </a>
                        <a
                          href={`/admin/dashboard/sessions/${s.id}#inscrits`}
                          className={ACTION_LINK}
                        >
                          Inscrits
                        </a>
                        <a
                          href={`/admin/dashboard/sessions/${s.id}/export`}
                          className={ACTION_LINK}
                        >
                          Export CSV
                        </a>
                        {s.statut !== "terminee" && (
                          <form action={archiveSessionAction} className="inline">
                            <input type="hidden" name="id" value={s.id} />
                            <ConfirmButton
                              message={`Archiver la session du ${formatDateLongue(s.date)} ? Elle passera au statut « Terminée » et ne sera plus proposée à l'inscription.`}
                              className="font-mono text-[12px] font-medium text-soft transition-colors hover:text-ink"
                            >
                              Archiver
                            </ConfirmButton>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Liste d'attente générale (inscriptions sans session rattachée). */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[19px] font-bold tracking-[-0.01em]">
            Liste d&apos;attente générale
          </h2>
          <span className="font-mono text-[13px] text-faint">
            {waitlist.length}
          </span>
        </div>
        <p className="max-w-[640px] text-[13.5px] leading-[1.5] text-soft">
          Inscriptions reçues sans session publiée (à recontacter dès qu&apos;une
          session est ouverte).
        </p>
        <InscriptionsTable
          rows={waitlist}
          emptyLabel="Aucune inscription en liste d'attente générale."
        />
      </section>

      {/* Vue contact : demandes reçues via le formulaire implémentation (F4). */}
      <section className="space-y-4 border-t border-hairline pt-8">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[19px] font-bold tracking-[-0.01em]">
            Demandes de contact
          </h2>
          {contacts && (
            <span className="font-mono text-[13px] text-faint">
              {contacts.length}
            </span>
          )}
        </div>
        <p className="max-w-[640px] text-[13.5px] leading-[1.5] text-soft">
          Demandes reçues via le formulaire « Aller plus loin » (implémentation).
          Lecture seule ; marquez chaque demande comme traitée une fois prise en
          charge.
        </p>
        {contacts === null ? (
          <DbUnavailable />
        ) : (
          <ContactsList rows={contacts} />
        )}
      </section>
    </div>
  );
}
