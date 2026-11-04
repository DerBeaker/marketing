# Aufträge an die App-Sitzungen

Die Social-Media-Sitzung ändert keine App-Repos. Was dort nötig ist, steht hier und geht per `send_message` an die App-Sitzung bzw. an Manuel. Erledigtes mit Datum abhaken.

| Seit | App / Repo | Auftrag | Status |
|---|---|---|---|
| 04.11.2026 | Schachtblick (`Schachtinspektions-Tool`) | Instagram-Name @mmse.software.moldan | erledigt in 0.9.8 (ZIP an Manuel) |
| 04.11.2026 | Schachtblick (`Schachtinspektions-Tool`) | CLAUDE.md: Marketing-Zeile auf `DerBeaker/marketing` umstellen; die Marketing-Kopien im App-Repo (`marketing/`, `.claude/skills/*instagram*`, `tools/make-reel.mjs`, `tools/make-instagram.mjs`) dürfen dort bleiben, gelten aber nicht mehr | erledigt 04.11.2026: CLAUDE.md umgestellt, die Skills dort verweisen nur noch hierher, Plan und Werkzeuge als Archiv markiert (nur Doku, keine neue App-Version) |
| 04.11.2026 | AbscheiderBlick (`gi-tool`) | Hat keinen Instagram-Link. Optional: Link „Instagram“ in Fußzeile/„Über“ ergänzen (`https://www.instagram.com/mmse.software.moldan/`), Datenschutzhinweis entsprechend | optional |
| 04.11.2026 | SpülBlick (`DerBeaker/SpuelBlick`) | Instagram auf @mmse.software.moldan umstellen und sichtbar verlinken (Text siehe „Auftrag SpülBlick: Instagram“ unten). Läuft über Manuels lokale SpülBlick-Sitzung, Auslieferung nur nach seinem „Ja, ausliefern“ | Auftrag an Manuel 04.11.2026, offen |
| 04.11.2026 | Homepage (`homepagemmse`) | Aktuelle Seite hat keinen Instagram-Link (nur die alte Seite `_alt/` → @DerBeaker). Optional ergänzen; `#produkte` muss als Ziel für den Bio-Link bestehen bleiben | optional |

## Auftrag SpülBlick: Instagram (04.11.2026)

Stand im Repo (gelesen 04.11.2026, Version 34): `app/js/brand.js` hat noch `INSTAGRAM_URL = 'https://www.instagram.com/schachtblick.app/'` und `INSTAGRAM_NAME = '@schachtblick.app'` mit dem Kommentar „in SpülBlick nicht verlinkt“. Verlinkt wird nur in den alten Schachtblick-Ansichten `views/projects.js` und `views/settings.js`, die nicht mehr geroutet sind; sichtbar ist in SpülBlick also kein Instagram-Link. Der Datenschutzhinweis erwähnt Instagram nicht.

Text für die SpülBlick-Sitzung:

> Auftrag aus der Social-Media-Sitzung: Instagram in SpülBlick auf den MMSE-Account umstellen.
> Hintergrund: @schachtblick.app heißt seit 04.11.2026 @mmse.software.moldan und ist jetzt der Account für alle MMSE-Apps, auch für SpülBlick (SpülBlick-Reels laufen dort ab 14.11.).
> 1. `app/js/brand.js`: `INSTAGRAM_URL = 'https://www.instagram.com/mmse.software.moldan/'`, `INSTAGRAM_NAME = '@mmse.software.moldan'`, Kommentar „Instagram-Profil von MMSE Software (alle Apps)“.
> 2. `app/js/views/einstellungen.js`, Abschnitt „Über SpülBlick“ (bei der Zeile „von VENDOR · VENDOR_WEB“): Link „Instagram @mmse.software.moldan“ ergänzen (`target="_blank" rel="noopener"`, Stil wie der VENDOR-Link, DESIGN.md beachten).
> 3. `app/js/views/rechtliches.js`: Absatz wie in Schachtblick ergänzen – „Instagram: Der Link „Instagram“ öffnet unser Profil @mmse.software.moldan (INSTAGRAM_NAME) bei Meta Platforms Ireland Ltd., Dublin. Die App bindet keine Inhalte von Instagram ein und überträgt keine Daten an Meta; erst auf der Instagram-Seite gilt die Datenschutzrichtlinie von Meta (https://privacycenter.instagram.com/policy).“ In `UPSTREAM.md` die Zeile zu `rechtliches.js` („kein … Instagram …“) anpassen.
> 4. `npm test` und `npx playwright test` grün, dann nach CLAUDE.md hochzählen, fragen und erst nach „Ja, ausliefern“ pushen und ausliefern. Danach die neue Versionsnummer nennen.
