import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/formation/actions";
import { DbUnavailable } from "@/components/admin/DbUnavailable";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { PlusMark } from "@/components/ui/PlusMark";
import { listMessages } from "@/lib/formation-chat";
import { type ChatMessage, cursorFor } from "@/lib/formation-chat-display";
import { getCurrentParticipant } from "@/lib/participant-auth";
import {
  getParticipantEspace,
  type ParticipantEspace,
} from "@/lib/participants";
import { getParticipantQcmCards, type ParticipantQcmCard } from "@/lib/qcm";
import { formatDateLongue } from "@/lib/session-display";
import { ChatClient } from "./ChatClient";
import { QcmCards } from "./QcmCards";

export const metadata: Metadata = {
  title: "Mon espace · Formation Marssane",
};

/** Horaires « 09:30 – 12:30 » (ou « 09:30 », ou null). */
function horaires(p: ParticipantEspace): string | null {
  if (p.session_heure_debut && p.session_heure_fin) {
    return `${p.session_heure_debut} – ${p.session_heure_fin}`;
  }
  return p.session_heure_debut ?? null;
}

/** Les trois règles du jeu du chat (encart, puces « + » turquoise). */
const REGLES: { titre: string; corps: string }[] = [
  {
    titre: "D'abord Claude, puis le chat.",
    corps:
      "Posez votre question à Claude. Si vous restez bloqué, déposez-la ici avec la réponse de Claude.",
  },
  {
    titre: "Une réponse groupée chaque mercredi.",
    corps:
      "Le formateur publie une FAQ qui traite toutes les questions de la promo. Elle est épinglée en tête de fil.",
  },
  {
    titre: "Pas de réponse individuelle.",
    corps:
      "Le fil est commun : une réponse sert à dix. En attendant le mercredi, entraidez-vous entre participants.",
  },
];

function ReglesCard() {
  return (
    <section
      aria-label="Règles du chat"
      className="rounded-card border border-hairline bg-surface px-6 py-5 shadow-card"
    >
      <h2 className="mb-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-soft">
        Comment ça marche
      </h2>
      <ul className="grid gap-2.5">
        {REGLES.map((regle) => (
          <li key={regle.titre} className="flex gap-2.5">
            <PlusMark variant="turquoise" size={22} className="mt-[1px] flex-none" />
            <p className="text-[15px] leading-[1.5] text-body">
              <strong className="font-semibold text-ink">{regle.titre}</strong>{" "}
              {regle.corps}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Espace formation du participant (phase 2 : chat commun de la promotion).
 * En-tête (logo + déconnexion), rappel de la promotion, encart des règles, puis
 * le chat temps réel. Le chat charge son historique côté serveur et se dégrade
 * proprement (DbUnavailable) si la base est injoignable, sans casser l'en-tête.
 *
 * Défense en profondeur : on revérifie la session ici (en plus du proxy).
 */
export default async function EspaceFormationPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/formation");

  let data: ParticipantEspace | null;
  try {
    data = await getParticipantEspace(participant.sub);
  } catch {
    console.error("[formation] espace : base indisponible");
    data = null;
  }

  // Historique du chat chargé à part (repli propre) : une base indisponible
  // masque le chat mais laisse le reste de la page se rendre.
  let messages: ChatMessage[] | null;
  try {
    messages = await listMessages(participant.sessionId);
  } catch {
    console.error("[formation] chat : base indisponible");
    messages = null;
  }

  // QCM de la promotion : chargés à part, repli silencieux (migration 004 /
  // banque non seedée → aucune carte, le reste de la page se rend).
  let qcmCards: ParticipantQcmCard[];
  try {
    qcmCards = await getParticipantQcmCards(participant.sessionId, participant.sub);
  } catch {
    console.error("[formation] QCM : base indisponible");
    qcmCards = [];
  }

  const lieu = data?.session_lieu ?? null;
  const heures = data ? horaires(data) : null;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-hairline bg-surface">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10">
          <div className="flex items-center gap-3">
            <LogoMarssane size={26} withWordmark />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-[13px] text-soft sm:inline">
              {participant.email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[820px] px-6 py-10 sm:px-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-soft">
              Ma promotion
            </p>
            <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
              {data ? `Bonjour ${data.prenom}` : "Chat de la promotion"}
            </h1>
            {data && (
              <p className="text-[15px] leading-[1.6] text-body">
                Formation du{" "}
                <span className="font-semibold text-ink">
                  {formatDateLongue(data.session_date)}
                </span>
                {heures ? ` · ${heures}` : ""}
                {lieu ? ` · ${lieu}` : ""}.
              </p>
            )}
          </div>

          <ReglesCard />

          <QcmCards cards={qcmCards} />

          {messages === null ? (
            <DbUnavailable />
          ) : (
            <ChatClient
              initialMessages={messages}
              currentParticipantId={participant.sub}
              initialCursor={cursorFor(messages[messages.length - 1])}
            />
          )}
        </div>
      </main>
    </div>
  );
}
