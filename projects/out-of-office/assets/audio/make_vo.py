"""Voice lines for OUT OF OFFICE. via the piper_tts tool (cast d-004, approved: Theo joe, Dev bryce, Priya lessac).
Usage: python make_vo.py [line_id ...]   (no args = all lines)"""
import subprocess, sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from tools.tool_registry import registry

OUT = Path(__file__).parent / "vo"
N = "loudnorm=I=-16:TP=-1.5"
CAST = {  # role -> (piper model, length_scale, ffmpeg post filter)
    "theo":        ("en_US-joe-medium", 0.92, f"highpass=f=90,{N}"),
    "dev":         ("en_US-bryce-medium", 0.9, f"highpass=f=80,bass=g=2,{N}"),
    "priya_phone": ("en_US-lessac-medium", 0.95, f"highpass=f=300,lowpass=f=3400,acompressor=threshold=-20dB:ratio=4,{N}"),  # through Dev's phone
    "priya":       ("en_US-lessac-medium", 0.95, f"highpass=f=90,{N}"),
}
# id: dict(role, text, tts=None, ls=None, ss=None, pitch=semitones, extra=ffmpeg filter appended)
LINES = {
    "T01": dict(role="theo", text="After months of hard work, Dev finally took a day off. No emails, no meetings. Just sun, sand and zero responsibilities!", tts="After months of hard work, Dev, finally took a day off. No emails, no meetings. Just sun, sand, and zero responsibilities!", ss=0.3),
    "D01": dict(role="dev", text="Seriously? Who calls someone at the beach?", ss=0.3),
    "P01": dict(role="priya_phone", text="Dev! The servers are down! We need you online, right now!", ss=0.2),
    "D02": dict(role="dev", text="But boss... I'm on vacation!", ss=0.35),
    "P02": dict(role="priya_phone", text="I don't care! The CEO is asking questions!", ss=0.2),
    "T02": dict(role="theo", text="Thousands of employees, an entire IT department... and it all depends on Dev's beach vacation!", tts="Thousands of employees, an entire IT department... and it all depends on Dev's... beach vacation!", ss=0.3),
    "D03": dict(role="dev", text="Okay, boss. I'll take care of it.", ss=0.3),
    "P03": dict(role="priya_phone", text="You're a lifesaver, Dev! We'll remember this!", ss=0.2),
    "D04": dict(role="dev", text="Great! Can I get a day off next week?", ss=0.25),
    "P04": dict(role="priya_phone", text="Sure! Let's discuss it in Monday's meeting.", ss=0.25),
    "T03": dict(role="theo", text="Lesson learned: you can leave the office, but the office never leaves you!", ss=0.3),
    "D05": dict(role="dev", text="Next vacation... somewhere with NO WIFI!", tts="Next vacation... somewhere with no Wi-Fi!", ss=0.4),
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
