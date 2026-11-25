import React from "react";
import { INK, SW } from "../later/art";
import { P, rnd, Priya, PriyaExpr } from "../we-need-to-talk/vart";
import { S, DevHead } from "../sure/sart";
import { DevWalker } from "../busy/bart";
import { O, ShirtTorso, Shades, Coconut, HORIZON } from "./oart";

// OUT OF OFFICE. — art for scenes 2–5: manager call screen, Priya on the phone, office alarm, server status + server room,
// Dev's laptop (on his lap) and its screen, beach bag, Dev walking to the sea, Dev waist-deep in the waves.

const font = "'Helvetica Neue', Arial, sans-serif";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------------------------------------------------------- phone: incoming call (screen-local 0..520 x 0..1000)
export const ManagerCall: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = 1 + 0.08 * Math.sin(frame * 0.6);
  return (
    <g>
      <defs><linearGradient id="mcbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF9A6B" /><stop offset="0.6" stopColor="#F2B880" /><stop offset="1" stopColor="#3DB6C8" /></linearGradient></defs>
      <rect width={520} height={1000} fill="url(#mcbg)" />
      <circle cx={260} cy={560} r={90} fill={O.sun} opacity={0.8} />
      <rect y={620} width={520} height={380} fill={O.sea} opacity={0.85} />
      <rect width={520} height={1000} fill="#141018" opacity={0.3} />
      <text x={260} y={150} textAnchor="middle" fontFamily={font} fontWeight={500} fontSize={34} fill="#FFFFFF" opacity={0.85}>incoming call</text>
      <text x={260} y={240} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={66} fill="#FFFFFF">MANAGER</text>
      <text x={260} y={312} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={66} fill="#FF6B6B">CALLING</text>
      <g transform={`translate(130 860) scale(${pulse})`}><circle r={62} fill="#E0504A" /><rect x={-30} y={-9} width={60} height={18} rx={9} fill="#FFFFFF" transform="rotate(135)" /></g>
      <g transform={`translate(390 860) scale(${pulse})`}><circle r={62} fill="#3DBE62" /><path d="M-24,10 Q0,-30 24,10" fill="none" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" /></g>
    </g>
  );
};

// ---------------------------------------------------------------- Priya on the phone (bust, faces screen LEFT; phone at her right ear)
export const PriyaPhone: React.FC<{ x: number; y: number; s?: number; frame: number; expr: PriyaExpr; talk?: number; panic?: number; lookX?: number; lookY?: number; headTilt?: number }> = ({ x, y, s = 1, frame, expr, talk = 0, panic = 0, lookX, lookY, headTilt = 0 }) => {
  const shake = panic * Math.sin(frame * 2.3) * 4;
  return (
    <g transform={`translate(${x + shake} ${y})`}>
      <Priya x={0} y={0} s={s} frame={frame} expr={expr} talk={talk} lookX={lookX} lookY={lookY} headTilt={headTilt} />
      <g transform={`scale(${s})`}>
        {/* arm up to the ear + phone */}
        <path d="M120,300 L150,170 L104,70" fill="none" stroke={INK} strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M120,300 L150,170 L104,70" fill="none" stroke={P.blazer} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={84} y={-40} width={30} height={96} rx={8} fill="#20222A" stroke={INK} strokeWidth={5} transform="rotate(12 99 8)" />
        <circle cx={104} cy={60} r={22} fill={P.pSkin} stroke={INK} strokeWidth={5} />
        {panic > 0 && [[-96, -70], [-110, -10]].map(([sx, sy], i) => {
          const ph = ((frame + i * 9) % 20) / 20;
          return <path key={i} d={`M${sx},${sy + ph * 40} q-8,14 0,20 q8,-6 0,-20 Z`} fill="#9FD3F0" stroke={INK} strokeWidth={3} opacity={1 - ph * 0.6} />;
        })}
      </g>
    </g>
  );
};

// Red rotating alarm light glow over a frame (frame space).
export const AlarmWash: React.FC<{ frame: number; k?: number }> = ({ frame, k = 1 }) => (
  <g>
    <rect width={1080} height={1920} fill="#FF2A2A" opacity={(0.1 + 0.12 * (0.5 + 0.5 * Math.sin(frame * 0.5))) * k} />
    <g transform={`translate(900 230)`}>
      <rect x={-50} y={0} width={100} height={30} rx={6} fill="#3A3F4A" stroke={INK} strokeWidth={5} />
      <path d="M-40,0 Q-40,-80 0,-80 Q40,-80 40,0 Z" fill="#FF3B3B" stroke={INK} strokeWidth={5} />
      <path d={`M0,-40 L${Math.cos(frame * 0.5) * 600},${-40 + Math.sin(frame * 0.5) * 300} L${Math.cos(frame * 0.5 + 0.3) * 600},${-40 + Math.sin(frame * 0.5 + 0.3) * 300} Z`} fill="#FF5A5A" opacity={0.25 * k} />
    </g>
  </g>
);

// Server status dashboard (screen-local 0..900 x 0..620). up = 0..1 fraction of services back online.
export const StatusScreen: React.FC<{ frame: number; up: number }> = ({ frame, up }) => {
  const names = ["API", "DATABASE", "LOGIN", "PAYMENTS", "EMAIL", "WEBSITE", "STORAGE", "SEARCH"];
  const allUp = up >= 0.999;
  return (
    <g>
      <rect width={900} height={620} fill="#141820" />
      <text x={30} y={60} fontFamily={font} fontWeight={900} fontSize={40} fill={allUp ? "#5BE37A" : (frame % 12 < 6 ? "#FF4B4B" : "#FF8A8A")}>{allUp ? "ALL SYSTEMS ONLINE" : "⚠ SYSTEM DOWN"}</text>
      {names.map((n, i) => {
        const ok = i < Math.round(up * names.length);
        return (
          <g key={n} transform={`translate(${30 + (i % 2) * 430} ${100 + Math.floor(i / 2) * 120})`}>
            <rect width={410} height={100} rx={12} fill={ok ? "#173A24" : "#3A1717"} stroke={ok ? "#5BE37A" : "#FF4B4B"} strokeWidth={4} />
            <circle cx={50} cy={50} r={22} fill={ok ? "#5BE37A" : (frame % 10 < 5 ? "#FF4B4B" : "#7A2020")} />
            <text x={90} y={62} fontFamily={font} fontWeight={800} fontSize={34} fill="#FFFFFF">{n}</text>
            <text x={390} y={62} textAnchor="end" fontFamily={font} fontWeight={800} fontSize={28} fill={ok ? "#5BE37A" : "#FF4B4B"}>{ok ? "OK" : "DOWN"}</text>
          </g>
        );
      })}
    </g>
  );
};

// Server room (frame space): racks of blinking LEDs; up = 0..1 sweeps red -> green from left to right.
export const ServerRoom: React.FC<{ frame: number; up: number }> = ({ frame, up }) => (
  <g>
    <rect width={1080} height={1920} fill="#1C2130" />
    <rect y={1500} width={1080} height={420} fill="#2A3040" />
    <line x1={0} y1={1500} x2={1080} y2={1500} stroke={INK} strokeWidth={SW} />
    {Array.from({ length: 4 }).map((_, c) => (
      <g key={c} transform={`translate(${40 + c * 260} 380)`}>
        <rect width={220} height={1120} rx={10} fill="#3A4152" stroke={INK} strokeWidth={SW} />
        {Array.from({ length: 16 }).map((__, r) => {
          const ok = (c + r / 16) / 4 < up;
          return (
            <g key={r} transform={`translate(16 ${20 + r * 68})`}>
              <rect width={188} height={54} rx={6} fill="#262B38" stroke={INK} strokeWidth={3} />
              {[0, 1, 2].map((k) => {
                const on = rnd(c * 101 + r * 7 + k + Math.floor(frame / 3)) > 0.3;
                return <circle key={k} cx={22 + k * 26} cy={27} r={8} fill={ok ? (on ? "#5BE37A" : "#2E6B3C") : (on ? "#FF4B4B" : "#6B2020")} />;
              })}
              <rect x={110} y={20} width={64} height={14} rx={4} fill="#11141C" />
            </g>
          );
        })}
      </g>
    ))}
    <rect width={1080} height={1920} fill={up >= 0.999 ? "#5BE37A" : "#FF4B4B"} opacity={0.08} />
  </g>
);

// ---------------------------------------------------------------- Dev's laptop (side view, sits on his thighs; DevLounge-local coords)
export const LapLaptop: React.FC<{ glow?: number; open?: number }> = ({ glow = 1, open = 1 }) => (
  <g transform="translate(50 -44) rotate(-14)">
    {glow > 0 && open > 0.8 && <ellipse cx={-40} cy={-100} rx={90} ry={70} fill="#BFE3FF" opacity={0.22 * glow} />}
    <rect x={-14} y={-10} width={176} height={22} rx={6} fill="#C9CED6" stroke={INK} strokeWidth={5} />
    <g transform={`rotate(${lerp(0, -108, open)} -10 -4)`}>
      <rect x={-12} y={-14} width={168} height={18} rx={6} fill="#A9B0BC" stroke={INK} strokeWidth={5} />
      <circle cx={70} cy={-5} r={5} fill="#F4F2EC" />
    </g>
  </g>
);

// Laptop screen CU (screen-local 0..900 x 0..600): terminal typing, progress bar, success.
export const LaptopScreen: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const lines = ["$ ssh prod-server", "> restarting services...", "> api ........ OK", "> database ... OK", "> login ...... OK", "> payments ... OK", "> deploy hotfix", "> all green"];
  const n = Math.floor(t * (lines.length + 2));
  const done = t >= 0.92;
  return (
    <g>
      <rect width={900} height={600} fill="#0E1116" />
      {lines.slice(0, n).map((l, i) => <text key={i} x={30} y={60 + i * 54} fontFamily="Menlo, monospace" fontWeight={700} fontSize={34} fill={l.includes("OK") || l.includes("green") ? "#5BE37A" : "#E6E8EC"}>{l}</text>)}
      {!done && frame % 10 < 5 && <rect x={30} y={60 + Math.min(n, lines.length) * 54 - 30} width={18} height={34} fill="#E6E8EC" />}
      <rect x={30} y={520} width={840} height={36} rx={10} fill="#22262E" stroke="#5BE37A" strokeWidth={3} />
      <rect x={30} y={520} width={840 * Math.min(1, t)} height={36} rx={10} fill="#5BE37A" />
      {done && (
        <g>
          <rect x={150} y={190} width={600} height={180} rx={24} fill="#173A24" stroke="#5BE37A" strokeWidth={6} />
          <text x={450} y={270} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={50} fill="#5BE37A">ALL SYSTEMS</text>
          <text x={450} y={335} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={50} fill="#5BE37A">ONLINE ✓</text>
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- beach bag (origin = bottom center)
export const BeachBag: React.FC<{ x: number; y: number; s?: number; r?: number; laptopIn?: number }> = ({ x, y, s = 1, r = 0, laptopIn = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-60,-120 Q0,-220 60,-120" fill="none" stroke={INK} strokeWidth={14} />
    <path d="M-60,-120 Q0,-220 60,-120" fill="none" stroke="#C9955E" strokeWidth={7} />
    {laptopIn > 0 && <rect x={-50} y={-120 - 60 * (1 - laptopIn)} width={100} height={70} rx={6} fill="#C9CED6" stroke={INK} strokeWidth={4} />}
    <path d="M-80,-120 L80,-120 L64,0 L-64,0 Z" fill="#F4D58A" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => <line key={i} x1={-74 + i * 4} y1={-90 + i * 30} x2={74 - i * 4} y2={-90 + i * 30} stroke={O.chairA} strokeWidth={8} />)}
  </g>
);

// ---------------------------------------------------------------- Dev walking to the sea (DevWalker in the vacation outfit)
const flipflop = (back: boolean) => (
  <g>
    <path d="M-20,8 L48,8 Q54,12 48,14 L-22,14 Z" fill="#2EB5A8" stroke={INK} strokeWidth={4} />
    <path d="M-16,-8 Q-20,8 -8,8 L40,8 Q52,4 48,-4 Q30,-10 10,-14 Z" fill={back ? S.devSkinShade : S.devSkin} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);
export const DevBeachWalk: React.FC<{ x: number; y: number; s?: number; frame: number; phase: number; speed?: number; id: string; lookX?: number; smile?: boolean; bag?: boolean }> = ({ x, y, s = 1, frame, phase, speed = 0.8, id, lookX = 16, smile = true, bag = true }) => (
  <DevWalker x={x} y={y} s={s} frame={frame} phase={phase} speed={speed} lookX={lookX} lookY={0} turn={34} serious={false} smile={smile} papers={false}
    torso={<ShirtTorso id={id} />} legs={{ thigh: O.shorts, thighShade: O.shortsShade, shin: S.devSkin, shinShade: S.devSkinShade }}
    sleeves={{ front: O.shirt, back: O.shirtShade, skin: S.devSkin, skinShade: S.devSkinShade }} foot={flipflop}
    frontProp={<g transform="translate(6 -10)"><Coconut s={0.5} r={8} /></g>}
    backProp={bag ? <g transform="translate(-60 -40) rotate(-8)"><BeachBag x={0} y={0} s={0.7} laptopIn={1} /></g> : undefined} />
);

// ---------------------------------------------------------------- Dev waist-deep in the waves, facing camera (frame space)
export const DevInSea: React.FC<{ frame: number; talk?: number; raise?: number }> = ({ frame, talk = 0, raise = 0 }) => {
  const bob = Math.sin(frame * 0.12) * 8;
  return (
    <g>
      <g transform={`translate(540 ${1080 + bob}) scale(2.1)`}>
        <path d="M-120,360 C-122,230 -90,150 -40,136 L40,136 C90,150 122,230 120,360 Z" fill={O.shirt} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`translate(${-80 + (i % 3) * 80} ${190 + Math.floor(i / 3) * 70}) rotate(${i * 40})`}>
            {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-9} rx={6} ry={10} fill={i % 2 ? O.flower : "#FFFFFF"} transform={`rotate(${a})`} />)}
          </g>
        ))}
        <path d="M-40,136 L0,190 L40,136" fill="none" stroke={O.shirtShade} strokeWidth={6} />
        <rect x={-22} y={90} width={44} height={56} fill={S.devSkinShade} stroke={INK} strokeWidth={SW} />
        <DevHead frame={frame} talk={talk} turn={4} lookX={0} lookY={2} serious={false} smile />
        <g transform="translate(0 -96)"><Shades turn={4} lower={0} /></g>
        <g transform={`translate(${150} ${lerp(260, 40, raise)}) rotate(10)`}><Coconut s={1.0} /></g>
        <path d={`M120,200 L${150},${lerp(300, 80, raise)}`} stroke={INK} strokeWidth={44} strokeLinecap="round" />
        <path d={`M120,200 L${150},${lerp(300, 80, raise)}`} stroke={S.devSkin} strokeWidth={32} strokeLinecap="round" />
      </g>
      {/* water in front of him, waist-deep */}
      <path d={`M-40,${1460 + bob * 0.5} ${Array.from({ length: 12 }).map((_, i) => `Q${-20 + i * 100},${1440 + (i % 2 ? 24 : -24) + Math.sin(frame * 0.15 + i) * 8} ${30 + i * 100},${1460}`).join(" ")} L1120,1960 L-40,1960 Z`} fill={O.sea} stroke={INK} strokeWidth={5} />
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${100 + i * 160 + ((frame * 2) % 80)},${1560 + (i % 2) * 60} q30,-14 60,0`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />)}
    </g>
  );
};

// Sea-only backdrop for the waist-deep shot (frame space): sky + open water.
export const OpenSea: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <defs><linearGradient id="osky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={O.sky} /><stop offset="1" stopColor={O.skyHi} /></linearGradient></defs>
    <rect width={1080} height={HORIZON - 200} fill="url(#osky)" />
    <circle cx={240} cy={300} r={80} fill={O.sun} stroke={INK} strokeWidth={SW} />
    <rect y={HORIZON - 200} width={1080} height={1300} fill={O.sea} />
    <line x1={0} y1={HORIZON - 200} x2={1080} y2={HORIZON - 200} stroke={INK} strokeWidth={5} />
    {Array.from({ length: 18 }).map((_, i) => <path key={i} d={`M${((i * 197 + frame * 2) % 1180) - 100},${HORIZON - 150 + (i % 6) * 90} q30,-12 60,0`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.6} />)}
  </g>
);

// "IT DEPARTMENT" corner: everyone on break (frame space, drawn over an office set).
export const ITDept: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={180} y={420} width={720} height={130} rx={14} fill="#3A6FD8" stroke={INK} strokeWidth={SW} />
    <text x={540} y={510} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={64} fill="#FFFFFF">IT DEPARTMENT</text>
    <rect x={300} y={600} width={480} height={90} rx={10} fill="#F4EEE2" stroke={INK} strokeWidth={5} />
    <text x={540} y={660} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={40} fill="#C0392B">OUT TO LUNCH 🍕</text>
    {Array.from({ length: 6 }).map((_, i) => (
      <g key={i} transform={`translate(${170 + (i % 3) * 370} ${900 + Math.floor(i / 3) * 420})`}>
        <rect x={-120} y={150} width={240} height={20} fill={P.deskTop} stroke={INK} strokeWidth={5} />
        <rect x={-50} y={40} width={100} height={110} rx={8} fill="#3A3F4A" stroke={INK} strokeWidth={5} />
        <rect x={-38} y={52} width={76} height={70} fill="#1C2130" />
        <path d="M-80,320 L-60,170 L60,170 L80,320" fill="#6F5BA8" stroke={INK} strokeWidth={5} />
      </g>
    ))}
  </g>
);
