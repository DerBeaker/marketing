// Szenen „Früher vs. heute“ für AbscheiderBlick (braucht cartoon-basis.js). Beide Prüfer in oranger Warnschutzkleidung, 24 Bilder/s.
// Praxis (Manuel, 06.11.2026): Dichtheitsprüfung mit Sonde am Stativ im randvoll gefüllten Abscheider, Rundgang übers Gelände für die
// Bemessung (Flächen, Abläufe, Zapfsäulen), mit der App alles direkt an die richtige Stelle, unterbrechen und überall weitermachen.
/* eslint-disable */
const OR = { kleidung: 'orange' };
function tankstelle(art = 'tag') {
  let g = himmel(art);
  g += `<circle cx="880" cy="420" r="80" fill="#ffe06a"/><ellipse cx="300" cy="1010" rx="560" ry="140" fill="#8fc27a"/>`;
  // Shop und Dach (ohne Marke)
  g += `<rect x="620" y="760" width="420" height="290" fill="#d9dde3"/><rect x="660" y="820" width="160" height="150" fill="#9fd2f0" stroke="#555" stroke-width="5"/><rect x="860" y="840" width="120" height="210" fill="#8a7a6a"/>
    <rect x="40" y="610" width="1000" height="70" fill="#f4f4f4" stroke="#bbb" stroke-width="4"/><rect x="40" y="660" width="1000" height="16" fill="#d8281e"/><rect x="40" y="645" width="1000" height="10" fill="#1d5fd0"/>
    <rect x="140" y="680" width="34" height="380" fill="#e6e6e6"/><rect x="520" y="680" width="34" height="380" fill="#e6e6e6"/>`;
  [250, 430].forEach((x) => { g += `<g transform="translate(${x},1050) ${boil(x, 0.5)}"><rect x="-45" y="-210" width="90" height="210" rx="12" fill="#e8e8e8" stroke="#777" stroke-width="4"/><rect x="-30" y="-185" width="60" height="45" fill="#3a5a7a"/>
    <rect x="-30" y="-120" width="60" height="22" fill="#d8281e"/><path d="M45,-110 q40,20 30,80" stroke="#333" stroke-width="9" fill="none"/></g>`; });
  g += `<rect y="1050" width="${W}" height="${H - 1050}" fill="#a9a9a3"/>`;
  for (let i = 0; i < 5; i++) g += `<rect x="${i * 240}" y="1050" width="4" height="${H - 1050}" fill="#93938d"/>`;
  return g;
}
function saugwagen(x, y, saugt = false) {
  const p = saugt ? Math.sin(F * 1.7) * 6 : 0;
  return `<g transform="translate(${x},${y})"><rect x="-300" y="-250" width="430" height="200" rx="90" fill="#f07a1a" stroke="#b5520c" stroke-width="6"/>
    <rect x="-260" y="-205" width="110" height="20" fill="#fff" opacity=".7"/><circle cx="-300" cy="-150" r="60" fill="#d8650f"/>
    <rect x="140" y="-260" width="170" height="210" rx="18" fill="#f07a1a" stroke="#b5520c" stroke-width="6"/><rect x="200" y="-235" width="90" height="80" rx="8" fill="#9fd2f0"/>
    <rect x="-320" y="-60" width="640" height="26" fill="#555"/>
    ${[-230, -90, 230].map((wx) => `<g transform="translate(${wx},-30)"><circle r="46" fill="#222"/><circle r="18" fill="#999"/><rect x="-4" y="-42" width="8" height="24" fill="#666" transform="rotate(${x * 0.9})"/></g>`).join('')}
    <path d="M-330,-150 C-430,-160 -470,${-40 + p} -520,60" stroke="#333" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="M-330,-150 C-430,-160 -470,${-40 + p} -520,60" stroke="#555" stroke-width="30" stroke-dasharray="6 18" fill="none"/></g>`;
}
const laptop = (screen) => `<g><path d="M-170,0 L170,0 L200,30 L-200,30Z" fill="#9a9a9a"/><rect x="-160" y="-210" width="320" height="210" rx="10" fill="#5a5a5a"/>
  <rect x="-145" y="-196" width="290" height="182" fill="#e8f0e8"/>${screen}</g>`;
function excel(t, leer, schwach = 99) {
  if (leer) return `<rect x="-145" y="-196" width="290" height="182" fill="#000"/><text y="-90" text-anchor="middle" font-size="26" fill="#f33">Akku leer</text>`;
  let g = `<rect x="-145" y="-196" width="290" height="26" fill="#1e7a3e"/>`;
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) g += `<rect x="${-145 + c * 58}" y="${-170 + r * 22}" width="58" height="22" fill="none" stroke="#9bb" stroke-width="1.5"/>`;
  g += `<g transform="translate(60,-90) rotate(${(t * 180) % 360})"><path d="M-18,-24 L18,-24 L0,0 L18,24 L-18,24 L0,0Z" fill="#c9a040" stroke="#333" stroke-width="3"/></g>`;
  g += `<g transform="translate(110,-182)"><rect x="-14" y="-8" width="28" height="16" fill="none" stroke="#fff" stroke-width="3"/><rect x="-12" y="-6" width="${t > schwach ? 4 : 14}" height="12" fill="${t > schwach && F % 2 ? '#f33' : '#4c4'}"/></g>`;
  return g;
}
const pc = (img) => `<g><rect x="-230" y="-300" width="460" height="300" rx="14" fill="#222"/><image href="${img}" x="-214" y="-286" width="428" height="268" preserveAspectRatio="xMidYMid slice"/>
  <rect x="-30" y="0" width="60" height="70" fill="#444"/><rect x="-110" y="70" width="220" height="20" rx="8" fill="#444"/></g>`;
const tablet = (img, w = 420) => { const h = w * 0.64; return `<g><rect x="${-w / 2 - 14}" y="${-h / 2 - 14}" width="${w + 28}" height="${h + 28}" rx="24" fill="#141a26"/>
  <image href="${img}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></g>`; };
const sync = (x1, y1, x2, y2, t) => { const u = (t * 0.9) % 1; return `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - 160} ${x2},${y2}" stroke="#fff" stroke-width="7" stroke-dasharray="14 14" fill="none" opacity=".85"/>
  <circle cx="${li(x1, x2, u)}" cy="${li(y1, y2, u) - Math.sin(u * Math.PI) * 120}" r="16" fill="#ffd54a" stroke="#0a3f9c" stroke-width="4"/>`; };


const schildRein = (text, t, a, y = 452, farbe = '#fff', schrift = '#0b2f66', gr = 40) => {
  const u = rein(t, a, 0.45, federn); return `<g transform="translate(${li(-700, 0, u)},0)">${schild(text, 540, y, farbe, schrift, gr, 1)}</g>`;
};
const fahrtX = (t, a, d, von, nach) => li(von, nach, raus(kl(t, a, a + d)));
const nachwippen = (t, a) => (t > a && t < a + 0.6 ? Math.sin((t - a) * 18) * 10 * (1 - (t - a) / 0.6) : 0);
// randvoll gefüllter Abscheider (Einstieg von oben), Stativ mit Sonde am Kabel
function abscheiderVoll(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse rx="150" ry="52" fill="#666" stroke="#3a3a3a" stroke-width="8"/><ellipse rx="124" ry="40" fill="#3f86b8"/>
    <ellipse rx="${100 + Math.sin(F) * 6}" ry="${30 + Math.sin(F) * 2}" fill="none" stroke="#9fd2f0" stroke-width="4" opacity=".8"/><ellipse rx="60" ry="17" fill="none" stroke="#9fd2f0" stroke-width="3" opacity=".6"/></g>`;
}
function stativ(x, y, t, a, sondeTiefe) { // klappt auf, Sonde senkt sich ins Wasser
  const u = rein(t, a, 0.6, federn), spreiz = li(0.1, 1, u), kopfY = y - 330;
  const beine = [-170, 0, 170].map((dx) => `<line x1="${x}" y1="${kopfY}" x2="${x + dx * spreiz}" y2="${y + (dx === 0 ? -30 : 20)}" stroke="#c0392b" stroke-width="14" stroke-linecap="round"/>`).join('');
  const sy = li(kopfY + 40, y - 10 + sondeTiefe, rein(t, a + 0.7, 0.9, weich));
  return `<g opacity="${u.toFixed(2)}">${beine}<rect x="${x - 30}" y="${kopfY - 24}" width="60" height="36" rx="8" fill="#ddd" stroke="#555" stroke-width="4"/>
    <line x1="${x}" y1="${kopfY}" x2="${x}" y2="${sy}" stroke="#222" stroke-width="4"/><rect x="${x - 12}" y="${sy}" width="24" height="70" rx="8" fill="#e8e8e8" stroke="#333" stroke-width="4"/>
    <path d="M${x + 30},${kopfY} q120,-20 160,140" stroke="#2e86c1" stroke-width="7" fill="none"/></g>`;
}
// Gelände zum Ablaufen (Bemessung): Dach, Hof mit Abläufen, Zapfsäulen, Waschplatz – läuft von rechts nach links durch
function gelaende(shift) {
  return himmel('tag') + `<circle cx="880" cy="420" r="80" fill="#ffe06a"/>${boden()}<g transform="translate(${-shift},0)">
    <rect x="80" y="700" width="520" height="350" fill="#d9dde3"/><path d="M60,700 L340,560 L620,700Z" fill="#a0523a"/><rect x="200" y="820" width="140" height="120" fill="#9fd2f0" stroke="#555" stroke-width="5"/>
    <rect x="820" y="610" width="520" height="60" fill="#f4f4f4" stroke="#bbb" stroke-width="4"/><rect x="820" y="650" width="520" height="14" fill="#d8281e"/><rect x="900" y="670" width="26" height="380" fill="#e6e6e6"/><rect x="1240" y="670" width="26" height="380" fill="#e6e6e6"/>
    ${[0, 1].map((i) => `<g transform="translate(${1000 + i * 170},1050)"><rect x="-45" y="-210" width="90" height="210" rx="12" fill="#e8e8e8" stroke="#777" stroke-width="4"/><rect x="-30" y="-185" width="60" height="45" fill="#3a5a7a"/></g>`).join('')}
    <rect x="1500" y="760" width="460" height="290" fill="#cfe3f2" stroke="#8aa" stroke-width="5"/><text x="1730" y="840" text-anchor="middle" font-size="44" font-weight="800" fill="#2e6da4">WASCHPLATZ</text>
    ${[260, 700, 1180, 1660, 2060].map((ax) => `<g transform="translate(${ax},1230)"><rect x="-44" y="-20" width="88" height="40" fill="#555"/>${[0, 1, 2, 3].map((k) => `<rect x="${-36 + k * 20}" y="-14" width="10" height="28" fill="#222"/>`).join('')}</g>`).join('')}</g>`;
}
function boden() { return `<rect y="1050" width="${W}" height="${H - 1050}" fill="#a9a9a3"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 240}" y="1050" width="4" height="${H - 1050}" fill="#93938d"/>`).join('')}`; }
const sprechblase = (x, y, inhalt, u) => `<g transform="translate(${x},${y}) scale(${u.toFixed(2)})"><path d="M-170,-80 H170 Q200,-80 200,-50 V40 Q200,70 170,70 H20 L-30,120 L-20,70 H-170 Q-200,70 -200,40 V-50 Q-200,-80 -170,-80Z" fill="#fff" stroke="#222" stroke-width="5"/>${inhalt}</g>`;

function szene(t) {
  const G_ = (o) => figur({ typ: 'horst', ...OR, mund: spricht('gerd', t) && F % 2 === 0, ...o });
  const K_ = (o) => figur({ typ: 'kai', ...OR, mund: spricht('kai', t) && F % 2 === 0, ...o });
  const BILD = window.BILD;
  const laeuft = (t0, t1) => (t > t0 && t < t1 ? (F % 2 ? 1 : -1) : 0);
  const frueher = schild('FRÜHER …', 540, 330, '#f4e7c4'), heute = schild('HEUTE.', 540, 330, '#ffd54a', '#0b2f66');
  const stapel = `<g transform="translate(-20,30)">${[0, 1, 2, 3, 4].map((i) => `<rect x="-80" y="${i * 34}" width="160" height="32" fill="${['#c0392b', '#2e86c1', '#27ae60', '#f1c40f', '#8e44ad'][i]}" stroke="#333" stroke-width="3"/>`).join('')}</g>`;
  // 1) Früher: Saugwagen fährt vor, Gerd läuft mit Ordnern rein
  if (t < 4.5) {
    const sx = fahrtX(t, 0, 2.4, 1500, 860), gx = li(-250, 330, weich(kl(t, 1.6, 3.6)));
    return `<g filter="url(#alt)">${tankstelle()}${abscheiderVoll(560, 1430, 0.9)}${saugwagen(sx, 1390 + nachwippen(t, 2.4))}
      ${G_({ x: gx, y: 1520, s: 0.9, a1: -20, a2: 20, h2: stapel, beine: laeuft(1.6, 3.6), lesebrille: true })}</g>${frueher}`;
  }
  // 2) Dichtheitsprüfung: Stativ, Sonde, ablesen, aufschreiben – und sich die Zahlen merken
  if (t < 10.5) {
    let g = `<g filter="url(#alt)">${tankstelle()}${saugwagen(860, 1390)}${abscheiderVoll(560, 1430, 0.9)}${stativ(560, 1420, t, 4.6, 30)}
      <g transform="translate(${li(-200, 150, rein(t, 4.8, 0.5))},1420)"><rect x="-60" y="-50" width="120" height="100" rx="10" fill="#555"/><rect x="-44" y="-34" width="88" height="40" fill="#bcd8a0"/><text y="-6" text-anchor="middle" font-size="26" font-family="monospace" fill="#222">${t > 6.5 ? '2.431' : '- - -'}</text></g>
      ${G_({ x: 330, y: 1520, s: 0.85, a1: 25, a2: -40, h1: klemmbrett(), lesebrille: true, schweiss: t > 7.5, blick: -0.6 })}`;
    if (t > 7.4) g += sprechblase(560, 760, `<text y="-20" text-anchor="middle" font-size="46" font-weight="800" fill="#1d3fa0">2,431?</text><text y="34" text-anchor="middle" font-size="46" font-weight="800" fill="#c0392b">3,421??</text>`, rein(t, 7.4, 0.4, federn));
    return g + '</g>' + frueher;
  }
  // 3) Rundgang: Flächen, Abläufe, Zapfsäulen – alles im Kopf
  if (t < 16) {
    const sh = li(0, 1100, kl(t, 10.5, 15.6));
    let g = `<g filter="url(#alt)">${gelaende(sh)}`;
    g += G_({ x: 420, y: 1520, s: 0.85, a1: 30, a2: -60, h1: klemmbrett(), h2: `<g transform="rotate(-150)">${zollstock(3, 20)}</g>`, beine: F % 2 ? 1 : -1, lesebrille: true, schweiss: true });
    const fragen = [['Dach? m²', 10.9], ['Hoffläche?', 12.0], ['Abläufe?', 13.0], ['Zapfsäulen?', 13.9], ['Waschplatz?', 14.8]];
    fragen.forEach(([f, a], i) => { const u = rein(t, a, 0.35, federn), weg = kl(t, a + 1.2, a + 1.6);
      if (u > 0 && weg < 1) g += `<g transform="translate(${300 + (i % 3) * 230},${760 + (i % 2) * 120 - weg * 120}) scale(${u.toFixed(2)})" opacity="${(1 - weg).toFixed(2)}"><rect x="-110" y="-44" width="220" height="80" rx="40" fill="#fff" stroke="#222" stroke-width="4"/>
        <text y="12" text-anchor="middle" font-size="34" font-weight="800" fill="#c0392b">${f}</text></g>`; });
    return g + '</g>' + frueher;
  }
  // 4) Abends: alles in die Tabelle, Akku leer
  if (t < 20) {
    const leer = t > 18.6;
    return `<g filter="url(#alt)"><rect width="${W}" height="${H}" fill="#d8c49a"/><rect x="100" y="520" width="360" height="300" fill="#1d2a4a" stroke="#6b5130" stroke-width="16"/><circle cx="380" cy="600" r="40" fill="#f6e9a8"/>
      ${G_({ x: li(-300, 300, rein(t, 16, 0.6)), y: 1290, s: 0.95, a1: 40 + (F % 2) * 20, a2: -40 - ((F + 1) % 2) * 20, schweiss: true, lesebrille: true, traurig: leer })}
      <rect x="40" y="1150" width="1000" height="60" fill="#8a5a32"/><rect x="80" y="1210" width="40" height="400" fill="#6d4526"/><rect x="960" y="1210" width="40" height="400" fill="#6d4526"/>
      <g transform="translate(${li(1400, 720, rein(t, 16.2, 0.5, federn))},1150) scale(.95)">${laptop(excel(t, leer, 18.0))}</g>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<g transform="translate(${li(-200, 180 + i * 60, rein(t, 16.4 + i * 0.12, 0.4))},${1120 - i * 16}) rotate(${i * 9 - 20})">${zettel()}</g>`).join('')}</g>
      ${schild('Abends, 23 Uhr', 540, 330, '#f4e7c4')}`;
  }
  // 5) HEUTE
  if (t < 21) {
    const u = rein(t, 20, 0.4, federn);
    return `<rect width="${W}" height="${H}" fill="#ffd54a"/>${wolke(li(-300, 220, u), 520, 1.2)}${wolke(li(1400, 860, u), 1360, 1)}
      <g transform="translate(540,900) scale(${li(0.2, 1, u)}) rotate(${li(-30, -4, u)})"><text text-anchor="middle" font-size="190" font-weight="900" fill="#0b2f66">HEUTE.</text>
      <text y="120" text-anchor="middle" font-size="70" font-weight="800" fill="#222">mit AbscheiderBlick</text></g>`;
  }
  // 6) Dichtheitsprüfung mit der App: Pegel direkt eintragen, Wasserbilanz rechnet
  if (t < 26.5) {
    const kx = li(-250, 300, weich(kl(t, 21.0, 22.2)));
    let g = `${tankstelle()}${saugwagen(fahrtX(t, 21.0, 1.6, 1500, 860), 1390 + nachwippen(t, 22.6))}${abscheiderVoll(560, 1430, 0.9)}${stativ(560, 1420, t, 21.3, 30)}
      ${K_({ x: kx, y: 1530, s: 0.85, a2: -100, h2: handy(), beine: laeuft(21.0, 22.2), blick: 1 })}
      <g transform="translate(${li(1400, 0, rein(t, 22.6, 0.5, federn))},0)">${handyGross(BILD.dicht, 780, 840, 300, 4)}</g>`;
    if (t > 23.6) { const u = rein(t, 23.6, 0.8, weich); // Zahl wandert von der Sonde direkt ins Handy
      g += `<g transform="translate(${li(600, 760, u)},${li(1320, 980, u)}) scale(${li(0.6, 1.1, u)})"><rect x="-90" y="-36" width="180" height="64" rx="16" fill="#0b2f66"/><text y="12" text-anchor="middle" font-size="40" font-weight="900" fill="#fff">2,431 m</text></g>`; }
    if (t > 24.8) g += `<g transform="translate(780,1230) scale(${rein(t, 24.8, 0.4, federn).toFixed(2)})">${haken(-170, 0, 1)}<text x="-110" y="16" font-size="50" font-weight="800" fill="#fff" stroke="#111" stroke-width="8" paint-order="stroke">dicht</text></g>`;
    return g + heute + schildRein('Dichtheitsprüfung: Wasserbilanz rechnet die App', t, 21.4, 452, '#fff', '#0b2f66', 36);
  }
  // 7) Rundgang mit der App: messen, Laser, Wert landet direkt in der Bemessung
  if (t < 33) {
    const sh = li(0, 1100, kl(t, 26.5, 32.6));
    let g = `${gelaende(sh)}`;
    g += K_({ x: 300, y: 1530, s: 0.85, a2: -100, h2: handy(), a1: 60, h1: laser(), beine: F % 2 ? 1 : -1, blick: 1 });
    g += `<g transform="translate(${li(1400, 0, rein(t, 26.6, 0.5, federn))},0)">${handyGross(BILD.bemessung, 790, 860, 280, 4)}</g>`;
    const werte = [['Dachfläche', '420 m²', 27.2], ['Hoffläche', '1.250 m²', 28.4], ['Abläufe', '5', 29.6], ['Zapfsäulen', '4', 30.6], ['Waschplatz', '1', 31.6]];
    werte.forEach(([n, w, a], i) => { const u = rein(t, a, 0.9, weich); if (u <= 0) return;
      const x = li(300, 790, u), y = li(1000, 760 + i * 90, u);
      g += `<g transform="translate(${x},${y}) scale(${li(1, 0.62, u)})"><rect x="-170" y="-40" width="340" height="76" rx="20" fill="#ffd54a" stroke="#0b2f66" stroke-width="5"/><text y="12" text-anchor="middle" font-size="34" font-weight="800" fill="#0b2f66">${n}: ${w}</text></g>`;
      if (i === 0 && t > a && t < a + 0.7) g += `<line x1="420" y1="1200" x2="560" y2="760" stroke="#ff2a2a" stroke-width="7"/>`; });
    return g + heute + schildRein('Alles direkt dahin, wo es hingehört', t, 26.6);
  }
  // 8) Bemessung und Mängel
  if (t < 37) {
    let g = `${tankstelle()}${saugwagen(860, 1390)}${abscheiderVoll(560, 1430, 0.9)}${K_({ x: 280, y: 1530, s: 0.85, a2: -100, h2: handy(), blick: 1 })}
      <g transform="translate(${li(1400, 0, rein(t, 33.0, 0.5, federn))},0)">${handyGross(t < 35 ? BILD.bemessung : BILD.zustand, 780, 840, 300, 4)}</g>`;
    if (t > 33.8 && t < 35) g += `<g transform="translate(770,1230) scale(${rein(t, 33.8, 0.4, federn).toFixed(2)})">${haken(-160, 0, 1)}<text x="-100" y="18" font-size="54" font-weight="800" fill="#fff" stroke="#111" stroke-width="8" paint-order="stroke">NS 10 passt</text></g>`;
    if (t > 35.3) g += `<g transform="translate(770,1240) scale(${rein(t, 35.3, 0.4, federn).toFixed(2)})"><rect x="-210" y="-48" width="420" height="96" rx="48" fill="#d8281e"/><text y="16" text-anchor="middle" font-size="42" font-weight="800" fill="#fff">erheblich · Frist 3 Mon.</text></g>`;
    return g + heute + schildRein(t < 35 ? 'Bemessung mit Rechenweg' : 'Mängel nach BFR mit Frist', t, t < 35 ? 33.0 : 35.0);
  }
  // 9) Unterbrechen – später auf der Couch weiter und abschließen
  if (t < 42.5) {
    if (t < 38.8) {
      const u = rein(t, 37.4, 0.6, weich);
      return `${tankstelle('abend')}${saugwagen(fahrtX(t, 38.0, 0.8, 860, 1600), 1390)}${abscheiderVoll(560, 1430, 0.9)}
        ${K_({ x: li(300, -300, weich(kl(t, 38.0, 38.8))), y: 1530, s: 0.85, a2: -40, beine: laeuft(38.0, 38.8) })}
        <g transform="translate(540,${li(1900, 1000, u)})"><rect x="-300" y="-60" width="600" height="110" rx="26" fill="#1fa84f"/><text y="16" text-anchor="middle" font-size="44" font-weight="800" fill="#fff">Zwischenstand gespeichert</text></g>
        ${heute}${schildRein('Unterbrechen? Kein Problem.', t, 37.2)}`;
    }
    const schritte = Math.min(11, 8 + Math.floor(kl(t, 39.6, 41.0) * 4)), fertig = t > 41.3;
    let g = `<rect width="${W}" height="${H}" fill="#f6d7b8"/><rect x="0" y="520" width="${W}" height="20" fill="#e8c09a"/>
      <rect x="60" y="1190" width="700" height="170" rx="50" fill="#8a4b2a"/><rect x="60" y="1080" width="700" height="140" rx="50" fill="#a35a33"/>
      <g transform="translate(${li(-300, 380, rein(t, 38.8, 0.6))},1360) scale(.8)">${figur({ typ: 'kai', x: 0, y: 0, mund: spricht('kai', t) && F % 2 === 0, a1: 60, a2: -70, brille: true, helm: false })}</g>
      <g transform="translate(${li(1400, 800, rein(t, 39.0, 0.6, federn))},900) rotate(-4)">${tablet(BILD.pc, 460)}</g>
      <g transform="translate(800,1130)"><rect x="-230" y="-24" width="460" height="48" rx="24" fill="#fff" stroke="#0b2f66" stroke-width="5"/><rect x="-224" y="-18" width="${448 * schritte / 11}" height="36" rx="18" fill="#1fa84f"/>
        <text y="70" text-anchor="middle" font-size="40" font-weight="800" fill="#0b2f66">Schritt ${schritte} von 11</text></g>`;
    if (fertig) { const fu = rein(t, 41.3, 0.6, federn);
      g += `<g transform="translate(${li(800, 560, fu)},${li(900, 820, fu)}) rotate(${li(-20, 3, fu)}) scale(${li(0.2, 0.85, fu)})"><rect x="-230" y="-325" width="460" height="650" fill="#fff" stroke="#222" stroke-width="4"/>
        <image href="${BILD.bericht}" x="-220" y="-315" width="440" height="630" preserveAspectRatio="xMidYMin slice"/></g>
        <g transform="translate(600,1060) rotate(-14) scale(${li(1.8, 1, kl(t, 41.8, 42.0))})" opacity="${kl(t, 41.8, 41.9).toFixed(2)}"><rect x="-170" y="-55" width="340" height="110" rx="10" fill="none" stroke="#1fa84f" stroke-width="12"/><text y="26" text-anchor="middle" font-size="80" font-weight="900" fill="#1fa84f">FERTIG</text></g>`; }
    return g + heute + schildRein('Überall weitermachen und abschließen', t, 38.8);
  }
  // 10) Büro hat den Bericht auch (Abgleich, Pro)
  if (t < 45) {
    return `<rect width="${W}" height="${H}" fill="#e9dcc0"/><g transform="translate(${li(1500, 560, rein(t, 42.5, 0.6, federn))},1000) scale(1.3)">${pc(BILD.pc)}</g>
      ${figur({ typ: 'jule', x: li(-300, 200, rein(t, 42.6, 0.6)), y: 1520, s: 0.8, helm: false, a1: 150, a2: -20, mund: 0 })}
      ${sync(150, 700, 640, 760, t)}<g transform="translate(150,700)">${handy()}</g>
      ${heute}${schildRein('Abgleich im Team (Pro)', t, 42.5, 452, '#ffd54a')}`;
  }
  // 11) Gerd sucht noch
  if (t < 48) {
    let g = `<g filter="url(#alt)"><rect width="${W}" height="${H}" fill="#d8c49a"/>${G_({ x: 540, y: 1500, lesebrille: true, traurig: true, augen: 'gross' })}`;
    for (let i = 0; i < 40; i++) { const u = rein(t, 45 + (i % 10) * 0.08, 0.4); g += `<g transform="translate(${180 + (i * 97) % 720},${li(-200, 1530 - Math.floor(i / 8) * 70 + zuf(i) * 6, u)}) rotate(${(i * 37) % 40 - 20})">${zettel()}</g>`; }
    return g + `</g>${frueher}`;
  }
  // 12) Endkarte
  const u = rein(t, 48, 0.5, federn);
  const liste = ['Fett- und Leichtflüssigkeitsabscheider', 'Dichtheitsprüfung mit Wasserbilanz', 'Anlagendaten direkt in die Bemessung', 'Messwerte per Bluetooth-Laser', 'Mängel nach BFR mit Frist', 'PDF-Prüfbericht mit Fotos', 'Unterbrechen, überall weitermachen', 'Team-Abgleich (Pro)'];
  return `<defs><radialGradient id="eg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#1565d8"/><stop offset=".6" stop-color="#0b2f66"/><stop offset="1" stop-color="#030d1d"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#eg)"/>
    <g transform="translate(540,420) scale(${li(0.4, 1, u)})"><text text-anchor="middle" font-size="84" font-weight="900" fill="#fff">AbscheiderBlick</text>
      <text y="56" text-anchor="middle" font-size="34" font-weight="700" fill="#ffd54a" letter-spacing="6">VON MMSE SOFTWARE</text></g>
    <text x="540" y="580" text-anchor="middle" font-size="68" font-weight="900" fill="#fff">Generalinspektion.</text>
    <text x="540" y="660" text-anchor="middle" font-size="68" font-weight="900" fill="#ffd54a">Ohne Zettelkram.</text>
    ${liste.map((z, i) => { const lu = rein(t, 48.5 + i * 0.22, 0.3); return `<g transform="translate(${li(-700, 130, lu)},${750 + i * 62})">${haken(0, -13, 0.45)}<text x="42" y="0" font-size="37" font-weight="700" fill="#fff">${z}</text></g>`; }).join('')}
    <text x="540" y="1290" text-anchor="middle" font-size="44" fill="#fff" opacity=".92">für Einzelanwender kostenlos</text>
    <g transform="translate(540,${li(1900, 1380, rein(t, 49.8, 0.5, federn))})"><rect x="-230" y="-50" width="460" height="96" rx="48" fill="#ffd54a"/><text y="16" text-anchor="middle" font-size="46" font-weight="800" fill="#0b2f66">Link in der Bio</text></g>`;
}
window.SZENE = szene;
