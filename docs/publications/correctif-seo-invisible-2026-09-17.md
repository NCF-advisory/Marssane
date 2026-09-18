# Correctif SEO / GEO sans changement visible — 17 septembre 2026

## Périmètre confirmé

Suite à l’audit, le propriétaire a précisé : aucun changement du contenu visible, des visuels, de la présentation ou des pages existantes. Les propositions éditoriales de l’audit sont donc hors périmètre de cette intervention. Aucun nouveau cas client, chiffre, contenu de page ou publication externe.

## Modifications

- `/implementation` : retrait du `X-Robots-Tag: noindex, nofollow` dans la configuration. Les restrictions des espaces privés et utilitaires sont conservées.
- Métadonnées de l’accueil, Open Graph et Twitter : « Marssane | Implémentation IA et automatisation pour PME » et description centrée sur le déploiement d’agents, les automatisations, les outils existants et l’accompagnement.
- Entité du fondateur : rôle « Fondateur de Marssane », domaines d’expertise conformes à sa présentation, profil LinkedIn public identifié dans l’audit et URL de l’accueil à la place d’une ancre absente.
- `/implementation` et `/automatisation` : graphe JSON-LD reliant service, page, organisation et FAQ. Descriptions et réponses reprises directement des données déjà affichées, sans contenu réservé aux moteurs ni résultats inventés.
- Contrôle SEO existant mis à jour : les deux offres doivent rester indexables ; contrôle des liens entre entités et de la présence effective des descriptions/FAQ dans le HTML hors scripts.

Le sitemap et robots.txt étaient déjà correctement configurés ; ils sont vérifiés sans modification superflue. L’image de partage « formation » reste inchangée, conformément au gel des visuels. Aucune modification des H1, du texte, de la navigation, de l’ordre des offres, des témoignages, des chiffres ni du parcours fondateur.

## Validation avant publication

- Base isolée depuis le commit de production `b2aa32a057ac5075e17c6213de9792d0062af8b9`, sans toucher à l’index ou à l’historique du dossier partagé.
- Les cinq fichiers concernés étaient identiques à la version de production avant intervention.
- Build Next.js Webpack et TypeScript réussis ; ESLint ciblé et `git diff --check` réussis.
- Contrôle HTTP du build : sept pages publiques, six pages noindex, redirection de l’ancien admin, sitemap, robots, canoniques, métadonnées sociales, Service, FAQ et durée de formation conformes.
- Empreintes des sources : aucune image, CSS ou donnée de contenu modifiée. Seul le composant des pages métiers reçoit un script JSON-LD non affiché ; son JSX visible est strictement inchangé.
- Comparaison du `<main>` de l’accueil, de l’implémentation, de l’automatisation et des formations avec le HTML de production avant correctif : mêmes textes, structure, attributs et médias. Seuls les scripts sont exclus et les hashs de classes CSS générés par Webpack/Turbopack sont normalisés.
- Aucune écriture dans les bases, aucun formulaire soumis et aucun e-mail envoyé. Build de contrôle sans secrets ni base de production ; le comparateur utilise son repli local pour ce build. Les sources et le fonctionnement du comparateur restent inchangés.

## Search Console

Aucun navigateur connecté ni accès Search Console authentifié dans cette session. Une intégration GSC Wizard a été proposée pour l’inspection d’URL et les mesures ; son installation/connexion n’est pas confirmée.

Après connexion, relever pour `/`, `/implementation` et `/automatisation` : statut d’indexation, date du dernier crawl, canonique retenue et HTML exploré. Demander la réexploration dans Search Console lorsque l’accès à cette action est disponible. Une inspection d’URL ou une soumission IndexNow ne vaut pas demande d’indexation Google.

Mesure proposée : référence des 28 derniers jours, requêtes de marque séparées des requêtes d’implémentation/automatisation, impressions, clics et pages de destination ; comparaisons à J+14 et J+30. Aucune mesure ni tâche récurrente n’a été créée sans accès aux données.

## Publication

Publié sur https://marssane.fr par le commit `b1d9caf041b9147f6fa4ad51801bb97d14d01f30`.

Déploiement Vercel réussi : https://vercel.com/ncf-advisory-s-projects/marssane/71aV4dx1EjP791iVwqEDKVRsgRG5.

Recette HTTPS après publication réussie : sept pages publiques, six pages noindex, redirection admin, canoniques, sitemap, robots, métadonnées sociales, services et FAQ. `/implementation` répond HTTP 200 sans X-Robots-Tag bloquant, y compris avec un User-Agent Googlebot (ce contrôle ne remplace pas une inspection Google authentifiée).

Comparaison du HTML de production avant/après : contenu, structure et attributs du `<main>` identiques sur l’accueil, l’implémentation, l’automatisation et les formations, hors scripts et hashs CSS normalisés. Aucune modification visuelle apportée.

La demande de réexploration et les mesures Search Console restent à effectuer une fois un accès authentifié disponible. Aucun changement du résultat Google ni aucune indexation effective ne sont prétendus.
