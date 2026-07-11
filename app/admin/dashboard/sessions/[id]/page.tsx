import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateSessionAction } from "@/app/admin/dashboard/actions";
import { SessionStatutBadge } from "@/components/admin/badges";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { InscriptionsTable } from "@/components/admin/InscriptionsTable";
import { SessionForm } from "@/components/admin/SessionForm";
import {
  getInscriptionsBySession,
  getSessionById,
  type InscriptionRow,
  type SessionDetail,
} from "@/lib/admin-queries";
import { formatDateLongue } from "@/lib/session-display";
import { parseId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Session — Administration Marssane",
};

/** Détail d'une session (F3) : édition + suivi des inscrits + export CSV. */
export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();

  let session: SessionDetail | null;
  let inscriptions: InscriptionRow[];
  try {
    [session, inscriptions] = await Promise.all([
      getSessionById(id),
      getInscriptionsBySession(id),
    ]);
  } catch {
    console.error("[admin] détail session : base indisponible");
    return (
      <div className="space-y-8">
        <a
          href="/admin/dashboard"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← Tableau de bord
        </a>
        <DbUnavailable />
      </div>
    );
  }

  if (!session) notFound();

  const confirmes = inscriptions.filter((i) => i.statut === "confirme").length;

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <a
          href="/admin/dashboard"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← Tableau de bord
        </a>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
            Session du {formatDateLongue(session.date)}
          </h1>
          <SessionStatutBadge statut={session.statut} />
        </div>
        <p className="font-mono text-[13px] text-body">
          {confirmes} / {session.capacite} inscrits confirmés
        </p>
      </div>

      {/* Édition. */}
      <section className="max-w-[560px] space-y-5">
        <h2 className="text-[19px] font-bold tracking-[-0.01em]">
          Modifier la session
        </h2>
        <SessionForm
          action={updateSessionAction.bind(null, id)}
          values={session}
          submitLabel="Enregistrer les modifications"
        />
      </section>

      {/* Inscrits. */}
      <section id="inscrits" className="space-y-4 scroll-mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[19px] font-bold tracking-[-0.01em]">Inscrits</h2>
            <span className="font-mono text-[13px] text-faint">
              {inscriptions.length}
            </span>
          </div>
          <a
            href={`/admin/dashboard/sessions/${id}/export`}
            className="inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
          >
            Export CSV
          </a>
        </div>
        <InscriptionsTable
          rows={inscriptions}
          emptyLabel="Aucune inscription pour cette session."
        />
      </section>
    </div>
  );
}
