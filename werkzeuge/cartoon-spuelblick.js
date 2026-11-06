// Szenen „Früher vs. heute“ für SpülBlick (braucht cartoon-basis.js). Flüssig (24 Bilder/s): nichts erscheint einfach,
// Fahrzeuge fahren rein, Leute laufen rein, Geräte und Schilder gleiten ins Bild.
/* eslint-disable */
const OR = { kleidung: 'orange' };
const schildRein = (text, t, a, y = 452, farbe = '#fff', schrift = '#14321f', gr = 42) => {
  const u = rein(t, a, 0.45, federn); return `<g transform="translate(${li(-700, 0, u)},0)">${schild(text, 540, y, farbe, schrift, gr, 1)}</g>`;
};
function spuelwagen(x, y, { schlauch = 0, zielX = 0, zielY = 0, farbe = '#f07a1a' } = {}) {
  const dreh = x * 0.9;
  let hose = '';
  if (schlauch > 0) { // Schlauch von der Haspel (hinten) in den Schacht
    const hx = x - 250, hy = y - 170, ex = li(hx, zielX, schlauch), ey = li(hy, zielY, schlauch);
    hose = `<path d="M${hx},${hy} C${hx - 40},${hy + 80} ${ex + 30},${ey - 120} ${ex},${ey}" stroke="#222" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  }
  return `<g transform="translate(${x},${y})">
    <rect x="-330" y="-300" width="420" height="230" rx="30" fill="${farbe}" stroke="#a8500c" stroke-width="6"/>
    <rect x="-300" y="-270" width="140" height="22" fill="#fff" opacity=".6"/><rect x="-120" y="-150" width="190" height="16" fill="#ffd54a"/>
    <g transform="translate(-250,-170)"><circle r="78" fill="#555" stroke="#333" stroke-width="8"/>${[0, 1, 2, 3].map((i) => `<circle r="${66 - i * 13}" fill="none" stroke="#222" stroke-width="8"/>`).join('')}
      <rect x="-6" y="-78" width="12" height="78" fill="#999" transform="rotate(${dreh})"/></g>
    <rect x="100" y="-290" width="210" height="220" rx="24" fill="${farbe}" stroke="#a8500c" stroke-width="6"/><rect x="170" y="-262" width="120" height="90" rx="10" fill="#9fd2f0"/>
    <rect x="290" y="-130" width="30" height="24" rx="6" fill="#ffe9a0"/><rect x="-350" y="-80" width="690" height="26" fill="#555"/>
    ${[-230, -80, 220].map((wx) => `<g transform="translate(${wx},-40)"><circle r="50" fill="#222"/><circle r="20" fill="#999"/><rect x="-4" y="-46" width="8" height="26" fill="#666" transform="rotate(${dreh})"/></g>`).join('')}
    </g>${hose}`;
}
const fahrtX = (t, a, d, von, nach) => li(von, nach, raus(kl(t, a, a + d)));
const nachwippen = (t, a) => (t > a && t < a + 0.6 ? Math.sin((t - a) * 18) * 10 * (1 - (t - a) / 0.6) : 0);
const tropfen = (x, y, t, n = 14, h = 260) => Array.from({ length: n }, (_, i) => {
  const p = ((t * 1.6 + i / n) % 1), dx = (i % 7 - 3) * 22;
  return `<circle cx="${x + dx * p * 3}" cy="${y - Math.sin(p * Math.PI) * h}" r="${8 - p * 4}" fill="#7cc6f0" opacity="${(1 - p).toFixed(2)}"/>`;
}).join('');
function formular(t, a, x, y, s = 1) { // Spülprotokoll, Felder füllen sich mit Gekritzel
  const felder = ['Haltung', 'Länge', 'DN', 'Material', 'Verschmutzung', 'Gänge', 'Düse', 'Wasser', 'Zeit', 'Besonderheiten'];
  const u = rein(t, a, 0.5, federn);
  return `<g transform="translate(${x},${li(1900, y, u)}) scale(${s}) rotate(-3)"><rect x="-250" y="-330" width="500" height="660" fill="#fff" stroke="#999" stroke-width="4"/>
    <text x="0" y="-280" text-anchor="middle" font-size="40" font-weight="900" fill="#333">Spülprotokoll</text>
    ${felder.map((f, i) => { const w = 200 * kl(t, a + 0.5 + i * 0.22, a + 0.7 + i * 0.22);
      return `<text x="-225" y="${-215 + i * 56}" font-size="26" fill="#555">${f}</text><path d="M-20,${-222 + i * 56} q${w / 4},-14 ${w / 2},0 t${w / 2},0" stroke="#1d3fa0" stroke-width="5" fill="none"/>
      <line x1="-30" y1="${-205 + i * 56}" x2="225" y2="${-205 + i * 56}" stroke="#ccc" stroke-width="2"/>`; }).join('')}</g>`;
}
function karteVektor(t, a, fortschritt, x = 540, y = 900, w = 900, h = 560, lkw = true) { // Haltungen werden grün
  const knoten = [[-380, -160], [-200, -170], [-30, -120], [140, -150], [320, -100], [-300, 60], [-120, 40], [60, 80], [240, 60], [380, 160], [-60, 200]];
  const kanten = [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8], [8, 9], [1, 6], [3, 8], [6, 10], [2, 7]];
  const u = rein(t, a, 0.5);
  let g = `<g transform="translate(${x},${y}) scale(${li(0.6, 1, u)})" opacity="${u.toFixed(2)}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="#eef3ea" stroke="#14321f" stroke-width="8"/>
    <path d="M${-w / 2 + 20},-40 H${w / 2 - 20} M-160,${-h / 2 + 20} V${h / 2 - 20} M180,${-h / 2 + 20} V${h / 2 - 20}" stroke="#d6dccf" stroke-width="40"/>`;
  kanten.forEach(([p, q], i) => { const gruen = i < fortschritt * kanten.length;
    g += `<line x1="${knoten[p][0]}" y1="${knoten[p][1]}" x2="${knoten[q][0]}" y2="${knoten[q][1]}" stroke="${gruen ? '#1fa84f' : '#f39a3d'}" stroke-width="14" stroke-linecap="round"/>`; });
  knoten.forEach(([kx, ky]) => { g += `<circle cx="${kx}" cy="${ky}" r="13" fill="#14321f"/>`; });
  if (lkw) { const k = Math.min(kanten.length - 1, Math.floor(fortschritt * kanten.length)), [p, q] = kanten[k], v = (fortschritt * kanten.length) % 1;
    g += `<g transform="translate(${li(knoten[p][0], knoten[q][0], v)},${li(knoten[p][1], knoten[q][1], v) - 30})"><rect x="-34" y="-22" width="68" height="40" rx="8" fill="#f07a1a" stroke="#222" stroke-width="4"/><circle cx="-18" cy="20" r="9" fill="#222"/><circle cx="18" cy="20" r="9" fill="#222"/></g>`; }
  return g + '</g>';
}
const chatBlase = (i, t, a) => { const u = rein(t, a + i * 0.25, 0.35, federn); return `<g transform="translate(${li(1300, 760, u)},${560 + i * 120})"><rect x="-200" y="-45" width="400" height="90" rx="30" fill="#dcf8c6" stroke="#5a9a4a" stroke-width="3"/>
  <rect x="-180" y="-30" width="80" height="60" rx="8" fill="#9aa"/><circle cx="-150" cy="-10" r="10" fill="#fff"/><text x="-80" y="12" font-size="32" fill="#333">Foto ${['?', 'H 12?', 'welche?', '???'][i % 4]}</text></g>`; };

function szene(t) {
  const BILD = window.BILD;
  const U_ = (o) => figur({ typ: 'horst', ...OR, mund: spricht('udo', t) && F % 2 === 0, ...o });
  const J_ = (o) => figur({ typ: 'jule', mund: spricht('jule', t) && F % 2 === 0, helm: false, ...o });
  const K_ = (o) => figur({ typ: 'kai', ...OR, mund: spricht('kai', t) && F % 2 === 0, ...o });
  const A_ = (o) => figur({ typ: 'kai', kleidung: 'anzug', helm: false, mund: spricht('ag', t) && F % 2 === 0, ...o });
  const laeuft = (t0, t1) => (t > t0 && t < t1 ? (F % 2 ? 1 : -1) : 0);
  // 1) Früher: Spülwagen fährt rein, Udo steigt aus
  if (t < 5) {
    const wx = fahrtX(t, 0, 2.6, -700, 880), ux = li(1000, 360, weich(kl(t, 2.8, 4.3)));
    return `<g filter="url(#alt)">${strasse('tag')}${schacht(620, 1340, false)}${schacht(150, 1330, false, 0, 0.8)}
      ${spuelwagen(wx, 1300 + nachwippen(t, 2.6))}${t > 2.8 ? U_({ x: ux, y: 1470, s: 0.9, a1: 10, a2: -10, h1: klemmbrett(), beine: laeuft(2.8, 4.3) }) : ''}</g>${schild('FRÜHER …', 540, 330, '#f4e7c4')}`;
  }
  // 2) Spülen und das Protokoll – Feld für Feld, Haltung für Haltung
  if (t < 11) {
    const sch = weich(kl(t, 5, 5.8));
    let g = `<g filter="url(#alt)">${strasse('tag')}${schacht(620, 1340, true, 170)}${schacht(150, 1330, true, 150, 0.8)}
      ${spuelwagen(880, 1300, { schlauch: sch, zielX: 620, zielY: 1340 })}${t > 5.8 ? tropfen(150, 1320, t) : ''}
      ${U_({ x: 360, y: 1470, s: 0.9, a1: 25, a2: -40, h1: klemmbrett(), schweiss: t > 8 })}`;
    if (t > 6.0) g += formular(t, 6.0, 640, 900, 0.95);
    if (t > 9.4) { const n = Math.floor(kl(t, 9.4, 10.8) * 6);
      for (let i = 0; i < n; i++) g += `<g transform="translate(${li(1300, 250, rein(t, 9.4 + i * 0.22, 0.3))},${1140 - i * 14}) rotate(${i * 4 - 8})">${zettel()}</g>`;
      g += `<g transform="translate(250,${1000 - n * 14})">${schild(`Haltung ${12 + n}`, 0, 0, '#fff', '#c0392b', 40, -4)}</g>`; }
    return g + `</g>${schild('FRÜHER …', 540, 330, '#f4e7c4')}`;
  }
  // 3) Regen: Schreibfehler, Tinte verläuft
  if (t < 15) {
    const wu = rein(t, 11, 0.8), verlauf = kl(t, 12.0, 13.6);
    return `<g filter="url(#alt)">${strasse('regen')}${schacht(620, 1340, true, 170)}${spuelwagen(880, 1300, { schlauch: 1, zielX: 620, zielY: 1340 })}
      ${wolke(li(-300, 380, wu), 760, 1.2, '#4a5562')}${wu > 0.5 ? Array.from({ length: 18 }, (_, i) => `<line x1="${200 + (i * 37) % 360}" y1="${860 + ((i * 97 + F * 40) % 400)}" x2="${190 + (i * 37) % 360}" y2="${900 + ((i * 97 + F * 40) % 400)}" stroke="#bcd" stroke-width="6"/>`).join('') : ''}
      ${U_({ x: 360, y: 1470, s: 0.9, a1: 25, a2: -30, h1: klemmbrett(), traurig: true, schweiss: true })}
      <g transform="translate(700,${li(1900, 960, rein(t, 11.6, 0.5, federn))}) rotate(4)"><rect x="-230" y="-150" width="460" height="300" fill="#fff" stroke="#999" stroke-width="4"/>
        <text x="-200" y="-70" font-size="40" fill="#555">DN</text><text x="-80" y="-70" font-size="64" font-weight="700" fill="#1d3fa0" style="filter:blur(${(verlauf * 6).toFixed(1)}px)">${verlauf > 0.5 ? '8?0' : '300'}</text>
        <text x="-200" y="40" font-size="40" fill="#555">Länge</text><text x="-40" y="40" font-size="64" font-weight="700" fill="#1d3fa0" style="filter:blur(${(verlauf * 5).toFixed(1)}px)">42,?</text>
        ${verlauf > 0.3 ? `<path d="M-40,-60 q6,${verlauf * 120} 0,${verlauf * 160}" stroke="#1d3fa0" stroke-width="8" opacity=".5"/>` : ''}</g></g>${schild('FRÜHER …', 540, 330, '#f4e7c4')}`;
  }
  // 4) Büro: abtippen, Fotos per Chat, der Auftraggeber ruft an
  if (t < 19.4) {
    const klingel = t > 17.2 && t < 19.2;
    return `<g filter="url(#alt)"><rect width="${W}" height="${H}" fill="#d8c49a"/>
      ${J_({ x: li(-300, 330, rein(t, 15, 0.6)), y: 1290, s: 0.95, a1: 40 + (F % 2) * 20, a2: -40 - ((F + 1) % 2) * 20, schweiss: true, augen: klingel ? 'gross' : 'normal' })}
      <rect x="40" y="1150" width="1000" height="60" fill="#8a5a32"/><rect x="80" y="1210" width="40" height="400" fill="#6d4526"/><rect x="960" y="1210" width="40" height="400" fill="#6d4526"/>
      ${[0, 1, 2, 3].map((i) => chatBlase(i, t, 15.3)).join('')}
      <g transform="translate(${880 + (klingel ? Math.sin(F * 3) * 8 : 0)},1100)"><rect x="-90" y="-50" width="180" height="90" rx="20" fill="#c0392b"/><rect x="-110" y="-80" width="220" height="40" rx="20" fill="#a93226"/></g>
      ${klingel ? `<text x="880" y="990" text-anchor="middle" font-size="54" font-weight="900" fill="#c0392b" stroke="#fff" stroke-width="6" paint-order="stroke">RING RING</text>` : ''}
      ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${li(-200, 560 + i * 40, rein(t, 15.2 + i * 0.15, 0.4))},${1120 - i * 18}) rotate(${i * 9 - 18})">${zettel()}</g>`).join('')}</g>
      ${schild('FRÜHER …', 540, 330, '#f4e7c4')}`;
  }
  // 5) HEUTE
  if (t < 20.4) {
    const u = rein(t, 19.4, 0.4, federn);
    return `<rect width="${W}" height="${H}" fill="#ffd54a"/>${wolke(li(-300, 220, u), 520, 1.2)}${wolke(li(1400, 860, u), 1360, 1)}
      <g transform="translate(540,900) scale(${li(0.2, 1, u)}) rotate(${li(-30, -4, u)})"><text text-anchor="middle" font-size="190" font-weight="900" fill="#14321f">HEUTE.</text>
      <text y="120" text-anchor="middle" font-size="76" font-weight="800" fill="#222">mit SpülBlick</text></g>`;
  }
  const heute = schild('HEUTE.', 540, 330, '#ffd54a', '#14321f');
  // 6–8) Draußen: offline Karte, Funkloch, Erfassung mit Handschuhen
  if (t < 31.4) {
    const wx = fahrtX(t, 20.4, 1.6, -700, 880), kx = t < 22.2 ? 1000 : li(1000, 300, weich(kl(t, 22.2, 23.0)));
    let g = `${strasse('tag')}${wolke(200, 520, 0.8)}${schacht(620, 1340, t > 23.4, 170)}${schacht(150, 1330, t > 23.4, 150, 0.8)}
      ${spuelwagen(wx, 1300 + nachwippen(t, 22.0), { schlauch: weich(kl(t, 23.4, 24.0)), zielX: 620, zielY: 1340 })}${t > 24 ? tropfen(150, 1320, t) : ''}`;
    if (t > 22.0) g += K_({ x: kx, y: 1480, s: 0.9, a2: -100, h2: handy(), beine: laeuft(22.2, 23.0), blick: 1 });
    const bild = t < 27.4 ? BILD.liste : BILD.grad, hu = rein(t, t < 27.4 ? 22.4 : 27.4, 0.5, federn);
    g += `<g transform="translate(${li(1400, 0, hu)},0)">${handyGross(bild, 770, 860, 310, 4)}</g>`;
    if (t > 24.0 && t < 27.4) { const fu = rein(t, 24.2, 0.4, federn);
      g += `<g transform="translate(920,${li(-200, 600, fu)})"><circle r="70" fill="#fff" stroke="#222" stroke-width="6"/><path d="M-30,30 V10 M-10,30 V-5 M10,30 V-20 M30,30 V-35" stroke="#888" stroke-width="12" stroke-linecap="round"/>
        <path d="M-45,-45 L45,45 M45,-45 L-45,45" stroke="#d8281e" stroke-width="12" stroke-linecap="round"/></g>`; }
    if (t > 27.6) { // Handschuh tippt, Grad zählt hoch, Fotos fliegen rein
      const tip = kl(t, 27.9, 28.3), p = Math.round(li(10, 30, kl(t, 28.0, 29.0)));
      g += `<g transform="translate(${li(1300, 820, raus(tip))},${li(1500, 1010, raus(tip)) + (t > 28.4 && t < 29.4 ? Math.abs(Math.sin(t * 12)) * 20 : 0)})"><circle r="56" fill="#ff6a13" stroke="#b5520c" stroke-width="6"/><rect x="-20" y="-110" width="40" height="80" rx="18" fill="#ff6a13" stroke="#b5520c" stroke-width="6"/></g>
        <g transform="translate(770,${li(1900, 1230, rein(t, 28.0, 0.4, federn))})"><rect x="-150" y="-60" width="300" height="110" rx="20" fill="#fff" stroke="#14321f" stroke-width="5"/><text y="18" text-anchor="middle" font-size="66" font-weight="900" fill="#14321f">${p} %</text></g>`;
      for (let i = 0; i < 6; i++) { const fu = rein(t, 29.4 + i * 0.25, 0.3); if (fu <= 0) continue;
        g += `<g transform="translate(${li(-100, 650 + (i % 3) * 100, fu)},${li(700, 1180 + Math.floor(i / 3) * 90, fu)}) rotate(${(i % 2 ? 6 : -6)})"><rect x="-44" y="-36" width="88" height="72" rx="8" fill="#556" stroke="#fff" stroke-width="5"/><circle cx="-14" cy="-8" r="10" fill="#cde"/></g>`; }
    }
    const titel = t < 24 ? ['Offline-Karte mit allen Haltungen', 22.4] : t < 27.4 ? ['Funkloch? Alles auf dem Gerät.', 24.0] : ['Erfassen mit Handschuhen · 6 Fotos', 27.4];
    return g + heute + schildRein(titel[0], t, titel[1]);
  }
  // 9) Haltung für Haltung grün, Tages-Aufmaß
  if (t < 34.4) {
    const fort = weich(kl(t, 31.6, 33.8)), meter = Math.round(fort * 412);
    return `${strasse('abend')}${K_({ x: 250, y: 1500, s: 0.85, a1: 150, a2: -100, h2: handy(), blick: 1 })}${karteVektor(t, 31.4, fort, 600, 860, 860, 560)}
      <g transform="translate(700,${li(1900, 1250, rein(t, 31.8, 0.5, federn))})"><rect x="-260" y="-70" width="520" height="130" rx="24" fill="#14321f"/><text y="22" text-anchor="middle" font-size="60" font-weight="900" fill="#fff">Heute: ${meter} m</text></g>
      ${heute}${schildRein('Tag beenden: Tages-Aufmaß', t, 31.4)}`;
  }
  // 10) Büro: live sehen, was draußen läuft – Berichte auf Knopfdruck
  if (t < 38.6) {
    let g = `<rect width="${W}" height="${H}" fill="#e9dcc0"/>${J_({ x: li(-300, 250, rein(t, 34.4, 0.6)), y: 1480, s: 0.85, a1: 30, a2: -80, h2: `<g transform="translate(0,-20)"><rect x="-26" y="-30" width="52" height="60" rx="8" fill="#fff" stroke="#888" stroke-width="4"/><path d="M-10,-44 q6,-12 0,-22 M8,-44 q6,-12 0,-22" stroke="#aaa" stroke-width="4" fill="none"/></g>` })}
      <g transform="translate(${li(1500, 640, rein(t, 34.5, 0.6, federn))},820)"><rect x="-400" y="-300" width="800" height="560" rx="24" fill="#222"/><rect x="-380" y="-280" width="760" height="520" fill="#f4f7f2"/>
        <text x="-360" y="-235" font-size="34" font-weight="900" fill="#14321f">Heute draußen</text>
        ${['Haltungen', 'Meter', 'Fotos'].map((n, i) => `<g transform="translate(${-360 + i * 160},-200)"><rect width="145" height="80" rx="12" fill="#14321f"/><text x="72" y="40" text-anchor="middle" font-size="32" font-weight="900" fill="#fff">${Math.round(kl(t, 35, 37) * [23, 412, 96][i])}</text><text x="72" y="68" text-anchor="middle" font-size="18" fill="#cfe">${n}</text></g>`).join('')}</g>`;
    g += karteVektor(t, 34.9, kl(t, 35, 38.5) * 0.8 + 0.2, li(1500, 590, rein(t, 34.5, 0.6, federn)) - 90, 900, 430, 290, true);
    for (let i = 0; i < 4; i++) { const fu = rein(t, 35.4 + i * 0.35, 0.3); if (fu > 0) g += `<g transform="translate(${li(1300, 900, fu)},${720 + i * 85})"><rect x="-70" y="-36" width="140" height="72" rx="8" fill="#556" stroke="#fff" stroke-width="4"/><circle cx="-30" cy="-6" r="10" fill="#cde"/></g>`; }
    if (t > 36.9) ['Protokoll', 'Foto-Doku', 'Excel'].forEach((n, i) => { const fu = rein(t, 36.9 + i * 0.25, 0.4, federn);
      g += `<g transform="translate(${li(640, 260 + i * 280, fu)},${li(820, 1280, fu)}) scale(${li(0.2, 1, fu)})"><rect x="-120" y="-60" width="240" height="110" rx="18" fill="#fff" stroke="#14321f" stroke-width="5"/><text y="12" text-anchor="middle" font-size="40" font-weight="800" fill="#14321f">${n}</text></g>`; });
    return g + heute + schildRein('Büro: sieht, was draußen läuft', t, 34.4);
  }
  // 11) Auftraggeber schaut selbst nach
  if (t < 42.2) {
    const p = Math.round(kl(t, 39.3, 41.0) * 100);
    return `<rect width="${W}" height="${H}" fill="#cfe0f2"/><rect x="0" y="1200" width="${W}" height="${H - 1200}" fill="#9fb3c8"/>
      ${A_({ x: li(-300, 270, rein(t, 38.6, 0.6)), y: 1480, s: 0.9, a1: 20, a2: -60, beine: laeuft(38.6, 39.2), lesebrille: true })}
      <g transform="translate(${li(1500, 700, rein(t, 38.8, 0.6, federn))},980)">${'<path d="M-260,0 L260,0 L300,40 L-300,40Z" fill="#9a9a9a"/><rect x="-250" y="-320" width="500" height="320" rx="14" fill="#333"/>'}
        <image href="${BILD.projekte}" x="-234" y="-304" width="468" height="288" preserveAspectRatio="xMidYMid slice"/></g>
      <g transform="translate(700,1180)"><rect x="-260" y="-26" width="520" height="52" rx="26" fill="#fff" stroke="#14321f" stroke-width="5"/><rect x="-254" y="-20" width="${508 * p / 100}" height="40" rx="20" fill="#1fa84f"/>
        <text y="80" text-anchor="middle" font-size="44" font-weight="800" fill="#14321f">${p} % gereinigt</text></g>
      ${heute}${schildRein('Lesezugang für den Auftraggeber', t, 38.6)}`;
  }
  // 12) Udo will auch
  if (t < 44.8) {
    const hu = rein(t, 43.4, 0.5, federn);
    return `${strasse('regen')}${wolke(380, 760, 1.2, '#4a5562')}${Array.from({ length: 18 }, (_, i) => `<line x1="${200 + (i * 37) % 360}" y1="${860 + ((i * 97 + F * 40) % 400)}" x2="${190 + (i * 37) % 360}" y2="${900 + ((i * 97 + F * 40) % 400)}" stroke="#bcd" stroke-width="6"/>`).join('')}
      ${U_({ x: 380, y: 1470, a1: 150, a2: -20, h1: '', traurig: t < 43.9, augen: t > 43.9 ? 'gross' : 'normal', schweiss: true })}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<g transform="translate(${560 + (i % 3) * 70},${1420 - Math.floor(i / 3) * 40}) rotate(${i * 13 - 30})">${zettel()}</g>`).join('')}
      <g transform="translate(${li(1300, 250, hu)},${li(700, 1060, hu)}) rotate(${li(40, -10, hu)})">${handy()}</g>`;
  }
  // 13) Endkarte
  const u = rein(t, 44.8, 0.5, federn);
  const liste = ['Offline-Karte mit allen Haltungen', 'Erfassen mit Handschuhen', 'bis zu 6 Fotos je Haltung', 'Funkloch egal, nichts geht verloren', 'Tages-Aufmaß am Feierabend', 'Büro sieht, was draußen läuft', 'Protokoll, Foto-Doku, Excel', 'Lesezugang für den Auftraggeber'];
  return `<defs><radialGradient id="eg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#2c6040"/><stop offset=".6" stop-color="#14321f"/><stop offset="1" stop-color="#050f09"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#eg)"/>
    <g transform="translate(540,420) scale(${li(0.4, 1, u)})"><text text-anchor="middle" font-size="96" font-weight="900" fill="#fff">SpülBlick</text>
      <text y="56" text-anchor="middle" font-size="34" font-weight="700" fill="#f39a3d" letter-spacing="6">VON MMSE SOFTWARE</text></g>
    <text x="540" y="580" text-anchor="middle" font-size="70" font-weight="900" fill="#fff">Schluss mit</text>
    <text x="540" y="660" text-anchor="middle" font-size="70" font-weight="900" fill="#f39a3d">Zetteln abtippen.</text>
    ${liste.map((z, i) => { const lu = rein(t, 45.3 + i * 0.22, 0.3); return `<g transform="translate(${li(-600, 140, lu)},${750 + i * 62})">${haken(0, -13, 0.45)}<text x="42" y="0" font-size="38" font-weight="700" fill="#fff">${z}</text></g>`; }).join('')}
    <text x="540" y="1290" text-anchor="middle" font-size="46" font-weight="800" fill="#fff">14 Tage kostenlos testen</text>
    <g transform="translate(540,${li(1900, 1380, rein(t, 46.5, 0.5, federn))})"><rect x="-230" y="-50" width="460" height="96" rx="48" fill="#f39a3d"/><text y="16" text-anchor="middle" font-size="46" font-weight="800" fill="#14321f">Link in der Bio</text></g>`;
}
window.SZENE = szene;
