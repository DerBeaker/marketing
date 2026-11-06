// Szenen „Früher vs. heute“ für Schachtblick (braucht cartoon-basis.js)
/* eslint-disable */
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
window.SZENE = szene;
