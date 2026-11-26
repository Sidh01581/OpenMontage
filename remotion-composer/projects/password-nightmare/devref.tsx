import React from "react";
import { INK, SW, Limb, Pt } from "../later/art";
import { S, DevHead } from "../sure/sart";
import { B } from "../busy/bart";
import { DevSeated } from "../busy/bart2";

// Dev — character reference sheet. Same DevHead, sweater, chinos, shoes and proportions as the film rigs
// (BUSY. DevWalker / DevSeated): hip origin, shoulders y -196, neck -228..-192, head centre y -318 (centred over
// the neck), thigh 98 + shin 94. Plain neutral background, no props or other characters.

const THIGH = 98, SHIN = 94, UPPER = 82, FORE = 78;
const rad = (d: number) => (d * Math.PI) / 180;
const fk = (o: Pt, deg: number, len: number): Pt => [o[0] + Math.sin(rad(deg)) * len, o[1] + Math.cos(rad(deg)) * len];
const p3 = (a: Pt, b: Pt, c: Pt) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;
const font = "'Helvetica Neue', Arial, sans-serif";

const Hand: React.FC<{ p: Pt; back?: boolean }> = ({ p, back }) => <circle cx={p[0]} cy={p[1]} r={back ? 17 : 19} fill={back ? S.devSkinShade : S.devSkin} stroke={INK} strokeWidth={5} />;
const SideShoe: React.FC<{ p: Pt; deg?: number }> = ({ p, deg = 0 }) => (
  <g transform={`translate(${p[0]} ${p[1]}) rotate(${-deg * 0.4})`}><path d="M-18,-8 L30,-8 Q50,-6 50,8 L-20,8 Z" fill={B.shoe} stroke={INK} strokeWidth={SW} strokeLinejoin="round" /></g>
);
const Neck: React.FC<{ cx?: number }> = ({ cx = 8 }) => (
  <>
    <rect x={cx - 18} y={-228} width={36} height={36} fill={S.devSkinShade} stroke={INK} strokeWidth={SW} />
    <path d={`M${cx - 34},-204 Q${cx},-184 ${cx + 34},-204`} fill="none" stroke={S.sweaterShade} strokeWidth={9} />
  </>
);
const Stripes: React.FC<{ x0: number; x1: number }> = ({ x0, x1 }) => (
  <>
    <path d={`M${x0},0 L${x1},0`} stroke={S.sweaterShade} strokeWidth={10} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${x0 + 4},${-150 + i * 44} L${x1 - 2},${-150 + i * 44}`} stroke={S.sweaterShade} strokeWidth={4} opacity={0.55} />)}
  </>
);

type HeadOpts = { talk?: number; lookX?: number; lookY?: number; smile?: boolean; serious?: boolean; closed?: boolean };

// ---------------------------------------------------------------- front view (looking at the viewer: reference sheet only)
export const DevFront: React.FC<{ x: number; y: number; s?: number; frame: number; head?: HeadOpts }> = ({ x, y, s = 1, frame, head = {} }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Limb d="M-28,0 L-30,96 L-32,184" color={B.pantsShade} w={48} />
    <Limb d="M28,0 L30,96 L32,184" color={B.pants} w={48} />
    <ellipse cx={-38} cy={190} rx={30} ry={13} fill={B.shoe} stroke={INK} strokeWidth={SW} />
    <ellipse cx={38} cy={190} rx={30} ry={13} fill={B.shoe} stroke={INK} strokeWidth={SW} />
    <path d="M-62,14 C-72,-60 -80,-150 -74,-192 C-46,-214 46,-214 74,-192 C80,-150 72,-60 62,14 Z" fill={S.sweater} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <Stripes x0={-62} x1={62} />
    <Neck cx={0} />
    <Limb d={p3([-66, -184], [-86, -102], [-88, -22])} color={S.sweater} w={44} />
    <Limb d={p3([66, -184], [86, -102], [88, -22])} color={S.sweater} w={44} />
    <Hand p={[-88, -18]} /><Hand p={[88, -18]} />
    <circle cx={96} cy={-308} r={18} fill={S.devSkin} stroke={INK} strokeWidth={SW} />
    <g transform="translate(0 -318)"><DevHead frame={frame} turn={0} lookX={0} lookY={2} smile {...head} /></g>
  </g>
);

// ---------------------------------------------------------------- three-quarter view (turned toward screen right)
export const DevThreeQuarter: React.FC<{ x: number; y: number; s?: number; frame: number; head?: HeadOpts }> = ({ x, y, s = 1, frame, head = {} }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* far arm and far leg behind the body */}
    <Limb d={p3([-44, -186], [-60, -104], [-56, -24])} color={S.sweaterShade} w={40} />
    <Hand p={[-56, -20]} back />
    <Limb d="M-16,0 L-18,96 L-20,184" color={B.pantsShade} w={46} />
    <SideShoe p={[-20, 186]} />
    <Limb d="M26,0 L28,96 L30,184" color={B.pants} w={48} />
    <SideShoe p={[30, 186]} />
    <path d="M-52,14 C-64,-60 -68,-150 -60,-192 C-34,-214 44,-214 70,-192 C78,-150 72,-60 62,14 Z" fill={S.sweater} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <Stripes x0={-52} x1={62} />
    <Neck cx={8} />
    <g transform="translate(8 -318)"><DevHead frame={frame} turn={14} lookX={8} lookY={2} smile {...head} /></g>
    <Limb d={p3([58, -184], [76, -102], [80, -22])} color={S.sweater} w={44} />
    <Hand p={[80, -18]} />
  </g>
);

// ---------------------------------------------------------------- side view, standing or walking (facing screen right)
// walk: undefined = standing; else the walk phase (one step = 1.0), DevWalker's leg FK with natural arm swing.
export const DevSide: React.FC<{ x: number; y: number; s?: number; frame: number; walk?: number; head?: HeadOpts }> = ({ x, y, s = 1, frame, walk, head = {} }) => {
  const walking = walk !== undefined;
  const ph = (walk ?? 0) * Math.PI;
  const A = walking ? 24 : 0;
  const swF = Math.sin(ph), swB = -swF;
  const bend = (vel: number) => (walking ? -(6 + 46 * Math.max(0, vel)) : 0);
  const hipF: Pt = [10, 0], hipB: Pt = [-10, 0];
  const kF = fk(hipF, A * swF, THIGH), fF = fk(kF, A * swF + bend(Math.cos(ph)), SHIN);
  const kB = fk(hipB, A * swB, THIGH), fB = fk(kB, A * swB + bend(-Math.cos(ph)), SHIN);
  const lift = THIGH + SHIN - 6 - Math.max(fF[1], fB[1]);
  const bob = walking ? -Math.abs(Math.sin(ph)) * 10 : 0;
  const lean = walking ? 5 : 0;
  // arms swing opposite to the legs; elbows bend slightly forward
  // walking: shoulders relax a little lower; a short flexible neck carries the head slightly forward
  const shF: Pt = walking ? [26, -188] : [26, -196], shB: Pt = walking ? [-18, -186] : [-18, -194];
  const tilt = lean + 6 + Math.sin(ph * 2) * 1.5;
  const swing = walking ? 22 : 0;
  const elF = fk(shF, -swing * swF, UPPER), haF = fk(elF, -swing * swF + 14, FORE);
  const elB = fk(shB, -swing * swB, UPPER), haB = fk(elB, -swing * swB + 14, FORE);
  return (
    <g transform={`translate(${x} ${y + (lift + bob) * s}) scale(${s})`}>
      <Limb d={p3(hipB, kB, fB)} color={B.pantsShade} w={46} />
      <SideShoe p={fB} deg={A * swB} />
      <g transform={`rotate(${lean} 0 0)`}>
        <Limb d={p3(shB, elB, haB)} color={S.sweaterShade} w={40} />
        <Hand p={haB} back />
      </g>
      <Limb d={p3(hipF, kF, fF)} color={B.pants} w={48} />
      <SideShoe p={fF} deg={A * swF} />
      <g transform={`rotate(${lean} 0 0)`}>
        {walking && <Limb d="M8,-192 Q10,-232 20,-252" color={S.devSkinShade} w={34} />}
        <path d="M-50,14 C-62,-60 -60,-150 -44,-196 C-20,-214 30,-214 54,-196 C70,-150 70,-60 58,14 Z" fill={S.sweater} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <Stripes x0={-50} x1={58} />
        {walking ? <path d="M-26,-204 Q8,-184 42,-204" fill="none" stroke={S.sweaterShade} strokeWidth={9} /> : <Neck cx={8} />}
        <g transform={walking ? `translate(20 -252) rotate(${tilt - lean}) translate(0 -92)` : "translate(8 -318)"}><DevHead frame={frame} turn={30} lookX={16} lookY={walking ? 4 : 2} smile serious={false} {...head} /></g>
        <Limb d={p3(shF, elF, haF)} color={S.sweater} w={44} />
        <Hand p={haF} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- sitting at a desk (the film's DevSeated rig) on a plain desk top
export const DevSitting: React.FC<{ x: number; y: number; s?: number; frame: number }> = ({ x, y, s = 1, frame }) => (
  <g>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={60} y={-40} width={300} height={24} rx={5} fill="#D9D6CF" stroke={INK} strokeWidth={SW} />
      <rect x={320} y={-16} width={20} height={176} fill="#B9B6AF" stroke={INK} strokeWidth={SW} />
    </g>
    <DevSeated x={x} y={y} s={s} frame={frame} pose="type" typeSpeed={0} serious={false} lookX={16} lookY={6} deskless natural />
  </g>
);

// ---------------------------------------------------------------- the sheet (2400 x 1500)
const Label: React.FC<{ x: number; y: number; children: React.ReactNode; size?: number }> = ({ x, y, children, size = 36 }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={size} fill="#3A3A40">{children}</text>
);
const EXPR: { label: string; head: HeadOpts & { turn?: number } }[] = [
  { label: "Happy", head: { smile: true } },
  { label: "Serious", head: { serious: true } },
  { label: "Talking", head: { talk: 0.6, smile: false } },
  { label: "Surprised", head: { talk: 1, smile: false, lookY: -3 } },
  { label: "Annoyed", head: { serious: true, lookX: 14 } },
  { label: "Eyes closed", head: { closed: true, smile: false } },
];
export const DevReferenceSheet: React.FC<{ frame: number }> = ({ frame }) => {
  const f = 20; // a frame with no blink
  const GY = 820, sc = 1.1;
  return (
    <svg width={2400} height={1500} viewBox="0 0 2400 1500">
      <rect width={2400} height={1500} fill="#ECEBE6" />
      <text x={70} y={96} fontFamily={font} fontWeight={900} fontSize={60} fill="#22222A">DEV — character reference</text>
      <text x={72} y={146} fontFamily={font} fontWeight={600} fontSize={30} fill="#6A6A72">Same head, proportions and outfit in every pose · head centred over the neck · neck inside the collar</text>
      {/* ground shadows */}
      {[300, 740, 1180, 1610].map((cx, i) => <ellipse key={i} cx={cx} cy={GY + 200 * sc} rx={110} ry={14} fill="#000" opacity={0.08} />)}
      <DevFront x={300} y={GY} s={sc} frame={f} />
      <DevThreeQuarter x={740} y={GY} s={sc} frame={f} />
      <DevSide x={1180} y={GY} s={sc} frame={f} />
      <DevSide x={1610} y={GY} s={sc} frame={f} walk={0.55} />
      <DevSitting x={2010} y={GY + 30} s={sc * 0.95} frame={f} />
      <Label x={300} y={1100}>Front</Label>
      <Label x={740} y={1100}>Three-quarter</Label>
      <Label x={1180} y={1100}>Side</Label>
      <Label x={1610} y={1100}>Walking</Label>
      <Label x={2110} y={1100}>Sitting at a desk</Label>
      <line x1={70} y1={1140} x2={2330} y2={1140} stroke="#C9C7C0" strokeWidth={3} />
      {EXPR.map((e, i) => {
        const cx = 240 + i * 384;
        return (
          <g key={i}>
            <g transform={`translate(${cx} 1290) scale(0.72)`}><DevHead frame={f} turn={14} lookX={6} lookY={2} {...e.head} /></g>
            <Label x={cx} y={1470} size={32}>{e.label}</Label>
          </g>
        );
      })}
    </svg>
  );
};
