# Aperçu de partage — 18 septembre 2026

L’ancienne carte Open Graph affichait encore « La formation IA des dirigeants
de PME ». La nouvelle carte reprend le hero actuel : « Dirigeant de PME,
gagnez 2 h par jour », avec une image de la vidéo V12 à 12 secondes et la
signature « L’implémentation IA qui augmente votre rentabilité ».

- PNG de 1200 × 630 pixels, 88 803 octets.
- Nouvelle URL : `/images/marssane-hero-partage-20260918.png`.
- Ancienne URL `/opengraph-image.png` conservée avec la même nouvelle image.
- Métadonnées Open Graph et Twitter centralisées dans `lib/seo.ts`.
- Source visuelle : `scripts/social-preview.html` ; génération avec
  `node scripts/render-social-preview.mjs`. Playwright doit être installé ;
  `PLAYWRIGHT_MODULE` permet de fournir le chemin d’une installation externe.

Publication préparée dans `/tmp/marssane-og-20260918`, depuis le dernier main
`b1d9caf`, pour préserver les autres modifications du dossier partagé.
Commit du correctif : `b2d5526`.
Déploiement : https://vercel.com/ncf-advisory-s-projects/marssane/LMgjEkWhsBB1pDXZVJs7mAFoeU49

Contrôles avant publication : inspection visuelle du PNG, compilation Next.js
Webpack et TypeScript, ESLint ciblé, contrôle SEO des sept pages publiques,
égalité des deux images servies, dimensions et type PNG. Tous réussis.

Déploiement Vercel terminé avec succès. Contrôles après publication sur
`https://marssane.fr` : contrôle SEO complet réussi, deux PNG identiques aux
fichiers validés, nouvelle URL d’image et absence de l’ancien texte dans les
métadonnées reçues avec un User-Agent iPhone. Aucun test réel dans Messages
sur un iPhone n’a été effectué.

Les applications de messagerie peuvent conserver les aperçus déjà récupérés.
La nouvelle URL d’image facilite leur renouvellement ; les messages déjà
envoyés ne sont pas modifiables depuis le site.
