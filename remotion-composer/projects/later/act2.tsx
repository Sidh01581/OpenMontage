import React from "react";
import {
  Camera, LightPool, Vignette, Room, ChairBack, Desk, Laptop, Lamp,
  TheoUpper, TheoLegs, Later, Mochi, C, INK, SW, lerp, ease,
} from "./art";
import { TheoPuppet, TheoBackHead, InsertHand, POSES, mixPose, TheoPose } from "./rig";
import { RoadSet, Beanbag, Mug, StickyNote, LaptopFront, UnderBed } from "./sets";
import { mouthAt } from "./act1";
import { ShotProps } from "./shots";

// Act 2 — The deal (0:16–1:05). Warm morning: peach, cream, mustard. Later is SMALL.

const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill={bg} />
    {children}
  </svg>
);
const seg = (f: number, a: number, b: number) => ease((f - a) / (b - a));

// Morning light: two sunbeams from the window, warm wash, floating dust.
export const MorningLight: React.FC<{ id: string; frame: number; dust?: boolean }> = ({ id, frame, dust = true }) => (
  <g>
    <path d="M360,170 L520,170 L1760,860 L1300,860 Z" fill="#FFF2C8" opacity={0.16} />
    <path d="M200,320 L330,320 L1240,860 L1020,860 Z" fill="#FFF2C8" opacity={0.12} />
    <LightPool id={id} x={500} y={300} r={2200} dark="#FF9A4A" darkness={0.14} glow="#FFE3A8" glowStrength={0.2} glowR={1400} />
    {dust && Array.from({ length: 22 }).map((_, i) => {
      const x = 420 + ((i * 137) % 1100) + Math.sin(frame * 0.03 + i) * 12;
      const y = 260 + ((i * 89 + frame * 0.6) % 520);
      return <circle key={i} cx={x} cy={y} r={2.6} fill="#FFF6D6" opacity={0.7} />;
    })}
  </g>
);

const SIT_DESK: TheoPose = { lean: 4, legF: [84, -86], legB: [80, -82], armF: [20, 40], armB: [14, 50] };
const BEANBAG_PHONE: TheoPose = { ...POSES.sit_low, armF: [40, 92], armB: [20, 96], handF: "fist", propF: "phone" };

export const ClosedLaptop: React.FC<{ x?: number }> = ({ x = 1150 }) => (
  <g>
    <rect x={x} y={570} width={230} height={22} rx={6} fill="#B9C2D3" stroke={INK} strokeWidth={5} />
    <rect x={x} y={566} width={230} height={8} rx={3} fill="#9AA3B5" />
  </g>
);

// S6 — WS: morning, Theo stretches beside the bed; Mochi on the windowsill; dust in the sunbeams.
export const S6: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const dip = seg(frame, 0, 10) * (1 - seg(frame, 10, 22));
  const up = seg(frame, 10, 32) * (1 - seg(frame, 54, 70));
  const pose = mixPose(mixPose(POSES.stand_idle, { lean: 8, legF: [10, -14], legB: [-10, -14], armF: [10, 30], armB: [4, 30] }, dip), POSES.stretch_up, up);
  return (
    <Frame>
      <Camera cx={lerp(880, 900, t)} cy={560} zoom={lerp(1.04, 1.12, t)}>
        <Room sky="morning" frame={frame} clockH={10} clockM={0} />
        <ChairBack /><Desk /><ClosedLaptop />
        <Mochi x={330} y={472} s={0.62} frame={frame} pose="sit" mood="closed" />
        <TheoPuppet x={760} y={752 + dip * 10} pose={pose} expr={up > 0.4 ? "relieved" : "smile"} frame={frame} />
        <MorningLight id="s6" frame={frame} />
      </Camera>
      <Vignette id="s6v" strength={0.25} />
    </Frame>
  );
};

// S7 — MCU: confident grin, sticks a yellow note on the wall by the desk, thumbs up.
export const S7: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const reach = seg(frame, 2, 18) * (1 - seg(frame, 24, 34));
  const thumbs = seg(frame, 34, 44);
  let pose = mixPose(SIT_DESK, { ...SIT_DESK, armF: [118, 8] }, reach);
  pose = mixPose(pose, { ...SIT_DESK, armF: [70, 70], handF: "thumb", headTilt: -4 }, thumbs);
  const noteStuck = frame >= 20;
  const pop = thumbs > 0 ? 1 + 0.12 * Math.sin(Math.min(1, (frame - 34) / 8) * Math.PI) : 1;
  return (
    <Frame>
      <Camera cx={lerp(960, 975, t)} cy={480} zoom={lerp(1.9, 2.02, t)}>
        <Room sky="morning" frame={frame} clockH={10} clockM={2} />
        {noteStuck && <StickyNote x={1046} y={452} r={-6} s={0.55} />}
        <ChairBack /><Desk /><ClosedLaptop />
        <g transform={`translate(880 705) scale(${pop}) translate(-880 -705)`}>
          <TheoPuppet x={880} y={705} s={1.02} pose={pose} expr="grin" frame={frame} lookX={8} lookY={-2} />
        </g>
        {!noteStuck && reach > 0.05 && (() => {
          // note travels in the hand until it is stuck
          const k = reach; return <StickyNote x={lerp(960, 1046, k)} y={lerp(600, 452, k)} r={-6} s={0.55} />;
        })()}
        <MorningLight id="s7" frame={frame} />
      </Camera>
      <Vignette id="s7v" strength={0.28} />
    </Frame>
  );
};

// S8 — CU: steaming coffee mug beside the closed laptop; his hand slides the mug aside.
export const S8: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const enter = seg(frame, 12, 22);
  const slide = seg(frame, 24, 42);
  const mugX = lerp(1250, 1170, slide);
  return (
    <Frame>
      <Camera cx={lerp(1255, 1235, t)} cy={548} zoom={lerp(3.1, 3.3, t)}>
        <Room sky="morning" frame={frame} clockH={10} clockM={3} />
        <Desk /><ClosedLaptop x={1330} />
        <Mug x={mugX} y={588} frame={frame} s={0.8} />
        <g transform={`translate(${lerp(1460, mugX + 74, enter) + 0} 560) scale(-0.28 0.28)`}>
          <InsertHand x={0} y={0} grip="curl" />
        </g>
        <MorningLight id="s8" frame={frame} dust={false} />
      </Camera>
      <Vignette id="s8v" strength={0.3} />
    </Frame>
  );
};

// S9 — CU: laptop opens to a blank white document; white light spreads over the frame (his face's POV).
export const S9: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const open = seg(frame, 4, 30);
  return (
    <Frame bg="#E9CFA8">
      <defs>
        <radialGradient id="s9w" cx="960" cy="470" r="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55 * open} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <Camera cx={960} cy={lerp(520, 500, t)} zoom={lerp(1.22, 1.34, t)}>
        <rect x={-500} y={-500} width={3000} height={1320} fill={C.wall} />
        <rect x={-500} y={810} width={3000} height={800} fill={C.wood} />
        <line x1={-500} y1={810} x2={2500} y2={810} stroke={INK} strokeWidth={SW} />
        <Mug x={1500} y={800} frame={frame} s={0.9} />
        <LaptopFront frame={frame} open={open} mode="doc" lines={0} />
        <LightPool id="s9" x={500} y={200} r={2200} dark="#FF9A4A" darkness={0.12} />
        <rect x={-500} y={-500} width={3000} height={2000} fill="url(#s9w)" />
      </Camera>
      <Vignette id="s9v" strength={0.3} />
    </Frame>
  );
};

// Lens overlay helper: draws content clipped to Theo's two lenses (seated head coords, with the rig's breathing offset).
export const Lenses: React.FC<{ id: string; frame: number; children: React.ReactNode; opacity?: number }> = ({ id, frame, children, opacity = 0.6 }) => {
  const oy = Math.sin(frame * 0.12) * 3 * 1.4;
  return (
    <g transform={`translate(0 ${oy})`} opacity={opacity}>
      <defs>
        <clipPath id={id}><circle cx={985} cy={432} r={31} /><circle cx={1050} cy={430} r={26} /></clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

// S10 — ECU: smile fades to a blank stare; the empty page and blinking cursor reflected in his glasses.
export const S10: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const expr = frame < 14 ? "smile" : frame < 26 ? "neutral" : "blank";
  const blink = Math.floor(frame / 10) % 2 === 0;
  return (
    <Frame>
      <Camera cx={lerp(1010, 1018, t)} cy={438} zoom={lerp(4.0, 4.5, t)}>
        <Room sky="morning" frame={frame} clockH={10} clockM={4} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FFFFFF" />
        <TheoUpper pose="type" expr={expr} frame={frame + 20} typeSpeed={0} lookX={10} lookY={3} />
        <Lenses id="s10l" frame={frame}>
          {[[985, 432], [1050, 430]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 16} y={y - 20} width={32} height={40} fill="#FFFFFF" opacity={0.9} />
              {blink && <line x1={x - 9} y1={y - 12} x2={x - 9} y2={y - 4} stroke={INK} strokeWidth={2} />}
            </g>
          ))}
        </Lenses>
        <LightPool id="s10" x={1300} y={460} r={900} dark="#C98A5A" darkness={0.25} glow="#FFFFFF" glowStrength={0.3} glowR={420} />
      </Camera>
      <Vignette id="s10v" strength={0.4} />
    </Frame>
  );
};

// S11 — Low angle: darkness under the bed; two small magenta eyes blink open and glow.
export const S11: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const open = seg(frame, 22, 30) * (frame > 52 && frame < 56 ? 0.1 : 1);
  const glow = 0.6 + 0.4 * Math.sin(frame * 0.2);
  return (
    <Frame>
      <Camera cx={960} cy={lerp(560, 600, t)} zoom={lerp(1.0, 1.12, t)}>
        <UnderBed frame={frame} light={0} />
        <g transform="translate(1120 640)">
          <ellipse cx={0} cy={0} rx={120} ry={60} fill={C.magenta} opacity={0.12 * open * glow} />
          {[-1, 1].map((s) => (
            <g key={s} transform={`translate(${s * 30} 0) scale(1 ${Math.max(0.05, open)})`}>
              <ellipse cx={0} cy={0} rx={18} ry={12} fill={C.magenta} />
              <ellipse cx={0} cy={1} rx={8} ry={5} fill={C.magentaHot} />
            </g>
          ))}
        </g>
      </Camera>
      <Vignette id="s11v" strength={0.6} />
    </Frame>
  );
};

// S12 — MS: Later, SMALL and cute, slides out from under the bed; Mochi (on the bed) arches and hisses.
export const S12: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const slide = seg(frame, 0, 24);
  const lx = lerp(250, 600, slide);
  const arched = frame >= 12;
  const squash = arched ? 1 + 0.15 * Math.exp(-(frame - 12) / 3) : 1;
  return (
    <Frame>
      <Camera cx={lerp(440, 560, t)} cy={700} zoom={1.9}>
        <Room sky="morning" frame={frame} clockH={10} clockM={6} />
        <Later x={lx} y={818} s={0.5} mood="sly" frame={frame} grinOpen={0.6} tilt={Math.sin(frame * 0.3) * 4} />
        <g transform={`translate(400 652) scale(${1 / squash} ${squash}) translate(-400 -652)`}>
          {arched ? <Mochi x={400} y={652} s={0.55} frame={frame} pose="arch" flip /> : <Mochi x={400} y={652} s={0.55} frame={frame} />}
        </g>
        <ChairBack /><Desk />
        <MorningLight id="s12" frame={frame} />
      </Camera>
      <Vignette id="s12v" strength={0.3} />
    </Frame>
  );
};

// S13a — CU: Later on the desk edge pushes the phone toward camera and speaks (L09).
export const S13a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("L09", frame, 12);
  return (
    <Frame>
      <Camera cx={lerp(1440, 1450, t)} cy={lerp(520, 530, t)} zoom={lerp(2.9, 3.25, t)}>
        <Room sky="morning" frame={frame} clockH={10} clockM={4} />
        <Desk /><Laptop screenOn screenColor="#FFFFFF" /><Lamp on={false} />
        <Later x={1455} y={528} s={0.55} mood="sly" frame={frame} phone={t} mouth={talk} tilt={Math.sin(frame * 0.08) * 5} />
        <MorningLight id="s13a" frame={frame} />
      </Camera>
      <Vignette id="s13av" strength={0.3} />
    </Frame>
  );
};

// S13b — CU: Theo's face lit by the offered phone; pupils drift to it; a small swallow (nod).
export const S13b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const look = lerp(4, 12, seg(frame, 6, 40));
  return (
    <Frame>
      <Camera cx={lerp(990, 1005, t)} cy={lerp(440, 450, t)} zoom={lerp(3.2, 3.6, t)}>
        <Room sky="morning" frame={frame} clockH={10} clockM={4} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FFFFFF" />
        <g transform={`translate(0 ${frame > 48 && frame < 56 ? 4 : 0})`}>
          <TheoUpper pose="type" expr="neutral" frame={frame + 5} typeSpeed={0} lookX={look} lookY={lerp(3, 9, seg(frame, 6, 40))} />
        </g>
        <LightPool id="s13b" x={1160} y={540} r={900} dark="#B9875A" darkness={0.3} glow="#7FD4FF" glowStrength={0.35} glowR={300} />
      </Camera>
      <Vignette id="s13bv" strength={0.4} />
    </Frame>
  );
};

// Phone with an app grid (shared by S14 / S15 reflections).
const AppGrid: React.FC<{ x: number; y: number; w: number; h: number; scroll: number }> = ({ x, y, w, h, scroll }) => {
  const cols = ["#FF6B9A", "#FFD36E", "#7DE08A", "#B58AFF", "#FF9F5A", "#5AB0FF"];
  const cells = [];
  for (let i = 0; i < 30; i++) {
    const cy = y + 20 + Math.floor(i / 3) * (h / 4) - (scroll % (h / 4 * 3));
    if (cy < y - h / 4 || cy > y + h) continue;
    cells.push(<rect key={i} x={x + 14 + (i % 3) * (w / 3)} y={cy} width={w / 3 - 24} height={h / 4 - 22} rx={10} fill={cols[(i * 7) % 6]} />);
  }
  return <g>{cells}</g>;
};

// S14 — OTS: over Theo's shoulder: phone glowing in his hand, blank laptop behind it; thumb hovers, then taps.
export const S14: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const hover = Math.sin(frame * 0.25) * 6 * (1 - seg(frame, 52, 60));
  const tap = seg(frame, 56, 62) * (1 - seg(frame, 62, 70));
  const flash = frame >= 62 ? Math.max(0, 1 - (frame - 62) / 10) : 0;
  return (
    <Frame bg={C.wall}>
      <defs>
        <filter id="s14blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={7} /></filter>
        <clipPath id="s14scr"><rect x={-130} y={-250} width={260} height={480} rx={18} /></clipPath>
      </defs>
      <Camera cx={lerp(960, 990, t)} cy={540} zoom={lerp(1.0, 1.06, t)}>
        <g filter="url(#s14blur)">
          <rect x={-200} y={-200} width={2400} height={900} fill={C.wall} />
          <rect x={-200} y={700} width={2400} height={600} fill={C.wood} />
          <g transform="translate(560 120) scale(0.7)"><LaptopFront frame={frame} open={1} mode="doc" lines={0} /></g>
        </g>
        <TheoBackHead x={420} y={660} s={1.8} frame={frame} />
        {/* phone in his hand */}
        <g transform="translate(1180 640) rotate(-8)">
          <ellipse cx={-150} cy={140} rx={90} ry={120} fill={C.skin} stroke={INK} strokeWidth={SW} />
          <rect x={-150} y={-280} width={300} height={540} rx={40} fill="#20222A" stroke={INK} strokeWidth={8} />
          <rect x={-130} y={-250} width={260} height={480} rx={18} fill="#7FD4FF" />
          <g clipPath="url(#s14scr)"><AppGrid x={-130} y={-250} w={260} h={480} scroll={frame * 2} /></g>
          <rect x={-130} y={-250} width={260} height={480} rx={18} fill="#FFFFFF" opacity={flash * 0.6} />
          {[-40, 10, 60].map((fy) => <rect key={fy} x={-185} y={fy} width={60} height={42} rx={20} fill={C.skin} stroke={INK} strokeWidth={5} />)}
          {/* thumb */}
          <path d={`M-150,60 Q-70,${-10 + hover} ${-10 + hover},${-40 + tap * 18}`} fill="none" stroke={INK} strokeWidth={56} strokeLinecap="round" />
          <path d={`M-150,60 Q-70,${-10 + hover} ${-10 + hover},${-40 + tap * 18}`} fill="none" stroke={C.skin} strokeWidth={44} strokeLinecap="round" />
        </g>
        <LightPool id="s14" x={1180} y={600} r={1300} dark="#C98A5A" darkness={0.22} glow="#7FD4FF" glowStrength={0.3} glowR={500} />
      </Camera>
      <Vignette id="s14v" strength={0.35} />
    </Frame>
  );
};

// S15 — CU: face lit by the phone, small smile; colorful reflections scroll upward in his glasses.
export const S15: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const cols = ["#FF6B9A", "#FFD36E", "#7DE08A", "#B58AFF", "#5AB0FF"];
  return (
    <Frame>
      <Camera cx={lerp(1005, 1012, t)} cy={445} zoom={lerp(3.6, 3.9, t)}>
        <Room sky="morning" frame={frame} clockH={10} clockM={9} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FFFFFF" />
        <TheoUpper pose="type" expr="smile" frame={frame + 11} typeSpeed={0} lookX={9} lookY={11} />
        <Lenses id="s15l" frame={frame} opacity={0.55}>
          {Array.from({ length: 12 }).map((_, i) => {
            const y = 470 - ((frame * 2.2 + i * 18) % 120);
            return <rect key={i} x={955 + (i % 2) * 64} y={y} width={30} height={12} rx={3} fill={cols[i % 5]} />;
          })}
        </Lenses>
        <LightPool id="s15" x={1120} y={560} r={800} dark="#7A5A4A" darkness={0.42} glow="#7FD4FF" glowStrength={0.4} glowR={300} />
      </Camera>
      <Vignette id="s15v" strength={0.45} />
    </Frame>
  );
};

// S16a — WS surreal road: tiny cap on the horizon vs giant sparkling phone; parallax drift toward the phone.
export const S16a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(900, 1040, t)} cy={lerp(540, 520, t)} zoom={lerp(1.0, 1.08, t)}>
        <RoadSet frame={frame} />
        <TheoPuppet x={lerp(760, 740, t)} y={940} s={0.9} pose={POSES.stand_small} expr="smile" frame={frame} lookX={10} lookY={-6} />
      </Camera>
      <Vignette id="s16av" strength={0.25} />
    </Frame>
  );
};

// S16b — MS: Theo turns from the tiny cap to the giant phone and leans toward it; the cap dims.
export const S16b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const turned = frame >= 26;
  const lean = seg(frame, 32, 60);
  const pose = mixPose(POSES.stand_small, { ...POSES.stand_idle, lean: 14, armF: [40, 30], headTilt: 6 }, turned ? lean : 0);
  return (
    <Frame>
      <Camera cx={lerp(930, 990, t)} cy={lerp(660, 640, t)} zoom={1.65}>
        <RoadSet frame={frame} capGlow={lerp(0.9, 0.05, seg(frame, 20, 60))} phoneGlow={lerp(0.8, 1.3, t)} />
        <TheoPuppet x={900} y={900} s={0.95} flip={!turned} pose={pose} expr={turned ? "smile" : "neutral"} frame={frame}
          lookX={turned ? 10 : 6} lookY={-8} eyesClosed={frame >= 24 && frame < 28} />
      </Camera>
      <Vignette id="s16bv" strength={0.3} />
    </Frame>
  );
};

// S17 — CU: Theo lying on the bed with the phone; Later, SMALL, curled on his shoulder whispering; eyelids droop.
export const S17: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const nuzzle = seg(frame, 10, 60);
  const whisper = 0.25 + 0.25 * Math.max(0, Math.sin(frame * 0.7));
  return (
    <Frame>
      <Camera cx={lerp(280, 265, t)} cy={lerp(585, 595, t)} zoom={lerp(2.5, 2.75, t)}>
        <Room sky="morning" frame={frame} clockH={11} clockM={30} />
        <TheoPuppet x={440} y={660} rot={-90} pose={POSES.lie_back_phone} expr={frame > 62 ? "exhausted" : "smile"} frame={frame} lookX={10} lookY={-6} />
        {/* blanket over his legs */}
        <path d="M470,640 C520,628 600,630 630,660 L630,760 L470,760 Z" fill={C.blanket} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <Later x={lerp(330, 300, nuzzle)} y={lerp(560, 568, nuzzle)} s={0.36} mood="sly" frame={frame} grinOpen={0.4} mouth={whisper} tilt={lerp(0, -16, nuzzle)} />
        <LightPool id="s17" x={330} y={560} r={1200} dark="#C98A5A" darkness={0.2} glow="#7FD4FF" glowStrength={0.25} glowR={260} />
      </Camera>
      <Vignette id="s17v" strength={0.4} />
    </Frame>
  );
};

// S18a — CU: Theo in the beanbag with the phone, guilty half-smile: "Okay. Five minutes." (L12)
export const S18a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("L12", frame, 12);
  const sink = lerp(0, 10, t);
  return (
    <Frame>
      <Camera cx={lerp(1290, 1300, t)} cy={lerp(560, 575, t)} zoom={lerp(2.4, 2.6, t)}>
        <Room sky="morning" frame={frame} clockH={11} clockM={50} mess />
        <Beanbag x={1250} y={920} s={1.15} squash={t * 0.6} />
        <TheoPuppet x={1220} y={800 + sink} pose={BEANBAG_PHONE} expr="guilty" frame={frame} talk={talk} lookX={10} lookY={10} />
        <LightPool id="s18a" x={1330} y={640} r={1100} dark="#C98A5A" darkness={0.24} glow="#7FD4FF" glowStrength={0.3} glowR={280} />
      </Camera>
      <Vignette id="s18av" strength={0.4} />
    </Frame>
  );
};

// S18b — CU: Mochi on the bed gives Theo a judging stare; eyes narrow, tail flicks.
export const S18b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(330, 324, t)} cy={lerp(560, 556, t)} zoom={lerp(3.0, 3.25, t)}>
        <Room sky="morning" frame={frame} clockH={11} clockM={52} />
        <Mochi x={330} y={660} s={1.0} frame={frame} pose="sit" mood={frame < 14 ? "open" : "judge"} look={6} />
        <MorningLight id="s18b" frame={frame} dust={false} />
      </Camera>
      <Vignette id="s18bv" strength={0.35} />
    </Frame>
  );
};

// S18c — MS: wide on Theo sinking into the beanbag; Mochi turns away and lies down.
export const S18c: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const sink = lerp(8, 30, t);
  const away = frame >= 40;
  return (
    <Frame>
      <Camera cx={lerp(820, 860, t)} cy={lerp(640, 620, t)} zoom={lerp(1.32, 1.2, t)}>
        <Room sky="morning" frame={frame} clockH={11} clockM={55} mess />
        {away ? <Mochi x={340} y={660} s={0.55} frame={frame} /> : <Mochi x={330} y={660} s={0.55} frame={frame} pose="sit" mood="judge" />}
        <ChairBack /><Desk /><Laptop screenOn={false} />
        <Beanbag x={1250} y={920} s={1.15} squash={0.6 + t * 0.4} />
        <TheoPuppet x={1220} y={800 + sink} pose={BEANBAG_PHONE} expr="smile" frame={frame} lookX={10} lookY={10} />
        <MorningLight id="s18c" frame={frame} />
      </Camera>
      <Vignette id="s18cv" strength={0.3} />
    </Frame>
  );
};

export const ACT2: { id: string; Component: React.FC<ShotProps>; duration: number }[] = [
  { id: "S6", Component: S6, duration: 72 },
  { id: "S7", Component: S7, duration: 72 },
  { id: "S8", Component: S8, duration: 48 },
  { id: "S9", Component: S9, duration: 72 },
  { id: "S10", Component: S10, duration: 48 },
  { id: "S11", Component: S11, duration: 72 },
  { id: "S12", Component: S12, duration: 48 },
  { id: "S13a", Component: S13a, duration: 72 },
  { id: "S13b", Component: S13b, duration: 72 },
  { id: "S14", Component: S14, duration: 96 },
  { id: "S15", Component: S15, duration: 72 },
  { id: "S16a", Component: S16a, duration: 72 },
  { id: "S16b", Component: S16b, duration: 72 },
  { id: "S17", Component: S17, duration: 96 },
  { id: "S18a", Component: S18a, duration: 72 },
  { id: "S18b", Component: S18b, duration: 48 },
  { id: "S18c", Component: S18c, duration: 72 },
];
