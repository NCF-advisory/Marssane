import type { Pays } from "@/lib/benchmarks/models";

/**
 * Table des pays d'éditeurs — source de vérité unique des libellés.
 *
 * Extraite de `components/quelle-ia/BadgePays.tsx` pour être partagée avec le
 * hero de `/quelle-ia`, qui n'affiche que le libellé (`libelle`) : le classement
 * ne fournit qu'un code (`US` / `FR` / `CN`).
 * - `libelle` : forme courte, dans un fil de texte.
 * - `complet` : forme longue, pour un nom accessible.
 * - `bandes` : les trois bandes du drapeau stylisé du badge.
 */
export const PAYS = {
  US: { libelle: "États-Unis", complet: "États-Unis", bandes: ["bg-slate", "#dce1e6", "bg-slate"] },
  FR: { libelle: "France", complet: "France", bandes: ["bg-canard", "#dce1e6", "bg-clay"] },
  CN: { libelle: "Chine · hors UE", complet: "Chine (hors Union européenne)", bandes: ["bg-clay", "#dce1e6", "bg-clay"] },
} as const satisfies Record<Pays, { libelle: string; complet: string; bandes: readonly string[] }>;
