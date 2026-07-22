import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PARTICIPANT_SESSION_COOKIE,
  verifyParticipantSessionToken,
} from "@/lib/participant-session";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Protection des routes admin (F3 · CDC §5.3) et de l'espace formation
 * (participants). Ne s'applique QU'À `/admin/*` et `/formation/*` (voir
 * `matcher`) — le reste du site est inchangé.
 *
 * Convention `proxy` de Next 16 (remplace `middleware`). On ne dépend que de
 * `jose` (via lib/session et lib/participant-session) pour vérifier les cookies ;
 * ni bcrypt ni le client Postgres ne sont sollicités ici.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return handleAdmin(request);
  }
  return handleFormation(request);
}

/**
 * Règles admin :
 *   - `/admin` (connexion) : si déjà connecté → /admin/dashboard, sinon accès.
 *   - toute autre route `/admin/*` : accès si connecté, sinon → /admin.
 */
async function handleAdmin(request: NextRequest) {
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

/**
 * Règles espace formation :
 *   - `/formation/activation` : accessible sans session (token en query).
 *   - `/formation` (connexion) : si déjà connecté → /formation/espace, sinon accès.
 *   - toute autre route `/formation/*` : accès si connecté, sinon → /formation.
 */
async function handleFormation(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Activation par lien : toujours accessible (le token est vérifié par la page).
  if (pathname === "/formation/activation") {
    return NextResponse.next();
  }

  const token = request.cookies.get(PARTICIPANT_SESSION_COOKIE)?.value;
  const session = await verifyParticipantSessionToken(token);
  const isLogin = pathname === "/formation";

  if (isLogin) {
    if (session) {
      return NextResponse.redirect(new URL("/formation/espace", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/formation", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/formation/:path*"],
};
