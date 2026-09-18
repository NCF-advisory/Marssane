# Prompt — Compositions maquette des 4 cas restants

> À coller tel quel dans Claude (VS Code), depuis la racine du projet `Site Marssane`.

---

## Contexte

Le fichier `components/site/CasConcrets.tsx` contient la section « Les cas » (ancre `#usages`), sur le modèle du sélecteur de cas de 8lab-ecosystem : liste de 6 situations à gauche, panneau de détail à droite avec un visuel décoratif en bas.

Deux compositions existent déjà et servent de **référence absolue** de style et de structure :

- `CompositionMails` (cas 0) : boîte de 47 mails → boîte triée « 6 / 47 »
- `CompositionSynthese` (cas 2) : PDF 42 pages → synthèse 12 lignes sourcée

Quatre cas sont encore en `visuel: null` sans `composition` et affichent la zone `VisuelEnAttente`. Ta mission : créer leurs 4 compositions, dans le même fichier, avec exactement les mêmes conventions.

## Conventions à respecter strictement (lues dans les compositions existantes)

**Structure.** Chaque composition est une fonction `CompositionXxx()` qui rend `<Composition alt="…" className="w-full max-w-[580px] lg:h-[350px]">`. À l'intérieur : deux cartes (état « avant » discret, état « après » mis en valeur) reliées par `<Connector />`. Le wrapper `Composition` gère déjà l'accessibilité (sr-only + `aria-hidden`) et le responsive : **sous `lg` les enfants s'empilent en colonne centrée, à partir de `lg` ils passent en positions absolues** — chaque carte porte donc ses classes `lg:absolute lg:left-… lg:top-…` (ou `bottom`/`right`), comme dans les deux exemples.

**Cartes.** Carte « avant » : `w-[236px]` à `w-[252px]`, `rounded-card border border-hairline bg-surface text-ink shadow-float`, `lg:absolute lg:left-0 lg:top-0 lg:z-[1]`. Carte « après » : `w-[280px]` à `w-[300px]`, `shadow-hero`, `lg:absolute lg:bottom-0 lg:right-0 lg:z-[3]`, souvent coiffée d'un liseré `<div className="h-[3px] bg-turquoise" />`. Connecteur entre les deux : `<Connector className="lg:absolute lg:left-[245px] lg:top-[142px]" />` (ajuste `left` à la largeur de la carte gauche + ~10px).

**En-têtes de carte.** Ligne `flex items-center justify-between` avec label `font-mono text-[10.5px] uppercase tracking-[0.1em] text-quiet` + méta à droite (`font-mono text-[10px] text-quiet` ou chip `rounded-chip bg-ecume px-2 py-1 font-mono text-[10px] text-ink-ecume`), bordure basse `border-b border-hairline` ou `border-[rgba(16,24,40,0.05)]`.

**Vocabulaire visuel disponible.** `Bar` (lignes de texte factices, `width` en %), chips badges (`bg-canard text-white`, `bg-ecume text-ink-ecume`, `bg-periwinkle text-ink-periwinkle`, `bg-toile text-slate`), encart d'alerte `rounded-[3px] px-3 py-[10px]` sur fond `#F5F7F9`, pied de carte `flex items-center justify-between border-t … text-[11px]` avec conclusion chiffrée à droite en `font-mono font-semibold text-ink-ecume`.

**Interdits.** Aucune image, aucun SVG externe, aucun emoji (le ⚠ existant est toléré), aucune nouvelle dépendance, aucune couleur en dur hors de celles déjà utilisées dans le fichier, pas de lorem ipsum. Tout le contenu est du HTML/Tailwind avec les tokens du projet. Textes 100 % français, réalistes et métier (comme « Greffe TC · convocation » ou « Indexation ILC »), typographie française (espaces insécables avant `?` `:` `€`, `&apos;` pour les apostrophes en JSX).

**Tailles de texte.** Titres de carte `text-[13.5px]`/`text-[14px] font-bold tracking-[-0.01em]`, corps `text-[12.5px]`, méta `text-[11px]`–`text-[11.5px]`, mono `text-[9.5px]`–`text-[10.5px]`. Ne pas dépasser.

## Les 4 compositions à créer

### 1. `CompositionDevis` — cas 1 « Le devis part à 22 h »

Avant : carte « Note vocale · 18:47 » — une forme d'onde stylisée (rangée de `span` verticaux de hauteurs variées, `bg-bar-track`, arrondis), durée `1:12` en mono, et en dessous la transcription qui commence en `text-[11px] text-faint italic` (« …remplacement chaudière, comptez la dépose, le client veut… »).
Après : carte « Devis n° 2026-084 » avec liseré turquoise — 3 lignes de devis (désignation à gauche, montant mono à droite : dépose ancienne chaudière 380 €, fourniture + pose 2 940 €, mise en service 220 €), total `3 540 € HT` en gras, pied de carte « prêt à valider » à gauche / `18:52 · 5 min` en mono turquoise-encre à droite.

### 2. `CompositionReunion` — cas 3 « Deux heures de réunion, zéro compte-rendu »

Avant : carte « Enregistrement · réunion chantier » — durée `1 h 54` en gros mono, une piste audio en `Bar` de largeurs variées, mention « 4 intervenants » en méta.
Après : carte « Compte-rendu · 12 juin » — 3 rubriques via le composant `Rubrique` existant : `DÉCISIONS` (« Livraison lot B avancée au 3 juillet »), `ACTIONS` (« M. Rivière : devis étanchéité → vendredi »), `SUIVI` (« Point hebdo fixé au mardi 9 h »), pied de carte « décisions · qui · pour quand » / `1 page`.

### 3. `CompositionImpaye` — cas 4 « L'impayé qui traîne depuis 60 jours »

Avant : carte « Facture F-2026-031 » — montant `4 820 €` bien visible, chip `bg-canard text-white` « +60 j », ligne méta « échéance : 28 mai · 2 relances sans réponse ».
Après : carte « Séquence de relance » avec liseré turquoise — 3 étapes empilées, chacune avec chip d'état (chip 1 `bg-ecume` « Envoyée · J+62 » puis extrait « Sauf erreur de notre part… », chip 2 `bg-periwinkle` « Programmée · J+70 » puis « Sans règlement sous 8 jours… », chip 3 `bg-toile text-slate` « Si besoin · J+80 » puis « Mise en demeure — dernier rappel amiable »), pied de carte « fermes, dans votre ton » / `3 relances prêtes`.

### 4. `CompositionFicheClient` — cas 5 « Le rendez-vous dans 20 minutes »

Avant : carte « Dossier client · Sarl Bréhat » — pile de documents évoquée par des `Bar` groupées sous 3 intitulés mono (`DEVIS 2024`, `MAILS · 132`, `CR VISITE 03/2025`), méta « dernière ouverture : il y a 3 mois ».
Après : carte « Fiche de synthèse · Sarl Bréhat » — rubriques `Rubrique` : `HISTORIQUE` (« Client depuis 2019 · 11 commandes »), `ENCOURS` (« 12 400 € · règlement à 45 j »), `FRICTION` (« Litige livraison sept. 2025, résolu »), encart `#F5F7F9` « À aborder : renouvellement contrat cadre (échéance oct.) », pied de carte « une page, à jour » / `prête en 4 min`.

## Branchement

Dans le tableau `CAS`, ajoute `composition: <CompositionDevis />` (etc.) à chacun des 4 cas, en gardant `visuel: null`. Ne touche ni aux textes existants du tableau, ni aux deux compositions déjà en place, ni au mécanisme d'affichage.

## Vérification (obligatoire avant de conclure)

1. `npx tsc --noEmit` puis le lint du projet : zéro erreur.
2. Lance le dev server et vérifie visuellement les 6 cas à 1280 px **et** à 360 px : à `lg` chaque composition tient dans `350px` de haut sans déborder ni chevaucher le connecteur ; en mobile les cartes s'empilent proprement, centrées.
3. Vérifie que chaque `alt` du wrapper `Composition` décrit fidèlement la scène (« Illustration : … »).
4. Vérifie l'orthographe et la typographie française de toute la microcopy (insécables, apostrophes).
5. Compare côte à côte avec `CompositionMails` : mêmes ombres, mêmes rayons, mêmes tailles de texte — l'ensemble doit sembler dessiné par la même main.
