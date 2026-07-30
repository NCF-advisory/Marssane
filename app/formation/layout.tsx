import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** L'espace participant et tout son sous-arbre restent exclus des moteurs. */
export default function FormationLayout({ children }: { children: ReactNode }) {
  return children;
}
