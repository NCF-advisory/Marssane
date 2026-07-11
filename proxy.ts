import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Protection des routes admin (F3 · CDC §5.3). Ne s'applique QU'À `/admin/*`
 * (voir `matcher`) — le reste du site est inchangé.
 *
 * Convention `proxy` de Next 16 (remplace `middleware`). Exécuté en runtime
 * Edge : on ne dépend que de `jose` (via lib/session) pour vérifier le cookie ;
 * ni bcrypt ni le client Postgres ne sont sollicités ici.
 *
 * Règles :
 *   - `/admin` (connexion) : si déjà connecté → /admin/dashboard, sinon accès.
 *   - toute autre route `/admin/*` : accès si connecté, sinon → /admin.
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  const isLogin = request.nextUrl.pathname === "/admin";

  if (isLogin) {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
