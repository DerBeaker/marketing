# CLAUDE.md – Social Media von MMSE Software

Dieses Repo ist der Arbeitsort für **Instagram und Social Media** von MMSE Software Engineering (Manuel Moldan). Account: **@mmse.software.moldan**. Es ist **öffentlich**: Metricool holt die Medien über `raw.githubusercontent.com`.

## Feste Vereinbarungen mit Manuel

- Mit Manuel Deutsch sprechen.
- **Diese Sitzungen machen ausschließlich Social Media.** Zuerst den Skill `.claude/skills/mmse-instagram` laden (Schachtblick-Details: `.claude/skills/schachtblick-instagram`).
- **App-Repos nur lesen** (`DerBeaker/Schachtinspektions-Tool`, `gi-tool`, `abscheider-3d-tool`, `spuelblick`, `homepagemmse`): per `add_repo` mit `access: read`, nur für Fakten, Screens und lokale Demo-Server. Dort nie committen, pushen oder ZIPs bauen. Nötige App-Änderungen als Auftrag an die App-Sitzung (`send_message`) oder an Manuel; offene Aufträge in `UEBERGABE-APPS.md`.
- **Immer direkt veröffentlichen** (Metricool `autoPublish: true`, `draft: false`), nie Entwürfe. Manuel lädt nichts selbst hoch.
- **Monatslimit Metricool (Gratis-Tarif, ca. 20 Beiträge):** höchstens 18 pro Monat planen.
- Nichts Geheimes ins Repo (öffentlich): keine Schlüssel, Zugangsdaten, Kundendaten, Projektfotos ohne Freigabe. Pixabay-Schlüssel nur als Umgebungs-Secret `PIXABAY_KEY`.
- Committen und auf `main` pushen ist erlaubt und nötig (Metricool liest von dort). Kein Pull Request.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `.claude/skills/` | `mmse-instagram` (alle Apps, Look, Quellen, Veröffentlichen), `schachtblick-instagram` (Schachtblick-Fakten) |
| `werkzeuge/` | `make-reel.mjs` (cinematic Reels mit Sprecher), `make-instagram.mjs` (Karussells/Storys), `werbung.mjs` (gemeinsamer Stil) |
| `material/` | `schachtblick/` (Demo-Schachtfotos, App-Screens), `screens/` (AbscheiderBlick, Abscheider 3D, SpülBlick), `fotos/` + `LIZENZEN.md` (nur CC0/Pixabay/eigene), `marken/` (MMSE-Logo, Profilbild), `icons.json` |
| `reels/`, `posts/`, `storys/`, `kw44/` | fertige Medien (öffentlich verlinkt) |
| `REDAKTIONSPLAN.md` | Plan, Strategie, Termine |
| `UEBERGABE-APPS.md` | Aufträge an die App-Sitzungen |

## Befehle

```bash
PIPER_BIN=<venv>/bin/piper node werkzeuge/make-reel.mjs <name>   # reels/reel-<name>.mp4 + Cover (Playwright global, ffmpeg)
node werkzeuge/make-instagram.mjs [start|ki|kommune|kw44]          # posts/instagram/
```

Voraussetzungen: globales Playwright (`npm root -g`), ffmpeg, ImageMagick, piper + Modell in `.cache/piper/` (Anleitung im Skill). `.cache/` ist nicht im Repo.

## Wöchentliche Automatik

Die geplante Aufgabe „MMSE Wochenplanung Instagram“ läuft sonntags abends, plant die nächste Woche nach dem Skill und veröffentlicht direkt. Ihr Auftrag steht in der Aufgabe selbst; inhaltliche Regeln nur im Skill pflegen.
