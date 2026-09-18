# Landing implémentation IA — recette du 15 septembre 2026

## Résultat

Nouvelle landing sur `/`, conformément à `prompt-astra-landing-implementation.md` : douze sections, trois bandes claires, offres implémentation/formation, formulaire existant, FAQ commune au rendu et au JSON-LD. Ancienne landing conservée sur `/accueil-formation`.

Neuf composants dédiés ont été créés, ainsi que `lib/implementation-faq.ts`. Les seules modifications de composants partagés sont les deux props optionnelles de `Formateur` et l'ajout de la route d'archive à `PAGES_SITE` dans `Nav`. Aucun changement du CSS global, des formulaires/actions, des autres pages ou des espaces métier. Les six compositions des cas et leurs helpers sont identiques à l'original.

## Choix et ambiguïtés résolus

- D1/D2 : recommandations appliquées, `/` devient l'offre implémentation et `/accueil-formation` reste accessible, en `noindex, nofollow`, hors sitemap.
- Titre de l'archive : le prompt demande à la fois de conserver `HOME_TITLE` et de changer cette constante globale. Les anciennes valeurs du titre **et** de la description sont donc figées localement dans l'archive. Canonique et URL du WebPage JSON-LD adaptés à sa nouvelle route.
- Réservation : D3 et le §4 évoquent une modale dans la carte Formation, mais le §3.10 impose un lien `/formations` et le critère 6.4 exclut tout `ReservationTrigger` de la nouvelle landing hors Nav. Ces dernières consignes sont appliquées : carte Formation → `/formations`, modale uniquement dans la Nav.
- Héro : après retour du propriétaire, titre de l’ancienne landing rétabli : « Dirigeant de PME, gagnez 2 h par jour. », avec son surlignage et ses règles responsive.
- Rythme : valeurs des composants modèles conservées, y compris leurs exceptions aux indications générales de padding.
- Contact : carte centrée de 720 px ; textes d'introduction centrés, formulaire enveloppé dans un bloc aligné à gauche pour conserver son rendu habituel.
- Test du succès : le honeypot existant renvoie immédiatement `success`, avant tout accès à la base ou aux e-mails. Il sert à vérifier le message dans le navigateur. Le parcours réel d'enregistrement et de notification n'a pas été exécuté, conformément à l'interdiction d'envoi.

## Vérifications

- `npm run build` : réussi, aucun warning final. Une première exécution sous sandbox a mémorisé une erreur d'ouverture de port dans le cache Turbopack ; déplacement de ce cache puis compilation avec les permissions locales appropriées. Aucun changement de configuration nécessaire.
- TypeScript (`npx tsc --noEmit`), ESLint sur tous les fichiers concernés et `git diff --check` : réussis.
- Test existant `node --test tests/contact-email-routing.test.mjs` : réussi ; inspection statique uniquement, aucun envoi.
- Chromium **et** WebKit, à **1440 × 900** et **390 × 900** : CTA contact, lien offres, lien formations, ouverture/fermeture de la modale Nav, six cas avec un seul panneau actif, FAQ native : réussis.
- Formulaire : validation HTML native, erreurs par champ de la server action, puis affichage du succès via honeypot. Adresse réservée `recette@example.invalid`. Aucune écriture en base ni notification.
- Métadonnées : titre d'archive conservé, canonique `/accueil-formation`, `noindex, nofollow`. FAQ visible identique aux huit réponses du JSON-LD.
- Sitemap : exactement cinq URLs, sans `/accueil-formation`.
- Apparitions au scroll : passage à l’état visible et opacité finale contrôlés dans Chromium et WebKit sur le build de production local.
- Mode mouvement réduit : aucun bloc en attente, contenu visible immédiatement. Absence de débordement horizontal vérifiée à 320, 390, 768, 1024 et 1440 px dans les deux moteurs.
- Aucune erreur JavaScript durant les parcours de recette.
- Archive : JSX d'origine conservé, hors URL du JSON-LD. Comparaison des douze sections avant/après : identité pixel par pixel sous WebKit aux deux largeurs ; sous Chromium, onze sections identiques, seules les images/commandes transitoires de la vidéo partagée diffèrent dans le héro. Hauteurs totales inchangées dans chaque moteur.

## Captures locales

Les captures et scripts sont conservés dans `audits-prives/landing-implementation-2026-09-15/` (dossier privé déjà ignoré par Git) :

- `before-{chromium,webkit}-{1440,390}/` : références de l'ancienne `/` avant modification.
- `implementation-{chromium,webkit}-{1440,390}/` : nouvelle page.
- `formation-{chromium,webkit}-{1440,390}/` : archive après modification.
- Chaque dossier contient les captures successives du viewport (`viewport-*.png`), les douze sections (`section-*.png`) et la page entière (`complete.png`).
- `succes-*.png` : confirmation du formulaire via le parcours inerte.

Le scroll doux est désactivé pour les captures ; le mode mouvement réduit rend toutes les apparitions visibles. Les captures successives du viewport font référence pour la lecture : une capture d'élément ou de page entière peut superposer la Nav sticky au milieu d'une section.

Le Browser intégré ne proposait aucune instance ; la recette a donc utilisé les navigateurs Playwright locaux installés. WebKit est le moteur de Safari, sans constituer un test sur un appareil Safari réel. Aucun déploiement effectué.

Les captures de la recette initiale précèdent le rétablissement du titre « gagnez 2 h par jour ».

## Évolution du CTA de navigation après la recette initiale

À la demande du propriétaire, le CTA partagé « Réserver ma place » devient « Discuter de mon projet ». Il mène à `#contact` sur l'accueil, et à `/#contact` depuis les autres pages, au lieu d'ouvrir la modale. Les boutons propres aux offres de formation conservent leur fonctionnement. Cette décision remplace le choix initial de conserver la réservation dans la Nav.

Vérification ciblée : ESLint et parcours du lien depuis `/`, `/formations` et `/accueil-formation`, sur Chromium/WebKit à 1440 et 390 px. Le formulaire est atteint, le menu mobile se ferme, aucune modale ne s'ouvre et aucun débordement horizontal n'est constaté.
