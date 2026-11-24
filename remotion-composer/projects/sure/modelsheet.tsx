import React from "react";
import { Expr } from "../later/art";
import { TheoSeated } from "../we-need-to-talk/vart";
import { Dev, Sure, SureSwarm, TheoNotes, BodyNotes, S } from "./sart";

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

export const SheetDevSure: React.FC = () => (
  <Sheet title="SURE. — Dev (coworker) + Sure (the villain)">
    <Dev x={170} y={230} s={0.8} frame={3} lookX={8} lookY={4} /><Label x={170} y={540} t="Dev: smile" />
    <Dev x={450} y={230} s={0.8} frame={3} talk={0.8} lookX={8} lookY={4} /><Label x={450} y={540} t="talking" />
    <Dev x={760} y={210} s={0.8} frame={3} prop="box" lookX={6} lookY={6} /><Label x={760} y={540} t="moving box (shot 5)" />
    {/* Sure counts */}
    <line x1={1000} y1={470} x2={1880} y2={470} stroke="#B8A890" strokeWidth={3} strokeDasharray="10 8" />
    <Sure x={1080} y={360} s={0.9} frame={4} /><Label x={1080} y={540} t="Sure x1" />
    <Sure x={1290} y={360} s={0.9} frame={4} mouth={0.9} /><Label x={1290} y={540} t="talking" />
    <Sure x={1500} y={360} s={0.9} frame={4} frozen /><Label x={1500} y={540} t="FROZEN (after NO!)" />
    <Sure x={1720} y={360} s={0.9} frame={4} whisper thumbs={false} /><Label x={1720} y={540} t="whisper (night)" />
    <SureSwarm n={2} x={80} y={790} w={140} h={40} s={0.42} frame={6} /><Label x={150} y={960} t="x2" />
    <SureSwarm n={4} x={330} y={760} w={260} h={80} s={0.38} frame={6} seed={2} /><Label x={460} y={960} t="x4" />
    <SureSwarm n={8} x={700} y={720} w={420} h={150} s={0.32} frame={6} seed={5} /><Label x={910} y={960} t="x8" />
    <SureSwarm n={24} x={1220} y={640} w={620} h={260} s={0.26} frame={6} seed={9} /><Label x={1530} y={960} t="swarm (chant)" />
    <Sure x={1830} y={1010} s={0.16} frame={4} /><Label x={1830} y={1060} t="tiny (18)" />
  </Sheet>
);

const Theo: React.FC<{ x: number; expr: Expr; n: number; body?: number; label: string }> = ({ x, expr, n, body = 0, label }) => (
  <g>
    <g transform={`translate(${x} 330) scale(0.9) translate(-985 -425)`}>
      <TheoSeated expr={expr} frame={0} lookX={4} lookY={4} headOverlay={<TheoNotes n={n} frame={0} />} />
      {body > 0 && <BodyNotes n={body} frame={0} />}
    </g>
    <Label x={x} y={680} t={label} />
  </g>
);

export const SheetTheo: React.FC = () => (
  <Sheet title="SURE. — Theo's sticky-note scoreboard (LATER head unchanged)">
    <Theo x={230} expr="grin" n={1} label="yes #1: forehead" />
    <Theo x={610} expr="grin" n={2} label="yes #2: cheek" />
    <Theo x={990} expr="smile" n={4} label="yes #4" />
    <Theo x={1370} expr="exhausted" n={8} body={18} label="night: buried" />
    <Theo x={1730} expr="determined" n={8} body={18} label="NO! (proud)" />
    <text x={60} y={800} fontFamily="'Helvetica Neue', Arial" fontSize={26} fill="#4A4040">
      <tspan x={60} dy={0}>Sure: lime {S.lime} + coral rim {S.coral} (never LATER magenta or What-If violet). It multiplies instead of growing:</tspan>
      <tspan x={60} dy={38}>one more copy-pop per yes (1, 2, 4, 8, swarm). Sticky notes in five pastel colors, one per yes on Theo.</tspan>
      <tspan x={60} dy={38}>Dev: curly red hair, freckles, green sweater, same big-eye construction and 6 px outline as Theo and Priya.</tspan>
    </text>
  </Sheet>
);
