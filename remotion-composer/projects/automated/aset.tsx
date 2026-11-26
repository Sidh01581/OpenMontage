import React from "react";
import { INK, SW } from "../later/art";
import { P } from "../we-need-to-talk/vart";
import { DevSeated } from "../busy/bart2";
import { CoffeeCup } from "../busy/bart";
import { DeskBack, PART_TOP, DEV, W } from "../password-nightmare/part";
import { Robot, BoxBack, BoxFront, R } from "./robot";

// AUTOMATED. — Dev's desk world (BUSY./PASSWORD NIGHTMARE. desk, frame space at zoom 1) widened so the robot can stand on it.
// Desk-local coords = DevSeated's (origin Dev's hip at DEV, scale 1.5): desk top y = -40; robot stands at local x 214; keyboard x 250..360; monitor x 470.
const font = "'Helvetica Neue', Arial, sans-serif";
export const ROBOT_X = 214, ROBOT_S = 0.62, KEY_X = 250;

export const Partition: React.FC = () => (
  <g>
    <rect x={-800} y={PART_TOP} width={2700} height={530} fill={P.partition} stroke={INK} strokeWidth={SW} />
    {Array.from({ length: 16 }).map((_, i) => <line key={i} x1={-700 + i * 160} y1={PART_TOP + 24} x2={-700 + i * 160} y2={1470} stroke={P.partitionShade} strokeWidth={4} />)}
    <rect x={-810} y={PART_TOP - 14} width={2720} height={22} rx={6} fill={P.trim} stroke={INK} strokeWidth={SW} />
    <rect x={40} y={1010} width={60} height={60} fill="#FFE27A" stroke={INK} strokeWidth={3} transform="rotate(-6 70 1040)" />
    <rect x={430} y={1000} width={130} height={80} fill="#F4EEE2" stroke={INK} strokeWidth={3} />
    <text x={495} y={1036} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={19} fill="#C0392B">Q4 REPORTS</text>
    <text x={495} y={1060} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={19} fill="#C0392B">DUE TODAY!</text>
  </g>
);

type DevProps = Partial<React.ComponentProps<typeof DevSeated>>;
type RobotProps = Partial<React.ComponentProps<typeof Robot>>;
// The whole desk: Dev (rolled back by devDx when the robot works), widened desk, keyboard, monitor, coffee, robot or its box.
export const AutoDesk: React.FC<{ frame: number; devDx?: number; dev?: DevProps; robot?: RobotProps | null; box?: { k: number; rise: number } | null; typing?: number; screen?: React.ReactNode;
    behind?: React.ReactNode; front?: React.ReactNode; seat?: React.ReactNode; keyX?: number; showDev?: boolean }> =
  ({ frame, devDx = 0, dev = {}, robot = {}, box = null, typing = 0, screen, behind, front, seat, keyX = KEY_X, showDev = true }) => {
    const KEY_X = keyX;
    const rise = box ? box.rise : 1;
    return (
      <>
        <DeskBack frame={frame} />
        {behind}
        <Partition />
        {showDev && <DevSeated x={DEV.x + devDx * DEV.s} y={DEV.y} s={DEV.s} frame={frame} pose="upright" lookX={17} lookY={3} natural deskless coffeeOnDesk={false} {...dev} />}
        {seat}
        <g transform={`translate(${DEV.x} ${DEV.y}) scale(${DEV.s})`}>
          {/* widened desk */}
          <rect x={40} y={-40} width={720} height={24} rx={5} fill={P.deskTop} stroke={INK} strokeWidth={SW} />
          <rect x={700} y={-16} width={20} height={170} fill={P.metal} stroke={INK} strokeWidth={SW} />
          {/* monitor (side view, screen faces left toward the robot/Dev) */}
          <rect x={468} y={-60} width={70} height={14} rx={5} fill={P.metal} stroke={INK} strokeWidth={5} />
          <rect x={496} y={-130} width={14} height={76} fill={P.metal} stroke={INK} strokeWidth={5} />
          <path d="M470,-320 L510,-326 L516,-120 L476,-116 Z" fill="#3A3F4A" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M472,-316 L478,-120" stroke={typing > 0 ? "#BFE3FF" : "#CFE3FF"} strokeWidth={6} strokeLinecap="round" />
          {screen}
          <g transform={`translate(${keyX < 200 ? 420 : 120} -40)`}><CoffeeCup frame={frame} s={0.62} steam /></g>
          {box && <BoxBack x={ROBOT_X} y={-40} s={0.62} k={box.k} />}
          {/* keyboard */}
          <path d={`M${KEY_X},-44 L${KEY_X + 112},-44 L${KEY_X + 108},-56 L${KEY_X + 4},-56 Z`} fill="#3A3F4A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          {typing > 0.5 && [0, 1, 2, 3].map((i) => <rect key={i} x={KEY_X + 8 + ((frame * 29 + i * 31) % 96)} y={-66 - ((frame * 5 + i * 7) % 16)} width={9} height={7} fill="#E6E8EC" stroke={INK} strokeWidth={2} />)}
          {robot && (
            <g>
              {box && <clipPath id="boxclip"><rect x={ROBOT_X - 200} y={-600} width={400} height={560} /></clipPath>}
              <g clipPath={box ? "url(#boxclip)" : undefined}>
                <Robot x={ROBOT_X} y={-40 + (1 - rise) * 200} s={ROBOT_S} frame={frame} face={0.55} reach={(KEY_X + 40 - ROBOT_X) / ROBOT_S} keyY={-22} {...robot} />
              </g>
            </g>
          )}
          {box && <BoxFront x={ROBOT_X} y={-40} s={0.62} />}
        </g>
        {front}
      </>
    );
  };

// ---------------------------------------------------------------- install screen (inside password-nightmare's Monitor, 900x640 screen space)
export const InstallWindow: React.FC<{ frame: number; clickAt: number; progress: number }> = ({ frame, clickAt, progress }) => {
  const pressed = frame >= clickAt && frame < clickAt + 3;
  const installing = frame >= clickAt;
  return (
    <g>
      <rect x={60} y={50} width={780} height={520} rx={22} fill="#000" opacity={0.3} transform="translate(8 10)" />
      <rect x={60} y={50} width={780} height={520} rx={22} fill={W.win} stroke={INK} strokeWidth={5} />
      <path d="M60,72 Q60,50 82,50 L818,50 Q840,50 840,72 L840,112 L60,112 Z" fill="#14B8A6" />
      <text x={92} y={93} fontFamily={font} fontWeight={800} fontSize={28} fill="#FFFFFF">AutoWork AI — Setup</text>
      {/* mini robot head icon */}
      <g transform="translate(200 390) scale(0.85)">
        <circle cx={-90} cy={-210} r={17} fill={R.accent} stroke={INK} strokeWidth={5} />
        <circle cx={90} cy={-210} r={17} fill={R.accent} stroke={INK} strokeWidth={5} />
        <rect x={-88} y={-272} width={176} height={124} rx={44} fill={R.shell} stroke={INK} strokeWidth={SW} />
        <rect x={-68} y={-256} width={136} height={92} rx={30} fill={R.screen} stroke={INK} strokeWidth={4} />
        <rect x={-39} y={-228} width={18} height={28} rx={9} fill={R.glow} />
        <rect x={21} y={-228} width={18} height={28} rx={9} fill={R.glow} />
        <path d="M-18,-188 Q0,-172 18,-188" fill="none" stroke={R.glow} strokeWidth={6} strokeLinecap="round" />
      </g>
      <text x={340} y={198} fontFamily={font} fontWeight={900} fontSize={46} fill={W.text}>I'll do your job</text>
      <text x={340} y={252} fontFamily={font} fontWeight={900} fontSize={46} fill={W.text}>for you.</text>
      <text x={340} y={300} fontFamily={font} fontWeight={700} fontSize={28} fill={W.sub}>No more work. Ever. ✨</text>
      {!installing && (
        <g>
          <rect x={250} y={380} width={400} height={110} rx={22} fill={pressed ? "#1E9E58" : W.green} stroke={INK} strokeWidth={5} />
          <text x={450} y={452} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={54} fill="#FFFFFF">INSTALL</text>
        </g>
      )}
      {installing && (
        <g>
          <rect x={150} y={400} width={600} height={50} rx={25} fill="#D9DEE6" stroke={INK} strokeWidth={4} />
          <rect x={150} y={400} width={600 * Math.max(0.04, Math.min(1, progress))} height={50} rx={25} fill={W.green} />
          <text x={450} y={510} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={34} fill={W.text}>{progress >= 1 ? "Done! Meet your new AI ✓" : `Installing… ${Math.round(progress * 100)}%`}</text>
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- tag meter (same style as PATIENCE / ENERGY tags)
export const Tag: React.FC<{ x: number; y: number; who: string; whoColor: string; label: string; pct: number; value?: string; age: number; s?: number; hit?: number; icon?: React.ReactNode; colorByPct?: boolean }> =
  ({ x, y, who, whoColor, label, pct, value, age, s = 1, hit = 0, icon, colorByPct = true }) => {
    if (age < 0) return null;
    const pop = age < 6 ? 0.6 + 0.4 * Math.min(1, age / 3) + 0.12 * Math.sin(Math.min(1, age / 6) * Math.PI) : 1;
    const Wd = 560, H = 196;
    const col = !colorByPct ? "#6FF3FF" : pct > 60 ? "#5BE37A" : pct > 25 ? W.amber : "#FF6B6B";
    const jx = Math.sin(age * 3.3) * 8 * hit;
    const whoW = 26 + who.length * 19;
    return (
      <g transform={`translate(${x + Wd / 2 + jx} ${y + H / 2}) scale(${s * pop * (1 + 0.05 * hit)}) translate(${-Wd / 2} ${-H / 2})`}>
        <rect x={6} y={10} width={Wd} height={H} rx={34} fill="#000" opacity={0.35} />
        <rect width={Wd} height={H} rx={34} fill={W.tag} stroke={INK} strokeWidth={SW} />
        <rect x={18} y={16} width={whoW} height={36} rx={18} fill={whoColor} />
        <text x={18 + whoW / 2} y={44} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={26} fill={W.tag}>{who}</text>
        <g transform={`translate(${18 + whoW + 30} 34)`}>{icon}</g>
        <rect x={whoW + 86} y={20} width={Wd - whoW - 110} height={28} rx={14} fill="#33424D" />
        <rect x={whoW + 86} y={20} width={(Wd - whoW - 110) * Math.max(0, Math.min(1, pct / 100))} height={28} rx={14} fill={col} />
        <line x1={22} y1={80} x2={Wd - 22} y2={80} stroke="#FFFFFF" strokeWidth={3} opacity={0.25} />
        <text x={30} y={150} fontFamily={font} fontWeight={900} fontSize={54} fill="#FFFFFF" letterSpacing={-1}>{label}</text>
        <text x={Wd - 30} y={152} textAnchor="end" fontFamily={font} fontWeight={900} fontSize={value && value.length > 4 ? 48 : 68} fill={col}>{value ?? `${Math.round(pct)}%`}</text>
      </g>
    );
  };
export const BriefcaseIcon: React.FC = () => (
  <g>
    <rect x={-16} y={-8} width={32} height={22} rx={4} fill={W.amber} />
    <path d="M-7,-8 L-7,-14 L7,-14 L7,-8" fill="none" stroke={W.amber} strokeWidth={4} />
  </g>
);
export const EffortTag: React.FC<{ pct: number; age: number; y?: number; x?: number; hit?: number }> = ({ pct, age, y = 270, x = 260, hit = 0 }) =>
  <Tag x={x} y={y} who="DEV" whoColor={W.dev} label="EFFORT:" pct={pct} age={age} hit={hit} icon={<BriefcaseIcon />} />;

// EMAILS SENT counter tag (robot chip, cyan bar = share of 5,000).
export const MailIcon: React.FC = () => (
  <g><rect x={-16} y={-10} width={32} height={22} rx={3} fill="#6FF3FF" /><path d="M-16,-10 L0,4 L16,-10" fill="none" stroke="#1C2A33" strokeWidth={3} /></g>
);
export const EmailTag: React.FC<{ n: number; age: number; y?: number; x?: number; hit?: number }> = ({ n, age, y = 270, x = 260, hit = 0 }) =>
  <Tag x={x} y={y} who="AI" whoColor={R.glow} label="EMAILS SENT:" pct={Math.min(100, (n / 5000) * 100)} value={Math.round(n).toLocaleString("en-US")} age={age} hit={hit} icon={<MailIcon />} colorByPct={false} />;

// Outbox window for the monitor ECU (900 x 640 screen space). n rows shown, newest at the top.
export const OutboxWindow: React.FC<{ frame: number; n: number }> = ({ frame, n }) => {
  const rows = Math.max(0, Math.floor(n));
  return (
    <g>
      <rect width={900} height={640} fill={W.win} />
      <rect width={900} height={70} fill="#14B8A6" />
      <text x={30} y={47} fontFamily={font} fontWeight={800} fontSize={30} fill="#FFFFFF">AutoWork AI — Outbox</text>
      <text x={870} y={47} textAnchor="end" fontFamily={font} fontWeight={800} fontSize={26} fill="#FFFFFF">Sending…</text>
      {Array.from({ length: 8 }).map((_, i) => {
        const k = rows - i; if (k <= 0) return null;
        const fresh = i === 0 && frame % 4 < 2;
        return (
          <g key={k} transform={`translate(0 ${90 + i * 68})`}>
            <rect x={20} width={860} height={58} rx={10} fill={fresh ? "#D9FBF5" : "#FFFFFF"} stroke="#D3D9E2" strokeWidth={2} />
            <circle cx={50} cy={29} r={14} fill={W.green} />
            <path d="M43,29 L48,35 L58,22" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
            <text x={78} y={26} fontFamily={font} fontWeight={800} fontSize={22} fill={W.text}>To: EVERYONE@company.com</text>
            <text x={78} y={49} fontFamily={font} fontWeight={600} fontSize={19} fill={W.sub}>{`Re: Re: Quick update #${k}`}</text>
            <text x={860} y={36} textAnchor="end" fontFamily={font} fontWeight={800} fontSize={20} fill={W.green}>Sent ✓</text>
          </g>
        );
      })}
    </g>
  );
};
