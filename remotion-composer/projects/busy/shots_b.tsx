import React from "react";
import { INK, SW, Clock } from "../later/art";
import { VFrame, VCamera, VVignette, TheoSeated, Priya, Mug, P, lerp, ease, easeOut, rnd } from "../we-need-to-talk/vart";
import { PhoneBody } from "../sure/sets";
import { DevWalker, BusyHUD, AisleSet } from "./bart";
import { DevSeated, Coworker, WatchCU, WindowCascade, CatFeed, SelfieView, EmployeeFrame } from "./bart2";
import { ShotDef, ShotProps, mouthAt, F, STEPS0, TheoDesk } from "./shots_a";

// BUSY. — shots 4–20 + end screen. Pure functions of (frame, duration).

const MorningLight: React.FC = () => <rect width={1080} height={1920} fill="#FFF6DA" opacity={0.08} />;
const clamp = (t: number) => Math.max(0, Math.min(1, t));
const bump = (t: number) => (t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI));

// Coworker heads behind cubicle panels: every other cubicle, eyes on Dev (who is at frame x devX).
const heads = (frame: number, devX: number, nodFor?: (i: number) => number) => (i: number, fx: number) =>
  i % 2 === 0 ? <Coworker x={260} y={1030} s={0.55} v={i} frame={frame} look={fx > devX ? -1 : 1} nod={nodFor?.(i) ?? 0} /> : null;

// ---------------------------------------------------------------- Dev's desk world (frame-space at zoom 1)
// Wall + window + partition behind him (Priya leans on its cap at y = 950). Floor line y = 1480.
const PART_TOP = 950;
const DevDeskBack: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={-800} y={-800} width={2700} height={3600} fill={P.officeWall} />
    <rect x={-800} y={-800} width={2700} height={1100} fill="#F7F1E3" />
    <line x1={-800} y1={300} x2={1900} y2={300} stroke={INK} strokeWidth={SW} />
    <g>
      <rect x={560} y={380} width={380} height={380} fill="#BFE3F2" />
      <path d="M560,760 L560,660 L620,660 L620,610 L690,610 L690,690 L760,690 L760,580 L830,580 L830,650 L940,650 L940,760 Z" fill="#8FB3C2" />
      <rect x={560} y={380} width={380} height={380} fill="none" stroke={P.shirt} strokeWidth={16} />
      <rect x={560} y={380} width={380} height={380} fill="none" stroke={INK} strokeWidth={SW} />
      <line x1={750} y1={380} x2={750} y2={760} stroke={P.shirt} strokeWidth={10} />
    </g>
    <Clock x={180} y={470} r={60} h={9} m={20 + frame * 0.02} />
    <rect x={-800} y={1480} width={2700} height={1400} fill={P.carpet} />
    <line x1={-800} y1={1480} x2={1900} y2={1480} stroke={INK} strokeWidth={SW} />
  </g>
);
const DevDeskPartition: React.FC = () => (
  <g>
    <rect x={-800} y={PART_TOP} width={2700} height={530} fill={P.partition} stroke={INK} strokeWidth={SW} />
    {Array.from({ length: 16 }).map((_, i) => <line key={i} x1={-700 + i * 160} y1={PART_TOP + 24} x2={-700 + i * 160} y2={1470} stroke={P.partitionShade} strokeWidth={4} />)}
    <rect x={-810} y={PART_TOP - 14} width={2720} height={22} rx={6} fill={P.trim} stroke={INK} strokeWidth={SW} />
    <rect x={40} y={1010} width={60} height={60} fill="#FFE27A" stroke={INK} strokeWidth={3} transform="rotate(-6 70 1040)" />
    <rect x={470} y={1000} width={110} height={80} fill="#F4EEE2" stroke={INK} strokeWidth={3} />
    <text x={525} y={1050} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={26} fill="#C0392B">URGENT</text>
  </g>
);
const DEV = { x: 330, y: 1250, s: 1.5 };

// Shot 4 — MS tracking (6.0–8.21): the busy walk, coworkers' eyes follow him. "Look at him! Walking fast, carrying random papers…"
export const B04: React.FC<ShotProps> = ({ frame, duration }) => {
  const scroll = 1600 + frame * 28;
  const steps = STEPS0 + 40 + Math.floor(frame / 6);
  return (
    <VFrame>
      <VCamera cx={540} cy={960} zoom={lerp(1.06, 1.12, ease(frame / duration))}>
        <AisleSet frame={frame} scroll={scroll} cubicleExtra={heads(frame, 470)} />
        <ellipse cx={480} cy={1560} rx={150} ry={22} fill="#000" opacity={0.15} />
        <DevWalker x={470} y={1560 - 186 * 1.25} s={1.25} frame={frame} phase={frame / 6} lookX={15} lookY={3} paperLabel="LUNCH MENU" />
      </VCamera>
      <BusyHUD x={260} y={400} steps={steps} coffee={3} work={0} age={30} tick={frame % 6 < 2 ? 1 : 0} />
      <MorningLight />
      <VVignette id="b4v" strength={0.22} />
    </VFrame>
  );
};

// Shot 5 — CU walking (8.21–10.42): he snaps his wrist up and frowns at his watch; then insert of the watch face.
export const B05: React.FC<ShotProps> = ({ frame }) => {
  const snap = easeOut((frame - 24) / 4);
  const insert = frame >= 36;
  if (insert) {
    return (
      <VFrame>
        <rect width={1080} height={1920} fill="#E9E1CC" />
        <g opacity={0.35}><AisleSet frame={frame} scroll={2200 + frame * 10} /></g>
        <WatchCU t={easeOut((frame - 36) / 3)} frame={frame} />
        <VVignette id="b5w" strength={0.35} />
      </VFrame>
    );
  }
  return (
    <VFrame>
      <VCamera cx={560} cy={lerp(900, 880, frame / 36)} zoom={2.1}>
        <AisleSet frame={frame} scroll={2100 + frame * 30} />
        <DevWalker x={470} y={1560 - 186 * 1.25} s={1.25} frame={frame} phase={frame / 6} speed={1 - 0.5 * snap} lookX={15} lookY={lerp(3, 12, snap)} watch={snap} />
      </VCamera>
      <MorningLight />
      <VVignette id="b5v" strength={0.3} />
    </VFrame>
  );
};

// Shot 6 — MS static (10.42–12.21): Dev passes a coworker and gives a grave "crisis" nod; the coworker nods back, confused.
export const B06: React.FC<ShotProps> = ({ frame, duration }) => {
  const devX = lerp(150, 560, frame / duration);
  const devNod = bump((frame - 12) / 14);
  const coNod = bump((frame - 22) / 12) * 0.8;
  return (
    <VFrame>
      <VCamera cx={560} cy={1000} zoom={1.22}>
        <AisleSet frame={frame} scroll={1075} cubicleExtra={(i, fx) => (i === 4 ? <Coworker x={260} y={1030} s={0.55} v={1} frame={frame} look={-1} nod={coNod} /> : heads(frame, devX)(i, fx))} />
        <ellipse cx={devX + 10} cy={1560} rx={150} ry={22} fill="#000" opacity={0.15} />
        <DevWalker x={devX} y={1560 - 186 * 1.25} s={1.25} frame={frame} phase={frame / 7} speed={0.75} lookX={16} lookY={lerp(3, 10, devNod)} nod={devNod} />
      </VCamera>
      <MorningLight />
      <VVignette id="b6v" strength={0.22} />
    </VFrame>
  );
};

// Shot 7 — low angle, slow-mo hero walk (12.21–14.21): hair in the wind, sparkles, golden grade. "…he definitely looks important!"
const Sparkle: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) => (
  <path transform={`translate(${x} ${y})`} d={`M0,${-r} Q${r * 0.15},${-r * 0.15} ${r},0 Q${r * 0.15},${r * 0.15} 0,${r} Q${-r * 0.15},${r * 0.15} ${-r},0 Q${-r * 0.15},${-r * 0.15} 0,${-r} Z`} fill="#FFFFFF" opacity={o} />
);
export const B07: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = frame / duration;
  return (
    <VFrame>
      <VCamera cx={540} cy={1180} zoom={lerp(1.0, 1.1, ease(t))} rot={-3}>
        <AisleSet frame={frame} scroll={600 + frame * 3} />
        <DevWalker x={500} y={1900 - 186 * 2.0} s={2.0} frame={frame / 3} phase={frame / 20} speed={0.9} lookX={16} lookY={0} headTilt={-4} />
      </VCamera>
      <rect width={1080} height={1920} fill="#FFC93C" opacity={0.14} />
      <defs><radialGradient id="b7f" cx={880} cy={260} r={700} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFF6D8" stopOpacity={0.9} /><stop offset="1" stopColor="#FFF6D8" stopOpacity={0} /></radialGradient></defs>
      <rect width={1080} height={1920} fill="url(#b7f)" />
      {Array.from({ length: 9 }).map((_, i) => {
        const ph = (frame * 0.04 + rnd(i * 3.1)) % 1;
        return <Sparkle key={i} x={220 + rnd(i * 7.7) * 640} y={520 + rnd(i * 5.3) * 700 - ph * 80} r={18 + rnd(i) * 22} o={bump(ph)} />;
      })}
      <VVignette id="b7v" strength={0.4} />
    </VFrame>
  );
};

// Shot 8 — MS (14.21–16.42): Dev drops into his chair, sets the coffee down, cracks his knuckles.
export const B08: React.FC<ShotProps> = ({ frame, duration }) => {
  const drop = easeOut(frame / 6);
  const crack = clamp((frame - 22) / 16);
  return (
    <VFrame>
      <VCamera cx={560} cy={lerp(980, 960, ease(frame / duration))} zoom={1.15}>
        <DevDeskBack frame={frame} />
        <DevDeskPartition />
        <g transform={`translate(0 ${lerp(-60, 0, drop)})`}>
          <DevSeated x={DEV.x} y={DEV.y} s={DEV.s} frame={frame} pose={crack > 0 && crack < 1 ? "knuckles" : "type"} crack={crack} />
        </g>
      </VCamera>
      <MorningLight />
      <VVignette id="b8v" strength={0.25} />
    </VFrame>
  );
};

// Shot 9 — ECU monitor (16.42–18.42): ten windows pop open one after another; alt-tab flicker.
export const B09: React.FC<ShotProps> = ({ frame }) => {
  const n = Math.min(10, 1 + Math.floor(frame / 3.6));
  const focus = frame > 38 ? Math.floor(frame / 3) % n : -1;
  return (
    <VFrame bg="#1C1F28">
      <g transform={`translate(540 900) scale(${lerp(1.08, 1.16, frame / 48)}) rotate(-2)`}>
        <rect x={-500} y={-360} width={1000} height={720} rx={30} fill="#2A2E38" stroke={INK} strokeWidth={SW} />
        <g transform="translate(-450 -310)"><WindowCascade n={n} frame={frame} focus={focus} /></g>
        <path d={`M${-120 + (frame * 37) % 300},${-40 + (frame * 23) % 200} l0,40 l11,-10 l9,20 l8,-4 l-9,-19 l15,-1 Z`} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
      </g>
      <rect width={1080} height={1920} fill="#5E7FB8" opacity={0.08} />
      <VVignette id="b9v" strength={0.55} />
    </VFrame>
  );
};

// Shot 10 — CU hands (18.42–20.0): keyboard going crazy: hands blur, keys fly, desk shakes.
export const B10: React.FC<ShotProps> = ({ frame }) => {
  const sh = 6;
  return (
    <VFrame>
      <VCamera cx={600} cy={1160} zoom={2.5} shakeX={Math.sin(frame * 3.1) * sh} shakeY={Math.cos(frame * 2.7) * sh * 0.6}>
        <DevDeskBack frame={frame} />
        <DevDeskPartition />
        <DevSeated x={DEV.x} y={DEV.y} s={DEV.s} frame={frame} pose="upright" typeSpeed={2.2} />
      </VCamera>
      {[0, 1, 2, 3].map((i) => {
        const ph = ((frame + i * 5) % 14) / 14;
        return <text key={i} x={300 + i * 160} y={900 - ph * 200} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={64} fill="#FFFFFF" stroke={INK} strokeWidth={6} paintOrder="stroke" opacity={1 - ph}>{["CLACK", "TAK", "CLACK", "TIK"][i]}</text>;
      })}
      <VVignette id="b10v" strength={0.3} />
    </VFrame>
  );
};

// Shot 11 — ECU eyes (20.0–21.71): eyes locked on the screen, monitor glow.
export const B11: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={455} cy={790} zoom={lerp(3.3, 3.6, ease(frame / duration))}>
      <DevDeskBack frame={frame} />
      <DevDeskPartition />
      <DevSeated x={DEV.x} y={DEV.y} s={DEV.s} frame={frame + 30} pose="type" typeSpeed={1.4} lookX={17} lookY={2} />
    </VCamera>
    <rect width={1080} height={1920} fill="#7FB0FF" opacity={0.16} />
    {[0, 1, 2].map((i) => <rect key={i} x={0} y={(frame * 40 + i * 640) % 1920} width={1080} height={40} fill="#FFFFFF" opacity={0.05} />)}
    <VVignette id="b11v" strength={0.45} />
  </VFrame>
);

// Shot 12 — MCU (21.71–23.42): Theo pops up, alarmed: "Oh, wait! The manager is coming!"
export const B12: React.FC<ShotProps> = ({ frame, duration }) => {
  const pop = easeOut(frame / 4);
  const settle = Math.exp(-frame / 4) * Math.sin(frame * 1.4) * 10;
  const talk = mouthAt("T09", frame, F(21.8, 21.708));
  return (
    <VFrame>
      <VCamera cx={1000} cy={470} zoom={lerp(2.3, 2.45, ease(frame / duration))}>
        <TheoDesk frame={frame} />
        <g transform={`translate(0 ${lerp(70, 0, pop) + settle})`}>
          <TheoSeated expr="shock" frame={frame} talk={talk} headRot={-6} lookX={-14} lookY={-2} sweat={2} />
        </g>
      </VCamera>
      <MorningLight />
      <VVignette id="b12v" strength={0.3} />
    </VFrame>
  );
};

// Shot 13 — MS tracking (23.42–25.0): Priya glides down the aisle behind a foreground partition, #1 mug, all smiles.
export const B13: React.FC<ShotProps> = ({ frame }) => {
  const bob = Math.abs(Math.sin(frame * 0.45)) * -10;
  return (
    <VFrame>
      <AisleSet frame={frame} scroll={2400 - frame * 12} cubicleExtra={heads(frame, 540)} />
      <g transform={`translate(0 ${bob})`}>
        <Priya x={560} y={880} s={1.35} frame={frame} expr="smile" lookX={-8} lookY={2} />
        <Mug x={330} y={1080} s={1.3} frame={frame} />
      </g>
      {/* foreground partition, scrolling the other way */}
      <rect x={-20} y={1180} width={1120} height={760} fill={P.partition} stroke={INK} strokeWidth={SW} />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = ((i * 180 + frame * 18) % 1260) - 90;
        return <line key={i} x1={x} y1={1210} x2={x} y2={1920} stroke={P.partitionShade} strokeWidth={5} />;
      })}
      <rect x={-20} y={1166} width={1120} height={24} rx={6} fill={P.trim} stroke={INK} strokeWidth={SW} />
      <MorningLight />
      <VVignette id="b13v" strength={0.22} />
    </VFrame>
  );
};

// Shot 14 — MS (25.0–26.79): Dev SNAPS upright, types twice as fast, sweat; the tag flips to LOOKING BUSY: 1000%.
export const B14: React.FC<ShotProps> = ({ frame, duration }) => {
  const snap = frame >= 5;
  const shake = snap ? 10 * Math.exp(-(frame - 5) / 3) : 0;
  return (
    <VFrame>
      <VCamera cx={500} cy={880} zoom={lerp(1.45, 1.6, ease(frame / duration))} shakeX={Math.sin(frame * 3) * shake}>
        <DevDeskBack frame={frame} />
        <DevDeskPartition />
        <DevSeated x={DEV.x} y={DEV.y} s={DEV.s} frame={frame} pose={snap ? "upright" : "type"} typeSpeed={snap ? 2.0 : 0.6} sweat={snap ? 3 : 0} lookX={18} />
      </VCamera>
      {frame >= 5 && <BusyHUD x={260} y={300} steps={STEPS0 + 101} coffee={4} work={0} age={frame - 5} busy />}
      {frame < 5 && <BusyHUD x={260} y={300} steps={STEPS0 + 101} coffee={4} work={0} age={20} />}
      <MorningLight />
      <VVignette id="b14v" strength={0.25} />
    </VFrame>
  );
};

// Shot 15 — 2-shot (26.79–28.58): Priya leans on Dev's partition, nods approvingly; Dev never looks up.
export const B15: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={520} cy={900} zoom={lerp(1.2, 1.3, ease(frame / duration))}>
      <DevDeskBack frame={frame} />
      <Priya x={720} y={700} s={1} frame={frame} expr="smile" headTilt={Math.sin(frame * 0.3) * 7} lookX={-12} lookY={6} />
      <Mug x={600} y={905} s={1} frame={frame} />
      <DevDeskPartition />
      <DevSeated x={DEV.x} y={DEV.y} s={DEV.s} frame={frame} pose="upright" typeSpeed={2.0} sweat={3} lookX={18} />
    </VCamera>
    <BusyHUD x={260} y={300} steps={STEPS0 + 101} coffee={4} work={0} age={20} busy />
    <MorningLight />
    <VVignette id="b15v" strength={0.25} />
  </VFrame>
);

// Shot 16 — MS (28.58–30.58): Priya walks off behind Dev; his eyes slide after her; typing winds down.
export const B16: React.FC<ShotProps> = ({ frame }) => {
  const go = ease((frame - 4) / 22);
  const slide = ease((frame - 8) / 10);
  return (
    <VFrame>
      <VCamera cx={520} cy={900} zoom={1.3}>
        <DevDeskBack frame={frame} />
        <g transform={`translate(${lerp(720, -420, go)} ${Math.abs(Math.sin(frame * 0.45)) * -8 * (go > 0 && go < 1 ? 1 : 0)})`}>
          <Priya x={0} y={700} s={1} frame={frame} expr="smile" lookX={-10} />
          <Mug x={-120} y={905} s={1} frame={frame} />
        </g>
        <DevDeskPartition />
        <DevSeated x={DEV.x} y={DEV.y} s={DEV.s} frame={frame} pose="upright" typeSpeed={lerp(2.0, 0, clamp(frame / 30))} sweat={frame < 24 ? 2 : 0}
          lookX={lerp(18, -15, slide)} lookY={2} turn={lerp(30, 20, slide)} />
      </VCamera>
      <BusyHUD x={260} y={300} steps={STEPS0 + 101} coffee={4} work={0} age={20} busy />
      <MorningLight />
      <VVignette id="b16v" strength={0.25} />
    </VFrame>
  );
};

// Shot 17 — MS (30.58–32.29): Dev slumps back, grabs his coffee and slurps; the tag drops back to WORK DONE: 0.
export const B17: React.FC<ShotProps> = ({ frame, duration }) => {
  const sip = bump((frame - 14) / 24);
  return (
    <VFrame>
      <VCamera cx={500} cy={940} zoom={lerp(1.25, 1.32, ease(frame / duration))}>
        <DevDeskBack frame={frame} />
        <DevDeskPartition />
        <DevSeated x={DEV.x + 90} y={DEV.y} s={DEV.s} frame={frame} pose="slump" sip={sip} serious={false} lookX={4} lookY={lerp(0, -8, sip)} />
      </VCamera>
      <BusyHUD x={260} y={300} steps={STEPS0 + 101} coffee={5} work={0} age={frame - 2} />
      <MorningLight />
      <VVignette id="b17v" strength={0.25} />
    </VFrame>
  );
};

// Shot 18 — CU phone (32.29–34.0): endless scroll of cat videos.
export const B18: React.FC<ShotProps> = ({ frame }) => {
  const scroll = frame * 22 + Math.floor(frame / 10) * 120;
  return (
    <VFrame>
      <g opacity={0.5}>
        <VCamera cx={500} cy={900} zoom={1.8}>
          <DevDeskBack frame={frame} />
          <DevDeskPartition />
          <DevSeated x={DEV.x + 90} y={DEV.y} s={DEV.s} frame={frame} pose="phone" serious={false} lookX={14} lookY={8} />
        </VCamera>
      </g>
      <rect width={1080} height={1920} fill="#1C1F28" opacity={0.45} />
      <PhoneBody x={540} y={930} s={1.05} r={-4} id="b18ph"><CatFeed frame={frame} scroll={scroll % 2600} /></PhoneBody>
      <g transform={`translate(${700 + Math.sin(frame * 0.9) * 10} ${1260 - (frame % 10) * 18})`}>
        <ellipse rx={46} ry={64} fill="#F2D0B0" stroke={INK} strokeWidth={SW} />
      </g>
      <VVignette id="b18v" strength={0.4} />
    </VFrame>
  );
};

// Shot 19 — MCU (34.0–35.96): Theo, deadpan to camera: "Dev, you're not working hard…"
export const B19: React.FC<ShotProps> = ({ frame, duration }) => {
  const talk = mouthAt("T13", frame, F(34.2, 34.0));
  return (
    <VFrame>
      <VCamera cx={990} cy={455} zoom={lerp(2.7, 2.95, ease(frame / duration))}>
        <TheoDesk frame={frame} />
        <TheoSeated expr="blank" frame={frame} talk={talk} headRot={-4} lookX={-4} lookY={0} />
      </VCamera>
      <MorningLight />
      <VVignette id="b19v" strength={0.3} />
    </VFrame>
  );
};

// Shot 20 — selfie POV (35.96–37.58): Dev's serious selfie with his coffee; shutter flash on "image".
export const B20: React.FC<ShotProps> = ({ frame }) => {
  const flashAt = 25;
  const flash = frame >= flashAt ? Math.exp(-(frame - flashAt) / 2.5) : 0;
  return (
    <VFrame>
      <g transform={`translate(540 960) scale(${lerp(1.0, 1.04, frame / 39)}) translate(-540 -960)`}>
        <SelfieView frame={frame} flash={flash} />
      </g>
    </VFrame>
  );
};

// End screen (37.58–41.0): flash, then the Employee of the Month frame on the wall; the card is an HTML overlay in Root.
export const BEND: React.FC<ShotProps> = ({ frame, duration }) => {
  const flash = Math.exp(-frame / 3);
  return (
    <VFrame>
      <rect width={1080} height={1920} fill="#2A3350" />
      <g transform={`translate(540 860) scale(${lerp(1.0, 1.06, ease(frame / duration))}) translate(-540 -860)`}>
        <defs><radialGradient id="bendg" cx={540} cy={820} r={700} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFE9A8" stopOpacity={0.55} /><stop offset="1" stopColor="#FFE9A8" stopOpacity={0} /></radialGradient></defs>
        <rect width={1080} height={1920} fill="url(#bendg)" />
        <EmployeeFrame cx={540} cy={800} s={0.95} frame={frame} />
        {Array.from({ length: 7 }).map((_, i) => {
          const ph = (frame * 0.05 + rnd(i * 4.1)) % 1;
          return <Sparkle key={i} x={200 + rnd(i * 6.3) * 680} y={360 + rnd(i * 2.9) * 900} r={16 + rnd(i) * 18} o={bump(ph)} />;
        })}
      </g>
      <rect width={1080} height={1920} fill="#FFFFFF" opacity={flash} />
      <VVignette id="bendv" strength={0.45} />
    </VFrame>
  );
};

export const REST: ShotDef[] = [
  { id: "B04", Component: B04, duration: 53 }, // 6.00–8.21
  { id: "B05", Component: B05, duration: 53 }, // 8.21–10.42
  { id: "B06", Component: B06, duration: 43 }, // 10.42–12.21
  { id: "B07", Component: B07, duration: 48 }, // 12.21–14.21
  { id: "B08", Component: B08, duration: 53 }, // 14.21–16.42
  { id: "B09", Component: B09, duration: 48 }, // 16.42–18.42
  { id: "B10", Component: B10, duration: 38 }, // 18.42–20.00
  { id: "B11", Component: B11, duration: 41 }, // 20.00–21.71
  { id: "B12", Component: B12, duration: 41 }, // 21.71–23.42
  { id: "B13", Component: B13, duration: 38 }, // 23.42–25.00
  { id: "B14", Component: B14, duration: 43 }, // 25.00–26.79
  { id: "B15", Component: B15, duration: 43 }, // 26.79–28.58
  { id: "B16", Component: B16, duration: 48 }, // 28.58–30.58
  { id: "B17", Component: B17, duration: 41 }, // 30.58–32.29
  { id: "B18", Component: B18, duration: 41 }, // 32.29–34.00
  { id: "B19", Component: B19, duration: 47 }, // 34.00–35.96
  { id: "B20", Component: B20, duration: 39 }, // 35.96–37.58
  { id: "BEND", Component: BEND, duration: 82 }, // 37.58–41.00
];
