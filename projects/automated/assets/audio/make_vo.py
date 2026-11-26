"""Voice lines for AUTOMATED. via the piper_tts tool (cast approved: Dev bryce, Theo joe, Priya lessac, Robot amy + robotic filter).
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
    "robot":  ("en_US-amy-medium", 0.95, f"{ROBOT},{N}"),
}
# id: dict(role, text, tts=None, ls=None, ss=None, pitch=semitones, extra=ffmpeg filter appended)
LINES = {
    "R01": dict(role="robot", text="Hello, Dev. I will do your job now.", tts="Hello, Devv! I will do your job now.", pitch=2, ls=0.88),
    "D01": dict(role="dev", text="Perfect.", ls=1.05),
    "D02": dict(role="dev", text="I automated my entire job. Now AI works for me.", tts="I automated my entire job. Now, A.I. works for me."),
    "T01": dict(role="theo", text="So what do you do now?"),
    "D03": dict(role="dev", text="Nothing.", ls=1.1),
    "R02": dict(role="robot", text="Email sent.", pitch=2),
    "R03": dict(role="robot", text="Email sent. Email sent.", pitch=2, ls=0.85, ss=0.3),
    "P01": dict(role="priya", text="Dev, why is the system sending five hundred emails?"),
    "D04": dict(role="dev", text="My AI? It's working overtime.", tts="My A.I.? It's working overtime."),
    "P02": dict(role="priya", text="It's emailing the entire company every ten seconds!"),
    "D05": dict(role="dev", text="That's called productivity. Maybe we just have too much work."),
    "P03": dict(role="priya", text="Dev, we don't need you anymore. We're keeping the robot.", ss=0.3),
    "D06": dict(role="dev", text="WHAT?!", tts="What?!", ls=0.9),
    "P04": dict(role="priya", text="The robot doesn't take breaks, doesn't complain, and works 24/7.", tts="The robot doesn't take breaks, doesn't complain, and works twenty four seven."),
    "D07": dict(role="dev", text="But I created it!"),
    "P05": dict(role="priya", text="Exactly. That's your last successful contribution.", ss=0.3),
    "T02": dict(role="theo", text="Congratulations, Dev. You automated yourself out of a job.", tts="Congratulations, Devv! You automated yourself out of a job.", ss=0.25),
    "D08": dict(role="dev", text="Can the robot automate my new job too?"),
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
