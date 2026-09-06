"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navigation par modules de l'administration (ERP · Lot 0, cadrage §6).
 * Client component : l'état actif dépend du chemin courant (usePathname).
 *
 * Un lien est actif si le chemin correspond exactement (accueil) ou commence
 * par son préfixe (les sous-pages `/sessions/[id]`, `/sessions/new`, etc.
 * gardent leur module surligné).
 */
const LINKS = [
  { href: "/admin/dashboard", label: "Tableau de bord", exact: true },
  { href: "/admin/dashboard/crm", label: "CRM", exact: false },
  { href: "/admin/dashboard/sessions", label: "Sessions", exact: false },
  { href: "/admin/dashboard/facturation", label: "Facturation", exact: false },
  { href: "/admin/dashboard/documents", label: "Documents", exact: false },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Modules d'administration" className="-mb-px">
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block border-b-2 px-0.5 pb-2.5 pt-1 font-mono text-[12px] font-medium uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? "border-canard text-ink"
                    : "border-transparent text-soft hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
