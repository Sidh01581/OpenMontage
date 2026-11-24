import React from "react";
import {
  Camera, LightPool, Vignette, Room, ChairBack, Desk, Laptop, Lamp,
  TheoUpper, TheoLegs, Later, Mochi, Limb, C, INK, SW, lerp, ease,
} from "./art";
import { TheoPuppet, InsertHand, POSES, TheoPose } from "./rig";
import { Kitchen, KitchenTimer, Checklist, PhoneChat, UnderBed } from "./sets";
import { mouthAt } from "./act1";
import { MorningLight, ClosedLaptop } from "./act2";
import { Shot49, ShotProps } from "./shots";

// Acts 5–6 — The turn (2:25–3:05) and End (3:05–3:20).
// Desk lamp warm yellow pushing out magenta; Later SMALL -> SHRINKING -> gone; dawn gold and blue.

const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill={bg} />
    {children}
  </svg>
);
const seg = (f: number, a: number, b: number) => ease((f - a) / (b - a));

// Warm lamp light (Act 5 evening): grows with k.
const LampLight: React.FC<{ id: string; k: number }> = ({ id, k }) => (
  <LightPool id={id} x={1600} y={480} r={lerp(820, 1200, k)} dark="#140C26" darkness={lerp(0.62, 0.5, k)} glow="#FFC870" glowStrength={lerp(0.34, 0.42, k)} glowR={lerp(450, 760, k)} />
);
const DeskTop: React.FC = () => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1600} fill={C.wood} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M-200,${120 + i * 170} C400,${100 + i * 170} 1200,${150 + i * 170} 2200,${115 + i * 170}`} fill="none" stroke={C.woodDark} strokeWidth={5} opacity={0.5} />)}
  </g>
);

// S40a — WS: soft morning, a week later; Theo at his desk reading a new assignment sheet.
export const S40a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const read = Math.sin(frame * 0.05) * 3;
  const pose: TheoPose = { lean: 4, legF: [84, -86], legB: [80, -82], armF: [60, 60], armB: [50, 66], propF: "sheet", headTilt: 8 + read * 0.3 };
  return (
    <Frame>
      <Camera cx={lerp(900, 930, t)} cy={540} zoom={lerp(1.15, 1.22, t)}>
        <Room sky="morning" frame={frame} clockH={9} clockM={0} />
        <ChairBack /><Desk /><ClosedLaptop />
        <TheoPuppet x={880} y={705} pose={pose} expr="neutral" frame={frame} lookX={9} lookY={8 + read} />
        <MorningLight id="s40a" frame={frame} />
      </Camera>
      <Vignette id="s40av" strength={0.25} />
    </Frame>
  );
};

// S40b — Low angle under the desk: Later, SMALL, peeks out; eyes open one at a time.
export const S40b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const peek = seg(frame, 6, 34);
  return (
    <Frame>
      <Camera cx={1300} cy={lerp(760, 740, t)} zoom={lerp(1.7, 1.85, t)}>
        <Room sky="morning" frame={frame} clockH={9} clockM={1} />
        <Desk />
        <rect x={1051} y={616} width={529} height={244} fill="#2A1C16" opacity={0.55} />
        <g transform={`translate(0 ${lerp(30, 0, peek)})`}>
          <Later x={lerp(1470, 1400, peek)} y={812} s={0.42} mood="sly" frame={frame} grinOpen={0.4} tilt={lerp(-24, -8, peek)}
            opacity={1} />
        </g>
        {/* eyelids: right eye opens first, then left */}
        {[[-34, 26], [34, 14]].map(([dx, at], i) => {
          const open = seg(frame, at as number, (at as number) + 8);
          const lx = lerp(1470, 1400, peek) + (dx as number) * 0.42, ly = 812 - 22 * 0.42 + lerp(30, 0, peek);
          return <rect key={i} x={lx - 14} y={ly - 10} width={28} height={20 * (1 - open)} fill={C.laterBody} />;
        })}
        <rect x={1580} y={612} width={26} height={250} fill={C.woodDark} stroke={INK} strokeWidth={SW} />
        <MorningLight id="s40b" frame={frame} dust={false} />
      </Camera>
      <Vignette id="s40bv" strength={0.35} />
    </Frame>
  );
};

// S41 — CU: Later, SMALL, holds Theo's phone out again with a sweet smile. (L26)
export const S41: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("L26", frame, 12);
  return (
    <Frame>
      <Camera cx={lerp(1445, 1450, t)} cy={525} zoom={lerp(3.1, 3.3, t)}>
        <Room sky="morning" frame={frame} clockH={9} clockM={2} />
        <Desk /><Laptop screenOn screenColor="#FFFFFF" /><Lamp on={false} />
        <Later x={1455} y={528} s={0.55} mood="sly" frame={frame} phone={lerp(0.3, 0.9, t)} mouth={talk} tilt={Math.sin(frame * 0.1) * 6} />
        <MorningLight id="s41" frame={frame} />
      </Camera>
      <Vignette id="s41v" strength={0.3} />
    </Frame>
  );
};

// S42 — CU: Theo, determined, small smile, a subtle nod: "Yeah. Five minutes…" (L27 starts at frame 36)
export const S42: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const nod = Math.sin(seg(frame, 16, 30) * Math.PI) * 7;
  const talk = mouthAt("L27", frame, 36);
  return (
    <Frame>
      <Camera cx={lerp(1000, 1010, t)} cy={lerp(445, 440, t)} zoom={lerp(3.3, 3.6, t)}>
        <Room sky="morning" frame={frame} clockH={9} clockM={2} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FFFFFF" />
        <g transform={`translate(0 ${nod})`}>
          <TheoUpper pose="type" expr="determined" frame={frame + 7} typeSpeed={0} lookX={10} lookY={6} talk={talk} />
        </g>
        <MorningLight id="s42" frame={frame} dust={false} />
      </Camera>
      <Vignette id="s42v" strength={0.35} />
    </Frame>
  );
};

// S43 — ECU: Theo's hand twists the red mechanical kitchen timer; it starts ticking.
export const S43: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const twist = seg(frame, 8, 36) * 90 - (frame > 40 ? (frame - 40) * 0.25 : 0);
  const handAway = seg(frame, 44, 64);
  const tx = 1000, ty = 620, ts = 2.3;
  const cx = tx, cy = ty - 6 * ts;
  return (
    <Frame>
      <Camera cx={lerp(990, 1000, t)} cy={lerp(560, 540, t)} zoom={lerp(1.0, 1.08, t)}>
        <DeskTop />
        <KitchenTimer x={tx} y={ty} s={ts} dial={twist} frame={frame} />
        <g transform={`translate(${-handAway * 600} ${handAway * 120}) rotate(${Math.min(twist, 90) * 0.5} ${cx} ${cy})`}>
          <InsertHand x={cx - 200} y={cy - 150} s={1.35} r={0} grip="pinch" />
        </g>
        <LightPool id="s43" x={600} y={200} r={2000} dark="#FF9A4A" darkness={0.16} glow="#FFE3A8" glowStrength={0.18} glowR={1200} />
      </Camera>
      <Vignette id="s43v" strength={0.35} />
    </Frame>
  );
};

// S44 — MCU: typing steadily under the warm desk lamp; Later, SMALL, on the desk edge, confused head tilt.
export const S44: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(1200, 1220, t)} cy={500} zoom={lerp(1.75, 1.85, t)}>
        <Room sky="dusk" frame={frame} clockH={5} clockM={10} lampOn />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FFF1D0" /><Lamp on />
        <TheoUpper pose="type" expr="focused" frame={frame} typeSpeed={0.85} lookX={11} lookY={7} />
        <Later x={1490} y={562} s={0.42} mood="confused" frame={frame} tilt={Math.sin(frame * 0.09) * 16} />
        <LampLight id="s44" k={t * 0.3} />
      </Camera>
      <Vignette id="s44v" strength={0.35} />
    </Frame>
  );
};

// S45 — CU: paper checklist, two boxes ticked; the pencil ticks the third.
export const S45: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const pr = seg(frame, 14, 38);
  const pts: [number, number][] = [[50, 32], [68, 52], [100, 10]];
  const l1 = 26.9, l2 = 52.8, d = pr * (l1 + l2);
  const p = d <= l1 ? [lerp(50, 68, d / l1), lerp(32, 52, d / l1)] : [lerp(68, 100, (d - l1) / l2), lerp(52, 10, (d - l1) / l2)];
  const ox = 700, oy = 330 + 70 + 2 * 110; // third box origin in checklist space (+ checklist offset)
  const px = ox + p[0], py = oy + p[1];
  const lift = frame < 14 ? (14 - frame) * 3 : frame > 38 ? (frame - 38) * 2 : 0;
  return (
    <Frame>
      <Camera cx={lerp(930, 950, t)} cy={lerp(560, 580, t)} zoom={lerp(1.35, 1.45, t)}>
        <DeskTop />
        <g transform="translate(700 330)"><Checklist x={0} y={0} ticks={2} draw={pr} r={0} /></g>
        {/* pencil + pinching hand, tip at the drawing point */}
        <g transform={`translate(${px} ${py - lift})`}>
          <g transform="rotate(-35)">
            <rect x={-8} y={-190} width={16} height={180} fill="#E8B23A" stroke={INK} strokeWidth={4} />
            <path d="M-8,-10 L0,8 L8,-10 Z" fill="#F4E2C4" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <rect x={-8} y={-206} width={16} height={18} fill="#E07F8E" stroke={INK} strokeWidth={3} />
          </g>
          <g transform="translate(-40 -150) rotate(-60) scale(0.55)"><InsertHand x={-150} y={20} grip="pinch" /></g>
        </g>
        <LampLight id="s45" k={0.35} />
      </Camera>
      <Vignette id="s45v" strength={0.35} />
    </Frame>
  );
};

// S46 — CU: Theo's phone: his message "check on me at six?" and a friend's thumbs-up reply pops in.
export const S46: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const reply = frame < 26 ? 0 : Math.min(1.25, (frame - 26) / 8);
  return (
    <Frame bg="#3A2A20">
      <defs><filter id="s46b"><feGaussianBlur stdDeviation={12} /></filter></defs>
      <g filter="url(#s46b)"><DeskTop /></g>
      <Camera cx={960} cy={lerp(520, 480, t)} zoom={lerp(1.25, 1.35, t)}>
        <PhoneChat x={960} y={560} s={1.1} reply={reply > 1 ? 1 + (1.25 - reply) * 0 : reply} />
        <LampLight id="s46" k={0.4} />
      </Camera>
      <Vignette id="s46v" strength={0.4} />
    </Frame>
  );
};

// S47 — MS kitchen: Theo shuts his phone in a drawer; Later, SMALL, clinging to it, gets shut in (eyes squish).
export const S47: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const close = seg(frame, 18, 40);
  const open = 0.85 * (1 - close);
  const dx = open * 150;
  const pushPose: TheoPose = { ...POSES.drawer_push, armF: [78 - close * 10, 4], lean: 10 + close * 6 };
  const ly = lerp(642, 760, close);
  return (
    <Frame>
      <defs><clipPath id="s47clip"><rect x={-400} y={-400} width={3000} height={1100 + dx * 0.05} /></clipPath></defs>
      <Camera cx={lerp(920, 900, t)} cy={lerp(600, 610, t)} zoom={lerp(1.2, 1.3, t)}>
        <Kitchen frame={frame} drawerOpen={open} />
        <g clipPath="url(#s47clip)">
          <g transform={`translate(${-dx * 0.25} 0)`}>
            <g transform={`translate(780 ${ly}) scale(1 ${lerp(1, 0.75, close)}) translate(-780 ${-ly})`}>
              <Later x={780} y={ly} s={0.32} mood={close > 0.15 ? "scared" : "sly"} frame={frame} phone={0.2} />
            </g>
          </g>
        </g>
        {/* re-draw the drawer front over Later so it disappears inside */}
        <g transform={`translate(${-dx * 0.25} ${dx * 0.05})`}>
          <rect x={600} y={700} width={360} height={120} rx={8} fill="#86B0A1" stroke={INK} strokeWidth={SW} />
          <rect x={730} y={748} width={100} height={16} rx={8} fill={INK} />
        </g>
        <TheoPuppet x={1135} y={990} s={1.15} flip pose={pushPose} expr="determined" frame={frame} lookX={8} lookY={10} />
        <LightPool id="s47" x={1500} y={200} r={2200} dark="#FF9A4A" darkness={0.12} glow="#FFF1C8" glowStrength={0.15} glowR={1200} />
      </Camera>
      <Vignette id="s47v" strength={0.25} />
    </Frame>
  );
};

// S48 — CU: the red timer rings and bounces in the foreground; Theo keeps typing behind it, doesn't look up.
export const S48: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <defs><filter id="s48b"><feGaussianBlur stdDeviation={7} /></filter></defs>
      <g filter="url(#s48b)">
        <Camera cx={1080} cy={470} zoom={lerp(1.9, 2.0, t)}>
          <Room sky="dusk" frame={frame} clockH={6} clockM={0} lampOn />
          <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FFF1D0" /><Lamp on />
          <TheoUpper pose="type" expr="focused" frame={frame} typeSpeed={0.85} lookX={11} lookY={7} />
          <LampLight id="s48" k={0.5} />
        </Camera>
      </g>
      <KitchenTimer x={lerp(1360, 1340, t)} y={800} s={2.0} dial={0} ring={1} frame={frame} />
      <Vignette id="s48v" strength={0.35} />
    </Frame>
  );
};

// S49a — MS: approved Stage 1 shot 49 (typing in flow, lamp light spreading, Mochi asleep by the laptop).
export const S49a: React.FC<ShotProps> = (p) => <Shot49 {...p} />;

// S49b — CU: face focused and calm, lamp warming him; small determined smile; slow push-in.
export const S49b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(1005, 1012, t)} cy={lerp(445, 440, t)} zoom={lerp(3.2, 3.7, t)}>
        <Room sky="dusk" frame={frame} clockH={6} clockM={45} lampOn />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FFF1D0" /><Lamp on />
        <TheoUpper pose="type" expr={frame > 30 ? "determined" : "focused"} frame={frame} typeSpeed={0.7} lookX={11} lookY={7} />
        <LampLight id="s49b" k={lerp(0.6, 1, t)} />
      </Camera>
      <Vignette id="s49bv" strength={0.35} />
    </Frame>
  );
};

// S50a — WS: Later, SHRINKING, faded in the corner of the desk, smoke drifting away; Theo working behind.
export const S50a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const ls = lerp(0.42, 0.24, t);
  return (
    <Frame>
      <Camera cx={lerp(1120, 1140, t)} cy={510} zoom={lerp(1.35, 1.42, t)}>
        <Room sky="dusk" frame={frame} clockH={7} clockM={20} lampOn />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FFF1D0" /><Lamp on />
        <TheoUpper pose="type" expr="focused" frame={frame} typeSpeed={0.8} lookX={11} lookY={7} />
        <Later x={1475} y={592 - 100 * ls} s={ls} mood="dim" frame={frame} opacity={lerp(0.85, 0.45, t)} />
        {Array.from({ length: 6 }).map((_, i) => {
          const ph = ((frame * 0.8 + i * 14) % 80) / 80;
          return <circle key={i} cx={1475 + Math.sin(i * 2 + frame * 0.05) * 30 + ph * 40} cy={560 - ph * 160} r={10 * (1 - ph)} fill={C.laterBody} opacity={0.5 * (1 - ph)} />;
        })}
        <LampLight id="s50a" k={1} />
      </Camera>
      <Vignette id="s50av" strength={0.3} />
    </Frame>
  );
};

// S50b — CU: Later's dimming eyes as it dissolves into smoke.
export const S50b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = frame / duration;
  const fade = 1 - ease(t);
  return (
    <Frame bg="#2A1E1A">
      <defs>
        <radialGradient id="s50bw" cx="1400" cy="300" r="1400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFC870" stopOpacity={0.45} /><stop offset="1" stopColor="#FFC870" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#s50bw)" />
      <Camera cx={960} cy={560} zoom={lerp(1.0, 1.06, t)}>
        <Later x={960} y={520} s={lerp(2.2, 1.9, t)} mood="dim" frame={frame} opacity={fade} />
        {Array.from({ length: 22 }).map((_, i) => {
          const a = i * 2.4, sp = 120 + (i % 5) * 40;
          const r = ease(Math.min(1, t * 1.3 + (i % 3) * 0.05));
          return <circle key={i} cx={960 + Math.cos(a) * sp * r * 2} cy={520 + Math.sin(a) * sp * r * 1.4 - r * 200} r={26 * (1 - r) + 4} fill={C.laterBody} opacity={0.7 * (1 - r)} />;
        })}
      </Camera>
      <Vignette id="s50bv" strength={0.45} />
    </Frame>
  );
};

// S51a — WS sunrise: Theo leans back, laptop closed, Mochi on his lap; golden light; he exhales and smiles.
export const S51a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const back = seg(frame, 4, 30);
  const pose: TheoPose = { lean: lerp(4, -14, back), legF: [86, -84], legB: [80, -80], armF: [18, 62], armB: [10, 66], headTilt: lerp(0, -10, back) };
  const puff = seg(frame, 30, 42) * (1 - seg(frame, 42, 56));
  return (
    <Frame>
      <Camera cx={lerp(940, 920, t)} cy={540} zoom={lerp(1.2, 1.28, t)}>
        <Room sky="dawn" frame={frame} clockH={6} clockM={12} />
        <ChairBack /><Desk /><ClosedLaptop />
        <TheoPuppet x={880} y={705} pose={pose} expr={frame > 30 ? "smile" : "relieved"} frame={frame} lookX={8} lookY={2} />
        <Mochi x={950} y={690} s={0.42} frame={frame} flip />
        {puff > 0 && <path d={`M${1010 + puff * 30},${430 - puff * 10} q14,-8 26,0 q14,8 26,0`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={puff} />}
        <path d="M360,170 L520,170 L1760,860 L1300,860 Z" fill="#FFE2A8" opacity={0.14 + 0.1 * t} />
        <LightPool id="s51a" x={330} y={lerp(470, 360, t)} r={2200} dark="#6A5AA0" darkness={lerp(0.22, 0.1, t)} glow="#FFD27A" glowStrength={lerp(0.2, 0.34, t)} glowR={1300} />
      </Camera>
      <Vignette id="s51av" strength={0.2} />
    </Frame>
  );
};

// S51b — CU: Mochi on Theo's lap, content; his hand strokes her back.
export const S51b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const stroke = Math.sin(frame * 0.14);
  const hx = 938 + stroke * 12, hy = 662 - Math.abs(stroke) * 2;
  return (
    <Frame>
      <Camera cx={lerp(955, 950, t)} cy={lerp(672, 668, t)} zoom={lerp(4.1, 4.4, t)}>
        <Room sky="dawn" frame={frame} clockH={6} clockM={13} />
        <ChairBack /><Desk /><ClosedLaptop />
        <TheoPuppet x={880} y={705} pose={{ lean: -14, legF: [86, -84], legB: [80, -80], armF: [6, 14], armB: [4, 12], headTilt: -10 }} expr="smile" frame={frame} />
        <Mochi x={950} y={690} s={0.42} frame={frame} flip />
        <Limb d={`M860,560 Q${(860 + hx) / 2},${hy - 50} ${hx - 26},${hy}`} color={C.hoodie} w={30} />
        <g transform={`translate(${hx} ${hy}) rotate(8) scale(0.17)`}><InsertHand x={0} y={0} grip="flat" /></g>
        <LightPool id="s51b" x={330} y={360} r={2200} dark="#6A5AA0" darkness={0.1} glow="#FFD27A" glowStrength={0.34} glowR={1300} />
      </Camera>
      <Vignette id="s51bv" strength={0.25} />
    </Frame>
  );
};

// S52a — ECU: Theo's hand reaches for the lamp switch; finger presses it; click (light rises).
export const S52a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const reach = seg(frame, 0, 20);
  const press = seg(frame, 20, 25) * (1 - seg(frame, 28, 34));
  const on = frame >= 24 ? 1 : 0;
  return (
    <Frame bg="#3A2E2A">
      <Camera cx={lerp(960, 980, t)} cy={560} zoom={lerp(1.0, 1.08, t)}>
        <rect x={-200} y={-200} width={2400} height={1600} fill="#E6C9A0" />
        <rect x={-200} y={760} width={2400} height={700} fill={C.wood} />
        <line x1={-200} y1={760} x2={2200} y2={760} stroke={INK} strokeWidth={SW} />
        {/* lamp base close-up with push switch */}
        <path d="M1180,760 C1180,640 1500,640 1500,760 Z" fill="#3E6E8E" stroke={INK} strokeWidth={SW} />
        <rect x={1320} y={200} width={30} height={460} fill="#3E6E8E" stroke={INK} strokeWidth={SW} />
        <ellipse cx={1340} cy={700} rx={40} ry={18} fill={on ? "#FFE27A" : "#20222A"} stroke={INK} strokeWidth={5} transform={`translate(0 ${press * 6})`} />
        <InsertHand x={lerp(700, 1150, reach)} y={lerp(760, 700, reach) + press * 8} s={1.3} r={-6} grip="point" press={press} />
        <rect x={-200} y={-200} width={2400} height={1600} fill="#FFE6A8" opacity={0.25 * on * Math.min(1, (frame - 24) / 6)} />
      </Camera>
      <Vignette id="s52av" strength={0.4} />
    </Frame>
  );
};

// S52b — Low angle under the bed: tiny magenta eyes in the dark; lamp light floods in; the eyes blink out.
export const S52b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const light = seg(frame, 6, 22);
  const blink = 1 - seg(frame, 26, 32);
  return (
    <Frame>
      <Camera cx={960} cy={lerp(600, 580, t)} zoom={lerp(1.1, 1.18, t)}>
        <UnderBed frame={frame} light={light} />
        <g transform="translate(1120 650)" opacity={blink > 0 ? 1 : 0}>
          {[-1, 1].map((s) => (
            <g key={s} transform={`translate(${s * 16} 0) scale(1 ${Math.max(0.04, blink * (1 - light * 0.3))})`}>
              <ellipse cx={0} cy={0} rx={9} ry={6} fill={C.magenta} />
              <ellipse cx={0} cy={0.5} rx={4} ry={2.5} fill={C.magentaHot} />
            </g>
          ))}
        </g>
      </Camera>
      <Vignette id="s52bv" strength={lerp(0.6, 0.3, light)} />
    </Frame>
  );
};

// S_end — black frame; "Start now." fades in and holds (bible: hold 4 s).
export const SEnd: React.FC<ShotProps> = ({ frame, duration }) => {
  const op = seg(frame, 6, 30) * (1 - seg(frame, duration - 10, duration));
  const sc = lerp(1, 1.03, frame / duration);
  return (
    <Frame>
      <g transform={`translate(960 540) scale(${sc})`} opacity={op}>
        <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fill="#F4EEE2"
          fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight={800} fontSize={140} letterSpacing={6}>
          Start now.
        </text>
      </g>
    </Frame>
  );
};

export const ACT56: { id: string; Component: React.FC<ShotProps>; duration: number }[] = [
  { id: "S40a", Component: S40a, duration: 72 },
  { id: "S40b", Component: S40b, duration: 72 },
  { id: "S41", Component: S41, duration: 48 },
  { id: "S42", Component: S42, duration: 72 },
  { id: "S43", Component: S43, duration: 72 },
  { id: "S44", Component: S44, duration: 72 },
  { id: "S45", Component: S45, duration: 72 },
  { id: "S46", Component: S46, duration: 72 },
  { id: "S47", Component: S47, duration: 72 },
  { id: "S48", Component: S48, duration: 48 },
  { id: "S49a", Component: S49a, duration: 96 },
  { id: "S49b", Component: S49b, duration: 72 },
  { id: "S50a", Component: S50a, duration: 72 },
  { id: "S50b", Component: S50b, duration: 48 },
  { id: "S51a", Component: S51a, duration: 72 },
  { id: "S51b", Component: S51b, duration: 48 },
  { id: "S52a", Component: S52a, duration: 48 },
  { id: "S52b", Component: S52b, duration: 72 },
  { id: "S_end", Component: SEnd, duration: 120 },
];
