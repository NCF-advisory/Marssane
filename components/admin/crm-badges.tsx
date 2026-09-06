import { ETAPE_LABELS, FACTURE_STATUT_LABELS } from "@/lib/crm";
import { DEVIS_STATUT_LABELS } from "@/lib/facturation";

/**
 * Badges du module CRM et de la facturation (ERP · Lot 1), même anatomie que
 * les chips de l'admin (components/admin/badges.tsx) et couleurs de la
 * maquette validée le 23/08/2026 :
 *  - étape : contact = toile, échange = périwinkle, proposition = écume,
 *    gagnée = écume, perdue = gris ;
 *  - facture : brouillon = toile, émise = périwinkle, payée = écume,
 *    en retard / annulée = clay.
 */

const CHIP =
  "inline-flex items-center rounded-chip px-[9px] py-[4px] font-mono text-[10.5px] font-medium uppercase tracking-[0.1em]";

const ETAPE_TONE: Record<string, string> = {
  contact: "border border-outline bg-toile text-body",
  echange: "bg-periwinkle text-ink-periwinkle",
  proposition: "bg-ecume text-ink-ecume",
  gagnee: "bg-ecume text-ink-ecume",
  perdue: "bg-bar-track text-muted",
};

/** Chip d'étape du pipeline. */
export function EtapeBadge({ etape }: { etape: string }) {
  const tone = ETAPE_TONE[etape] ?? "border border-outline bg-toile text-body";
  return <span className={`${CHIP} ${tone}`}>{ETAPE_LABELS[etape] ?? etape}</span>;
}

const FACTURE_TONE: Record<string, string> = {
  brouillon: "border border-outline bg-toile text-body",
  emise: "bg-periwinkle text-ink-periwinkle",
  payee: "bg-ecume text-ink-ecume",
  en_retard: "bg-[rgba(199,90,77,0.14)] text-ink-clay",
  annulee: "bg-[rgba(199,90,77,0.14)] text-ink-clay",
};

/** Chip de statut de facture. */
export function FactureStatutBadge({ statut }: { statut: string }) {
  const tone =
    FACTURE_TONE[statut] ?? "border border-outline bg-toile text-body";
  return (
    <span className={`${CHIP} ${tone}`}>
      {FACTURE_STATUT_LABELS[statut] ?? statut}
    </span>
  );
}

const DEVIS_TONE: Record<string, string> = {
  brouillon: "border border-outline bg-toile text-body",
  envoye: "bg-periwinkle text-ink-periwinkle",
  accepte: "bg-ecume text-ink-ecume",
  refuse: "bg-[rgba(199,90,77,0.14)] text-ink-clay",
  expire: "bg-[rgba(199,90,77,0.14)] text-ink-clay",
};

/** Chip de statut de devis (statut effectif, `expire` inclus). */
export function DevisStatutBadge({ statut }: { statut: string }) {
  const tone = DEVIS_TONE[statut] ?? "border border-outline bg-toile text-body";
  return (
    <span className={`${CHIP} ${tone}`}>
      {DEVIS_STATUT_LABELS[statut] ?? statut}
    </span>
  );
}

/**
 * Chip d'échéance de relance : clay si en retard, écume si aujourd'hui,
 * neutre sinon. `libelle` est produit par `libelleRelance` (lib/crm-display).
 */
export function RelanceBadge({
  libelle,
  enRetard,
}: {
  libelle: string;
  enRetard: boolean;
}) {
  const tone = enRetard
    ? "bg-[rgba(199,90,77,0.14)] text-ink-clay"
    : libelle === "Aujourd'hui"
      ? "bg-ecume text-ink-ecume"
      : "border border-outline bg-toile text-body";
  return <span className={`${CHIP} ${tone}`}>{libelle}</span>;
}
