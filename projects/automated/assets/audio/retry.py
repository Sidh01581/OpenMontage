"""Re-voice a line until Whisper hears the expected words. Usage: python retry.py ID "tts text" "regex" [tries]"""
import re, sys, json
from pathlib import Path
import make_vo
from faster_whisper import WhisperModel
lid, tts, rx = sys.argv[1], sys.argv[2], sys.argv[3]
tries = int(sys.argv[4]) if len(sys.argv) > 4 else 6
make_vo.LINES[lid]["tts"] = tts
m = WhisperModel("base.en", device="cpu", compute_type="int8")
for i in range(tries):
    make_vo.main([lid])
    segs, _ = m.transcribe(str(make_vo.OUT / f"{lid}.wav"), language="en")
    heard = " ".join(s.text.strip() for s in segs)
    ok = re.search(rx, heard, re.I) is not None
    print(f"  try {i}: {heard!r} {'OK' if ok else ''}")
    if ok:
        break
