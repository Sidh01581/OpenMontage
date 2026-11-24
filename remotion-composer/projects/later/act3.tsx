import React from "react";
import {
  Camera, LightPool, Vignette, Room, ChairBack, Desk, Laptop, Clock,
  TheoUpper, TheoLegs, Later, Mochi, C, INK, SW, lerp, ease,
} from "./art";
import { TheoPuppet, TheoBackHead, InsertHand, POSES, mixPose, TheoPose } from "./rig";
import { StageSet, PaperMountain, Vacuum, Pens, Whiteboard, Keyboard } from "./sets";
import { mouthAt } from "./act1";
import { Lenses } from "./act2";
import { ShotProps } from "./shots";

// Act 3 — The slide (1:05–2:00). Golden afternoon -> orange sunset -> purple dusk. Later MEDIUM -> LARGE.

const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill={bg} />
    {children}
  </svg>
);
const seg = (f: number, a: number, b: number) => ease((f - a) / (b - a));
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
};

// k = 0 golden afternoon ... 1 purple dusk. Sweep = moving window-light patch (time-lapse feel).
const SlideLight: React.FC<{ id: string; frame: number; k: number; sweep?: number }> = ({ id, k, sweep }) => (
  <g>
    {sweep !== undefined && (
      <path d={`M${360 + sweep},170 L${520 + sweep},170 L${1500 + sweep * 2.2},860 L${1100 + sweep * 2.2},860 Z`} fill="#FFE0A0" opacity={0.18 * (1 - k)} />
    )}
    <LightPool id={id} x={lerp(500, 300, k)} y={lerp(320, 420, k)} r={lerp(2200, 1500, k)} dark={mix("#FF8A3A", "#2A1650", k)}
      darkness={lerp(0.2, 0.6, k)} glow={mix("#FFC870", "#B06AD0", k)} glowStrength={lerp(0.22, 0.12, k)} glowR={1200} />
  </g>
);

const SIT_DESK: TheoPose = { lean: 4, legF: [84, -86], legB: [80, -82], armF: [20, 40], armB: [14, 50] };

// Side-view laptop with a lid that closes (close 0..1) about the hinge.
export const LaptopSide: React.FC<{ close: number; screen?: string }> = ({ close, screen = "#FFFFFF" }) => (
  <g>
    <path d="M1140,590 L1310,590 L1318,598 L1132,598 Z" fill="#9AA3B5" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <g transform={`rotate(${-108 * close} 1310 594)`}>
      <path d="M1300,594 L1316,594 L1362,452 L1346,448 Z" fill="#B9C2D3" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {close < 0.95 && <path d="M1298,590 L1344,452" stroke={screen} strokeWidth={5} strokeLinecap="round" opacity={1 - close} />}
    </g>
  </g>
);

// S19 — WS: golden afternoon, Theo upside-down on the bed scrolling, Later MEDIUM lounging beside him like a friend.
export const S19: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const sweep = lerp(-160, 420, frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(880, 900, t)} cy={560} zoom={lerp(1.05, 1.1, t)}>
        <Room sky="afternoon" frame={frame} clockH={1} clockM={(frame * 7) % 60} mess />
        <Later x={300} y={540} s={0.95} mood="sly" frame={frame} layer="body" grinOpen={0.5} tilt={8} arms={{ r: [120, 40] }} />
        <TheoPuppet x={350} y={648} rot={90} flip pose={POSES.lie_back_phone} expr="smile" frame={frame} lookX={-4} lookY={10} />
        <ChairBack /><Desk /><Laptop screenOn={false} />
        <SlideLight id="s19" frame={frame} k={0.05} sweep={sweep} />
        <Later x={300} y={540} s={0.95} mood="sly" frame={frame} layer="glow" grinOpen={0.5} tilt={8} arms={{ r: [120, 40] }} />
      </Camera>
      <Vignette id="s19v" strength={0.3} />
    </Frame>
  );
};

// S20 — CU: wall clock spinning fast to 3:47, afternoon light.
export const S20: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const total = lerp(120, 227, ease(Math.min(1, frame / 38)));
  return (
    <Frame>
      <Camera cx={1700} cy={252} zoom={lerp(4.6, 5.0, t)}>
        <Room sky="afternoon" frame={frame} clockH={Math.floor(total / 60)} clockM={total % 60} />
        <SlideLight id="s20" frame={frame} k={0.1} />
        {/* motion smear on the minute hand while spinning */}
        {frame < 36 && <circle cx={1700} cy={250} r={42} fill="none" stroke="#141018" strokeWidth={2} strokeDasharray="6 10" opacity={0.25} transform={`rotate(${frame * 40} 1700 250)`} />}
      </Camera>
      <Vignette id="s20v" strength={0.35} />
    </Frame>
  );
};

// S21 — MCU: Theo back at the laptop, typing a short line, hopeful.
export const S21: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const typing = frame > 8 && frame < 52;
  return (
    <Frame>
      <Camera cx={lerp(1040, 1060, t)} cy={480} zoom={lerp(2.05, 2.2, t)}>
        <Room sky="afternoon" frame={frame} clockH={3} clockM={48} mess />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn />
        <TheoUpper pose="type" expr={typing ? "focused" : "smile"} frame={frame} typeSpeed={typing ? 0.8 : 0} lookX={11} lookY={6} />
        <SlideLight id="s21" frame={frame} k={0.12} />
      </Camera>
      <Vignette id="s21v" strength={0.3} />
    </Frame>
  );
};

// S22 — ECU: Theo's finger pressing and holding the backspace key.
export const S22: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const press = seg(frame, 6, 12);
  const tremble = press > 0.9 ? Math.sin(frame * 2.3) * 1.2 : 0;
  return (
    <Frame bg="#6E5A4A">
      <Camera cx={lerp(1690, 1710, t)} cy={lerp(340, 330, t)} zoom={lerp(2.1, 2.35, t)}>
        <rect x={-200} y={-200} width={2400} height={1600} fill="#8B6A4A" />
        <Keyboard frame={frame} pressed={press > 0.5 ? [13] : []} />
        <text x={1786} y={334} textAnchor="middle" fontFamily="Helvetica, Arial" fontWeight={700} fontSize={44} fill="#5A5F6E" transform={`translate(0 ${press > 0.5 ? 8 : 0})`}>⌫</text>
        <InsertHand x={1575 + tremble} y={300 + press * 12} s={1.3} grip="point" press={press} />
        <SlideLight id="s22" frame={frame} k={0.15} />
      </Camera>
      <Vignette id="s22v" strength={0.4} />
    </Frame>
  );
};

// S23 — MS: Later, MEDIUM, leans over the back of Theo's chair, hand on his shoulder, frowning at the screen. (L15)
export const S23: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const lean = seg(frame, 0, 40);
  const talk = mouthAt("L15", frame, 12);
  const lx = lerp(730, 772, lean), ly = lerp(430, 412, lean), ls = 1.1;
  const arm = { r: [(905 - lx) / ls, (500 - ly) / ls] as [number, number] };
  return (
    <Frame>
      <Camera cx={lerp(990, 1010, t)} cy={lerp(520, 505, t)} zoom={lerp(1.6, 1.72, t)}>
        <Room sky="afternoon" frame={frame} clockH={4} clockM={5} mess />
        <Later x={lx} y={ly} s={ls} mood="frown" frame={frame} layer="body" mouth={talk} tilt={lerp(0, 10, lean)} arms={arm} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn />
        <TheoUpper pose="type" expr="anxious" frame={frame} typeSpeed={0} lookX={11} lookY={5} />
        <SlideLight id="s23" frame={frame} k={0.22} />
        <Later x={lx} y={ly} s={ls} mood="frown" frame={frame} layer="glow" mouth={talk} tilt={lerp(0, 10, lean)} arms={arm} />
      </Camera>
      <Vignette id="s23v" strength={0.35} />
    </Frame>
  );
};

// S24a — CU: Theo's anxious face, lip trembling; push-in.
export const S24a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(1005, 1015, t)} cy={lerp(445, 440, t)} zoom={lerp(3.3, 3.9, t)}>
        <Room sky="afternoon" frame={frame} clockH={4} clockM={6} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn />
        <TheoUpper pose="type" expr="anxious" frame={frame + 3} typeSpeed={0} lookX={8} lookY={8} />
        <SlideLight id="s24a" frame={frame} k={0.28} />
      </Camera>
      <Vignette id="s24av" strength={0.45} />
    </Frame>
  );
};

// S24b — ECU: a red failing-grade paper reflected in his glasses, sliding across the lenses.
export const S24b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const slide = lerp(-40, 30, frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(1016, 1020, t)} cy={432} zoom={lerp(6.4, 6.9, t)}>
        <Room sky="afternoon" frame={frame} clockH={4} clockM={6} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn />
        <TheoUpper pose="type" expr="anxious" frame={frame + 9} typeSpeed={0} lookX={6} lookY={4} />
        <Lenses id="s24bl" frame={frame} opacity={0.85}>
          {[[985, 432], [1050, 430]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x + slide} ${y - 4})`}>
              <rect x={-15} y={-20} width={30} height={40} fill="#FFFFFF" />
              <circle cx={0} cy={-4} r={9} fill="none" stroke="#D93B3B" strokeWidth={2.4} />
              <text x={0} y={0} textAnchor="middle" fontFamily="Helvetica, Arial" fontWeight={900} fontSize={11} fill="#D93B3B">F</text>
              <line x1={-9} y1={10} x2={9} y2={10} stroke="#C8CCD6" strokeWidth={2} />
            </g>
          ))}
        </Lenses>
        <SlideLight id="s24b" frame={frame} k={0.3} />
      </Camera>
      <Vignette id="s24bv" strength={0.5} />
    </Frame>
  );
};

// S25 — WS surreal stage: tiny Theo in a spotlight; the faceless audience leans in and points; spotlight narrows.
export const S25: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const look = [8, -8, 4, -10][Math.floor(frame / 22) % 4];
  return (
    <Frame>
      <Camera cx={960} cy={lerp(520, 560, t)} zoom={lerp(1.0, 1.1, t)}>
        <StageSet frame={frame} lean={lerp(0.2, 1, t)} spot={lerp(0.65, 0.12, t)} />
        <TheoPuppet x={960} y={640} s={0.55} pose={POSES.stand_small} expr="anxious" frame={frame} lookX={look} lookY={4} />
      </Camera>
      <Vignette id="s25v" strength={0.6} />
    </Frame>
  );
};

// S26 — MCU: Theo gently closes the laptop with a relieved exhale; Later, MEDIUM, grins behind him; room dims.
export const S26: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const close = seg(frame, 8, 34);
  const puff = seg(frame, 34, 46) * (1 - seg(frame, 46, 60));
  return (
    <Frame>
      <Camera cx={lerp(960, 980, t)} cy={lerp(470, 480, t)} zoom={lerp(1.85, 1.95, t)}>
        <Room sky="afternoon" frame={frame} clockH={4} clockM={20} mess />
        <Later x={700} y={380} s={1.05} mood="grin" frame={frame} layer="body" grinOpen={lerp(0.4, 1, close)} />
        <ChairBack /><TheoLegs /><Desk /><LaptopSide close={close} />
        <TheoUpper pose="type" expr={close > 0.6 ? "relieved" : "neutral"} frame={frame} typeSpeed={0} lookX={11} lookY={8} />
        {puff > 0 && [0, 1, 2].map((i) => (
          <path key={i} d={`M${1068 + i * 4 + puff * 20},${480 + i * 8} q12,-6 22,0`} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={puff * 0.8} />
        ))}
        <SlideLight id="s26" frame={frame} k={lerp(0.3, 0.45, close)} />
        <Later x={700} y={380} s={1.05} mood="grin" frame={frame} layer="glow" grinOpen={lerp(0.4, 1, close)} />
      </Camera>
      <Vignette id="s26v" strength={0.4} />
    </Frame>
  );
};

// S27 — MS: Theo vacuums energetically back and forth; Later, MEDIUM, holds the cord like a leash.
export const S27: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const ph = Math.sin(frame * 0.22);
  const hx = 760 + ph * 90;
  const step = (Math.sin(frame * 0.44) + 1) / 2;
  const walk = mixPose(POSES.walk_contact_a, POSES.walk_contact_b, step);
  const pose: TheoPose = { ...walk, lean: 14, armF: [62, 10], armB: [52, 18], handF: "fist" };
  const lx = 380, ly = 600, ls = 0.95;
  const handL: [number, number] = [115, 40];
  const cordEnd: [number, number] = [lx + handL[0] * ls, ly + handL[1] * ls];
  return (
    <Frame>
      <Camera cx={lerp(700, 760, t) + ph * 20} cy={640} zoom={1.4}>
        <Room sky="afternoon" frame={frame} clockH={4} clockM={40} />
        <ChairBack /><Desk /><Laptop screenOn={false} />
        <Later x={lx} y={ly} s={ls} mood="grin" frame={frame} layer="body" arms={{ r: handL }} tilt={ph * 6} />
        <Vacuum x={hx + 103} y={916} s={0.75} cord={cordEnd} />
        <TheoPuppet x={hx} y={760} pose={pose} expr="focused" frame={frame} lookX={9} lookY={8} />
        <SlideLight id="s27" frame={frame} k={0.4} />
        <Later x={lx} y={ly} s={ls} mood="grin" frame={frame} layer="glow" arms={{ r: handL }} tilt={ph * 6} />
      </Camera>
      <Vignette id="s27v" strength={0.35} />
    </Frame>
  );
};

// S28 — CU (top-down desk): hands line up colored pens; the last pen slides into place.
export const S28: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const last = seg(frame, 6, 44);
  const penRight = 640 + (5 * 62 + (1 - last) * 160 + 36) * 1.25;
  const handOff = frame > 52 ? seg(frame, 52, 70) * 220 : 0;
  return (
    <Frame bg="#8B5E3C">
      <Camera cx={lerp(960, 980, t)} cy={560} zoom={lerp(1.0, 1.08, t)}>
        <rect x={-200} y={-200} width={2400} height={1600} fill={C.wood} />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M-200,${120 + i * 170} C400,${100 + i * 170} 1200,${150 + i * 170} 2200,${115 + i * 170}`} fill="none" stroke={C.woodDark} strokeWidth={5} opacity={0.5} />)}
        <g transform="translate(640 330) scale(1.25)"><Pens x={0} y={0} last={last} /></g>
        <g transform={`translate(${penRight + 150 + handOff} 540) scale(-1 1)`}>
          <InsertHand x={0} y={0} s={1} grip="flat" />
        </g>
        <SlideLight id="s28" frame={frame} k={0.45} />
      </Camera>
      <Vignette id="s28v" strength={0.35} />
    </Frame>
  );
};

// S29 — MCU: Theo proudly draws one more colored block on his whiteboard schedule; Mochi asleep.
export const S29: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const blocks = lerp(14, 15, seg(frame, 12, 66));
  const scrub = Math.sin(frame * 0.9) * 6 * (frame > 12 && frame < 66 ? 1 : 0);
  const pose: TheoPose = { ...POSES.reach_board, armF: [98 + scrub * 0.6, 34 - scrub] };
  return (
    <Frame>
      <Camera cx={lerp(780, 800, t)} cy={lerp(520, 510, t)} zoom={lerp(1.75, 1.85, t)}>
        <Room sky="afternoon" frame={frame} clockH={5} clockM={30} />
        <Whiteboard x={700} y={330} blocks={blocks} />
        <Mochi x={330} y={660} s={0.55} frame={frame} />
        <TheoPuppet x={712} y={745} pose={pose} expr={frame > 70 ? "grin" : "smile"} frame={frame} lookX={10} lookY={-4} />
        <SlideLight id="s29" frame={frame} k={0.5} />
      </Camera>
      <Vignette id="s29v" strength={0.35} />
    </Frame>
  );
};

// S30a — WS surreal: tiny Theo at the foot of the paper mountain; slow tilt up to the clouded summit.
export const S30a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={960} cy={lerp(760, -120, t)} zoom={0.78}>
        <PaperMountain frame={frame} />
        <TheoPuppet x={960} y={1000} s={0.42} pose={POSES.stand_small} expr="overwhelmed" frame={frame} lookY={-12} />
      </Camera>
      <Vignette id="s30av" strength={0.35} />
    </Frame>
  );
};

// S30b — Low angle from behind tiny Theo: the mountain fills the frame; crane down onto him; pages drift.
export const S30b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={960} cy={lerp(-80, 790, t)} zoom={lerp(1.05, 1.25, t)}>
        <PaperMountain frame={frame + 72} />
        <TheoBackHead x={960} y={1060} s={1.1} frame={frame} />
      </Camera>
      <Vignette id="s30bv" strength={0.4} />
    </Frame>
  );
};

// S31 — CU: Theo looks up, overwhelmed, pupils tiny, wind in his hair; push-in.
export const S31: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <defs><filter id="s31blur"><feGaussianBlur stdDeviation={10} /></filter></defs>
      <Camera cx={lerp(965, 975, t)} cy={lerp(610, 600, t)} zoom={lerp(2.5, 3.0, t)}>
        <g filter="url(#s31blur)"><PaperMountain frame={frame} /></g>
        <TheoPuppet x={960} y={900} pose={{ ...POSES.stand_small, headTilt: -18 }} expr="overwhelmed" frame={frame} lookX={4} lookY={-13} wind={16} />
        {Array.from({ length: 6 }).map((_, i) => {
          const x = ((frame * 18 + i * 260) % 1400) + 300;
          return <line key={i} x1={x} y1={420 + i * 50} x2={x - 90} y2={426 + i * 50} stroke="#FFFFFF" strokeWidth={3} opacity={0.35} strokeLinecap="round" />;
        })}
      </Camera>
      <Vignette id="s31v" strength={0.45} />
    </Frame>
  );
};

// S32a — Low angle, dusk purple: Theo on the bed with his phone; Later, LARGE, looms and expands; light dims. (L19)
export const S32a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const grow = lerp(1.7, 2.7, t);
  const talk = mouthAt("L19", frame, 12);
  return (
    <Frame>
      <Camera cx={lerp(420, 440, t)} cy={lerp(600, 560, t)} zoom={lerp(1.45, 1.35, t)}>
        <Room sky="dusk" frame={frame} clockH={7} clockM={45} mess />
        <Later x={400} y={lerp(420, 360, t)} s={grow} mood="grin" frame={frame} layer="body" mouth={talk} />
        <TheoPuppet x={440} y={660} rot={-90} pose={POSES.lie_back_phone} expr="smile" frame={frame} lookX={10} lookY={-6} />
        <path d="M470,640 C520,628 600,630 630,660 L630,760 L470,760 Z" fill={C.blanket} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <SlideLight id="s32a" frame={frame} k={lerp(0.7, 0.85, t)} />
        <Later x={400} y={lerp(420, 360, t)} s={grow} mood="grin" frame={frame} layer="glow" mouth={talk} />
      </Camera>
      <Vignette id="s32av" strength={0.5} />
    </Frame>
  );
};

// S32b — ECU: Later's laughing grin fills the frame; smoke curls.
export const S32b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame bg="#140A22">
      <defs>
        <radialGradient id="s32bg" cx="960" cy="560" r="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.magenta} stopOpacity={0.18} /><stop offset="1" stopColor={C.magenta} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#s32bg)" />
      <Camera cx={960} cy={lerp(540, 560, t)} zoom={lerp(1.0, 1.08, t)}>
        <Later x={960} y={420} s={5.2} mood="laugh" frame={frame} />
      </Camera>
      <Vignette id="s32bv" strength={0.6} />
    </Frame>
  );
};

// S32c — WS: the room goes dark purple; tiny Theo on the bed under Later's spread shadow; slow pull back.
export const S32c: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(700, 900, t)} cy={lerp(520, 540, t)} zoom={lerp(1.3, 1.0, t)}>
        <Room sky="dusk" frame={frame} clockH={8} clockM={10} mess />
        <Later x={520} y={300} s={lerp(3.0, 3.4, t)} mood="grin" frame={frame} layer="body" />
        <TheoPuppet x={440} y={660} rot={-90} pose={POSES.lie_back_phone} expr="exhausted" frame={frame} lookX={10} lookY={-6} />
        <path d="M470,640 C520,628 600,630 630,660 L630,760 L470,760 Z" fill={C.blanket} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <ChairBack /><Desk /><Laptop screenOn={false} />
        <LightPool id="s32c" x={300} y={560} r={lerp(1200, 600, t)} dark="#120826" darkness={lerp(0.72, 0.96, t)} glow="#7FD4FF" glowStrength={0.18} glowR={160} />
        <Later x={520} y={300} s={lerp(3.0, 3.4, t)} mood="grin" frame={frame} layer="glow" />
      </Camera>
      <Vignette id="s32cv" strength={0.65} />
    </Frame>
  );
};

export const ACT3: { id: string; Component: React.FC<ShotProps>; duration: number }[] = [
  { id: "S19", Component: S19, duration: 72 },
  { id: "S20", Component: S20, duration: 48 },
  { id: "S21", Component: S21, duration: 72 },
  { id: "S22", Component: S22, duration: 48 },
  { id: "S23", Component: S23, duration: 96 },
  { id: "S24a", Component: S24a, duration: 72 },
  { id: "S24b", Component: S24b, duration: 48 },
  { id: "S25", Component: S25, duration: 96 },
  { id: "S26", Component: S26, duration: 72 },
  { id: "S27", Component: S27, duration: 72 },
  { id: "S28", Component: S28, duration: 72 },
  { id: "S29", Component: S29, duration: 96 },
  { id: "S30a", Component: S30a, duration: 72 },
  { id: "S30b", Component: S30b, duration: 72 },
  { id: "S31", Component: S31, duration: 96 },
  { id: "S32a", Component: S32a, duration: 72 },
  { id: "S32b", Component: S32b, duration: 72 },
  { id: "S32c", Component: S32c, duration: 72 },
];
