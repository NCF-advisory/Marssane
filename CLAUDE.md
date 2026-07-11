# CLAUDE.md — Site Marssane

Règles de comportement et d'organisation pour la création de ce site.

**Compromis :** ces règles privilégient la prudence à la vitesse. Pour les tâches triviales, utilise ton jugement.

## Orchestration des modèles (règle imposée par le propriétaire du projet)

- La session principale tourne sur **Fable, effort high** : elle orchestre — analyse des demandes, planification, découpage en tâches, revue et validation du travail.
- **Toute écriture ou modification de code** doit être déléguée au sous-agent **`dev-opus`** (Opus 4.8, effort high) via l'outil Agent, avec un brief précis : fichiers concernés, comportement attendu, contraintes.
- L'orchestrateur n'écrit pas de code lui-même, à l'exception des micro-retouches triviales (typo, valeur de config d'une ligne) et des fichiers de configuration de l'orchestration elle-même (`.claude/`, `CLAUDE.md`).
- Après chaque livraison de `dev-opus`, l'orchestrateur relit le résultat et vérifie qu'il répond au brief avant de le présenter à l'utilisateur.
- Les questions de clarification sont posées à l'utilisateur par l'orchestrateur **avant** de déléguer ; `dev-opus` ne pouvant pas interroger l'utilisateur, il signale ses choix et ambiguïtés dans son rapport final.

## 1. Réfléchir avant de coder

**Ne pas supposer. Ne pas masquer sa confusion. Exposer les compromis.**

Avant d'implémenter :
- Énonce explicitement tes hypothèses. En cas de doute, demande.
- Si plusieurs interprétations existent, présente-les — ne choisis pas en silence.
- Si une approche plus simple existe, dis-le. Formule une objection quand c'est justifié.
- Si quelque chose n'est pas clair, arrête-toi. Nomme ce qui pose problème. Demande.

## 2. La simplicité d'abord

**Le minimum de code qui résout le problème. Rien de spéculatif.**

- Pas de fonctionnalités au-delà de ce qui est demandé.
- Pas d'abstractions pour du code à usage unique.
- Pas de « flexibilité » ou de « configurabilité » non demandée.
- Pas de gestion d'erreur pour des scénarios impossibles.
- Si tu écris 200 lignes et que 50 suffiraient, réécris.

Demande-toi : « Un développeur senior dirait-il que c'est trop compliqué ? » Si oui, simplifie.

## 3. Modifications chirurgicales

**Ne toucher que ce qui est nécessaire. Ne nettoyer que ses propres traces.**

En modifiant du code existant :
- N'« améliore » pas le code, les commentaires ou le formatage adjacents.
- Ne refactorise pas ce qui n'est pas cassé.
- Respecte le style existant, même si tu ferais autrement.
- Si tu repères du code mort sans rapport, signale-le — ne le supprime pas.

Quand tes changements créent des éléments orphelins :
- Supprime les imports / variables / fonctions rendus inutiles PAR tes changements.
- Ne supprime pas le code mort préexistant sans qu'on te le demande.

Le test : chaque ligne modifiée doit se rattacher directement à la demande.

## 4. Exécution guidée par un objectif

**Définir des critères de succès. Boucler jusqu'à vérification.**

Transforme les tâches en objectifs vérifiables :
- « Ajouter une validation » → « Écris des tests pour les entrées invalides, puis fais-les passer »
- « Corriger le bug » → « Écris un test qui le reproduit, puis fais-le passer »
- « Refactoriser X » → « Assure-toi que les tests passent avant et après »

Pour les tâches multi-étapes, énonce un plan bref :
```
1. [Étape] → vérifier : [contrôle]
2. [Étape] → vérifier : [contrôle]
3. [Étape] → vérifier : [contrôle]
```

Des critères de succès solides permettent de boucler seul. Des critères faibles (« que ça marche ») exigent des clarifications constantes.

---

## Contexte spécifique au site

À compléter dès que la stack et la structure du projet seront décidées :

- **Stack :** framework, langage, gestionnaire de paquets (ex. React + Vite, Next.js, HTML/CSS/JS statique).
- **Structure :** où vont les composants, les styles, les assets, les pages.
- **Style :** conventions CSS (Tailwind, CSS modules, BEM…), système de design, tokens de couleur.
- **Contraintes :** compatibilité navigateurs, accessibilité (a11y), performance, responsive.
- **Commandes :** build, dev, lint, test (ex. `npm run dev`, `npm run build`, `npm run lint`).
- **À ne pas toucher :** fichiers de config, dépendances verrouillées, code généré.

---

**Ces règles fonctionnent si :** moins de changements inutiles dans les diffs, moins de réécritures dues à la sur-complexité, et des questions de clarification qui arrivent avant l'implémentation plutôt qu'après les erreurs.
