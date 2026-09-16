# Règle de lecture des schémas SVG

Tous les schémas animés du site utilisent `observeSchemaVisibility` depuis
`/animations/observe-schema-visibility.js`.

- Initialiser `inView` à `false` ; ne pas commencer la lecture au chargement.
- Après l’initialisation des nœuds du dessin, appeler
  `this.observer = observeSchemaVisibility(this)` dans `connectedCallback`.
- Le début est joué quand au moins la moitié du schéma est visible, en tenant
  compte du header fixe. La lecture est suspendue en dehors de cette zone.
- Après une sortie complète de l’écran, la prochaine entrée reprend au début.
- Respecter la pause manuelle et la préférence de mouvement réduit.
- Déconnecter l’observateur dans `disconnectedCallback` et vérifier
  `isConnected`, `running`, `inView` et `document.hidden` avant de programmer une image.

Le schéma statique du hero Automatisation reste sans animation.
