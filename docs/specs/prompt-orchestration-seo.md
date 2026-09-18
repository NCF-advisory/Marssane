# Prompt d'orchestration — SEO & indexation Google de marssane.fr

> À coller tel quel dans l'agent (ChatGPT/Codex) qui travaillera sur le repo. Il contient le contexte, l'état des lieux audité, les tâches précises, les garde-fous et les critères de vérification.

---

## Ta mission

Tu es chargé de rendre le site **marssane.fr** visible sur Google et présentable en partage social, en vue de son lancement commercial. Le site est aujourd'hui **volontairement non indexé** (noindex global posé pendant la construction). Ta mission : lever cette invisibilité proprement, compléter tout le socle SEO technique manquant, et préparer les étapes Google Search Console que le propriétaire fera à la main.

## Contexte du projet

- **Site** : https://marssane.fr — Marssane forme les dirigeants de PME françaises (< 20 salariés) à utiliser l'IA (Claude) sur leurs propres dossiers. Tout le contenu est en français, le ton est sobre et professionnel.
- **Stack** : Next.js 16 (App Router, Turbopack), Tailwind v4, TypeScript. Déployé sur **Vercel** ; un push sur `main` déclenche le déploiement en production.
- **Pages publiques** (toutes en tonalité « encre » sombre) : `/`, `/formations`, `/quelle-ia`, `/implementation`, `/merci` (confirmation post-formulaire), `/confidentialite`, `/mentions-legales`. Espaces privés : `/admin` (login), `/formation` (espace participants), `/styleguide` (recette interne).
- **Domaines** : `marssane.fr` = canonique. `marssane.com` et les `www` redirigent déjà en 308 — ne rien changer aux domaines. DNS chez OVH (zone `marssane.fr`, nameservers ns106/dns106.ovh.net).
- **Conventions du repo** : commentaires de code en français, style existant à respecter, messages de commit en français au format « Sujet : description » (voir `git log`).

## État des lieux (audit du 30/07/2026 — vérifié en production)

1. **`noindex, nofollow` global** : `app/layout.tsx`, dans `metadata` → `robots: { index: false, follow: false }`. C'est LA cause de l'invisibilité.
2. **`robots.txt` absent** : `https://marssane.fr/robots.txt` renvoie la 404 HTML. Aucun `app/robots.ts` n'existe.
3. **Sitemap OK mais perfectible** : `app/sitemap.ts` génère 7 URLs correctes ; `/merci` y figure alors que c'est une page de confirmation sans valeur de recherche.
4. **Aucune balise canonical**, pas de `metadataBase`.
5. **Open Graph incomplet** : pas d'`og:image`, pas d'`og:url` ; `og:title`/`og:description` identiques sur tout le site (hérités du layout). Twitter card `summary` sans image. Un commentaire `// og:image reste à produire` marque l'emplacement dans `app/layout.tsx`.
6. **Favicon incomplet** : seul `app/icon.svg` existe. Pas de `favicon.ico`, pas d'`apple-icon` (Safari/iOS mal servis).
7. **Meta descriptions dupliquées** : `/`, `/merci`, `/confidentialite`, `/mentions-legales` héritent de la description générique du layout. `/formations`, `/quelle-ia`, `/implementation` ont déjà la leur.
8. **h1 faible sur `/quelle-ia`** : le seul h1 de la page est le nom du modèle en tête de classement (ex. « Claude Opus 5 »), pas une formulation qui matche la requête cible « quelle IA utiliser ».
9. Sain par ailleurs : un seul h1 par page, `lang="fr"`, 404 stylée avec vrai statut 404, redirections 308 propres, aucun lien mort, HSTS présent, aucun script tiers.

## ⚠️ Garde-fous impératifs (à lire avant de toucher au repo)

Le repo contient un **chantier parallèle non committé** (« parcours »). Fais `git status` avant tout : tu y verras des modifications locales sur `app/sitemap.ts`, `components/site/Nav.tsx`, `components/quelle-ia/GraphiqueEfficacite.tsx`, le dossier non suivi `app/parcours/` et des images non suivies à la racine. **Interdictions absolues** :

- Ne committe, ne revert et ne stage JAMAIS `components/site/Nav.tsx`, `components/quelle-ia/GraphiqueEfficacite.tsx`, `app/parcours/` ni les fichiers non suivis de la racine.
- **Piège principal — `app/sitemap.ts`** : la version locale ajoute `/parcours`, qui est **en 404 en production**. Si tu dois retirer `/merci` du sitemap, stage UNIQUEMENT ce hunk (`git add -p`) et vérifie avec `git diff --cached` qu'aucune ligne `/parcours` ne part dans le commit. Si le découpage en hunks ne le permet pas proprement, n'y touche pas et signale-le dans ton rapport final.
- Avant chaque commit : `git diff --cached --stat` doit ne contenir QUE des fichiers liés à ta mission SEO.
- Ne réintroduis nulle part une promesse de délai de réponse (« sous 48 h ») ni une mention publique de « liste d'attente » — décisions récentes du propriétaire.
- Ne modifie pas les textes des pages au-delà des metadata et du h1 de `/quelle-ia` sans l'accord du propriétaire.

## Tâches — partie code

### 1. Lever le noindex, en le gardant là où il faut
- Dans `app/layout.tsx` : supprimer `robots: { index: false, follow: false }` des metadata globales.
- Poser un `robots: { index: false, follow: false }` **ciblé** dans les metadata de : `/admin` (et son sous-arbre), `/styleguide`, `/formation` (espace participants), `/merci`. La 404 est déjà noindex.

### 2. Créer `app/robots.ts`
- `Allow: /` par défaut ; `Disallow: /admin`, `/styleguide`, `/formation`, `/api` ; ligne `Sitemap: https://marssane.fr/sitemap.xml`.

### 3. `metadataBase` + canonical
- `metadataBase: new URL("https://marssane.fr")` dans le layout.
- `alternates: { canonical: ... }` sur chaque page publique (`/` → `/`, `/formations` → `/formations`, etc.).

### 4. Open Graph et Twitter complets
- Produire une **og:image 1200×630** sobre et fidèle à la charte : fond encre très sombre, logo « M+ » et wordmark Marssane (voir `components/ui/LogoMarssane.tsx` pour les formes et couleurs — turquoise/canard sur encre), typographie Plus Jakarta Sans, une accroche courte (« La formation IA des dirigeants de PME »). La déposer en `app/opengraph-image.png` (convention Next) ou la déclarer explicitement dans les metadata.
- Chaque page publique : `openGraph.title`/`description` alignés sur son title/description propres, `openGraph.url`, `twitter: { card: "summary_large_image" }`.

### 5. Favicons
- Ajouter `app/favicon.ico` (32×32, dérivé de `app/icon.svg`) et `app/apple-icon.png` (180×180, fond encre, « M+ » centré). Garder `icon.svg`.

### 6. Meta descriptions uniques
- Rédiger des descriptions spécifiques (150-160 caractères, en français, orientées bénéfice client) pour `/`, `/confidentialite`, `/mentions-legales`. `/merci` passe noindex, sa description importe peu.
- Ne pas toucher aux descriptions déjà spécifiques de `/formations`, `/quelle-ia`, `/implementation`.

### 7. Sitemap
- Retirer `/merci` de `app/sitemap.ts` — en respectant scrupuleusement le garde-fou `git add -p` décrit plus haut.

### 8. h1 de `/quelle-ia`
- Faire du titre éditorial (« Quelle IA utiliser aujourd'hui ? » ou équivalent existant sur la page) le h1, et rétrograder le nom du modèle gagnant en h2 ou en texte stylé. Zéro changement visuel attendu : ajuste les classes pour conserver exactement le rendu actuel. Attention : reste dans `app/quelle-ia/page.tsx` et les composants NON listés dans les interdictions (pas `GraphiqueEfficacite.tsx`).

### Vérifications avant de committer
- `npx tsc --noEmit`, `npm run lint`, `npm run build` : tous verts.
- Sur le build local : plus de meta robots noindex sur les pages publiques, présence des canonical, og:image résolue en URL absolue https://marssane.fr/…, robots.txt généré.
- Commits par lots logiques, messages en français.

## Tâches — partie manuelle (à préparer pour le propriétaire, pas à exécuter)

Rédige à la fin de ton travail un pas-à-pas court pour :
1. **Google Search Console** : créer une propriété de type « Domaine » pour `marssane.fr` ; ajouter l'enregistrement **TXT de vérification dans la zone DNS OVH** (manager OVH → Domaines → marssane.fr → Zone DNS) ; attendre la propagation puis valider.
2. **Soumettre le sitemap** (`https://marssane.fr/sitemap.xml`) dans Search Console.
3. **Demander l'indexation** des 4 pages clés via l'inspection d'URL : `/`, `/formations`, `/quelle-ia`, `/implementation`.
4. Optionnel : Bing Webmaster Tools (import direct depuis Search Console).
5. Rappeler le délai réaliste : quelques jours pour « Marssane », plusieurs semaines pour les requêtes concurrentielles (« formation IA dirigeant PME », « formation Claude entreprise »…).

## Rapport final attendu

- Liste des fichiers modifiés/créés avec une ligne d'explication chacun.
- La sortie de `git diff --cached --stat` de chaque commit (preuve qu'aucun fichier du chantier parcours n'est parti).
- Les vérifications effectuées et leurs résultats.
- Le pas-à-pas Search Console.
- Tout point laissé en suspens (ex. sitemap non touché si le hunk était insécable).
