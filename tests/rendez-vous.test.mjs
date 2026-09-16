import assert from 'node:assert/strict';
import test from 'node:test';
import loadTs from './helpers/load-ts.mjs';
const { creerCreneauxRendezVous } = loadTs('lib/rendez-vous-creneaux.ts');
const { rendezVousDate, rendezVousHeure } = loadTs('lib/rendez-vous-types.ts');

test('vendredi soir : prochain départ lundi à 9 h à Paris, jamais le week-end', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-09-18T15:00:00.000Z'));
  assert.equal(slots[0].debut, '2026-09-21T07:00:00.000Z');
  assert.equal(slots[0].fin, '2026-09-21T08:00:00.000Z');
  for (const c of slots) {
    assert(!/samedi|dimanche/.test(rendezVousDate(c.debut)));
    assert(Number(rendezVousHeure(c.debut).slice(0, 2)) >= 9);
    assert(Number(rendezVousHeure(c.fin).slice(0, 2)) <= 18);
    assert.equal(new Date(c.fin) - new Date(c.debut), 3_600_000);
  }
});

test('un créneau commencé est exclu, le suivant reste disponible', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-09-15T07:00:00.000Z'));
  assert.equal(slots[0].debut, '2026-09-15T08:00:00.000Z');
  assert.equal(rendezVousHeure(slots[0].debut), '10:00');
});

test('heure été : 9 h à Paris reste 9 h malgré le changement de décalage UTC', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-03-27T06:00:00.000Z'));
  assert.equal(slots[0].debut, '2026-03-27T08:00:00.000Z');
  assert(slots.some(c => c.debut === '2026-03-30T07:00:00.000Z'));
  assert.equal(rendezVousHeure('2026-03-30T07:00:00.000Z'), '09:00');
});

test('heure hiver : 9 h à Paris reprend le décalage UTC+1', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-10-23T06:00:00.000Z'));
  assert.equal(slots[0].debut, '2026-10-23T07:00:00.000Z');
  assert(slots.some(c => c.debut === '2026-10-26T08:00:00.000Z'));
  assert.equal(rendezVousHeure('2026-10-26T08:00:00.000Z'), '09:00');
});

test('horizon borné à 30 jours et aucun départ en double', () => {
  const now = new Date('2026-09-15T10:24:00.000Z');
  const slots = creerCreneauxRendezVous(now);
  assert(slots.length > 0);
  assert.equal(new Set(slots.map(c => c.debut)).size, slots.length);
  assert(slots.every(c => new Date(c.debut) > now && new Date(c.debut) < new Date(now.getTime() + 30 * 86_400_000)));
});
