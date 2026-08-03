import { envoyerRappelsAction } from "@/app/admin/dashboard/actions";
import type { RappelsEtat } from "@/lib/admin-queries";
import { formatDateLongue } from "@/lib/session-display";
import { ConfirmButton } from "./ConfirmButton";

type Variante = "j7" | "j1";

/** Résultat du dernier envoi, transmis en query par l'action. */
export type RappelsResultat = {
  variante: Variante;
  envoyes: number;
  sautes: number;
  echecs: number;
};

const ECHEANCE: Record<Variante, string> = { j7: "J-7", j1: "J-1" };

/**
 * Phrase d'ouverture de l'e-mail qui partira, citée dans la confirmation :
 * l'administrateur valide en sachant exactement ce que l'inscrit va lire, même
 * s'il clique hors de l'échéance exacte.
 */
const ANNONCE: Record<Variante, string> = {
  j7: "Votre formation IA Marssane a lieu dans une semaine",
  j1: "Votre formation IA Marssane a lieu demain",
};

/**
 * Bloc « Rappels » du détail de session (composant serveur). Pour chaque
 * échéance : rappels déjà partis, inscrits confirmés restant à contacter, et
 * bouton d'envoi sous confirmation. L'envoi n'est proposé que pour une session
 * datée, à venir, publiée ou complète, et s'il reste au moins un destinataire.
 */
export function RappelsSession({
  sessionId,
  date,
  statut,
  etat,
  resultat,
}: {
  sessionId: string;
  date: string | null;
  statut: string;
  etat: RappelsEtat;
  resultat?: RappelsResultat;
}) {
  if (!date) {
    return (
      <p className="text-[13.5px] leading-[1.5] text-soft">
        Date à définir — aucun rappel possible.
      </p>
    );
  }

  const ouvert =
    etat.aVenir && (statut === "publiee" || statut === "complete");

  return (
    <div className="space-y-3">
      {resultat && <ResultatBanner resultat={resultat} />}
      <RappelLigne
        sessionId={sessionId}
        variante="j7"
        date={date}
        etat={etat.j7}
        ouvert={ouvert}
      />
      <RappelLigne
        sessionId={sessionId}
        variante="j1"
        date={date}
        etat={etat.j1}
        ouvert={ouvert}
      />
    </div>
  );
}

/** Bandeau de décompte après un envoi (mêmes codes que le bloc formation). */
function ResultatBanner({ resultat }: { resultat: RappelsResultat }) {
  const { variante, envoyes, sautes, echecs } = resultat;
  return (
    <p
      role="status"
      className="rounded-chip bg-ecume px-4 py-2.5 text-[13px] leading-[1.5] text-ink-ecume"
    >
      Rappel {ECHEANCE[variante]} : {envoyes} envoyé{envoyes > 1 ? "s" : ""}
      {sautes ? ` · ${sautes} déjà envoyé(s)` : ""}
      {echecs ? ` · ${echecs} échec(s) d'envoi` : ""}.
    </p>
  );
}

/**
 * Raison affichée à la place du bouton. Appelée uniquement quand l'envoi n'est
 * pas proposé : plus personne à contacter, ou session hors envoi.
 */
function raison(etat: { envoyes: number; enAttente: number }): string {
  if (etat.enAttente === 0) {
    return etat.envoyes > 0
      ? "Tous les inscrits confirmés l'ont reçu."
      : "Aucun inscrit confirmé.";
  }
  return "Session passée ou non publiée : envoi indisponible.";
}

function RappelLigne({
  sessionId,
  variante,
  date,
  etat,
  ouvert,
}: {
  sessionId: string;
  variante: Variante;
  date: string;
  etat: { envoyes: number; enAttente: number };
  ouvert: boolean;
}) {
  const echeance = ECHEANCE[variante];
  const actif = ouvert && etat.enAttente > 0;
  const pluriel = etat.enAttente > 1 ? "s" : "";
  const message =
    `Envoyer le rappel ${echeance} à ${etat.enAttente} destinataire${pluriel} ? ` +
    `L'e-mail annonce « ${ANNONCE[variante]} » et rappelle la session du ` +
    `${formatDateLongue(date)} (horaires, lieu` +
    `${variante === "j7" ? ", prérequis" : ""}). ` +
    `Envoi définitif : un rappel déjà parti ne repart pas.`;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-hairline bg-surface px-5 py-4 shadow-card">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-canard">
        Rappel {echeance}
      </p>
      <p className="font-mono text-[13px] text-faint">
        {etat.envoyes} envoyé{etat.envoyes > 1 ? "s" : ""} ·{" "}
        {etat.enAttente} à contacter
      </p>
      {actif ? (
        <form action={envoyerRappelsAction} className="ml-auto">
          <input type="hidden" name="session_id" value={sessionId} />
          <input type="hidden" name="variante" value={variante} />
          <ConfirmButton
            message={message}
            className="inline-flex items-center rounded-btn bg-canard px-4 py-2 text-[13.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark"
          >
            Envoyer le rappel {echeance} ({etat.enAttente} destinataire
            {pluriel})
          </ConfirmButton>
        </form>
      ) : (
        <p className="ml-auto text-[13px] text-soft">{raison(etat)}</p>
      )}
    </div>
  );
}
