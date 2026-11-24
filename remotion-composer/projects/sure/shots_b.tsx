import React from "react";
import { ChairBack, TheoLegs, Expr } from "../later/art";
import { Phone } from "../later/rig";
import {
  VFrame, VCamera, VVignette, OfficeBack, Partition, PARTITION_TOP, OfficeDesk, TheoSeated, Priya, lerp, ease, easeOut, clamp01,
} from "../we-need-to-talk/vart";
import { TheoPuppetV } from "../we-need-to-talk/vrig";
import { Dev, Sure, SureSwarm, TheoNotes, BodyNotes, S } from "./sart";
import { PhoneBody, CallScreen, CalendarScreen, NightWindow, SureRow, NightOffice, DeskLamp, FallingNote } from "./sets";
import { ShotDef, ShotProps, mouthAt, F } from "./shots_a";

// SURE. — shots 4–18 (+ black). Pure functions of (frame, duration). Timings from the approved script.

const Warm: React.FC<{ k?: number }> = ({ k = 1 }) => <rect width={1080} height={1920} fill="#FFD98A" opacity={0.12 * k} />;
const OfficeDay: React.FC<{ frame: number; clockM?: number; clockH?: number }> = ({ frame, clockH = 9, clockM = 30 }) => (
  <g><OfficeBack frame={frame} clockH={clockH} clockM={clockM} sky="day" /><Partition /></g>
);
// Seated Theo at his desk with N notes; sticky note n slaps at slapFrame.
const DeskTheo: React.FC<{ frame: number; n: number; slapFrame?: number; expr: Expr; talk?: number; lookX?: number; lookY?: number; headRot?: number; body?: number; typeSpeed?: number; insideOut?: boolean }> =
  ({ frame, n, slapFrame, expr, talk, lookX, lookY, headRot, body = 0, typeSpeed = 0 }) => (
    <g>
      <ChairBack /><TheoLegs /><OfficeDesk frame={frame} bag={false} />
      <TheoSeated expr={expr} frame={frame} talk={talk} lookX={lookX} lookY={lookY} headRot={headRot} typeSpeed={typeSpeed}
        headOverlay={<TheoNotes n={n} frame={frame} slapFrame={slapFrame} />} />
      {body > 0 && <BodyNotes n={body} frame={frame} />}
    </g>
  );
// Sure pops in at frame `at` with a bounce.
const PopSure: React.FC<{ x: number; y: number; s: number; frame: number; at: number; phase?: number; frozen?: boolean; mouth?: number }> = ({ x, y, s, frame, at, phase = 0, frozen, mouth }) => {
  if (frame < at) return null;
  const k = easeOut((frame - at) / 5);
  const sq = frame - at < 5 ? lerp(0.5, 1.25, k) : 1 - 0.2 * Math.exp(-(frame - at - 5) / 3) * Math.cos((frame - at - 5) * 1.1);
  return <Sure x={x} y={y + (1 - k) * 30} s={s * Math.min(1, 0.4 + k)} frame={frame} squash={sq} phase={phase} frozen={frozen} mouth={mouth} />;
};

// ---------------------------------------------------------------- 4: Priya asks (7.50–10.25)
export const A04: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 7.5;
  const talk = mouthAt("P01", frame, F(7.65, st));
  const sureAt = F(9.2, st), slap = F(9.74, st);
  return (
    <VFrame>
      <VCamera cx={lerp(1010, 1016, t)} cy={lerp(326, 332, t)} zoom={lerp(1.8, 1.9, t)}>
        <OfficeDay frame={frame} />
        <Priya x={1085} y={168} frame={frame} expr={frame > sureAt + 4 ? "smile" : "neutral"} talk={talk} lookX={-8} lookY={8} headTilt={-8} part="body" />
        <Partition />
        <Priya x={1085} y={168} frame={frame} expr="neutral" arms="ledge" ledgeY={PARTITION_TOP - 168 + 4} part="arms" mug={false} />
        <DeskTheo frame={frame} n={frame >= slap ? 2 : 1} slapFrame={slap} expr={frame >= sureAt - 2 ? "grin" : "smile"} headRot={-8} lookX={10} lookY={-10} />
        <Sure x={880} y={486} s={0.3} frame={frame} />
        <PopSure x={812} y={500} s={0.3} frame={frame} at={slap + 3} phase={1.4} />
      </VCamera>
      <Warm k={0.6} />
      <VVignette id="a4v" strength={0.25} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 5: Dev with a moving box; Sures pop out of the box (10.25–13.25)
export const A05: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 10.25;
  const talk = mouthAt("D02", frame, F(10.4, st));
  const pops = F(12.92, st);
  return (
    <VFrame>
      <VCamera cx={lerp(700, 706, t)} cy={lerp(430, 420, t)} zoom={lerp(2.05, 2.2, t)}>
        <OfficeDay frame={frame} />
        <Dev x={700} y={300} s={1.0} frame={frame} talk={talk} lookX={-4} lookY={6} headTilt={-4} prop="box" />
        {[600, 670, 750, 820].map((x, i) => <PopSure key={i} x={x} y={466} s={0.3} frame={frame} at={pops + i * 2} phase={i} />)}
      </VCamera>
      <Warm k={0.6} />
      <VVignette id="a5v" strength={0.25} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 6a: MOM calling (13.25–14.50)
export const A06a: React.FC<ShotProps> = ({ frame }) => {
  const buzz = Math.sin(frame * 3.2) * (frame % 12 < 8 ? 6 : 0);
  return (
    <VFrame bg="#E9DCC4">
      <rect width={1080} height={1920} fill="#E9DCC4" />
      <PhoneBody id="callclip" x={540 + buzz} y={900} s={1.25} r={buzz * 0.3}><CallScreen frame={frame} /></PhoneBody>
      <VVignette id="a6av" strength={0.3} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 6b: Theo on the phone with Mom (14.50–16.75)
export const A06b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 14.5;
  const sureAt = F(16.33, st);
  const pose = { armF: [110, 60] as [number, number], armB: [-6, 10] as [number, number], headTilt: 6, handF: "fist" as const };
  return (
    <VFrame>
      <VCamera cx={lerp(640, 646, t)} cy={lerp(500, 490, t)} zoom={lerp(2.45, 2.6, t)}>
        <OfficeDay frame={frame} />
        <TheoPuppetV x={620} y={720} s={1.0} pose={pose} expr={frame >= sureAt - 2 ? "grin" : "smile"} frame={frame} lookX={8} lookY={2} lanyard
          headOverlay={<TheoNotes n={3} frame={frame} />} frontProp={<Phone x={-6} y={-30} r={-20} s={1.2} glow={false} />} propUnderHand={false} />
        {[[470, 600], [520, 540], [780, 560], [820, 500]].map(([x, y], i) => <Sure key={i} x={x} y={y} s={0.22} frame={frame} phase={i * 1.7} />)}
      </VCamera>
      <Warm k={0.6} />
      <VVignette id="a6bv" strength={0.25} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 7: calendar overflows (16.75–18.50)
export const A07: React.FC<ShotProps> = ({ frame }) => (
  <VFrame bg="#2A2E46">
    <rect width={1080} height={1920} fill="#2A2E46" />
    <PhoneBody id="calclip" x={540} y={960} s={1.45} r={-3}><CalendarScreen frame={frame} /></PhoneBody>
    {[[150, 1600], [930, 1560], [880, 380], [180, 420]].map(([x, y], i) => <PopSure key={i} x={x} y={y} s={0.42} frame={frame} at={i * 4} phase={i} />)}
    <VVignette id="a7v" strength={0.35} />
  </VFrame>
);

// ---------------------------------------------------------------- 8: the swarm dances around grinning, note-covered Theo (18.50–20.50)
export const A08: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <VFrame>
      <VCamera cx={lerp(1060, 1050, t)} cy={lerp(400, 390, t)} zoom={lerp(1.45, 1.55, t)} shakeY={Math.abs(Math.sin(frame * 0.6)) * -4}>
        <OfficeDay frame={frame} clockH={17} clockM={45} />
        <SureRow n={7} x0={1100} x1={1720} y={PARTITION_TOP - 10} s={0.3} frame={frame} />
        <DeskTheo frame={frame} n={5} expr="grin" lookX={0} lookY={-4} body={8} />
        <SureSwarm n={14} x={1080} y={470} w={560} h={80} s={0.3} frame={frame} seed={3} />
        <SureSwarm n={6} x={760} y={760} w={420} h={60} s={0.34} frame={frame} seed={8} />
      </VCamera>
      <rect width={1080} height={1920} fill={S.lime} opacity={0.08} />
      <VVignette id="a8v" strength={0.25} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 9: 11:48 PM, buried, typing (20.50–22.50)
export const A09: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <VFrame bg="#05061A">
      <VCamera cx={lerp(1120, 1080, t)} cy={lerp(380, 400, t)} zoom={lerp(1.25, 1.4, t)}>
        <OfficeBack frame={frame} clockH={11} clockM={48} sky="dusk" />
        <Partition />
        <DeskLamp />
        <DeskTheo frame={frame} n={8} expr="exhausted" lookX={8} lookY={6} body={18} typeSpeed={1.1} />
        <NightOffice id="a9n" lampX={1300} lampY={480} />
      </VCamera>
      <VVignette id="a9v" strength={0.6} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 10: "I said yes to... everything." (22.50–24.75)
export const A10: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 22.5;
  const talk = mouthAt("T05", frame, F(22.7, st));
  return (
    <VFrame bg="#05061A">
      <VCamera cx={lerp(1000, 996, t)} cy={lerp(440, 436, t)} zoom={lerp(3.2, 3.4, t)}>
        <OfficeBack frame={frame} clockH={11} clockM={50} sky="dusk" />
        <Partition /><DeskLamp />
        <DeskTheo frame={frame} n={7} expr="exhausted" talk={talk} lookX={4} lookY={6} body={18} />
        <FallingNote x={1000} y={420} t={(frame - 34) / 24} color={S.noteColors[3]} />
        <NightOffice id="a10n" lampX={1300} lampY={480} strength={0.6} />
      </VCamera>
      <VVignette id="a10v" strength={0.55} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 11: the swarm on the partition, whispering (24.75–26.50)
export const A11: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <VFrame bg="#05061A">
      <VCamera cx={lerp(1400, 1420, t)} cy={lerp(290, 280, t)} zoom={lerp(2.6, 2.8, t)} rot={-4}>
        <OfficeBack frame={frame} clockH={11} clockM={52} sky="dusk" />
        <Partition />
        <SureRow n={7} x0={1220} x1={1600} y={PARTITION_TOP - 10} s={0.36} frame={frame} whisper />
        <NightOffice id="a11n" lampX={1400} lampY={420} strength={0.7} />
      </VCamera>
      <rect width={1080} height={1920} fill={S.lime} opacity={0.05} />
      <VVignette id="a11v" strength={0.6} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 12a/12b: practicing "No." in the dark window (26.50–30.25)
const Reflection: React.FC<{ frame: number; talk: number; fist: number; expr: Expr; s: number; x: number; y: number }> = ({ frame, talk, fist, expr, s, x, y }) => (
  <g opacity={0.82}>
    <TheoPuppetV x={x} y={y} s={s} frame={frame} expr={expr} talk={talk} lookX={10} lookY={0}
      pose={{ armF: [lerp(20, 120, fist), lerp(80, 40, fist)], armB: [-8, 10], handF: "fist", headTilt: lerp(4, -6, fist) }}
      headOverlay={<TheoNotes n={8} frame={frame} />} />
    <rect x={-300} y={-300} width={1700} height={2600} fill="#6C8CFF" opacity={0.12} />
  </g>
);
export const A12a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 26.5;
  const talk = mouthAt("T06", frame, F(26.7, st));
  return (
    <VFrame bg="#0B1030">
      <VCamera cx={540} cy={lerp(980, 960, t)} zoom={lerp(1.0, 1.06, t)} shakeX={Math.sin(frame * 0.3) * 3}>
        <NightWindow frame={frame} />
        <Reflection frame={frame} talk={talk} fist={ease((frame - 20) / 10) * 0.4} expr="determined" s={1.75} x={520} y={1420} />
      </VCamera>
      <VVignette id="a12av" strength={0.55} />
    </VFrame>
  );
};
export const A12b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 28.25;
  const talk = mouthAt("T06", frame, F(26.7, st));
  const big = F(29.44, st);
  return (
    <VFrame bg="#0B1030">
      <VCamera cx={560} cy={lerp(760, 740, t)} zoom={frame >= big ? 1.75 : lerp(1.5, 1.6, t)} shakeX={Math.sin(frame * 0.3) * 3}>
        <NightWindow frame={frame} />
        <Reflection frame={frame} talk={talk} fist={frame >= big ? 1 : 0.4} expr="determined" s={1.75} x={520} y={1420} />
      </VCamera>
      <VVignette id="a12bv" strength={0.55} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 13: morning; Priya walks up (30.25–32.25)
export const A13: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 30.25;
  const talk = mouthAt("P02", frame, F(30.35, st));
  const px = lerp(1260, 1085, easeOut(frame / 14));
  return (
    <VFrame>
      <VCamera cx={lerp(1010, 1016, t)} cy={lerp(326, 332, t)} zoom={lerp(1.8, 1.9, t)}>
        <OfficeDay frame={frame} clockH={9} clockM={2} />
        <Priya x={px} y={168} frame={frame} expr={talk > 0.05 ? "neutral" : "smile"} talk={talk} lookX={-8} lookY={8} headTilt={-6} part="body" />
        <Partition />
        <Priya x={px} y={168} frame={frame} expr="smile" arms="ledge" ledgeY={PARTITION_TOP - 168 + 4} part="arms" />
        <DeskTheo frame={frame} n={8} expr="exhausted" headRot={-8} lookX={10} lookY={-10} body={18} />
        <SureRow n={3} x0={1260} x1={1420} y={590} s={0.3} frame={frame} />
      </VCamera>
      <Warm k={1.3} />
      <VVignette id="a13v" strength={0.25} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 14: "Want to take Friday off?" (32.25–33.75)
export const A14: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 32.25;
  const talk = mouthAt("P03", frame, F(32.35, st));
  return (
    <VFrame>
      <VCamera cx={lerp(1070, 1066, t)} cy={lerp(230, 224, t)} zoom={lerp(3.0, 3.2, t)}>
        <OfficeDay frame={frame} clockH={9} clockM={3} />
        <Priya x={1085} y={168} frame={frame} expr={talk > 0.05 ? "neutral" : "smile"} talk={talk} lookX={-8} lookY={8} headTilt={-6} part="body" />
        <Partition />
        <Priya x={1085} y={168} frame={frame} expr="smile" arms="ledge" ledgeY={PARTITION_TOP - 168 + 4} part="arms" />
      </VCamera>
      <Warm k={1.3} />
      <VVignette id="a14v" strength={0.3} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 15: "NO!" — record scratch, every Sure freezes (33.75–35.25)
export const A15: React.FC<ShotProps> = ({ frame, duration }) => {
  const st = 33.75;
  const no = F(33.85, st), scratch = F(34.2, st);
  const talk = mouthAt("T07", frame, no);
  const frozen = frame >= scratch;
  const zoom = frame >= no ? 3.4 : 2.9;
  return (
    <VFrame>
      <VCamera cx={1000} cy={430} zoom={zoom + (frozen ? 0 : frame * 0.004)}>
        <OfficeDay frame={frame} clockH={9} clockM={3} />
        <DeskTheo frame={frozen ? scratch : frame} n={8} expr="determined" talk={frame < scratch ? talk : 0} lookX={6} lookY={-4} headRot={-6} body={18} />
        <Sure x={1150} y={330} s={0.34} frame={frame} frozen={frozen} phase={0.3} />
        <Sure x={850} y={300} s={0.3} frame={frame} frozen={frozen} phase={2.1} />
      </VCamera>
      <Warm k={1.3} />
      {frozen && <rect width={1080} height={1920} fill="#FFFFFF" opacity={Math.max(0, 0.35 - (frame - scratch) * 0.12)} />}
      <VVignette id="a15v" strength={0.3} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 16: "...Okay!" — Priya walks off; a note flutters down (35.25–36.75)
export const A16: React.FC<ShotProps> = ({ frame }) => {
  const st = 35.25;
  const talk = mouthAt("P04", frame, F(35.4, st));
  const walk = easeOut((frame - 14) / 18);
  const px = lerp(1085, 1500, walk);
  return (
    <VFrame>
      <VCamera cx={1016} cy={332} zoom={1.9}>
        <OfficeDay frame={frame} clockH={9} clockM={3} />
        <Priya x={px} y={168} frame={frame} expr={talk > 0.05 ? "neutral" : "smile"} talk={talk} lookX={-8} lookY={8} headTilt={lerp(-6, 6, walk)} part="body" />
        <Partition />
        {walk < 0.3 && <Priya x={px} y={168} frame={frame} expr="smile" arms="ledge" ledgeY={PARTITION_TOP - 168 + 4} part="arms" />}
        <DeskTheo frame={0} n={8} expr="determined" lookX={10} lookY={-10} headRot={-8} body={18} />
        <SureRow n={3} x0={1260} x1={1420} y={590} s={0.3} frame={0} frozen />
        <FallingNote x={1180} y={180} t={(frame - 10) / 24} color={S.noteColors[1]} />
      </VCamera>
      <Warm k={1.3} />
      <VVignette id="a16v" strength={0.25} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 17a: "Wait, what?" (36.75–38.00)
export const A17a: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 36.75;
  const talk = mouthAt("T08", frame, F(36.9, st));
  return (
    <VFrame>
      <VCamera cx={1000} cy={430} zoom={lerp(3.6, 3.8, t)}>
        <OfficeDay frame={frame} clockH={9} clockM={4} />
        <DeskTheo frame={frame} n={8} expr={talk > 0.05 ? "anxious" : "shock"} talk={talk} lookX={10} lookY={-4} headRot={-4} body={18} />
      </VCamera>
      <Warm k={1.1} />
      <VVignette id="a17av" strength={0.3} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 17b: Narrator, slow push (38.00–40.25)
export const A17b: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <VFrame>
      <VCamera cx={1000} cy={lerp(440, 430, t)} zoom={lerp(4.2, 4.7, t)}>
        <OfficeDay frame={frame} clockH={9} clockM={4} />
        <DeskTheo frame={frame} n={8} expr="blank" lookX={2} lookY={0} headRot={0} body={18} />
      </VCamera>
      <Warm k={1.1} />
      <VVignette id="a17bv" strength={0.35} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- 18: tiny Sure: "Want to help me with something?" "Su—" (40.25–42.125)
export const A18: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration), st = 40.25;
  const talk = mouthAt("S04", frame, F(40.55, st));
  const su = F(41.95, st);
  const turn = ease((frame - 30) / 8);
  return (
    <VFrame>
      <VCamera cx={lerp(950, 944, t)} cy={lerp(470, 462, t)} zoom={lerp(2.9, 3.1, t)}>
        <OfficeDay frame={frame} clockH={9} clockM={5} />
        <DeskTheo frame={frame} n={8} expr={frame >= su - 1 ? "grin" : "blank"} lookX={lerp(2, -12, turn)} lookY={lerp(0, 8, turn)} headRot={lerp(0, 6, turn)} body={18} />
        <Sure x={846} y={472} s={0.24} frame={frame} mouth={talk} />
      </VCamera>
      <Warm k={1.1} />
      <VVignette id="a18v" strength={0.3} />
    </VFrame>
  );
};

export const BlackS: React.FC<ShotProps> = () => <VFrame bg="#000"><rect width={1080} height={1920} fill="#000" /></VFrame>;

export const REST: ShotDef[] = [
  { id: "A04", Component: A04, duration: 66 },
  { id: "A05", Component: A05, duration: 72 },
  { id: "A06a", Component: A06a, duration: 30 },
  { id: "A06b", Component: A06b, duration: 54 },
  { id: "A07", Component: A07, duration: 42 },
  { id: "A08", Component: A08, duration: 48 },
  { id: "A09", Component: A09, duration: 48 },
  { id: "A10", Component: A10, duration: 54 },
  { id: "A11", Component: A11, duration: 42 },
  { id: "A12a", Component: A12a, duration: 42 },
  { id: "A12b", Component: A12b, duration: 48 },
  { id: "A13", Component: A13, duration: 48 },
  { id: "A14", Component: A14, duration: 36 },
  { id: "A15", Component: A15, duration: 36 },
  { id: "A16", Component: A16, duration: 36 },
  { id: "A17a", Component: A17a, duration: 30 },
  { id: "A17b", Component: A17b, duration: 54 },
  { id: "A18", Component: A18, duration: 45 },
  { id: "BLACK", Component: BlackS, duration: 6 },
];
