import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateSessionAction } from "@/app/admin/dashboard/actions";
import { SessionStatutBadge } from "@/components/admin/badges";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { FormationChat } from "@/components/admin/FormationChat";
import { FormationQcm, type QcmBlock } from "@/components/admin/FormationQcm";
import { InscriptionsTable } from "@/components/admin/InscriptionsTable";
import { InvitationsTable } from "@/components/admin/InvitationsTable";
import { LancerFormationButton } from "@/components/admin/LancerFormationButton";
import { SessionForm } from "@/components/admin/SessionForm";
import {
  getInscriptionsBySession,
  getSessionById,
  type InscriptionRow,
  type SessionDetail,
} from "@/lib/admin-queries";
import { listMessages } from "@/lib/formation-chat";
import type { ChatMessage } from "@/lib/formation-chat-display";
import {
  listConfirmedForInvite,
  type ParticipantInviteRow,
} from "@/lib/participants";
import {
  getOuverture,
  getSessionResults,
  listQuestionnaires,
} from "@/lib/qcm";
import { formatDateLongue } from "@/lib/session-display";
import { parseId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Session · Administration Marssane",
};

/** Bandeau de résultat après « Lancer la formation » (décompte des invitations). */
function FormationBanner({
  formation,
  invites,
  deja,
  echecs,
}: {
  formation?: string;
  invites?: string;
  deja?: string;
  echecs?: string;
}) {
  if (formation === "erreur") {
    return (
      <p
        role="alert"
        className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-2.5 text-[13px] leading-[1.5] text-ink-clay"
      >
        Lancement impossible : base indisponible. Réessayez dans un instant.
      </p>
    );
  }
  if (formation !== "ok") return null;
  const nInvites = Number(invites ?? 0);
  const nDeja = Number(deja ?? 0);
  const nEchecs = Number(echecs ?? 0);
  return (
    <p
      role="status"
      className="rounded-chip bg-ecume px-4 py-2.5 text-[13px] leading-[1.5] text-ink-ecume"
    >
      {nInvites} invitation{nInvites > 1 ? "s" : ""} envoyée
      {nInvites > 1 ? "s" : ""}
      {nDeja ? ` · ${nDeja} déjà invité(s)` : ""}
      {nEchecs ? ` · ${nEchecs} échec(s) d'envoi` : ""}.
    </p>
  );
}

/** Détail d'une session (F3) : édition + suivi des inscrits + export CSV. */
export default async function SessionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    formation?: string;
    invites?: string;
    deja?: string;
    echecs?: string;
  }>;
}) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();
  const banner = await searchParams;

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

  // Invitations à l'espace formation : chargées à part avec repli propre, pour
  // que la migration 004 non appliquée ne masque pas le reste de la page.
  let invitations: ParticipantInviteRow[] | null;
  try {
    invitations = await listConfirmedForInvite(id);
  } catch {
    console.error("[admin] invitations formation : base indisponible");
    invitations = null;
  }
  const aInviter = invitations?.filter((r) => !r.participant_id).length ?? 0;

  // Chat de la promotion : chargé à part, repli propre (migration 004).
  let chatMessages: ChatMessage[] | null;
  try {
    chatMessages = await listMessages(id);
  } catch {
    console.error("[admin] chat formation : base indisponible");
    chatMessages = null;
  }

  // QCM : un bloc par questionnaire (état d'ouverture + résultats individuels).
  // Chargé à part avec repli propre (migration 004 / banque non seedée).
  let qcmBlocks: QcmBlock[] | null;
  try {
    const questionnaires = await listQuestionnaires();
    qcmBlocks = await Promise.all(
      questionnaires.map(async (questionnaire) => {
        const [ouverture, results] = await Promise.all([
          getOuverture(id, questionnaire.id),
          getSessionResults(id, questionnaire.id),
        ]);
        const rows = results?.rows ?? [];
        return {
          questionnaireId: questionnaire.id,
          numeroSession: questionnaire.numeroSession,
          titre: questionnaire.titre,
          total: results?.questionnaire.questions.length ?? 0,
          ouvert: ouverture != null,
          ferme: ouverture?.fermeAt != null,
          completedCount: rows.filter((r) => r.completed).length,
          rows,
        };
      }),
    );
  } catch {
    console.error("[admin] QCM formation : base indisponible");
    qcmBlocks = null;
  }

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

      {/* Espace formation : invitations des inscrits confirmés (phase 1). */}
      <section id="formation" className="space-y-4 border-t border-hairline pt-8 scroll-mt-6">
        <h2 className="text-[19px] font-bold tracking-[-0.01em]">
          Espace formation
        </h2>
        <p className="max-w-[640px] text-[13.5px] leading-[1.5] text-soft">
          Lancer la formation invite chaque inscrit confirmé par e-mail : un lien
          personnel lui permet d&apos;activer son compte (choix du mot de passe)
          puis d&apos;accéder à son espace. Les inscrits déjà invités sont
          ignorés ; vous pouvez renvoyer une invitation tant que le compte
          n&apos;est pas activé.
        </p>
        {invitations === null ? (
          <DbUnavailable />
        ) : (
          <>
            <FormationBanner
              formation={banner.formation}
              invites={banner.invites}
              deja={banner.deja}
              echecs={banner.echecs}
            />
            <LancerFormationButton sessionId={id} pendingCount={aInviter} />
            <InvitationsTable rows={invitations} sessionId={id} />
          </>
        )}
      </section>

      {/* Chat de la promotion : lecture + réponse du formateur (FAQ du mercredi). */}
      <section
        id="chat"
        className="space-y-4 border-t border-hairline pt-8 scroll-mt-6"
      >
        <h2 className="text-[19px] font-bold tracking-[-0.01em]">
          Chat de la promotion
        </h2>
        <p className="max-w-[640px] text-[13.5px] leading-[1.5] text-soft">
          Le fil commun des participants de cette promotion. Publiez une réponse
          groupée (idéalement le mercredi) et épinglez-la en tête : elle apparaît
          alors comme « FAQ du mercredi » dans l&apos;espace des participants.
        </p>
        {chatMessages === null ? (
          <DbUnavailable />
        ) : (
          <FormationChat messages={chatMessages} sessionId={id} />
        )}
      </section>

      {/* QCM de la promotion : ouverture/fermeture, résultats, présentation. */}
      <section
        id="qcm"
        className="space-y-4 border-t border-hairline pt-8 scroll-mt-6"
      >
        <h2 className="text-[19px] font-bold tracking-[-0.01em]">
          QCM de la promotion
        </h2>
        <p className="max-w-[640px] text-[13.5px] leading-[1.5] text-soft">
          Ouvrez un QCM en fin de session : les participants le passent depuis
          leur espace. Le mode présentation projette la répartition anonymisée
          des réponses pour la reprise à chaud ; le détail par participant reste
          de votre côté, confidentiel.
        </p>
        {qcmBlocks === null ? (
          <DbUnavailable />
        ) : (
          <FormationQcm sessionId={id} blocks={qcmBlocks} />
        )}
      </section>
    </div>
  );
}
