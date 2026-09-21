# Audit SEO / GEO de marssane.fr — 18 septembre 2026

Périmètre demandé par le propriétaire : améliorations SEO et GEO **sans toucher au contenu visible du site** (textes, visuels, structure des pages). Cet audit prolonge ceux du [6 septembre](audit-seo-geo-2026-09-06.md) et du [17 septembre](audit-seo-geo-2026-09-17.md) et le [correctif publié le 17 septembre](../publications/correctif-seo-invisible-2026-09-17.md) ; il ne répète pas leurs propositions éditoriales. Aucune modification du site n'a été effectuée.

## Conclusion

Le socle technique est sain : titres et descriptions uniques, canoniques, aperçus sociaux, robots.txt, sitemap, un seul H1 par page, redirections propres, pages prérendues, tous les robots de recherche et d'IA reçoivent un 200. Lighthouse mobile donne 100 en SEO, accessibilité et bonnes pratiques sur les cinq pages commerciales.

Trois problèmes méritent un traitement immédiat, tous sans effet sur le contenu :

1. **Le site est absent de l'index Bing** (`site:marssane.fr` : aucun résultat le 18/09). Bing alimente ChatGPT Search, Copilot et DuckDuckGo : c'est aujourd'hui le premier frein GEO mesurable. Google, d'après la Search Console du 29/08, n'avait indexé qu'une page ; le recontrôle prévu début septembre n'est pas documenté.
2. **`/automatisation` charge une image PNG de 1,75 Mo** (`elise.png`) : LCP mobile 7,4 s, score performance 75. `/implementation` charge un PNG de 197 Ko évitable.
3. **Le graphe JSON-LD est incomplet sur `/formations` et `/quelle-ia`** : ces pages référencent l'organisation et le site web par `@id` sans que ces entités soient définies dans la page. Les entités `Organization`, `Person` et `Course` sont par ailleurs pauvres au regard des informations déjà publiées (adresse, SIREN, certifications, lieu et dates de formation).

Le reste relève de l'hygiène : dates de modification réelles dans le sitemap, cache des ressources statiques, poids des vidéos, en-têtes de sécurité, doublon de préchargement.

## Périmètre et méthode

- Lecture du code local (`main` aligné sur `origin/main`, commit `8afe076`) : `app/layout.tsx`, `lib/seo.ts`, `lib/structured-data.ts`, `app/robots.ts`, `app/sitemap.ts`, `next.config.ts`, métadonnées de chaque page, composants vidéo et fil d'Ariane.
- HTML réellement servi par https://marssane.fr le 18/09/2026 vers 17 h 30 (Paris) pour `/`, `/implementation`, `/automatisation`, `/formations`, `/quelle-ia` : balises `<head>`, titres, images, JSON-LD (validité JSON et résolution des `@id`), liens internes et externes.
- En-têtes HTTP et redirections : HTTP, www, `.com`, slash final, 404, pages `noindex`, `robots.txt`, `sitemap.xml`, `/llms.txt`.
- Accès de 12 robots (Googlebot, bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot, Applebot, Bytespider, meta-externalagent, Amazonbot, CCBot) par User-Agent.
- Lighthouse 12 mobile simulé, Chrome local, sur les quatre pages commerciales (le quota public de l'API PageSpeed était épuisé).
- Recherches `site:marssane.fr` sur Bing (via un relais externe) et sur le moteur de recherche disponible dans cette session ; DuckDuckGo a renvoyé un captcha.
- Vérification du domaine `marssane.com` : depuis ce réseau, un proxy TLS Novances intercepte la connexion (certificat interne, HTTP 403) ; un relais externe confirme le **308 vers https://marssane.fr/**. Le domaine est bien rattaché au projet Vercel `marssane` (certificats Let's Encrypt valides jusqu'au 13/10/2026).

Non mesurés : Search Console, Bing Webmaster Tools, trafic, Core Web Vitals des visiteurs réels (aucune donnée CrUX), backlinks, citations effectives dans les assistants IA. Aucun formulaire soumis, aucun e-mail envoyé.

## 1. Ce qui est en place et à préserver

| Contrôle | Constat |
| --- | --- |
| Indexabilité | Les 7 pages du sitemap répondent 200, `index, follow`, sans `X-Robots-Tag` bloquant. `/formation/*`, `/styleguide`, `/merci`, `/api/*` restent `noindex`. |
| Canoniques et aperçus | Une canonique par page, alignée sur `og:url`. `og:image` 1200×630 (88 Ko), `og:image:alt`, `twitter:card` large. `lang="fr"`, `og:locale fr_FR`. |
| Titres et descriptions | Uniques sur les 7 pages, longueurs correctes (56 à 61 caractères pour les titres). |
| Structure | 1 H1 par page, hiérarchie H2/H3 cohérente, aucune image sans `alt`. |
| Redirections | HTTP → HTTPS 308 ; www → apex 308 ; `.com` → `.fr` 308 (vérifié depuis l'extérieur) ; slash final → sans slash 308 ; 404 réel avec page dédiée. |
| robots.txt | `Allow: /`, `Disallow: /api/` et le flux de discussion, `Sitemap:` déclaré. Aucun robot IA bloqué ; les 12 User-Agents testés reçoivent le HTML complet. |
| Rendu | Pages prérendues (`x-nextjs-prerender`), servies depuis le cache Vercel, TTFB ≈ 100 ms, HTML de l'accueil 37 Ko en Brotli. HSTS actif. |
| Données structurées | JSON valide partout ; `Organization`, `Person`, `WebSite`, `WebPage`+`FAQPage` sur l'accueil ; `Service` + `FAQPage` + `BreadcrumbList` sur les deux pages métiers ; `Course` sur `/formations`. FAQ visible et balisée depuis la même source. |
| Lighthouse mobile | SEO 100, accessibilité 100, bonnes pratiques 100 sur les 4 pages commerciales. CLS 0 partout. |

## 2. Constats et recommandations

Chaque point indique : le constat vérifié, la recommandation, les fichiers concernés, la vérification attendue. Aucune recommandation ne modifie un texte, un visuel ou une page visible.

### P0 — Découverte et indexation

**2.1 Absent de Bing, et donc des assistants qui s'appuient sur Bing.**
Constat : `site:marssane.fr` sur Bing ne renvoie aucune page le 18/09. Aucun mécanisme IndexNow ni trace de Bing Webmaster Tools dans le projet.
Pourquoi c'est prioritaire : ChatGPT Search, Copilot, DuckDuckGo et une partie de Perplexity s'appuient sur l'index Bing. Un site absent de Bing ne peut pas y être cité, quelle que soit la qualité de son balisage.
Recommandation :
- Propriétaire : créer la propriété dans Bing Webmaster Tools (import possible depuis la Search Console), soumettre `https://marssane.fr/sitemap.xml`, inspecter les 5 pages commerciales.
- Code : mettre en place **IndexNow** — clé publiée dans `public/<clé>.txt`, et notification des 7 URL publiques après chaque déploiement (script `postbuild`, ou route protégée appelée par un hook de déploiement Vercel). Bing, Yandex, Naver et Seznam partagent le protocole ; Google ne l'utilise pas.
Vérification : Bing Webmaster Tools affiche les URL découvertes ; `site:marssane.fr` renvoie les pages sous 1 à 3 semaines.

**2.2 Indexation Google à vérifier et à relancer.**
Constat : au 29/08, une seule page indexée dans la Search Console (mémoire du projet) ; le recontrôle prévu vers le 5–8 septembre n'est pas documenté. Le correctif `noindex` de `/implementation` date du 17/09. Le moteur de recherche de cette session ne renvoie aucune page de marssane.fr (ce n'est pas Google ; ce n'est donc pas une preuve).
Recommandation (hors code, propriétaire) : inspecter `/`, `/implementation`, `/automatisation`, `/formations`, `/quelle-ia` ; demander l'indexation de chacune ; vérifier que le sitemap est lu sans erreur ; consigner la date de crawl et la canonique retenue.
Vérification : rapport « Pages » de la Search Console.

**2.3 `/automatisation` : image de 1,75 Mo, LCP mobile 7,4 s.**
Constat : Lighthouse mobile — performance 75, LCP 7,4 s, 2,17 Mo transférés dont `public/animations/secretaire-digital/elise.png` (1 749 Ko, PNG non optimisé, servi hors `next/image`). Sur `/implementation` : `alma.png` 197 Ko (gain estimé 190 Ko en WebP/AVIF), `noe.jpg` et `marco.jpg` améliorables. Chaque dossier d'animation embarque sa propre copie de `jakarta.woff2` (27 Ko × 5) alors que le site charge déjà cette police.
Recommandation : convertir `elise.png` et `alma.png` en WebP ou AVIF à dimensions identiques (rendu visuel inchangé), mettre à jour la référence dans le script d'animation correspondant ; mutualiser la police en un seul fichier ou réutiliser celle du site. Aucun changement de mise en page.
Fichiers : `public/animations/secretaire-digital/`, `public/animations/secretaire-vocal/`, scripts `marssane-*.js` associés.
Vérification : Lighthouse mobile `/automatisation` — LCP < 3 s, performance > 90 ; comparaison visuelle avant/après des animations.

### P1 — Données structurées et identification de l'entité (GEO)

**2.4 Références `@id` non résolues sur `/formations` et `/quelle-ia`.**
Constat : `/formations` référence `https://marssane.fr/#website` sans le définir ; `/quelle-ia` référence `#organization` et `#website` sans les définir. Les pages métiers et l'accueil, eux, embarquent `siteEntities`. Un lecteur de graphe qui ne suit pas les liens entre pages ne peut pas rattacher ces pages à Marssane.
Recommandation : inclure `siteEntities` dans le graphe de ces deux pages, comme le fait déjà `serviceEntities()`. Alternative plus simple : émettre `Organization`, `Person`, `WebSite` une fois pour toutes dans `app/layout.tsx`, et ne garder dans les pages que leurs entités propres.
Fichiers : `app/formations/page.tsx`, `app/quelle-ia/page.tsx` (ou `app/layout.tsx` + `lib/structured-data.ts`).
Vérification : le contrôle de résolution des `@id` utilisé pour cet audit ne renvoie plus « référence sans définition » ; ajouter ce contrôle à `scripts/check-seo.mjs`.

**2.5 `Organization` : compléter avec ce que le site publie déjà.**
Constat : l'entité porte nom, URL, description, e-mail, logo, fondateur et société mère. Manquent, alors que les mentions légales les affichent : `legalName` (NCF Advisory), `address` (3 Cité Rougemont, 75009 Paris), identifiant légal (SIREN 800 285 363, via `taxID` ou `identifier`), `areaServed` (France), `contactPoint`. Aucun `sameAs` : le profil LinkedIn du fondateur est connu ; une page entreprise LinkedIn ou une chaîne YouTube « marssane » (trouvée en recherche, propriété à confirmer) pourraient s'y ajouter. Le `logo` pointe sur `icon.svg` (327 octets) ; Google recommande aussi une image raster d'au moins 112 × 112 px.
Recommandation : enrichir `siteEntities` avec ces champs, relier l'organisation à ses deux services par `makesOffer` ou `hasOfferCatalog` (les `@id` `/implementation#service` et `/automatisation#service` existent déjà), et déclarer `logo` sous forme d'`ImageObject` pointant vers `apple-icon.png` (180 × 180) ou un PNG dédié.
Fichiers : `lib/structured-data.ts`.
Vérification : test des résultats enrichis Google et validateur Schema.org sans avertissement ; les valeurs correspondent mot pour mot aux mentions légales.

**2.6 `Person` : certifications déjà visibles, non balisées.**
Constat : l'accueil affiche quatre certifications Anthropic Academy (« Claude Code in Action », « AI Fluency », « Model Context Protocol (MCP) », « Claude with the Anthropic API »). L'entité `Person` ne porte que `knowsAbout` et `sameAs`.
Recommandation : ajouter `hasCredential` (quatre `EducationalOccupationalCredential`, `credentialCategory: "certificate"`, émetteur Anthropic Academy), en respectant le garde-fou du composant : ce sont des certifications suivies, pas un agrément d'Anthropic.
Fichiers : `lib/structured-data.ts` (les libellés complets figurent en commentaire dans `components/site/Formateur.tsx`).

**2.7 `Course` : instances, lieu et dates disponibles mais absents du balisage.**
Constat : le `Course` a nom, description, durée (`PT7H`), niveau, `teaches`, `provider`. Google exige `hasCourseInstance` (avec `courseMode`, `courseWorkload`) et `offers` pour le résultat enrichi « informations sur les cours ». `lib/creneaux.ts` contient déjà l'adresse complète (13 Rue Claude Chappe, 69370 Saint-Didier-au-Mont-d'Or), les trois créneaux et l'horaire.
Recommandation : ajouter `hasCourseInstance` (une instance par créneau : `courseMode: "Onsite"`, `location` = `Place` avec `PostalAddress`, `startDate`/`endDate`, `courseWorkload: "PT7H"`, `instructor: {@id: #formateur}`). Pour `offers` : le prix (« Dès 980 € par personne ») n'est visible que sur l'accueil, pas sur `/formations` (décision du 29/07). Deux options cohérentes avec la règle « balisage = contenu visible » : (a) pas d'`offers` sur `/formations`, donc pas d'éligibilité au résultat enrichi ; (b) référencer aussi le `Course` dans le graphe de l'accueil, avec `offers` à 980 EUR, puisque le prix y est affiché. Décision à prendre par le propriétaire.
Attention : les créneaux de septembre 2026 sont passés ou en cours ; le balisage doit suivre la source `CRENEAUX` et disparaître ou évoluer avec elle.
Fichiers : `lib/structured-data.ts`, `lib/creneaux.ts` (lecture seule), éventuellement `app/page.tsx`.

**2.8 Vidéo héro sans `VideoObject`.**
Constat : l'accueil et `/formations` ont chacun une vidéo (`marssane-equipe-agents-v12-blanc-pause-web.mp4`, `hero-v2.webm/mp4`) avec poster. Aucun `VideoObject`.
Recommandation : ajouter un `VideoObject` par vidéo (`name`, `description` factuelle, `thumbnailUrl` = poster, `contentUrl`, `uploadDate` = date du fichier, `duration`), rattaché à la `WebPage` par `video`. Métadonnées uniquement.
Fichiers : `lib/structured-data.ts`, `app/page.tsx`, `app/formations/page.tsx`.

**2.9 Sitemap sans `lastmod`.**
Constat : sept `<loc>` sans date. Le commentaire du code refuse à juste titre une date artificielle.
Recommandation : dériver `lastModified` de la date du dernier commit Git touchant la page et ses composants (au moment du build), ce qui est une date éditoriale réelle. Google utilise `lastmod` s'il est fiable pour prioriser la réexploration — utile après les correctifs des 17 et 18 septembre.
Fichiers : `app/sitemap.ts` (ou génération au build dans un script).
Vérification : `sitemap.xml` publié porte des dates cohérentes avec `git log`.

**2.10 Fil d'Ariane : `/formations` fait exception.**
Constat : `BreadcrumbList` (JSON-LD seul, sans fil d'Ariane visible) sur `/implementation`, `/automatisation`, `/quelle-ia`, mais pas sur `/formations`. Google demande que le balisage reflète le contenu de la page ; l'usage du fil d'Ariane invisible est toléré mais fragile.
Recommandation : à minima, ajouter le `Breadcrumbs` sur `/formations` pour la cohérence. Si le propriétaire accepte un jour un fil d'Ariane visible, la question se règle d'elle-même.
Fichiers : `app/formations/page.tsx`.

### P2 — Performance et hygiène technique

**2.11 Vidéos : poids transféré sur mobile.**
Constat : accueil — 3,5 Mo de vidéo transférés dans le test mobile malgré `preload="metadata"` (Chrome charge une large part du MP4 de 4,8 Mo) ; pas de variante WebM ; LCP 2,8 s. `/formations` — `hero-v2.webm` 1,17 Mo en autoplay ; LCP 2,3 s. Le poster est préchargé **deux fois** (`<link rel="preload">` en doublon).
Recommandation : `preload="none"` sur la vidéo de l'accueil (le poster reste affiché, la lecture démarre au clic), ou fournir une source WebM/AV1 plus légère et une variante mobile via `<source media>`. Supprimer le double préchargement du poster. Aucun changement visuel.
Fichiers : composant vidéo de `HeroAgents`, `components/site/HeroVideo.tsx`, `components/site/HeroMedia.tsx`.
Vérification : Lighthouse mobile — octets « Media » de l'accueil < 500 Ko avant interaction.

**2.12 Cache des ressources statiques.**
Constat : tout `/public` (images, vidéos, animations, image de partage) et les images optimisées `/_next/image` sont servis avec `Cache-Control: public, max-age=0, must-revalidate`. Chaque page suivante et chaque visite répétée revalide chaque image.
Recommandation : dans `headers()` de `next.config.ts`, `Cache-Control: public, max-age=31536000, immutable` pour `/video/:path*`, `/animations/:path*`, `/img/:path*`, `/images/:path*` (fichiers renommés à chaque changement, ce qui est déjà la pratique : `-v12`, `-20260918`) ; `images.minimumCacheTTL` pour l'optimiseur.
Vérification : `curl -I` sur un asset montre le nouvel en-tête.

**2.13 HTML de l'accueil : 375 Ko bruts.**
Constat : 194 Ko de SVG inline (36 `<svg>`) et 176 Ko de charge utile RSC dans 17 `<script>` ; DOM de 1 596 éléments ; 37 Ko une fois compressé. Les logos de témoignages sont rendus trois fois (carrousel), 36 `<img>` sans attribut `sizes`.
Recommandation : pas d'action urgente. Si l'on retouche la section, sortir les gros SVG en fichiers et donner un `sizes` aux logos.

**2.14 En-têtes de sécurité.**
Constat : seul `Strict-Transport-Security` est présent. Absents : `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`, `X-Frame-Options`.
Recommandation : ajouter au moins `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal, `X-Frame-Options: DENY` dans `headers()`. Une CSP demande une recette (scripts d'animation, Vercel Analytics). Signal de confiance ; pas d'effet direct sur le classement.

**2.15 `llms.txt`.**
Constat : absent (404). Google indique qu'il n'influence ni la visibilité ni le classement ; l'adoption par les autres assistants n'est pas démontrée.
Recommandation : optionnel et en dernier. Un fichier court listant les 5 pages commerciales avec une phrase chacune, reprise des descriptions existantes, coûte peu et ne crée aucun contenu nouveau.

**2.16 Mesure terrain.**
Constat : aucune donnée CrUX ; Vercel Analytics est installé, pas Speed Insights.
Recommandation : si l'on veut des Core Web Vitals réels, ajouter `@vercel/speed-insights` (un composant dans le layout). Sinon, se contenter des mesures Lighthouse périodiques.

**2.17 Accessibilité, détail.**
Constat : Lighthouse signale que le lien du logo porte un `aria-label` (« Marssane · retour à l'accueil ») dont le texte visible (« Marssane ») n'est pas le préfixe. Score 100 malgré tout.
Recommandation : commencer l'`aria-label` par « Marssane » ou le retirer au profit du texte visible.

## 3. Hors code — actions du propriétaire

Déjà recommandées le 17/09 et toujours valables : Search Console (inspection et demande d'indexation des cinq pages), cohérence des présentations externes (LinkedIn), mentions par le partenaire Novances. S'y ajoutent : Bing Webmaster Tools (2.1), confirmation de la propriété de la chaîne YouTube « marssane » et d'une éventuelle page entreprise LinkedIn avant tout `sameAs` (2.5), décision sur `offers` du `Course` (2.7).

## 4. Ordre de mise en œuvre proposé

| Lot | Contenu | Vérification |
| --- | --- | --- |
| A — immédiat, hors code | Bing Webmaster Tools + sitemap ; inspections Search Console | URL découvertes dans les deux consoles |
| B — un déploiement | IndexNow (2.1) ; images WebP/AVIF et police mutualisée des animations (2.3) ; `siteEntities` sur toutes les pages (2.4) ; `Breadcrumbs` sur `/formations` (2.10) ; doublon de préchargement (2.11) ; cache statique (2.12) ; en-têtes de sécurité (2.14) | `scripts/check-seo.mjs` étendu (résolution des `@id`, en-têtes) ; Lighthouse mobile `/automatisation` > 90 ; recette visuelle des animations |
| C — après décisions du propriétaire | `Organization`, `Person`, `Course`, `VideoObject` enrichis (2.5 à 2.8) ; `lastmod` Git (2.9) | Validateur Schema.org et test des résultats enrichis sans erreur ; valeurs identiques au contenu visible |
| D — optionnel | `preload="none"` ou variante mobile de la vidéo (2.11) ; Speed Insights (2.16) ; `llms.txt` (2.15) ; `aria-label` du logo (2.17) | Lighthouse et contrôle visuel |

Toute modification devra être déléguée à `dev-opus` avec un brief par lot, puis recontrôlée en production (`node scripts/check-seo.mjs https://marssane.fr`).

## Annexe — Lighthouse 12, mobile simulé, production du 18/09/2026

| Page | Performance | SEO | A11y | BP | FCP | LCP | TBT | CLS | Poids total | Élément LCP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | 96 | 100 | 100 | 100 | 1,1 s | 2,8 s | 10 ms | 0 | 3 829 Ko | `<video>` héro |
| `/implementation` | 94 | 100 | 100 | 100 | 1,7 s | 3,0 s | 10 ms | 0 | 724 Ko | `<h1>` |
| `/automatisation` | **75** | 100 | 100 | 100 | 1,7 s | **7,4 s** | 20 ms | 0 | 2 173 Ko | `<p>` d'introduction |
| `/formations` | 98 | 100 | 100 | 100 | 0,9 s | 2,3 s | 10 ms | 0 | 1 495 Ko | `<video>` héro |

Mesures de laboratoire, une exécution par page, sans donnée terrain : elles indiquent des ordres de grandeur, pas l'expérience réelle des visiteurs.
