import type { Pays } from "@/lib/pays";

/**
 * Types et paramètres du classement « score = 50 % intelligence + 25 % coût +
 * 25 % réactivité » affiché par « /quelle-ia ».
 *
 * La chaîne de calcul automatique (cron, connecteurs, lecture base) a été
 * retirée le 18/09/2026 : les valeurs sont désormais un instantané figé
 * (classement-statique.ts). Ce fichier ne garde que ce que la page et sa
 * rubrique « Méthode & sources » ont encore besoin d'afficher — les
 * pondérations de la formule et la forme des données.
 */

// ---------------------------------------------------------------------------
// Paramètres de la formule (affichés au visiteur par MethodoSources)
// ---------------------------------------------------------------------------

/** Taux de conversion USD → EUR appliqué au coût. */
export const USD_EUR = 0.92;

/**
 * Coût mélangé = (POIDS_INPUT × prix_input + POIDS_OUTPUT × prix_output) / (somme
 * des poids). Pondération volontairement « input-lourde » : la plupart des usages
 * PME envoient beaucoup de contexte pour une réponse courte.
 */
export const POIDS_INPUT = 3;
export const POIDS_OUTPUT = 1;

/**
 * Score global = POIDS_INTELLIGENCE × intelligence + POIDS_COUT × efficacité-coût
 * + POIDS_REACTIVITE × réactivité, les trois termes étant sur une échelle 0-100
 * commune, donc directement combinables. Pondération 50/25/25 assumée
 * éditorialement (et affichée au visiteur, cf. MethodoSources) : le niveau du
 * modèle décide, le prix et le temps d'attente départagent.
 */
export const POIDS_INTELLIGENCE = 0.5;
export const POIDS_COUT = 0.25;
export const POIDS_REACTIVITE = 0.25;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ClassementEntry = {
  rang: number;
  cle: string;
  nom: string;
  editeur: string;
  pays: Pays;
  effort?: string;
  /** Intelligence normalisée 0-100 parmi les modèles suivis. */
  intelligence: number;
  /** Coût mélangé en €/million de tokens. */
  coutEurM: number;
  /** Indice d'efficacité-coût normalisé 0-100 (rapport intelligence ÷ coût). */
  indiceEfficacite: number;
  /** Réactivité normalisée 0-100 (100 = le plus prompt à répondre). */
  reactivite: number;
  /** Temps de réflexion mesuré, en secondes ; null si non mesuré (affichage). */
  latenceS: number | null;
  /** Score global 0-100 (50 % intelligence + 25 % coût + 25 % réactivité) : métrique de rang. */
  score: number;
};

export type Classement = {
  entries: ClassementEntry[];
  /** Date du relevé des sources, ISO. */
  miseAJour: string;
};
