import {
  EMAIL_STATUT_LABELS,
  INSCRIPTION_STATUT_LABELS,
  SESSION_STATUT_LABELS,
  statutLabel,
} from "@/lib/admin-labels";

/**
 * Badges de statut de l'admin, dérivés de la charte (chips mono, comme
 * `BadgeEcume`). Couleurs par statut (CDC §5.3) :
 *  - session : publiée = écume, complète = périwinkle, brouillon = toile,
 *    terminée = gris ;
 *  - inscription : confirmé = écume, liste d'attente = périwinkle, annulé = clay ;
 *  - email : délivré = écume, différé = périwinkle, envoyé = toile (accepté par
 *    Resend mais réception non confirmée), rebond / plainte / échec = clay.
 */

const CHIP =
  "inline-flex items-center rounded-chip px-[9px] py-[4px] font-mono text-[10.5px] font-medium uppercase tracking-[0.1em]";

const SESSION_TONE: Record<string, string> = {
  publiee: "bg-ecume text-ink-ecume",
  complete: "bg-periwinkle text-ink-periwinkle",
  brouillon: "border border-outline bg-toile text-body",
  terminee: "bg-bar-track text-muted",
};

const INSCRIPTION_TONE: Record<string, string> = {
  confirme: "bg-ecume text-ink-ecume",
  attente: "bg-periwinkle text-ink-periwinkle",
  annule: "bg-[rgba(199,90,77,0.14)] text-ink-clay",
};

export function SessionStatutBadge({ statut }: { statut: string }) {
  const tone = SESSION_TONE[statut] ?? "border border-outline bg-toile text-body";
  return (
    <span className={`${CHIP} ${tone}`}>
      {statutLabel(SESSION_STATUT_LABELS, statut)}
    </span>
  );
}

export function InscriptionStatutBadge({ statut }: { statut: string }) {
  const tone =
    INSCRIPTION_TONE[statut] ?? "border border-outline bg-toile text-body";
  return (
    <span className={`${CHIP} ${tone}`}>
      {statutLabel(INSCRIPTION_STATUT_LABELS, statut)}
    </span>
  );
}

const EMAIL_TONE: Record<string, string> = {
  envoye: "border border-outline bg-toile text-body",
  delivre: "bg-ecume text-ink-ecume",
  differe: "bg-periwinkle text-ink-periwinkle",
  rebond: "bg-[rgba(199,90,77,0.14)] text-ink-clay",
  plainte: "bg-[rgba(199,90,77,0.14)] text-ink-clay",
  echec: "bg-[rgba(199,90,77,0.14)] text-ink-clay",
};

/**
 * Statut du dernier email destiné à un inscrit. `null` = aucun email tracé
 * (inscription antérieure à la traçabilité) : tiret, pas de badge.
 */
export function EmailStatutBadge({ statut }: { statut: string | null }) {
  if (!statut) return <span className="text-faint">—</span>;
  const tone = EMAIL_TONE[statut] ?? "border border-outline bg-toile text-body";
  return (
    <span className={`${CHIP} ${tone}`}>
      {statutLabel(EMAIL_STATUT_LABELS, statut)}
    </span>
  );
}

/** État d'une demande de contact : traité = écume, à traiter = périwinkle. */
export function ContactTraiteBadge({ traite }: { traite: boolean }) {
  const tone = traite
    ? "bg-ecume text-ink-ecume"
    : "bg-periwinkle text-ink-periwinkle";
  return <span className={`${CHIP} ${tone}`}>{traite ? "Traité" : "À traiter"}</span>;
}
