import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getSessionDistribution } from "@/lib/qcm";
import { parseId } from "@/lib/validation";
import { PresentationView } from "./PresentationView";

export const metadata: Metadata = {
  title: "Mode présentation QCM · Administration Marssane",
};

/**
 * Mode présentation d'un QCM (reprise à chaud, projeté en salle). Protégé admin
 * (getCurrentAdmin, défense en profondeur en plus du proxy). Charge la
 * répartition anonymisée des réponses de la promotion pour ce questionnaire, puis
 * la rend en overlay plein écran. Scopé sur (session, questionnaire) : aucune
 * fuite entre promotions.
 */
export default async function PresentationPage({
  params,
}: {
  params: Promise<{ id: string; questionnaireId: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  const { id: rawId, questionnaireId: rawQid } = await params;
  const sessionId = parseId(rawId);
  const questionnaireId = parseId(rawQid);
  if (!sessionId || !questionnaireId) notFound();

  let data: Awaited<ReturnType<typeof getSessionDistribution>>;
  try {
    data = await getSessionDistribution(sessionId, questionnaireId);
  } catch {
    console.error("[admin] présentation QCM : base indisponible");
    return (
      <div className="rounded-card border border-outline bg-surface px-6 py-8 text-center shadow-card">
        <p className="text-[16px] font-semibold text-ink">
          Base de données indisponible
        </p>
        <p className="mx-auto mt-2 max-w-[520px] text-[14px] leading-[1.5] text-body">
          Le mode présentation ne peut pas être chargé pour le moment.
        </p>
      </div>
    );
  }

  if (!data) notFound();

  const exitHref = `/admin/dashboard/sessions/${sessionId}#qcm`;

  return (
    <PresentationView
      title={`Session ${data.questionnaire.numeroSession} · ${data.questionnaire.titre}`}
      questions={data.questions.map((q) => ({
        questionId: q.questionId,
        enonce: q.enonce,
        type: q.type,
        respondents: q.respondents,
        options: q.options.map((o) => ({
          optionId: o.optionId,
          libelle: o.libelle,
          correcte: o.correcte,
          count: o.count,
          pct: o.pct,
        })),
      }))}
      exitHref={exitHref}
    />
  );
}
