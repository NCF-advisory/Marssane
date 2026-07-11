// Crée un compte administrateur (F3 · CDC §5.3).
//
// Usage : npm run admin:create -- email@exemple.fr
//   → demande le mot de passe dans le terminal, sans écho.
//
// Règles (CDC) :
//   - 2 comptes admins maximum : refus au-delà.
//   - Pas de doublon : refus si l'email existe déjà.
//   - Hash bcrypt (coût 12). Aucun secret n'est journalisé.
//
// Charge .env.local si présent (voir package.json, --env-file-if-exists).

import readline from "node:readline";
import bcrypt from "bcryptjs";
import postgres from "postgres";

const BCRYPT_COST = 12;
const PASSWORD_MIN = 8;
const MAX_ADMINS = 2; // CDC §5.3

/** Sort proprement avec un message d'erreur (aucune donnée sensible). */
function fail(message) {
  console.error(`Erreur : ${message}`);
  process.exit(1);
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  fail(
    "DATABASE_URL est absent. Renseignez-le dans .env.local (voir .env.example).",
  );
}

const email = (process.argv[2] ?? "").trim().toLowerCase();
if (!email) {
  fail("email manquant. Usage : npm run admin:create -- email@exemple.fr");
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  fail(`adresse email invalide : ${email}`);
}

/** Lit une saisie au clavier sans l'afficher (mot de passe). */
function askHidden(prompt) {
  if (!process.stdin.isTTY) {
    fail("aucun terminal interactif : impossible de saisir le mot de passe.");
  }
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    // Masque tout sauf l'affichage initial du libellé du prompt.
    rl._writeToOutput = (str) => {
      if (str.includes(prompt)) rl.output.write(prompt);
    };
    rl.question(prompt, (answer) => {
      rl.output.write("\n");
      rl.close();
      resolve(answer);
    });
  });
}

const sql = postgres(DATABASE_URL, { ssl: "require", prepare: false });

try {
  // 1. Limite de 2 comptes (CDC §5.3).
  const [{ count }] = await sql`select count(*)::int as count from admins`;
  if (Number(count) >= MAX_ADMINS) {
    fail(
      `limite de ${MAX_ADMINS} comptes admins atteinte (CDC §5.3). ` +
        "Supprimez un compte existant avant d'en créer un nouveau.",
    );
  }

  // 2. Pas de doublon (comparaison insensible à la casse).
  const existing = await sql`
    select 1 from admins where lower(email) = ${email} limit 1
  `;
  if (existing.length > 0) {
    fail(`un compte existe déjà pour ${email}.`);
  }

  // 3. Mot de passe (TTY, sans écho).
  const password = await askHidden(`Mot de passe pour ${email} : `);
  if (password.length < PASSWORD_MIN) {
    fail(`mot de passe trop court (minimum ${PASSWORD_MIN} caractères).`);
  }

  // 4. Hash bcrypt (coût 12) puis insertion.
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  await sql`
    insert into admins (email, password_hash)
    values (${email}, ${passwordHash})
  `;

  console.log(`✓ Compte admin créé pour ${email}.`);
} catch (error) {
  // 23505 : course entre la vérification et l'insertion (index unique).
  if (error?.code === "23505") {
    console.error(`Erreur : un compte existe déjà pour ${email}.`);
  } else {
    console.error("Erreur : échec de la création du compte.", error?.message ?? "");
  }
  process.exitCode = 1;
} finally {
  await sql.end();
}
