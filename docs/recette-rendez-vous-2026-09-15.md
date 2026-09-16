# Rendez-vous projet — recette du 15 septembre 2026

## Nettoyage et notification — 16 septembre 2026

Les quatre réservations explicitement nommées « test » ont été supprimées de
la base partagée, dans une transaction limitée à leurs identifiants. Il restait
zéro rendez-vous après cette opération ; le calendrier ERP est donc vide.

Le site local prépare désormais un e-mail à `cleante@marssane.fr` après chaque
nouvelle réservation confirmée : coordonnées, date et heure de Paris, lien vers
le calendrier ERP. Répondre au message cible l'adresse du client. Le traitement
utilise `after()` pour ne pas retarder la confirmation et une clé d'idempotence
Resend pour les reprises ; un double clic ne déclenche pas une seconde alerte.
Trois tentatives au maximum couvrent les erreurs transitoires. Un échec final
est journalisé sans annuler la réservation ; il n'existe pas de file persistante.

La configuration locale `RENDEZ_VOUS_EMAIL_FROM` utilise
`Marssane <notifications@novances-evaluation.fr>`, le domaine vérifié disponible
sur le compte Resend. Elle est dédiée à ce parcours. Le destinataire reste
`cleante@marssane.fr`. Aucun e-mail de test n'a été envoyé.

Vérifications : 17 tests réussis, TypeScript, ESLint ciblé et contrôle des espaces
Git ; intégration sur PostgreSQL éphémère avec réservation, double clic,
collision et transport e-mail simulé. Le serveur local répond HTTP 200.

Cette notification est locale : le site public ne propose pas encore l'API de
réservation (HTTP 404 lors du contrôle). Aucune publication du site vitrine ni
modification de l'expéditeur général de l'ERP n'a été effectuée. Les mentions
d'absence d'e-mail plus bas décrivent les recettes antérieures.

## Publication ERP — 15 septembre 2026

La rubrique est publiée sur https://erp.marssane.fr/rendez-vous, commit
`9fed9cac44a30e815abdcc7f86b2da9917382420`. Seul le lot rendez-vous est ajouté
à la version publique `b3e291e` : calendrier mensuel en heure de Paris, détails
au clic, actualisation toutes les minutes, liste, historique et annulation.
Le calendrier interroge tous les rendez-vous confirmés des 42 jours affichés,
indépendamment de la limite des 100 lignes de l’historique.

[Contrôles GitHub et déploiement réussis](https://github.com/NCF-advisory/erp-marssane/actions/runs/34991237206).
La sonde HTTPS sert la révision attendue et `/rendez-vous` exige une connexion.
Le candidat vérifie également les droits SQL de lecture et d’annulation.
Recette navigateur Chromium 1440 px et WebKit 390 px sur une base éphémère avec
un compte fictif, connexion normale et navigation entre mois ; aucun rendez-vous
réel modifié. Les tests couvrent les droits, l’annulation idempotente, Paris
été/hiver et un calendrier historique contenant plus de 100 rendez-vous.

Copie isolée : `/private/tmp/erp-rendez-vous-publication-20260915`.
Les fichiers concernés sont reportés dans le dossier ERP local, avec sauvegarde
dans `/private/tmp/erp-rdv-local-avant-publication-20260915`. Le site vitrine et
ses autres modifications ne sont pas déployés dans cette publication.
Les mentions « local uniquement » plus bas décrivent l’état antérieur à celle-ci.

## Dernière optimisation : latence et lisibilité

- Message final sur carte opaque `#16161a`, bordure discrète et ombre : le texte
  ne se superpose plus visuellement au contenu de la landing.
- Transformation de la fenêtre par `transform` (translation et échelle), sans
  animation de largeur ou de hauteur. Suppression de l’attente de 150 ms après
  enregistrement ; message entièrement visible après 480 ms, contre 1 250 ms
  dans la version précédente. Accordéon ramené de 400 à 240 ms.
- Les lectures et confirmations utilisent `/api/rendez-vous` en JSON. La fenêtre
  n’utilise plus les transitions React pour les échanges réseau. Les règles
  serveur, la limitation de tentatives et l’insertion atomique sont conservées.
- GET sans cache : seuls les départs sont transmis, les fins à +1 heure sont
  reconstruits pour l’affichage. La durée est toujours imposée par le serveur
  lors de la confirmation. Aucun cache de créneaux occupés.
- POST avec contrôle du corps et de l’origine contre l’en-tête Host. Prise en
  compte de la réécriture interne de 127.0.0.1 en localhost par Next.

Mesures locales : 13 800 octets avant contre 5 305 après pour la réponse du
calendrier, soit environ 62 % de moins. Les deux réponses chaudes mesurées sont
passées de 73/75 ms à 71/72 ms : pas de gain significatif démontré sur le temps
réseau, qui dépend notamment de la base distante. Le gain perceptible ciblé est
la réduction des transitions et du travail d’affichage, pas une promesse sur la
latence du réseau.

Recette : neuf tests unitaires réussis (planning et transport/API), contrôles
réels d’origine et de données invalides, puis quatre réservations dans Chromium
et WebKit à 1440/390 px. Fond opaque, coche, mouvement réduit, fermeture,
réouverture, collision et reprise idempotente vérifiés. Les quatre réservations
fictives sont supprimées ; aucun e-mail envoyé. TypeScript et ESLint passent.
Build réussi ; la page administrative préexistante `/admin/dashboard/sessions`
a nécessité une reprise après un délai de 60 secondes. Captures privées dans
`audits-prives/rendez-vous-optimise/`.

## Validation finale : transformation en coche

Après une réponse d’enregistrement réussie, le formulaire s’efface en 150 ms.
Une silhouette reprend exactement la position et les dimensions de la fenêtre,
puis se contracte en disque turquoise de 164 px en 650 ms. Une grande coche se
dessine dessus ; le titre de confirmation, la date, l’heure et le bouton Terminer
apparaissent ensuite. Sur une fenêtre basse, la coche mesure 108 px.

Le formulaire est remplacé intégralement. Le succès reste visible jusqu’à sa
fermeture, y compris par Échap. Aucun succès animé en cas d’erreur ou de collision.
Avec le mouvement réduit, l’état confirmé est affiché directement. Le focus est
transféré au titre de confirmation ; le bouton devient immédiatement visible si
on l’atteint au clavier avant la fin de son apparition.

Recette : confirmations réelles dans Chromium et WebKit à 1440 et 390 px, dont
WebKit mobile avec mouvement réduit. Transformation active vérifiée, état final
circulaire, tracé complet, disparition du formulaire, réouverture du parcours,
collision entre deux navigateurs et reprise idempotente vérifiés. Les quatre
réservations fictives ont été supprimées. Aucun e-mail envoyé. TypeScript et
ESLint ciblé réussis. Captures dans `audits-prives/rendez-vous-coche/`.

## Fluidité de la saisie et du choix de date

- La fenêtre est ancrée en haut du viewport et réserve l’espace de sa barre de
  défilement. Elle ne se recentre plus à chaque variation de contenu.
- Suppression du défilement instantané retardé : un défilement interne doux est
  déclenché uniquement si le titre de l’étape est hors du cadre, à la fin de la
  transition. Les résumés occupent une ligne stable dans chaque en-tête.
- Créneaux préchargés dès l’ouverture, avec une réservation d’espace pendant
  l’attente ; les requêtes obsolètes restent ignorées.
- Planning regroupé et mémorisé une fois par chargement, formateurs de dates
  réutilisés : la frappe ne reconstruit plus le calendrier.
- Grille de neuf horaires de taille constante ; horaires indisponibles barrés.
  Un changement de date conserve l’heure sélectionnée si elle reste disponible.
- Transitions d’accordéon de 400 ms, coloration des horaires de 180 ms ; respect
  du mouvement réduit.

Contrôles Chromium et WebKit à 1440, 390 et 320 px : préchargement unique,
saisie, position verticale stable mesurée pendant l’animation, hauteur identique
au changement de date, sélection conservée, retours et mouvement réduit. Avec
une réponse retardée de deux secondes, la variation de hauteur après chargement
est de 2 px, sans requête doublée. TypeScript, ESLint ciblé et les cinq tests de
dates réussissent. Captures dans `audits-prives/rendez-vous-fluide/`.

## Évolution : roadmap verticale

Les trois étapes sont maintenant empilées dans un accordéon vertical. Valider
replie l’étape courante et déplie la suivante avec une transition de hauteur.
Les étapes réduites affichent un résumé ; les titres des étapes précédentes
permettent de les rouvrir. Le créneau sélectionné est conservé après modification
des coordonnées. Les étapes suivantes restent bloquées jusqu’à validation.

Les panneaux fermés sont inertes et masqués aux technologies d’assistance ; le
focus suit l’étape ouverte. Les transitions respectent la préférence de mouvement
réduit. Vérifié dans Chromium et WebKit à 1440, 390 et 320 px, ainsi que par une
confirmation réelle, une collision de créneaux et une reprise idempotente. La
réservation de recette a été supprimée et aucun e-mail n’a été envoyé. TypeScript,
ESLint ciblé et contrôle des espaces Git réussis. Captures privées dans
`audits-prives/rendez-vous-vertical/`.

## Fonctionnement livré

- Les CTA projet ouvrent une fenêtre avec trois étapes et une progression visuelle : coordonnées (nom et e-mail), choix du jour et de l’heure, récapitulatif et confirmation.
- Chaque étape possède sa validation. Retour possible sans perdre les coordonnées ou le créneau ; fermeture par bouton, Échap ou clic hors de la fenêtre.
- Disponibilités du lundi au vendredi : départs de 9 h à 17 h, durée d’une heure, fin au plus tard à 18 h, fuseau Europe/Paris. Horizon glissant de 30 jours ; aucun horaire passé. Les changements d’heure sont pris en compte.
- Les réservations sont enregistrées dans `public.rendez_vous`. Les disponibilités sont relues côté serveur ; l’index unique empêche deux confirmations sur le même départ. Une clé de confirmation rend les reprises de requête idempotentes.
- Une réservation concurrente renvoie au choix du créneau avec les disponibilités actualisées.
- Les inscriptions aux formations conservent leur parcours existant.

## Gestion dans l’ERP choisi par l’utilisateur

Le dépôt voisin `../erp-marssane` contient désormais :

- `/rendez-vous`, accessible dans le menu : rendez-vous à venir et historique des 100 derniers rendez-vous passés ou annulés ; affichage en heure de Paris.
- Coordonnées du contact et annulation en deux clics, réservée aux comptes en écriture. La commande revérifie que le compte est actif et possède encore ses droits.
- Annulation et événement d’audit dans une même transaction ; le créneau est immédiatement libéré sur le site. Une deuxième annulation ne double pas l’événement.
- Lecture directe de la table du site, sans duplication des réservations.

Les migrations du site `013_rendez_vous.sql` et `014_rendez_vous_erp.sql` ont été appliquées à la base configurée. La seconde accorde au rôle `erp_app` la lecture des champs nécessaires et la modification des seuls champs d’annulation. Aucune lecture publique ; la clé de confirmation n’est pas accordée à l’ERP. Le rôle ERP existait au moment de la migration. Pour une installation neuve, créer ce rôle avant la migration 014.

## Vérifications

- Build du site et build de l’ERP : réussis. L’ERP émet deux avertissements préexistants de traçage des fichiers dans `lib/stockage/medias-local.ts`, hors de cette modification.
- TypeScript et ESLint ciblés : réussis ; `git diff --check` sur le site : réussi.
- Site : 5 tests unitaires (horaires, week-end, créneau commencé, heure d’été/hiver, horizon et unicité).
- ERP : 3 tests PostgreSQL en mémoire (annulation, libération et historique, idempotence du journal, compte en lecture seule, droits retirés, compte désactivé et identifiant invalide).
- Chromium et WebKit, 1440 et 390 px : parcours complet avec réservation réelle, erreurs de saisie, retour, fermeture, créneau occupé, reprise idempotente et collision entre deux navigateurs. Les réservations fictives ont été supprimées après recette.
- Vérification complémentaire : réservation du site visible dans l’ERP local, redirection sans session, absence du bouton d’annulation en lecture seule et confirmation avant annulation.
- WebKit 320 px : aucun débordement horizontal ; contrôle de date supérieur à 44 px après correction de son apparence native.
- Captures privées : `audits-prives/rendez-vous/` (hors Git).

## Exécution et périmètre

- Site local : http://127.0.0.1:3000 ; serveur maintenu par le job local `fr.marssane.local-dev`.
- ERP local existant utilisé pour la recette : http://127.0.0.1:3010/rendez-vous (connexion habituelle requise).
- Les changements applicatifs sont locaux et n’ont pas été publiés sur les sites en production.
- Aucun e-mail envoyé par ce parcours, y compris lors de l’annulation. L’ERP invite l’utilisateur à prévenir son contact. Aucun lien de visioconférence ni synchronisation d’agenda externe n’est créé.
