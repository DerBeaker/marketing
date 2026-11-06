// Szenen „Früher vs. heute“ für AbscheiderBlick (braucht cartoon-basis.js). Beide Prüfer in oranger Warnschutzkleidung.
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
    ${[-230, -90, 230].map((wx) => `<g transform="translate(${wx},-30)"><circle r="46" fill="#222"/><circle r="18" fill="#999"/></g>`).join('')}
    <path d="M-330,-150 C-430,-160 -470,${-40 + p} -520,60" stroke="#333" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="M-330,-150 C-430,-160 -470,${-40 + p} -520,60" stroke="#555" stroke-width="30" stroke-dasharray="6 18" fill="none"/></g>`;
}
const laptop = (screen) => `<g><path d="M-170,0 L170,0 L200,30 L-200,30Z" fill="#9a9a9a"/><rect x="-160" y="-210" width="320" height="210" rx="10" fill="#5a5a5a"/>
  <rect x="-145" y="-196" width="290" height="182" fill="#e8f0e8"/>${screen}</g>`;
function excel(t, leer) {
  if (leer) return `<rect x="-145" y="-196" width="290" height="182" fill="#000"/><text y="-90" text-anchor="middle" font-size="26" fill="#f33">Akku leer</text>`;
  let g = `<rect x="-145" y="-196" width="290" height="26" fill="#1e7a3e"/>`;
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) g += `<rect x="${-145 + c * 58}" y="${-170 + r * 22}" width="58" height="22" fill="none" stroke="#9bb" stroke-width="1.5"/>`;
  g += `<g transform="translate(60,-90) rotate(${(t * 180) % 360})"><path d="M-18,-24 L18,-24 L0,0 L18,24 L-18,24 L0,0Z" fill="#c9a040" stroke="#333" stroke-width="3"/></g>`;
  g += `<g transform="translate(110,-182)"><rect x="-14" y="-8" width="28" height="16" fill="none" stroke="#fff" stroke-width="3"/><rect x="-12" y="-6" width="${t > 8.3 ? 4 : 14}" height="12" fill="${t > 8.3 && F % 2 ? '#f33' : '#4c4'}"/></g>`;
  return g;
}
const pc = (img) => `<g><rect x="-230" y="-300" width="460" height="300" rx="14" fill="#222"/><image href="${img}" x="-214" y="-286" width="428" height="268" preserveAspectRatio="xMidYMid slice"/>
  <rect x="-30" y="0" width="60" height="70" fill="#444"/><rect x="-110" y="70" width="220" height="20" rx="8" fill="#444"/></g>`;
const tablet = (img, w = 420) => { const h = w * 0.64; return `<g><rect x="${-w / 2 - 14}" y="${-h / 2 - 14}" width="${w + 28}" height="${h + 28}" rx="24" fill="#141a26"/>
  <image href="${img}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></g>`; };
const sync = (x1, y1, x2, y2, t) => { const u = (t * 0.9) % 1; return `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - 160} ${x2},${y2}" stroke="#fff" stroke-width="7" stroke-dasharray="14 14" fill="none" opacity=".85"/>
  <circle cx="${li(x1, x2, u)}" cy="${li(y1, y2, u) - Math.sin(u * Math.PI) * 120}" r="16" fill="#ffd54a" stroke="#0a3f9c" stroke-width="4"/>`; };

function szene(t) {
  const G_ = (o) => figur({ typ: 'horst', ...OR, mund: spricht('gerd', t) && F % 2 === 0, ...o });
  const K_ = (o) => figur({ typ: 'kai', ...OR, mund: spricht('kai', t) && F % 2 === 0, ...o });
  const BILD = window.BILD;
  // 1) Früher: Prüfer schleppt Notebook und Ordner zur Tankstelle, der Saugwagen steht schon da
  if (t < 4.5) {
    const gx = li(-200, 330, kl(t, 0, 2.4));
    const stapel = `<g transform="translate(-20,30)">${[0, 1, 2, 3, 4].map((i) => `<rect x="-80" y="${i * 34}" width="160" height="32" fill="${['#c0392b', '#2e86c1', '#27ae60', '#f1c40f', '#8e44ad'][i]}" stroke="#333" stroke-width="3"/>`).join('')}</g>`;
    return `<g filter="url(#alt)">${tankstelle()}${saugwagen(820, 1390)}${schacht(560, 1420, false, 0, 0.9)}
      ${G_({ x: gx, y: 1520, s: 0.9, a1: -60, a2: 60, h1: '', h2: stapel, beine: t < 2.4 ? (F % 2 ? 1 : -1) : 0, schweiss: true, lesebrille: true })}</g>${schild('FRÜHER …', 540, 330, '#f4e7c4')}`;
  }
  // 2) Am Abscheider mit Notebook und Tabellen, Akku leer
  if (t < 11) {
    const leer = t > 9.2;
    return `<g filter="url(#alt)">${tankstelle()}${saugwagen(860, 1390, true)}${schacht(560, 1420, true, 170, 0.9)}
      <rect x="160" y="1400" width="150" height="110" rx="10" fill="#4a6fa5"/>
      ${G_({ x: 240, y: 1440, s: 0.85, a1: 30, a2: -30, lesebrille: true, schweiss: t > 6, augen: leer ? 'gross' : 'normal', traurig: leer })}
      <g transform="translate(330,1445) scale(.85) ${boil(4, 0.5)}">${laptop(excel(t, leer))}</g>
      ${t > 6.2 && t < 9.2 ? [0, 1, 2].map((i) => `<text x="${520 + i * 120}" y="${1000 - ((t * 60 + i * 40) % 160)}" font-size="70" font-weight="900" fill="#c0392b" stroke="#fff" stroke-width="6" paint-order="stroke">?</text>`).join('') : ''}</g>
      ${schild('FRÜHER …', 540, 330, '#f4e7c4')}`;
  }
  // 3) Abends von Hand rechnen
  if (t < 14.6) {
    const zettelText = ['NS = ???', 'Schlammfang?', 'Frist??', 'Qs = …'];
    return `<g filter="url(#alt)"><rect width="${W}" height="${H}" fill="#d8c49a"/><rect x="100" y="520" width="360" height="300" fill="#1d2a4a" stroke="#6b5130" stroke-width="16"/><circle cx="380" cy="600" r="40" fill="#f6e9a8"/>
      ${G_({ x: 420, y: 1290, s: 0.95, a1: 40 + (F % 2) * 25, a2: -30, schweiss: true, lesebrille: true, traurig: true })}
      <rect x="40" y="1150" width="1000" height="60" fill="#8a5a32"/><rect x="80" y="1210" width="40" height="400" fill="#6d4526"/><rect x="960" y="1210" width="40" height="400" fill="#6d4526"/>
      <g transform="translate(640,1110) rotate(-8)"><rect x="-60" y="-80" width="120" height="160" rx="12" fill="#333"/><rect x="-46" y="-66" width="92" height="36" fill="#bcd8a0"/>
      ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${-44 + c * 32}" y="${-20 + r * 30}" width="24" height="22" rx="4" fill="#888"/>`).join('')).join('')}</g>
      ${zettelText.map((z, i) => `<g transform="translate(${[170, 780, 930, 830][i]},${[1070, 780, 960, 1100][i]}) rotate(${-8 + i * 6 + zuf(i) * 3})"><rect x="-95" y="-50" width="190" height="90" fill="#fff" stroke="#bbb" stroke-width="3"/>
        <text y="12" text-anchor="middle" font-size="34" font-weight="700" fill="#c0392b">${z}</text></g>`).join('')}</g>${schild('Abends, 23 Uhr', 540, 330, '#f4e7c4')}`;
  }
  // 4) HEUTE
  if (t < 15.6) {
    const u = kl(t, 14.6, 15.0);
    return `<rect width="${W}" height="${H}" fill="#ffd54a"/>${wolke(220, 520, 1.2)}${wolke(860, 1360, 1)}
      <g transform="translate(540,900) scale(${li(0.2, 1, u)}) rotate(${li(-30, -4, u)})"><text text-anchor="middle" font-size="190" font-weight="900" fill="#0b2f66">HEUTE.</text>
      <text y="120" text-anchor="middle" font-size="70" font-weight="800" fill="#222">mit AbscheiderBlick</text></g>`;
  }
  // 5) Funktionen, eine nach der anderen
  const funk = [
    [18.4, 'Prüf-Assistent nach BFR-Muster', 'handy', BILD.ordnung],
    [21.2, 'Mängel: Klasse und Frist automatisch', 'handy', BILD.zustand],
    [24.0, 'Bemessung mit Rechenweg', 'handy', BILD.bemessung],
    [27.0, '3D-Aufnahme · Dichtheitsprüfung', 'tablet', BILD.dreid],
    [29.6, 'PDF-Prüfbericht auf Knopfdruck', 'bericht', BILD.bericht],
  ];
  if (t < 29.6) {
    const i = funk.findIndex(([e]) => t < e), [ende, titel, art, img] = funk[i], beginn = i ? funk[i - 1][0] : 15.6;
    const u = kl(t, beginn, beginn + 0.35);
    let g = `${tankstelle()}${saugwagen(880, 1390, true)}${schacht(560, 1420, true, 170, 0.9)}`;
    g += K_({ x: 250, y: 1530, s: 0.9, a1: 12, a2: art === 'tablet' ? -70 : -100, h2: art === 'tablet' ? laser() : handy(), blick: 1 });
    if (art === 'handy') g += handyGross(img, 770, 860, 300, 4).replace('<g transform', `<g opacity="${u.toFixed(2)}" transform`);
    if (art === 'tablet') {
      const lu = kl(t, 24.3, 24.7);
      g += `<line x1="420" y1="1330" x2="${li(420, 560, lu)}" y2="${li(1330, 1430, lu)}" stroke="#ff2a2a" stroke-width="8"/>`;
      g += `<g transform="translate(560,820) rotate(-3) scale(${li(0.3, 1, u)})">${tablet(img, 860)}</g>`;
      if (t > 24.8) g += `<g transform="translate(780,1180) scale(${li(0.3, 1, kl(t, 24.8, 25.1))})"><rect x="-140" y="-60" width="280" height="110" rx="20" fill="#fff" stroke="#222" stroke-width="5"/><text y="16" text-anchor="middle" font-size="66" font-weight="900" fill="#d8281e">1,85 m</text></g>`;
    }
    if (art === 'bericht') {
      const fu = kl(t, 27.2, 27.8);
      g += `<g transform="translate(${li(330, 720, fu)},${li(1300, 860, fu)}) rotate(${li(-40, 4, fu)}) scale(${li(0.2, 1, fu)})"><rect x="-230" y="-325" width="460" height="650" fill="#fff" stroke="#222" stroke-width="4"/>
        <image href="${img}" x="-220" y="-315" width="440" height="630" preserveAspectRatio="xMidYMin slice"/></g>`;
      if (t > 28.0) g += `<g transform="translate(760,1150) rotate(-14) scale(${li(1.8, 1, kl(t, 28.0, 28.2))})"><rect x="-170" y="-55" width="340" height="110" rx="10" fill="none" stroke="#1fa84f" stroke-width="12"/><text y="26" text-anchor="middle" font-size="80" font-weight="900" fill="#1fa84f">FERTIG</text></g>`;
    }
    if (titel.startsWith('Mängel') && t > 19.3) g += `<g transform="translate(770,1240) scale(${li(0.3, 1, kl(t, 19.3, 19.6))})"><rect x="-210" y="-48" width="420" height="96" rx="48" fill="#d8281e"/><text y="16" text-anchor="middle" font-size="44" font-weight="800" fill="#fff">erheblich · Frist 3 Mon.</text></g>`;
    if (titel.startsWith('Bemessung') && t > 22.0) g += `<g transform="translate(770,1240)">${haken(-150, 0, 1)}<text x="-90" y="18" font-size="54" font-weight="800" fill="#fff" stroke="#111" stroke-width="8" paint-order="stroke">NS 10 passt</text></g>`;
    return g + schild('HEUTE.', 540, 330, '#ffd54a', '#0b2f66') + schild(titel, 540, 452, '#fff', '#0b2f66', 40, 1);
  }
  // 6) Mehrplatz: Tankstelle – Büro – Couch, alles abgeglichen
  if (t < 34) {
    return `<rect width="${W}" height="${H}" fill="#1565d8"/>
      <g transform="translate(0,0)"><rect x="40" y="520" width="480" height="560" rx="30" fill="#bfe3ff"/>
        <g transform="translate(280,1060) scale(.62)">${K_({ x: 0, y: 0, a2: -100, h2: handy() })}</g><text x="280" y="580" text-anchor="middle" font-size="40" font-weight="800" fill="#0b2f66">Tankstelle</text></g>
      <g><rect x="560" y="520" width="480" height="560" rx="30" fill="#e9dcc0"/><g transform="translate(800,920) scale(.8)">${pc(BILD.pc)}</g>
        <text x="800" y="580" text-anchor="middle" font-size="40" font-weight="800" fill="#0b2f66">Büro</text></g>
      <g><rect x="40" y="1110" width="1000" height="420" rx="30" fill="#f6d7b8"/><text x="540" y="1170" text-anchor="middle" font-size="40" font-weight="800" fill="#0b2f66">Couch</text>
        <rect x="140" y="1330" width="560" height="140" rx="40" fill="#8a4b2a"/><rect x="140" y="1250" width="560" height="110" rx="40" fill="#a35a33"/>
        <g transform="translate(420,1470) scale(.5)">${figur({ typ: 'kai', x: 0, y: 0, mund: spricht('kai', t) && F % 2 === 0, a1: 60, a2: -70, h2: '', brille: true })}</g>
        <g transform="translate(830,1330) rotate(-6) scale(.62)">${tablet(BILD.kunde, 420)}</g></g>
      ${sync(330, 900, 760, 760, t)}${sync(830, 1000, 830, 1240, t + 0.3)}${sync(320, 1000, 600, 1280, t + 0.6)}
      ${schild('Abgleich im Team (Pro)', 540, 452, '#ffd54a', '#0b2f66', 44, 1)}${schild('HEUTE.', 540, 330, '#ffd54a', '#0b2f66')}`;
  }
  // 7) Erinnerung in fünf Jahren
  if (t < 37) {
    const jahr = Math.min(2030, 2025 + Math.floor(kl(t, 34.3, 35.6) * 5.99));
    return `${tankstelle()}${K_({ x: 280, y: 1530, s: 0.9, a2: -100, h2: handy() })}
      <g transform="translate(740,960) rotate(4)"><rect x="-200" y="-220" width="400" height="420" rx="20" fill="#fff" stroke="#222" stroke-width="6"/><rect x="-200" y="-220" width="400" height="100" rx="20" fill="#d8281e"/>
        <text y="-150" text-anchor="middle" font-size="56" font-weight="900" fill="#fff">${jahr}</text><text y="60" text-anchor="middle" font-size="150" font-weight="900" fill="#222">GI</text>
        <text y="150" text-anchor="middle" font-size="40" font-weight="700" fill="#555">fällig</text></g>
      ${t > 35.6 ? `<g transform="translate(930,760) rotate(${Math.sin(F * 2) * 25})"><path d="M-40,30 Q-40,-50 0,-55 Q40,-50 40,30 L52,42 L-52,42Z" fill="#ffd54a" stroke="#222" stroke-width="5"/><circle cy="54" r="12" fill="#222"/></g>` : ''}
      ${schild('Erinnert an die nächste Prüfung', 540, 452, '#fff', '#0b2f66', 40, 1)}${schild('HEUTE.', 540, 330, '#ffd54a', '#0b2f66')}`;
  }
  // 8) Gerd unter dem Papierberg
  if (t < 40) {
    let g = `<g filter="url(#alt)"><rect width="${W}" height="${H}" fill="#d8c49a"/>${G_({ x: 540, y: 1500, lesebrille: true, traurig: true, augen: 'gross' })}`;
    for (let i = 0; i < 40; i++) g += `<g transform="translate(${180 + (i * 97) % 720},${1530 - Math.floor(i / 8) * 70 + zuf(i) * 6}) rotate(${(i * 37) % 40 - 20})">${zettel()}</g>`;
    return g + `</g>${schild('FRÜHER …', 540, 330, '#f4e7c4')}`;
  }
  // 9) Endkarte
  const u = kl(t, 40, 40.4);
  const liste = ['Fett- und Leichtflüssigkeitsabscheider', 'Mängel nach BFR mit Frist', 'Bemessung mit Rechenweg', '3D-Aufnahme und Dichtheitsprüfung', 'PDF-Prüfbericht mit Fotos', 'Erinnerung an Fälligkeiten', 'Team-Abgleich und Altdaten (Pro)'];
  return `<defs><radialGradient id="eg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#1565d8"/><stop offset=".6" stop-color="#0b2f66"/><stop offset="1" stop-color="#030d1d"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#eg)"/>
    <g transform="translate(540,420) scale(${li(0.5, 1, u)})"><text text-anchor="middle" font-size="84" font-weight="900" fill="#fff">AbscheiderBlick</text>
      <text y="56" text-anchor="middle" font-size="34" font-weight="700" fill="#ffd54a" letter-spacing="6">VON MMSE SOFTWARE</text></g>
    <text x="540" y="590" text-anchor="middle" font-size="70" font-weight="900" fill="#fff">Generalinspektion.</text>
    <text x="540" y="672" text-anchor="middle" font-size="70" font-weight="900" fill="#ffd54a">Ohne Papierkram.</text>
    ${liste.map((z, i) => t > 40.5 + i * 0.25 ? `<g transform="translate(150,${760 + i * 68})">${haken(0, -14, 0.5)}<text x="44" y="0" font-size="40" font-weight="700" fill="#fff">${z}</text></g>` : '').join('')}
    <text x="540" y="1270" text-anchor="middle" font-size="44" fill="#fff" opacity=".92">für Einzelanwender kostenlos</text>
    <g transform="translate(540,1365)"><rect x="-230" y="-50" width="460" height="96" rx="48" fill="#ffd54a"/><text y="16" text-anchor="middle" font-size="46" font-weight="800" fill="#0b2f66">Link in der Bio</text></g>`;
}
window.SZENE = szene;
