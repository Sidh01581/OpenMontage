"""Voice lines for BUSY. via the piper_tts tool (cast d-004, approved: 4 installed voices, one per character).
Usage: python make_vo.py [line_id ...]   (no args = all lines)"""
import subprocess, sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from tools.tool_registry import registry

OUT = Path(__file__).parent / "vo"
N = "loudnorm=I=-16:TP=-1.5"
CAST = {  # role -> (piper model, length_scale, ffmpeg post filter)
    "theo":         ("en_US-joe-medium", 0.92, f"highpass=f=90,{N}"),
    "theo_whisper": ("en_US-joe-medium", 1.0, f"highpass=f=140,treble=g=2,{N}"),
    "theo_tired":   ("en_US-joe-medium", 1.15, f"highpass=f=110,lowpass=f=5000,{N}"),
    "dev":          ("en_US-bryce-medium", 1.05, f"highpass=f=80,bass=g=2,{N}"),
    "priya":        ("en_US-lessac-medium", 0.95, f"highpass=f=90,{N}"),
    "narrator":     ("en_US-ryan-high", 1.05, f"highpass=f=70,{N}"),
}
# id: dict(role, text, tts=None, ls=None, ss=None, pitch=semitones, extra=ffmpeg filter appended)
LINES = {
    # Theo narrates the whole film, nature-doc / sports-commentator energy (user script, Nov 24 2026).
    "T01": dict(role="theo", text="Here comes Dev!", tts="Here comes, Dev!", ls=1.0),
    "T02": dict(role="theo", text="Always busy, always in a hurry...", ss=0.3),
    "T03": dict(role="theo", text="You'd think he's running the entire company!"),
    "T04": dict(role="theo", text="Look at him!"),
    "T05": dict(role="theo", text="Walking fast, carrying random papers, checking his watch...", ss=0.25),
    "T06": dict(role="theo", text="Nobody knows what he's doing, but he definitely looks important!", ss=0.25),
    "T07": dict(role="theo", text="And when he gets to his desk, the real magic begins."),
    "T08": dict(role="theo", text="Ten windows open, keyboard going crazy, eyes locked on the screen!", ss=0.25),
    "T09": dict(role="theo", text="Oh, wait! The manager is coming!", ss=0.25),
    "T10": dict(role="theo", text="Watch Dev transform into the busiest employee of the year!", tts="Watch, Dev, transform into the busiest employee of the year!", ls=1.05, ss=0.1),
    "T11": dict(role="theo", text="And the moment the manager leaves...", ls=1.0),
    "T12": dict(role="theo", text="Look at that! Back to doing absolutely nothing.", ss=0.3),
    "T13": dict(role="theo", text="Dev, you're not working hard...", tts="Devv, you're not working hard...", ls=1.15),
    "T14": dict(role="theo", text="you're working on your image!", ls=0.95),
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
