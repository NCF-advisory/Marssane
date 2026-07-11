/**
 * Encart affiché quand la base de données est injoignable (DATABASE_URL absent
 * ou connexion en échec). Évite une 500 : le tableau de bord reste consultable,
 * seule la zone de données est remplacée par ce message sobre.
 */
export function DbUnavailable() {
  return (
    <div
      role="alert"
      className="rounded-card border border-outline bg-surface px-6 py-8 text-center shadow-card"
    >
      <p className="text-[16px] font-semibold text-ink">
        Base de données indisponible
      </p>
      <p className="mx-auto mt-2 max-w-[520px] text-[14px] leading-[1.5] text-body">
        La connexion à la base n&apos;a pas pu être établie. Les données ne
        peuvent pas être affichées pour le moment. Vérifiez la configuration puis
        rechargez la page.
      </p>
    </div>
  );
}
