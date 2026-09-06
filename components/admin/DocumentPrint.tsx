import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { formatEuros } from "@/lib/crm-display";
import type { EmetteurRow, LigneRow } from "@/lib/facturation";
import { formatDateLongue } from "@/lib/session-display";

/**
 * Gabarit imprimable d'un devis, d'une facture ou d'un avoir (Lot 2, cadrage
 * §4.C), dans la charte Marssane. Rendu sur fond blanc, pensé pour l'export
 * PDF via le dialogue d'impression du navigateur (PrintButton).
 *
 * Les mentions légales dépendent du régime de TVA des paramètres ; les
 * pénalités de retard et l'indemnité de recouvrement (mentions obligatoires
 * B2B) ne figurent que sur les factures et avoirs.
 */

/** Données communes aux trois types de document. */
export type DocumentPrintProps = {
  titre: "Devis" | "Facture" | "Avoir";
  numero: string | null;
  objet: string | null;
  date_emission: string | null;
  /** Libellé + date de la seconde échéance (validité ou paiement). */
  echeance?: { label: string; date: string | null };
  /** Référence croisée (« Annule la facture FA-… », « Selon devis DE-… »). */
  reference?: string | null;
  emetteur: EmetteurRow | null;
  client: {
    nom: string | null;
    siren: string | null;
    adresse: string | null;
    code_postal: string | null;
    ville: string | null;
  };
  lignes: LigneRow[];
  montant_ht: string;
  montant_tva: string;
  montant_ttc: string;
  /** Total déjà encaissé (factures uniquement). */
  paye?: string;
};

/** Mention de TVA selon le régime des paramètres. */
function mentionTva(regime: string | null): string | null {
  if (regime === "exoneration_formation") {
    return "TVA non applicable — article 261-4-4°a du CGI (formation professionnelle continue).";
  }
  if (regime === "franchise_base") {
    return "TVA non applicable — article 293 B du CGI.";
  }
  return null;
}

const CELL = "px-3 py-2.5 text-[13px] leading-[1.45] text-body";

export function DocumentPrint(props: DocumentPrintProps) {
  const { emetteur, client } = props;
  const tvaNulle = Number(props.montant_tva) === 0;
  const mention = mentionTva(emetteur?.regime_tva ?? null);
  const resteDu =
    props.paye !== undefined
      ? Math.round((Number(props.montant_ttc) - Number(props.paye)) * 100) / 100
      : null;

  return (
    <div className="mx-auto w-full max-w-[794px] bg-white px-12 py-12 text-ink">
      {/* En-tete : lockup + type de document */}
      <div className="flex items-start justify-between">
        <LogoMarssane size={30} withWordmark />
        <div className="text-right">
          <p className="font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-soft">
            {props.titre}
          </p>
          <p className="mt-1 font-mono text-[18px] font-semibold tracking-[-0.01em]">
            {props.numero ?? "Brouillon — sans valeur"}
          </p>
        </div>
      </div>

      {/* Emetteur / client */}
      <div className="mt-10 flex items-start justify-between gap-8">
        <div className="text-[12.5px] leading-[1.55] text-body">
          <p className="font-semibold text-ink">
            {emetteur?.raison_sociale ?? "[ÉMETTEUR À RENSEIGNER]"}
          </p>
          {(emetteur?.forme_juridique || emetteur?.capital) && (
            <p>
              {[
                emetteur?.forme_juridique,
                emetteur?.capital ? `au capital de ${emetteur.capital}` : null,
              ]
                .filter(Boolean)
                .join(" ")}
            </p>
          )}
          {emetteur?.adresse && <p>{emetteur.adresse}</p>}
          {(emetteur?.code_postal || emetteur?.ville) && (
            <p>
              {[emetteur?.code_postal, emetteur?.ville]
                .filter(Boolean)
                .join(" ")}
            </p>
          )}
          {emetteur?.siren && <p>SIREN {emetteur.siren}</p>}
          {emetteur?.tva_intra && <p>TVA {emetteur.tva_intra}</p>}
          {emetteur?.email && <p>{emetteur.email}</p>}
          {emetteur?.telephone && <p>{emetteur.telephone}</p>}
        </div>
        <div className="min-w-[220px] rounded-card border border-hairline bg-toile px-5 py-4 text-[12.5px] leading-[1.55] text-body">
          <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-quiet">
            Client
          </p>
          <p className="mt-1.5 font-semibold text-ink">
            {client.nom ?? "[CLIENT]"}
          </p>
          {client.adresse && <p>{client.adresse}</p>}
          {(client.code_postal || client.ville) && (
            <p>
              {[client.code_postal, client.ville].filter(Boolean).join(" ")}
            </p>
          )}
          {client.siren && <p>SIREN {client.siren}</p>}
        </div>
      </div>

      {/* Meta */}
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-1.5 text-[12.5px] text-body">
        <span>
          Date d&apos;émission :{" "}
          <span className="font-semibold text-ink">
            {props.date_emission
              ? formatDateLongue(props.date_emission)
              : "—"}
          </span>
        </span>
        {props.echeance && (
          <span>
            {props.echeance.label} :{" "}
            <span className="font-semibold text-ink">
              {props.echeance.date
                ? formatDateLongue(props.echeance.date)
                : "—"}
            </span>
          </span>
        )}
        {props.reference && <span>{props.reference}</span>}
      </div>

      {props.objet && (
        <p className="mt-4 text-[14px] font-semibold text-ink">
          Objet : {props.objet}
        </p>
      )}

      {/* Lignes */}
      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="border-b-[1.5px] border-ink">
            <th className="px-3 py-2 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-soft">
              Désignation
            </th>
            <th className="px-3 py-2 text-right font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-soft">
              Qté
            </th>
            <th className="px-3 py-2 text-right font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-soft">
              PU HT
            </th>
            {!tvaNulle && (
              <th className="px-3 py-2 text-right font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-soft">
                TVA
              </th>
            )}
            <th className="px-3 py-2 text-right font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-soft">
              Total HT
            </th>
          </tr>
        </thead>
        <tbody>
          {props.lignes.map((l) => (
            <tr key={l.id} className="border-b border-hairline">
              <td className={CELL}>{l.designation}</td>
              <td className={`${CELL} whitespace-nowrap text-right font-mono`}>
                {Number(l.quantite)}
              </td>
              <td className={`${CELL} whitespace-nowrap text-right font-mono`}>
                {formatEuros(l.prix_unitaire_ht)}
              </td>
              {!tvaNulle && (
                <td className={`${CELL} whitespace-nowrap text-right font-mono`}>
                  {Number(l.tva_pct)} %
                </td>
              )}
              <td className={`${CELL} whitespace-nowrap text-right font-mono`}>
                {formatEuros(Number(l.quantite) * Number(l.prix_unitaire_ht))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totaux */}
      <div className="mt-5 flex justify-end">
        <div className="w-[260px] space-y-1.5 text-[13.5px]">
          <div className="flex justify-between text-body">
            <span>Total HT</span>
            <span className="font-mono">{formatEuros(props.montant_ht)}</span>
          </div>
          {!tvaNulle && (
            <div className="flex justify-between text-body">
              <span>TVA</span>
              <span className="font-mono">{formatEuros(props.montant_tva)}</span>
            </div>
          )}
          <div className="flex justify-between border-t-[1.5px] border-ink pt-2 text-[15px] font-bold text-ink">
            <span>Total TTC</span>
            <span className="font-mono">{formatEuros(props.montant_ttc)}</span>
          </div>
          {props.paye !== undefined && Number(props.paye) > 0 && (
            <>
              <div className="flex justify-between text-body">
                <span>Réglé</span>
                <span className="font-mono">{formatEuros(props.paye)}</span>
              </div>
              <div className="flex justify-between font-semibold text-ink">
                <span>Reste dû</span>
                <span className="font-mono">{formatEuros(resteDu)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mentions */}
      <div className="mt-12 space-y-1.5 border-t border-hairline pt-4 text-[10.5px] leading-[1.6] text-soft">
        {mention && <p>{mention}</p>}
        {(props.titre === "Facture" || props.titre === "Avoir") && (
          <p>
            Pénalités de retard : trois fois le taux d&apos;intérêt légal.
            Indemnité forfaitaire pour frais de recouvrement : 40 €. Pas
            d&apos;escompte pour paiement anticipé.
          </p>
        )}
        {emetteur?.iban && (
          <p>
            Règlement par virement : IBAN {emetteur.iban}
            {emetteur.bic ? ` · BIC ${emetteur.bic}` : ""}
          </p>
        )}
        {emetteur?.mentions_complementaires && (
          <p className="whitespace-pre-wrap">
            {emetteur.mentions_complementaires}
          </p>
        )}
      </div>
    </div>
  );
}
