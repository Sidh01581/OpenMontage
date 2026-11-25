import React from "react";
import { VFrame, VCamera, VVignette } from "../we-need-to-talk/vart";
import { DevWalker, BusyHUD, AisleSet } from "./bart";

// Vertical thumbnail: Dev mid speed-walk with coffee + papers, serious; the tag reads WORK DONE: 0; one big word.
export const ThumbnailV: React.FC = () => (
  <VFrame>
    <VCamera cx={540} cy={1000} zoom={1.25}>
      <AisleSet frame={0} scroll={900} />
      <ellipse cx={480} cy={1560} rx={150} ry={22} fill="#000" opacity={0.15} />
      <DevWalker x={470} y={1560 - 186 * 1.25} s={1.25} frame={4} phase={0.5} lookX={15} lookY={3} />
    </VCamera>
    <rect width={1080} height={1920} fill="#FFF6DA" opacity={0.08} />
    <VVignette id="thv" strength={0.4} />
    <BusyHUD x={260} y={300} steps={9999} coffee={7} work={0} age={20} s={1.15} />
    <g transform="rotate(-5 540 1560)">
      <rect x={170} y={1410} width={740} height={260} rx={30} fill="#FFC93C" stroke="#111018" strokeWidth={12} />
      <text x={540} y={1600} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={180} fill="#111018" letterSpacing={-4}>BUSY.</text>
    </g>
  </VFrame>
);
