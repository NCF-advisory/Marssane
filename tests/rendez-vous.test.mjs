import assert from 'node:assert/strict';
import test from 'node:test';
import loadTs from './helpers/load-ts.mjs';
const { creerCreneauxRendezVous } = loadTs('lib/rendez-vous-creneaux.ts');
const { rendezVousDate, rendezVousHeure, rendezVousJour } = loadTs('lib/rendez-vous-types.ts');

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

test('le 22 septembre, tous les créneaux du jour sont exclus, même avant 9 h', () => {
  for (const heure of ['04:00', '07:00', '12:30', '21:59']) {
    const slots = creerCreneauxRendezVous(new Date(`2026-09-22T${heure}:00.000Z`));
    assert.equal(slots[0].debut, '2026-09-23T07:00:00.000Z');
    assert(slots.every(c => rendezVousJour(c.debut) !== '2026-09-22'));
  }
});

test('la limite suit minuit à Paris, même si la date UTC est encore la veille', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-09-21T22:30:00.000Z'));
  assert.equal(slots[0].debut, '2026-09-23T07:00:00.000Z');
  const apresMinuit = creerCreneauxRendezVous(new Date('2026-09-22T22:00:00.000Z'));
  assert.equal(apresMinuit[0].debut, '2026-09-24T07:00:00.000Z');
});

test('demain reste réservable sans imposer un délai de 24 heures', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-09-22T21:59:00.000Z'));
  assert.equal(slots[0].debut, '2026-09-23T07:00:00.000Z');
});

test('vendredi matin : le prochain jour réservable est lundi', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-09-18T06:00:00.000Z'));
  assert.equal(slots[0].debut, '2026-09-21T07:00:00.000Z');
});

test('le changement de mois et d’année suit aussi la date de Paris en hiver', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-12-31T23:30:00.000Z'));
  assert.equal(slots[0].debut, '2027-01-04T08:00:00.000Z');
});

test('heure été : 9 h à Paris reste 9 h malgré le changement de décalage UTC', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-03-27T06:00:00.000Z'));
  assert.equal(slots[0].debut, '2026-03-30T07:00:00.000Z');
  assert(slots.some(c => c.debut === '2026-03-30T07:00:00.000Z'));
  assert.equal(rendezVousHeure('2026-03-30T07:00:00.000Z'), '09:00');
});

test('heure hiver : 9 h à Paris reprend le décalage UTC+1', () => {
  const slots = creerCreneauxRendezVous(new Date('2026-10-23T06:00:00.000Z'));
  assert.equal(slots[0].debut, '2026-10-26T08:00:00.000Z');
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

test('le serveur refuse un créneau du jour conservé dans un ancien formulaire', async () => {
  const maintenant = new Date('2026-09-22T06:00:00.000Z');
  let enregistrements = 0;
  let notifications = 0;
  const { confirmerRendezVous } = loadTs('app/actions/rendez-vous.ts', {
    'next/headers': { headers: async () => new Headers() },
    'next/server': { after: () => { notifications += 1; } },
    '@/lib/rendez-vous-creneaux': { creerCreneauxRendezVous: () => creerCreneauxRendezVous(maintenant) },
    '@/lib/rendez-vous': { enregistrerRendezVous: async (_coordonnees, creneau) => {
      enregistrements += 1;
      return { ok: true, creneau };
    } },
    '@/lib/rendez-vous-notification': { envoyerNotificationRendezVous: async () => {} },
  });
  const coordonnees = { nom: 'Recette', email: 'recette@example.invalid' };
  const cle = '4fe40669-c820-44a7-9021-4bf5c3b29449';
  const refuse = await confirmerRendezVous(coordonnees, '2026-09-22T07:00:00.000Z', cle);
  assert.equal(refuse.ok, false);
  assert.equal(refuse.indisponible, true);
  assert.equal(enregistrements, 0);
  assert.equal(notifications, 0);
  const accepte = await confirmerRendezVous(coordonnees, '2026-09-23T07:00:00.000Z', cle);
  assert.equal(accepte.ok, true);
  assert.equal(enregistrements, 1);
});
