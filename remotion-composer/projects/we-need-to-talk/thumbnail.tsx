import React from "react";
import { ChairBack, TheoLegs } from "../later/art";
import { VFrame, VCamera, VVignette, OfficeBack, Partition, PARTITION_TOP, OfficeDesk, TheoSeated, Priya, WhatIf, P } from "./vart";

// Vertical thumbnail (1080x1920): Priya's flat stare looming, Theo terrified with What-If on his head,
// one huge read: "WE NEED TO TALK." Text kept in the middle band, clear of the Shorts UI.
export const ThumbnailV: React.FC = () => (
  <VFrame>
    <VCamera cx={1020} cy={300} zoom={2.05}>
      <OfficeBack frame={0} clockH={5} clockM={59} />
      <Priya x={1085} y={170} frame={0} expr="flat" lookX={-10} lookY={10} headTilt={-12} part="body" />
      <Partition />
      <Priya x={1085} y={170} frame={0} expr="flat" arms="ledge" ledgeY={PARTITION_TOP - 170 + 4} part="arms" />
      <ChairBack /><TheoLegs /><OfficeDesk frame={0} />
      <TheoSeated expr="panic" frame={0} headRot={-10} lookX={10} lookY={-12} sweat={4} glassesY={8} />
      <WhatIf x={955} y={240} s={0.42} frame={0} mood="smug" />
    </VCamera>
    <rect width={1080} height={1920} fill={P.wVioletDeep} opacity={0.08} />
    <VVignette id="thv" strength={0.5} />
    <g transform="translate(0 330) rotate(-4 540 1420)">
      <rect x={110} y={1250} width={860} height={300} rx={28} fill="#FFFFFF" stroke="#111018" strokeWidth={10} />
      <text x={540} y={1380} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={112} fill="#111018" letterSpacing={-2}>WE NEED</text>
      <text x={540} y={1505} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={112} fill="#111018" letterSpacing={-2}>TO <tspan fill="#9B5CFF">TALK.</tspan></text>
    </g>
  </VFrame>
);
