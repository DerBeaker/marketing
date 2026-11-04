# CLAUDE.md – Social Media von MMSE Software

Dieses Repo ist der Arbeitsort für **Instagram und Social Media** von MMSE Software Engineering (Manuel Moldan). Account: **@mmse.software.moldan** (bis 04.11.2026 @schachtblick.app), ein Account für alle Apps: Schachtblick, AbscheiderBlick, Abscheider 3D, SpülBlick. Das Repo ist **öffentlich**: Metricool holt die Medien über `raw.githubusercontent.com`.

## Feste Vereinbarungen mit Manuel

- Mit Manuel Deutsch sprechen.
- **Diese Sitzungen machen ausschließlich Social Media.** Zuerst den Skill `.claude/skills/mmse-instagram` laden (Schachtblick-Details: `.claude/skills/schachtblick-instagram`). Die gleichnamigen Skills im App-Repo und im claude.ai-Konto sind veraltet und gelten nicht.
- **App-Repos nur lesen** (`DerBeaker/Schachtinspektions-Tool`, `gi-tool`, `abscheider-3d-tool`, `spuelblick`, `homepagemmse`): per `add_repo` mit `access: read`, nur für Fakten, Screens und lokale Demo-Server. Dort nie committen, pushen oder ZIPs bauen. Nötige App-Änderungen als Auftrag an die App-Sitzung (`send_message`) oder an Manuel; offene Aufträge in `UEBERGABE-APPS.md`. Einzige Ausnahme: Manuel startet eine Sitzung ausdrücklich mit dem App-Repo, damit Doku nachgezogen wird (wie am 04.11.2026) – dann nur `CLAUDE.md` und `.claude/skills/` dort ändern, nie `app/`, und die Regeln des App-Repos (Push auch auf dessen Default-Branch) befolgen.
- **Immer direkt veröffentlichen** (Metricool `autoPublish: true`, `draft: false`), nie Entwürfe. Manuel lädt nichts selbst hoch. Die Metricool-Werkzeuge sind in `.claude/settings.json` ohne Rückfrage freigegeben.
- **Monatslimit Metricool (Gratis-Tarif, ca. 20 Beiträge):** höchstens 18 pro Monat planen.
- **Rhythmus:** 3 Beiträge pro Woche (Mo 18:00, Mi 18:00, Sa 10:00), nicht Schachtblick-lastig. Einzelheiten nur im Skill `mmse-instagram`.
- Nichts Geheimes ins Repo (öffentlich): keine Schlüssel, Zugangsdaten, Kundendaten, Projektfotos ohne Freigabe. Pixabay-Schlüssel nur als Umgebungs-Secret `PIXABAY_KEY`, Pixabay-Rohclips nie committen.
- **Git:** Jede Sitzung hat ihren eigenen `claude/…`-Branch. Zuerst `git fetch origin` und `main` hereinholen; committen, auf den Sitzungs-Branch pushen und **denselben Commit auf `main`** (`git push origin HEAD:main`, nur fast-forward; abgelehnt → `main` zuerst zusammenführen). Metricool und die nächste Sitzung lesen nur `main`. Kein Pull Request.
- Was Manuel dauerhaft festlegt („merk dir“, „schreib das in die CLAUDE.md“), wird an **allen drei Stellen** gleich nachgezogen, sonst laufen sie auseinander: Arbeitsweise → diese Datei, Inhalt/Rhythmus/Look → Skill `mmse-instagram` (bzw. `schachtblick-instagram`), Ablauf der Wochenplanung → Prompt der geplanten Aufgabe (siehe unten). Chatverläufe werden nicht übernommen.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `.claude/skills/` | `mmse-instagram` (alle Apps, Rhythmus, Look, Quellen, Veröffentlichen), `schachtblick-instagram` (Schachtblick-Fakten) |
| `.claude/settings.json` | Freigabe der Metricool-Werkzeuge |
| `werkzeuge/` | `make-reel.mjs` (cinematic Reels mit Sprecher, Szenen in `REELS`), `pixabay.mjs` (Videoclips suchen/laden), `make-instagram.mjs` (Karussells/Storys), `werbung.mjs` (gemeinsamer Stil) |
| `material/` | `schachtblick/` (Demo-Schachtfotos, App-Screens), `screens/` (AbscheiderBlick, Abscheider 3D, SpülBlick), `fotos/` + `LIZENZEN.md` (nur CC0/Pixabay/eigene; auch die Pixabay-Clip-IDs), `clips/` (nur lokal, gitignored), `marken/` (MMSE-Logo, Zeichen, Profilbild), `icons.json` |
| `reels/`, `kw44/`, `marken/` | fertige Medien (öffentlich verlinkt); `posts/` und `storys/` entstehen bei Bedarf |
| `REDAKTIONSPLAN.md` | Plan, Strategie, Termine, was schon lief |
| `UEBERGABE-APPS.md` | Aufträge an die App-Sitzungen |

## Befehle

```bash
PIPER_BIN=<venv>/bin/piper node werkzeuge/make-reel.mjs <name>   # reels/reel-<name>.mp4 + Cover (Playwright global, ffmpeg)
PIXABAY_KEY=… node werkzeuge/pixabay.mjs --suche "gas station"     # Clips suchen (KI-Clips ausgefiltert); mit <ID> … laden nach material/clips/
node werkzeuge/make-instagram.mjs [start|ki|kommune|kw44]          # posts/instagram/
```

Voraussetzungen: globales Playwright (`npm root -g`), ffmpeg, ImageMagick, piper + Modell in `.cache/piper/` (Anleitung im Skill). `.cache/` ist nicht im Repo.

## Wöchentliche Automatik

Die geplante Aufgabe **„MMSE Wochenplanung Instagram“** (sonntags 18:48 Europe/Berlin, jede Ausführung startet eine neue Sitzung; finden mit `list_triggers`) klont dieses Repo, plant die Folgewoche (Mo/Mi/Sa) nach dem Skill, veröffentlicht direkt, schreibt `REDAKTIONSPLAN.md` fort und schickt Manuel einen Bericht mit den Videos. Ihr Auftrag steht im Prompt der Aufgabe (ändern mit `update_trigger`, Feld `prompt`); inhaltliche Regeln stehen nur im Skill, der Prompt verweist darauf und wiederholt nur die Eckwerte.
