import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js does not infer it from
  // an unrelated lockfile higher up in the filesystem.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
  experimental: {
    // Active le composant <ViewTransition> de React (cf. app/layout.tsx) :
    // les changements de route passent par document.startViewTransition, ce qui
    // permet le fondu croisé clair ↔ encre entre les pages.
    viewTransition: true,
  },
};

export default nextConfig;
