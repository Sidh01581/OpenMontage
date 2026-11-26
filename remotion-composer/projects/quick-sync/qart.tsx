import React from "react";
import { INK, SW, Clock, ChairBack, Mochi } from "../later/art";
import { P, rnd, TheoSeated } from "../we-need-to-talk/vart";
import { DevSeated } from "../busy/bart2";

// QUICK SYNC. — conference room world (frame space at zoom 1, with bleed), screens, ENERGY meter.
// World layout: wall to y 1150; presentation screen x 560..1040, y 250..620; table top y = TABLE.
// Theo sits at x ~230, Dev at x ~500, Priya stands at x ~790 (all facing / looking toward the screen side).

export const Q = {
  wall: "#E4E1DA", wallShade: "#D3CFC5", floor: "#8C9AA8", table: "#B88A5E", tableEdge: "#8E6642", chair: "#3A3F4A",
  slide: "#2F6FD6", slideHi: "#E9F0FC", tag: "#1C2A33", bolt: "#FFC93C", red: "#FF6B6B", green: "#5BE37A",
};
const font = "'Helvetica Neue', Arial, sans-serif";
export const TABLE = 1100;

// ---------------------------------------------------------------- room
export const ConfBack: React.FC<{ frame: number; clockM?: number; screen?: React.ReactNode; dim?: number }> = ({ frame, clockM = 0, screen, dim = 0 }) => (
  <g>
    <rect x={-600} y={-600} width={2400} height={1750} fill={Q.wall} />
    <rect x={-600} y={1150} width={2400} height={1400} fill={Q.floor} />
    <line x1={-600} y1={1150} x2={1800} y2={1150} stroke={INK} strokeWidth={SW} />
    {/* ceiling lights */}
    {[-100, 400, 900].map((x, i) => <rect key={i} x={x} y={40} width={300} height={40} rx={6} fill="#FFFDF2" stroke={INK} strokeWidth={5} />)}
    {/* window behind Theo */}
    <rect x={30} y={420} width={300} height={400} fill="#BFD9E6" />
    <path d="M30,820 L30,700 L90,700 L90,640 L160,640 L160,730 L230,730 L230,660 L330,660 L330,820 Z" fill="#9AB5C4" />
    <rect x={30} y={420} width={300} height={400} fill="none" stroke={P.shirt} strokeWidth={16} />
    <rect x={30} y={420} width={300} height={400} fill="none" stroke={INK} strokeWidth={SW} />
    <line x1={180} y1={420} x2={180} y2={820} stroke={P.shirt} strokeWidth={10} />
    {/* clock */}
    <Clock x={180} y={260} r={70} h={10 + Math.floor(clockM / 60)} m={clockM % 60} sec={(frame * 2.5) % 60} />
    {/* presentation screen */}
    <rect x={548} y={238} width={504} height={394} rx={10} fill="#2A2E38" stroke={INK} strokeWidth={SW} />
    <g transform="translate(560 250)">
      <rect width={480} height={370} fill={Q.slideHi} />
      {screen}
    </g>
    <rect x={770} y={632} width={60} height={20} fill="#2A2E38" stroke={INK} strokeWidth={4} />
    {/* sad plant */}
    <path d="M-40,1150 L-20,1040 L80,1040 L100,1150 Z" fill="#C9C2B3" stroke={INK} strokeWidth={5} />
    {[0, 1, 2].map((i) => <path key={i} d={`M30,1040 Q${10 + i * 20},${980} ${-10 + i * 40},${990 + i * 10}`} fill="none" stroke="#7A8C5A" strokeWidth={10} strokeLinecap="round" />)}
    {dim > 0 && <rect x={-600} y={-600} width={2400} height={3200} fill="#5A6070" opacity={0.25 * dim} />}
  </g>
);

// Table + chairs in front of the seated people (drawn after them).
export const ConfTable: React.FC = () => (
  <g>
    <rect x={-300} y={TABLE} width={1700} height={30} rx={6} fill={Q.table} stroke={INK} strokeWidth={SW} />
    <rect x={-300} y={TABLE + 30} width={1700} height={14} fill={Q.tableEdge} />
    {[80, 640, 1000].map((x) => <rect key={x} x={x} y={TABLE + 44} width={26} height={1150 + 260 - TABLE - 44} fill={Q.tableEdge} stroke={INK} strokeWidth={5} />)}
  </g>
);

// ---------------------------------------------------------------- people placed in the room
// Theo (TheoSeated room rig) at the table: head center lands at (x, TABLE - 167*s).
export const TheoAtTable: React.FC<{ x: number; s?: number; frame: number; expr: React.ComponentProps<typeof TheoSeated>["expr"]; talk?: number; lookX?: number; lookY?: number; headRot?: number; slide?: number; plant?: number; eyesClosed?: boolean; sweat?: number }> =
  ({ x, s = 0.85, frame, expr, talk, lookX = 8, lookY = 2, headRot = 0, slide = 0, plant = 0, eyesClosed, sweat }) => (
    <g transform={`translate(${x} ${TABLE - 167 * s + slide * 70 * s}) scale(${s}) translate(-985 -425)`}>
      <ChairBack />
      <g transform={`translate(0 ${plant * 60})`}>
        <TheoSeated expr={expr} frame={frame} talk={talk} lookX={lookX} lookY={lookY} headRot={headRot + plant * 62} eyesClosed={eyesClosed} sweat={sweat} lanyard />
      </g>
    </g>
  );

// Dev (BUSY. seated rig, deskless) at the table: local desk height -40 lands on TABLE.
export const DevAtTable: React.FC<{ x: number; s?: number; frame: number; typeSpeed?: number; lookX?: number; lookY?: number; serious?: boolean; talk?: number; turn?: number; headTilt?: number }> =
  ({ x, s = 0.85, frame, typeSpeed = 0, lookX = 16, lookY = 4, serious = true, talk = 0, turn = 30, headTilt = 0 }) => (
    <DevSeated x={x} y={TABLE + 40 * s} s={s} frame={frame} pose="type" typeSpeed={typeSpeed} lookX={lookX} lookY={lookY} serious={serious} talk={talk} turn={turn} headTilt={headTilt} deskless />
  );

// Dev's laptop on the table (side view, screen facing Dev at his left). Origin = front foot on the table.
export const TableLaptop: React.FC<{ x: number; s?: number; glow?: string }> = ({ x, s = 0.85, glow = "#9FE3B0" }) => (
  <g transform={`translate(${x} ${TABLE}) scale(${s})`}>
    <ellipse cx={-40} cy={-80} rx={60} ry={50} fill={glow} opacity={0.18} />
    <rect x={-10} y={-12} width={150} height={12} rx={4} fill="#C9CED6" stroke={INK} strokeWidth={5} />
    <path d="M128,-10 L150,-150 L162,-148 L140,-8 Z" fill="#A9B0BC" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

// ---------------------------------------------------------------- screens (all screen-local, sized for the 480x370 presentation screen unless noted)
export const SlideTitle: React.FC = () => (
  <g>
    <rect width={480} height={370} fill={Q.slide} />
    <text x={240} y={170} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={60} fill="#FFFFFF">Q4 SYNC</text>
    <text x={240} y={225} textAnchor="middle" fontFamily={font} fontWeight={600} fontSize={26} fill="#FFFFFF" opacity={0.85}>a quick one :)</text>
  </g>
);
export const SlideAgenda: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <g>
    <rect width={480} height={370} fill={Q.slideHi} />
    <rect width={480} height={80} fill={Q.slide} />
    <text x={30} y={56} fontFamily={font} fontWeight={900} fontSize={44} fill="#FFFFFF">AGENDA</text>
    {k > 0 && <g opacity={k}><circle cx={50} cy={160} r={10} fill={Q.slide} /><text x={74} y={172} fontFamily={font} fontWeight={800} fontSize={36} fill="#141018">Discuss the agenda</text></g>}
    <text x={450} y={350} textAnchor="end" fontFamily={font} fontWeight={600} fontSize={18} fill="#8A93A6">1 / 47</text>
  </g>
);
export const SlideUpdate: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <g>
    <rect width={480} height={370} fill={Q.slideHi} />
    <rect width={480} height={80} fill={Q.slide} />
    <text x={30} y={56} fontFamily={font} fontWeight={900} fontSize={40} fill="#FFFFFF">THE BIG UPDATE</text>
    <g opacity={k}>
      <rect x={150} y={130} width={180} height={110} rx={10} fill="#C9CED6" stroke={INK} strokeWidth={5} />
      <rect x={180} y={110} width={120} height={30} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      <rect x={180} y={230} width={120} height={40} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      <text x={240} y={320} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={34} fill="#141018">Printer: fixed ✓</text>
    </g>
  </g>
);
// Priya's desktop (the screen share that never works). shift moves one folder.
export const Desktop: React.FC<{ shift?: number }> = ({ shift = 0 }) => {
  const names = ["notes_FINAL", "notes_final_v7", "Q4 sync (2)", "untitled", "cat pics", "agenda_agenda", "meeting re meeting", "New Folder (9)"];
  return (
    <g>
      <rect width={480} height={370} fill="#5E7FB8" />
      <circle cx={380} cy={280} r={60} fill="#F2B880" opacity={0.6} />
      {names.map((n, i) => {
        const x = 24 + (i % 4) * 112 + (i === 3 ? shift * 120 : 0), y = 30 + Math.floor(i / 4) * 120 + (i === 3 ? shift * 120 : 0);
        return (
          <g key={n} transform={`translate(${x} ${y})`}>
            <path d="M0,10 L26,10 L34,0 L70,0 L70,56 L0,56 Z" fill="#FFD36E" stroke={INK} strokeWidth={3} />
            <text x={35} y={78} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={13} fill="#FFFFFF">{n}</text>
          </g>
        );
      })}
      <rect y={340} width={480} height={30} fill="#1C2130" opacity={0.85} />
    </g>
  );
};

// Calendar pop-up card (frame space, centered at cx, cy). urgent/follow-up variants.
export const CalendarPopup: React.FC<{ cx: number; cy: number; s?: number; title: string; sub: string; red?: boolean; k?: number }> = ({ cx, cy, s = 1, title, sub, red = true, k = 1 }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s * (0.8 + 0.2 * k)})`} opacity={Math.min(1, k * 2)}>
    <rect x={-412} y={-150} width={840} height={316} rx={36} fill="#000" opacity={0.3} />
    <rect x={-420} y={-160} width={840} height={316} rx={36} fill="#FFFFFF" stroke={INK} strokeWidth={SW} />
    <rect x={-380} y={-120} width={110} height={110} rx={22} fill={red ? Q.red : Q.slide} />
    <text x={-325} y={-48} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={54} fill="#FFFFFF">25</text>
    <text x={-240} y={-80} fontFamily={font} fontWeight={900} fontSize={42} fill={red ? "#C0392B" : "#141018"}>{title}</text>
    <text x={-240} y={-28} fontFamily={font} fontWeight={600} fontSize={34} fill="#4A4040">{sub}</text>
    <rect x={-380} y={30} width={360} height={90} rx={18} fill={Q.slide} />
    <text x={-200} y={90} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={36} fill="#FFFFFF">Accept</text>
    <rect x={20} y={30} width={360} height={90} rx={18} fill="#E6E8EC" stroke="#B8BDC7" strokeWidth={3} />
    <text x={200} y={90} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={36} fill="#8A93A6">Decline</text>
  </g>
);

// Laptop screen with solitaire (screen-local 0..900 x 0..600). t drives the win cascade.
export const Solitaire: React.FC<{ frame: number; t?: number }> = ({ frame, t = 0 }) => (
  <g>
    <rect width={900} height={600} fill="#2E7D4F" />
    {Array.from({ length: 7 }).map((_, c) => Array.from({ length: c + 1 }).map((__, r) => (
      <rect key={`${c}-${r}`} x={40 + c * 120} y={180 + r * 34} width={96} height={130} rx={8} fill={r === c ? "#FFFFFF" : "#3A6FD8"} stroke={INK} strokeWidth={3} />
    )))}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={400 + i * 120} y={30} width={96} height={130} rx={8} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.5} />)}
    {t > 0 && Array.from({ length: 14 }).map((_, i) => {
      const ph = t * 3 - i * 0.12; if (ph <= 0) return null;
      const x = 450 + i * 20 + ph * 200 * Math.cos(i), y = 100 + ph * ph * 400 * 0.5 - Math.abs(Math.sin(ph * 6)) * 80;
      return <rect key={`w${i}`} x={x % 900} y={Math.min(y, 470)} width={96} height={130} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={3} />;
    })}
    <text x={40} y={90} fontFamily={font} fontWeight={800} fontSize={34} fill="#FFFFFF" opacity={0.9}>"Meeting notes"</text>
  </g>
);

// Mochi lock screen for Theo's phone (phone screen-local 0..520 x 0..1000).
export const MochiLock: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect width={520} height={1000} fill="#FFE3A6" />
    <rect y={620} width={520} height={380} fill="#E8A36A" />
    <circle cx={420} cy={180} r={70} fill="#FFF3C4" />
    <g transform="translate(260 640)"><Mochi x={0} y={0} s={2.3} frame={frame} pose="sleep" /></g>
    <text x={260} y={150} textAnchor="middle" fontFamily={font} fontWeight={300} fontSize={96} fill="#FFFFFF">10:41</text>
    <text x={260} y={200} textAnchor="middle" fontFamily={font} fontWeight={600} fontSize={28} fill="#FFFFFF">Tuesday</text>
  </g>
);

// ---------------------------------------------------------------- ENERGY meter (same tag family as BUSY./OUT OF OFFICE.)
export const EnergyTag: React.FC<{ x: number; y: number; pct: number; age: number; s?: number }> = ({ x, y, pct, age, s = 1 }) => {
  if (age < 0) return null;
  const pop = age < 6 ? 0.6 + 0.4 * Math.min(1, age / 3) + 0.12 * Math.sin(Math.min(1, age / 6) * Math.PI) : 1;
  const W = 560, H = 196;
  const col = pct > 60 ? Q.green : pct > 25 ? Q.bolt : Q.red;
  return (
    <g transform={`translate(${x + W / 2} ${y + H / 2}) scale(${s * pop}) translate(${-W / 2} ${-H / 2})`}>
      <rect x={6} y={10} width={W} height={H} rx={34} fill="#000" opacity={0.35} />
      <rect width={W} height={H} rx={34} fill={Q.tag} stroke={INK} strokeWidth={SW} />
      <rect x={18} y={16} width={110} height={36} rx={18} fill="#FFC93C" />
      <text x={73} y={44} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={26} fill={Q.tag}>THEO</text>
      <path d="M156,16 L140,40 L152,40 L146,58 L166,30 L154,30 Z" fill={Q.bolt} />
      <rect x={186} y={20} width={350} height={28} rx={14} fill="#33424D" />
      <rect x={186} y={20} width={350 * Math.max(0, Math.min(1, pct / 100))} height={28} rx={14} fill={col} />
      <line x1={22} y1={80} x2={W - 22} y2={80} stroke="#FFFFFF" strokeWidth={3} opacity={0.25} />
      <text x={30} y={150} fontFamily={font} fontWeight={900} fontSize={58} fill="#FFFFFF" letterSpacing={-1}>ENERGY:</text>
      <text x={W - 30} y={152} textAnchor="end" fontFamily={font} fontWeight={900} fontSize={68} fill={col}>{Math.round(pct)}%</text>
    </g>
  );
};

export { rnd };
