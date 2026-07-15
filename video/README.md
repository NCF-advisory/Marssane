# Vidéo du héro Marssane (Remotion)

Sous-projet **isolé** (son propre `package.json`, son propre `tsconfig`). Il
ne partage rien avec le site : il est exclu du `tsconfig.json` et du lint du
site. Rien n'a été ajouté aux dépendances du site.

## Ce que c'est

La vidéo de présentation affichée dans la moitié droite du héro (CDC §5.6 / F6).

- Composition `HeroVideo` : **1920×1080 (16:9)**, **30 fps**, **900 frames = 30,0 s**.
- Boucle sans à-coup : G1 démarre pleine dès la frame 0 sur une toile quasi
  vide (les mots n'apparaissent qu'ensuite) et G7 se fond vers la toile en toute
  fin — la dernière frame ≈ la première.
- Rythme resserré : crossfades courts (~11 frames), un élément nouveau toutes
  les 3–4 s, easing doux.
- Sans son : tout le sens passe par le texte animé.
- Polices chargées **localement** depuis `public/fonts/` (copie des woff2 du site,
  `app/fonts/`) — aucun appel réseau.

Vidéo narrative de présentation, six séquences enchaînées en crossfade sur la
toile (le brief prévoyait une 7e séquence « G5 · compteur de preuve », retirée
tant que le chiffre n'est pas mesuré) :

| Séq. | Frames | Durée | Contenu |
|---|---|---|---|
| **G1** Hook | 0–126 | ~4,2 s | « OK, l'IA c'est cool. » + logos IA, puis « Mais pour faire **quoi ?** » |
| **G2** Pile | 115–271 | ~5,2 s | Documents des professions cibles qui s'empilent, horloge en accéléré |
| **G3** Colonnes | 260–416 | ~5,2 s | La pile se range en « Installer / Utiliser au quotidien / Automatiser » |
| **G4** Tri | 405–627 | ~7,4 s | Démo : le tri de mails en action (Clients / Urgent / À déléguer) |
| **G6** Cartes | 616–760 | ~4,8 s | « Nous vous formons… » → « … Nous l'implémentons chez vous. » |
| **G7** Final | 749–900 | ~5,0 s | Logo Marssane plein cadre + « Réserver une place » (texte, sans bouton) |

### Bande de sous-titres

Une bande identique en bas d'écran (puce carrée canard + ligne courte) apparaît
à chaque nouvelle séquence, sauf le hook (G1) et le final (G7). Elle est rendue
au niveau de la composition (`HeroComposition`) ; les scènes concernées sont
légèrement remontées (`SAFE_LIFT`) pour ne jamais l'empiéter. Textes : G2 « Le
quotidien : tout s'accumule » · G3 « Trois étapes, une seule journée » · G4 « Le
tri des mails — construit par un participant » · G6 « Formation, puis
implémentation chez vous ».

### Logos IA (G1 et colonne « Installer » de G3)

Les logos des IA utilisées en formation apparaissent en ligne dans G1 (sous le
hook, en stagger, puis estompés) et en tuiles dans G3. Rendus **monochrome
encre**, tailles homogènes (jamais leurs couleurs de marque, pour ne pas casser
la palette). Définis dans `src/logos.ts`, affichés par `components/AiLogo.tsx` :

- **Claude**, **Mistral** : paths officiels de `simple-icons`, inlinés.
- **ChatGPT** : logo officiel OpenAI (« rotor »), récupéré sur Wikimedia Commons
  (« ChatGPT logo.svg »), un pétale répété par rotations de 60°.
- **GLM** : le seul SVG officiel trouvé (Z.ai, Wikimedia) est un export
  Illustrator multi-dégradés/clip-paths, impropre à un rendu monochrome → wordmark
  typographique « GLM ».

`simple-icons` reste installé comme source de référence des deux paths ; il n'est
pas bundlé dans la composition.

## Prérequis

- Node 24 (déjà utilisé pour le site).
- `npm install` dans ce dossier (une seule fois).

```bash
cd video
npm install
```

## Prévisualiser (studio Remotion)

```bash
npm run dev
```

## Re-rendre les livrables

Les sorties vont directement dans le `public/` du site.

```bash
npm run render:mp4     # -> ../public/video/hero.mp4   (H.264, CRF 30)
npm run render:webm    # -> ../public/video/hero.webm  (VP9, CRF 36)
npm run render:poster  # -> ../public/video/hero-poster.jpg (frame 555, démo G4)
npm run render:all     # les trois ci-dessus
```

Poids actuel : mp4 ~2,2 Mo + webm ~1,9 Mo + poster ~0,1 Mo ≈ **4,2 Mo**, bien
sous le seuil de 8 Mo du CDC. Pour viser plus léger, augmenter le `--crf` dans
`package.json` (H.264 : 30→34 ; VP9 : 36→40).

## Stills de revue

```bash
npm run render:stills            # 7 PNG (1 par séquence + 1 pour le hook)
npm run render:stills -- /chemin # dossier de sortie personnalisé
```

## Brancher la vidéo sur le site

`lib/site-config.ts` (`heroVideo`) pointe vers les trois fichiers de
`public/video/` — aucun composant à modifier. `components/site/HeroVideo.tsx`
affiche le média en `aspect-[16/10]` (léger crop latéral en `object-cover` — les
scènes gardent leur contenu dans une marge sûre), avec autoplay muet en boucle,
et respecte `prefers-reduced-motion` (poster + contrôles natifs). La colonne
média du héro (`components/site/Hero.tsx`) a été élargie pour un média plus grand.

## Vidéo Cas 1 — « Trier, prioriser, répondre à vos mails »

Composition `Cas1Mails` : **1350×1080 (5:4)**, **30 fps**, **420 frames = 14 s**,
muette, en boucle sans à-coup (frame 419 ≈ frame 0 : boîte vide à 08:02). Une
seule carte « boîte mail » plein cadre qui vit sur la toile, **contenu générique
PME** — **texte d'interface uniquement** (objets, badges, compteurs, horloge),
aucune phrase narrative.

C'est **Claude (l'IA) qui agit** : présence visible via son logo terracotta
(`CLAUDE_TERRA = #D97757`, constante **locale** à la scène — la charte du site ne
bouge pas) et ses libellés (« Claude · tri en cours », « brouillon rédigé par
Claude », « triée par Claude »). Deux acteurs distincts : Claude (terracotta)
trie et rédige ; l'humain (pointeur souris noir) valide. Les badges de tri
gardent leurs couleurs de charte — le terracotta reste réservé à Claude. Quatre
plans enchaînés dans la même carte :

| Plan | Frames | Contenu |
|---|---|---|
| **1** Accumulation | 0–90 | Les mails PME tombent en stagger (intervalle qui se resserre), compteur 41 → 47 |
| **2** Claude trie | 90–200 | Pastille « Claude · tri en cours » ; un balayage terracotta descend la liste et les badges (Urgent · À traiter · En attente) poppent dans son sillage ; le reste se replie dans « Classé · 41 » |
| **3** Claude rédige, l'humain décide | 200–326 | Le mail « Client · Durand » s'ouvre : chip « brouillon rédigé par Claude », réponse à la machine à écrire (caret terracotta), puis le pointeur humain clique « Relire & envoyer » → puce `envoyé` |
| **4** Résultat | 326–420 | Liseré turquoise, chip « triée par Claude » (mini-logo terracotta), horloge 08:03, pied « à traiter ce matin · 6 / 47 », puis retour à l'état vide pour boucler |

Rendus (sorties dans le `public/` du site) :

```bash
npm run render:cas1:mp4     # -> ../public/video/cas1.mp4   (H.264, CRF 30)
npm run render:cas1:webm    # -> ../public/video/cas1.webm  (VP9, CRF 36)
npm run render:cas1:poster  # -> ../public/video/cas1-poster.jpg (frame 370, état trié)
npm run render:cas1         # les trois ci-dessus
```

Poids : mp4 ~1,0 Mo + webm ~0,8 Mo + poster ~0,1 Mo ≈ **1,9 Mo**.

Branchement : `lib/site-config.ts` (`cas1Video`) pointe vers les trois fichiers ;
`components/site/CasVideo.tsx` affiche le média en `aspect-[5/4]` (autoplay muet
en boucle, `prefers-reduced-motion` → poster + contrôles natifs). Tant que
`cas1Video` vaut `null`, le cas 1 garde son visuel statique.

## Vidéo Cas 2 — « Synthétiser vos documents et préparer vos réunions »

Composition `Cas2Synthese` : **1350×1080 (5:4)**, **30 fps**, **420 frames = 14 s**,
muette, en boucle sans à-coup (frame 419 ≈ frame 0 : document nu, corps vierge).
Une seule carte plein cadre qui bascule du document brut vers sa synthèse,
**contenu générique PME** — **texte d'interface uniquement** (en-têtes,
rubriques, compteurs, sources), aucune phrase narrative.

Deux acteurs : **Claude lit et synthétise** (présence terracotta,
`CLAUDE_TERRA = #D97757`, constante **locale** à la scène ; logo terracotta,
pastille « Claude · lecture en cours », chip « rédigée par Claude », caret de
saisie terracotta) ; l'**humain vérifie** (pointeur souris noir). Quatre plans :

| Plan | Frames | Contenu |
|---|---|---|
| **1** Le document | 0–90 | Une carte « Contrat fournisseur · 42 pages · 2,4 Mo » s'assemble, corps rempli de barres, compteur de pages 1 → 42 |
| **2** La demande | 90–150 | Champ de saisie : « Résume ce contrat, points d'attention. » à la machine à écrire (caret terracotta), puis envoi |
| **3** Claude lit & synthétise | 150–300 | Pastille « Claude · lecture en cours » + halo terracotta sur les barres (compteur 1 → 42), puis la synthèse se construit (rubriques PRIX · DURÉE · RÉSILIATION avec sources p. 17 / p. 4 / p. 23, encadré « ⚠ 2 points d'attention ») |
| **4** L'humain vérifie | 300–420 | Le pointeur clique « source : p. 17 » → l'extrait de la page 17 s'ouvre, passage surligné (écume), puis retour au document pour boucler |

```bash
npm run render:cas2:mp4     # -> ../public/video/cas2.mp4   (H.264, CRF 30)
npm run render:cas2:webm    # -> ../public/video/cas2.webm  (VP9, CRF 36)
npm run render:cas2:poster  # -> ../public/video/cas2-poster.jpg (frame 300, synthèse complète)
npm run render:cas2         # les trois ci-dessus
```

Poids : mp4 ~0,9 Mo + webm ~0,65 Mo + poster ~0,1 Mo ≈ **1,6 Mo**. Branchement :
`lib/site-config.ts` (`cas2Video`) ; tant qu'il vaut `null`, le cas 2 garde son
visuel statique (colonne à gauche en desktop).

## Vidéo Cas 3 — « Automatiser un process de votre travail »

Composition `Cas3Process` : **1350×1080 (5:4)**, **30 fps**, **420 frames = 14 s**,
muette, en boucle sans à-coup (frame 419 ≈ frame 0 : tableau à 08:02, statuts
« émise »). Angle **relances d'impayés**. Une seule carte plein cadre, **contenu
générique PME** — **texte d'interface uniquement** (tableau, badges, objets,
compteurs), aucune phrase narrative.

Deux acteurs : **Claude enchaîne le process** (présence terracotta ; pastille
« Claude · relances en cours », chip « brouillon rédigé par Claude », caret
terracotta) ; l'**humain valide** (pointeur souris noir). Les badges de retard
utilisent `clay` (état de l'interface, pas Claude). Quatre plans :

| Plan | Frames | Contenu |
|---|---|---|
| **1** Le déclencheur | 0–90 | Tableau « Factures émises · 08:02 » ; trois lignes basculent en retard (badges J+30 · J+22 · J+15 en clay), chip « 3 impayées » |
| **2** Claude enchaîne | 90–240 | Pastille « Claude · relances en cours » ; trois brouillons de relance se génèrent en cascade (destinataire, objet, demi-ligne à la machine à écrire + barres, chip « brouillon rédigé par Claude ») |
| **3** L'humain valide | 240–330 | Le pointeur clique « Envoyer les 3 relances » (bouton canard) → les trois chips passent à `envoyé` en cascade |
| **4** Le résultat | 330–420 | Retour au tableau : statuts « relancé » (écume), horloge 08:04, bandeau « 3 relances envoyées · 08:04 » + « prochain passage : demain 08:00 », puis retour à l'état initial pour boucler |

```bash
npm run render:cas3:mp4     # -> ../public/video/cas3.mp4   (H.264, CRF 30)
npm run render:cas3:webm    # -> ../public/video/cas3.webm  (VP9, CRF 36)
npm run render:cas3:poster  # -> ../public/video/cas3-poster.jpg (frame 360, tableau « relancé »)
npm run render:cas3         # les trois ci-dessus
```

Poids : mp4 ~1,0 Mo + webm ~0,76 Mo + poster ~0,1 Mo ≈ **1,8 Mo**. Branchement :
`lib/site-config.ts` (`cas3Video`) ; tant qu'il vaut `null`, le cas 3 garde son
visuel statique (colonne à droite en desktop).

## Structure

```
video/
  package.json          scripts de rendu
  remotion.config.ts    config d'encodage
  public/fonts/         woff2 (copie locale des polices du site)
  src/
    index.ts            registerRoot
    Root.tsx            déclaration de la composition (1920×1080)
    HeroComposition.tsx timeline + crossfades + boucle
    theme.ts            tokens (repris de app/globals.css)
    anim.ts             helpers d'animation
    fonts.ts            chargement local des polices
    logos.ts            paths/wordmarks des IA (Claude, ChatGPT, Mistral, GLM)
    components/         Toile · primitives · MarssaneLogo · AiLogo · ClaudeMark · Cursor
    scenes/             G1Hook · G2Pile · G3Colonnes · G4Tri · G6Cartes · G7Cta · Cas1Mails · Cas2Synthese · Cas3Process
  scripts/render-stills.mjs
```
