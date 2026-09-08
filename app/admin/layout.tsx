import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ERP_URL } from "@/lib/erp-admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Défense complémentaire au proxy : l'ancienne interface ne se rend plus. */
export default function AdminLayout() {
  redirect(ERP_URL);
}
