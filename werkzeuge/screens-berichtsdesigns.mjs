// Erste Seite des AbscheiderBlick-Musterberichts je Berichtsdesign als großes Bild (für Karussells).
// Aufruf: node werkzeuge/screens-berichtsdesigns.mjs  → material/screens/abscheiderblick-design-<name>.jpg (braucht pdftoppm, liest nur aus /home/user/gi-tool)
import { writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const GI = '/home/user/gi-tool/app/js/report/';
const { musterberichtPdf } = await import(GI + 'musterbericht.js');
const { DESIGNS } = await import(GI + 'designs/index.js');
const root = join(dirname(fileURLToPath(import.meta.url)), '..'), dir = mkdtempSync(join(tmpdir(), 'design-'));
for (const [k, d] of Object.entries(DESIGNS)) {
  const r = musterberichtPdf({ stil: { design: k, farbe: d.farbe }, firma: { name: 'Muster Prüfdienst GmbH', anschrift: 'Beispielweg 1, 12345 Musterstadt', kontakt: 'Tel. 0123 456789' }, heute: new Date() });
  writeFileSync(join(dir, k + '.pdf'), r.bytes);
  execFileSync('pdftoppm', ['-f', '1', '-l', '1', '-scale-to-x', '1000', '-scale-to-y', '-1', '-jpeg', '-singlefile', join(dir, k + '.pdf'), join(root, 'material', 'screens', 'abscheiderblick-design-' + k)]);
  console.log(k, d.name || '');
}
