# Retrait de l’ancien admin — 8 septembre 2026

L’administration est désormais accessible sur https://erp.marssane.fr.
Les routes `/admin` du site public sont fermées. Les visites GET/HEAD sont
redirigées temporairement (307, sans cache) vers l’ERP ; POST/PUT/PATCH/DELETE
reçoivent 410, sans transmettre le formulaire à l’ERP. Les anciens cookies
admin sont expirés. Les paramètres de recherche ne sont pas transférés.

Les liens des sessions, exports et présentations QCM conservent leur chemin
sous `/formations/gestion`, car les sessions et questionnaires partagent les
mêmes identifiants. CRM et facturation rejoignent leur accueil respectif,
sans réutiliser des identifiants de tables différentes. Les notifications
quotidiennes de rappels renvoient directement vers la gestion ERP.

L’ancien formulaire de connexion n’authentifie plus personne. Le garde des
anciennes actions serveur refuse systématiquement l’accès, même avec un
jeton encore valide. Le layout empêche aussi le rendu de l’ancienne interface.
Les sources historiques restent conservées pour retour arrière ; elles ne
constituent plus une interface accessible.

## Vérifications préalables

- Gestion ERP en HTTPS avec connexion réelle : inscriptions, accès participants,
  chat, QCM accessibles, rôle consultation respecté, aucune erreur JavaScript.
- Anciennes tables organisations/personnes/opportunités/activités/devis/factures/
  paiements/documents_session : aucune ligne. Aucun historique de ces modules
  ne reste à transférer. L’ancien onglet Documents était un emplacement réservé.
- Les 5 sessions et 7 inscriptions restent dans les tables partagées, consultées
  directement par la gestion ERP. Le contact du site est repris dans l’ERP.
- Aucune suppression ou migration de données, aucun changement de compte,
  aucun e-mail envoyé pour cette bascule.

## Périmètre conservé

Le site public, les pré-inscriptions, `/formation`, les liens d’activation,
les comptes participants, le chat, les réponses QCM et les tâches planifiées
restent opérationnels. Le cron de rappels signale les envois à valider ; il
n’envoie pas directement de rappels aux participants.

## Validation et retour arrière

`tests/admin-retire.mjs` vérifie les redirections, le retrait d’un ancien
cookie signé, le refus des écritures, le site public et la protection de
l’espace participant. L’exécuter contre un serveur de test démarré :

```sh
node --env-file=.env.local tests/admin-retire.mjs
```

Le port par défaut est 3022 ; `TEST_BASE_URL` permet de choisir une autre base.
Le test ne contacte jamais le cron avec son secret.

Pour revenir à l’ancienne interface : annuler le commit de retrait et publier
via le dépôt Vercel. Aucune restauration de base n’est nécessaire. Les anciennes
sessions expirées imposeront simplement une nouvelle connexion.

Validation locale : lint ciblé, compilation de production Webpack avec typage
TypeScript, puis test HTTP sur le serveur compilé réussis. Le moteur Turbopack
local a rencontré une erreur de permission lors de l’ouverture d’un port CSS ;
la configuration de compilation Vercel reste inchangée.
