import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js does not infer it from
  // an unrelated lockfile higher up in the filesystem.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
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
        ],
      },
    ];
  },
};

export default nextConfig;
