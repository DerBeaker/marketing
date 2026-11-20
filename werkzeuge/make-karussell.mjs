// Karussells für den Feed (1080 × 1350): echtes Foto als Hintergrund, kurze Texte, optional Handy/Tablet mit echtem App-Screen.
// Aufruf: node werkzeuge/make-karussell.mjs <name>  → posts/<name>/01.jpg … (Playwright global)
// Fotos aus material/umtec/_reel/ (vorbereitet: gedreht, Logos/Kennzeichen verpixelt; Rohmaterial nie committen).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] }));
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1080, H = 1350;
const datei = (p) => (p.startsWith('/') ? p : join(root, p));
const daten = (p) => `data:image/${p.endsWith('.webp') ? 'webp' : p.endsWith('.png') ? 'png' : 'jpeg'};base64,${readFileSync(datei(p)).toString('base64')}`;
const F = 'material/umtec/_reel/', GI = '/home/user/gi-tool/app/willkommen/bilder/', SB = '/home/user/spuelblick/app/start/bilder/';
const THEMEN = {
  abscheiderblick: { name: 'AbscheiderBlick', hg: ['#1565d8', '#0b2f66', '#030d1d'], akzent: '#ffd54a', knopf: '#0b2f66' },
  abscheider3d: { name: 'Abscheider 3D', hg: ['#14707a', '#0b3640', '#03121a'], akzent: '#f2b705', knopf: '#0b3640' },
  mmse: { name: 'MMSE Software', hg: ['#24507f', '#152540', '#060b14'], akzent: '#f2b705', knopf: '#152540' },
};
const KARUSSELLS = {
  // AbscheiderBlick: Generalinspektion an der Tankstelle in Schritten
  abscheiderblick_gi: { th: 'abscheiderblick', folien: [
    { foto: F + 'tankstelle-nacht.jpg', pos: '15% 50%', kicker: 'Tankstelle, 6 Uhr', titel: 'General-<br>inspektion.', text: 'So läuft sie mit AbscheiderBlick 👉', gross: true },
    { foto: F + 'abscheider-leer.jpg', kicker: '1 · Ordnungsprüfung', titel: 'Punkt für Punkt.', text: 'Der Prüf-Assistent folgt dem BFR-Bericht.', geraet: GI + 'handy-ordnung.webp' },
    { foto: F + 'stativ-schacht.jpg', kicker: '2 · Dichtheitsprüfung', titel: 'Pegel eintragen.', text: 'Die Wasserbilanz rechnet die App.', geraet: 'material/screens/abscheider3d-dichtheit.jpg' },
    { foto: F + 'tankstelle-tag.jpg', pos: '15% 50%', kicker: '3 · Bemessung', titel: 'Direkt eintragen.', text: 'Flächen, Abläufe, Zapfsäulen – mit Rechenweg.', geraet: GI + 'handy-bemessung.webp' },
    { foto: F + 'schwimmer.jpg', kicker: '4 · Mängel', titel: 'Antippen.', text: 'Klasse und Frist nach BFR kommen von selbst.', geraet: GI + 'handy-zustand.webp' },
    { foto: F + 'abscheider-leiter.jpg', kicker: '5 · Prüfbericht', titel: 'Ein Knopf.', text: 'PDF-Bericht mit Fotos, Bemessung und Nachweisen.', geraet: GI + 'bericht-1.webp', art: 'blatt' },
    { ende: { zeile: 'Generalinspektion.<br>Ohne Zettelkram.', unter: 'für Einzelanwender kostenlos · Teams mit Pro' } },
  ] },
  // MMSE: vier Apps für Abwasser
  mmse_apps: { th: 'mmse', folien: [
    { foto: F + 'stollen.jpg', kicker: 'MMSE Software', titel: 'Abwasser ist<br>unser Alltag.', text: 'Vier Apps dafür 👉', gross: true },
    { foto: F + 'schacht-oben.jpg', kicker: 'Schachtblick', titel: 'Schachtinspektion.', text: 'Nach ISYBAU, kostenlos im Browser.', geraet: 'material/schachtblick/bilder/app-foto.jpg' },
    { foto: F + 'tankstelle-nacht.jpg', pos: '15% 50%', kicker: 'AbscheiderBlick', titel: 'Generalinspektion.', text: 'Für Einzelanwender kostenlos.', geraet: GI + 'handy-pruefung.webp' },
    { foto: F + 'abscheider-edelstahl.jpg', kicker: 'Abscheider 3D', titel: 'Bauwerk in 3D.', text: 'Bemaßt, mit Dichtheitsprüfung. Kostenlos.', geraet: 'material/screens/abscheider3d-modell.jpg', art: 'tablet' },
    { foto: F + 'spuelen-schacht.jpg', kicker: 'SpülBlick', titel: 'Kanalreinigung.', text: 'Auch im Funkloch. 14 Tage kostenlos testen.', geraet: SB + 'liste-960.webp' },
    { ende: { zeile: 'Ein Account.<br>Vier Apps.', unter: 'alle im Browser · auch offline' } },
  ] },
  // Abscheider 3D: Dichtheitsprüfung und Bauwerksaufnahme
  abscheider3d_dicht: { th: 'abscheider3d', folien: [
    { foto: F + 'stativ-schild.jpg', kicker: 'Dichtheitsprüfung', titel: 'Ohne Zettelkram.', text: 'So geht’s mit Abscheider 3D 👉', gross: true },
    { foto: F + 'baugrube.jpg', kicker: '1 · Aufmaß', titel: 'Bauwerk aufnehmen.', text: 'Daraus wird ein bemaßtes 3D-Modell.', geraet: 'material/screens/abscheider3d-modell.jpg', art: 'tablet' },
    { foto: F + 'sonde-schacht.jpg', kicker: '2 · Längsschnitt', titel: 'Auf Knopfdruck.', text: 'Mit Maßen und Prüfpegel.', geraet: 'material/screens/abscheider3d-schnitt.jpg', art: 'tablet' },
    { foto: F + 'abscheider-blau.jpg', kicker: '3 · Anhang A', titel: 'Pegel eintragen.', text: 'Die Wasserbilanz rechnet die App.', geraet: 'material/screens/abscheider3d-dichtheit.jpg' },
    { foto: F + 'abscheider-hochdruck.jpg', kicker: '4 · Bericht', titel: 'Draufsicht und PDF.', text: 'Für Leichtflüssigkeits- und Fettabscheider.', geraet: 'material/screens/abscheider3d-draufsicht.jpg', art: 'tablet' },
    { ende: { zeile: 'Kostenlos.<br>Ohne Anmeldung.', unter: 'im Browser · auch offline · Daten bleiben auf dem Gerät' } },
  ] },
};
const NAME = process.argv[2];
const K = KARUSSELLS[NAME]; if (!K) throw new Error(`Unbekanntes Karussell (${Object.keys(KARUSSELLS).join(', ')})`);
const th = THEMEN[K.th];
const CSS = `*{margin:0;box-sizing:border-box}body{width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:'DejaVu Sans',sans-serif;color:#fff}
  .foto{position:absolute;inset:0;background-size:cover;filter:contrast(1.1) saturate(.85) brightness(.82)}
  .schatten{position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.72),rgba(0,0,0,.15) 40%,rgba(0,0,0,.15) 62%,rgba(0,0,0,.6))}
  .t{position:absolute;left:70px;right:70px;top:80px;text-shadow:0 4px 24px rgba(0,0,0,.7)}
  .k{font-size:34px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${th.akzent}}
  .g{font-size:82px;font-weight:800;line-height:1.05;margin-top:14px}.gross .g{font-size:104px}
  .x{font-size:40px;font-weight:700;margin-top:18px;line-height:1.3}
  .handy{position:absolute;bottom:-60px;right:80px;width:400px;background:#111827;border-radius:52px;padding:14px;box-shadow:0 40px 100px rgba(0,0,0,.7);transform:rotate(3deg)}
  .handy img{width:100%;display:block;border-radius:40px}
  .tablet{position:absolute;bottom:70px;left:90px;right:90px;background:#111827;border-radius:36px;padding:18px;box-shadow:0 40px 100px rgba(0,0,0,.7);transform:rotate(-2deg)}
  .tablet img{width:100%;display:block;border-radius:20px}
  .blatt{position:absolute;bottom:-120px;right:110px;width:520px;background:#fff;padding:12px;box-shadow:0 40px 100px rgba(0,0,0,.7);transform:rotate(4deg)}.blatt img{width:100%;display:block}
  .nr{position:absolute;bottom:40px;left:70px;font-size:30px;font-weight:700;opacity:.85}
  .ende{position:absolute;inset:0;background:radial-gradient(900px 800px at 50% 40%,${th.hg[0]},${th.hg[1]} 58%,${th.hg[2]});display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px}
  .ende .m{font-size:64px;font-weight:800}.ende .z{font-size:76px;font-weight:800;line-height:1.15;margin-top:60px}.ende .u{font-size:36px;margin-top:30px;opacity:.9}
  .knopf{display:inline-block;margin-top:60px;background:${th.akzent};color:${th.knopf};font-weight:800;border-radius:999px;padding:24px 54px;font-size:46px}`;
const zeichen = readFileSync(join(root, 'material', 'marken', 'mmse-zeichen-weiss.svg')).toString('base64');
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: W, height: H } })).newPage();
const ziel = join(root, 'posts', NAME); rmSync(ziel, { recursive: true, force: true }); mkdirSync(ziel, { recursive: true });
for (const [i, f] of K.folien.entries()) {
  let html;
  if (f.ende) html = `<div class="ende"><div class="m"><img src="data:image/svg+xml;base64,${zeichen}" style="width:120px;vertical-align:middle;margin-right:20px">${th.name}</div>
    <div class="z">${f.ende.zeile}</div><div class="u">${f.ende.unter}</div><div><span class="knopf">Link in der Bio</span></div></div>`;
  else {
    const art = f.art || 'handy';
    html = `<div class="foto" style="background-image:url(${daten(f.foto)});background-position:${f.pos || '50% 50%'}"></div><div class="schatten"></div>
      <div class="t ${f.gross ? 'gross' : ''}"><div class="k">${f.kicker}</div><div class="g">${f.titel}</div><div class="x">${f.text}</div></div>
      ${f.geraet ? `<div class="${art}"><img src="${daten(f.geraet)}"></div>` : ''}<div class="nr">${i + 1} / ${K.folien.length}</div>`;
  }
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${CSS}</style>${html}`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(ziel, `${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 88 });
}
await browser.close();
console.log(`   posts/${NAME}/ ${K.folien.length} Folien`);
