# Lecture de la vidéo publique — Safari

La vidéo du hero existait déjà avec `muted`, `playsInline` et `loop`. Le lecteur
ne tentait toutefois `play()` qu'au montage ; un refus initial ne pouvait être
récupéré qu'avec les contrôles natifs.

Le hook partagé `useLoopingVideo` retente la lecture au chargement effectif,
lorsque la vidéo entre dans l'écran, au retour à la page et à la première
interaction lorsque le navigateur exige un geste. Il fixe le mode muet avant
la lecture et retire les contrôles de secours lorsque la lecture démarre.
Aucun minuteur ne force la lecture en permanence. Les événements sont nettoyés
au démontage. La réduction des animations est respectée dès l'hydratation.

Diagnostic sur la version précédente : Chrome lit le fichier WebM ; WebKit
renvoie `NotAllowedError`, aussi bien pour WebM que pour MP4. Les fichiers sont
servis correctement. Cela reproduit une politique de lecture restrictive,
sans prouver le réglage exact du Safari de l'utilisateur.

Safari peut interdire toute lecture automatique pour un site. Ce choix doit
être modifié dans Safari et ne peut pas être forcé par le code :
https://support.apple.com/fr-fr/guide/safari/ibrw29c6ecf8/mac

Le test navigateur `tests/video-public.mjs` contrôle la lecture, le passage réel
en boucle, la reprise après restauration de page, la récupération par un clic
si nécessaire et le respect de la réduction des animations. Il ne modifie pas
les données du site. Le serveur local de production doit tourner sur le port
3022, ou `TEST_BASE_URL` doit pointer vers un serveur de test/production.
`PLAYWRIGHT_MODULE` peut désigner une installation existante de Playwright ;
`CHROME_PATH` peut préciser le binaire Chrome local.

Validation locale : lint, compilation de production et typage validés ; les
scénarios navigateur passent sur Chrome et WebKit. WebKit exige un clic initial
dans cet environnement, puis la boucle et la reprise fonctionnent.
