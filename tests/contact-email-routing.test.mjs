import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = [
  "lib/emails.ts",
  "app/confidentialite/page.tsx",
  "app/mentions-legales/page.tsx",
  ".env.example",
];

function countOccurrences(content, value) {
  return content.split(value).length - 1;
}

test("routes Marssane email through contact@marssane.fr", async () => {
  const contents = await Promise.all(
    files.map(async (file) => [file, await readFile(file, "utf8")]),
  );

  for (const [file, content] of contents) {
    assert.doesNotMatch(content, /coullion@ncf-advisory\.fr/, file);
  }

  const contentByFile = new Map(contents);
  const emails = contentByFile.get("lib/emails.ts");
  assert.match(emails, /const contactEmail = "contact@marssane\.fr";/);
  assert.doesNotMatch(emails, /process\.env\.CONTACT_EMAIL/);
  assert.equal(countOccurrences(emails, "replyTo: contactEmail"), 4);
  assert.equal(countOccurrences(emails, "to: contactEmail"), 3);

  assert.equal(
    countOccurrences(
      contentByFile.get("app/confidentialite/page.tsx"),
      "contact@marssane.fr",
    ),
    4,
  );
  assert.equal(
    countOccurrences(
      contentByFile.get("app/mentions-legales/page.tsx"),
      "contact@marssane.fr",
    ),
    2,
  );
});
