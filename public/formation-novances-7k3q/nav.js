/*
 * Flèches de navigation de la présentation Novances.
 *
 * La présentation exportée ne s'avance qu'au clavier : ce script ajoute deux
 * boutons « précédent » / « suivant » cliquables et tactiles, posés sur <body>
 * (hors de #deck, qui est mis à l'échelle par transform).
 *
 * Il est chargé par une ligne ajoutée à la main avant </body> dans index.html :
 *   <script src="/formation-novances-7k3q/nav.js"></script>
 * Cette ligne est perdue à chaque réexport de la présentation : la remettre.
 */
(function () {
  var deck = window.__deck;
  if (!deck) return;

  var style = document.createElement("style");
  style.textContent =
    ".nav-fleche{position:fixed;top:50%;transform:translateY(-50%);" +
    "width:44px;height:44px;display:flex;align-items:center;justify-content:center;" +
    "padding:0;border:1px solid rgba(255,255,255,.28);border-radius:50%;" +
    "background:rgba(14,14,18,.82);color:#fff;opacity:.55;" +
    "cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;" +
    "z-index:55;transition:opacity .2s ease}" +
    ".nav-fleche:hover,.nav-fleche:active{opacity:1}" +
    ".nav-fleche-prev{left:12px}.nav-fleche-next{right:12px}" +
    // En portrait le deck ne tient qu'une bande centrale : les flèches
    // descendent dans le vide du bas plutôt que de couvrir les slides.
    "@media (orientation:portrait){.nav-fleche{top:auto;" +
    "bottom:max(24px,env(safe-area-inset-bottom));transform:none}}";
  document.head.appendChild(style);

  // Le document écoute keydown (Espace / Entrée = slide suivante) : un bouton
  // focalisé avancerait deux fois. On empêche donc tout focus.
  function bouton(sens, label, trace, action) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "nav-fleche nav-fleche-" + sens;
    b.tabIndex = -1;
    b.setAttribute("aria-label", label);
    b.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="' +
      trace +
      '" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    b.addEventListener("mousedown", empecherFocus);
    // preventDefault sur un pointerdown tactile annule le clic qui suit dans
    // WebKit : on ne le bloque qu'à la souris, le handler focus prend le relais.
    b.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") empecherFocus(e);
    });
    b.addEventListener("focus", function () {
      b.blur();
    });
    b.addEventListener("click", function (e) {
      e.preventDefault();
      action.call(deck);
    });
    document.body.appendChild(b);
  }

  function empecherFocus(e) {
    e.preventDefault();
  }

  bouton("prev", "Slide précédente", "M15 5 L8 12 L15 19", deck.prev);
  bouton("next", "Slide suivante", "M9 5 L16 12 L9 19", deck.next);
})();
