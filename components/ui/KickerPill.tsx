import type { ReactNode } from "react";

/**
 * Variante « badge » du kicker, réservée aux sections posées en bande claire
 * (cf. `.sur-toile`) : la pilule est à fond blanc pur, donc elle n'aurait aucun
 * relief sur l'encre.
 *
 * Valeurs relevées au navigateur sur le badge de section de
 * 8lab-ecosystem.com (`.preheading-wrapper` > `.preheading.is-shadow` >
 * `.preheading-text`, le 29/07/2026), teintes portées sur les tokens Marssane :
 *   - anneau externe : `box-shadow: 0 0 0 1px #fff` (blanc pur, comme le modèle)
 *   - liseré         : `1px solid rgba(17,17,17,.1)` → même alpha sur l'encre
 *                      des hairlines Marssane, rgba(16,24,40,.1)
 *   - gouttière      : `padding: 7px`, fond transparent — c'est la toile qui
 *                      passe entre le liseré et la pilule, d'où le « double
 *                      liseré » du modèle
 *   - pilule         : `padding: 10px 16px` (soit 17 px / 23 px depuis le bord
 *                      extérieur), ombre en quatre couches (1/3/5/16 px)
 *                      reportée sur rgba(16,24,40,…)
 *   - texte          : 15,25 px → 15 px, semi-gras, casse normale, interlettre
 *                      −0,2 px, gris slate (5,98:1 sur le blanc de la pilule)
 *
 * Seul écart au modèle : le rayon. 8lab arrondit complètement (99999px) ; ici on
 * reprend `rounded-btn` (--radius-btn, 3px), le rayon du CTA « Réserver ma
 * place » — badge à peine adouci plutôt que pilule ronde, pour rester dans la
 * géométrie du kit. Même rayon sur l'anneau et sur la pilule : à 3 px, l'écart
 * concentrique (3 + 7 px de gouttière) se verrait plus qu'il ne se lirait.
 *
 * Purement décoratif : aucun rôle, aucun survol — ce n'est pas un bouton.
 *
 * `w-fit` (et non `inline-flex`) pour que la boîte colle au contenu sans que la
 * ligne de base n'ajoute de descendante sous la pilule : l'écart avec le H2
 * reste celui que la section déclare.
 */
export function KickerPill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex w-fit items-center rounded-btn border border-[rgba(16,24,40,0.1)] p-[7px] shadow-[0_0_0_1px_#fff] ${className ?? ""}`}
    >
      <div className="rounded-btn bg-white px-4 py-[10px] text-[15px] font-semibold leading-none tracking-[-0.2px] text-slate shadow-[0_1px_1px_rgba(16,24,40,0.03),0_3px_3px_rgba(16,24,40,0.05),0_5px_5px_rgba(16,24,40,0.03),0_16px_16px_rgba(16,24,40,0.04)]">
        {children}
      </div>
    </div>
  );
}
