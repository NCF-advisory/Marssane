import {
  postAdminMessageAction,
  togglePinMessageAction,
} from "@/app/admin/dashboard/actions";
import {
  type ChatMessage,
  chatAuthorName,
  chatInitials,
  formatChatTime,
} from "@/lib/formation-chat-display";

/**
 * Chat de la promotion côté formateur (admin) : lecture du fil + formulaire de
 * réponse (avec option « Épingler en tête / FAQ du mercredi »), et bascule
 * épingler/dépingler sur chaque message du formateur. Pas de SSE ici : le
 * rechargement (revalidation) suffit. Composant serveur, formulaires branchés
 * sur les server actions admin (`requireAdmin`).
 *
 * `chatAuthorName` reçoit un id participant vide : côté admin, aucun message
 * n'est « Vous » ; les messages du formateur s'affichent « Formateur ».
 */
export function FormationChat({
  messages,
  sessionId,
}: {
  messages: ChatMessage[];
  sessionId: string;
}) {
  return (
    <div className="space-y-6">
      {/* Fil (lecture). */}
      {messages.length === 0 ? (
        <p className="rounded-card border border-hairline bg-surface px-5 py-6 text-[14px] text-soft">
          Aucun message dans le chat de cette promotion pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              sessionId={sessionId}
            />
          ))}
        </ul>
      )}

      {/* Réponse du formateur. */}
      <form
        action={postAdminMessageAction}
        className="space-y-3 rounded-card border border-hairline bg-surface p-4 shadow-card"
      >
        <input type="hidden" name="session_id" value={sessionId} />
        <label
          htmlFor="admin-chat-contenu"
          className="block text-[13.5px] font-semibold text-ink"
        >
          Répondre à la promotion
        </label>
        <textarea
          id="admin-chat-contenu"
          name="contenu"
          required
          rows={4}
          maxLength={4000}
          placeholder="Réponse groupée aux questions de la semaine…"
          className="w-full resize-y rounded-btn border-[1.5px] border-outline bg-surface px-[14px] py-3 text-[15px] text-ink placeholder:text-quiet transition-colors focus:border-canard focus:outline-none focus:ring-2 focus:ring-canard/20"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-[13.5px] text-body">
            <input
              type="checkbox"
              name="epingle"
              className="h-4 w-4 rounded-[3px] border-outline text-canard focus:ring-canard/30"
            />
            Épingler en tête (FAQ du mercredi)
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-btn bg-canard px-[22px] py-2.5 text-[14px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark"
          >
            Publier la réponse
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageItem({
  message,
  sessionId,
}: {
  message: ChatMessage;
  sessionId: string;
}) {
  const name = chatAuthorName(message, "");
  return (
    <li
      className={`rounded-card border border-hairline bg-surface px-4 py-3 shadow-card ${
        message.auteurAdmin ? "border-l-4 border-l-canard" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border text-[12.5px] font-bold ${
            message.auteurAdmin
              ? "border-transparent bg-canard text-white"
              : "border-hairline bg-surface text-canard"
          }`}
        >
          {chatInitials(message)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[14px] font-bold text-ink">{name}</span>
            {message.auteurAdmin && (
              <span className="rounded-chip bg-toile px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-slate">
                Formateur
              </span>
            )}
            {message.epingle && (
              <span className="rounded-chip bg-canard px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-white">
                Épinglé
              </span>
            )}
            <span className="font-mono text-[12px] text-quiet">
              {formatChatTime(message.createdIso)}
            </span>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-[14px] leading-[1.55] text-body">
            {message.contenu}
          </p>
          {message.claudeQuote && (
            <div className="mt-2 rounded-r-chip border-l-[3px] border-canard bg-[#f5f7f9] px-3 py-2">
              <p className="mb-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-canard">
                Réponse de Claude
              </p>
              <p className="whitespace-pre-wrap text-[13.5px] leading-[1.5] text-body">
                {message.claudeQuote}
              </p>
            </div>
          )}
          {message.attachmentName && (
            <p className="mt-2 font-mono text-[12.5px] text-soft">
              📎 {message.attachmentName}{" "}
              <span className="text-faint">(nom seul, v1)</span>
            </p>
          )}
          {message.auteurAdmin && (
            <form action={togglePinMessageAction} className="mt-2">
              <input type="hidden" name="session_id" value={sessionId} />
              <input type="hidden" name="message_id" value={message.id} />
              <input
                type="hidden"
                name="epingle"
                value={message.epingle ? "false" : "true"}
              />
              <button
                type="submit"
                className="rounded-btn px-2.5 py-1.5 font-mono text-[12px] font-medium text-canard transition-colors hover:bg-toile"
              >
                {message.epingle ? "Dépingler" : "Épingler en tête"}
              </button>
            </form>
          )}
        </div>
      </div>
    </li>
  );
}
