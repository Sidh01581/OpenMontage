"""Voice lines for QUICK SYNC. via the piper_tts tool (cast d-004, approved: Theo joe, Dev bryce, Priya lessac).
Usage: python make_vo.py [line_id ...]   (no args = all lines)"""
import subprocess, sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from tools.tool_registry import registry

OUT = Path(__file__).parent / "vo"
N = "loudnorm=I=-16:TP=-1.5"
CAST = {  # role -> (piper model, length_scale, ffmpeg post filter)
    "theo":    ("en_US-joe-medium", 0.92, f"highpass=f=90,{N}"),
    "theo_vo": ("en_US-joe-medium", 1.0, f"highpass=f=110,lowpass=f=7000,{N}"),  # dry inner voice
    "dev":     ("en_US-bryce-medium", 0.9, f"highpass=f=80,bass=g=2,{N}"),
    "priya":   ("en_US-lessac-medium", 0.92, f"highpass=f=90,{N}"),
}
# id: dict(role, text, tts=None, ls=None, ss=None, pitch=semitones, extra=ffmpeg filter appended)
LINES = {
    "P01": dict(role="priya", text="Thanks for joining, everyone! This will be quick.", ss=0.3),
    "T01": dict(role="theo_vo", text="It was not quick.", ls=1.05),
    "P02": dict(role="priya", text="Slide one: the agenda.", ss=0.3),
    "T02": dict(role="theo_vo", text="The agenda was \"discuss the agenda.\"", tts="The agenda was, discuss the agenda."),
    "P03": dict(role="priya", text="First, let's go around and introduce ourselves.", ss=0.25),
    "T03": dict(role="theo", text="We've worked together for three years.", ls=1.0),
    "P04": dict(role="priya", text="Can everyone see my screen?"),
    "D01": dict(role="dev", text="We can see your desktop."),
    "P05": dict(role="priya", text="How about now?"),
    "D02": dict(role="dev", text="Still your desktop.", tts="Still, your desktop.", ls=1.05),
    "T04": dict(role="theo_vo", text="Forty minutes later...", ls=1.1),
    "P06": dict(role="priya", text="So, the big update is... the printer is fixed.", ss=0.45),
    "T05": dict(role="theo", text="That could have been an email.", ls=1.05),
    "P07": dict(role="priya", text="Great point, Theo! Let's schedule a meeting to discuss that.", ss=0.25),
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
