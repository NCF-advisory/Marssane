"use client";

import { useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type Ref, type RefObject } from "react";
import Image from "next/image";
import { Chevron } from "@/components/ui/Chevron";
import { Field, controlClassSurInk, selectClassSurInk } from "@/components/ui/Field";
import { LogoMarssane } from "@/components/ui/LogoMarssane";
import {
  rendezVousDate, rendezVousHeure, rendezVousJour,
  type RendezVousCoordonnees, type RendezVousCreneau,
} from "@/lib/rendez-vous-types";

import { chargerDisponibilites, confirmerRendezVous } from "@/lib/rendez-vous-client";

const HEURES = Array.from({ length: 9 }, (_, i) => `${String(i + 9).padStart(2, "0")}:00`);
const ETAPES = ["Vos coordonnées", "Votre créneau", "Confirmation"];
const BOUTON = "inline-flex min-h-11 items-center justify-center gap-3 rounded-btn bg-canard px-5 py-3 text-[15px] font-bold text-white shadow-cta transition-colors hover:bg-canard-dark disabled:cursor-not-allowed disabled:opacity-50";
const RETOUR = "inline-flex min-h-11 items-center justify-center rounded-btn border border-line-sur-ink px-4 py-3 text-[14px] font-semibold text-body-sur-ink hover:border-turquoise hover:text-white disabled:opacity-50";

/** Poignée de la coquille : chaque ouverture de la fenêtre repart d'un
 * parcours neuf. */
export type PoigneeRendezVous = { reinitialiser: () => void };

/** Parcours à validations successives. Les disponibilités et la confirmation
 * sont fournies par le serveur ; aucune réservation n'est simulée dans l'UI.
 *
 * Deux emplacements, un seul composant : la fenêtre (<RendezVousDialog>, qui
 * fournit `conteneurRef`, `fermer` et la poignée de réinitialisation) et la
 * carte de la section contact, qui le rend sans aucune de ces prises. En page,
 * le parcours ne charge donc rien tant que les coordonnées ne sont pas
 * validées, et ne prend ni le focus ni le défilement avant un changement
 * d'étape provoqué par le visiteur. */
export function ParcoursRendezVous({
  ref, prefixe: prefixeFourni, conteneurRef, fermer, onConfirmationEnCours, onConfirme,
}: {
  /** Fenêtre : poignée de réinitialisation, appelée à chaque ouverture. */
  ref?: Ref<PoigneeRendezVous>;
  /** Préfixe des id ; la coquille le fournit pour son `aria-labelledby`. */
  prefixe?: string;
  /** Fenêtre : conteneur défilant, et origine de l'animation de validation. */
  conteneurRef?: RefObject<HTMLDialogElement | null>;
  /** Fenêtre : croix et bouton « Terminer ». Absent en page. */
  fermer?: () => void;
  /** Remonte à la coquille la confirmation en vol (fermeture et réouverture
   * doivent rester bloquées tant que la réservation n'a pas abouti). */
  onConfirmationEnCours?: (enCours: boolean) => void;
  /** Remonte à la coquille le passage à l'écran de confirmation. */
  onConfirme?: () => void;
}) {
  const prefixeAuto = useId();
  const prefixe = prefixeFourni ?? prefixeAuto;
  const racineRef = useRef<HTMLDivElement>(null);
  const titreRef = useRef<HTMLHeadingElement>(null);
  const origineValidationRef = useRef<DOMRect | null>(null);
  const nomRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const requeteRef = useRef(0);
  const confirmationRef = useRef(false);
  // Dernier couple étape/confirmation révélé, initialisé sur l'état de départ.
  const etatVuRef = useRef("0:false");
  const cleRef = useRef<string | null>(null);
  if (cleRef.current == null) cleRef.current = crypto.randomUUID();
  const [etape, setEtape] = useState(0);
  const [coordonnees, setCoordonnees] = useState<RendezVousCoordonnees>({ nom: "", email: "" });
  const [erreurs, setErreurs] = useState<Partial<RendezVousCoordonnees>>({});
  const [disponibilites, setDisponibilites] = useState<RendezVousCreneau[]>([]);
  const [jour, setJour] = useState("");
  const [selection, setSelection] = useState<RendezVousCreneau | null>(null);
  const [confirmation, setConfirmation] = useState<RendezVousCreneau | null>(null);
  const [chargement, setChargement] = useState(false);
  const [message, setMessage] = useState("");
  const [enConfirmation, setEnConfirmation] = useState(false);

  const charger = useCallback(async () => {
    const requete = ++requeteRef.current;
    setChargement(true);
    setSelection(null);
    setMessage("");
    try {
      const resultat = await chargerDisponibilites();
      if (requete !== requeteRef.current) return;
      setDisponibilites(resultat.creneaux);
      setJour(resultat.creneaux[0] ? rendezVousJour(resultat.creneaux[0].debut) : "");
      setMessage(resultat.message ?? "");
    } catch {
      if (requete !== requeteRef.current) return;
      setDisponibilites([]);
      setMessage("Impossible de charger les créneaux. Veuillez réessayer.");
    } finally {
      if (requete === requeteRef.current) setChargement(false);
    }
  }, []);

  // Réinitialisation à l'ouverture de la fenêtre : nouvelle clé d'idempotence,
  // saisie vidée, disponibilités rechargées. En page, personne n'appelle cette
  // poignée : le parcours n'interroge le serveur qu'à la validation de
  // l'étape 1, plutôt qu'à chaque visite de l'accueil.
  useImperativeHandle(ref, () => ({
    reinitialiser() {
      requeteRef.current += 1;
      cleRef.current = crypto.randomUUID();
      setEtape(0);
      setCoordonnees({ nom: "", email: "" });
      setErreurs({});
      setSelection(null);
      setConfirmation(null);
      setMessage("");
      setDisponibilites([]);
      charger();
    },
  }), [charger]);

  useEffect(() => {
    // Au montage — y compris le double montage du mode strict —, le parcours ne
    // prend ni le focus ni le défilement : en page il est visible d'emblée, et
    // seul un changement d'étape provoqué par le visiteur doit les déplacer.
    const etat = `${etape}:${Boolean(confirmation)}`;
    if (etatVuRef.current === etat) return;
    etatVuRef.current = etat;
    const conteneur = conteneurRef?.current ?? null;
    const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const comportement = mouvementReduit ? ("instant" as const) : ("smooth" as const);
    if (confirmation) {
      titreRef.current?.focus({ preventScroll: true });
      if (conteneur) conteneur.scrollTo({ top: 0, behavior: comportement });
      else revelerEnPage(racineRef.current, "center", comportement);
      return;
    }
    const racine = racineRef.current;
    const entete = racine?.querySelector<HTMLButtonElement>(`[data-rdv-entete="${etape}"]`);
    const panneau = racine?.querySelector<HTMLDivElement>(`[data-rdv-panneau="${etape}"]`);
    entete?.focus({ preventScroll: true });
    const reveler = () => {
      if (!entete) return;
      if (!conteneur) {
        // En page, le document est le seul conteneur défilant : on ne bouge
        // que si l'entête visé est sorti de la fenêtre d'affichage.
        revelerEnPage(entete, "nearest", comportement);
        return;
      }
      const cadre = conteneur.getBoundingClientRect();
      const position = entete.getBoundingClientRect();
      // Ne déplace que le défilement interne, si le titre est hors du cadre.
      if (position.top < cadre.top + 16 || position.bottom > cadre.bottom - 16) {
        conteneur.scrollTo({ top: conteneur.scrollTop + position.top - cadre.top - 20, behavior: comportement });
      }
    };
    const finTransition = (event: TransitionEvent) => {
      if (event.target === panneau && event.propertyName === "grid-template-rows") reveler();
    };
    panneau?.addEventListener("transitionend", finTransition);
    const frame = mouvementReduit ? requestAnimationFrame(reveler) : undefined;
    return () => {
      panneau?.removeEventListener("transitionend", finTransition);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [etape, confirmation, conteneurRef]);

  // Le planning ne dépend pas de la saisie : on ne le reformate qu'à réception.
  const planning = useMemo(() => {
    const groupes = new Map<string, { libelle: string; heures: Map<string, RendezVousCreneau> }>();
    for (const creneau of disponibilites) {
      const cle = rendezVousJour(creneau.debut);
      if (!groupes.has(cle)) groupes.set(cle, { libelle: rendezVousDate(creneau.debut), heures: new Map() });
      groupes.get(cle)!.heures.set(rendezVousHeure(creneau.debut), creneau);
    }
    return groupes;
  }, [disponibilites]);
  const jours = [...planning.keys()];
  const creneauxDuJour = planning.get(jour)?.heures;

  const confirmer = async () => {
    if (!selection || confirmationRef.current) return;
    confirmationRef.current = true;
    onConfirmationEnCours?.(true);
    setMessage("");
    setEnConfirmation(true);
    try {
      const resultat = await confirmerRendezVous(coordonnees, selection.debut, cleRef.current!);
      if (resultat.ok) {
        // La coche part de la silhouette du conteneur : la fenêtre, ou la
        // carte de la section — que le parcours remplit entièrement.
        const origine = conteneurRef?.current ?? racineRef.current;
        origineValidationRef.current = origine?.getBoundingClientRect() ?? null;
        onConfirme?.();
        setConfirmation(resultat.creneau);
      } else if (resultat.indisponible) {
        setSelection(null);
        setEtape(1);
        // Le créneau a pu être réservé entre le choix et la confirmation.
        const actualise = await chargerDisponibilites();
        setDisponibilites(actualise.creneaux);
        setJour(actualise.creneaux[0] ? rendezVousJour(actualise.creneaux[0].debut) : "");
        setMessage(resultat.message);
      } else {
        setMessage(resultat.message);
      }
    } catch {
      setMessage("La confirmation n'a pas abouti. Veuillez réessayer.");
    } finally {
      confirmationRef.current = false;
      onConfirmationEnCours?.(false);
      setEnConfirmation(false);
    }
  };

  if (confirmation) {
    return <ValidationRendezVous ref={racineRef} creneau={confirmation} idTitre={`${prefixe}-titre`} origineRef={origineValidationRef} fermer={fermer} enPage={!fermer && !conteneurRef} />;
  }

  return (
    <div ref={racineRef} className="relative px-5 py-7 sm:px-10 sm:py-9">
      {fermer && (
        <button type="button" onClick={fermer} disabled={enConfirmation} aria-label="Fermer la prise de rendez-vous" className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-btn text-faint-sur-ink hover:text-white disabled:opacity-40">
          <span aria-hidden>✕</span>
        </button>
      )}
      <div className="mb-8 inline-flex" style={{ ["--color-ink" as string]: "#FFFFFF" }}>
        <LogoMarssane withWordmark size={25} />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-turquoise">Discutons de votre projet</p>
      <h2 ref={titreRef} tabIndex={-1} id={`${prefixe}-titre`} className="mt-3 pr-2 text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] outline-none sm:text-[32px]">
        Un premier échange, en trois étapes.
      </h2>

      <div className="mt-5 flex items-center gap-3">
        <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-full border border-turquoise/50 bg-canard-dark">
          <Image
            src="/img/formateur/cleante.jpg"
            alt="Portrait de Cléante Oullion"
            width={1090}
            height={1127}
            sizes="84px"
            className="h-full w-full origin-[50%_30%] scale-150 object-cover"
          />
        </span>
        <p className="min-w-0 text-[13px] leading-relaxed">
          <span className="block font-semibold text-white">Avec Cléante Oullion</span>
          <span className="block text-faint-sur-ink">Fondateur de Marssane</span>
        </p>
      </div>

      <ol aria-label="Étapes de la prise de rendez-vous" className="rdv-roadmap mt-8">
        <EtapeRendezVous index={0} prefixe={prefixe} etape={etape} confirmation={Boolean(confirmation)} bloque={enConfirmation}
          resume={etape > 0 || confirmation ? `${coordonnees.nom} · ${coordonnees.email}` : "Votre nom et votre adresse mail"}
          onOuvrir={() => { setEtape(0); setMessage(""); }}>
          <form noValidate onSubmit={(event) => {
            event.preventDefault();
            const nom = coordonnees.nom.trim();
            const email = coordonnees.email.trim();
            const prochains: Partial<RendezVousCoordonnees> = {};
            if (nom.length < 2) prochains.nom = "Indiquez votre nom (au moins 2 caractères).";
            if (!email || !emailRef.current?.validity.valid) prochains.email = "Indiquez une adresse mail valide.";
            setErreurs(prochains);
            if (prochains.nom) { nomRef.current?.focus(); return; }
            if (prochains.email) { emailRef.current?.focus(); return; }
            setCoordonnees({ nom, email });
            setEtape(1);
            if (!disponibilites.length && !chargement) charger();
          }} className="space-y-5">
            <Field id={`${prefixe}-nom`} label="Nom" required error={erreurs.nom}>
              <input ref={nomRef} id={`${prefixe}-nom`} name="nom" autoComplete="name" required minLength={2} maxLength={120} value={coordonnees.nom} onChange={(e) => setCoordonnees({ ...coordonnees, nom: e.target.value })} aria-invalid={Boolean(erreurs.nom)} aria-describedby={erreurs.nom ? `${prefixe}-nom-error` : undefined} className={controlClassSurInk} />
            </Field>
            <Field id={`${prefixe}-email`} label="Adresse mail" required error={erreurs.email}>
              <input ref={emailRef} id={`${prefixe}-email`} name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} value={coordonnees.email} onChange={(e) => setCoordonnees({ ...coordonnees, email: e.target.value })} aria-invalid={Boolean(erreurs.email)} aria-describedby={erreurs.email ? `${prefixe}-email-error` : undefined} className={controlClassSurInk} />
            </Field>
            <p className="text-[12px] leading-relaxed text-faint-sur-ink">Vos coordonnées servent à organiser cet échange. <a href="/confidentialite" className="text-turquoise underline">Confidentialité</a></p>
            <button type="submit" className={`${BOUTON} w-full`}>Valider mes coordonnées <Chevron /></button>
          </form>
        </EtapeRendezVous>
        <EtapeRendezVous index={1} prefixe={prefixe} etape={etape} confirmation={Boolean(confirmation)} bloque={enConfirmation}
          resume={selection ? `${rendezVousDate(selection.debut)} · ${rendezVousHeure(selection.debut)} – ${rendezVousHeure(selection.fin)}` : "Une heure pour parler de votre projet"}
          onOuvrir={() => { setEtape(1); setMessage(""); }}>
          <div>
            <p className="mt-2 text-[13px] text-faint-sur-ink">Un départ chaque heure · heure de Paris</p>
            {chargement ? <div className="rdv-planning-chargement" role="status">
              <span className="sr-only">Recherche des créneaux disponibles…</span>
              <span className="rdv-squelette rdv-squelette--label" />
              <span className="rdv-squelette rdv-squelette--champ" />
              <span className="rdv-squelette rdv-squelette--label mt-5" />
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{HEURES.map(h => <span key={h} className="rdv-squelette rdv-squelette--heure" />)}</div>
            </div> : (
              <>
                {message && <p role="alert" className="mt-4 text-[14px] leading-relaxed text-body-sur-ink">{message}</p>}
                {jours.length ? (
                  <>
                    <label htmlFor={`${prefixe}-jour`} className="mb-2 mt-5 block text-[13.5px] font-semibold">Jour du rendez-vous</label>
                    <select id={`${prefixe}-jour`} value={jour} onChange={(e) => {
                      const prochainJour = e.target.value;
                      setJour(prochainJour);
                      setSelection(selection ? planning.get(prochainJour)?.heures.get(rendezVousHeure(selection.debut)) ?? null : null);
                      setMessage("");
                    }} className={selectClassSurInk}>
                      {jours.map((j) => <option key={j} value={j}>{planning.get(j)!.libelle}</option>)}
                    </select>
                    <fieldset className="mt-5">
                      <legend className="mb-3 text-[13.5px] font-semibold">Heure de début</legend>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {HEURES.map((heure) => {
                          const c = creneauxDuJour?.get(heure);
                          return c ? (
                            <label key={heure} className="relative cursor-pointer">
                              <input type="radio" name={`${prefixe}-creneau`} value={c.debut} checked={selection?.debut === c.debut} onChange={() => { setSelection(c); setMessage(""); }} className="peer sr-only" />
                              <span className="rdv-heure flex min-h-11 items-center justify-center rounded-btn border border-line-sur-ink px-2 py-3 font-mono text-[13px] hover:border-turquoise peer-checked:border-turquoise peer-checked:bg-canard peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-turquoise">{heure}</span>
                            </label>
                          ) : <span key={heure} aria-label={`${heure}, indisponible`} className="flex min-h-11 items-center justify-center rounded-btn border border-white/5 px-2 py-3 font-mono text-[13px] text-faint-sur-ink opacity-40 line-through">{heure}</span>;
                        })}
                      </div>
                    </fieldset>
                  </>
                ) : <div className="mt-4 rounded-card border border-line-sur-ink p-5 text-[14px] leading-relaxed text-body-sur-ink">{!message && "Aucun créneau n'est disponible pour le moment."}<button type="button" onClick={charger} className="mt-2 block min-h-11 text-turquoise underline">Actualiser les disponibilités</button></div>}
              </>
            )}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={() => { setEtape(0); setMessage(""); }} className={RETOUR}>Retour</button>
              <button type="button" disabled={!selection || chargement} onClick={() => { setEtape(2); setMessage(""); }} className={`${BOUTON} flex-1`}>Valider ce créneau <Chevron /></button>
            </div>
          </div>
        </EtapeRendezVous>
        <EtapeRendezVous index={2} prefixe={prefixe} etape={etape} confirmation={Boolean(confirmation)} bloque={enConfirmation}
          resume={confirmation ? "Votre rendez-vous est réservé" : "Vérifiez et confirmez votre rendez-vous"}
          onOuvrir={() => setEtape(2)}>
          <div>
            <p className="mt-2 text-[14px] leading-relaxed text-body-sur-ink">Vérifiez vos informations, puis confirmez votre rendez-vous.</p>
            <dl className="mt-5 space-y-4 rounded-card border border-line-sur-ink p-5 text-[14px]">
              <div><dt className="text-[12px] text-faint-sur-ink">Nom</dt><dd className="mt-1 break-words font-semibold">{coordonnees.nom}</dd></div>
              <div><dt className="text-[12px] text-faint-sur-ink">Adresse mail</dt><dd className="mt-1 break-all font-semibold">{coordonnees.email}</dd></div>
              {selection && <div><dt className="text-[12px] text-faint-sur-ink">Votre rendez-vous</dt><dd className="mt-1 font-semibold">{rendezVousDate(selection.debut)}<br />{rendezVousHeure(selection.debut)} – {rendezVousHeure(selection.fin)}<span className="mt-1 block text-[12px] font-normal text-faint-sur-ink">Heure de Paris</span></dd></div>}
            </dl>
            {message && <p role="alert" className="mt-4 text-[14px] leading-relaxed text-erreur">{message}</p>}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" disabled={enConfirmation} onClick={() => { setEtape(1); setMessage(""); }} className={RETOUR}>Modifier le créneau</button>
              <button type="button" disabled={enConfirmation} onClick={confirmer} aria-busy={enConfirmation} className={`${BOUTON} flex-1`}>{enConfirmation ? "Confirmation…" : "Confirmer le rendez-vous"}{!enConfirmation && <Chevron />}</button>
            </div>
          </div>
        </EtapeRendezVous>
      </ol>
    </div>
  );
}

/** En page, le seul conteneur défilant est le document : on ne le déplace que
 * si la cible est sortie de la fenêtre d'affichage. */
function revelerEnPage(element: HTMLElement | null, bloc: ScrollLogicalPosition, comportement: ScrollBehavior) {
  if (!element) return;
  const position = element.getBoundingClientRect();
  if (position.top < 16 || position.bottom > window.innerHeight - 16) {
    element.scrollIntoView({ block: bloc, behavior: comportement });
  }
}

/** Une seule étape dépliée. Les panneaux réduits restent montés pour animer
 * leur hauteur, mais sont retirés du parcours clavier et de l'arbre accessible. */
function EtapeRendezVous({ index, prefixe, etape, confirmation, bloque, resume, onOuvrir, children }: {
  index: number;
  prefixe: string;
  etape: number;
  confirmation: boolean;
  bloque: boolean;
  resume: string;
  onOuvrir: () => void;
  children: ReactNode;
}) {
  const ouvert = !confirmation && index === etape;
  const valide = confirmation || index < etape;
  return (
    <li className="rdv-roadmap__etape" data-active={ouvert} data-valide={valide} aria-current={ouvert ? "step" : undefined}>
      <h3>
        <button id={`${prefixe}-etape-${index}`} data-rdv-entete={index} type="button" className="rdv-roadmap__entete"
          aria-expanded={ouvert} aria-controls={`${prefixe}-panneau-${index}`}
          disabled={bloque || confirmation || index > etape}
          onClick={onOuvrir}>
          <span className="rdv-roadmap__numero" aria-hidden="true">{valide ? "✓" : `0${index + 1}`}</span>
          <span className="rdv-roadmap__texte">
            <span className="rdv-roadmap__titre">{ETAPES[index]}</span>
            <span className="rdv-roadmap__resume" title={resume}>{resume}</span>
          </span>
          <svg className="rdv-roadmap__chevron" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </h3>
      <div id={`${prefixe}-panneau-${index}`} data-rdv-panneau={index} role="region" aria-labelledby={`${prefixe}-etape-${index}`}
        className="rdv-roadmap__panneau" aria-hidden={!ouvert} inert={!ouvert}>
        <div className="rdv-roadmap__interieur"><div className="rdv-roadmap__contenu">{children}</div></div>
      </div>
    </li>
  );
}

/** La silhouette du conteneur rejoint la coche ; le récapitulatif apparaît
 * ensuite. Le bouton « Terminer » n'existe que dans la fenêtre. */
function ValidationRendezVous({ ref, creneau, idTitre, origineRef, fermer, enPage }: {
  ref: RefObject<HTMLDivElement | null>;
  creneau: RendezVousCreneau;
  idTitre: string;
  origineRef: { current: DOMRect | null };
  fermer?: () => void;
  /** En page, la carte de la section porte le cadre : le message n'en a pas. */
  enPage: boolean;
}) {
  const formeRef = useRef<HTMLSpanElement>(null);
  const cocheRef = useRef<HTMLDivElement>(null);
  const titreRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const forme = formeRef.current;
    const cible = cocheRef.current?.getBoundingClientRect();
    const origine = origineRef.current;
    titreRef.current?.focus({ preventScroll: true });
    if (!forme || !cible || !origine || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Coordonnées relatives à la coche pour que l'arrivée reste centrée,
    // même après un redimensionnement ou un défilement de la fenêtre.
    const animation = forme.animate([
      { transform: `translate(${origine.left - cible.left}px, ${origine.top - cible.top}px) scale(${origine.width / cible.width}, ${origine.height / cible.height})`,
        borderRadius: "8px", backgroundColor: "#16161a", borderColor: "#ffffff29" },
      { transform: "translate(0, 0) scale(1, 1)",
        borderRadius: "50%", backgroundColor: "#00d1be", borderColor: "#00d1be" },
    ], { duration: 420, easing: "cubic-bezier(.65, 0, .2, 1)" });
    return () => animation.cancel();
  }, [origineRef]);

  return (
    <div ref={ref} className={`rdv-validation${enPage ? " rdv-validation--en-page" : ""}`}>
      <div ref={cocheRef} className="rdv-validation__coche" aria-hidden="true">
        <span ref={formeRef} className="rdv-validation__forme" />
        <svg className="rdv-validation__trace" viewBox="0 0 100 100" fill="none">
          <path d="m26 51 16 16 33-35" pathLength="1" />
        </svg>
      </div>
      <div className="rdv-validation__message">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-turquoise">Tout est confirmé</p>
        <h2 ref={titreRef} tabIndex={-1} id={idTitre} className="mt-3 text-[27px] font-extrabold leading-[1.15] tracking-[-0.025em] outline-none sm:text-[32px]">Votre rendez-vous est confirmé.</h2>
        <p role="status" className="mt-4 text-[15px] leading-relaxed text-body-sur-ink">
          {rendezVousDate(creneau.debut)}<br />
          <span className="font-semibold text-white">{rendezVousHeure(creneau.debut)} – {rendezVousHeure(creneau.fin)}</span>
          <span className="mt-1 block text-[12px] text-faint-sur-ink">Heure de Paris</span>
        </p>
        {fermer && <button type="button" onClick={fermer} className={`${BOUTON} mt-7 min-w-40`}>Terminer <Chevron /></button>}
      </div>
    </div>
  );
}
