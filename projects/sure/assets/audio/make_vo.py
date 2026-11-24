"""Voice lines for SURE. via the piper_tts tool (cast d-004, approved: 6 voices, one per character).
Usage: python make_vo.py [line_id ...]   (no args = all lines)
LINES entries: (role, caption text, [tts text override], [length_scale override], [sentence_silence override])"""
import subprocess, sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from tools.tool_registry import registry

OUT = Path(__file__).parent / "vo"
N = "loudnorm=I=-16:TP=-1.5"
CAST = {  # role -> (piper model, length_scale, ffmpeg post filter)
    "theo":     ("en_US-joe-medium", 0.88, f"highpass=f=90,{N}"),
    "theo_tired": ("en_US-joe-medium", 1.15, f"highpass=f=110,lowpass=f=5000,{N}"),
    "sure":     ("en_US-hfc_male-medium", 0.95, f"asetrate=22050*1.5,aresample=22050,atempo=0.82,highpass=f=200,treble=g=4,{N}"),
    "sure_chant": ("en_US-hfc_male-medium", 1.1, f"asetrate=22050*1.35,aresample=22050,atempo=0.85,highpass=f=200,treble=g=4,{N}"),
    "priya":    ("en_US-lessac-medium", 1.0, f"highpass=f=90,{N}"),
    "dev":      ("en_US-bryce-medium", 0.95, f"highpass=f=90,{N}"),
    "mom":      ("en_US-amy-medium", 0.95, f"highpass=f=300,lowpass=f=3400,acompressor=threshold=-20dB:ratio=4,{N}"),  # phone filter
    "narrator": ("en_US-ryan-high", 1.05, f"highpass=f=70,{N}"),
}
# id: dict(role, text, tts=None, ls=None, ss=None, pitch=semitones, extra=ffmpeg filter appended)
LINES = {
    "D01": dict(role="dev", text="Hey there, Theo. Quick favor?", ls=1.0),
    "T01": dict(role="theo", text="Sure!", ls=1.6),
    "S01": dict(role="sure", text="Say yes. Everyone will love you."),
    "P01": dict(role="priya", text="Could you cover Friday's report?"),
    "T02": dict(role="theo", text="Sure!", ls=1.6),
    "D02": dict(role="dev", text="Help me move this Saturday?", ls=1.0),
    "T03": dict(role="theo", text="Sure!", ls=1.6),
    "M01": dict(role="mom", text="Honey, can you bring three desserts to your aunt's?", ls=1.0),
    "T04": dict(role="theo", text="Sure!", ls=1.6),
    "S02": dict(role="sure_chant", text="Sure! Sure! Sure!", ls=1.1, ss=0.25),
    "T05": dict(role="theo_tired", text="I said yes to... everything.", ss=0.45),
    "S03": dict(role="sure", text="Just one more.", ls=1.1, extra="volume=0.6,aecho=0.6:0.5:60:0.3"),
    "T06": dict(role="theo", text="No. No. NO!", tts="No. No. No!", ls=1.1, ss=0.6),
    "P02": dict(role="priya", text="Oh, Theo, you've worked so hard."),
    "P03": dict(role="priya", text="Want to take Friday off?"),
    "T07": dict(role="theo", text="NO!", tts="No!", ls=1.2),
    "P04": dict(role="priya", text="...Okay!", tts="Okay!", ls=1.05),
    "T08": dict(role="theo", text="Wait, what?", ls=1.3),
    "N01": dict(role="narrator", text="Learn to say no. Just maybe... not to that.", ss=0.35),
    "S04": dict(role="sure", text="Want to help me with something?"),
    "T09": dict(role="theo", text="Su—", tts="Sure!", ls=1.3, extra="atrim=0:0.17,afade=t=out:st=0.14:d=0.03"),
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
        trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
        if L.get("extra"):
            trim = trim + "," + L["extra"]
        raw = OUT / f"{lid}_raw.wav"
        r = tts.execute({"text": tts_text, "model": model, "length_scale": ls, "sentence_silence": ss, "output_path": str(raw)})
        if not r.success:
            raise SystemExit(f"{lid}: {r.error}")
        out = OUT / f"{lid}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                        f"{post},{trim},aresample=44100",
                        "-ac", "1", str(out)], check=True)
        d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)]))
        log[lid] = {"role": role, "model": model, "length_scale": ls, "text": text, "tts_text": tts_text, "duration": round(d, 3)}
        print(f"{lid} {role:10s} {d:5.2f}s  {text}")
    p = OUT / "vo_log.json"
    old = json.loads(p.read_text()) if p.exists() else {}
    old.update(log); p.write_text(json.dumps(old, indent=2))

if __name__ == "__main__":
    main(sys.argv[1:] or list(LINES))
