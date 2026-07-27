// Le React embarqué par Next.js est un canal canary : il expose `ViewTransition`
// (utilisé dans app/layout.tsx pour le fondu croisé entre pages), que les types
// stables de @types/react ne déclarent pas. Cette référence charge les
// déclarations canary — elle n'a aucun effet à l'exécution.
/// <reference types="react/canary" />
