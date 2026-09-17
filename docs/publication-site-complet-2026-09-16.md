# Publication complète du site — 16 septembre 2026

Publication demandée de l’intégralité du site localhost sur https://marssane.fr.
Préparation dans une copie isolée depuis `c4520c05808030da3a93d7b173971ca052b0d914`,
la dernière version publique, pour préserver le serveur local et le travail partagé.

## Contenu

- Nouvelle landing implémentation, vidéo sur fond blanc avec pause initiale,
  navigation, rendez-vous en fenêtre et en bas de page.
- Pages implémentation, automatisation et formations avec les textes validés.
- Portraits des agents et tous les schémas SVG ; déclenchement au défilement,
  suspension hors écran, reprise au début et respect de la pause manuelle.
- Ressources publiques locales incluses. Les archives sources ZIP, captures
  de recette, fichiers privés et secrets ne sont pas ajoutés au dépôt.
- La prise de rendez-vous conserve l’API et les notifications déjà publiées.
  Les migrations 013 et 014 ont déjà été appliquées ; aucune migration nécessaire.

## Contrôles avant envoi

- Compilation de production Next.js (Webpack) et TypeScript : réussie.
- 19 tests unitaires/API/notification : réussis ; ESLint ciblé : réussi.
- Chromium et WebKit, 1440 px et 390 px : huit pages publiques, absence de
  débordement et d’erreur JavaScript, parcours de rendez-vous en fenêtre et
  en page ; confirmations interceptées, aucune réservation ni notification créée.
- Vidéo : lecture, boucle, reprise et mouvement réduit, dans les deux moteurs.
- Cinq schémas SVG : attente avant défilement, entrée, sortie, retour,
  pause manuelle et mouvement réduit, ordinateur et mobile, deux moteurs.
- Empreintes des fichiers applicatifs, scripts et ressources identiques au
  localhost au moment de préparer la publication.

Le déploiement suit le circuit GitHub `main` → Vercel Production existant.
La livraison effective des e-mails n’est pas testée avec un envoi réel.

## Résultat en production

Publié sur https://marssane.fr le 16 septembre 2026 vers 16 h 43 (Paris),
commit `240ae8754faf5eda0d470f9cc156ca4d67d5242b`.
Déploiement Vercel réussi :
https://vercel.com/ncf-advisory-s-projects/marssane/3useHLMzivtcET7Zf7fJQPmPbHiY

Contrôles après publication : huit pages HTTP 200, Chromium et WebKit à
1440 px et 390 px, deux parcours rendez-vous simulés sans écriture réelle,
aucune erreur JavaScript ni débordement. Les cinq schémas démarrent au
défilement. Empreintes de la vidéo et des six scripts publics conformes
aux fichiers locaux. API disponibilités : HTTP 200, 198 créneaux.
Redirection www : HTTP 308 vers le domaine principal, puis HTTP 200.

Le dépôt de travail local reste sur son historique précédent avec ses
modifications, afin de préserver le travail partagé. La publication a été
effectuée depuis la copie isolée, basée sur le dernier `main` distant.
