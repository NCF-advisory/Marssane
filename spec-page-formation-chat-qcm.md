# Page formation Marssane : chat commun et QCM

> Spécification fonctionnelle issue du parcours pédagogique formation débutant (v2).
> Cette page matérialise l'accompagnement A à Z entre les deux demi-journées, sans être chronophage pour le formateur.

## Contexte

La formation débutant se déroule en 2 demi-journées la même semaine (lundi et vendredi), avec 3 jours de pratique accompagnée entre les deux. La page formation du site Marssane est le point de contact unique du participant pendant toute la semaine : le chat commun de la promotion, les QCM de fin de session et la page de suivi.

## 1. Le chat commun

### L'idée

Un espace d'échange unique par promotion (10 participants), ouvert toute la semaine. Les questions sont visibles de tous : une réponse sert à dix, les doublons disparaissent, les participants s'entraident.

Le formateur n'y répond qu'une seule fois, le mercredi, sous forme de FAQ groupée. Son temps est borné et prévisible ; vu du participant, l'accompagnement est continu.

### Les règles du jeu

1. **D'abord Claude, puis le chat.** Le participant pose d'abord sa question à Claude. S'il reste bloqué, il dépose sa question dans le chat accompagnée de la réponse de Claude. Ça filtre la majorité des questions et fait pratiquer exactement ce que la formation enseigne.
2. **Une réponse par semaine, à date fixe.** Le mercredi, le formateur publie une réponse groupée qui traite toutes les questions de la promotion. Les questions récurrentes deviennent des démonstrations en salle le vendredi.
3. **Aucune promesse de réponse individuelle.** Le cadre est annoncé dès la session 1 : pas de frustration, pas de dérive chronophage.

### Fonctionnellement

- Accès par promotion : lien ou identifiant simple communiqué en session 1.
- Fil de messages : question du participant (texte + capture éventuelle), réponses des autres participants, réponse du formateur mise en évidence (visuel distinct, épinglée).
- La FAQ du mercredi est épinglée en tête de fil.
- Les questions/réponses des promotions passées alimentent une FAQ générale, réutilisable de promo en promo.

## 2. Les QCM

### L'idée

Un QCM à la fin de chaque demi-journée, passé par chaque participant sur son propre ordinateur via la page formation. Une dizaine de questions par QCM, alignées sur les critères d'acquisition de la session. Correction automatique, résultats enregistrés par participant.

C'est à la fois l'outil de vérification des acquis, le support de la reprise à chaud en fin de session, et la base de la grille d'évaluation formelle si Marssane vise Qualiopi.

### Côté participant

- Accès au QCM depuis la page formation, ouvert par le formateur en fin de session.
- Une question par écran, réponse unique ou multiple, bouton Valider.
- Score affiché à la fin, avec les bonnes réponses.

### Côté formateur : le mode présentation

À la fin du QCM, le formateur lance un **mode présentation** projeté en salle, pour la reprise à chaud :

- **Une page par question** : navigation question par question (précédent / suivant), au rythme du formateur.
- Sur chaque page : l'énoncé, la répartition des réponses du groupe (barre par option, en pourcentage ou en nombre), et la bonne réponse mise en évidence.
- Les réponses sont **anonymisées à l'écran** : on voit que 6/10 se sont trompés à la question 3, pas qui.
- Le formateur garde de son côté le détail par participant (tableau de résultats individuel), pour repérer qui a besoin d'aide sans l'exposer devant le groupe.
- Export des résultats par participant (base Qualiopi, archivage par promotion).

## 3. La page de suivi

> **À cadrer** — non développée à ce jour.

### L'idée

Rendre la progression du participant visible pendant toute la semaine (parcours v2), sans aucune saisie supplémentaire pour le formateur : l'état s'alimente automatiquement à partir de l'existant.

### Contenu minimal proposé

- Les jalons de la semaine : session 1 suivie, QCM 1 passé, mission d'inter-session, FAQ du mercredi publiée, QCM 2 passé, certificat de participation remis.
- Un état par jalon pour chaque participant (fait / à venir), déduit des données déjà enregistrées : QCM passés, messages postés dans le chat, publication de la FAQ.
- Aucune nouvelle saisie côté formateur.

## Intégration au site existant

Le site dispose déjà d'un module d'administration avec gestion des sessions et des inscriptions (`app/admin/dashboard/sessions`). La page formation doit s'y intégrer plutôt que vivre à part : une promotion = une session existante, les participants inscrits donnent la liste d'accès au chat et aux QCM, et les résultats de QCM s'archivent par session dans le même back-office.

## À trancher pour la v1

- Authentification : lien magique par mail ou code de promotion partagé.
- Chat : notification mail au participant quand la FAQ du mercredi est publiée, ou consultation libre.
- QCM : banque de questions fixe ou variantes par promotion.
- Conservation des données par promotion (durée, archivage).
