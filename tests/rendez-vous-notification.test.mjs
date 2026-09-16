import assert from 'node:assert/strict';
import test from 'node:test';
import loadTs from './helpers/load-ts.mjs';

const notification = {
  id: '6f197823-21f2-42cb-bf74-3d004fb18bc0',
  coordonnees: { nom: 'Marie <script>alert(1)</script>', email: 'marie@example.invalid' },
  creneau: { debut: '2026-09-18T07:00:00.000Z', fin: '2026-09-18T08:00:00.000Z' },
};
const { construireNotificationRendezVous } = loadTs('lib/rendez-vous-email.ts');

test('le mail contient les coordonnées, le créneau Paris et le lien ERP, avec HTML échappé', () => {
  const mail = construireNotificationRendezVous(notification);
  assert.match(mail.text, /vendredi 18 septembre 2026/);
  assert.match(mail.text, /09:00 – 10:00 \(heure de Paris\)/);
  assert.match(mail.text, /marie@example.invalid/);
  assert.match(mail.html, /https:\/\/erp.marssane.fr\/rendez-vous/);
  assert(!mail.html.includes('<script>'));
  assert(mail.html.includes('&lt;script&gt;'));
  const hiver = construireNotificationRendezVous({ ...notification, creneau: { debut: '2026-11-02T08:00:00.000Z', fin: '2026-11-02T09:00:00.000Z' } });
  assert.match(hiver.text, /09:00 – 10:00/);
});

function transport(t, reponses) {
  const appels = [];
  const erreurs = [];
  const cle = process.env.RESEND_API_KEY;
  const cleRdv = process.env.RENDEZ_VOUS_RESEND_API_KEY;
  delete process.env.RENDEZ_VOUS_RESEND_API_KEY;
  const expediteur = process.env.EMAIL_FROM;
  const expediteurRdv = process.env.RENDEZ_VOUS_EMAIL_FROM;
  process.env.RESEND_API_KEY = 'cle-simulee';
  delete process.env.EMAIL_FROM;
  delete process.env.RENDEZ_VOUS_EMAIL_FROM;
  t.after(() => {
    if (cle === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = cle;
    if (cleRdv === undefined) delete process.env.RENDEZ_VOUS_RESEND_API_KEY; else process.env.RENDEZ_VOUS_RESEND_API_KEY = cleRdv;
    if (expediteur === undefined) delete process.env.EMAIL_FROM; else process.env.EMAIL_FROM = expediteur;
    if (expediteurRdv === undefined) delete process.env.RENDEZ_VOUS_EMAIL_FROM; else process.env.RENDEZ_VOUS_EMAIL_FROM = expediteurRdv;
  });
  t.mock.method(console, 'error', (...args) => erreurs.push(args));
  const { envoyerNotificationRendezVous } = loadTs('lib/rendez-vous-notification.ts', {
    resend: { Resend: class {
      constructor(apiKey) { assert.equal(apiKey, process.env.RENDEZ_VOUS_RESEND_API_KEY || process.env.RESEND_API_KEY); }
      emails = { send: async (...args) => {
        appels.push(args);
        const reponse = reponses.shift();
        if (reponse instanceof Error) throw reponse;
        return reponse ?? { data: { id: 'mail-simule' }, error: null };
      } };
    } },
  });
  return { envoyerNotificationRendezVous, appels, erreurs };
}

test('la notification va seulement à Cléante, avec reply-to client et clé stable', async t => {
  const ctx = transport(t, []);
  await ctx.envoyerNotificationRendezVous(notification);
  assert.equal(ctx.appels.length, 1);
  assert.equal(ctx.appels[0][0].to, 'cleante@marssane.fr');
  assert.equal(ctx.appels[0][0].replyTo, notification.coordonnees.email);
  assert.equal(ctx.appels[0][0].from, 'Marssane <contact@marssane.fr>');
  assert.equal(ctx.appels[0][1].idempotencyKey, `rendez-vous-confirme/${notification.id}`);
});

test('une erreur réseau est retentée avec la même clé anti-doublon', async t => {
  const ctx = transport(t, [new Error('réseau')]);
  await ctx.envoyerNotificationRendezVous(notification);
  assert.equal(ctx.appels.length, 2);
  assert.deepEqual(ctx.appels[0], ctx.appels[1]);
  assert.equal(ctx.erreurs.length, 0);
});

test('l’expéditeur dédié ne modifie ni le destinataire ni les autres mails du site', async t => {
  const ctx = transport(t, []);
  process.env.EMAIL_FROM = 'Autre flux <contact@marssane.fr>';
  process.env.RENDEZ_VOUS_EMAIL_FROM = 'Marssane <notifications@novances-evaluation.fr>';
  await ctx.envoyerNotificationRendezVous(notification);
  assert.equal(ctx.appels[0][0].from, process.env.RENDEZ_VOUS_EMAIL_FROM);
  assert.equal(ctx.appels[0][0].to, 'cleante@marssane.fr');
});

test('une configuration refusée ne déclenche pas de boucle ni d’erreur client', async t => {
  const ctx = transport(t, [{ data: null, error: { name: 'validation_error', statusCode: 403 } }]);
  await ctx.envoyerNotificationRendezVous(notification);
  assert.equal(ctx.appels.length, 1);
  assert.equal(ctx.erreurs.length, 1);
  assert(!JSON.stringify(ctx.erreurs).includes(notification.coordonnees.email));
});

test('la clé dédiée fonctionne indépendamment de la configuration des autres mails', async t => {
  const ctx = transport(t, []);
  delete process.env.RESEND_API_KEY;
  process.env.RENDEZ_VOUS_RESEND_API_KEY = 'cle-rdv-simulee';
  await ctx.envoyerNotificationRendezVous(notification);
  assert.equal(ctx.appels.length, 1);
  assert.equal(ctx.erreurs.length, 0);
});

test('sans clé mail, aucun envoi n’est tenté', async t => {
  const ctx = transport(t, []);
  delete process.env.RESEND_API_KEY;
  await ctx.envoyerNotificationRendezVous(notification);
  assert.equal(ctx.appels.length, 0);
  assert.equal(ctx.erreurs.length, 1);
});

function action(resultat) {
  const taches = [];
  const envois = [];
  const confirmer = loadTs('app/actions/rendez-vous.ts', {
    'next/headers': { headers: async () => new Headers() },
    'next/server': { after: callback => taches.push(callback) },
    '@/lib/rendez-vous-creneaux': { creerCreneauxRendezVous: () => [notification.creneau] },
    '@/lib/rendez-vous': { enregistrerRendezVous: async () => resultat },
    '@/lib/rendez-vous-notification': { envoyerNotificationRendezVous: async n => envois.push(n) },
  }).confirmerRendezVous;
  return { confirmer, taches, envois };
}

test('une nouvelle réservation planifie le mail après la réponse sans exposer l’identifiant interne', async () => {
  const ctx = action({ ok: true, creneau: notification.creneau, notificationId: notification.id });
  const resultat = await ctx.confirmer(notification.coordonnees, notification.creneau.debut, notification.id);
  assert.deepEqual(resultat, { ok: true, creneau: notification.creneau });
  assert.equal(ctx.envois.length, 0);
  assert.equal(ctx.taches.length, 1);
  await ctx.taches[0]();
  assert.deepEqual(ctx.envois, [notification]);
});

test('une demande rejouée ou refusée ne déclenche aucune nouvelle notification', async () => {
  for (const resultat of [{ ok: true, creneau: notification.creneau }, { ok: false, indisponible: true, message: 'Occupé' }]) {
    const ctx = action(resultat);
    await ctx.confirmer(notification.coordonnees, notification.creneau.debut, notification.id);
    assert.equal(ctx.taches.length, 0);
  }
});
