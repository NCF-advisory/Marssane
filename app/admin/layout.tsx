import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Le back-office et tout son sous-arbre restent exclus des moteurs. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
