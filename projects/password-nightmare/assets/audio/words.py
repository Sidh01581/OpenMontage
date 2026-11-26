"""Word timestamps for each voice line (faster-whisper, local). Writes vo/words.json and prints a transcript check."""
import json, sys
from pathlib import Path
from faster_whisper import WhisperModel
VO = Path(__file__).parent / "vo"
log = json.loads((VO / "vo_log.json").read_text())
ids = sys.argv[1:] or list(log)
m = WhisperModel("base.en", device="cpu", compute_type="int8")
p = VO / "words.json"; out = json.loads(p.read_text()) if p.exists() else {}
for lid in ids:
    segs, _ = m.transcribe(str(VO / f"{lid}.wav"), word_timestamps=True, language="en")
    words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
    out[lid] = words
    print(f"{lid}: heard {' '.join(w['w'] for w in words)!r}  | script {log[lid]['text']!r}")
p.write_text(json.dumps(out, indent=1))
