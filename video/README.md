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
    components/         Toile · primitives · MarssaneLogo · AiLogo (glyphe partagé)
    scenes/             G1Hook · G2Pile · G3Colonnes · G4Tri · G6Cartes · G7Cta
  scripts/render-stills.mjs
```
