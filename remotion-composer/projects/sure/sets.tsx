import React from "react";
import { C, INK, SW, Mochi } from "../later/art";
import { rnd } from "../we-need-to-talk/vart";
import { S, Sure } from "./sart";

// SURE. — new sets, authored in 9:16 frame space (x 0..1080, y 0..1920) with bleed.

const ink = { stroke: INK, strokeWidth: SW, strokeLinejoin: "round" as const };
const font = "'Helvetica Neue', Arial, sans-serif";

// Phone body; children render inside the screen (screen local: 0..520 x 0..1000).
export const PhoneBody: React.FC<{ x: number; y: number; s?: number; r?: number; children?: React.ReactNode; id: string }> = ({ x, y, s = 1, r = 0, children, id }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-300} y={-560} width={600} height={1120} rx={70} fill="#20222A" {...ink} />
    <defs><clipPath id={id}><rect x={-260} y={-500} width={520} height={1000} rx={40} /></clipPath></defs>
    <g clipPath={`url(#${id})`}><g transform="translate(-260 -500)">{children}</g></g>
    <rect x={-60} y={-536} width={120} height={18} rx={9} fill="#0E0F14" />
  </g>
);

// Incoming call from MOM over a lock-screen photo of Mochi.
export const CallScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = 1 + 0.08 * Math.sin(frame * 0.5);
  return (
    <g>
      <rect width={520} height={1000} fill="#F2B880" />
      <rect y={560} width={520} height={440} fill="#E8A36A" />
      <g transform="translate(260 560)"><Mochi x={0} y={0} s={2.2} frame={frame} pose="sleep" /></g>
      <rect width={520} height={1000} fill="#141018" opacity={0.35} />
      <text x={260} y={150} textAnchor="middle" fontFamily={font} fontWeight={500} fontSize={34} fill="#FFFFFF" opacity={0.85}>incoming call</text>
      <text x={260} y={240} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={86} fill="#FFFFFF">MOM ❤️</text>
      <g transform={`translate(130 860) scale(${pulse})`}><circle r={62} fill="#E0504A" /><rect x={-30} y={-9} width={60} height={18} rx={9} fill="#FFFFFF" transform="rotate(135)" /></g>
      <g transform={`translate(390 860) scale(${pulse})`}><circle r={62} fill="#3DBE62" /><path d="M-24,10 Q0,-30 24,10" fill="none" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" /></g>
    </g>
  );
};

// Week calendar that overflows: event blocks stack up and spill off the top of the screen.
const EVENTS = ["Cover report", "Help Dev move", "3 desserts", "Team lunch", "Fix printer", "Bake sale", "Walk Gary's dog", "Tax help", "Read script", "Babysit", "IT ticket", "Pick up cake", "Plan party", "Proofread", "Airport run", "Paint fence"];
export const CalendarScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const shown = Math.min(EVENTS.length, Math.floor(frame / 2.2) + 2);
  return (
    <g>
      <rect width={520} height={1000} fill="#F7F5EF" />
      <rect width={520} height={110} fill="#5E7FB8" />
      <text x={30} y={74} fontFamily={font} fontWeight={800} fontSize={44} fill="#FFFFFF">This week</text>
      {Array.from({ length: 7 }).map((_, i) => <line key={i} x1={0} y1={170 + i * 120} x2={520} y2={170 + i * 120} stroke="#DDD8CC" strokeWidth={3} />)}
      {Array.from({ length: shown }).map((_, i) => {
        const age = frame - i * 2.2;
        const drop = Math.min(1, age / 4);
        const baseY = 900 - i * 92 + (1 - drop) * -160 - Math.max(0, frame - 24) * 14;
        const col = S.noteColors[i % 5];
        return (
          <g key={i} transform={`translate(${30 + (i % 2) * 14} ${baseY}) rotate(${(rnd(i) - 0.5) * 6})`}>
            <rect width={460} height={82} rx={14} fill={col} stroke={INK} strokeWidth={4} />
            <text x={24} y={54} fontFamily={font} fontWeight={700} fontSize={38} fill="#3A2E28">{EVENTS[i]}</text>
          </g>
        );
      })}
    </g>
  );
};

// Night window: dark glass, city lights, the room behind Theo faintly reflected. Theo's reflection is drawn by the shot.
export const NightWindow: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={2600} fill="#0B1030" />
    {Array.from({ length: 9 }).map((_, i) => {
      const x = -80 + i * 140, top = 900 + rnd(i * 3.1) * 420;
      return (
        <g key={i}>
          <rect x={x} y={top} width={120} height={1500 - top} fill="#141A44" />
          {Array.from({ length: 14 }).map((__, k) => rnd(i * 31 + k) > 0.5 && (
            <rect key={k} x={x + 14 + (k % 3) * 34} y={top + 24 + Math.floor(k / 3) * 60} width={18} height={26} fill="#FFD98A" opacity={0.5 + 0.4 * Math.sin(frame * 0.05 + k)} />
          ))}
        </g>
      );
    })}
    {/* reflected desk lamp glow + window mullions */}
    <circle cx={880} cy={1180} r={160} fill="#FFE3A6" opacity={0.12} />
    <rect x={-300} y={-300} width={1700} height={2600} fill="#8FB0FF" opacity={0.05} />
    <rect x={526} y={-300} width={28} height={2600} fill="#2A2E46" {...ink} />
    <rect x={-300} y={1500} width={1700} height={30} fill="#2A2E46" {...ink} />
    <path d="M120,-300 L-120,2300 M300,-300 L60,2300" stroke="#FFFFFF" strokeWidth={40} opacity={0.035} />
  </g>
);

// A row of Sures standing on a ledge (partition top / monitor), for the night whisper shot.
export const SureRow: React.FC<{ n: number; x0: number; x1: number; y: number; s: number; frame: number; whisper?: boolean; frozen?: boolean; mouth?: number }> = ({ n, x0, x1, y, s, frame, whisper, frozen, mouth = 0 }) => (
  <g>{Array.from({ length: n }).map((_, i) => <Sure key={i} x={x0 + (x1 - x0) * (i / Math.max(1, n - 1))} y={y - 110 * s} s={s * (0.9 + rnd(i) * 0.2)} frame={frame} phase={i * 1.1} whisper={whisper} frozen={frozen} mouth={mouth} thumbs={!whisper} />)}</g>
);

// Night lighting for the office (room coords): navy wash with a warm lamp pool and monitor glow.
export const NightOffice: React.FC<{ id: string; lampX?: number; lampY?: number; strength?: number }> = ({ id, lampX = 1180, lampY = 470, strength = 0.82 }) => (
  <g>
    <defs>
      <radialGradient id={`${id}-d`} cx={lampX} cy={lampY} r={620} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#070A24" stopOpacity={0} />
        <stop offset="0.35" stopColor="#070A24" stopOpacity={strength * 0.4} />
        <stop offset="1" stopColor="#070A24" stopOpacity={strength} />
      </radialGradient>
      <radialGradient id={`${id}-g`} cx={lampX} cy={lampY} r={300} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFD98A" stopOpacity={0.28} />
        <stop offset="1" stopColor="#FFD98A" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-2000} y={-2000} width={6000} height={6000} fill={`url(#${id}-d)`} />
    <rect x={-2000} y={-2000} width={6000} height={6000} fill={`url(#${id}-g)`} />
  </g>
);

// Desk lamp prop (room coords, sits on the office desk).
export const DeskLamp: React.FC = () => (
  <g>
    <ellipse cx={1520} cy={592} rx={42} ry={9} fill={C.woodDark} {...ink} />
    <path d="M1520,590 L1500,500 L1450,450" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1520,590 L1500,500 L1450,450" fill="none" stroke="#3E6E8E" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1470,440 L1395,412 L1380,462 L1445,484 Z" fill="#3E6E8E" {...ink} />
    <ellipse cx={1412} cy={476} rx={20} ry={8} fill="#FFF1B8" />
  </g>
);

// A single sticky note falling (frame space or room space), with flutter.
export const FallingNote: React.FC<{ x: number; y: number; t: number; color?: string; s?: number }> = ({ x, y, t, color = S.note, s = 1 }) => {
  if (t < 0) return null;
  const fy = y + t * 260 + t * t * 120;
  const fx = x + Math.sin(t * 6) * 40;
  return (
    <g transform={`translate(${fx} ${fy}) rotate(${Math.sin(t * 5) * 35}) scale(${s} ${s * (0.6 + 0.4 * Math.abs(Math.cos(t * 5)))})`}>
      <rect x={-28} y={-28} width={56} height={56} fill={color} stroke={INK} strokeWidth={4} />
    </g>
  );
};
