import type { Metadata } from "next";
import { ExplorationsCta } from "./ExplorationsCta";

export const metadata: Metadata = {
  title: "10 pistes pour le CTA · Marssane",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ExplorationsCta />;
}
