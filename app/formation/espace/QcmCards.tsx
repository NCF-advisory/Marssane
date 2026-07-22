import type { ParticipantQcmCard } from "@/lib/qcm";

/**
 * Cartes QCM de l'espace participant. Un état par questionnaire de la banque
 * (sessions 1 et 2) pour la promotion : pas encore ouvert / ouvert (Commencer ou
 * Reprendre) / déjà passé (score + récap) / fermé. Composant serveur : simples
 * liens vers la page de passage (`/formation/espace/qcm/[id]`).
 */
export function QcmCards({ cards }: { cards: ParticipantQcmCard[] }) {
  if (cards.length === 0) return null;
  return (
    <section aria-label="QCM" className="space-y-3">
      <h2 className="ml-1 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-soft">
        Vos QCM
      </h2>
      <div className="grid gap-3">
        {cards.map((card) => (
          <QcmCardItem key={card.questionnaireId} card={card} />
        ))}
      </div>
    </section>
  );
}

function QcmCardItem({ card }: { card: ParticipantQcmCard }) {
  const href = `/formation/espace/qcm/${card.questionnaireId}`;

  // 1. Déjà passé : score + accès au récapitulatif (même si encore ouvert).
  if (card.completed) {
    return (
      <article className="flex flex-wrap items-center gap-4 rounded-card border border-hairline bg-surface px-5 py-4 shadow-card">
        <Heading card={card} />
        <span className="inline-flex items-center gap-1.5 rounded-chip bg-ecume px-3 py-1.5 font-mono text-[13px] font-semibold text-ink-ecume">
          {card.score}/{card.total}
        </span>
        <a
          href={href}
          className="ml-auto inline-flex items-center rounded-btn border-[1.5px] border-outline bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-toile"
        >
          Voir le récapitulatif
        </a>
      </article>
    );
  }

  // 2. Ouvert (non fermé) : commencer ou reprendre.
  if (card.ouvert && !card.ferme) {
    const started = card.answered > 0;
    return (
      <article className="flex flex-wrap items-center gap-4 rounded-card border border-hairline bg-surface px-5 py-4 shadow-card">
        <Heading
          card={card}
          note={started ? `Repris à ${card.answered}/${card.total}` : "10 questions, environ 5 minutes."}
        />
        <a
          href={href}
          className="ml-auto inline-flex items-center rounded-btn bg-canard px-[18px] py-2.5 text-[14px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark"
        >
          {started ? "Reprendre" : "Commencer"}
        </a>
      </article>
    );
  }

  // 3. Fermé (et non terminé par ce participant).
  if (card.ferme) {
    return (
      <article className="flex flex-wrap items-center gap-4 rounded-card border border-hairline bg-toile px-5 py-4">
        <Heading card={card} muted note="Ce QCM est clôturé." />
        <span className="ml-auto rounded-chip bg-surface px-3 py-1.5 font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-faint">
          Fermé
        </span>
      </article>
    );
  }

  // 4. Pas encore ouvert.
  return (
    <article className="flex flex-wrap items-center gap-4 rounded-card border border-hairline bg-toile px-5 py-4">
      <Heading
        card={card}
        muted
        note="Le formateur ouvrira ce QCM en fin de session."
      />
      <span className="ml-auto rounded-chip bg-surface px-3 py-1.5 font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-faint">
        À venir
      </span>
    </article>
  );
}

function Heading({
  card,
  note,
  muted = false,
}: {
  card: ParticipantQcmCard;
  note?: string;
  muted?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-canard">
        Session {card.numeroSession}
      </p>
      <p className={`text-[16px] font-bold ${muted ? "text-slate" : "text-ink"}`}>
        {card.titre}
      </p>
      {note && <p className="mt-0.5 text-[13px] text-soft">{note}</p>}
    </div>
  );
}
