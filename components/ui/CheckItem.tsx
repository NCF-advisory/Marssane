import type { ReactNode } from "react";

type CheckItemProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Ligne à puce : pastille ronde ✓ (19 px, fond écume, texte #006560)
 * suivie d'un texte 14,5 px. Motif récurrent de la maquette.
 */
export function CheckItem({ children, className }: CheckItemProps) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[14.5px] text-ink ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="inline-flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full bg-ecume text-[11px] font-bold text-ink-ecume"
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}
