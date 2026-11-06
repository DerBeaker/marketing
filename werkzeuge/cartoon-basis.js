// Gemeinsame Bausteine der Trickfilme (läuft im Browser): Papier-Ausschneide-Look, eigene Figuren.
// Die Szenen je Film stehen in cartoon-<film>.js und setzen window.SZENE = (t) => SVG.
// window.zeichne(t, f) setzt das SVG für Zeitpunkt t (s) und Bild f. Daten: window.BILD (Screens als data:-URLs),
// window.SPRECHEN ([{wer, a, e}] Sprechzeiten für den Mund), window.UT ([{a, e, text}] Untertitel).
/* eslint-disable */
const W = 1080, H = 1920;
let F = 0;
const zuf = (s) => { const x = Math.sin(F * 12.9898 + s * 78.233) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; };
const kl = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const li = (a, b, u) => a + (b - a) * u;
const weich = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));               // sanft an und aus
const raus = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3));            // schnell rein, sanft bremsen
const federn = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2)); // leicht überschießen
const rein = (t, a, d = 0.5, f = raus) => f(kl(t, a, a + d));                       // 0 → 1 ab Zeit a
const spricht = (wer, t) => (window.SPRECHEN || []).some((s) => s.wer === wer && t >= s.a && t <= s.e);
const boil = (s, st = 0.7) => `rotate(${(zuf(s) * st).toFixed(2)})`;

// ---- Figuren (Ursprung = zwischen den Füßen)
function figur(o) {
  const { x, y, s = 1, typ = 'horst', mund = 0, augen = 'normal', a1 = 8, a2 = -8, h1 = '', h2 = '', dreh = 0, blick = 0,
    bart = true, brille = false, schweiss = false, beine = 0, traurig = false, kleidung = '', lesebrille = false, helm: mitHelm = true } = o;
  const Ho = typ === 'horst';
  const Ka = typ === 'kai', OR = kleidung === 'orange', AZ = kleidung === 'anzug';
  const haut = Ho ? '#f0c49a' : Ka ? '#e9b98f' : '#f8d4b4';
  const weste = AZ ? '#2b3a55' : OR ? (Ho ? '#e8641c' : '#ff6a13') : Ho ? '#e2742a' : '#c9e23b', streifen = AZ ? 'none' : OR ? '#d9dde3' : Ho ? '#a9a9a9' : '#f4f4f4';
  const helm = Ho ? '#f0c018' : '#ffffff', hose = AZ ? '#222b3d' : OR ? (Ho ? '#d95a16' : '#f2600f') : Ho ? '#384767' : '#2c3754';
  const arm = (xs, ang, hand) => `<g transform="translate(${xs},-228) rotate(${ang})"><rect x="-18" y="0" width="36" height="118" rx="16" fill="${weste}"/>
    <circle cx="0" cy="128" r="25" fill="${haut}"/><g transform="translate(0,128) rotate(${-ang})">${hand}</g></g>`;
  const bl = beine ? 18 : 0;
  let gesicht = '';
  const ax = [-44, 44];
  if (augen === 'x') gesicht += ax.map((ex) => `<path d="M${ex - 22},-382 l44,44 M${ex + 22},-382 l-44,44" stroke="#222" stroke-width="9" stroke-linecap="round"/>`).join('');
  else {
    gesicht += ax.map((ex) => `<ellipse cx="${ex}" cy="-360" rx="45" ry="${augen === 'zu' ? 8 : 52}" fill="#fff" stroke="#222" stroke-width="4"/>`).join('');
    if (augen !== 'zu') gesicht += ax.map((ex) => `<circle cx="${ex + (ex < 0 ? 12 : -12) + blick * 12}" cy="-352" r="${augen === 'gross' ? 6 : 10}" fill="#111"/>`).join('');
  }
  if (Ho) gesicht += traurig
    ? `<path d="M-80,-420 L-15,-405 M80,-420 L15,-405" stroke="#5a3818" stroke-width="11" stroke-linecap="round"/>`
    : `<path d="M-82,-428 L-12,-410 M82,-428 L12,-410" stroke="#5a3818" stroke-width="11" stroke-linecap="round"/>`;
  else gesicht += `<circle cx="-92" cy="-292" r="20" fill="#f4a0a0" opacity=".7"/><circle cx="92" cy="-292" r="20" fill="#f4a0a0" opacity=".7"/>`
    + (Ka ? `<path d="M-70,-425 L-14,-418 M70,-425 L14,-418" stroke="#4a2c12" stroke-width="9" stroke-linecap="round"/><rect x="-150" y="-392" width="22" height="60" rx="8" fill="#4a2c12"/><rect x="128" y="-392" width="22" height="60" rx="8" fill="#4a2c12"/>` : '');
  if (lesebrille) gesicht += `<circle cx="-44" cy="-348" r="40" fill="none" stroke="#333" stroke-width="6"/><circle cx="44" cy="-348" r="40" fill="none" stroke="#333" stroke-width="6"/>`;
  if (brille) gesicht += `<rect x="-98" y="-392" width="90" height="52" rx="14" fill="#111"/><rect x="8" y="-392" width="90" height="52" rx="14" fill="#111"/><rect x="-10" y="-375" width="20" height="8" fill="#111"/>`;
  const m = mund ? `<ellipse cx="0" cy="-250" rx="28" ry="${traurig ? 10 : 18}" fill="#5a1414"/>`
    : traurig ? `<path d="M-26,-242 Q0,-262 26,-242" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/>`
      : `<path d="M-26,-256 Q0,-242 26,-256" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const schnauz = Ho && bart ? `<path d="M-74,-282 Q-38,-318 0,-292 Q38,-318 74,-282 Q38,-266 0,-278 Q-38,-266 -74,-282Z" fill="#6b3f1f"/>` : '';
  const zopf = Ho || Ka ? '' : `<ellipse cx="138" cy="-318" rx="42" ry="86" fill="#7a4a22" transform="rotate(-18 138 -318)"/>`;
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${dreh}) ${boil(x + y)}">
    <rect x="-72" y="${-62 - bl}" width="56" height="${62 + bl}" fill="${hose}" transform="rotate(${beine * 14} -44 -62)"/>
    <rect x="16" y="-62" width="56" height="62" fill="${hose}" transform="rotate(${-beine * 14} 44 -62)"/>
    <ellipse cx="${-46 - beine * 14}" cy="${-bl * 0.2}" rx="50" ry="19" fill="#222"/><ellipse cx="${46 + beine * 14}" cy="0" rx="50" ry="19" fill="#222"/>
    ${OR ? `<rect x="-72" y="-40" width="56" height="10" fill="${streifen}"/><rect x="16" y="-40" width="56" height="10" fill="${streifen}"/>` : ''}
    <path d="M-118,-58 L-102,-238 Q0,-258 102,-238 L118,-58 Z" fill="${weste}"/>
    <rect x="-108" y="-160" width="216" height="17" fill="${streifen}"/><rect x="-112" y="-112" width="224" height="17" fill="${streifen}"/>
    ${zopf}<circle cx="0" cy="-370" r="150" fill="${haut}"/>
    ${mitHelm ? `<path d="M-142,-405 A142,128 0 0 1 142,-405 Z" fill="${helm}"/><rect x="-168" y="-416" width="336" height="24" rx="12" fill="${helm}"/>`
      : `<path d="M-140,-420 Q-120,-525 0,-522 Q120,-525 140,-420 Q80,-470 0,-468 Q-80,-470 -140,-420Z" fill="${Ho ? '#8a8a8a' : '#5a3418'}"/>`}
    ${AZ ? `<path d="M-30,-240 L0,-170 L30,-240Z" fill="#fff"/><path d="M-10,-232 L10,-232 L14,-140 L0,-120 L-14,-140Z" fill="#c0392b"/>` : ''}
    ${gesicht}${schnauz}${m}
    ${schweiss ? `<path d="M150,-440 q14,26 0,36 q-14,-10 0,-36z" fill="#59b6f0"/>` : ''}
    ${arm(-104, a1, h1)}${arm(104, a2, h2)}</g>`;
}

// ---- Requisiten
const klemmbrett = () => `<g transform="translate(-10,-20)"><rect x="-46" y="-62" width="92" height="124" rx="7" fill="#a8743f"/><rect x="-37" y="-50" width="74" height="102" fill="#fff"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="-29" y="${-38 + i * 18}" width="${50 - (i % 2) * 14}" height="5" fill="#9aa"/>`).join('')}<rect x="-18" y="-70" width="36" height="16" rx="4" fill="#888"/></g>`;
const zettel = (r = 0) => `<g transform="rotate(${r})"><rect x="-40" y="-52" width="80" height="104" fill="#fff" stroke="#ccc" stroke-width="2"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="-30" y="${-36 + i * 20}" width="${54 - (i % 2) * 18}" height="5" fill="#9aa"/>`).join('')}</g>`;
function zollstock(n, knick) { // gelbe Glieder, an jedem Gelenk um knick° geknickt
  let g = '';
  for (let i = n - 1; i >= 0; i--) g = `<g transform="translate(0,${i ? 92 : 0}) rotate(${i ? knick * (i % 2 ? 1 : -1) : 0})"><rect x="-9" y="0" width="18" height="96" fill="#f3d21c" stroke="#b39500" stroke-width="2"/>
    <rect x="-9" y="20" width="9" height="3" fill="#333"/><rect x="-9" y="50" width="9" height="3" fill="#333"/>${g}</g>`;
  return g;
}
const kamera = () => `<g transform="translate(0,-10)"><rect x="-48" y="-32" width="96" height="64" rx="10" fill="#222"/><circle cx="6" cy="2" r="22" fill="#666" stroke="#999" stroke-width="5"/><rect x="-40" y="-44" width="26" height="14" fill="#ddd"/></g>`;
const handy = (hell = '#7fd3ff') => `<g transform="translate(0,-40)"><rect x="-36" y="-66" width="72" height="132" rx="13" fill="#1d2433"/><rect x="-29" y="-56" width="58" height="108" rx="6" fill="${hell}"/></g>`;
const laser = () => `<g transform="translate(0,-30)"><rect x="-22" y="-44" width="44" height="88" rx="9" fill="#d8281e"/><rect x="-22" y="-44" width="44" height="26" rx="9" fill="#222"/><rect x="-12" y="-6" width="24" height="18" fill="#bfe8ff"/></g>`;

// ---- Hintergründe
function himmel(art) {
  const farbe = { tag: ['#86cdf2', '#c9ecff'], abend: ['#f6a35c', '#ffd9a0'], regen: ['#6f7f8f', '#9aa7b3'], nacht: ['#1d2a4a', '#30406a'] }[art];
  return `<defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${farbe[0]}"/><stop offset="1" stop-color="${farbe[1]}"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#hg)"/>`;
}
function strasse(art, shift = 0) {
  const hauser = [['#e8b9a0', 260], ['#c6d6a8', 330], ['#f0d58c', 290], ['#b9c9e6', 360], ['#e2a8b8', 300], ['#d0c0e8', 340]];
  let g = himmel(art);
  if (art === 'tag' || art === 'abend') g += `<circle cx="860" cy="${art === 'tag' ? 420 : 760}" r="90" fill="${art === 'tag' ? '#ffe06a' : '#ff8a3c'}"/>`;
  g += `<ellipse cx="300" cy="1030" rx="520" ry="150" fill="#8fc27a"/><ellipse cx="880" cy="1050" rx="480" ry="130" fill="#7fb46a"/>`;
  for (let i = 0; i < 9; i++) {
    const [c, h] = hauser[i % hauser.length]; const x = ((i * 250 - shift * 0.6) % 2250 + 2250) % 2250 - 300;
    g += `<g transform="translate(${x},${1040 - h}) ${boil(i + 3, 0.4)}"><rect width="210" height="${h}" fill="${c}"/><path d="M-12,0 L105,-70 L222,0Z" fill="#a0523a"/>
      ${[0, 1].map((r) => [0, 1].map((cc) => `<rect x="${32 + cc * 96}" y="${40 + r * 90}" width="50" height="56" fill="${art === 'nacht' || art === 'regen' ? '#f6e08a' : '#e9f6ff'}" stroke="#555" stroke-width="3"/>`).join('')).join('')}</g>`;
  }
  g += `<rect y="1030" width="${W}" height="60" fill="#bdb5a5"/><rect y="1090" width="${W}" height="${H - 1090}" fill="#6c6c6c"/>`;
  for (let i = 0; i < 6; i++) { const x = ((i * 300 - shift) % 1800 + 1800) % 1800 - 300; g += `<rect x="${x}" y="1620" width="150" height="18" fill="#eee"/>`; }
  return g;
}
const schacht = (x, y, offen, dx = 170, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><ellipse rx="132" ry="44" fill="#555" stroke="#333" stroke-width="8"/>
  ${offen ? `<ellipse rx="108" ry="34" fill="#0e0e0e"/>` : ''}
  <g transform="translate(${offen ? dx : 0},${offen ? 12 : 0})"><ellipse rx="114" ry="37" fill="#7b7b7b" stroke="#4d4d4d" stroke-width="5"/>
  <path d="M-80,-10 L80,-10 M-90,5 L90,5 M-70,20 L70,20" stroke="#5d5d5d" stroke-width="5"/></g></g>`;
const pylone = (x, y) => `<g transform="translate(${x},${y}) ${boil(x, 1)}"><rect x="-55" y="-12" width="110" height="18" fill="#e8601c"/><path d="M-36,-12 L-12,-150 L12,-150 L36,-12Z" fill="#f07020"/>
  <path d="M-29,-50 L29,-50 L24,-80 L-24,-80Z M-19,-105 L19,-105 L15,-125 L-15,-125Z" fill="#fff"/></g>`;
const bus = (x, y, wackel) => `<g transform="translate(${x},${y + wackel})">
  <rect x="-200" y="-230" width="400" height="190" rx="22" fill="#d8cf9e"/><rect x="110" y="-210" width="80" height="80" rx="10" fill="#9fd2f0"/>
  <circle cx="-120" cy="-150" r="18" fill="#a8693a"/><circle cx="-40" cy="-110" r="12" fill="#a8693a"/><circle cx="40" cy="-190" r="10" fill="#a8693a"/>
  <rect x="-210" y="-60" width="420" height="22" rx="8" fill="#777"/>
  ${[-120, 120].map((wx) => `<g transform="translate(${wx},-30) rotate(${F * 40})"><circle r="44" fill="#222"/><circle r="18" fill="#999"/><rect x="-3" y="-40" width="6" height="22" fill="#555"/></g>`).join('')}</g>`;
const wolke = (x, y, s = 1, c = '#fff') => `<g transform="translate(${x},${y}) scale(${s}) ${boil(x, 1.5)}"><circle cx="-60" cy="0" r="55" fill="${c}"/><circle cx="0" cy="-30" r="70" fill="${c}"/><circle cx="70" cy="0" r="55" fill="${c}"/><rect x="-110" y="0" width="230" height="50" rx="25" fill="${c}"/></g>`;

// ---- Texte
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function schild(text, x = 540, y = 330, farbe = '#fffbe8', schrift = '#222', gr = 78, rot = -3) {
  const w = text.length * gr * 0.62 + 90;
  return `<g transform="translate(${x},${y}) rotate(${rot + zuf(9) * 0.6})"><rect x="${-w / 2}" y="${-gr * 0.9}" width="${w}" height="${gr * 1.45}" fill="${farbe}" stroke="#222" stroke-width="4"/>
    <text y="${gr * 0.22}" text-anchor="middle" font-size="${gr}" font-weight="800" fill="${schrift}">${esc(text)}</text></g>`;
}
function untertitel(t) {
  const u = (window.UT || []).find((x) => t >= x.a && t <= x.e); if (!u) return '';
  const w = u.text.split(' '); const zeilen = []; let z = '';
  for (const wort of w) { if ((z + ' ' + wort).trim().length > 24) { zeilen.push(z.trim()); z = wort; } else z += ' ' + wort; }
  zeilen.push(z.trim());
  return zeilen.map((zz, i) => `<text x="540" y="${1440 + i * 76 - (zeilen.length - 1) * 76}" text-anchor="middle" font-size="66" font-weight="800" fill="#fff" stroke="#111" stroke-width="12" paint-order="stroke" stroke-linejoin="round">${esc(zz)}</text>`).join('');
}
function handyGross(img, x, y, w, rot = 0, extra = '') {
  const h = w * 2; return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="${-w / 2 - 16}" y="${-h / 2 - 16}" width="${w + 32}" height="${h + 32}" rx="44" fill="#141a26"/>
    <clipPath id="sc"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26"/></clipPath>
    <image href="${img}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMin slice" clip-path="url(#sc)"/>${extra}</g>`;
}
const blitz = (u) => (u > 0 ? `<rect width="${W}" height="${H}" fill="#fff" opacity="${u.toFixed(2)}"/>` : '');
const haken = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><circle r="46" fill="#1fa84f" stroke="#fff" stroke-width="6"/><path d="M-22,2 L-6,18 L24,-16" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;

const ALT = `<filter id="alt"><feColorMatrix type="matrix" values="0.55 0.35 0.1 0 0.04  0.45 0.45 0.1 0 0.02  0.35 0.35 0.2 0 0  0 0 0 1 0"/></filter>`;

window.zeichne = (t, f) => {
  F = Math.floor(t * 12 + 1e-6);
  const papier = `<filter id="pap"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${f % 4}"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .32  0 0 0 .13 0"/></filter>`;
  document.getElementById('s').innerHTML = `<defs>${ALT}${papier}</defs>${window.SZENE(t)}${untertitel(t)}<rect width="${W}" height="${H}" filter="url(#pap)"/>`;
};
