import React from "react";
import { INK, SW, Limb, Pt, C as LC } from "../later/art";
import { S, DevHead } from "../sure/sart";
import { B } from "../busy/bart";
import { ik } from "../busy/bart2";
import { P, Priya, PriyaExpr } from "../we-need-to-talk/vart";
import { TheoThreeQuarter } from "../password-nightmare/theoref";
import { Robot } from "./robot";

// AUTOMATED. — new poses built on the approved sheets.
// DevStand: Dev's approved 3/4 standing body (devref.tsx DevThreeQuarter, same geometry) with posable arms + the mop.
// TheoCoffee: the approved TheoThreeQuarter (relaxed) holding a coffee cup; mirrored to face left when needed.
// PriyaReach: the Priya bust rig + one posable arm (pat / phone).
// RobotChair: the robot sitting in Dev's office chair.

const p3 = (a: Pt, b: Pt, c: Pt) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;
const Hand: React.FC<{ p: Pt; back?: boolean }> = ({ p, back }) => <circle cx={p[0]} cy={p[1]} r={back ? 17 : 19} fill={back ? S.devSkinShade : S.devSkin} stroke={INK} strokeWidth={5} />;
const SideShoe: React.FC<{ p: Pt }> = ({ p }) => (
  <g transform={`translate(${p[0]} ${p[1]})`}><path d="M-18,-8 L30,-8 Q50,-6 50,8 L-20,8 Z" fill={B.shoe} stroke={INK} strokeWidth={SW} strokeLinejoin="round" /></g>
);
type DevHeadOpts = { talk?: number; lookX?: number; lookY?: number; smile?: boolean; serious?: boolean; closed?: boolean; sweat?: number };
export type DevArms = "relaxed" | "what" | "point" | "mop" | "slump";

// Mop + bucket (Dev-local, standing on the floor at y = 190). Handle from top (tx,ty) to the mop head.
export const Mop: React.FC<{ top: Pt; foot: Pt }> = ({ top, foot }) => (
  <g>
    <line x1={top[0]} y1={top[1]} x2={foot[0]} y2={foot[1] - 14} stroke="#8A5A32" strokeWidth={12} strokeLinecap="round" />
    <rect x={foot[0] - 30} y={foot[1] - 22} width={60} height={14} rx={5} fill="#5B6878" stroke={INK} strokeWidth={4} />
    {Array.from({ length: 9 }).map((_, i) => (
      <path key={i} d={`M${foot[0] - 28 + i * 7},${foot[1] - 8} q${(i % 3) - 1 * 4},12 ${(i - 4) * 3},20`} stroke="#E8E2D2" strokeWidth={7} strokeLinecap="round" fill="none" />
    ))}
  </g>
);
export const Bucket: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-50,-90 L50,-90 L40,0 L-40,0 Z" fill="#FFC93C" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <ellipse cx={0} cy={-90} rx={50} ry={12} fill="#7FB8D8" stroke={INK} strokeWidth={5} />
    <path d="M-46,-80 Q0,-150 46,-80" fill="none" stroke={INK} strokeWidth={5} />
    <rect x={-30} y={-60} width={60} height={12} rx={4} fill="#E5A800" opacity={0.6} />
  </g>
);

export const DevStand: React.FC<{ x: number; y: number; s?: number; frame: number; arms?: DevArms; head?: DevHeadOpts; flip?: boolean; bounce?: number }> =
  ({ x, y, s = 1, frame, arms = "relaxed", head = {}, flip = false, bounce = 0 }) => {
    const shF: Pt = [58, -184], shB: Pt = [-44, -186];
    let hF: Pt = [80, -18], hB: Pt = [-56, -20];
    let bF = -1, bB = 1;
    if (arms === "what") { hF = [168, -262 + Math.sin(frame * 0.9) * 4]; hB = [-148, -250]; bF = 1; bB = -1; }
    if (arms === "point") { hF = [196, -150]; hB = [-56, -20]; bF = 1; }
    if (arms === "slump") { hF = [70, -8]; hB = [-50, -10]; }
    const mopTop: Pt = [-8, -175], mopFoot: Pt = [110, 192];
    // mop: the handle stands in front of his body. LEFT hand (from the left/far shoulder) grips high at the chest,
    // RIGHT hand (from the right/near shoulder) grips low at the waist. Both arms are drawn in front of the torso.
    if (arms === "mop") { hF = [39, -30]; hB = [0, -150]; bF = -1; bB = 1; } // grips ~120 apart, left grip clear of the right arm
    const elF = ik(shF, hF, 82, 78, bF), elB = ik(shB, hB, 82, 78, bB);
    const slump = arms === "slump" ? 8 : 0;
    return (
      <g transform={`translate(${x} ${y - bounce * s}) scale(${flip ? -s : s} ${s})`}>
        {/* far arm and far leg behind the body */}
        {arms !== "mop" && <><Limb d={p3(shB, elB, hB)} color={S.sweaterShade} w={40} /><Hand p={hB} back /></>}
        <Limb d="M-16,0 L-18,96 L-20,184" color={B.pantsShade} w={46} />
        <SideShoe p={[-20, 186]} />
        <Limb d="M26,0 L28,96 L30,184" color={B.pants} w={48} />
        <SideShoe p={[30, 186]} />
        <g transform={`rotate(${slump * 0.5} 0 0)`}>
          <path d="M-52,14 C-64,-60 -68,-150 -60,-192 C-34,-214 44,-214 70,-192 C78,-150 72,-60 62,14 Z" fill={S.sweater} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M-52,0 L62,0" stroke={S.sweaterShade} strokeWidth={10} />
          {[0, 1, 2].map((i) => <path key={i} d={`M-48,${-150 + i * 44} L60,${-150 + i * 44}`} stroke={S.sweaterShade} strokeWidth={4} opacity={0.55} />)}
          <rect x={-10} y={-228} width={36} height={36} fill={S.devSkinShade} stroke={INK} strokeWidth={SW} />
          <path d="M-26,-204 Q8,-184 42,-204" fill="none" stroke={S.sweaterShade} strokeWidth={9} />
          <g transform={`translate(8 ${-318 + slump})`}>
            <DevHead frame={frame} turn={14} lookX={8} lookY={2} smile={false} serious={false} {...head} />
            {(head.sweat ?? 0) > 0 && [[-70, -40], [86, -30]].slice(0, head.sweat).map(([sx, sy], i) => {
              const ph = ((frame + i * 9) % 22) / 22;
              return <path key={i} d={`M${sx},${sy + ph * 40} q-8,14 0,20 q8,-6 0,-20 Z`} fill="#9FD3F0" stroke={INK} strokeWidth={3} opacity={1 - ph * 0.6} />;
            })}
          </g>
        </g>
        {arms === "mop" && <Mop top={mopTop} foot={mopFoot} />}
        {arms === "mop" && <><Limb d={p3(shB, elB, hB)} color={S.sweaterShade} w={40} /><rect x={hB[0] - 18} y={hB[1] - 14} width={36} height={28} rx={12} fill={S.devSkinShade} stroke={INK} strokeWidth={5} transform={`rotate(12 ${hB[0]} ${hB[1]})`} /></>}
        <Limb d={p3(shF, elF, hF)} color={S.sweater} w={44} />
        {arms === "mop" ? <rect x={hF[0] - 20} y={hF[1] - 15} width={36} height={30} rx={13} fill={S.devSkin} stroke={INK} strokeWidth={5} transform={`rotate(12 ${hF[0]} ${hF[1]})`} /> : <Hand p={hF} />}
        {arms === "point" && <rect x={hF[0] + 8} y={hF[1] - 6} width={30} height={12} rx={6} fill={S.devSkin} stroke={INK} strokeWidth={4} />}
      </g>
    );
  };

// Theo, approved 3/4 relaxed pose, with a takeaway coffee in the front hand. flip = face screen left.
export const TheoCoffee: React.FC<{ x: number; y: number; s?: number; frame: number; h?: React.ComponentProps<typeof TheoThreeQuarter>["h"]; flip?: boolean }> = ({ x, y, s = 1, frame, h, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <TheoThreeQuarter x={0} y={0} s={s} frame={frame} h={h} relaxed />
    <g transform={`scale(${s}) translate(96 -40)`}>
      <path d="M-14,-46 L14,-46 L11,4 L-11,4 Z" fill="#FFFFFF" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-17} y={-56} width={34} height={11} rx={4} fill="#6B4A36" stroke={INK} strokeWidth={4} />
      <rect x={-12} y={-30} width={24} height={14} fill="#C98E5A" />
      <circle r={18} fill={LC.skin} stroke={INK} strokeWidth={5} />
    </g>
  </g>
);

// Priya bust + one posable arm. arm: "pat" reaches down-left to (tx,ty) (local); "phone" holds a phone up with a red alert screen.
export const PriyaReach: React.FC<{ x: number; y: number; s?: number; frame: number; expr: PriyaExpr; talk?: number; lookX?: number; lookY?: number; arm?: "pat" | "phone" | "none"; target?: Pt; alert?: number; part?: "all" | "body" | "arm"; buzz?: number }> =
  ({ x, y, s = 1, frame, expr, talk = 0, lookX, lookY, arm = "none", target = [-260, 300], alert = 1, part = "all", buzz = 0 }) => {
    const sh: Pt = [-120, 210];
    const hand: Pt = arm === "phone" ? [-150, 120] : target;
    const el = ik(sh, hand, 120, 115, -1);
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {part !== "arm" && <Priya x={0} y={0} frame={frame} expr={expr} talk={talk} lookX={lookX} lookY={lookY} mug={false} />}
        {part !== "body" && arm !== "none" && (
          <g>
            <Limb d={p3(sh, el, hand)} color={P.blazer} w={46} />
            {arm === "phone" && (
              <g transform={`translate(${hand[0] + Math.sin(frame * 4) * 6 * buzz} ${hand[1] - 70}) rotate(${-6 + Math.sin(frame * 5) * 4 * buzz})`}>
                <rect x={-50} y={-90} width={100} height={180} rx={16} fill="#20222A" stroke={INK} strokeWidth={5} />
                <rect x={-42} y={-78} width={84} height={150} rx={8} fill={alert > 0.5 ? "#FF5A5F" : "#2F6FD6"} />
                <text x={0} y={-40} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={900} fontSize={22} fill="#FFFFFF">EVERYONE</text>
                <text x={0} y={-16} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={900} fontSize={22} fill="#FFFFFF">@COMPANY</text>
                <text x={0} y={28} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={900} fontSize={34} fill="#FFFFFF">999+</text>
                <text x={0} y={56} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={700} fontSize={18} fill="#FFFFFF">new emails</text>
              </g>
            )}
            <circle cx={hand[0]} cy={hand[1]} r={22} fill={P.pSkin} stroke={INK} strokeWidth={5} />
          </g>
        )}
      </g>
    );
  };

// Dev's office chair (same look as DevSeated's) with the robot sitting on it, typing toward screen right.
export const ChairSeat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-96} y={-170} width={40} height={190} rx={16} fill={LC.chair} stroke={INK} strokeWidth={SW} />
    <rect x={-80} y={14} width={150} height={30} rx={12} fill={LC.chair} stroke={INK} strokeWidth={SW} />
    <rect x={-10} y={44} width={18} height={110} fill={P.metal} stroke={INK} strokeWidth={5} />
    <path d="M-70,160 L80,160" stroke={INK} strokeWidth={10} strokeLinecap="round" />
  </g>
);
export const RobotChair: React.FC<{ x: number; y: number; s?: number; frame: number; robotS?: number; robot?: Partial<React.ComponentProps<typeof Robot>> }> = ({ x, y, s = 1, frame, robotS = 0.8, robot = {} }) => (
  <g>
    <ChairSeat x={x} y={y} s={s} />
    <Robot x={x + 4 * s} y={y + 14 * s} s={robotS * s} frame={frame} pose="type" typeSpeed={1.6} expr="happy" face={0.6} reach={150} keyY={-80} {...robot} />
  </g>
);
