"use client";

import { useEffect, useRef, useState } from "react";
import { HeroVideo } from "@/components/site/HeroVideo";

const LABELS = ["Lecteur actuel", "MP4 natif", "MP4 sans audio"];
type Mesure = { lecteur: string; automatique: boolean; format: string; pret: number; erreur: string | null };

export function DiagnosticVideo() {
  const zone = useRef<HTMLDivElement>(null);
  const [rapport, setRapport] = useState("");
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [copie, setCopie] = useState(false);

  useEffect(() => {
    let annule = false;
    let interaction = false;
    const clic = () => { interaction = true; };
    document.addEventListener("click", clic);
    document.addEventListener("keydown", clic);
    const timer = window.setTimeout(async () => {
      const videos = Array.from(zone.current?.querySelectorAll("video") ?? []);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const resultat = await Promise.all(videos.map(async (v, index) => {
        const automatique = v.currentTime > 0.1 && !v.paused;
        let erreur = v.error ? `${v.error.code} : ${v.error.message}` : null;
        // Un essai sans geste permet de distinguer un refus de politique d'un
        // échec de décodage. La mesure initiale reste conservée avant cet essai.
        if (v.paused && !reduced) {
          erreur = await Promise.race([
            v.play().then(() => "Reprise différée réussie", (e: DOMException) => `${e.name} : ${e.message}`),
            new Promise<string>((resolve) => window.setTimeout(() => resolve("Lecture toujours en attente"), 2000)),
          ]);
        }
        return { lecteur: LABELS[index], automatique, format: v.currentSrc.split("/").pop() ?? "", pret: v.readyState, erreur };
      }));
      if (annule) return;
      setMesures(resultat);
      setRapport(JSON.stringify({ navigateur: navigator.userAgent, animationsReduites: reduced, interactionAvantMesure: interaction, videos: resultat }, null, 2));
    }, 4000);
    return () => {
      annule = true;
      window.clearTimeout(timer);
      document.removeEventListener("click", clic);
      document.removeEventListener("keydown", clic);
    };
  }, []);

  return (
    <main className="mx-auto max-w-[1260px] px-6 py-10 text-white">
      <h1 className="text-3xl font-bold">Test de lecture sur Safari</h1>
      <p className="mt-4 text-body-sur-ink">Attends quelques secondes sans cliquer. Les trois lecteurs affichent la même animation.</p>
      <div ref={zone} className="mt-8 grid gap-6 md:grid-cols-3">
        {LABELS.map((label, index) => (
          <section key={label} className="min-w-0">
            <h2 className="mb-3 font-semibold">{label}</h2>
            {index === 0 ? <HeroVideo video={{ mp4: "/video/hero-v2.mp4", webm: "/video/hero-v2.webm", poster: "/video/hero-v2-poster.jpg" }} /> : (
              <video className="aspect-[16/10] w-full object-cover" src={index === 1 ? "/video/hero-v2.mp4" : "/video/hero-v2-sans-audio.mp4"} poster="/video/hero-v2-poster.jpg" autoPlay muted loop playsInline preload="auto" controls />
            )}
            <p className="mt-3 text-sm" role="status">{mesures[index] ? `Démarrage sans clic : ${mesures[index].automatique ? "oui" : "non"}` : "Mesure en cours…"}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm text-body-sur-ink">Le diagnostic reste dans cette page. Copie le résultat et colle-le dans notre conversation.</p>
      <button className="mt-4 rounded border border-white/30 px-5 py-3 disabled:opacity-40" disabled={!rapport} onClick={async () => {
        try { await navigator.clipboard.writeText(rapport); setCopie(true); }
        catch { setCopie(false); }
      }}>{copie ? "Résultat copié" : "Copier le résultat"}</button>
      {rapport && <textarea aria-label="Résultat du diagnostic" readOnly value={rapport} className="mt-4 block h-52 w-full rounded border border-white/20 bg-black/20 p-3 font-mono text-xs text-white" />}
    </main>
  );
}
