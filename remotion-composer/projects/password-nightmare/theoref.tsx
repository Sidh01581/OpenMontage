import React from "react";
import { C, INK, SW, Face, Limb, Expr, Pt } from "../later/art";
import { P, Mug } from "../we-need-to-talk/vart";

// Theo — character reference sheet. Same approved Head (glasses, hair flick, eyes), yellow hoodie, dark trousers,
// white shoes and lanyard + ID card as the film rigs (LATER. TheoPuppet / WE NEED TO TALK. TheoPuppetV units):
// hip origin, shoulders y -172, hood collar ring at y -186, thigh 80 + shin 78.
// Corrections: the head sits on a short neck rising out of the hood collar (centred over the shoulders), and the
// ID card lies flat on the chest and turns WITH the torso (flat in front view, foreshortened in 3/4, edge-on in side).

const UPPER = 80, FORE = 74, THIGH = 80, SHIN = 78;
const rad = (d: number) => (d * Math.PI) / 180;
const fk = (o: Pt, deg: number, len: number): Pt => [o[0] + Math.sin(rad(deg)) * len, o[1] + Math.cos(rad(deg)) * len];
const p3 = (a: Pt, b: Pt, c: Pt) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;
const font = "'Helvetica Neue', Arial, sans-serif";
export const THEO_HEAD_Y = -304; // head centre (was -278 with no neck)

type HeadOpts = { expr?: Expr; talk?: number; lookX?: number; lookY?: number; eyesClosed?: boolean };
const Hand: React.FC<{ p: Pt; back?: boolean }> = ({ p, back }) => <circle cx={p[0]} cy={p[1]} r={back ? 17 : 18} fill={back ? C.skinShade : C.skin} stroke={INK} strokeWidth={5} />;
const Shoe: React.FC<{ p: Pt; front?: boolean }> = ({ p, front }) => front
  ? <ellipse cx={p[0]} cy={p[1] + 6} rx={26} ry={14} fill="#FFFFFF" stroke={INK} strokeWidth={SW} />
  : <ellipse cx={p[0] + 16} cy={p[1] + 6} rx={34} ry={15} fill="#FFFFFF" stroke={INK} strokeWidth={SW} />;

// Hood collar ring + short neck: back of the ring, the neck, then the ring's front lip over the neck base.
const Collar: React.FC<{ cx?: number }> = ({ cx = 2 }) => (
  <>
    <ellipse cx={cx} cy={-186} rx={50} ry={26} fill={C.hoodieShade} stroke={INK} strokeWidth={SW} />
    <Limb d={`M${cx + 4},-180 L${cx + 8},-214`} color={C.skinShade} w={40} />
    <path d={`M${cx - 50},-188 C${cx - 44},-158 ${cx + 44},-158 ${cx + 50},-188 C${cx + 36},-172 ${cx - 34},-172 ${cx - 50},-188 Z`} fill={C.hoodieShade} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </>
);

// The ID card on its lanyard. view: front = flat to the viewer; tq = turned with the chest (foreshortened);
// side = edge-on against the front of the chest. (cx, cy) = card centre on the chest.
const Card: React.FC<{ view: "front" | "tq" | "side"; cx: number; cy: number; neck: [Pt, Pt] }> = ({ view, cx, cy, neck }) => {
  const strap = (a: Pt, b: Pt) => (
    <>
      <path d={`M${a[0]},${a[1]} Q${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2 + 8} ${b[0]},${b[1]}`} fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <path d={`M${a[0]},${a[1]} Q${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2 + 8} ${b[0]},${b[1]}`} fill="none" stroke={P.lanyard} strokeWidth={5} strokeLinecap="round" />
    </>
  );
  if (view === "side") {
    // edge-on: a thin card lying against the chest, one strap visible coming down from the neck
    return (
      <g>
        {strap(neck[1], [cx, cy - 26])}
        <g transform={`rotate(-6 ${cx} ${cy - 26})`}>
          <rect x={cx - 5} y={cy - 26} width={10} height={52} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <rect x={cx - 5} y={cy - 26} width={10} height={12} rx={2} fill={P.lanyard} stroke={INK} strokeWidth={3} />
        </g>
      </g>
    );
  }
  const sx = view === "tq" ? 0.7 : 1, sk = view === "tq" ? -7 : 0;
  return (
    <g>
      {strap(neck[0], [cx - 10 * sx, cy - 26])}
      {strap(neck[1], [cx + 10 * sx, cy - 26])}
      <g transform={`translate(${cx} ${cy}) skewY(${sk}) scale(${sx} 1)`}>
        <rect x={-20} y={-26} width={40} height={52} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <rect x={-20} y={-26} width={40} height={12} rx={3} fill={P.lanyard} stroke={INK} strokeWidth={3} />
        <circle cx={0} cy={2} r={8} fill={C.skinShade} />
        <line x1={-11} y1={16} x2={11} y2={16} stroke={INK} strokeWidth={3} />
      </g>
    </g>
  );
};


// ---------------------------------------------------------------- Theo's upgraded hairstyle (art coords: skull centre 985,425 r 108)
// Rich dark brown, natural volume on top, side-swept layered fringe (soft tips), tapered sides. (The top spike/flick was removed at the user's request.)
export const TH = { hair: "#4A2E1E", hairDark: "#2E1B10", hairHi: "#6E4A33", taper: "#6A4A38" };
const Flick: React.FC<{ dx?: number }> = ({ dx = 0 }) => (
  <path d={`M${1002 + dx},292 C${1004 + dx},266 ${1020 + dx},254 ${1036 + dx},242 C${1032 + dx},262 ${1024 + dx},280 ${1018 + dx},294 Z`} fill={TH.hair} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
);
export const HairTQ: React.FC = () => (
  <g>
    {/* tapered side above the ear */}
    <path d="M884,426 C874,392 876,362 890,342 L912,352 C902,372 900,398 904,424 Z" fill={TH.taper} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {/* main mass: volume on top, fringe swept toward the face side with layered soft tips */}
    <path d="M896,358 C884,330 900,302 930,290 C966,276 1018,276 1050,290 C1082,302 1104,326 1106,354 C1104,364 1100,372 1096,378 C1090,368 1082,360 1074,356 C1070,364 1066,372 1060,378 C1054,364 1046,356 1036,352 C1030,360 1024,366 1018,370 C1014,358 1006,352 994,350 C986,356 978,360 970,362 C966,352 956,348 944,350 C932,354 920,360 912,368 C906,366 900,362 896,358 Z" fill={TH.hair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    {/* texture strands + one soft highlight */}
    <path d="M922,330 Q980,304 1056,322" fill="none" stroke={TH.hairDark} strokeWidth={4} strokeLinecap="round" />
    <path d="M948,346 Q1000,322 1070,340" fill="none" stroke={TH.hairDark} strokeWidth={4} strokeLinecap="round" />
    <path d="M1010,300 Q1060,306 1092,344" fill="none" stroke={TH.hairDark} strokeWidth={4} strokeLinecap="round" />
    <path d="M944,302 Q982,290 1018,294" fill="none" stroke={TH.hairHi} strokeWidth={6} strokeLinecap="round" />
  </g>
);
export const HairFront: React.FC = () => (
  <g>
    <path d="M882,428 C872,394 874,364 888,344 L908,354 C900,374 898,400 902,426 Z" fill={TH.taper} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M1088,428 C1098,394 1096,364 1082,344 L1062,354 C1070,374 1072,400 1068,426 Z" fill={TH.taper} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M890,360 C878,330 896,300 928,288 C962,276 1010,276 1044,288 C1076,300 1094,330 1084,362 C1078,370 1072,374 1066,378 C1062,368 1056,362 1048,358 C1044,366 1038,372 1032,376 C1028,364 1020,356 1010,352 C1004,360 998,366 990,368 C986,358 978,352 966,350 C958,356 950,360 942,362 C936,354 928,350 918,352 C908,356 898,360 890,360 Z" fill={TH.hair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M912,328 Q966,302 1044,318" fill="none" stroke={TH.hairDark} strokeWidth={4} strokeLinecap="round" />
    <path d="M934,346 Q988,322 1056,340" fill="none" stroke={TH.hairDark} strokeWidth={4} strokeLinecap="round" />
    <path d="M930,302 Q968,290 1004,294" fill="none" stroke={TH.hairHi} strokeWidth={6} strokeLinecap="round" />
  </g>
);
// Full head with the new hair. view tq = the approved 3/4 head; front = face centred, both ears + glasses arms.
export const TheoHead: React.FC<{ view?: "tq" | "front"; frame: number } & HeadOpts> = ({ view = "tq", frame, expr = "smile", talk, lookX, lookY, eyesClosed }) => view === "front" ? (
  <g>
    <circle cx={877} cy={438} r={20} fill={C.skin} stroke={INK} strokeWidth={SW} />
    <circle cx={1093} cy={438} r={20} fill={C.skin} stroke={INK} strokeWidth={SW} />
    <circle cx={985} cy={425} r={108} fill={C.skin} stroke={INK} strokeWidth={SW} />
    <HairFront />
    <g transform="translate(-32 0)"><Face expr={expr} frame={frame} lookX={lookX ?? 0} lookY={lookY ?? 3} talk={talk} eyesClosed={eyesClosed} /></g>
    <line x1={1047} y1={428} x2={1088} y2={420} stroke={INK} strokeWidth={5} />
  </g>
) : (
  <g>
    <circle cx={902} cy={438} r={20} fill={C.skin} stroke={INK} strokeWidth={SW} />
    <circle cx={985} cy={425} r={108} fill={C.skin} stroke={INK} strokeWidth={SW} />
    <HairTQ />
    <Face expr={expr} frame={frame} lookX={lookX ?? 6} lookY={lookY ?? 4} talk={talk} eyesClosed={eyesClosed} />
  </g>
);

// ---------------------------------------------------------------- heads
// 3/4 head (the approved Head, unchanged), centred at (hx, THEO_HEAD_Y)
const Head34: React.FC<{ hx: number; frame: number; tilt?: number; h?: HeadOpts }> = ({ hx, frame, tilt = 0, h = {} }) => (
  <g transform={`translate(${hx} ${THEO_HEAD_Y}) rotate(${tilt}) translate(-985 -425)`}>
    <TheoHead view="tq" frame={frame} expr={h.expr ?? "smile"} lookX={h.lookX ?? 6} lookY={h.lookY ?? 4} talk={h.talk} eyesClosed={h.eyesClosed} />
  </g>
);
// Front head: same skull, hair and Face, with the face centred (shifted 32 px) and both ears + both glasses arms.
const HeadFront: React.FC<{ frame: number; h?: HeadOpts }> = ({ frame, h = {} }) => (
  <g transform={`translate(0 ${THEO_HEAD_Y}) translate(-985 -425)`}>
    <TheoHead view="front" frame={frame} {...h} />
  </g>
);

// ---------------------------------------------------------------- bodies (standing)
export const TheoFront: React.FC<{ x: number; y: number; s?: number; frame: number; h?: HeadOpts }> = ({ x, y, s = 1, frame, h }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Limb d="M-22,-6 L-23,74 L-24,152" color="#3C3F48" w={46} />
    <Limb d="M24,-6 L25,74 L26,152" color={C.pants} w={46} />
    <Shoe p={[-26, 154]} front /><Shoe p={[28, 154]} front />
    <path d="M-66,6 C-76,-70 -70,-150 -56,-182 C-24,-200 28,-200 60,-182 C74,-150 80,-70 70,6 Z" fill={C.hoodie} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M-64,-4 L68,-4" stroke={C.hoodieShade} strokeWidth={8} />
    <path d="M-34,-60 Q2,-48 38,-60" fill="none" stroke={C.hoodieShade} strokeWidth={6} />
    <Collar />
    <path d="M-10,-172 L-12,-140 M14,-172 L16,-140" stroke={INK} strokeWidth={3} />
    <Card view="front" cx={2} cy={-104} neck={[[-22, -178], [26, -178]]} />
    <Limb d={p3([-58, -166], [-72, -88], [-74, -14])} color={C.hoodie} w={44} />
    <Limb d={p3([62, -166], [76, -88], [78, -14])} color={C.hoodie} w={44} />
    <Hand p={[-74, -10]} /><Hand p={[78, -10]} />
    <HeadFront frame={frame} h={h} />
  </g>
);

export const TheoThreeQuarter: React.FC<{ x: number; y: number; s?: number; frame: number; h?: HeadOpts; relaxed?: boolean }> = ({ x, y, s = 1, frame, h, relaxed }) => {
  // relaxed: weight on the back leg, front knee soft, front arm bent at the elbow
  const elF: Pt = relaxed ? [70, -96] : [66, -92], haF: Pt = relaxed ? [96, -40] : [72, -14];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Limb d={p3([-38, -166], [-52, -90], [-50, -16])} color={C.hoodieShade} w={40} />
      <Hand p={[-50, -12]} back />
      <Limb d={relaxed ? "M-14,-6 L-18,74 L-20,152" : "M-14,-6 L-16,74 L-18,152"} color="#3C3F48" w={46} />
      <Shoe p={[-20, 154]} />
      <Limb d={relaxed ? "M20,-6 L34,72 L30,152" : "M20,-6 L22,74 L24,152"} color={C.pants} w={48} />
      <Shoe p={[28, 154]} />
      <path d="M-60,6 C-70,-70 -60,-150 -40,-186 C-10,-200 30,-200 48,-184 C66,-140 66,-60 58,6 Z" fill={C.hoodie} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-58,-4 L56,-4" stroke={C.hoodieShade} strokeWidth={8} />
      <path d="M-20,-60 Q8,-52 36,-60" fill="none" stroke={C.hoodieShade} strokeWidth={6} />
      <Collar />
      <path d="M14,-172 L12,-140 M30,-172 L30,-142" stroke={INK} strokeWidth={3} />
      <Card view="tq" cx={18} cy={-104} neck={[[-16, -178], [34, -178]]} />
      <Head34 hx={12} frame={frame} h={h} />
      <Limb d={p3([48, -166], elF, haF)} color={C.hoodie} w={44} />
      <Hand p={haF} />
    </g>
  );
};

export const TheoSide: React.FC<{ x: number; y: number; s?: number; frame: number; h?: HeadOpts }> = ({ x, y, s = 1, frame, h }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Limb d={p3([-14, -168], [-20, -90], [-14, -16])} color={C.hoodieShade} w={40} />
    <Hand p={[-14, -12]} back />
    <Limb d="M-6,-6 L-6,74 L-6,152" color="#3C3F48" w={46} />
    <Shoe p={[-8, 154]} />
    <Limb d="M8,-6 L8,74 L8,152" color={C.pants} w={48} />
    <Shoe p={[6, 154]} />
    <path d="M-48,6 C-58,-70 -52,-150 -36,-186 C-10,-200 26,-200 44,-184 C60,-140 62,-60 54,6 Z" fill={C.hoodie} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M-46,-4 L52,-4" stroke={C.hoodieShade} strokeWidth={8} />
    <path d="M-30,-196 C-60,-180 -64,-130 -46,-108" fill="none" stroke={C.hoodieShade} strokeWidth={8} strokeLinecap="round" />
    <Collar cx={4} />
    <Card view="side" cx={56} cy={-112} neck={[[0, -178], [30, -180]]} />
    <Head34 hx={14} frame={frame} h={{ lookX: 10, ...h }} />
    <Limb d={p3([18, -166], [16, -88], [22, -14])} color={C.hoodie} w={44} />
    <Hand p={[22, -10]} />
  </g>
);

// ---------------------------------------------------------------- sitting at a plain desk (side view, facing right)
// desk: draw the plain desk (sheet); mug: no desk, front hand holds a coffee mug at chest height (rolled-over chair).
export const TheoSitting: React.FC<{ x: number; y: number; s?: number; frame: number; h?: HeadOpts; desk?: boolean; mug?: boolean }> = ({ x, y, s = 1, frame, h, desk = true, mug = false }) => {
  const lean = 10;
  const r = (p: Pt): Pt => [p[0] * Math.cos(rad(lean)) - p[1] * Math.sin(rad(lean)), p[0] * Math.sin(rad(lean)) + p[1] * Math.cos(rad(lean))];
  const shF = r([18, -166]), shB = r([-14, -164]);
  const haF: Pt = mug ? [104, -70] : [150, -44], haB: Pt = mug ? [70, 6] : [126, -42];
  const elF: Pt = [shF[0] + 18, shF[1] + 80], elB: Pt = mug ? [shB[0] + 6, shB[1] + 82] : [shB[0] + 14, shB[1] + 80];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* chair */}
      <rect x={-92} y={-150} width={36} height={170} rx={14} fill={C.chair} stroke={INK} strokeWidth={SW} />
      <rect x={-78} y={10} width={140} height={28} rx={12} fill={C.chair} stroke={INK} strokeWidth={SW} />
      <rect x={-10} y={38} width={18} height={104} fill="#9AA0AA" stroke={INK} strokeWidth={5} />
      <path d="M-66,146 L74,146" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      {/* desk (plain) */}
      {desk && <rect x={70} y={-30} width={230} height={22} rx={5} fill="#D9D6CF" stroke={INK} strokeWidth={SW} />}
      {desk && <rect x={262} y={-8} width={20} height={160} fill="#B9B6AF" stroke={INK} strokeWidth={SW} />}
      {/* back arm, legs */}
      <Limb d={p3(shB, elB, haB)} color={C.hoodieShade} w={40} />
      <Hand p={haB} back />
      <Limb d="M-8,4 L92,12 L100,140" color="#3C3F48" w={46} />
      <Limb d="M8,6 L108,16 L116,142" color={C.pants} w={48} />
      <Shoe p={[118, 140]} />
      {/* torso leaning slightly toward the desk */}
      <g transform={`rotate(${lean} 0 0)`}>
        <path d="M-48,6 C-58,-70 -52,-150 -36,-186 C-10,-200 26,-200 44,-184 C60,-140 62,-60 54,6 Z" fill={C.hoodie} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M-46,-4 L52,-4" stroke={C.hoodieShade} strokeWidth={8} />
        <path d="M-30,-196 C-60,-180 -64,-130 -46,-108" fill="none" stroke={C.hoodieShade} strokeWidth={8} strokeLinecap="round" />
        <Collar cx={4} />
        <Card view="side" cx={56} cy={-112} neck={[[0, -178], [30, -180]]} />
        <Head34 hx={14} frame={frame} tilt={4} h={{ lookX: 10, lookY: 8, ...h }} />
      </g>
      <Limb d={p3(shF, elF, haF)} color={C.hoodie} w={44} />
      {mug && <Mug x={haF[0] + 26} y={haF[1] - 4} s={0.9} frame={frame} />}
      <Hand p={haF} />
    </g>
  );
};

// ---------------------------------------------------------------- the sheet (2400 x 1500)
const Label: React.FC<{ x: number; y: number; children: React.ReactNode; size?: number }> = ({ x, y, children, size = 36 }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={size} fill="#3A3A40">{children}</text>
);
const EXPR: { label: string; h: HeadOpts }[] = [
  { label: "Happy", h: { expr: "smile" } },
  { label: "Neutral", h: { expr: "neutral" } },
  { label: "Talking", h: { expr: "neutral", talk: 0.6 } },
  { label: "Surprised", h: { expr: "shock" } },
  { label: "Unimpressed", h: { expr: "blank" } },
  { label: "Tired", h: { expr: "exhausted" } },
];
export const TheoReferenceSheet: React.FC = () => {
  const f = 20, GY = 860, sc = 1.15;
  return (
    <svg width={2400} height={1500} viewBox="0 0 2400 1500">
      <rect width={2400} height={1500} fill="#ECEBE6" />
      <text x={70} y={96} fontFamily={font} fontWeight={900} fontSize={60} fill="#22222A">THEO — character reference</text>
      <text x={72} y={146} fontFamily={font} fontWeight={600} fontSize={30} fill="#6A6A72">Same head, glasses, hoodie and ID card in every pose · head on a short neck over the shoulders · card lies flat on the chest and turns with it</text>
      {[300, 740, 1180, 1620].map((cx, i) => <ellipse key={i} cx={cx} cy={GY + 172 * sc} rx={110} ry={14} fill="#000" opacity={0.08} />)}
      <TheoFront x={300} y={GY} s={sc} frame={f} />
      <TheoThreeQuarter x={740} y={GY} s={sc} frame={f} />
      <TheoSide x={1180} y={GY} s={sc} frame={f} />
      <TheoThreeQuarter x={1620} y={GY} s={sc} frame={f} relaxed h={{ expr: "smile", lookX: 8 }} />
      <TheoSitting x={1990} y={GY + 24} s={sc * 0.95} frame={f} />
      <Label x={300} y={1100}>Front</Label>
      <Label x={740} y={1100}>Three-quarter</Label>
      <Label x={1180} y={1100}>Side</Label>
      <Label x={1620} y={1100}>Standing, relaxed</Label>
      <Label x={2080} y={1100}>Sitting at a desk</Label>
      <line x1={70} y1={1140} x2={2330} y2={1140} stroke="#C9C7C0" strokeWidth={3} />
      {EXPR.map((e, i) => {
        const cx = 240 + i * 384;
        return (
          <g key={i}>
            <g transform={`translate(${cx} 1290) scale(0.66) translate(-985 -425)`}><TheoHead view="tq" frame={f} expr={e.h.expr} lookX={6} lookY={4} talk={e.h.talk} /></g>
            <Label x={cx} y={1470} size={32}>{e.label}</Label>
          </g>
        );
      })}
    </svg>
  );
};
