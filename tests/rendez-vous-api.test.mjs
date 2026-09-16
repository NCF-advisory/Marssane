import assert from 'node:assert/strict';
import test from 'node:test';
import loadTs from './helpers/load-ts.mjs';

const creneau = { debut: '2026-10-12T07:00:00.000Z', fin: '2026-10-12T08:00:00.000Z' };
const demande = { coordonnees: { nom: 'Recette', email: 'recette@example.invalid' }, debut: creneau.debut, cle: '4fe40669-c820-44a7-9021-4bf5c3b29449' };
function routeTest() {
  const appels = [];
  const route = loadTs('app/api/rendez-vous/route.ts', {
    '@/app/actions/rendez-vous': {
      chargerDisponibilitesRendezVous: async () => ({ creneaux: [creneau] }),
      confirmerRendezVous: async (...args) => { appels.push(args); return { ok: true, creneau }; },
    },
  });
  return { ...route, appels };
}
function requete(origin, body = JSON.stringify(demande)) {
  // Next reconstruit parfois l'URL avec localhost ; le navigateur utilise 127.0.0.1.
  return new Request('http://localhost:3000/api/rendez-vous', {
    method: 'POST', headers: { host: '127.0.0.1:3000', ...(origin ? { origin } : {}), 'Content-Type': 'application/json' }, body,
  });
}

test('les disponibilités transportent seulement les départs et ne sont pas mises en cache', async () => {
  const response = await routeTest().GET();
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { departs: [creneau.debut] });
});

test('une origine étrangère, un autre port ou une origine absente ne peut pas réserver', async () => {
  const route = routeTest();
  for (const origin of ['https://autre.example', 'http://127.0.0.1:3001', undefined, 'null']) {
    assert.equal((await route.POST(requete(origin))).status, 403);
  }
  assert.equal(route.appels.length, 0);
});

test('le même hôte est accepté malgré la réécriture interne de localhost par Next', async () => {
  const route = routeTest();
  const response = await route.POST(requete('http://127.0.0.1:3000'));
  assert.deepEqual(await response.json(), { ok: true, creneau });
  assert.deepEqual(route.appels, [[demande.coordonnees, demande.debut, demande.cle]]);
});

test('un corps absent, invalide ou incomplet n’atteint pas la réservation', async () => {
  const route = routeTest();
  for (const body of ['', '{', '{}', '{"coordonnees":null}']) {
    assert.equal((await route.POST(requete('http://127.0.0.1:3000', body))).status, 400);
  }
  assert.equal(route.appels.length, 0);
});
