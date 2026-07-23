# Storyboard — Vidéo héro v2 « Le compteur de temps » (v2.3)

Composition Remotion `HeroV2`. **1920 × 1080, 30 fps, 750 frames = 25,000 s**
(le maximum du brief). Muette, en boucle. Mêmes dimensions et même encodage que
le héro existant (h264 CRF 30 / vp9 CRF 36, `Config.setColorSpace("bt709")` —
plage limitée, déjà dans `remotion.config.ts`).

Le composant du site affiche le média en `aspect-[16/10]` + `object-cover` : la
source 16/9 est rognée d'environ **5 % à gauche et à droite** (zone sûre
horizontale ≈ 96 → 1824 px, hauteur entière visible). Contenu centré ; la barre
de progression est en retrait de 150 px de chaque bord.

**Règles tenues :** 100 % tokens `theme.ts` (canard `#0E7291`, turquoise
`#00D1BE`, écume, encre, toile, bar-track…) ; mouvements lents et maîtrisés ;
aucun motif « IA-tech » (pas de particules, pas de réseau de neurones) ; interdits
respectés (aucune mention « la même semaine », « lundi/vendredi », « 8 h 45 »,
« 10 places »).

## Fil rouge : la BARRE DE PROGRESSION (plus d'horloge)

Une **barre de progression persistante** en bas de cadre (piste bar-track
`#E6E9ED`, remplissage dégradé **canard → turquoise**, étiquette « 2 h » en bout
de piste) matérialise le temps gagné. Elle apparaît dès le CAS 1 et se remplit
**par paliers, pendant les transitions de gain** :

- après le CAS 1 : **+45 min → 37 %**
- après le CAS 2 : **+40 min → 71 %**
- après le CAS 3 : **+35 min → 100 % (= 2 h)**

**Les gains sont les transitions :** à la fin de chaque cas, le gain s'affiche
**en grand, plein centre** (mono gras, apparition punchy mais maîtrisée, ~0,8–1 s)
pendant que la barre s'incrémente visiblement ; puis enchaînement sur la
mini-phrase d'annonce du cas suivant. (L'ancienne horloge de coin et ses chips
sont supprimées.)

## Mini-phrases d'annonce (kickers)

Avant/pendant l'ouverture de chaque cas, une **mini-phrase** (kicker, sans 700,
~42 px, encre) apparaît **en haut du cadre**, au-dessus de la carte mockup —
apparition rapide, ~1 s de lecture pleine, puis le mockup s'anime. Même
traitement pour les trois :

- CAS 1 : **« Répondez automatiquement aux relances des clients »**
- CAS 2 : **« Retenez seulement l'important de vos réunions »**
- CAS 3 : **« Automatisez la relance de vos clients »**

Boucle invisible : la frame 749 se fond vers la toile nue, identique à la frame 0.

---

## Découpage (frames @ 30 fps)

| Plan | Contenu | Frames | Temps |
|------|---------|--------|-------|
| 1 | HOOK typographique | 0 – 96 | 0 – 3,2 s |
| 2 | Kicker 1 + CAS 1 · mails | 90 – 228 | 3,0 – 7,6 s |
| — | GAIN « +45 min » (barre → 37 %) | 224 – 258 | 7,5 – 8,6 s |
| 3 | Kicker 2 + CAS 2 · documents | 254 – 392 | 8,5 – 13,1 s |
| — | GAIN « +40 min » (barre → 71 %) | 388 – 420 | 12,9 – 14,0 s |
| 4 | Kicker 3 + CAS 3 · relances | 418 – 556 | 13,9 – 18,5 s |
| — | GAIN « +35 min » (barre → 100 %) | 552 – 584 | 18,4 – 19,5 s |
| 5 | FINALE (formation → payoff → clôture) | 574 – 750 | 19,1 – 25,0 s |

La **barre de progression** (calque bas de cadre) apparaît en fondu f86 → 106,
reste jusqu'au payoff (100 % à ~f640) puis se fond f700 → 720 quand la clôture
logo s'installe.

---

### Plan 1 — HOOK (0 – 96 · 0 – 3,2 s)

Typographie cinétique sur la toile, phrase **« Nos formations IA vous font gagner
du temps »** sur deux lignes.

- **f0** : toile quasi nue (ancre de boucle).
- **Ligne 1 — « Nos formations IA »** (Plus Jakarta 800, ~132 px, encre), mot par
  mot : « Nos » (f2), « formations » (f9), « IA » (f16) ; posée ~f30.
- **f16 → f38** : **surlignage canard** qui balaie derrière « formations IA ».
- **f32 → f46** : « **+** » **turquoise** en exposant après « IA » (logo Marssane).
- **Ligne 2 — « vous font gagner du temps »** (f46 → f68), ~56 px, ardoise `muted`.
- Texte à l'écran : **Nos formations IA+** · **vous font gagner du temps**.

### Plan 2 — CAS 1 · mails (90 – 228 · 3,0 – 7,6 s)

- **f96 → 148 (kicker)** : « **Répondez automatiquement aux relances des
  clients** » en haut du cadre (~1 s pleine).
- **local 0 → 22** : carte « Boîte de réception » monte en fondu ; compteur « 47 ».
- **local 6 → 30** : 4 lignes de mails « en vrac ».
- **local 34 → 100** : **tri** — badges qui poppent sous un balayage canard :
  **Urgent** (fond canard) ×2 · **À traiter** (fond écume) ×2 · bande
  « **Classé** » (« Banque · Newsletter · 41 autres »).
- **local 100 → 118** : résolution — liseré turquoise, chip « **triée** » (écume),
  pied « **6 à traiter ce matin** » · « **6 / 47** ».
- **GAIN f224 → 258** : « **+45 min** » plein centre (mono, canard, ~168 px, entrée
  punchy) ; la **barre passe de 0 à 37 %**.

### Plan 3 — CAS 2 · documents (254 – 392 · 8,5 – 13,1 s)

- **f260 → 312 (kicker)** : « **Retenez seulement l'important de vos réunions** ».
- **local 0 → 46** : carte PDF « **Contrat fournisseur · 42 pages** » · « 2,4 Mo »,
  corps qui s'empile (barres = volume).
- **local 60 → 110** : bascule vers la **synthèse** (liseré turquoise) — en-tête
  « **Synthèse · 12 lignes** » + chip « **synthétisé** » ; 3 rubriques (**PRIX**
  révision plafonnée à 3 % · **DURÉE** 24 mois, tacite reconduction ·
  **RÉSILIATION** préavis 3 mois) ; encadré « **⚠ 2 points d'attention** ».
- **GAIN f388 → 420** : « **+40 min** » plein centre ; la **barre passe à 71 %**.

### Plan 4 — CAS 3 · relances (418 – 556 · 13,9 – 18,5 s)

- **f424 → 476 (kicker)** : « **Automatisez la relance de vos clients** ».
- **local 0 → 58** : carte « **Note vocale · 0:12** » + triangle de lecture ;
  forme d'onde canard parcourue par une tête de lecture.
- **local 60 → 108** : bascule vers le **courrier de relance** (liseré turquoise) —
  en-tête « **Relance — facture n° 2026-118** » + chip « **rédigé** » ; 3 lignes de
  courrier ; bouton « **Relire & signer** » (canard).
- **GAIN f552 → 584** : « **+35 min** » plein centre ; la **barre passe à 100 %
  (= 2 h)**.

### Plan 5 — FINALE (574 – 750 · 19,1 – 25,0 s)

Trois temps enchaînés en fondu (barre à 100 % en bas jusqu'au payoff).

- **Temps 1 — f584 → 630** : « **Tout ça, vous le construisez en formation.** »
  (sans, encre ; « en formation. » en canard) — clarifie qu'il s'agit d'une
  **formation**, pas d'un logiciel.
- **Temps 2 — f626 → 686 (payoff)** : « **2 h** » en grand (mono, canard, ~168 px)
  + « **rendues, chaque jour.** » (sans, encre `body`), la **barre pleine à 100 %**
  visible en bas. Plein contraste (pas d'horloge).
- **Temps 3 — f674 → 750 (clôture)** : lockup **Marssane** (Ø 300) en fondu, puis
  « **Formation pour dirigeants de PME** » (canard, 700) et « **2 demi-journées,
  selon votre agenda** » (encre `body`, contraste renforcé). Pleine opacité
  atteinte ~f724, maintien, puis **fondu de boucle** f736 → 749 vers la toile nue
  → raccord avec la frame 0.

---

## Poster

`hero-v2-poster.jpg` = **frame 660** — payoff « **2 h — rendues, chaque jour.** »
avec la **barre de progression pleine (100 %)** en bas. L'image la plus parlante
du message « du temps rendu, chaque jour ».

## Textes exacts (récapitulatif)

Nos formations IA+ · vous font gagner du temps · Répondez automatiquement aux
relances des clients · Boîte de réception · 47 · Urgent · À traiter · Classé ·
triée · 6 à traiter ce matin · 6 / 47 · +45 min · Retenez seulement l'important
de vos réunions · Contrat fournisseur · 42 pages · Synthèse · 12 lignes ·
synthétisé · PRIX · DURÉE · RÉSILIATION · ⚠ 2 points d'attention · +40 min ·
Automatisez la relance de vos clients · Note vocale · 0:12 · Relance — facture
n° 2026-118 · rédigé · Relire & signer · +35 min · 2 h · Tout ça, vous le
construisez en formation. · 2 h · rendues, chaque jour. · Formation pour
dirigeants de PME · 2 demi-journées, selon votre agenda.
</content>
