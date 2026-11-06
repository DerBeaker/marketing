// Szenen für make-cartoon.mjs (läuft im Browser): Papier-Ausschneide-Look, eigene Figuren.
// window.zeichne(t, f) setzt das SVG für Zeitpunkt t (s) und Bild f. Daten: window.BILD (Screens als data:-URLs),
// window.SPRECHEN ([{wer, a, e}] Sprechzeiten für den Mund), window.UT ([{a, e, text}] Untertitel).
/* eslint-disable */
const W = 1080, H = 1920;
let F = 0;
const zuf = (s) => { const x = Math.sin(F * 12.9898 + s * 78.233) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; };
const kl = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const li = (a, b, u) => a + (b - a) * u;
const spricht = (wer, t) => (window.SPRECHEN || []).some((s) => s.wer === wer && t >= s.a && t <= s.e);
const boil = (s, st = 0.7) => `rotate(${(zuf(s) * st).toFixed(2)})`;

// ---- Figuren (Ursprung = zwischen den Füßen)
function figur(o) {
  const { x, y, s = 1, typ = 'horst', mund = 0, augen = 'normal', a1 = 8, a2 = -8, h1 = '', h2 = '', dreh = 0, blick = 0,
    bart = true, brille = false, schweiss = false, beine = 0, traurig = false } = o;
  const Ho = typ === 'horst';
  const haut = Ho ? '#f0c49a' : '#f8d4b4', weste = Ho ? '#e2742a' : '#c9e23b', streifen = Ho ? '#a9a9a9' : '#f4f4f4';
  const helm = Ho ? '#f0c018' : '#ffffff', hose = Ho ? '#384767' : '#2c3754';
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
  else gesicht += `<circle cx="-92" cy="-292" r="20" fill="#f4a0a0" opacity=".7"/><circle cx="92" cy="-292" r="20" fill="#f4a0a0" opacity=".7"/>`;
  if (brille) gesicht += `<rect x="-98" y="-392" width="90" height="52" rx="14" fill="#111"/><rect x="8" y="-392" width="90" height="52" rx="14" fill="#111"/><rect x="-10" y="-375" width="20" height="8" fill="#111"/>`;
  const m = mund ? `<ellipse cx="0" cy="-250" rx="28" ry="${traurig ? 10 : 18}" fill="#5a1414"/>`
    : traurig ? `<path d="M-26,-242 Q0,-262 26,-242" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/>`
      : `<path d="M-26,-256 Q0,-242 26,-256" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const schnauz = Ho && bart ? `<path d="M-74,-282 Q-38,-318 0,-292 Q38,-318 74,-282 Q38,-266 0,-278 Q-38,-266 -74,-282Z" fill="#6b3f1f"/>` : '';
  const zopf = Ho ? '' : `<ellipse cx="138" cy="-318" rx="42" ry="86" fill="#7a4a22" transform="rotate(-18 138 -318)"/>`;
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${dreh}) ${boil(x + y)}">
    <rect x="-72" y="${-62 - bl}" width="56" height="${62 + bl}" fill="${hose}" transform="rotate(${beine * 14} -44 -62)"/>
    <rect x="16" y="-62" width="56" height="62" fill="${hose}" transform="rotate(${-beine * 14} 44 -62)"/>
    <ellipse cx="${-46 - beine * 14}" cy="${-bl * 0.2}" rx="50" ry="19" fill="#222"/><ellipse cx="${46 + beine * 14}" cy="0" rx="50" ry="19" fill="#222"/>
    <path d="M-118,-58 L-102,-238 Q0,-258 102,-238 L118,-58 Z" fill="${weste}"/>
    <rect x="-108" y="-160" width="216" height="17" fill="${streifen}"/><rect x="-112" y="-112" width="224" height="17" fill="${streifen}"/>
    ${zopf}<circle cx="0" cy="-370" r="150" fill="${haut}"/>
    <path d="M-142,-405 A142,128 0 0 1 142,-405 Z" fill="${helm}"/><rect x="-168" y="-416" width="336" height="24" rx="12" fill="${helm}"/>
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

// ---- Szenen
const ALT = `<filter id="alt"><feColorMatrix type="matrix" values="0.55 0.35 0.1 0 0.04  0.45 0.45 0.1 0 0.02  0.35 0.35 0.2 0 0  0 0 0 1 0"/></filter>`;
function szene(t) {
  const H_ = (o) => figur({ typ: 'horst', mund: spricht('horst', t) && F % 2 === 0, ...o });
  const J_ = (o) => figur({ typ: 'jule', mund: spricht('jule', t) && F % 2 === 0, ...o });
  // 1) Früher: der alte Bus tuckert zum Schacht
  if (t < 4) {
    const bx = li(-260, 330, kl(t, 0, 2.6));
    return `<g filter="url(#alt)">${strasse('tag')}${schacht(760, 1300, false)}${pylone(980, 1330)}${bus(bx, 1380, t < 2.6 ? (F % 2) * 8 : 0)}
      ${t < 2.6 ? `<circle cx="${bx - 230}" cy="${1330 - (F % 3) * 10}" r="${26 + (F % 3) * 8}" fill="#999" opacity=".7"/>` : ''}
      ${t > 3.3 ? H_({ x: 640, y: 1430, s: 0.95, a1: 12, a2: -12, h1: klemmbrett() }) : ''}</g>${schild('FRÜHER …', 540, 330, '#f4e7c4')}`;
  }
  // 2) Horst am Schacht: Deckel, Zollstock, Blitz, Zettel weg, Zollstock fällt rein
  if (t < 12.6) {
    const deckel = li(0, 190, kl(t, 4.6, 5.0));
    const offen = t > 4.6;
    const zoll = t < 6.4 ? '' : t < 10.4 ? `<g transform="translate(36,-10) rotate(-160)">${zollstock(Math.min(6, 1 + Math.floor((t - 6.4) * 3)), t > 7.6 ? 38 + Math.sin(F) * 25 : 8)}</g>` : '';
    const zettelFliegt = t > 8.6; const zf = kl(t, 8.6, 10.2);
    const fallU = kl(t, 10.4, 11.1);
    const geblendet = t > 8.15 && t < 9.0;
    let g = `<g filter="url(#alt)">${strasse('tag')}${schacht(660, 1330, offen, deckel)}${pylone(950, 1330)}${pylone(170, 1320)}
      ${H_({ x: 380, y: 1460, a1: t > 8.6 && t < 10.4 ? 150 : 18, a2: t > 6.4 && t < 10.4 ? -70 : -15, h1: zettelFliegt ? '' : klemmbrett(), h2: zoll + (t > 7.6 && t < 8.6 ? `<g transform="translate(0,-30)">${kamera()}</g>` : ''), augen: geblendet ? 'x' : 'normal', blick: t > 8.6 && t < 10.4 ? 1 : t > 10.4 ? 1.3 : 0, schweiss: t > 9 })}
      ${zettelFliegt ? `<g transform="translate(${li(250, 1150, zf)},${li(1180, 420, zf)}) rotate(${zf * 720})">${zettel()}</g>` : ''}
      ${t > 10.4 && t < 11.2 ? `<g transform="translate(${li(560, 650, fallU)},${li(1220, 1330, fallU)}) rotate(${li(-160, -100, fallU)}) scale(${li(1, 0.3, fallU)})">${zollstock(3, 30)}</g>` : ''}
      ${t > 11.1 && t < 11.7 ? `<text x="700" y="1270" font-size="70" font-weight="800" fill="#fff" stroke="#111" stroke-width="8" paint-order="stroke">PLATSCH</text>` : ''}
      ${t > 8.6 && t < 10.4 ? [0, 1, 2].map((i) => `<path d="M${120 + i * 40},${700 + i * 90} q160,-40 320,0" stroke="#fff" stroke-width="8" fill="none" opacity=".8"/>`).join('') : ''}</g>`;
    g += blitz(t > 8.05 && t < 8.4 ? 1 - kl(t, 8.05, 8.4) : 0);
    return g + schild('FRÜHER …', 540, 330, '#f4e7c4');
  }
  // 3) Abends im Büro: alles abtippen
  if (t < 15.8) {
    const uhr = (t - 12.6) * 260;
    return `<g filter="url(#alt)"><rect width="${W}" height="${H}" fill="#d8c49a"/><rect x="100" y="520" width="360" height="300" fill="#1d2a4a" stroke="#6b5130" stroke-width="16"/><circle cx="380" cy="600" r="40" fill="#f6e9a8"/>
      <g transform="translate(800,640)"><circle r="110" fill="#fff" stroke="#333" stroke-width="12"/><line x1="0" y1="0" x2="0" y2="-80" stroke="#222" stroke-width="10" transform="rotate(${uhr})"/><line x1="0" y1="0" x2="0" y2="-55" stroke="#222" stroke-width="12" transform="rotate(${uhr / 12})"/></g>
      ${H_({ x: 400, y: 1290, s: 0.95, a1: 40 + (F % 2) * 20, a2: -40 - ((F + 1) % 2) * 20, schweiss: true, augen: t > 14.6 ? 'zu' : 'normal', traurig: true })}
      <rect x="40" y="1150" width="1000" height="60" fill="#8a5a32"/><rect x="80" y="1210" width="40" height="400" fill="#6d4526"/><rect x="960" y="1210" width="40" height="400" fill="#6d4526"/>
      <rect x="300" y="1080" width="210" height="80" fill="#333"/><rect x="320" y="1110" width="170" height="40" fill="#555"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<rect x="${700 + (i % 2) * 8 + zuf(i) * 4}" y="${1140 - i * 30}" width="230" height="28" fill="#fff" stroke="#bbb" stroke-width="2"/>`).join('')}
      <path d="M150,1150 L190,940 L250,940 L290,1150Z" fill="#f6e08a" opacity=".5"/></g>${schild('22:47 Uhr', 540, 330, '#f4e7c4')}`;
  }
  // 4) Titelkarte HEUTE
  if (t < 16.8) {
    const u = kl(t, 15.8, 16.2);
    return `<rect width="${W}" height="${H}" fill="#ffd54a"/>${wolke(220, 520, 1.2)}${wolke(860, 1360, 1)}
      <g transform="translate(540,900) scale(${li(0.2, 1, u)}) rotate(${li(-30, -4, u)})"><text text-anchor="middle" font-size="190" font-weight="900" fill="#0a3f9c">HEUTE.</text>
      <text y="120" text-anchor="middle" font-size="70" font-weight="800" fill="#222">mit Schachtblick</text></g>`;
  }
  // 5) Jule am Schacht: Foto, Laser, KI-Vorschläge
  if (t < 25) {
    const phase = t < 19.2 ? 'foto' : t < 21.6 ? 'laser' : 'ki';
    const img = phase === 'foto' ? window.BILD.foto : phase === 'laser' ? window.BILD.foto : window.BILD.ki;
    const hand2 = phase === 'laser' ? laser() : handy();
    let g = `${strasse('tag')}${wolke(200, 520, 0.8)}${schacht(560, 1330, true, 190)}${pylone(930, 1330)}
      ${J_({ x: 260, y: 1460, a1: 15, a2: phase === 'laser' ? -40 : -100, h2: hand2, blick: 1 })}`;
    if (phase === 'laser') {
      const u = kl(t, 19.6, 20.0);
      g += `<line x1="430" y1="1180" x2="${li(430, 560, u)}" y2="${li(1180, 1345, u)}" stroke="#ff2a2a" stroke-width="8"/><circle cx="${li(430, 560, u)}" cy="${li(1180, 1345, u)}" r="12" fill="#ff5050"/>
        ${t > 20.1 ? `<g transform="translate(720,1100) rotate(-4) scale(${li(0.3, 1, kl(t, 20.1, 20.4))})"><rect x="-150" y="-70" width="300" height="120" rx="20" fill="#fff" stroke="#222" stroke-width="5"/><text y="12" text-anchor="middle" font-size="76" font-weight="900" fill="#d8281e">2,42 m</text></g>` : ''}`;
    } else {
      const auf = phase === 'foto' ? kl(t, 17.6, 18.0) : 1;
      g += handyGross(img, 760, 820, 300, 4, phase === 'ki' && t > 23.2 ? haken(110, 280, 1.3) : '') .replace('<g transform', `<g opacity="${auf.toFixed(2)}" transform`);
      if (phase === 'ki') g += schild('KI-Vorschläge · nur in Schachtblick Pro', 540, 452, '#fff', '#0a3f9c', 34, 1);
      if (phase === 'foto') g += blitz(t > 17.3 && t < 17.6 ? 0.8 : 0);
    }
    return g + schild('HEUTE.', 540, 330, '#ffd54a', '#0a3f9c');
  }
  // 6) Schacht für Schacht: Jule läuft, Schächte ziehen vorbei, Haken
  if (t < 28.4) {
    const tt = t - 25, sh = tt * 700; let g = strasse('tag', sh) + wolke(300 - tt * 80, 520, 0.8);
    let fertig = 1;
    for (let i = 0; i < 5; i++) {
      const x = 1250 + i * 520 - sh;
      if (x < -200 || x > 1400) { if (x < 540) fertig++; continue; }
      g += schacht(x, 1340, false, 0, 0.9);
      if (x < 560) { fertig++; g += haken(x, 1240, 1); }
    }
    g += J_({ x: 520, y: 1470, a1: 20 + (F % 2) * 30, a2: -100, h2: handy(), beine: F % 2 ? 1 : -1, blick: 1 });
    return g + schild(`Schacht ${Math.min(fertig, 6)} ✓`, 540, 330, '#ffd54a', '#0a3f9c');
  }
  // 7) Horst im Regen, Jule saust vorbei, der Schnauzer fällt ab
  if (t < 31) {
    const jx = li(-300, 1400, kl(t, 28.4, 29.0));
    let g = `<g filter="url(#alt)">${strasse('regen')}${schacht(700, 1330, true, 180)}${wolke(420, 760, 1.2, '#4a5562')}
      ${Array.from({ length: 18 }, (_, i) => `<line x1="${250 + (i * 37) % 340}" y1="${860 + ((i * 97 + F * 40) % 400)}" x2="${240 + (i * 37) % 340}" y2="${900 + ((i * 97 + F * 40) % 400)}" stroke="#bcd" stroke-width="6"/>`).join('')}
      ${H_({ x: 420, y: 1470, traurig: true, bart: t < 30.1, augen: t > 29 ? 'gross' : 'normal', a1: 20, a2: -20, h1: zettel(10) })}
      ${t >= 30.1 ? `<path transform="translate(420,${li(1180, 1440, kl(t, 30.1, 30.6))})" d="M-74,-282 Q-38,-318 0,-292 Q38,-318 74,-282 Q38,-266 0,-278 Q-38,-266 -74,-282Z" fill="#6b3f1f"/>` : ''}</g>`;
    if (t < 29.1) g += J_({ x: jx, y: 1480, s: 0.85, dreh: 8, a2: -100, h2: handy(), beine: F % 2 ? 1 : -1 }) + [0, 1, 2].map((i) => `<line x1="${jx - 300}" y1="${1150 + i * 70}" x2="${jx - 170}" y2="${1150 + i * 70}" stroke="#fff" stroke-width="10"/>`).join('');
    return g + schild('FRÜHER …', 540, 330, '#f4e7c4');
  }
  // 8) Feierabend
  if (t < 34) {
    return `${strasse('abend')}${J_({ x: 330, y: 1470, brille: true, a1: 150, a2: -95, h2: handy() })}${handyGross(window.BILD.befunde, 790, 860, 280, 5)}
      ${schild('Protokoll fertig.', 790, 1290, '#fff', '#0a3f9c', 50, 3)}${schild('HEUTE.', 540, 330, '#ffd54a', '#0a3f9c')}`;
  }
  // 9) Endkarte
  const u = kl(t, 34, 34.4);
  return `<defs><radialGradient id="eg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#0d4fb8"/><stop offset=".6" stop-color="#06244f"/><stop offset="1" stop-color="#020b1a"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#eg)"/>
    <g transform="translate(540,640) scale(${li(0.5, 1, u)})"><g transform="translate(-230,-55)"><circle cx="55" cy="55" r="48" fill="none" stroke="#fff" stroke-width="8"/><circle cx="55" cy="55" r="26" fill="none" stroke="#fff" stroke-width="8"/>
      <path d="M55,0 v20 M55,90 v20 M0,55 h20 M90,55 h20" stroke="#fff" stroke-width="8"/></g><text x="-100" y="25" font-size="82" font-weight="800" fill="#fff">Schachtblick</text></g>
    <text x="540" y="830" text-anchor="middle" font-size="84" font-weight="900" fill="#fff">Schacht für Schacht.</text>
    <text x="540" y="935" text-anchor="middle" font-size="84" font-weight="900" fill="#ffd54a">Fertig.</text>
    <text x="540" y="1035" text-anchor="middle" font-size="44" fill="#fff" opacity=".92">kostenlos im Browser · auch offline</text>
    <text x="540" y="1095" text-anchor="middle" font-size="36" fill="#fff" opacity=".75">KI-Vorschläge nur in Schachtblick Pro</text>
    <g transform="translate(540,1210)"><rect x="-230" y="-50" width="460" height="96" rx="48" fill="#ffd54a"/><text y="16" text-anchor="middle" font-size="46" font-weight="800" fill="#0a3f9c">Link in der Bio</text></g>
    ${figur({ typ: 'jule', x: 860, y: 1700, s: 0.55, brille: true, a1: 10, a2: -150 + (F % 2) * 25, mund: 0 })}`;
}

window.zeichne = (t, f) => {
  F = f;
  const papier = `<filter id="pap"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${f % 4}"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .32  0 0 0 .13 0"/></filter>`;
  document.getElementById('s').innerHTML = `<defs>${ALT}${papier}</defs>${szene(t)}${untertitel(t)}<rect width="${W}" height="${H}" filter="url(#pap)"/>`;
};
