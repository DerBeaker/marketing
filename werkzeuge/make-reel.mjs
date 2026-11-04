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
import { mkdtempSync, rmSync, statSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { b64, marke, icon } from './werbung.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] }));

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = mkdtempSync(join(tmpdir(), 'sb-reel-'));
const NAME = process.argv[2] || 'cinematic';
const ziel = join(root, 'reels', `reel-${NAME}.mp4`);
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
  // SpülBlick nur als Vorstellung: keine Preise, keine Kunden, Kontakt per Nachricht
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
    { bild: await karte('sp4.png', 'user', 'Aus der Praxis', 'Gebaut von<br>einem Praktiker.', '15 Jahre Kanalreinigung.'), dauer: 3, zoom: 0.0006, ueber: 'fadeblack',
      sprich: 'Gebaut von einem Praktiker mit fünfzehn Jahren Kanalreinigung.' },
    { bild: await endkarte('Interesse?<br>Schreib uns.', { unter: 'läuft im Browser · auch offline', knopf: 'Nachricht schreiben' }), dauer: 3.5, zoom: 0.0004,
      sprich: 'Interesse? Schreib uns eine Nachricht.' },
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
};
if (!REELS[NAME]) throw new Error(`Unbekanntes Reel „${NAME}“ (${Object.keys(REELS).join(', ')})`);
const SZENEN = await REELS[NAME]();
await browser.close();

// ---- Sprecher: piper (Thorsten) je Szene; die Szene dauert mindestens so lange wie der Satz plus Luft für die Überblendung
const PIPER = process.env.PIPER_BIN || 'piper';
const STIMME = process.env.PIPER_MODEL || join(root, '.cache', 'piper', 'de_DE-thorsten-high.onnx');
const dauerVon = (datei) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', datei]).toString());
SZENEN.forEach((z, i) => {
  if (!z.sprich) return;
  const roh = join(tmp, `v${i}-roh.wav`); z.stimme = join(tmp, `v${i}.wav`);
  execFileSync(PIPER, ['-m', STIMME, '-f', roh, '--length_scale', '1.0', '--sentence_silence', '0.2'], { input: z.sprich, stdio: ['pipe', 'ignore', 'ignore'] });
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
function clipSzene(clip, dauer, out, { start = 0, quer = 0.5, zoom = 0.0006, z0 = 1.02, tempo = 1 } = {}) {
  const n = Math.round(dauer * FPS);
  const datei = String(clip).includes('/') ? join(root, clip) : join(root, 'material', 'clips', `${clip}.mp4`);
  ff(['-stream_loop', '-1', '-ss', String(start), '-i', datei, '-frames:v', String(n), '-an', '-vf',
    `setpts=PTS/${tempo},fps=${FPS},crop=ih*9/16:ih:(iw-ih*9/16)*${quer}:0,scale=${W * 2}:${H * 2},zoompan=z='${z0}+${zoom}*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS},${LOOK},${KORN},format=yuv420p`,
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
ff(['-ss', '1.6', '-i', ziel, '-frames:v', '1', '-q:v', '2', join(root, 'reels', `reel-${NAME}-cover.jpg`)]);
rmSync(tmp, { recursive: true, force: true });
console.log(`   reels/reel-${NAME}.mp4  ${gesamt.toFixed(1)} s  ${Math.round(statSync(ziel).size / 1024)} KB`);
