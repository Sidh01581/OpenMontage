import React from "react";
import { C, INK, SW, Limb } from "../later/art";
import { rnd } from "../we-need-to-talk/vart";

// SURE. — new art. Pure SVG. Same 6 px INK outline, flat cel color and big-eye construction as LATER.
// Dev (coworker), Sure (the people-pleasing villain), and Theo's sticky notes.

export const S = {
  lime: "#B9E24A",
  limeShade: "#8FBF2E",
  limeLight: "#E2F7A6",
  coral: "#FF7A59",
  note: "#FFE27A",
  noteShade: "#E8C84E",
  noteColors: ["#FFE27A", "#FF9FB8", "#9FE3F0", "#B9F28A", "#FFC36E"],
  devSkin: "#F2D0B0",
  devSkinShade: "#DDB28E",
  devHair: "#C8552A",
  devHairShade: "#A84420",
  sweater: "#4E9A5A",
  sweaterShade: "#3C7C46",
};

// ---------------------------------------------------------------- Dev (coworker)
// Local: origin = head center, head r ~100. Faces screen RIGHT by default (flip for left).
export const DevHead: React.FC<{ frame: number; talk?: number; lookX?: number; lookY?: number; smile?: boolean; serious?: boolean; turn?: number; closed?: boolean }> = ({ frame, talk = 0, lookX = 6, lookY = 2, smile = true, serious = false, turn = 14, closed = false }) => {
  const fx = turn;
  const blink = closed || (frame + 7) % 80 < 4;
  // curly hair: ring of bumps around the top
  const curls = Array.from({ length: 11 }).map((_, i) => {
    const a = Math.PI * (1.05 + (i / 10) * 0.9);
    const r = 92 + (i % 2) * 6;
    return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r + 6} r={34 + (i % 3) * 4} fill={S.devHair} stroke={INK} strokeWidth={SW} />;
  });
  return (
    <g>
      {curls}
      <circle cx={-96} cy={10} r={18} fill={S.devSkin} stroke={INK} strokeWidth={SW} />
      <ellipse cx={0} cy={6} rx={98} ry={102} fill={S.devSkin} stroke={INK} strokeWidth={SW} />
      {/* curl fringe over the forehead */}
      {[-60, -24, 12, 48].map((x, i) => <circle key={i} cx={x + fx * 0.5} cy={-70 + (i % 2) * 6} r={26} fill={S.devHair} stroke={INK} strokeWidth={5} />)}
      <rect x={-90} y={-76} width={180} height={30} fill={S.devHair} />
      {/* freckles */}
      {[[-36, 50], [-24, 58], [56, 50], [68, 56]].map(([x, y], i) => (x + fx > 99 ? null : <circle key={i} cx={x + fx} cy={y} r={3} fill={S.devHairShade} />))}
      {[[-30, 8, 24, 28], [40, 6, 21, 26]].map(([x, y, rx, ry], i) =>
        blink ? <path key={i} d={`M${x + fx - rx},${y} Q${x + fx},${y + 10} ${x + fx + rx},${y}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" /> : (
          <g key={i}>
            <ellipse cx={x + fx} cy={y} rx={rx} ry={ry} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
            <circle cx={x + fx + lookX} cy={y + lookY} r={9} fill={INK} />
            <circle cx={x + fx + lookX - 3} cy={y + lookY - 3} r={3} fill="#FFFFFF" />
            {serious && <path d={i === 0 ? `M${x + fx - rx - 3},${y - ry - 4} L${x + fx + rx + 3},${y - ry - 4} L${x + fx + rx + 3},${y - ry * 0.05} L${x + fx - rx - 3},${y - ry * 0.45} Z` : `M${x + fx - rx - 3},${y - ry - 4} L${x + fx + rx + 3},${y - ry - 4} L${x + fx + rx + 3},${y - ry * 0.45} L${x + fx - rx - 3},${y - ry * 0.05} Z`} fill={S.devSkin} stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
          </g>
        ))}
      {serious
        ? <path d={`M${fx - 60},-40 L${fx - 6},-22 M${fx + 20},-22 L${fx + 66},-40`} fill="none" stroke={S.devHairShade} strokeWidth={9} strokeLinecap="round" />
        : <path d={`M${fx - 56},-34 Q${fx - 32},-46 ${fx - 8},-36 M${fx + 22},-38 Q${fx + 42},-48 ${fx + 62},-36`} fill="none" stroke={S.devHairShade} strokeWidth={7} strokeLinecap="round" />}
      <path d={`M${fx + 8},30 Q${fx + 20},44 ${fx + 6},48`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {talk > 0.05
        ? <ellipse cx={fx + 4} cy={70} rx={16 - talk * 3} ry={4 + talk * 13} fill="#5A1E24" stroke={INK} strokeWidth={4} />
        : serious
          ? <path d={`M${fx - 18},74 Q${fx + 4},64 ${fx + 26},74`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          : smile
          ? <path d={`M${fx - 24},64 Q${fx + 4},86 ${fx + 32},62`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          : <path d={`M${fx - 14},70 L${fx + 22},70`} stroke={INK} strokeWidth={5} strokeLinecap="round" />}
    </g>
  );
};

export const Dev: React.FC<{
  x: number; y: number; s?: number; flip?: boolean; frame: number; talk?: number; lookX?: number; lookY?: number; headTilt?: number;
  prop?: "clipboard" | "box" | "none";
}> = ({ x, y, s = 1, flip = false, frame, talk, lookX, lookY, headTilt = 0, prop = "none" }) => {
  const breathe = Math.sin(frame * 0.11) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <rect x={-22} y={86} width={44} height={60} fill={S.devSkinShade} stroke={INK} strokeWidth={SW} />
      <path d="M-150,360 C-152,210 -110,138 -36,128 L36,128 C110,138 152,210 150,360 Z" fill={S.sweater} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M-40,128 Q0,160 40,128" fill="none" stroke={S.sweaterShade} strokeWidth={10} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M-120,${210 + i * 40} L120,${210 + i * 40}`} stroke={S.sweaterShade} strokeWidth={4} opacity={0.6} />)}
      <g transform={`rotate(${headTilt} 0 110) translate(0 ${breathe})`}>
        <DevHead frame={frame} talk={talk} lookX={lookX} lookY={lookY} />
      </g>
      {prop === "clipboard" && (
        <g transform="translate(110 250) rotate(8)">
          <rect x={-60} y={-80} width={120} height={160} rx={10} fill="#B07E4A" stroke={INK} strokeWidth={SW} />
          <rect x={-46} y={-64} width={92} height={130} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-34} y1={-44 + i * 24} x2={34} y2={-44 + i * 24} stroke="#9AA3B5" strokeWidth={4} />)}
          <rect x={-20} y={-90} width={40} height={20} rx={5} fill="#C9CED6" stroke={INK} strokeWidth={4} />
          <circle cx={-40} cy={40} r={22} fill={S.devSkin} stroke={INK} strokeWidth={5} />
        </g>
      )}
      {prop === "box" && (
        <g transform={`translate(20 ${300 + Math.sin(frame * 0.3) * 4}) rotate(${Math.sin(frame * 0.25) * 2})`}>
          <path d="M-150,-90 L150,-90 L140,90 L-140,90 Z" fill="#C9955E" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M-150,-90 L-110,-130 L190,-130 L150,-90" fill="#B07E4A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <rect x={-40} y={-30} width={80} height={44} fill="#F4EEE2" stroke={INK} strokeWidth={4} />
          <text x={0} y={0} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={800} fontSize={24} fill="#7A5A38">SAT</text>
          <circle cx={-150} cy={0} r={22} fill={S.devSkin} stroke={INK} strokeWidth={5} />
          <circle cx={146} cy={0} r={22} fill={S.devSkin} stroke={INK} strokeWidth={5} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- Sure (the villain)
// Local radius ~100 (body). A lime blob with a giant permanent grin, big shiny eyes, a head that never stops nodding,
// tiny thumbs-up hands, a coral rim light, and a sticky note stuck to its side.
export const Sure: React.FC<{
  x: number; y: number; s: number; frame: number; phase?: number; mouth?: number; frozen?: boolean; thumbs?: boolean; squash?: number; opacity?: number; whisper?: boolean;
}> = ({ x, y, s, frame, phase = 0, mouth = 0, frozen = false, thumbs = true, squash = 1, opacity = 1, whisper = false }) => {
  const f = frozen ? 0 : frame;
  const nod = frozen ? 10 : Math.sin(f * 0.6 + phase) * 9;
  const bob = frozen ? 0 : Math.abs(Math.sin(f * 0.6 + phase)) * -8;
  const grinOpen = 0.55 + mouth * 0.45;
  return (
    <g transform={`translate(${x} ${y + bob * s}) scale(${s / Math.sqrt(squash)} ${s * squash})`} opacity={opacity}>
      {/* feet */}
      <ellipse cx={-34} cy={98} rx={26} ry={14} fill={S.limeShade} stroke={INK} strokeWidth={SW} />
      <ellipse cx={34} cy={98} rx={26} ry={14} fill={S.limeShade} stroke={INK} strokeWidth={SW} />
      <g transform={`rotate(${nod} 0 80)`}>
        <circle cx={6} cy={-4} r={108} fill="none" stroke={S.coral} strokeWidth={16} opacity={0.3} />
        <ellipse cx={0} cy={0} rx={104} ry={98} fill={S.lime} stroke={INK} strokeWidth={SW} />
        <ellipse cx={-34} cy={-50} rx={30} ry={14} fill={S.limeLight} opacity={0.7} transform="rotate(-20 -34 -50)" />
        <path d="M100,-20 Q108,20 92,56" fill="none" stroke={S.coral} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
        {/* stuck-on sticky note */}
        <g transform="translate(70 34) rotate(18)">
          <rect x={-20} y={-20} width={40} height={40} fill={S.note} stroke={INK} strokeWidth={4} />
          <line x1={-12} y1={-6} x2={12} y2={-6} stroke={S.noteShade} strokeWidth={3} />
          <line x1={-12} y1={4} x2={8} y2={4} stroke={S.noteShade} strokeWidth={3} />
        </g>
        {/* eyes: big and shiny (frozen = tiny shocked pupils) */}
        {[-34, 30].map((ex, i) => (
          <g key={i}>
            <ellipse cx={ex} cy={-24} rx={24} ry={28} fill="#FFFFFF" stroke={INK} strokeWidth={4.5} />
            <circle cx={ex + 4} cy={-20} r={frozen ? 5 : 12} fill={INK} />
            {!frozen && <circle cx={ex} cy={-25} r={4.5} fill="#FFFFFF" />}
          </g>
        ))}
        {/* the permanent grin */}
        {whisper ? (
          <path d="M-46,30 Q0,58 46,30" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        ) : (
          <g>
            <path d={`M-62,22 Q0,${22 + 70 * grinOpen} 62,22 Z`} fill="#5A1E24" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
            <path d={`M-54,24 L54,24 L50,36 Q0,${40 + 6 * grinOpen} -50,36 Z`} fill="#FFFFFF" />
            <ellipse cx={0} cy={22 + 46 * grinOpen} rx={24} ry={8 * grinOpen} fill="#FF8FA6" />
          </g>
        )}
        {frozen && <path d="M-58,-66 Q-36,-84 -12,-68 M10,-68 Q32,-84 56,-66" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
      </g>
      {/* tiny thumbs-up hands */}
      {thumbs && [-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * 108} ${30 + (frozen ? 0 : Math.sin(f * 0.6 + phase + side) * 4)})`}>
          {/* fist with curled fingers + a thumb angled up and outward (unmistakably a thumbs-up) */}
          <g transform={`scale(${side} 1)`}>
            <rect x={-4} y={-40} width={16} height={34} rx={8} fill={S.lime} stroke={INK} strokeWidth={4.5} transform="rotate(-18 4 -6)" />
            <rect x={-22} y={-14} width={40} height={36} rx={14} fill={S.lime} stroke={INK} strokeWidth={5} />
            <path d="M-12,-2 L10,-2 M-12,8 L10,8" stroke={S.limeShade} strokeWidth={4} strokeLinecap="round" />
          </g>
        </g>
      ))}
    </g>
  );
};

// A crowd of Sures, deterministic layout inside a box. n = count. Each nods on its own phase.
export const SureSwarm: React.FC<{ n: number; x: number; y: number; w: number; h: number; s: number; frame: number; frozen?: boolean; whisper?: boolean; mouth?: number; seed?: number }> =
  ({ n, x, y, w, h, s, frame, frozen, whisper, mouth = 0, seed = 0 }) => {
    const items = Array.from({ length: n }).map((_, i) => ({
      i, px: x + rnd(i * 7.1 + seed) * w, py: y + rnd(i * 3.7 + seed + 1) * h, ss: s * (0.75 + rnd(i * 2.3 + seed) * 0.5),
    })).sort((a, b) => a.py - b.py);
    return <g>{items.map(({ i, px, py, ss }) => <Sure key={i} x={px} y={py} s={ss} frame={frame} phase={i * 1.3} frozen={frozen} whisper={whisper} mouth={mouth} thumbs={i % 2 === 0} />)}</g>;
  };

// ---------------------------------------------------------------- Theo's sticky notes (Head-local room coords; head center 985,425)
export const NOTE_SPOTS: [number, number, number][] = [
  [970, 350, -8],  // 1: forehead
  [1090, 446, 14], // 2: cheek
  [912, 330, -24], // 3: hair left
  [1040, 300, 20], // 4: hair top
  [902, 460, -12], // 5: ear side
  [1000, 552, 6],  // 6: chin
  [1080, 380, 28], // 7: temple
  [945, 270, -6],  // 8: crown
];
export const StickyNote: React.FC<{ x: number; y: number; r: number; color: string; s?: number; lift?: number }> = ({ x, y, r, color, s = 1, lift = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d={`M-28,-28 L28,-28 L28,${28 - lift * 10} Q${10},${30 + lift * 6} -28,28 Z`} fill={color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <line x1={-18} y1={-12} x2={18} y2={-12} stroke="#00000022" strokeWidth={3} />
    <line x1={-18} y1={0} x2={12} y2={0} stroke="#00000022" strokeWidth={3} />
  </g>
);
export const TheoNotes: React.FC<{ n: number; frame: number; slapFrame?: number }> = ({ n, frame, slapFrame }) => (
  <g>
    {NOTE_SPOTS.slice(0, n).map(([x, y, r], i) => {
      const last = i === n - 1 && slapFrame !== undefined;
      const k = last ? Math.min(1, Math.max(0, (frame - slapFrame!) / 3)) : 1;
      if (last && frame < slapFrame!) return null;
      const s = last ? 1 + (1 - k) * 0.8 : 1;
      return <StickyNote key={i} x={lerpN(x - 160, x, k)} y={lerpN(y - 200, y, k)} r={r + (1 - k) * 40} color={S.noteColors[i % 5]} s={s} lift={Math.sin(frame * 0.2 + i) * 0.3 + 0.3} />;
    })}
  </g>
);
const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

// Body coverage for the night shots: many notes over the hoodie (TheoSeated room coords).
export const BodyNotes: React.FC<{ n: number; frame: number }> = ({ n, frame }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <StickyNote key={i} x={850 + rnd(i * 3.3) * 170} y={520 + rnd(i * 5.9) * 190} r={(rnd(i * 1.7) - 0.5) * 50} color={S.noteColors[i % 5]} lift={Math.sin(frame * 0.15 + i) * 0.3 + 0.3} />
    ))}
  </g>
);

// Hoodie pocket (front of TheoSeated torso), so Sure can climb out of it.
export const HoodiePocket: React.FC = () => (
  <g>
    <path d="M856,650 Q930,632 998,644 L1000,708 L852,710 Z" fill={C.hoodie} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M864,656 Q930,642 990,652" fill="none" stroke={C.hoodieShade} strokeWidth={5} />
  </g>
);

export { Limb };
