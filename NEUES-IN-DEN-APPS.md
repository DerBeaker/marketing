# Neues in den Apps – Vorrat für Beiträge

Manuel entwickelt die Apps laufend weiter (26.11.2026: „Features immer aktuell mit einfließen lassen“). **Vor jeder Planung** die App-Repos holen
(`git fetch` + `git merge --ff-only` in `/home/user/<repo>`, nur lesen), das Log seit dem „Stand“ unten durchsehen, sichtbare Neuerungen hier
eintragen und den Stand hochsetzen. Quellen: Commit-Log, `CLAUDE.md` des Repos, „Was ist neu“ der App (SpülBlick `app/js/data/neuigkeiten.js`).
Nur was für Anwender sichtbar ist; keine Preise; nichts behaupten, was nicht im Repo steht. „verwendet“ = Datum des Beitrags, sonst leer.
Ändert sich ein Feature, das in einem **schon eingeplanten** Beitrag vorkommt (Screen, Text, Name), den Beitrag anpassen.

| App | Repo (Branch) | Stand (Commit, Datum, Version) |
|---|---|---|
| Schachtblick | Schachtinspektions-Tool (claude/determined-galileo-7q6w1z) | 723c1f6 · 23.11.2026 · 0.10.6 |
| AbscheiderBlick | gi-tool (main) | 0120ecb · 24.11.2026 · 0.14.26 |
| Abscheider 3D | abscheider-3d-tool (main) | 1ffac5a · 12.11.2026 |
| SpülBlick | spuelblick (main) | 0730c00 · 19.11.2026 · Version 51 |

## Schachtblick
| Neu | seit | verwendet |
|---|---|---|
| Aufmaß für ein Datum oder einen Zeitraum (heute, 7 Tage, von–bis) | 19.11. | |
| Schachtliste und Karte nach Tiefe filtern oder farbig markieren | 19.11. | |
| Lage am Umfang „umlaufend“ in Protokoll, Bericht und Skizze | 0.10.3 | |
| DWA-M 150: Knotenaufbaudaten je Bauteil, Variante DWA wie im Merkblatt | 0.10.5/6 | |

## AbscheiderBlick
| Neu | seit | verwendet |
|---|---|---|
| Kalender-Abo: Termine der Generalinspektionen im eigenen Kalender (Admin, Prüfer, Kunden) | 0.14.26 | |
| Überhöhung im Prüfbericht als Schnittzeichnung | 0.14.23 | |
| Ersatz-Typenschild aus der Anlage heraus erstellen | 0.14.21 | |
| Berichtsdesigns Klassisch, Modern, Kompakt, Editorial + Farbschemata; Firma wählt | 0.14.0 | |
| Grafiken zu den Rechnungen im Bericht, Berichtsvorlagen der Firma | 0.13.86 | |
| Doppelanlagen (LFA und Fett), gemeinsamer Schlammfang, Überhöhung je Schlammfang | 0.14.8–10 | |
| Einbauteile aus der 3D-Aufnahme (Prallblech, Koaleszenz, Schwimmer) als Vorschlag | 0.14.10/13 | |
| Tarierung nachrechnen, Rückhaltevolumen (Havarie) nachweisen | 0.13.75 | |
| FA-Bemessung mit Kombidämpfer/Konvektomat; FAME-Stufen nach DIN 1999-101 | 0.14.17 / 0.14.0 | |
| Kontaktprotokoll: wann ging welche Nachricht an den Kunden | 0.13.59 | |
| Profilbilder, Titelbild der Anlage automatisch aus den Prüffotos | 0.13.68/69 | |
| „Was ist neu“-Fenster; Seite lädt nach Update selbst neu | 0.13.79/85 | |

## Abscheider 3D
| Neu | seit | verwendet |
|---|---|---|
| Halber (exzentrischer) Konus in Modell, Schnitt, Draufsicht | 12.11. | |
| Einbauteile: Prallblech, Einlauftopf, Tauchbogen; liegender Tank | 07.11. | |
| Doppelanlagen, Aufbau mit Einstieg, Abdeckung, Leitungen | 07.11. | |
| Vorlagen speichern und laden | 06.11. | |
| Maßzahlen anklickbar (Klick springt zum Eingabefeld) | 05.11. | |

## SpülBlick
| Neu | seit | verwendet |
|---|---|---|
| Projekte ohne ISYBAU: nur Name und Ort, Haltungen aus dem Feld oder aus einer Liste | V 50 | |
| Excel-Liste importieren (auch Tabelle aus PDF/Word einfügen) | V 50/51 | |
| Auftraggeber und Büro sehen, was bei jeder Reinigung passiert ist | V 47 | |
| Monteur-App zuerst fürs Handy; Fotos groß ansehen | V 45/46 | |
| „Was ist neu“ in der App | V 50 | |
