import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Robot, RobotExpr, RobotFace, R } from "./robot";
import { DevStand, Bucket, TheoCoffee, PriyaReach, RobotChair } from "./chars";
import { INK, SW } from "../later/art";

// AUTOMATED. — character design sheets (2400 x 1500, plain neutral background).
const font = "'Helvetica Neue', Arial, sans-serif";
const BG = "#EEF0F3";
const Label: React.FC<{ x: number; y: number; children: React.ReactNode; size?: number }> = ({ x, y, children, size = 34 }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={size} fill="#3A3A40">{children}</text>
);
const Title: React.FC<{ t: string; sub: string }> = ({ t, sub }) => (
  <>
    <text x={60} y={86} fontFamily={font} fontWeight={900} fontSize={56} fill="#22232A">{t}</text>
    <text x={60} y={132} fontFamily={font} fontWeight={600} fontSize={28} fill="#666A74">{sub}</text>
  </>
);
const Floor: React.FC<{ y: number }> = ({ y }) => <line x1={40} y1={y} x2={2360} y2={y} stroke="#C9CDD4" strokeWidth={4} />;

// Head-only expression chip
const RobotHeadChip: React.FC<{ x: number; y: number; s: number; expr: RobotExpr; talk?: number }> = ({ x, y, s, expr, talk = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) translate(0 210)`}>
    <circle cx={-90} cy={-210} r={17} fill={R.accent} stroke={INK} strokeWidth={5} />
    <circle cx={90} cy={-210} r={17} fill={R.accent} stroke={INK} strokeWidth={5} />
    <rect x={-88} y={-272} width={176} height={124} rx={44} fill={R.shell} stroke={INK} strokeWidth={SW} />
    <rect x={-68} y={-256} width={136} height={92} rx={30} fill={R.screen} stroke={INK} strokeWidth={4} />
    <RobotFace expr={expr} talk={talk} frame={1} />
  </g>
);

export const RobotReferenceSheet: React.FC = () => {
  const f = 4;
  const exprs: [RobotExpr | "talk", string][] = [["happy", "Happy"], ["neutral", "Neutral"], ["joy", "Joy"], ["focus", "Focused"], ["proud", "Proud"], ["blink", "Blink"], ["talk", "Talking"]];
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={2400} height={1500}>
        <Title t="AUTOMATED. — The AI robot (AutoWork AI)" sub="Desk-sized, friendly. White shell, navy screen face, cyan eyes + smile, blue ears + antenna light, thin grey arms, tread base. Height ≈ 0.6 × Dev seated." />
        <Floor y={900} />
        <Robot x={230} y={900} s={1.6} frame={f} pose="idle" expr="happy" face={0} bob={false} />
        <Label x={230} y={960}>Front</Label>
        <Robot x={620} y={900} s={1.6} frame={f} pose="idle" expr="happy" face={0.6} bob={false} />
        <Label x={620} y={960}>3/4 (right)</Label>
        <Robot x={1010} y={900} s={1.6} frame={f} pose="idle" expr="happy" face={-0.6} bob={false} />
        <Label x={1010} y={960}>3/4 (left)</Label>
        <Robot x={1400} y={900} s={1.6} frame={f} pose="wave" expr="joy" face={-0.5} bob={false} />
        <Label x={1400} y={960}>Wave</Label>
        <g>
          <rect x={1790} y={862} width={200} height={22} rx={5} fill="#3A3F4A" stroke={INK} strokeWidth={4} />
          <Robot x={1700} y={900} s={1.6} frame={f} pose="type" typeSpeed={2.4} expr="focus" face={0.6} reach={110} keyY={-22} bob={false} />
        </g>
        <Label x={1760} y={960}>Typing (blur)</Label>
        <Robot x={2160} y={900} s={1.6} frame={f} pose="thumbs" expr="proud" face={0.3} bob={false} />
        <Label x={2160} y={960}>Thumbs-up</Label>
        <line x1={40} y1={1010} x2={2360} y2={1010} stroke="#D5D9DF" strokeWidth={3} />
        <Label x={1200} y={1050} size={30}>Expressions (screen face)</Label>
        {exprs.map(([e, l], i) => (
          <g key={l}>
            <RobotHeadChip x={250 + i * 320} y={1170} s={1.2} expr={e === "talk" ? "happy" : e} talk={e === "talk" ? 0.7 : 0} />
            <Label x={250 + i * 320} y={1350} size={30}>{l}</Label>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// New poses for this film, all from the approved Dev / Theo sheets + the Priya rig + the robot.
export const PoseSheet: React.FC = () => {
  const f = useCurrentFrame() + 4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={2400} height={1500}>
        <Title t="AUTOMATED. — new poses" sub="Dev, Theo from the approved reference sheets; Priya rig; robot. Plain background, no sets." />
        <Floor y={1400} />
        <DevStand x={200} y={1208} s={1.0} frame={f} arms="what" head={{ talk: 1, lookY: -3, lookX: 12 }} />
        <Label x={220} y={1455}>Dev: "WHAT?!"</Label>
        <DevStand x={560} y={1208} s={1.0} frame={f} arms="point" head={{ serious: true, talk: 0.5, lookX: 16 }} />
        <Label x={620} y={1455}>Dev: "But I created it!"</Label>
        <DevStand x={950} y={1208} s={1.0} frame={f} arms="mop" head={{ smile: false, lookX: 14 }} />
        <Bucket x={1200} y={1400} s={0.9} />
        <Label x={1040} y={1455}>Dev with mop + bucket</Label>
        <g>
          <rect x={1500} y={1150} width={330} height={24} rx={6} fill="#D9D6CF" stroke={INK} strokeWidth={SW} />
          <path d="M1650,1146 L1760,1146 L1755,1134 L1655,1134 Z" fill="#3A3F4A" stroke={INK} strokeWidth={4} />
          <RobotChair x={1460} y={1240} s={1.0} frame={f} robot={{ reach: 165, keyY: -112 }} />
        </g>
        <Label x={1600} y={1455}>Robot in Dev's chair</Label>
        <line x1={1900} y1={700} x2={1900} y2={1400} stroke="#D5D9DF" strokeWidth={3} />
        <TheoCoffee x={2150} y={1240} s={1.0} frame={f} h={{ expr: "neutral", lookX: -8 }} flip />
        <Label x={2150} y={1455}>Theo + coffee</Label>
        {/* Priya row */}
        <line x1={40} y1={690} x2={2360} y2={690} stroke="#D5D9DF" strokeWidth={3} />
        <PriyaReach x={330} y={260} s={0.8} frame={f} expr="flat" talk={0.6} lookX={-8} arm="phone" />
        <Label x={330} y={660}>Priya: phone alert</Label>
        <g>
          <Robot x={760} y={600} s={0.9} frame={f} pose="idle" expr="joy" face={0.4} bob={false} />
          <PriyaReach x={1040} y={260} s={0.8} frame={f} expr="smile" lookX={-10} lookY={4} arm="pat" target={[-345, 92]} />
        </g>
        <Label x={900} y={660}>Priya pats the robot</Label>
        <PriyaReach x={1500} y={260} s={0.8} frame={f} expr="flat" talk={0.5} lookX={-10} />
        <Label x={1500} y={660}>Priya: cold verdict</Label>
        <PriyaReach x={1950} y={260} s={0.8} frame={f} expr="neutral" talk={0.9} lookX={-8} />
        <Label x={1950} y={660}>Priya: alarmed</Label>
      </svg>
    </AbsoluteFill>
  );
};
