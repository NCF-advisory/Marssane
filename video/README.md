# Vidéo du héro Marssane (Remotion)

Sous-projet **isolé** (son propre `package.json`, son propre `tsconfig`). Il
ne partage rien avec le site : il est exclu du `tsconfig.json` et du lint du
site. Rien n'a été ajouté aux dépendances du site.

## Ce que c'est

La vidéo de présentation affichée dans la moitié droite du héro (CDC §5.6 / F6).

- Composition `HeroVideo` : **1080×1350 (4:5)**, **30 fps**, **780 frames = 26,0 s**.
- Boucle parfaite : la dernière frame fond vers la toile d'ouverture (frame 779 ≡ frame 0).
- Sans son.
- Polices chargées **localement** depuis `public/fonts/` (copie des woff2 du site,
  `app/fonts/`) — aucun appel réseau.
- Séquencier : ouverture (cadre-repère) · promesse · trier vos mails · résumer un
  dossier · dicter un courrier · formation + clôture.

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
npm run render:poster  # -> ../public/video/hero-poster.jpg (frame 157, scène « promesse »)
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
    components/         Toile, Cadre (logo), primitives
    scenes/             Scene1..Scene6
  scripts/render-stills.mjs
```
