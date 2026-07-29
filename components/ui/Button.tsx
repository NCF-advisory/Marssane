import type { ReactNode } from "react";
import { Chevron } from "@/components/ui/Chevron";

type Variant = "primary" | "secondary" | "link";

type ButtonProps = {
  variant?: Variant;
  /** Ajoute le chevron en fin de libellé. */
  chevron?: boolean;
  /** Si fourni, rend un <a href> ; sinon un <button type="button">. */
  href?: string;
  children: ReactNode;
  className?: string;
};

const base = "inline-flex items-center";

const variants: Record<Variant, string> = {
  // Fond canard, texte blanc, rayon 3, ombre CTA. Hover = canard sombre
  // (assombrissement de la maquette, pas le bleu de la charte).
  primary:
    "gap-[13px] rounded-btn bg-canard py-[15px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-white shadow-cta transition-[background-color] duration-[180ms] ease-out hover:bg-canard-dark",
  // Fond blanc, bordure 1,5 px, rayon 3, pas d'ombre.
  secondary:
    "gap-[13px] rounded-btn border-[1.5px] border-outline bg-surface py-[13.5px] pl-[27px] pr-[26px] text-[16.5px] font-bold tracking-[-0.005em] text-ink transition-[background-color] duration-[180ms] ease-out hover:bg-toile",
  // Lien tertiaire : texte canard 600, chevron en gap 10 px.
  link: "gap-2.5 text-[15px] font-semibold text-canard transition-colors hover:text-canard-dark",
};

/**
 * Bouton primitif. Rend un <a> (si `href`) ou un <button>.
 * Variantes : primary (CTA), secondary (contour), link (lien chevron).
 */
export function Button({
  variant = "primary",
  chevron = false,
  href,
  children,
  className,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className ?? ""}`;
  const content = (
    <>
      {children}
      {chevron && <Chevron />}
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
