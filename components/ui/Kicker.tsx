import type { ReactNode } from "react";

type KickerProps = {
  children: ReactNode;
  className?: string;
};

/** Label mono en capitales espacées (11,5 px · .15em · gris slate, AA sur toile). */
export function Kicker({ children, className }: KickerProps) {
  return (
    <div
      className={`font-mono text-[11.5px] uppercase tracking-[0.15em] text-slate ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
