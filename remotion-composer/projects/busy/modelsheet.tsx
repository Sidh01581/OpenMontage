import React from "react";
import { TheoSeated, Priya, Mug } from "../we-need-to-talk/vart";
import { PhoneBody } from "../sure/sets";
import { DevWalker, BusyHUD } from "./bart";
import { DevSeated, Coworker, WindowCascade, CatFeed, SelfieView, EmployeeFrame } from "./bart2";

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

export const SheetDev: React.FC = () => (
  <Sheet title="BUSY. — Dev (full body: walk, watch, crisis nod; at his desk)">
    <DevWalker x={150} y={340} s={0.62} frame={3} phase={0.5} /><Label x={150} y={510} t="speed-walk" />
    <DevWalker x={390} y={340} s={0.62} frame={3} phase={0} speed={0.3} watch={1} /><Label x={390} y={500} t="watch check" />
    <DevWalker x={630} y={340} s={0.62} frame={3} phase={0.2} speed={0.6} nod={1} lookY={10} /><Label x={630} y={500} t="crisis nod" />
    <DevSeated x={880} y={360} s={0.55} frame={3} pose="knuckles" crack={0.5} /><Label x={960} y={500} t="knuckle crack" />
    <DevSeated x={1180} y={360} s={0.55} frame={3} pose="type" typeSpeed={0.9} glow={1} /><Label x={1260} y={500} t="typing (screen glow)" />
    <DevSeated x={1500} y={360} s={0.55} frame={3} pose="upright" typeSpeed={1.6} sweat={3} lookX={18} /><Label x={1580} y={500} t="MANAGER! upright, sweat" />
    <DevSeated x={200} y={880} s={0.55} frame={3} pose="slump" sip={0} serious={false} lookX={4} /><Label x={280} y={1030} t="slump + coffee" />
    <DevSeated x={520} y={880} s={0.55} frame={3} pose="slump" sip={1} serious={false} lookX={4} lookY={-6} /><Label x={600} y={1030} t="sip" />
    <DevSeated x={840} y={880} s={0.55} frame={3} pose="phone" serious={false} lookX={14} lookY={8} /><Label x={920} y={1030} t="phone scroll" />
    <DevSeated x={1160} y={880} s={0.55} frame={3} pose="type" lookX={-14} turn={22} /><Label x={1240} y={1030} t="eyes slide (manager leaves)" />
    <g transform="translate(1540 600) scale(0.22)"><SelfieView frame={3} flash={0} /></g><Label x={1660} y={1040} t="selfie (POV)" />
  </Sheet>
);

export const SheetCast: React.FC = () => (
  <Sheet title="BUSY. — Theo (narrator), Priya (manager), coworkers, tag, screens, end card">
    {[["smile", "narrating"], ["shock", "'Oh, wait!' pop-up"], ["blank", "deadpan"]].map(([e, l], i) => (
      <g key={i}>
        <g transform={`translate(${170 + i * 270} 330) scale(0.62) translate(-985 -425)`}><TheoSeated expr={e as "smile"} frame={0} talk={i === 0 ? 0.6 : 0} lookX={0} lookY={2} /></g>
        <Label x={170 + i * 270} y={520} t={l} />
      </g>
    ))}
    <g transform="translate(980 300) scale(0.75)"><Priya x={0} y={0} frame={2} expr="smile" /></g>
    <Mug x={1080} y={360} s={0.9} frame={2} /><Label x={990} y={520} t="Priya: glide + #1 mug" />
    {[0, 1, 2, 3].map((v) => <g key={v}><Coworker x={1240 + v * 160} y={280} s={0.62} v={v} frame={5} look={v % 2 ? -1 : 1} /></g>)}
    <rect x={1150} y={330} width={680} height={110} fill="#5FA59C" stroke="#141018" strokeWidth={6} />
    <Label x={1490} y={520} t="coworkers over partitions (nod back)" />
    <BusyHUD x={-40} y={600} steps={4815} coffee={3} work={0} age={20} s={0.62} /><Label x={235} y={790} t="tag: default" />
    <BusyHUD x={-40} y={810} steps={6120} coffee={5} work={0} age={20} s={0.62} busy /><Label x={235} y={1000} t="tag: manager present" />
    <g transform="translate(520 640) scale(0.42)"><WindowCascade n={10} frame={2} /></g><Label x={710} y={940} t="monitor: 10 windows" />
    <PhoneBody x={980} y={800} s={0.3} id="sheetph"><CatFeed frame={4} scroll={120} /></PhoneBody><Label x={980} y={1000} t="phone: cat feed" />
    <EmployeeFrame cx={1240} cy={790} s={0.3} frame={2} /><Label x={1240} y={1000} t="end card frame" />
    <text x={1420} y={660} fontFamily="'Helvetica Neue', Arial" fontSize={24} fill="#4A4040">
      <tspan x={1420} dy={0}>Dev: lanky, curly red hair, green</tspan>
      <tspan x={1420} dy={34}>sweater, navy chinos, brown shoes,</tspan>
      <tspan x={1420} dy={34}>serious frown, eyes always forward.</tspan>
      <tspan x={1420} dy={34}>Props: to-go coffee, paper stack,</tspan>
      <tspan x={1420} dy={34}>watch, phone. Tag: mint on navy;</tspan>
      <tspan x={1420} dy={34}>WORK DONE never moves.</tspan>
    </text>
  </Sheet>
);
