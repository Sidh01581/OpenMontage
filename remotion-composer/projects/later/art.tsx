import React from "react";

// Pure SVG building blocks for "LATER." (no Remotion imports, so they also
// render with react-dom/server for previews). Everything is in a 1920x1080
// "room space"; shots move a virtual camera over it.

export const INK = "#141018";
export const C = {
  wall: "#E9CFA8",
  wallShade: "#D9B98F",
  floor: "#B98A62",
  floorShade: "#A3754F",
  wood: "#8B5E3C",
  woodDark: "#6B4630",
  skin: "#F6E7C8",
  skinShade: "#E8CFA6",
  hair: "#4A2E1E",
  hoodie: "#E8B23A",
  hoodieShade: "#C9922A",
  pants: "#4A4D57",
  blanket: "#5E7FB8",
  blanketShade: "#4A6799",
  pillow: "#F4EEE2",
  chair: "#5B4A8A",
  magenta: "#E0408A",
  magentaHot: "#FFC2DD",
  laterBody: "#0D0A16",
  cat: "#E8913A",
  catShade: "#C9732A",
};

export const SW = 6; // standard outline width

export type Pt = [number, number];

// Smooth closed path through points (Catmull-Rom -> cubic Bezier)
export function smoothClosed(pts: Pt[]): string {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));

// ---------------------------------------------------------------- camera
export const Camera: React.FC<{
  cx: number; cy: number; zoom: number; shakeX?: number; shakeY?: number;
  children: React.ReactNode;
}> = ({ cx, cy, zoom, shakeX = 0, shakeY = 0, children }) => (
  <g transform={`translate(${960 + shakeX} ${540 + shakeY}) scale(${zoom}) translate(${-cx} ${-cy})`}>
    {children}
  </g>
);

// ---------------------------------------------------------------- lighting
// A dark wash with a soft hole around a light source, plus a colored glow.
export const LightPool: React.FC<{
  id: string; x: number; y: number; r: number;
  dark: string; darkness: number; glow?: string; glowStrength?: number; glowR?: number;
}> = ({ id, x, y, r, dark, darkness, glow, glowStrength = 0.3, glowR }) => (
  <g>
    <defs>
      <radialGradient id={`${id}-d`} cx={x} cy={y} r={r} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={dark} stopOpacity={0} />
        <stop offset="0.22" stopColor={dark} stopOpacity={darkness * 0.3} />
        <stop offset="0.55" stopColor={dark} stopOpacity={darkness * 0.82} />
        <stop offset="1" stopColor={dark} stopOpacity={darkness} />
      </radialGradient>
      {glow && (
        <radialGradient id={`${id}-g`} cx={x} cy={y} r={glowR ?? r * 0.6} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={glow} stopOpacity={glowStrength} />
          <stop offset="1" stopColor={glow} stopOpacity={0} />
        </radialGradient>
      )}
    </defs>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill={`url(#${id}-d)`} />
    {glow && <rect x={-3000} y={-3000} width={8000} height={8000} fill={`url(#${id}-g)`} />}
  </g>
);

export const Vignette: React.FC<{ id: string; strength?: number }> = ({ id, strength = 0.55 }) => (
  <g>
    <defs>
      <radialGradient id={id} cx="960" cy="540" r="1150" gradientUnits="userSpaceOnUse">
        <stop offset="0.55" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={strength} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id})`} />
  </g>
);

// ---------------------------------------------------------------- bedroom
export type Sky = "night" | "morning" | "dusk" | "rain" | "afternoon" | "dawn";

const Window: React.FC<{ sky: Sky; frame: number }> = ({ sky, frame }) => {
  const skyFill = { night: "#141A3A", morning: "#A8D8F0", dusk: "#3A2E62", rain: "#0E1226", afternoon: "#F2C37A", dawn: "#F6C9A0" }[sky];
  const rain = sky === "rain";
  const drops = [];
  if (rain) {
    for (let i = 0; i < 28; i++) {
      const x = 205 + ((i * 53) % 310);
      const y = 170 + ((i * 97 + frame * 22) % 320);
      drops.push(<line key={i} x1={x} y1={y} x2={x - 6} y2={y + 26} stroke="#8FA6D8" strokeWidth={3} strokeLinecap="round" opacity={0.7} />);
    }
  }
  return (
    <g>
      <defs>
        <clipPath id="win-clip"><rect x={200} y={170} width={320} height={300} /></clipPath>
      </defs>
      <rect x={200} y={170} width={320} height={300} fill={skyFill} />
      <g clipPath="url(#win-clip)">
        {sky === "night" && (
          <>
            <circle cx={440} cy={240} r={30} fill="#F2EED8" />
            {[[250, 210], [300, 290], [470, 330], [380, 200], [260, 380], [490, 420]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={3} fill="#F2EED8" opacity={0.6 + 0.4 * Math.sin(frame * 0.2 + i)} />
            ))}
          </>
        )}
        {sky === "morning" && (
          <>
            <circle cx={300} cy={260} r={46} fill="#FFF4CF" />
            <rect x={200} y={400} width={320} height={70} fill="#9CC98A" />
          </>
        )}
        {sky === "dusk" && (
          <>
            <rect x={200} y={360} width={320} height={110} fill="#E0806A" opacity={0.7} />
            <circle cx={420} cy={380} r={36} fill="#FFB27A" />
          </>
        )}
        {sky === "afternoon" && (
          <>
            <circle cx={460} cy={330} r={40} fill="#FFE2A0" />
            <rect x={200} y={410} width={320} height={60} fill="#C9A46A" />
          </>
        )}
        {sky === "dawn" && (
          <>
            <rect x={200} y={170} width={320} height={160} fill="#9CC0E8" opacity={0.7} />
            <circle cx={300} cy={420} r={44} fill="#FFE7B0" />
            <rect x={200} y={400} width={320} height={70} fill="#F4B48A" opacity={0.6} />
          </>
        )}
        {rain && drops}
        {/* city silhouette */}
        <path d="M200,470 L200,420 L240,420 L240,395 L280,395 L280,430 L330,430 L330,380 L370,380 L370,415 L420,415 L420,400 L470,400 L470,430 L520,430 L520,470 Z"
          fill={sky === "morning" || sky === "dawn" ? "#7FA6B8" : sky === "afternoon" ? "#8A6A58" : "#0A0C1E"} opacity={0.9} />
      </g>
      {/* frame */}
      <rect x={200} y={170} width={320} height={300} fill="none" stroke={C.pillow} strokeWidth={18} />
      <rect x={200} y={170} width={320} height={300} fill="none" stroke={INK} strokeWidth={SW} />
      <line x1={360} y1={170} x2={360} y2={470} stroke={C.pillow} strokeWidth={12} />
      <line x1={200} y1={320} x2={520} y2={320} stroke={C.pillow} strokeWidth={12} />
      <rect x={180} y={470} width={360} height={22} rx={4} fill={C.pillow} stroke={INK} strokeWidth={SW} />
      {/* curtains */}
      <path d="M150,150 C175,260 140,380 165,500 L205,500 C190,380 215,260 195,150 Z" fill="#B5485A" stroke={INK} strokeWidth={SW} />
      <path d="M570,150 C545,260 580,380 555,500 L515,500 C530,380 505,260 525,150 Z" fill="#B5485A" stroke={INK} strokeWidth={SW} />
      <rect x={130} y={140} width={460} height={14} rx={7} fill={C.woodDark} stroke={INK} strokeWidth={4} />
    </g>
  );
};

export const Clock: React.FC<{ x: number; y: number; r?: number; h: number; m: number; sec?: number; secColor?: string; tint?: string }> = ({ x, y, r = 58, h, m, sec, secColor = "#C0392B", tint }) => {
  const ma = (m / 60) * Math.PI * 2 - Math.PI / 2;
  const ha = ((h % 12) / 12 + m / 720) * Math.PI * 2 - Math.PI / 2;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={tint ?? "#F4EEE2"} stroke={INK} strokeWidth={SW} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={x + Math.cos(a) * r * 0.78} y1={y + Math.sin(a) * r * 0.78} x2={x + Math.cos(a) * r * 0.9} y2={y + Math.sin(a) * r * 0.9} stroke={INK} strokeWidth={3} />;
      })}
      <line x1={x} y1={y} x2={x + Math.cos(ha) * r * 0.48} y2={y + Math.sin(ha) * r * 0.48} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x + Math.cos(ma) * r * 0.74} y2={y + Math.sin(ma) * r * 0.74} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {sec !== undefined && (() => {
        const sa = (sec / 60) * Math.PI * 2 - Math.PI / 2;
        return <line x1={x - Math.cos(sa) * r * 0.16} y1={y - Math.sin(sa) * r * 0.16} x2={x + Math.cos(sa) * r * 0.82} y2={y + Math.sin(sa) * r * 0.82} stroke={secColor} strokeWidth={2.2} strokeLinecap="round" />;
      })()}
      <circle cx={x} cy={y} r={5} fill={INK} />
    </g>
  );
};

export const Lamp: React.FC<{ on: boolean }> = ({ on }) => (
  <g>
    <ellipse cx={1560} cy={593} rx={42} ry={9} fill={C.woodDark} stroke={INK} strokeWidth={SW} />
    <path d="M1560,590 L1540,500 L1585,440" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1560,590 L1540,500 L1585,440" fill="none" stroke="#3E6E8E" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1550,448 L1625,420 L1640,470 L1575,492 Z" fill="#3E6E8E" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    {on && <ellipse cx={1610} cy={482} rx={20} ry={8} fill="#FFF1B8" />}
  </g>
);

export const Room: React.FC<{ sky: Sky; frame: number; clockH: number; clockM: number; lampOn?: boolean; mess?: boolean }> = ({ sky, frame, clockH, clockM, lampOn = false, mess = false }) => (
  <g>
    {/* wall + floor */}
    <rect x={-400} y={-300} width={2720} height={1160} fill={C.wall} />
    <rect x={-400} y={820} width={2720} height={40} fill={C.wallShade} />
    <rect x={-400} y={860} width={2720} height={600} fill={C.floor} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <line key={i} x1={-400 + i * 340} y1={860} x2={-500 + i * 340} y2={1460} stroke={C.floorShade} strokeWidth={4} />
    ))}
    <line x1={-400} y1={860} x2={2320} y2={860} stroke={INK} strokeWidth={SW} />
    <ellipse cx={700} cy={960} rx={420} ry={60} fill="#C0566A" stroke={INK} strokeWidth={SW} />
    <ellipse cx={700} cy={960} rx={360} ry={44} fill="none" stroke="#E07F8E" strokeWidth={5} />

    <Window sky={sky} frame={frame} />

    {/* poster */}
    <g transform="rotate(-3 760 300)">
      <rect x={690} y={200} width={150} height={200} fill="#6FA8A0" stroke={INK} strokeWidth={SW} />
      <path d="M700,380 L750,290 L780,330 L810,270 L830,380 Z" fill="#F4EEE2" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={800} cy={235} r={14} fill="#FFD36E" stroke={INK} strokeWidth={3} />
    </g>

    {/* shelf with books */}
    <rect x={1190} y={392} width={300} height={16} fill={C.wood} stroke={INK} strokeWidth={SW} />
    {[["#C0566A", 40, 70], ["#5E7FB8", 30, 82], ["#6FA8A0", 36, 64], ["#E8B23A", 28, 76], ["#8A6FB8", 42, 58]].map(([col, w, h], i, arr) => {
      const x0 = 1210 + arr.slice(0, i).reduce((s, b) => s + (b[1] as number) + 4, 0);
      return <rect key={i} x={x0} y={392 - (h as number)} width={w as number} height={h as number} fill={col as string} stroke={INK} strokeWidth={4} />;
    })}
    <path d="M1420,392 L1430,340 L1470,340 L1480,392 Z" fill="#7DB86A" stroke={INK} strokeWidth={4} />

    <Clock x={1700} y={250} h={clockH} m={clockM} />

    {/* bed */}
    <rect x={60} y={560} width={44} height={300} rx={8} fill={C.woodDark} stroke={INK} strokeWidth={SW} />
    <rect x={70} y={700} width={560} height={100} rx={10} fill={C.wood} stroke={INK} strokeWidth={SW} />
    <rect x={96} y={650} width={520} height={70} rx={24} fill={C.pillow} stroke={INK} strokeWidth={SW} />
    <ellipse cx={180} cy={645} rx={78} ry={32} fill="#FFFFFF" stroke={INK} strokeWidth={SW} />
    <path d="M250,650 C330,625 520,628 620,660 L630,760 L250,760 Z" fill={C.blanket} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M300,690 C380,672 520,676 610,700" fill="none" stroke={C.blanketShade} strokeWidth={6} />
    <rect x={70} y={800} width={20} height={60} fill={C.woodDark} stroke={INK} strokeWidth={4} />
    <rect x={610} y={800} width={20} height={60} fill={C.woodDark} stroke={INK} strokeWidth={4} />

    {mess && (
      <g>
        <rect x={780} y={890} width={60} height={36} rx={6} fill="#D94B4B" stroke={INK} strokeWidth={4} transform="rotate(-12 810 908)" />
        <rect x={1660} y={900} width={70} height={30} rx={6} fill="#5EA3D9" stroke={INK} strokeWidth={4} transform="rotate(8 1695 915)" />
        <circle cx={980} cy={930} r={16} fill="#F4EEE2" stroke={INK} strokeWidth={4} />
      </g>
    )}
  </g>
);

// Chair + desk are separate so the character can sit between their layers.
export const ChairBack: React.FC = () => (
  <g>
    <rect x={790} y={500} width={34} height={215} rx={12} fill={C.chair} stroke={INK} strokeWidth={SW} />
    <rect x={800} y={700} width={190} height={30} rx={10} fill={C.chair} stroke={INK} strokeWidth={SW} />
    <line x1={895} y1={730} x2={895} y2={830} stroke={INK} strokeWidth={14} />
    <path d="M830,860 L895,830 L960,860" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
  </g>
);

export const Desk: React.FC = () => (
  <g>
    <rect x={1025} y={612} width={26} height={250} fill={C.woodDark} stroke={INK} strokeWidth={SW} />
    <rect x={1580} y={612} width={26} height={250} fill={C.woodDark} stroke={INK} strokeWidth={SW} />
    <rect x={1300} y={612} width={300} height={110} fill={C.wood} stroke={INK} strokeWidth={SW} />
    <line x1={1330} y1={667} x2={1570} y2={667} stroke={INK} strokeWidth={4} />
    <circle cx={1450} cy={645} r={6} fill={INK} />
    <circle cx={1450} cy={694} r={6} fill={INK} />
    <rect x={1000} y={592} width={630} height={24} rx={6} fill={C.wood} stroke={INK} strokeWidth={SW} />
  </g>
);

export const Laptop: React.FC<{ screenOn: boolean; screenColor?: string }> = ({ screenOn, screenColor = "#CFE3FF" }) => (
  <g>
    <path d="M1140,590 L1310,590 L1318,598 L1132,598 Z" fill="#9AA3B5" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {/* lid seen from behind/side, screen facing Theo (left) */}
    <path d="M1300,594 L1316,594 L1362,452 L1346,448 Z" fill="#B9C2D3" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {screenOn && <path d="M1298,590 L1344,452" stroke={screenColor} strokeWidth={5} strokeLinecap="round" />}
  </g>
);

// Light spilling from the laptop screen toward Theo's face
export const ScreenSpill: React.FC<{ id: string; color: string; strength: number }> = ({ id, color, strength }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="1330" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={color} stopOpacity={strength} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <path d="M1340,450 L1300,594 L880,640 L860,300 Z" fill={`url(#${id})`} />
  </g>
);

// ---------------------------------------------------------------- Theo
export type Expr = "panic" | "focused" | "sad" | "neutral" | "smile"
  | "grin" | "blank" | "guilty" | "exhausted" | "anxious" | "relieved" | "overwhelmed" | "shock" | "determined";

const Face: React.FC<{ expr: Expr; frame: number; lookX: number; lookY: number; blinkEvery?: number; eyesClosed?: boolean; talk?: number; glassesY?: number }> = ({ expr, frame, lookX, lookY, blinkEvery = 84, eyesClosed, talk, glassesY = 0 }) => {
  const happyClosed = expr === "relieved";
  const blinking = happyClosed || eyesClosed || (frame + 37) % blinkEvery < 4;
  const pupil = expr === "panic" || expr === "overwhelmed" || expr === "shock" ? 5 : 10;
  const tr = Math.sin(frame * 1.3) * 2;
  const eyes: [number, number, number, number][] = [[985, 432, 27, 32], [1050, 430, 23, 30]];
  const brows: Record<Expr, string[]> = {
    panic: ["M958,384 Q984,368 1010,382", "M1030,380 Q1052,366 1072,384"],
    focused: ["M962,388 Q986,384 1008,392", "M1032,392 Q1052,382 1070,388"],
    sad: ["M960,396 L1006,380", "M1032,380 L1070,396"],
    neutral: ["M960,390 Q985,380 1008,388", "M1032,388 Q1052,380 1070,390"],
    smile: ["M960,388 Q985,376 1008,386", "M1032,386 Q1052,376 1070,388"],
    grin: ["M958,380 Q984,366 1010,378", "M1030,376 Q1052,364 1072,378"],
    blank: ["M962,392 L1006,392", "M1034,390 L1070,390"],
    guilty: ["M962,394 Q990,380 1006,376", "M1032,376 Q1048,380 1070,394"],
    exhausted: ["M962,396 Q985,390 1008,396", "M1032,396 Q1052,390 1070,396"],
    anxious: ["M960,388 Q988,374 1006,368", "M1032,368 Q1050,374 1072,388"],
    relieved: ["M960,386 Q985,378 1008,384", "M1032,384 Q1052,378 1070,386"],
    overwhelmed: ["M958,376 Q984,362 1010,374", "M1030,372 Q1052,360 1072,376"],
    shock: ["M956,368 Q984,352 1010,364", "M1030,362 Q1052,350 1074,366"],
    determined: ["M962,384 L1008,394", "M1032,394 L1070,386"],
  };
  const mouths: Record<Expr, React.ReactNode> = {
    panic: <ellipse cx={1034} cy={486} rx={13 - (talk ?? 0) * 2} ry={talk !== undefined ? 4 + talk * 13 : 11 + Math.sin(frame * 0.9) * 2} fill="#5A1E24" stroke={INK} strokeWidth={4} />,
    focused: <path d="M1018,482 Q1034,490 1052,480" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
    sad: <path d="M1016,490 Q1034,476 1054,490" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
    neutral: <path d="M1020,484 L1050,484" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
    smile: <path d="M1014,478 Q1034,498 1056,476" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
    grin: <path d="M1010,474 Q1034,476 1058,470 Q1052,500 1032,502 Q1014,500 1010,474 Z" fill="#5A1E24" stroke={INK} strokeWidth={4} strokeLinejoin="round" />,
    blank: <path d="M1024,486 L1046,486" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
    guilty: <path d="M1018,488 q8,-5 16,0 q8,5 16,0" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
    exhausted: <path d="M1020,488 Q1034,484 1050,488" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
    anxious: <path d={`M1016,488 q9,${-4 - tr} 18,0 q9,${4 + tr} 18,0`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
    relieved: <path d="M1018,480 Q1034,492 1052,478" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
    overwhelmed: <ellipse cx={1034} cy={488} rx={8} ry={9} fill="#5A1E24" stroke={INK} strokeWidth={4} />,
    shock: <ellipse cx={1034} cy={490} rx={15} ry={20} fill="#5A1E24" stroke={INK} strokeWidth={4} />,
    determined: <path d="M1020,486 Q1036,490 1052,478" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />,
  };
  const talking = talk !== undefined && expr !== "panic" && talk > 0.05;
  return (
    <g>
      {/* eyes */}
      {eyes.map(([x, y, rx, ry], i) =>
        blinking ? (
          <path key={i} d={happyClosed ? `M${x - rx},${y + 4} Q${x},${y - 12} ${x + rx},${y + 4}` : expr === "sad" ? `M${x - rx},${y + 4} Q${x},${y + 14} ${x + rx},${y + 4}` : `M${x - rx},${y} Q${x},${y + 10} ${x + rx},${y}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        ) : (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
            <circle cx={x + lookX} cy={y + lookY} r={pupil * (i === 1 ? 0.92 : 1)} fill={INK} />
            <circle cx={x + lookX - pupil * 0.35} cy={y + lookY - pupil * 0.4} r={pupil * 0.32} fill="#FFFFFF" />
            {expr === "exhausted" && (
              <g>
                <path d={`M${x - rx - 3},${y - ry - 3} L${x + rx + 3},${y - ry - 3} L${x + rx + 3},${y - ry * 0.05} Q${x},${y + ry * 0.2} ${x - rx - 3},${y - ry * 0.05} Z`} fill={C.skin} />
                <path d={`M${x - rx},${y - ry * 0.05} Q${x},${y + ry * 0.2} ${x + rx},${y - ry * 0.05}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
              </g>
            )}
          </g>
        )
      )}
      {expr === "exhausted" && eyes.map(([x, y, rx, ry], i) => (
        <path key={`bag${i}`} d={`M${x - rx * 0.8},${y + ry + 6} Q${x},${y + ry + 15} ${x + rx * 0.8},${y + ry + 6}`} fill="none" stroke="#9A7FA0" strokeWidth={4} strokeLinecap="round" />
      ))}
      {/* glasses */}
      <g transform={`translate(0 ${glassesY})`}>
      <circle cx={985} cy={432} r={34} fill="#BFE0FF" fillOpacity={0.12} stroke={INK} strokeWidth={6} />
      <circle cx={1050} cy={430} r={29} fill="#BFE0FF" fillOpacity={0.12} stroke={INK} strokeWidth={6} />
      <path d="M1019,430 Q1020,422 1021,430" fill="none" stroke={INK} strokeWidth={5} />
      <line x1={951} y1={428} x2={905} y2={420} stroke={INK} strokeWidth={5} />
      </g>
      {/* brows, nose, mouth */}
      {brows[expr].map((d, i) => <path key={i} d={d} fill="none" stroke={C.hair} strokeWidth={8} strokeLinecap="round" />)}
      <path d="M1058,452 Q1068,462 1056,468" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {talking ? <ellipse cx={1034} cy={486} rx={12 - (talk ?? 0) * 2} ry={3 + (talk ?? 0) * 12} fill="#5A1E24" stroke={INK} strokeWidth={4} /> : mouths[expr]}
      {(expr === "panic" || expr === "shock") && (
        <path d={`M1096,${372 + (frame % 24) * 1.2} q-9,16 0,22 q9,-6 0,-22 Z`} fill="#9FD3F0" stroke={INK} strokeWidth={3} />
      )}
      {expr === "sad" && (
        <g>
          <path d={`M972,470 Q968,${500 + (frame % 30)} 974,${520 + (frame % 30)}`} fill="none" stroke="#9FD3F0" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
          <path d={`M1046,466 Q1044,${492 + ((frame + 12) % 30)} 1050,${512 + ((frame + 12) % 30)}`} fill="none" stroke="#9FD3F0" strokeWidth={7} strokeLinecap="round" opacity={0.9} />
        </g>
      )}
      {(expr === "smile" || expr === "focused" || expr === "grin" || expr === "relieved" || expr === "determined") && (
        <g opacity={0.35}>
          <ellipse cx={960} cy={478} rx={16} ry={9} fill="#F08A8A" />
          <ellipse cx={1078} cy={474} rx={12} ry={8} fill="#F08A8A" />
        </g>
      )}
    </g>
  );
};

export const Head: React.FC<{ expr: Expr; frame: number; lookX: number; lookY: number; eyesClosed?: boolean; talk?: number; glassesY?: number; wind?: number }> = (p) => {
  const bounce = Math.sin(p.frame * 0.25) * 3;
  const w = (p.wind ?? 0) * (1 + Math.sin(p.frame * 0.9) * 0.35);
  return (
    <g>
      <circle cx={902} cy={438} r={20} fill={C.skin} stroke={INK} strokeWidth={SW} />
      <circle cx={985} cy={425} r={108} fill={C.skin} stroke={INK} strokeWidth={SW} />
      {/* hair */}
      <path d={`M878,430 C858,340 920,${290 + bounce} 1000,300 C1060,305 1098,345 1094,392 C1070,366 1030,358 1004,372 C985,352 948,356 925,380 C910,392 895,410 878,430 Z`} fill={C.hair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d={`M990,304 C${996 - w * 0.4},${272 + bounce} ${1018 - w},${262 + bounce + w * 0.3} ${1030 - w * 1.6},${250 + bounce + w * 0.5} C${1022 - w},${276 + bounce} 1012,292 1006,304`} fill={C.hair} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <Face expr={p.expr} frame={p.frame} lookX={p.lookX} lookY={p.lookY} eyesClosed={p.eyesClosed} talk={p.talk} glassesY={p.glassesY} />
    </g>
  );
};

export const Limb: React.FC<{ d: string; color: string; w: number }> = ({ d, color, w }) => (
  <g>
    <path d={d} fill="none" stroke={INK} strokeWidth={w + 12} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

// Seated Theo facing the desk (screen right). pose "type" or "slump".
export const TheoLegs: React.FC = () => (
  <g>
    <Limb d="M880,705 L1000,712 L1004,842" color={C.pants} w={54} />
    <ellipse cx={1026} cy={852} rx={40} ry={18} fill="#FFFFFF" stroke={INK} strokeWidth={SW} />
  </g>
);

export const TheoUpper: React.FC<{ pose: "type" | "slump"; expr: Expr; frame: number; typeSpeed?: number; lookX?: number; lookY?: number; talk?: number; glassesY?: number; wind?: number }> = ({ pose, expr, frame, typeSpeed = 0.9, lookX = 6, lookY = 4, talk, glassesY, wind }) => {
  const breathe = Math.sin(frame * 0.12) * 3;
  if (pose === "slump") {
    return (
      <g>
        {/* folded arms on desk */}
        <ellipse cx={1150} cy={572} rx={110} ry={26} fill={C.hoodieShade} stroke={INK} strokeWidth={SW} />
        <g transform={`rotate(${30 + Math.sin(frame * 0.08) * 0.6} 885 705)`}>
          <path d="M840,712 C826,620 850,535 905,505 C952,490 992,515 1004,562 C1014,620 966,690 944,712 Z" fill={C.hoodie} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <ellipse cx={898} cy={505} rx={48} ry={28} fill={C.hoodieShade} stroke={INK} strokeWidth={SW} />
          <g transform="rotate(20 985 425)">
            <Head expr={expr} frame={frame} lookX={0} lookY={8} eyesClosed />
          </g>
        </g>
        <ellipse cx={1210} cy={585} rx={52} ry={20} fill={C.hoodie} stroke={INK} strokeWidth={SW} />
      </g>
    );
  }
  const k1 = Math.sin(frame * typeSpeed) * 7;
  const k2 = Math.sin(frame * typeSpeed + 2.1) * 7;
  return (
    <g transform={`translate(0 ${breathe * 0.4})`}>
      {/* back arm */}
      <Limb d={`M940,545 L1030,630 L1150,${592 + k2}`} color={C.hoodieShade} w={40} />
      <circle cx={1156} cy={592 + k2} r={17} fill={C.skinShade} stroke={INK} strokeWidth={5} />
      {/* torso */}
      <path d={`M840,712 C826,620 850,${535 + breathe} 905,${505 + breathe} C952,${490 + breathe} 992,515 1004,562 C1014,620 966,690 944,712 Z`} fill={C.hoodie} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M930,600 C950,640 952,680 944,708" fill="none" stroke={C.hoodieShade} strokeWidth={6} />
      <path d="M965,560 L960,620" stroke={INK} strokeWidth={3} />
      <ellipse cx={898} cy={505 + breathe} rx={48} ry={28} fill={C.hoodieShade} stroke={INK} strokeWidth={SW} />
      <g transform={`translate(0 ${breathe})`}>
        <Head expr={expr} frame={frame} lookX={lookX} lookY={lookY} talk={talk} glassesY={glassesY} wind={wind} />
      </g>
      {/* front arm */}
      <Limb d={`M970,548 L1050,632 L1190,${588 + k1}`} color={C.hoodie} w={44} />
      <circle cx={1196} cy={588 + k1} r={19} fill={C.skin} stroke={INK} strokeWidth={5} />
    </g>
  );
};

// ---------------------------------------------------------------- Later
export type LaterMood = "sly" | "grin" | "dim" | "laugh" | "frown" | "confused" | "scared";

export const Later: React.FC<{
  x: number; y: number; s: number; mood: LaterMood; frame: number; opacity?: number;
  phone?: number; // 0..1 how far the phone is pushed forward (-1 = no phone)
  layer?: "all" | "body" | "glow"; // body = silhouette only, glow = rim + eyes + grin (draw after darkness)
  grinOpen?: number; // 0..1 overrides mood's grin size (sly -> full grin)
  mouth?: number; // 0..1 talking: thickens the crescent
  tilt?: number; // degrees: face features slide/rotate on the blob (head tilt)
  arms?: { l?: Pt; r?: Pt }; // wispy arm targets in Later's local units (body radius ~100)
}> = ({ x, y, s, mood, frame, opacity = 1, phone = -1, layer = "all", grinOpen, mouth = 0, tilt = 0, arms }) => {
  const showBody = layer !== "glow";
  const showGlow = layer !== "body";
  const N = 26;
  const pts: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const th = (i / N) * Math.PI * 2;
    const below = Math.max(0, Math.sin(th));
    let r = 100 * (1 + 0.05 * Math.sin(3 * th + frame * 0.09) + 0.035 * Math.sin(5 * th - frame * 0.06));
    const rx = r * (0.96 + 0.22 * below);
    const ry = r * (1.08 + 0.08 * below) + below * 10 * Math.sin(frame * 0.12 + th * 4);
    pts.push([Math.cos(th) * rx, Math.sin(th) * ry]);
  }
  const body = smoothClosed(pts);
  const eyeY = mood === "dim" ? -12 : -22;
  const eyeR = mood === "dim" ? 0.55 : 1;
  const g = grinOpen ?? (mood === "grin" || mood === "laugh" ? 1 : 0);
  const grinW = 46 + 16 * g;
  const grinD = 34 + 24 * g;
  const wisps = [0, 1, 2, 3, 4].map((i) => {
    const ph = (frame * 0.6 + i * 23) % 70;
    return <circle key={i} cx={-70 + i * 35 + Math.sin(frame * 0.05 + i) * 10} cy={110 + ph} r={14 - ph * 0.17} fill={C.laterBody} opacity={Math.max(0, 0.8 - ph / 70)} />;
  });
  const push = phone >= 0 ? phone : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      {showBody && wisps}
      {showGlow && <path d={body} fill="none" stroke={C.magenta} strokeWidth={16} opacity={0.35} />}
      {showBody && <path d={body} fill={C.laterBody} />}
      {showGlow && <path d={body} fill="none" stroke={C.magenta} strokeWidth={4} strokeOpacity={0.8} />}
      {/* wispy arms: tapered smoke strokes ending in 3 smoke-finger tips */}
      {arms && (["l", "r"] as const).map((k) => {
        const tgt = arms[k];
        if (!tgt) return null;
        const side = k === "l" ? -1 : 1;
        const sx = side * 82, sy = 18;
        const wob = Math.sin(frame * 0.15 + side) * 6;
        const mx = (sx + tgt[0]) / 2 + side * 26, my = (sy + tgt[1]) / 2 - 24 + wob;
        const d = `M${sx},${sy} Q${mx},${my} ${tgt[0]},${tgt[1]}`;
        const ang = Math.atan2(tgt[1] - my, tgt[0] - mx);
        const fingers = [-0.55, 0, 0.55].map((o, i) => {
          const a = ang + o;
          return <path key={i} d={`M${tgt[0]},${tgt[1]} q${Math.cos(a) * 14},${Math.sin(a) * 14} ${Math.cos(a + 0.3) * 24},${Math.sin(a + 0.3) * 24}`} fill="none" stroke={C.laterBody} strokeWidth={6} strokeLinecap="round" />;
        });
        return (
          <g key={k}>
            {showGlow && <path d={d} fill="none" stroke={C.magenta} strokeWidth={18} strokeOpacity={0.22} strokeLinecap="round" />}
            {showBody && <path d={d} fill="none" stroke={C.laterBody} strokeWidth={14} strokeLinecap="round" />}
            {showBody && fingers}
          </g>
        );
      })}
      <g transform={`rotate(${tilt} 0 0) translate(${tilt * 0.6} 0)`}>
      {/* eyes */}
      {showGlow && [-1, 1].map((side) => {
        const big = mood === "confused" ? (side < 0 ? 1.25 : 0.78) : 1;
        if (mood === "laugh") {
          const bob = Math.sin(frame * 0.8) * 3;
          return <path key={side} d={`M${side * 34 - 22},${eyeY + 6 + bob} Q${side * 34},${eyeY - 16 + bob} ${side * 34 + 22},${eyeY + 6 + bob}`} fill="none" stroke={C.magenta} strokeWidth={9} strokeLinecap="round" />;
        }
        if (mood === "scared") {
          return (
            <g key={side}>
              <circle cx={side * 34} cy={eyeY} r={21} fill={C.magenta} />
              <circle cx={side * 34} cy={eyeY} r={7} fill={C.magentaHot} />
            </g>
          );
        }
        const ryK = mood === "frown" ? 0.62 : 1;
        return (
          <g key={side}>
            <ellipse cx={side * 34} cy={eyeY} rx={24 * eyeR * big} ry={16 * eyeR * big * ryK} fill={C.magenta} opacity={mood === "dim" ? 0.5 : 1} />
            <ellipse cx={side * 34} cy={eyeY + 1} rx={11 * eyeR * big} ry={7 * eyeR * big * ryK} fill={C.magentaHot} opacity={mood === "dim" ? 0.4 : 1} />
            {mood !== "dim" && mood !== "confused" && (
              <path d={mood === "frown" ? `M${side * 6},${eyeY - 8} L${side * 62},${eyeY - 14} L${side * 62},${eyeY - 30} Z` : `M${side * 8},${eyeY - 22} L${side * 62},${eyeY - 4} L${side * 62},${eyeY - 26} Z`} fill={C.laterBody} />
            )}
          </g>
        );
      })}
      {showGlow && (mood === "sly" || mood === "grin" || mood === "laugh") && (() => {
        const m = mood === "laugh" ? Math.max(mouth, 0.55 + Math.sin(frame * 0.8) * 0.25) : mouth;
        return <path d={`M${-grinW},16 Q0,${16 + grinD * (1.7 + m * 0.35)} ${grinW},16 Q0,${16 + grinD * (1 - m * 0.75)} ${-grinW},16 Z`} fill={C.magenta} />;
      })()}
      {showGlow && mood === "frown" && (
        <path d={`M-42,${52 - mouth * 6} Q0,${18 - mouth * 10} 42,${52 - mouth * 6} Q0,${32 + mouth * 6} -42,${52 - mouth * 6} Z`} fill={C.magenta} />
      )}
      {showGlow && mood === "confused" && (
        <path d="M-30,40 q10,-8 20,0 q10,8 20,0 q10,-8 20,0" fill="none" stroke={C.magenta} strokeWidth={7} strokeLinecap="round" />
      )}
      {showGlow && mood === "scared" && (
        <ellipse cx={0} cy={42} rx={12 + mouth * 4} ry={15 + mouth * 6} fill="none" stroke={C.magenta} strokeWidth={6} />
      )}
      </g>
      {showBody && phone >= 0 && (
        <g>
          <path d={`M-80,40 C-110,90 -60,${120 + push * 10} -22,${118 + push * 10}`} fill="none" stroke={C.laterBody} strokeWidth={12} strokeLinecap="round" />
          <path d={`M80,40 C110,90 60,${120 + push * 10} 22,${118 + push * 10}`} fill="none" stroke={C.laterBody} strokeWidth={12} strokeLinecap="round" />
          <g transform={`translate(0 ${100 + push * 12}) scale(${1 + push * 0.35})`}>
            <rect x={-26} y={-44} width={52} height={88} rx={9} fill="#20222A" stroke={INK} strokeWidth={4} />
            <rect x={-20} y={-36} width={40} height={68} rx={4} fill="#7FD4FF" />
            <circle cx={-8} cy={-22} r={5} fill="#FF6B9A" /><circle cx={8} cy={-22} r={5} fill="#FFD36E" />
            <circle cx={-8} cy={-6} r={5} fill="#7DE08A" /><circle cx={8} cy={-6} r={5} fill="#B58AFF" />
            <circle cx={-8} cy={10} r={5} fill="#FF9F5A" /><circle cx={8} cy={10} r={5} fill="#5AB0FF" />
          </g>
          <ellipse cx={-24} cy={116 + push * 10} rx={11} ry={9} fill={C.laterBody} stroke={C.magenta} strokeWidth={2} />
          <ellipse cx={24} cy={116 + push * 10} rx={11} ry={9} fill={C.laterBody} stroke={C.magenta} strokeWidth={2} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- Mochi
export type MochiPose = "sleep" | "sit" | "arch";
export type MochiMood = "open" | "judge" | "closed" | "alarmed";

// Cat eyes for the sitting/arch poses: big round eyes per bible.
const CatEyes: React.FC<{ cx: number; cy: number; mood: MochiMood; frame: number; look?: number }> = ({ cx, cy, mood, frame, look = 0 }) => {
  const blink = mood !== "closed" && (frame + 11) % 96 < 4;
  return (
    <g>
      {[-17, 17].map((dx, i) => {
        const ex = cx + dx, ey = cy;
        if (mood === "closed" || blink) return <path key={i} d={`M${ex - 11},${ey} Q${ex},${ey + 8} ${ex + 11},${ey}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />;
        return (
          <g key={i}>
            <ellipse cx={ex} cy={ey} rx={12} ry={13} fill="#FFF6D6" stroke={INK} strokeWidth={4} />
            {mood === "alarmed"
              ? <ellipse cx={ex + look} cy={ey} rx={2.5} ry={10} fill={INK} />
              : <circle cx={ex + look} cy={ey + 1} r={7} fill={INK} />}
            {mood !== "alarmed" && <circle cx={ex + look - 2.5} cy={ey - 2.5} r={2.2} fill="#FFFFFF" />}
            {mood === "judge" && (
              <g>
                <path d={`M${ex - 14},${ey - 14} L${ex + 14},${ey - 14} L${ex + 14},${ey - 1} L${ex - 14},${ey - 1} Z`} fill={C.cat} />
                <line x1={ex - 13} y1={ey - 1} x2={ex + 13} y2={ey - 1} stroke={INK} strokeWidth={4} strokeLinecap="round" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

const CatEars: React.FC<{ cx: number; cy: number; flat?: boolean }> = ({ cx, cy, flat }) => (
  <g>
    <path d={flat ? `M${cx - 30},${cy - 18} L${cx - 52},${cy - 30} L${cx - 26},${cy - 34} Z` : `M${cx - 30},${cy - 22} L${cx - 26},${cy - 58} L${cx - 6},${cy - 34} Z`} fill={C.cat} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d={flat ? `M${cx + 30},${cy - 18} L${cx + 52},${cy - 30} L${cx + 26},${cy - 34} Z` : `M${cx + 30},${cy - 22} L${cx + 26},${cy - 58} L${cx + 6},${cy - 34} Z`} fill={C.cat} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

export const Mochi: React.FC<{ x: number; y: number; s: number; frame: number; pose?: MochiPose; mood?: MochiMood; flip?: boolean; headTilt?: number; look?: number }> = ({ x, y, s, frame, pose = "sleep", mood = "open", flip = false, headTilt = 0, look = 0 }) => {
  const br = 1 + Math.sin(frame * 0.1) * 0.03;
  const tf = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;
  if (pose === "sit") {
    // Upright sit, side-ish body facing left, head turned to camera. Origin = between the front paws on the floor.
    const tail = Math.sin(frame * 0.12) * 8;
    return (
      <g transform={tf}>
        <path d={`M40,-10 C90,-8 96,${-40 + tail} 70,${-60 + tail}`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
        <path d={`M40,-10 C90,-8 96,${-40 + tail} 70,${-60 + tail}`} fill="none" stroke={C.cat} strokeWidth={12} strokeLinecap="round" />
        <circle cx={70} cy={-60 + tail} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <g transform={`scale(1 ${br})`}>
          <path d="M-46,0 C-58,-50 -44,-104 2,-112 C44,-112 62,-60 54,0 Z" fill={C.cat} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M18,-60 Q36,-66 46,-52" fill="none" stroke={C.catShade} strokeWidth={7} strokeLinecap="round" />
          <path d="M22,-32 Q40,-38 50,-24" fill="none" stroke={C.catShade} strokeWidth={7} strokeLinecap="round" />
          <ellipse cx={-14} cy={-62} rx={22} ry={30} fill="#FFFFFF" />
        </g>
        <ellipse cx={-26} cy={-6} rx={15} ry={9} fill={C.cat} stroke={INK} strokeWidth={4} />
        <ellipse cx={2} cy={-6} rx={15} ry={9} fill={C.cat} stroke={INK} strokeWidth={4} />
        <g transform={`rotate(${headTilt} -10 -120)`}>
          <CatEars cx={-10} cy={-132} />
          <circle cx={-10} cy={-132} r={40} fill={C.cat} stroke={INK} strokeWidth={SW} />
          <path d="M-22,-166 Q-10,-172 2,-166" fill="none" stroke={C.catShade} strokeWidth={6} strokeLinecap="round" />
          <ellipse cx={-10} cy={-114} rx={18} ry={11} fill="#FFFFFF" />
          <CatEyes cx={-10} cy={-136} mood={mood} frame={frame} look={look} />
          <path d="M-14,-118 L-6,-118 L-10,-113 Z" fill="#E07F8E" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          {mood === "judge"
            ? <path d="M-20,-106 L0,-106" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
            : <path d="M-20,-108 Q-15,-103 -10,-108 Q-5,-103 0,-108" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />}
        </g>
      </g>
    );
  }
  if (pose === "arch") {
    // Halloween-cat arch + hiss facing left. Origin = floor under the body center.
    const quiver = Math.sin(frame * 2.1) * 1.5;
    const spikes = Array.from({ length: 9 }).map((_, i) => {
      const t = i / 8; const a = Math.PI * (0.12 + t * 0.76);
      const bx = -Math.cos(a) * 74, by = -70 - Math.sin(a) * 62;
      return <path key={i} d={`M${bx - 8},${by + 4} L${bx - Math.cos(a) * 10},${by - Math.sin(a) * 18 + quiver} L${bx + 8},${by + 4} Z`} fill={C.cat} stroke={INK} strokeWidth={4} strokeLinejoin="round" />;
    });
    return (
      <g transform={tf}>
        <path d={`M56,-96 C70,-150 ${90 + quiver},-170 ${74 + quiver},-196`} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
        <path d={`M56,-96 C70,-150 ${90 + quiver},-170 ${74 + quiver},-196`} fill="none" stroke={C.cat} strokeWidth={22} strokeLinecap="round" />
        {[-50, -30, 34, 54].map((lx, i) => (
          <g key={i}>
            <line x1={lx} y1={-80} x2={lx} y2={-4} stroke={INK} strokeWidth={22} strokeLinecap="round" />
            <line x1={lx} y1={-80} x2={lx} y2={-4} stroke={i % 2 ? C.catShade : C.cat} strokeWidth={12} strokeLinecap="round" />
          </g>
        ))}
        {spikes}
        <path d="M-74,-72 C-74,-150 74,-150 74,-72 C50,-86 -50,-86 -74,-72 Z" fill={C.cat} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <CatEars cx={-86} cy={-84} flat />
        <circle cx={-86} cy={-84} r={36} fill={C.cat} stroke={INK} strokeWidth={SW} />
        <CatEyes cx={-90} cy={-92} mood="alarmed" frame={frame} />
        <path d="M-104,-68 Q-90,-50 -76,-68 Z" fill="#5A1E24" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <path d="M-100,-68 L-98,-62 M-80,-68 L-82,-62" stroke="#FFFFFF" strokeWidth={3} />
      </g>
    );
  }
  return (
    <g transform={tf}>
      <g transform={`scale(1 ${br})`}>
        <ellipse cx={0} cy={-34} rx={74} ry={38} fill={C.cat} stroke={INK} strokeWidth={SW} />
        <path d="M-20,-60 Q0,-70 20,-60" fill="none" stroke={C.catShade} strokeWidth={7} strokeLinecap="round" />
        <path d="M10,-66 Q24,-72 38,-62" fill="none" stroke={C.catShade} strokeWidth={7} strokeLinecap="round" />
      </g>
      <path d="M62,-20 C96,-14 92,10 40,6 C10,4 -30,8 -50,2" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <path d="M62,-20 C96,-14 92,10 40,6 C10,4 -30,8 -50,2" fill="none" stroke={C.cat} strokeWidth={12} strokeLinecap="round" />
      <circle cx={-52} cy={2} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
      <path d="M-86,-58 L-80,-92 L-62,-66 Z" fill={C.cat} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-52,-66 L-36,-94 L-30,-60 Z" fill={C.cat} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={-58} cy={-38} r={34} fill={C.cat} stroke={INK} strokeWidth={SW} />
      <ellipse cx={-58} cy={-22} rx={18} ry={12} fill="#FFFFFF" />
      <path d="M-76,-40 Q-70,-34 -64,-40" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <path d="M-52,-40 Q-46,-34 -40,-40" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <path d="M-60,-28 L-56,-28" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {frame % 60 < 30 && <text x={-10} y={-96 - (frame % 30)} fontSize={26} fontFamily="sans-serif" fontWeight={700} fill="#5E7FB8" opacity={1 - (frame % 30) / 30}>z</text>}
    </g>
  );
};
