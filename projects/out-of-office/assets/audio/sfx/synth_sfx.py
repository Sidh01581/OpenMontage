"""OUT OF OFFICE. sound effects, synthesized locally (no music, no paid SFX). Reuses LATER's primitives;
office/typing/slurp/tag sounds are copied from BUSY. Run: python synth_sfx.py"""
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


def waves(dur=9.0, period=4.2):
    """Ocean bed: slow swells of filtered noise + a soft wash on each break."""
    t = L.t_(dur); n = len(t)
    base = lowpass(L.band(n, 60, 3000, seed=70), 900) * 0.5
    swell = 0.35 + 0.65 * (0.5 + 0.5 * np.sin(2 * np.pi * t / period - 1.2)) ** 2
    wash = L.band(n, 1500, 8000, seed=71) * (0.5 + 0.5 * np.sin(2 * np.pi * t / period)) ** 6 * 0.35
    x = (base * swell + wash)
    f = int(SR * 0.5); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    return x


def gull(f0=1700):
    """One seagull 'kyow': quick upward then falling squeal, slightly rough."""
    dur = 0.38; t = L.t_(dur)
    f = f0 * (1 + 0.5 * np.sin(np.pi * t / dur) - 0.4 * t / dur)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.4 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    rough = 1 + 0.3 * np.sign(np.sin(2 * np.pi * 70 * t))
    return tone * rough * np.sin(np.pi * t / dur) ** 1.5 * 0.5


def gulls(dur=3.0):
    buf = np.zeros(int(SR * dur))
    for at, f in [(0.1, 1700), (0.55, 1900), (0.9, 1600), (2.1, 1800)]:
        L.place(buf, gull(f), at)
    return buf


def crab_clicks():
    buf = np.zeros(int(SR * 0.7))
    for k in range(6):
        L.place(buf, L.click(3200 + 200 * (k % 2), 0.03, 0.5, 0.3, 0.003), k * 0.1)
    return buf


def build():
    L.write("waves_9s", waves(), 0.8)
    L.write("gulls_3s", gulls(), 0.6)
    L.write("crab_clicks", crab_clicks(), 0.5)


def siren(dur=4.0):
    """Office emergency alarm: two-tone whoop, slightly muffled."""
    t = L.t_(dur)
    f = 700 + 300 * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 1.6 * t)))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 + 0.2 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return lowpass(x, 2500)


def error_beeps(dur=2.0):
    buf = np.zeros(int(SR * dur)); tt = 0.0
    while tt < dur - 0.2:
        L.place(buf, L.tone(440, 0.16, 0.08, ((1, 1), (3, 0.3))), tt); L.place(buf, L.tone(330, 0.16, 0.08), tt + 0.18); tt += 0.5
    return buf


def ok_chimes(n=8, every=0.14):
    buf = np.zeros(int(SR * (n * every + 0.5)))
    for k in range(n):
        L.place(buf, L.tone(880 + k * 40, 0.25, 0.08, ((1, 1), (2, 0.3))), k * every)
    return buf


def ping():
    return mix(L.tone(1320, 0.25, 0.07, ((1, 1), (2, 0.25))), 0.6 * L.tone(1760, 0.2, 0.05))


def splash(dur=0.8):
    t = L.t_(dur); n = len(t)
    return L.band(n, 300, 6000, seed=80) * L.env(n, 0.01, 0.18) + 0.4 * lowpass(L.band(n, 60, 800, seed=81), 400) * L.env(n, 0.005, 0.1)


def sand_steps(dur=2.0, every=0.29):
    buf = np.zeros(int(SR * dur)); tt = 0.1; k = 0
    while tt < dur - 0.1:
        m = int(SR * 0.14)
        L.place(buf, L.band(m, 400, 4000, seed=90 + k % 4) * L.env(m, 0.01, 0.05) * 0.6, tt); tt += every; k += 1
    return buf


def laptop_open():
    return mix(L.click(900, 0.06, 0.6, 0.4, 0.01), 0.5 * L.tone(523, 0.5, 0.2, ((1, 1), (2, 0.3))), 0.4 * L.tone(784, 0.5, 0.2))


def laptop_shut():
    n = int(SR * 0.2)
    return mix(L.band(n, 200, 3000, seed=95) * L.env(n, 0.001, 0.02), np.sin(2 * np.pi * 120 * L.t_(0.2)) * L.env(n, 0.001, 0.04))


def sad_horn():
    """'Wah-wah' when the day off becomes a Monday meeting."""
    buf = np.zeros(int(SR * 1.6))
    for k, f in enumerate([392, 370, 349, 330]):
        d = 0.35 if k < 3 else 0.7
        t = L.t_(d); vib = 1 + (0.02 * np.sin(2 * np.pi * 6 * t) if k == 3 else 0)
        x = np.sign(np.sin(2 * np.pi * np.cumsum(f * vib) / SR)) * 0.3 * np.minimum(1, t / 0.03) * np.exp(-t / (d * 0.8))
        L.place(buf, lowpass(x, 1800), k * 0.36)
    return buf


def build2():
    L.write("siren_4s", siren(), 0.6)
    L.write("error_beeps", error_beeps(), 0.6)
    L.write("ok_chimes", ok_chimes(), 0.7)
    L.write("ping", ping(), 0.6)
    L.write("splash", splash(), 0.8)
    L.write("sand_steps", sand_steps(), 0.6)
    L.write("laptop_open", laptop_open(), 0.6)
    L.write("laptop_shut", laptop_shut(), 0.8)
    L.write("sad_horn", sad_horn(), 0.7)


if __name__ == "__main__":
    build()
    build2()
    print("ok")
