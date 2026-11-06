// Trickfilm im Papier-Ausschneide-Look (eigene Figuren, kein Fremdmaterial) mit Stimmen, Geräuschen und Musik.
// Aufruf: PIPER_BIN=<venv>/bin/piper node werkzeuge/make-cartoon.mjs [schachtblick|abscheiderblick]  → reels/cartoon-<film>.mp4 (+ -cover.jpg)
// Szenen in werkzeuge/cartoon-<film>.js (gemeinsame Bausteine in cartoon-basis.js) (SVG, 12 Bilder/s wie beim Legetrick), Stimmen piper (Thorsten) tiefer/höher gepitcht,
// Geräusche und Musik werden hier synthetisiert. Braucht Playwright (global), ffmpeg, piper + Modell in .cache/piper/.
import { createRequire } from 'node:module';
import { execSync, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [execSync('npm root -g').toString().trim()] }));

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = mkdtempSync(join(tmpdir(), 'sb-cartoon-'));
const W = 1080, H = 1920, SR = 44100;
const ff = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: 'inherit' });
const dauer = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

// ---- Filme: Sprechtexte (Zeit, Figur, gesprochen, Untertitel), Stimmen, Länge, Bilder, Geräusche
const FILM = process.argv[2] || 'schachtblick';
const gi = (n) => `/home/user/gi-tool/app/willkommen/bilder/${n}.webp`;
const FILME = {
  schachtblick: {
    laenge: 38.5, heute: 16.8, cover: 9.0, ende: 34.05,
    bilder: { foto: 'material/schachtblick/bilder/app-foto.jpg', ki: 'material/schachtblick/bilder/app-ki.jpg', befunde: 'material/schachtblick/bilder/app-befunde.jpg' },
    stimmen: { horst: { pitch: 0.8, tempo: 1.05 }, jule: { pitch: 1.42, tempo: 1.12 } },
    zeilen: [
      [4.3, 'horst', 'So. Schacht auf.'], [6.4, 'horst', 'Zollstock, Kamera, Zettel.'], [8.9, 'horst', 'Mein Zettel! Halt!'], [11.3, 'horst', 'Na super.'],
      [12.9, 'horst', 'Und abends alles abtippen. Juhu.'], [17.0, 'jule', 'Foto von oben.'], [19.4, 'jule', 'Tiefe per Laser.'],
      [21.8, 'jule', 'Die K I schlägt vor. Ich prüfe. Passt!', 'Die KI schlägt vor. Ich prüfe. Passt!'], [24.4, 'jule', 'Nächster Schacht!'],
      [29.2, 'horst', 'Häh? Schon fertig?'], [31.3, 'jule', 'Schacht für Schacht. Und Feierabend!'],
    ],
    geraeusche: (G) => { G.motor(0, 2.7); G.pop(3.35); G.klonk(4.75); [6.5, 6.8, 7.1, 7.4, 7.7].forEach((t) => G.klick(t)); G.blitz(8.05); G.wind(8.6, 1.8);
      G.plumps(10.9); G.tippen(13.0, 2.6); G.ding(15.85, 1046); G.ding(15.95, 1568); G.blitz(17.3); G.piu(19.65); G.klick(23.1); G.ding(23.25);
      [25.8, 26.55, 27.3, 28.05].forEach((t, i) => G.ding(t, 1318 + i * 120)); G.regen(28.4, 2.6); G.zisch(28.5); G.posaune(29.9); G.jingle(34.05); },
  },
  abscheiderblick: {
    laenge: 45.5, heute: 15.6, cover: 9.6, ende: 40.05,
    bilder: { ordnung: gi('handy-ordnung'), zustand: gi('handy-zustand'), bemessung: gi('handy-bemessung'), dreid: gi('dreid'), bericht: gi('bericht-1'), pc: gi('pc-pruefung'), kunde: gi('pc-kunde') },
    stimmen: { gerd: { pitch: 0.78, tempo: 1.05 }, kai: { pitch: 1.22, tempo: 1.12 } },
    zeilen: [
      [1.0, 'gerd', 'Generalinspektion. Hab alles dabei.'], [4.8, 'gerd', 'Tabelle eins. Tabelle zwei. Wo war die Formel?'],
      [9.4, 'gerd', 'Akku leer. Neeein!'], [11.3, 'gerd', 'Nenngröße, Schlammfang, Fristen. Alles von Hand.'],
      [15.9, 'kai', 'Schritt für Schritt, wie im B F R Bericht.', 'Schritt für Schritt, wie im BFR-Bericht.'],
      [18.6, 'kai', 'Mangel antippen. Frist kommt von selbst.'], [21.4, 'kai', 'Bemessung? Rechnet er mir vor.'],
      [24.2, 'kai', 'Laser dran, Bauwerk in 3 D. Dichtheit gleich mit.', 'Laser dran, Bauwerk in 3D. Dichtheit gleich mit.'],
      [27.2, 'kai', 'Ein Knopf: Prüfbericht. Mit Fotos.'], [29.8, 'kai', 'Das Büro sieht es sofort. Den Rest mach ich auf der Couch.'],
      [34.2, 'kai', 'Und in fünf Jahren erinnert er mich.'], [37.3, 'gerd', 'Fünf Jahre? Ich bin noch bei Tabelle drei.'],
    ],
    geraeusche: (G) => { G.tippen(0.3, 2.0); G.pop(2.5); G.saugen(4.5, 6.4); G.tippen(5.0, 3.0); [8.4, 8.8, 9.2].forEach((t) => G.piu(t)); G.posaune(9.9);
      G.tippen(11.2, 3.2); G.ding(14.65, 1046); G.ding(14.75, 1568); G.saugen(15.6, 13.9);
      [16.0, 18.8, 21.6, 24.4, 27.3].forEach((t) => G.pop(t)); G.klick(19.2); G.ding(19.35); G.ding(22.1, 1568); G.piu(24.35); G.ding(24.9);
      G.zisch(27.3); G.klonk(28.05); [30.4, 31.6, 32.8].forEach((t, i) => G.ding(t, 1318 + i * 160)); [35.7, 36.0, 36.3, 36.6].forEach((t) => G.ding(t, 2093));
      G.zisch(37.0); G.posaune(38.6); G.jingle(40.05); [40.6, 40.85, 41.1, 41.35, 41.6, 41.85, 42.1].forEach((t) => G.klick(t)); },
  },
};
FILME.spuelblick = {
  laenge: 49.5, fps: 24, heute: 20.4, cover: 7.5, ende: 44.8,
  bilder: { liste: '/home/user/spuelblick/app/start/bilder/liste-960.webp', grad: '/home/user/spuelblick/app/start/bilder/grad-960.webp', projekte: 'material/screens/spuelblick-projekte.jpg' },
  stimmen: { udo: { pitch: 0.8, tempo: 1.05 }, jule: { pitch: 1.42, tempo: 1.12 }, kai: { pitch: 1.22, tempo: 1.12 }, ag: { pitch: 0.95, tempo: 1.0 } },
  zeilen: [
    [3.2, 'udo', 'Haltung zwölf. Los gehts.', 'Haltung zwölf. Los geht’s.'],
    [6.3, 'udo', 'Haltung, Länge, D N, Verschmutzung, Gänge, Düse.', 'Haltung, Länge, DN, Verschmutzung, Gänge, Düse …'],
    [9.85, 'udo', 'Und das für jede Haltung.'], [12.2, 'udo', 'Mist. Drei null null oder acht null null?', 'Mist. 300 oder 800?'],
    [15.5, 'jule', 'Welche Haltung ist das? Und wo ist das Foto?'], [18.0, 'ag', 'Wie weit seid ihr denn?'],
    [22.6, 'kai', 'Projekt offline. Karte ist drauf.'], [24.6, 'kai', 'Funkloch? Egal.'],
    [27.6, 'kai', 'Grad antippen, Fotos rein, speichern. Nächste!'], [31.6, 'kai', 'Tag beenden. Aufmaß steht.'],
    [34.8, 'jule', 'Ich seh, was draußen läuft. Bericht? Ein Klick.'], [39.0, 'ag', 'Endlich seh ich selbst, wie weit ihr seid.'],
    [42.4, 'udo', 'Gebt mir auch so ein Ding!'],
  ],
  geraeusche: (G) => { G.motor(0, 2.6); G.bremse(2.5); G.klonk(2.85); G.saugen(5.0, 0.9); G.wasser(5.8, 5.2); G.kritzeln(6.6, 3.0);
    [9.5, 9.72, 9.94, 10.16, 10.38, 10.6].forEach((t) => G.klick(t)); G.regen(11, 4); G.zisch(12.4);
    [15.3, 15.55, 15.8, 16.05].forEach((t) => G.ding(t, 2093)); G.tippen(15.2, 2.0); G.ring(17.2, 2.0); G.ding(19.45, 1046); G.ding(19.55, 1568);
    G.motor(20.4, 1.6); G.bremse(21.9); G.pop(22.4); G.saugen(23.4, 0.7); G.wasser(24, 7.4); G.pop(24.2);
    [28.3, 28.6, 28.9].forEach((t) => G.klick(t)); [29.4, 29.65, 29.9, 30.15, 30.4, 30.65].forEach((t) => G.blitz(t));
    [31.8, 32.15, 32.5, 32.85, 33.2, 33.55].forEach((t, i) => G.ding(t, 1046 + i * 110)); G.pop(34.5); [35.4, 35.75, 36.1, 36.45].forEach((t) => G.pop(t));
    G.zisch(36.9); G.pop(38.8); G.ding(41.0, 1568); G.pop(43.4); G.ding(43.6); G.jingle(44.8); [45.3, 45.52, 45.74, 45.96, 46.18, 46.4, 46.62, 46.84].forEach((t) => G.klick(t)); },
};
const CFG = FILME[FILM]; if (!CFG) throw new Error(`Unbekannter Film „${FILM}“ (${Object.keys(FILME).join(', ')})`);
const ziel = join(root, 'reels', `cartoon-${FILM}.mp4`);
const LAENGE = CFG.laenge, ZEILEN = CFG.zeilen, STIMME = CFG.stimmen, FPS = CFG.fps || 12;
const PIPER = process.env.PIPER_BIN || 'piper';
const MODELL = process.env.PIPER_MODEL || join(root, '.cache', 'piper', 'de_DE-thorsten-high.onnx');
const SPRECHEN = [], UT = [], STIMMEN = [];
ZEILEN.forEach(([t, wer, text, ut], i) => {
  const roh = join(tmp, `z${i}-roh.wav`), wav = join(tmp, `z${i}.wav`), { pitch, tempo } = STIMME[wer];
  execFileSync(PIPER, ['-m', MODELL, '-f', roh, '--length_scale', '0.92'], { input: text.replace(/Spülblick/g, 'Spühlblick'), stdio: ['pipe', 'ignore', 'ignore'] });
  ff(['-i', roh, '-af', `asetrate=22050*${pitch},aresample=${SR},atempo=${(tempo / pitch).toFixed(4)},highpass=f=90,acompressor=threshold=-18dB:ratio=3,volume=2.4`, '-ac', '1', wav]);
  const d = dauer(wav);
  SPRECHEN.push({ wer, a: t, e: t + d - 0.1 }); UT.push({ a: t - 0.1, e: t + d + 0.35, text: ut || text }); STIMMEN.push({ wav, t });
  const naechste = ZEILEN[i + 1]?.[0];
  console.log(`   ${t.toFixed(1)}s ${wer}: „${text}“ ${d.toFixed(2)} s${naechste && t + d > naechste ? '  ⚠ überlappt' : ''}`);
});

// ---- Geräusche und Musik (mono, 44,1 kHz) direkt berechnet
const N = Math.ceil(LAENGE * SR), bett = new Float32Array(N);
const add = (start, d, fn, vol = 1) => { const a = Math.floor(start * SR), n = Math.floor(d * SR); for (let i = 0; i < n && a + i < N; i++) bett[a + i] += fn(i / SR, i) * vol; };
let rs = 1; const rnd = () => ((rs = (rs * 16807) % 2147483647) / 2147483647) * 2 - 1;
const tp = (f) => { let y = 0; return (x) => (y += f * (x - y)); };
const sq = (p) => (p % 1 < 0.5 ? 1 : -1), tri = (p) => 1 - 4 * Math.abs((p % 1) - 0.5), saw = (p) => 2 * (p % 1) - 1;
const note = (start, f, d, wave = Math.sin, vol = 0.2, att = 0.01) => add(start, d, (t) => (wave === Math.sin ? Math.sin(2 * Math.PI * f * t) : wave(f * t)) * Math.min(1, t / att) * Math.exp(-3 * t / d), vol);
const G = {
  motor: (a, d) => { const lp = tp(0.04); add(a, d, (t) => lp(rnd()) * (0.6 + 0.4 * sq(9 * t)) * 3, 0.5); },
  klonk: (a) => { [523, 1187, 1973, 2741].forEach((f, i) => note(a, f, 0.5 - i * 0.08, Math.sin, 0.18)); add(a, 0.05, () => rnd(), 0.3); },
  klick: (a) => add(a, 0.03, (t) => rnd() * Math.exp(-t * 200), 0.5),
  blitz: (a) => { G.klick(a); add(a, 0.45, (t) => Math.sin(2 * Math.PI * (3000 + 6000 * t) * t) * Math.exp(-t * 6), 0.08); },
  wind: (a, d) => { const lp = tp(0.03); add(a, d, (t) => lp(rnd()) * Math.sin(Math.PI * t / d) * 4, 0.35); },
  plumps: (a) => { add(a, 0.25, (t) => Math.sin(2 * Math.PI * (600 - 1800 * t) * t) * Math.exp(-t * 8), 0.35); const lp = tp(0.3); add(a + 0.2, 0.4, (t) => lp(rnd()) * Math.exp(-t * 9), 0.5); },
  tippen: (a, d) => { for (let t = 0; t < d; t += 0.11 + Math.abs(rnd()) * 0.08) G.klick(a + t); },
  ding: (a, f = 1318) => { note(a, f, 0.9, Math.sin, 0.22); note(a, f * 2, 0.6, Math.sin, 0.08); },
  piu: (a) => add(a, 0.28, (t) => sq((1900 - 3500 * t) * t) * Math.exp(-t * 6), 0.06),
  pop: (a) => add(a, 0.12, (t) => Math.sin(2 * Math.PI * (200 + 1400 * t) * t) * Math.exp(-t * 25), 0.4),
  regen: (a, d) => { const lp = tp(0.5); add(a, d, () => lp(rnd()), 0.18); },
  zisch: (a) => { const lp = tp(0.6); add(a, 0.5, (t) => lp(rnd()) * Math.sin(Math.PI * t / 0.5), 0.35); },
  posaune: (a) => [392, 370, 349, 311].forEach((f, i) => add(a + i * 0.42, i === 3 ? 1.1 : 0.4, (t) => saw((f + (i === 3 ? 6 * Math.sin(2 * Math.PI * 6 * t) : 0)) * t) * Math.min(1, t / 0.03) * (i === 3 ? Math.exp(-t * 1.5) : 1), 0.09)),
  bremse: (a) => add(a, 0.5, (t) => Math.sin(2 * Math.PI * (2600 - 900 * t) * t) * Math.exp(-t * 4), 0.06),
  wasser: (a, d) => { let y = 0; add(a, d, () => { const x = rnd(); const h = x - y; y = x; return h; }, 0.12); },
  kritzeln: (a, d) => { for (let t = 0; t < d; t += 0.18) { const lp = tp(0.5); add(a + t, 0.12, (u) => lp(rnd()) * Math.sin(Math.PI * u / 0.12), 0.25); } },
  ring: (a, d) => { for (let t = 0; t < d; t += 0.5) [440, 480].forEach((f) => note(a + t, f, 0.4, Math.sin, 0.08, 0.005)); },
  saugen: (a, d) => { const lp = tp(0.08); add(a, d, (t) => lp(rnd()) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 1.3 * t)) * 2.2 * Math.min(1, t / 0.4, (d - t) / 0.4), 0.22); },
  jingle: (a) => [523, 659, 784, 1046].forEach((f, i) => { note(a + i * 0.13, f, 0.6, tri, 0.18); }),
};
// Musik: früher eine müde Tuba, heute ein flotter Takt
[65.4, 49, 55, 49, 65.4, 49, 58.3, 49].forEach((f, i) => { for (let r = 0; r < 3; r++) { const s = i * 0.66 + r * 5.28; if (s < CFG.heute - 1.2) note(s, f, 0.6, tri, 0.08, 0.04); } });
for (let b = 0; CFG.heute + b * 0.25 < CFG.ende; b++) {
  const s = CFG.heute + b * 0.25, takt = Math.floor(b / 8) % 4, grund = [130.8, 174.6, 196, 130.8][takt];
  if (b % 2 === 0) note(s, grund / 2, 0.22, tri, 0.07, 0.005);
  if (b % 2 === 1) [1, 1.26, 1.5].forEach((v) => note(s, grund * 2 * v, 0.18, tri, 0.018, 0.003));
  add(s, 0.03, (t) => rnd() * Math.exp(-t * 120), 0.03);
}
CFG.geraeusche(G);
const wav = (f, daten) => { const b = Buffer.alloc(44 + daten.length * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + daten.length * 2, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(daten.length * 2, 40); daten.forEach((v, i) => b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 22000))), 44 + i * 2)); writeFileSync(f, b); };
wav(join(tmp, 'bett.wav'), bett);

// ---- Bilder rendern
const bild = (p) => { const pf = p.startsWith('/') ? p : join(root, p); return `data:image/${pf.endsWith('.webp') ? 'webp' : 'jpeg'};base64,${readFileSync(pf).toString('base64')}`; };
const BILD = Object.fromEntries(Object.entries(CFG.bilder).map(([k, v]) => [k, bild(v)]));
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: W, height: H } })).newPage();
await page.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}body{background:#000}svg{display:block;font-family:'Liberation Sans','DejaVu Sans',sans-serif}</style>
  <svg id="s" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"></svg>`);
await page.evaluate(([b, s, u]) => { window.BILD = b; window.SPRECHEN = s; window.UT = u; }, [BILD, SPRECHEN, UT]);
await page.addScriptTag({ path: join(root, 'werkzeuge', 'cartoon-basis.js') });
await page.addScriptTag({ path: join(root, 'werkzeuge', `cartoon-${FILM}.js`) });
const n = Math.round(LAENGE * FPS);
for (let f = 0; f < n; f++) {
  await page.evaluate(([t, ff_]) => window.zeichne(t, ff_), [f / FPS, f]);
  await page.screenshot({ path: join(tmp, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 });
}
await browser.close();

// ---- Schnitt: 12 Bilder/s → 30 Bilder/s, Ton mischen
const eing = ['-framerate', String(FPS), '-i', join(tmp, 'f%04d.jpg'), '-i', join(tmp, 'bett.wav')];
let fil = '';
STIMMEN.forEach((s, i) => { eing.push('-i', s.wav); const ms = Math.round(s.t * 1000); fil += `[${i + 2}:a]adelay=${ms}|${ms}[v${i}];`; });
fil += `[1:a]volume=0.9[b];[b]${STIMMEN.map((_, i) => `[v${i}]`).join('')}amix=inputs=${STIMMEN.length + 1}:normalize=0:duration=first,afade=t=out:st=${LAENGE - 0.8}:d=0.8,loudnorm=I=-15:TP=-1.5,aresample=${SR}[a]`;
ff([...eing, '-filter_complex', fil, '-map', '0:v', '-map', '[a]', '-vf', `fps=30,format=yuv420p`, '-c:v', 'libx264', '-crf', '20', '-preset', 'slow',
  '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-t', String(LAENGE), '-movflags', '+faststart', ziel]);
ff(['-ss', String(CFG.cover), '-i', ziel, '-frames:v', '1', '-q:v', '2', join(root, 'reels', `cartoon-${FILM}-cover.jpg`)]);
rmSync(tmp, { recursive: true, force: true });
console.log(`   reels/cartoon-${FILM}.mp4  ${LAENGE} s  ${Math.round(statSync(ziel).size / 1024)} KB`);
