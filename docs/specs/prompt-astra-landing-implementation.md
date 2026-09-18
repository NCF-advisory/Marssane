# Plan intégral — Nouvelle landing « Implémentation IA & agents » (marssane.fr)

> Document destiné à un modèle qui codera dans ce dépôt. Il contient **toutes** les décisions, la copie intégrale, les fichiers à créer/déplacer, et les garde-fous. Ne rien inventer au-delà : en cas d'ambiguïté, suivre la recommandation notée, ou s'arrêter et signaler.

---

## 0. Contexte et objectif

Marssane vendait d'abord **la formation IA** aux dirigeants de PME, l'implémentation en second. Le propriétaire inverse l'axe : la proposition de valeur principale devient **l'implémentation de l'IA et l'automatisation par agents IA** (résultats concrets immédiats), la formation devenant l'offre secondaire (« si vous préférez apprendre à faire vous-même »).

**Objectif de ce chantier :**
1. Une **nouvelle landing** sur `/`, axée implémentation, qui **réutilise à l'identique** la mise en forme, le système de style et le déroulement général de la landing actuelle (mêmes gabarits, mêmes tonalités, mêmes animations, mêmes primitives UI).
2. L'**ancienne landing conservée intacte** sur une autre route, consultable pour comparaison.
3. C'est un **prototype** : aucun composant existant n'est modifié destructivement ; tout le neuf vit dans de nouveaux fichiers.

**Stack :** Next.js App Router + Tailwind v4 (tokens dans `app/globals.css` via `@theme`), TypeScript, React Server Components par défaut. Déployé sur Vercel (marssane.fr).

---

## 1. Décisions prises (et hypothèses à valider par le propriétaire)

| # | Décision | Statut |
|---|---|---|
| D1 | La nouvelle landing prend `/`. L'ancienne est déplacée **intacte** sur `/accueil-formation`. | Recommandé — à valider |
| D2 | `/accueil-formation` passe en `robots: { index: false, follow: false }` et reste **hors sitemap** (elle dupliquerait `/` et `/formations` ; l'indexation Google du site est encore fragile). | Recommandé — à valider |
| D3 | Le CTA principal de la nouvelle landing est **« Parler de mon projet »** → ancre `#contact` (formulaire de contact réutilisé, pas la modale de réservation). La modale « Réserver ma place » reste utilisée **uniquement** dans la carte Formation de la section Offres et dans la Nav. | Recommandé |
| D4 | La Nav n'est **pas modifiée** (liens « Les formations », « Quelle IA choisir ? », CTA « Réserver ma place ») — sauf l'ajout de `/accueil-formation` à `PAGES_SITE` pour que la Nav s'y affiche. Le repositionnement de la Nav viendra après validation du prototype. | Recommandé |
| D5 | Les chiffres du bandeau (2 h / +34 % / 10 h) sont conservés tels quels, seuls les labels changent. Ils restent non sourcés (dette connue, ne pas aggraver : **aucune nouvelle statistique inventée**). | Imposé |
| D6 | La page `/implementation` existante (formulaire caché, noindex) reste en l'état pour l'instant. On réutilise son composant `ContactForm` et sa server action. | Imposé |
| D7 | Tarification implémentation : **« Sur devis »**. Aucun prix chiffré n'est affiché pour l'implémentation. | Imposé |

---

## 2. Fichiers : créer / déplacer / modifier

### 2.1 Déplacements (ancienne landing, à l'identique)

- Créer `app/accueil-formation/page.tsx` = copie exacte de l'actuel `app/page.tsx`, avec pour seuls changements :
  - `metadata` : titre inchangé (`HOME_TITLE`), `path: "/accueil-formation"`, et `robots: { index: false, follow: false }` (ne pas passer par `createPublicMetadata` qui force `index: true` — construire l'objet à la main ou ajouter le champ après coup).
  - Le JSON-LD `FAQPage` peut rester (page noindex, sans incidence).
- **Aucun composant de `components/site/` n'est modifié** pour cette page : elle continue d'importer `Hero`, `Accompagnement`, `CasConcrets`, etc.
- Dans `components/site/Nav.tsx` : ajouter `"/accueil-formation"` au tableau `PAGES_SITE` (seule modification de ce fichier).

### 2.2 Créations (nouvelle landing)

Nouveau `app/page.tsx` + nouveaux composants dans `components/site/` :

| Fichier | Rôle | Base de départ (copier puis adapter) |
|---|---|---|
| `components/site/HeroAgents.tsx` | Héro implémentation | `Hero.tsx` |
| `components/site/ChiffresImplementation.tsx` | Bandeau chiffres | `BandeauChiffres.tsx` |
| `components/site/MethodeImplementation.tsx` | 3 temps de la mission (bande claire) | `Accompagnement.tsx` |
| `components/site/CasAutomatisations.tsx` | Sélecteur 6 cas | `CasConcrets.tsx` |
| `components/site/AvantApresImplementation.tsx` | Avant/après (bande claire) | `AvantApres.tsx` |
| `components/site/AlignementImplementation.tsx` | Constellation « autonomie » | `Alignement.tsx` |
| `components/site/OffresDeuxVoies.tsx` | 2 cartes : Implémentation / Formation | `FormationsDeuxNiveaux.tsx` |
| `components/site/ContactFinal.tsx` | CTA final + formulaire | `Reservation.tsx` (carte) + `ContactForm` |
| `components/site/FaqImplementation.tsx` | FAQ | `Faq.tsx` |
| `lib/implementation-faq.ts` | Données FAQ | `lib/formation-faq.ts` (structure identique) |

Composants **réutilisés tels quels** (imports directs, zéro modification) : `PartenaireNovances`, `ParolesDirigeants`, `Footer`, `Apparitions`, `JsonLd`, `ContactForm`, et toutes les primitives (`Kicker`, `KickerPill`, `Chevron`, `PlusMark`, `CheckItem`, `GridBackground`, `LogoMarssane`, `HeroMedia`/`HeroVideo`).

Composant réutilisé **avec deux props optionnelles** : `Formateur.tsx` — ajouter `kicker?: string` et `titre?: ReactNode` avec les valeurs actuelles en défaut (l'ancienne landing ne change pas d'un pixel). C'est la seule modification d'un composant partagé.

### 2.3 Modifications SEO

- `lib/seo.ts` :
  - `HOME_TITLE` → `"Implémentation IA et agents pour PME à Lyon | Marssane"`
  - `HOME_DESCRIPTION` → `"Marssane installe des agents IA dans votre PME près de Lyon : mails triés, devis, relances et comptes-rendus automatisés. Diagnostic, construction, passation."`
  - `PUBLIC_PATHS` : inchangé (`/accueil-formation` n'y entre pas — cf. D2).
- `app/sitemap.ts` : inchangé.
- JSON-LD de `/` : garder `siteEntities` + `WebPage/FAQPage`, mais `mainEntity` alimenté par `IMPLEMENTATION_FAQ` (nouvelle FAQ, §3.12).
- `app/layout.tsx` : ne pas toucher (le title/description racine suivent `HOME_TITLE`/`HOME_DESCRIPTION` automatiquement). L'alt de l'image OG (« La formation IA des dirigeants de PME ») pourra être revu plus tard — hors périmètre.

---

## 3. La nouvelle landing, section par section

### Règles transversales (identiques à l'existant — NE PAS dévier)

- **Ordre et alternance de tonalités identiques à l'ancienne landing.** Tout est en encre (le `body` est `#0E0E12`, texte blanc) sauf trois bandes claires enveloppées dans `<div className="sur-toile …">` (composant local `BandeToile` à recopier depuis l'ancien `app/page.tsx`, commentaires compris) : la Méthode (`mt-[68px] pb-[76px]`), l'Avant/Après (`mt-[68px] pb-[76px]`), la FAQ (`pt-[76px]`).
- **Gabarit** : `mx-auto max-w-[1180px] px-6 sm:px-10` partout ; héro seul à `max-w-[1260px]`.
- **Rythme vertical** : chaque section porte `pb-2` (talon 8 px) et l'écart est tenu par le `pt` de la suivante (`pt-[84px]` courant, `pt-[100px]` pour le sélecteur de cas et le contact). Reprendre les valeurs du composant de base copié.
- **Titres** : un seul surlignage canard par section (`<span className="bg-canard px-[0.26em] pb-[0.05em] text-white">…</span>`), toujours sur le H2/H1, point final **hors** surlignage ; « + » turquoise en exposant sur les gros titres uniquement (héro, bandes pleine largeur, CTA final).
- **Animations** : attribut `data-apparition` (+ `style={{ "--apparition-delai": "150ms" }}` ou cascade `i*150`) aux mêmes emplacements que dans le composant de base. Le composant `Apparitions` est monté une fois en bas de page.
- **Rayons** : `rounded-card` (4 px) / `rounded-btn` (3 px) / `rounded-chip` (2 px) — seule `OffresDeuxVoies` déroge (cartes 20 px, boutons pill), comme son modèle `FormationsDeuxNiveaux`.
- **Copie** : reprendre les textes ci-dessous **verbatim**. Ne pas « améliorer » la rédaction.

### Structure de `app/page.tsx` (nouveau)

```
<JsonLd> (siteEntities + WebPage/FAQPage sur IMPLEMENTATION_FAQ)
<main>
  <HeroAgents />
  <PartenaireNovances />            ← inchangé
  <ParolesDirigeants />             ← inchangé
  <ChiffresImplementation />
  <BandeToile className="mt-[68px] pb-[76px]"><MethodeImplementation /></BandeToile>
  <Formateur kicker="Qui vous accompagne" titre={…} />
  <CasAutomatisations />
  <BandeToile className="mt-[68px] pb-[76px]"><AvantApresImplementation /></BandeToile>
  <AlignementImplementation />
  <OffresDeuxVoies />
  <ContactFinal />
  <BandeToile className="pt-[76px]"><FaqImplementation /></BandeToile>
</main>
<Footer />
<Apparitions />
```

### 3.1 HeroAgents (copie de `Hero.tsx`)

Layout, grille, `GridBackground`, `PlusMark`, média vidéo (`HeroMedia`, même vidéo `hero-v2`) : **identiques**. Seuls changent les textes et le CTA.

- **H1** : `Dirigeant de PME, faites travailler l'IA [à votre place].` — surlignage canard sur « à votre place », « + » turquoise en exposant collé au surlignage, point final hors surlignage.
  - *Variante à proposer au propriétaire (ne pas coder les deux)* : garder « Dirigeant de PME, gagnez 2 h par jour. » pour la continuité avec le bandeau chiffres.
- **CTA** : remplacer le `ReservationTrigger` par un lien `<a href="#contact">` avec **exactement les mêmes classes** que le bouton actuel (`rounded-btn bg-canard py-[15px] pl-[27px] pr-[26px] text-[16.5px] font-bold text-white shadow-cta hover:bg-canard-dark` + `Chevron`). Libellé : **« Parler de mon projet »**.
- **Accroche mono sous la grille** : `L'implémentation IA pensée pour votre quotidien de dirigeant.`

### 3.2 PartenaireNovances — réutilisé sans aucune modification.

### 3.3 ParolesDirigeants — réutilisé sans aucune modification.
⚠️ Garde-fou : ce sont des **citations sourcées** de dirigeants (pas des avis clients Marssane) ; le kicker « Paroles de dirigeants · citations sourcées » est obligatoire et ne doit pas être retiré.

### 3.4 ChiffresImplementation (copie de `BandeauChiffres.tsx`)

Layout, quadrillage, filets, tailles : identiques. Textes :

- Kicker : `Marssane en chiffres` (inchangé)
- H2 : `L'IA bien implémentée, voilà ce que [ça change].` — surlignage sur « ça change », « + » turquoise (comme l'original, seul « utilisée » devient « implémentée »).
- Les trois chiffres (valeurs et unités **inchangées**, labels adaptés) :
  1. label `Dès la mise en place` — **2 h** — `gagnées chaque jour`
  2. label `Pour les nouveaux utilisateurs` — **+34 %** — `de productivité` (inchangé)
  3. label `Au total` — **10 h** — `par semaine` (inchangé)

⚠️ Conserver le commentaire d'avertissement en tête de fichier (chiffres non sourcés, à étayer).

### 3.5 MethodeImplementation (copie de `Accompagnement.tsx`, bande claire)

Même structure : `KickerPill`, H2, sous-titre, `<ol>` de 3 cartes avec vignette fausse UI 212 px + repère mono + titre + texte, cascade `i*150ms`.

- KickerPill : `De l'audit au système qui tourne`
- H2 : `Nous construisons, vous gardez [la main].` — surlignage sur « la main ».
- Sous-titre : `Trois temps : diagnostic, construction, passation. Vous validez chaque étape.`
- Les trois cartes :
  1. Repère `01` — titre `Diagnostic · votre semaine au crible` — texte : `On liste ce qui vous prend du temps : mails, devis, relances, comptes-rendus. On identifie ce qui peut tourner seul.`
     Vignette (adapter celle de la carte 1) : widget « Votre semaine » avec trois lignes cochables « mails · 45 min/j », « relances · vendredi soir », « CR · jamais faits » + pastille `à automatiser en premier`.
  2. Repère `01 → 02` — titre `Construction · sur vos outils` — texte : `On construit les agents sur vos vrais documents, votre vraie boîte mail. Rien de générique.`
     Vignette (adapter celle de la carte 2) : chip « Vos outils », flow `boîte mail ⋯ agent ⋯ VOUS`, puis « ✓ Testé sur vos dossiers » et « Ajusté avec vous ».
  3. Repère `02` — titre `Passation · vous pilotez` — texte : `Le système tourne. Vous savez le relancer, l'ajuster, et décider de ce que vous lui confiez.`
     Vignette : reprendre telle quelle la vignette « mini-réseau » de la carte 3 actuelle (nœuds « mails », « devis », « relances » reliés au monogramme) avec la pastille `votre système démarre`.

### 3.6 Formateur (réutilisé, avec les deux nouvelles props)

- `kicker="Qui vous accompagne"`
- `titre` : `Un interlocuteur qui pratique l'IA [au quotidien].` — surlignage sur « au quotidien » (comme l'original ; seul « Un formateur » devient « Un interlocuteur »).
- Tout le reste **strictement inchangé** : portrait, « Cléante Oullion », rôle « Fondateur de Marssane », les 4 badges (Claude Code, AI Fluency, MCP, API Claude), la ligne « Certifié Anthropic Academy sur tout l'écosystème Claude. »

⚠️ Garde-fou absolu : ne jamais ajouter d'autre titre, certification, partenariat ou agrément. Les badges sont des certifications suivies à l'Anthropic Academy, rien de plus.

### 3.7 CasAutomatisations (copie de `CasConcrets.tsx`)

Même mécanique (sélecteur liste/détail, un cas ouvert, compositions fausse UI **réutilisées à l'identique** — ne pas les redessiner). Textes :

- Kicker : `Les cas · six situations de votre semaine` (inchangé)
- H2 : `Les automatisations qu'on [installe] chez vous.` — surlignage sur « installe ».
- Sous-titre : `Six situations de votre semaine, prises en charge par des agents qui tournent sur vos outils.`
- Les 6 cas : **titres courts et titres de panneau inchangés** (ils sont déjà formulés côté problème). Descriptions — seules les n° 2, 4 et 6 changent d'une nuance pour passer du « vous faites en formation » au « ça tourne chez vous » :
  1. (inchangé) `Votre boîte se trie toute seule : restent les 6 mails qui comptent, les réponses pré-rédigées dans votre ton.`
  2. `Une note vocale entre deux rendez-vous, et l'agent prépare le devis chiffré, prêt à valider. Le premier qui répond signe.`
  3. (inchangé) `Une synthèse de 12 lignes, les points d'attention sourcés page par page.`
  4. `L'enregistrement devient un CR structuré, sans que personne ne s'y colle : décisions, qui fait quoi, pour quand.`
  5. (inchangé) `Des relances graduées, fermes mais dans votre ton, prêtes à partir au bon rythme.`
  6. `Une fiche de synthèse client, générée à la demande : historique, encours, points de friction, en une page.`
- CTA de sortie : `Voir les offres` + Chevron → `#offres`.

### 3.8 AvantApresImplementation (copie de `AvantApres.tsx`, bande claire)

Même layout (titre à gauche, CTA à droite, deux colonnes ×/✓).

- KickerPill : `Avant / après` (inchangé)
- H2 : `Ce qui change quand le système [tourne].` — surlignage sur « tourne ».
- CTA à droite du titre : lien `<a href="#contact">` (mêmes classes que le bouton canard actuel) — libellé **« Parler de mon projet »**.
- Colonne gauche — H3 `Sans Marssane`, sous-texte : `Chaque tâche répétitive reste la vôtre, soir après soir.` (inchangé)
- Colonne droite — H3 `Avec Marssane`, sous-texte : `Un système construit pour vous, qui tourne dès les premières semaines.`
- Les cinq paires (4 inchangées, la 4ᵉ adaptée) :
  | Sans | Avec |
  |---|---|
  | 47 mails non triés chaque matin | 6 mails à traiter, le reste classé |
  | Le devis part à 22 h | Le devis chiffré part entre deux rendez-vous |
  | Les relances attendent le vendredi soir | Elles partent seules, vous validez |
  | Un abonnement IA qui dort | Des agents qui travaillent sur vos dossiers |
  | Le doute sur ce que l'IA peut voir de vos données | Vous savez quoi confier, quoi garder |

### 3.9 AlignementImplementation (copie de `Alignement.tsx`)

Même constellation (chip central Marssane, deux orbites, six satellites).

- Kicker : `Notre modèle` (inchangé)
- H2 : `Votre autonomie est [notre modèle].` (inchangé, surlignage sur « notre modèle »)
- Paragraphe : `Nous installons, vous restez propriétaire : le système tourne sur vos outils, sans dépendance à un prestataire.`
- Les six satellites : `Diagnostic de votre semaine · Agents IA sur mesure · Sur vos outils · Passation complète · Sans engagement · Formation en option`

### 3.10 OffresDeuxVoies (copie de `FormationsDeuxNiveaux.tsx`)

Même bande pleine largeur, mêmes deux cartes (sombre à gauche, claire à droite), mêmes dérogations locales (rayon 20 px, boutons pill, flèche « → »). **Ancre `id="offres"`** (remplace `id="formation"`) avec le même `scroll-mt-[76px]`.

- H2 : `Commencez par la voie qui vous [correspond].` — surlignage sur « correspond », « + » turquoise.
- Sous-titre : `L'implémentation livre des résultats immédiats ; la formation rend votre équipe autonome.`

**Carte 1 — sombre — Implémentation :**
- Titre : `Implémentation sur mesure`
- Pastille (même style mono bordé turquoise que la pastille prix) : `Sur devis`
- Phrase : `Nous installons des agents IA sur vos outils : vous récupérez du temps dès les premières semaines.`
- CTA (bouton blanc à halo, comme l'actuel) : `Parler de mon projet →` — lien `<a href="#contact">` (pas la modale).
- 5 points ✓ :
  1. `Diagnostic de vos tâches répétitives`
  2. `Des agents construits sur vos outils : mails, devis, relances`
  3. `Testé sur vos vrais dossiers avant la mise en route`
  4. `Passation : vous savez piloter le système`
  5. `Suivi jusqu'à ce que ça tourne sans nous`

**Carte 2 — claire — Formation :**
- Titre : `Les formations`
- Pastille : `Dès 980 € par personne`
- Phrase : `Vous préférez apprendre à faire vous-même : prenez l'IA en main et repartez avec vos premiers automatismes.`
- CTA (bouton encre, comme l'actuel « Découvrir ce niveau ») : `Découvrir les formations →` — `Link` vers `/formations`.
- 5 points ✓ :
  1. `Niveau débutant : 2 séances de 3 h 30 (7 heures au total)` — importer `FORMATION_DUREE` depuis `lib/creneaux` comme aujourd'hui.
  2. `Présentiel près de Lyon, dix places`
  3. `Chacun sur son ordinateur, sur son propre cas`
  4. `Pré-inscription sans engagement`
  5. `Niveau confirmé : prochainement`

### 3.11 ContactFinal (carte de `Reservation.tsx` + `ContactForm`)

Même section encre `pt-[100px] pb-[90px]`, mêmes décors (trait vertical, PlusMark, « + » aux coins de la carte), **ancre `id="contact"`** conservée. La carte reste centrée mais s'élargit pour accueillir le formulaire : garder la carte `rounded-card border-line-sur-ink bg-surface-sur-ink`, largeur `max-w-[720px]` (comme la carte de `/implementation`), padding `px-6 py-12 sm:px-10 sm:py-14`.

- H2 : `Parlez-nous de [votre projet].` — surlignage sur « votre projet », « + » turquoise en exposant, point hors surlignage.
- Paragraphe (16,5 px, centré, max-w 460px) : `Décrivez votre besoin en quelques lignes : nous revenons vers vous rapidement avec un premier diagnostic.`
- En dessous : `<ContactForm />` réutilisé tel quel (champs Prénom, Nom, Email, Téléphone, Entreprise, Message, consentement, bouton « Envoyer ma demande », server action `submitContact` existante — **ne rien changer** au formulaire ni à l'action).
- Mention sous le formulaire (13 px, atténué, centrée) : `Réponse rapide · sans engagement · vos données restent confidentielles.`
- ⚠️ Comme aujourd'hui : **aucune date, aucun compteur de places** côté public.

### 3.12 FaqImplementation + `lib/implementation-faq.ts` (copie de `Faq.tsx` / `formation-faq.ts`)

Même bande claire, mêmes accordéons `<details>`. KickerPill `Vos questions`, H2 `Les questions [qu'on nous pose].` (inchangés).

`IMPLEMENTATION_FAQ` — 8 entrées `{ question, reponse }` (réponses = texte brut, aussi injecté en JSON-LD) :

1. **Q :** `Qu'est-ce que Marssane implémente concrètement ?`
   **R :** `Des agents IA qui prennent en charge vos tâches répétitives : tri de la boîte mail, préparation des devis, relances d'impayés, comptes-rendus de réunion, synthèses de documents. On part de votre semaine réelle, pas d'un catalogue.`
2. **Q :** `Qu'est-ce qu'un agent IA ?`
   **R :** `Un programme qui s'appuie sur un modèle d'IA (comme Claude) pour exécuter une tâche de bout en bout sur vos outils : lire les nouveaux mails, les classer, préparer une réponse. Vous gardez la validation finale.`
3. **Q :** `Combien de temps avant les premiers résultats ?`
   **R :** `Les premières automatisations tournent en quelques semaines : on commence par la tâche qui vous coûte le plus de temps, on la met en route, puis on élargit.`
4. **Q :** `Sur quels outils travaillez-vous ?`
   **R :** `Sur les vôtres : votre messagerie, vos documents, vos fichiers. Les agents sont construits autour de vos outils existants, pas l'inverse.`
5. **Q :** `Mes données sont-elles en sécurité ?`
   **R :** `On définit ensemble, dès le diagnostic, ce que l'IA peut voir et ce qui reste hors de son périmètre. Vous savez à tout moment quoi lui confier, quoi garder.`
6. **Q :** `Combien ça coûte ?`
   **R :** `Sur devis, selon le périmètre : nombre de tâches à automatiser, outils concernés, niveau d'accompagnement. Le diagnostic permet de chiffrer précisément avant de s'engager.`
7. **Q :** `Serai-je dépendant de Marssane ensuite ?`
   **R :** `Non : la passation fait partie de la mission. Le système tourne sur vos outils, vous savez le piloter et l'ajuster. Notre modèle, c'est votre autonomie.`
8. **Q :** `Et si je préfère apprendre à faire moi-même ?`
   **R :** `C'est l'objet de nos formations : 2 séances de 3 h 30 en petit groupe près de Lyon, pour prendre l'IA en main et construire vos premiers automatismes vous-même.`

---

## 4. Ce qu'on ne touche PAS

- `components/site/Hero.tsx`, `Accompagnement.tsx`, `BandeauChiffres.tsx`, `CasConcrets.tsx`, `AvantApres.tsx`, `Alignement.tsx`, `FormationsDeuxNiveaux.tsx`, `Reservation.tsx`, `Faq.tsx`, `lib/formation-faq.ts` : intacts (l'ancienne landing en dépend).
- `ReservationDialog` / `ReservationTrigger` / `app/actions/inscription.ts` : intacts (la Nav et la carte Formation s'en servent).
- `ContactForm` / `app/actions/contact.ts` : intacts.
- `/formations`, `/quelle-ia`, `/implementation`, `/merci`, pages légales : intactes.
- `app/globals.css` : **aucun nouveau token, aucune nouvelle classe** — tout existe déjà.
- Tout ce qui est sous `app/admin/`, `app/formation/`, `app/api/`, `app/parcours/`, `db/`, `lib/crm*`, `lib/facturation*` : hors périmètre absolu.
- **E-mails : ne JAMAIS déclencher d'envoi de test** (script, API Resend, soumission réelle du formulaire vers une vraie adresse). Règle du propriétaire, sans exception. Les e-mails transactionnels existants restent branchés mais on ne les teste pas en envoyant.

## 5. Garde-fous éditoriaux (à respecter dans toute la copie)

1. ParolesDirigeants = citations sourcées, jamais présentées comme des avis clients.
2. Cléante Oullion : « Fondateur de Marssane », 4 certifications Anthropic Academy (Claude Code, AI Fluency, MCP, API Claude) — jamais d'autres titres, jamais « partenaire » ou « agréé » Anthropic.
3. Chiffres 2 h / +34 % / 10 h : conservés tels quels, aucune nouvelle statistique.
4. Aucune date de session ni compteur de places côté public.
5. Ton : français, tutoiement exclu (« vous »), phrases courtes, bénéfice concret, pas de jargon (« agent IA » est expliqué en FAQ).

## 6. Critères de vérification (boucler jusqu'à ce que tout passe)

1. `npm run build` passe sans erreur ni warning nouveau.
2. `/` affiche la nouvelle landing : les 12 sections dans l'ordre du §3, trois bandes claires (Méthode, Avant/Après, FAQ), coupes franches sans filet.
3. `/accueil-formation` est **visuellement identique** à l'ancienne `/` (comparaison visuelle section par section), avec la Nav visible, et répond `noindex` dans ses meta.
4. Tous les CTA « Parler de mon projet » (héro, avant/après, carte Implémentation) scrollent vers `#contact` ; « Voir les offres » vers `#offres` ; « Découvrir les formations » ouvre `/formations` ; le CTA de la Nav et aucun autre n'ouvre la modale de réservation… **sauf** vérifier qu'aucun `ReservationTrigger` ne reste sur la nouvelle landing hors Nav.
5. Le formulaire de contact de `#contact` se soumet (validation des champs, message de succès) — **sans** utiliser d'adresse e-mail réelle tierce et sans vérifier la délivrabilité par un envoi.
6. Les animations d'apparition fonctionnent (sections qui montent en fondu au scroll) et, avec `prefers-reduced-motion`, tout est visible d'emblée.
7. Le sitemap liste toujours exactement 5 URLs ; `/accueil-formation` n'y figure pas.
8. Captures d'écran de recette : **webkit ET chromium** (le propriétaire est sur Safari), desktop 1440 px + mobile 390 px, de la nouvelle landing complète et de `/accueil-formation`. Pour capturer les sections à apparition, neutraliser `scroll-behavior: smooth` et capturer au viewport (sinon les blocs `[data-apparition]` sortent invisibles).
9. Rapport final : lister les choix faits en autonomie et toute ambiguïté rencontrée.
