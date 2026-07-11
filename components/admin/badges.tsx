import {
  INSCRIPTION_STATUT_LABELS,
  SESSION_STATUT_LABELS,
  statutLabel,
} from "@/lib/admin-labels";

/**
 * Badges de statut de l'admin, dérivés de la charte (chips mono, comme
 * `BadgeEcume`). Couleurs par statut (CDC §5.3) :
 *  - session : publiée = écume, complète = périwinkle, brouillon = toile,
 *    terminée = gris ;
 *  - inscription : confirmé = écume, liste d'attente = périwinkle, annulé = clay.
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
