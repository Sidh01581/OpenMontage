"""Voice lines for WE NEED TO TALK. via the piper_tts tool (voice cast d-004, approved).
Usage: python make_vo.py [line_id ...]   (no args = all lines)"""
import subprocess, sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from tools.tool_registry import registry

OUT = Path(__file__).parent / "vo"
CAST = {  # role -> (piper model, length_scale, ffmpeg post filter)
    "priya":   ("en_US-lessac-medium", 1.12, "highpass=f=90,loudnorm=I=-16:TP=-1.5"),
    "priya_warm": ("en_US-lessac-medium", 0.95, "highpass=f=90,treble=g=3,loudnorm=I=-15:TP=-1.5"),  # no pitch shift: it turned "hike" into "height"
    "theo":    ("en_US-joe-medium", 0.82, "highpass=f=90,loudnorm=I=-16:TP=-1.5"),
    "theo_croak": ("en_US-joe-medium", 1.25, "asetrate=22050*0.94,aresample=22050,atempo=1.06,lowpass=f=3800,highpass=f=120,loudnorm=I=-17:TP=-1.5"),
    "whatif":  ("en_US-hfc_male-medium", 0.9, "asetrate=22050*1.335,aresample=22050,atempo=0.75,vibrato=f=9:d=0.35,tremolo=f=28:d=0.35,highpass=f=180,loudnorm=I=-16:TP=-1.5"),
    "narrator": ("en_US-ryan-high", 1.05, "highpass=f=70,loudnorm=I=-16:TP=-1.5"),
}
LINES = {
    "P01": ("priya", "Hey, Theo... we need to talk. Tomorrow."),
    "W01": ("whatif", "talk about what?"),
    "T01": ("theo", "Okay. Okay. She's firing me."),
    "W02": ("whatif", "What if you're fired?"),
    "W03": ("whatif", "What if no one ever hires you again?"),
    "W04": ("whatif", "What if Mochi has to get a job?", "What if Moe-chee has to get a job?"),
    "T02": ("theo", "I'll live under a bridge. With noodles.", None, 0.95),
    "W05": ("whatif", "what if... what if... what if..."),
    "T03": ("theo", "I can explain. Whatever it is."),
    "P02": ("priya", "Sit down."),
    "P03": ("priya", "So..."),
    "P04": ("priya_warm", "Congratulations! We want to discuss your... hike!"),
    "T04": ("theo_croak", "I didn't sleep for this."),
    "N01": ("narrator", "Your brain wrote the worst ending. Reality never read it."),
    "W06": ("whatif", "But what if the hike is small?"),
}

def main(ids):
    registry.discover()
    tts = registry._tools["piper_tts"]
    log = {}
    for lid in ids:
        role, text, *opt = LINES[lid]
        model, ls, post = CAST[role]
        tts_text = (opt[0] if opt and opt[0] else text)
        if len(opt) > 1: ls = opt[1]
        raw = OUT / f"{lid}_raw.wav"
        r = tts.execute({"text": tts_text, "model": model, "length_scale": ls, "sentence_silence": 0.08 if role.startswith("theo") and role!="theo_croak" else 0.25, "output_path": str(raw)})
        if not r.success:
            raise SystemExit(f"{lid}: {r.error}")
        out = OUT / f"{lid}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                        f"{post},silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,aresample=44100",
                        "-ac", "1", str(out)], check=True)
        d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)]))
        log[lid] = {"role": role, "model": model, "length_scale": ls, "text": text, "tts_text": tts_text, "duration": round(d, 3)}
        print(f"{lid} {role:11s} {d:5.2f}s  {text}")
    p = OUT / "vo_log.json"
    old = json.loads(p.read_text()) if p.exists() else {}
    old.update(log); p.write_text(json.dumps(old, indent=2))

if __name__ == "__main__":
    main(sys.argv[1:] or list(LINES))
