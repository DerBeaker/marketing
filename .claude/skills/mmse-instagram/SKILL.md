---
name: mmse-instagram
description: Leitfaden für den Instagram-Account @mmse.software.moldan von MMSE Software mit allen Apps (Schachtblick, AbscheiderBlick, Abscheider 3D, SpülBlick). Verwenden für cinematische, fotorealistische Reels mit Sprecher, Posts, Storys, Captions, Wochenplanung und das direkte Veröffentlichen über Metricool. Für Schachtblick-Fachdetails zusätzlich den Skill schachtblick-instagram lesen.
---

# MMSE Software auf Instagram (@mmse.software.moldan)

Ein Account für alle Apps von MMSE Software Engineering (Manuel Moldan, Freigericht). Seit 04.11.2026 heißt er **@mmse.software.moldan** (vorher @schachtblick.app). Ziel: Fachleute aus Abwasser und Entwässerung kennen die Apps und probieren sie aus.

## Rolle dieser Sitzung (fest vereinbart)

- **Nur Social Media.** Arbeitsort ist dieses Repo `DerBeaker/marketing` (öffentlich): Skills, Werkzeuge, Material, Plan, fertige Medien.
- **App-Repos nur lesen** (`Schachtinspektions-Tool`, `gi-tool`, `abscheider-3d-tool`, `spuelblick`, `homepagemmse`): mit `add_repo` (access `read`) holen, für Fakten, Screens und Demo-Server. Dort nie committen oder pushen, keine ZIPs bauen.
- Muss in einer App etwas geändert werden (Link, Text, Fehler): als Auftrag an die zuständige App-Sitzung geben (`send_message`) oder Manuel die fertige Aufgabe nennen. Offene Aufträge stehen in `UEBERGABE-APPS.md`.
- Nichts Geheimes ins Repo, es ist öffentlich: keine Schlüssel, Zugangsdaten, Kundendaten. Den Pixabay-Schlüssel nur als Umgebungs-Secret `PIXABAY_KEY`.

## Ton

Deutsch, per Du, sachlich, kurz, keine Superlative, höchstens 1–2 Emojis, genau ein CTA pro Beitrag. Caption: Hook (1 Zeile) → 2–3 Sätze oder 3 Stichpunkte → CTA → 5–8 Hashtags.

## Produkte (nur diese Aussagen verwenden)

| App | Adresse | Für wen | Verifizierte Aussagen |
|---|---|---|---|
| **Schachtblick** | schachtblick.mmse-software.com | Schacht- und Kanalinspektion | Fakten im Skill `schachtblick-instagram`. Kurz: Schachtinspektion nach ISYBAU / DWA-M 149-2 im Browser, Basis kostenlos, Daten auf dem Gerät; Pro mit XML-Export und Abgleich; KI-Vorschläge **nur in Schachtblick Pro** (Zusatzpaket), die Fachkraft prüft. |
| **AbscheiderBlick** | gi.mmse-software.com | Generalinspektion von Abscheideranlagen (Fachkundige) | Fettabscheider DIN 4040-100, Leichtflüssigkeitsabscheider DIN 1999-100; Bemessung (Nenngröße, Schlammfang) mit nachvollziehbarem Rechenweg; Mängel nach BFR-Muster (geringfügig/erheblich/gefährlich, Frist für die Nachprüfung); Fotos und Nachweise; PDF-Prüfbericht; erinnert an die nächste Prüfung in fünf Jahren; Handy, Tablet, PC. **Kostenlos für Einzelanwender, Teams per Firmenkonto im Abo.** Altdatenübernahme FA/BA-Inspekt und Betriebstagebuch nur Pro. Keine Preise. |
| **Abscheider 3D** | abscheider.mmse-software.com | Bauwerksaufnahme von Abscheidern | Bauwerksaufnahme, bemaßtes 3D-Modell, Längsschnitt und Draufsicht, Dichtheitsprüfung (Anhang A, DIN 1999-100 / DIN 4040-100), PDF-Bericht, LFA und Fettabscheider. **Kostenlos, ohne Anmeldung, Daten bleiben auf dem Gerät.** Browser (offline) und Windows-App. Berechnungen ohne Gewähr. |
| **SpülBlick** | spülblick.mmse-software.com | Kanalreinigung | **Nur Vorstellung.** Offline-App im Browser; Karte mit Haltungen auch im Funkloch; Erfassung Schritt für Schritt (Verschmutzung, Reinigung, Fotos); gebaut von einem Praktiker mit 15 Jahren Kanalreinigung. CTA „Interesse? Schreib uns.“ Keine Preise, Kunden, Feldtest-Zahlen, Mitarbeiterfotos, kein Vorgängerprogramm. |

Abscheider 3D ist **.com**, nicht .de.

## Pflichtregeln

- KI nur bei Schachtblick, immer mit „nur in Schachtblick Pro“ und „Vorschläge, keine Prüfung“.
- Keine Normkonformität, Abnahmefähigkeit oder Rechtsberatung zusagen.
- Keine Kundennamen, Projektfotos, Kennzeichen, Orte ohne Freigabe. Demo-Daten in Screens sind fiktiv und erlaubt.
- Keine erfundenen Zahlen, Zitate, Kundenstimmen; keine Konkurrenz namentlich; Markenlogos Dritter (Tankstellenketten, Hersteller) nicht groß ins Bild.

## Look: cinematic und fotorealistisch

Manuel will Reels, die wie ein Kinotrailer anfangen: echte Menschen, echte Orte (Tankstelle, Großküche, Schacht, Spülfahrzeug, Baustelle), dann die echte App. Reine Bildschirm-Reels reichen nicht.

- **Aufbau (25–35 s):** 1–2 echte Szenen als Hook (erste 2 s: starkes Bild + max. 5 Wörter) → Problem/Nutzen in einem Satz → 2–3 App-Screens im Gerät → Endkarte der App. Sprecher Thorsten in jeder Szene.
- **Bildsprache:** langsame Kamerafahrt (Push-in, Drift), Farblook (kühle Schatten, warme Lichter), Vignette, Filmkorn, Überblendungen (`fadeblack`, `smoothleft`). Steht alles in `werkzeuge/make-reel.mjs` (`LOOK`, `KORN`).
- **Je App ein Thema** (`THEMEN`): mmse (#24507f→#152540, Gold #f2b705), schachtblick (#0d4fb8→#06244f, Gelb #ffd54a), abscheiderblick (#1565d8→#0b2f66, Gelb), abscheider3d (#14707a→#0b3640, Gold), spuelblick (#2c6040→#14321f, Orange #f39a3d). MMSE-Zeichen auf jeder Endkarte.
- **App-Oberflächen nie per KI.** Nur echte Screens aus `material/screens/` und `material/schachtblick/bilder/`. Neue Screens: AbscheiderBlick (`gi-tool/.e2e/*.png`), SpülBlick (im gelesenen spuelblick-Repo `node tools/dev/server.js 8090`, Konto `monteur1`, Testpasswort aus `test/api/fixture.php`; nichts committen), Abscheider 3D von der Live-Seite (Beispielanlage, Schnitt/Draufsicht/Prüfformular als Ausschnitte).
- **Keine KI-Personen** (schlechteste Reichweite, wirkt auf Fachleute unecht). KI-Bilder nur ausnahmsweise, dann `isAiGenerated: true` und Hinweis in der Caption.
- Formate: Reels/Storys 1080 × 1920 (oben 250 px, unten 450 px frei), Feed 1080 × 1350.

## Echtes Material: Quellen und Lizenzen

- **Erlaubt:** eigene Fotos/Clips von Manuel (Freigabe, Metadaten entfernen, Schilder/Kennzeichen unkenntlich), **Pixabay** (Videos und Fotos, Lizenz erlaubt Werbung mit Bearbeitung ohne Namensnennung; API `https://pixabay.com/api/videos/?key=$PIXABAY_KEY&q=…&lang=de`), **CC0/gemeinfrei** von Wikimedia Commons (Suche `… incategory:"CC-zero"`, eigener User-Agent, Ratenlimit → Pausen).
- **Nicht:** Google-Bildersuche, Hersteller- und Firmenfotos, CC BY-SA in bearbeiteter Werbung, Bot-Schutz von Stock-Seiten umgehen. Pexels vergibt derzeit keine API-Schlüssel.
- Jede Fremddatei nach `material/fotos/` bzw. `material/clips/` mit Quelle und Lizenz in `material/fotos/LIZENZEN.md`.
- Pixabay-Suchbegriffe, die passen: tankstelle / gas station, zapfsäule, großküche / restaurant kitchen, koch, kanal / sewer, gully / manhole, bauarbeiter / construction worker, straßenbau, saugwagen / vacuum truck, baustelle nacht, regen straße nacht, tablet arbeiter, büro planung.

## Werkzeuge (in diesem Repo)

- `node werkzeuge/make-reel.mjs <name>` → `reels/reel-<name>.mp4` + `-cover.jpg`. Vorhandene Reels: `mmse`, `schachtblick`, `abscheiderfoto`, `abscheiderblick`, `abscheider3d`, `spuelblick`, `cinematic`, `aufmass`, `export`, `werbung`. Neue Reels als weiteren Eintrag in `REELS` anlegen.
- Szene: `{ foto | bild, dauer, opt: { zoom, z0, drift, dreh, quer }, text, textSzenen, ueber, sprich }`. `foto` = Pfad im Repo (`material/fotos/…`) oder Name aus `material/schachtblick/demo/`; Querformat mit `opt.quer` (0…1 = Ausschnitt). Helfer: `text()`, `oben()`, `handyBild()`, `tabletBild()`, `karte()`, `endkarte()`.
- **Sprecher:** `sprich` wird mit piper vertont (Stimme Thorsten, frei). `PIPER_BIN=<venv>/bin/piper`, Modell `.cache/piper/de_DE-thorsten-high.onnx`. Fehlt beides: `python3 -m venv /tmp/tts && /tmp/tts/bin/pip install piper-tts` und das Modell von huggingface `rhasspy/piper-voices` (de_DE/thorsten/high, `.onnx` + `.onnx.json`) nach `.cache/piper/` laden. Aussprache: „M M S E“, „3 D“, „Isybau“, „Spülblick“, „Abscheiderblick“.
- `node werkzeuge/make-instagram.mjs [start|ki|kommune|kw44]` → Karussells/Storys nach `posts/instagram/`.
- Vor dem Ausliefern immer Einzelbilder ansehen (`ffmpeg -ss <t> -frames:v 1`): Umbrüche, abgeschnittene Texte, Überlappungen.

## Veröffentlichen (Metricool)

1. Medien nach `reels/`, `posts/`, `storys/` committen und auf `main` pushen. Link: `https://raw.githubusercontent.com/DerBeaker/marketing/main/<pfad>` (vorher mit `curl` prüfen: 200).
2. `createScheduledPost` (oder einen alten Entwurf per `updateScheduledPost` umbauen) mit Brand-ID **7315125**, Zeitzone Europe/Berlin, **`autoPublish: true`, `draft: false`** – nie Entwürfe, so hat Manuel es festgelegt. Cover über `videoThumbnailUrl`.
3. Reels mit Sprecher: **kein** `audioConfiguration`. Stumme Reels: Musik `audioConfiguration.audioId = "280438150848531"`.
4. **Monatslimit:** Der Gratis-Tarif lässt ca. 20 Beiträge pro Monat zu (Oktober 2026: danach Fehler „You have reached your Metricool account limit“). Vor dem Planen die veröffentlichten + geplanten Beiträge des Monats zählen, höchstens 18 einplanen. Reels vor Storys.
5. Danach `getScheduledPosts` prüfen: alle `PENDING`, `draft: false`, `autoPublish: true`; Fehler der Vortage beheben (neu terminieren).
6. Manuel lädt nichts selbst hoch; fertige Videos zusätzlich per `SendUserFile` schicken.

## Rhythmus und Rotation

Pro Woche 3 Reels mit Sprecher + 1 Story, höchstens 1 Karussell. Rotation: mindestens 1 Abscheider-App (AbscheiderBlick oder Abscheider 3D), 1 Schachtblick, alle 2 Wochen SpülBlick. Beste Zeiten: werktags 18:00, samstags 10:00. Jede Woche vorher Analytics (Reels: Reichweite, Aufrufe, Wiedergabezeit; Follower) ansehen und `REDAKTIONSPLAN.md` fortschreiben.

## Hashtags

Basis: #MMSESoftware #Abwasser #Entwässerung #Tiefbau
Schachtblick: #Schachtinspektion #Kanalinspektion #ISYBAU #DWAM149 #Schachtblick
AbscheiderBlick / Abscheider 3D: #Abscheider #Fettabscheider #Leichtflüssigkeitsabscheider #Generalinspektion #DIN4040 #DIN1999 #AbscheiderBlick
SpülBlick: #Kanalreinigung #Kanalspülung #Kanalbetrieb #SpülBlick
