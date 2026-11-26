import React from "react";
import { INK, SW, Limb, Pt } from "../later/art";
import { ik } from "../busy/bart2";

// AUTOMATED. — Dev's AI robot ("AutoWork AI"). A small, friendly desk robot in the cast's outline style.
// Local origin = bottom centre of the tread base (stands on a surface at y = 0). Height ~ 316 units.
// The robot is always drawn in a gentle 3/4 view: `face` shifts the screen features toward the way it is looking (-1 left .. 1 right).

export const R = {
  shell: "#F4F7FB", shade: "#D6DEE8", deep: "#B7C2D0", metal: "#8C97A6", tread: "#4A5260",
  screen: "#1B2440", glow: "#6FF3FF", accent: "#3FA9F5", red: "#FF5A5F", warm: "#FFC93C",
};

export type RobotExpr = "happy" | "neutral" | "joy" | "blink" | "focus" | "proud";
export type RobotPose = "idle" | "wave" | "type" | "thumbs" | "hold";

export const RobotFace: React.FC<{ expr?: RobotExpr; talk?: number; face?: number; lookY?: number; frame?: number }> = ({ expr = "happy", talk = 0, face = 0, lookY = 0, frame = 0 }) => {
  const fx = face * 22, fy = lookY * 6;
  // automatic blink every ~3.5 s (2 frames), unless the expression is a special eye shape
  const autoBlink = (frame % 84) >= 80;
  const eye = (x: number) => {
    const cx = x + fx, cy = -214 + fy;
    if (expr === "joy" || expr === "proud") return <path d={`M${cx - 13},${cy + 6} Q${cx},${cy - 14} ${cx + 13},${cy + 6}`} fill="none" stroke={R.glow} strokeWidth={8} strokeLinecap="round" />;
    if (expr === "blink" || autoBlink) return <line x1={cx - 12} y1={cy} x2={cx + 12} y2={cy} stroke={R.glow} strokeWidth={7} strokeLinecap="round" />;
    if (expr === "focus") return <rect x={cx - 11} y={cy - 6} width={22} height={12} rx={6} fill={R.glow} />;
    return <rect x={cx - 9} y={cy - 14} width={18} height={28} rx={9} fill={R.glow} />;
  };
  const my = -184 + fy, mx = fx;
  const open = Math.max(0, Math.min(1, talk));
  return (
    <g>
      {eye(-30)}{eye(30)}
      {open > 0.08
        ? <rect x={mx - 14 - open * 4} y={my - 6 - open * 8} width={28 + open * 8} height={10 + open * 16} rx={9} fill={R.glow} />
        : expr === "neutral" || expr === "focus"
          ? <line x1={mx - 14} y1={my} x2={mx + 14} y2={my} stroke={R.glow} strokeWidth={6} strokeLinecap="round" />
          : <path d={`M${mx - 18},${my - 4} Q${mx},${my + 12} ${mx + 18},${my - 4}`} fill="none" stroke={R.glow} strokeWidth={6} strokeLinecap="round" />}
      {(expr === "happy" || expr === "joy" || expr === "proud") && <>
        <ellipse cx={-50 + fx} cy={-192 + fy} rx={9} ry={5} fill="#FF7EB6" opacity={0.55} />
        <ellipse cx={50 + fx} cy={-192 + fy} rx={9} ry={5} fill="#FF7EB6" opacity={0.55} />
      </>}
    </g>
  );
};

// Lanyard + Dev's ID card hanging on the robot's chest (button of the film). k 0..1 = the lanyard drops on.
export const RobotLanyard: React.FC<{ k?: number }> = ({ k = 1 }) => {
  if (k <= 0) return null;
  const dy = (1 - k) * -90;
  return (
    <g transform={`translate(0 ${dy})`} opacity={Math.min(1, k * 3)}>
      <path d="M-30,-140 L-8,-96 M30,-140 L8,-96" stroke="#2F6FD6" strokeWidth={7} strokeLinecap="round" />
      <rect x={-24} y={-98} width={48} height={40} rx={5} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      <rect x={-24} y={-98} width={48} height={11} rx={4} fill="#2F6FD6" />
      <circle cx={-10} cy={-72} r={7} fill="#E8833A" />
      <rect x={1} y={-78} width={17} height={4} rx={2} fill={INK} opacity={0.7} />
      <rect x={1} y={-70} width={12} height={4} rx={2} fill={INK} opacity={0.4} />
    </g>
  );
};

export const Robot: React.FC<{
  x: number; y: number; s?: number; frame: number;
  pose?: RobotPose; expr?: RobotExpr; talk?: number; face?: number; lookY?: number;
  typeSpeed?: number; // type: hands blur over keys at (reach, keyY) relative to the robot
  reach?: number; keyY?: number;
  wave?: number; // wave: 0..1 arm raise
  antenna?: number; // 0..1 extra antenna glow (email sent blink)
  lanyard?: number; // 0..1
  hold?: React.ReactNode; // hold: drawn at the front hand
  bob?: boolean; flip?: boolean;
}> = ({ x, y, s = 1, frame, pose = "idle", expr = "happy", talk = 0, face = 0, lookY = 0, typeSpeed = 0, reach = 120, keyY = -40, wave = 1, antenna = 0, lanyard = 0, hold, bob = true, flip = false }) => {
  const b = bob ? Math.sin(frame * 0.18) * 2.5 : 0; // idle hover bob of the upper body
  const shF: Pt = [54 + face * 6, -118 + b], shB: Pt = [-54 + face * 6, -118 + b];
  const jit = (k: number) => (typeSpeed > 0 ? Math.sin(frame * typeSpeed * 1.7 + k) * 7 : 0);
  let hF: Pt = [72, -22], hB: Pt = [-72, -22];
  if (pose === "wave") {
    const w = Math.sin(frame * 0.55) * 18 * wave;
    hF = [lerp(72, 112 + w, wave), lerp(-22, -236, wave)];
  }
  if (pose === "type") { hF = [reach + 26 + jit(0), keyY + jit(1.3) * 0.6]; hB = [reach - 22 + jit(2.2), keyY + jit(3.1) * 0.6]; }
  if (pose === "thumbs") hF = [104, -168];
  if (pose === "hold") hF = [98, -96];
  const elF = ik(shF, hF, 52, 52, pose === "type" ? 1 : -1);
  const elB = ik(shB, hB, 52, 52, pose === "type" ? 1 : -1);
  const blur = typeSpeed > 1.2;
  const ant = 0.35 + 0.65 * Math.max(antenna, (frame % 48) < 6 ? 0.6 : 0);
  const arm = (sh: Pt, el: Pt, h: Pt, front: boolean) => (
    <g>
      <Limb d={`M${sh[0]},${sh[1]} L${el[0]},${el[1]} L${h[0]},${h[1]}`} color={front ? R.deep : R.metal} w={16} />
      <circle cx={el[0]} cy={el[1]} r={9} fill={R.shade} stroke={INK} strokeWidth={4} />
      {blur && [-1, 1].map((k) => <circle key={k} cx={h[0] + k * 14} cy={h[1] - 2} r={14} fill={R.shell} opacity={0.35} />)}
      {pose === "thumbs" && front
        ? <g transform={`translate(${h[0]} ${h[1]})`}>
            <rect x={-19} y={-38} width={13} height={28} rx={6.5} fill={R.shell} stroke={INK} strokeWidth={4} transform="rotate(-10 -12 -12)" />
            <rect x={-20} y={-14} width={40} height={30} rx={11} fill={R.shell} stroke={INK} strokeWidth={5} />
            <path d="M-4,-8 L-4,10 M8,-8 L8,10" stroke={R.deep} strokeWidth={3} strokeLinecap="round" />
          </g>
        : <circle cx={h[0]} cy={h[1]} r={15} fill={front ? R.shell : R.shade} stroke={INK} strokeWidth={5} />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* back arm */}
      {arm(shB, elB, hB, false)}
      {/* tread base */}
      <rect x={-72} y={-30} width={144} height={30} rx={15} fill={R.tread} stroke={INK} strokeWidth={SW} />
      {[-44, 0, 44].map((cx) => <circle key={cx} cx={cx} cy={-15} r={8} fill={R.metal} stroke={INK} strokeWidth={3} />)}
      <rect x={-22} y={-48} width={44} height={22} fill={R.metal} stroke={INK} strokeWidth={5} />
      <g transform={`translate(0 ${b})`}>
        {/* body */}
        <rect x={-66} y={-146} width={132} height={102} rx={36} fill={R.shell} stroke={INK} strokeWidth={SW} />
        <path d={`M${-60},-110 Q-62,-56 -24,-50 L-40,-50 Q-62,-54 -62,-90 Z`} fill={R.shade} opacity={0.9} />
        <rect x={-30 + face * 16} y={-122} width={60} height={34} rx={9} fill={R.screen} stroke={INK} strokeWidth={4} />
        {[0, 1, 2].map((i) => <rect key={i} x={-22 + face * 16} y={-115 + i * 9} width={(i === 1 ? 30 : 44) * (0.6 + 0.4 * Math.abs(Math.sin(frame * 0.2 + i)))} height={5} rx={2.5} fill={i === 2 ? R.accent : R.glow} opacity={0.85} />)}
        <RobotLanyard k={lanyard} />
        {/* neck */}
        <rect x={-14} y={-166} width={28} height={24} fill={R.metal} stroke={INK} strokeWidth={5} />
        {/* head */}
        <g>
          <line x1={face * 10} y1={-272} x2={face * 12} y2={-306} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <circle cx={face * 12} cy={-312} r={18} fill={R.accent} opacity={0.25 * ant} />
          <circle cx={face * 12} cy={-312} r={10} fill={R.accent} stroke={INK} strokeWidth={4} />
          <circle cx={face * 12 - 3} cy={-315} r={3} fill="#FFFFFF" opacity={ant} />
          <circle cx={-90 + Math.max(0, -face) * 22} cy={-210} r={17 - Math.max(0, -face) * 5} fill={R.accent} stroke={INK} strokeWidth={5} />
          <circle cx={90 - Math.max(0, face) * 22} cy={-210} r={17 - Math.max(0, face) * 5} fill={R.accent} stroke={INK} strokeWidth={5} />
          <rect x={-88} y={-272} width={176} height={124} rx={44} fill={R.shell} stroke={INK} strokeWidth={SW} />
          <path d="M-80,-230 Q-82,-164 -36,-154 L-52,-154 Q-84,-160 -84,-200 Z" fill={R.shade} opacity={0.9} />
          <rect x={-68 + face * 14} y={-256} width={136} height={92} rx={30} fill={R.screen} stroke={INK} strokeWidth={4} />
          <path d={`M${-54 + face * 14},-244 Q${-40 + face * 14},-252 ${-20 + face * 14},-250`} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.25} fill="none" />
          <g transform={`translate(${face * 6} 0)`}>
            <RobotFace expr={expr} talk={talk} face={face} lookY={lookY} frame={frame} />
          </g>
        </g>
        {/* front arm */}
        {pose === "hold" && hold && <g transform={`translate(${hF[0]} ${hF[1]})`}>{hold}</g>}
        {arm(shF, elF, hF, true)}
      </g>
    </g>
  );
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Shipping box the robot unfolds from. k 0..1: flaps open; the robot rises from inside (draw the robot between back and front).
export const BoxBack: React.FC<{ x: number; y: number; s?: number; k: number }> = ({ x, y, s = 1, k }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-100} y={-150} width={200} height={150} fill="#B98A57" stroke={INK} strokeWidth={SW} />
    <g transform={`rotate(${-150 * k} -100 -150)`}><rect x={-100} y={-164} width={100} height={14} fill="#CFA06A" stroke={INK} strokeWidth={5} /></g>
    <g transform={`rotate(${150 * k} 100 -150)`}><rect x={0} y={-164} width={100} height={14} fill="#CFA06A" stroke={INK} strokeWidth={5} /></g>
  </g>
);
export const BoxFront: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-106} y={-122} width={212} height={122} fill="#CFA06A" stroke={INK} strokeWidth={SW} />
    <rect x={-74} y={-96} width={148} height={46} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
    <text x={0} y={-66} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={900} fontSize={24} fill="#2F6FD6">AutoWork AI</text>
    <path d="M-60,-30 L60,-30" stroke="#8E6A42" strokeWidth={4} opacity={0.6} />
  </g>
);
