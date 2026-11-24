import React from "react";
import { Room, Mochi, LightPool, Expr } from "../later/art";
import { POSES, mixPose, TheoBackHead, TheoPose } from "../later/rig";
import {
  VFrame, VCamera, VVignette, OfficeBack, Partition, OfficeDesk, TheoSeated, Priya, WhatIf, WhatIfStorm, WhatIfPop,
  MessyHair, GreyBeard, MochiHardHat, Brick, P, lerp, ease, easeOut, clamp01, rnd,
} from "./vart";
import { TheoPuppetV, DeskBox, CoffeeStack, NoodleCup, Finger, Tear } from "./vrig";
import {
  DreamTint, Rain, RainStreet, Applicant, JobFair, ConstructionSite, BridgeSet, BedTopDown, BlanketTD, MoonShaft, FlipClock,
  CeilingSet, BathroomBack, MirrorGlass, MirrorRoom, MIRROR, PriyaOffice, PriyaDesk, GlassWall, SunBurst, Confetti,
} from "./sets2";
import { ShotDef, ShotProps, mouthAt } from "./shots_hook";

// Shots 5–18 (+ black). Pure functions of (frame, duration). Timings from the approved script.

const Frame0: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => <VFrame bg={bg}>{children}</VFrame>;
const F = (sec: number, shotStart: number) => Math.round((sec - shotStart) * 24); // film seconds -> shot-local frame

// ---------------------------------------------------------------- 5: rain dream (8.50–10.25)
export const S05: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("W02", frame, F(8.75, 8.5));
  const pose: TheoPose = { ...POSES.hold_sheet, armF: [62, 64], armB: [52, 70], headTilt: 10 };
  return (
    <Frame0>
      <VCamera cx={560} cy={lerp(1010, 990, t)} zoom={lerp(1.22, 1.32, t)}>
        <RainStreet frame={frame} />
        <TheoPuppetV x={470} y={1330} s={1.3} pose={pose} expr="sad" frame={frame} lookX={-2} lookY={8} frontProp={<DeskBox frame={frame} />} propUnderHand />
        <WhatIf x={800} y={790 + Math.sin(frame * 0.2) * 12} s={1.0} frame={frame} mood="smug" mouth={talk} spin={1.2} />
        <Rain frame={frame} />
      </VCamera>
      <DreamTint />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 6: job fair pan (10.25–12.75)
export const S06: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("W03", frame, F(10.4, 10.25));
  return (
    <Frame0>
      <VCamera cx={lerp(380, 1400, t)} cy={900} zoom={1.0}>
        <JobFair frame={frame} />
        {[60, 360, 660, 960, 1220].map((x, i) => <Applicant key={i} x={x} y={1110} s={1.22} frame={frame} v={i} />)}
        <TheoPuppetV x={1480} y={1097} s={1.3} pose={{ ...POSES.stand_small, headTilt: 8 }} expr="sad" frame={frame} lookX={-6} lookY={6}
          headOverlay={<GreyBeard />} />
        <WhatIf x={1470} y={470 + Math.sin(frame * 0.2) * 10} s={1.3} frame={frame} mood="smug" mouth={talk} spin={1.2} />
      </VCamera>
      <DreamTint />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 7: Mochi gets a job (12.75–14.75)
export const S07: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("W04", frame, F(12.9, 12.75));
  const mx = lerp(1010, 520, frame / duration);
  const bob = -Math.abs(Math.sin(frame * 0.45)) * 16;
  const tilt = Math.sin(frame * 0.45) * 4;
  return (
    <Frame0>
      <VCamera cx={540} cy={960} zoom={lerp(1.0, 1.06, t)}>
        <ConstructionSite frame={frame} />
        <g transform={`translate(${mx} ${1330 + bob}) rotate(${tilt}) translate(${-mx} ${-(1330 + bob)})`}>
          <Mochi x={mx} y={1330 + bob} s={2.6} frame={frame} pose="sit" mood="judge" look={4} />
          <g transform={`translate(${mx} ${1330 + bob}) scale(2.6)`}><MochiHardHat /><Brick x={-14} y={-12} r={-4} s={0.9} /></g>
        </g>
        <WhatIf x={280} y={600 + Math.sin(frame * 0.2) * 10} s={1.5} frame={frame} mood="smug" mouth={talk} spin={1.3} />
      </VCamera>
      <DreamTint />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 8: under the bridge (14.75–17.25)
export const S08: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("T02", frame, F(14.85, 14.75));
  const trainX = lerp(-2300, 1200, frame / duration);
  const rumble = trainX > -1700 && trainX < 1000 ? 4 : 0;
  const pose: TheoPose = { ...POSES.sit_low, armF: [40, 100], handF: "fist" };
  return (
    <Frame0>
      <VCamera cx={600} cy={lerp(1060, 1040, t)} zoom={lerp(1.14, 1.22, t)} shakeX={Math.sin(frame * 3.1) * rumble} shakeY={Math.cos(frame * 2.3) * rumble}>
        <BridgeSet frame={frame} trainX={trainX} />
        <TheoPuppetV x={560} y={1560} s={1.6} pose={pose} expr="blank" frame={frame} talk={talk} lookX={4} lookY={2}
          frontProp={<NoodleCup frame={frame} slurp={talk < 0.05 ? 0.6 : 0} />} />
        <WhatIf x={880} y={1330 + Math.sin(frame * 0.18) * 6} s={1.75} frame={frame} mood="curious" spin={1} />
        <g transform="translate(930 1600) scale(0.8)"><NoodleCup frame={frame + 9} /></g>
      </VCamera>
      <DreamTint strength={1.1} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 9: night, from above (17.25–19.25)
export const S09: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame0 bg="#05061A">
      <VCamera cx={540} cy={960} zoom={lerp(1.05, 1.14, t)} rot={lerp(-2, 5, t)}>
        <BedTopDown frame={frame} />
        <TheoPuppetV x={540} y={830} s={1.35} pose={{ armF: [12, 6], armB: [-12, 6], legF: [4, 0], legB: [-4, 0] }} expr="overwhelmed" frame={frame} lookX={0} lookY={-6} />
        <BlanketTD />
        <Mochi x={580} y={760} s={1.0} frame={frame} pose="sleep" />
        {[0, 1, 2].map((i) => {
          const a = frame * 0.08 + (i * Math.PI * 2) / 3;
          return <WhatIf key={i} x={540 + Math.cos(a) * 260} y={470 + Math.sin(a) * 150} s={0.32} frame={frame + i * 5} mood="spooky" seed={i} lineBoost={1.3} />;
        })}
        <MoonShaft shift={lerp(0, 70, t)} />
      </VCamera>
      <VVignette id="s9v" strength={0.7} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 10: clock flips (19.25–20.75), three hard cuts
export const S10: React.FC<ShotProps> = ({ frame }) => {
  const k = Math.min(2, Math.floor(frame / 12));
  const lf = frame - k * 12;
  const times = ["12:47", "2:13", "3:58"];
  return (
    <Frame0>
      <VCamera cx={540 + [0, 20, -16][k]} cy={960 + [0, -10, 12][k]} zoom={[1.0, 1.12, 1.26][k] + lf * 0.004} rot={[0, -2, 2][k]}>
        <FlipClock text={times[k]} flip={clamp01(lf / 4)} frame={frame} />
        <rect x={-300} y={-300} width={1700} height={2600} fill="#6B3FD9" opacity={0.08 + k * 0.05} />
      </VCamera>
      <VVignette id="s10v" strength={0.75} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 11: What-If fills the ceiling (20.75–22.75)
export const S11: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const flick = rnd(Math.floor(frame / 2) * 7.3) > 0.35 ? 1 : 0;
  return (
    <Frame0 bg="#05061A">
      <VCamera cx={540} cy={lerp(940, 900, t)} zoom={lerp(1.0, 1.1, t)} shakeX={Math.sin(frame * 4.1) * 5} shakeY={Math.cos(frame * 3.3) * 4}>
        <CeilingSet frame={frame} flicker={flick} />
        <WhatIfStorm x={540} y={lerp(760, 820, t)} rx={lerp(400, 560, t)} ry={lerp(330, 460, t)} frame={frame} eyes={34} flicker={flick} />
        <rect x={-300} y={-300} width={1700} height={2600} fill="#070A24" opacity={flick ? 0.15 : 0.45} />
      </VCamera>
      <VVignette id="s11v" strength={0.7} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 12: 4:30 AM mirror (22.75–25.25)
export const S12: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("T03", frame, F(22.95, 22.75));
  const on = !(frame % 37 < 3 || frame % 53 < 2);
  const pose: TheoPose = { armF: [110, 40], armB: [-6, 8], headTilt: -4 };
  return (
    <Frame0>
      <defs><clipPath id="mirrorClip"><rect x={MIRROR.x} y={MIRROR.y} width={MIRROR.w} height={MIRROR.h} rx={22} /></clipPath></defs>
      <VCamera cx={540 + Math.sin(frame * 0.4) * 4} cy={lerp(940, 920, t) + Math.cos(frame * 0.33) * 3} zoom={lerp(1.0, 1.06, t)}>
        <BathroomBack frame={frame} on={on} />
        <g clipPath="url(#mirrorClip)">
          <MirrorRoom />
          <TheoPuppetV x={500} y={1290} s={1.9} pose={pose} expr="determined" frame={frame} talk={talk} lookX={8} lookY={2}
            headOverlay={<MessyHair frame={frame} />} frontProp={<Finger wag={Math.sin(frame * 0.6) * 8} />} propUnderHand={false} />
        </g>
        <MirrorGlass on={on} />
      </VCamera>
      {!on && <rect width={1080} height={1920} fill="#0A1A18" opacity={0.4} />}
      <VVignette id="s12v" strength={0.45} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 13: zombie morning (25.25–27.75)
export const S13: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const x = lerp(640, 900, frame / duration);
  const cyc = (Math.sin(frame * 0.26) + 1) / 2;
  const pose = mixPose(POSES.walk_contact_a, POSES.walk_contact_b, cyc);
  pose.armF = [40, 70]; pose.lean = 10; pose.headTilt = 12; pose.headDY = 8;
  const bob = Math.abs(Math.sin(frame * 0.26)) * -8;
  const hipY = 720 + bob;
  return (
    <Frame0>
      <defs><filter id="grey13"><feColorMatrix type="saturate" values="0.3" /></filter></defs>
      <g filter="url(#grey13)">
        <VCamera cx={x + 70} cy={lerp(560, 540, t)} zoom={lerp(1.55, 1.75, t)}>
          <OfficeBack frame={frame} clockH={9} clockM={2} sky="day" />
          <Partition />
          <WhatIf x={x - 70} y={hipY - 300} s={1.4} frame={frame} mood="smug" spin={0.8} />
          <TheoPuppetV x={x} y={hipY} s={0.9} pose={pose} expr="exhausted" frame={frame} lookX={4} lookY={6}
            insideOut lanyard headOverlay={<MessyHair frame={frame} />} frontProp={<CoffeeStack />} />
        </VCamera>
      </g>
      <rect width={1080} height={1920} fill="#E8ECF0" opacity={0.16} />
      <VVignette id="s13v" strength={0.35} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 14: Priya: "Sit down." (27.75–29.50)
export const S14: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("P02", frame, F(28.2, 27.75));
  const up = ease((frame - 4) / 8);
  return (
    <Frame0>
      <defs><filter id="grey14"><feColorMatrix type="saturate" values="0.45" /></filter></defs>
      <g filter="url(#grey14)">
        <VCamera cx={540} cy={lerp(900, 820, t)} zoom={lerp(1.0, 1.22, t)}>
          <PriyaOffice frame={frame} sun={0} />
          <Priya x={540} y={760} s={1.5} frame={frame} expr="flat" talk={talk} lookX={lerp(-4, 0, up)} lookY={lerp(12, 0, up)} headTilt={lerp(6, 0, up)} arms="desk" />
          <PriyaDesk frame={frame} />
          <GlassWall opacity={0.7} />
        </VCamera>
      </g>
      <VVignette id="s14v" strength={0.4} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 15: tired eye, one twitch (29.50–31.00)
export const S15: React.FC<ShotProps> = ({ frame }) => {
  const tw = frame === 7 || frame === 8 || frame === 10;
  return (
    <Frame0 bg="#B9C0C8">
      <rect width={1080} height={1920} fill="#B9C0C8" />
      <VCamera cx={1048} cy={426} zoom={7.6 + frame * 0.004} shakeX={tw ? 3 : 0}>
        <TheoSeated expr={tw ? "blank" : "exhausted"} frame={0} insideOut lanyard={false} lookX={2} lookY={2} glassesY={tw ? 3 : 0}
          headOverlay={<MessyHair frame={0} />} />
      </VCamera>
      <VVignette id="s15v" strength={0.55} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 16: the twist (31.00–33.75)
export const S16: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("P04", frame, F(31.05, 31.0));
  const sun = easeOut(frame / 8);
  const popAt = F(32.0, 31.0);
  const p = clamp01((frame - popAt) / 18);
  const punch = 1 + 0.05 * Math.exp(-frame / 4);
  return (
    <Frame0>
      <VCamera cx={540} cy={lerp(860, 840, t)} zoom={lerp(1.08, 1.16, t) * punch}>
        <PriyaOffice frame={frame} sun={sun} />
        <SunBurst k={sun} frame={frame} />
        <Priya x={540} y={760} s={1.5} frame={frame} expr="smile" headTilt={4 + talk * 6 + Math.sin(frame * 0.5) * 2} arms="desk" />
        <PriyaDesk frame={frame} />
        <Confetti frame={frame} start={1} n={110} x0={540} y0={620} spread={1300} />
        <TheoBackHead x={250} y={1640} s={1.35} frame={frame} />
        {p <= 0 ? <WhatIf x={420} y={1420} s={1.3} frame={frame} mood="curious" spin={2.5} /> : <WhatIfPop x={420} y={1420} s={1.3} frame={frame} p={p} />}
      </VCamera>
      <rect width={1080} height={1920} fill="#FFF3C4" opacity={0.12 * sun} />
    </Frame0>
  );
};

// Confetti stuck in Theo's hair (head-local coords).
const HairConfetti: React.FC = () => (
  <g>
    {[[930, 300, "#FFD24A", 20], [990, 290, "#4FE6D6", -30], [1050, 316, "#FF7FA8", 50], [900, 360, "#9B5CFF", 10], [1080, 360, "#7DE08A", -40]].map(([x, y, c, r], i) => (
      <rect key={i} x={-10} y={-6} width={20} height={12} rx={2} fill={c as string} transform={`translate(${x} ${y}) rotate(${r})`} />
    ))}
  </g>
);

const WarmBack: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1600} fill="#F6D9A0" />
    <circle cx={1300} cy={160} r={260} fill="#FFF3C4" opacity={0.7} />
    <rect x={1150} y={-200} width={60} height={1600} fill="#E8C48A" />
    <Confetti frame={frame + 60} start={0} n={50} x0={985} y0={-200} spread={900} fallTo={900} />
  </g>
);

// ---------------------------------------------------------------- 17a: blank stare + tear (33.75–35.75)
export const S17a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("T04", frame, F(34.0, 33.75));
  return (
    <Frame0>
      <VCamera cx={990} cy={lerp(450, 444, t)} zoom={lerp(3.3, 3.5, t)}>
        <WarmBack frame={frame} />
        <TheoSeated expr="blank" frame={frame} insideOut lanyard={false} talk={talk} lookX={0} lookY={0}
          headOverlay={<g><MessyHair frame={frame} /><HairConfetti /><Tear frame={frame} start={10} /></g>} />
      </VCamera>
      <rect width={1080} height={1920} fill="#FFC870" opacity={0.08} />
      <VVignette id="s17av" strength={0.3} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 17b: Narrator line, tighter (35.75–38.75)
export const S17b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const land = easeOut((frame - 14) / 18);
  const cx = lerp(1000, 986, land), cy = lerp(240, 412, land);
  return (
    <Frame0>
      <VCamera cx={1000} cy={lerp(440, 436, t)} zoom={lerp(4.5, 4.85, t)}>
        <WarmBack frame={frame + 48} />
        <TheoSeated expr="blank" frame={frame} insideOut lanyard={false} lookX={0} lookY={0}
          headOverlay={<g><MessyHair frame={frame} /><HairConfetti /><Tear frame={frame + 60} start={0} /></g>} />
        <rect x={-10} y={-6} width={20} height={12} rx={2} fill="#FFD24A" transform={`translate(${cx} ${cy}) rotate(${lerp(-70, 12, land)})`} />
      </VCamera>
      <rect width={1080} height={1920} fill="#FFC870" opacity={0.08} />
      <VVignette id="s17bv" strength={0.35} />
    </Frame0>
  );
};

// ---------------------------------------------------------------- 18: button gag (38.75–41.75), hard cut to black
export const S18: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("W06", frame, F(39.6, 38.75));
  const snap = frame >= F(41.4, 38.75);
  const closed = frame >= 12 && !snap;
  const peek = easeOut((frame - 16) / 10);
  const expr: Expr = snap ? "shock" : "smile";
  return (
    <Frame0 bg="#05061A">
      <VCamera cx={lerp(172, 166, t)} cy={lerp(612, 606, t)} zoom={snap ? 4.9 : lerp(4.1, 4.4, t)}>
        <Room sky="night" frame={frame} clockH={11} clockM={30} />
        <WhatIf x={100} y={lerp(650, 596, peek)} s={0.14} frame={frame} mood="tiny" mouth={talk} lineBoost={1.8} />
        <rect x={96} y={650} width={180} height={70} rx={24} fill="#F4EEE2" stroke="#141018" strokeWidth={6} />
        <TheoPuppetV x={348} y={652} s={0.6} rot={-90} pose={{ armF: [10, 10], armB: [-10, 10], legF: [2, 0], legB: [-2, 0] }} expr={expr} frame={frame}
          eyesClosed={closed} lookX={0} lookY={0} />
        <path d="M250,650 C330,625 520,628 620,660 L630,760 L250,760 Z" fill="#5E7FB8" stroke="#141018" strokeWidth={6} strokeLinejoin="round" />
        <Mochi x={330} y={660} s={0.42} frame={frame} pose="sleep" />
        <LightPool id="s18" x={360} y={300} r={520} dark="#070A24" darkness={0.8} glow="#AFC4FF" glowStrength={0.18} glowR={260} />
      </VCamera>
      <VVignette id="s18v" strength={0.55} />
    </Frame0>
  );
};

export const Black: React.FC<ShotProps> = () => <VFrame bg="#000"><rect width={1080} height={1920} fill="#000" /></VFrame>;

export const REST: ShotDef[] = [
  { id: "S05", Component: S05, duration: 42 },
  { id: "S06", Component: S06, duration: 60 },
  { id: "S07", Component: S07, duration: 48 },
  { id: "S08", Component: S08, duration: 60 },
  { id: "S09", Component: S09, duration: 48 },
  { id: "S10", Component: S10, duration: 36 },
  { id: "S11", Component: S11, duration: 48 },
  { id: "S12", Component: S12, duration: 60 },
  { id: "S13", Component: S13, duration: 60 },
  { id: "S14", Component: S14, duration: 42 },
  { id: "S15", Component: S15, duration: 36 },
  { id: "S16", Component: S16, duration: 66 },
  { id: "S17a", Component: S17a, duration: 48 },
  { id: "S17b", Component: S17b, duration: 72 },
  { id: "S18", Component: S18, duration: 72 },
  { id: "BLACK", Component: Black, duration: 6 },
];
