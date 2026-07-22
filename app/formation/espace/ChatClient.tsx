"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { postMessageAction } from "@/app/formation/actions";
import {
  type ChatMessage,
  chatAuthorName,
  chatInitials,
  formatChatTime,
  mergeMessage,
} from "@/lib/formation-chat-display";

/**
 * Chat de promotion côté participant (client). Reçoit l'historique rendu côté
 * serveur puis écoute le flux SSE (`espace/stream`) : les nouveaux messages
 * arrivent en direct, dédupliqués par `id`. Les messages postés par soi
 * s'affichent immédiatement (retour de l'action), sans doublon à l'arrivée SSE.
 *
 * Structure visuelle : messages épinglés du formateur en tête (FAQ du mercredi,
 * encart canard distinct), puis le fil chronologique. Le formateur est toujours
 * mis en évidence ; le participant courant est repéré par « Vous ».
 */
export function ChatClient({
  initialMessages,
  currentParticipantId,
  initialCursor,
}: {
  initialMessages: ChatMessage[];
  currentParticipantId: string;
  initialCursor: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Flux SSE : ouvert une fois au montage, curseur initial = dernier message de
  // l'historique. À la reconnexion, EventSource renvoie Last-Event-ID (repris
  // côté serveur), donc le curseur de l'URL ne sert qu'à la première connexion.
  useEffect(() => {
    const url = `/formation/espace/stream?c=${encodeURIComponent(initialCursor)}`;
    const source = new EventSource(url);
    source.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ChatMessage;
        setMessages((prev) => mergeMessage(prev, message));
      } catch {
        // Trame illisible : ignorée (le heartbeat n'est pas un message).
      }
    };
    return () => source.close();
  }, [initialCursor]);

  const pinned = useMemo(
    () => messages.filter((m) => m.epingle),
    [messages],
  );
  const thread = useMemo(
    () => messages.filter((m) => !m.epingle),
    [messages],
  );

  return (
    <div className="space-y-6">
      {pinned.length > 0 && (
        <div className="space-y-2">
          {pinned.map((message) => (
            <PinnedCard
              key={message.id}
              message={message}
              currentParticipantId={currentParticipantId}
            />
          ))}
        </div>
      )}

      <div>
        <p className="mb-3 ml-1 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-soft">
          Fil de la promo
        </p>
        {thread.length === 0 ? (
          <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
            Aucun message pour le moment. Posez votre première question à la
            promo.
          </p>
        ) : (
          <div className="space-y-3.5">
            {thread.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                currentParticipantId={currentParticipantId}
              />
            ))}
          </div>
        )}
      </div>

      <Composer onPosted={(message) => setMessages((prev) => mergeMessage(prev, message))} />
    </div>
  );
}

/* ===== Avatar ========================================================= */

function Avatar({
  message,
  size = "md",
}: {
  message: ChatMessage;
  size?: "md" | "sm";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-[12px]" : "h-10 w-10 text-[13.5px]";
  const tone = message.auteurAdmin
    ? "bg-canard text-white border-transparent"
    : "bg-surface text-canard border-hairline";
  return (
    <span
      aria-hidden
      className={`flex ${dim} flex-none items-center justify-center rounded-full border font-bold ${tone}`}
    >
      {chatInitials(message)}
    </span>
  );
}

/* ===== Bloc « Réponse de Claude » ===================================== */

function ClaudeQuote({ quote }: { quote: string }) {
  return (
    <div className="mt-2 rounded-r-chip border-l-[3px] border-canard bg-[#f5f7f9] px-3.5 py-2.5">
      <p className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-canard">
        Réponse de Claude
      </p>
      <p className="whitespace-pre-wrap text-[14px] leading-[1.55] text-body">
        {quote}
      </p>
    </div>
  );
}

/* ===== Pièce jointe (v1 : nom seul, pas d'upload de fichier) ========== */

function Attachment({ name }: { name: string }) {
  return (
    <div className="mt-2.5 inline-flex items-center gap-2.5 rounded-btn border border-hairline bg-toile px-3 py-2 text-[13px] text-soft">
      <span
        aria-hidden
        className="flex h-[34px] w-[34px] items-center justify-center rounded-btn bg-gradient-to-br from-repere to-quiet text-[15px]"
      >
        🖼️
      </span>
      <span className="leading-[1.35]">
        <strong className="font-semibold text-ink">{name}</strong>
        <br />
        Capture · aperçu non disponible
      </span>
    </div>
  );
}

/* ===== Rôle (badge) =================================================== */

function RoleBadge({ label }: { label: string }) {
  return (
    <span className="rounded-chip bg-toile px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-slate">
      {label}
    </span>
  );
}

/* ===== Bulle de message (fil) ========================================= */

function MessageBubble({
  message,
  currentParticipantId,
}: {
  message: ChatMessage;
  currentParticipantId: string;
}) {
  const name = chatAuthorName(message, currentParticipantId);
  const bubbleTone = message.auteurAdmin
    ? "border-l-4 border-l-canard"
    : "";
  return (
    <div className="flex gap-3">
      <Avatar message={message} />
      <div
        className={`min-w-0 flex-1 rounded-card border border-hairline bg-surface px-[15px] py-3 shadow-card ${bubbleTone}`}
      >
        <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
          <span className="text-[14.5px] font-bold text-ink">{name}</span>
          {message.auteurAdmin && <RoleBadge label="Formateur" />}
          <span className="font-mono text-[12px] text-quiet">
            {formatChatTime(message.createdIso)}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-[14.5px] leading-[1.55] text-body">
          {message.contenu}
        </p>
        {message.claudeQuote && <ClaudeQuote quote={message.claudeQuote} />}
        {message.attachmentName && <Attachment name={message.attachmentName} />}
      </div>
    </div>
  );
}

/* ===== Carte épinglée (FAQ du mercredi / réponse formateur) =========== */

function PinnedCard({
  message,
  currentParticipantId,
}: {
  message: ChatMessage;
  currentParticipantId: string;
}) {
  const name = chatAuthorName(message, currentParticipantId);
  return (
    <article className="rounded-card border border-hairline border-l-4 border-l-canard bg-surface px-[22px] py-[18px] shadow-card">
      <span className="mb-3 inline-flex items-center gap-1.5 rounded-chip bg-canard px-3 py-1.5 text-[12px] font-bold text-white">
        <span aria-hidden>📌</span> FAQ du mercredi · réponse du formateur
      </span>
      <div className="flex items-center gap-3">
        <Avatar message={message} />
        <div>
          <p className="text-[14.5px] font-bold text-ink">{name}</p>
          <p className="font-mono text-[12.5px] text-quiet">
            {formatChatTime(message.createdIso)}
          </p>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-[14.5px] leading-[1.6] text-body">
        {message.contenu}
      </p>
    </article>
  );
}

/* ===== Composer ======================================================= */

const controlClass =
  "w-full rounded-btn border-[1.5px] border-outline bg-surface px-[13px] py-3 text-[15px] text-ink placeholder:text-quiet transition-colors focus:border-canard focus:outline-none focus:ring-2 focus:ring-canard/20";

function Composer({ onPosted }: { onPosted: (message: ChatMessage) => void }) {
  const [contenu, setContenu] = useState("");
  const [claudeQuote, setClaudeQuote] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [showQuote, setShowQuote] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    if (!contenu.trim()) {
      setError("Votre message est vide.");
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.set("contenu", contenu);
    if (showQuote && claudeQuote.trim()) {
      formData.set("claude_quote", claudeQuote);
    }
    if (showAttachment && attachmentName.trim()) {
      formData.set("attachment_name", attachmentName);
    }

    startTransition(async () => {
      const result = await postMessageAction(formData);
      if (result.ok) {
        onPosted(result.message);
        setContenu("");
        setClaudeQuote("");
        setAttachmentName("");
        setShowQuote(false);
        setShowAttachment(false);
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={submit}
      className="sticky bottom-0 rounded-card border border-hairline bg-surface p-3 shadow-[0_-6px_20px_-12px_rgba(16,24,40,.16)]"
    >
      {error && (
        <div
          role="alert"
          className="mb-2.5 rounded-chip bg-[rgba(199,90,77,0.14)] px-3.5 py-2.5 text-[13px] leading-[1.4] text-ink-clay"
        >
          {error}
        </div>
      )}

      <label htmlFor="chat-contenu" className="sr-only">
        Votre message
      </label>
      <textarea
        id="chat-contenu"
        name="contenu"
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Votre question (avec la réponse de Claude) ou un message d'entraide…"
        rows={3}
        maxLength={4000}
        className={`${controlClass} min-h-[62px] resize-y`}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
      />

      {showQuote && (
        <div className="mt-2.5">
          <label
            htmlFor="chat-claude-quote"
            className="mb-1.5 block text-[13px] font-semibold text-ink"
          >
            Réponse de Claude
          </label>
          <textarea
            id="chat-claude-quote"
            name="claude_quote"
            value={claudeQuote}
            onChange={(e) => setClaudeQuote(e.target.value)}
            placeholder="Collez ici la réponse que Claude vous a donnée…"
            rows={3}
            maxLength={8000}
            className={`${controlClass} min-h-[56px] resize-y`}
          />
        </div>
      )}

      {showAttachment && (
        <div className="mt-2.5">
          <label
            htmlFor="chat-attachment"
            className="mb-1.5 block text-[13px] font-semibold text-ink"
          >
            Nom de la capture
          </label>
          <input
            id="chat-attachment"
            name="attachment_name"
            type="text"
            value={attachmentName}
            onChange={(e) => setAttachmentName(e.target.value)}
            placeholder="capture-ecran.png"
            maxLength={200}
            className={controlClass}
          />
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setShowQuote((v) => !v)}
          aria-pressed={showQuote}
          className="inline-flex items-center gap-1.5 rounded-btn border-[1.5px] border-outline bg-surface px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-toile"
        >
          {showQuote ? "− Réponse de Claude" : "+ Coller la réponse de Claude"}
        </button>
        <button
          type="button"
          onClick={() => setShowAttachment((v) => !v)}
          aria-pressed={showAttachment}
          className="inline-flex items-center gap-1.5 rounded-btn border-[1.5px] border-outline bg-surface px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-toile"
        >
          {showAttachment ? "− Capture" : "📎 Nom d'une capture"}
        </button>
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="ml-auto inline-flex items-center justify-center rounded-btn bg-canard px-[18px] py-2.5 text-[14px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Envoi…" : "Envoyer"}
        </button>
      </div>
      <p className="mx-0.5 mt-2 text-[12px] leading-[1.4] text-faint">
        La capture n&apos;est pas encore téléversée : seul son nom est affiché
        dans le fil (v1).
      </p>
      <div ref={endRef} />
    </form>
  );
}
