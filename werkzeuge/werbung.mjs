// Gemeinsamer Stil der Werbebilder (make-social.mjs, make-instagram.mjs): Farbverlauf, Marke, Handy-Rahmen,
// Haken-Listen. Die Bilder entstehen als HTML-Seiten, die Playwright abfotografiert.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const b64 = (p) => `data:image/jpeg;base64,${readFileSync(p).toString('base64')}`;
export const TEILEN = `<svg viewBox="0 0 24 24" width="1em" height="1em" style="vertical-align:-.12em" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>`;
const LOGO = `<svg viewBox="0 0 100 100" width="46" height="46"><g fill="none" stroke="#fff" stroke-width="7"><circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="24"/><path d="M50 4v16M50 80v16M4 50h16M80 50h16"/></g></svg>`;
const CSS = `
  *{box-sizing:border-box} body{margin:0;font-family:'DejaVu Sans',system-ui,sans-serif;color:#fff;overflow:hidden;position:relative;background:linear-gradient(160deg,#0a3f9c 0%,#0a5bd3 45%,#00a3c4 100%)}
  .marke{display:flex;align-items:center;gap:16px;font-size:40px;font-weight:800}
  .logo{width:74px;height:74px;border-radius:20px;background:rgba(255,255,255,.18);display:grid;place-items:center}
  h1{font-weight:800;line-height:1.05;margin:0}
  .gelb{color:#ffd54a}
  .schritt{display:flex;gap:20px;align-items:flex-start;background:rgba(255,255,255,.14);border-radius:26px;padding:20px 24px;margin-top:16px}
  .nr{flex:none;width:58px;height:58px;border-radius:50%;background:#ffd54a;color:#0a3f9c;font-weight:800;font-size:32px;display:grid;place-items:center}
  .schritt b{display:block;font-size:34px;margin-bottom:2px} .schritt span{font-size:27px;opacity:.95;line-height:1.3}
  .handy{background:#0b1220;border-radius:56px;padding:14px;box-shadow:0 40px 80px rgba(0,0,0,.45)}
  .handy img{display:block;width:100%;border-radius:44px}
  .chips{display:flex;flex-wrap:wrap;gap:12px} .chip{background:rgba(255,255,255,.18);border-radius:999px;padding:10px 22px;font-size:28px;font-weight:700}
  .knopf{display:inline-block;background:#ffd54a;color:#0a3f9c;font-weight:800;border-radius:999px;padding:18px 36px}
  .fuss{font-size:30px;opacity:.95}
  .klein{font-size:22px;opacity:.8}
  .haken{list-style:none;margin:0;padding:0} .haken li{position:relative;padding-left:56px;margin-top:14px;line-height:1.25}
  .haken li::before{content:'';position:absolute;left:0;top:.12em;width:38px;height:38px;border-radius:50%;background:#ffd54a}
  .haken li::after{content:'';position:absolute;left:13px;top:calc(.12em + 8px);width:9px;height:17px;border:solid #0a3f9c;border-width:0 5px 5px 0;transform:rotate(45deg)}
  .pro-hinweis{font-size:24px;opacity:.85}
`;
export const seite = (w, h, inhalt) => `<!doctype html><meta charset="utf-8"><style>${CSS} body{width:${w}px;height:${h}px}</style>${inhalt}`;
export const marke = `<div class="marke"><div class="logo">${LOGO}</div>Schachtblick</div>`;

/** Strich-Icons der App (24 × 24, aus core/ui.js), z. B. icon('camera', 300). */
const ICONS = JSON.parse(readFileSync(join(root, 'material', 'icons.json'), 'utf8')); // Strich-Icons der Schachtblick-App (aus app/js/core/ui.js übernommen)
export const icon = (name, groesse, staerke = 1.7) => {
  if (!ICONS[name]) throw new Error(`Icon „${name}“ fehlt in core/ui.js`);
  return `<svg viewBox="0 0 24 24" width="${groesse}" height="${groesse}" fill="none" stroke="currentColor" stroke-width="${staerke}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[name]}"/></svg>`;
};

/** HTML-Inhalt als JPEG abfotografieren. */
export async function foto(browser, w, h, inhalt, ziel, quality = 86) {
  const p = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })).newPage();
  await p.setContent(seite(w, h, inhalt));
  await p.waitForTimeout(200);
  await p.screenshot({ path: ziel, type: 'jpeg', quality });
  await p.close();
}
