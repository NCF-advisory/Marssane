# Audit SEO / GEO de Marssane — 17 septembre 2026

Objectif : faire reconnaître Marssane d’abord comme un prestataire d’implémentation IA et d’automatisation pour PME. La formation reste une offre complémentaire.

## Conclusion

Le repositionnement est déjà visible dans les métadonnées et dans une grande partie de l’accueil en production. Il reste toutefois une erreur technique prioritaire : **la page `/implementation` demande explicitement sa non-indexation aux moteurs**, alors qu’elle figure dans le sitemap et dans la navigation.

Le descriptif Google orienté formation signalé par le propriétaire peut provenir d’une ancienne version indexée ou d’un extrait sélectionné dans le contenu. L’audit ne permet pas de départager ces hypothèses sans inspection de l’URL dans Search Console. Les vestiges éditoriaux et les publications externes entretiennent par ailleurs l’ancien positionnement.

Il faut traiter dans cet ordre : indexabilité de l’offre principale, cohérence du message de marque, réexploration Google, puis preuves et contenus utiles à la recherche et aux réponses IA.

## Périmètre et limites

Contrôles réalisés sur les réponses HTTPS publiques le 17 septembre 2026 vers 16 h 17, heure de Paris : accueil, implémentation, automatisation, formations, comparateur, ancienne landing formation, quatre pages utilitaires, robots.txt et sitemap.xml. Lecture des titres, descriptions, canoniques, directives robots, titres de contenu et JSON-LD dans le HTML initial ; comparaison avec le code local. Vérification des redirections HTTP et www, et de l’image de partage publique, identique au fichier local inspecté.

Les [constats de production](audit-seo-geo-2026-09-17/constats-production.json) conservent les métadonnées et en-têtes pertinents.

Recherches publiques : `marssane`, `site:marssane.fr`, `"marssane.fr"` et `"Marssane" "IA"`. Le moteur de recherche disponible ne reproduit pas une SERP Google française personnalisée. Aucun rang Google, volume de recherche, taux de clic ou nombre de pages indexées n’est déduit de ces résultats. L’absence de certaines pages dans cette recherche ne prouve pas leur absence de Google.

Non mesurés : Search Console, trafic, conversions, backlinks exhaustifs, Core Web Vitals et fréquence des citations dans ChatGPT, Gemini ou Perplexity. Le GEO est ici un audit de préparation à la découverte et à la citation, pas une mesure de visibilité effective dans ces assistants. Aucun changement du site ni déploiement n’a été effectué.

## 1. État technique constaté

| URL | HTTP | Directive effective observée | Conclusion |
| --- | --- | --- | --- |
| `/` | 200 | `index, follow` | Indexation autorisée |
| `/implementation` | 200 | En-tête `noindex, nofollow`, malgré une meta `index, follow` | Blocage prioritaire |
| `/automatisation` | 200 | `index, follow` | Indexation autorisée |
| `/formations` | 200 | `index, follow` | Indexation autorisée |
| `/quelle-ia` | 200 | `index, follow` | Indexation autorisée |
| `/accueil-formation` | 200 | `noindex, nofollow` | Ancienne landing déjà exclue |
| `/styleguide`, `/formation`, `/diagnostic-video`, `/explorations/cta` | 200 | `noindex, nofollow` | Pages utilitaires exclues |

« Indexation autorisée » n’indique pas que Google a effectivement indexé la page.

**Origine du blocage :** `next.config.ts`, ligne 17, inclut `/implementation` dans les routes recevant `X-Robots-Tag: noindex, nofollow`. Google retient la règle restrictive en cas de contradiction. La meta HTML positive et la présence dans le sitemap ne neutralisent donc pas cet en-tête. [Documentation Google](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

**Correction à préparer :** retirer uniquement `/implementation` de cette liste ; conserver la protection des pages privées et utilitaires. Après publication, vérifier le GET public, la meta, la canonique et l’inspection d’URL avant de demander l’indexation.

Points sains à préserver :

- Titres et descriptions propres aux pages commerciales, canoniques cohérentes avec `https://marssane.fr`.
- HTTP et www redirigent en 308 vers HTTPS sans www pour l’accueil testé.
- `robots.txt` autorise les pages commerciales, référence le sitemap et ne bloque pas globalement les robots IA. Cela ne vérifie pas les éventuelles restrictions de l’hébergeur envers chaque robot.
- Sitemap accessible avec sept URL, dont les trois pages commerciales principales.
- Contenus, FAQ et liens accessibles dans le HTML initial ; les vidéos ne portent pas seules l’explication des offres.
- Navigation : implémentation, automatisation, puis formations.

## 2. Pourquoi Google peut encore parler de formation

L’accueil sert déjà ce titre : **Implémentation IA et agents pour PME à Lyon | Marssane**.

Sa description commence déjà par : **Marssane installe des agents IA dans votre PME près de Lyon**. Le JSON-LD de l’organisation reprend cette description.

L’hypothèse « la meta description actuelle de l’accueil parle encore de formation » est donc écartée. Google construit ses extraits à partir du contenu et utilise parfois la meta description ; le texte peut varier selon la requête. [Fonctionnement des extraits Google](https://developers.google.com/search/docs/appearance/snippet).

À vérifier dans Search Console : URL exacte du résultat observé, date du dernier crawl, HTML exploré et canonique retenue. Si le résultat pointe vers `/formations`, un extrait sur la formation est cohérent avec cette page ; c’est alors la présence de l’accueil sur la requête de marque qu’il faut travailler. S’il pointe vers `/`, comparer la version explorée avec la production actuelle.

Les notes du projet documentent une publication récente, mais elles ne prouvent pas que Google l’a déjà explorée. Le blocage de `/implementation` nuit à cette page stratégique ; il ne suffit pas, à lui seul, à expliquer l’ancien extrait de l’accueil.

Autres incohérences vérifiées :

| Signal | Constat | Action recommandée |
| --- | --- | --- |
| Image de partage | Texte « La formation IA des dirigeants de PME » | Nouvelle image générale consacrée à l’implémentation et aux automatisations ; variante formation pour `/formations` |
| Texte alternatif Open Graph | Ancienne promesse formation dans `lib/seo.ts` et `app/layout.tsx` | Harmoniser avec l’image et l’offre principale |
| Offres de l’accueil | Carte formation avant implémentation dans le HTML | Placer l’implémentation en premier, présenter la formation comme complément |
| Pied de page | « Votre formateur » | Libellé fondateur/expertise et destination accessible appropriée |
| Entité Person | « Fondateur et formateur de Marssane » | Décrire le rôle d’implémentation, en cohérence avec la biographie visible |
| Présence externe | Publication de lancement et relais LinkedIn centrés sur la formation | Actualiser les présentations maîtrisées et publier des réalisations d’implémentation |

L’image Open Graph concerne principalement les aperçus de partage : ce n’est pas une cause démontrée de l’extrait textuel Google.

La [publication de lancement de Cléante Oullion](https://fr.linkedin.com/posts/cl%C3%A9ante-oullion-a555291a1_je-lance-mon-nouveau-projet-marssane-la-activity-7501276771967754242-NVNV) et son [relais par Frédéric Lemonnier](https://fr.linkedin.com/posts/flemonniernovances_dirigeants-dentreprises-venez-d%C3%A9couvrir-activity-7501287165444894722-ZEZ9) placent la formation avant l’implémentation. C’est un signal de cohérence de marque à faire évoluer, pas une preuve de causalité sur le snippet Google.

## 3. Positionnement et textes proposés

Phrase de référence : **Marssane conçoit et déploie des agents IA et des automatisations sur mesure pour les PME.**

Proposition de titre d’accueil :

> Marssane | Implémentation IA et automatisation pour PME

Proposition de meta description :

> Marssane déploie des agents IA et automatise les tâches de votre PME : devis, mails, relances et reporting. Intégration à vos outils, passation ou maintenance.

Proposition de H1 :

> Implémentation IA et automatisation pour les PME

Proposition de texte introductif visible :

> Nous concevons et installons des agents IA et des automatisations dans vos outils existants. Devis, suivi client, relances, comptes rendus : nous partons de vos tâches pour construire un système utile, puis organisons sa passation ou sa maintenance.

Le H1 actuel met en avant le gain de temps sans nommer l’IA ni l’automatisation. L’accroche suivante apporte déjà une partie du contexte. L’amélioration consiste à rendre la nature du service explicite immédiatement, sans répéter artificiellement des mots-clés.

La mention de Lyon est actuellement présente dans les métadonnées. Si l’offre d’implémentation vise une clientèle nationale, mieux vaut garder la localisation dans une présentation factuelle et réserver la contrainte géographique à la formation en présentiel. La zone réellement desservie reste à confirmer avant rédaction définitive.

Répartition des intentions, sans estimation de volumes :

| Page | Rôle | Requêtes à tester dans Search Console |
| --- | --- | --- |
| Accueil | Marque et offre globale | Marssane, Marssane IA, Marssane automatisation |
| `/implementation` | Déploiement d’agents et assistants | implémentation IA PME, intégration IA entreprise, agent IA sur mesure |
| `/automatisation` | Processus et connexions d’outils | automatisation PME, automatisation tâches administratives, automatisation devis et relances |
| `/formations` | Offre pédagogique complémentaire | formation IA dirigeants Lyon |
| `/quelle-ia` | Aide au choix | quelle IA choisir pour une PME |

Sur `/automatisation`, expliciter l’offre dans le H1 plutôt que la seule formule « Une règle définie déclenche une action ». Corriger aussi l’écart entre le titre « lorsqu’un client ne paie pas » et son exemple qui décrit une relance de devis non signé : ce sont deux processus distincts.

## 4. GEO : rendre Marssane identifiable et ses réalisations vérifiables

Les bases sont présentes : pages métiers, explications textuelles, FAQ, organisation et fondateur identifiés. Google indique que ses fonctionnalités IA reposent sur les fondamentaux SEO ; aucun fichier spécial ou schéma spécifique n’est nécessaire. Une page doit notamment être indexée et autoriser les extraits pour être éligible comme lien dans ces réponses. [Documentation Google sur les fonctionnalités IA](https://developers.google.com/search/docs/appearance/ai-features).

Actions à plus forte valeur :

1. **Publier deux ou trois réalisations documentées.** Le parcours du fondateur cite déjà l’automatisation de rapports, de notes de réunion et de visuels. Pour chaque réalisation : contexte, outils réellement employés, fonctionnement, contrôle humain, périmètre, résultat mesuré si disponible et limites. Un cas interne est valable en le présentant comme tel. Ne pas transformer une démonstration en référence client.
2. **Donner à ces réalisations des URL propres**, reliées depuis l’accueil et les pages de services. Le parcours existe dans le HTML mais est présenté dans une fenêtre ; une page dédiée faciliterait l’accès et la citation d’une réalisation précise.
3. **Étayer les chiffres.** L’accueil annonce deux heures gagnées par jour et +34 % de productivité sans source visible associée. Publier les conditions de mesure et distinguer résultats Marssane, exemples et résultats d’études externes.
4. **Distinguer preuves Marssane et citations générales sur l’IA.** Les paroles de dirigeants proviennent de sources tierces et ne sont pas des avis clients Marssane, selon le code. Elles ne démontrent pas la qualité d’une prestation réalisée par Marssane.
5. **Répondre aux questions de décision.** Expliquer ce qui détermine le prix, le délai, les outils compatibles, la maintenance, les coûts récurrents et les validations humaines. Les FAQ actuelles sont une base utile ; préciser les réponses à partir des pratiques réelles.
6. **Compléter les données structurées de service.** Les deux pages métiers ont un `BreadcrumbList`, mais pas d’entité `Service`. Un balisage `Service` relié à `Organization`, avec une description conforme au contenu visible, apporterait de la clarté sémantique. Ce n’est ni un prérequis ni une garantie de classement ou de citation.
7. **Aligner les présentations externes maîtrisées.** Profil du fondateur, éventuelle page entreprise, présentations partenaires. Une mention factuelle de la collaboration par Novances serait utile si elle correspond à la relation réelle. Le lien sortant vers Novances ne prouve pas qu’un lien retour existe.

Pas de priorité à un fichier `llms.txt`, à un volume massif d’articles génériques ou à l’ajout de balisage sans contenu substantiel. La priorité reste l’accès aux pages et la preuve de l’expertise.

## 5. Ordre de mise en œuvre et validation

| Priorité | Travail | Vérification attendue |
| --- | --- | --- |
| P0 — immédiatement | Supprimer le `noindex` de `/implementation` | GET production sans en-tête bloquant ; meta et canonique cohérentes |
| P1 — même lot | Harmoniser accueil, ordre des offres, image de partage, libellés et entités | Relecture des trois pages principales et contrôle des aperçus |
| P1 — après publication | Inspection d’URL et demande de réexploration de `/`, `/implementation`, `/automatisation` ; contrôle du sitemap dans Search Console | Date de crawl, canonique et statut enregistrés |
| P2 — semaines suivantes | Réalisations documentées, FAQ approfondies, descriptions externes et balisage Service | Sources et résultats vérifiables ; liens internes vers les réalisations |
| P2 — mesure | Suivi SEO, rendez-vous qualifiés et observations des assistants | Comparaison régulière avec une référence datée |

Google indique qu’une réexploration peut prendre de quelques jours à quelques semaines et qu’une demande ne garantit pas l’indexation. Aucun délai ferme ne peut être donné pour le changement de texte dans les résultats. [Demander une réexploration](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

Référence de mesure à constituer dans Search Console : 28 derniers jours, requêtes de marque séparées des requêtes commerciales, pages de destination, impressions, clics, CTR et position moyenne. Suivre surtout les demandes qualifiées d’implémentation et d’automatisation. Comparer à J+14 et J+30, en tenant compte du faible recul et du volume éventuel.

Pour les assistants, répéter un petit jeu de questions : « Que fait Marssane ? », « Qui peut implémenter des agents IA dans une PME à Lyon ? », « Quel prestataire pour automatiser devis et relances ? ». Noter date, assistant, mode avec recherche, réponse et URL citées. Ces observations sont variables et ne constituent pas un classement universel.

Performance : le HTML initial de l’accueil représente environ 375 Ko non compressés ; la vidéo principale locale fait environ 4,6 Mo. Ces tailles justifient un contrôle mobile du chargement et des Core Web Vitals, sans permettre de conclure à un problème de performance. Aucun score Lighthouse n’a été mesuré dans cet audit.

## Fichiers concernés par un futur correctif

- `next.config.ts` : indexabilité de `/implementation`.
- `lib/seo.ts`, `app/layout.tsx`, `app/opengraph-image.png` : message et aperçu général.
- `components/site/HeroAgents.tsx`, `components/site/OffresDeuxVoies.tsx`, `components/site/Footer.tsx` : hiérarchie éditoriale.
- `lib/structured-data.ts`, `components/site/PageExpertise.tsx` : entités et services.
- `app/automatisation/page.tsx` : H1 et cohérence des cas.
- `components/site/Formateur.tsx`, `components/site/ChiffresImplementation.tsx` : matière pour les réalisations et justification des résultats.

Ces fichiers comportent déjà du travail local. Un correctif devra préserver les modifications existantes et être contrôlé en production après publication.
