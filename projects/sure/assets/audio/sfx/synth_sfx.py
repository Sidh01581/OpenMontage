"""SURE. sound effects, synthesized locally (decision d-005: synth). Reuses LATER's primitives. Deterministic.
Run: python synth_sfx.py"""
import sys
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[4] / "later/assets/audio/sfx"))
import synth_library as L  # noqa: E402

L.OUT = Path(__file__).parent
SR = L.SR
rng = np.random.default_rng(7)


def lowpass(x, fc):
    spec = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / (1 + (f / fc) ** 4)
    return np.fft.irfft(spec, len(x))


def slap():
    """Sticky note slapped onto skin: short papery smack + tiny thump."""
    n = int(SR * 0.22); t = np.arange(n) / SR
    smack = L.band(n, 600, 7000, seed=1) * L.env(n, 0.0004, 0.018)
    thump = np.sin(2 * np.pi * 140 * t) * L.env(n, 0.001, 0.03) * 0.6
    flutter = 0.25 * L.band(n, 2000, 9000, seed=2) * L.env(n, 0.01, 0.06)
    return smack + thump + flutter


def pop(step=0):
    """Bright 'yes' pop, a semitone-ish higher each step (0..7)."""
    f0 = 520 * (2 ** (step * 2 / 12))
    n = int(SR * 0.3); t = np.arange(n) / SR
    f = f0 * (1 + 0.6 * np.exp(-t / 0.02))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * L.env(n, 0.001, 0.07)
    return body + 0.35 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * L.env(n, 0.001, 0.04)


def squeak(f=1900):
    """Sure's tiny rubber-toy squeak on each nod."""
    n = int(SR * 0.12); t = np.arange(n) / SR
    fr = f * (1 + 0.25 * np.sin(np.pi * t / 0.12))
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * t / 0.12) ** 2 * 0.6


def squeak_nods(dur=3.0, every=0.42):
    buf = np.zeros(int(SR * dur)); tt = 0.0; k = 0
    while tt < dur - 0.15:
        L.place(buf, squeak(1800 + 200 * (k % 2)), tt); tt += every; k += 1
    return buf


def build():
    L.write("slap", slap())
    for i in range(8):
        L.write(f"pop_{i}", pop(i), 0.8)
    L.write("squeak", squeak())
    L.write("squeak_nods_3s", squeak_nods(), 0.6)



def ringtone(dur=1.3):
    """Phone vibrate buzz + a bright two-note marimba ring."""
    t = L.t_(dur); n = len(t)
    vib = L.band(n, 120, 260, seed=11) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 2.5 * t))) * 0.5
    ring = np.zeros(n)
    for k, (f, at) in enumerate([(1046, 0.0), (1318, 0.15), (1046, 0.6), (1318, 0.75)]):
        L.place(ring, L.tone(f, 0.4, 0.12, ((1, 1), (4.0, 0.2))), at)
    return vib + ring


def cascade(dur=1.75):
    """Calendar blocks stacking: rapid plastic clicks, faster and higher as it overflows."""
    buf = np.zeros(int(SR * dur)); tt = 0.0; k = 0
    while tt < dur - 0.05:
        L.place(buf, L.click(900 + k * 60, 0.05, 0.6, 0.5, 0.012), tt)
        tt += max(0.035, 0.11 - k * 0.004); k += 1
    return buf


def record_scratch():
    """Vinyl scratch: noisy pitch sweep down then up, abrupt stop."""
    n = int(SR * 0.4); t = np.arange(n) / SR
    f = 900 - 700 * np.sin(np.pi * t / 0.4)
    tone = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.35
    noise = L.band(n, 500, 6000, seed=12) * 0.7
    return lowpass((tone + noise) * np.sin(np.pi * np.clip(t / 0.4, 0, 1)) ** 0.5, 5000)


def paper_flutter(dur=0.9):
    t = L.t_(dur); n = len(t)
    return L.band(n, 2000, 9000, seed=13) * (0.5 + 0.5 * np.sin(2 * np.pi * 11 * t)) * np.sin(np.pi * t / dur) * 0.5


def build2():
    L.write("ringtone", ringtone())
    L.write("cascade", cascade())
    L.write("record_scratch", record_scratch(), 0.95)
    L.write("paper_flutter", paper_flutter())


if __name__ == "__main__":
    build()
    build2()
    print("ok")
