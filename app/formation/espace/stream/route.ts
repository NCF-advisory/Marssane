import type { NextRequest } from "next/server";
import {
  type ChatCursor,
  latestCursor,
  listMessagesSince,
} from "@/lib/formation-chat";
import { getCurrentParticipant } from "@/lib/participant-auth";

/**
 * Flux temps réel du chat de promotion (Server-Sent Events).
 *
 * Portable (Postgres standard, aucune API propriétaire) : on sonde la table
 * `formation_messages` toutes les ~2 s à partir d'un curseur `(created_at, id)`
 * et on pousse les nouveaux messages en événements SSE. Un commentaire
 * heartbeat toutes les ~15 s garde la connexion vivante ; le flux se termine
 * proprement vers ~55 s (limite runtime serverless) — le client EventSource se
 * reconnecte et reprend via `Last-Event-ID` (aucun doublon, dédup par id).
 *
 * Scoping : la promotion est celle de la session participant (cookie). Aucune
 * entrée client ne choisit la session — pas de fuite d'une autre promo.
 *
 * Runtime nodejs (client postgres). Jamais mis en cache.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Intervalle de polling de la base (ms). */
const POLL_MS = 2000;
/** Intervalle de heartbeat (commentaire SSE), ms. */
const HEARTBEAT_MS = 15000;
/** Durée de vie max du flux avant fermeture propre (ms). */
const MAX_LIFETIME_MS = 55000;

/** Décode un curseur « <iso>~<id> » (Last-Event-ID ou query `c`). `null` si invalide. */
function parseCursor(raw: string | null): ChatCursor | null {
  if (!raw) return null;
  const sep = raw.lastIndexOf("~");
  if (sep <= 0) return null;
  const iso = raw.slice(0, sep);
  const id = raw.slice(sep + 1);
  if (!iso || !id) return null;
  return { iso, id };
}

export async function GET(request: NextRequest) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return new Response("Authentification requise.", { status: 401 });
  }
  const sessionId = participant.sessionId;

  // Reprise : Last-Event-ID (reconnexion navigateur) prioritaire, sinon query
  // `c` (connexion initiale, curseur du dernier message de l'historique rendu).
  let cursor =
    parseCursor(request.headers.get("last-event-id")) ??
    parseCursor(request.nextUrl.searchParams.get("c"));

  // Aucun curseur fourni : on part du dernier message existant pour ne pas
  // renvoyer tout l'historique (que le client possède déjà). `null` = fil vide.
  if (!cursor) {
    try {
      cursor = await latestCursor(sessionId);
    } catch {
      cursor = null;
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      let polling = false;
      const timers: ReturnType<typeof setInterval>[] = [];

      const enqueue = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          // Contrôleur déjà fermé (course avec l'abort) : on ignore.
        }
      };

      const cleanup = () => {
        if (closed) return;
        closed = true;
        for (const timer of timers) clearInterval(timer);
        request.signal.removeEventListener("abort", cleanup);
        try {
          controller.close();
        } catch {
          // Déjà fermé.
        }
      };

      const tick = async () => {
        if (closed || polling) return;
        polling = true;
        try {
          const messages = await listMessagesSince(sessionId, cursor);
          for (const message of messages) {
            enqueue(`id: ${message.createdIso}~${message.id}\n`);
            enqueue(`data: ${JSON.stringify(message)}\n\n`);
            cursor = { iso: message.createdIso, id: message.id };
          }
        } catch {
          // Base momentanément injoignable : on garde le flux ouvert et on
          // retentera au prochain tick (pas de bruit de log par itération).
        } finally {
          polling = false;
        }
      };

      // Hint de reconnexion, puis premier passage immédiat.
      enqueue("retry: 3000\n\n");
      void tick();

      // clearInterval accepte aussi les handles de setTimeout : on regroupe les
      // trois minuteurs (polling, heartbeat, fin de vie) pour un nettoyage unique.
      timers.push(setInterval(() => void tick(), POLL_MS));
      timers.push(setInterval(() => enqueue(": ping\n\n"), HEARTBEAT_MS));
      timers.push(setTimeout(cleanup, MAX_LIFETIME_MS));
      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
    },
  });
}
