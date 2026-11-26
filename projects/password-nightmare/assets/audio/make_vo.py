"""Voice lines for THE PASSWORD NIGHTMARE. via the piper_tts tool (cast approved: Dev bryce, Theo joe, Priya lessac, SYSTEM amy + robotic filter).
Usage: python make_vo.py [line_id ...]   (no args = all lines)"""
import subprocess, sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from tools.tool_registry import registry

OUT = Path(__file__).parent / "vo"
N = "loudnorm=I=-16:TP=-1.5"
ROBOT = "highpass=f=180,lowpass=f=6500,aecho=0.8:0.6:7:0.3"
CAST = {  # role -> (piper model, length_scale, ffmpeg post filter)
    "dev":    ("en_US-bryce-medium", 0.9, f"highpass=f=80,bass=g=2,{N}"),
    "theo":   ("en_US-joe-medium", 0.92, f"highpass=f=90,{N}"),
    "priya":  ("en_US-lessac-medium", 0.92, f"highpass=f=90,{N}"),
    "system": ("en_US-amy-medium", 1.0, f"{ROBOT},{N}"),
}
# id: dict(role, text, tts=None, ls=None, ss=None, pitch=semitones, extra=ffmpeg filter appended)
LINES = {
    "D01": dict(role="dev", text="Easy.", ls=1.1),
    "S01": dict(role="system", text="Must contain a capital letter."),
    "D02": dict(role="dev", text="Capital P."),
    "S02": dict(role="system", text="And a number."),
    "D03": dict(role="dev", text="Password one."),
    "S03": dict(role="system", text="And a symbol."),
    "D04": dict(role="dev", text="Password one, exclamation mark!"),
    "S04": dict(role="system", text="Cannot contain the word \"password.\"", tts="Cannot contain the word, password."),
    "T01": dict(role="theo", text="Just use your cat's name."),
    "S05": dict(role="system", text="Cannot contain your pet's name."),
    "D05": dict(role="dev", text="How does it know about Mochi?!", tts="How does it know about Moe chee?"),
    "S06": dict(role="system", text="Must contain a hieroglyph and the current phase of the moon.", tts="Must contain a hieroglyph, and the current phase of the moon."),
    "P01": dict(role="priya", text="Ooh, mine had to rhyme!", tts="Oooh, mine had to rhyme!"),
    "D06": dict(role="dev", text="It's a waxing gibbous. I checked.", tts="It's a waxing gibbus. I checked.", ss=0.3),
    "S07": dict(role="system", text="Cannot match your last two hundred passwords."),
    "S08": dict(role="system", text="Strong password!", ls=0.95),
    "D07": dict(role="dev", text="...What did you type?", tts="What did you type?", ls=1.05),
    "S09": dict(role="system", text="Please confirm your password."),
}

def main(ids):
    registry.discover()
    tts = registry._tools["piper_tts"]
    log = {}
    for lid in ids:
        L = LINES[lid]; role, text = L["role"], L["text"]
        model, ls, post = CAST[role]
        tts_text = L.get("tts") or text
        ls = L.get("ls") or ls
        ss = L.get("ss", 0.2)
        if L.get("pitch"):
            k = 2 ** (L["pitch"] / 12)
            post = f"asetrate=22050*{k:.4f},aresample=22050,atempo={1 / k:.4f}," + post
        trim = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.04,areverse"
        if L.get("extra"):
            trim = trim + "," + L["extra"]
        raw = OUT / f"{lid}_raw.wav"
        r = tts.execute({"text": tts_text, "model": model, "length_scale": ls, "sentence_silence": ss, "output_path": str(raw)})
        if not r.success:
            raise SystemExit(f"{lid}: {r.error}")
        out = OUT / f"{lid}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                        f"{post},{trim},aresample=44100", "-ac", "1", str(out)], check=True)
        d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)]))
        log[lid] = {"role": role, "model": model, "length_scale": ls, "text": text, "tts_text": tts_text, "duration": round(d, 3)}
        print(f"{lid} {role:12s} {d:5.2f}s  {text}")
    p = OUT / "vo_log.json"
    old = json.loads(p.read_text()) if p.exists() else {}
    old.update(log); p.write_text(json.dumps(old, indent=2))

if __name__ == "__main__":
    main(sys.argv[1:] or list(LINES))
