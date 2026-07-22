import type { ReactNode } from "react";

type CheckItemProps = {
  children: ReactNode;
  className?: string;
  /** Fond de la pastille (défaut : écume). Toute valeur CSS de couleur. */
  dotBg?: string;
  /** Couleur du ✓ (défaut : texte sur écume). */
  dotText?: string;
};

/**
 * Ligne à puce : pastille ronde ✓ (19 px, fond écume, texte #006560)
 * suivie d'un texte 14,5 px. Motif récurrent de la maquette.
 *
 * `dotBg`/`dotText` permettent de teinter la pastille (ex. accent d'un niveau
 * de formation) ; sans eux, le style écume d'origine est conservé.
 */
export function CheckItem({ children, className, dotBg, dotText }: CheckItemProps) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[14.5px] text-ink ${className ?? ""}`}
    >
      <span
        aria-hidden
        className={`inline-flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full text-[11px] font-bold ${dotBg ? "" : "bg-ecume text-ink-ecume"}`}
        style={dotBg ? { backgroundColor: dotBg, color: dotText } : undefined}
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}
