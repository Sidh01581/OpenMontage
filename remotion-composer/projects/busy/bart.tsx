import React from "react";
import { INK, SW, Limb, Pt } from "../later/art";
import { P, rnd } from "../we-need-to-talk/vart";
import { S, DevHead } from "../sure/sart";

// BUSY. — new art. Pure SVG, same 6 px INK outline and flat cel color as LATER / SURE.
// Dev full body + speed-walk cycle, his props (to-go coffee, paper stack), the BUSY HUD and the office aisle.

export const B = {
  pants: "#3A4160",
  pantsShade: "#2C3250",
  shoe: "#7A4A2C",
  cup: "#F4EEE2",
  sleeve: "#A8714A",
  lid: "#3A2E28",
  coffee: "#6B4630",
  hud: "#1C2A33",
  hudMint: "#7FF0C2",
  hudRed: "#FF6B6B",
  hudGreen: "#5BE37A",
  paper: "#FFFFFF",
  paperLine: "#9AA3B5",
  poster: "#F4B23A",
};
const font = "'Helvetica Neue', Arial, sans-serif";

const THIGH = 98, SHIN = 94, UPPER = 82, FORE = 78;
const rad = (d: number) => (d * Math.PI) / 180;
const fk = (o: Pt, deg: number, len: number): Pt => [o[0] + Math.sin(rad(deg)) * len, o[1] + Math.cos(rad(deg)) * len];
const p3 = (a: Pt, b: Pt, c: Pt) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;

// ---------------------------------------------------------------- props (origin = hand center)
export const CoffeeCup: React.FC<{ frame: number; steam?: boolean; slosh?: number; s?: number }> = ({ frame, steam = true, slosh = 0, s = 1 }) => (
  <g transform={`scale(${s}) rotate(${slosh * 6})`}>
    {steam && [0, 1].map((i) => {
      const ph = ((frame * 0.9 + i * 16) % 32) / 32;
      return <path key={i} d={`M${-8 + i * 16},${-96 - ph * 44} q-9,-10 0,-20 q9,-10 0,-20`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.75 * (1 - ph)} transform={`translate(${-slosh * 30 * ph} 0)`} />;
    })}
    <path d="M-30,-70 L30,-70 L24,40 L-24,40 Z" fill={B.cup} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M-28,-34 L28,-34 L26,8 L-26,8 Z" fill={B.sleeve} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={0} cy={-13} r={9} fill={B.cup} stroke={INK} strokeWidth={3} />
    <rect x={-36} y={-86} width={72} height={18} rx={6} fill={B.lid} stroke={INK} strokeWidth={5} />
    <rect x={-6} y={-92} width={16} height={8} rx={3} fill={B.lid} stroke={INK} strokeWidth={3} />
  </g>
);

// Paper stack held flat against the chest. label = text on the top sheet (readable in ECU).
export const PaperStack: React.FC<{ label?: string; r?: number; s?: number; n?: number }> = ({ label, r = -8, s = 1, n = 4 }) => (
  <g transform={`rotate(${r}) scale(${s})`}>
    {Array.from({ length: n }).map((_, i) => (
      <rect key={i} x={-70 + (n - 1 - i) * 5} y={-96 + (n - 1 - i) * 4} width={140} height={184} fill={B.paper} stroke={INK} strokeWidth={4} transform={`rotate(${(rnd(i + 3) - 0.5) * 8})`} />
    ))}
    {label
      ? <text x={0} y={-58} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={20} fill="#C0392B">{label}</text>
      : <rect x={-50} y={-74} width={70} height={10} fill={B.paperLine} />}
    {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={-50} y1={-34 + i * 20} x2={i % 2 ? 30 : 50} y2={-34 + i * 20} stroke={B.paperLine} strokeWidth={4} />)}
  </g>
);

// ---------------------------------------------------------------- Dev, full body
// Local: origin = hip center, facing screen RIGHT, y down. Head center at (8, -318). Same unit scale as TheoPuppetV.
// walk: phase in steps (1 = one step). speed 0..1 scales stride; 0 = standing.
export const DevWalker: React.FC<{
  x: number; y: number; s?: number; flip?: boolean; frame: number; phase?: number; speed?: number;
  talk?: number; lookX?: number; lookY?: number; serious?: boolean; headTilt?: number; turn?: number;
  coffee?: boolean; papers?: boolean; paperLabel?: string; watch?: number; nod?: number;
}> = ({ x, y, s = 1, flip = false, frame, phase = 0, speed = 1, talk = 0, lookX = 10, lookY = 2, serious = true, headTilt = 0, turn = 30, coffee = true, papers = true, paperLabel, watch = 0, nod = 0 }) => {
  const ph = phase * Math.PI; // one step = half a cycle
  const A = 24 * speed;
  const bob = -Math.abs(Math.sin(ph)) * 10 * speed;
  const lean = 7 * speed;
  // legs: hip swing + knee bend during the forward swing
  const hipF: Pt = [10, 0], hipB: Pt = [-10, 0];
  const swF = Math.sin(ph), swB = -Math.sin(ph);
  const kneeBend = (sw: number, vel: number) => -(6 + 46 * Math.max(0, vel) * speed);
  const aF = A * swF, aB = A * swB;
  const kF = fk(hipF, aF, THIGH), fF = fk(kF, aF + kneeBend(swF, Math.cos(ph)), SHIN);
  const kB = fk(hipB, aB, THIGH), fB = fk(kB, aB + kneeBend(swB, -Math.cos(ph)), SHIN);
  // planted foot stays on the ground line: lift the body so the lower foot touches y = THIGH+SHIN-6
  const ground = Math.max(fF[1], fB[1]);
  const lift = THIGH + SHIN - 6 - ground;
  const shoe = (f: Pt, deg: number) => (
    <g transform={`translate(${f[0]} ${f[1]}) rotate(${-deg * 0.4})`}>
      <path d="M-18,-8 L30,-8 Q50,-6 50,8 L-20,8 Z" fill={B.shoe} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    </g>
  );
  // arms: coffee arm out front (steady: coffee stays level), paper arm clamps the stack to the chest
  const shF: Pt = [26, -196], shB: Pt = [-18, -194];
  const pump = Math.sin(ph) * 6 * speed;
  const elF = fk(shF, 18 + pump * 0.3, UPPER), haF = fk(elF, 112, FORE);
  const elB0 = fk(shB, -16 - pump, UPPER), haB0 = fk(elB0, 22 - pump, FORE);
  // watch check: the paper hand snaps up in front of the chin (papers tucked under the arm)
  const elB: Pt = [elB0[0] + (40 - elB0[0]) * watch, elB0[1] + (-140 - elB0[1]) * watch];
  const haB: Pt = [haB0[0] + (112 - haB0[0]) * watch, haB0[1] + (-206 - haB0[1]) * watch];
  const slosh = Math.sin(ph * 2) * speed;
  return (
    <g transform={`translate(${x} ${y + (lift + bob) * s}) scale(${flip ? -s : s} ${s})`}>
      {/* back leg */}
      <Limb d={p3(hipB, kB, fB)} color={B.pantsShade} w={46} />
      {shoe(fB, aB)}
      <g transform={`rotate(${lean} 0 0)`}>
        {/* back arm + paper stack (behind torso edge, in front of back leg) */}
        <Limb d={p3(shB, elB, haB)} color={S.sweaterShade} w={40} />
        {papers && (watch < 0.5
          ? <g transform={`translate(${haB[0] - 34} ${haB[1] - 6})`}><PaperStack label={paperLabel} r={-10 - pump} s={0.72} /></g>
          : <g transform="translate(-40 -120)"><PaperStack label={paperLabel} r={-80} s={0.66} /></g>)}
        {watch < 0.5 && <circle cx={haB[0]} cy={haB[1]} r={17} fill={S.devSkinShade} stroke={INK} strokeWidth={5} />}
      </g>
      {/* front leg */}
      <Limb d={p3(hipF, kF, fF)} color={B.pants} w={48} />
      {shoe(fF, aF)}
      <g transform={`rotate(${lean} 0 0)`}>
        {/* torso: lanky sweater */}
        <path d="M-50,14 C-62,-60 -60,-150 -44,-196 C-20,-214 30,-214 54,-196 C70,-150 70,-60 58,14 Z" fill={S.sweater} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M-50,0 L58,0" stroke={S.sweaterShade} strokeWidth={10} />
        {[0, 1, 2].map((i) => <path key={i} d={`M-46,${-150 + i * 44} L60,${-150 + i * 44}`} stroke={S.sweaterShade} strokeWidth={4} opacity={0.55} />)}
        <rect x={-10} y={-228} width={36} height={36} fill={S.devSkinShade} stroke={INK} strokeWidth={SW} />
        <path d="M-26,-204 Q8,-184 42,-204" fill="none" stroke={S.sweaterShade} strokeWidth={9} />
        <g transform={`translate(8 ${-318 + nod * 14}) rotate(${headTilt + nod * 10 + watch * 12 + Math.sin(ph) * 1.5 * speed} 0 100)`}>
          <DevHead frame={frame} talk={talk} lookX={lookX} lookY={lookY} serious={serious} smile={!serious} turn={turn} />
        </g>
        {/* front arm + coffee */}
        <Limb d={p3(shF, elF, haF)} color={S.sweater} w={44} />
        {coffee && <g transform={`translate(${haF[0] + 4} ${haF[1] - 6}) rotate(${-lean})`}><CoffeeCup frame={frame} slosh={slosh} s={0.8} /></g>}
        <circle cx={haF[0]} cy={haF[1]} r={19} fill={S.devSkin} stroke={INK} strokeWidth={5} />
        {watch >= 0.5 && (
          <g>
            <Limb d={p3(shB, elB, haB)} color={S.sweaterShade} w={40} />
            <circle cx={haB[0]} cy={haB[1]} r={17} fill={S.devSkinShade} stroke={INK} strokeWidth={5} />
            <g transform={`translate(${haB[0] - 18} ${haB[1] + 14})`}><circle r={14} fill="#E8E2D2" stroke={INK} strokeWidth={4} /></g>
          </g>
        )}
      </g>
    </g>
  );
};

// Speed lines trailing a fast walker (frame or room space), pointing back along -x of travel.
export const SpeedLines: React.FC<{ x: number; y: number; dir?: 1 | -1; frame: number; s?: number; k?: number }> = ({ x, y, dir = 1, frame, s = 1, k = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`} opacity={k}>
    {[-120, -40, 40, 120].map((yy, i) => {
      const len = 90 + ((frame * 7 + i * 37) % 60);
      return <line key={i} x1={-150 - i * 10} y1={yy} x2={-150 - i * 10 - len} y2={yy} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.55} />;
    })}
  </g>
);

// ---------------------------------------------------------------- the BUSY HUD (frame space, origin = top-left)
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const ShoeIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path transform={`translate(${x} ${y})`} d="M-18,-6 L-6,-14 L4,-6 Q20,-6 22,6 L-18,6 Z" fill={B.hudMint} stroke={B.hudMint} strokeWidth={3} strokeLinejoin="round" />
);
const CupIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-12,-14 L12,-14 L9,14 L-9,14 Z" fill={B.hudMint} />
    <rect x={-15} y={-20} width={30} height={7} rx={3} fill={B.hudMint} />
  </g>
);
export const BusyHUD: React.FC<{
  x: number; y: number; steps: number; coffee: number; work: number | string; age: number; s?: number; tick?: number; workDone?: boolean; label?: string; busy?: boolean;
}> = ({ x, y, steps, coffee, work, age, s = 1, tick = 0, workDone = false, label = "DEV", busy = false }) => {
  if (age < 0) return null;
  const pop = age < 6 ? 0.6 + 0.4 * Math.min(1, age / 3) + 0.12 * Math.sin(Math.min(1, age / 6) * Math.PI) : 1;
  const W = 560, H = 196;
  const wcol = workDone ? B.hudGreen : B.hudRed;
  return (
    <g transform={`translate(${x + W / 2} ${y + H / 2}) scale(${s * pop}) translate(${-W / 2} ${-H / 2})`}>
      <rect x={6} y={10} width={W} height={H} rx={34} fill="#000" opacity={0.35} />
      <rect width={W} height={H} rx={34} fill={B.hud} stroke={INK} strokeWidth={SW} />
      <rect x={18} y={16} width={98} height={36} rx={18} fill={B.hudMint} />
      <text x={67} y={44} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={26} fill={B.hud}>{label}</text>
      <ShoeIcon x={156} y={36} />
      <text x={186} y={50} fontFamily={font} fontWeight={800} fontSize={40} fill="#FFFFFF" transform={`translate(0 ${-tick * 4})`}>{fmt(steps)} ↑</text>
      <CupIcon x={420} y={34} />
      <text x={446} y={50} fontFamily={font} fontWeight={800} fontSize={40} fill="#FFFFFF">{coffee} ↑</text>
      <line x1={22} y1={80} x2={W - 22} y2={80} stroke="#FFFFFF" strokeWidth={3} opacity={0.25} />
      {busy ? (
        <g>
          <text x={30} y={148} fontFamily={font} fontWeight={900} fontSize={38} fill="#FFFFFF" letterSpacing={-1}>LOOKING BUSY:</text>
          <text x={W - 30} y={152} textAnchor="end" fontFamily={font} fontWeight={900} fontSize={54} fill="#FFC93C">1000%</text>
        </g>
      ) : (
        <g>
          <text x={30} y={150} fontFamily={font} fontWeight={900} fontSize={58} fill="#FFFFFF" letterSpacing={-1}>WORK DONE:</text>
          <text x={W - 34} y={152} textAnchor="end" fontFamily={font} fontWeight={900} fontSize={70} fill={wcol}>{work}</text>
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- office aisle (frame space, scrolls with the walker)
// World x runs 0..3600; the camera shows [scroll, scroll + 1080]. Floor line y = 1250; Dev's feet land at ~1560.
const Cubicle: React.FC<{ x: number; frame: number; i: number; extra?: React.ReactNode }> = ({ x, frame, i, extra }) => (
  <g transform={`translate(${x} 0)`}>
    {/* monitor + a coworker's hair tuft peeking over the partition */}
    <rect x={60} y={1010} width={130} height={86} rx={8} fill="#3A3F4A" stroke={INK} strokeWidth={5} />
    <rect x={72} y={1020} width={106} height={64} fill={i % 2 ? "#CFE3FF" : "#D8F2E6"} />
    {extra}
    {!extra && i % 3 === 1 && <circle cx={260} cy={1086} r={46} fill={["#4A2E1E", "#1E1A24", "#C8552A"][i % 3]} stroke={INK} strokeWidth={5} />}
    <rect x={0} y={1080} width={380} height={190} fill={P.partition} stroke={INK} strokeWidth={SW} />
    {[70, 150, 230, 310].map((xx) => <line key={xx} x1={xx} y1={1100} x2={xx} y2={1260} stroke={P.partitionShade} strokeWidth={4} />)}
    <rect x={-8} y={1068} width={396} height={20} rx={6} fill={P.trim} stroke={INK} strokeWidth={5} />
    <rect x={30 + (i % 2) * 200} y={1120} width={40} height={40} fill={["#FFE27A", "#FF9FB8", "#9FE3F0"][i % 3]} stroke={INK} strokeWidth={3} transform={`rotate(${(rnd(i) - 0.5) * 12} ${50 + (i % 2) * 200} 1140)`} />
  </g>
);
export const HustlePoster: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-120} y={-150} width={240} height={300} fill={B.poster} stroke={INK} strokeWidth={SW} />
    <path d="M-80,60 L-20,-20 L20,20 L80,-60" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50,-62 L82,-62 L82,-30" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    <text x={0} y={-90} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={50} fill={INK}>HUSTLE.</text>
    <text x={0} y={118} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={22} fill={INK}>always look busy</text>
  </g>
);
export const TallPlant: React.FC<{ x: number; y: number; s?: number; frame: number; hit?: number }> = ({ x, y, s = 1, frame, hit = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${hit * 18 * Math.sin(frame * 0.9) * Math.exp(-frame * 0)})`}>
    {[-40, -18, 0, 20, 42].map((a, i) => (
      <path key={i} d={`M0,-120 Q${a * 1.2},${-260 - i * 10} ${a * 2.6},${-360 + (i % 2) * 40 + Math.sin(frame * 0.06 + i) * 4}`} fill="none" stroke="#4E8C4A" strokeWidth={22} strokeLinecap="round" />
    ))}
    {[-40, -18, 0, 20, 42].map((a, i) => (
      <path key={`l${i}`} d={`M0,-120 Q${a * 1.2},${-260 - i * 10} ${a * 2.6},${-360 + (i % 2) * 40 + Math.sin(frame * 0.06 + i) * 4}`} fill="none" stroke="#6DBA5E" strokeWidth={10} strokeLinecap="round" />
    ))}
    <path d="M-70,-130 L70,-130 L54,0 L-54,0 Z" fill="#C9955E" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x={-78} y={-146} width={156} height={24} rx={6} fill="#B07E4A" stroke={INK} strokeWidth={5} />
  </g>
);
export const WaterCooler: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-50,-330 Q-56,-420 0,-430 Q56,-420 50,-330 Z" fill="#BFE6F7" stroke={INK} strokeWidth={SW} />
    <rect x={-70} y={-330} width={140} height={330} rx={10} fill="#E6E8EC" stroke={INK} strokeWidth={SW} />
    <rect x={-20} y={-260} width={40} height={20} rx={4} fill="#5E7FB8" stroke={INK} strokeWidth={4} />
  </g>
);

// cubicleExtra(i, frameX) draws something behind cubicle i's panel (e.g. a coworker head at local x 260, y 1030).
export const AisleSet: React.FC<{ frame: number; scroll: number; clock?: string; cubicleExtra?: (i: number, frameX: number) => React.ReactNode }> = ({ frame, scroll, cubicleExtra }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={P.officeWall} />
    {/* ceiling with fluorescent panels (parallax) */}
    <rect x={0} y={0} width={1080} height={360} fill="#F7F1E3" />
    <g transform={`translate(${-scroll * 0.7} 0)`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i}>
          <path d={`M${i * 520 - 200},${140} L${i * 520 + 60},${140} L${i * 520 + 90},${210} L${i * 520 - 230},${210} Z`} fill="#FFFDF2" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M${i * 520 - 120},${150} L${i * 520 - 130},${200} M${i * 520},${150} L${i * 520 + 6},${200}`} stroke="#E6E0CC" strokeWidth={6} />
        </g>
      ))}
    </g>
    <line x1={0} y1={360} x2={1080} y2={360} stroke={INK} strokeWidth={SW} />
    <rect x={0} y={360} width={1080} height={26} fill={P.trim} />
    <line x1={0} y1={386} x2={1080} y2={386} stroke={INK} strokeWidth={4} opacity={0.5} />
    {/* far wall: windows + posters, slow parallax */}
    <g transform={`translate(${-scroll * 0.55} 0)`}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i * 900 - 200} 0)`}>
          <rect x={0} y={470} width={420} height={420} fill="#BFE3F2" />
          <path d="M0,890 L0,770 L60,770 L60,720 L130,720 L130,800 L200,800 L200,690 L270,690 L270,760 L340,760 L340,740 L420,740 L420,890 Z" fill="#8FB3C2" />
          <rect x={0} y={470} width={420} height={420} fill="none" stroke={P.shirt} strokeWidth={18} />
          <rect x={0} y={470} width={420} height={420} fill="none" stroke={INK} strokeWidth={SW} />
          <line x1={210} y1={470} x2={210} y2={890} stroke={P.shirt} strokeWidth={12} />
        </g>
      ))}
      <HustlePoster x={1310} y={690} />
    </g>
    <rect x={0} y={1180} width={1080} height={80} fill={P.officeWallShade} />
    {/* cubicle row, mid parallax */}
    <g transform={`translate(${-scroll * 0.8} 0)`}>
      {Array.from({ length: 10 }).map((_, i) => <Cubicle key={i} x={i * 420 - 300} frame={frame} i={i} extra={cubicleExtra?.(i, i * 420 - 300 + 260 - scroll * 0.8)} />)}
    </g>
    <rect x={0} y={1258} width={1080} height={700} fill={P.carpet} />
    <line x1={0} y1={1260} x2={1080} y2={1260} stroke={INK} strokeWidth={SW} />
    {/* carpet seams scroll at full speed (the walker's ground) */}
    <g transform={`translate(${-(scroll % 300)} 0)`}>
      {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={i * 300} y1={1262} x2={i * 300 - 160} y2={1920} stroke="#5F7E7A" strokeWidth={5} />)}
    </g>
  </g>
);

// A real pile of work on Theo's desk (room coords; desk top y = 592).
export const DeskPile: React.FC<{ x: number; n?: number }> = ({ x, n = 7 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <rect key={i} x={x - 70 + (rnd(i * 2.1) - 0.5) * 16} y={592 - (i + 1) * 20} width={140} height={20} rx={3}
        fill={["#F4EEE2", "#9FC7E8", "#F4EEE2", "#F2C46B", "#F4EEE2", "#C9E8A8", "#F4EEE2"][i % 7]} stroke={INK} strokeWidth={4} />
    ))}
  </g>
);
