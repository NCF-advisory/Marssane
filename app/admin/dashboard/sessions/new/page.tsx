import type { Metadata } from "next";
import { createSessionAction } from "@/app/admin/dashboard/actions";
import { SessionForm } from "@/components/admin/SessionForm";

export const metadata: Metadata = {
  title: "Nouvelle session — Administration Marssane",
};

/** Création d'une session (F3 · CDC §5.3). */
export default function NewSessionPage() {
  return (
    <div className="max-w-[560px] space-y-8">
      <div className="space-y-3">
        <a
          href="/admin/dashboard"
          className="font-mono text-[12px] font-medium text-canard transition-colors hover:text-canard-dark"
        >
          ← Tableau de bord
        </a>
        <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
          Nouvelle session
        </h1>
      </div>
      <SessionForm action={createSessionAction} submitLabel="Créer la session" />
    </div>
  );
}
