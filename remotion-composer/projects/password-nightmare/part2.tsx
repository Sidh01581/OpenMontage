import React from "react";
import { C, INK, SW, Mochi } from "../later/art";
import { P, Priya, TheoSeated } from "../we-need-to-talk/vart";
import { TheoDesk } from "../busy/shots_a";
import { DeskBack, PART_TOP } from "./part";
import { TheoSitting } from "./theoref";

// THE PASSWORD NIGHTMARE. — Mochi's keyboard walk + yawn, Priya over the cubicle wall, Theo at the next desk.

// ---------------------------------------------------------------- Mochi walking (side view, facing LEFT). Origin = ground under the body.
// phase advances one stride per 1.0; same palette + outline as LATER.'s Mochi.
export const MochiWalk: React.FC<{ x: number; y: number; s: number; frame: number; phase: number; look?: number }> = ({ x, y, s, frame, phase, look = -3 }) => {
  const sw = (k: number) => Math.sin((phase + k) * Math.PI * 2);
  const bob = Math.abs(Math.sin(phase * Math.PI * 2)) * -4;
  const tail = Math.sin(frame * 0.15) * 8;
  const leg = (hx: number, k: number, shade: boolean) => {
    const a = sw(k) * 16, lift = Math.max(0, sw(k + 0.25)) * 10;
    return (
      <g key={`${hx}${k}`}>
        <path d={`M${hx},-44 L${hx + a},${-6 - lift}`} stroke={INK} strokeWidth={22} strokeLinecap="round" />
        <path d={`M${hx},-44 L${hx + a},${-6 - lift}`} stroke={shade ? C.catShade : C.cat} strokeWidth={12} strokeLinecap="round" />
        <ellipse cx={hx + a - 4} cy={-4 - lift} rx={11} ry={6} fill={shade ? C.catShade : C.cat} stroke={INK} strokeWidth={4} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      {/* far legs */}
      {leg(-46, 0.5, true)}{leg(40, 0, true)}
      {/* tail up, curling */}
      <path d={`M60,-62 C96,-80 ${104 + tail},-120 ${84 + tail},-146`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <path d={`M60,-62 C96,-80 ${104 + tail},-120 ${84 + tail},-146`} fill="none" stroke={C.cat} strokeWidth={12} strokeLinecap="round" />
      <circle cx={84 + tail} cy={-146} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
      {/* body */}
      <ellipse cx={0} cy={-64} rx={78} ry={36} fill={C.cat} stroke={INK} strokeWidth={SW} />
      <path d="M-10,-92 Q8,-100 26,-92" fill="none" stroke={C.catShade} strokeWidth={7} strokeLinecap="round" />
      <path d="M22,-88 Q38,-94 52,-84" fill="none" stroke={C.catShade} strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={-30} cy={-46} rx={26} ry={12} fill="#FFFFFF" />
      {/* near legs */}
      {leg(-34, 0, false)}{leg(52, 0.5, false)}
      {/* head, looking where she walks (left) */}
      <g transform="translate(-86 -98)">
        <path d="M-26,-22 L-22,-58 L-4,-34 Z" fill={C.cat} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M14,-26 L22,-60 L30,-28 Z" fill={C.cat} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <circle r={38} fill={C.cat} stroke={INK} strokeWidth={SW} />
        <path d="M-10,-32 Q2,-38 14,-32" fill="none" stroke={C.catShade} strokeWidth={6} strokeLinecap="round" />
        <ellipse cx={-12} cy={16} rx={18} ry={11} fill="#FFFFFF" />
        {[-26, 6].map((ex, i) => (frame + 13) % 70 < 4
          ? <path key={i} d={`M${ex - 10},-2 Q${ex},6 ${ex + 10},-2`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          : <g key={i}>
              <ellipse cx={ex} cy={-2} rx={10} ry={12} fill="#FFF6D6" stroke={INK} strokeWidth={4} />
              <circle cx={ex + look} cy={-1} r={6} fill={INK} />
              <circle cx={ex + look - 2} cy={-3} r={2} fill="#FFFFFF" />
            </g>)}
        <path d="M-16,10 L-8,10 L-12,15 Z" fill="#E07F8E" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-22,22 Q-17,27 -12,22 Q-7,27 -2,22" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- Mochi sitting with a big yawn (k 0..1 = mouth open). Same origin as Mochi "sit".
export const MochiYawn: React.FC<{ x: number; y: number; s: number; frame: number; k: number; flip?: boolean }> = ({ x, y, s, frame, k, flip = false }) => (
  <g>
    <Mochi x={x} y={y} s={s} frame={frame} pose="sit" mood={k > 0.15 ? "closed" : "open"} flip={flip} headTilt={-8 * k} />
    {k > 0.05 && (
      <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${-8 * k} -10 -120)`}>
        <ellipse cx={-10} cy={-108 + 4 * k} rx={9 + 5 * k} ry={4 + 14 * k} fill="#5A1E24" stroke={INK} strokeWidth={3.5} />
        <ellipse cx={-10} cy={-100 + 9 * k} rx={6 + 2 * k} ry={3 + 3 * k} fill="#E07F8E" />
        <path d="M-17,-116 L-15,-110 M-3,-116 L-5,-110" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    )}
  </g>
);

// ---------------------------------------------------------------- Priya pops up over the cubicle wall (arms on the cap), cheerful.
// World x/up: up 0..1 rises her from behind the partition. Partition top = PART_TOP. Draw the wall between body and arms.
export const PriyaOverWall: React.FC<{ x: number; frame: number; up: number; talk?: number; s?: number; lookX?: number; lookY?: number; headTilt?: number }> = ({ x, frame, up, talk = 0, s = 1.25, lookX = -10, lookY = 4, headTilt = 0 }) => {
  const ledge = 104;
  const y = PART_TOP - ledge * s + (1 - up) * 420;
  return (
    <>
      <Priya x={x} y={y} s={s} frame={frame} expr="smile" talk={talk} lookX={lookX} lookY={lookY} headTilt={headTilt} arms="ledge" ledgeY={ledge} part="body" />
      <WallStrip />
      {up > 0.6 && <Priya x={x} y={y} s={s} frame={frame} expr="smile" talk={talk} lookX={lookX} lookY={lookY} arms="ledge" ledgeY={ledge} part="arms" />}
    </>
  );
};
// The partition again (drawn over Priya's body), without the notes.
const WallStrip: React.FC = () => (
  <g>
    <rect x={-800} y={PART_TOP} width={2700} height={530} fill={P.partition} stroke={INK} strokeWidth={SW} />
    {Array.from({ length: 16 }).map((_, i) => <line key={i} x1={-700 + i * 160} y1={PART_TOP + 24} x2={-700 + i * 160} y2={1470} stroke={P.partitionShade} strokeWidth={4} />)}
    <rect x={-810} y={PART_TOP - 14} width={2720} height={22} rx={6} fill={P.trim} stroke={INK} strokeWidth={SW} />
  </g>
);
// Priya's side of the wall: same office wall as Dev's desk.
export const PriyaWallSet: React.FC<{ frame: number }> = ({ frame }) => <DeskBack frame={frame} />;

// ---------------------------------------------------------------- Theo at the next desk (BUSY. TheoDesk world),
// head turned toward Dev (screen left), as in BUSY. shot 12.
export const TheoNextDesk: React.FC<{ frame: number; talk?: number; expr?: React.ComponentProps<typeof TheoSeated>["expr"] }> = ({ frame, talk = 0, expr = "neutral" }) => (
  <>
    <TheoDesk frame={frame} />
    <TheoSeated expr={expr} frame={frame} talk={talk} headRot={-6} lookX={-14} lookY={-2} />
  </>
);

// Theo rolls his chair over beside Dev (Dev's desk world), coffee in hand, facing Dev (screen right). Uses the approved
// Theo reference (short neck, card flat on the chest and turned with it). Draw BEFORE Dev so Dev stays in front.
export const TheoRolledOver: React.FC<{ frame: number; x?: number; talk?: number; expr?: React.ComponentProps<typeof TheoSitting>["h"] }> = ({ frame, x = -40, talk = 0, expr }) => (
  <TheoSitting x={x} y={1262} s={1.5} frame={frame} desk={false} mug h={{ expr: "neutral", talk, lookX: 10, lookY: 4, ...expr }} />
);
