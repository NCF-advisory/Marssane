import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PARTICIPANT_SESSION_COOKIE,
  verifyParticipantSessionToken,
} from "@/lib/participant-session";
import { SESSION_COOKIE } from "@/lib/session";
import { destinationAdmin } from "@/lib/erp-admin";

/**
 * Retrait de l'ancien admin et protection de l'espace formation
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
 * Les favoris rejoignent l'ERP. Les anciennes écritures sont refusées :
 * jamais de redirection POST qui transmettrait un formulaire ou mot de passe.
 */
function handleAdmin(request: NextRequest) {
  const response = ["GET", "HEAD"].includes(request.method)
    ? NextResponse.redirect(destinationAdmin(request.nextUrl.pathname), 307)
    : new NextResponse("Cet espace a fermé. Utilisez l’ERP Marssane.", { status: 410 });
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(SESSION_COOKIE, "", {
    path: "/admin", maxAge: 0, httpOnly: true, sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
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
