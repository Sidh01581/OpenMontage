import React from "react";
import { C, INK, SW, Head, Limb, Clock, Expr, Pt } from "../later/art";

// WE NEED TO TALK. — vertical (1080x1920) art. Pure SVG, no Remotion imports.
// Reuses LATER.'s approved Head / Limb / Clock / palette unchanged (../later/art).
// New here: vertical camera, office set, seated Theo with head turn + lanyard,
// Priya (boss) and What-If (the overthinking creature). Same 6 px outline, flat cel color.

export const W = 1080;
export const H = 1920;

export const P = {
  // office
  officeWall: "#EFE4CB",
  officeWallShade: "#E0D2B2",
  carpet: "#71908C",
  partition: "#5FA59C",
  partitionShade: "#4E8C84",
  trim: "#C9CED6",
  deskTop: "#DADDE3",
  deskEdge: "#B8BDC7",
  metal: "#8A919E",
  // Priya
  pSkin: "#C68A62",
  pSkinShade: "#A86F4C",
  pHair: "#1E1A24",
  pHairHi: "#3A3446",
  blazer: "#2E9C94",
  blazerShade: "#237A74",
  shirt: "#F4EEE2",
  // What-If
  wViolet: "#9B5CFF",
  wVioletDeep: "#2B1260",
  wVioletLight: "#CDB2FF",
  wTeal: "#4FE6D6",
  // lanyard
  lanyard: "#3A6FD8",
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
export const ease = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
// deterministic hash noise in [0,1)
export const rnd = (n: number) => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

// ---------------------------------------------------------------- frame + camera
export const VFrame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={W} height={H} fill={bg} />
    {children}
  </svg>
);

// Same contract as LATER's Camera (room-space center + zoom), re-centered for 9:16.
export const VCamera: React.FC<{ cx: number; cy: number; zoom: number; shakeX?: number; shakeY?: number; rot?: number; children: React.ReactNode }> =
  ({ cx, cy, zoom, shakeX = 0, shakeY = 0, rot = 0, children }) => (
    <g transform={`translate(${W / 2 + shakeX} ${H / 2 + shakeY}) rotate(${rot}) scale(${zoom}) translate(${-cx} ${-cy})`}>{children}</g>
  );

export const VVignette: React.FC<{ id: string; strength?: number; color?: string }> = ({ id, strength = 0.45, color = "#000" }) => (
  <g>
    <defs>
      <radialGradient id={id} cx={W / 2} cy={H / 2} r={1150} gradientUnits="userSpaceOnUse">
        <stop offset="0.5" stopColor={color} stopOpacity={0} />
        <stop offset="1" stopColor={color} stopOpacity={strength} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </g>
);

// ---------------------------------------------------------------- office set (room space, around Theo's seat)
export const OfficeBack: React.FC<{ frame: number; clockH: number; clockM: number; sky?: "dusk" | "day" }> = ({ frame, clockH, clockM, sky = "dusk" }) => {
  const dusk = sky === "dusk";
  return (
    <g>
      <rect x={-600} y={-900} width={3200} height={1760} fill={P.officeWall} />
      <rect x={-600} y={700} width={3200} height={160} fill={P.officeWallShade} />
      <line x1={-600} y1={700} x2={2600} y2={700} stroke={INK} strokeWidth={4} opacity={0.5} />
      <rect x={-600} y={860} width={3200} height={700} fill={P.carpet} />
      <line x1={-600} y1={860} x2={2600} y2={860} stroke={INK} strokeWidth={SW} />
      {/* window, upper left */}
      <g>
        <rect x={560} y={-140} width={340} height={390} fill={dusk ? "#F6C08A" : "#BFE3F2"} />
        {dusk && <rect x={560} y={110} width={340} height={140} fill="#E89A78" opacity={0.6} />}
        <circle cx={dusk ? 640 : 820} cy={dusk ? 170 : -40} r={36} fill={dusk ? "#FFE3A6" : "#FFF6D8"} />
        <path d="M560,250 L560,150 L610,150 L610,110 L660,110 L660,170 L720,170 L720,80 L770,80 L770,140 L830,140 L830,120 L900,120 L900,250 Z" fill={dusk ? "#9A6F7E" : "#8FB3C2"} />
        {[0, 1, 2].map((i) => <rect key={i} x={735 + i * 0} y={100 + i * 22} width={10} height={10} fill="#FFE3A6" opacity={dusk ? 0.9 : 0} />)}
        <rect x={560} y={-140} width={340} height={390} fill="none" stroke={P.shirt} strokeWidth={18} />
        <rect x={560} y={-140} width={340} height={390} fill="none" stroke={INK} strokeWidth={SW} />
        <line x1={730} y1={-140} x2={730} y2={250} stroke={P.shirt} strokeWidth={12} />
        <rect x={540} y={250} width={380} height={20} rx={4} fill={P.shirt} stroke={INK} strokeWidth={SW} />
        {/* blinds pulled up */}
        <rect x={556} y={-150} width={348} height={40} fill="#E6DCC6" stroke={INK} strokeWidth={4} />
      </g>
      {/* wall clock, left of Theo at head height */}
      <Clock x={760} y={430} r={46} h={clockH} m={clockM} />
      {/* small plant on the sill */}
      <path d="M600,250 L606,212 L640,212 L646,250 Z" fill="#C0566A" stroke={INK} strokeWidth={4} />
      {[-30, -8, 14, 34].map((a, i) => (
        <path key={i} d={`M623,214 Q${623 + a * 0.6},${180 - i * 4} ${623 + a},${160 + Math.sin(frame * 0.08 + i) * 2}`} fill="none" stroke="#5E9E5A" strokeWidth={7} strokeLinecap="round" />
      ))}
    </g>
  );
};

// Cubicle partition behind the desk (right side). Priya leans on its top cap (y = 288).
export const PARTITION_TOP = 288;
export const Partition: React.FC = () => (
  <g>
    <rect x={1070} y={PARTITION_TOP} width={760} height={330} fill={P.partition} stroke={INK} strokeWidth={SW} />
    {[1150, 1260, 1370, 1480, 1590, 1700].map((x) => <line key={x} x1={x} y1={PARTITION_TOP + 20} x2={x} y2={600} stroke={P.partitionShade} strokeWidth={4} />)}
    {/* sticky notes + a photo pinned */}
    <rect x={1205} y={330} width={44} height={44} fill="#FFE27A" stroke={INK} strokeWidth={3} transform="rotate(-6 1227 352)" />
    <rect x={1258} y={344} width={44} height={44} fill="#FF9FB8" stroke={INK} strokeWidth={3} transform="rotate(5 1280 366)" />
    <rect x={1390} y={326} width={70} height={56} fill="#F4EEE2" stroke={INK} strokeWidth={3} />
    <circle cx={1425} cy={352} r={14} fill={C.cat} stroke={INK} strokeWidth={3} />
    <rect x={1062} y={PARTITION_TOP - 14} width={776} height={22} rx={6} fill={P.trim} stroke={INK} strokeWidth={SW} />
  </g>
);

export const OfficeDesk: React.FC<{ frame: number; shake?: number; bag?: boolean }> = ({ frame, shake = 0, bag = true }) => {
  const j = (k: number) => Math.sin(frame * 3.1 + k) * shake;
  return (
    <g>
      <rect x={1030} y={612} width={22} height={250} fill={P.metal} stroke={INK} strokeWidth={SW} />
      <rect x={1590} y={612} width={22} height={250} fill={P.metal} stroke={INK} strokeWidth={SW} />
      <g transform={`translate(${j(0)} ${j(1) * 0.6})`}>
        <rect x={1000} y={592} width={640} height={26} rx={5} fill={P.deskTop} stroke={INK} strokeWidth={SW} />
        <rect x={1006} y={612} width={628} height={8} fill={P.deskEdge} />
        {/* monitor, side profile facing Theo */}
        <rect x={1330} y={572} width={80} height={14} rx={5} fill={P.metal} stroke={INK} strokeWidth={5} />
        <rect x={1362} y={500} width={14} height={80} fill={P.metal} stroke={INK} strokeWidth={5} />
        <path d="M1338,360 L1372,354 L1380,548 L1346,552 Z" fill="#3A3F4A" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M1340,364 L1346,550" stroke="#CFE3FF" strokeWidth={5} strokeLinecap="round" />
        {/* mug + pens */}
        <g transform={`translate(${j(2) * 1.4} ${-Math.abs(j(3)) * 1.2})`}>
          <rect x={1440} y={538} width={44} height={54} rx={6} fill="#F4EEE2" stroke={INK} strokeWidth={5} />
          <path d="M1484,550 q20,4 0,26" fill="none" stroke={INK} strokeWidth={5} />
          <rect x={1500} y={540} width={40} height={52} fill="#6FA8A0" stroke={INK} strokeWidth={5} />
          {[1508, 1518, 1528].map((x, i) => <line key={x} x1={x} y1={540} x2={x + (i - 1) * 6} y2={500 + i * 6} stroke={["#C0566A", "#5E7FB8", INK][i]} strokeWidth={6} strokeLinecap="round" />)}
        </g>
        {bag && <Backpack x={1215} y={592} frame={frame} />}
      </g>
    </g>
  );
};

// Theo's half-packed bag on the desk (origin = bottom center).
export const Backpack: React.FC<{ x: number; y: number; frame: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    {/* stuff sticking out */}
    <rect x={-30} y={-150} width={22} height={70} rx={8} fill="#7FD4FF" stroke={INK} strokeWidth={4} transform="rotate(-10 -19 -115)" />
    <rect x={0} y={-140} width={56} height={60} fill="#F4EEE2" stroke={INK} strokeWidth={4} transform="rotate(12 28 -110)" />
    <path d="M-70,0 C-78,-60 -70,-110 -40,-118 L48,-118 C76,-110 82,-60 76,0 Z" fill="#3C4F7A" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M-52,-118 C-54,-140 54,-140 52,-118" fill="none" stroke={INK} strokeWidth={6} />
    <rect x={-46} y={-60} width={92} height={46} rx={10} fill="#33446B" stroke={INK} strokeWidth={4} />
    <path d="M-60,-118 L60,-118" stroke="#C9CED6" strokeWidth={4} strokeDasharray="6 6" />
  </g>
);

// ---------------------------------------------------------------- Theo, seated (extends LATER's TheoUpper "type" pose)
// Same torso/arm geometry as TheoUpper; adds a head turn about the neck, the blue work lanyard,
// extra sweat, a hand tremble, and the morning variants (inside-out hoodie, wild hair via Head wind).
export const TheoSeated: React.FC<{
  expr: Expr; frame: number; lookX?: number; lookY?: number; talk?: number; glassesY?: number; wind?: number; eyesClosed?: boolean;
  headRot?: number; typeSpeed?: number; lanyard?: boolean; sweat?: number; tremble?: number; insideOut?: boolean; grip?: number; headOverlay?: React.ReactNode;
}> = ({ expr, frame, lookX = 6, lookY = 4, talk, glassesY, wind, eyesClosed, headRot = 0, typeSpeed = 0, lanyard = true, sweat = 0, tremble = 0, insideOut = false, grip = 0, headOverlay }) => {
  const breathe = Math.sin(frame * 0.12) * 3;
  const k1 = Math.sin(frame * typeSpeed) * 7 * (typeSpeed > 0 ? 1 : 0);
  const k2 = Math.sin(frame * typeSpeed + 2.1) * 7 * (typeSpeed > 0 ? 1 : 0);
  const tx = Math.sin(frame * 2.3) * tremble, ty = Math.cos(frame * 2.9) * tremble * 0.6;
  const hood = insideOut ? "#D9C59A" : C.hoodie;
  const hoodShade = insideOut ? "#BFA978" : C.hoodieShade;
  // grip: hands pull back to the desk edge and clench (0..1)
  const hx = lerp(0, -40, grip), hy = lerp(0, 6, grip);
  return (
    <g transform={`translate(${tx} ${breathe * 0.4 + ty})`}>
      <Limb d={`M940,545 L1030,630 L${1150 + hx},${592 + k2 + hy}`} color={hoodShade} w={40} />
      <circle cx={1156 + hx} cy={592 + k2 + hy} r={17} fill={C.skinShade} stroke={INK} strokeWidth={5} />
      <path d={`M840,712 C826,620 850,${535 + breathe} 905,${505 + breathe} C952,${490 + breathe} 992,515 1004,562 C1014,620 966,690 944,712 Z`} fill={hood} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M930,600 C950,640 952,680 944,708" fill="none" stroke={hoodShade} strokeWidth={6} />
      {insideOut ? (
        // seams on the outside + a dangling tag: the hoodie is on inside-out
        <g>
          <path d="M872,560 C880,620 884,670 880,708" fill="none" stroke={INK} strokeWidth={3} strokeDasharray="8 6" />
          <path d="M960,540 C974,600 970,660 960,706" fill="none" stroke={INK} strokeWidth={3} strokeDasharray="8 6" />
          <rect x={880} y={522} width={26} height={30} fill="#F4EEE2" stroke={INK} strokeWidth={3} transform={`rotate(${8 + Math.sin(frame * 0.2) * 6} 893 522)`} />
        </g>
      ) : (
        <path d="M965,560 L960,620" stroke={INK} strokeWidth={3} />
      )}
      <ellipse cx={898} cy={505 + breathe} rx={48} ry={28} fill={hoodShade} stroke={INK} strokeWidth={SW} />
      {lanyard && (() => {
        const sway = Math.sin(frame * 0.15) * 3;
        const bx = 918 + sway, by = 612;
        return (
          <g>
            <path d={`M872,${512 + breathe} Q884,580 ${bx - 8},${by - 30}`} fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" />
            <path d={`M872,${512 + breathe} Q884,580 ${bx - 8},${by - 30}`} fill="none" stroke={P.lanyard} strokeWidth={6} strokeLinecap="round" />
            <path d={`M928,${514 + breathe} Q924,570 ${bx + 8},${by - 30}`} fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" />
            <path d={`M928,${514 + breathe} Q924,570 ${bx + 8},${by - 30}`} fill="none" stroke={P.lanyard} strokeWidth={6} strokeLinecap="round" />
            <g transform={`rotate(${sway * 1.5} ${bx} ${by - 30})`}>
              <rect x={bx - 22} y={by - 32} width={44} height={56} rx={5} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
              <rect x={bx - 22} y={by - 32} width={44} height={14} rx={4} fill={P.lanyard} stroke={INK} strokeWidth={4} />
              <circle cx={bx} cy={by + 2} r={8} fill={C.skinShade} />
              <line x1={bx - 12} y1={by + 16} x2={bx + 12} y2={by + 16} stroke={INK} strokeWidth={3} />
            </g>
          </g>
        );
      })()}
      <g transform={`translate(0 ${breathe}) rotate(${headRot} 905 520)`}>
        <Head expr={expr} frame={frame} lookX={lookX} lookY={lookY} talk={talk} glassesY={glassesY} wind={wind} eyesClosed={eyesClosed} />
        {sweat > 0 && <Sweat frame={frame} n={sweat} />}
        {headOverlay}
      </g>
      <Limb d={`M970,548 L1050,632 L${1190 + hx},${588 + k1 + hy}`} color={hood} w={44} />
      <circle cx={1196 + hx} cy={588 + k1 + hy} r={19} fill={C.skin} stroke={INK} strokeWidth={5} />
      {grip > 0.5 && <path d={`M${1182 + hx},${580 + hy} q10,-6 22,0`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />}
    </g>
  );
};

// Sweat drops sliding down Theo's head (head-local room coords).
export const Sweat: React.FC<{ frame: number; n: number }> = ({ frame, n }) => {
  const spots: Pt[] = [[905, 360], [1080, 372], [948, 330], [1092, 430], [890, 420]];
  return (
    <g>
      {spots.slice(0, n).map(([x, y], i) => {
        const ph = ((frame + i * 9) % 26) / 26;
        const yy = y + ph * 40;
        return <path key={i} d={`M${x},${yy} q-8,14 0,20 q8,-6 0,-20 Z`} fill="#9FD3F0" stroke={INK} strokeWidth={3} opacity={1 - ph * 0.6} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- Priya (boss)
// Local space: origin = head center, head radius ~104 (Theo's is 108). Faces screen LEFT (toward Theo).
export type PriyaExpr = "flat" | "neutral" | "smile" | "lookup";

export const PriyaHead: React.FC<{ expr: PriyaExpr; frame: number; talk?: number; lookX?: number; lookY?: number }> = ({ expr, frame, talk = 0, lookX = -6, lookY = 2 }) => {
  const fx = -14; // features shifted toward screen left (3/4 view)
  const blink = expr !== "smile" && (frame + 19) % 90 < 4;
  const eyes: [number, number][] = [[fx - 36, 10], [fx + 30, 10]];
  const talking = talk > 0.05;
  const hairBack = "M-122,96 L-126,-6 C-126,-112 -62,-146 2,-146 C72,-146 128,-106 126,-6 L122,96 Q100,106 78,98 L-78,98 Q-100,106 -122,96 Z";
  return (
    <g>
      <path d={hairBack} fill={P.pHair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={100} ry={106} fill={P.pSkin} stroke={INK} strokeWidth={SW} />
      {/* eyes */}
      {eyes.map(([x, y], i) => {
        if (expr === "smile") return <path key={i} d={`M${x - 22},${y + 6} Q${x},${y - 18} ${x + 22},${y + 6}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />;
        if (blink) return <path key={i} d={`M${x - 22},${y} Q${x},${y + 9} ${x + 22},${y}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
        const rx = i === 0 ? 23 : 20, ry = i === 0 ? 27 : 25;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
            <circle cx={x + lookX} cy={y + lookY} r={8} fill={INK} />
            <circle cx={x + lookX - 3} cy={y + lookY - 3} r={2.6} fill="#FFFFFF" />
            {expr === "flat" && (
              // heavy upper lid: unreadable, slightly scary
              <g>
                <path d={`M${x - rx - 3},${y - ry - 3} L${x + rx + 3},${y - ry - 3} L${x + rx + 3},${y - ry * 0.15} L${x - rx - 3},${y - ry * 0.15} Z`} fill={P.pSkin} />
                <line x1={x - rx} y1={y - ry * 0.15} x2={x + rx} y2={y - ry * 0.15} stroke={INK} strokeWidth={5} strokeLinecap="round" />
              </g>
            )}
          </g>
        );
      })}
      {/* rectangular glasses */}
      <rect x={fx - 66} y={-20} width={60} height={56} rx={10} fill="#BFE0FF" fillOpacity={0.12} stroke={INK} strokeWidth={6} />
      <rect x={fx + 2} y={-20} width={56} height={54} rx={10} fill="#BFE0FF" fillOpacity={0.12} stroke={INK} strokeWidth={6} />
      <line x1={fx - 6} y1={-4} x2={fx + 2} y2={-4} stroke={INK} strokeWidth={5} />
      <line x1={fx + 58} y1={-4} x2={98} y2={-10} stroke={INK} strokeWidth={5} />
      {/* brows */}
      {expr === "smile"
        ? [[-62, -34, -24, -42], [6, -42, 40, -34]].map(([a, b, c, d], i) => <path key={i} d={`M${fx + a},${b} Q${fx + (a + c) / 2},${Math.min(b, d) - 8} ${fx + c},${d}`} fill="none" stroke={P.pHair} strokeWidth={7} strokeLinecap="round" />)
        : [[-62, -34, -24, -34], [6, -34, 40, -34]].map(([a, b, c, d], i) => <line key={i} x1={fx + a} y1={b} x2={fx + c} y2={d} stroke={P.pHair} strokeWidth={7} strokeLinecap="round" />)}
      {/* nose */}
      <path d={`M${fx - 4},34 Q${fx - 14},50 ${fx - 2},54`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {/* mouth */}
      {expr === "smile" ? (
        <g>
          <path d={`M${fx - 56},62 Q${fx - 2},${70} ${fx + 48},60 Q${fx + 36},${118} ${fx - 6},${118} Q${fx - 50},${112} ${fx - 56},62 Z`} fill="#5A1E24" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M${fx - 50},66 Q${fx - 2},${74} ${fx + 42},64 L${fx + 40},76 Q${fx - 2},84 ${fx - 48},78 Z`} fill="#FFFFFF" />
          <ellipse cx={fx - 4} cy={104} rx={22} ry={9} fill="#E07F8E" />
          <ellipse cx={fx - 74} cy={52} rx={16} ry={9} fill="#E0605A" opacity={0.35} />
          <ellipse cx={fx + 62} cy={50} rx={13} ry={8} fill="#E0605A" opacity={0.35} />
        </g>
      ) : talking ? (
        <ellipse cx={fx - 4} cy={74} rx={15 - talk * 3} ry={3 + talk * 12} fill="#5A1E24" stroke={INK} strokeWidth={4} />
      ) : (
        <path d={`M${fx - 24},74 L${fx + 16},74`} fill="none" stroke="#6A2A30" strokeWidth={6} strokeLinecap="round" />
      )}
      {/* blunt fringe + side curtains of the bob (front) */}
      <path d={`M-104,-36 C-112,-118 -50,-138 6,-138 C72,-138 114,-104 104,-36 L72,-46 L36,-38 L0,-46 L-36,-38 L-70,-46 Z`} fill={P.pHair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-104,-40 L-90,-40 C-88,10 -88,56 -84,98 L-122,96 C-124,40 -122,0 -104,-40 Z" fill={P.pHair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M104,-40 L92,-40 C92,10 92,56 88,98 L122,96 C124,40 122,0 104,-40 Z" fill={P.pHair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-40,-118 Q10,-128 60,-110" fill="none" stroke={P.pHairHi} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};

export const Mug: React.FC<{ x: number; y: number; s?: number; frame: number; steam?: boolean }> = ({ x, y, s = 1, frame, steam = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {steam && [0, 1].map((i) => {
      const ph = ((frame * 0.8 + i * 18) % 36) / 36;
      return <path key={i} d={`M${-8 + i * 16},${-50 - ph * 40} q-8,-10 0,-20 q8,-10 0,-20`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.7 * (1 - ph)} />;
    })}
    <path d="M26,-30 q26,4 0,30" fill="none" stroke={INK} strokeWidth={12} />
    <path d="M26,-30 q26,4 0,30" fill="none" stroke="#F4EEE2" strokeWidth={5} />
    <rect x={-28} y={-48} width={56} height={60} rx={8} fill="#F4EEE2" stroke={INK} strokeWidth={5} />
    <text x={0} y={-10} textAnchor="middle" fontSize={20} fontWeight={700} fontFamily="'Helvetica Neue', Arial, sans-serif" fill={P.blazer}>#1</text>
  </g>
);

// Priya bust. origin = head center. arms: "ledge" = forearms folded on a ledge at local y = ledgeY (partition cap),
// "desk" = hands down on a laptop (shot 14), "none" = cropped.
export const Priya: React.FC<{
  x: number; y: number; s?: number; frame: number; expr: PriyaExpr; talk?: number; lookX?: number; lookY?: number;
  headTilt?: number; arms?: "ledge" | "desk" | "none"; ledgeY?: number; mug?: boolean; behind?: React.ReactNode;
  part?: "all" | "body" | "arms"; // body = torso+head (draw behind a ledge), arms = ledge arms only (draw in front)
}> = ({ x, y, s = 1, frame, expr, talk = 0, lookX, lookY, headTilt = 0, arms = "none", ledgeY = 120, mug = true, behind, part = "all" }) => {
  const showBody = part !== "arms", showArms = part !== "body";
  const breathe = Math.sin(frame * 0.1) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {showBody && <g transform={`translate(0 ${breathe * 0.5})`}>
        <rect x={-24} y={86} width={46} height={60} fill={P.pSkinShade} stroke={INK} strokeWidth={SW} />
        <path d="M-160,330 C-162,200 -120,140 -40,128 L40,128 C120,140 162,200 160,330 Z" fill={P.blazer} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M-34,128 L0,196 L34,128 Z" fill={P.shirt} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-40,128 L-6,206 L-30,236 L-70,150 Z" fill={P.blazerShade} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M40,128 L6,206 L30,236 L70,150 Z" fill={P.blazerShade} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      </g>}
      {showBody && behind}
      {showBody && <g transform={`rotate(${headTilt} 0 110) translate(0 ${breathe})`}>
        <PriyaHead expr={expr} frame={frame} talk={talk} lookX={lookX} lookY={lookY} />
      </g>}
      {showArms && arms === "ledge" && (
        <g>
          <Limb d={`M140,${ledgeY - 6} L-40,${ledgeY + 4}`} color={P.blazerShade} w={46} />
          <Limb d={`M-150,${ledgeY + 2} L30,${ledgeY + 8}`} color={P.blazer} w={48} />
          <circle cx={36} cy={ledgeY + 6} r={20} fill={P.pSkin} stroke={INK} strokeWidth={5} />
          {mug && <Mug x={-186} y={ledgeY - 6} frame={frame} />}
          <circle cx={-152} cy={ledgeY - 8} r={20} fill={P.pSkin} stroke={INK} strokeWidth={5} />
        </g>
      )}
      {showArms && arms === "desk" && (
        <g>
          <Limb d="M-120,220 L-150,330 L-70,380" color={P.blazerShade} w={44} />
          <Limb d="M120,220 L150,330 L60,384" color={P.blazer} w={46} />
          <circle cx={-64} cy={382} r={19} fill={P.pSkinShade} stroke={INK} strokeWidth={5} />
          <circle cx={54} cy={386} r={20} fill={P.pSkin} stroke={INK} strokeWidth={5} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- What-If (the overthinking creature)
// A tangled ball of scribbled pencil lines, one huge spiral eye, tiny mouth. Electric violet + teal rim.
// Local radius 100; s = scale. Lines "boil" (redrawn every 3 frames) and the whole body buzzes.
export type WhatIfMood = "curious" | "smug" | "spooky" | "tiny";

const scribblePath = (seed: number, loops: number, rMin: number, rMax: number) => {
  let a = rnd(seed) * Math.PI * 2;
  const pts: Pt[] = [];
  for (let i = 0; i < loops; i++) {
    a += 0.7 + rnd(seed + i * 3.1) * 1.1;
    const r = 100 * (rMin + (rMax - rMin) * rnd(seed + i * 7.7));
    pts.push([Math.cos(a) * r, Math.sin(a) * r * 0.94]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};

export const WhatIf: React.FC<{
  x: number; y: number; s: number; frame: number; mood?: WhatIfMood; mouth?: number; spin?: number;
  squash?: number; // >1 stretched tall, <1 squashed
  lineBoost?: number; // thicker lines when tiny on screen
  rot?: number; opacity?: number; seed?: number;
}> = ({ x, y, s, frame, mood = "curious", mouth = 0, spin = 1, squash = 1, lineBoost = 1, rot = 0, opacity = 1, seed = 0 }) => {
  const boil = Math.floor(frame / 3);
  const bx = Math.sin(frame * 5.1) * 1.6, by = Math.cos(frame * 4.3) * 1.6;
  const lw = 7 * lineBoost;
  const strokes = [0, 1, 2, 3, 4, 5].map((j) => scribblePath(seed * 101 + j * 97 + boil * 13, 12, j < 2 ? 0.55 : 0.35, 1.04));
  const spiralRot = frame * 0.32 * spin;
  let sp = "";
  for (let i = 0; i <= 90; i++) {
    const th = (i / 90) * Math.PI * 5;
    const r = 2 + 6.4 * th;
    sp += `${i === 0 ? "M" : "L"}${(Math.cos(th + spiralRot) * r).toFixed(1)},${(Math.sin(th + spiralRot) * r).toFixed(1)} `;
  }
  const eyeRY = mood === "smug" ? 30 : 44;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s / Math.sqrt(squash)} ${s * squash}) translate(${bx} ${by})`} opacity={opacity}>
      {/* teal rim light, upper-left */}
      <circle cx={-12} cy={-12} r={104} fill="none" stroke={P.wTeal} strokeWidth={16 * lineBoost} opacity={0.28} />
      <circle cx={0} cy={0} r={86} fill={P.wVioletDeep} stroke={INK} strokeWidth={SW * lineBoost} />
      {strokes.map((d, j) => (
        <path key={j} d={d} fill="none" stroke={j === 5 ? P.wVioletLight : P.wViolet} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
      ))}
      {/* teal rim scribbles */}
      <path d={`M-92,${-10 + (boil % 3)} Q-90,-70 -40,-92 M-80,-40 Q-60,-80 -10,-90`} fill="none" stroke={P.wTeal} strokeWidth={lw * 0.9} strokeLinecap="round" />
      {/* eye */}
      <ellipse cx={6} cy={-10} rx={44} ry={eyeRY} fill="#FFFFFF" stroke={INK} strokeWidth={SW * lineBoost} />
      <g transform={`translate(6 -10) scale(1 ${eyeRY / 44})`}>
        <path d={sp} fill="none" stroke={INK} strokeWidth={4.5 * lineBoost} strokeLinecap="round" />
        <circle cx={0} cy={0} r={5 * lineBoost} fill={INK} />
      </g>
      {mood === "smug" && <path d="M-40,-44 L52,-30" stroke={INK} strokeWidth={8 * lineBoost} strokeLinecap="round" />}
      {/* tiny mouth */}
      {mouth > 0.05
        ? <ellipse cx={8} cy={56} rx={9} ry={3 + mouth * 11} fill="#1A0A2E" stroke={INK} strokeWidth={3.5 * lineBoost} />
        : mood === "smug"
          ? <path d="M-4,56 q12,8 24,-2" fill="none" stroke={INK} strokeWidth={4.5 * lineBoost} strokeLinecap="round" />
          : <path d="M0,56 q4,-4 8,0 q4,4 8,0" fill="none" stroke={INK} strokeWidth={4 * lineBoost} strokeLinecap="round" />}
    </g>
  );
};

// ---------------------------------------------------------------- Theo variants (overlays on the unchanged Head, head-local room coords)
// Morning: extra wild tufts around the approved hair silhouette.
export const MessyHair: React.FC<{ frame: number }> = ({ frame }) => {
  const b = Math.sin(frame * 0.3) * 3;
  const tufts = [
    `M884,400 C860,380 850,350 866,330 C872,352 884,366 896,372 Z`,
    `M912,330 C900,296 906,262 930,246 C928,276 936,300 948,312 Z`,
    `M960,300 C960,262 976,${240 + b} 1000,${232 + b} C990,262 988,284 990,300 Z`,
    `M1050,308 C1068,284 1092,${276 + b} 1110,${284 + b} C1092,296 1082,314 1078,330 Z`,
    `M1086,356 C1110,350 1126,362 1130,380 C1112,374 1098,376 1090,384 Z`,
  ];
  return <g>{tufts.map((d, i) => <path key={i} d={d} fill={C.hair} stroke={INK} strokeWidth={5} strokeLinejoin="round" />)}</g>;
};

// Dream: grey beard + grey streaks (job fair).
export const GreyBeard: React.FC = () => (
  <g>
    <path d="M906,452 C904,520 950,572 1000,574 C1052,574 1088,530 1090,470 C1074,500 1060,506 1048,500 C1036,516 1012,518 1000,504 C980,512 956,500 944,486 C930,486 916,474 906,452 Z"
      fill="#C9C4BC" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M1000,512 Q1016,536 1006,556 M960,500 Q962,530 950,548 M1048,508 Q1056,528 1050,546" fill="none" stroke="#9E988F" strokeWidth={4} strokeLinecap="round" />
    <path d="M1016,486 Q1034,480 1054,486" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
  </g>
);

// Mochi props for the job dream (Mochi "sit" pose local coords: head center at (-10,-132)).
export const MochiHardHat: React.FC = () => (
  <g>
    <path d="M-58,-160 C-58,-210 38,-210 38,-160 Z" fill="#F2C230" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-70} y={-164} width={120} height={14} rx={6} fill="#F2C230" stroke={INK} strokeWidth={5} />
    <rect x={-16} y={-206} width={12} height={44} rx={4} fill="#D9A81E" stroke={INK} strokeWidth={3} />
  </g>
);
export const Brick: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-46} y={-20} width={92} height={40} rx={4} fill="#C2553E" stroke={INK} strokeWidth={5} />
    <path d="M-46,0 L46,0 M-10,-20 L-10,0 M20,0 L20,20" stroke="#8E3A2A" strokeWidth={4} />
  </g>
);

// ---------------------------------------------------------------- What-If: ceiling storm + balloon pop
// Storm: a wide churning cloud of scribbles with dozens of tiny spiral eyes and one big one.
// Local: centered at (0,0), spans ~ +-rx, +-ry room px.
export const WhatIfStorm: React.FC<{ x: number; y: number; rx: number; ry: number; frame: number; eyes?: number; flicker?: number }> = ({ x, y, rx, ry, frame, eyes = 30, flicker = 0 }) => {
  const boil = Math.floor(frame / 2);
  const strokes = Array.from({ length: 16 }).map((_, j) => {
    const sp = scribblePath(500 + j * 31 + boil * 7, 14, 0.2, 1.0);
    return <path key={j} d={sp} fill="none" stroke={j % 5 === 0 ? P.wVioletLight : j % 4 === 0 ? P.wTeal : P.wViolet} strokeWidth={9} strokeLinecap="round"
      transform={`translate(${(rnd(j * 3.3) - 0.5) * rx * 1.2} ${(rnd(j * 5.1) - 0.5) * ry * 0.9}) scale(${rx / 260} ${ry / 260})`} opacity={0.95} />;
  });
  const eyeEls = Array.from({ length: eyes }).map((_, i) => {
    const ex = (rnd(i * 9.7 + 1) - 0.5) * rx * 1.7, ey = (rnd(i * 4.3 + 2) - 0.5) * ry * 1.5;
    const r = 10 + rnd(i * 2.2) * 16;
    const blink = (frame + i * 7) % 50 < 3;
    let sp = "";
    for (let k = 0; k <= 30; k++) { const th = (k / 30) * Math.PI * 4; const rr = 1 + (r * 0.85 / (Math.PI * 4)) * th; sp += `${k ? "L" : "M"}${(Math.cos(th + frame * 0.4 + i) * rr).toFixed(1)},${(Math.sin(th + frame * 0.4 + i) * rr).toFixed(1)} `; }
    return (
      <g key={i} transform={`translate(${ex} ${ey})`}>
        {blink ? <line x1={-r} y1={0} x2={r} y2={0} stroke={INK} strokeWidth={4} /> : (
          <g><ellipse cx={0} cy={0} rx={r} ry={r * 1.05} fill="#FFFFFF" stroke={INK} strokeWidth={4} /><path d={sp} fill="none" stroke={INK} strokeWidth={2.5} /></g>
        )}
      </g>
    );
  });
  const shake = Math.sin(frame * 4.7) * 4;
  return (
    <g transform={`translate(${x + shake} ${y})`}>
      <ellipse cx={0} cy={0} rx={rx * 1.04} ry={ry * 1.04} fill="none" stroke={P.wTeal} strokeWidth={24} opacity={0.25 + flicker * 0.2} />
      <ellipse cx={0} cy={0} rx={rx * 0.92} ry={ry * 0.9} fill={P.wVioletDeep} stroke={INK} strokeWidth={SW} />
      {strokes}
      {eyeEls}
      <WhatIf x={0} y={ry * 0.15} s={Math.min(rx, ry) / 260} frame={frame} mood="spooky" spin={2} />
    </g>
  );
};

// Pop: p 0..1. 0-0.15 swell, then the ball bursts into flying violet scribbles that fade.
export const WhatIfPop: React.FC<{ x: number; y: number; s: number; frame: number; p: number }> = ({ x, y, s, frame, p }) => {
  if (p < 0.15) return <WhatIf x={x} y={y} s={s * (1 + p * 2.2)} frame={frame} mood="curious" squash={1 + p} />;
  const q = (p - 0.15) / 0.85;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - q * q}>
      {Array.from({ length: 14 }).map((_, j) => {
        const a = (j / 14) * Math.PI * 2 + rnd(j) * 0.4;
        const d = 40 + q * (260 + rnd(j * 3) * 160);
        const fall = q * q * 160;
        return <path key={j} d={scribblePath(900 + j * 17, 5, 0.1, 0.35)} fill="none" stroke={j % 3 === 0 ? P.wTeal : P.wViolet} strokeWidth={8} strokeLinecap="round"
          transform={`translate(${Math.cos(a) * d} ${Math.sin(a) * d + fall}) rotate(${q * 360 * (rnd(j) - 0.5)})`} />;
      })}
      {q < 0.35 && <circle cx={0} cy={0} r={110 + q * 200} fill="none" stroke="#FFFFFF" strokeWidth={14 * (1 - q / 0.35)} />}
    </g>
  );
};
