/**
 * Réception des rapports de violation CSP (directive `report-uri`, voir
 * next.config.ts). La politique est en Report-Only : rien n'est bloqué, les
 * navigateurs signalent ici ce qu'une CSP bloquante refuserait. Chaque rapport
 * tient sur une ligne de log (visible dans les logs Vercel), réduite aux champs
 * utiles au réglage. Les URL sont journalisées sans query ni fragment : celle
 * de la page peut porter un token d'activation, jamais journalisé.
 */
export const dynamic = "force-dynamic";

/**
 * Origine + chemin d'une URL rapportée (sans query ni fragment), ou la valeur
 * brute si ce n'en est pas une (« inline », « eval », « data »…).
 */
function sansQuery(valeur: unknown): string | undefined {
  if (typeof valeur !== "string" || !valeur) return undefined;
  try {
    const url = new URL(valeur);
    return url.origin + url.pathname;
  } catch {
    return valeur;
  }
}

export async function POST(request: Request) {
  let corps: unknown;
  try {
    corps = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  // Format `report-uri` : { "csp-report": { ... } }.
  const rapport = ((corps as { "csp-report"?: unknown })?.["csp-report"] ?? corps) as
    Record<string, unknown> | null;
  if (!rapport || typeof rapport !== "object") {
    return new Response(null, { status: 400 });
  }

  console.warn(
    "[csp] violation",
    JSON.stringify({
      page: sansQuery(rapport["document-uri"]),
      directive: rapport["effective-directive"] ?? rapport["violated-directive"],
      bloque: sansQuery(rapport["blocked-uri"]),
      source: sansQuery(rapport["source-file"]),
      ligne: rapport["line-number"],
    }),
  );
  return new Response(null, { status: 204 });
}
