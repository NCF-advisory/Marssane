# Prompt — 5 refontes du hero « Quelle IA choisir » (Marssane)

> À coller tel quel dans Claude. Produit 5 pages HTML autonomes, une par direction.

---

## PROMPT

Tu es directeur artistique. Tu vas produire **5 refontes différentes** du haut de page « Quelle IA utiliser aujourd'hui ? » du site Marssane (formation IA pour dirigeants de PME/TPE).

Livre **5 fichiers HTML autonomes** (CSS inline ou `<style>`, aucune dépendance externe, Google Fonts autorisé pour Plus Jakarta Sans et Spline Sans Mono). Un fichier par direction. Desktop d'abord, responsive correct.

### Objectif de la page

Le visiteur doit savoir **en moins de 3 secondes** quelle IA choisir. Pas de questionnaire, pas de comparatif, pas de liste d'options. **Une seule réponse, assénée** : le modèle recommandé occupe le hero comme une annonce, pas comme une fiche produit. C'est une **désignation** (type Pantone Color of the Year) : Marssane a tranché, le visiteur repart avec un nom.

On ne traite que le hero / premier écran. Ignore tout ce qui vient dessous (graphiques, classement complet, méthodo) — prévois juste une amorce de scroll.

### Contenu à afficher (données actuelles — traite-les comme des variables)

- **Modèle recommandé : Claude Opus 5** — éditeur : Anthropic (États-Unis)
- **Réglage : effort medium** (doit être visible, c'est une précision importante)
- Score global : `{{score}}` · Coût : `≈ {{cout}} €/M tokens` (placeholders)
- Mention de fraîcheur : « Mis à jour automatiquement · {{date}} » — le classement change régulièrement, la date est un argument de confiance, mets-la en scène (badge daté, horodatage façon terminal…), ne la cache pas en petit gris.
- Baseline : « Le meilleur compromis intelligence / prix du moment. »
- Un seul CTA possible : « Voir pourquoi » ou « Comment l'utiliser » (ancre vers le bas de page).

### Charte graphique Marssane (v1.1) — NON NÉGOCIABLE

**Couleurs**
- Toile `#EEF1F3` · Surface/carte `#FFFFFF` · Texte `#0E0E12`
- Grille `#E0E4E8` (45 %) · Repères « + » `#C4CBD2`
- **Canard `#0E7291` = action** : un seul élément canard d'action par écran
- **Turquoise `#00D1BE` = ponctuation** : un chiffre-clé, une barre, un badge — jamais en aplat de fond
- Pastels data (lavande `#A88FEE`, périwinkle `#C7D2F7`, écume `#C7F7EF`) : réservés aux contenus montrés, jamais au chrome
- Clay `#C75A4D` : uniquement rappel France / erreurs — probablement inutile ici
- Proportions : 62 toile · 24 surfaces · 7,5 pastels · 4 canard · 1,5 turquoise

**Typographie**
- Plus Jakarta Sans partout. Display 56–64 / 800, H1 38–46 / 800, lead 18 / 400, corps 15–16 / 400
- Spline Sans Mono pour kickers (12px, uppercase, letter-spacing .16em), chiffres et annotations techniques
- Le surlignage signature : mot-clé sur fond canard, texte blanc (voir H1 actuel)

**Toile quadrillée**
- Grille 80px (64px mobile), lignes 1px `#E0E4E8` à 45 %, repères « + » `#C4CBD2` épars
- Washes radiaux menthe/périwinkle, max 2, opacité ≤ 50 %
- La grille est la scène, jamais le spectacle. **Sur fond sombre : pas de grille du tout.**

**Voix**
- Ton d'un pair qui a testé, pas d'un vendeur. Public : dirigeants PME/TPE, langage métier (dossiers, courriers, gestion), jamais tech.
- On dit « gain mesuré », « l'agent propose, vous validez ». On ne dit jamais « boosté », « révolutionnaire », « magique ».

**Interdits absolus**
- Iconographie IA (cerveaux, circuits, réseaux de nœuds, glow)
- Superlatifs marketing

### Les 5 directions (une page chacune)

**1. Le verdict monumental.** Le nom « Claude Opus 5 » en display géant (120px+), quasi seul sur la toile quadrillée. Une ligne au-dessus (kicker mono), une ligne en dessous (réglage + date). Rien d'autre au premier écran. Inspiration : page « Word of the Year » d'un dictionnaire. Le courage du vide.

**2. L'annonce datée.** Composition type « une » éditoriale : badge de désignation daté (« Recommandation Marssane — {{mois}} {{année}} ») en objet graphique fort, nom du modèle en H1, encadré par le motif des trois équerres du logo (le M « tenu »). L'obsolescence programmée du choix devient l'argument : ce qui est affiché est vrai *aujourd'hui*.

**3. Le terminal de mesure.** Registre instrument scientifique : tout en Spline Sans Mono, horodatage précis, score en très grand chiffre turquoise, le nom du modèle affiché comme un relevé (« MODÈLE RETENU : CLAUDE OPUS 5 · EFFORT MEDIUM »). La fraîcheur automatique mise en scène façon tableau de bord qui vient de calculer. Sobre, dense, crédible.

**4. Le hero inversé.** Premier écran fond `#0E0E12` (donc sans grille), nom du modèle en blanc 800, un seul accent turquoise sur le score, CTA canard clair. Rupture maximale avec le reste du site — le seul écran sombre de Marssane, ce qui en fait l'endroit le plus solennel. Retour à la toile claire dès la section suivante.

**5. La carte-objet.** Une seule carte blanche massive, centrée, posée sur la toile — traitée comme un objet physique (ombre héro, coins card), qui contient TOUT : badge N°1 écume, nom, réglage, score, date. Version radicalisée de l'existant : la carte passe de 560px à ~900px, typo doublée, tout le reste de l'écran est vide. L'évidence par la densité concentrée en un point.

### Critères de réussite

1. À l'ouverture, on lit « Claude Opus 5 » avant toute autre chose.
2. « Effort medium » et la date de mise à jour sont visibles sans scroller.
3. Un seul élément canard par écran, turquoise en ponctuation seulement.
4. Aucun cliché IA, aucun superlatif.
5. Les 5 pages sont réellement différentes entre elles — si deux directions se ressemblent, recommence.
