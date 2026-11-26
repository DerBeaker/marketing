// Frische SpülBlick-Screens für Beiträge: startet den Testserver des App-Repos (erfundene Daten) und fotografiert das Büro.
// Aufruf: node werkzeuge/screens-spuelblick.mjs <ausgabeordner> <liste.csv>   (braucht `npm ci --ignore-scripts` in /home/user/spuelblick, PHP)
import { createRequire } from 'node:module';
import { join } from 'node:path';
const SP = '/home/user/spuelblick';
const require = createRequire(SP + '/package.json');
const { chromium } = require('@playwright/test');
const { neueUmgebung, starteServer, anmelden } = await import(SP + '/test/api/helfer.js');
const { passwortAnmeldung } = await import(SP + '/test/e2e/umgebung.js');
const [aus, liste] = process.argv.slice(2);
const env = neueUmgebung();
const server = await starteServer(env.config);
const url = server.url.replace(/api\/index\.php$/, '');
await anmelden(server.url, env.konten.buero);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5, locale: 'de-DE', timezoneId: 'Europe/Berlin', serviceWorkers: 'block' });
  await ctx.addInitScript(() => { try { localStorage.setItem('sb-geraet-bekannt', '1'); } catch { /* ohne Speicher */ } });
  const p = await ctx.newPage();
  await p.goto(url);
  await passwortAnmeldung(p, env.konten.buero);
  await p.waitForTimeout(1500);
  const schliessen = p.getByRole('button', { name: /verstanden|schließen|ok/i }).first();
  if (await schliessen.isVisible().catch(() => false)) await schliessen.click();
  await p.screenshot({ path: join(aus, 'buero-start.png') });
  const projekte = p.getByRole('link', { name: /Projekte/i }).first();
  if (await projekte.isVisible().catch(() => false)) { await projekte.click(); await p.waitForTimeout(800); }
  await p.screenshot({ path: join(aus, 'buero-projekte.png') });
  const [wahl] = await Promise.all([p.waitForEvent('filechooser', { timeout: 8000 }), p.getByRole('button', { name: /EXCEL-LISTE IMPORTIEREN/i }).click()]);
  await wahl.setFiles(liste);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: join(aus, 'excel-1.png') });
  const felder = p.locator('input:visible:not([type=file]):not([type=search])');
  await felder.nth(0).fill('Musterstadt Kaiserstraße'); await felder.nth(1).fill('Musterstadt');
  await p.waitForTimeout(300); await p.screenshot({ path: join(aus, 'excel-2.png') });
  await p.getByRole('button', { name: 'ANLEGEN UND LISTE PRÜFEN' }).click();
  await p.waitForTimeout(1500);
  await p.locator('select').nth(2).selectOption({ label: 'Schacht unten' }).catch(() => {});
  await p.waitForTimeout(5000);
  await p.screenshot({ path: join(aus, 'excel-3.png'), clip: { x: 244, y: 92, width: 1012, height: 600 } });
} finally { await browser.close(); server.stop(); }
