import Image from "next/image";

type CasVisuelProps = {
  visuel: { src: string; alt: string };
};

/**
 * Visuel 3D d'un cas concret (5:4, rendu WebP). Deux mouvements, répartis sur
 * deux éléments pour qu'ils ne se disputent pas la propriété `transform` :
 * l'enveloppe porte la parallaxe au défilement (CSS pur, cf.
 * `.cas-visuel-parallaxe` dans globals.css), l'image porte le soulèvement de
 * 4 px au survol — le relief vient de l'objet rendu, pas d'une rotation de la
 * carte. `motion-safe` neutralise le survol quand l'utilisateur demande à
 * réduire les animations ; la parallaxe l'est de son côté, dans sa feuille de
 * style. La largeur est bornée par le conteneur parent, pas ici.
 */
export function CasVisuel({ visuel }: CasVisuelProps) {
  return (
    <div className="cas-visuel-parallaxe">
      <Image
        src={visuel.src}
        alt={visuel.alt}
        width={1000}
        height={800}
        sizes="(min-width: 1024px) 540px, 100vw"
        className="aspect-[5/4] w-full rounded-card object-cover shadow-hero transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1"
      />
    </div>
  );
}
