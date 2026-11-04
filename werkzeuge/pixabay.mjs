// Pixabay-Videos per ID nach material/clips/<id>.mp4 laden (nicht im Repo: Pixabay erlaubt keine Weitergabe der Rohclips).
// Aufruf: PIXABAY_KEY=… node werkzeuge/pixabay.mjs 159708 72025 …   (Suche: node werkzeuge/pixabay.mjs --suche "gas station")
// Lizenz: https://pixabay.com/service/license-summary/ – Nutzung in eigener Werbung mit Bearbeitung erlaubt, ohne Namensnennung.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY = process.env.PIXABAY_KEY;
if (!KEY) throw new Error('PIXABAY_KEY fehlt (Umgebungs-Secret)');
const holen = async (url) => { const r = await fetch(url, { headers: { 'User-Agent': 'curl/8.5.0' } }); if (!r.ok) throw new Error(`${r.status} ${url.split('?')[0]}`); return r; };
const api = async (p) => (await holen(`https://pixabay.com/api/videos/?key=${KEY}&${new URLSearchParams(p)}`)).json();
const args = process.argv.slice(2);
if (args[0] === '--suche') {
  for (const h of (await api({ q: args[1], per_page: 20, safesearch: 'true' })).hits) {
    if (/ai generated/i.test(h.tags)) continue; // keine KI-Clips
    console.log(h.id, `${h.duration}s`, `${h.videos.large.width}x${h.videos.large.height}`, h.tags, h.pageURL);
  }
} else {
  mkdirSync(join(root, 'material', 'clips'), { recursive: true });
  for (const id of args) {
    const ziel = join(root, 'material', 'clips', `${id}.mp4`);
    if (existsSync(ziel)) { console.log(`   ${id} vorhanden`); continue; }
    const h = (await api({ id })).hits[0];
    if (!h) throw new Error(`Video ${id} nicht gefunden`);
    const v = h.videos.large?.url ? h.videos.large : h.videos.medium;
    writeFileSync(ziel, Buffer.from(await (await holen(v.url)).arrayBuffer()));
    console.log(`   material/clips/${id}.mp4  ${v.width}x${v.height}  ${h.duration}s  ${h.pageURL}`);
  }
}
