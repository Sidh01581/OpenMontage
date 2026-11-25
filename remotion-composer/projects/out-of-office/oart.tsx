import React from "react";
import { INK, SW, Limb, Pt } from "../later/art";
import { rnd } from "../we-need-to-talk/vart";
import { S, DevHead } from "../sure/sart";

// OUT OF OFFICE. — new art: beach set, Dev's vacation outfit + lounging rig, sunglasses, coconut, crab, VACATION meter.
// Same 6 px INK outline, flat cel color and Dev construction as BUSY.

export const O = {
  sky: "#9FDDF2", skyHi: "#E6F7FC", sun: "#FFE07A",
  sea: "#3DB6C8", seaDeep: "#2A8FB0", foam: "#F4FBFF",
  sand: "#F2D59B", sandShade: "#E3BF7A",
  shirt: "#FF8A5C", shirtShade: "#E06A3E", flower: "#FFE27A",
  shorts: "#2EB5A8", shortsShade: "#23968B",
  glasses: "#1C1F28",
  coco: "#8B5E3C", cocoLight: "#F4EEE2",
  chairA: "#FF6B6B", chairB: "#FFFFFF", wood: "#C9955E",
  tag: "#1C2A33", tagSun: "#FFC93C", tagRed: "#FF6B6B", tagGreen: "#5BE37A",
};
const font = "'Helvetica Neue', Arial, sans-serif";
const rad = (d: number) => (d * Math.PI) / 180;
const rot = (p: Pt, deg: number): Pt => [p[0] * Math.cos(rad(deg)) - p[1] * Math.sin(rad(deg)), p[0] * Math.sin(rad(deg)) + p[1] * Math.cos(rad(deg))];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpP = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const ik = (s: Pt, h: Pt, a: number, b: number, bend = 1): Pt => {
  const dx = h[0] - s[0], dy = h[1] - s[1];
  const d = Math.min(a + b - 0.01, Math.max(Math.abs(a - b) + 0.01, Math.hypot(dx, dy)));
  const ang = Math.atan2(dy, dx);
  const k = Math.acos((a * a + d * d - b * b) / (2 * a * d));
  return [s[0] + Math.cos(ang + bend * k) * a, s[1] + Math.sin(ang + bend * k) * a];
};
const p3 = (a: Pt, b: Pt, c: Pt) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;

// ---------------------------------------------------------------- props
export const Coconut: React.FC<{ s?: number; r?: number }> = ({ s = 1, r = 0 }) => (
  <g transform={`rotate(${r}) scale(${s})`}>
    <path d="M14,-70 L40,-150" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <path d="M14,-70 L40,-150" stroke="#FF6B9A" strokeWidth={5} strokeLinecap="round" />
    <path d="M-30,-118 L30,-150 L8,-96 Z" fill={O.flower} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <line x1={0} y1={-118} x2={16} y2={-80} stroke={INK} strokeWidth={4} />
    <circle cx={0} cy={0} r={52} fill={O.coco} stroke={INK} strokeWidth={SW} />
    <ellipse cx={0} cy={-38} rx={40} ry={14} fill={O.cocoLight} stroke={INK} strokeWidth={4} />
    <path d="M-30,10 q10,10 20,0 M8,26 q10,10 20,0" fill="none" stroke="#6B4630" strokeWidth={4} strokeLinecap="round" />
  </g>
);

// Sunglasses in DevHead-local coords (same `turn` as the head). lower = 0..1 slides them down the nose.
export const Shades: React.FC<{ turn: number; lower?: number; reflect?: boolean }> = ({ turn, lower = 0, reflect = true }) => {
  // Perspective follows the head turn: near lens (left, toward camera) full width; far lens narrower, tucked toward the
  // face edge; the arm runs back to the ear. Lenses sit on the eyes at x+turn.
  const fx = turn, dy = lower * 34;
  const near = { x: -30 + fx, y: 8, rx: 31, ry: 32 };
  const far = { x: 40 + fx, y: 6, rx: 23, ry: 30 };
  return (
    <g transform={`translate(0 ${dy})`}>
      <path d={`M-92,0 L${near.x - near.rx},${-6}`} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      {[near, far].map((l, i) => (
        <g key={i}>
          <rect x={l.x - l.rx} y={l.y - l.ry} width={l.rx * 2} height={l.ry * 2} rx={14} fill={O.glasses} stroke={INK} strokeWidth={5} />
          {reflect && <path d={`M${l.x - l.rx + 7},${l.y - l.ry + 10} L${l.x + l.rx - 7},${l.y - l.ry + 10}`} stroke={O.sea} strokeWidth={7} strokeLinecap="round" opacity={0.8} />}
          {reflect && i === 0 && <path d={`M${l.x - l.rx + 9},${l.y - 2} L${l.x - l.rx + 20},${l.y - l.ry + 18}`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.7} />}
        </g>
      ))}
      <path d={`M${near.x + near.rx},${-2} Q${(near.x + near.rx + far.x - far.rx) / 2},-10 ${far.x - far.rx},-2`} fill="none" stroke={INK} strokeWidth={6} />
    </g>
  );
};

// Hawaiian shirt torso (same silhouette as Dev's sweater torso). id = unique clip id.
export const ShirtTorso: React.FC<{ id: string }> = ({ id }) => {
  const d = "M-50,14 C-62,-60 -60,-150 -44,-196 C-20,-214 30,-214 54,-196 C70,-150 70,-60 58,14 Z";
  return (
    <g>
      <defs><clipPath id={id}><path d={d} /></clipPath></defs>
      <path d={d} fill={O.shirt} />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: 9 }).map((_, i) => {
          const x = -50 + (i % 3) * 48 + (Math.floor(i / 3) % 2) * 20, y = -180 + Math.floor(i / 3) * 66;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${i * 37})`}>
              {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-10} rx={6} ry={11} fill={i % 2 ? O.flower : "#FFFFFF"} transform={`rotate(${a})`} />)}
              <circle r={4} fill={O.shirtShade} />
            </g>
          );
        })}
        <path d="M8,-200 L8,14" stroke={O.shirtShade} strokeWidth={5} />
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-30,-204 L6,-168 L-6,-206 Z M40,-204 L10,-168 L22,-206 Z" fill={O.shirt} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

// Bare foot + flip-flop, side view, toes forward (+x). wiggle = toe wiggle phase.
const Foot: React.FC<{ p: Pt; wiggle?: number; shade?: boolean }> = ({ p, wiggle = 0, shade }) => (
  <g transform={`translate(${p[0]} ${p[1]}) rotate(-62)`}>
    <path d="M-18,14 L54,14" stroke={O.shorts} strokeWidth={8} strokeLinecap="round" />
    <path d="M-16,-10 Q-20,10 -8,12 L40,12 Q52,8 48,-2 Q30,-8 10,-14 Z" fill={shade ? S.devSkinShade : S.devSkin} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => <circle key={i} cx={44 + i * 3} cy={-4 + i * 5 - Math.max(0, Math.sin(wiggle + i)) * 6} r={6} fill={shade ? S.devSkinShade : S.devSkin} stroke={INK} strokeWidth={3} />)}
  </g>
);

// ---------------------------------------------------------------- Dev lounging in a beach chair (side view, faces RIGHT)
// Local origin = hip on the chair; ground at y = 110. Head ends up around (-231, -219).
export type LoungeArm = "rest" | "sip" | "toast" | "phone" | "laptop" | "behind";
export const DevLounge: React.FC<{
  x: number; y: number; s?: number; frame: number; id: string;
  arm?: LoungeArm; k?: number; // k = 0..1 progress of the front-arm move
  talk?: number; lookX?: number; lookY?: number; turn?: number; serious?: boolean; smile?: boolean; shades?: number | false; // shades = lower amount, false = off
  backArm?: "behind" | "rest"; wiggle?: number; sitUp?: number; holding?: React.ReactNode; typeSpeed?: number;
}> = ({ x, y, s = 1, frame, id, arm = "rest", k = 0, talk = 0, lookX = 16, lookY = 0, turn = 36, serious = false, smile = true, shades = 0, backArm = "behind", wiggle = 0, sitUp = 0, holding, typeSpeed = 0 }) => {
  const jit = (k: number) => (typeSpeed > 0 ? Math.sin(frame * typeSpeed + k) * 7 : 0);
  const lean = lerp(-40, -18, sitUp);
  const tr = (p: Pt): Pt => rot(p, lean);
  const shF = tr([30, -168]), shB = tr([-18, -172]);
  // Head sits upright ON the neck (not out along the reclined back): neck top + straight up.
  const neck = tr([8, -214]);
  const head: Pt = [neck[0] + 12, neck[1] - 110];
  const headRot = lean * 0.12;
  const mouth: Pt = [head[0] + 60, head[1] + 70];
  const rest: Pt = [-10, -70];
  const target: Record<LoungeArm, Pt> = {
    rest, sip: [head[0] + 104, head[1] + 150], toast: [head[0] + 200, head[1] - 70],
    laptop: [118 + jit(0), -84 + jit(1.3)], phone: [head[0] + 150, head[1] + 120], behind: [head[0] - 40, head[1] - 40],
  };
  const hF = lerpP(rest, target[arm], k);
  const hB: Pt = backArm === "behind" ? [head[0] - 50, head[1] - 30] : arm === "laptop" ? [38 + jit(2.1), -62 + jit(0.7)] : [-46, 26];
  const elF = ik(shF, hF, 82, 78, arm === "toast" ? -1 : 1), elB = ik(shB, hB, 82, 78, backArm === "behind" ? -1 : 1);
  const kneeF: Pt = [110, -34], ankF: Pt = [214, 6], kneeB: Pt = [104, 6], ankB: Pt = [206, 22];
  const breathe = Math.sin(frame * 0.08) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* chair frame + striped fabric */}
      <path d="M-170,-200 L-40,90 M150,30 L190,110 M-40,90 L-60,110 M-170,-200 L-200,110" stroke={O.wood} strokeWidth={12} strokeLinecap="round" />
      <path d="M-170,-200 L-40,90 M150,30 L190,110 M-40,90 L-60,110 M-170,-200 L-200,110" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
      <path d="M-190,-210 L-150,-220 L-20,40 L200,40 L200,64 L-40,70 Z" fill={O.chairB} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-175 + i * 32 * 0.45},${-205 + i * 64} L${-140 + i * 32 * 0.45},${-214 + i * 64}`} stroke={O.chairA} strokeWidth={22} />)}
      <path d="M-10,48 L200,48" stroke={O.chairA} strokeWidth={14} />
      {/* back arm (behind head) */}
      {/* far arm: always behind the body (side view) */}
      {<><Limb d={`M${shB[0]},${shB[1]} L${elB[0]},${elB[1]}`} color={O.shirtShade} w={42} /><Limb d={`M${elB[0]},${elB[1]} L${hB[0]},${hB[1]}`} color={S.devSkinShade} w={34} /><circle cx={hB[0]} cy={hB[1]} r={17} fill={S.devSkinShade} stroke={INK} strokeWidth={5} /></>}
      {/* back leg */}
      <Limb d={`M-6,4 L${kneeB[0]},${kneeB[1]}`} color={O.shortsShade} w={50} />
      <Limb d={`M${kneeB[0]},${kneeB[1]} L${ankB[0]},${ankB[1]}`} color={S.devSkinShade} w={34} />
      <Foot p={ankB} wiggle={wiggle + 1.3} shade />
      {/* neck first, so it comes up out of the shirt collar (user note) */}
      <path d={`M${neck[0] - 4},${neck[1] + 40} L${head[0] - 6},${head[1] + 70}`} stroke={INK} strokeWidth={46} strokeLinecap="round" />
      <path d={`M${neck[0] - 4},${neck[1] + 40} L${head[0] - 6},${head[1] + 70}`} stroke={S.devSkinShade} strokeWidth={34} strokeLinecap="round" />
      {/* torso + head */}
      <g transform={`translate(0 ${breathe}) rotate(${lean} 0 0)`}>
        <ShirtTorso id={`${id}-shirt`} />
      </g>
      <g transform={`translate(${head[0]} ${head[1] + breathe}) rotate(${headRot} 0 100)`}>
        <DevHead frame={frame} talk={talk} lookX={lookX} lookY={lookY} serious={serious} smile={smile} turn={turn} />
        {shades !== false && <Shades turn={turn} lower={shades} />}
      </g>
            {/* front leg: knee up */}
      <Limb d={`M10,0 L${kneeF[0]},${kneeF[1]}`} color={O.shorts} w={52} />
      <Limb d={`M${kneeF[0]},${kneeF[1]} L${ankF[0]},${ankF[1]}`} color={S.devSkin} w={36} />
      <Foot p={ankF} wiggle={wiggle} />
      {holding}
      {/* front arm + coconut */}
      <Limb d={`M${shF[0]},${shF[1]} L${elF[0]},${elF[1]}`} color={O.shirt} w={46} />
      <Limb d={`M${elF[0]},${elF[1]} L${hF[0]},${hF[1]}`} color={S.devSkin} w={36} />
      {(arm === "rest" || arm === "sip" || arm === "toast") && (
        <g transform={`translate(${hF[0] + 10} ${hF[1] - 20})`}><Coconut s={0.55} r={arm === "sip" ? -10 - 60 * k : arm === "toast" ? 10 : -10} /></g>
      )}
      {arm === "phone" && k > 0.5 && (
        <g transform={`translate(${hF[0] + 4} ${hF[1] - 46}) rotate(${-18})`}>
          <rect x={-26} y={-52} width={52} height={100} rx={10} fill="#20222A" stroke={INK} strokeWidth={5} />
          <rect x={-20} y={-44} width={10} height={84} rx={4} fill="#3A3F4A" />
        </g>
      )}
      <circle cx={hF[0]} cy={hF[1]} r={19} fill={S.devSkin} stroke={INK} strokeWidth={5} />
    </g>
  );
};

// ---------------------------------------------------------------- crab
export const Crab: React.FC<{ x: number; y: number; s?: number; frame: number; wave?: number }> = ({ x, y, s = 1, frame, wave = 0 }) => {
  const legs = Math.sin(frame * 1.2) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, 1].map((side) => [0, 1, 2].map((i) => (
        <path key={`${side}${i}`} d={`M${side * 30},${4 + i * 8} L${side * (54 + i * 4)},${18 + i * 10 + (i % 2 ? legs : -legs)}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      )))}
      <g transform={`rotate(${-wave * 30} -40 -10)`}>
        <path d="M-40,-10 L-60,-40" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M-60,-40 m-16,0 a16,14 0 1,1 32,0 l-16,-4 Z" fill="#E8503A" stroke={INK} strokeWidth={4} />
      </g>
      <path d="M40,-10 L60,-40" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M60,-40 m-16,0 a16,14 0 1,1 32,0 l-16,-4 Z" fill="#E8503A" stroke={INK} strokeWidth={4} />
      <ellipse cx={0} cy={6} rx={40} ry={26} fill="#E8503A" stroke={INK} strokeWidth={SW} />
      {[-12, 12].map((ex) => <g key={ex}><line x1={ex} y1={-14} x2={ex} y2={-34} stroke={INK} strokeWidth={4} /><circle cx={ex} cy={-36} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={3} /><circle cx={ex + 1} cy={-36} r={3} fill={INK} /></g>)}
      <path d="M-10,14 Q0,20 10,14" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

// ---------------------------------------------------------------- beach (frame space 1080x1920 with bleed)
export const HORIZON = 900, SHORE = 1180;
export const Palm: React.FC<{ x: number; y: number; s?: number; frame: number }> = ({ x, y, s = 1, frame }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0,0 C20,-200 -10,-420 60,-620" fill="none" stroke={INK} strokeWidth={50} strokeLinecap="round" />
    <path d="M0,0 C20,-200 -10,-420 60,-620" fill="none" stroke="#B07E4A" strokeWidth={38} strokeLinecap="round" />
    {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${-14 + i * 10},${-80 - i * 80} l30,-10`} stroke="#8B5E3C" strokeWidth={6} />)}
    {[-150, -100, -40, 20, 80, 140].map((a, i) => (
      <g key={i} transform={`translate(60 -620) rotate(${a + Math.sin(frame * 0.05 + i) * 4})`}>
        <path d="M0,0 Q120,-60 250,10 Q130,-10 0,0 Z" fill="#4E9A4A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M10,0 Q120,-36 240,8" fill="none" stroke="#6DBA5E" strokeWidth={6} />
      </g>
    ))}
    {[[50, -600], [80, -590], [64, -575]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={20} fill={O.coco} stroke={INK} strokeWidth={4} />)}
  </g>
);
export const Umbrella: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={0} y1={0} x2={30} y2={-620} stroke={INK} strokeWidth={14} strokeLinecap="round" />
    <line x1={0} y1={0} x2={30} y2={-620} stroke="#E6E8EC" strokeWidth={7} strokeLinecap="round" />
    <path d="M-300,-560 Q30,-760 360,-560 Z" fill={O.chairB} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    {[-1, 1].map((k) => <path key={k} d={`M30,-680 Q${30 + k * 80},-640 ${30 + k * 170},-570 L${30 + k * 100},-568 Q${30 + k * 50},-630 30,-680 Z`} fill={O.chairA} stroke={INK} strokeWidth={4} />)}
    <path d="M-300,-560 Q-240,-530 -180,-560 Q-120,-530 -60,-560 Q0,-530 60,-560 Q120,-530 180,-560 Q240,-530 300,-560 Q330,-545 360,-560" fill="none" stroke={INK} strokeWidth={5} />
  </g>
);
export const BeachSet: React.FC<{ frame: number; pan?: number; tint?: number }> = ({ frame, pan = 0 }) => (
  <g>
    <defs>
      <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={O.sky} /><stop offset="1" stopColor={O.skyHi} /></linearGradient>
      <radialGradient id="bsun" cx={820 - pan * 0.2} cy={330} r={260} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFF6C8" stopOpacity={0.9} /><stop offset="1" stopColor="#FFF6C8" stopOpacity={0} /></radialGradient>
    </defs>
    <rect x={-600} y={-600} width={2400} height={HORIZON + 600} fill="url(#bsky)" />
    <rect x={-600} y={-600} width={2400} height={HORIZON + 600} fill="url(#bsun)" />
    <circle cx={820 - pan * 0.2} cy={330} r={90} fill={O.sun} stroke={INK} strokeWidth={SW} />
    {[0, 1].map((i) => <ellipse key={i} cx={((200 + i * 520 + frame * 0.6) % 1500) - 200 - pan * 0.3} cy={170 + i * 120} rx={110} ry={34} fill="#FFFFFF" stroke={INK} strokeWidth={5} />)}
    <rect x={-600} y={HORIZON} width={2400} height={SHORE - HORIZON} fill={O.sea} />
    <rect x={-600} y={HORIZON} width={2400} height={60} fill={O.seaDeep} />
    <line x1={-600} y1={HORIZON} x2={1800} y2={HORIZON} stroke={INK} strokeWidth={5} />
    {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 8 }).map((__, c) => {
      const xx = ((c * 220 + r * 90 + frame * (1.5 + r * 0.6)) % 1760) - 340 - pan * (0.4 + r * 0.1);
      const yy = HORIZON + 80 + r * 46;
      return <path key={`${r}-${c}`} d={`M${xx},${yy} q30,-14 60,0`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.7} />;
    }))}
    {/* shore foam rolls in and out */}
    {(() => { const w = Math.sin(frame * 0.07) * 26; return (
      <g>
        <path d={`M-600,${SHORE + w} ${Array.from({ length: 25 }).map((_, i) => `Q${-560 + i * 100},${SHORE + w + (i % 2 ? 18 : -10)} ${-500 + i * 100},${SHORE + w}`).join(" ")} L1900,${SHORE - 40} L-600,${SHORE - 40} Z`} fill={O.foam} stroke={INK} strokeWidth={4} />
      </g>
    ); })()}
    <rect x={-600} y={SHORE + 20} width={2400} height={1400} fill={O.sand} />
    <path d={`M-600,${SHORE + 20} L1900,${SHORE + 20}`} stroke={O.sandShade} strokeWidth={10} />
    {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={rnd(i * 3.3) * 1400 - 160 - pan} cy={SHORE + 60 + rnd(i * 7.1) * 700} r={4 + rnd(i) * 4} fill={O.sandShade} />)}
  </g>
);

// ---------------------------------------------------------------- the VACATION meter (BUSY. tag, beach edition), frame space top-left origin
export type TagMode = "vac" | "work" | "404";
export const VacationTag: React.FC<{ x: number; y: number; pct: number; mode?: TagMode; age: number; s?: number }> = ({ x, y, pct, mode = "vac", age, s = 1 }) => {
  if (age < 0) return null;
  const pop = age < 6 ? 0.6 + 0.4 * Math.min(1, age / 3) + 0.12 * Math.sin(Math.min(1, age / 6) * Math.PI) : 1;
  const W = 560, H = 196;
  const col = mode === "work" ? O.tagRed : pct > 50 ? O.tagGreen : pct > 15 ? O.tagSun : O.tagRed;
  return (
    <g transform={`translate(${x + W / 2} ${y + H / 2}) scale(${s * pop}) translate(${-W / 2} ${-H / 2})`}>
      <rect x={6} y={10} width={W} height={H} rx={34} fill="#000" opacity={0.35} />
      <rect width={W} height={H} rx={34} fill={O.tag} stroke={INK} strokeWidth={SW} />
      <rect x={18} y={16} width={98} height={36} rx={18} fill="#7FF0C2" />
      <text x={67} y={44} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={26} fill={O.tag}>DEV</text>
      <circle cx={150} cy={34} r={14} fill={O.tagSun} />
      {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={150 + Math.cos(i * 0.785) * 18} y1={34 + Math.sin(i * 0.785) * 18} x2={150 + Math.cos(i * 0.785) * 24} y2={34 + Math.sin(i * 0.785) * 24} stroke={O.tagSun} strokeWidth={4} strokeLinecap="round" />)}
      <rect x={186} y={20} width={350} height={28} rx={14} fill="#33424D" />
      {mode !== "404" && <rect x={186} y={20} width={350 * Math.max(0, Math.min(1, pct / 100))} height={28} rx={14} fill={col} />}
      <line x1={22} y1={80} x2={W - 22} y2={80} stroke="#FFFFFF" strokeWidth={3} opacity={0.25} />
      {mode === "vac" && <><text x={30} y={150} fontFamily={font} fontWeight={900} fontSize={54} fill="#FFFFFF" letterSpacing={-1}>VACATION:</text>
        <text x={W - 30} y={152} textAnchor="end" fontFamily={font} fontWeight={900} fontSize={66} fill={col}>{Math.round(pct)}%</text></>}
      {mode === "work" && <text x={W / 2} y={152} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={60} fill={O.tagRed} letterSpacing={-1}>WORK MODE: ON</text>}
      {mode === "404" && <><text x={30} y={150} fontFamily={font} fontWeight={900} fontSize={54} fill="#FFFFFF" letterSpacing={-1}>VACATION:</text>
        <text x={W - 30} y={152} textAnchor="end" fontFamily={font} fontWeight={900} fontSize={66} fill={O.tagRed}>404</text></>}
    </g>
  );
};
