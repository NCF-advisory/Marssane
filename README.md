# Site Marssane

Landing page de Marssane — formation à l'IA pour dirigeants de PME et professions
libérales (avocats, notaires, experts-comptables). Next.js (App Router) +
Tailwind CSS v4, avec pré-inscription en base Postgres (Supabase en v1).

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

## Base de données

Postgres (Supabase en v1, portable vers OVH — accès Postgres standard, sans SDK
propriétaire). La connexion se fait via la variable `DATABASE_URL`.

1. Créer un projet sur [supabase.com](https://supabase.com) (région UE).
2. Copier l'URI du **pooler** (Project Settings → Database → Connection string →
   « Transaction pooler », port 6543) dans `.env.local` (voir `.env.example`).
3. Appliquer le schéma et insérer une session de test :

```bash
npm run db:migrate    # crée les tables (idempotent)
npm run db:seed        # insère une session de test publiée (J+30, 10 places)
```

Les migrations SQL vivent dans `db/migrations/` ; la table `_migrations` assure
l'idempotence. Migrer vers OVH plus tard = changer `DATABASE_URL` et relancer
`db:migrate`.

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
app/
  actions/               Server actions (pré-inscription F2)
lib/
  site-config.ts         Configuration éditoriale (bascule vidéo du héro)
  db.ts                  Client Postgres partagé (lazy)
  sessions.ts            Accès données : sessions + création d'inscription
  validation.ts          Schéma zod du formulaire de pré-inscription
  emails.ts              Emails transactionnels (no-op — jalon 3 tâche 3)
db/migrations/           Migrations SQL (schéma)
scripts/                 Scripts Node : db:migrate, db:seed
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
