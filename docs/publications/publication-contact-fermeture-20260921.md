# Croix de fermeture du formulaire — 21 septembre 2026

Publié sur https://marssane.fr par le commit
`c113a9ca76d78f417f8019698c317a6cdd939455`.

Vercel : https://vercel.com/ncf-advisory-s-projects/marssane/5GthNv5sRm91Bn34XhqaCoR3sSMA
(statut success).

La croix reste en haut à droite du formulaire pendant le défilement, sur un
fond opaque. Le retour en haut à la réouverture est effectué après showModal,
quand le conteneur est visible.

Publication isolée depuis le dernier main `1f7397e`, dans
`/tmp/marssane-contact-close-publication-20260921`, limitée aux trois composants
ParcoursRendezVous, RendezVousDialog et RendezVousTrigger.

Validation : compilation de production Webpack et TypeScript réussie,
19 tests existants de contact et rendez-vous réussis, ESLint ciblé et
git diff --check réussis. Vérification Chromium en production aux formats
1440 × 700, 390 × 650 et 844 × 390 : bouton entièrement visible, position
constante à mi-défilement et en bas, fermeture par clic et Échap,
réinitialisation du défilement à la réouverture. Aucune réservation effectuée.
