import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const dev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy, en mode Report-Only pour l'instant : rien n'est
 * bloqué, les navigateurs signalent à /api/csp-report ce qu'une politique
 * bloquante refuserait. Elle passera en `Content-Security-Policy` une fois les
 * rapports observés. Inventaire du 18/09/2026 : polices, vidéos, animations et
 * Vercel Analytics sont servis par le site lui-même ; aucun script tiers.
 */
const cspDirectives = [
  "default-src 'self'",
  // Next.js injecte des scripts inline (hydratation) : sans nonce, qui
  // forcerait le rendu dynamique de toutes les pages, 'unsafe-inline' est
  // requis. En dev seulement : eval (rafraîchissement à chaud) et le script de
  // debug de Vercel Analytics.
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  // Attributs style inline (next/image, styles React).
  "style-src 'self' 'unsafe-inline'",
  // Chevrons SVG des <select> en data: (globals.css).
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "report-uri /api/csp-report",
];

const csp = cspDirectives.join("; ");

/**
 * Présentation Novances (page non répertoriée) : fichier HTML autonome servi
 * depuis `public/`, qui embarque ses polices en `data:` (@font-face woff2 en
 * base64). Même politique que le reste du site, `font-src` élargi à `data:`.
 * `index.html` porte une ligne ajoutée à la main avant `</body>` qui charge
 * `nav.js` (flèches de navigation) : la remettre après tout réexport.
 */
const cspFormationNovances = cspDirectives
  .map((directive) =>
    directive.startsWith("font-src ") ? `${directive} data:` : directive,
  )
  .join("; ");

/**
 * Les deux chemins de la présentation : l'URL publique et le fichier servi
 * derrière le rewrite. Les règles `headers` s'appliquent sur le chemin
 * demandé, avant le rewrite : les deux doivent donc être listés.
 */
const cheminsFormationNovances = [
  "/formation-novances-7k3q",
  "/formation-novances-7k3q/index.html",
];

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js does not infer it from
  // an unrelated lockfile higher up in the filesystem.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
  async rewrites() {
    return [
      {
        source: "/formation-novances-7k3q",
        destination: "/formation-novances-7k3q/index.html",
      },
    ];
  },
  async headers() {
    return [
      ...[
        "/admin/:path*",
        "/formation/:path*",
        "/api/:path*",
        "/styleguide",
        "/merci",
      ].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      })),
      // En-têtes de sécurité de base sur tout le site : bloquer le sniffing de
      // type MIME, l'affichage du site dans une iframe tierce (clickjacking),
      // la fuite d'URL complète vers l'extérieur et l'accès aux capteurs du
      // navigateur, qu'aucune page n'utilise. HSTS est déjà posé par Vercel.
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
      // Placé après la règle `/(.*)` : à clé d'en-tête identique, la dernière
      // règle qui correspond l'emporte.
      ...cheminsFormationNovances.map((source) => ({
        source,
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspFormationNovances,
          },
        ],
      })),
    ];
  },
};

export default nextConfig;
