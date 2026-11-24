import React from "react";
import { ChairBack, TheoLegs, Expr } from "../later/art";
import {
  VFrame, VCamera, VVignette, OfficeBack, Partition, PARTITION_TOP, OfficeDesk, TheoSeated, Priya, WhatIf, P,
  lerp, ease, easeOut, clamp01,
} from "./vart";
import MOUTH from "./mouth_env.json";

// Hook (0:00–0:08.5): shots 1–4 of the bible's 18-shot list. Each shot is a pure function of (frame, duration).
export type ShotProps = { frame: number; duration: number };
export type ShotDef = { id: string; Component: React.FC<ShotProps>; duration: number };

// 24 fps mouth envelope with light smoothing; `start` = shot-local frame where the line begins.
export const mouthAt = (key: string, frame: number, start: number) => {
  const e = (MOUTH as Record<string, number[]>)[key];
  if (!e) return 0;
  const i = Math.round(frame - start);
  const at = (k: number) => (k >= 0 && k < e.length ? e[k] : 0);
  return at(i - 1) * 0.25 + at(i) * 0.5 + at(i + 1) * 0.25;
};

// Rotate a room-space point about Theo's neck pivot (TheoSeated headRot uses 905,520).
export const neckRot = (x: number, y: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180, dx = x - 905, dy = y - 520;
  return [905 + dx * Math.cos(a) - dy * Math.sin(a), 520 + dx * Math.sin(a) + dy * Math.cos(a)];
};

const OfficeLight: React.FC<{ id: string; warm?: number }> = ({ id, warm = 0 }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1920" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.10} />
        <stop offset="1" stopColor="#2A4A48" stopOpacity={0.12 + warm} />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#${id})`} />
  </g>
);

// Shot 1 — MS: office at 5:59 PM. Theo at his desk, bag half packed; Priya leans in over the partition,
// flat face, mug in hand. Priya leans in; Theo's head turns slowly up toward her. Priya: "Hey, Theo... we need to talk. Tomorrow."
export const S01: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const lineStart = 6; // 0.25 s
  const talk = mouthAt("P01", frame, lineStart);
  const lean = easeOut(frame / 16);
  const py = lerp(146, 170, lean);
  const ptilt = lerp(2, -12, lean);
  const turn = ease((frame - 12) / 34);
  const expr: Expr = frame < 52 ? "neutral" : "anxious";
  return (
    <VFrame>
      <VCamera cx={lerp(1007, 1012, t)} cy={lerp(319, 326, t)} zoom={lerp(1.8, 1.9, t)}>
        <OfficeBack frame={frame} clockH={5} clockM={59} />
        <Priya x={1085} y={py} frame={frame} expr="flat" talk={talk} lookX={-8} lookY={8} headTilt={ptilt} part="body" />
        <Partition />
        <Priya x={1085} y={py} frame={frame} expr="flat" arms="ledge" ledgeY={PARTITION_TOP - py + 4} part="arms" />
        <ChairBack /><TheoLegs />
        <OfficeDesk frame={frame} />
        <TheoSeated expr={expr} frame={frame} typeSpeed={frame < 14 ? 0.9 : 0} headRot={lerp(0, -10, turn)}
          lookX={lerp(6, 10, turn)} lookY={lerp(4, -12, turn)} />
      </VCamera>
      <OfficeLight id="s1l" />
      <VVignette id="s1v" strength={0.28} />
    </VFrame>
  );
};

// Shot 2 — ECU: Theo's eyes; pupils shrink to dots, glasses slip. Snap zoom in, then hold. (orchestra sting)
export const S02: React.FC<ShotProps> = ({ frame, duration }) => {
  const [ex, ey] = neckRot(1018, 432, -10);
  const snap = easeOut(frame / 3);
  const zoom = lerp(3.4, 7.0, snap) + lerp(0, 0.25, frame / duration);
  const shake = 16 * Math.exp(-frame / 4);
  const flash = Math.max(0, 0.7 - frame * 0.35);
  return (
    <VFrame>
      <VCamera cx={ex} cy={ey + 10} zoom={zoom} shakeX={Math.sin(frame * 2.9) * shake} shakeY={Math.cos(frame * 3.7) * shake * 0.7}>
        <OfficeBack frame={frame} clockH={5} clockM={59} />
        <Partition />
        <ChairBack /><TheoLegs /><OfficeDesk frame={frame} />
        <TheoSeated expr={frame < 3 ? "anxious" : "panic"} frame={frame} headRot={-10} lookX={3} lookY={-6}
          glassesY={lerp(0, 13, ease((frame - 5) / 9))} />
      </VCamera>
      <VVignette id="s2v" strength={0.5} />
      <rect width={1080} height={1920} fill="#FFFFFF" opacity={flash} />
    </VFrame>
  );
};

// Shot 3 — CU: marble-sized What-If pops out of Theo's hair, spiral eye spinning. Pops up with a bounce.
// What-If: "...talk about what?"
export const S03: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const [hx, hy] = neckRot(1000, 296, -10);
  // pop: rise from inside the hair with stretch, overshoot, land with squash, settle
  const rise = easeOut((frame - 1) / 7);
  const settle = frame < 8 ? 0 : Math.exp(-(frame - 8) / 4) * Math.sin((frame - 8) * 1.3);
  const wy = lerp(hy + 14, hy - 26, rise) - settle * 8;
  const squash = frame < 8 ? lerp(1.0, 1.35, rise) : 1 - 0.28 * Math.exp(-(frame - 8) / 3) * Math.cos((frame - 8) * 0.9);
  const talk = mouthAt("W01", frame, 8);
  const front = frame >= 6;
  const what = <WhatIf x={hx + 2} y={wy} s={0.2} frame={frame} squash={squash} mouth={talk} spin={1.4} lineBoost={1.5} />;
  return (
    <VFrame>
      <VCamera cx={lerp(968, 972, t)} cy={lerp(334, 326, t)} zoom={lerp(4.1, 4.4, t)}>
        <OfficeBack frame={frame} clockH={5} clockM={59} />
        <Partition />
        <ChairBack /><TheoLegs /><OfficeDesk frame={frame} />
        {!front && what}
        <TheoSeated expr="panic" frame={frame} headRot={-10} lookX={-1} lookY={-15} glassesY={13} />
        {front && what}
        {/* violet spill from What-If onto the hair */}
        <defs>
          <radialGradient id="s3glow" cx={hx} cy={wy} r={70} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={P.wViolet} stopOpacity={0.35 * clamp01(frame / 6)} />
            <stop offset="1" stopColor={P.wViolet} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect x={hx - 80} y={wy - 80} width={160} height={160} fill="url(#s3glow)" />
      </VCamera>
      <VVignette id="s3v" strength={0.45} />
    </VFrame>
  );
};

// Shot 4 — MCU: Theo gripping his desk, sweating; What-If now tennis-ball size on his head. Push in; desk shakes.
// Theo: "Okay. Okay. She's firing me."
export const S04: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("T01", frame, 1);
  const tremble = 2.4;
  const tx = Math.sin(frame * 2.3) * tremble, ty = Math.cos(frame * 2.9) * tremble * 0.6;
  const breathe = Math.sin(frame * 0.12) * 3;
  const ws = lerp(0.52, 0.58, t);
  return (
    <VFrame>
      <VCamera cx={lerp(1030, 1026, t)} cy={lerp(410, 420, t)} zoom={lerp(2.5, 2.85, t)}
        shakeX={Math.sin(frame * 3.3) * 3} shakeY={Math.cos(frame * 2.7) * 2}>
        <OfficeBack frame={frame} clockH={5} clockM={59} />
        <Partition />
        <ChairBack /><TheoLegs /><OfficeDesk frame={frame} shake={3} />
        <TheoSeated expr="panic" frame={frame} talk={talk} lookX={9} lookY={7} grip={1} tremble={tremble} sweat={4} />
        <WhatIf x={994 + tx} y={300 - 100 * ws + 14 + ty + breathe * 1.4} s={ws} frame={frame} mood="curious" spin={1.2} lineBoost={1.15} />
      </VCamera>
      <rect width={1080} height={1920} fill={P.wVioletDeep} opacity={0.06 + 0.06 * t} />
      <VVignette id="s4v" strength={0.55} />
    </VFrame>
  );
};

export const HOOK: ShotDef[] = [
  { id: "S01", Component: S01, duration: 72 }, // 0:00–0:03.0
  { id: "S02", Component: S02, duration: 24 }, // 0:03.0–0:04.0  sting
  { id: "S03", Component: S03, duration: 48 }, // 0:04.0–0:06.0  ...talk about what?
  { id: "S04", Component: S04, duration: 60 }, // 0:06.0–0:08.5  She's firing me.
];
