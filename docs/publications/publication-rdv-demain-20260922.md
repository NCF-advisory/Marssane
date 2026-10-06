# Rendez-vous au plus tôt le lendemain — 22 septembre 2026

Publié sur https://marssane.fr par le commit
`cef4538662d9c38fb2223dec1f5a23853b0594c9`.

Vercel : https://vercel.com/ncf-advisory-s-projects/marssane/GkodigxxhULEs4VdQQv56WDeXZZb
(statut success).

Les créneaux du jour courant à Paris sont exclus du générateur partagé par
les disponibilités et la validation serveur. La règle porte sur le jour
calendaire, sans imposer un délai de 24 heures. Horaires de semaine et horizon
de 30 jours conservés. Un formulaire ancien ne peut pas confirmer un créneau
devenu le jour même.

Publication isolée depuis `c113a9c`, limitée au générateur de créneaux et à
ses tests. Contrôles : 24 tests réussis, ESLint ciblé, git diff --check,
compilation de production Webpack et TypeScript réussie.

Vérification en production par GET /api/rendez-vous : le 22 septembre 2026
(heure de Paris), 192 créneaux disponibles, aucun pour le jour même ; premier
départ le 23 septembre à 9 h, heure de Paris. Réponse non mise en cache.
Aucune réservation ni notification réelle effectuée pendant les contrôles.
