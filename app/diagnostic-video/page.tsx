import type { Metadata } from "next";
import { DiagnosticVideo } from "./DiagnosticVideo";

export const metadata: Metadata = {
  title: "Diagnostic vidéo · Marssane",
  robots: { index: false, follow: false },
};

export default function DiagnosticVideoPage() {
  return <DiagnosticVideo />;
}
