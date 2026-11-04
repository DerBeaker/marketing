# Redaktionsplan MMSE Software (Instagram)

Seit 04.11.2026 ist @schachtblick.app umbenannt in **@mmse.software.moldan**, den Account von **MMSE Software** für alle Apps: Schachtblick, AbscheiderBlick, Abscheider 3D und SpülBlick (nur Vorstellung). Leitfaden: Skill `mmse-instagram` (in diesem Repo). Den alten Plan (Oktober) gibt es in der Git-Historie des App-Repos.

## Was schiefgelaufen ist (Stand 04.11.2026)

- **Metricool-Limit:** Im Oktober sind 20 Beiträge erschienen, danach meldete Metricool „You have reached your Metricool account limit“ (Story 30.10. abends, 60-s-Reel 31.10.). Der Gratis-Tarif hat ein Monatskontingent. Ab jetzt: höchstens 18 Beiträge pro Monat, Reels zuerst.
- **Entwürfe:** Die Beiträge ab 02.11. hatte eine andere Sitzung als Entwurf ohne Auto-Veröffentlichung angelegt (`draft: true`, `autoPublish: false`). Entwürfe erscheinen nie. Außerdem mit „moda.app“-Wasserzeichen und KI-Personen. Diese Entwürfe sind ersetzt bzw. bleiben liegen und sollten in Metricool gelöscht werden.
- **Domain:** Die Story vom 29.10. zeigte „abscheider.mmse-software.de“. Richtig ist **abscheider.mmse-software.com**.

## Umstellung auf MMSE Software (Manuel, vor Mo 09.11.)

1. Instagram → Profil bearbeiten: Name „MMSE Software“, Benutzername z. B. `mmse.software` (falls frei), Profilbild `marketing/marken/mmse-profilbild.jpg`.
2. Bio (Vorschlag):
   „Apps für Abwasser und Entwässerung · im Browser, auch offline
   Schachtblick · AbscheiderBlick · Abscheider 3D · SpülBlick
   Freigericht · www.mmse-software.com“
   Link: https://www.mmse-software.com/#produkte
3. Danach Bescheid geben: Ich ändere `INSTAGRAM_URL` in Schachtblick (brand.js, Info-Seite, JSON-LD) und prüfe die Metricool-Verbindung. In SpülBlick und AbscheiderBlick steht der Link ggf. auch, das machst du dort in der jeweiligen Sitzung.

## Bildmaterial

Ziel: fotorealistisch, echte Menschen, Tankstellen, Großküchen, Abscheider, Spülfahrzeuge. Quellen nur mit Lizenz für bearbeitete Werbung ohne Namensnennung: Pixabay (API-Schlüssel nötig, kostenlos), CC0 von Wikimedia Commons, eigene Fotos mit Freigabe. Bilder aus der Google-Suche gehören Herstellern/Fotografen → nicht verwenden. Nachweis je Datei in `material/fotos/LIZENZEN.md`.

## Rhythmus

Pro Woche 3 Reels mit Sprecher (Thorsten), 1 Story, höchstens 1 Karussell. Apps rotieren, Schachtblick mindestens einmal pro Woche. Veröffentlicht wird immer direkt (`autoPublish: true`, `draft: false`).

## November 2026

| Tag | Zeit | Format | App | Inhalt | Datei | Status |
|---|---|---|---|---|---|---|
| Mi 04.11. | 18:00 | Reel + Sprecher | AbscheiderBlick | Echte Videoclips (Tankstelle nachts, Fritteuse, Arbeiter) → Generalinspektion | reel-abscheiderclip.mp4 | eingeplant |
| Do 05.11. | 18:00 | Reel + Sprecher | Schachtblick | „Der erste Schacht“, vertont | reel-schachtblick.mp4 | eingeplant |
| Sa 07.11. | 10:00 | Reel + Sprecher | Schachtblick | mit echten Videoclips (Straße, Regen, Gully, Arbeiter) | – | wird produziert |
| Mo 09.11. | 18:00 | Reel + Sprecher | MMSE | „Aus Schachtblick wird MMSE Software“, alle Apps | reel-mmse.mp4 | eingeplant (vorher umbenennen) |
| Di 10.11. | 18:00 | Story | Schachtblick | „Wo liegen deine Daten?“ (nachgeholt vom 30.10.) | – | eingeplant |
| Mi 11.11. | 18:00 | Reel + Sprecher | Abscheider 3D | Aufmaß → 3D-Modell → Dichtheit → PDF | reel-abscheider3d.mp4 | eingeplant |
| Fr 13.11. | 18:00 | Reel | Schachtblick | 60-s-Werbevideo (nachgeholt vom 31.10.) | – | eingeplant |
| Sa 14.11. | 10:00 | Reel + Sprecher | SpülBlick | Vorstellung, „Interesse? Schreib uns.“ | reel-spuelblick.mp4 | eingeplant |
| Mo 16.11. | 18:00 | Reel | Schachtblick | „Kode wählen statt Handbuch wälzen“ (verschoben vom 04.11.) | – | eingeplant |
| Mi 18.11. | 18:00 | Karussell | MMSE | „Vier Apps, ein Account“ (eine Folie je App) | – | wird produziert |
| Fr 20.11. | 18:00 | Reel + Sprecher | AbscheiderBlick | Mängel nach BFR-Muster und Fristen | – | wird produziert |
| Sa 21.11. | 10:00 | Story | MMSE | Umfrage „Welche App interessiert dich?“ (Sticker von Hand) | – | wird produziert |
| Mo 23.11. | 18:00 | Reel + Sprecher | Schachtblick | Ergebnis abgeben: XML + Fotos als ZIP (Pro) | reel-export | wird produziert |
| Mi 25.11. | 18:00 | Reel + Sprecher | Abscheider 3D | Dichtheitsprüfung nach Anhang A | – | wird produziert |
| Fr 27.11. | 18:00 | Reel + Sprecher | SpülBlick | Funkloch: Karte und Haltungen bleiben da | – | wird produziert |
| Sa 28.11. | 10:00 | Story | Schachtblick | Laser per Bluetooth (Frage: welcher Laser?) | – | wird produziert |

16 Beiträge im November (Limit-Reserve: 2). KW 47/48 baue ich jeweils in der Vorwoche und schaue vorher in die Analytics.

## Reels erzeugen

```bash
PIPER_BIN=<venv>/bin/piper node werkzeuge/make-reel.mjs <name>   # reels/reel-<name>.mp4 + Cover
```
Sprecher: piper, Stimme Thorsten (frei). Reels mit Sprecher bringen ihren Ton mit, in Metricool also keine Musik (`audioConfiguration`) setzen.

## Automatik

Geplante Aufgabe „MMSE Wochenplanung Instagram“, sonntags 18:48: plant die Folgewoche nach Skill und diesem Plan (3 Reels mit Sprecher, 1 Story, Rotation der Apps, Monatslimit), veröffentlicht direkt und schreibt die Woche hier fort.
Sprecher: piper, Stimme Thorsten (frei). Reels mit Sprecher bringen ihren Ton mit, in Metricool also keine Musik (`audioConfiguration`) setzen.

## Texte

### Antwort zu Daten (Kommentare, Nachrichten, FAQ-Story)

> In der kostenlosen Version legst du kein Konto an und lädst nichts hoch. Alle Projekte, Fotos und Befunde liegen nur im Browser auf deinem Gerät, wir bekommen sie nicht und andere können sie nicht sehen. Es gibt keine Cookies und kein Tracking. Erst wenn eine Firma sich für Schachtblick Pro entscheidet (optional), liegen die Daten der Firma auf einem Server in Deutschland, und dort sieht jede Firma nur ihre eigenen Daten. Testen kannst du ohne eigene Daten mit dem Demo-Projekt (fiktive Straße).

Hinweis: Wer den Browser-Speicher löscht oder das Gerät wechselt, verliert die Daten der Basisversion. Deshalb regelmäßig PDF oder Export sichern. Das steht auch so in den Datenschutzhinweisen der App.

### Instagram, Karussell „Link öffnen. Loslegen.“

> Schachtblick brauchst du nicht zu installieren: Link öffnen und loslegen. 🔗
> ✅ läuft im Browser auf Handy und PC, auch offline
> ✅ kein Konto, kein Download
> ✅ deine Daten bleiben in der kostenlosen Version auf deinem Gerät, niemand sonst kann sie sehen
> ✅ Demo-Projekt zum Ausprobieren ohne eigene Daten
> PDF-Protokoll und Aufmaß sind kostenlos. XML-Export, Teamabgleich und KI-Vorschläge gibt es mit Schachtblick Pro (optional).
> Link in der Bio 👆 Was hält dich noch vom Ausprobieren ab? Schreib’s in die Kommentare 👇
>
> #Schachtinspektion #Kanalinspektion #Abwasser #Stadtwerke #ISYBAU #DWA #Kanalsanierung #Tiefbau #Kommunen #Datenschutz

### Instagram, Karussell „Schachtinspektion mit KI“

> Schachtinspektion mit KI: vom Foto zum Befund 🔍 (KI nur in Schachtblick Pro)
> 1️⃣ Schacht und Wand fotografieren
> 2️⃣ Die KI schlägt Anschlüsse und Schäden nach DIN EN 13508-2 vor, mit Uhrzeit, Begründung und Treffsicherheit
> 3️⃣ Vorschläge ansehen, übernehmen oder verwerfen. Nichts wird automatisch übernommen
> Die KI-Vorschläge sind nur in Schachtblick Pro enthalten (Zusatzpaket). Kodierung, Zustandsklasse und PDF-Protokoll gibt’s auch in der kostenlosen Basisversion.
> Wo geht bei euch die meiste Zeit drauf: Fotos, Kodieren oder Protokoll? Schreib’s in die Kommentare 👇
> Link in der Bio.
>
> #Schachtinspektion #Kanalinspektion #Abwasser #KI #Stadtwerke #ISYBAU #DWA #Kanalsanierung #Tiefbau #Kommunen

### Instagram, Reel „teilen“

> Kostenlose App für die Schachtinspektion. Hilf mit und teile sie mit Kollegen, die Schächte prüfen. Link in der Bio.
> #Schachtinspektion #Kanal #Abwasser #Stadtwerke #ISYBAU

### LinkedIn, Vorstellungsbeitrag (Dokument `start-linkedin.pdf` anhängen)

> Schachtinspektion ohne Installation und ohne Konto: Link öffnen, loslegen.
>
> Ich habe Schachtblick gebaut, eine Web-App für die Schachtinspektion nach ISYBAU und DWA-M 149-2. Sie läuft im Browser auf Handy und PC, auch offline.
>
> Die häufigste Frage: „Sehen andere meine Daten?“ Nein. In der kostenlosen Version gibt es kein Konto und keinen Upload, alle Projekte und Fotos bleiben im Browser auf dem eigenen Gerät. Keine Cookies, kein Tracking. Erst mit Schachtblick Pro (optional, Firmenkonto auf einem Server in Deutschland) gibt es XML-Export, Teamabgleich und KI-Vorschläge.
>
> Zum Ausprobieren gibt es ein Demo-Projekt mit fiktiven Daten. Ich suche Anwender, die es testen und ehrlich sagen, was fehlt.
>
> Was hält euch bisher vom Ausprobieren ab?
>
> #Kanalinspektion #Abwasser #Stadtwerke #ISYBAU #Datenschutz

Den Link bei LinkedIn lieber in den **ersten Kommentar** setzen statt in den Text, das erreicht oft mehr Leute.

## LinkedIn: so gehst du vor

1. **Profil zuerst (30 min).** Foto, Titelbild (nimm `marketing/kommune-post.jpg` zugeschnitten oder das Schachtblick-Logo), Überschrift statt „Inhaber“: *„Software für die Schachtinspektion (ISYBAU, DWA-M 149) · Schachtblick“*. Im Info-Text 3 Sätze: Problem, Lösung, Link.
2. **Unternehmensseite „MMSE Software Engineering“ anlegen** (kostenlos, unter „Unternehmen erstellen“) und dort Schachtblick vorstellen. Die Beiträge selbst postest du aber **über dein persönliches Profil**. Das erreicht deutlich mehr Leute als eine Firmenseite mit null Followern.
3. **Vernetzen (10 Anfragen pro Tag, mit Notiz).** Zielgruppe: Leiter Stadtentwässerung, Kanalnetzbetreiber, Tiefbauämter, Abwasserverbände, Inspektionsfirmen, Ingenieurbüros für Kanalsanierung. Notiz zum Beispiel: *„Guten Tag Herr/Frau …, ich entwickle eine App für die Schachtinspektion und würde mich über Ihre Sicht aus der Praxis freuen.“* Keine Werbung in der ersten Nachricht.
4. **Beiträge:** 1 pro Woche reicht. Karussell als **PDF-Dokument hochladen** (die Seiten sind wischbar und werden oft angeschaut). Kein Link im Beitragstext, sondern im ersten Kommentar. Am Ende eine Frage stellen, damit Antworten kommen.
5. **Kommentieren:** Täglich 3 fachliche Kommentare unter Beiträgen von DWA, Verbänden, Stadtwerken. Das bringt dir Aufmerksamkeit der richtigen Leute, ohne dass du selbst postest.
6. **Gruppen:** Tritt Gruppen zu Kanalsanierung, Abwasser und ISYBAU bei. Erst mitlesen und hilfreich antworten, Eigenwerbung nur wo es die Gruppenregeln erlauben.
7. **Rechtliches:** Schreibe offen „Ich habe die App gebaut“, damit klar ist, dass es dein Produkt ist. Keine Kundenzitate oder Firmennamen ohne Erlaubnis. Auf LinkedIn und Instagram keine personenbezogenen Daten oder erkennbare Schachtbeschriftungen aus Kundenprojekten zeigen.

## Messen

- **Links mit Herkunft:** Instagram-Bio: `https://schachtblick.mmse-software.com/?utm_source=instagram`, LinkedIn: `…/?utm_source=linkedin`, Direktmails: `…/?utm_source=mail`. Die App trackt nicht (keine Cookies); Zahlen siehst du in den Statistiken von Instagram/LinkedIn und im Server-Log.
- **Wöchentlich (10 min):** Instagram Insights: Reichweite, Speicherungen, Link-Klicks. LinkedIn: Impressionen, neue Kontakte aus der Zielgruppe.
- **Nach 8 Wochen entscheiden:** Was hat Klicks gebracht? Das Format wiederholen, den Rest streichen. Als Erfolg zählen: 5 echte Rückmeldungen von Inspekteuren, ein Gespräch mit einer Kommune, die ersten Registrierungen.

## Nicht machen

- Keine gekauften Follower, keine Follow/Unfollow-Taktik.
- Keine Versprechen, die die App nicht hält. Wo die KI vorkommt, steht immer „nur in Schachtblick Pro“ dabei (Bild und Text), und die KI ist nur ein Vorschlag.
- Keine Preise in Beiträgen, solange sie sich ändern können; auf die Info-Seite verlinken.
