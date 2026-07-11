"use server";

import { compare } from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/admin-auth";
import { findAdminByEmail } from "@/lib/admins";

/** État renvoyé à `useActionState` (formulaire de connexion). */
export type LoginState = {
  status: "idle" | "error";
  /** Erreur globale affichée en encart. */
  formError?: string;
  /** Email saisi, réinjecté dans le champ après une erreur. */
  email?: string;
};

/**
 * Message unique pour un échec d'authentification : ne distingue pas
 * « email inconnu » de « mot de passe faux » (pas d'énumération, CDC §7.6).
 */
const IDENTIFIANTS_INCORRECTS = "Identifiants incorrects.";

/**
 * Hash bcrypt factice (mot de passe « ~ », coût 12) comparé lorsqu'aucun admin
 * ne correspond, afin d'égaliser le temps de réponse et d'empêcher de deviner
 * l'existence d'un compte par mesure de latence.
 */
const DUMMY_HASH = "$2b$12$qymQTq8BTuqdTeL0R17in.0oVl7cbwLqrT2mPFr.KBPzeoIgZgpKS";

/**
 * Rate-limiting en mémoire par IP : 5 tentatives / 15 min (même stratégie que
 * la pré-inscription). LIMITE : l'état est propre au processus — en serverless,
 * la limite est par instance, pas globale. Suffisant pour freiner le bruteforce
 * sur 2 comptes ; à remplacer par un store partagé si l'abus devient réel.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(key);
  }
  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX) return false;
  current.count += 1;
  return true;
}

async function clientIp(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "inconnu";
}

/**
 * Protection CSRF : vérifie que l'origine de la requête correspond à l'hôte
 * servant la page. Défense en profondeur, en complément du cookie `sameSite`
 * strict et de la protection intégrée des server actions de Next.
 */
async function sameOrigin(): Promise<boolean> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Server action de connexion admin (F3 · CDC §5.3), compatible `useActionState`.
 * Aucune donnée sensible n'est journalisée.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = (formData.get("email") ?? "").toString().trim().toLowerCase();
  const password = (formData.get("password") ?? "").toString();

  // 1. CSRF : rejette les requêtes cross-site.
  if (!(await sameOrigin())) {
    return { status: "error", formError: "Requête invalide.", email };
  }

  // 2. Rate-limiting par IP.
  const ip = await clientIp();
  if (!checkRateLimit(ip)) {
    return {
      status: "error",
      formError: "Trop de tentatives, réessayez dans quelques minutes.",
      email,
    };
  }

  // 3. Champs requis.
  if (!email || !password) {
    return { status: "error", formError: IDENTIFIANTS_INCORRECTS, email };
  }

  // 4. Lookup + comparaison bcrypt. Un incident base → « Service indisponible »
  //    (jamais de 500 brut ni de détail technique exposé).
  let ok = false;
  try {
    const admin = await findAdminByEmail(email);
    // Comparaison factice si l'admin n'existe pas (temps de réponse constant).
    ok = await compare(password, admin?.password_hash ?? DUMMY_HASH);
    if (ok && admin) {
      await createSession({ sub: admin.id, email: admin.email });
    } else {
      ok = false;
    }
  } catch {
    console.error("[admin] échec de la vérification des identifiants (incident)");
    return {
      status: "error",
      formError: "Service indisponible, réessayez dans un instant.",
      email,
    };
  }

  if (!ok) {
    return { status: "error", formError: IDENTIFIANTS_INCORRECTS, email };
  }

  // Succès : redirect hors du try (redirect() lève une exception de contrôle).
  redirect("/admin/dashboard");
}

/** Déconnexion : détruit le cookie de session et renvoie à la connexion. */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin");
}
