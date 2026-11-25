# Sprechtexte für die Trickfilme mit Chatterbox (MIT-Lizenz, läuft lokal auf der CPU) vertonen.
# Aufruf (von make-cartoon.mjs): <venv>/bin/python werkzeuge/stimme.py auftrag.json
# auftrag.json: [{"ref": ".cache/stimmen/manuel.wav", "text": "…", "ex": 1.1, "seed": 21, "aus": "….wav"}, …]
# Stimmproben liegen nur lokal in .cache/stimmen/ (nicht im Repo): manuel.wav = Manuels eigene Stimme, mann.wav/frau.wav = Referenzen.
# Vorhandene Dateien bleiben (Zwischenspeicher), damit ein neuer Lauf dieselben Längen hat. Mit faster-whisper wird jede Zeile gegengehört.
import json, os, sys
auftrag = [z for z in json.load(open(sys.argv[1])) if not os.path.exists(z["aus"])]
if auftrag:
    import torch, torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    try:
        from faster_whisper import WhisperModel
        ohr = WhisperModel("small", device="cpu", compute_type="int8")
    except Exception:
        ohr = None
    import difflib, re
    norm = lambda t: re.sub(r"[^a-zäöüß0-9 ]", "", t.lower())
    for z in auftrag:
        # mehrere Anläufe: der verständlichste (gegengehört) gewinnt, zu lange (passt auch 30 % schneller nicht in die Lücke) verlieren
        beste = None
        for k in range(z.get("versuche", 4)):
            torch.manual_seed(z.get("seed", 1) + 100 * k)
            a = m.generate(z["text"], language_id="de", audio_prompt_path=z["ref"], exaggeration=z.get("ex", 0.7), cfg_weight=0.3, temperature=0.9)
            ta.save(z["aus"] + ".tmp.wav", a, m.sr)
            d = a.shape[-1] / m.sr
            gehoert = " ".join(s.text.strip() for s in ohr.transcribe(z["aus"] + ".tmp.wav", language="de")[0]) if ohr else ""
            note = difflib.SequenceMatcher(None, norm(z["text"]), norm(gehoert)).ratio() if ohr else 1
            passt = not z.get("max") or d <= z["max"] * 1.3
            if beste is None or note - (0 if passt else 0.4) > beste[0]: beste = (note - (0 if passt else 0.4), a, d, gehoert)
            if note > 0.85 and passt: break
        ta.save(z["aus"], beste[1], m.sr); os.remove(z["aus"] + ".tmp.wav")
        print(f'   Stimme: „{z["text"]}“ {beste[2]:.2f} s  Note {beste[0]:.2f}  gehört: „{beste[3]}“', flush=True)
