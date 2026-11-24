"""WE NEED TO TALK. sound effects, synthesized locally (decision d-005: synth, no SFX provider).
Reuses LATER.'s primitives (projects/later/assets/audio/sfx/synth_library.py). Deterministic.
Run: python synth_sfx.py"""
import sys
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[4] / "later/assets/audio/sfx"))
import synth_library as L  # noqa: E402

L.OUT = Path(__file__).parent
SR = L.SR
rng = np.random.default_rng(42)


def saw(f, t, n_harm=24):
    return sum(((-1) ** (k + 1)) * np.sin(2 * np.pi * f * k * t) / k for k in range(1, n_harm + 1))


def lowpass(x, fc):
    spec = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / (1 + (f / fc) ** 4)
    return np.fft.irfft(spec, len(x))


def office_hum(dur=8.0):
    t = L.t_(dur)
    hum = 0.25 * np.sin(2 * np.pi * 60 * t) + 0.12 * np.sin(2 * np.pi * 120 * t)
    air = 0.5 * L.band(len(t), 150, 1200, seed=3)
    murmur = 0.25 * L.band(len(t), 250, 700, seed=4) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.3 * t))
    return L.fade(hum + air + murmur, 0.3, 0.3)


def orchestra_sting():
    """Big minor-chord brass+strings stab with timpani and cymbal: the fake-horror 'DUN!'."""
    dur = 2.6; t = L.t_(dur); n = len(t)
    chord = [65.4, 77.8, 98.0, 130.8, 155.6, 196.0, 261.6]  # C minor, stacked
    body = sum(saw(f * (1 + 0.003 * rng.standard_normal()), t, 18) for f in chord)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t)
    body = lowpass(body * vib, 2200)
    amp = np.minimum(1, t / 0.012) * (0.55 + 0.45 * np.exp(-t / 0.18)) * np.exp(-np.maximum(0, t - 0.9) / 0.45)
    f_tim = 70 + 40 * np.exp(-t / 0.05)
    timp = np.sin(2 * np.pi * np.cumsum(f_tim) / SR) * L.env(n, 0.001, 0.6)
    cym = L.band(n, 4000, 14000, seed=5) * L.env(n, 0.002, 0.7) * 0.35
    hit = L.band(n, 80, 1500, seed=6) * L.env(n, 0.0005, 0.04)
    return body * amp * 0.5 + 0.9 * timp + cym + 0.6 * hit


def bloop():
    """What-If pops out of Theo's hair: quick rising bubble + tiny squeak."""
    dur = 0.28; t = L.t_(dur); n = len(t)
    f = 220 + 900 * (t / dur) ** 1.4
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * L.env(n, 0.003, 0.09) + 0.3 * L.click(3200, dur, 0.6, 0.2, 0.01)


def buzz(dur=6.0, f0=118):
    """What-If's buzz: nervous sawtooth with insect-like AM flutter and slow pitch wander."""
    t = L.t_(dur)
    f = f0 * (1 + 0.03 * np.sin(2 * np.pi * 0.7 * t) + 0.01 * np.sin(2 * np.pi * 3.1 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(((-1) ** (k + 1)) * np.sin(k * ph) / k for k in range(1, 30))
    x = lowpass(x, 3500) * (0.6 + 0.4 * np.sin(2 * np.pi * 31 * t))
    return L.fade(x, 0.08, 0.15)


def desk_rattle(dur=2.0):
    buf = np.zeros(int(SR * dur)); tt = 0.0
    while tt < dur - 0.06:
        L.place(buf, L.click(rng.uniform(400, 900), 0.05, 0.5, 0.6, 0.012) * rng.uniform(0.4, 0.9), tt)
        tt += rng.uniform(0.035, 0.07)
    return L.fade(buf, 0.05, 0.2)


def build():
    L.write("office_hum_8s", office_hum(), 0.6)
    L.write("keyboard_calm_4s", L.typing(4, 0.12, 0.3, 0.25))
    L.write("orchestra_sting", orchestra_sting(), 0.95)
    L.write("bloop", bloop())
    L.write("buzz_6s", buzz())
    L.write("desk_rattle_2s", desk_rattle())



def heartbeat(dur=6.0, bpm=58):
    buf = np.zeros(int(SR * dur)); beat = 60 / bpm; tt = 0.05
    while tt < dur - 0.4:
        for k, g in ((0, 1.0), (0.22, 0.7)):
            n = int(SR * 0.25); t = np.arange(n) / SR
            f = 55 + 25 * np.exp(-t / 0.03)
            L.place(buf, g * np.sin(2 * np.pi * np.cumsum(f) / SR) * L.env(n, 0.004, 0.07), tt + k)
        tt += beat
    return buf


def train_pass(dur=3.2):
    t = L.t_(dur); n = len(t)
    swell = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    rumble = L.band(n, 30, 260, seed=21) * swell
    hiss = 0.25 * L.band(n, 800, 4000, seed=22) * swell
    clacks = np.zeros(n); tc = 0.1
    while tc < dur - 0.1:
        for d in (0, 0.09):
            L.place(clacks, L.click(rng.uniform(300, 500), 0.06, 0.6, 0.8, 0.02) * swell[min(n - 1, int(tc * SR))], tc + d)
        tc += 0.36
    return rumble + hiss + clacks


def slurp(dur=0.9):
    t = L.t_(dur); n = len(t)
    f = 900 + 1600 * (t / dur) + 300 * np.sin(2 * np.pi * 9 * t)
    noise = L.band(n, 1500, 7000, seed=23)
    am = (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t)) * np.sin(np.pi * t / dur)
    return (0.6 * noise + 0.3 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * am


def flap_click():
    a = L.click(1400, 0.09, 0.7, 0.9, 0.018); b = 0.6 * L.click(700, 0.12, 0.5, 0.6, 0.03)
    a = np.pad(a, (0, len(b) - len(a)))
    return a + b


def tube_hum(dur=3.0):
    t = L.t_(dur)
    x = 0.4 * np.sin(2 * np.pi * 120 * t) + 0.2 * np.sin(2 * np.pi * 240 * t) + 0.15 * L.band(len(t), 2000, 6000, seed=24)
    for k in range(5):  # flicker zaps
        at = 0.3 + k * 0.55 + rng.uniform(0, 0.2); i = int(at * SR); m = int(0.06 * SR)
        x[i:i + m] += 0.8 * L.band(m, 1000, 8000, seed=30 + k)
    return L.fade(x, 0.05, 0.1)


def shuffle_steps(dur=2.6, every=0.55):
    buf = np.zeros(int(SR * dur)); tt = 0.1
    while tt < dur - 0.4:
        n = int(SR * 0.32); t = np.arange(n) / SR
        scuff = L.band(n, 300, 3000, seed=int(tt * 100)) * np.sin(np.pi * np.clip(t / 0.3, 0, 1)) * 0.6
        thud = np.sin(2 * np.pi * 80 * t) * L.env(n, 0.002, 0.05)
        L.place(buf, scuff + thud, tt); tt += every
    return buf


def party_popper():
    n = int(SR * 1.4); t = np.arange(n) / SR
    bang = L.band(n, 200, 8000, seed=40) * L.env(n, 0.0005, 0.035)
    crackle = np.zeros(n)
    for k in range(40):
        L.place(crackle, L.click(rng.uniform(2500, 7000), 0.02, 0.3, 0.6, 0.003) * rng.uniform(0.2, 0.6), 0.05 + rng.uniform(0, 1.1))
    paper = 0.25 * L.band(n, 3000, 10000, seed=41) * np.exp(-t / 0.5)
    return bang + crackle + paper


def balloon_pop_squeal():
    n = int(SR * 1.6); t = np.arange(n) / SR
    pop = L.band(n, 100, 9000, seed=42) * L.env(n, 0.0003, 0.02) * 1.4
    f = 1100 * np.exp(-t / 0.5) + 180 + 60 * np.sin(2 * np.pi * 23 * t)
    squeal = 0.35 * np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.clip((t - 0.08) / 0.05, 0, 1) * np.exp(-np.maximum(0, t - 0.9) / 0.15)
    return pop + lowpass(squeal, 3500)


def applause(dur=6.0):
    buf = np.zeros(int(SR * dur)); n_cl = int(dur * 70)
    for k in range(n_cl):
        at = rng.uniform(0, dur - 0.05)
        L.place(buf, L.band(int(SR * 0.03), 800, 6000, seed=None) * L.env(int(SR * 0.03), 0.0005, 0.006) * rng.uniform(0.3, 1.0), at)
    t = L.t_(dur)
    return buf * np.minimum(1, t / 0.25) * np.exp(-np.maximum(0, t - dur * 0.55) / (dur * 0.2))


def ding():
    return L.tone(1760, 1.4, 0.45, ((1, 1), (2.0, 0.35), (3.01, 0.2), (4.2, 0.08)), a=0.001)


def clock_tick_loud():
    return L.click(2100, 0.12, 0.9, 0.7, 0.025)


def plod(dur=2.0, every=0.26):
    buf = np.zeros(int(SR * dur)); tt = 0.05; k = 0
    while tt < dur - 0.1:
        n = int(SR * 0.1); t = np.arange(n) / SR
        L.place(buf, np.sin(2 * np.pi * (140 + 30 * (k % 2)) * t) * L.env(n, 0.002, 0.03), tt); tt += every; k += 1
    return buf


def build2():
    L.write("buzz_20s", buzz(20.0, 118), 0.9)
    L.write("heartbeat_6s", heartbeat())
    L.write("train_pass", train_pass())
    L.write("slurp", slurp())
    L.write("flap_click", flap_click())
    L.write("tube_hum_3s", tube_hum())
    L.write("shuffle_steps", shuffle_steps())
    L.write("party_popper", party_popper(), 0.95)
    L.write("balloon_pop_squeal", balloon_pop_squeal(), 0.95)
    L.write("applause_6s", applause())
    L.write("ding", ding(), 0.9)
    L.write("clock_tick_loud", clock_tick_loud())
    L.write("plod_2s", plod())


if __name__ == "__main__":
    build()
    build2()
    print("ok")
