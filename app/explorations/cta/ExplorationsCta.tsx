"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import { RENDEZ_VOUS_DIALOG_ID, RENDEZ_VOUS_OPEN_EVENT } from "@/lib/rendez-vous-types";
import styles from "./explorations.module.css";

const PISTES = [
  { nom: "La base", style: "base", note: "Canard plein, quatre angles ouverts et chevron blanc.", mouvement: "Les angles se resserrent légèrement au survol.", tag: "Point de départ" },
  { nom: "Angles diagonaux", style: "diagonale", note: "Deux angles opposés pour une composition plus légère.", mouvement: "Les deux repères se rapprochent du bouton.", tag: "Plus aérien" },
  { nom: "Cadre intérieur", style: "interieur", note: "Les angles blancs entrent dans le bouton, comme un cadre de mise au point.", mouvement: "Le cadre intérieur se resserre sur le libellé.", tag: "Ma recommandation" },
  { nom: "Double cadre", style: "double", note: "Un filet intérieur et des angles extérieurs composent deux plans.", mouvement: "Le second plan se décale de deux pixels.", tag: "Architectural" },
  { nom: "Encre & turquoise", style: "encre", note: "Un fond encre et des angles turquoise, avec une flèche assortie.", mouvement: "Le fond prend une nuance canard au survol.", tag: "Direction retenue" },
  { nom: "Bloc flèche", style: "bloc", note: "Une case dédiée à la flèche, dans le même cadre ouvert.", mouvement: "La case de la flèche passe au turquoise.", tag: "Plus affirmé" },
  { nom: "Écume claire", style: "ecume", note: "Un fond écume, un texte sombre et des angles canard.", mouvement: "Le fond s’éclaircit et la flèche avance.", tag: "Très visible" },
  { nom: "Trame technique", style: "trame", note: "Un quadrillage fin dans un fond canard profond.", mouvement: "La trame s’éclaircit, les angles se rapprochent.", tag: "Dans l’esprit du héros" },
  { nom: "Coins biseautés", style: "biseau", note: "Deux découpes diagonales apportent une silhouette plus nette.", mouvement: "Le chevron avance entre les angles fixes.", tag: "Plus graphique" },
  { nom: "Mono encadrée", style: "mono", note: "Typographie monospace et angles courts plus épais.", mouvement: "Les angles s’écartent légèrement au survol.", tag: "Plus typographique" },
] as const;

function Bouton({ index }: { index: number }) {
  const piste = PISTES[index];
  return (
    <button type="button" className={`${styles.bouton} ${styles[piste.style]}`}
      aria-label="Discuter de mon projet"
      aria-haspopup="dialog" aria-controls={RENDEZ_VOUS_DIALOG_ID}
      onClick={() => {
        const dialog = document.getElementById(RENDEZ_VOUS_DIALOG_ID);
        if (dialog instanceof HTMLDialogElement) {
          dialog.dispatchEvent(new Event(RENDEZ_VOUS_OPEN_EVENT));
          dialog.showModal();
        }
      }}>
      <span className={styles.coins} aria-hidden="true"><i /><i /><i /><i /></span>
      <span className={styles.libelle}>Discuter de mon projet</span>
      <span className={styles.icone} aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none"><path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </button>
  );
}

export function ExplorationsCta() {
  const [choix, setChoix] = useState(4);
  const piste = PISTES[choix];
  return (
    <main className={styles.page}>
      <div className={styles.conteneur}>
        <header className={styles.entete}>
          <Link href="/" aria-label="Marssane, retour à la landing" style={{ ["--color-ink" as string]: "#fff" }}><LogoMarssane withWordmark size={28} /></Link>
          <Link className={styles.retour} href="/">Retour à la landing <span aria-hidden="true">↗</span></Link>
        </header>

        <div className={styles.intro}>
          <p className={styles.kicker}>Explorations · Série 02</p>
          <h1>Les angles.<br /><span>Dix interprétations.</span></h1>
          <p>Une même base : le rectangle canard et les angles ouverts. Dix façons de travailler le cadre, le contraste et la flèche. Sélectionnez une piste pour la voir en contexte.</p>
        </div>

        <section className={styles.contexte} aria-label="Aperçu du bouton dans la landing">
          <div className={styles.hero}>
            <p className={styles.kicker}>Aperçu dans le héros</p>
            <h2>Dirigeant de PME,<br />gagnez <span>2 h par jour<i aria-hidden="true">+</i></span>.</h2>
            <div className={styles.heroBouton}><Bouton index={choix} /></div>
          </div>
          <div className={styles.commentaire} aria-live="polite" aria-atomic="true">
            <p className={styles.numero}>{String(choix + 1).padStart(2, "0")} / 10</p>
            <h3>{piste.nom}</h3>
            <p>{piste.note}</p>
            <span className={styles.etiquette}>{piste.tag}</span>
          </div>
        </section>

        <div className={styles.guide}>
          <h2>Les dix pistes</h2>
          <p>« Voir en contexte » change l’aperçu. Chaque CTA ouvre la prise de rendez-vous.</p>
        </div>
        <div className={styles.collection}>
          {PISTES.map((p, index) => (
            <article key={p.style} className={styles.carte} data-selectionne={choix === index}>
              <div className={styles.carteEntete}><span className={styles.numero}>{String(index + 1).padStart(2, "0")}</span><span className={styles.tag}>{p.tag}</span></div>
              <div className={styles.scene}><Bouton index={index} /></div>
              <h3>{p.nom}</h3>
              <p className={styles.description}>{p.note}</p>
              <p className={styles.mouvement}>{p.mouvement}</p>
              <button type="button" className={styles.selection} aria-pressed={choix === index} aria-label={`Voir en contexte : ${p.nom}`} onClick={() => {
                setChoix(index);
                document.querySelector(`.${styles.contexte}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
              }}>{choix === index ? "Dans l’aperçu" : "Voir en contexte"}<span aria-hidden="true">{choix === index ? "✓" : "↗"}</span></button>
            </article>
          ))}
        </div>

        <footer className={styles.conseil}>
          <span aria-hidden="true">↗</span>
          <p><strong>Direction retenue : 05, Encre & turquoise.</strong> Le fond sombre, les angles ouverts et la flèche turquoise sont appliqués aux boutons de prise de rendez-vous du site.</p>
        </footer>
      </div>
    </main>
  );
}
