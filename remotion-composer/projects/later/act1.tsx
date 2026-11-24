import React from "react";
import {
  Camera, LightPool, Vignette, Room, ChairBack, Desk, Laptop, Clock,
  TheoLegs, TheoUpper, Later, C, lerp, ease,
} from "./art";
import { Shot01, Shot03, ShotProps } from "./shots";
import MOUTH from "./mouth_env.json";

// Act 1 — Hook (0:00–0:15). Shots 1 and 3 are the approved Stage 1 shots;
// 2, 4 and 5 are new. All shots are pure functions of (frame, duration).

const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill={bg} />
    {children}
  </svg>
);

// Reads a 24 fps mouth envelope with light smoothing; `start` = frame the line begins in this shot.
export const mouthAt = (key: keyof typeof MOUTH, frame: number, start: number) => {
  const e = MOUTH[key] as number[];
  const i = frame - start;
  const at = (k: number) => (k >= 0 && k < e.length ? e[k] : 0);
  return at(i - 1) * 0.25 + at(i) * 0.5 + at(i + 1) * 0.25;
};

// Shared framing for the wall clock close-up. Shot 33 MUST reuse this exactly (match cut from shot 2).
export const CLOCK_CU = { cx: 1700, cy: 252, zoomFrom: 4.9, zoomTo: 5.25 };

// Clock second hand that "ticks" each second with a small overshoot.
export const tickingSecond = (startSec: number, frame: number) => {
  const whole = Math.floor(frame / 24);
  const f = frame % 24;
  const settle = f < 6 ? Math.sin((f / 6) * Math.PI) * 0.35 * (1 - f / 6) : 0;
  return startSec + whole + settle;
};

// Shot 2 — CU: wall clock at 11:58, magenta glow creeping over its edge; minute hand twitches,
// Later's shadow slides across the face.
export const Shot02: React.FC<ShotProps & { startSec?: number }> = ({ frame, duration, startSec = 3 }) => {
  const t = ease(frame / duration);
  const sec = tickingSecond(startSec, frame);
  // minute hand twitches toward 59 on one tick, then settles back (nervous mechanism)
  const tw = frame >= 30 && frame < 40 ? Math.sin(((frame - 30) / 10) * Math.PI) * 0.22 : 0;
  // Shadow arrives at the frame edge in the first second, then keeps creeping, so Later's grin reads before 0:05.
  const shadowX = lerp(2010, 1872, ease(Math.min(1, frame / 24))) - lerp(0, 18, t);
  const eyesIn = ease((frame - 10) / 12); // 3.4–3.9 s film time
  const grinIn = ease((frame - 16) / 14); // opens 3.7–4.25 s film time
  const grinPulse = 1 + Math.sin(frame * 0.25) * 0.04;
  return (
    <Frame>
      <defs>
        <filter id="s2blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={14} /></filter>
        <radialGradient id="s2mag" cx={shadowX - 70} cy={230} r={150} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.magenta} stopOpacity={0.45 * t + 0.08} />
          <stop offset="1" stopColor={C.magenta} stopOpacity={0} />
        </radialGradient>
      </defs>
      <Camera cx={lerp(CLOCK_CU.cx + 8, CLOCK_CU.cx, t)} cy={CLOCK_CU.cy} zoom={lerp(CLOCK_CU.zoomFrom, CLOCK_CU.zoomTo, t)}>
        <Room sky="night" frame={frame} clockH={11} clockM={58} />
        <Clock x={1700} y={250} h={11} m={58 + tw} sec={sec} />
        <LightPool id="s2" x={1660} y={270} r={560} dark="#070A24" darkness={0.86} glow="#6F93FF" glowStrength={0.2} glowR={300} />
        {/* Later's shadow creeping in from the right, blurred, with magenta bleeding off its edge */}
        <rect x={1300} y={-100} width={900} height={700} fill="url(#s2mag)" />
        <ellipse cx={shadowX} cy={230} rx={120} ry={150} fill="#05030C" opacity={0.88} filter="url(#s2blur)" />
        <ellipse cx={shadowX + 40} cy={120} rx={80} ry={70} fill="#05030C" opacity={0.8} filter="url(#s2blur)" />
        {/* Later's eyes, then its crescent grin, open at the edge of the shadow (grin visible before 0:05) */}
        <g opacity={eyesIn * 0.95}>
          <ellipse cx={shadowX - 18} cy={196} rx={7} ry={4.5} fill={C.magenta} />
          <ellipse cx={shadowX + 12} cy={194} rx={7} ry={4.5} fill={C.magenta} />
          <ellipse cx={shadowX - 18} cy={196.5} rx={3} ry={2} fill={C.magentaHot} />
          <ellipse cx={shadowX + 12} cy={194.5} rx={3} ry={2} fill={C.magentaHot} />
        </g>
        <g transform={`translate(${shadowX - 3} 212) scale(${Math.max(0.01, grinIn) * grinPulse} ${Math.max(0.01, grinIn)})`} opacity={grinIn}>
          <path d="M-26,0 Q0,24 26,0 Q0,13 -26,0 Z" fill={C.magenta} />
        </g>
      </Camera>
      <Vignette id="s2v" strength={0.7} />
    </Frame>
  );
};

// Shot 4 — ECU: Later's grin right beside Theo's ear; Theo soft in the foreground, freezing,
// pupils sliding toward the voice. Later leans in; grin widens and speaks.
export const Shot04: React.FC<ShotProps & { lineStart?: number }> = ({ frame, duration, lineStart = 12 }) => {
  const t = ease(frame / duration);
  const lean = ease((frame - 4) / 40);
  const talk = mouthAt("later01", frame, lineStart);
  const look = lerp(8, -13, ease((frame - 8) / 26));
  const lx = lerp(700, 742, lean);
  const ly = lerp(446, 438, lean);
  const ls = lerp(1.0, 1.08, lean);
  const grin = lerp(0.25, 1, ease((frame - 6) / 50));
  return (
    <Frame>
      <defs>
        <filter id="s4soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={3.2} /></filter>
        <filter id="s4dark" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={60} /></filter>
        <radialGradient id="s4mag" cx={lx} cy={ly} r={320} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.magenta} stopOpacity={0.26} />
          <stop offset="1" stopColor={C.magenta} stopOpacity={0} />
        </radialGradient>
      </defs>
      <Camera cx={lerp(850, 872, t)} cy={lerp(436, 428, t)} zoom={lerp(2.95, 3.25, t)}>
        <Room sky="night" frame={frame} clockH={11} clockM={59} />
        <ChairBack />
        <ellipse cx={lx - 40} cy={ly - 10} rx={330} ry={300} fill="#05030C" opacity={0.85} filter="url(#s4dark)" />
        <Later x={lx} y={ly} s={ls} mood="sly" frame={frame} layer="body" grinOpen={grin} mouth={talk} />
        <g filter="url(#s4soft)">
          <TheoLegs /><Desk /><Laptop screenOn />
          <TheoUpper pose="type" expr="panic" frame={frame} typeSpeed={0} lookX={look} lookY={1} />
        </g>
        <LightPool id="s4" x={1320} y={480} r={760} dark="#05061A" darkness={0.95} glow="#4F7DFF" glowStrength={0.24} glowR={360} />
        <rect x={-500} y={-500} width={3000} height={2000} fill="url(#s4mag)" />
        <Later x={lx} y={ly} s={ls} mood="sly" frame={frame} layer="body" grinOpen={grin} mouth={talk} />
        <Later x={lx} y={ly} s={ls} mood="sly" frame={frame} layer="glow" grinOpen={grin} mouth={talk} />
      </Camera>
      <Vignette id="s4v" strength={0.75} />
    </Frame>
  );
};

// Shot 5 — Black frame; LATER. slams in with a small camera shake (music hit).
export const Shot05: React.FC<ShotProps> = ({ frame, duration }) => {
  const slam = 1 + 0.55 * Math.exp(-frame / 2.4);
  const settle = lerp(1, 1.035, frame / duration);
  const shake = 16 * Math.exp(-frame / 4.5);
  const sx = Math.sin(frame * 2.9) * shake;
  const sy = Math.cos(frame * 3.7) * shake * 0.7;
  const op = Math.min(1, frame / 2);
  const glow = 0.22 * Math.exp(-frame / 10) + 0.06;
  return (
    <Frame>
      <defs>
        <radialGradient id="s5g" cx="960" cy="560" r="620" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.magenta} stopOpacity={glow} />
          <stop offset="1" stopColor={C.magenta} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#s5g)" />
      <g transform={`translate(${960 + sx} ${540 + sy}) scale(${slam * settle})`} opacity={op}>
        <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fill="#F4EEE2"
          fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight={900} fontSize={250} letterSpacing={24}>
          LATER.
        </text>
      </g>
    </Frame>
  );
};

// Shot 3 wrapper: the approved Stage 1 shot plus Theo's whispered line driving his mouth.
const Shot03Talk: React.FC<ShotProps> = (p) => <Shot03 {...p} talk={mouthAt("theo01", p.frame, 29)} />;

export const ACT1: { id: string; Component: React.FC<ShotProps>; duration: number }[] = [
  { id: "Shot01", Component: Shot01, duration: 72 },   // 0:00–0:03
  { id: "Shot02", Component: Shot02, duration: 72 },   // 0:03–0:06  Narrator 11:58 PM…
  { id: "Shot03", Component: Shot03Talk, duration: 96 }, // 0:06–0:10  Theo: How did this happen… again?
  { id: "Shot04", Component: Shot04, duration: 72 },   // 0:10–0:13  Later: You said… later.
  { id: "Shot05", Component: Shot05, duration: 72 },   // 0:13–0:16  LATER. (sample used 48)
];

