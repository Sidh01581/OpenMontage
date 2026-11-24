import React from "react";
import { ChairBack, TheoLegs } from "../later/art";
import { VFrame, VCamera, VVignette, OfficeBack, Partition, PARTITION_TOP, OfficeDesk, TheoSeated } from "../we-need-to-talk/vart";
import { Sure, SureSwarm, TheoNotes, BodyNotes, S } from "./sart";
import { SureRow } from "./sets";

// Vertical thumbnail: grinning Theo buried in sticky notes, Sures everywhere, one huge word.
export const ThumbnailV: React.FC = () => (
  <VFrame>
    <VCamera cx={1010} cy={420} zoom={2.15}>
      <OfficeBack frame={0} clockH={9} clockM={30} sky="day" />
      <Partition />
      <SureRow n={5} x0={1100} x1={1300} y={PARTITION_TOP - 10} s={0.26} frame={3} />
      <ChairBack /><TheoLegs /><OfficeDesk frame={0} bag={false} />
      <TheoSeated expr="grin" frame={0} lookX={2} lookY={0} headOverlay={<TheoNotes n={6} frame={0} />} />
      <BodyNotes n={16} frame={0} />
      <Sure x={860} y={470} s={0.32} frame={2} />
      <SureSwarm n={6} x={1080} y={540} w={200} h={40} s={0.26} frame={5} seed={4} />
    </VCamera>
    <rect width={1080} height={1920} fill="#FFF6DA" opacity={0.08} />
    <VVignette id="thv" strength={0.4} />
    <g transform="rotate(-5 540 1560)">
      <rect x={200} y={1420} width={680} height={270} rx={30} fill={S.lime} stroke="#111018" strokeWidth={12} />
      <text x={540} y={1612} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={190} fill="#111018" letterSpacing={-4}>SURE!</text>
    </g>
  </VFrame>
);
