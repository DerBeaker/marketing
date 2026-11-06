// Cinematic Reel (9:16, ca. 15 s) aus echtem Material: Demo-Schachtfotos mit langsamer Kamerafahrt,
// Farblook, Vignette und Filmkorn, danach die echte App im Handy und eine Endkarte. Ohne Musik
// (die kommt in Instagram dazu), mit stummer Tonspur, damit jede Plattform die Datei nimmt.
// Aufruf: node werkzeuge/make-reel.mjs [cinematic|export|werbung|aufmass]   → reels/reel-<name>.mp4 (+ reel-<name>-cover.jpg)
//   aufmass: „Aufmaß fällt beim Erfassen ab“ (ca. 15 s)
//   werbung: 60-s-Werbevideo über die ganze App (Problem → Ablauf → Funktionen → Pro → Endkarte)
//   cinematic: „Der erste Schacht“ (Foto → Kodierung → Zustandsklasse); export: „Ergebnis abgeben“ (XML + Fotos als ZIP, Pro)
//   mmse: Ankündigung „Aus Schachtblick wird MMSE Software“ (alle Apps, mit Sprecher)
//   abscheiderblick, abscheider3d, spuelblick: Produkt-Reels mit Sprecher (Screens aus material/screens/)
// Sprecher: Szenen mit `sprich` werden mit piper (Stimme Thorsten, frei) vertont; die Szene wird so lang wie der Satz.
//   PIPER_BIN (Standard: piper im PATH), PIPER_MODEL (Standard: .cache/piper/de_DE-thorsten-high.onnx).
//   Reels mit Sprecher bekommen einen leisen, selbst erzeugten Klangteppich statt Instagram-Musik.
// Braucht Playwright (global) und ffmpeg; die App muss nicht laufen.
import { createRequire } from 'node:module';
import { execSync, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, statSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { b64, marke, icon } from './werbung.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] }));

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = mkdtempSync(join(tmpdir(), 'sb-reel-'));
const NAME = process.argv[2] || 'cinematic';
const AB = process.argv.includes('--ab') ? Number(process.argv[process.argv.indexOf('--ab') + 1]) : 0;
const ziel = join(root, 'reels', `reel-${NAME}${AB ? `-ab${AB}` : ''}.mp4`);
const W = 1080, H = 1920, FPS = 30;
const ff = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: 'inherit' });

// ---- Themen je Marke: Hintergrundverlauf (hell → dunkel), Akzent, Schrift auf dem Knopf, Marke oben in der Endkarte
const svg64 = (p) => `data:image/svg+xml;base64,${readFileSync(p).toString('base64')}`;
const MMSE_ZEICHEN = svg64(join(root, 'material', 'marken', 'mmse-zeichen-weiss.svg'));
const mmseMarke = (titel = 'MMSE Software', unter = '') => `<div class="marke"><img src="${MMSE_ZEICHEN}" style="width:84px;height:84px">
  <div>${titel}${unter ? `<div style="font-size:.5em;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.85;margin-top:4px">${unter}</div>` : ''}</div></div>`;
const THEMEN = {
  schachtblick: { hg: ['#0d4fb8', '#06244f', '#020b1a'], akzent: '#ffd54a', knopf: '#0a3f9c', marke: () => marke },
  mmse: { hg: ['#24507f', '#152540', '#060b14'], akzent: '#f2b705', knopf: '#152540', marke: () => mmseMarke() },
  abscheiderblick: { hg: ['#1565d8', '#0b2f66', '#030d1d'], akzent: '#ffd54a', knopf: '#0b2f66', marke: () => mmseMarke('AbscheiderBlick', 'von MMSE Software') },
  abscheider3d: { hg: ['#14707a', '#0b3640', '#03121a'], akzent: '#f2b705', knopf: '#0b3640', marke: () => mmseMarke('Abscheider 3D', 'von MMSE Software') },
  spuelblick: { hg: ['#2c6040', '#14321f', '#050f09'], akzent: '#f39a3d', knopf: '#14321f', marke: () => mmseMarke('SpülBlick', 'von MMSE Software') },
};
let TH = THEMEN.schachtblick;
const hgVerlauf = (th = TH, y = 45) => `<div style="position:absolute;inset:0;background:radial-gradient(1100px 900px at 50% ${y}%,${th.hg[0]} 0%,${th.hg[1]} 58%,${th.hg[2]} 100%)"></div>`;

// ---- Grafiken (transparent) mit Playwright
const CSS = `*{box-sizing:border-box;margin:0} html,body{background:transparent} body{width:${W}px;height:${H}px;position:relative;overflow:hidden;
  font-family:'DejaVu Sans',system-ui,sans-serif;color:#fff}
  .t{position:absolute;left:90px;right:90px;text-shadow:0 4px 30px rgba(0,0,0,.65)}
  .klein{font-size:40px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--akzent)}
  .gross{font-size:104px;font-weight:800;line-height:1.02;margin-top:18px}
  .marke{display:flex;align-items:center;gap:16px;font-size:40px;font-weight:800}
  .logo{width:74px;height:74px;border-radius:20px;background:rgba(255,255,255,.18);display:grid;place-items:center}
  .handy{background:#0b1220;border-radius:70px;padding:18px;box-shadow:0 60px 140px rgba(0,0,0,.7),0 0 0 2px rgba(255,255,255,.08)}
  .handy img{display:block;width:100%;border-radius:54px}
  .tablet{background:#0b1220;border-radius:46px;padding:22px;box-shadow:0 60px 140px rgba(0,0,0,.7),0 0 0 2px rgba(255,255,255,.08)}
  .tablet img{display:block;width:100%;border-radius:26px}
  .knopf{display:inline-block;background:var(--akzent);color:var(--knopf);font-weight:800;border-radius:999px;padding:22px 44px;font-size:44px}`;
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: W, height: H } })).newPage();
async function png(name, inhalt, { hintergrund = false, th = TH } = {}) {
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${CSS} body{--akzent:${th.akzent};--knopf:${th.knopf}}</style>${inhalt}`);
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(tmp, name), omitBackground: !hintergrund });
  return join(tmp, name);
}
// Texte unten im Bild (oben bleibt frei für die Instagram-Leiste, unten Platz für die Bedienelemente)
const text = (klein, gross) => `<div style="position:absolute;left:0;right:0;bottom:0;height:1000px;background:linear-gradient(transparent,rgba(0,0,0,.6) 55%,rgba(0,0,0,.7))"></div><div class="t" style="bottom:470px"><div class="klein">${klein}</div><div class="gross">${gross}</div></div>`;
const oben = (klein, gross, zeile = '') => `<div class="t" style="top:250px"><div class="klein">${klein}</div>
  <div class="gross" style="font-size:84px">${gross}</div>${zeile ? `<div style="font-size:46px;font-weight:700;margin-top:22px">${zeile}</div>` : ''}</div>`;
const dunkel = hgVerlauf;
// Bildpfad: Name aus app/bilder oder Pfad relativ zum Repo (z. B. material/screens/…)
const bildPfad = (img) => (img.includes('/') ? join(root, img) : join(root, 'material', 'schachtblick', 'bilder', img));
const handyBild = (name, img, th = TH) => png(name, handy(img, th), { hintergrund: true, th });
// Handy-Szenen: dunkler Markenverlauf, Handy mit echtem Screenshot (doppelte Auflösung für die Kamerafahrt)
const handy = (img, th = TH) => `${hgVerlauf(th, 62)}
  <div class="handy" style="position:absolute;left:230px;width:620px;top:620px"><img src="${b64(bildPfad(img))}"></div>`;
// Querformat (Tablet/PC): Gerät leicht gedreht, damit es im Hochformat größer wirkt
const tabletBild = (name, img, th = TH, { breite = 1000, top = 700, drehen = 0 } = {}) => png(name, `${hgVerlauf(th, 58)}
  <div class="tablet" style="position:absolute;left:${(W - breite) / 2}px;width:${breite}px;top:${top}px;transform:rotate(${drehen}deg)"><img src="${b64(bildPfad(img))}"></div>`, { hintergrund: true, th });
const endkarte = (zeile, { th = TH, unter = 'kostenlos · ohne Installation · auch offline', knopf = 'Link in der Bio' } = {}) => png('ende.png', `${hgVerlauf(th)}
  <div style="position:absolute;left:0;right:0;top:640px;text-align:center">
    ${th.marke().replace('class="marke"', 'class="marke" style="justify-content:center;font-size:64px;text-align:left"').replace('width:74px;height:74px', 'width:110px;height:110px').replace('width:84px;height:84px', 'width:130px;height:130px')}
    <div style="font-size:52px;font-weight:800;margin-top:60px;line-height:1.25">${zeile}</div>
    ${unter ? `<div style="font-size:38px;margin-top:26px;opacity:.9">${unter}</div>` : ''}
    <div class="knopf" style="margin-top:70px">${knopf}</div></div>`, { hintergrund: true, th });

// Gerät über einem Einsatzclip (Szene mit clip + text: geraet(...)): Handy oder Tablet mit echtem Screen schwebt ins Bild,
// oben Überschrift; Schatten statt Markenhintergrund, damit der Clip sichtbar bleibt. img = Pfad relativ zum Repo oder absolut.
const bildDaten = (img) => { const pf = img.startsWith('/') ? img : bildPfad(img); const typ = pf.endsWith('.webp') ? 'webp' : pf.endsWith('.png') ? 'png' : 'jpeg';
  return `data:image/${typ};base64,${readFileSync(pf).toString('base64')}`; };
const geraet = (name, img, klein, gross, { art = 'tablet', breite, top, drehen = 0, th = TH } = {}) => {
  const b = breite || (art === 'handy' ? 640 : 960);
  const t = top || (art === 'handy' ? 640 : 820);
  return png(name, `<div style="position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.05) 32%,rgba(0,0,0,.05) 60%,rgba(0,0,0,.45))"></div>
  <div class="t" style="top:250px"><div class="klein">${klein}</div><div class="gross" style="font-size:96px">${gross}</div></div>
  <div class="${art}" style="position:absolute;left:${(W - b) / 2}px;width:${b}px;top:${t}px;transform:rotate(${drehen}deg)"><img src="${bildDaten(img)}"></div>`, { th });
};
const SB_START = '/home/user/spuelblick/app/start/bilder/'; // Screens der SpülBlick-Startseite (gelesenes spuelblick-Repo)
const sbBild = (n) => (existsSync(join(SB_START, n)) ? join(SB_START, n) : join(root, 'material', 'screens', n));

// Funktionskarte: dunkler Markenhintergrund, Icon im Akzent, Überschrift und Zeile (für Szenen ohne Foto)
const karte = (name, ic, klein, gross, zeile, th = TH) => png(name, `${hgVerlauf(th)}<div class="t" style="top:600px">
  <div style="color:${th.akzent}">${icon(ic, 200, 1.5)}</div>
  <div class="klein" style="margin-top:40px">${klein}</div>
  <div class="gross" style="font-size:92px">${gross}</div>
  ${zeile ? `<div style="font-size:46px;font-weight:700;margin-top:30px;line-height:1.3;opacity:.95">${zeile}</div>` : ''}</div>`, { hintergrund: true, th });
// Ein Reel = Szenen (Foto aus app/demo oder fertiges Bild) mit Dauer, Text darüber und Übergang zur nächsten
const REELS = {
  cinematic: async () => [
    { foto: 'schacht-4.jpg', dauer: 3.4, opt: { zoom: 0.0013 }, text: await png('t1.png', text('Montag, 5:40 Uhr', 'Der erste<br>Schacht.')), ueber: 'fadeblack' },
    { foto: 'schacht-1.jpg', dauer: 2.8, opt: { zoom: 0.0010, dreh: 'transpose=2', drift: -0.6 }, text: await png('t2.png', text('Vor Ort', 'Erst<br>schauen.')), ueber: 'smoothleft' },
    // schacht-2 als Nahaufnahme (näher dran, andere Richtung); schacht-3 hat ein verpixeltes Schild und bleibt draußen
    { foto: 'schacht-2.jpg', dauer: 2.8, opt: { zoom: 0.0016, z0: 1.45, dreh: 'transpose=2' }, text: await png('t3.png', text('Am Schacht', 'Dann<br>erfassen.')), ueber: 'fadeblack' },
    { bild: await handyBild('h1.png', 'app-foto.jpg'), dauer: 2.4, ueber: 'fade', textSzenen: 2,
      text: await png('t4.png', oben('Schachtblick', 'Foto. Kodierung.<br>Zustandsklasse.')) },
    { bild: await handyBild('h2.png', 'app-befunde.jpg'), dauer: 2.4, zoom: 0.0007, ueber: 'fadeblack' },
    { bild: await endkarte('Schachtinspektion<br>im Browser.'), dauer: 3.0, zoom: 0.0005 },
  ],
  aufmass: async () => [
    { foto: 'schacht-2.jpg', dauer: 3.4, opt: { zoom: 0.0013, z0: 1.3, dreh: 'transpose=2' }, text: await png('a1.png', text('16:30 Uhr', 'Und jetzt<br>noch das Aufmaß?')), ueber: 'fadeblack' },
    { foto: 'schacht-4.jpg', dauer: 3.0, opt: { zoom: 0.0011 }, text: await png('a2.png', text('Muss nicht sein', 'Das fällt beim<br>Erfassen ab.')), ueber: 'smoothleft' },
    { bild: await handyBild('ah1.png', 'app-aufbau.jpg'), dauer: 3.8, ueber: 'fadeblack',
      text: await png('a3.png', oben('Aufmaß', 'Nach Tiefen&shy;staffel', 'als PDF oder Excel')) },
    { bild: await karte('ak1.png', 'file', 'Dazu', 'PDF-Protokoll', 'mit Fotos und deinem Logo.<br>Kostenlos in der Basis.'), dauer: 3.4, zoom: 0.0006, ueber: 'fadeblack' },
    { bild: await endkarte('Schachtinspektion<br>im Browser.'), dauer: 3.5, zoom: 0.0005 },
  ],
  werbung: async () => [
    { foto: 'schacht-4.jpg', dauer: 4.2, opt: { zoom: 0.0010 }, text: await png('w1.png', text('Montag, 5:40 Uhr', 'Der erste<br>Schacht.')), ueber: 'fadeblack' },
    { foto: 'schacht-1.jpg', dauer: 4.0, opt: { zoom: 0.0009, dreh: 'transpose=2', drift: -0.5 }, text: await png('w2.png', text('Bisher', 'Klemmbrett.<br>Abtippen.<br>Nacharbeit.')), ueber: 'smoothleft' },
    { foto: 'schacht-2.jpg', dauer: 3.4, opt: { zoom: 0.0012, z0: 1.4, dreh: 'transpose=2' }, text: await png('w3.png', text('Ab jetzt', 'Das geht<br>einfacher.')), ueber: 'fadeblack' },
    { bild: await endkarte('Schachtinspektion<br>im Browser.'), dauer: 3.6, zoom: 0.0005, ueber: 'fade' },
    { bild: await handyBild('wh1.png', 'app-foto.jpg'), dauer: 4.6, ueber: 'smoothleft',
      text: await png('w5.png', oben('Schritt 1', 'Foto von oben', 'Uhr anlegen, Anschlüsse antippen')) },
    { bild: await handyBild('wh2.png', 'app-befunde.jpg'), dauer: 4.6, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('w6.png', oben('Schritt 2', 'Schäden kodieren', 'DIN EN 13508-2, mit Plausibilitätsprüfung')) },
    { bild: await handyBild('wh3.png', 'app-befunde.jpg'), dauer: 4.0, zoom: 0.0016, ueber: 'smoothleft',
      text: await png('w7.png', oben('Schritt 3', 'Zustandsklasse', 'nach BFR Abwasser, direkt am Schacht')) },
    { bild: await handyBild('wh4.png', 'app-aufbau.jpg'), dauer: 4.6, ueber: 'fadeblack',
      text: await png('w8.png', oben('Schritt 4', 'Aufbau und Maße', '3D-Modell, Maße per Bluetooth-Laser')) },
    { bild: await karte('k1.png', 'file', 'Fertig', 'PDF-Protokoll<br>und Aufmaß', 'mit Fotos und deinem Logo,<br>Aufmaß als PDF oder Excel'), dauer: 4.0, zoom: 0.0006, ueber: 'fade' },
    { bild: await karte('k2.png', 'layers', 'Import', 'Aus dem<br>Kanalkataster', 'ISYBAU-XML 2006–2024<br>und DWA-M 150'), dauer: 4.0, zoom: 0.0006, ueber: 'fade' },
    { bild: await karte('k3.png', 'cloud', 'Offline', 'Keller, Feldweg,<br>Funkloch.', 'Die Erfassung läuft trotzdem.'), dauer: 3.6, zoom: 0.0006, ueber: 'fade' },
    { bild: await karte('k4.png', 'lock', 'Basis', 'Deine Daten<br>bleiben bei dir.', 'Kein Konto, kein Upload,<br>keine Cookies.'), dauer: 4.0, zoom: 0.0006, ueber: 'fadeblack' },
    { bild: await handyBild('wh5.png', 'app-ki.jpg'), dauer: 4.6, ueber: 'fadeblack',
      text: await png('w13.png', oben('Nur in Schachtblick Pro', 'KI-Vorschläge', 'Die Fachkraft prüft und entscheidet.')) },
    { bild: await karte('k5.png', 'user', 'Schachtblick Pro', 'Fürs Team', 'XML-Export, Abgleich zwischen<br>Geräten, Server in Deutschland'), dauer: 4.0, zoom: 0.0006, ueber: 'fadeblack' },
    { foto: 'schacht-4.jpg', dauer: 3.8, opt: { zoom: 0.0011, dreh: 'transpose=2', z0: 1.2 }, text: await png('w15.png', text('Basis', 'Kostenlos.<br>Ohne Installation.')), ueber: 'fadeblack' },
    { bild: await endkarte('Jetzt im Browser<br>ausprobieren.'), dauer: 6.5, zoom: 0.0004 },
  ],
  export: async () => [
    { foto: 'schacht-4.jpg', dauer: 3.0, opt: { zoom: 0.0012, dreh: 'transpose=2' }, text: await png('t1.png', text('Vor Ort', 'Schacht<br>erfasst.')), ueber: 'fadeblack' },
    { foto: 'schacht-1.jpg', dauer: 2.8, opt: { zoom: 0.0011, z0: 1.3 }, text: await png('t2.png', text('Und jetzt', '<span style="font-size:94px">zum<br>Auftraggeber.</span>')), ueber: 'smoothleft' },
    { bild: await handyBild('h1.png', 'app-befunde.jpg'), dauer: 3.4, ueber: 'fadeblack',
      text: await png('t3.png', oben('Export', 'ISYBAU-XML<br>oder DWA-M 150', 'mit Fotos als ZIP')) },
    { bild: await png('pro.png', `${dunkel()}<div class="t" style="top:720px;text-align:center"><div class="klein">Schachtblick Pro</div>
      <div class="gross" style="font-size:88px">Export ist<br>Teil von Pro.</div>
      <div style="font-size:42px;margin-top:40px;opacity:.92;line-height:1.35">Erfassung, Zustandsklasse<br>und PDF-Protokoll: kostenlos.</div></div>`, { hintergrund: true }), dauer: 3.0, zoom: 0.0006, ueber: 'fadeblack' },
    { bild: await endkarte('Schachtinspektion<br>im Browser.'), dauer: 3.0, zoom: 0.0005 },
  ],
  // ---- MMSE-Konto: Szenen mit `sprich` werden vertont (MMSE, 3D und Isybau so schreiben, wie sie gesprochen werden)
  mmse: async () => { TH = THEMEN.mmse; const T = THEMEN; return [
    { foto: 'schacht-4.jpg', dauer: 3.4, opt: { zoom: 0.0011 }, text: await png('m1.png', text('Neu hier', 'Ein Account.<br>Mehrere Apps.')), ueber: 'fadeblack',
      sprich: 'Aus Schachtblick wird M M S E Software. Ein Account für mehrere Apps rund ums Abwasser.' },
    { bild: await handyBild('m2.png', 'app-befunde.jpg', T.schachtblick), dauer: 3, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('m2t.png', oben('Schachtblick', 'Schacht&shy;inspektion', 'nach ISYBAU, direkt am Schacht'), { th: T.schachtblick }),
      sprich: 'Schachtblick. Schachtinspektion nach Isybau, direkt am Schacht.' },
    { bild: await handyBild('m3.png', 'material/screens/abscheiderblick-ergebnis.jpg', T.abscheiderblick), dauer: 3, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('m3t.png', oben('AbscheiderBlick', 'General&shy;inspektion', 'von Abscheideranlagen'), { th: T.abscheiderblick }),
      sprich: 'Abscheiderblick. Generalinspektion von Abscheideranlagen, mit Bemessung, Mängelbewertung und Prüfbericht.' },
    { bild: await tabletBild('m4.png', 'material/screens/abscheider3d-modell.jpg', T.abscheider3d, { breite: 940, top: 760 }), dauer: 3, zoom: 0.0007, ueber: 'smoothleft',
      text: await png('m4t.png', oben('Abscheider 3D', 'Bemaßtes<br>3D-Modell', 'Bauwerksaufnahme und Dichtheitsprüfung'), { th: T.abscheider3d }),
      sprich: 'Abscheider 3 D. Bauwerksaufnahme mit bemaßtem 3 D Modell und Dichtheitsprüfung.' },
    { bild: await tabletBild('m5.png', 'material/screens/spuelblick-karte.jpg', T.spuelblick, { breite: 1000, top: 860 }), dauer: 3, zoom: 0.0007, ueber: 'fadeblack',
      text: await png('m5t.png', oben('Neu: SpülBlick', 'Kanal&shy;reinigung', 'dokumentieren, auch im Funkloch'), { th: T.spuelblick }),
      sprich: 'Und neu: Spülblick. Kanalreinigung dokumentieren, auch im Funkloch.' },
    { bild: await endkarte('Software für die<br>Abwassertechnik.', { unter: 'läuft im Browser · auch offline' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Alle Apps laufen im Browser. Link in der Bio.' },
  ]; },
  abscheiderblick: async () => { TH = THEMEN.abscheiderblick; return [
    { bild: await karte('ab1.png', 'clock', 'Alle fünf Jahre', 'General&shy;inspektion.', 'Abscheideranlagen nach<br>DIN 4040-100 und DIN 1999-100'), dauer: 3, zoom: 0.0007, ueber: 'fadeblack',
      sprich: 'Alle fünf Jahre steht die Generalinspektion an. Abscheiderblick begleitet dich durch die Prüfung.' },
    { bild: await handyBild('ab2.png', 'material/screens/abscheiderblick-bemessung.jpg'), dauer: 3, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('ab2t.png', oben('Bemessung', 'Mit Rechenweg.', 'Nenngröße und Schlammfang')),
      sprich: 'Die Bemessung rechnet die App mit nachvollziehbarem Rechenweg.' },
    { bild: await handyBild('ab3.png', 'material/screens/abscheiderblick-ergebnis.jpg'), dauer: 3, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('ab3t.png', oben('Mängel', 'Nach BFR-Muster<br>bewertet.', 'mit Frist für die Nachprüfung')),
      sprich: 'Mängel bewertest du nach dem BFR-Muster, mit Frist für die Nachprüfung.' },
    { bild: await handyBild('ab4.png', 'material/screens/abscheiderblick-pruefung.jpg'), dauer: 3, zoom: 0.0006, ueber: 'fadeblack',
      text: await png('ab4t.png', oben('Abschluss', 'PDF-Prüfbericht.', 'mit Fotos und Nachweisen')),
      sprich: 'Am Ende steht der Prüfbericht als PDF, mit Fotos und Nachweisen.' },
    { bild: await endkarte('Generalinspektion<br>im Browser.', { unter: 'kostenlos für Einzelanwender · Teams im Abo' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Für Einzelanwender kostenlos. Link in der Bio.' },
  ]; },
  abscheider3d: async () => { TH = THEMEN.abscheider3d; return [
    { bild: await tabletBild('a1.png', 'material/screens/abscheider3d-modell.jpg', TH, { breite: 980, top: 760 }), dauer: 3, zoom: 0.0009, ueber: 'smoothleft',
      text: await png('a1t.png', oben('Abscheider 3D', 'Vom Aufmaß<br>zum 3D-Modell.')),
      sprich: 'Abscheider 3 D macht aus deinem Aufmaß ein bemaßtes 3 D Modell.' },
    { bild: await tabletBild('a2.png', 'material/screens/abscheider3d-schnitt.jpg', TH, { breite: 1000, top: 820 }), dauer: 3, zoom: 0.0008, ueber: 'smoothleft',
      text: await png('a2t.png', oben('Längsschnitt', 'Alles bemaßt.', 'als Zeichnung, aus deinen Maßen')),
      sprich: 'Längsschnitt und Draufsicht entstehen gleich mit. Alles bemaßt.' },
    { bild: await tabletBild('a3.png', 'material/screens/abscheider3d-draufsicht.jpg', TH, { breite: 1000, top: 780 }), dauer: 3, zoom: 0.0008, ueber: 'smoothleft',
      text: await png('a3t.png', oben('Draufsicht', 'Zulauf, Ablauf,<br>Einstieg.', 'Leichtflüssigkeits- und Fettabscheider')),
      sprich: 'Für Leichtflüssigkeits und Fettabscheider.' },
    { bild: await tabletBild('a3b.png', 'material/screens/abscheider3d-dichtheit.jpg', TH, { breite: 500, top: 610 }), dauer: 3, zoom: 0.0007, ueber: 'fadeblack',
      text: await png('a3bt.png', oben('Dichtheitsprüfung', 'Nach Anhang A.', 'DIN 1999-100 / DIN 4040-100')),
      sprich: 'Die Dichtheitsprüfung nach Anhang A ist gleich mit dabei.' },
    { bild: await karte('a4.png', 'file', 'Fertig', 'PDF-Bericht.', 'Deine Daten bleiben<br>auf deinem Gerät.'), dauer: 3, zoom: 0.0006, ueber: 'fadeblack',
      sprich: 'Am Ende ein PDF Bericht. Deine Daten bleiben auf deinem Gerät.' },
    { bild: await endkarte('Kostenlos.<br>Ohne Anmeldung.', { unter: 'im Browser · auch offline' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Kostenlos und ohne Anmeldung. Link in der Bio.' },
  ]; },
  // SpülBlick (seit 04.11.2026 online): 14 Tage kostenlos testen; auf Instagram keine Preise, kein „Praktiker“ (Manuel 05.11.2026)
  spuelblick: async () => { TH = THEMEN.spuelblick; return [
    { bild: await tabletBild('sp1.png', 'material/screens/spuelblick-karte.jpg', TH, { breite: 1040, top: 900 }), dauer: 3, zoom: 0.0008, ueber: 'smoothleft',
      text: await png('sp1t.png', oben('Neu von MMSE', 'SpülBlick.', 'Kanalreinigung dokumentieren')),
      sprich: 'Neu von uns: Spülblick. Die App für die Kanalreinigung.' },
    { bild: await tabletBild('sp2.png', 'material/screens/spuelblick-liste.jpg', TH, { breite: 1040, top: 900 }), dauer: 3, zoom: 0.0007, ueber: 'smoothleft',
      text: await png('sp2t.png', oben('Offline', 'Funkloch?', 'Karte und Haltungen sind trotzdem da.')),
      sprich: 'Karte und Haltungen funktionieren auch im Funkloch.' },
    { bild: await tabletBild('sp3.png', 'material/screens/spuelblick-erfassen.jpg', TH, { breite: 1040, top: 900 }), dauer: 3, zoom: 0.0007, ueber: 'fadeblack',
      text: await png('sp3t.png', oben('Am Fahrzeug', 'Schritt für Schritt.', 'Verschmutzung, Reinigung, Fotos')),
      sprich: 'Schritt für Schritt erfassen: Verschmutzung, Reinigung, Fotos.' },
    { bild: await endkarte('14 Tage<br>kostenlos testen.', { unter: 'ohne Zahlungsdaten · spülblick.mmse-software.com', knopf: 'Link in der Bio' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Vierzehn Tage kostenlos testen, ohne Zahlungsdaten. Link in der Bio.' },
  ]; },
  // „Der erste Schacht“ mit Sprecher (bestes Reel bisher, jetzt vertont)
  schachtblick: async () => { TH = THEMEN.schachtblick; return [
    { foto: 'schacht-4.jpg', dauer: 3.2, opt: { zoom: 0.0013 }, text: await png('sb1.png', text('Montag, 5:40 Uhr', 'Der erste<br>Schacht.')), ueber: 'fadeblack',
      sprich: 'Montag, fünf Uhr vierzig. Der erste Schacht.' },
    { foto: 'schacht-1.jpg', dauer: 3, opt: { zoom: 0.0010, dreh: 'transpose=2', drift: -0.6 }, text: await png('sb2.png', text('Vor Ort', 'Foto<br>von oben.')), ueber: 'smoothleft',
      sprich: 'Ein Foto von oben. Die Anschlüsse tippst du direkt im Bild an.' },
    { bild: await handyBild('sb3.png', 'app-befunde.jpg'), dauer: 3, ueber: 'smoothleft',
      text: await png('sb3t.png', oben('Kodierung', 'Schäden<br>kodieren.', 'nach DIN EN 13508-2')),
      sprich: 'Schäden kodierst du nach Katalog, mit Plausibilitätsprüfung.' },
    { bild: await handyBild('sb4.png', 'app-befunde.jpg'), dauer: 3, zoom: 0.0016, ueber: 'fadeblack',
      text: await png('sb4t.png', oben('Bewertung', 'Zustandsklasse.', 'nach BFR Abwasser, direkt am Schacht')),
      sprich: 'Die Zustandsklasse siehst du direkt am Schacht.' },
    { bild: await karte('sb5.png', 'file', 'Fertig', 'PDF-Protokoll.', 'mit Fotos und deinem Logo.<br>Kostenlos in der Basis.'), dauer: 3, zoom: 0.0006, ueber: 'fadeblack',
      sprich: 'Dazu das Protokoll als PDF, mit Fotos und deinem Logo.' },
    { bild: await endkarte('Schachtinspektion<br>im Browser.'), dauer: 3.5, zoom: 0.0004,
      sprich: 'Schachtblick. Kostenlos im Browser. Link in der Bio.' },
  ]; },
  // AbscheiderBlick mit echten Fotos (CC0, siehe material/fotos/LIZENZEN.md) und Sprecher
  abscheiderfoto: async () => { TH = THEMEN.abscheiderblick; return [
    { foto: 'material/fotos/tankstelle-zapfpistolen.jpg', dauer: 3, opt: { quer: 0.5, zoom: 0.0012, z0: 1.05 }, text: await png('af1.png', text('Tankstelle', 'Hier sitzt einer<br>im Boden.')), ueber: 'fadeblack',
      sprich: 'Unter jeder Tankstelle sitzt ein Abscheider.' },
    { foto: 'material/fotos/grosskueche-koch.jpg', dauer: 3, opt: { quer: 0.42, zoom: 0.0010, z0: 1.05, drift: 0.4 }, text: await png('af2.png', text('Großküche', 'Und hier ein<br>Fettabscheider.')), ueber: 'smoothleft',
      sprich: 'Und unter jeder Großküche ein Fettabscheider.' },
    { bild: await karte('af3.png', 'clock', 'Alle fünf Jahre', 'General&shy;inspektion.', 'Abscheideranlagen nach<br>DIN 4040-100 und DIN 1999-100'), dauer: 3, zoom: 0.0007, ueber: 'fadeblack',
      sprich: 'Alle fünf Jahre ist die Generalinspektion fällig. Abscheiderblick macht sie einfacher.' },
    { bild: await handyBild('af4.png', 'material/screens/abscheiderblick-bemessung.jpg'), dauer: 3, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('af4t.png', oben('Bemessung', 'Mit Rechenweg.', 'Nenngröße und Schlammfang')),
      sprich: 'Die Bemessung rechnet die App mit nachvollziehbarem Rechenweg.' },
    { bild: await handyBild('af5.png', 'material/screens/abscheiderblick-ergebnis.jpg'), dauer: 3, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('af5t.png', oben('Mängel', 'Nach BFR-Muster<br>bewertet.', 'mit Frist für die Nachprüfung')),
      sprich: 'Mängel bewertest du nach dem BFR-Muster, mit Frist für die Nachprüfung.' },
    { bild: await handyBild('af6.png', 'material/screens/abscheiderblick-pruefung.jpg'), dauer: 3, zoom: 0.0006, ueber: 'fadeblack',
      text: await png('af6t.png', oben('Abschluss', 'PDF-Prüfbericht.', 'mit Fotos und Nachweisen')),
      sprich: 'Am Ende der Prüfbericht als PDF, mit Fotos und Nachweisen.' },
    { bild: await endkarte('Generalinspektion<br>im Browser.', { unter: 'kostenlos für Einzelanwender · Teams im Abo' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Für Einzelanwender kostenlos. Link in der Bio.' },
  ]; },
  // AbscheiderBlick mit echten Videoclips (Pixabay, IDs in material/fotos/LIZENZEN.md) und Sprecher
  abscheiderclip: async () => { TH = THEMEN.abscheiderblick; return [
    { clip: 159708, dauer: 3, opt: { quer: 0.62, zoom: 0.0005 }, text: await png('ac1.png', text('Tankstelle, 22 Uhr', 'Was hier abläuft …')), ueber: 'fadeblack',
      sprich: 'Was an der Tankstelle abläuft, landet im Abscheider.' },
    { clip: 72025, dauer: 3, opt: { start: 2, quer: 0.5, zoom: 0.0006 }, text: await png('ac2.png', text('Großküche', 'Und das Fett?')), ueber: 'smoothleft',
      sprich: 'In der Großküche ist es das Fett.' },
    { clip: 348897, dauer: 3, opt: { start: 3, quer: 0.72, zoom: 0.0004 }, text: await png('ac3.png', text('Alle fünf Jahre', 'General&shy;inspektion.')), ueber: 'fadeblack',
      sprich: 'Alle fünf Jahre muss die Anlage zur Generalinspektion.' },
    { bild: await handyBild('ac4.png', 'material/screens/abscheiderblick-bemessung.jpg'), dauer: 3, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('ac4t.png', oben('AbscheiderBlick', 'Bemessung<br>mit Rechenweg.', 'Nenngröße und Schlammfang')),
      sprich: 'Abscheiderblick rechnet die Bemessung mit nachvollziehbarem Rechenweg.' },
    { bild: await handyBild('ac5.png', 'material/screens/abscheiderblick-ergebnis.jpg'), dauer: 3, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('ac5t.png', oben('Mängel', 'Nach BFR-Muster<br>bewertet.', 'mit Frist für die Nachprüfung')),
      sprich: 'Mängel bewertest du nach dem BFR-Muster, mit Frist für die Nachprüfung.' },
    { bild: await handyBild('ac6.png', 'material/screens/abscheiderblick-pruefung.jpg'), dauer: 3, zoom: 0.0006, ueber: 'fadeblack',
      text: await png('ac6t.png', oben('Abschluss', 'PDF-Prüfbericht.', 'mit Fotos und Nachweisen')),
      sprich: 'Am Ende steht der Prüfbericht als PDF.' },
    { bild: await endkarte('Generalinspektion<br>im Browser.', { unter: 'kostenlos für Einzelanwender · Teams im Abo' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Für Einzelanwender kostenlos. Link in der Bio.' },
  ]; },
  // Schachtblick mit echten Videoclips (Pixabay) + echtem Schachtfoto und Sprecher
  schachtblickclip: async () => { TH = THEMEN.schachtblick; return [
    { clip: 209759, dauer: 3, opt: { start: 1, quer: 0.5, zoom: 0.0006 }, text: await png('sc1.png', text('Montag, 5:40 Uhr', 'Regen.<br>Erster Schacht.')), ueber: 'fadeblack',
      sprich: 'Montag, fünf Uhr vierzig. Regen. Der erste Schacht.' },
    { clip: 9059, dauer: 3, opt: { start: 1, quer: 0.55, zoom: 0.0008 }, text: await png('sc2.png', text('Kanalnetz', 'Hier läuft<br>alles zusammen.')), ueber: 'smoothleft',
      sprich: 'Unter der Straße läuft alles zusammen.' },
    { clip: 348898, dauer: 3, opt: { start: 4, quer: 0.4, zoom: 0.0004 }, text: await png('sc3.png', text('Vor Ort', 'Ohne<br>Klemmbrett.')), ueber: 'fadeblack',
      sprich: 'Du dokumentierst direkt am Schacht. Ohne Klemmbrett.' },
    { foto: 'schacht-4.jpg', dauer: 3, opt: { zoom: 0.0012 }, text: await png('sc4.png', text('Foto von oben', 'Anschlüsse<br>antippen.')), ueber: 'smoothleft',
      sprich: 'Ein Foto von oben, die Anschlüsse tippst du im Bild an.' },
    { bild: await handyBild('sc5.png', 'app-befunde.jpg'), dauer: 3, ueber: 'smoothleft',
      text: await png('sc5t.png', oben('Kodierung', 'Schäden<br>kodieren.', 'nach DIN EN 13508-2')),
      sprich: 'Schäden kodierst du nach Katalog, mit Plausibilitätsprüfung.' },
    { bild: await handyBild('sc6.png', 'app-befunde.jpg'), dauer: 3, zoom: 0.0016, ueber: 'fadeblack',
      text: await png('sc6t.png', oben('Bewertung', 'Zustandsklasse.', 'nach BFR Abwasser, direkt am Schacht')),
      sprich: 'Die Zustandsklasse siehst du sofort.' },
    { bild: await endkarte('Schachtinspektion<br>im Browser.'), dauer: 3.5, zoom: 0.0004,
      sprich: 'Schachtblick. Kostenlos im Browser. Link in der Bio.' },
  ]; },
  // AbscheiderBlick Teil 2: Großküche, Mängel mit Frist, Nachweise, Erinnerung (echte Clips, Pixabay)
  abscheiderblick2: async () => { TH = THEMEN.abscheiderblick; return [
    { clip: 267, dauer: 3, opt: { start: 2, quer: 0.5, zoom: 0.0006 }, text: await png('b1.png', text('Großküche', 'Dampf, Fett,<br>Spülwasser.')), ueber: 'fadeblack',
      sprich: 'In der Großküche landen Fett und Spülwasser im Abscheider.' },
    { clip: 5629, dauer: 3, opt: { start: 2, quer: 0.35, zoom: 0.0006 }, text: await png('b2.png', text('Damit er funktioniert', 'Regelmäßig<br>prüfen.')), ueber: 'smoothleft',
      sprich: 'Damit er funktioniert, wird er regelmäßig geprüft.' },
    { clip: 318785, dauer: 3, opt: { quer: 0.5, zoom: 0.0008 }, text: await png('b3.png', text('Nach der Prüfung', 'Mängel<br>mit Frist.')), ueber: 'fadeblack',
      sprich: 'Findest du Mängel, setzt Abscheiderblick die Frist für die Nachprüfung.' },
    { bild: await handyBild('b4.png', 'material/screens/abscheiderblick-ergebnis.jpg'), dauer: 3, zoom: 0.0006, ueber: 'smoothleft',
      text: await png('b4t.png', oben('Mängel', 'Fristen<br>im Blick.', 'geringfügig · erheblich · gefährlich')),
      sprich: 'Geringfügig, erheblich oder gefährlich, nach dem BFR-Muster.' },
    { bild: await handyBild('b5.png', 'material/screens/abscheiderblick-pruefung.jpg'), dauer: 3, zoom: 0.0006, ueber: 'fadeblack',
      text: await png('b5t.png', oben('Fotos und Nachweise', 'Alles im<br>Prüfbericht.', 'als PDF')),
      sprich: 'Fotos und Nachweise landen direkt im Prüfbericht.' },
    { bild: await karte('b6.png', 'clock', 'In fünf Jahren', 'Erinnerung<br>inklusive.', 'Die nächste Generalinspektion<br>rechnet die App aus.'), dauer: 3, zoom: 0.0006, ueber: 'fadeblack',
      sprich: 'Und die App erinnert an die nächste Prüfung in fünf Jahren.' },
    { bild: await endkarte('Generalinspektion<br>im Browser.', { unter: 'kostenlos für Einzelanwender · Teams im Abo' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Für Einzelanwender kostenlos. Link in der Bio.' },
  ]; },
  // Abscheider 3D mit echten Clips (Baugrube, Bauplan, Arbeiter) und Ausschnitten der App
  abscheider3dclip: async () => { TH = THEMEN.abscheider3d; return [
    { clip: 52888, dauer: 3, opt: { start: 2, quer: 0.6, zoom: 0.0006 }, text: await png('d1.png', text('Neubau', 'Erst die<br>Baugrube.')), ueber: 'fadeblack',
      sprich: 'Erst die Baugrube, dann der Abscheider.' },
    { clip: 42701, dauer: 3, opt: { start: 3, quer: 0.55, zoom: 0.0006 }, text: await png('d2.png', text('Bauwerksaufnahme', 'Jedes Maß<br>zählt.')), ueber: 'smoothleft',
      sprich: 'Für die Bauwerksaufnahme zählt jedes Maß.' },
    { clip: 85350, dauer: 3, opt: { start: 1, quer: 0.55, zoom: 0.0005 }, text: await png('d3.png', text('Vor Ort', 'Messen und<br>eintragen.')), ueber: 'fadeblack',
      sprich: 'Abscheider 3 D macht daraus ein bemaßtes 3 D Modell.' },
    { bild: await tabletBild('d4.png', 'material/screens/abscheider3d-modell.jpg', TH, { breite: 980, top: 760 }), dauer: 3, zoom: 0.0009, ueber: 'smoothleft',
      text: await png('d4t.png', oben('Abscheider 3D', 'Bemaßtes<br>3D-Modell.')),
      sprich: 'Für Leichtflüssigkeits und Fettabscheider.' },
    { bild: await tabletBild('d5.png', 'material/screens/abscheider3d-schnitt.jpg', TH, { breite: 1000, top: 820 }), dauer: 3, zoom: 0.0008, ueber: 'smoothleft',
      text: await png('d5t.png', oben('Längsschnitt', 'Alles bemaßt.', 'Schnitt und Draufsicht gleich mit')),
      sprich: 'Längsschnitt und Draufsicht entstehen gleich mit.' },
    { bild: await tabletBild('d6.png', 'material/screens/abscheider3d-dichtheit.jpg', TH, { breite: 500, top: 610 }), dauer: 3, zoom: 0.0007, ueber: 'fadeblack',
      text: await png('d6t.png', oben('Dichtheitsprüfung', 'Nach Anhang A.', 'DIN 1999-100 / DIN 4040-100')),
      sprich: 'Die Dichtheitsprüfung nach Anhang A ist dabei.' },
    { bild: await endkarte('Kostenlos.<br>Ohne Anmeldung.', { unter: 'im Browser · auch offline' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Kostenlos und ohne Anmeldung. Link in der Bio.' },
  ]; },
  // SpülBlick im Einsatz (05.11.2026, Manuel: ohne Sprecher, Musik über Metricool, Lust machen; keine Preise, kein Praktiker):
  // echtes UMTEC-Material aus Manuels Drive (material/umtec/, nicht im Repo; UMTEC-Logos, Schriftzüge und Kennzeichen verpixeln
  // bzw. Szenen mit großem Logo weglassen), darüber Handy/Tablet mit echten SpülBlick-Screens
  spuelblickumtec: async () => { TH = THEMEN.spuelblick; const U = 'material/umtec/'; return [
    { clip: U + 'VID-20241026-WA0000.mp4', dauer: 2.4, opt: { start: 14.4, zoom: 0.0007, verpixeln: [[0.36, 0.41, 0.44, 0.11]] }, text: await png('e1.png', text('6:00 Uhr', 'Ab zur<br>Baustelle.')), ueber: 'smoothleft' },
    { clip: U + 'VID-20250410-WA0005.mp4', dauer: 2.4, opt: { start: 0.4, zoom: 0.0009 }, text: await png('e2.png', text('Schacht auf', 'Wasser<br>marsch.')), ueber: 'smoothleft' },
    { clip: U + 'VID-20240725-WA0002.mp4', dauer: 2.4, opt: { start: 46, zoom: 0.0009 }, text: await png('e3.png', text('Hochdruck', 'Haltung<br>frei.')), ueber: 'smoothleft' },
    { clip: U + 'VID-20250401-WA0022.mp4', dauer: 3.2, opt: { start: 30, zoom: 0.0005, dunkel: 0.05, weich: 2 }, text: await geraet('e4.png', sbBild('liste-960.webp'), 'SpülBlick', 'Haltung<br>antippen.', { art: 'handy', breite: 600, top: 760, drehen: -3 }), ueber: 'smoothleft' },
    { clip: U + 'VID-20250331-WA0028.mp4', dauer: 3.2, opt: { start: 5, zoom: 0.0005, dunkel: 0.05, weich: 2 }, text: await geraet('e5.png', sbBild('grad-960.webp'), 'Mit Handschuhen', 'Erfassen.<br>Fertig.', { art: 'handy', breite: 680, top: 780, drehen: 2 }), ueber: 'smoothleft' },
    { clip: U + 'VID-20250219-WA0008.mp4', dauer: 2.4, opt: { start: 1, zoom: 0.0009 }, text: await png('e6.png', text('Kein Netz?', 'Egal.')), ueber: 'fadeblack' },
    { clip: U + 'VID-20241204-WA0002.mp4', dauer: 3.2, opt: { start: 1, zoom: 0.0005, weich: 1.5, verpixeln: [[0.52, 0.42, 0.42, 0.28]] }, text: await geraet('e7.png', sbBild('bericht-960.webp'), 'Feierabend', 'Bericht ist<br>schon fertig.', { art: 'tablet', breite: 960, top: 900 }), ueber: 'fadeblack' },
    { bild: await endkarte('Schluss mit<br>Zetteln abtippen.', { unter: '14 Tage kostenlos testen', knopf: 'Link in der Bio' }), dauer: 3.2, zoom: 0.0005 },
  ]; },
  spuelblickumtec2: async () => { TH = THEMEN.spuelblick; const U = 'material/umtec/'; return [
    { clip: U + 'VID-20241212-WA0012.mp4', dauer: 2.4, opt: { start: 6, zoom: 0.0007, verpixeln: [[0.57, 0.425, 0.18, 0.07], [0.38, 0.42, 0.20, 0.06], [0.12, 0.40, 0.24, 0.05]] }, text: await png('f1.png', text('Montag, 7 Uhr', 'Absicherung<br>steht.')), ueber: 'smoothleft' },
    { clip: U + 'VID-20250219-WA0009.mp4', dauer: 2.4, opt: { start: 4, zoom: 0.0009 }, text: await png('f2.png', text('Düse rein', 'Los geht’s.')), ueber: 'smoothleft' },
    { clip: U + 'VID-20250410-WA0020.mp4', dauer: 3.2, opt: { start: 10, zoom: 0.0005, dunkel: 0.06, weich: 2 }, text: await geraet('f3.png', 'material/screens/spuelblick-karte.jpg', 'Offline-Karte', 'Jede Haltung.<br>Auch im Funkloch.', { art: 'tablet', breite: 980, top: 860, drehen: -2 }), ueber: 'smoothleft' },
    { clip: U + 'VID-20250410-WA0024.mp4', dauer: 3.2, opt: { start: 20, zoom: 0.0005, dunkel: 0.06, weich: 2, verpixeln: [[0, 0.88, 0.6, 0.12]] }, text: await geraet('f4.png', 'material/screens/spuelblick-Fertig.jpg', 'Fotos rein', 'Speichern.<br>Nächste.', { art: 'tablet', breite: 980, top: 860, drehen: 2 }), ueber: 'smoothleft' },
    { clip: U + '20240906_152846.mp4', dauer: 2.4, opt: { start: 1, zoom: 0.0008 }, text: await png('f5.png', text('Kein Zettel.', 'Kein WhatsApp-<br>Chaos.')), ueber: 'fadeblack' },
    { clip: U + 'VID-20240725-WA0001.mp4', dauer: 3.2, opt: { start: 32, zoom: 0.0005, weich: 2 }, text: await geraet('f6.png', sbBild('bericht-960.webp'), 'Im Büro', 'Protokoll, Fotos,<br>Excel. Sofort.', { art: 'tablet', breite: 960, top: 900 }), ueber: 'fadeblack' },
    { bild: await endkarte('Deine Kolonne.<br>Dein Bericht.', { unter: '14 Tage kostenlos testen', knopf: 'Link in der Bio' }), dauer: 3.2, zoom: 0.0005 },
  ]; },
  // ---- Echtes UMTEC-Material für alle Apps (05.11.2026): ohne Sprecher, Musik über Metricool, keine Preise.
  // Fotos vorbereitet in material/umtec/_reel/ (gedreht, Tankstellenmarke und Kennzeichen verpixelt), Clips aus material/umtec/.
  schachtblickumtec: async () => { TH = THEMEN.schachtblick; const U = 'material/umtec/'; return [
    { clip: U + 'VID-20241031-WA0005.mp4', dauer: 2.4, opt: { start: 1, zoom: 0.0009 }, text: await png('s1.png', text('Montag, 7 Uhr', 'Schacht<br>auf.')), ueber: 'smoothleft' },
    { clip: U + 'VID-20250320-WA0000.mp4', dauer: 2.4, opt: { start: 30, zoom: 0.0009 }, text: await png('s2.png', text('Erst schauen', 'Dann<br>kodieren.')), ueber: 'smoothleft' },
    { clip: U + 'VID-20241007-WA0005.mp4', dauer: 3.2, opt: { start: 2, zoom: 0.0005, dunkel: 0.05, weich: 2 }, text: await geraet('s3.png', 'app-foto.jpg', 'Foto von oben', 'Anschlüsse<br>antippen.', { art: 'handy', breite: 520, top: 640, drehen: -2 }), ueber: 'smoothleft' },
    { clip: U + 'VID-20250227-WA0002.mp4', dauer: 3.2, opt: { start: 0.4, zoom: 0.0005, dunkel: 0.05, weich: 2 }, text: await geraet('s4.png', 'app-befunde.jpg', 'Schäden kodieren', 'Klasse<br>sofort.', { art: 'handy', breite: 520, top: 640, drehen: 2 }), ueber: 'smoothleft' },
    { clip: U + 'VID-20250331-WA0023.mp4', dauer: 3.2, opt: { start: 0.5, zoom: 0.0005, dunkel: 0.05, weich: 2 }, text: await geraet('s5.png', 'app-aufbau.jpg', 'Aufbau', 'Als 3D-<br>Modell.', { art: 'handy', breite: 520, top: 640, drehen: -2 }), ueber: 'fadeblack' },
    { bild: await endkarte('Schachtinspektion.<br>Direkt am Schacht.', { unter: 'kostenlos im Browser · auch offline', knopf: 'Link in der Bio' }), dauer: 3.2, zoom: 0.0005 },
  ]; },
  abscheiderblickumtec: async () => { TH = THEMEN.abscheiderblick; const F = 'material/umtec/_reel/'; return [
    { foto: F + 'tankstelle-nacht.jpg', dauer: 2.4, opt: { quer: 0.1, zoom: 0.0009 }, text: await png('a1.png', text('Tankstelle, 6 Uhr', 'General-<br>inspektion.')), ueber: 'smoothleft' },
    { foto: F + 'abscheider-leer.jpg', dauer: 2.4, opt: { quer: 0.5, zoom: 0.0010 }, text: await png('a2.png', text('Leer gesaugt', 'Jetzt wird<br>geprüft.')), ueber: 'smoothleft' },
    { foto: F + 'schwimmer.jpg', dauer: 3.2, opt: { quer: 0.55, zoom: 0.0006 }, text: await geraet('a3.png', '/home/user/gi-tool/app/willkommen/bilder/handy-zustand.webp', 'Mängel antippen', 'Frist kommt<br>von selbst.', { art: 'handy', breite: 500, top: 640, drehen: -2 }), ueber: 'smoothleft' },
    { foto: F + 'abscheider-koaleszenz.jpg', dauer: 3.2, opt: { quer: 0.5, zoom: 0.0006 }, text: await geraet('a4.png', '/home/user/gi-tool/app/willkommen/bilder/handy-bemessung.webp', 'Bemessung', 'Mit<br>Rechenweg.', { art: 'handy', breite: 500, top: 640, drehen: 2 }), ueber: 'smoothleft' },
    { foto: F + 'abscheider-leiter.jpg', dauer: 3.2, opt: { quer: 0.5, zoom: 0.0006 }, text: await geraet('a5.png', '/home/user/gi-tool/app/willkommen/bilder/bericht-1.webp', 'Ein Knopf', 'Prüfbericht<br>fertig.', { art: 'tablet', breite: 640, top: 700 }), ueber: 'fadeblack' },
    { bild: await endkarte('Generalinspektion.<br>Ohne Papierkram.', { unter: 'für Einzelanwender kostenlos', knopf: 'Link in der Bio' }), dauer: 3.2, zoom: 0.0005 },
  ]; },
  abscheider3dumtec: async () => { TH = THEMEN.abscheider3d; const U = 'material/umtec/'; const F = U + '_reel/'; return [
    { clip: U + 'VID-20250509-WA0010.mp4', dauer: 2.4, opt: { start: 30, zoom: 0.0008 }, text: await png('d1.png', text('Heute', 'Dichtheits-<br>prüfung.')), ueber: 'smoothleft' },
    { foto: F + 'stativ-schild.jpg', dauer: 2.4, opt: { quer: 0.45, zoom: 0.0010 }, text: await png('d2.png', text('Stativ steht', 'Wasser<br>rein.')), ueber: 'smoothleft' },
    { clip: U + 'VID-20250509-WA0014.mp4', dauer: 2.4, opt: { start: 6, zoom: 0.0008 }, text: await png('d3.png', text('Pegel', 'messen.')), ueber: 'smoothleft' },
    { foto: F + 'abscheider-edelstahl.jpg', dauer: 3.2, opt: { quer: 0.5, zoom: 0.0006 }, text: await geraet('d4.png', 'material/screens/abscheider3d-modell.jpg', 'Abscheider 3D', 'Bemaßtes<br>Modell.', { art: 'tablet', breite: 940, top: 820, drehen: -2 }), ueber: 'smoothleft' },
    { foto: F + 'messung-schacht.jpg', dauer: 3.2, opt: { quer: 0.5, zoom: 0.0006 }, text: await geraet('d5.png', 'material/screens/abscheider3d-dichtheit.jpg', 'Anhang A', 'Wasserbilanz.<br>Fertig.', { art: 'handy', breite: 560, top: 640, drehen: 2 }), ueber: 'fadeblack' },
    { bild: await endkarte('Kostenlos.<br>Ohne Anmeldung.', { unter: 'Daten bleiben auf dem Gerät', knopf: 'Link in der Bio' }), dauer: 3.2, zoom: 0.0005 },
  ]; },
  abscheider3dumtec2: async () => { TH = THEMEN.abscheider3d; const F = 'material/umtec/_reel/'; return [
    { foto: F + 'tankstelle-tag.jpg', dauer: 2.4, opt: { quer: 0.12, zoom: 0.0009 }, text: await png('h1.png', text('Bauwerksaufnahme', 'Vor Ort.')), ueber: 'smoothleft' },
    { foto: F + 'abscheider-blau.jpg', dauer: 2.4, opt: { quer: 0.5, zoom: 0.0010 }, text: await png('h2.png', text('Jedes Maß', 'zählt.')), ueber: 'smoothleft' },
    { foto: F + 'sonde-schacht.jpg', dauer: 3.2, opt: { quer: 0.5, zoom: 0.0006 }, text: await geraet('h3.png', 'material/screens/abscheider3d-schnitt.jpg', 'Längsschnitt', 'Auf<br>Knopfdruck.', { art: 'tablet', breite: 960, top: 860, drehen: -2 }), ueber: 'smoothleft' },
    { foto: F + 'abscheider-einbau.jpg', dauer: 3.2, opt: { quer: 0.5, zoom: 0.0006 }, text: await geraet('h4.png', 'material/screens/abscheider3d-draufsicht.jpg', 'Draufsicht', 'Bemaßt.', { art: 'tablet', breite: 940, top: 820, drehen: 2 }), ueber: 'smoothleft' },
    { foto: F + 'rohr-tauchrohr.jpg', dauer: 2.4, opt: { quer: 0.5, zoom: 0.0009 }, text: await png('h5.png', text('Fett oder Benzin', 'Beides<br>drin.')), ueber: 'fadeblack' },
    { bild: await endkarte('Vom Aufmaß<br>zum 3D-Modell.', { unter: 'kostenlos · ohne Anmeldung', knopf: 'Link in der Bio' }), dauer: 3.2, zoom: 0.0005 },
  ]; },
  mmseumtec: async () => { TH = THEMEN.mmse; const U = 'material/umtec/'; const F = U + '_reel/'; return [
    { clip: U + 'VID-20250507-WA0024.mp4', dauer: 2.4, opt: { start: 15, zoom: 0.0008 }, text: await png('m1.png', text('Abwasser', 'ist unser<br>Alltag.')), ueber: 'smoothleft' },
    { clip: U + 'VID-20250410-WA0005.mp4', dauer: 2.8, opt: { start: 0.4, zoom: 0.0005, dunkel: 0.05, weich: 2 }, text: await geraet('m2.png', sbBild('liste-960.webp'), 'SpülBlick', 'Kanal-<br>reinigung.', { art: 'handy', breite: 560, top: 720, drehen: -2, th: THEMEN.spuelblick }), ueber: 'smoothleft' },
    { clip: U + 'VID-20241007-WA0005.mp4', dauer: 2.8, opt: { start: 2, zoom: 0.0005, dunkel: 0.05, weich: 2 }, text: await geraet('m3.png', 'app-foto.jpg', 'Schachtblick', 'Schacht-<br>inspektion.', { art: 'handy', breite: 500, top: 660, drehen: 2, th: THEMEN.schachtblick }), ueber: 'smoothleft' },
    { foto: F + 'tankstelle-nacht.jpg', dauer: 2.8, opt: { quer: 0.1, zoom: 0.0005 }, text: await geraet('m4.png', '/home/user/gi-tool/app/willkommen/bilder/handy-pruefung.webp', 'AbscheiderBlick', 'General-<br>inspektion.', { art: 'handy', breite: 480, top: 660, drehen: -2, th: THEMEN.abscheiderblick }), ueber: 'smoothleft' },
    { foto: F + 'stativ-schacht.jpg', dauer: 2.8, opt: { quer: 0.5, zoom: 0.0005 }, text: await geraet('m5.png', 'material/screens/abscheider3d-modell.jpg', 'Abscheider 3D', 'Bauwerk<br>in 3D.', { art: 'tablet', breite: 940, top: 860, drehen: 2, th: THEMEN.abscheider3d }), ueber: 'fadeblack' },
    { bild: await endkarte('Ein Account.<br>Vier Apps.', { unter: 'im Browser · auch offline', knopf: 'Link in der Bio' }), dauer: 3.2, zoom: 0.0005 },
  ]; },
  // SpülBlick mit echten Clips (Straße am Morgen, Hochdruck, Rohrauslauf), Endkarte wie spuelblick
  spuelblickclip: async () => { TH = THEMEN.spuelblick; return [
    { clip: 46216, dauer: 3, opt: { start: 4, quer: 0.5, zoom: 0.0005 }, text: await png('p1.png', text('6:00 Uhr', 'Ab zur<br>ersten Haltung.')), ueber: 'fadeblack',
      sprich: 'Sechs Uhr. Ab zur ersten Haltung.' },
    { clip: 2333, dauer: 3, opt: { start: 2, quer: 0.5, zoom: 0.0007 }, text: await png('p2.png', text('Hochdruck', 'Kanal&shy;reinigung.')), ueber: 'smoothleft',
      sprich: 'Kanalreinigung mit Hochdruck.' },
    { clip: 4593, dauer: 3, opt: { start: 2, quer: 0.62, zoom: 0.0006 }, text: await png('p3.png', text('Und die Doku?', 'Gleich am<br>Fahrzeug.')), ueber: 'fadeblack',
      sprich: 'Und die Dokumentation machst du gleich am Fahrzeug.' },
    { bild: await tabletBild('p4.png', 'material/screens/spuelblick-karte.jpg', TH, { breite: 1040, top: 900 }), dauer: 3, zoom: 0.0008, ueber: 'smoothleft',
      text: await png('p4t.png', oben('SpülBlick', 'Offline-Karte.', 'Haltungen auch im Funkloch')),
      sprich: 'Spülblick zeigt die Haltungen auf der Karte, auch im Funkloch.' },
    { bild: await tabletBild('p5.png', 'material/screens/spuelblick-erfassen.jpg', TH, { breite: 1040, top: 900 }), dauer: 3, zoom: 0.0007, ueber: 'fadeblack',
      text: await png('p5t.png', oben('Schritt für Schritt', 'Erfassen.', 'Verschmutzung, Reinigung, Fotos')),
      sprich: 'Erfassung Schritt für Schritt.' },
    { bild: await endkarte('14 Tage<br>kostenlos testen.', { unter: 'ohne Zahlungsdaten · spülblick.mmse-software.com', knopf: 'Link in der Bio' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Vierzehn Tage kostenlos testen, ohne Zahlungsdaten. Link in der Bio.' },
  ]; },
};
if (!REELS[NAME]) throw new Error(`Unbekanntes Reel „${NAME}“ (${Object.keys(REELS).join(', ')})`);
const ALLE = await REELS[NAME]();
// --ab <n>: nur die Szenen ab Nr. n (0-basiert) rendern → reels/reel-<name>-ab<n>.mp4, z. B. wenn die Clips der vorderen
// Szenen fehlen; danach an die bestehende Datei anhängen (Schnitt im Schwarz der fadeblack-Überblendung davor, siehe Skill).
const SZENEN = ALLE.slice(AB);
await browser.close();

// ---- Sprecher: piper (Thorsten) je Szene; die Szene dauert mindestens so lange wie der Satz plus Luft für die Überblendung
const PIPER = process.env.PIPER_BIN || 'piper';
const STIMME = process.env.PIPER_MODEL || join(root, '.cache', 'piper', 'de_DE-thorsten-high.onnx');
const dauerVon = (datei) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', datei]).toString());
// Aussprache: piper/espeak liest manche Namen falsch (z. B. „Spülblick“ mit kurzem ü → klingt wie „Spüll-blick“).
// Nur für den Sprecher umschreiben, Texte im Bild bleiben richtig. Prüfen: PiperVoice.phonemize(text) im piper-venv.
const AUSSPRACHE = [[/Spülblick/g, 'Spühlblick']];
const sprechtext = (t) => AUSSPRACHE.reduce((x, [m, r]) => x.replace(m, r), t);
SZENEN.forEach((z, i) => {
  if (!z.sprich) return;
  const roh = join(tmp, `v${i}-roh.wav`); z.stimme = join(tmp, `v${i}.wav`);
  execFileSync(PIPER, ['-m', STIMME, '-f', roh, '--length_scale', '1.0', '--sentence_silence', '0.2'], { input: sprechtext(z.sprich), stdio: ['pipe', 'ignore', 'ignore'] });
  ff(['-i', roh, '-af', 'highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,aresample=44100', '-ac', '2', z.stimme]);
  z.dauer = Math.max(z.dauer, dauerVon(z.stimme) + 1.1);
});

// ---- Szenen rendern
const LOOK = 'eq=contrast=1.14:saturation=0.82:gamma=0.94,colorbalance=rs=-0.06:bs=0.09:rh=0.07:gh=0.02:bh=-0.07,vignette=PI/4.2';
const KORN = 'noise=alls=9:allf=t+u';
// Foto drehen (Draufsicht hat kein Oben), auf 9:16 schneiden, hochskalieren und langsam hineinfahren
// Querformat-Fotos (quer: 0…1 = Ausschnitt von links nach rechts) werden nicht gedreht, sondern hochkant ausgeschnitten.
function fotoSzene(foto, dauer, out, { zoom = 0.0011, dreh = 'transpose=1', drift = 0, z0 = 1.04, quer } = {}) {
  const n = Math.round(dauer * FPS);
  const zuschnitt = quer === undefined ? `${dreh},crop=iw:iw*16/9` : `crop=ih*9/16:ih:(iw-ih*9/16)*${quer}:0`;
  ff(['-loop', '1', '-i', foto.includes('/') ? join(root, foto) : join(root, 'material', 'schachtblick', 'demo', foto), '-frames:v', String(n), '-vf',
    `${zuschnitt},scale=2160:3840,zoompan=z='${z0}+${zoom}*on':x='iw/2-(iw/zoom/2)+${drift}*on':y='ih/2-(ih/zoom/2)':d=${n}:s=${W}x${H}:fps=${FPS},${LOOK},${KORN},format=yuv420p`,
    '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', join(tmp, out)]);
}
function bildSzene(bild, dauer, out, zoom = 0.0009) {
  const n = Math.round(dauer * FPS);
  ff(['-loop', '1', '-i', bild, '-frames:v', String(n), '-vf',
    `scale=2160:3840,zoompan=z='1+${zoom}*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=${W}x${H}:fps=${FPS},vignette=PI/5,noise=alls=5:allf=t+u,format=yuv420p`,
    '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', join(tmp, out)]);
}
// Echte Videoclips (Pixabay-ID aus material/clips/, siehe werkzeuge/pixabay.mjs): hochkant ausschneiden (quer 0…1),
// langsam hineinfahren, gleicher Farblook und Korn wie die Fotos; kurze Clips laufen in Schleife, Ton wird verworfen.
// verpixeln: [[x, y, b, h], …] in Anteilen des Quellbilds (nach Drehung) – Logos, Schriftzüge, Kennzeichen unkenntlich machen.
const verpixelFilter = (boxen = []) => boxen.map(([x, y, b, h], i) =>
  `split[va${i}][vb${i}];[vb${i}]crop=iw*${b}:ih*${h}:iw*${x}:ih*${y},scale=iw/14:-2,scale=iw*14:-2:flags=neighbor,boxblur=4[vc${i}];[va${i}][vc${i}]overlay=W*${x}:H*${y},`).join('');
// UMTEC-Rohmaterial liegt in Unterordnern von material/umtec/ (wie im Drive); Dateiname genügt
function umtecDatei(name, dir = join(root, 'material', 'umtec')) {
  if (!existsSync(dir)) return null;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const pf = join(dir, e.name);
    if (e.isDirectory()) { const t = umtecDatei(name, pf); if (t) return t; } else if (e.name === name) return pf;
  }
  return null;
}
function clipSzene(clip, dauer, out, { start = 0, quer = 0.5, zoom = 0.0006, z0 = 1.02, tempo = 1, dunkel = 0, weich = 0, verpixeln = [] } = {}) {
  const n = Math.round(dauer * FPS);
  let datei = String(clip).includes('/') ? join(root, clip) : join(root, 'material', 'clips', `${clip}.mp4`);
  if (!existsSync(datei) && String(clip).startsWith('material/umtec/')) datei = umtecDatei(String(clip).split('/').pop()) || datei;
  ff(['-stream_loop', '-1', '-ss', String(start), '-i', datei, '-frames:v', String(n), '-an', '-vf',
    `${verpixelFilter(verpixeln)}setpts=PTS/${tempo},fps=${FPS},crop='min(iw\\,ih*9/16)':ih:'(iw-min(iw\\,ih*9/16))*${quer}':0,scale=${W * 2}:${H * 2},zoompan=z='${z0}+${zoom}*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS},${LOOK}${dunkel ? `,eq=brightness=-${dunkel}` : ''}${weich ? `,gblur=sigma=${weich}` : ''},${KORN},format=yuv420p`,
    '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', join(tmp, out)]);
}
SZENEN.forEach((z, i) => z.clip !== undefined ? clipSzene(z.clip, z.dauer, `s${i}.mp4`, z.opt)
  : z.foto ? fotoSzene(z.foto, z.dauer, `s${i}.mp4`, z.opt) : bildSzene(z.bild, z.dauer, `s${i}.mp4`, z.zoom));

// ---- Schnitt: weiche Überblendungen, Texte mit Einblendung und leichtem Hochgleiten
const X = 0.5; // Überblenddauer
const ab = SZENEN.map((z) => z.dauer);
const off = []; let t = 0;
for (let i = 0; i < ab.length - 1; i++) { t += ab[i] - X; off.push(t); }
const beginn = [0, ...off]; // Beginn jeder Szene im Schnitt
let f = '';
let letzt = '0:v';
for (let i = 1; i < ab.length; i++) { f += `[${letzt}][${i}:v]xfade=transition=${SZENEN[i - 1].ueber || 'fade'}:duration=${X}:offset=${off[i - 1].toFixed(2)}[v${i}];`; letzt = `v${i}`; }
const texte = [];
SZENEN.forEach((z, i) => { if (z.text) texte.push({ png: z.text, a: beginn[i] + 0.35, e: off[i + (z.textSzenen || 1) - 1] ?? beginn[i] + z.dauer }); });
texte.forEach((tx, j) => {
  const a = tx.a.toFixed(2), b = (tx.e - 0.1).toFixed(2), n = ab.length + j;
  f += `[${n}:v]format=rgba,fade=t=in:st=${a}:d=0.45:alpha=1,fade=t=out:st=${(tx.e - 0.45).toFixed(2)}:d=0.35:alpha=1[t${j}];`;
  f += `[${letzt}][t${j}]overlay=x=0:y='if(lt(t,${a}),40,max(0,40-(t-${a})*90))':enable='between(t,${a},${b})'[o${j}];`;
  letzt = `o${j}`;
});
const gesamt = ab.reduce((s, x) => s + x, 0) - X * (ab.length - 1);
f += `[${letzt}]fade=t=in:st=0:d=0.6,fade=t=out:st=${(gesamt - 0.5).toFixed(2)}:d=0.5,format=yuv420p[v]`;
const eing = [];
SZENEN.forEach((_, i) => eing.push('-i', join(tmp, `s${i}.mp4`)));
for (const tx of texte) eing.push('-loop', '1', '-t', String(gesamt), '-i', tx.png);
// Ton: ohne Sprecher stumme Spur (Musik kommt in Instagram dazu); mit Sprecher Stimmen + leiser Klangteppich (A-Dur, langsam atmend)
const stimmen = SZENEN.map((z, i) => (z.stimme ? { wav: z.stimme, ab: beginn[i] + 0.4 } : null)).filter(Boolean);
const a0 = ab.length + texte.length;
if (stimmen.length) {
  for (const s of stimmen) eing.push('-i', s.wav);
  eing.push('-f', 'lavfi', '-t', String(gesamt), '-i',
    "aevalsrc='0.3*(sin(2*PI*110*t)+0.6*sin(2*PI*164.81*t)+0.5*sin(2*PI*220*t)+0.3*sin(2*PI*277.18*t)+0.25*sin(2*PI*329.63*t))*(0.75+0.25*sin(2*PI*0.08*t))':s=44100:c=stereo");
  stimmen.forEach((s, j) => { const ms = Math.round(s.ab * 1000); f += `;[${a0 + j}:a]adelay=${ms}|${ms}[s${j}]`; });
  f += `;[${a0 + stimmen.length}:a]lowpass=f=700,volume=0.05,afade=t=in:st=0:d=1.5,afade=t=out:st=${(gesamt - 1.5).toFixed(2)}:d=1.5[pad]`;
  f += `;${stimmen.map((_, j) => `[s${j}]`).join('')}[pad]amix=inputs=${stimmen.length + 1}:normalize=0:duration=longest,atrim=0:${gesamt.toFixed(2)},loudnorm=I=-16:TP=-1.5,aresample=44100[a]`;
} else eing.push('-f', 'lavfi', '-t', String(gesamt), '-i', 'anullsrc=r=44100:cl=stereo');
ff([...eing, '-filter_complex', f,
  '-map', '[v]', '-map', stimmen.length ? '[a]' : `${a0}:a`, '-c:v', 'libx264', '-crf', '21', '-preset', 'slow', '-pix_fmt', 'yuv420p',
  '-r', String(FPS), '-c:a', 'aac', '-shortest', '-movflags', '+faststart', ziel]);
// Titelbild fürs Profilraster (Bild aus Szene 1 mit Text)
if (!AB) ff(['-ss', '1.6', '-i', ziel, '-frames:v', '1', '-q:v', '2', join(root, 'reels', `reel-${NAME}-cover.jpg`)]);
rmSync(tmp, { recursive: true, force: true });
console.log(`   reels/reel-${NAME}.mp4  ${gesamt.toFixed(1)} s  ${Math.round(statSync(ziel).size / 1024)} KB`);
