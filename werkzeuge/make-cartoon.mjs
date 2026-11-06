// Trickfilm im Papier-Ausschneide-Look (eigene Figuren, kein Fremdmaterial) mit Stimmen, Geräuschen und Musik.
// Aufruf: PIPER_BIN=<venv>/bin/piper node werkzeuge/make-cartoon.mjs  → reels/cartoon-schachtblick.mp4 (+ -cover.jpg)
// Szenen in werkzeuge/cartoon-szene.js (SVG, 12 Bilder/s wie beim Legetrick), Stimmen piper (Thorsten) tiefer/höher gepitcht,
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
const ziel = join(root, 'reels', 'cartoon-schachtblick.mp4');
const W = 1080, H = 1920, FPS = 12, LAENGE = 38.5, SR = 44100;
const ff = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: 'inherit' });
const dauer = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

// ---- Sprechtexte (Zeit, Figur, gesprochen, Untertitel). horst = alter Inspekteur (tief), jule = Kollegin mit Schachtblick (hoch)
const ZEILEN = [
  [4.3, 'horst', 'So. Schacht auf.'],
  [6.4, 'horst', 'Zollstock, Kamera, Zettel.'],
  [8.9, 'horst', 'Mein Zettel! Halt!'],
  [11.3, 'horst', 'Na super.'],
  [12.9, 'horst', 'Und abends alles abtippen. Juhu.'],
  [17.0, 'jule', 'Foto von oben.'],
  [19.4, 'jule', 'Tiefe per Laser.'],
  [21.8, 'jule', 'Die K I schlägt vor. Ich prüfe. Passt!', 'Die KI schlägt vor. Ich prüfe. Passt!'],
  [24.4, 'jule', 'Nächster Schacht!'],
  [29.2, 'horst', 'Häh? Schon fertig?'],
  [31.3, 'jule', 'Schacht für Schacht. Und Feierabend!'],
];
const STIMME = { horst: { pitch: 0.8, tempo: 1.05 }, jule: { pitch: 1.42, tempo: 1.12 } };
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
  jingle: (a) => [523, 659, 784, 1046].forEach((f, i) => { note(a + i * 0.13, f, 0.6, tri, 0.18); }),
};
// Musik: früher eine müde Tuba, heute ein flotter Takt
[65.4, 49, 55, 49, 65.4, 49, 58.3, 49].forEach((f, i) => { for (let r = 0; r < 3; r++) { const s = i * 0.66 + r * 5.28; if (s < 15.6) note(s, f, 0.6, tri, 0.08, 0.04); } });
for (let b = 0; 16.8 + b * 0.25 < 34; b++) {
  const s = 16.8 + b * 0.25, takt = Math.floor(b / 8) % 4, grund = [130.8, 174.6, 196, 130.8][takt];
  if (b % 2 === 0) note(s, grund / 2, 0.22, tri, 0.07, 0.005);
  if (b % 2 === 1) [1, 1.26, 1.5].forEach((v) => note(s, grund * 2 * v, 0.18, tri, 0.018, 0.003));
  add(s, 0.03, (t) => rnd() * Math.exp(-t * 120), 0.03);
}
G.motor(0, 2.7); G.pop(3.35); G.klonk(4.75); [6.5, 6.8, 7.1, 7.4, 7.7].forEach((t) => G.klick(t)); G.blitz(8.05); G.wind(8.6, 1.8);
G.plumps(10.9); G.tippen(13.0, 2.6); G.ding(15.85, 1046); G.ding(15.95, 1568); G.blitz(17.3); G.piu(19.65); G.klick(23.1); G.ding(23.25);
[25.8, 26.55, 27.3, 28.05].forEach((t, i) => G.ding(t, 1318 + i * 120)); G.regen(28.4, 2.6); G.zisch(28.5); G.posaune(29.9); G.jingle(34.05);
const wav = (f, daten) => { const b = Buffer.alloc(44 + daten.length * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + daten.length * 2, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(daten.length * 2, 40); daten.forEach((v, i) => b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 22000))), 44 + i * 2)); writeFileSync(f, b); };
wav(join(tmp, 'bett.wav'), bett);

// ---- Bilder rendern
const bild = (p) => `data:image/jpeg;base64,${readFileSync(join(root, p)).toString('base64')}`;
const BILD = { foto: bild('material/schachtblick/bilder/app-foto.jpg'), ki: bild('material/schachtblick/bilder/app-ki.jpg'), befunde: bild('material/schachtblick/bilder/app-befunde.jpg') };
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: W, height: H } })).newPage();
await page.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}body{background:#000}svg{display:block;font-family:'Liberation Sans','DejaVu Sans',sans-serif}</style>
  <svg id="s" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"></svg>`);
await page.evaluate(([b, s, u]) => { window.BILD = b; window.SPRECHEN = s; window.UT = u; }, [BILD, SPRECHEN, UT]);
await page.addScriptTag({ path: join(root, 'werkzeuge', 'cartoon-szene.js') });
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
ff(['-ss', '9.0', '-i', ziel, '-frames:v', '1', '-q:v', '2', join(root, 'reels', 'cartoon-schachtblick-cover.jpg')]);
rmSync(tmp, { recursive: true, force: true });
console.log(`   reels/cartoon-schachtblick.mp4  ${LAENGE} s  ${Math.round(statSync(ziel).size / 1024)} KB`);
