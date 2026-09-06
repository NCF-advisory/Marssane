"use client";

import { useActionState, useMemo, useState } from "react";
import type { DocumentFormState } from "@/app/admin/dashboard/facturation/actions";
import { controlClass, Field, selectClass } from "@/components/ui/Field";
import { formatEuros } from "@/lib/crm-display";
import type { OrganisationChoix } from "@/lib/facturation";

const initialState: DocumentFormState = { status: "idle" };

/** Ligne en cours de saisie (chaînes : ce sont des champs contrôlés). */
type LigneSaisie = {
  designation: string;
  quantite: string;
  prix_unitaire_ht: string;
  tva_pct: string;
};

/** Valeurs de préremplissage (édition d'un brouillon). */
export type DocumentFormValues = {
  organisation_id?: string | null;
  objet?: string | null;
  notes?: string | null;
  lignes?: LigneSaisie[];
};

function nombre(v: string): number {
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Formulaire de devis / facture (Lot 2, cadrage §4.C) : client (organisation
 * du CRM), objet, lignes (désignation, quantité, PU HT, TVA) avec totaux
 * calculés en direct. Les lignes partent en JSON dans le champ caché `lignes` ;
 * la validation serveur (lib/facturation-validation) fait autorité.
 */
export function DocumentForm({
  action,
  organisations,
  tauxTvaDefaut,
  values = {},
  submitLabel,
}: {
  action: (
    state: DocumentFormState,
    formData: FormData,
  ) => Promise<DocumentFormState>;
  organisations: OrganisationChoix[];
  /** Taux appliqué aux nouvelles lignes (paramètres de facturation). */
  tauxTvaDefaut: string;
  values?: DocumentFormValues;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  const ligneVide: LigneSaisie = useMemo(
    () => ({
      designation: "",
      quantite: "1",
      prix_unitaire_ht: "",
      tva_pct: tauxTvaDefaut,
    }),
    [tauxTvaDefaut],
  );

  const [lignes, setLignes] = useState<LigneSaisie[]>(
    values.lignes && values.lignes.length > 0 ? values.lignes : [ligneVide],
  );

  function setLigne(index: number, patch: Partial<LigneSaisie>): void {
    setLignes((courantes) =>
      courantes.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );
  }

  const totaux = useMemo(() => {
    let ht = 0;
    let tva = 0;
    for (const l of lignes) {
      const ligneHt = round2(nombre(l.quantite) * nombre(l.prix_unitaire_ht));
      ht = round2(ht + ligneHt);
      tva = round2(tva + round2((ligneHt * nombre(l.tva_pct)) / 100));
    }
    return { ht, tva, ttc: round2(ht + tva) };
  }, [lignes]);

  /** Charge utile validée côté serveur (nombres, pas de chaînes). */
  const lignesJson = useMemo(
    () =>
      JSON.stringify(
        lignes.map((l) => ({
          designation: l.designation.trim(),
          quantite: nombre(l.quantite),
          prix_unitaire_ht: nombre(l.prix_unitaire_ht),
          tva_pct: nombre(l.tva_pct),
        })),
      ),
    [lignes],
  );

  const INPUT_LIGNE =
    "w-full rounded-btn border-[1.5px] border-outline bg-surface px-2.5 py-2 text-[14px] text-ink placeholder:text-quiet transition-colors focus:border-canard focus:outline-none focus:ring-2 focus:ring-canard/20";

  return (
    <form action={formAction} className="grid grid-cols-1 gap-y-[18px]">
      {state.formError && (
        <div
          role="alert"
          className="rounded-chip bg-[rgba(199,90,77,0.14)] px-4 py-3 text-[13.5px] leading-[1.5] text-ink-clay"
        >
          {state.formError}
        </div>
      )}

      <Field
        id="document-organisation"
        label="Client"
        required
        error={errors.organisation_id}
      >
        <select
          id="document-organisation"
          name="organisation_id"
          required
          defaultValue={values.organisation_id ?? ""}
          className={selectClass}
        >
          <option value="" disabled>
            — Choisir une entreprise du CRM —
          </option>
          {organisations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nom}
            </option>
          ))}
        </select>
        <p className="mt-[6px] text-[12.5px] leading-[1.4] text-soft">
          L&apos;entreprise doit exister dans le CRM (module CRM → Ajouter un
          contact).
        </p>
      </Field>

      <Field id="document-objet" label="Objet" error={errors.objet}>
        <input
          id="document-objet"
          name="objet"
          type="text"
          maxLength={300}
          placeholder="Ex. Formation IA débutant — session du 24 septembre 2026"
          defaultValue={values.objet ?? ""}
          className={controlClass}
        />
      </Field>

      {/* Lignes */}
      <div>
        <span className="mb-[7px] block text-[13.5px] font-semibold">
          Lignes
          <span aria-hidden className="text-requis">
            {" "}
            *
          </span>
        </span>
        <div className="overflow-x-auto rounded-card border border-hairline bg-surface">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-hairline">
                <th className="px-3 py-2 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                  Désignation
                </th>
                <th className="w-[90px] px-3 py-2 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                  Qté
                </th>
                <th className="w-[130px] px-3 py-2 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                  PU HT (€)
                </th>
                <th className="w-[100px] px-3 py-2 text-left font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                  TVA %
                </th>
                <th className="w-[110px] px-3 py-2 text-right font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-soft">
                  Total HT
                </th>
                <th className="w-[54px] px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((l, i) => (
                <tr key={i} className="border-b border-hairline last:border-0">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      aria-label={`Désignation ligne ${i + 1}`}
                      maxLength={300}
                      value={l.designation}
                      onChange={(e) =>
                        setLigne(i, { designation: e.target.value })
                      }
                      placeholder="Ex. Formation débutant — 1 participant"
                      className={INPUT_LIGNE}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={`Quantité ligne ${i + 1}`}
                      value={l.quantite}
                      onChange={(e) => setLigne(i, { quantite: e.target.value })}
                      className={INPUT_LIGNE}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={`Prix unitaire HT ligne ${i + 1}`}
                      value={l.prix_unitaire_ht}
                      onChange={(e) =>
                        setLigne(i, { prix_unitaire_ht: e.target.value })
                      }
                      placeholder="0"
                      className={INPUT_LIGNE}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={`Taux de TVA ligne ${i + 1}`}
                      value={l.tva_pct}
                      onChange={(e) => setLigne(i, { tva_pct: e.target.value })}
                      className={INPUT_LIGNE}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right font-mono text-[13px] text-body">
                    {formatEuros(
                      round2(nombre(l.quantite) * nombre(l.prix_unitaire_ht)),
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setLignes((courantes) =>
                          courantes.length > 1
                            ? courantes.filter((_, j) => j !== i)
                            : courantes,
                        )
                      }
                      disabled={lignes.length === 1}
                      aria-label={`Supprimer la ligne ${i + 1}`}
                      className="rounded-btn px-2 py-1 font-mono text-[12px] font-medium text-soft transition-colors hover:text-ink-clay disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setLignes((courantes) => [...courantes, ligneVide])}
            className="rounded-btn px-2 py-1 font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
          >
            + Ajouter une ligne
          </button>
          <div className="flex items-baseline gap-5 font-mono text-[13px] text-body">
            <span>HT {formatEuros(totaux.ht)}</span>
            <span>TVA {formatEuros(totaux.tva)}</span>
            <span className="text-[15px] font-semibold text-ink">
              TTC {formatEuros(totaux.ttc)}
            </span>
          </div>
        </div>
        {errors.lignes && (
          <p className="mt-[6px] text-[12.5px] leading-[1.4] text-erreur">
            {errors.lignes}
          </p>
        )}
        <input type="hidden" name="lignes" value={lignesJson} />
      </div>

      <Field id="document-notes" label="Notes internes" error={errors.notes}>
        <textarea
          id="document-notes"
          name="notes"
          rows={3}
          maxLength={2000}
          placeholder="Non imprimées sur le document."
          defaultValue={values.notes ?? ""}
          className={controlClass}
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="mt-1 inline-flex w-fit items-center justify-center gap-2.5 rounded-btn bg-canard px-[30px] py-[14px] text-[15.5px] font-semibold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}
