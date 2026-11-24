import React from "react";
import { C, INK, SW, Head, Limb, Expr, Pt } from "./art";

// Data-driven full-body Theo. Pure SVG (no Remotion imports).
// Local space: origin = hip center, facing screen right, y down. Units = room px (same scale as the seated rig).
// Angles in degrees measured from "straight down"; positive swings FORWARD (toward +x when facing right).
// The head is the approved Head from art.tsx, never redrawn.

export type TheoPose = {
  lean?: number; // torso rotation about the hip
  headTilt?: number; headDX?: number; headDY?: number;
  armF?: [number, number]; // front arm: shoulder, elbow (elbow is relative to upper arm)
  armB?: [number, number]; // back arm
  legF?: [number, number]; // front leg: hip, knee (relative; negative bends the shin back)
  legB?: [number, number];
  handF?: "fist" | "thumb" | "open";
  armStretch?: number; // squash & stretch on arm length (1 = normal)
  armsBehindHead?: boolean; // draw the front arm behind the head (overhead stretch)
  propF?: "phone" | "marker" | "sheet" | "none";
};

const UPPER = 80, FORE = 74, THIGH = 80, SHIN = 78;
const rad = (d: number) => (d * Math.PI) / 180;
const fk = (o: Pt, deg: number, len: number): Pt => [o[0] + Math.sin(rad(deg)) * len, o[1] + Math.cos(rad(deg)) * len];

// Named pose presets (the pose library). Parts not named fall back to DEFAULT.
export const DEFAULT: Required<Omit<TheoPose, "propF" | "handF" | "armStretch" | "armsBehindHead">> = {
  lean: 0, headTilt: 0, headDX: 0, headDY: 0, armF: [8, 10], armB: [-6, 8], legF: [6, -4], legB: [-6, -2],
};
export const POSES: Record<string, TheoPose> = {
  stand_idle: {},
  stretch_up: { lean: -6, headTilt: -10, headDY: -6, armF: [150, 15], armB: [-150, 0], armStretch: 1.35, armsBehindHead: true, legF: [4, 0], legB: [-4, 0], handF: "fist" },
  thumbs_up: { armF: [70, 70], handF: "thumb" },
  walk_contact_a: { lean: 6, legF: [28, -6], legB: [-24, -10], armF: [-20, 20], armB: [22, 20] },
  walk_contact_b: { lean: 6, legF: [-24, -10], legB: [28, -6], armF: [22, 20], armB: [-20, 20] },
  vacuum_push: { lean: 14, armF: [62, 10], armB: [52, 18], legF: [24, -8], legB: [-18, -12], handF: "fist" },
  reach_board: { lean: 6, armF: [98, 34], armB: [10, 30], headTilt: -6, handF: "fist", propF: "marker" },
  drawer_push: { lean: 10, armF: [78, 4], armB: [64, 10], legF: [14, -4], legB: [-12, -4], handF: "open" },
  phone_hold: { armF: [40, 92], armB: [20, 96], headTilt: 10, headDX: 6, handF: "fist", propF: "phone" },
  sit_low: { lean: -22, legF: [86, -84], legB: [80, -80], armF: [30, 60], armB: [16, 70], headTilt: 6 }, // beanbag
  lie_back_phone: { lean: 0, armF: [110, 30], armB: [100, 36], legF: [6, 0], legB: [-4, 0], handF: "fist", propF: "phone" }, // use rot -90
  stand_small: { armF: [4, 6], armB: [-4, 6], headTilt: -14, headDY: -4 }, // looking up at something huge
  hold_sheet: { armF: [60, 60], armB: [50, 66], propF: "sheet", headTilt: 8 },
};

export const mixPose = (a: TheoPose, b: TheoPose, t: number): TheoPose => {
  const A = { ...DEFAULT, ...a }, B = { ...DEFAULT, ...b };
  const l = (x: number, y: number) => x + (y - x) * t;
  const l2 = (x: [number, number], y: [number, number]): [number, number] => [l(x[0], y[0]), l(x[1], y[1])];
  return {
    lean: l(A.lean, B.lean), headTilt: l(A.headTilt, B.headTilt), headDX: l(A.headDX, B.headDX), headDY: l(A.headDY, B.headDY),
    armF: l2(A.armF, B.armF), armB: l2(A.armB, B.armB), legF: l2(A.legF, B.legF), legB: l2(A.legB, B.legB),
    handF: t < 0.5 ? a.handF : b.handF, propF: t < 0.5 ? a.propF : b.propF,
    armStretch: l(a.armStretch ?? 1, b.armStretch ?? 1), armsBehindHead: t < 0.5 ? a.armsBehindHead : b.armsBehindHead,
  };
};

export const Phone: React.FC<{ x: number; y: number; r?: number; s?: number; glow?: boolean }> = ({ x, y, r = 0, s = 1, glow = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-20} y={-34} width={40} height={68} rx={7} fill="#20222A" stroke={INK} strokeWidth={4} />
    <rect x={-15} y={-28} width={30} height={54} rx={3} fill={glow ? "#7FD4FF" : "#2A3040"} />
  </g>
);

const Hand: React.FC<{ p: Pt; kind?: "fist" | "thumb" | "open"; ang: number; back?: boolean }> = ({ p, kind = "fist", ang, back }) => {
  const col = back ? C.skinShade : C.skin;
  return (
    <g transform={`translate(${p[0]} ${p[1]}) rotate(${-ang})`}>
      {kind === "open" && <ellipse cx={0} cy={10} rx={14} ry={22} fill={col} stroke={INK} strokeWidth={5} />}
      {kind !== "open" && <circle cx={0} cy={4} r={18} fill={col} stroke={INK} strokeWidth={5} />}
      {kind === "thumb" && <rect x={-7} y={-26} width={14} height={26} rx={7} fill={col} stroke={INK} strokeWidth={4} transform="rotate(180 0 -6)" />}
    </g>
  );
};

export const TheoPuppet: React.FC<{
  x: number; y: number; s?: number; rot?: number; flip?: boolean;
  pose: TheoPose; expr: Expr; frame: number; lookX?: number; lookY?: number; talk?: number; glassesY?: number; wind?: number; eyesClosed?: boolean;
}> = ({ x, y, s = 1, rot = 0, flip = false, pose, expr, frame, lookX = 6, lookY = 4, talk, glassesY, wind, eyesClosed }) => {
  const P = { ...DEFAULT, ...pose };
  const breathe = Math.sin(frame * 0.12) * 2.5;
  // legs (not affected by lean)
  const hipF: Pt = [14, -6], hipB: Pt = [-14, -6];
  const kneeF = fk(hipF, P.legF[0], THIGH), footF = fk(kneeF, P.legF[0] + P.legF[1], SHIN);
  const kneeB = fk(hipB, P.legB[0], THIGH), footB = fk(kneeB, P.legB[0] + P.legB[1], SHIN);
  // arms in torso space
  const shF: Pt = [22, -172 + breathe * 0.4], shB: Pt = [-14, -170 + breathe * 0.4];
  const k = pose.armStretch ?? 1;
  const elF = fk(shF, P.armF[0], UPPER * k), haF = fk(elF, P.armF[0] + P.armF[1], FORE * k);
  const elB = fk(shB, P.armB[0], UPPER * k), haB = fk(elB, P.armB[0] + P.armB[1], FORE * k);
  const path3 = (a: Pt, b: Pt, c: Pt) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;
  const shoe = (f: Pt, deg: number) => (
    <g transform={`translate(${f[0]} ${f[1]}) rotate(${-deg * 0.6})`}>
      <ellipse cx={16} cy={6} rx={34} ry={15} fill="#FFFFFF" stroke={INK} strokeWidth={SW} />
    </g>
  );
  const prop = (h: Pt, ang: number) => {
    if (P.propF === "phone") return <Phone x={h[0] + 18} y={h[1] - 6} r={-ang * 0.3 - 10} s={0.9} />;
    if (P.propF === "marker") return <rect x={h[0] + 8} y={h[1] - 34} width={12} height={44} rx={4} fill="#5E7FB8" stroke={INK} strokeWidth={4} transform={`rotate(${30} ${h[0]} ${h[1]})`} />;
    if (P.propF === "sheet") return <g transform={`translate(${h[0] + 14} ${h[1] - 40}) rotate(8)`}><rect x={0} y={0} width={86} height={112} fill="#FFFFFF" stroke={INK} strokeWidth={4} />{[20, 36, 52, 68, 84].map((ly) => <line key={ly} x1={12} y1={ly} x2={72} y2={ly} stroke="#9AA3B5" strokeWidth={3} />)}</g>;
    return null;
  };
  const frontArm = (
    <g>
      <Limb d={path3(shF, elF, haF)} color={C.hoodie} w={44} />
      {prop(haF, P.armF[0] + P.armF[1])}
      <Hand p={haF} kind={P.handF} ang={P.armF[0] + P.armF[1]} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
      {/* back leg + back arm */}
      <Limb d={path3(hipB, kneeB, footB)} color="#3C3F48" w={46} />
      {shoe(footB, P.legB[0] + P.legB[1])}
      <g transform={`rotate(${P.lean} 0 0)`}>
        <Limb d={path3(shB, elB, haB)} color={C.hoodieShade} w={40} />
        <Hand p={haB} ang={P.armB[0] + P.armB[1]} back />
      </g>
      {/* front leg */}
      <Limb d={path3(hipF, kneeF, footF)} color={C.pants} w={48} />
      {shoe(footF, P.legF[0] + P.legF[1])}
      <g transform={`rotate(${P.lean} 0 0)`}>
        {/* torso: oversized hoodie */}
        <path d={`M-60,6 C-70,-70 -60,${-150 + breathe} -40,${-186 + breathe} C-10,${-200 + breathe} 30,${-200 + breathe} 48,${-184 + breathe} C66,-140 66,-60 58,6 Z`} fill={C.hoodie} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M-58,-4 L56,-4" stroke={C.hoodieShade} strokeWidth={8} />
        <path d="M-20,-60 Q8,-52 36,-60" fill="none" stroke={C.hoodieShade} strokeWidth={6} />
        <path d="M14,-176 L10,-130 M26,-176 L24,-134" stroke={INK} strokeWidth={3} />
        <ellipse cx={2} cy={-186 + breathe} rx={50} ry={26} fill={C.hoodieShade} stroke={INK} strokeWidth={SW} />
        {pose.armsBehindHead && frontArm}
        {/* head (approved art, unchanged): art center (985,425) -> neck + offset */}
        <g transform={`translate(${12 + P.headDX} ${-278 + P.headDY + breathe}) rotate(${P.headTilt}) translate(-985 -425)`}>
          <Head expr={expr} frame={frame} lookX={lookX} lookY={lookY} talk={talk} glassesY={glassesY} wind={wind} eyesClosed={eyesClosed} />
        </g>
        {!pose.armsBehindHead && frontArm}
      </g>
    </g>
  );
};

// Back-of-head / over-the-shoulder Theo (shot 14). Origin = head center. Facing away, slightly to the right.
export const TheoBackHead: React.FC<{ x: number; y: number; s?: number; frame: number }> = ({ x, y, s = 1, frame }) => {
  const bounce = Math.sin(frame * 0.25) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* shoulders + hood */}
      <path d="M-190,260 C-180,170 -120,120 0,118 C120,120 180,170 196,260 Z" fill={C.hoodie} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx={0} cy={112} rx={98} ry={40} fill={C.hoodieShade} stroke={INK} strokeWidth={SW} />
      <circle cx={0} cy={0} r={108} fill={C.skin} stroke={INK} strokeWidth={SW} />
      <circle cx={100} cy={14} r={20} fill={C.skin} stroke={INK} strokeWidth={SW} />
      <line x1={104} y1={2} x2={150} y2={-6} stroke={INK} strokeWidth={5} />
      <path d={`M-104,30 C-120,-80 -50,${-112 + bounce} 10,-110 C80,-106 118,-50 98,10 C70,30 40,56 0,58 C-40,58 -80,50 -104,30 Z`} fill={C.hair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-40,20 Q0,40 40,22" fill="none" stroke="#3A2416" strokeWidth={5} />
      <path d={`M-6,-106 C0,${-140 + bounce} 22,${-150 + bounce} 34,${-162 + bounce} C26,${-136 + bounce} 16,-120 10,-108`} fill={C.hair} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};

// Close-up insert hand (the only new detailed drawing of Theo's body). Facing right, palm down.
// Origin = palm center. grip: point (index out), pinch (thumb+index meet), flat, curl.
export const InsertHand: React.FC<{ x: number; y: number; s?: number; r?: number; grip: "point" | "pinch" | "flat" | "curl"; press?: number; frame?: number }> = ({ x, y, s = 1, r = 0, grip, press = 0 }) => {
  const fingers: [number, number, number][] = [[-34, 104, 26], [-11, 116, 27], [12, 110, 26], [33, 88, 23]]; // y, len, width
  const lenFor = (i: number, len: number) => (grip === "flat" ? len : grip === "point" ? (i === 1 ? len : 42) : grip === "pinch" ? (i === 1 ? 92 : 46) : 44);
  const capsule = (y0: number, len: number, w: number, drop: number, key: number) => {
    const d = `M48,${y0} Q${48 + len * 0.6},${y0 + drop * 0.3} ${48 + len},${y0 + drop}`;
    return (
      <g key={key}>
        <path d={d} fill="none" stroke={INK} strokeWidth={w + 10} strokeLinecap="round" />
        <path d={d} fill="none" stroke={C.skin} strokeWidth={w} strokeLinecap="round" />
      </g>
    );
  };
  const thumbEnd: Pt = grip === "pinch" ? [146, -18] : grip === "curl" || grip === "point" ? [78, -24] : [96, -78];
  return (
    <g transform={`translate(${x} ${y + press * 10}) rotate(${r}) scale(${s})`}>
      {/* sleeve cuff */}
      <rect x={-200} y={-66} width={140} height={132} rx={22} fill={C.hoodie} stroke={INK} strokeWidth={SW} />
      {[-170, -145, -120, -95].map((cx) => <line key={cx} x1={cx} y1={-60} x2={cx} y2={60} stroke={C.hoodieShade} strokeWidth={5} />)}
      {/* fingers behind palm, back to front */}
      {[3, 2, 0].map((i) => capsule(fingers[i][0], lenFor(i, fingers[i][1]), fingers[i][2], grip === "flat" ? 6 : grip === "point" ? 26 : 30, i))}
      <ellipse cx={0} cy={0} rx={78} ry={58} fill={C.skin} stroke={INK} strokeWidth={SW} />
      {capsule(fingers[1][0], lenFor(1, fingers[1][1]), fingers[1][2], grip === "point" ? 14 + press * 10 : grip === "pinch" ? -4 : 28, 1)}
      <path d="M-10,-30 Q20,-26 40,-34" fill="none" stroke={C.skinShade} strokeWidth={5} strokeLinecap="round" />
      <path d={`M10,-46 Q60,-70 ${thumbEnd[0]},${thumbEnd[1]}`} fill="none" stroke={INK} strokeWidth={36} strokeLinecap="round" />
      <path d={`M10,-46 Q60,-70 ${thumbEnd[0]},${thumbEnd[1]}`} fill="none" stroke={C.skin} strokeWidth={26} strokeLinecap="round" />
    </g>
  );
};
