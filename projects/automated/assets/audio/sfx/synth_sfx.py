"""AUTOMATED. sound effects, synthesized locally (no music, no paid SFX). Reuses LATER's primitives;
ping/hum/meter/thud sounds are copied from the earlier Shorts. Run: python synth_sfx.py"""
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


def knuckle_crack():
    """Three quick knuckle pops."""
    buf = np.zeros(int(SR * 0.4))
    for k, at in enumerate((0.0, 0.09, 0.15)):
        m = int(SR * 0.03)
        L.place(buf, L.band(m, 1500, 6000, seed=200 + k) * L.env(m, 0.0003, 0.006) * (1 - 0.2 * k), at)
    return buf


def typing_burst(dur=0.5):
    """Fast confident typing."""
    return L.typing(dur, 0.045, 0.07, amp=0.45)


def enter_key():
    """Big enter-key thock."""
    return mix(L.key(thock=True), 0.4 * L.click(900, 0.06, 0.6, 0.3, 0.015))


def error_buzz():
    """Polite-but-merciless rejection: short low square-ish double buzz."""
    out = np.zeros(int(SR * 0.42))
    for at in (0.0, 0.2):
        n = int(SR * 0.16); t = np.arange(n) / SR
        x = np.tanh(3 * np.sin(2 * np.pi * 155 * t)) * 0.5 + 0.2 * np.sin(2 * np.pi * 310 * t)
        x *= L.env(n, 0.004, 0.06)
        L.place(out, x, at)
    return out


def success_chime():
    """Cheerful rising three-note chime."""
    out = np.zeros(int(SR * 1.0))
    for k, f in enumerate((880, 1108.7, 1318.5)):
        L.place(out, L.tone(f, 0.6, 0.25, partials=((1, 1.0), (2, 0.3))), k * 0.09)
    return out


def paw_keys(n=12, every=0.11):
    """Soft paw pats on the keyboard: muffled key presses."""
    buf = np.zeros(int(SR * (n * every + 0.2)))
    for k in range(n):
        L.place(buf, lowpass(L.key(thock=k % 3 == 0), 1800) * 0.8, k * every + (0.02 if k % 2 else 0))
    return buf


def thud():
    """Head meets desk."""
    n = int(SR * 0.5); t = np.arange(n) / SR
    return mix(np.sin(2 * np.pi * (90 - 40 * t) * t) * L.env(n, 0.001, 0.12), 0.5 * L.band(n, 200, 2000, seed=120) * L.env(n, 0.0005, 0.03))


def robot_chime():
    """Happy robot boot-up: quick bleep-bloop arpeggio."""
    out = np.zeros(int(SR * 0.9))
    for k, f in enumerate((659.3, 987.8, 783.99, 1318.5)):
        L.place(out, L.tone(f, 0.18, 0.06, partials=((1, 1.0), (3, 0.15))), k * 0.08)
    return out


def servo(dur=0.5, f0=300, f1=700):
    """Small servo whir sweeping up."""
    n = int(SR * dur); t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (t / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = (np.sign(np.sin(ph)) * 0.3 + np.sin(ph * 2) * 0.2) * L.env(n, 0.03, dur * 0.4)
    return lowpass(x, 2500)


def box_pop():
    """Cardboard flaps flipping open."""
    n = int(SR * 0.35)
    a = L.band(n, 300, 3000, seed=31) * L.env(n, 0.001, 0.05)
    b = np.zeros(n); L.place(b, L.band(int(SR * 0.2), 400, 2500, seed=32) * L.env(int(SR * 0.2), 0.001, 0.04), 0.07)
    return mix(a, b * 0.8)


def turbo_typing(dur=2.4, every=0.035):
    """Inhumanly fast typing."""
    buf = np.zeros(int(SR * (dur + 0.2)))
    k = 0; t = 0.0
    while t < dur:
        L.place(buf, L.key(thock=k % 5 == 0) * (0.7 + 0.3 * ((k * 7) % 3) / 2), t)
        k += 1; t += every * (0.8 + 0.4 * ((k * 13) % 5) / 4)
    return buf


def install_whoosh(dur=0.6):
    """Rising progress-bar whoosh."""
    n = int(SR * dur); t = np.arange(n) / SR
    x = L.band(n, 600, 5000, seed=44) * (t / dur) ** 1.5 * L.env(n, 0.01, 0.08)
    return x


def build():
    L.write("knuckle_crack", knuckle_crack(), 0.7)
    L.write("typing_burst", typing_burst(), 0.6)
    L.write("enter_key", enter_key(), 0.8)
    L.write("error_buzz", error_buzz(), 0.6)
    L.write("success_chime", success_chime(), 0.7)
    L.write("paw_keys", paw_keys(), 0.6)
    L.write("thud", thud(), 0.95)
    L.write("robot_chime", robot_chime(), 0.7)
    L.write("servo", servo(), 0.5)
    L.write("box_pop", box_pop(), 0.8)
    L.write("turbo_typing", turbo_typing(), 0.6)
    L.write("install_whoosh", install_whoosh(), 0.5)


if __name__ == "__main__":
    build()
    print("ok")
