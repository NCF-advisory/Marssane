# Vidéo du héro Marssane (Remotion)

Sous-projet **isolé** (son propre `package.json`, son propre `tsconfig`). Il
ne partage rien avec le site : il est exclu du `tsconfig.json` et du lint du
site. Rien n'a été ajouté aux dépendances du site.

## Ce que c'est

La vidéo de présentation affichée dans la moitié droite du héro (CDC §5.6 / F6).

- Composition `HeroVideo` : **1080×1350 (4:5)**, **30 fps**, **720 frames = 24,0 s**.
- Boucle parfaite : la dernière frame fond vers l'état initial de la boîte non
  triée (frame 719 ≡ frame 0, vérifié par hash).
- Sans son.
- Polices chargées **localement** depuis `public/fonts/` (copie des woff2 du site,
  `app/fonts/`) — aucun appel réseau.
- Principe « le texte promet, la vidéo prouve » : **trois démos d'interface**
  enchaînées en fondu, aucun texte narratif ni carton titre. Le seul texte est
  celui des interfaces.
  1. La boîte qui se trie (badges Urgent / À traiter / En attente / Classé, 6 / 47).
  2. Le dossier qui se résume (42 pages → 12 lignes, source : p. 17).
  3. La note vocale qui devient courrier (onde → brouillon à valider).

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
npm run render:poster  # -> ../public/video/hero-poster.jpg (frame 170, boîte triée)
npm run render:all     # les trois ci-dessus
```

Pour viser un poids plus faible, augmenter le `--crf` dans `package.json`
(H.264 : 30→34 ; VP9 : 36→40). Poids actuel bien en dessous des 8 Mo du CDC.

## Stills de revue

```bash
npm run render:stills            # 8 PNG (1 par scène + 2 intermédiaires)
npm run render:stills -- /chemin # dossier de sortie personnalisé
```

## Brancher la vidéo sur le site

Une fois validée, renseigner `lib/site-config.ts` (voir le commentaire de
`heroVideo`) — aucun composant à modifier :

```ts
export const heroVideo = {
  mp4: "/video/hero.mp4",
  webm: "/video/hero.webm",
  poster: "/video/hero-poster.jpg",
};
```

## Structure

```
video/
  package.json          scripts de rendu
  remotion.config.ts    config d'encodage
  public/fonts/         woff2 (copie locale des polices du site)
  src/
    index.ts            registerRoot
    Root.tsx            déclaration de la composition
    HeroComposition.tsx timeline + crossfades + boucle
    theme.ts            tokens (repris de app/globals.css)
    anim.ts             helpers d'animation
    fonts.ts            chargement local des polices
    components/         Toile (fond), primitives (Card, Chip, TextBar)
    scenes/             DemoInbox · DemoDocument · DemoLetter
  scripts/render-stills.mjs
```
