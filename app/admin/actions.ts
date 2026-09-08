"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/admin-auth";
import { ERP_URL } from "@/lib/erp-admin";

export type LoginState = {
  status: "idle" | "error";
  formError?: string;
  email?: string;
};

/** Ancien formulaire éventuellement encore ouvert : aucune authentification. */
export async function loginAction(): Promise<LoginState> {
  return { status: "error", formError: "Cet espace a fermé. Connectez-vous sur erp.marssane.fr." };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect(ERP_URL);
}
