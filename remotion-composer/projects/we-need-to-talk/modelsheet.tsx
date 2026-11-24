import React from "react";
import { Mochi, Expr } from "../later/art";
import { TheoPuppet, POSES } from "../later/rig";
import { Priya, PriyaExpr, WhatIf, WhatIfStorm, WhatIfPop, TheoSeated, MessyHair, GreyBeard, MochiHardHat, Brick, Mug, P } from "./vart";

// Model sheets for the character_design gate (1920x1080 landscape, review only).
const Sheet: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill="#F3ECDD" />
    <text x={40} y={60} fontFamily="'Helvetica Neue', Arial" fontWeight={800} fontSize={40} fill="#141018">{title}</text>
    {children}
  </svg>
);
const Label: React.FC<{ x: number; y: number; t: string }> = ({ x, y, t }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={700} fontSize={22} fill="#4A4040">{t}</text>
);

export const SheetPriyaWhatIf: React.FC = () => {
  const ex: [PriyaExpr, string, number, number][] = [["flat", "flat (shots 1, 14)", 0, 0], ["neutral", "talking", 0.75, 0], ["lookup", "looks up (14)", 0, -12], ["smile", "HUGE smile (16)", 0, 0]];
  return (
    <Sheet title="WE NEED TO TALK. — Priya (boss) + What-If (overthinking)">
      {ex.map(([e, l, talk, ly], i) => (
        <g key={e}>
          <Priya x={190 + i * 300} y={250} s={0.85} frame={0} expr={e} talk={talk} lookY={ly || undefined} />
          <Label x={190 + i * 300} y={555} t={l} />
        </g>
      ))}
      <g>
        <Priya x={1560} y={230} s={0.8} frame={0} expr="flat" arms="ledge" ledgeY={118} part="all" />
        <Label x={1560} y={555} t="leaning on the partition, #1 mug" />
      </g>
      {/* What-If size ladder (scale = relative to Theo's head radius 108) */}
      <line x1={60} y1={900} x2={1240} y2={900} stroke="#B8A890" strokeWidth={3} strokeDasharray="10 8" />
      <WhatIf x={110} y={878} s={0.2} frame={0} lineBoost={1.6} /><Label x={110} y={950} t="marble (3)" />
      <WhatIf x={250} y={850} s={0.5} frame={0} /><Label x={250} y={950} t="tennis ball (4)" />
      <WhatIf x={430} y={830} s={0.75} frame={0} mood="smug" /><Label x={430} y={950} t="cat-size (5-7)" />
      <WhatIf x={680} y={780} s={1.2} frame={0} mood="spooky" mouth={0.6} /><Label x={680} y={950} t="dog-size (8)" />
      <WhatIfPop x={980} y={800} s={0.9} frame={0} p={0.45} /><Label x={980} y={950} t="balloon pop (16)" />
      <WhatIf x={1170} y={880} s={0.22} frame={0} mood="tiny" lineBoost={1.6} /><Label x={1170} y={950} t="tiny again (18)" />
      <WhatIfStorm x={1580} y={790} rx={290} ry={170} frame={6} eyes={26} />
      <Label x={1580} y={1010} t="ceiling storm (11): dozens of tiny spiral eyes" />
    </Sheet>
  );
};

const SeatedTheo: React.FC<{ x: number; s: number; expr: Expr; insideOut?: boolean; extra?: React.ReactNode; lanyard?: boolean; what?: number }> = ({ x, s, expr, insideOut, extra, lanyard = true, what }) => (
  <g transform={`translate(${x} 300) scale(${s}) translate(-985 -425)`}>
    <TheoSeated expr={expr} frame={0} insideOut={insideOut} lanyard={lanyard} lookX={4} lookY={4} />
    {extra}
    {what ? <WhatIf x={995} y={300 - 100 * what + 12} s={what} frame={0} /> : null}
  </g>
);

export const SheetTheoMochi: React.FC = () => (
  <Sheet title="WE NEED TO TALK. — Theo variants (LATER. rig, unchanged head) + Mochi">
    <SeatedTheo x={250} s={0.95} expr="neutral" /><Label x={250} y={640} t="work: + blue ID lanyard" />
    <SeatedTheo x={640} s={0.95} expr="panic" what={0.5} /><Label x={640} y={640} t="spiral: What-If on head" />
    <SeatedTheo x={1030} s={0.95} expr="exhausted" insideOut extra={<MessyHair frame={0} />} />
    <Label x={1030} y={640} t="morning: bags, wild hair, inside-out" />
    <SeatedTheo x={1420} s={0.95} expr="sad" lanyard={false} extra={<GreyBeard />} /><Label x={1420} y={640} t="dream: grey beard" />
    <g transform="translate(1730 560) scale(0.8)">
      <TheoPuppet x={0} y={0} pose={POSES.walk_contact_a} expr="exhausted" frame={0} />
      <Mug x={150} y={-150} s={0.7} frame={0} />
    </g>
    <Label x={1740} y={640} t="zombie walk (13)" />
    <g transform="translate(360 1000)"><Mochi x={0} y={0} s={1.3} frame={0} pose="sit" mood="judge" /><g transform="scale(1.3)"><MochiHardHat /><Brick x={-14} y={-12} r={-4} s={0.9} /></g></g>
    <Label x={360} y={1060} t="Mochi: hard hat + brick, betrayed (7)" />
    <g transform="translate(860 1010)"><Mochi x={0} y={0} s={1.4} frame={0} pose="sleep" /></g>
    <Label x={860} y={1060} t="Mochi asleep (9, 18): unchanged" />
    <text x={1200} y={760} fontFamily="'Helvetica Neue', Arial" fontSize={24} fill="#4A4040">
      <tspan x={1200} dy={0}>Colors: What-If violet {P.wViolet} + teal rim {P.wTeal}</tspan>
      <tspan x={1200} dy={34}>(never LATER's magenta). Priya teal blazer {P.blazer},</tspan>
      <tspan x={1200} dy={34}>black bob, rectangular glasses. Same 6 px INK outline,</tspan>
      <tspan x={1200} dy={34}>big white eyes + small pupils as Theo.</tspan>
    </text>
  </Sheet>
);
