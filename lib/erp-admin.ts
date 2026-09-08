/** Destination unique de l'administration, désormais portée par l'ERP. */
export const ERP_URL = "https://erp.marssane.fr";

/** Les identifiants de session sont partagés ; ceux du CRM/finance ne le sont pas. */
export function destinationAdmin(pathname: string): string {
  const sessions = "/admin/dashboard/sessions";
  if (pathname === sessions || pathname.startsWith(`${sessions}/`)) {
    return `${ERP_URL}/formations/gestion${pathname.slice(sessions.length)}`;
  }
  if (pathname.startsWith("/admin/dashboard/crm")) {
    return `${ERP_URL}/commercial`;
  }
  if (pathname.startsWith("/admin/dashboard/facturation") || pathname.startsWith("/admin/imprimer")) {
    return `${ERP_URL}/finance`;
  }
  if (pathname === "/admin/dashboard/documents") {
    return `${ERP_URL}/formations`;
  }
  return `${ERP_URL}/`;
}
