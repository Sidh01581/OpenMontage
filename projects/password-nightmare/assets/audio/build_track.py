"""Build one cue sheet into: mixed WAV (voices + SFX, no music), per-line mouth envelopes, and word captions.

Usage: python build_track.py <cue_name>
Reads  remotion-composer/projects/password-nightmare/cues/<cue_name>.json
Writes remotion-composer/projects/password-nightmare/public/<cue_name>_mix.wav
       remotion-composer/projects/password-nightmare/mouth_env.json   (merged, all lines)
       remotion-composer/projects/password-nightmare/captions_<cue_name>.json
       projects/password-nightmare/assets/audio/<cue_name>_mix.wav (copy)

Cue sheet: {"duration_s", "vo": [{"id","at","gain"?,"cap_y"?}], "sfx": [{"name","at","gain","dur"?,"fade"?,"ramp_to"?}],
            "silence": [[t0,t1], ...]  # hard silence windows (everything muted)}
"""
import json, re, subprocess, sys, wave
from pathlib import Path
import numpy as np

SR = 44100
FPS = 24
HERE = Path(__file__).parent
REPO = HERE.parents[3]
RC = REPO / "remotion-composer/projects/password-nightmare"
VO = HERE / "vo"
SFX = HERE / "sfx"


def read_wav(p):
    with wave.open(str(p)) as w:
        sr, ch, n = w.getframerate(), w.getnchannels(), w.getnframes()
        x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(float) / 32768
    if ch > 1:
        x = x.reshape(-1, ch).mean(1)
    if sr != SR:
        x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    return x


def mouth_env(x):
    hop = SR // FPS
    n = int(np.ceil(len(x) / hop))
    rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) if len(x[i * hop:(i + 1) * hop]) else 0 for i in range(n)])
    ref = np.percentile(rms[rms > 0], 90) if (rms > 0).any() else 1
    e = np.clip((rms / ref - 0.12) / 0.88, 0, 1)
    return [round(float(v), 3) for v in e] + [0.0] * 4


def tokens(text):
    return [t for t in text.split() if re.search(r"\w", t)]


def clean(tok):
    tok = tok.strip()
    tok = re.sub(r"^\.+", "", tok)
    tok = re.sub(r"[.,]+$", "", tok) if not tok.endswith("...") else tok.rstrip(".") + "…"
    return tok.upper()


def line_words(lid, text, words):
    toks = tokens(text)
    if len(words) == len(toks):
        return [(clean(t), w["s"], w["e"], bool(re.search(r"[.?!,…]$", t))) for t, w in zip(toks, words)]
    t0, t1 = (words[0]["s"], words[-1]["e"]) if words else (0, 1)
    L = np.array([len(t) + 2 for t in toks], float); c = np.concatenate([[0], np.cumsum(L)]) / L.sum()
    return [(clean(t), t0 + (t1 - t0) * c[i], t0 + (t1 - t0) * c[i + 1], bool(re.search(r"[.?!,…]$", t))) for i, t in enumerate(toks)]


def groups(ws, at, speaker, cap_y, max_words=3):
    """Split at sentence punctuation, then balance each sentence into groups of <= max_words (no 1-word orphans)."""
    sents, cur = [], []
    for w, s, e, brk in ws:
        cur.append({"w": w, "s": round(at + s, 3), "e": round(at + e, 3)})
        if brk:
            sents.append(cur); cur = []
    if cur:
        sents.append(cur)
    out = []
    for sent in sents:
        n = len(sent); k = -(-n // max_words)
        if n == max_words + 1 and sum(len(w["w"]) for w in sent) + n - 1 <= 18:
            k = 1  # short 4-word phrase ("ALWAYS IN A HURRY…") reads better whole
            out.append(sent); continue
        sizes = [n // k + (1 if i < n % k else 0) for i in range(k)]
        i = 0
        for z in sizes:
            out.append(sent[i:i + z]); i += z
    return [{"speaker": speaker, "y": cap_y, "words": g} for g in out]


def main(name):
    cue = json.loads((RC / "cues" / f"{name}.json").read_text())
    log = json.loads((VO / "vo_log.json").read_text())
    words = json.loads((VO / "words.json").read_text())
    n = int(cue["duration_s"] * SR)
    voice = np.zeros(n); fx = np.zeros(n)
    menv_p = RC / "mouth_env.json"
    menv = json.loads(menv_p.read_text()) if menv_p.exists() else {}
    caps = []
    for v in cue["vo"]:
        x = read_wav(VO / f"{v['id']}.wav") * v.get("gain", 1.0)
        i = int(v["at"] * SR); j = min(n, i + len(x)); voice[i:j] += x[: j - i]
        menv[v["id"]] = mouth_env(x)
        role = log[v["id"]]["role"].split("_")[0]
        if not v.get("no_caption"):
            caps += groups(line_words(v["id"], log[v["id"]]["text"], words.get(v["id"], [])), v["at"], role, v.get("cap_y", 1440))
    for s in cue["sfx"]:
        x = read_wav(SFX / f"{s['name']}.wav")
        if "dur" in s:
            x = x[: int(s["dur"] * SR)]
        fo = int(s.get("fade", 0.05) * SR)
        if fo and len(x) > fo:
            x = x.copy(); x[-fo:] *= np.linspace(1, 0, fo)
        g = np.full(len(x), s["gain"])
        if "ramp_to" in s:
            g = np.linspace(s["gain"], s["ramp_to"], len(x))
        i = int(s["at"] * SR); j = min(n, i + len(x)); fx[i:j] += (x * g)[: j - i]
    # light ducking of SFX under voice (sitcom clarity on phone speakers)
    venv = np.convolve(np.abs(voice), np.ones(2048) / 2048, mode="same")
    duck = 1 - 0.45 * np.clip(venv / 0.05, 0, 1)
    mix = voice + fx * duck
    for a, b in cue.get("silence", []):
        mix[int(a * SR): int(b * SR)] = 0
    raw = HERE / f"{name}_mix_raw.wav"
    with wave.open(str(raw), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix / max(1e-9, np.abs(mix).max()) * 0.9, -1, 1) * 32767).astype(np.int16).tobytes())
    out = HERE / f"{name}_mix.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", str(SR), "-ac", "2", str(out)], check=True)
    # loudnorm can lift the noise floor in the silence windows: re-zero them
    if cue.get("silence"):
        tmp = HERE / f"{name}_mix_tmp.wav"
        expr = "+".join(f"between(t,{a},{b})" for a, b in cue["silence"])
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out), "-af", f"volume=enable='{expr}':volume=0", str(tmp)], check=True)
        tmp.replace(out)
    (RC / "public").mkdir(exist_ok=True)
    (RC / "public" / out.name).write_bytes(out.read_bytes())
    menv_p.write_text(json.dumps(menv))
    (RC / f"captions_{name}.json").write_text(json.dumps(caps, indent=1))
    print(f"{out}  ({cue['duration_s']} s, {len(caps)} caption groups)")


if __name__ == "__main__":
    main(sys.argv[1])
