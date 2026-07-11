import {
  getInscriptionsBySession,
  getSessionById,
  type InscriptionRow,
} from "@/lib/admin-queries";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { INSCRIPTION_STATUT_LABELS, statutLabel } from "@/lib/admin-labels";
import { toCsv } from "@/lib/csv";
import { parseId } from "@/lib/validation";

/**
 * Export CSV de la liste des inscrits d'une session (F3 · CDC §5.3).
 *
 * Vérification de session admin explicite dans le handler (défense en
 * profondeur, en plus du proxy). Colonnes : nom, prénom, email, téléphone,
 * métier, entreprise, statut, date d'inscription. Format Excel fr (voir lib/csv :
 * BOM UTF-8, séparateur `;`, garde-fou anti-injection de formule).
 */

const HEADERS = [
  "Nom",
  "Prénom",
  "Email",
  "Téléphone",
  "Métier",
  "Entreprise",
  "Statut",
  "Date d'inscription",
];

/** Métier avec sa précision éventuelle. */
function metier(row: InscriptionRow): string {
  return row.metier_autre ? `${row.metier} — ${row.metier_autre}` : row.metier;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Authentification admin obligatoire (jamais de données sans session).
  const admin = await getCurrentAdmin();
  if (!admin) {
    return new Response("Authentification requise.", { status: 401 });
  }

  // 2. Identifiant valide.
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return new Response("Session introuvable.", { status: 404 });

  // 3. Données (une base injoignable → 503, jamais de 500 brute).
  let session: Awaited<ReturnType<typeof getSessionById>>;
  let inscriptions: InscriptionRow[];
  try {
    [session, inscriptions] = await Promise.all([
      getSessionById(id),
      getInscriptionsBySession(id),
    ]);
  } catch {
    console.error("[admin] export CSV : base indisponible");
    return new Response("Base de données indisponible.", { status: 503 });
  }

  if (!session) return new Response("Session introuvable.", { status: 404 });

  // 4. Construction du CSV.
  const rows = inscriptions.map((r) => [
    r.nom,
    r.prenom,
    r.email,
    r.telephone,
    metier(r),
    r.entreprise ?? "",
    statutLabel(INSCRIPTION_STATUT_LABELS, r.statut),
    r.created_at,
  ]);
  const csv = toCsv(HEADERS, rows);
  const filename = `inscriptions-${session.date}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
