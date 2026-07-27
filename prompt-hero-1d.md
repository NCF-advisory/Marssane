# Prompt — remplacer le hero de la page « Quelle IA utiliser aujourd'hui ? » (direction 1D)

> À coller tel quel dans Claude Code, à la racine du repo `Site Marssane`.

---

Tu travailles dans le repo du site Marssane (Next.js App Router + Tailwind v4, tokens dans `app/globals.css`, primitifs dans `components/ui/`, sections dans `components/site/`).

## Objectif

Remplacer le haut de page « Quelle IA utiliser aujourd'hui ? » par un **hero inversé** : un seul écran, fond encre, qui assène une réponse unique. Le visiteur doit lire le nom du modèle recommandé en moins de 3 secondes. Pas de questionnaire, pas de comparatif, pas de liste d'options dans le premier écran. Tout le reste de la page (graphiques, classement complet, méthode) est **inchangé** et repart sur la toile claire dès la section suivante.

Ne touche à rien d'autre : pas de refonte de la nav, du footer, ni des sections en dessous.

## Ce qu'il faut créer

Un composant serveur `components/site/HeroRecommandation.tsx`, monté en tête de la page concernée, à la place du hero actuel.

Props (toutes typées, valeurs par défaut ci-dessous — elles doivent pouvoir venir d'une source de données, le classement change régulièrement) :

| prop | défaut | rôle |
|---|---|---|
| `modele` | `"Claude Opus 5"` | nom affiché en H1 |
| `effort` | `"medium"` | réglage recommandé, affiché « Effort medium » |
| `score` | `"92,4"` | score global /100 |
| `cout` | `"≈ 21 €/M tokens"` | coût |
| `editeur` | `"Anthropic"` | éditeur |
| `pays` | `"États-Unis"` | pays de l'éditeur |
| `date` | `"27 juillet 2026"` | date de mise à jour |
| `logoSrc` | `"/logos/claude.svg"` | logo officiel du modèle |
| `baseline` | `"Le meilleur compromis intelligence / prix du moment."` | |
| `ancre` | `"#pourquoi"` | cible du chevron de scroll |

## Composition exacte (desktop 1440 × 900, écran plein)

Fond `#0E0E12` sur toute la hauteur du premier écran. **Sur fond sombre : le quadrillage clair de la toile n'est pas utilisé tel quel** — à la place :

1. **Quadrillage en filigrane** : pas de 80 px, lignes 1 px `rgba(255,255,255,.055)`, masqué en `radial-gradient(78% 70% at 50% 42%, rgba(0,0,0,.9), rgba(0,0,0,0) 82%)` (mask-image + -webkit-mask-image), `pointer-events:none`.
2. **Repères « + » épars**, Spline Sans Mono 16 px, en blanc de `.08` à `.16` d'opacité — une dizaine, jamais alignés régulièrement. Deux d'entre eux en Plus Jakarta 500, turquoise `rgba(0,209,190,.22–.35)`.
3. **Colonne de contenu** : padding `64px 96px 56px` (clamp le 96 px en `clamp(24px, 6.6vw, 96px)`), `display:flex; flex-direction:column; justify-content:space-between`.
   - **Haut** : logo Marssane (composant existant `LogoMarssane size={30} withWordmark`) à gauche — son « M » suit `--color-ink`, donc le placer dans un wrapper qui redéfinit `--color-ink: #FFFFFF`. À droite, mono 11,5 px / uppercase / `.16em` / `#7A828E` : « Recommandation Marssane · {date} ».
   - **Milieu** : kicker mono 20 px uppercase `.16em` `#98A1AC` « L'IA à utiliser aujourd'hui » ; H1 `{modele}` en Plus Jakarta **800**, 126 px (`clamp(48px, 8.8vw, 126px)`), `letter-spacing:-0.035em`, `line-height:.94`, blanc ; puis « Effort {effort} » en **Spline Sans Mono 600, 30 px, uppercase, .14em, turquoise `#00D1BE`**. C'est la seule ponctuation turquoise du texte avec le score.
   - **Bas** : filet `1px solid rgba(255,255,255,.14)`, puis sur une ligne : bloc « SCORE GLOBAL » (label mono 11,5 px `#7A828E`) + `{score}` en mono 600 56 px turquoise suivi de `/100` en 16 px `#6B7480` ; à côté la baseline 18 px `#C9CED6` sur **une seule ligne** ; à droite `{cout}` en mono 14 px uppercase `#7A828E`.
4. **Logo du modèle, à droite** : tuile carrée 344 px, fond `rgba(255,255,255,.035)`, bordure `1px solid rgba(255,255,255,.10)`, rayon 4 px, positionnée `right:104px; top:206px` (en flux : colonne de droite d'une grille `1fr / 344px`, centrée verticalement). Elle est **tenue par trois équerres** — motif du logo Marssane — 30 × 30 px, traits 3 px `rgba(255,255,255,.55)`, aux coins haut-gauche, bas-gauche, bas-droit, plus un « + » turquoise 25 px en Plus Jakarta 500 débordant au coin haut-droit. À l'intérieur, le logo du modèle en 176 px, `object-fit:contain`, **rendu en silhouette blanche monochrome via `filter: brightness(0) invert(1)`** — aucune couleur d'éditeur n'entre dans la palette (le corail de Claude, le vert d'un autre, etc.). Sous la tuile : mono 12 px uppercase `.16em` `#7A828E` « Éditeur · {editeur} ({pays}) ». `alt="{modele}"`.
5. **Amorce de scroll** : bandeau bas pleine largeur, hauteur 104 px, même fond encre, séparé par `1px solid rgba(255,255,255,.12)`, contenant **un double chevron turquoise** centré, cliquable (`<a href={ancre}>`, `aria-label="Voir le détail plus bas"`) : deux carrés 30 × 30 px tournés à 45°, `border-right`/`border-bottom` 5 px, le premier en `#00D1BE`, le second (décalé de 18 px vers le bas) en `rgba(0,209,190,.4)`. Aucun bouton : c'est la seule incitation de l'écran.

## Contraintes de charte (non négociables)

- Typo : Plus Jakarta Sans partout (titres 800, tracking négatif), Spline Sans Mono pour kickers, chiffres, specs. Demi-tailles conservées telles quelles (11,5 / 12 / 14 px…), ne pas arrondir.
- Turquoise `#00D1BE` = ponctuation uniquement : le réglage, le score, le chevron, deux repères. Jamais en aplat de fond.
- **Aucun élément canard sur cet écran** : le canard `#0E7291` est la couleur d'action et il n'y a pas de bouton ici. Il réapparaît normalement dans les sections claires en dessous.
- Rayons quasi carrés (4 px max), pas de flou, pas de glassmorphism, pas de dégradé décoratif.
- Aucune iconographie IA (cerveau, circuit, réseau de nœuds, glow), aucun emoji, aucun superlatif marketing. Les seuls glyphes : `+ → ↓ ✓ · ✕`.
- Voix : ton d'un pair qui a testé. « Le meilleur compromis intelligence / prix du moment. » et rien de plus.

## Responsive

- < 1100 px : la tuile logo passe sous le bloc de texte, taille 240 px, centrée ; le H1 suit le `clamp`.
- < 640 px : padding horizontal 24 px, kicker 13 px, « Effort medium » 18 px, score 40 px, baseline autorisée à passer sur deux lignes (retirer le `white-space:nowrap`), bandeau chevron 88 px.
- Le premier écran ne doit jamais dépasser `100vh` sur mobile : utiliser `min-height: min(900px, 100vh)`.

## Accessibilité & perf

- Un seul `<h1>` sur la page, c'est le nom du modèle.
- Décors (`+`, quadrillage, chevron) en `aria-hidden`.
- Contraste : blanc sur `#0E0E12`, turquoise sur `#0E0E12` = OK ; ne pas descendre les gris sous `#7A828E`.
- Respecter `prefers-reduced-motion` si tu ajoutes une transition d'apparition (fondu + `translateY(8px)`, 180–240 ms ease-out, aucune boucle infinie).
- Le logo du modèle : SVG servi depuis `/public/logos/`, pas d'appel réseau externe.

## Livrable

1. `components/site/HeroRecommandation.tsx` (composant + props typées + JSDoc court).
2. Le hero actuel retiré de la page, remplacé par ce composant.
3. La section suivante reprend sur la toile claire `#EEF1F3` sans transition dégradée — coupure franche.
4. Pas de nouvelle dépendance, pas de nouveau token couleur dans `globals.css` (réutilise les existants ; les valeurs sombres ci-dessus sont locales à ce composant).
