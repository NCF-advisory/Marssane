import type { ReactNode } from "react";

type BadgeEcumeProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Chip mono en capitales sur fond écume, texte #006560, rayon 2
 * (ex. « 01 · Trier ses mails »).
 */
export function BadgeEcume({ children, className }: BadgeEcumeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-chip bg-ecume px-[11px] py-[5px] font-mono text-[11px] uppercase tracking-[0.12em] text-ink-ecume ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
