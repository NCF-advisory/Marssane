// Applique les migrations SQL de db/migrations/ dans l'ordre alphabétique.
// Idempotent : une table `_migrations` enregistre les fichiers déjà appliqués.
//
// Usage : npm run db:migrate
// (charge .env.local si présent via --env-file-if-exists, voir package.json)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "Erreur : DATABASE_URL est absent. Renseignez-le dans .env.local (voir .env.example).",
  );
  process.exit(1);
}

const migrationsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "db",
  "migrations",
);

const files = fs
  .readdirSync(migrationsDir)
  .filter((name) => name.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.log("Aucune migration à appliquer.");
  process.exit(0);
}

const sql = postgres(DATABASE_URL, { ssl: "require", prepare: false });

try {
  await sql`
    create table if not exists _migrations (
      name       text primary key,
      applied_at timestamptz not null default now()
    )
  `;

  const rows = await sql`select name from _migrations`;
  const applied = new Set(rows.map((row) => row.name));

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`↷ ${file} — déjà appliquée`);
      continue;
    }
    const content = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(content);
      await tx`insert into _migrations (name) values (${file})`;
    });
    console.log(`✓ ${file} — appliquée`);
    count += 1;
  }

  console.log(
    count === 0
      ? "Base déjà à jour."
      : `Migrations terminées (${count} appliquée${count > 1 ? "s" : ""}).`,
  );
} catch (error) {
  console.error("Échec de la migration :", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
