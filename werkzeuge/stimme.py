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
    for z in auftrag:
        torch.manual_seed(z.get("seed", 1))
        a = m.generate(z["text"], language_id="de", audio_prompt_path=z["ref"], exaggeration=z.get("ex", 0.7), cfg_weight=0.3, temperature=0.9)
        ta.save(z["aus"], a, m.sr)
        gehoert = " ".join(s.text.strip() for s in ohr.transcribe(z["aus"], language="de")[0]) if ohr else ""
        print(f'   Stimme: „{z["text"]}“ {a.shape[-1] / m.sr:.2f} s  gehört: „{gehoert}“', flush=True)
