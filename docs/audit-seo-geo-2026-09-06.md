# Audit SEO et GEO de Marssane — 6 septembre 2026

**Décisions éditoriales après audit :** le hero a été rétabli dans sa version précédente. À la demande du propriétaire, la page `/parcours` est désormais masquée (404), ses liens sont retirés et le sitemap contient cinq pages publiques. Son contenu est conservé dans `app/_parcours/page.tsx`, hors du routage Next.js. Les relevés à six pages ci-dessous sont historiques ; `scripts/check-seo.mjs` contrôle désormais les cinq pages et le masquage du parcours.

L’audit du site public et du projet a conduit à des corrections techniques, sémantiques et éditoriales, **publiées sur https://marssane.fr le 7 septembre 2026** (commit applicatif `dbe1dc1`, déploiement Vercel réussi). Les constats « avant » ci-dessous décrivent la production du 6 septembre ; les corrections sont désormais en ligne.

Contrôle après publication : `node scripts/check-seo.mjs https://marssane.fr` réussi sur les six pages publiques et cinq pages noindex, sitemap, robots, FAQ et durée du cours. `/parcours` répond 200. Les 16 contrôles Chrome sur quatre largeurs passent sans erreur JavaScript ni débordement horizontal ; FAQ, navigation programme, modale et détails du comparateur vérifiés sans soumission de formulaire.

La durée de la formation a été confirmée par le propriétaire pendant cet audit : **deux séances de 3 h 30, soit 7 heures en présentiel**, auxquelles s’ajoute la pratique personnelle accompagnée.

## Périmètre et méthode

- Exploration HTTP de 14 URL : six pages publiques prévues, cinq pages utilitaires ou privées, une URL inexistante, robots.txt et sitemap.xml.
- Contrôle des variantes HTTP/HTTPS, www/sans www et du slash final.
- Lecture du HTML serveur : titres, descriptions, canoniques, OpenGraph, H1, liens internes, ancres, attributs alt et JSON-LD.
- Inspection du code Next.js 16.3.2 et consultation de sa documentation locale avant modification.
- Lighthouse mobile sur la production et le build local ; tests Chrome à 320, 390, 768 et 1440 pixels ; interactions sans soumission de formulaire.
- Recherche exploratoire de marque et de formations IA pour dirigeants dans la région lyonnaise, puis consultation de recommandations officielles.

Les preuves publiques et locales sont conservées dans [le relevé JSON](audits/seo-geo-2026-09-06.json). Les constats de production et les corrections locales y sont séparés.

**Limites d’accès :** pas de connexion à Google Search Console, Bing Webmaster Tools, aux historiques de trafic, aux journaux des robots ou à un inventaire de backlinks. Les positions, impressions, conversions organiques, citations par les assistants et Core Web Vitals des visiteurs réels ne sont donc pas mesurés. L’absence de Marssane dans les résultats de la recherche exploratoire ne prouve pas une absence d’indexation.

## Diagnostic priorisé et corrections

| Priorité | Constat vérifié | Correction ou suite |
| --- | --- | --- |
| P1 | Le sitemap public est correct, mais le code utilisait localhost si `NEXT_PUBLIC_SITE_URL` était absent, alors que les canoniques utilisaient marssane.fr. | Origine unique dans `lib/seo.ts`, partagée par canoniques, sitemap, robots et JSON-LD. Six routes publiques explicites. Aucune date de modification artificielle. |
| P1 | `/parcours` existe dans le projet mais répond **404 en production**, sans entrée dans le sitemap public. Ses métadonnées locales ne comportaient pas de canonique ni d’aperçu propre. | Route locale enrichie, canonique et aperçus dédiés, ajout au sitemap et liens depuis l’accueil, les formations, la FAQ et le pied de page. La correction de la 404 publique dépend de la publication. |
| P1 | La FAQ indiquait 4 h + 4 h ; le parcours 3 h 45 + 5 h ; les créneaux 14 h–17 h 30. | Harmonisation à 2 × 3 h 30. Durée partagée et `timeRequired: PT7H` dans le cours. Suppression du sous-créneau de construction de 2 h 30, non confirmé dans le nouveau total. |
| P1 | Aucune donnée structurée détectée dans les pages publiques. | Graphe `Organization`, `Person`, `WebSite`, `WebPage` sur l’accueil ; FAQ synchronisée avec le texte visible ; cours débutant sur formations et parcours ; fils d’Ariane sur les pages commerciales internes et le comparateur. |
| P1 | robots.txt bloquait certaines pages portant déjà `noindex`, empêchant les robots de lire cette directive. | Exploration autorisée des pages HTML concernées ; maintien de `noindex` et ajout de `X-Robots-Tag`. Les API et le flux de discussion restent exclus de l’exploration. L’authentification des espaces privés demeure active. |
| P1 | Le comparateur présentait un modèle choisi éditorialement comme le meilleur compromis calculé. Sa formule et ses sources n’étaient pas consultables à l’écran. | Distinction explicite entre sélection éditoriale et premier rang ; sources cliquables, formule 50/25/25, hypothèses de coût, latences manquantes et limites visibles. Tableau HTML des modèles, scores et coûts API. |
| P1 | Une panne de données transformait `/quelle-ia` en simple message d’attente. | Guide de choix métier rendu côté serveur même sans classement, avec lien vers le programme. Aucune donnée de remplacement inventée. |
| P2 | Titres commerciaux peu descriptifs et informations locales peu visibles hors du formulaire. | Titres et descriptions propres à l’intention de chaque page ; présentation directe de l’offre, du public et du lieu près de Lyon ; FAQ sur les prérequis et l’organisation. |
| P2 | La FAQ affirmait que Claude était actuellement l’IA la plus efficace en entreprise et citait un prix d’abonnement fixe. | Explication factuelle du choix pédagogique de Claude ; distinction entre abonnement nécessaire et formation ; retrait du prix changeant de la FAQ publique. |
| P2 | Le premier affichage mobile repose sur le poster vidéo, sans priorité de chargement. | Poster servi par l’optimisation d’images Next.js et préchargé en priorité haute. Environ 76 Ko avant contre 13 Ko dans le relevé local, à format négocié par Chrome. |
| P2 | Le défilement forcé du comparateur devenait incompatible avec une méthode plus longue. | Défilement libre sur mobile, aimantation légère sur grand écran. Tableau défilable horizontalement dans son propre conteneur. |
| P2 | Les libellés de trois formulaires CRM importaient un module contenant Postgres, bloquant la compilation navigateur. | Extraction des libellés dans un module pur, réexportés pour conserver les imports serveur existants. Correction limitée nécessaire à la validation du projet complet. |

Le blocage par robots.txt et l’exclusion de l’index sont deux mécanismes distincts : Google doit pouvoir explorer une page pour y lire `noindex`. [Documentation Google sur noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## Ce qui fonctionnait déjà

La production renvoie 200 sur ses cinq pages indexables actuelles. Chaque page a un H1, une description et une canonique. Le français est déclaré, les aperçus sociaux sont présents et aucun attribut alt manquant n’a été relevé. Les images décoratives utilisent légitimement un alt vide.

HTTP redirige en 308 vers HTTPS ; www redirige en 308 vers le domaine sans www ; `/formations/` redirige vers `/formations`. La variante HTTP + www effectue deux sauts, sans boucle. Une URL inconnue répond 404 et porte `noindex`.

Les polices sont auto-hébergées et les pages commerciales sont rendues côté serveur. Aucun changement d’URL publique existante n’a été nécessaire.

## Intentions de recherche et contenu

| Page | Intention principale | Réponse apportée |
| --- | --- | --- |
| `/` | Formation IA pour dirigeants de PME, région lyonnaise | Public, tâches concrètes, format, formateur, lieu et accès au programme. |
| `/formations` | Choisir un niveau de formation IA | Débutant disponible ; confirmé et expert annoncés comme à venir ; modalités et programme. |
| `/parcours` | Programme de formation IA débutant, durée et prérequis | Deux séances de 3 h 30, pratique intermédiaire, objectifs, étapes et livrables. |
| `/quelle-ia` | Quelle IA choisir pour une PME ? | Comparaison chiffrée, limites, sources et méthode d’essai sur une tâche métier. |
| Pages légales | Identifier l’éditeur et comprendre l’usage des données | Informations existantes conservées, coordonnées accessibles depuis le pied de page. |

Ce ciblage repose sur le contenu réel de l’offre et une recherche qualitative ; aucun volume de recherche ni niveau de difficulté chiffré n’a été inventé. L’accueil présente l’offre ; le catalogue aide à choisir le niveau ; le parcours répond au besoin de programme détaillé.

Le lieu de formation est Saint-Didier-au-Mont-d’Or, près de Lyon. Il ne faut pas confondre ce lieu avec le siège juridique parisien de NCF Advisory. Aucun établissement `LocalBusiness` ni implantation fictive n’a été ajouté.

La recherche locale fait notamment apparaître des offres explicitement positionnées sur les PME lyonnaises chez [OMIA](https://omia.io/formation-ia-lyon/) et sur Claude chez [Arynor](https://arynor.com/formation-claude/lyon/), ainsi qu’une offre stratégique chez [emlyon](https://em-lyon.com/fr/executive/formation-courte/ai-business). Il s’agit de pages trouvées, pas d’un relevé exhaustif de positions ni d’une validation indépendante de leurs promesses. Pour Marssane, l’angle distinctif défendable est le format court en petit groupe, avec travail sur ses dossiers et pratique accompagnée.

## GEO : rendre les informations compréhensibles et citables

Le travail porte sur la disponibilité du contenu dans le HTML, des réponses directes, des entités identifiées et des sources accessibles. La FAQ visible et son JSON-LD utilisent les mêmes données. Le nom du formateur, l’identité de l’éditeur et le programme sont reliés par des identifiants stables.

Le comparateur précise désormais que les coûts concernent l’API, pas les abonnements de chat ; que la conversion dollar/euro est fixe ; que le score est relatif à un échantillon ; et que le pays de l’éditeur ne prouve pas le lieu d’hébergement. Les constantes affichées sont celles utilisées par le calcul. En cas de mélange des indices Artificial Analysis et LMArena, une réserve spécifique est affichée.

La source principale décrit elle-même les limites de ses évaluations : ce sont des mesures de capacités sur des benchmarks, qui ne représentent pas automatiquement la qualité sur chaque cas métier. [Méthodologie Artificial Analysis](https://artificialanalysis.ai/methodology/intelligence-benchmarking).

Aucun avis client, score de satisfaction, agrément, financement, résultat commercial ou cours annoncé n’a été ajouté artificiellement au balisage. Seul le cours débutant, au programme finalisé, est décrit comme `Course`. Le balisage sémantique ne constitue pas une promesse d’affichage enrichi : la documentation Google du résultat « liste de cours » indique notamment des conditions de langue et de nombre de cours qui ne sont pas satisfaites ici. [Documentation Google Course](https://developers.google.com/search/docs/appearance/structured-data/course).

Google indique que les bonnes pratiques SEO restent pertinentes pour ses réponses IA, sans balisage spécial obligatoire. Le fichier `llms.txt` n’a pas été ajouté : Google précise qu’il ne modifie pas la visibilité ou le classement dans son moteur. Le balisage FAQ décrit le contenu pour les systèmes qui le comprennent ; les résultats enrichis FAQ ont été retirés de Google en 2026. [Fonctionnalités IA et sites web](https://developers.google.com/search/docs/appearance/ai-features), [mises à jour Google de juin 2026](https://developers.google.com/search/updates).

## Mesures et validation

| Mesure mobile Lighthouse | Production auditée | Build local, mesure isolée |
| --- | ---: | ---: |
| Performance | 95/100 | 95/100 |
| Accessibilité | 100/100 | 100/100 |
| Bonnes pratiques | 100/100 | 96/100 |
| SEO technique | 100/100 | 100/100 |
| First Contentful Paint | 1,1 s | 1,1 s |
| Largest Contentful Paint | 2,9 s | 2,9 s |
| Total Blocking Time | 0 ms | 0 ms |
| Décalages de mise en page, CLS | 0 | 0 |

Ces mesures de laboratoire comparent une production sur Vercel et un serveur local compilé avec Webpack : elles ne prouvent pas une amélioration de vitesse en production. Le 96/100 local provient d’une requête 404 vers le script Vercel Analytics, absent de `next start` local. Une première mesure locale effectuée pendant les tests navigateur donnait 91/100 ; la mesure isolée est celle retenue, les deux sont conservées dans les preuves. Le LCP reste à surveiller après publication ; la vidéo demeure la ressource la plus lourde, à environ 1,2 Mo transféré pendant le test de production.

Le score SEO Lighthouse était déjà maximal avant les corrections. Il vérifie un ensemble limité de prérequis techniques et ne mesure pas les positions, la pertinence métier, la notoriété ou les citations dans les réponses IA.

Vérifications réalisées :

- `npm run lint` : réussi.
- `npm run build -- --webpack` : compilation, TypeScript et génération des pages réussis. Le build Turbopack par défaut rencontre ici une restriction de création de processus/port ; aucun changement du script de build du projet n’a été imposé.
- `node --test tests/contact-email-routing.test.mjs` : réussi.
- `node scripts/check-seo.mjs http://127.0.0.1:3020` : six pages publiques, cinq pages noindex, canoniques, OpenGraph, sitemap, robots, H1, JSON-LD, égalité FAQ visible/balisage et durée `PT7H` vérifiés.
- Liens internes et ancres des pages publiques parcourues : aucune cible cassée détectée dans le build local.
- 16 contrôles de pages dans Chrome : accueil, formations, parcours et comparateur à quatre largeurs ; aucun débordement horizontal global ni erreur JavaScript.
- FAQ, navigation vers le programme et ouverture/fermeture de la modale : vérifiées sans soumettre le formulaire.
- Comparateur avec données : rendu testé avec trois modèles fictifs uniquement dans un fichier temporaire, incluant sources mixtes, latence manquante et recommandation différente du premier rang. Le tableau et la méthode s’ouvrent sur mobile. Ces données ne sont ni intégrées au site ni écrites en base.
- Comparateur sans données : branche de repli réellement servie par le build local, dont la base était indisponible à la génération ; le guide permanent reste accessible.

## Points restant à traiter et suivi après publication

| Priorité | Action | Condition ou preuve attendue |
| --- | --- | --- |
| Fait le 07/09 | Publier les corrections puis relancer le contrôle HTTP sur marssane.fr. | Déploiement `dbe1dc1` réussi ; `/parcours` répond 200 et figure dans le sitemap publié. Contrôle SEO et tests navigateur publics réussis. Les modifications applicatives existantes sont incluses dans cette publication. |
| P1 | Vérifier l’indexation dans Google Search Console et Bing Webmaster Tools ; soumettre le sitemap et inspecter les quatre pages commerciales. | Accès propriétaire ; vérifier canonique choisie, exploration, exclusions, actions manuelles et éventuels problèmes de sécurité. |
| P1 | Étayer les promesses « 2 h par jour », « +34 % de productivité » et « 10 h par semaine ». | Étude pertinente avec population et contexte, ou mesure de résultats de participants. Le code les présente comme des chiffres fournis par le propriétaire ; cet audit ne les a pas validés et n’en a fait aucune donnée structurée. |
| P1 | Rendre les citations de dirigeants vérifiables par le lecteur et les distinguer clairement d’avis clients Marssane. | Les URL sources existent dans les données, mais leur affichage avait été retiré par décision éditoriale documentée. Les citations n’ont pas été requalifiées en témoignages de clients ni balisées comme avis. |
| P2 | Finaliser les programmes confirmé et expert avant de développer leur visibilité propre. | Remplacer les lignes « Prochainement » par des programmes réellement approuvés ; éviter de créer plusieurs pages minces. |
| P2 | Maintenir à jour dates, prix d’outils et disponibilité des formations. | Les créneaux sont codés pour septembre/octobre 2026. Le prix Claude Pro de 20 €/mois subsiste dans la confirmation privée et les modèles d’email ; à vérifier séparément auprès du fournisseur. |
| P2 | Développer des preuves originales : cas documentés, exemples avant/après et retours de participants autorisés. | Méthode, contexte, date, résultat observable et limites ; ne pas transformer les illustrations en résultats clients réels. |
| P2 | Renforcer les mentions externes pertinentes, notamment auprès du partenaire Novances et de réseaux de dirigeants. | Publications ou liens éditoriaux authentiques, avec accord des parties ; aucune prise de contact ni publication externe n’a été effectuée. |
| P2 | Vérifier une fiche d’établissement si l’activité et le lieu sont éligibles. | Confirmer le lieu d’accueil réel et les coordonnées selon les [consignes Google](https://support.google.com/business/answer/3038177?hl=fr) ; ne pas utiliser l’adresse de salle comme établissement permanent par défaut. |
| P2 | Surveiller la fraîcheur et la méthode du comparateur. | Le calcul conserve ses règles actuelles : conversion fixe, catalogue sélectionné et limites de comparabilité entre sources. Vérifier la chaîne d’actualisation en production et affiner la méthode à partir d’usages mesurés. |
| P2 | Mesurer les performances de terrain et les conversions organiques. | Search Console/CrUX ou mesure consentie adaptée, requêtes de recherche, visites qualifiées, pré-inscriptions abouties et provenance des assistants quand identifiable. |

Dans les premiers jours suivant la publication, contrôler les réponses HTTP et soumettre le sitemap. À deux semaines, examiner les pages découvertes/indexées, les requêtes et les éventuelles erreurs. À quatre semaines, comparer impressions, clics et pré-inscriptions organiques à une période comparable, puis prioriser les contenus selon la demande observée. Pour le GEO, conserver un petit jeu de questions métier et relever à dates fixes les sources citées, sans considérer une réponse isolée d’assistant comme une position stable.

Le contrôle technique est reproductible après démarrage du site :

```bash
node scripts/check-seo.mjs http://127.0.0.1:3020
```

Après publication, utiliser l’origine publique comme argument. Les requêtes de ce script sont uniquement en lecture.
