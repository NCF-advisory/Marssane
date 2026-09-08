import assert from 'node:assert/strict';
import { createSessionToken } from '../lib/session.ts';

// À exécuter contre un serveur Next démarré, aucun e-mail ni écriture métier.
const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3022';
const session = 'dd35d3bd-056b-4c60-a212-f5c9fe6c1390';
const destinations = [
  ['/admin', '/'],
  ['/admin/dashboard?token=ne-pas-transmettre', '/'],
  ['/admin/dashboard/sessions', '/formations/gestion'],
  [`/admin/dashboard/sessions/${session}`, `/formations/gestion/${session}`],
  [`/admin/dashboard/sessions/${session}/export`, `/formations/gestion/${session}/export`],
  ['/admin/dashboard/crm/personnes/ancien-id', '/commercial'],
  ['/admin/dashboard/facturation/devis/ancien-id', '/finance'],
  ['/admin/imprimer/facture/ancien-id', '/finance'],
  ['/admin/dashboard/documents', '/formations'],
];
for (const [path, destination] of destinations) {
  const r = await fetch(base + path, { redirect: 'manual' });
  assert.equal(r.status, 307, path);
  assert.equal(r.headers.get('location'), 'https://erp.marssane.fr' + destination, path);
  assert.match(r.headers.get('set-cookie'), /marssane_admin_session=;/);
  assert.match(r.headers.get('set-cookie'), /Max-Age=0/i);
  assert.equal(r.headers.get('cache-control'), 'no-store');
}
// Une session historiquement valide ne rouvre pas l'admin.
const token = await createSessionToken({ sub: 'controle-retrait', email: 'controle@example.invalid' });
const cookie = `marssane_admin_session=${token}`;
const r = await fetch(base + '/admin/dashboard', { redirect: 'manual', headers: { cookie } });
assert.equal(r.status, 307);
const head = await fetch(base + '/admin', { method: 'HEAD', redirect: 'manual' });
assert.equal(head.status, 307);
for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
  const blocked = await fetch(base + '/admin/dashboard', { method, redirect: 'manual', headers: { cookie } });
  assert.equal(blocked.status, 410, method);
  assert.equal(blocked.headers.get('location'), null);
}
for (const path of ['/', '/formation']) {
  const page = await fetch(base + path, { redirect: 'manual' });
  assert.equal(page.status, 200, path);
}
const privatePage = await fetch(base + '/formation/espace', { redirect: 'manual' });
assert.equal(privatePage.status, 307);
assert.equal(new URL(privatePage.headers.get('location'), base).pathname, '/formation');
const cron = await fetch(base + '/api/rappels');
assert.equal(cron.status, 401); // Aucun déclenchement d'e-mail.
console.log('Retrait admin : redirections, anciens cookies, écritures bloquées, site public et protection participant vérifiés.');
