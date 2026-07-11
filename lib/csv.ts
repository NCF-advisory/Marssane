/**
 * Génération de CSV pour l'export des inscriptions (F3 · CDC §5.3).
 *
 * Cible Excel français :
 *  - BOM UTF-8 en tête (Excel détecte alors l'encodage et affiche les accents) ;
 *  - séparateur `;` (le séparateur de liste par défaut des locales fr) ;
 *  - fins de ligne CRLF.
 *
 * Sécurité :
 *  - échappement CSV standard (guillemets doublés, cellule entourée dès qu'elle
 *    contient `;`, un guillemet ou un saut de ligne) ;
 *  - protection contre l'injection de formule (« CSV injection ») : une cellule
 *    commençant par `=`, `+`, `-` ou `@` est préfixée d'une apostrophe, ce qui
 *    neutralise son interprétation comme formule à l'ouverture du fichier.
 *
 * Module pur (aucun accès base, aucun I/O) : sûr à importer partout.
 */

const BOM = "﻿";

/** Échappe une cellule : garde-fou formule puis échappement CSV. */
function escapeCell(value: string): string {
  // 1. Neutralise une éventuelle formule (appliqué avant l'échappement CSV).
  let cell = /^[=+\-@]/.test(value) ? `'${value}` : value;

  // 2. Échappement CSV : double les guillemets et entoure la cellule si elle
  //    contient le séparateur, un guillemet ou un saut de ligne.
  if (/[";\n\r]/.test(cell)) {
    cell = `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

/**
 * Assemble un CSV (avec BOM) à partir d'une ligne d'en-têtes et de lignes de
 * données. Toutes les valeurs sont des chaînes déjà prêtes à l'affichage.
 */
export function toCsv(headers: string[], rows: string[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(";"));
  return BOM + lines.join("\r\n") + "\r\n";
}
