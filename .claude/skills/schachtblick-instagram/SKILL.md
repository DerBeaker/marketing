---
name: schachtblick-instagram
description: Brand- und Content-Leitfaden für den Instagram-Account @mmse.software.moldan (vorher @schachtblick.app; App Schachtblick von MMSE Software). Verwenden, wenn Posts, Karussells, Storys, Reels, Captions oder Redaktionspläne für Schachtblick erstellt oder eingeplant werden.
---

# Schachtblick auf Instagram (@mmse.software.moldan)

> Der Account wird zum MMSE-Software-Account für alle Apps. Für Planung, Metricool-Kontingent, Sprecher-Reels und die anderen Apps gilt der Skill `mmse-instagram`; dieser Skill bleibt die Faktenbasis für Schachtblick.

## Worum es geht

Schachtblick ist eine kostenlose Web-App (läuft im Browser, ohne Installation, auch offline) für die manuelle Schachtinspektion nach ISYBAU und DWA-M 149-2. Hersteller: MMSE Software Engineering, Manuel Moldan, Freigericht. Instagram dient dazu, Neuigkeiten zur App zu zeigen und Fachleute zum Ausprobieren zu bringen.

App-Link (für Bio, Story-Sticker, CTA): https://schachtblick.mmse-software.com/
KI-Seite: https://schachtblick.mmse-software.com/schachtinspektion.html

## Zielgruppe

Schacht- und Kanalinspekteure, Inspektionsbetriebe, Städte, Gemeinden, Stadtwerke. Fachleute, die täglich mit Protokollen, Kodierung und Aufmaß arbeiten. Sie haben wenig Zeit, mögen Praxisnutzen und misstrauen Marketing-Sprache.

## Tonalität

- Deutsch, per Du, sachlich-freundlich, kurz. Kein Marketing-Pathos, keine Superlative.
- Nutzen vor Technik: Was spart der Inspekteur vor Ort oder im Büro?
- Fachbegriffe korrekt und ohne Erklärung verwenden (ISYBAU, DWA-M 149-2, BFR Abwasser, DIN EN 13508-2, Zustandsklasse, Aufmaß).
- Emojis sparsam (max. 1–2 pro Post, z. B. 📱).
- Jeder Post endet mit genau einem klaren CTA, z. B. "Link in der Bio. Kostenlos im Browser starten."

## Verifizierte Fakten (nur diese als Aussagen verwenden)

**Basis (kostenlos, ohne Anmeldung, Daten bleiben auf dem Gerät):**
- Schacht von oben fotografieren, Anschlüsse im Foto antippen, Schäden kodieren
- Zustandsklasse nach BFR Abwasser A-3
- PDF-Schachtprotokoll mit Firmenlogo, Aufmaß als PDF/Excel
- Bauteilbeschreibung mit 3D-Schachtmodell und Karte
- Import von ISYBAU-XML 2006–2024 und DWA-M 150
- Läuft im Browser auf Handy, Tablet und PC, ohne Installation, auch ohne Netz
- Keine Cookies, kein Tracking
- Bluetooth-Laser: Messwerte direkt vom Laser-Entfernungsmesser ins angetippte Feld (Tastaturmodus auf Android, iPhone, Tablet, PC; ausgewählte Laser direkt verbunden = Beta, nur Chrome/Edge)

**Pro (Firmenkonto):** inkl. XML-Export und Abgleich zwischen Geräten. 25 € pro Monat für 3 Benutzer, jeder weitere 5 €, jährlich 250 €, monatlich kündbar. Preise ohne USt (Kleinunternehmer nach § 19 UStG).

**Schachtinspektion mit KI (Zusatzpaket zu Pro):** Vor Ort fotografieren, die KI schlägt Anschlüsse und sichtbare Schäden als Kodes nach DIN EN 13508-2 vor, die Fachkraft prüft die Vorschläge im Büro und gibt sie frei.

## Pflichtregeln für KI-Inhalte

- Immer sagen: Die KI liefert **Vorschläge, keine Prüfung**. Kodierung und Bewertung verantwortet die Fachkraft.
- Wo die KI vorkommt, steht immer dabei, dass sie **nur in Schachtblick Pro** enthalten ist (Zusatzpaket), im Bild und in der Caption.
- Nie formulieren: "KI erkennt alle Schäden", "vollautomatische Inspektion", "ersetzt den Inspekteur".
- Qualifikation vor Ort legt der Auftraggeber fest. Dazu keine Aussagen treffen.
- Keine Zusagen zu Normkonformität oder Abnahmefähigkeit, die nicht auf der Website stehen.

## Visueller Stil

Die Grafiken und Videos erstellt Claude selbst per Code (kein Canva). Die Werte stehen in `werkzeuge/werbung.mjs` und gelten für alles:

- Hintergrund: Verlauf `linear-gradient(160deg, #0a3f9c 0%, #0a5bd3 45%, #00a3c4 100%)`; dunkle Variante für Video-Endkarten `radial-gradient(#0d4fb8 → #06244f → #020b1a)`
- Akzent und CTA-Buttons: Gelb `#ffd54a`, Schrift darauf Blau `#0a3f9c`
- Schrift: DejaVu Sans, Headlines 800 (fett), weiß; Schlüsselwort oder Untertitel gelb
- Tag-Pills: `rgba(255,255,255,.18)`, rund, fett
- Logo „Schachtblick“ (Fadenkreuz im halbtransparenten Quadrat) oben links
- Handy-Mockup mit **echtem App-Screenshot** aus `material/schachtblick/bilder/` (dunkler Rahmen `#0b1220`, runde Ecken, Schatten)
- Echte Fotos vor KI-Bildern: Die Schachtfotos in `material/schachtblick/demo/schacht-1…4.jpg` sind echt (Aufnahmen von oben, dürfen gedreht werden). `schacht-3.jpg` hat ein verpixeltes Schild und eignet sich nicht für Videos.
- App-Oberflächen nie per KI erzeugen, immer echte Screenshots.

**Formate (sonst schneidet Instagram ab):**
- Feed und Karussell: **1080 × 1350 (4:5)**. 3:4 wird im Feed oben und unten beschnitten.
- Storys und Reels: 1080 × 1920 (9:16), oben ca. 250 px und unten ca. 450 px frei für die Instagram-Leisten.
- Karussell: Titel-Slide, 2–4 Inhalts-Slides, CTA-Slide; gelber Button „wischen →“ auf dem Titel.
- Reels: Kamerafahrt, Farblook (kühle Schatten, warme Lichter), Vignette, leichtes Filmkorn, Überblendungen. Ohne eingebettete Musik (stumme Tonspur); Musik wird in Metricool über `audioConfiguration` gesetzt (bisher genutzt: audioId `280438150848531`).

**Werkzeuge im Repo `DerBeaker/marketing`** (siehe Skill `mmse-instagram`):
- `node werkzeuge/make-instagram.mjs [start|ki|kommune|kw44]`: Karussells 4:5 nach `posts/instagram/`
- `node werkzeuge/make-reel.mjs <name>`: cinematic Reel mit Sprecher nach `reels/reel-<name>.mp4` (+ Cover)
- Neue App-Screenshots: Schachtblick-Repo nur lesen, App lokal starten (`npm run serve`) und mit Playwright aufnehmen; Ergebnis nach `material/`, nie ins App-Repo committen
- Neue Motive als weitere Folge bzw. Szene in diesen Werkzeugen anlegen, nicht als Einzelstück. Vor dem Ausliefern immer die fertigen Bilder ansehen (Umbrüche, abgeschnittene Texte, Überlappungen).

## Strategie nach den Zahlen (Stand 22.10.2026)

- Reels mit echtem Material im Kino-Look erreichen ein Vielfaches (Reel „Der erste Schacht“: 141 Reichweite, +3 Follower am Tag) gegenüber Karussells (zuletzt 16–33) und Reels mit KI-Personen (51) oder reinem App-Bildschirm (18).
- Deshalb: ca. 3 Reels pro Woche, höchstens 1 Karussell. 10–20 s, in den ersten 2 Sekunden ein starkes echtes Bild mit kurzem Text (Ø Wiedergabe nur ca. 5 s). Keine KI-Personen.
- Echte Schachtfotos und -clips sind der Engpass: neue Motive vom Nutzer erbitten (Freigabe klären, Metadaten entfernen, Schilder und Nummern unkenntlich machen).
- Jede Woche vor der Planung die Metricool-Analytics (Reels: Reichweite, Aufrufe, Wiedergabezeit; Evolution: Follower) prüfen und die Strategie anpassen.

## Content-Säulen (Rhythmus: ca. 3 Reels und höchstens 1 Karussell pro Woche, 3–5 Storys)

1. **Feature in 30 Sekunden**: ein Feature, ein Screenshot, ein Nutzen (z. B. Anschlüsse im Foto antippen).
2. **Workflow**: vom Schachtfoto zum PDF-Protokoll, in 4–5 Schritten.
3. **Normen-Know-how**: kurze Fachtipps zu ISYBAU, DWA-M 149-2, Zustandsklassen. Nur korrekt belegte Inhalte.
4. **KI-Vorschläge**: Foto → Befundvorschläge → Prüfung im Büro (immer mit Pflichtregel oben).
5. **Neuigkeiten**: neue Funktionen, Versionen, Laser-Kompatibilität.
6. **Dialog (Storys)**: Umfragen und Fragen, z. B. "Wie dokumentiert ihr aktuell?", "Welches Feature fehlt euch?".

## Caption-Vorlage

1. Hook (1 Zeile, Nutzen oder Frage)
2. 2–3 kurze Sätze oder 3 Stichpunkte
3. CTA (ein Satz)
4. 5–8 Hashtags

## Hashtags (Vorschlag, mit der Zeit anhand der Analytics prüfen)

Kern: #Schachtinspektion #Kanalinspektion #Kanalsanierung #Abwasser #ISYBAU #DWAM149 #Schachtprotokoll #Kanalnetz #Tiefbau #Abwassertechnik
Marke: #Schachtblick #MMSESoftware

## No-Gos

- Keine Preise oder Konditionen, die nicht oben stehen
- Keine Kundennamen, Projektfotos oder Schachtdaten ohne ausdrückliche Freigabe
- Keine Vergleiche mit namentlich genannten Konkurrenzprodukten
- Keine Rechtsberatung, keine Aussagen zur Abnahmefähigkeit
- Keine erfundenen Zahlen, Zitate oder Kundenstimmen
- Keine englischen Bewertungs-Tools (Hook-Scores, „Humanizer“) auf deutsche Texte anwenden; sie werten deutsche Großschreibung und Wörter falsch.

## Arbeitsablauf

1. Thema nach Säule wählen und Fakten oben prüfen.
2. Grafik oder Video mit den Werkzeugen oben erzeugen (4:5 Feed, 9:16 Story/Reel) und ansehen.
3. Caption nach Vorlage schreiben.
4. Medien öffentlich ablegen: in das öffentliche Repo `DerBeaker/marketing` pushen (z. B. `reels/`, `posts/`, `storys/`). Link für Metricool: `https://raw.githubusercontent.com/DerBeaker/marketing/main/<pfad>`. Metricool kopiert die Datei beim Einplanen in den eigenen Speicher. Das App-Repo ist privat, Links dorthin funktionieren nicht; OneDrive und Datei-Hoster sind aus der Sitzung nicht erreichbar.
5. In Metricool einplanen (Brand-ID 7315125, Zeitzone Europe/Berlin) und **direkt veröffentlichen**: `autoPublish: true`, `draft: false`. Monatslimit des Gratis-Tarifs beachten (siehe `mmse-instagram`). So hat Manuel es festgelegt, keine Entwürfe. `isAiGenerated` nur setzen, wenn KI-Bilder enthalten sind.
6. Den Nutzer nicht selbst hochladen lassen; alle Schritte erledigt Claude.
7. Wöchentlich Analytics auswerten und die nächste Woche daran ausrichten (siehe „Strategie nach den Zahlen“).
