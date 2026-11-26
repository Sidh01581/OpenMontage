import React from "react";
import { INK, SW, Clock } from "../later/art";
import { P } from "../we-need-to-talk/vart";

// THE PASSWORD NIGHTMARE. — Dev's desk world, the password screen, the expiry popup and the PATIENCE meter.
// Desk world is BUSY.'s (frame space at zoom 1): wall + window behind, cubicle partition top y = 950, floor y = 1480.

export const W = {
  win: "#F4F6FA", bar: "#2F6FD6", field: "#FFFFFF", fieldEdge: "#9AA6B8", text: "#1C2A33", sub: "#5B6878",
  red: "#E5484D", redBg: "#FDECEC", green: "#2FB463", greenBg: "#E6F7EC", tag: "#1C2A33", dev: "#7FE08A", amber: "#FFC93C",
};
const font = "'Helvetica Neue', Arial, sans-serif";
const mono = "Menlo, 'DejaVu Sans Mono', monospace";
export const PART_TOP = 950;
export const DEV = { x: 330, y: 1250, s: 1.5 };

// ---------------------------------------------------------------- desk world (copied from BUSY. shots_b, unchanged look)
export const DeskBack: React.FC<{ frame: number; clockM?: number }> = ({ frame, clockM = 20 }) => (
  <g>
    <rect x={-800} y={-800} width={2700} height={3600} fill={P.officeWall} />
    <rect x={-800} y={-800} width={2700} height={1100} fill="#F7F1E3" />
    <line x1={-800} y1={300} x2={1900} y2={300} stroke={INK} strokeWidth={SW} />
    <g>
      <rect x={560} y={380} width={380} height={380} fill="#BFE3F2" />
      <path d="M560,760 L560,660 L620,660 L620,610 L690,610 L690,690 L760,690 L760,580 L830,580 L830,650 L940,650 L940,760 Z" fill="#8FB3C2" />
      <rect x={560} y={380} width={380} height={380} fill="none" stroke={P.shirt} strokeWidth={16} />
      <rect x={560} y={380} width={380} height={380} fill="none" stroke={INK} strokeWidth={SW} />
      <line x1={750} y1={380} x2={750} y2={760} stroke={P.shirt} strokeWidth={10} />
    </g>
    <Clock x={180} y={470} r={60} h={9} m={clockM + frame * 0.02} />
    <rect x={-800} y={1480} width={2700} height={1400} fill={P.carpet} />
    <line x1={-800} y1={1480} x2={1900} y2={1480} stroke={INK} strokeWidth={SW} />
  </g>
);
export const DeskPartition: React.FC = () => (
  <g>
    <rect x={-800} y={PART_TOP} width={2700} height={530} fill={P.partition} stroke={INK} strokeWidth={SW} />
    {Array.from({ length: 16 }).map((_, i) => <line key={i} x1={-700 + i * 160} y1={PART_TOP + 24} x2={-700 + i * 160} y2={1470} stroke={P.partitionShade} strokeWidth={4} />)}
    <rect x={-810} y={PART_TOP - 14} width={2720} height={22} rx={6} fill={P.trim} stroke={INK} strokeWidth={SW} />
    <rect x={40} y={1010} width={60} height={60} fill="#FFE27A" stroke={INK} strokeWidth={3} transform="rotate(-6 70 1040)" />
    <rect x={470} y={1000} width={110} height={80} fill="#F4EEE2" stroke={INK} strokeWidth={3} />
    <text x={525} y={1038} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={20} fill="#C0392B">IT: CHANGE</text>
    <text x={525} y={1062} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={20} fill="#C0392B">PASSWORD!</text>
  </g>
);

// ---------------------------------------------------------------- monitor bezel for full-frame screen shots (frame space)
// Inner screen area: 900 x 640 with origin at its top-left; children draw in that space.
let monId = 0;
export const Monitor: React.FC<{ cx: number; cy: number; s?: number; rot?: number; children?: React.ReactNode; id?: string }> = ({ cx, cy, s = 1, rot = 0, children, id }) => {
  const cid = React.useMemo(() => id ?? `mon${monId++}`, [id]);
  return (
  <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`}>
    <rect x={-496} y={-366} width={992} height={772} rx={30} fill="#000" opacity={0.3} transform="translate(10 14)" />
    <rect x={-496} y={-366} width={992} height={772} rx={30} fill="#2A2E38" stroke={INK} strokeWidth={SW} />
    <clipPath id={cid}><rect width={900} height={640} /></clipPath>
    <g transform="translate(-450 -320)" clipPath={`url(#${cid})`}>
      <rect width={900} height={640} fill="#DCE6F5" />
      {children}
    </g>
  </g>
  );
};

// Desktop wallpaper + a few icons (behind the popup / window).
export const Wallpaper: React.FC = () => (
  <g>
    <rect width={900} height={640} fill="#3E6DB5" />
    <circle cx={720} cy={150} r={260} fill="#5A86C9" opacity={0.5} />
    <circle cx={120} cy={560} r={200} fill="#345E9E" opacity={0.6} />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(34 ${34 + i * 110})`}>
        <rect width={62} height={50} rx={6} fill="#FFD66B" stroke={INK} strokeWidth={3} />
        <rect y={-8} width={28} height={12} rx={3} fill="#FFD66B" stroke={INK} strokeWidth={3} />
      </g>
    ))}
    <rect y={600} width={900} height={40} fill="#1E2A40" />
  </g>
);

// "Your password has expired." modal. k 0..1 = pop-in.
export const ExpiryPopup: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0) return null;
  const sc = 0.7 + 0.3 * k + 0.06 * Math.sin(Math.min(1, k) * Math.PI);
  return (
    <g transform={`translate(450 300) scale(${sc}) translate(-450 -300)`} opacity={Math.min(1, k * 2)}>
      <rect x={110} y={140} width={680} height={340} rx={22} fill="#000" opacity={0.3} transform="translate(8 10)" />
      <rect x={110} y={140} width={680} height={340} rx={22} fill={W.win} stroke={INK} strokeWidth={5} />
      <path d="M110,162 Q110,140 132,140 L768,140 Q790,140 790,162 L790,196 L110,196 Z" fill={W.red} />
      <text x={140} y={180} fontFamily={font} fontWeight={800} fontSize={26} fill="#FFFFFF">IT Security</text>
      <g transform="translate(190 300)">
        <path d="M0,-50 L46,34 L-46,34 Z" fill={W.amber} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-5} y={-22} width={10} height={32} rx={4} fill={INK} />
        <circle cy={22} r={6} fill={INK} />
      </g>
      <text x={270} y={286} fontFamily={font} fontWeight={900} fontSize={40} fill={W.text}>Your password</text>
      <text x={270} y={334} fontFamily={font} fontWeight={900} fontSize={40} fill={W.text}>has expired.</text>
      <rect x={480} y={392} width={270} height={60} rx={12} fill={W.bar} stroke={INK} strokeWidth={4} />
      <text x={615} y={432} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={26} fill="#FFFFFF">Change password</text>
    </g>
  );
};

// ---------------------------------------------------------------- the password window
export type Rule = { text: string; age: number }; // age in frames since the rule appeared (<0 = hidden)
// typed: the visible password (show-password is on, so viewers can read it); status flashes the field.
export const PwWindow: React.FC<{ frame: number; typed: string; rules: Rule[]; status?: "idle" | "error" | "ok"; flash?: number; caret?: boolean; shake?: number; title?: string }> =
  ({ frame, typed, rules, status = "idle", flash = 0, caret = true, shake = 0, title = "Create new password" }) => {
    const edge = status === "error" ? W.red : status === "ok" ? W.green : W.fieldEdge;
    const fieldBg = status === "error" ? W.redBg : status === "ok" ? W.greenBg : W.field;
    const fs = typed.length > 16 ? 50 : 60;
    const sx = Math.sin(frame * 2.6) * 14 * shake;
    const vis = rules.filter((r) => r.age >= 0);
    return (
      <g>
        <rect width={900} height={640} fill={W.win} />
        <rect width={900} height={70} fill={W.bar} />
        <g transform="translate(40 35)">
          <rect x={-12} y={-4} width={24} height={20} rx={4} fill="#FFFFFF" />
          <path d="M-8,-4 L-8,-12 A8,8 0 0 1 8,-12 L8,-4" fill="none" stroke="#FFFFFF" strokeWidth={4} />
        </g>
        <text x={72} y={46} fontFamily={font} fontWeight={800} fontSize={30} fill="#FFFFFF">{title}</text>
        <text x={60} y={126} fontFamily={font} fontWeight={700} fontSize={30} fill={W.sub}>New password</text>
        <g transform={`translate(${sx} 0)`}>
          <rect x={60} y={146} width={780} height={92} rx={14} fill={fieldBg} stroke={edge} strokeWidth={status === "idle" ? 4 : 7} />
          <text x={88} y={212} fontFamily={mono} fontWeight={700} fontSize={fs} fill={W.text}>
            {typed}
            {caret && frame % 16 < 9 && <tspan fill={W.bar}>|</tspan>}
          </text>
          {/* show-password eye */}
          <g transform="translate(800 192)">
            <path d="M-22,0 Q0,-18 22,0 Q0,18 -22,0 Z" fill="none" stroke={W.sub} strokeWidth={4} />
            <circle r={6} fill={W.sub} />
          </g>
        </g>
        {status === "ok" && (
          <g transform="translate(60 290)">
            <circle cx={22} cy={-10} r={22} fill={W.green} />
            <path d="M10,-10 L19,0 L35,-20" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <text x={60} y={2} fontFamily={font} fontWeight={900} fontSize={40} fill={W.green}>Strong password!</text>
          </g>
        )}
        {status !== "ok" && vis.map((r, i) => {
          const pop = Math.min(1, r.age / 4);
          const hot = r.age < 10 && Math.floor(r.age / 2) % 2 === 0;
          const rh = vis.length > 5 ? 48 : 62, y = 262 + i * rh, big = vis.length > 5 ? 30 : 36;
          return (
            <g key={i} transform={`translate(${(1 - pop) * -30} 0)`} opacity={pop}>
              <rect x={40} y={y} width={820} height={rh - 8} rx={10} fill={hot ? "#FBD0D2" : W.redBg} />
              <circle cx={70} cy={y + (rh - 8) / 2} r={16} fill={W.red} />
              <path d={`M${63},${y + (rh - 8) / 2 - 7} L${77},${y + (rh - 8) / 2 + 7} M${77},${y + (rh - 8) / 2 - 7} L${63},${y + (rh - 8) / 2 + 7}`} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
              <text x={100} y={y + (rh - 8) / 2 + big * 0.36} fontFamily={font} fontWeight={800} fontSize={r.text.length > 34 ? big * 0.88 : big} fill={W.red}>{r.text}</text>
            </g>
          );
        })}
        {vis.length < 5 && <rect x={600} y={560} width={240} height={56} rx={12} fill={W.bar} opacity={0.85} />}
        {vis.length < 5 && <text x={720} y={597} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={26} fill="#FFFFFF">Submit</text>}
        {flash > 0 && <rect width={900} height={640} fill={status === "ok" ? W.green : W.red} opacity={0.18 * flash} />}
      </g>
    );
  };

// Mouse pointer (screen space).
export const Pointer: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path d={`M${x},${y} l0,40 l11,-10 l9,20 l8,-4 l-9,-19 l15,-1 Z`} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
);

// ---------------------------------------------------------------- PATIENCE meter (same tag style as ENERGY / BUSY. HUD)
export const PatienceTag: React.FC<{ x: number; y: number; pct: number; age: number; s?: number; hit?: number }> = ({ x, y, pct, age, s = 1, hit = 0 }) => {
  if (age < 0) return null;
  const pop = age < 6 ? 0.6 + 0.4 * Math.min(1, age / 3) + 0.12 * Math.sin(Math.min(1, age / 6) * Math.PI) : 1;
  const Wd = 560, H = 196;
  const col = pct > 60 ? "#5BE37A" : pct > 25 ? W.amber : "#FF6B6B";
  const jx = Math.sin(age * 3.3) * 8 * hit;
  return (
    <g transform={`translate(${x + Wd / 2 + jx} ${y + H / 2}) scale(${s * pop * (1 + 0.05 * hit)}) translate(${-Wd / 2} ${-H / 2})`}>
      <rect x={6} y={10} width={Wd} height={H} rx={34} fill="#000" opacity={0.35} />
      <rect width={Wd} height={H} rx={34} fill={W.tag} stroke={INK} strokeWidth={SW} />
      <rect x={18} y={16} width={96} height={36} rx={18} fill={W.dev} />
      <text x={66} y={44} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={26} fill={W.tag}>DEV</text>
      <g transform="translate(146 36)">
        <rect x={-12} y={-6} width={24} height={20} rx={4} fill={W.amber} />
        <path d="M-7,-6 L-7,-12 A7,7 0 0 1 7,-12 L7,-6" fill="none" stroke={W.amber} strokeWidth={4} />
      </g>
      <rect x={186} y={20} width={350} height={28} rx={14} fill="#33424D" />
      <rect x={186} y={20} width={350 * Math.max(0, Math.min(1, pct / 100))} height={28} rx={14} fill={col} />
      <line x1={22} y1={80} x2={Wd - 22} y2={80} stroke="#FFFFFF" strokeWidth={3} opacity={0.25} />
      <text x={30} y={150} fontFamily={font} fontWeight={900} fontSize={54} fill="#FFFFFF" letterSpacing={-1}>PATIENCE:</text>
      <text x={Wd - 30} y={152} textAnchor="end" fontFamily={font} fontWeight={900} fontSize={68} fill={col}>{Math.round(pct)}%</text>
    </g>
  );
};
