# Reprise Marssane — mise à jour du 9 septembre 2026

Lire ce fichier avant de reprendre. La conversation précédente est close à la
demande de l’utilisateur ; aucune nouvelle fonctionnalité n’est demandée pour
l’instant. Demander la prochaine tâche après lecture.

## Deux applications distinctes

- Site public : `https://marssane.fr`, dépôt courant
  `/Users/ncf/Documents/Marssane/Site Marssane`.
  Next.js 16.3.2, React 19, PostgreSQL, Resend. Déploiement Vercel automatique
  depuis `main` du dépôt `NCF-advisory/Marssane`.
- ERP : `https://erp.marssane.fr`, dépôt voisin
  `/Users/ncf/Documents/Marssane/erp-marssane`.
  Serveur accessible via l’alias SSH existant `ncfcomps` ; sources de production
  `/home/ubuntu/erp-marssane/app`, service Docker Compose `erp`, conteneur
  `erp-marssane`, image active taguée `erp-marssane:latest`.
- L’ERP local a été utilisé sur `http://127.0.0.1:3010` ; vérifier qu’il tourne
  avant de donner ce lien. Le serveur temporaire du site sur 3022 a été arrêté.
- Lire les AGENTS.md et les guides Next.js installés avant de changer du code.

## Publication ERP via GitHub — installée et vérifiée le 9 septembre

- Dépôt privé : `https://github.com/NCF-advisory/erp-marssane`.
- Depuis le dossier ERP actuel, `npm run publication:verifier` prépare le diff
  sans publier ; `npm run publier -- --message "Description"` publie les sources
  locales via un clone temporaire sans toucher à l'ancien index/historique local.
  Examiner le diff et le périmètre autorisé avant publication.
- Un push sur `main` lance les tests, la compilation sur le VPS, les contrôles
  d'une instance candidate puis la bascule avec retour arrière en cas d'échec.
  Une simple modification locale ne publie rien. Le remote historique `vps`
  reste présent mais le circuit usuel est désormais GitHub.
- Dernière publication vérifiée : `2f02efe77da0aaa00152f5e3d1bac6eac6b07719`,
  workflow `https://github.com/NCF-advisory/erp-marssane/actions/runs/34327118237`.
  Durée : environ 4 minutes, dont 1 minute de publication VPS avec caches.
  Conteneur sain, 464 fichiers conformes au manifeste, version HTTPS exacte,
  navigation vérifiée pour les deux rôles, mobile sans débordement.
- Cette version conserve les ajouts du 9 septembre : création/suppression des
  formations, Participants (5 pour dirigeants PME), simulateur par séance
  indépendant de la durée et frais de structure à 20 %.
- Configuration, accès limités et procédure de retour :
  `../erp-marssane/docs/deploiement-github.md`.
  Les migrations en attente bloquent la publication ; elles ne sont pas
  appliquées automatiquement. Les secrets applicatifs restent sur le VPS.
- Le dépôt GitHub a été initialisé depuis la dernière version publiée du
  9 septembre, pas depuis toutes les modifications locales en cours.

## Dernier problème : vidéo Safari — RÉSOLU

L’utilisateur confirme que le problème est réglé après vérification du mode
économie d’énergie du Mac. `pmset -g custom` montrait `lowpowermode 1`, même
sur secteur. Safari refusait l’autoplay avec `NotAllowedError`, y compris sur
un MP4 sans audio entièrement chargé ; Chrome fonctionnait normalement.
Le réglage Safari du site était déjà « Toujours autoriser » et la préférence
« Réduire les animations » était désactivée.

Ne pas attribuer de nouveau le problème au fichier ou au lecteur sans preuve.
Le premier correctif améliorait la reprise par clic mais n’avait PAS établi
le démarrage automatique sur Safari. Les évaluations JavaScript des tests
WebKit peuvent accorder une activation et biaiser l’autoplay : pour mesurer
un démarrage sans clic, ne pas interroger le DOM pendant la mesure initiale.

Modifications publiées :
- `components/site/useLoopingVideo.ts`, partagé par HeroVideo et CasVideo :
  vidéo muette en boucle, reprise au chargement, à la visibilité, au retour
  sur la page et après interaction ; contrôles natifs en secours ; préférence
  de réduction des animations respectée.
- `/diagnostic-video` : page temporaire noindex, absente des menus/sitemap,
  compare lecteur actuel, MP4 natif, MP4 sans audio ; mesures copiables,
  aucun envoi de rapport. Toujours publiée, pas supprimée lors du nettoyage
  de cette conversation.
- `public/video/hero-v2-sans-audio.mp4` : variante de diagnostic sans piste
  audio, copiée sans réencodage. L’accueil utilise toujours les fichiers v2
  d’origine. Ne pas remplacer la vidéo à nouveau par défaut.
- Dernier commit publié du site : `489ca3e` (diagnostic), précédé de
  `a34429b` (reprise vidéo) et `167f3a6` (fermeture ancien admin).
- Détails : `docs/lecture-video-safari.md`, test `tests/video-public.mjs`.

## Ancien admin du site — fermé et publié

`/admin` et ses sous-routes redirigent en GET/HEAD vers l’ERP ; anciennes
écritures refusées en 410, anciennes connexions désactivées et cookies expirés.
Les liens de sessions conservent leurs identifiants ; le cron de notification
de rappels pointe vers l’ERP. Le site public et `/formation` restent actifs.
Aucune suppression de données ni de comptes participants.

Le module ERP `/formations/gestion` reprend inscriptions, accès, invitations,
rappels, chat, QCM, exports et présentations. Il utilise les tables partagées
`public`, les données ERP étant dans le schéma `erp`. Préserver cette séparation.
L’ancien CRM/facturation/documents n’avait aucun historique dans ses tables.
Voir `docs/publications/retrait-admin-20260908.md` et `tests/admin-retire.mjs`.

## Dernières évolutions ERP publiées

- Flèches diagonales ↗ retirées des cartes et liens partout dans l’ERP.
- Recherche globale retirée d’AppShell : plus de bouton ni de raccourci clavier.
- Communication : cartes « Idées » grises plus visibles ; cartes « Publiés »
  vertes plus marquées. Fonds, bordures, icônes, dates et hover différenciés.
  CSS : `components/organisation/TableauCommunication.module.css`.
- Dernière image publiée par ce fil : `erp-marssane:contraste-kanban-20260908`.
  Images antérieures : `sans-recherche-20260908`, `sans-fleches-20260908`.
  Vérifier l’état réel du serveur avant toute prochaine publication.

## Préférences et décisions produit à conserver

- Français, échanges concis, prendre en charge les changements concrets sans
  demander à nouveau les autorisations déjà données.
- Design Marssane : anthracite, + discrets, cartes peu arrondies, interface
  épurée, animations brèves. Présentation PDF à la racine du site comme référence.
- Todoist, projet Marssane, est l’unique source des tâches, modifiables et
  cochables depuis l’ERP. Dashboard : 7 tâches visibles puis défilement.
- Kanban marketing large et sombre, glisser-déposer et petit +, aucun panneau
  de recherche/filtres superflu. Idées grises ; préparation/validation/prêts
  orange ; publiés verts ; abandonnés rouges.
- Menus Notes, Ma semaine, Gouvernance, Sessions retirés ; Commercial masqué.
  Simulateur indépendant, placé au-dessus de Finance.
- Formations et Implémentations : galeries de missions, accès depuis l’activité
  du dashboard ; détail formation avec roadmap verticale animée.
- NCF porte la formation ; NFA sous-traitant, commission envisagée 20–25 %,
  pas définitivement arrêtée. Ne pas inventer le taux final.
- SharePoint doit servir de stockage/base, pas d’interface utilisateur.
- Authentification ERP requise ; 2FA explicitement reportée. Ne pas réintroduire
  une obligation Tailscale. L’associé possède un accès de consultation.

## Projection annuelle

Le dashboard affiche « ARR » avec précision « Prévisionnel annuel HT » :
projection des formations/implémentations, pas un vrai revenu récurrent.
Connexions faites à `erp.previsions_formations` (migration 015) et budgets missions.
Montants HT confirmés pour 2026 : dirigeants 4 900 €, deux groupes Novances
1 800 € chacun (une séance par groupe), Raffin 1 100 € (une demi-journée).
Total connu : 9 600 € HT ; formation des associés Novances encore à chiffrer.
Les données d’exemple et les bascules démo ont été supprimées.

## Prudence avec le travail partagé et les accès

Le dépôt ERP comporte beaucoup de modifications locales d’autres travaux,
parfois absentes de la version serveur. Ne pas copier aveuglément les fichiers
locaux sur la production : lire les versions en place, sauvegarder, appliquer
seulement la modification demandée, compiler, basculer, puis vérifier en HTTPS.
Ne jamais reset/stash/commit globalement les modifications des autres.

Ne pas afficher ni recopier les clés, mots de passe ou fichiers privés. Les
connexions et secrets existants sont dans les fichiers ignorés de la session.
Aucun e-mail de test n’a été envoyé ; ne pas en envoyer sans autorisation.
L’utilisateur a refusé l’automatisation à distance de Safari : respecter ce
choix. Aucun réglage Safari n’a été activé à sa place.

Vérifications utiles : lint ciblé, typage/build selon portée, navigateur en
lecture seule. Pas de nouvelle suite pour un simple ajustement visuel.
Pour le site, le build local Turbopack échoue parfois sur un port CSS du sandbox ;
`npm run build -- --webpack` fonctionne. La compilation Vercel reste inchangée.
Ne pas lancer de build dans le même .next qu’un serveur dev actif.


## Dernière publication ERP — 12 septembre 2026

- Commit en ligne : `148f0a544f105c7fc587d4f55f7b9f707f664343`.
- GitHub Actions : https://github.com/NCF-advisory/erp-marssane/actions/runs/34698565542 (succès).
- Ajout direct des tâches via + ; cartes Formation cliquables pour édition,
  tarif directement modifiable, aucun crayon visible. Champs interactifs indépendants.
- Migration additive 020 appliquée, sauvegarde privée des cinq lignes de tags ;
  aucune modification métier de test. Conteneur sain, HTTPS et 493 empreintes vérifiés.
- Détails : ../erp-marssane/docs/publication-20260912-cartes-taches.md.
- La prochaine publication devra partir du dernier main. Le dossier local
  historique reste partagé : examiner le diff, éviter les documents anciens hors scope.
