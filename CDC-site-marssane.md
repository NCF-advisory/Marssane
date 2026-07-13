# Cahier des charges — Site internet Marssane

**Version 1.0 — 11/07/2026**
**Statut : validé pour développement (preview)**

---

## 1. Contexte et objectifs

Marssane forme les dirigeants de PME, avocats, notaires et experts-comptables à l'utilisation de l'IA, et propose en prolongement l'implémentation de l'IA en entreprise.

**Message clef du site** : « Nous vous formons à l'utilisation de l'IA. Si vous voulez aller plus loin, nous implémentons l'IA directement chez vous. »

**Objectifs du site, par ordre de priorité :**

1. Collecter des **pré-inscriptions** à la formation débutant (1 journée, 10 places par session).
2. Collecter des **demandes de contact** pour l'offre d'implémentation.
3. Donner aux administrateurs un **tableau de bord** de suivi des inscriptions et des sessions.

**Indicateur de succès** : nombre de pré-inscriptions qualifiées par session publiée.

---

## 2. Périmètre

### Inclus (v1 — preview)

- Landing page one-page reprenant **exactement** la maquette `DA/Marssane - Landing page v3 (formation).dc.html`.
- Module de réservation de place (pré-inscription, sans paiement).
- Tableau de bord admin (sessions + inscrits).
- Formulaire de contact « implémentation » avec envoi d'email.
- Pages légales (mentions légales, politique de confidentialité).
- Déploiement en preview sur **Vercel**.

### Exclu (versions ultérieures)

- Paiement en ligne (Stripe) — la facturation se fait hors site.
- Migration vers **OVH** (prévue plus tard — voir contrainte de portabilité §7.4).
- Espace client, contenu e-learning, blog.
- Multilingue (français uniquement).

---

## 3. Références design — source de vérité

Le design n'est **pas à créer** : il est déjà défini dans le dossier `DA/`. Ces deux fichiers font foi sur tout autre document :

| Fichier | Rôle |
|---|---|
| `DA/Marssane - Charte graphique.dc.html` | Charte : couleurs, typographies, composants, principes, interdits |
| `DA/Marssane - Landing page v3 (formation).dc.html` | Maquette de référence de la landing — structure, wording, maquettes interactives |

### 3.1 Rappel des fondamentaux de la charte

- **Typographies** : Plus Jakarta Sans (400–800) pour tout ; Spline Sans Mono (400–600) pour les chiffres, labels techniques et annotations.
- **Palette** : neutres dominants (`#0E0E12` encre, `#4B5562`, `#6B7480`, `#98A1AC`, `#C4CBD2`, `#EEF1F3`, `#F6F8F9`, blanc) ; **canard `#0E7291` = couleur d'action** (CTA, liens) ; **turquoise `#00D1BE` = ponctuation** (accents, soulignés) ; terracotta `#C75A4D` en accent rare (alertes, points d'attention).
- **Principes** : « L'IA est le moyen, jamais le sujet » ; chrome sobre, contenu vif ; la grille est la scène, jamais le spectacle ; des chiffres vrais ; aucun code visuel « IA-tech ».
- Les interdits listés dans la section « Ce que Marssane ne fait jamais » de la charte s'appliquent au site entier.

### 3.2 Règle d'implémentation

Les styles de la maquette (valeurs inline dans le HTML de référence) sont à transposer en **design tokens** centralisés (variables CSS ou config Tailwind). Le rendu final doit être visuellement indistinguable de la maquette sur desktop ; le responsive mobile/tablette est à produire dans l'esprit de la charte (la maquette est desktop-first).

---

## 4. Arborescence et pages

| Route | Contenu |
|---|---|
| `/` | Landing one-page (sections §5.1) avec ancres de navigation |
| `/merci` | Confirmation de pré-inscription |
| `/mentions-legales` | Mentions légales |
| `/confidentialite` | Politique de confidentialité (RGPD) |
| `/admin` | Connexion admin |
| `/admin/dashboard` | Tableau de bord (sessions + inscrits) |

Navigation (reprise de la maquette) : logo Marssane · « Pour faire quoi » · « Les formations » · « Je veux implémenter l'IA » · CTA « Réserver ma place ».

---

## 5. Spécifications fonctionnelles

### 5.1 — F1 · Landing page

Reproduction fidèle de la maquette v3, sections dans cet ordre :

1. **Héro** — Titre « Une formation IA sur des cas concrets », sous-titre, CTA « Réserver ma place » + lien « Voir le déroulé de la journée », mention « Pré-inscription à la prochaine session · 10 places · sans engagement ». **À droite : la vidéo de présentation (voir F5).** Bandeau chiffres : 1 journée / 10 places / 1 système fonctionnel.
2. **Pour faire quoi** — « L'IA, d'accord. Mais pour faire quoi ? » : les 3 cas concrets avec leurs maquettes interactives (tri de mails avant/après, synthèse de bail 42 pages → 12 lignes, courrier dicté).
3. **Pensée pour des professions exigeantes** — cible : dirigeants de PME, avocats, notaires, experts-comptables ; registre confidentialité.
4. **Une journée, cinq temps, dix personnes** — le déroulé 9h–17h de la formation (source : `../formation-1-debutant-classique.md`), prérequis affichés (ordinateur portable, abonnement Claude Pro 20 €/mois, validation DSI si poste géré).
5. **Aller plus loin** — « Vous voyez le potentiel ? Nous venons l'installer chez vous. » + formulaire de contact implémentation (F4).
6. **Réservation** — « Réservez votre place » : formulaire de pré-inscription (F2).
7. **Footer** — liens légaux, « Conçu et opéré en France », hébergement UE.

Dynamique : la prochaine session publiée (date, lieu, places restantes) s'affiche dans le héro et la section réservation. S'il n'y a aucune session publiée : mode « liste d'attente » (le formulaire reste actif, wording adapté).

### 5.2 — F2 · Pré-inscription (réserver sa place)

**Sans paiement.** Formulaire :

| Champ | Type | Obligatoire |
|---|---|---|
| Prénom | texte | oui |
| Nom | texte | oui |
| Email | email (validé) | oui |
| Téléphone | tel | oui |
| Métier | liste : Dirigeant de PME · Avocat · Notaire · Expert-comptable · Autre (préciser) | oui |
| Entreprise / cabinet | texte | non |
| Session | sélection de la session publiée (pré-remplie) | oui |
| Consentement RGPD | case à cocher, non pré-cochée | oui |

**Comportements :**

- Le compteur « X places restantes » se met à jour selon les inscriptions confirmées (capacité par défaut : 10, modifiable par session).
- Session complète → le formulaire bascule en **liste d'attente** (même formulaire, statut différent).
- Après soumission : redirection `/merci` + **email de confirmation au client** + **email de notification aux admins** (F5).
- Anti-spam : champ honeypot + rate-limiting côté serveur. Pas de captcha visuel en v1.
- Doublon (même email sur même session) : message « vous êtes déjà inscrit », pas de double enregistrement.

### 5.3 — F3 · Tableau de bord admin

**Accès** : `/admin`, authentification par email + mot de passe, limité aux 2 comptes administrateurs. Session sécurisée (cookies httpOnly). Pas de création de compte publique.

**Gestion des sessions :**

- Créer / modifier / archiver une session : date, horaires, lieu, capacité (défaut 10), statut (brouillon / publiée / complète / terminée).
- La session « publiée » la plus proche alimente automatiquement la landing.

**Suivi des inscriptions :**

- Vue liste par session : **nom, prénom, email, téléphone, métier**, entreprise, date d'inscription, statut (confirmé / liste d'attente / annulé).
- Compteur inscrits / capacité, en tête de tableau de bord.
- Actions : changer un statut, supprimer une inscription (droit à l'effacement RGPD).
- **Export CSV** de la liste d'une session.

**Vue contact** : liste des demandes reçues via le formulaire implémentation (lecture seule + statut traité/non traité).

### 5.4 — F4 · Formulaire contact « implémentation »

Formulaire simple dans la section « Aller plus loin » : prénom, nom, email, téléphone (optionnel), entreprise, message libre, consentement RGPD.

À la soumission : email vers l'adresse de réception Marssane + enregistrement en base (visible dans l'admin). Message de confirmation inline (pas de redirection).

### 5.5 — F5 · Emails transactionnels

| Déclencheur | Destinataire | Contenu |
|---|---|---|
| Pré-inscription | Client | Confirmation, rappel date/lieu, **prérequis** (Claude Pro 20 €/mois, ordinateur, point DSI) |
| Pré-inscription | Admins | Notification : nom, prénom, contact, métier, session, places restantes |
| Formulaire contact | Admins | Le message + coordonnées |

- **Expéditeur / réception : une adresse dédiée à créer** (ex. `contact@marssane.fr`) — dépend du choix final du nom de domaine (en suspens, vérifications INPI/domaine en cours). En attendant, une variable d'environnement `CONTACT_EMAIL` permet d'utiliser n'importe quelle adresse.
- Service d'envoi : Resend (ou équivalent SMTP transactionnel), configuration SPF/DKIM à la mise en place du domaine.
- Les templates d'emails reprennent la charte (sobres, texte d'abord).

### 5.6 — F6 · Vidéo du héro

- Emplacement : moitié droite du héro (à la place de la maquette « boîte mail » statique de la v3, qui sert de **placeholder** en attendant).
- **La vidéo n'est pas encore produite.** Le développement prévoit le composant : lecture automatique en boucle, sans son (`autoplay muted loop playsinline`), image `poster`, coins et ombre conformes à la charte.
- Spécifications du fichier attendu : MP4 (H.264) + WebM, format 4:5 ou 1:1, ≤ 8 Mo, 15–30 s, sans son. Chargement différé (`preload="metadata"`) pour ne pas dégrader la performance.
- Bascule placeholder → vidéo : simple remplacement d'un asset + variable de config, sans redéveloppement.

---

## 6. Modèle de données (indicatif)

- **sessions** : id, date, heure_debut, heure_fin, lieu, capacite (défaut 10), statut, created_at.
- **inscriptions** : id, session_id, prenom, nom, email, telephone, metier, entreprise, statut (confirme / attente / annule), consentement_at, created_at.
- **contacts** : id, prenom, nom, email, telephone, entreprise, message, traite (bool), created_at.
- **admins** : id, email, password_hash, created_at.

---

## 7. Spécifications techniques

### 7.1 Stack recommandée

| Brique | Choix | Justification |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Standard Vercel, SSR pour le SEO, API routes pour formulaires/admin |
| Styles | Tailwind CSS + tokens de la charte | Transposition propre de la charte, maintenable |
| Base de données | **Supabase (Postgres)** | Gratuit en v1, hébergement UE possible, portable vers OVH (Postgres standard) |
| Emails | Resend | Simple, domaine vérifiable plus tard |
| Auth admin | Auth.js (credentials) ou Supabase Auth | 2 comptes, pas de complexité inutile |
| Hébergement v1 | **Vercel (preview)** | Demandé ; déploiement continu depuis Git |

### 7.2 Environnement de travail

- Développement dans **VS Code**, dépôt **Git** (GitHub) connecté à Vercel.
- Le projet respecte les règles d'orchestration définies dans `CLAUDE.md` (session principale Fable = orchestration ; écriture de code déléguée à `dev-opus`).
- Secrets en variables d'environnement (`.env.local`, jamais commités) : URL base de données, clé Resend, `CONTACT_EMAIL`, secret d'auth.

### 7.3 Environnements

- **Preview** : déploiements automatiques Vercel par branche + domaine `*.vercel.app`. La preview est **non indexable** (`noindex`) tant que le domaine définitif n'est pas branché.
- **Production (plus tard)** : domaine définitif, puis migration OVH.

### 7.4 Contrainte de portabilité (migration OVH prévue)

Aucun couplage fort à Vercel : pas d'API propriétaire Vercel indispensable (KV, Blob, Cron Vercel) sans alternative documentée. Le site doit pouvoir tourner en Node.js autonome (`next start`) ou conteneur Docker sur OVH, avec la même base Postgres.

### 7.5 Performance, SEO, accessibilité

- Core Web Vitals « bon » sur mobile et desktop (LCP < 2,5 s — attention à la vidéo héro, voir F6).
- Balises meta + Open Graph, sitemap, favicon dérivé du drapeau tonal de la charte.
- Accessibilité : contrastes AA, navigation clavier sur les formulaires, labels explicites, `prefers-reduced-motion` respecté (vidéo et animations).
- Polices auto-hébergées (pas d'appel Google Fonts en production — RGPD).

### 7.6 RGPD et sécurité

- Consentement explicite sur les deux formulaires, lien vers la politique de confidentialité.
- Finalités : gestion des inscriptions / réponse aux demandes. Durée de conservation : 3 ans après le dernier contact, puis purge.
- Droit d'accès et d'effacement : suppression possible depuis l'admin.
- Pas de cookies tiers ni analytics en v1 (pas de bandeau cookies nécessaire). Si un analytics est ajouté : solution sans cookie (Plausible, Umami).
- HTTPS partout, validation serveur de toutes les entrées, protection CSRF sur l'admin.

---

## 8. Livrables et jalons

| # | Jalon | Contenu |
|---|---|---|
| 1 | Socle | Projet Next.js, tokens charte, déploiement Vercel opérationnel |
| 2 | Landing statique | Toutes les sections conformes à la maquette v3, responsive, placeholder vidéo |
| 3 | Réservation | Formulaire F2 + base de données + emails F5 |
| 4 | Admin | Auth + gestion sessions + liste inscrits + export CSV |
| 5 | Contact + légal | Formulaire F4, pages légales, RGPD |
| 6 | Recette | Critères §9 validés, preview partageable |

Livrables : code source (repo Git), URL de preview Vercel, accès admin, ce CDC tenu à jour, README d'installation et de migration OVH.

---

## 9. Critères d'acceptation (recette)

1. La landing est visuellement conforme à `DA/Marssane - Landing page v3 (formation).dc.html` (desktop) et propre sur mobile (≥ 360 px).
2. Une session créée et publiée dans l'admin s'affiche sur la landing avec le bon nombre de places restantes.
3. Une pré-inscription complète : enregistre en base, décrémente les places, envoie les 2 emails, redirige vers `/merci`.
4. À la 10ᵉ inscription confirmée, le formulaire passe en liste d'attente.
5. Un doublon (même email, même session) est refusé proprement.
6. Le formulaire contact envoie l'email et la demande apparaît dans l'admin.
7. L'admin est inaccessible sans authentification ; l'export CSV contient nom, prénom, email, téléphone, métier.
8. Le placeholder vidéo se remplace par un fichier MP4/WebM sans modification de code (asset + config).
9. Lighthouse ≥ 90 en performance et accessibilité sur la landing.
10. Aucune donnée personnelle dans les logs ; `.env` hors du repo.

---

## 10. Points en suspens (hors périmètre du développement, à trancher côté Marssane)

- ~~Orthographe définitive~~ **Acté le 12/07/2026 : « Marssane »**. Restent : nom de domaine, INPI, adresse email dédiée.
- **Prix de la formation** (affiché ou non sur la page).
- **Date et lieu de la première session.**
- **Production de la vidéo héro** (brief à rédiger).
- Textes définitifs des mentions légales (entité juridique, hébergeur).
- Qualiopi : si obtenue, ajout d'une mention + logo sur le site.
