import React from "react";
import { C, INK, SW } from "../later/art";
import { P, rnd } from "./vart";

// New sets for WE NEED TO TALK. Authored in 9:16 frame space (x 0..1080, y 0..1920) unless noted,
// with bleed so the camera can drift. Same outline + flat color language as LATER.

const ink = { stroke: INK, strokeWidth: SW, strokeLinejoin: "round" as const };

// ---------------------------------------------------------------- dream tint (violet, per the color plan)
export const DreamTint: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <g>
    <rect x={-500} y={-500} width={2500} height={3000} fill="#6B3FD9" opacity={0.18 * strength} />
    <defs>
      <radialGradient id="dreamV" cx={540} cy={960} r={1200} gradientUnits="userSpaceOnUse">
        <stop offset="0.45" stopColor="#1A0B3A" stopOpacity={0} />
        <stop offset="1" stopColor="#1A0B3A" stopOpacity={0.6 * strength} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1080} height={1920} fill="url(#dreamV)" />
  </g>
);

export const Rain: React.FC<{ frame: number; n?: number; color?: string; speed?: number }> = ({ frame, n = 80, color = "#B9A8FF", speed = 46 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = ((i * 89) % 1240) - 80;
      const y = ((i * 137 + frame * speed) % 2200) - 140;
      return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 46} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.55} />;
    })}
  </g>
);

// ---------------------------------------------------------------- shot 5: rain street
export const RainStreet: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={1600} fill="#2E2358" />
    {[[-40, 520, 220], [170, 380, 200], [360, 600, 180], [540, 300, 240], [770, 470, 200], [960, 360, 260]].map(([x, top, w], i) => (
      <g key={i}>
        <rect x={x} y={top} width={w} height={1300 - top} fill="#3E2F6E" {...ink} />
        {Array.from({ length: 12 }).map((_, k) => (
          <rect key={k} x={x + 26 + (k % 3) * (w / 3.4)} y={top + 40 + Math.floor(k / 3) * 110} width={32} height={46}
            fill={rnd(i * 13 + k) > 0.55 ? "#7FE3D8" : "#5A4A90"} opacity={0.85} />
        ))}
      </g>
    ))}
    {/* lamp post with a cold pool of light */}
    <rect x={880} y={720} width={18} height={600} fill="#2A2140" {...ink} />
    <path d="M870,720 L908,720 L930,690 L848,690 Z" fill="#2A2140" {...ink} />
    <ellipse cx={889} cy={1290} rx={190} ry={36} fill="#9FE8E0" opacity={0.18} />
    <path d="M889,706 L760,1290 L1020,1290 Z" fill="#9FE8E0" opacity={0.08} />
    {/* sidewalk + street */}
    <rect x={-300} y={1290} width={1700} height={420} fill="#4A3F6E" />
    <line x1={-300} y1={1290} x2={1400} y2={1290} {...ink} />
    <rect x={-300} y={1700} width={1700} height={500} fill="#2A2448" />
    <line x1={-300} y1={1700} x2={1400} y2={1700} {...ink} />
    {[[260, 1520], [760, 1600], [520, 1820]].map(([x, y], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx={120} ry={22} fill="#6B5AA8" opacity={0.7} />
        {[0, 1].map((r) => {
          const ph = ((frame + i * 9 + r * 14) % 28) / 28;
          return <ellipse key={r} cx={x + (r ? 40 : -30)} cy={y} rx={10 + ph * 50} ry={2 + ph * 9} fill="none" stroke="#B9A8FF" strokeWidth={3} opacity={1 - ph} />;
        })}
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- shot 6: job fair (wide, x -300..2100)
export const Applicant: React.FC<{ x: number; y: number; s?: number; frame: number; v: number }> = ({ x, y, s = 1, frame, v }) => {
  const shirts = ["#E07F8E", "#6FA8A0", "#F2C230", "#8A6FB8", "#5EA3D9"];
  const hairs = ["#2E1E14", "#C9732A", "#141018", "#6B3A2A", "#E8C26A"];
  const skins = ["#F6E7C8", "#C68A62", "#E8B48A", "#8E5A3C", "#F2D3B0"];
  const bob = Math.sin(frame * 0.15 + v) * 3;
  const sh = shirts[v % 5], hr = hairs[(v * 2) % 5], sk = skins[(v * 3) % 5];
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <rect x={-34} y={0} width={26} height={150} rx={10} fill="#3C3F48" {...ink} />
      <rect x={8} y={0} width={26} height={150} rx={10} fill="#3C3F48" {...ink} />
      <path d="M-62,10 C-66,-90 -50,-150 0,-156 C50,-150 66,-90 62,10 Z" fill={sh} {...ink} />
      <rect x={-56} y={-120} width={22} height={60} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={-246} r={90} fill={sk} {...ink} />
      {v % 3 === 0 && <circle cx={0} cy={-340} r={34} fill={hr} {...ink} />}
      <path d={v % 2 ? "M-92,-246 C-96,-330 -40,-352 10,-348 C70,-344 98,-300 90,-240 C60,-280 20,-290 -20,-280 C-50,-280 -80,-268 -92,-246 Z"
        : "M-90,-230 C-104,-320 -40,-356 6,-352 C66,-350 104,-310 92,-232 C88,-270 70,-300 40,-304 C10,-286 -50,-290 -90,-230 Z"} fill={hr} {...ink} />
      {[-30, 26].map((ex, i) => (
        <g key={i}>
          <ellipse cx={ex} cy={-236} rx={18} ry={22} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <circle cx={ex + 4} cy={-234} r={7} fill={INK} />
        </g>
      ))}
      <path d="M-22,-190 Q0,-172 24,-192" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <ellipse cx={-52} cy={-200} rx={12} ry={7} fill="#F08A8A" opacity={0.4} />
      <ellipse cx={50} cy={-200} rx={12} ry={7} fill="#F08A8A" opacity={0.4} />
    </g>
  );
};

export const JobFair: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={-400} y={-300} width={2700} height={1600} fill="#5E4E8E" />
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-300 + i * 280} y={-300} width={20} height={1600} fill="#54457F" />)}
    {/* banner */}
    <g transform="rotate(-1.5 900 300)">
      <rect x={60} y={200} width={1700} height={190} fill="#F4EEE2" {...ink} />
      <text x={910} y={330} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={124} fill="#5B4A8A" letterSpacing={18}>JOB FAIR</text>
      {[120, 1700].map((x) => <line key={x} x1={x} y1={-300} x2={x} y2={200} stroke={INK} strokeWidth={5} />)}
    </g>
    {/* booth at the end of the line */}
    <rect x={1640} y={900} width={460} height={360} fill="#6FA8A0" {...ink} />
    <rect x={1620} y={880} width={500} height={40} rx={8} fill="#F4EEE2" {...ink} />
    <text x={1870} y={1100} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={64} fill="#F4EEE2">HIRING</text>
    <rect x={-400} y={1260} width={2700} height={800} fill="#3E3366" />
    <line x1={-400} y1={1260} x2={2300} y2={1260} {...ink} />
    {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={-400 + i * 300} y1={1260} x2={-500 + i * 300} y2={2060} stroke="#352B58" strokeWidth={5} />)}
  </g>
);

// ---------------------------------------------------------------- shot 7: construction site
export const ConstructionSite: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={1700} fill="#3A2C6A" />
    {/* crane */}
    <g stroke="#1E1640" strokeWidth={12}>
      <line x1={820} y1={1300} x2={820} y2={240} />
      <line x1={420} y1={260} x2={1200} y2={260} />
      {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={820 - 20} y1={1300 - i * 105} x2={820 + 20} y2={1300 - (i + 1) * 105} strokeWidth={6} />)}
    </g>
    <line x1={520} y1={260} x2={520 + Math.sin(frame * 0.05) * 14} y2={640} stroke="#1E1640" strokeWidth={5} />
    <rect x={480 + Math.sin(frame * 0.05) * 14} y={640} width={80} height={44} fill="#C2553E" stroke="#1E1640" strokeWidth={5} />
    {/* scaffold + half wall */}
    <g stroke="#7E6AB8" strokeWidth={10}>
      {[60, 260, 460].map((x) => <line key={x} x1={x} y1={560} x2={x} y2={1320} />)}
      {[600, 820, 1040].map((y) => <line key={y} x1={40} y1={y} x2={480} y2={y} />)}
    </g>
    {Array.from({ length: 7 }).map((_, r) => Array.from({ length: 6 }).map((__, c) => (
      <rect key={`${r}-${c}`} x={-60 + c * 92 + (r % 2) * 46} y={1060 + r * 36} width={90} height={34} fill="#B64D38" stroke="#5A2418" strokeWidth={3} />
    )))}
    <rect x={-300} y={1310} width={1700} height={700} fill="#55417A" />
    <line x1={-300} y1={1310} x2={1400} y2={1310} {...ink} />
    {/* hazard tape + cones */}
    <g>
      <rect x={-60} y={1380} width={1200} height={34} fill="#F2C230" stroke={INK} strokeWidth={4} transform="rotate(-3 540 1397)" />
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${-50 + i * 90},1382 l30,0 l-30,32 l-30,0 Z`} fill={INK} transform="rotate(-3 540 1397)" />)}
    </g>
    {[140, 940].map((x) => (
      <g key={x}><path d={`M${x - 46},1700 L${x},1530 L${x + 46},1700 Z`} fill="#F08A3A" {...ink} /><rect x={x - 32} y={1600} width={64} height={22} fill="#F4EEE2" /></g>
    ))}
  </g>
);

// ---------------------------------------------------------------- shot 8: under the bridge
export const Train: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <g transform={`translate(${x} ${y + Math.sin(frame * 3) * 1.5})`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <g key={i} transform={`translate(${i * 420} 0)`}>
        <rect x={0} y={-150} width={400} height={150} rx={18} fill="#8A7FC0" {...ink} />
        {[0, 1, 2, 3].map((w) => <rect key={w} x={28 + w * 92} y={-124} width={66} height={56} rx={8} fill="#FFE3A6" stroke={INK} strokeWidth={4} />)}
        <rect x={0} y={-40} width={400} height={14} fill="#5B4A8A" />
      </g>
    ))}
  </g>
);

export const BridgeSet: React.FC<{ frame: number; trainX: number }> = ({ frame, trainX }) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={2400} fill="#3A2C6A" />
    {/* far city through the arch */}
    {[[80, 980, 120], [230, 900, 140], [400, 1010, 110], [560, 880, 160], [760, 960, 130], [900, 900, 150]].map(([x, t, w], i) => (
      <rect key={i} x={x} y={t} width={w} height={420} fill="#5A4A90" opacity={0.8} />
    ))}
    <ellipse cx={540} cy={1360} rx={700} ry={60} fill="#6B5AA8" opacity={0.6} />
    {/* train on the deck */}
    <Train x={trainX} y={300} frame={frame} />
    {/* bridge deck + arch underside */}
    <rect x={-300} y={300} width={1700} height={90} fill="#6E6390" {...ink} />
    {Array.from({ length: 20 }).map((_, i) => <line key={i} x1={-300 + i * 90} y1={230} x2={-300 + i * 90} y2={300} stroke={INK} strokeWidth={6} />)}
    <line x1={-300} y1={230} x2={1400} y2={230} stroke={INK} strokeWidth={8} />
    <path d="M-300,390 L1400,390 L1400,1500 L1060,1500 C1060,900 880,600 540,600 C200,600 20,900 20,1500 L-300,1500 Z" fill="#4E4478" {...ink} />
    <path d="M60,1500 C60,960 240,680 540,680" fill="none" stroke="#3E3666" strokeWidth={14} />
    {/* ground */}
    <rect x={-300} y={1360} width={1700} height={700} fill="#2E2650" />
    <line x1={-300} y1={1360} x2={1400} y2={1360} {...ink} />
    <path d="M300,1560 L760,1540 L790,1640 L280,1660 Z" fill="#B88A5A" {...ink} />
    <text x={530} y={1618} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={800} fontSize={34} fill="#7A5A38" transform="rotate(-2 530 1610)">THIS SIDE UP</text>
  </g>
);

// ---------------------------------------------------------------- shot 9: bedroom from above (night)
export const BedTopDown: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={-400} y={-400} width={1900} height={2800} fill={C.floor} />
    {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-400 + i * 140} y1={-400} x2={-400 + i * 140} y2={2400} stroke={C.floorShade} strokeWidth={5} />)}
    <ellipse cx={540} cy={1720} rx={520} ry={180} fill="#C0566A" {...ink} />
    {/* nightstand with glowing phone */}
    <rect x={40} y={330} width={170} height={170} rx={12} fill={C.woodDark} {...ink} />
    <rect x={92} y={372} width={56} height={92} rx={10} fill="#20222A" stroke={INK} strokeWidth={4} />
    <rect x={100} y={382} width={40} height={72} rx={4} fill="#7FD4FF" opacity={0.4 + 0.2 * Math.sin(frame * 0.2)} />
    {/* bed */}
    <rect x={240} y={260} width={600} height={1340} rx={26} fill={C.wood} {...ink} />
    <rect x={262} y={300} width={556} height={1280} rx={20} fill="#F4EEE2" {...ink} />
    <rect x={330} y={330} width={420} height={190} rx={60} fill="#FFFFFF" {...ink} />
    <path d="M262,880 C400,850 680,852 818,880 L818,1560 Q818,1580 798,1580 L282,1580 Q262,1580 262,1560 Z" fill={C.blanket} {...ink} />
    {[960, 1100, 1260, 1420].map((y, i) => <path key={i} d={`M300,${y} Q540,${y - 26 + (i % 2) * 14} 780,${y}`} fill="none" stroke={C.blanketShade} strokeWidth={8} />)}
  </g>
);

// Moonlight through the window falling across the bed.
export const MoonShaft: React.FC<{ shift: number }> = ({ shift }) => (
  <g>
    <rect x={-400} y={-400} width={1900} height={2800} fill="#070A24" opacity={0.6} />
    <path d={`M${120 + shift},-200 L${520 + shift},-200 L${980 + shift},1700 L${560 + shift},1700 Z`} fill="#AFC4FF" opacity={0.16} />
  </g>
);

// ---------------------------------------------------------------- shot 10: bedside flip clock
export const FlipClock: React.FC<{ text: string; flip: number; frame: number }> = ({ text, flip, frame }) => {
  // flip: 0..1 progress of the top flap falling onto the new number
  const [hh, mm] = text.split(":");
  const panel = (x: number, s: string, key: string) => (
    <g key={key}>
      <rect x={x} y={760} width={300} height={400} rx={26} fill="#22202C" {...ink} />
      <text x={x + 150} y={1090} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={800} fontSize={250} fill="#F4EEE2">{s}</text>
      <line x1={x} y1={960} x2={x + 300} y2={960} stroke="#0A0910" strokeWidth={8} />
      {flip < 1 && (
        <g transform={`translate(0 960) scale(1 ${1 - flip * 2 > 0 ? 1 - flip * 2 : 0}) translate(0 -960)`}>
          <rect x={x} y={760} width={300} height={200} rx={26} fill="#2C2A38" stroke={INK} strokeWidth={SW} />
        </g>
      )}
    </g>
  );
  return (
    <g>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#14183A" />
      <rect x={-300} y={1320} width={1700} height={800} fill={C.woodDark} />
      <line x1={-300} y1={1320} x2={1400} y2={1320} {...ink} />
      <rect x={140} y={700} width={800} height={540} rx={40} fill="#3A3E58" {...ink} />
      {panel(190, hh, "h")}
      {panel(590, mm, "m")}
      <circle cx={540} cy={900} r={12} fill="#F4EEE2" opacity={0.5 + 0.5 * ((frame % 24) < 12 ? 1 : 0)} />
      <circle cx={540} cy={1020} r={12} fill="#F4EEE2" opacity={0.5 + 0.5 * ((frame % 24) < 12 ? 1 : 0)} />
      <rect x={200} y={1240} width={680} height={80} rx={14} fill="#2A2E46" {...ink} />
    </g>
  );
};

// ---------------------------------------------------------------- shot 11: ceiling, low angle
export const CeilingSet: React.FC<{ frame: number; flicker: number }> = ({ frame, flicker }) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={2600} fill="#2C2A55" />
    {/* wall tops at the bottom of frame, converging (low angle) */}
    <path d="M-300,1600 L300,1260 L780,1260 L1400,1600 L1400,2300 L-300,2300 Z" fill="#3A3866" {...ink} />
    <path d="M300,1260 L300,2300 M780,1260 L780,2300" stroke={INK} strokeWidth={4} opacity={0.6} />
    <path d="M-300,1600 L300,1260 L780,1260 L1400,1600" fill="none" stroke="#E9CFA8" strokeWidth={14} opacity={0.35} />
    {/* window glow on the wall */}
    <rect x={360} y={1400} width={360} height={260} fill="#141A3A" {...ink} />
    <circle cx={630} cy={1460} r={26} fill="#F2EED8" />
    {/* ceiling light */}
    <ellipse cx={540} cy={360} rx={130} ry={60} fill={flicker > 0.5 ? "#FFF4CF" : "#8A86A8"} {...ink} />
    {flicker > 0.5 && <ellipse cx={540} cy={360} rx={260} ry={140} fill="#FFF4CF" opacity={0.15} />}
  </g>
);

// ---------------------------------------------------------------- shot 12: bathroom mirror, 4:30 AM
export const MIRROR = { x: 140, y: 330, w: 800, h: 1040 };
export const BathroomBack: React.FC<{ frame: number; on: boolean }> = ({ frame, on }) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={2600} fill="#A8D5C8" />
    {Array.from({ length: 24 }).map((_, i) => <line key={`h${i}`} x1={-300} y1={-300 + i * 110} x2={1400} y2={-300 + i * 110} stroke="#8FBDB0" strokeWidth={5} />)}
    {Array.from({ length: 18 }).map((_, i) => <line key={`v${i}`} x1={-300 + i * 110} y1={-300} x2={-300 + i * 110} y2={2300} stroke="#8FBDB0" strokeWidth={5} />)}
    {/* tube light */}
    <rect x={240} y={220} width={600} height={46} rx={23} fill={on ? "#FFFDF0" : "#9AA6A2"} {...ink} />
    {on && <ellipse cx={540} cy={250} rx={420} ry={120} fill="#FFFDF0" opacity={0.25} />}
    {/* mirror frame */}
    <rect x={MIRROR.x - 24} y={MIRROR.y - 24} width={MIRROR.w + 48} height={MIRROR.h + 48} rx={40} fill="#E9E4DA" {...ink} />
    {/* shelf with toothbrush cup + 4:30 clock */}
    <rect x={120} y={1430} width={840} height={30} rx={8} fill="#F4EEE2" {...ink} />
    <rect x={200} y={1350} width={70} height={80} rx={10} fill="#6FA8A0" {...ink} />
    <line x1={222} y1={1360} x2={210} y2={1290} stroke="#E07F8E" strokeWidth={10} strokeLinecap="round" />
    <line x1={246} y1={1360} x2={256} y2={1296} stroke="#5E7FB8" strokeWidth={10} strokeLinecap="round" />
    <rect x={740} y={1352} width={170} height={78} rx={12} fill="#22202C" {...ink} />
    <text x={825} y={1408} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={50} fill="#FF5A5A">4:30</text>
    {/* sink */}
    <path d="M100,1520 L980,1520 C960,1700 820,1780 540,1780 C260,1780 120,1700 100,1520 Z" fill="#F4F2EC" {...ink} />
    <rect x={500} y={1470} width={80} height={60} rx={10} fill="#C9CED6" {...ink} />
  </g>
);
export const MirrorGlass: React.FC<{ on: boolean }> = ({ on }) => (
  <g>
    <rect x={MIRROR.x} y={MIRROR.y} width={MIRROR.w} height={MIRROR.h} rx={22} fill="#CFE8F0" opacity={0.16} />
    <path d={`M${MIRROR.x + 60},${MIRROR.y + 40} L${MIRROR.x + 200},${MIRROR.y + 40} L${MIRROR.x + 40},${MIRROR.y + 300} L${MIRROR.x + 40},${MIRROR.y + 140} Z`} fill="#FFFFFF" opacity={on ? 0.35 : 0.15} />
    <rect x={MIRROR.x} y={MIRROR.y} width={MIRROR.w} height={MIRROR.h} rx={22} fill="none" stroke={INK} strokeWidth={SW} />
  </g>
);
// Reflection background (tile wall behind Theo, seen in the mirror)
export const MirrorRoom: React.FC = () => (
  <g>
    <rect x={MIRROR.x} y={MIRROR.y} width={MIRROR.w} height={MIRROR.h} fill="#8FC2B4" />
    {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={MIRROR.x} y1={MIRROR.y + i * 120} x2={MIRROR.x + MIRROR.w} y2={MIRROR.y + i * 120} stroke="#7AAE9F" strokeWidth={5} />)}
    <rect x={MIRROR.x + 560} y={MIRROR.y + 120} width={200} height={600} fill="#E9E4DA" stroke={INK} strokeWidth={4} />
    <circle cx={MIRROR.x + 590} cy={MIRROR.y + 420} r={10} fill="#C9CED6" stroke={INK} strokeWidth={3} />
  </g>
);

// ---------------------------------------------------------------- shots 14/16/17: Priya's glass office
export const PriyaOffice: React.FC<{ frame: number; sun: number }> = ({ frame, sun }) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={2600} fill="#E6E9EC" />
    {/* big window, city by day; washed-out grey in the morning, gold when the sun bursts in */}
    <rect x={80} y={240} width={920} height={820} fill={sun > 0 ? "#FFD98A" : "#C9D3DA"} {...ink} />
    {[[110, 700, 140], [270, 620, 120], [410, 760, 150], [580, 560, 130], [730, 680, 150], [880, 640, 110]].map(([x, t, w], i) => (
      <rect key={i} x={x} y={t} width={w} height={1060 - t} fill={sun > 0 ? "#E8A95E" : "#A9B4BD"} />
    ))}
    {sun > 0 && <circle cx={760} cy={420} r={70 + sun * 20} fill="#FFF3C4" />}
    <line x1={540} y1={240} x2={540} y2={1060} stroke="#F4F2EC" strokeWidth={16} />
    <rect x={80} y={240} width={920} height={820} fill="none" stroke={INK} strokeWidth={SW} />
    {/* tall plant */}
    <path d="M820,1260 L840,1140 L960,1140 L980,1260 Z" fill="#E8E2D4" {...ink} />
    {Array.from({ length: 7 }).map((_, i) => (
      <path key={i} d={`M900,1140 Q${860 + i * 14},${980 - i * 30} ${800 + i * 30 + Math.sin(frame * 0.07 + i) * 4},${900 - i * 40}`} fill="none" stroke="#4E8C5A" strokeWidth={14} strokeLinecap="round" />
    ))}
    {/* glass wall mullions in the foreground */}
    <rect x={-300} y={1240} width={1700} height={900} fill="#C9CCD2" />
    <line x1={-300} y1={1240} x2={1400} y2={1240} {...ink} />
  </g>
);

export const PriyaDesk: React.FC<{ frame: number }> = () => (
  <g>
    <rect x={40} y={1250} width={1000} height={60} rx={10} fill="#F4F2EC" {...ink} />
    <rect x={80} y={1300} width={920} height={500} fill="#E0DCD2" {...ink} />
    {/* laptop, back facing camera */}
    <path d="M330,1252 L370,1060 L710,1060 L750,1252 Z" fill="#C9CED6" {...ink} />
    <circle cx={540} cy={1150} r={18} fill="#F4F2EC" stroke={INK} strokeWidth={3} />
    <Mini x={880} y={1250} />
  </g>
);
const Mini: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-28} y={-60} width={56} height={60} rx={8} fill="#F4EEE2" stroke={INK} strokeWidth={5} />
    <text x={0} y={-22} textAnchor="middle" fontSize={20} fontWeight={700} fontFamily="'Helvetica Neue', Arial" fill={P.blazer}>#1</text>
  </g>
);

export const GlassWall: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <g opacity={opacity}>
    {[60, 1020].map((x) => <rect key={x} x={x - 10} y={-300} width={20} height={2600} fill="#B8BDC7" stroke={INK} strokeWidth={4} />)}
    <rect x={-300} y={1150} width={1700} height={50} fill="#FFFFFF" opacity={0.35} />
    <path d="M200,-300 L60,2300 M940,-300 L800,2300" stroke="#FFFFFF" strokeWidth={30} opacity={0.12} />
  </g>
);

// Warm sunlight flooding in (twist): rays from the upper right.
export const SunBurst: React.FC<{ k: number; frame: number }> = ({ k, frame }) => (
  <g opacity={k}>
    <rect x={-300} y={-300} width={1700} height={2600} fill="#FFC870" opacity={0.22} />
    {Array.from({ length: 7 }).map((_, i) => {
      const a = -0.2 + i * 0.22 + Math.sin(frame * 0.03) * 0.02;
      return <path key={i} d={`M980,120 L${980 - Math.cos(a) * 2600},${120 + Math.sin(a + 0.9) * 2600} L${980 - Math.cos(a + 0.07) * 2600},${120 + Math.sin(a + 0.97) * 2600} Z`} fill="#FFF3C4" opacity={0.28} />;
    })}
  </g>
);

// ---------------------------------------------------------------- confetti (deterministic)
export const Confetti: React.FC<{ frame: number; start: number; n?: number; x0?: number; y0?: number; spread?: number; fallTo?: number }> = ({ frame, start, n = 90, x0 = 540, y0 = 700, spread = 900, fallTo = 2100 }) => {
  const t = (frame - start) / 24;
  if (t < 0) return null;
  const cols = ["#FFD24A", "#4FE6D6", "#FF7FA8", "#9B5CFF", "#E8B23A", "#7DE08A", "#FFFFFF"];
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const a = rnd(i * 1.7) * Math.PI * 2;
        const v = 0.4 + rnd(i * 3.1) * 0.9;
        const burst = Math.min(1, t * 3);
        const x = x0 + Math.cos(a) * spread * 0.5 * v * burst + Math.sin(t * 3 + i) * 20 * t;
        const y = Math.min(fallTo, y0 + Math.sin(a) * spread * 0.35 * v * burst + t * t * 520 * (0.6 + rnd(i) * 0.6));
        const r = (t * 400 * (rnd(i * 5) - 0.5) + i * 30) % 360;
        return <rect key={i} x={-9} y={-5} width={18} height={10} rx={2} fill={cols[i % cols.length]} transform={`translate(${x} ${y}) rotate(${r}) scale(1 ${0.4 + 0.6 * Math.abs(Math.cos(t * 6 + i))})`} />;
      })}
    </g>
  );
};

// Blanket layer of BedTopDown, drawn again over Theo's legs.
export const BlanketTD: React.FC = () => (
  <g>
    <path d="M262,880 C400,850 680,852 818,880 L818,1560 Q818,1580 798,1580 L282,1580 Q262,1580 262,1560 Z" fill={C.blanket} {...ink} />
    {[960, 1100, 1260, 1420].map((y, i) => <path key={i} d={`M300,${y} Q540,${y - 26 + (i % 2) * 14} 780,${y}`} fill="none" stroke={C.blanketShade} strokeWidth={8} />)}
  </g>
);
