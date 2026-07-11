// Insère une session de TEST publiée pour exercer la landing et le formulaire
// en développement. Idempotent : ne recrée pas la session si elle existe déjà.
//
// Usage : npm run db:seed
// (charge .env.local si présent via --env-file-if-exists, voir package.json)

import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "Erreur : DATABASE_URL est absent. Renseignez-le dans .env.local (voir .env.example).",
  );
  process.exit(1);
}

const LIEU_TEST = "Paris — lieu de test";

// Date J+30 au format YYYY-MM-DD.
const date = new Date();
date.setDate(date.getDate() + 30);
const dateIso = date.toISOString().slice(0, 10);

const sql = postgres(DATABASE_URL, { ssl: "require", prepare: false });

try {
  const existing = await sql`
    select id from sessions where lieu = ${LIEU_TEST} and statut = 'publiee'
  `;

  if (existing.length > 0) {
    console.log(`↷ Session de test déjà présente (id: ${existing[0].id}).`);
  } else {
    const [session] = await sql`
      insert into sessions (date, heure_debut, heure_fin, lieu, capacite, statut)
      values (${dateIso}, '09:00', '17:00', ${LIEU_TEST}, 10, 'publiee')
      returning id
    `;
    console.log(
      `✓ Session de test créée (id: ${session.id}, date: ${dateIso}, 10 places).`,
    );
  }
} catch (error) {
  console.error("Échec du seed :", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
