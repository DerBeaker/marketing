// Grafiken für das Instagram-Profil: Profilbild (wird rund beschnitten), Cover für die Story-Highlights und
// ein Karussell „So geht’s“ als erster Beitrag (3:4 = 1080 × 1440, so schneidet das Profilraster nichts ab).
// Nutzt die Bildschirmfotos aus app/bilder (make-bilder.mjs) – die App muss dafür nicht laufen.
// Aufruf: node werkzeuge/make-instagram.mjs [start|ki|kommune|kw44]   → posts/instagram/*.jpg (ohne Auswahl: Profilbild, Highlights, Karussell 1;
// „kw44“: Karussells „pflicht“ und „aufmass“ (4:5) und drei Storys (9:16) für KW 44 → kw44-*.jpg;
// „start“: nur Karussell „Link öffnen. Loslegen.“ → start-1…5.jpg; „ki“: nur Karussell „Schachtinspektion mit KI“ → ki-1…5.jpg; „kommune“: nur Karussell „Schächte selbst inspizieren“ → kommune-1…5.jpg)
import { createRequire } from 'node:module';
import { execSync, execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { b64, marke, icon, foto, TEILEN } from './werbung.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] }));

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'posts', 'instagram');
mkdirSync(out, { recursive: true });
const bild = (name) => b64(join(root, 'material', 'schachtblick', 'bilder', name));
const [FOTO, BEFUNDE, AUFBAU, KI] = ['app-foto.jpg', 'app-befunde.jpg', 'app-aufbau.jpg', 'app-ki.jpg'].map(bild);

// App-Symbol (wie icons/icon.svg), randlos auf dem Verlauf – Instagram schneidet einen Kreis heraus
const SYMBOL = `<svg viewBox="0 0 512 512" width="100%" height="100%"><g fill="none" stroke="#fff" stroke-linecap="round" transform="translate(256 256) scale(.9) translate(-256 -256)">
  <circle cx="256" cy="256" r="150" stroke-width="26"/><circle cx="256" cy="256" r="92" stroke-width="16" opacity=".85"/>
  <path d="M256 92v40M256 380v40M92 256h40M380 256h40" stroke-width="20"/><path d="M256 256L256 166" stroke-width="20" stroke="#ffd166"/>
  <circle cx="256" cy="256" r="16" fill="#fff" stroke="none"/></g></svg>`;
const VERLAUF = 'background:linear-gradient(135deg,#1a73e8,#0098b8)';

// Highlight-Cover: Symbol mittig, Instagram zeigt davon einen Kreis aus der Bildmitte
const HIGHLIGHTS = { 'so-gehts': 'camera', ki: 'sparkles', laser: 'ruler', pro: 'star', fragen: 'info' };

// Karussell: Schritt mit Nummer, Text oben, Handy darunter (unten angeschnitten)
const schritt = (nr, titel, text, img) => `
  <div style="position:absolute;left:72px;right:72px;top:72px">
    <div style="display:flex;align-items:center;gap:24px"><div class="nr" style="width:84px;height:84px;font-size:46px">${nr}</div>
      <h1 style="font-size:76px">${titel}</h1></div>
    <div style="font-size:38px;line-height:1.35;margin-top:30px">${text}</div></div>
  <div class="handy" style="position:absolute;left:220px;width:640px;top:430px;height:1100px;overflow:hidden"><img src="${img}"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:220px;background:linear-gradient(transparent,#0a3f9c 80%)"></div>
  <div class="fuss" style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;justify-content:space-between;font-weight:800">
    <span>Schachtblick</span><span>${nr + 1} / 5</span></div>`;
const KARUSSELL = [
  `<div style="position:absolute;left:72px;right:72px;top:72px">${marke}
     <h1 style="font-size:104px;margin-top:60px">Schacht&shy;inspektion per App</h1>
     <div style="font-size:52px;font-weight:800;margin-top:24px" class="gelb">kostenlos · im Browser · offline</div>
     <div class="chips" style="margin-top:34px"><span class="chip">ISYBAU</span><span class="chip">DWA-M 149-2</span><span class="chip">PDF-Protokoll</span></div></div>
   <div class="handy" style="position:absolute;left:250px;width:580px;top:800px;height:900px;overflow:hidden"><img src="${FOTO}"></div>
   <div style="position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(transparent,#0a3f9c 75%)"></div>
   <div style="position:absolute;right:72px;bottom:56px" class="knopf"><span style="font-size:38px">So geht’s – wischen →</span></div>`,
  schritt(1, 'Foto von oben', 'Uhr auf die Schachtwand legen, 12&nbsp;Uhr auf den Auslauf. Anschlüsse antippen – die Uhrzeit wird übernommen.', FOTO),
  schritt(2, 'Schäden kodieren', 'Nach DIN EN 13508-2 und ISYBAU, mit Schnellauswahl. Die Zustandsklasse nach BFR Abwasser steht sofort da.', BEFUNDE),
  schritt(3, 'Aufbau messen', 'Bauteile erfassen, Maße per Bluetooth-Laser übernehmen – das 3D-Modell zeichnet sich mit.', AUFBAU),
  `<div style="position:absolute;left:72px;right:72px;top:72px">
     <div style="display:flex;align-items:center;gap:24px"><div class="nr" style="width:84px;height:84px;font-size:46px">4</div>
       <h1 style="font-size:76px">Fertig</h1></div>
     <ul class="haken" style="font-size:48px;margin-top:50px;display:grid;gap:18px">
       <li>PDF-Schachtprotokoll mit Fotos und Firmenlogo</li><li>Aufmaß als PDF oder Excel</li>
       <li>Daten bleiben auf deinem Gerät</li><li>kostenlos, ohne Anmeldung</li></ul>
     <div class="pro-hinweis" style="font-size:32px;margin-top:60px;line-height:1.35">XML-Export (ISYBAU, DWA-M 150), Abgleich im Team und KI-Vorschläge gibt’s mit Schachtblick Pro.</div></div>
   <div style="position:absolute;left:72px;right:72px;bottom:170px;text-align:center">
     <div style="font-size:52px;font-weight:800;line-height:1.2">Kennst du jemanden,<br>der Schächte prüft?</div>
     <div class="knopf" style="font-size:44px;margin-top:28px">${TEILEN} Bitte teilen · Link im Profil</div></div>
   <div class="fuss" style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;justify-content:space-between;font-weight:800">
     <span>schachtblick.mmse-software.com</span><span>5 / 5</span></div>`,
];

// Karussell 2: Kommunen, Bauhöfe und Stadtwerke, die ihre Schächte selbst prüfen
const kopf = (nr, titel) => `<div style="display:flex;align-items:center;gap:24px"><div class="nr" style="width:84px;height:84px;font-size:46px">${nr}</div><h1 style="font-size:76px">${titel}</h1></div>`;
const fuss = (nr) => `<div class="fuss" style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;justify-content:space-between;font-weight:800"><span>Schachtblick</span><span>${nr} / 5</span></div>`;
const KOMMUNE = [
  `<div style="position:absolute;left:72px;right:72px;top:72px">${marke}
     <h1 style="font-size:96px;margin-top:60px">Schächte selbst inspizieren</h1>
     <div style="font-size:48px;font-weight:800;margin-top:24px" class="gelb">für Bauhof, Kanalbetrieb und Stadtwerk</div>
     <div class="chips" style="margin-top:34px"><span class="chip">Kanalkataster rein</span><span class="chip">Protokoll raus</span></div></div>
   <div class="handy" style="position:absolute;left:250px;width:580px;top:800px;height:900px;overflow:hidden"><img src="${FOTO}"></div>
   <div style="position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(transparent,#0a3f9c 75%)"></div>
   <div style="position:absolute;right:72px;bottom:56px" class="knopf"><span style="font-size:38px">wischen →</span></div>`,
  schritt(1, 'Kataster importieren', 'ISYBAU-XML oder DWA-M 150 aus dem Kanalkataster laden. Schächte, Anschlüsse und Uhrzeiten sind schon da.', FOTO),
  schritt(2, 'Vor Ort erfassen', 'Foto von oben, Schäden kodieren nach DIN EN 13508-2. Funktioniert offline, auch im Funkloch.', BEFUNDE),
  schritt(3, 'Zustand bewerten', 'Aufbau und Maße erfassen, die Zustandsklasse nach BFR Abwasser steht sofort da.', AUFBAU),
  `<div style="position:absolute;left:72px;right:72px;top:72px">${kopf(4, 'Zurück ins Kataster')}
     <ul class="haken" style="font-size:46px;margin-top:50px;display:grid;gap:18px">
       <li>Zustandsdaten als ISYBAU-XML oder DWA-M 150</li><li>PDF-Protokoll mit Fotos</li>
       <li>Aufmaß als PDF oder Excel</li><li>ohne Installation, im Browser</li></ul>
     <div class="pro-hinweis" style="font-size:32px;margin-top:60px;line-height:1.35">XML-Export und Teamabgleich mit Schachtblick Pro, auf Rechnung. PDF-Protokolle und Aufmaß sind kostenlos.</div></div>
   <div style="position:absolute;left:72px;right:72px;bottom:170px;text-align:center">
     <div style="font-size:52px;font-weight:800;line-height:1.2">Kennst du jemanden<br>beim Bauhof oder Stadtwerk?</div>
     <div class="knopf" style="font-size:44px;margin-top:28px">${TEILEN} Bitte teilen · Link im Profil</div></div>
   <div class="fuss" style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;justify-content:space-between;font-weight:800"><span>schachtblick.mmse-software.com</span><span>5 / 5</span></div>`,
];

// Karussell 2: Schachtinspektion mit KI, allgemein erklärt (Foto, Vorschläge, Prüfen, Ergebnis)
const KI_FOLGE = [
  `<div style="position:absolute;left:72px;right:72px;top:72px">${marke}
     <h1 style="font-size:92px;margin-top:60px">Schacht&shy;inspektion<br>mit KI</h1>
     <div style="font-size:48px;font-weight:800;margin-top:24px" class="gelb">vom Foto zum Befund</div>
     <div class="chips" style="margin-top:34px"><span class="chip">nur in Schachtblick Pro</span><span class="chip">DIN EN 13508-2</span><span class="chip">ISYBAU</span></div></div>
   <div class="handy" style="position:absolute;left:250px;width:580px;top:800px;height:900px;overflow:hidden"><img src="${KI}"></div>
   <div style="position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(transparent,#0a3f9c 75%)"></div>
   <div style="position:absolute;right:72px;bottom:56px" class="knopf"><span style="font-size:38px">wischen →</span></div>`,
  schritt(1, 'Fotos machen', 'Den Schacht von oben fotografieren, die Wand in Serie (12, 3, 6, 9 Uhr), dazu Deckel und Details.', FOTO),
  schritt(2, 'KI schlägt vor', 'Anschlüsse und Schäden nach DIN EN 13508-2, mit Uhrzeit, Begründung und Treffsicherheit in Prozent. Nur in Schachtblick Pro.', KI),
  schritt(3, 'Prüfen und übernehmen', 'Jeder Vorschlag lässt sich ansehen, übernehmen oder verwerfen. Nichts wird automatisch übernommen, Vorschläge sind als KI-Vorschlag markiert.', BEFUNDE),
  `<div style="position:absolute;left:72px;right:72px;top:72px">${kopf(4, 'Das Ergebnis')}
     <ul class="haken" style="font-size:46px;margin-top:50px;display:grid;gap:18px">
       <li>Befunde nach DIN EN 13508-2 kodiert</li><li>Zustandsklasse nach BFR Abwasser</li>
       <li>PDF-Protokoll und Aufmaß</li><li>Export als ISYBAU-XML oder DWA&#8209;M&nbsp;150</li></ul>
     <div class="pro-hinweis" style="font-size:32px;margin-top:60px;line-height:1.35">Die KI-Vorschläge sind nur in Schachtblick Pro enthalten (Zusatzpaket). Die Basisversion mit Kodierung, Zustandsklasse und PDF-Protokoll bleibt kostenlos.</div></div>
   <div style="position:absolute;left:72px;right:72px;bottom:170px;text-align:center">
     <div style="font-size:56px;font-weight:800;line-height:1.2">Wo geht bei euch<br>die meiste Zeit drauf?</div>
     <div style="font-size:38px;margin-top:16px">Fotos, Kodieren oder Protokoll?</div>
     <div class="knopf" style="font-size:44px;margin-top:28px">Schreib’s in die Kommentare</div></div>
   <div class="fuss" style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;justify-content:space-between;font-weight:800"><span>schachtblick.mmse-software.com</span><span>5 / 5</span></div>`,
];
// Karussell „Sofort loslegen“: Einwände der ersten Reaktionen (Erreichbarkeit, Sichtbarkeit der Daten) beantworten
const URL_ZEILE = '<div style="font-size:40px;font-weight:800;margin-top:28px;white-space:nowrap" class="gelb">schachtblick.mmse-software.com</div>';
const START = [
  `<div style="position:absolute;left:72px;right:72px;top:72px">${marke}
     <h1 style="font-size:104px;margin-top:60px">Link öffnen.<br>Loslegen.</h1>
     <div style="font-size:48px;font-weight:800;margin-top:24px" class="gelb">ohne Download, ohne Anmeldung</div>
     <div class="chips" style="margin-top:34px"><span class="chip">im Browser</span><span class="chip">kostenlos</span><span class="chip">auch offline</span></div></div>
   <div class="handy" style="position:absolute;left:250px;width:580px;top:800px;height:900px;overflow:hidden"><img src="${FOTO}"></div>
   <div style="position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(transparent,#0a3f9c 75%)"></div>
   <div style="position:absolute;right:72px;bottom:56px" class="knopf"><span style="font-size:38px">wischen →</span></div>`,
  `<div style="position:absolute;left:72px;right:72px;top:72px">${kopf(1, 'Link öffnen')}
     <div style="font-size:40px;line-height:1.35;margin-top:34px">Im Browser des Handys oder PC aufrufen. Nichts installieren, kein App-Store, kein Konto.</div>${URL_ZEILE}
     <div style="font-size:36px;line-height:1.35;margin-top:44px">Tipp: Im Browser-Menü „Zum Startbildschirm hinzufügen“, dann startet sie wie eine normale App.</div></div>
   <div class="handy" style="position:absolute;left:250px;width:580px;top:860px;height:900px;overflow:hidden"><img src="${FOTO}"></div>
   <div style="position:absolute;left:0;right:0;bottom:0;height:220px;background:linear-gradient(transparent,#0a3f9c 80%)"></div>${fuss(2)}`,
  schritt(2, 'Demo ausprobieren', 'Kein eigener Schacht zur Hand? Das Demo-Projekt hat eine fiktive Straße mit 8 Schächten zum Ausprobieren.', BEFUNDE),
  `<div style="position:absolute;left:72px;right:72px;top:72px">${kopf(3, 'Deine Daten bleiben bei dir')}
     <div style="display:flex;justify-content:center;margin-top:50px;color:#ffd54a">${icon('lock', 300, 1.5)}</div>
     <div style="font-size:44px;line-height:1.35;margin-top:40px;text-align:center">In der kostenlosen Version gibt es kein Konto und keinen Upload. Alles liegt nur im Browser auf deinem Gerät.</div>
     <div style="font-size:44px;font-weight:800;line-height:1.3;margin-top:30px;text-align:center">Niemand sonst kann es sehen.</div>
     <div class="chips" style="margin-top:60px;justify-content:center"><span class="chip">kein Konto</span><span class="chip">kein Upload</span><span class="chip">keine Cookies</span></div></div>
   <div class="fuss" style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;justify-content:space-between;font-weight:800"><span>Schachtblick</span><span>4 / 5</span></div>`,
  `<div style="position:absolute;left:72px;right:72px;top:72px">${kopf(4, 'Einfach ausprobieren')}
     <ul class="haken" style="font-size:46px;margin-top:50px;display:grid;gap:18px">
       <li>kostenlos, ohne Anmeldung</li><li>keine Cookies, kein Tracking</li>
       <li>Daten nur auf deinem Gerät</li><li>PDF-Protokoll und Aufmaß inklusive</li></ul>
     <div class="pro-hinweis" style="font-size:32px;margin-top:60px;line-height:1.35">Erst mit Schachtblick Pro (optional, Firmenkonto auf einem Server in Deutschland) gibt es XML-Export, Teamabgleich und KI-Vorschläge. Ohne Pro bleibt alles auf deinem Gerät.</div></div>
   <div style="position:absolute;left:72px;right:72px;bottom:170px;text-align:center">
     <div style="font-size:52px;font-weight:800;line-height:1.2">Link in der Bio</div>
     <div class="knopf" style="font-size:44px;margin-top:28px">schachtblick.mmse-software.com</div></div>
   <div class="fuss" style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;justify-content:space-between;font-weight:800"><span>Schachtblick</span><span>5 / 5</span></div>`,
];
// ---- KW 44: echte Schachtfotos als Hintergrund (Draufsicht, gedreht und auf das Format zugeschnitten)
const schachtFoto = (datei, w, h, drehen = 90) => {
  const roh = execFileSync('convert', [join(root, 'material', 'schachtblick', 'demo', datei), '-rotate', String(drehen), '-resize', `${w}x${h}^`,
    '-gravity', 'center', '-extent', `${w}x${h}`, '-modulate', '96,85', '-quality', '88', 'jpg:-']);
  return `data:image/jpeg;base64,${roh.toString('base64')}`;
};
const fotoHg = (src, staerke = .78) => `<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,36,79,${staerke}) 0%,rgba(6,36,79,${staerke * .55}) 45%,rgba(2,11,26,${staerke}) 100%)"></div>`;
const titelFoto = (src, titel, gelb, pills) => `${fotoHg(src)}
  <div style="position:absolute;left:72px;right:72px;top:72px">${marke}
    <h1 style="font-size:100px;margin-top:70px;text-shadow:0 4px 30px rgba(0,0,0,.5)">${titel}<br><span class="gelb">${gelb}</span></h1>
    <div class="chips" style="margin-top:40px">${pills.map((p) => `<span class="chip">${p}</span>`).join('')}</div></div>
  <div style="position:absolute;right:72px;bottom:56px" class="knopf"><span style="font-size:38px">wischen →</span></div>`;
const textFolie = (nr, titel, satz, pills = [], ic = 'check') => `<div style="position:absolute;left:72px;right:72px;top:72px">${kopf(nr, titel)}</div>
  <div style="position:absolute;left:72px;right:72px;top:330px;bottom:170px;display:flex;flex-direction:column;justify-content:center">
    <div class="gelb">${icon(ic, 190, 1.6)}</div>
    <div style="font-size:62px;line-height:1.22;margin-top:40px;font-weight:800">${satz}</div>
    <div class="chips" style="margin-top:46px">${pills.map((p) => `<span class="chip" style="font-size:34px">${p}</span>`).join('')}</div></div>${fuss(nr + 1)}`;
const ctaFolie = (nr, titel, punkte, hinweis) => `<div style="position:absolute;left:72px;right:72px;top:72px">${kopf(nr, titel)}
     <ul class="haken" style="font-size:46px;margin-top:50px;display:grid;gap:18px">${punkte.map((x) => `<li>${x}</li>`).join('')}</ul>
     ${hinweis ? `<div class="pro-hinweis" style="font-size:32px;margin-top:50px;line-height:1.35">${hinweis}</div>` : ''}</div>
   <div style="position:absolute;left:72px;right:72px;bottom:150px;text-align:center">
     <div style="font-size:50px;font-weight:800;line-height:1.2">Kostenlos im Browser starten</div>
     <div class="knopf" style="font-size:44px;margin-top:28px">Link in der Bio</div></div>${fuss(5)}`;
const PFLICHT = [
  titelFoto(schachtFoto('schacht-4.jpg', 1080, 1350), 'Pflichtangaben', 'im Blick', ['DIN EN 13508-2', 'beim Kodieren']),
  schritt(1, 'Fehlt etwas?', 'Die App sagt dir Bescheid, direkt bei der Eingabe. Nicht erst im Büro.', BEFUNDE),
  textFolie(2, 'Plausibilitäts&shy;prüfung', 'Geprüft wird nach den Regeln des Kodierhandbuchs.', ['direkt bei der Eingabe', 'auch offline'], 'alert'),
  textFolie(3, 'Der Katalog', 'DIN EN 13508-2 mit nationaler Festlegung.', ['BFR Abwasser 01/2025', 'DWA-M 149-2', 'ISYBAU'], 'list'),
  ctaFolie(4, 'Kodieren ohne Handbuch&shy;wälzen', ['Kodes nach DIN EN 13508-2', 'Uhrzeiger-Lage und Streckenschäden', 'Zustandsklasse nach BFR Abwasser'], 'Alles davon ist in der kostenlosen Basis enthalten.'),
];
const AUFMASS = [
  titelFoto(schachtFoto('schacht-2.jpg', 1080, 1350, 270), 'Aufmaß als', 'PDF oder Excel', ['fällt beim Erfassen ab', 'kostenlos']),
  schritt(1, 'Tiefen und Bauteile', 'Beim Erfassen trägst du Tiefe und Aufbau ein. Maße auch per Bluetooth-Laser.', AUFBAU),
  textFolie(2, 'Nach Tiefenstaffel', 'Das Aufmaß rechnet Summen je Staffel und die Mehrtiefe über der Grenztiefe.', ['PDF', 'Excel'], 'ruler'),
  textFolie(3, 'Mit Protokoll', 'Dazu das PDF-Schachtprotokoll mit Fotos und deinem Firmenlogo.', ['kostenlos in Basis'], 'file'),
  ctaFolie(4, 'Weniger Nacharbeit', ['Aufmaß als PDF oder Excel', 'PDF-Protokoll mit deinem Logo', 'im Browser, ohne Installation'], ''),
];
// Storys 9:16: Text in der sicheren Mitte (oben 250 px, unten 450 px frei)
const story = (hg, klein, titel, zeilen, unten = '') => `${hg}
  <div style="position:absolute;left:80px;top:250px">${marke}</div>
  <div style="position:absolute;left:80px;right:80px;top:560px">
    <div style="font-size:40px;font-weight:700;letter-spacing:.14em;text-transform:uppercase" class="gelb">${klein}</div>
    <h1 style="font-size:104px;margin-top:22px;text-shadow:0 4px 30px rgba(0,0,0,.5)">${titel}</h1>
    <div style="margin-top:50px;display:grid;gap:22px">${zeilen.map((z) => `<div style="font-size:50px;font-weight:700;line-height:1.25">${z}</div>`).join('')}</div>
    ${unten}</div>`;
const STORYS = {
  'kw44-story-format': story(fotoHg(schachtFoto('schacht-1.jpg', 1080, 1920), .82), 'Kurze Frage', '<span style="font-size:92px">Welches Format will dein Auftraggeber?</span>',
    ['ISYBAU-XML', 'DWA-M 150', 'Excel oder PDF', 'Papier'],
    '<div class="knopf" style="font-size:42px;margin-top:60px">Antwort per DM</div>'),
  'kw44-story-abscheider': story('', 'Neben Schachtblick', 'Unsere App für Abscheider.',
    ['Kostenlos für alle Fachkundigen.'],
    '<div class="knopf" style="font-size:40px;margin-top:60px">abscheider.mmse-software.de</div>'),
  'kw44-story-daten': story(fotoHg(schachtFoto('schacht-4.jpg', 1080, 1920, 270), .82), 'Datenschutz', 'Wo liegen deine Daten?',
    ['Basis: nur auf deinem Gerät.', 'Kein Konto, kein Upload.', 'Keine Cookies, keine Tracking-Dienste.'],
    '<div class="knopf" style="font-size:40px;margin-top:60px">Link in der Bio</div>'),
};

const nur = process.argv[2];


const browser = await chromium.launch();
const fertig = (name) => console.log(`   posts/instagram/${name}`, `${Math.round(statSync(join(out, name)).size / 1024)} KB`);
if (!nur) {
await foto(browser, 1080, 1080, `<div style="position:absolute;inset:0;${VERLAUF}"><div style="position:absolute;inset:150px">${SYMBOL}</div></div>`, join(out, 'profilbild.jpg'), 92);
fertig('profilbild.jpg');
for (const [name, ic] of Object.entries(HIGHLIGHTS)) {
  await foto(browser, 1080, 1920, `<div style="position:absolute;inset:0;${VERLAUF};display:grid;place-items:center">${icon(ic, 440)}</div>`, join(out, `highlight-${name}.jpg`), 90);
  fertig(`highlight-${name}.jpg`);
}
for (const [i, inhalt] of KARUSSELL.entries()) {
  await foto(browser, 1080, 1440, inhalt, join(out, `karussell-${i + 1}.jpg`));
  fertig(`karussell-${i + 1}.jpg`);
}
}
for (const [name, folge] of Object.entries({ start: START, ki: KI_FOLGE, kommune: KOMMUNE, 'kw44-pflicht': PFLICHT, 'kw44-aufmass': AUFMASS })) {
  if (nur !== name && !(nur === 'kw44' && name.startsWith('kw44'))) continue;
  for (const [i, inhalt] of folge.entries()) {
    await foto(browser, 1080, 1350, inhalt, join(out, `${name}-${i + 1}.jpg`)); // 4:5 = Feed-Format, sonst schneidet Instagram oben/unten ab
    fertig(`${name}-${i + 1}.jpg`);
  }
}
if (nur === 'kw44') for (const [name, inhalt] of Object.entries(STORYS)) {
  await foto(browser, 1080, 1920, inhalt, join(out, `${name}.jpg`));
  fertig(`${name}.jpg`);
}
await browser.close();
