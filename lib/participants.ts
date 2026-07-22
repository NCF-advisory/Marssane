import { createHash, randomBytes } from "node:crypto";
import { getSql } from "./db";

/**
 * Couche d'accès de l'espace formation — phase 1 (participants + invitations).
 * SQL paramétré postgres.js uniquement (portabilité, CDC §7.4). Aucune donnée
 * personnelle n'est journalisée ici.
 *
 * Toutes les fonctions lèvent si `DATABASE_URL` est absent ou la base
 * injoignable (getSql) : les appelants rattrapent et dégradent proprement.
 */

/** Durée de validité d'un lien d'invitation : 14 jours. */
export const INVITE_EXPIRY_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Génère un token d'invitation aléatoire fort (32 octets, base64url) et son
 * empreinte SHA-256. Seule l'empreinte est stockée en base ; le token en clair
 * ne circule que dans le lien d'e-mail (jamais journalisé).
 */
export function generateInviteToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashInviteToken(token) };
}

/** Empreinte SHA-256 (hex) d'un token d'invitation. */
export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Participant tel que résolu au login (email + hash + état d'activation). */
export type ParticipantForLogin = {
  id: string;
  email: string;
  session_id: string;
  password_hash: string | null;
};

/**
 * Recherche un participant par email (insensible à la casse). Si l'email existe
 * sur plusieurs promotions, on privilégie un compte activé puis le plus récent.
 * Retourne `null` si aucun.
 */
export async function findParticipantByEmail(
  email: string,
): Promise<ParticipantForLogin | null> {
  const sql = getSql();
  const rows = await sql<ParticipantForLogin[]>`
    select id, email, session_id, password_hash
    from participants
    where lower(email) = ${email}
    order by (password_hash is not null) desc, created_at desc
    limit 1
  `;
  return rows[0] ?? null;
}

/** Participant résolu depuis un token d'invitation (page d'activation). */
export type ParticipantForActivation = {
  id: string;
  email: string;
  session_id: string;
  activated_at: string | null;
  invite_expires_at: string | null;
};

/**
 * Recherche un participant par empreinte de token d'invitation. Retourne `null`
 * si aucun ne correspond (token inconnu / déjà invalidé après activation).
 */
export async function findParticipantByInviteHash(
  tokenHash: string,
): Promise<ParticipantForActivation | null> {
  const sql = getSql();
  const rows = await sql<ParticipantForActivation[]>`
    select id, email, session_id, activated_at, invite_expires_at
    from participants
    where invite_token_hash = ${tokenHash}
    limit 1
  `;
  return rows[0] ?? null;
}

/**
 * Active un compte participant : pose le hash de mot de passe + activated_at et
 * invalide le token d'invitation. Conditionnée (clause WHERE) à un compte non
 * encore activé et un token non expiré, afin de rester correcte même en cas
 * d'appel concurrent. Retourne l'id + session du participant, ou `null` si la
 * condition n'est pas remplie (déjà activé, expiré, introuvable).
 */
export async function activateParticipant(
  tokenHash: string,
  passwordHash: string,
): Promise<{ id: string; email: string; session_id: string } | null> {
  const sql = getSql();
  const rows = await sql<{ id: string; email: string; session_id: string }[]>`
    update participants set
      password_hash = ${passwordHash},
      activated_at = now(),
      invite_token_hash = null,
      invite_expires_at = null
    where invite_token_hash = ${tokenHash}
      and password_hash is null
      and (invite_expires_at is null or invite_expires_at > now())
    returning id, email, session_id
  `;
  return rows[0] ?? null;
}

/** Participant + promotion, pour l'en-tête de l'espace (prénom + dates). */
export type ParticipantEspace = {
  prenom: string;
  email: string;
  session_date: string;
  session_lieu: string | null;
  session_heure_debut: string | null;
  session_heure_fin: string | null;
};

/**
 * Charge le participant (prénom via l'inscription) et sa promotion (dates/lieu),
 * pour le rendu de /formation/espace. Retourne `null` si l'id est inconnu.
 */
export async function getParticipantEspace(
  participantId: string,
): Promise<ParticipantEspace | null> {
  const sql = getSql();
  const rows = await sql<ParticipantEspace[]>`
    select
      i.prenom,
      p.email,
      to_char(s.date, 'YYYY-MM-DD') as session_date,
      s.lieu as session_lieu,
      to_char(s.heure_debut, 'HH24:MI') as session_heure_debut,
      to_char(s.heure_fin, 'HH24:MI') as session_heure_fin
    from participants p
    join inscriptions i on i.id = p.inscription_id
    join sessions s on s.id = p.session_id
    where p.id = ${participantId}
    limit 1
  `;
  return rows[0] ?? null;
}

/* ===== Invitations (côté admin) ======================================= */

/**
 * Ligne « inscrit confirmé » d'une promotion, avec l'état de son invitation à
 * l'espace formation (le cas échéant). Alimente la vue « Lancer la formation ».
 */
export type ParticipantInviteRow = {
  inscription_id: string;
  prenom: string;
  nom: string;
  email: string;
  participant_id: string | null;
  invited_at: string | null;
  activated_at: string | null;
};

/**
 * Inscrits confirmés d'une session, avec l'état d'invitation joint (LEFT JOIN
 * participants). Triés par nom pour un affichage stable.
 */
export async function listConfirmedForInvite(
  sessionId: string,
): Promise<ParticipantInviteRow[]> {
  const sql = getSql();
  return sql<ParticipantInviteRow[]>`
    select
      i.id as inscription_id,
      i.prenom,
      i.nom,
      i.email,
      p.id as participant_id,
      to_char(p.invited_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI') as invited_at,
      to_char(p.activated_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI') as activated_at
    from inscriptions i
    left join participants p on p.inscription_id = i.id
    where i.session_id = ${sessionId} and i.statut = 'confirme'
    order by i.nom asc, i.prenom asc
  `;
}

/** Un inscrit confirmé sans participant, à inviter (données pour l'e-mail). */
export type PendingInvite = {
  inscription_id: string;
  prenom: string;
  email: string;
};

/**
 * Liste des inscrits confirmés d'une session n'ayant pas encore de participant
 * (donc à inviter lors du lancement de la formation).
 */
export async function listPendingInvites(
  sessionId: string,
): Promise<PendingInvite[]> {
  const sql = getSql();
  return sql<PendingInvite[]>`
    select i.id as inscription_id, i.prenom, i.email
    from inscriptions i
    left join participants p on p.inscription_id = i.id
    where i.session_id = ${sessionId}
      and i.statut = 'confirme'
      and p.id is null
    order by i.nom asc, i.prenom asc
  `;
}

/**
 * Crée un participant en attente d'activation pour un inscrit (token déjà
 * généré, seule l'empreinte est stockée). Idempotent : ignore silencieusement
 * si l'inscription a déjà un participant (contrainte unique inscription_id).
 * Retourne l'id créé, ou `null` si un participant existait déjà.
 */
export async function createParticipantInvite(args: {
  inscriptionId: string;
  sessionId: string;
  email: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<string | null> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    insert into participants
      (inscription_id, session_id, email, invite_token_hash, invite_expires_at, invited_at)
    values (
      ${args.inscriptionId},
      ${args.sessionId},
      ${args.email},
      ${args.tokenHash},
      ${args.expiresAt},
      now()
    )
    on conflict (inscription_id) do nothing
    returning id
  `;
  return rows[0]?.id ?? null;
}

/** Participant à ré-inviter (données pour l'e-mail de renvoi). */
export type ResendTarget = { prenom: string; email: string };

/**
 * Régénère le token d'invitation d'un participant non encore activé (renvoi de
 * l'e-mail). Retourne le prénom + l'email pour l'envoi, ou `null` si le
 * participant est introuvable ou déjà activé.
 */
export async function refreshParticipantInvite(args: {
  participantId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<ResendTarget | null> {
  const sql = getSql();
  const rows = await sql<ResendTarget[]>`
    update participants p set
      invite_token_hash = ${args.tokenHash},
      invite_expires_at = ${args.expiresAt},
      invited_at = now()
    from inscriptions i
    where p.id = ${args.participantId}
      and p.inscription_id = i.id
      and p.password_hash is null
    returning i.prenom as prenom, p.email as email
  `;
  return rows[0] ?? null;
}
