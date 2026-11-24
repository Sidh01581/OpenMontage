"""Placeholder SFX for the LATER. Act 1 sample, synthesized locally (no SFX provider configured).
Replace with Freesound recordings once FREESOUND_API_KEY is set. Deterministic (fixed seed)."""
import json
import wave
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path(__file__).parent
rng = np.random.default_rng(7)


def write(name, x):
    x = np.clip(x, -1, 1)
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


def bandnoise(n, lo, hi):
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(spec, n)
    return y / (np.abs(y).max() + 1e-9)


# Clock: tick/tock every second for 13 s (the hook), wooden click = resonant ping + noise transient
def click(freq, dur=0.06, amp=0.5):
    n = int(SR * dur); t = np.arange(n) / SR
    return amp * (0.7 * np.sin(2 * np.pi * freq * t) * env(n, 0.0005, 0.012) + 0.5 * bandnoise(n, 1500, 7000) * env(n, 0.0002, 0.004))

clock = np.zeros(int(SR * 13.0))
for s in range(13):
    c = click(2300 if s % 2 == 0 else 1900)
    i = int(s * SR); clock[i:i + len(c)] += c
write("clock_tick_13s.wav", clock)

# Keyboard clatter: irregular key clicks, frantic (~11/s) for 10 s, a few spacebar thocks
keys = np.zeros(int(SR * 10.0))
t = 0.05
while t < 9.9:
    n = int(SR * 0.035)
    thock = rng.random() < 0.12
    k = (bandnoise(n, 300, 2500) if thock else bandnoise(n, 1800, 9000)) * env(n, 0.0003, 0.008 if not thock else 0.014)
    k += 0.4 * bandnoise(n, 3000, 12000) * env(n, 0.0001, 0.002)
    i = int(t * SR); keys[i:i + n] += k * (0.32 + 0.12 * rng.random())
    t += rng.uniform(0.045, 0.14)
write("keyboard_frantic_10s.wav", keys)

# Smoke whoosh for Later's entrance: filtered noise swell 0.9 s
n = int(SR * 0.9); tt = np.arange(n) / SR
sw = bandnoise(n, 200, 1800) * np.sin(np.pi * tt / 0.9) ** 2 * 0.35
write("later_whoosh.wav", sw)

# Title hit: low boom (pitch drop 70->38 Hz) + sub thump + short noise crack, 2.2 s tail
n = int(SR * 2.2); tt = np.arange(n) / SR
f = 38 + 32 * np.exp(-tt / 0.15)
boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.7)
crack = bandnoise(n, 800, 6000) * env(n, 0.0005, 0.03) * 0.5
write("title_hit.wav", 0.9 * boom + crack)

# Per-frame (24 fps) mouth envelopes for lip sync, 0..1
def mouth_env(path, fps=24):
    with wave.open(str(path)) as w:
        sr = w.getframerate(); ch = w.getnchannels()
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float)
    if ch > 1:
        a = a.reshape(-1, ch).mean(1)
    hop = sr // fps
    rms = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a), hop)])
    rms = rms / (rms.max() + 1e-9)
    return [round(float(v), 3) for v in np.clip((rms - 0.08) / 0.7, 0, 1)]

vo = OUT.parent / "vo"
json.dump({k: mouth_env(vo / f) for k, f in [("later01", "l01.wav"), ("theo01", "t01_joe_fx.wav"), ("narr01", "n01_fx.wav")]},
          open(OUT / "mouth_env.json", "w"))
print("ok")
