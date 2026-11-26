"""QUICK SYNC. sound effects, synthesized locally (no music, no paid SFX). Reuses LATER's primitives;
ping/hum/meter/chair sounds are copied from the earlier Shorts. Run: python synth_sfx.py"""
import sys
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[4] / "later/assets/audio/sfx"))
import synth_library as L  # noqa: E402

L.OUT = Path(__file__).parent
SR = L.SR


def mix(*xs):
    n = max(len(x) for x in xs); out = np.zeros(n)
    for x in xs:
        out[: len(x)] += x
    return out


def lowpass(x, fc):
    spec = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / (1 + (f / fc) ** 4)
    return np.fft.irfft(spec, len(x))


def fluorescent(dur=9.0):
    """Fluorescent buzz + HVAC drone: 120 Hz hum with harmonics over soft air noise."""
    t = L.t_(dur)
    hum = sum(np.sin(2 * np.pi * 120 * k * t) / k for k in (1, 2, 3, 5)) * 0.25
    air = lowpass(L.band(len(t), 60, 2000, seed=101), 600) * 0.5
    x = hum * (0.85 + 0.15 * np.sin(2 * np.pi * 0.3 * t)) + air
    f = int(SR * 0.3); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    return x


def clicker():
    """Presentation clicker: small plastic click."""
    return mix(L.click(2600, 0.04, 0.6, 0.4, 0.004), 0.3 * L.click(1200, 0.05, 0.4, 0.2, 0.008))


def mouse_clicks(n=3, every=0.18):
    buf = np.zeros(int(SR * (n * every + 0.1)))
    for k in range(n):
        L.place(buf, L.click(3000, 0.03, 0.5, 0.4, 0.003), k * every)
    return buf


def clock_spin(dur=2.2):
    """Time-lapse: accelerating clock ticks + a rising whir."""
    buf = np.zeros(int(SR * dur)); tt = 0.0; k = 0
    while tt < dur - 0.03:
        L.place(buf, L.click(4200, 0.02, 0.5, 0.2, 0.002) * 0.6, tt); tt += max(0.025, 0.2 - k * 0.012); k += 1
    t = L.t_(dur); whir = np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / dur) ** 2) / SR) * 0.15 * np.sin(np.pi * t / dur)
    return mix(buf, whir)


def card_flips(n=10, every=0.09):
    buf = np.zeros(int(SR * (n * every + 0.2)))
    for k in range(n):
        m = int(SR * 0.05)
        L.place(buf, L.band(m, 2000, 8000, seed=110 + k) * L.env(m, 0.0005, 0.01) * 0.6, k * every)
    return buf


def thud():
    """Head meets conference table."""
    n = int(SR * 0.5); t = np.arange(n) / SR
    return mix(np.sin(2 * np.pi * (90 - 40 * t) * t) * L.env(n, 0.001, 0.12), 0.5 * L.band(n, 200, 2000, seed=120) * L.env(n, 0.0005, 0.03))


def build():
    L.write("fluorescent_9s", fluorescent(), 0.6)
    L.write("clicker", clicker(), 0.7)
    L.write("mouse_clicks", mouse_clicks(), 0.6)
    L.write("clock_spin", clock_spin(), 0.7)
    L.write("card_flips", card_flips(), 0.6)
    L.write("thud", thud(), 0.95)


if __name__ == "__main__":
    build()
    print("ok")
