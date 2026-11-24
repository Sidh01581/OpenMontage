import React from "react";
import { C, INK, SW, Head, Limb, Expr, Pt } from "../later/art";
import { DEFAULT, TheoPose } from "../later/rig";
import { P } from "./vart";

// TheoPuppetV — LATER's TheoPuppet (rig.tsx) geometry, unchanged, plus the extras this Short needs:
// inside-out hoodie, lanyard, an overlay slot inside the head group (MessyHair, GreyBeard, tear, sweat)
// and a prop slot at the front hand (box, coffees, noodle cup, pointing finger). The Head is the approved art.

const UPPER = 80, FORE = 74, THIGH = 80, SHIN = 78;
const rad = (d: number) => (d * Math.PI) / 180;
const fk = (o: Pt, deg: number, len: number): Pt => [o[0] + Math.sin(rad(deg)) * len, o[1] + Math.cos(rad(deg)) * len];

const Hand: React.FC<{ p: Pt; kind?: "fist" | "thumb" | "open"; ang: number; back?: boolean }> = ({ p, kind = "fist", ang, back }) => {
  const col = back ? C.skinShade : C.skin;
  return (
    <g transform={`translate(${p[0]} ${p[1]}) rotate(${-ang})`}>
      {kind === "open" && <ellipse cx={0} cy={10} rx={14} ry={22} fill={col} stroke={INK} strokeWidth={5} />}
      {kind !== "open" && <circle cx={0} cy={4} r={18} fill={col} stroke={INK} strokeWidth={5} />}
      {kind === "thumb" && <rect x={-7} y={-26} width={14} height={26} rx={7} fill={col} stroke={INK} strokeWidth={4} transform="rotate(180 0 -6)" />}
    </g>
  );
};

export const TheoPuppetV: React.FC<{
  x: number; y: number; s?: number; rot?: number; flip?: boolean;
  pose: TheoPose; expr: Expr; frame: number; lookX?: number; lookY?: number; talk?: number; glassesY?: number; wind?: number; eyesClosed?: boolean;
  insideOut?: boolean; lanyard?: boolean; headOverlay?: React.ReactNode; frontProp?: React.ReactNode; propUnderHand?: boolean;
}> = ({ x, y, s = 1, rot = 0, flip = false, pose, expr, frame, lookX = 6, lookY = 4, talk, glassesY, wind, eyesClosed, insideOut = false, lanyard = false, headOverlay, frontProp, propUnderHand = true }) => {
  const Pz = { ...DEFAULT, ...pose };
  const breathe = Math.sin(frame * 0.12) * 2.5;
  const hood = insideOut ? "#D9C59A" : C.hoodie;
  const hoodShade = insideOut ? "#BFA978" : C.hoodieShade;
  const hipF: Pt = [14, -6], hipB: Pt = [-14, -6];
  const kneeF = fk(hipF, Pz.legF[0], THIGH), footF = fk(kneeF, Pz.legF[0] + Pz.legF[1], SHIN);
  const kneeB = fk(hipB, Pz.legB[0], THIGH), footB = fk(kneeB, Pz.legB[0] + Pz.legB[1], SHIN);
  const shF: Pt = [22, -172 + breathe * 0.4], shB: Pt = [-14, -170 + breathe * 0.4];
  const k = pose.armStretch ?? 1;
  const elF = fk(shF, Pz.armF[0], UPPER * k), haF = fk(elF, Pz.armF[0] + Pz.armF[1], FORE * k);
  const elB = fk(shB, Pz.armB[0], UPPER * k), haB = fk(elB, Pz.armB[0] + Pz.armB[1], FORE * k);
  const path3 = (a: Pt, b: Pt, c: Pt) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;
  const shoe = (f: Pt, deg: number) => (
    <g transform={`translate(${f[0]} ${f[1]}) rotate(${-deg * 0.6})`}>
      <ellipse cx={16} cy={6} rx={34} ry={15} fill="#FFFFFF" stroke={INK} strokeWidth={SW} />
    </g>
  );
  const prop = frontProp ? <g transform={`translate(${haF[0]} ${haF[1]})`}>{frontProp}</g> : null;
  const frontArm = (
    <g>
      <Limb d={path3(shF, elF, haF)} color={hood} w={44} />
      {propUnderHand && prop}
      <Hand p={haF} kind={pose.handF} ang={Pz.armF[0] + Pz.armF[1]} />
      {!propUnderHand && prop}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
      <Limb d={path3(hipB, kneeB, footB)} color="#3C3F48" w={46} />
      {shoe(footB, Pz.legB[0] + Pz.legB[1])}
      <g transform={`rotate(${Pz.lean} 0 0)`}>
        <Limb d={path3(shB, elB, haB)} color={hoodShade} w={40} />
        <Hand p={haB} ang={Pz.armB[0] + Pz.armB[1]} back />
      </g>
      <Limb d={path3(hipF, kneeF, footF)} color={C.pants} w={48} />
      {shoe(footF, Pz.legF[0] + Pz.legF[1])}
      <g transform={`rotate(${Pz.lean} 0 0)`}>
        <path d={`M-60,6 C-70,-70 -60,${-150 + breathe} -40,${-186 + breathe} C-10,${-200 + breathe} 30,${-200 + breathe} 48,${-184 + breathe} C66,-140 66,-60 58,6 Z`} fill={hood} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M-58,-4 L56,-4" stroke={hoodShade} strokeWidth={8} />
        <path d="M-20,-60 Q8,-52 36,-60" fill="none" stroke={hoodShade} strokeWidth={6} />
        {insideOut ? (
          <g>
            <path d="M-44,-170 C-50,-110 -50,-50 -46,0" fill="none" stroke={INK} strokeWidth={3} strokeDasharray="8 6" />
            <path d="M40,-170 C48,-110 48,-50 44,0" fill="none" stroke={INK} strokeWidth={3} strokeDasharray="8 6" />
            <rect x={-14} y={-196 + breathe} width={24} height={28} fill="#F4EEE2" stroke={INK} strokeWidth={3} transform={`rotate(${8 + Math.sin(frame * 0.2) * 8} -2 ${-196 + breathe})`} />
          </g>
        ) : (
          <path d="M14,-176 L10,-130 M26,-176 L24,-134" stroke={INK} strokeWidth={3} />
        )}
        <ellipse cx={2} cy={-186 + breathe} rx={50} ry={26} fill={hoodShade} stroke={INK} strokeWidth={SW} />
        {lanyard && (
          <g>
            <path d={`M-22,${-176 + breathe} Q-10,-120 4,-104 M26,${-176 + breathe} Q20,-120 10,-104`} fill="none" stroke={P.lanyard} strokeWidth={6} />
            <rect x={-16} y={-108} width={36} height={46} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
            <rect x={-16} y={-108} width={36} height={12} rx={3} fill={P.lanyard} stroke={INK} strokeWidth={3} />
          </g>
        )}
        {pose.armsBehindHead && frontArm}
        <g transform={`translate(${12 + Pz.headDX} ${-278 + Pz.headDY + breathe}) rotate(${Pz.headTilt}) translate(-985 -425)`}>
          <Head expr={expr} frame={frame} lookX={lookX} lookY={lookY} talk={talk} glassesY={glassesY} wind={wind} eyesClosed={eyesClosed} />
          {headOverlay}
        </g>
        {!pose.armsBehindHead && frontArm}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- hand props (origin = front hand center)
export const DeskBox: React.FC<{ frame: number }> = ({ frame }) => (
  <g transform="translate(-30 -40)">
    {/* drooping plant, framed photo, mug poking out */}
    <path d={`M-30,-60 Q-40,-110 ${-80 + Math.sin(frame * 0.1) * 3},-96`} fill="none" stroke="#6E8A4E" strokeWidth={8} strokeLinecap="round" />
    <ellipse cx={-80 + Math.sin(frame * 0.1) * 3} cy={-90} rx={16} ry={8} fill="#8AA05E" stroke={INK} strokeWidth={3} transform="rotate(30 -80 -90)" />
    <rect x={-44} y={-82} width={30} height={30} fill="#C0566A" stroke={INK} strokeWidth={4} />
    <rect x={0} y={-104} width={46} height={56} fill="#F4EEE2" stroke={INK} strokeWidth={4} transform="rotate(10 23 -76)" />
    <circle cx={26} cy={-80} r={10} fill={C.cat} stroke={INK} strokeWidth={2} />
    <path d="M-80,-56 L80,-56 L70,40 L-70,40 Z" fill="#C9955E" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M-80,-56 L-50,-80 L110,-80 L80,-56" fill="#B07E4A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-40,-20 L40,-20" stroke="#A9763E" strokeWidth={5} />
  </g>
);

export const CoffeeStack: React.FC = () => (
  <g transform="translate(14 -10)">
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${i * 6 - 6} ${-i * 64}) rotate(${(i - 1) * 4})`}>
        <path d="M-24,-56 L24,-56 L18,0 L-18,0 Z" fill="#F4EEE2" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-21} y={-40} width={42} height={18} fill="#8B5E3C" stroke={INK} strokeWidth={3} />
        <rect x={-28} y={-64} width={56} height={10} rx={4} fill="#5E4A3A" stroke={INK} strokeWidth={4} />
      </g>
    ))}
  </g>
);

export const NoodleCup: React.FC<{ frame: number; slurp?: number }> = ({ frame, slurp = 0 }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = ((frame * 0.9 + i * 14) % 42) / 42;
      return <path key={i} d={`M${-14 + i * 14},${-60 - ph * 70} q-10,-12 0,-24 q10,-12 0,-24`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.75 * (1 - ph)} />;
    })}
    {slurp > 0 && <path d={`M-4,-50 Q${-20 - slurp * 10},${-90} -30,${-120 - slurp * 20}`} fill="none" stroke="#F2D27A" strokeWidth={6} strokeLinecap="round" />}
    <line x1={10} y1={-46} x2={40} y2={-130} stroke="#C9955E" strokeWidth={6} strokeLinecap="round" />
    <line x1={20} y1={-44} x2={58} y2={-122} stroke="#C9955E" strokeWidth={6} strokeLinecap="round" />
    <path d="M-38,-50 L38,-50 L28,30 L-28,30 Z" fill="#F4EEE2" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x={-34} y={-30} width={66} height={24} fill="#D94B4B" />
    <path d="M-38,-50 L38,-50" stroke={INK} strokeWidth={SW} />
  </g>
);

// Index finger pointing up (rehearsal "I can explain").
export const Finger: React.FC<{ wag?: number }> = ({ wag = 0 }) => (
  <g transform={`rotate(${wag})`}>
    <rect x={-8} y={-62} width={17} height={54} rx={8} fill={C.skin} stroke={INK} strokeWidth={5} />
  </g>
);

// Tear on Theo's cheek (head-local coords, LATER Head space).
export const Tear: React.FC<{ frame: number; start: number }> = ({ frame, start }) => {
  const t = Math.max(0, Math.min(1, (frame - start) / 30));
  if (frame < start) return null;
  return (
    <g>
      <path d={`M1052,462 Q1050,${470 + t * 40} 1054,${476 + t * 50}`} fill="none" stroke="#9FD3F0" strokeWidth={7} strokeLinecap="round" />
      <path d={`M1054,${474 + t * 52} q-8,12 0,18 q8,-6 0,-18 Z`} fill="#9FD3F0" stroke={INK} strokeWidth={3} />
    </g>
  );
};
