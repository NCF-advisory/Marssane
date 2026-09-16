# CTA projet animé — 15 septembre 2026

## Modification

Le bouton partagé `RendezVousTrigger` porte désormais un contour lumineux qui
tourne en cinq secondes, un fond canard en dégradé et une flèche sur une pastille
menthe. Au survol, le bouton se soulève de 2 px, le fond s’éclaircit et la flèche
diagonale laisse place à une flèche horizontale. Le libellé reste immobile.

Le style s’applique au CTA de navigation (version compacte), au héros, au bloc
avant/après et à l’offre d’implémentation. Les textes et le parcours de réservation
sont conservés. Aucun ajout de bibliothèque ou de requête réseau.

La préférence de mouvement réduit désactive les animations et déplacements.
Le focus clavier possède un contour visible, et les cibles font au moins 48 px.

## Référence et limite d’observation

L’utilisateur a cité https://kirako.ai/. Le contenu public a pu être lu via la
recherche web, mais le navigateur de test rencontrait une page de filtrage réseau
FortiGuard. L’animation précise n’a donc pas pu être observée. Cette modification
est une proposition de modernisation dans la palette Marssane, sans prétendre
reproduire exactement le bouton de Kirako.

## Vérification

- TypeScript, ESLint ciblé et `git diff --check` : réussis.
- Chromium et WebKit, 1440 / 390 / 320 px : animation présente, ouverture de la
  fenêtre depuis le héros et la navigation, fermeture par Échap, focus visible,
  aucune animation après application de la préférence de mouvement réduit,
  aucun débordement horizontal ni erreur JavaScript.
- Captures dans `audits-prives/cta-kirako/`, hors Git.
- Aucun rendez-vous créé ni e-mail envoyé pendant cette recette.

Changements locaux, visibles sur http://127.0.0.1:3000/ ; aucune publication.
