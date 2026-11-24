import React from "react";
import {
  Camera, LightPool, Vignette, Room, ChairBack, Desk, Laptop, Clock,
  TheoUpper, TheoLegs, Later, Mochi, Limb, C, lerp, ease,
} from "./art";
import { InsertHand } from "./rig";
import { LaptopFront, Keyboard } from "./sets";
import { CLOCK_CU, tickingSecond } from "./act1";
import { Shot38, ShotProps } from "./shots";

// Act 4 — Rock bottom (2:00–2:25). Black, navy, red deadline glow. Later fills the room.

const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill={bg} />
    {children}
  </svg>
);
const seg = (f: number, a: number, b: number) => ease((f - a) / (b - a));
const shake = (frame: number, amp: number) => [Math.sin(frame * 1.7) * amp + Math.sin(frame * 3.1) * amp * 0.4, Math.cos(frame * 1.3) * amp * 0.7 + Math.sin(frame * 2.6) * amp * 0.3];

// Full-frame rain shadows running down (light through a wet window).
const RainShadows: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 0.18 }) => (
  <g opacity={opacity}>
    {Array.from({ length: 26 }).map((_, i) => {
      const x = (i * 83) % 1920;
      const y = ((frame * (14 + (i % 5) * 3) + i * 151) % 1400) - 300;
      return <rect key={i} x={x} y={y} width={3 + (i % 3)} height={90 + (i % 4) * 40} rx={2} fill="#0A0E24" />;
    })}
  </g>
);

// S33 — CU: MATCH CUT from S2. Same CLOCK_CU framing (S2 ends at cx 1700, zoom 5.25), now 11:59 and lit red.
export const S33: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={CLOCK_CU.cx} cy={CLOCK_CU.cy} zoom={lerp(CLOCK_CU.zoomTo, CLOCK_CU.zoomTo + 0.25, t)}>
        <Room sky="rain" frame={frame} clockH={11} clockM={59} />
        <Clock x={1700} y={250} h={11} m={59} sec={tickingSecond(56, frame)} />
        <LightPool id="s33" x={1660} y={320} r={560} dark="#0A0510" darkness={0.86} glow="#FF3B3B" glowStrength={0.3} glowR={320} />
      </Camera>
      <Vignette id="s33v" strength={0.75} />
    </Frame>
  );
};

// S34 — MCU: frantic typing, sweating; Later's magenta eyes in the dark behind him; handheld shake.
export const S34: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const [sx, sy] = shake(frame, 7);
  return (
    <Frame>
      <Camera cx={lerp(1000, 1015, t)} cy={470} zoom={lerp(2.0, 2.15, t)} shakeX={sx} shakeY={sy}>
        <Room sky="rain" frame={frame} clockH={11} clockM={59} mess />
        <Later x={720} y={380} s={2.6} mood="sly" frame={frame} layer="body" />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#CFE3FF" />
        <TheoUpper pose="type" expr="panic" frame={frame} typeSpeed={1.95} lookX={10} lookY={4} />
        <LightPool id="s34" x={1290} y={500} r={760} dark="#04030C" darkness={0.94} glow="#FF3B3B" glowStrength={0.22} glowR={420} />
        <Later x={720} y={380} s={2.6} mood="sly" frame={frame} layer="glow" opacity={0.85} />
      </Camera>
      <Vignette id="s34v" strength={0.75} />
    </Frame>
  );
};

// S35 — ECU: fingers on the keyboard, motion-blurred, very fast typing.
export const S35: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const [sx, sy] = shake(frame, 4);
  const pressed = [(frame * 7) % 70, (frame * 13 + 5) % 70, (frame * 3 + 40) % 70];
  const bobL = Math.abs(Math.sin(frame * 1.9)) * 14, bobR = Math.abs(Math.sin(frame * 2.3 + 1)) * 14;
  return (
    <Frame>
      <defs><filter id="s35mb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9 3" /></filter></defs>
      <Camera cx={lerp(960, 990, t)} cy={500} zoom={lerp(1.35, 1.45, t)} shakeX={sx} shakeY={sy}>
        <rect x={-200} y={-200} width={2400} height={1600} fill="#2A2030" />
        <Keyboard frame={frame} pressed={pressed} blur={2} />
        <g filter="url(#s35mb)">
          <InsertHand x={520} y={420 + bobL} s={1.2} r={-8} grip="point" />
          <InsertHand x={1100} y={470 + bobR} s={1.2} r={6} grip="curl" />
        </g>
        <LightPool id="s35" x={1100} y={100} r={1300} dark="#05030C" darkness={0.8} glow="#CFE3FF" glowStrength={0.18} glowR={700} />
      </Camera>
      <Vignette id="s35v" strength={0.7} />
    </Frame>
  );
};

// S36 — CU: upload page; the big red X error icon pops in (clock strikes 12).
export const S36: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const f = frame - 8;
  const pop = f < 0 ? 0 : 1 + 0.35 * Math.exp(-f / 4) * Math.cos(f * 0.9) - Math.exp(-f / 2) * 1;
  const red = f < 0 ? 0 : Math.min(1, f / 6);
  return (
    <Frame bg="#08050C">
      <defs>
        <radialGradient id="s36r" cx="960" cy="460" r="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF3B3B" stopOpacity={0.35 * red} /><stop offset="1" stopColor="#FF3B3B" stopOpacity={0} />
        </radialGradient>
      </defs>
      <Camera cx={960} cy={lerp(500, 480, t)} zoom={lerp(1.3, 1.42, t)}>
        <LaptopFront frame={frame} open={1} mode="error" errorPop={Math.max(0, pop)} />
        <rect x={-500} y={-500} width={3000} height={2000} fill="url(#s36r)" />
      </Camera>
      <Vignette id="s36v" strength={0.7} />
    </Frame>
  );
};

// S37 — CU: face frozen in shock, lit red; glasses slide slowly down his nose. True silence.
export const S37: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(1008, 1016, t)} cy={lerp(450, 445, t)} zoom={lerp(3.4, 3.9, t)}>
        <Room sky="rain" frame={frame} clockH={0} clockM={0} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FF6B6B" />
        <TheoUpper pose="type" expr="shock" frame={frame + 40} typeSpeed={0} lookX={10} lookY={2} glassesY={lerp(0, 22, seg(frame, 8, 90))} />
        <LightPool id="s37" x={1260} y={470} r={760} dark="#06030A" darkness={0.9} glow="#FF3B3B" glowStrength={0.42} glowR={430} />
      </Camera>
      <Vignette id="s37v" strength={0.75} />
    </Frame>
  );
};

// S38a — WS: approved Stage 1 shot 38 (rain, slumped Theo, Later LARGE, grin pulsing).
export const S38a: React.FC<ShotProps> = (p) => <Shot38 {...p} />;

// S38b — CU: Later's pulsing grin hanging over the back of Theo's slumped head; rain shadows run down.
export const S38b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const pulse = 1 + Math.sin(frame * 0.18) * 0.02;
  return (
    <Frame>
      <Camera cx={lerp(960, 990, t)} cy={lerp(440, 450, t)} zoom={lerp(2.3, 2.55, t)}>
        <Room sky="rain" frame={frame} clockH={0} clockM={3} mess />
        <Later x={770} y={290} s={3.3 * pulse} mood="grin" frame={frame} layer="body" />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FF6B6B" />
        <TheoUpper pose="slump" expr="sad" frame={frame} />
        <LightPool id="s38b" x={1210} y={540} r={720} dark="#04030C" darkness={0.9} glow="#FF3B3B" glowStrength={0.24} glowR={430} />
        <Later x={770} y={290} s={3.3 * pulse} mood="grin" frame={frame} layer="glow" />
      </Camera>
      <RainShadows frame={frame} />
      <Vignette id="s38bv" strength={0.75} />
    </Frame>
  );
};

// S39a — MS: Theo crying at the desk; Mochi hops up beside him (arc + squash); one tear falls. Later dims a little.
export const S39a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const hop = seg(frame, 10, 32);
  const mx = lerp(720, 1255, hop);
  const my = lerp(860, 594, hop) - Math.sin(hop * Math.PI) * 160;
  const land = frame >= 32 ? Math.exp(-(frame - 32) / 3) : 0;
  const tearY = frame > 40 ? Math.min(140, (frame - 40) * 6) : 0;
  return (
    <Frame>
      <Camera cx={lerp(1030, 1050, t)} cy={lerp(570, 560, t)} zoom={lerp(1.55, 1.65, t)}>
        <Room sky="rain" frame={frame} clockH={0} clockM={8} mess />
        <Later x={770} y={290} s={3.2} mood="grin" frame={frame} layer="body" opacity={0.9} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FF6B6B" />
        <TheoUpper pose="slump" expr="sad" frame={frame} />
        {frame > 40 && tearY < 140 && <path d={`M1060,${470 + tearY} q-6,12 0,18 q6,-6 0,-18 Z`} fill="#9FD3F0" />}
        <g transform={`translate(${mx} ${my}) scale(${1 + land * 0.15} ${1 - land * 0.18}) translate(${-mx} ${-my})`}>
          <Mochi x={mx} y={my} s={0.55} frame={frame} pose="sit" mood={frame < 32 ? "open" : "closed"} />
        </g>
        <LightPool id="s39a" x={1180} y={540} r={820} dark="#04030C" darkness={0.86} glow="#7F9FD8" glowStrength={0.18} glowR={500} />
        <Later x={770} y={290} s={3.2} mood="grin" frame={frame} layer="glow" opacity={lerp(0.9, 0.65, t)} />
      </Camera>
      <RainShadows frame={frame} opacity={0.12} />
      <Vignette id="s39av" strength={0.7} />
    </Frame>
  );
};

// S39b — CU: Mochi presses her head against Theo's arm; his hand slowly settles on her. First hint of warmth.
export const S39b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const nuzzle = Math.sin(frame * 0.12) * 4;
  const hand = seg(frame, 18, 62);
  return (
    <Frame>
      <Camera cx={lerp(1215, 1225, t)} cy={lerp(520, 510, t)} zoom={lerp(2.9, 3.2, t)}>
        <Room sky="rain" frame={frame} clockH={0} clockM={12} mess />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FF6B6B" />
        <TheoUpper pose="slump" expr="sad" frame={frame} />
        <Mochi x={1262 - nuzzle} y={594} s={0.72} frame={frame} pose="sit" mood="closed" headTilt={-20 - nuzzle} />
        {(() => {
          const hx = lerp(1170, 1222, hand), hy = lerp(575, 468, hand), a = lerp(0, 18, hand) * Math.PI / 180;
          const wx = hx - Math.cos(a) * 46, wy = hy - Math.sin(a) * 46; // wrist = back of the cuff
          return <Limb d={`M1120,578 Q${(1120 + wx) / 2},${Math.min(578, wy) - 20} ${wx},${wy}`} color={C.hoodie} w={34} />;
        })()}
        <g transform={`translate(${lerp(1170, 1222, hand)} ${lerp(575, 468, hand)}) rotate(${lerp(0, 18, hand)}) scale(0.3)`}>
          <InsertHand x={0} y={0} grip="flat" />
        </g>
        <LightPool id="s39b" x={1240} y={480} r={700} dark="#05040E" darkness={0.84} glow="#FFC870" glowStrength={lerp(0.05, 0.16, t)} glowR={300} />
      </Camera>
      <RainShadows frame={frame} opacity={0.1} />
      <Vignette id="s39bv" strength={0.65} />
    </Frame>
  );
};

export const ACT4: { id: string; Component: React.FC<ShotProps>; duration: number }[] = [
  { id: "S33", Component: S33, duration: 48 },
  { id: "S34", Component: S34, duration: 72 },
  { id: "S35", Component: S35, duration: 48 },
  { id: "S36", Component: S36, duration: 48 },
  { id: "S37", Component: S37, duration: 96 },
  { id: "S38a", Component: S38a, duration: 72 },
  { id: "S38b", Component: S38b, duration: 72 },
  { id: "S39a", Component: S39a, duration: 72 },
  { id: "S39b", Component: S39b, duration: 72 },
];
