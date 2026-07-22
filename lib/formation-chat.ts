import { getSql } from "./db";
import type { ChatMessage } from "./formation-chat-display";

/**
 * Couche d'accès du chat de promotion (phase 2). SQL paramétré postgres.js
 * uniquement (portabilité, CDC §7.4). Le fil est scindé par `session_id`
 * (promotion) ; l'appelant fournit toujours la session issue de la session
 * participant (cookie) ou de l'admin — jamais d'une entrée client.
 *
 * Toutes les fonctions lèvent si la base est absente/injoignable (getSql) : les
 * appelants rattrapent et dégradent proprement (repli DbUnavailable, flux SSE
 * qui continue à sonder).
 */

/** Curseur de reprise SSE : dernier (created_at, id) déjà transmis. */
export type ChatCursor = { iso: string; id: string };

/** Ligne brute renvoyée par les requêtes (colonnes snake_case + jointures). */
type ChatRow = {
  id: string;
  participant_id: string | null;
  auteur_admin: boolean;
  contenu: string;
  claude_quote: string | null;
  attachment_name: string | null;
  epingle: boolean;
  created_iso: string;
  prenom: string | null;
  nom: string | null;
};

function rowToMessage(row: ChatRow): ChatMessage {
  return {
    id: row.id,
    participantId: row.participant_id,
    auteurAdmin: row.auteur_admin,
    prenom: row.prenom,
    nom: row.nom,
    contenu: row.contenu,
    claudeQuote: row.claude_quote,
    attachmentName: row.attachment_name,
    epingle: row.epingle,
    createdIso: row.created_iso,
  };
}

/**
 * Fragment SELECT partagé : les colonnes du message + l'ISO UTC (curseur/dedup)
 * et le prénom/nom de l'auteur via l'inscription (LEFT JOIN : NULL pour un
 * message formateur ou un auteur effacé).
 */
function selectColumns() {
  const sql = getSql();
  return sql`
    m.id,
    m.participant_id,
    m.auteur_admin,
    m.contenu,
    m.claude_quote,
    m.attachment_name,
    m.epingle,
    to_char(m.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as created_iso,
    i.prenom,
    i.nom
  `;
}

/** Fil complet d'une promotion, ordre chronologique (rendu initial). */
export async function listMessages(sessionId: string): Promise<ChatMessage[]> {
  const sql = getSql();
  const rows = await sql<ChatRow[]>`
    select ${selectColumns()}
    from formation_messages m
    left join participants p on p.id = m.participant_id
    left join inscriptions i on i.id = p.inscription_id
    where m.session_id = ${sessionId}
    order by m.created_at asc, m.id asc
  `;
  return rows.map(rowToMessage);
}

/**
 * Messages postérieurs à un curseur (comparaison de tuple `(created_at, id)`),
 * pour le polling SSE. Curseur `null` = pas de repère → renvoie tout le fil
 * (utilisé uniquement quand la promotion n'avait aucun message à la connexion).
 */
export async function listMessagesSince(
  sessionId: string,
  cursor: ChatCursor | null,
): Promise<ChatMessage[]> {
  const sql = getSql();
  const rows = cursor
    ? await sql<ChatRow[]>`
        select ${selectColumns()}
        from formation_messages m
        left join participants p on p.id = m.participant_id
        left join inscriptions i on i.id = p.inscription_id
        where m.session_id = ${sessionId}
          and (m.created_at, m.id) > (${cursor.iso}::timestamptz, ${cursor.id}::uuid)
        order by m.created_at asc, m.id asc
      `
    : await sql<ChatRow[]>`
        select ${selectColumns()}
        from formation_messages m
        left join participants p on p.id = m.participant_id
        left join inscriptions i on i.id = p.inscription_id
        where m.session_id = ${sessionId}
        order by m.created_at asc, m.id asc
      `;
  return rows.map(rowToMessage);
}

/** Curseur du dernier message d'une promotion, ou `null` si le fil est vide. */
export async function latestCursor(
  sessionId: string,
): Promise<ChatCursor | null> {
  const sql = getSql();
  const rows = await sql<{ iso: string; id: string }[]>`
    select
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as iso,
      id
    from formation_messages
    where session_id = ${sessionId}
    order by created_at desc, id desc
    limit 1
  `;
  return rows[0] ?? null;
}

/**
 * Insère un message de participant et renvoie le message complet (avec l'auteur
 * joint) en un aller-retour, pour l'affichage optimiste côté client. La session
 * est celle du participant (cookie) : jamais fournie par le formulaire.
 */
export async function insertParticipantMessage(args: {
  sessionId: string;
  participantId: string;
  contenu: string;
  claudeQuote: string | null;
  attachmentName: string | null;
}): Promise<ChatMessage> {
  const sql = getSql();
  const rows = await sql<ChatRow[]>`
    with ins as (
      insert into formation_messages
        (session_id, participant_id, contenu, claude_quote, attachment_name)
      values (
        ${args.sessionId},
        ${args.participantId},
        ${args.contenu},
        ${args.claudeQuote},
        ${args.attachmentName}
      )
      returning
        id, participant_id, auteur_admin, contenu, claude_quote,
        attachment_name, epingle, created_at
    )
    select
      ins.id,
      ins.participant_id,
      ins.auteur_admin,
      ins.contenu,
      ins.claude_quote,
      ins.attachment_name,
      ins.epingle,
      to_char(ins.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as created_iso,
      i.prenom,
      i.nom
    from ins
    left join participants p on p.id = ins.participant_id
    left join inscriptions i on i.id = p.inscription_id
  `;
  return rowToMessage(rows[0]);
}

/**
 * Insère un message du formateur (auteur_admin), éventuellement épinglé (FAQ du
 * mercredi). Renvoie l'id créé.
 */
export async function insertAdminMessage(args: {
  sessionId: string;
  contenu: string;
  epingle: boolean;
}): Promise<string> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    insert into formation_messages
      (session_id, participant_id, auteur_admin, contenu, epingle)
    values (${args.sessionId}, null, true, ${args.contenu}, ${args.epingle})
    returning id
  `;
  return rows[0].id;
}

/**
 * Épingle/dépingle un message du formateur. Restreint aux messages `auteur_admin`
 * de la session visée (un message de participant ne peut pas être épinglé).
 */
export async function setMessagePinned(args: {
  messageId: string;
  sessionId: string;
  epingle: boolean;
}): Promise<void> {
  const sql = getSql();
  await sql`
    update formation_messages
    set epingle = ${args.epingle}
    where id = ${args.messageId}
      and session_id = ${args.sessionId}
      and auteur_admin = true
  `;
}
