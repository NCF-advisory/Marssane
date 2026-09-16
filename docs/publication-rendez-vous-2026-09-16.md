# Publication ciblée des rendez-vous — 16 septembre 2026

Base publique : `489ca3e8023f6d21429e7c7390b830f4e9ac170e`.

## Périmètre

- CTA de navigation « Discuter de mon projet », formulaire en trois étapes,
  portrait, accordéon, animations et message de confirmation.
- Créneaux d'une heure, lundi–vendredi, 9 h–18 h, heure de Paris.
- API de disponibilités et confirmation ; enregistrement dans la table partagée
  avec le calendrier ERP déjà publié. Migrations 013 et 014 déjà appliquées.
- Notification immédiate après confirmation à `cleante@marssane.fr`, avec
  coordonnées, horaire Paris, lien ERP et réponse dirigée vers le client.
- `after()` évite de retarder la confirmation ; insertion idempotente et clé
  Resend stable évitent les doublons. Trois essais maximum en cas d'erreur
  transitoire, sans file persistante ni annulation de réservation si l'envoi échoue.
- Clé et expéditeur dédiés configurés dans Vercel production :
  `RENDEZ_VOUS_RESEND_API_KEY` et `RENDEZ_VOUS_EMAIL_FROM`. Expéditeur :
  `Marssane <notifications@novances-evaluation.fr>`, domaine vérifié.

Les autres travaux locaux sur l'accueil, les nouvelles pages, la vidéo,
les liens de navigation et le référencement sont exclus de ce lot.
Les inscriptions aux formations dans le contenu gardent leur parcours existant.
Aucun secret n'est commité. Les quatre réservations de test avaient déjà été
supprimées de la base partagée.

## Vérifications avant publication

- 18 tests unitaires/API/notification ; ESLint ciblé et espaces Git : réussis.
- Compilation Next.js avec Webpack et TypeScript : réussie. Turbopack local
  a rencontré une restriction de création de processus/port ; le mode habituel
  de compilation Vercel n'est pas modifié.
- Chromium 1440 px et WebKit 390 px : ouverture, saisie, date, créneau,
  confirmation simulée, fermeture, aucun débordement ni erreur JavaScript.
- PostgreSQL éphémère : confirmation, répétition, collision et notification
  unique via transport simulé. Aucun rendez-vous réel ni e-mail de test créé.

La publication passe par le dépôt GitHub relié à Vercel. Le déploiement public
et l'API doivent être contrôlés après bascule ; ces contrôles ne prouvent pas
la livraison effective d'un e-mail dans la boîte du destinataire.
