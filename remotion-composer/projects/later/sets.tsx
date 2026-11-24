import React from "react";
import { C, INK, SW, Pt, smoothClosed } from "./art";

// New sets + props for LATER. Pure SVG, no Remotion imports. Same outline weight and flat-shading rules as art.tsx.
// Every set is drawn in its own 1920x1080 "room space" so the shared Camera works unchanged.

// ------------------------------------------------------------------ kitchen (shot 47)
export const Kitchen: React.FC<{ frame: number; drawerOpen: number; light?: "morning" | "day" }> = ({ frame, drawerOpen }) => {
  const tiles = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 22; c++)
    tiles.push(<rect key={`${r}-${c}`} x={-200 + c * 110} y={430 + r * 55} width={110} height={55} fill="none" stroke="#C9C1B0" strokeWidth={3} />);
  const dx = drawerOpen * 150;
  return (
    <g>
      <rect x={-400} y={-300} width={2720} height={1500} fill="#DCE6D2" />
      <rect x={-400} y={430} width={2720} height={220} fill="#EEE8DA" />
      {tiles}
      {/* window */}
      <rect x={1300} y={110} width={380} height={290} fill="#BFE3F2" stroke={INK} strokeWidth={SW} />
      <circle cx={1580} cy={190} r={36} fill="#FFF4CF" />
      <line x1={1490} y1={110} x2={1490} y2={400} stroke="#F4EEE2" strokeWidth={12} />
      <rect x={1300} y={110} width={380} height={290} fill="none" stroke={INK} strokeWidth={SW} />
      {/* upper cabinets */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={120 + i * 300} y={70} width={280} height={300} rx={8} fill="#7FA89A" stroke={INK} strokeWidth={SW} />
          <circle cx={120 + i * 300 + (i % 2 ? 30 : 250)} cy={330} r={9} fill={INK} />
        </g>
      ))}
      {/* fridge edge */}
      <rect x={1760} y={40} width={300} height={880} rx={18} fill="#F4F2EC" stroke={INK} strokeWidth={SW} />
      <line x1={1790} y1={360} x2={1790} y2={460} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      {/* counter */}
      <rect x={-200} y={640} width={1940} height={34} rx={6} fill="#D9CDB4" stroke={INK} strokeWidth={SW} />
      <rect x={-200} y={674} width={1940} height={320} fill="#6E8F82" stroke={INK} strokeWidth={SW} />
      {[0, 1, 3, 4].map((i) => (
        <rect key={i} x={-160 + i * 380} y={700} width={340} height={260} rx={8} fill="#7FA89A" stroke={INK} strokeWidth={SW} />
      ))}
      {/* THE drawer (slides toward camera-left when open) */}
      <g transform={`translate(${-dx * 0.25} ${dx * 0.05})`}>
        {drawerOpen > 0.02 && <rect x={610 - dx * 0.2} y={690} width={340 + dx * 0.4} height={70 + dx * 0.25} fill="#4E6B60" stroke={INK} strokeWidth={SW} />}
        <rect x={600} y={700} width={360} height={120} rx={8} fill="#86B0A1" stroke={INK} strokeWidth={SW} />
        <rect x={730} y={748} width={100} height={16} rx={8} fill={INK} />
      </g>
      <rect x={600} y={840} width={360} height={120} rx={8} fill="#7FA89A" stroke={INK} strokeWidth={SW} />
      {/* kettle + plant for life */}
      <path d="M260,640 C250,560 380,560 370,640 Z" fill="#D94B4B" stroke={INK} strokeWidth={SW} />
      <path d={`M300,560 q8,${-20 - Math.sin(frame * 0.2) * 4} 0,-40`} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.6} />
      <rect x={1440} y={580} width={70} height={60} fill="#C0566A" stroke={INK} strokeWidth={5} />
      <path d="M1475,580 C1440,520 1460,500 1475,470 C1490,500 1510,520 1475,580" fill="#7DB86A" stroke={INK} strokeWidth={4} />
      <rect x={-400} y={994} width={2720} height={400} fill="#B98A62" />
      <line x1={-400} y1={994} x2={2320} y2={994} stroke={INK} strokeWidth={SW} />
    </g>
  );
};

// ------------------------------------------------------------------ surreal road (shot 16)
export const RoadSet: React.FC<{ frame: number; capGlow?: number; phoneGlow?: number }> = ({ frame, capGlow = 0.6, phoneGlow = 1 }) => {
  const hz = 520;
  const sparkles = Array.from({ length: 14 }).map((_, i) => {
    const a = i * 2.39; const rr = 230 + (i % 4) * 40;
    const x = 1420 + Math.cos(a) * rr, y = 420 + Math.sin(a) * rr * 0.9;
    const p = 0.5 + 0.5 * Math.sin(frame * 0.25 + i);
    return <path key={i} d={`M${x},${y - 18 * p} L${x + 5},${y - 5} L${x + 18 * p},${y} L${x + 5},${y + 5} L${x},${y + 18 * p} L${x - 5},${y + 5} L${x - 18 * p},${y} L${x - 5},${y - 5} Z`} fill="#FFF1B8" opacity={0.4 + 0.6 * p} />;
  });
  return (
    <g>
      <defs>
        <linearGradient id="roadsky" x1="0" y1="-300" x2="0" y2={hz} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7FB2E0" /><stop offset="1" stopColor="#FFD9A8" />
        </linearGradient>
        <radialGradient id="phoneglow" cx="1420" cy="420" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7FD4FF" stopOpacity={0.55 * phoneGlow} /><stop offset="1" stopColor="#7FD4FF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-400} y={-300} width={2720} height={hz + 300} fill="url(#roadsky)" />
      <path d={`M-400,${hz} L2320,${hz} L2320,1400 L-400,1400 Z`} fill="#A6C77E" />
      <path d={`M-400,${hz + 10} Q300,${hz - 30} 760,${hz} Q1300,${hz - 20} 2320,${hz + 10}`} fill="#8DB46A" />
      {/* road to the vanishing point */}
      <path d={`M930,${hz} L990,${hz} L1500,1400 L420,1400 Z`} fill="#6B6E78" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = ((i + (frame * 0.02) % 1) / 6) ** 2;
        const y = hz + 10 + t * 880; const w = 4 + t * 26;
        return <rect key={i} x={960 - w / 2} y={y} width={w} height={8 + t * 60} fill="#F4EEE2" />;
      })}
      {/* tiny graduation cap at the horizon */}
      <g transform={`translate(962 ${hz - 18})`}>
        <circle r={30} fill="#FFE7A0" opacity={0.3 * capGlow} />
        <path d="M-14,0 L0,-7 L14,0 L0,7 Z" fill="#2A2438" stroke={INK} strokeWidth={2} />
        <rect x={-6} y={0} width={12} height={6} fill="#2A2438" />
      </g>
      {/* giant sparkling phone */}
      <rect x={-400} y={-300} width={2720} height={1700} fill="url(#phoneglow)" />
      <g transform={`translate(1420 ${430 + Math.sin(frame * 0.08) * 8}) rotate(-6)`}>
        <rect x={-190} y={-330} width={380} height={660} rx={48} fill="#20222A" stroke={INK} strokeWidth={10} />
        <rect x={-160} y={-290} width={320} height={580} rx={20} fill="#7FD4FF" />
        {["#FF6B9A", "#FFD36E", "#7DE08A", "#B58AFF", "#FF9F5A", "#5AB0FF", "#FF6B9A", "#7DE08A", "#FFD36E"].map((c, i) => (
          <rect key={i} x={-130 + (i % 3) * 95} y={-250 + Math.floor(i / 3) * 110} width={70} height={70} rx={16} fill={c} stroke={INK} strokeWidth={4} />
        ))}
        <circle cx={0} cy={260} r={18} fill="#2A3040" />
      </g>
      {sparkles}
    </g>
  );
};

// ------------------------------------------------------------------ surreal stage (shot 25)
export const StageSet: React.FC<{ frame: number; lean: number; spot: number }> = ({ frame, lean, spot }) => {
  const heads = [];
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 9; i++) {
      const x = -120 + i * 270 + (row % 2) * 135;
      const y = 780 + row * 120;
      const lx = (960 - x) * 0.08 * lean;
      heads.push(
        <g key={`${row}-${i}`} transform={`translate(${x + lx} ${y - lean * 20 * (row + 1) * 0.3}) rotate(${(960 - x) * 0.012 * lean})`}>
          <ellipse cx={0} cy={60} rx={110} ry={90} fill="#06040C" />
          <circle cx={0} cy={-30} r={62} fill="#06040C" />
          {(i + row) % 3 === 0 && <path d={`M${(960 - x) > 0 ? 50 : -50},20 L${(960 - x) > 0 ? 150 : -150},${-60 - lean * 40}`} stroke="#06040C" strokeWidth={22} strokeLinecap="round" />}
        </g>,
      );
    }
  }
  const sw = 140 + 240 * spot;
  return (
    <g>
      <rect x={-400} y={-300} width={2720} height={1700} fill="#120E1E" />
      {/* curtains */}
      <path d="M-400,-300 L260,-300 C200,100 260,400 160,760 L-400,760 Z" fill="#5A1E2E" stroke={INK} strokeWidth={SW} />
      <path d="M2320,-300 L1660,-300 C1720,100 1660,400 1760,760 L2320,760 Z" fill="#5A1E2E" stroke={INK} strokeWidth={SW} />
      {/* stage floor */}
      <path d="M-400,600 L2320,600 L2320,820 L-400,820 Z" fill="#5C3F2C" stroke={INK} strokeWidth={SW} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={-400} y1={630 + i * 28} x2={2320} y2={630 + i * 28} stroke="#4A3222" strokeWidth={4} />)}
      {/* spotlight cone */}
      <path d={`M${960 - 40},-300 L${960 + 40},-300 L${960 + sw},640 L${960 - sw},640 Z`} fill="#FFF3C8" opacity={0.16} />
      <ellipse cx={960} cy={640} rx={sw} ry={40} fill="#FFF3C8" opacity={0.35} />
      {heads}
    </g>
  );
};

// ------------------------------------------------------------------ surreal paper mountain (shot 30)
export const PaperMountain: React.FC<{ frame: number }> = ({ frame }) => {
  const sheets = [];
  let k = 0;
  for (let row = 0; row < 26; row++) {
    const y = 1000 - row * 62;
    const half = 1100 - row * 40;
    for (let x = -half; x < half; x += 170) {
      const j = Math.sin(k * 12.9898) * 0.5;
      sheets.push(
        <g key={k} transform={`translate(${960 + x + j * 30} ${y}) rotate(${j * 8})`}>
          <rect x={0} y={-50} width={160} height={58} fill={k % 7 === 0 ? "#F7EFE0" : "#FFFFFF"} stroke={INK} strokeWidth={4} />
          <line x1={14} y1={-34} x2={140} y2={-34} stroke="#B8BFD0" strokeWidth={3} />
          <line x1={14} y1={-20} x2={120} y2={-20} stroke="#B8BFD0" strokeWidth={3} />
        </g>,
      );
      k++;
    }
  }
  const clouds = [0, 1, 2, 3, 4].map((i) => {
    const cx = 500 + i * 260 + Math.sin(frame * 0.01 + i) * 40;
    return <ellipse key={i} cx={cx} cy={-420 + (i % 2) * 60} rx={260} ry={90} fill="#F0A7A0" opacity={0.9} />;
  });
  return (
    <g>
      <defs>
        <linearGradient id="mtsky" x1="0" y1="-1200" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5A3F8A" /><stop offset="0.55" stopColor="#E0806A" /><stop offset="1" stopColor="#FFC38A" />
        </linearGradient>
      </defs>
      <rect x={-600} y={-1400} width={3100} height={2800} fill="url(#mtsky)" />
      {sheets}
      {clouds}
      <rect x={-600} y={1000} width={3100} height={400} fill="#6B4A3A" />
      <line x1={-600} y1={1000} x2={2500} y2={1000} stroke={INK} strokeWidth={SW} />
      {/* loose pages drifting off */}
      {[0, 1, 2, 3].map((i) => {
        const t = ((frame * 0.006 + i * 0.25) % 1);
        return <rect key={i} x={1000 + i * 60 + t * 500} y={-500 + t * 700 + Math.sin(frame * 0.1 + i) * 20} width={70} height={26} fill="#FFFFFF" stroke={INK} strokeWidth={3} transform={`rotate(${t * 220} ${1035 + i * 60 + t * 500} ${-487 + t * 700})`} />;
      })}
    </g>
  );
};

// ------------------------------------------------------------------ props
export const Beanbag: React.FC<{ x: number; y: number; s?: number; squash?: number }> = ({ x, y, s = 1, squash = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * (1 + squash * 0.08)} ${s * (1 - squash * 0.12)})`}>
    <path d={smoothClosed([[-170, 0], [-150, -110], [-60, -150], [60, -140], [160, -90], [180, 0], [0, 30]] as Pt[])} fill="#C0566A" stroke={INK} strokeWidth={SW} />
    <path d="M-120,-60 Q0,-20 130,-50" fill="none" stroke="#9E4054" strokeWidth={7} />
  </g>
);

export const Whiteboard: React.FC<{ x: number; y: number; blocks: number }> = ({ x, y, blocks }) => {
  const cols = ["#E0806A", "#5E7FB8", "#7DB86A", "#E8B23A", "#8A6FB8", "#6FA8A0"];
  const cells = [];
  for (let i = 0; i < 18; i++) {
    const vis = Math.min(1, Math.max(0, blocks - i));
    if (vis <= 0) continue;
    cells.push(<rect key={i} x={20 + (i % 6) * 70} y={60 + Math.floor(i / 6) * 58} width={60 * vis} height={44} rx={6} fill={cols[(i * 5) % 6]} stroke={INK} strokeWidth={3} />);
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={460} height={260} rx={8} fill="#FFFFFF" stroke="#9AA3B5" strokeWidth={14} />
      <rect x={0} y={0} width={460} height={260} rx={8} fill="none" stroke={INK} strokeWidth={SW} />
      {["MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => <text key={d} x={30 + i * 70} y={44} fontFamily="Helvetica, Arial" fontWeight={700} fontSize={18} fill="#5A4A3A">{d}</text>)}
      {cells}
    </g>
  );
};

export const Vacuum: React.FC<{ x: number; y: number; s?: number; cord?: Pt }> = ({ x, y, s = 1, cord }) => (
  <g>
    {cord && <path d={`M${x - 40 * s},${y - 30 * s} Q${(x + cord[0]) / 2},${Math.max(y, cord[1]) + 80} ${cord[0]},${cord[1]}`} fill="none" stroke={INK} strokeWidth={6} />}
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-70} y={-60} width={140} height={70} rx={30} fill="#D94B4B" stroke={INK} strokeWidth={SW} />
      <circle cx={-44} cy={14} r={14} fill={INK} /><circle cx={44} cy={14} r={14} fill={INK} />
      <line x1={30} y1={-56} x2={110} y2={-300} stroke={INK} strokeWidth={16} strokeLinecap="round" />
      <line x1={30} y1={-56} x2={110} y2={-300} stroke="#9AA3B5" strokeWidth={8} strokeLinecap="round" />
    </g>
  </g>
);

export const Mug: React.FC<{ x: number; y: number; frame: number; s?: number }> = ({ x, y, frame, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => {
      const ph = (frame * 0.9 + i * 30) % 90;
      return <path key={i} d={`M${-16 + i * 16},-60 q${10 * Math.sin(frame * 0.1 + i)},${-ph * 0.4} 0,${-ph}`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={Math.max(0, 0.7 - ph / 120)} />;
    })}
    <path d="M38,-40 C70,-40 70,0 38,0" fill="none" stroke={INK} strokeWidth={16} />
    <path d="M38,-40 C70,-40 70,0 38,0" fill="none" stroke="#F4EEE2" strokeWidth={8} />
    <rect x={-44} y={-60} width={88} height={80} rx={10} fill="#F4EEE2" stroke={INK} strokeWidth={SW} />
    <rect x={-44} y={-30} width={88} height={18} fill="#E0806A" />
  </g>
);

export const StickyNote: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = -4, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-40} y={-40} width={80} height={80} fill="#FFE27A" stroke={INK} strokeWidth={4} />
    {[-14, 0, 14].map((ly) => <line key={ly} x1={-26} y1={ly} x2={26} y2={ly} stroke="#C9A24A" strokeWidth={4} strokeLinecap="round" />)}
  </g>
);

export const Pens: React.FC<{ x: number; y: number; last: number }> = ({ x, y, last }) => {
  const cols = ["#D94B4B", "#E8913A", "#E8B23A", "#7DB86A", "#5E7FB8", "#8A6FB8"];
  return (
    <g transform={`translate(${x} ${y})`}>
      {cols.map((c, i) => {
        const slide = i === cols.length - 1 ? (1 - last) * 160 : 0;
        const rot = i === cols.length - 1 ? (1 - last) * -12 : 0;
        return (
          <g key={i} transform={`translate(${i * 62 + slide} ${-slide * 0.3}) rotate(${rot})`}>
            <rect x={0} y={0} width={36} height={300} rx={14} fill={c} stroke={INK} strokeWidth={5} />
            <path d="M4,300 L18,340 L32,300 Z" fill="#F4E2C4" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <rect x={0} y={0} width={36} height={60} rx={14} fill="#20222A" stroke={INK} strokeWidth={5} />
          </g>
        );
      })}
    </g>
  );
};

export const KitchenTimer: React.FC<{ x: number; y: number; s?: number; dial: number; ring?: number; frame: number }> = ({ x, y, s = 1, dial, ring = 0, frame }) => {
  const bounce = ring > 0 ? Math.abs(Math.sin(frame * 1.4)) * -26 * ring : 0;
  const shake = ring > 0 ? Math.sin(frame * 3.1) * 5 * ring : 0;
  return (
    <g transform={`translate(${x + shake} ${y + bounce}) scale(${s})`}>
      <ellipse cx={0} cy={110 - bounce} rx={100} ry={16} fill="#000" opacity={0.18} />
      <path d="M-110,90 C-130,-40 -70,-110 0,-110 C70,-110 130,-40 110,90 Z" fill="#D94B4B" stroke={INK} strokeWidth={SW} />
      <ellipse cx={0} cy={-6} rx={84} ry={78} fill="#F4EEE2" stroke={INK} strokeWidth={5} />
      <g transform={`rotate(${dial} 0 -6)`}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={Math.cos(a) * 62} y1={-6 + Math.sin(a) * 58} x2={Math.cos(a) * 74} y2={-6 + Math.sin(a) * 70} stroke={INK} strokeWidth={4} />;
        })}
        <rect x={-12} y={-70} width={24} height={64} rx={8} fill="#D94B4B" stroke={INK} strokeWidth={4} />
      </g>
      <path d="M0,-96 L-10,-116 L10,-116 Z" fill={INK} />
      {ring > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${120 + i * 22},${-60 - i * 10} q12,-16 0,-34`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(frame * 0.9 + i)} />)}
    </g>
  );
};

export const Checklist: React.FC<{ x: number; y: number; ticks: number; draw?: number; r?: number }> = ({ x, y, ticks, draw = 1, r = -3 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={0} y={0} width={520} height={400} fill="#FFFFFF" stroke={INK} strokeWidth={SW} />
    {[0, 1, 2].map((i) => {
      const ty = 70 + i * 110;
      const on = i < ticks || (i === ticks && draw > 0);
      const pr = i < ticks ? 1 : i === ticks ? draw : 0;
      return (
        <g key={i}>
          <rect x={40} y={ty} width={64} height={64} rx={6} fill="none" stroke={INK} strokeWidth={5} />
          <line x1={140} y1={ty + 32} x2={460 - i * 40} y2={ty + 32} stroke="#9AA3B5" strokeWidth={8} strokeLinecap="round" />
          {on && <path d="M50,32 L68,52 L100,10" transform={`translate(0 ${ty})`} fill="none" stroke="#2E8B57" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - pr)} />}
        </g>
      );
    })}
  </g>
);

export const PhoneChat: React.FC<{ x: number; y: number; s?: number; reply: number }> = ({ x, y, s = 1, reply }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-230} y={-420} width={460} height={840} rx={56} fill="#20222A" stroke={INK} strokeWidth={10} />
    <rect x={-200} y={-380} width={400} height={760} rx={24} fill="#F4F2EC" />
    <g>
      <rect x={-40} y={-220} width={220} height={110} rx={26} fill="#5E7FB8" />
      <text x={70} y={-176} textAnchor="middle" fontFamily="Helvetica, Arial" fontWeight={700} fontSize={26} fill="#FFFFFF">check on me</text>
      <text x={70} y={-140} textAnchor="middle" fontFamily="Helvetica, Arial" fontWeight={700} fontSize={26} fill="#FFFFFF">at six?</text>
    </g>
    {reply > 0 && (
      <g transform={`translate(-100 -10) scale(${Math.min(1, reply * 1.2) - Math.max(0, reply * 1.2 - 1) * 0.6})`}>
        <rect x={-80} y={-50} width={160} height={100} rx={26} fill="#E2DDD2" />
        <path d="M-24,22 L-24,-6 L-8,-6 L4,-34 Q16,-34 12,-12 L32,-12 Q42,-10 38,2 L32,22 Z" fill="#E8B23A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </g>
    )}
  </g>
);

// Front view of the laptop screen (shots 9, 36). open 0..1 = lid angle; mode doc|error.
export const LaptopFront: React.FC<{ frame: number; open: number; mode: "doc" | "error"; errorPop?: number; lines?: number }> = ({ frame, open, mode, errorPop = 0, lines = 0 }) => {
  const h = 560 * open;
  const blink = Math.floor(frame / 12) % 2 === 0;
  return (
    <g>
      <rect x={560} y={760} width={800} height={60} rx={14} fill="#9AA3B5" stroke={INK} strokeWidth={SW} />
      <g transform={`translate(0 ${760 - h})`}>
        <rect x={600} y={0} width={720} height={h} rx={20} fill="#B9C2D3" stroke={INK} strokeWidth={SW} />
        {open > 0.15 && (
          <g>
            <rect x={630} y={28} width={660} height={Math.max(0, h - 56)} rx={6} fill={mode === "error" ? "#F6F3F3" : "#FFFFFF"} />
            {mode === "doc" && Array.from({ length: lines }).map((_, i) => <line key={i} x1={700} y1={100 + i * 30} x2={i === lines - 1 ? 1000 : 1200} y2={100 + i * 30} stroke="#C8CCD6" strokeWidth={8} strokeLinecap="round" />)}
            {mode === "doc" && blink && <line x1={702 + (lines ? 300 : 0)} y1={86 + Math.max(0, lines - 1) * 30} x2={702 + (lines ? 300 : 0)} y2={116 + Math.max(0, lines - 1) * 30} stroke={INK} strokeWidth={4} />}
            {mode === "error" && (
              <g>
                <rect x={700} y={80} width={520} height={40} rx={8} fill="#E2E5EC" />
                <rect x={700} y={140} width={300} height={24} rx={6} fill="#E2E5EC" />
                <g transform={`translate(960 330) scale(${errorPop})`}>
                  <circle r={110} fill="#D93B3B" stroke={INK} strokeWidth={8} />
                  <path d="M-50,-50 L50,50 M50,-50 L-50,50" stroke="#FFFFFF" strokeWidth={26} strokeLinecap="round" />
                </g>
                <rect x={820} y={470} width={280} height={26} rx={6} fill="#F2B8B8" />
              </g>
            )}
          </g>
        )}
      </g>
    </g>
  );
};

export const Keyboard: React.FC<{ frame: number; pressed?: number[]; blur?: number }> = ({ pressed = [], blur = 0 }) => {
  const keys = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) {
    const i = r * 14 + c; const down = pressed.includes(i);
    keys.push(<rect key={i} x={120 + c * 124 + (r % 2) * 30} y={260 + r * 124 + (down ? 8 : 0)} width={108} height={108} rx={14} fill={down ? "#C8CCD6" : "#E6E8EE"} stroke={INK} strokeWidth={5} />);
  }
  return (
    <g>
      <defs><filter id="kbblur"><feGaussianBlur stdDeviation={`${blur} 0`} /></filter></defs>
      <rect x={60} y={200} width={1860} height={700} rx={30} fill="#9AA3B5" stroke={INK} strokeWidth={SW} />
      <g filter={blur > 0 ? "url(#kbblur)" : undefined}>{keys}</g>
    </g>
  );
};

// Under-bed darkness (shots 11, 52): bed frame from below + dark void. light 0..1 floods it.
export const UnderBed: React.FC<{ frame: number; light: number }> = ({ light }) => (
  <g>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#07050E" />
    <rect x={-400} y={-300} width={2720} height={380} fill="#3A2A22" />
    <rect x={-400} y={60} width={2720} height={30} fill="#2A1C16" stroke={INK} strokeWidth={SW} />
    <rect x={-400} y={880} width={2720} height={600} fill="#2E2018" />
    <path d="M200,880 L320,880 L300,620 L220,620 Z" fill="#1A1210" />
    <rect x={-400} y={-300} width={2720} height={1700} fill="#FFE6A8" opacity={0.55 * light} />
    <path d={`M2320,${-300} L${2320 - 2200 * light},880 L2320,880 Z`} fill="#FFF1C8" opacity={0.35 * light} />
  </g>
);
