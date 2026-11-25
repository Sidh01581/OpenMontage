"""BUSY. sound effects, synthesized locally (no music, no paid SFX). Reuses LATER's primitives. Deterministic.
Run: python synth_sfx.py"""
import sys
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[4] / "later/assets/audio/sfx"))
import synth_library as L  # noqa: E402

L.OUT = Path(__file__).parent
SR = L.SR


def step(seed=0, heel=1.0):
    """One crisp, fast office-shoe step: hard heel click + short carpet scuff. Dev's signature sound."""
    n = int(SR * 0.16); t = np.arange(n) / SR
    click = L.band(n, 1200, 7000, seed=seed) * L.env(n, 0.0003, 0.008) * heel
    knock = np.sin(2 * np.pi * (210 + 20 * (seed % 3)) * t) * L.env(n, 0.0008, 0.022) * 0.8
    scuff = L.band(n, 300, 2500, seed=seed + 50) * L.env(n, 0.006, 0.03) * 0.25
    return click + knock + scuff


def footsteps(dur, every=0.25, first=0.125):
    buf = np.zeros(int(SR * dur)); tt = first; k = 0
    while tt < dur - 0.1:
        L.place(buf, step(k % 4, 1.0 if k % 2 else 0.8), tt); tt += every; k += 1
    return buf


def slosh(dur=0.5):
    """Coffee sloshing in a lidded to-go cup."""
    t = L.t_(dur); n = len(t)
    w = L.band(n, 200, 1400, seed=21) * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t)) ** 2
    return w * np.sin(np.pi * t / dur) * 0.6


def whoosh_fast(dur=0.45):
    t = L.t_(dur); n = len(t)
    sweep = L.band(n, 300, 5000, seed=22)
    shape = np.exp(-((t - dur * 0.45) / (dur * 0.2)) ** 2)
    return sweep * shape


def blip(f=1400):
    """HUD counter tick."""
    return L.tone(f, 0.09, 0.03, ((1, 1), (2, 0.3))) + 0.6 * L.tone(f * 1.5, 0.09, 0.02)


def build():
    L.write("step", step())
    L.write("footsteps_3s", footsteps(3.0), 0.85)
    L.write("slosh", slosh(), 0.6)
    L.write("whoosh_fast", whoosh_fast(), 0.85)
    L.write("blip", blip(), 0.6)
    L.write("hud_pop", L.tone(880, 0.18, 0.06, ((1, 1), (3, 0.3))) + L.tone(1320, 0.18, 0.05), 0.7)


def mix(*xs):
    n = max(len(x) for x in xs); out = np.zeros(n)
    for x in xs:
        out[: len(x)] += x
    return out


def knuckle_crack():
    """Three quick knuckle pops."""
    buf = np.zeros(int(SR * 0.5))
    for k, at in enumerate([0.0, 0.11, 0.2]):
        n = int(SR * 0.05)
        L.place(buf, mix(L.band(n, 1500, 8000, seed=30 + k) * L.env(n, 0.0002, 0.004), 0.5 * L.click(900 + k * 150, 0.05, 0.5, 0.3, 0.006)), at)
    return buf


def chair(dur=0.45, f0=520):
    """Office-chair creak / squeak (pitch wobble)."""
    t = L.t_(dur)
    f = f0 * (1 + 0.15 * np.sin(2 * np.pi * 5 * t)) * (1 - 0.2 * t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / dur) ** 2 * 0.5 + 0.2 * L.band(len(t), 800, 3000, seed=31) * np.sin(np.pi * t / dur)


def window_pops(n=10, every=0.15):
    buf = np.zeros(int(SR * (n * every + 0.3)))
    for k in range(n):
        L.place(buf, mix(L.tone(700 + k * 60, 0.12, 0.03, ((1, 1), (2, 0.4))), 0.4 * L.click(2400, 0.03, 0.4, 0.3, 0.004)), k * every)
    return buf


def heels(dur=1.6, every=0.32):
    buf = np.zeros(int(SR * dur)); tt = 0.05; k = 0
    while tt < dur - 0.1:
        n = int(SR * 0.1)
        x = mix(L.band(n, 2000, 9000, seed=40 + k % 3) * L.env(n, 0.0002, 0.006), 0.6 * L.click(1800, 0.06, 0.7, 0.2, 0.012))
        L.place(buf, x * (0.6 + 0.4 * tt / dur), tt); tt += every; k += 1
    return buf


def level_up():
    """Tag flip to LOOKING BUSY: rising arpeggio chime."""
    buf = np.zeros(int(SR * 0.7))
    for k, f in enumerate([660, 880, 1100, 1320]):
        L.place(buf, L.tone(f, 0.3, 0.1, ((1, 1), (2, 0.3))), k * 0.07)
    return buf


def deflate():
    """Tag back to WORK DONE: 0: descending wah."""
    buf = np.zeros(int(SR * 0.6))
    for k, f in enumerate([700, 560, 420]):
        L.place(buf, L.tone(f, 0.25, 0.09, ((1, 1), (3, 0.2))), k * 0.12)
    return buf


def slurp(dur=0.8):
    t = L.t_(dur); n = len(t)
    w = L.band(n, 300, 4000, seed=50) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 9 * t + 3 * t))) * 0.6
    gurg = np.sin(2 * np.pi * (180 + 120 * t / dur) * t) * (np.sin(2 * np.pi * 6 * t) > 0) * 0.3
    return (w + gurg) * np.sin(np.pi * t / dur)


def scroll_ticks(dur=1.6):
    buf = np.zeros(int(SR * dur)); tt = 0.0; k = 0
    while tt < dur - 0.05:
        L.place(buf, L.click(3000, 0.02, 0.5, 0.2, 0.003) * 0.5, tt); tt += 0.09 if k % 10 < 8 else 0.25; k += 1
    return buf


def shutter():
    n = int(SR * 0.25); buf = np.zeros(n)
    for at in (0.0, 0.07):
        m = int(SR * 0.05)
        L.place(buf, mix(L.band(m, 1500, 9000, seed=60) * L.env(m, 0.0003, 0.008), 0.5 * L.click(1400, 0.05, 0.6, 0.4, 0.01)), at)
    return buf


def build3():
    L.write("knuckle_crack", knuckle_crack())
    L.write("chair_creak", chair())
    L.write("chair_squeak_hi", chair(0.25, 900))
    L.write("window_pops", window_pops())
    L.write("heels", heels())
    L.write("level_up", level_up(), 0.7)
    L.write("deflate", deflate(), 0.7)
    L.write("slurp", slurp(), 0.7)
    L.write("scroll_ticks", scroll_ticks(), 0.6)
    L.write("shutter", shutter())
    L.write("sparkle", L.shimmer(1.2, True, 1800), 0.5)
    L.write("ding", L.tone(1568, 1.2, 0.5, ((1, 1), (2.76, 0.3), (5.4, 0.1))), 0.7)
    L.write("watch_tick", L.click(4200, 0.03, 0.6, 0.2, 0.004), 0.5)


if __name__ == "__main__":
    build()
    build3()
    print("ok")
