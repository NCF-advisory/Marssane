import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "link";

type ButtonProps = {
  variant?: Variant;
  /** Ajoute la flèche « → » en fin de libellé. */
  arrow?: boolean;
  /** Si fourni, rend un <a href> ; sinon un <button type="button">. */
  href?: string;
  children: ReactNode;
  className?: string;
};

const base =
  "inline-flex items-center gap-2.5 font-semibold transition-colors";

const variants: Record<Variant, string> = {
  // Fond canard, texte blanc, rayon 3, ombre CTA. Hover = canard sombre
  // (assombrissement de la maquette, pas le bleu de la charte).
  primary:
    "rounded-btn bg-canard px-[27px] py-[15px] text-base text-white shadow-cta hover:bg-canard-dark",
  // Fond blanc, bordure 1,5 px, rayon 3.
  secondary:
    "rounded-btn border-[1.5px] border-outline bg-surface px-6 py-[13px] text-[15px] text-ink hover:bg-toile",
  // Lien tertiaire : texte canard 600.
  link: "text-[15px] text-canard hover:text-canard-dark",
};

/**
 * Bouton primitif. Rend un <a> (si `href`) ou un <button>.
 * Variantes : primary (CTA), secondary (contour), link (lien flèche).
 */
export function Button({
  variant = "primary",
  arrow = false,
  href,
  children,
  className,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className ?? ""}`;
  const content = (
    <>
      {children}
      {arrow && (
        <span aria-hidden className="text-[1.1em] leading-none">
          →
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes}>
      {content}
    </button>
  );
}
