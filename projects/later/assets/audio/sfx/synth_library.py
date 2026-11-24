"""LATER. sound-effect library, synthesized locally (user decision: option B, no SFX provider).
Deterministic (fixed seeds). Writes 44.1 kHz mono WAVs next to this file. Run: python synth_library.py"""
import wave
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path(__file__).parent
rng = np.random.default_rng(11)


def write(name, x, peak=0.9):
    x = np.asarray(x, dtype=float)
    m = np.abs(x).max()
    if m > 0:
        x = x / m * peak
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def t_(dur):
    return np.arange(int(SR * dur)) / SR


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def band(n, lo, hi, seed=None):
    r = np.random.default_rng(seed) if seed is not None else rng
    spec = np.fft.rfft(r.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(spec, n)
    return y / (np.abs(y).max() + 1e-9)


def fade(x, fi=0.02, fo=0.05):
    n = len(x); a = np.ones(n)
    i, o = int(fi * SR), int(fo * SR)
    if i: a[:i] = np.linspace(0, 1, i)
    if o: a[-o:] = np.linspace(1, 0, o)
    return x * a


def place(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i]


# ---------------------------------------------------------------- primitives
def click(freq=2200, dur=0.05, body=0.7, noise=0.5, dec=0.012):
    n = int(SR * dur); t = np.arange(n) / SR
    return body * np.sin(2 * np.pi * freq * t) * env(n, 0.0005, dec) + noise * band(n, 1500, 9000) * env(n, 0.0002, 0.004)


def key(thock=False):
    n = int(SR * 0.04)
    k = (band(n, 300, 2500) if thock else band(n, 1800, 9000)) * env(n, 0.0003, 0.014 if thock else 0.008)
    return k + 0.4 * band(n, 3000, 12000) * env(n, 0.0001, 0.002)


def typing(dur, rate_lo, rate_hi, amp=0.35):
    buf = np.zeros(int(SR * dur)); t = 0.03
    while t < dur - 0.05:
        place(buf, key(rng.random() < 0.12) * (amp * (0.8 + 0.4 * rng.random())), t)
        t += rng.uniform(rate_lo, rate_hi)
    return buf


def whoosh(dur=0.9, lo=200, hi=1800):
    n = int(SR * dur); t = np.arange(n) / SR
    return band(n, lo, hi) * np.sin(np.pi * t / dur) ** 2


def shimmer(dur=1.2, rising=True, base=1200):
    buf = np.zeros(int(SR * dur))
    for i in range(14):
        f = base * (1.12 ** (i if rising else 13 - i))
        n = int(SR * 0.35); tt = np.arange(n) / SR
        place(buf, 0.25 * np.sin(2 * np.pi * f * tt) * env(n, 0.002, 0.12), i * dur / 16)
    return buf + 0.15 * whoosh(dur, 3000, 9000)


def tone(f, dur, dec, partials=((1, 1.0),), a=0.003):
    n = int(SR * dur); t = np.arange(n) / SR
    return sum(amp * np.sin(2 * np.pi * f * k * t) * env(n, a, dec / k ** 0.5) for k, amp in partials)


# ---------------------------------------------------------------- library
def build():
    # clocks and ticks
    ticks = np.zeros(int(SR * 13.0))
    for s in range(13):
        place(ticks, click(2300 if s % 2 == 0 else 1900), s)
    write("clock_tick_13s", ticks)
    loud = np.zeros(int(SR * 9.0))
    for s in range(9):
        place(loud, click(2100 if s % 2 == 0 else 1700, 0.08, 0.9, 0.7, 0.02), s)
    write("clock_tick_loud_9s", loud)
    # Clock strikes 12: inharmonic bell partials, long decay
    write("clock_strike", tone(196, 3.0, 1.1, ((1, 1), (2.76, 0.5), (5.4, 0.25), (8.9, 0.1)), a=0.002))
    # typing
    write("keyboard_frantic_10s", typing(10, 0.045, 0.14))
    write("keyboard_frantic_5s", typing(5, 0.04, 0.12))
    write("typing_calm_3s", typing(3, 0.12, 0.3, 0.25))
    write("typing_calm_12s", typing(12, 0.13, 0.32, 0.25))
    bs = np.zeros(int(SR * 1.8))
    place(bs, key(True), 0)
    for i in range(14):
        place(bs, key() * 0.5, 0.35 + i * 0.1)
    write("backspace_hold", bs)
    # Later: whoosh / grow shimmer / shrink shimmer
    write("later_whoosh", whoosh(0.9))
    write("later_whoosh_long", whoosh(1.6, 150, 1400))
    write("shimmer_grow", shimmer(1.3, True, 700))
    write("shimmer_shrink", shimmer(1.3, False, 900))
    # title hit
    n = int(SR * 2.2); tt = np.arange(n) / SR
    f = 38 + 32 * np.exp(-tt / 0.15)
    write("title_hit", np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.7) + 0.5 * band(n, 800, 6000) * env(n, 0.0005, 0.03))
    # low synth swell (under-bed eyes)
    tt = t_(3.0)
    sw = sum(np.sin(2 * np.pi * (55 * d) * tt + d) for d in (1, 1.005, 2.01, 3.0)) * np.minimum(1, tt / 2.2) * np.exp(-np.maximum(0, tt - 2.4) / 0.3)
    write("low_swell", sw)
    # Mochi hiss + purr
    n = int(SR * 1.1); tt = np.arange(n) / SR
    write("mochi_hiss", band(n, 2500, 9000) * np.minimum(1, tt / 0.05) * np.exp(-np.maximum(0, tt - 0.6) / 0.15))
    tt = t_(4.0)
    write("mochi_purr", band(len(tt), 40, 400) * (0.55 + 0.45 * np.sin(2 * np.pi * 24 * tt)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.45 * tt)), 0.7)
    # phone tap, notification pop, message pop
    write("phone_tap", click(900, 0.06, 0.6, 0.4, 0.01))
    write("notif_pop", tone(880, 0.35, 0.09) + tone(1320, 0.35, 0.08) * 0.6)
    write("reply_pop", tone(660, 0.3, 0.06) * 0.6 + tone(990, 0.3, 0.07))
    # paper/sticky note slap, mug scrape, laptop open/close
    write("note_slap", band(int(SR * 0.12), 300, 3000) * env(int(SR * 0.12), 0.001, 0.025))
    n = int(SR * 0.8)
    write("mug_scrape", band(n, 600, 3500) * np.sin(np.pi * np.arange(n) / n) ** 0.6 * (0.6 + 0.4 * np.sin(2 * np.pi * 37 * np.arange(n) / SR)))
    lo = whoosh(0.5, 400, 3000) * 0.4; place(lo, click(600, 0.08, 0.8, 0.6, 0.02), 0.42)
    write("laptop_open", lo)
    lc = whoosh(0.4, 300, 2000) * 0.3; place(lc, click(240, 0.15, 1.0, 0.8, 0.05), 0.35)
    write("laptop_close", lc)
    # beanbag squish
    n = int(SR * 0.7)
    write("beanbag_squish", band(n, 150, 2500) * np.sin(np.pi * np.arange(n) / n) ** 1.5)
    # time-lapse whoosh / clock spin
    write("timelapse_whoosh", whoosh(1.6, 300, 5000))
    spin = whoosh(1.4, 500, 4000) * 0.5
    for i in range(18):
        place(spin, click(2600, 0.03, 0.5, 0.3, 0.006), i * 0.07)
    write("clock_spin", spin)
    # crowd murmur (faceless audience)
    tt = t_(4.0)
    write("crowd_murmur", band(len(tt), 200, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 3.1 * tt) * np.sin(2 * np.pi * 0.7 * tt)) * np.minimum(1, tt / 0.8), 0.6)
    # vacuum (motor hum + airflow)
    tt = t_(3.2)
    vac = 0.5 * sum(np.sin(2 * np.pi * 118 * k * tt) / k for k in (1, 2, 3, 5)) + 0.6 * band(len(tt), 800, 6000)
    write("vacuum", fade(vac * (0.85 + 0.15 * np.sin(2 * np.pi * 0.7 * tt)), 0.25, 0.3))
    # pens sliding + click into place
    pn = whoosh(1.2, 1500, 6000) * 0.25; place(pn, click(1700, 0.05, 0.8, 0.5, 0.01), 1.15)
    write("pen_slide_click", pn)
    # marker squeak
    tt = t_(0.5); sq = np.zeros(int(SR * 2.4))
    for i in range(4):
        fm = 1800 + 400 * np.sin(2 * np.pi * 9 * tt)
        place(sq, 0.35 * np.sin(2 * np.pi * np.cumsum(fm) / SR) * np.sin(np.pi * tt / 0.5) ** 2, i * 0.55)
    write("marker_squeak", sq)
    # wind (surreal mountain / road)
    tt = t_(10.0)
    write("wind", fade(band(len(tt), 150, 1500) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.23 * tt + 1)), 1.0, 1.5), 0.6)
    # error chime (two descending tones)
    ec = np.zeros(int(SR * 1.0)); place(ec, tone(784, 0.5, 0.15), 0); place(ec, tone(523, 0.6, 0.2), 0.18)
    write("error_chime", ec)
    # rain on window: dense filtered noise + droplets
    tt = t_(12.0); rain = 0.5 * band(len(tt), 1500, 9000) + 0.3 * band(len(tt), 200, 1200)
    for _ in range(400):
        place(rain, click(rng.uniform(1800, 4200), 0.02, 0.25, 0.2, 0.004), rng.uniform(0, 11.9))
    write("rain", fade(rain, 0.8, 1.0), 0.6)
    # Mochi hop thump
    write("thump", tone(90, 0.25, 0.05) + 0.3 * band(int(SR * 0.25), 100, 900) * env(int(SR * 0.25), 0.001, 0.02))
    # kitchen timer: crank (ratchet), ticking, bell
    cr = np.zeros(int(SR * 1.3))
    for i in range(22):
        place(cr, click(3200, 0.02, 0.6, 0.5, 0.004), i * 0.055)
    write("timer_crank", cr)
    tk = np.zeros(int(SR * 14.0))
    for i in range(int(14 / 0.25)):
        place(tk, click(4200, 0.015, 0.5, 0.3, 0.003), i * 0.25)
    write("timer_ticking_14s", tk)
    bell = np.zeros(int(SR * 2.2))
    for i in range(30):
        place(bell, tone(2350, 0.25, 0.08, ((1, 1), (2.4, 0.4))), i * 0.06)
    write("timer_bell", bell)
    # pencil tick (scratch)
    n = int(SR * 0.6)
    write("pencil_tick", band(n, 2500, 8000) * (np.sin(np.pi * np.arange(n) / n) ** 0.5) * (0.5 + 0.5 * (np.arange(n) / n > 0.3)))
    # drawer slide + thud
    dr = whoosh(0.7, 300, 2500) * 0.5; place(dr, tone(110, 0.3, 0.06) + 0.5 * band(int(SR * 0.3), 100, 1500) * env(int(SR * 0.3), 0.001, 0.03), 0.62)
    write("drawer_slide_thud", dr)
    # lamp click
    write("lamp_click", click(1500, 0.06, 0.8, 0.7, 0.008))
    # room tones / morning ambience (soft air + distant chirps)
    tt = t_(14.0)
    amb = 0.25 * band(len(tt), 80, 600)
    for i in range(10):
        at = rng.uniform(0.5, 13.0); n = int(SR * 0.12); x = np.arange(n) / SR
        chirp = np.sin(2 * np.pi * np.cumsum(3200 + 1600 * np.sin(2 * np.pi * 14 * x)) / SR) * np.sin(np.pi * x / 0.12) ** 2
        place(amb, 0.12 * chirp, at)
    write("morning_ambience_14s", fade(amb, 1.0, 1.0), 0.5)
    tt = t_(12.0)
    write("room_tone_12s", fade(0.3 * band(len(tt), 60, 400), 1.0, 1.0), 0.35)
    # exhale (breath)
    n = int(SR * 0.9)
    write("exhale", band(n, 300, 3000) * np.sin(np.pi * np.arange(n) / n) ** 2, 0.5)


if __name__ == "__main__":
    build()
    print("ok", len(list(OUT.glob("*.wav"))), "files")
