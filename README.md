# Site Marssane

Landing page de Marssane — formation à l'IA pour dirigeants de PME et professions
libérales (avocats, notaires, experts-comptables). Site statique en Next.js
(App Router) + Tailwind CSS v4, sans base de données ni API.

## Prérequis

- Node **24** (le projet est développé et testé sous Node 24).

## Démarrer

```bash
npm install        # installer les dépendances
npm run dev        # serveur de développement (http://localhost:3000)
```

## Build de production

```bash
npm run build      # build optimisé
npm start          # sert le build (next start)
```

Autres scripts : `npm run lint` (ESLint).

## Structure

```
app/                     Routes (App Router)
  layout.tsx             Layout racine : polices, métadonnées, OpenGraph
  page.tsx               Landing (assemble les sections)
  merci/                 Page de confirmation de pré-inscription
  mentions-legales/      Mentions légales
  confidentialite/       Politique de confidentialité
  styleguide/            Recette interne (design system) — hors sitemap
  sitemap.ts             Plan du site (4 routes publiques)
  icon.svg               Favicon (M sur tuile canard)
  globals.css            Tokens de design + toile (quadrillage, washes)
  fonts/                 Polices auto-hébergées (woff2)
components/
  ui/                    Primitifs (Button, Field, Kicker, LogoMarssane…)
  site/                  Sections de la landing (Hero, Formation, Reservation…)
lib/
  site-config.ts         Configuration éditoriale (bascule vidéo du héro)
docs/references/         Maquette et charte graphique (sources de vérité)
```

## Notes

- **Polices auto-hébergées** : Plus Jakarta Sans et Spline Sans Mono sont
  chargées localement via `next/font/local` depuis `app/fonts/` — aucun appel à
  un CDN de polices.
- **Preview `noindex`** : le layout racine pose `robots: { index: false }` tant
  que le site est en préproduction ; à retirer à la mise en ligne définitive.
- **Portabilité** : le site fonctionne avec `next start` de façon autonome et ne
  dépend d'aucune API propre à Vercel — il peut être hébergé sur n'importe quel
  environnement Node. L'URL de base du sitemap est pilotée par la variable
  `NEXT_PUBLIC_SITE_URL`.
