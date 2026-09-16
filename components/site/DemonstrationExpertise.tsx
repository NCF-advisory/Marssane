"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { DEMONSTRATIONS, type DemonstrationId } from "@/lib/expertise-demonstrations";
import styles from "./DemonstrationExpertise.module.css";

function Icone({ type }: { type: "mail" | "document" | "check" | "fleche" | "dossier" | "grille" }) {
  const traits = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    document: <><path d="M14 3H6a1 1 0 0 0-1 1v16h14V8l-5-5Z" /><path d="M14 3v6h5M8 13h8M8 16h6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    fleche: <path d="M4 12h16m-6-6 6 6-6 6" />,
    dossier: <path d="M3 7V5h7l2 3h9v12H3V7Z" />,
    grille: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{traits[type]}</svg>;
}

function Apparition({ visible, children, className = "" }: { visible: boolean; children: ReactNode; className?: string }) {
  return <div className={`${styles.apparition} ${className}`} data-visible={visible} aria-hidden={!visible}>{children}</div>;
}

function Entete({ icone, titre, detail }: { icone: Parameters<typeof Icone>[0]["type"]; titre: string; detail?: string }) {
  return <div className={styles.entete}><span className={styles.appIcon}><Icone type={icone} /></span><strong>{titre}</strong>{detail && <span className={styles.detail}>{detail}</span>}</div>;
}

function Mails({ etape }: { etape: number }) {
  return <div className={styles.fenetre}>
    <Entete icone="mail" titre="Boîte de réception" detail="3 messages" />
    <div className={styles.mails}>
      {[["ML", "Marie Laurent", "Une précision sur votre devis", "Client"], ["AC", "Atelier Conseil", "Nouvelle demande de rendez-vous", "À traiter"], ["LE", "La lettre éco", "Votre actualité de la semaine", "Lecture"]].map(([initiales, nom, sujet, badge]) => <div className={styles.mail} key={nom}>
        <span className={styles.avatar}>{initiales}</span>
        <div><strong>{nom}</strong><span>{sujet}</span></div>
        <Apparition visible={etape >= 1} className={styles.badge}>{badge}</Apparition>
      </div>)}
    </div>
    <Apparition visible={etape >= 2} className={styles.brouillon}>
      <span className={styles.micro}>Réponse proposée · à valider</span>
      <p>Bonjour Marie, voici le détail des prestations incluses dans notre devis…</p>
      <span className={styles.validation}><Icone type="check" /> Prêt pour votre relecture</span>
    </Apparition>
  </div>;
}

function Documents({ etape }: { etape: number }) {
  return <div className={styles.documents}>
    <div className={styles.sources}>
      <span><Icone type="document" /> Devis.pdf <small>4 pages</small></span>
      <span><Icone type="document" /> Besoin.pdf <small>6 pages</small></span>
    </div>
    <div className={styles.document}>
      <span className={styles.micro}>Extrait du dossier</span>
      <p>Le projet comprend <mark data-actif={etape >= 1}>3 ateliers</mark> et un accompagnement. Le démarrage est prévu <mark data-actif={etape >= 1}>en octobre</mark>.</p>
      <div className={styles.lignes} aria-hidden="true"><i /><i /><i /></div>
    </div>
    <Apparition visible={etape >= 2} className={styles.synthese}>
      <strong><Icone type="check" /> L’essentiel du dossier</strong>
      <div><span>3 ateliers prévus</span><small>Devis · p. 2</small></div>
      <div><span>Démarrage en octobre</span><small>Besoin · p. 1</small></div>
      <div><span>À préciser : les participants</span><small>Point à vérifier</small></div>
    </Apparition>
  </div>;
}

function Assistant({ etape }: { etape: number }) {
  return <div className={styles.fenetre}>
    <Entete icone="document" titre="Votre assistant interne" detail="Équipe" />
    <div className={styles.conversation}>
      <div className={styles.question}><span className={styles.micro}>Vous</span><p>Comment préparer l’arrivée d’un nouveau collègue ?</p></div>
      <Apparition visible={etape >= 1} className={styles.recherche}><Icone type="dossier" /> Source : accueil des collaborateurs</Apparition>
      <Apparition visible={etape >= 2} className={styles.reponse}>
        <strong>Voici les trois premières actions :</strong>
        <ol><li>Préparer les accès aux outils.</li><li>Désigner un référent dans l’équipe.</li><li>Organiser le point d’accueil.</li></ol>
        <span className={styles.citation}><Icone type="document" /> Procédure d’accueil · p. 2</span>
      </Apparition>
    </div>
  </div>;
}

function Commercial({ etape }: { etape: number }) {
  return <div className={styles.commercial}>
    <div className={styles.fenetre}>
      <Entete icone="document" titre="Nouvelle demande" />
      <div className={styles.fiche}><span className={styles.avatar}>ML</span><div><strong>Marie Laurent</strong><span>Atelier Laurent · Demande de devis</span></div><span className={styles.badge}>Reçue</span></div>
    </div>
    <div className={styles.connexion} data-actif={etape >= 1}><span /><Icone type="fleche" /><span /><small>Transfert des informations</small></div>
    <div className={styles.sorties}>
      <Apparition visible={etape >= 1} className={styles.sortie}>
        <span className={styles.appIcon}><Icone type="grille" /></span><strong>Fiche CRM</strong><span>Marie Laurent</span><small>Nouveau prospect</small>
      </Apparition>
      <Apparition visible={etape >= 2} className={styles.sortie}>
        <span className={styles.appIcon}><Icone type="check" /></span><strong>Rappel attribué</strong><span>Équipe commerciale</span><small>Demain · 10 h</small>
      </Apparition>
    </div>
  </div>;
}

function Administratif({ etape }: { etape: number }) {
  return <div className={styles.administratif}>
    <div className={styles.facture}>
      <div><Icone type="document" /><span className={styles.micro}>Facture F-024</span></div>
      <strong>1 250,00 €</strong><span>Atelier Laurent</span>
      <div className={styles.echeance}><span>Échéance</span><b>30 septembre</b></div>
    </div>
    <Apparition visible={etape >= 1} className={styles.regle}><Icone type="check" /><div><strong>Échéance dépassée ?</strong><span>Oui · règlement non reçu</span></div></Apparition>
    <Apparition visible={etape >= 2} className={styles.relance}>
      <span className={styles.micro}>Brouillon de relance</span><p>Bonjour, sauf erreur de notre part, la facture F-024 reste à régler…</p>
      <span className={styles.validation}><Icone type="mail" /> À valider avant envoi</span>
    </Apparition>
  </div>;
}

function Pilotage({ etape }: { etape: number }) {
  return <div className={styles.pilotage}>
    <div className={styles.outils}>{["Ventes", "Factures", "Projets"].map(nom => <span key={nom}><Icone type="grille" />{nom}</span>)}</div>
    <div className={styles.collecte} data-actif={etape >= 1}><i /><i /><i /></div>
    <div className={styles.fenetre}>
      <Entete icone="grille" titre="Votre point d’équipe" />
      <div className={styles.indicateurs}>{[["Demandes", "12"], ["Devis", "8"], ["Projets", "5"]].map(([nom, valeur]) => <div key={nom}><span>{nom}</span><strong>{etape >= 2 ? valeur : "—"}</strong></div>)}</div>
      <div className={styles.graphique} aria-label="Exemple de répartition des demandes sur quatre semaines">
        {[38, 65, 52, 86].map((hauteur, i) => <div key={i}><span style={{ "--hauteur": `${hauteur}%` } as CSSProperties} data-actif={etape >= 2} /><small>S{i + 1}</small></div>)}
      </div>
      <Apparition visible={etape >= 2} className={styles.actualise}><Icone type="check" /> Tableau actualisé</Apparition>
    </div>
  </div>;
}

const SCENES = { mails: Mails, documents: Documents, assistant: Assistant, commercial: Commercial, administratif: Administratif, pilotage: Pilotage };

/** Une lecture à l'entrée dans l'écran ; suspendue hors champ et onglet masqué.
 * Aucun moteur vidéo, aucune requête externe et aucun calcul à chaque image. */
export function DemonstrationExpertise({ type }: { type: DemonstrationId }) {
  const contenu = DEMONSTRATIONS[type];
  const Scene = SCENES[type];
  const ref = useRef<HTMLElement>(null);
  const demarre = useRef(false);
  const [etape, setEtape] = useState(2);
  const [lecture, setLecture] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ongletVisible, setOngletVisible] = useState(true);
  const [mouvementReduit, setMouvementReduit] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const adapter = () => {
      setMouvementReduit(media.matches);
      if (media.matches) { setLecture(false); setEtape(2); }
    };
    const observer = new IntersectionObserver(([entree]) => {
      setVisible(entree.isIntersecting);
      adapter();
      if (entree.isIntersecting && !demarre.current) {
        demarre.current = true;
        if (!media.matches) { setEtape(0); setLecture(true); }
      }
    }, { threshold: 0.25 });
    if (ref.current) observer.observe(ref.current);
    const visibilite = () => setOngletVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibilite);
    media.addEventListener("change", adapter);
    return () => { observer.disconnect(); media.removeEventListener("change", adapter); document.removeEventListener("visibilitychange", visibilite); };
  }, []);

  useEffect(() => {
    if (!lecture || !visible || !ongletVisible || mouvementReduit) return;
    const timer = window.setTimeout(() => {
      if (etape < 2) setEtape(etape + 1);
      else setLecture(false);
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [etape, lecture, visible, ongletVisible, mouvementReduit]);

  return <figure ref={ref} className={styles.demo} data-etape={etape} data-lecture={lecture && visible && ongletVisible} aria-label={contenu.titre}>
    <div className={styles.barre}><span><i aria-hidden="true" />Exemple illustré</span>
      {!mouvementReduit && <button type="button" onClick={() => { if (etape === 2 && !lecture) setEtape(0); setLecture(!lecture); }} aria-label={`${lecture ? "Mettre en pause" : etape === 2 ? "Rejouer" : "Lire"} : ${contenu.titre}`}>
        <span aria-hidden="true">{lecture ? "Ⅱ" : etape === 2 ? "↻" : "▷"}</span>{lecture ? "Pause" : etape === 2 ? "Rejouer" : "Lire"}
      </button>}
    </div>
    <div className={styles.scene}><Scene etape={etape} /></div>
    <div className={styles.timeline} role="group" aria-label="Étapes de la démonstration">
      {contenu.etapes.map((nom, i) => <button key={nom} type="button" aria-pressed={etape === i} onClick={() => { setLecture(false); setEtape(i); }}><span>0{i + 1}</span>{nom}</button>)}
    </div>
    <figcaption><p>{contenu.legendes[etape]}</p><small>Illustration · données fictives</small></figcaption>
  </figure>;
}
