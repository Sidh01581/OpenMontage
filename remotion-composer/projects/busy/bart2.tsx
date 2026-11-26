import React from "react";
import { C, INK, SW, Limb, Pt, Mochi } from "../later/art";
import { P, rnd } from "../we-need-to-talk/vart";
import { S, DevHead } from "../sure/sart";
import { B, CoffeeCup, PaperStack } from "./bart";

// BUSY. — art for scenes 2–5: Dev at his desk (typing / snapped upright / slumped / phone / selfie), wristwatch,
// coworker heads, monitor window cascade, cat-video feed, Employee of the Month frame. Same outline + palette.

const font = "'Helvetica Neue', Arial, sans-serif";
const rad = (d: number) => (d * Math.PI) / 180;
const rot = (p: Pt, deg: number): Pt => [p[0] * Math.cos(rad(deg)) - p[1] * Math.sin(rad(deg)), p[0] * Math.sin(rad(deg)) + p[1] * Math.cos(rad(deg))];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpP = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

// 2-bone IK: elbow for shoulder s -> hand h with bone lengths a, b. bend = +1 / -1 picks the elbow side.
export const ik = (s: Pt, h: Pt, a: number, b: number, bend = 1): Pt => {
  const dx = h[0] - s[0], dy = h[1] - s[1];
  const d = Math.min(a + b - 0.01, Math.max(Math.abs(a - b) + 0.01, Math.hypot(dx, dy)));
  const ang = Math.atan2(dy, dx);
  const k = Math.acos((a * a + d * d - b * b) / (2 * a * d));
  return [s[0] + Math.cos(ang + bend * k) * a, s[1] + Math.sin(ang + bend * k) * a];
};
const p3 = (a: Pt, b: Pt, c: Pt) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;

// Wristwatch (origin = wrist center, r ~ 22). big = CU face with hands.
export const Watch: React.FC<{ r?: number; ang?: number; h?: number; m?: number }> = ({ r = 22, ang = 0, h = 9, m = 2 }) => (
  <g transform={`rotate(${ang})`}>
    <rect x={-r * 0.55} y={-r * 1.7} width={r * 1.1} height={r * 3.4} rx={r * 0.3} fill="#3A2E28" stroke={INK} strokeWidth={4} />
    <circle r={r} fill="#E8E2D2" stroke={INK} strokeWidth={5} />
    <circle r={r * 0.78} fill="#FFFFFF" />
    <line x1={0} y1={0} x2={Math.cos(rad((h % 12) * 30 - 90)) * r * 0.45} y2={Math.sin(rad((h % 12) * 30 - 90)) * r * 0.45} stroke={INK} strokeWidth={Math.max(2, r * 0.12)} strokeLinecap="round" />
    <line x1={0} y1={0} x2={Math.cos(rad(m * 6 - 90)) * r * 0.65} y2={Math.sin(rad(m * 6 - 90)) * r * 0.65} stroke={INK} strokeWidth={Math.max(1.5, r * 0.07)} strokeLinecap="round" />
    <circle r={r * 0.08} fill="#C0392B" />
  </g>
);

// ---------------------------------------------------------------- Dev seated at his desk (side view, faces screen RIGHT)
// Local origin = hip center on the chair. Desk top at y = -40, keyboard x 130..230, monitor at x ~ 360 (screen faces Dev).
export type DevDeskPose = "type" | "upright" | "slump" | "phone" | "knuckles" | "facedown";
export const DevSeated: React.FC<{
  x: number; y: number; s?: number; frame: number; pose: DevDeskPose; typeSpeed?: number; talk?: number;
  lookX?: number; lookY?: number; serious?: boolean; sweat?: number; turn?: number; headTilt?: number; sip?: number; glow?: number;
  screen?: React.ReactNode; coffeeOnDesk?: boolean; crack?: number; deskless?: boolean;
  down?: number; // facedown only: 0 = sitting (type pose) .. 1 = head down on the desk beside the keyboard, arms limp
  natural?: boolean; // opt-in (PASSWORD NIGHTMARE. on): flexible short neck bending toward the screen, relaxed shoulders, bent elbows
}> = ({ x, y, s = 1, frame, pose, typeSpeed = 0, talk = 0, lookX = 16, lookY = 4, serious = true, sweat = 0, turn = 30, headTilt = 0, sip = 0, glow = 0, screen, coffeeOnDesk = true, crack = 0, deskless = false, down = 1, natural = false }) => {
  const fd = pose === "facedown" ? Math.max(0, Math.min(1, down)) : 0;
  const lean0 = pose === "upright" ? -4 : pose === "slump" || pose === "phone" ? -20 : 8;
  const nat = natural && (pose === "type" || pose === "upright" || pose === "knuckles");
  const lean = pose === "facedown" ? lerp(8, 40, fd) : nat ? (pose === "upright" ? 10 : 16) : lean0;
  const sink0 = pose === "slump" || pose === "phone" ? 26 : pose === "upright" ? -14 : 0;
  const sink = sink0 + 20 * fd;
  const tr = (p: Pt): Pt => { const q = rot(p, lean); return [q[0], q[1] + sink]; };
  const shF = tr(nat ? [26, -188] : [26, -196]), shB = tr(nat ? [-18, -186] : [-18, -194]);
  const jit = (k: number) => (typeSpeed > 0 ? Math.sin(frame * typeSpeed + k) * 8 : 0);
  let hF: Pt = [196, -58 + jit(0)], hB: Pt = [146, -56 + jit(2.1)];
  if (pose === "upright") { hF = [204, -60 + jit(0) * 1.4]; hB = [152, -58 + jit(2.1) * 1.4]; }
  if (pose === "knuckles") { const c = Math.sin(crack * Math.PI); hF = [120 + c * 10, -150 - c * 10]; hB = [110, -146]; }
  if (pose === "slump") { hF = lerpP([70, -110 + sink], [52, -250 + sink], sip); hB = [10, -70 + sink]; }
  if (pose === "phone") { hF = [96, -170 + sink]; hB = [70, -150 + sink]; }
  if (pose === "facedown") { hF = lerpP(hF, [196, 36], fd); hB = lerpP(hB, [156, 28], fd); }
  if (nat && pose !== "knuckles") { const k = pose === "upright" ? 1.4 : 1; hF = [140, -48 + jit(0) * k]; hB = [116, -46 + jit(2.1) * k]; }
  const elF = ik(shF, hF, 82, 78, 1), elB = ik(shB, hB, 82, 78, 1);
  const headP = tr([8, -318]);
  // facedown: the head hinges at the neck and comes to rest face-down on the desk (crown toward the monitor)
  const neckP = lerpP([headP[0], headP[1] + 100], tr([8, -222]), fd);
  const headRot = lerp(lean * 0.5 + headTilt, 95, fd);
  // natural: a short flexible neck rises out of the collar and bends forward toward the screen; the head hangs off its top
  const nBase = tr([8, -192]), nTop = tr([20, -252]), nCtl = tr([10, -232]);
  const nTilt = lean * 0.4 + 6 + headTilt;
  const bx = -40 * fd; // facedown: the chair rolls back a little so his head lands beside the keyboard, clear of the monitor
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`translate(${bx} 0)`}>
      {/* chair */}
      <rect x={-96} y={-170 + sink * 0.3} width={40} height={190} rx={16} fill={C.chair} stroke={INK} strokeWidth={SW} transform={`rotate(${lean * 0.6} -76 20)`} />
      <rect x={-80} y={14} width={150} height={30} rx={12} fill={C.chair} stroke={INK} strokeWidth={SW} />
      <rect x={-10} y={44} width={18} height={110} fill={P.metal} stroke={INK} strokeWidth={5} />
      <path d="M-70,160 L80,160" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      {/* back arm */}
      <Limb d={p3(shB, elB, hB)} color={S.sweaterShade} w={40} />
      <circle cx={hB[0]} cy={hB[1]} r={17} fill={S.devSkinShade} stroke={INK} strokeWidth={5} />
      {/* legs: thighs forward under the desk */}
      <Limb d={`M-6,${8 + sink * 0.3} L${110 + sink},${20 + sink * 0.2} L${124 + sink * 1.4},150`} color={B.pantsShade} w={46} />
      <Limb d={`M10,${10 + sink * 0.3} L${126 + sink},${24 + sink * 0.2} L${142 + sink * 1.4},152`} color={B.pants} w={48} />
      <path d={`M${120 + sink * 1.4},146 L${176 + sink * 1.4},146 Q${190 + sink * 1.4},150 ${188 + sink * 1.4},160 L${118 + sink * 1.4},162 Z`} fill={B.shoe} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      {/* torso + head */}
      {nat && <Limb d={`M${nBase[0]},${nBase[1]} Q${nCtl[0]},${nCtl[1]} ${nTop[0]},${nTop[1]}`} color={S.devSkinShade} w={34} />}
      <g transform={`translate(0 ${sink}) rotate(${lean} 0 0)`}>
        <path d="M-50,14 C-62,-60 -60,-150 -44,-196 C-20,-214 30,-214 54,-196 C70,-150 70,-60 58,14 Z" fill={S.sweater} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => <path key={i} d={`M-46,${-150 + i * 44} L60,${-150 + i * 44}`} stroke={S.sweaterShade} strokeWidth={4} opacity={0.55} />)}
        {!nat && <rect x={-10} y={-228} width={36} height={36} fill={S.devSkinShade} stroke={INK} strokeWidth={SW} />}
        <path d="M-26,-204 Q8,-184 42,-204" fill="none" stroke={S.sweaterShade} strokeWidth={9} />
      </g>
      <g transform={nat ? `translate(${nTop[0]} ${nTop[1]}) rotate(${nTilt}) translate(0 -92)` : pose === "facedown" ? `translate(${neckP[0]} ${neckP[1]}) rotate(${headRot}) translate(0 -100)` : `translate(${headP[0]} ${headP[1]}) rotate(${lean * 0.5 + headTilt} 0 100)`}>
        <DevHead frame={frame} talk={talk} lookX={lookX} lookY={lookY} serious={serious} smile={!serious} turn={turn} closed={fd > 0.6} />
        {sweat > 0 && [[-70, -40], [86, -30], [-60, 20]].slice(0, sweat).map(([sx, sy], i) => {
          const ph = ((frame + i * 9) % 22) / 22;
          return <path key={i} d={`M${sx},${sy + ph * 40} q-8,14 0,20 q8,-6 0,-20 Z`} fill="#9FD3F0" stroke={INK} strokeWidth={3} opacity={1 - ph * 0.6} />;
        })}
      </g>
      </g>
      {/* desk, keyboard, monitor (screen faces Dev), coffee — skipped when deskless (the shot draws its own table) */}
      {!deskless && <>
      <rect x={60} y={-40} width={480} height={24} rx={5} fill={P.deskTop} stroke={INK} strokeWidth={SW} />
      <rect x={500} y={-16} width={20} height={170} fill={P.metal} stroke={INK} strokeWidth={SW} />
      <path d={`M120,-44 L240,-44 L236,-56 L124,-56 Z`} fill="#3A3F4A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {typeSpeed > 0.5 && [0, 1, 2].map((i) => <rect key={i} x={130 + ((frame * 23 + i * 31) % 100)} y={-64 - ((frame * 3 + i * 7) % 12)} width={10} height={8} fill="#E6E8EC" stroke={INK} strokeWidth={2} />)}
      <rect x={350} y={-60} width={70} height={14} rx={5} fill={P.metal} stroke={INK} strokeWidth={5} />
      <rect x={378} y={-130} width={14} height={76} fill={P.metal} stroke={INK} strokeWidth={5} />
      <path d="M352,-320 L392,-326 L398,-120 L358,-116 Z" fill="#3A3F4A" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M354,-316 L360,-120" stroke={glow > 0 ? "#BFE3FF" : "#CFE3FF"} strokeWidth={6} strokeLinecap="round" />
      {screen}
      {coffeeOnDesk && pose !== "slump" && pose !== "facedown" && <g transform="translate(280 -60)"><CoffeeCup frame={frame} s={0.62} steam={pose !== "upright"} /></g>}
      </>}
      <g transform={`translate(${bx} 0)`}>
      {/* front arm (over the desk) */}
      <Limb d={p3(shF, elF, hF)} color={S.sweater} w={44} />
      {pose === "slump" && <g transform={`translate(${hF[0] + 8} ${hF[1] - 6}) rotate(${-10 - sip * 25})`}><CoffeeCup frame={frame} s={0.7} /></g>}
      {pose === "phone" && (
        <g transform={`translate(${hF[0] + 14} ${hF[1] - 30}) rotate(-12)`}>
          <rect x={-10} y={-60} width={20} height={110} rx={6} fill="#20222A" stroke={INK} strokeWidth={5} />
          <ellipse cx={-30} cy={-6} rx={50} ry={70} fill="#BFE3FF" opacity={0.25} />
        </g>
      )}
      <circle cx={hF[0]} cy={hF[1]} r={19} fill={S.devSkin} stroke={INK} strokeWidth={5} />
      {pose === "knuckles" && crack > 0.4 && crack < 0.7 && <text x={hF[0] + 30} y={hF[1] - 40} fontFamily={font} fontWeight={900} fontSize={34} fill={INK}>CRACK</text>}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- Dev wrist CU for the watch check (frame space)
// Sweater forearm enters from the bottom-left; watch face fills the middle; t 0..1 = wrist snap up.
export const WatchCU: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const y = lerp(2300, 1180, t);
  const r = lerp(-30, -8, t);
  return (
    <g transform={`translate(560 ${y}) rotate(${r})`}>
      <Limb d="M-700,700 L-60,40" color={S.sweater} w={300} />
      <path d="M-200,170 L-40,10" stroke={S.sweaterShade} strokeWidth={28} strokeLinecap="round" />
      <path d="M-40,40 C-20,-60 70,-150 150,-170 C220,-190 290,-120 260,-40 C230,40 120,120 40,140 Z" fill={S.devSkin} stroke={INK} strokeWidth={SW} />
      <g transform="translate(70 -10)"><Watch r={120} ang={40} h={9} m={2 + frame * 0.02} /></g>
    </g>
  );
};

// ---------------------------------------------------------------- coworker head peeking over a partition (origin = head center)
const HAIR = ["#1E1A24", "#4A2E1E", "#8A8F9C", "#D8A44A"];
const SKIN = ["#C68A62", "#F2D0B0", "#8C5A3C", "#F6E7C8"];
export const Coworker: React.FC<{ x: number; y: number; s?: number; v: number; frame: number; nod?: number; look?: number }> = ({ x, y, s = 1, v, frame, nod = 0, look = 0 }) => {
  const hair = HAIR[v % 4], skin = SKIN[(v + 1) % 4];
  const blink = (frame + v * 17) % 70 < 4;
  return (
    <g transform={`translate(${x} ${y + nod * 12}) scale(${s}) rotate(${nod * 8})`}>
      {v % 2 === 0 && <ellipse cx={0} cy={-30} rx={96} ry={76} fill={hair} stroke={INK} strokeWidth={SW} />}
      <ellipse cx={0} cy={10} rx={84} ry={90} fill={skin} stroke={INK} strokeWidth={SW} />
      {v % 2 === 1 && <path d="M-84,-10 C-90,-110 90,-110 84,-10 C40,-60 -40,-60 -84,-10 Z" fill={hair} stroke={INK} strokeWidth={SW} />}
      {v % 2 === 0 && <path d="M-80,-20 C-60,-80 60,-80 80,-20 C30,-50 -30,-50 -80,-20 Z" fill={hair} stroke={INK} strokeWidth={5} />}
      {[-28, 30].map((ex, i) => blink
        ? <path key={i} d={`M${ex - 14},10 Q${ex},18 ${ex + 14},10`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        : <g key={i}><ellipse cx={ex} cy={8} rx={17} ry={20} fill="#FFFFFF" stroke={INK} strokeWidth={4} /><circle cx={ex + look * 8} cy={10} r={7} fill={INK} /></g>)}
      <path d="M-22,56 Q0,66 22,56" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

// ---------------------------------------------------------------- monitor screen: ten windows pop open (screen-local 0..900 x 0..620)
const WinSheet: React.FC = () => (
  <g>
    {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 5 }).map((__, c) => (
      <rect key={`${r}-${c}`} x={10 + c * 70} y={44 + r * 34} width={70} height={34} fill={r === 0 ? "#D8F2E6" : "#FFFFFF"} stroke="#9AA3B5" strokeWidth={2} />
    )))}
    <path d="M30,250 L90,215 L150,232 L210,180 L300,190" fill="none" stroke="#3DBE62" strokeWidth={6} />
  </g>
);
const WinMail: React.FC = () => (
  <g>
    {Array.from({ length: 6 }).map((_, i) => (
      <g key={i}>
        <circle cx={34} cy={62 + i * 38} r={12} fill={["#5E7FB8", "#C0566A", "#E8913A"][i % 3]} />
        <rect x={56} y={54 + i * 38} width={120 + (i % 3) * 40} height={8} fill="#3A3F4A" />
        <rect x={56} y={66 + i * 38} width={220} height={6} fill="#C9CED6" />
      </g>
    ))}
  </g>
);
export const WindowCascade: React.FC<{ n: number; frame: number; focus?: number }> = ({ n, frame, focus = -1 }) => (
  <g>
    <rect width={900} height={620} fill="#5E7FB8" />
    <rect width={900} height={620} fill="url(#none)" />
    {Array.from({ length: n }).map((_, i) => {
      const x = 40 + ((i * 53) % 420), y = 30 + ((i * 41) % 260);
      const top = i === n - 1 || i === focus;
      const kind = i % 2 === 0 ? "sheet" : "mail";
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x={6} y={8} width={380} height={290} rx={8} fill="#000" opacity={0.2} />
          <rect width={380} height={290} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <rect width={380} height={34} rx={8} fill={kind === "sheet" ? "#3DBE62" : "#3A6FD8"} stroke={INK} strokeWidth={4} />
          <text x={14} y={24} fontFamily={font} fontWeight={800} fontSize={18} fill="#FFFFFF">{kind === "sheet" ? `Q${(i % 4) + 1}_FINAL_v${i + 2}.xlsx` : `Inbox (${120 + i * 37})`}</text>
          {[0, 1, 2].map((k) => <circle key={k} cx={330 + k * 16} cy={17} r={5} fill="#FFFFFF" opacity={0.85} />)}
          {kind === "sheet" ? <WinSheet /> : <WinMail />}
          {top && frame % 8 < 4 && <rect width={380} height={290} rx={8} fill="none" stroke="#FFE27A" strokeWidth={6} />}
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------- cat-video feed on Dev's phone (phone screen-local 0..520 x 0..1000)
export const CatFeed: React.FC<{ frame: number; scroll: number }> = ({ frame, scroll }) => (
  <g>
    <rect width={520} height={1000} fill="#101218" />
    <g transform={`translate(0 ${-scroll})`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} transform={`translate(0 ${i * 520})`}>
          <rect x={0} y={0} width={520} height={460} fill={["#F2B880", "#BFE3F2", "#F4EEE2", "#C9E8A8", "#FFC2DD", "#F2B880"][i]} />
          <g transform="translate(260 300)"><Mochi x={0} y={0} s={2.0} frame={frame + i * 30} pose={(["sit", "sleep", "arch"] as const)[i % 3]} mood={(["open", "judge", "closed"] as const)[i % 3]} /></g>
          <rect x={0} y={460} width={520} height={60} fill="#101218" />
          <text x={20} y={500} fontFamily={font} fontWeight={700} fontSize={26} fill="#FFFFFF">♥ {(rnd(i) * 900 + 100).toFixed(0)}K   cat does nothing for 8 hrs</text>
        </g>
      ))}
    </g>
  </g>
);

// ---------------------------------------------------------------- selfie view (frame space): Dev front-ish, coffee by his face, viewfinder UI
export const SelfieView: React.FC<{ frame: number; flash: number }> = ({ frame, flash }) => (
  <g>
    <rect width={1080} height={1920} fill={P.officeWall} />
    <rect x={0} y={1300} width={1080} height={620} fill={P.partition} />
    <rect x={0} y={1286} width={1080} height={22} fill={P.trim} stroke={INK} strokeWidth={5} />
    <g transform="translate(540 900) scale(2.3)">
      <path d="M-120,360 C-122,230 -90,150 -40,136 L40,136 C90,150 122,230 120,360 Z" fill={S.sweater} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-40,136 Q0,166 40,136" fill="none" stroke={S.sweaterShade} strokeWidth={10} />
      <rect x={-22} y={90} width={44} height={56} fill={S.devSkinShade} stroke={INK} strokeWidth={SW} />
      <g transform="rotate(-6 0 100)"><DevHead frame={frame} serious turn={2} lookX={0} lookY={2} /></g>
      <g transform="translate(140 90) rotate(8)"><CoffeeCup frame={frame} s={1.1} /></g>
      <circle cx={146} cy={118} r={26} fill={S.devSkin} stroke={INK} strokeWidth={5} />
    </g>
    {/* viewfinder UI */}
    <rect x={60} y={260} width={960} height={1300} rx={40} fill="none" stroke="#FFFFFF" strokeWidth={8} opacity={0.85} />
    {[[60, 260], [1020, 260], [60, 1560], [1020, 1560]].map(([cx, cy], i) => (
      <path key={i} d={`M${cx + (cx < 540 ? 0 : 0)},${cy + (cy < 900 ? 70 : -70)} L${cx},${cy} L${cx + (cx < 540 ? 70 : -70)},${cy}`} fill="none" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" />
    ))}
    <circle cx={540} cy={1700} r={70} fill="#FFFFFF" opacity={0.9} stroke={INK} strokeWidth={6} />
    <rect width={1080} height={1920} fill="#FFFFFF" opacity={flash} />
  </g>
);

// ---------------------------------------------------------------- Employee of the Month frame (frame space, centered at cx, cy)
export const EmployeeFrame: React.FC<{ cx: number; cy: number; s?: number; frame: number }> = ({ cx, cy, s = 1, frame }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <rect x={-330} y={-420} width={660} height={840} rx={20} fill="#D9A93A" stroke={INK} strokeWidth={SW} />
    <rect x={-300} y={-390} width={600} height={780} rx={10} fill="#F2CB5A" stroke={INK} strokeWidth={4} />
    {Array.from({ length: 16 }).map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 300} cy={Math.sin(a) * 390} r={10} fill="#B8862A" stroke={INK} strokeWidth={3} />;
    })}
    <rect x={-250} y={-340} width={500} height={560} fill="#5E7FB8" stroke={INK} strokeWidth={SW} />
    <g transform="translate(0 -80) scale(1.15)">
      <path d="M-150,260 C-152,170 -110,130 -40,124 L40,124 C110,130 152,170 150,260 Z" fill={S.sweater} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <rect x={-22} y={84} width={44} height={50} fill={S.devSkinShade} stroke={INK} strokeWidth={SW} />
      <DevHead frame={frame} serious turn={4} lookX={0} lookY={0} />
    </g>
    <rect x={-250} y={-340} width={500} height={560} fill="none" stroke={INK} strokeWidth={SW} />
    <rect x={-230} y={250} width={460} height={110} rx={10} fill="#3A2E28" stroke={INK} strokeWidth={5} />
    <text x={0} y={296} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={34} fill="#F2CB5A" letterSpacing={2}>EMPLOYEE OF</text>
    <text x={0} y={340} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={34} fill="#F2CB5A" letterSpacing={2}>THE MONTH</text>
  </g>
);

export { PaperStack, CoffeeCup };
