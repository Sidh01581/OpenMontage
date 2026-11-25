import React from "react";
import { VFrame, VCamera, VVignette } from "../we-need-to-talk/vart";
import { DevLounge, VacationTag } from "./oart";
import { Beach, LOUNGE } from "./shots_a";

// Vertical thumbnail: Dev on his beach chair, sunglasses down, annoyed, phone out on speaker; meter at 404; big card.
export const ThumbnailV: React.FC = () => (
  <VFrame>
    <VCamera cx={520} cy={1130} zoom={1.7}>
      <Beach frame={0}>
        <DevLounge {...LOUNGE} frame={0} id="th" arm="phone" k={1} serious smile={false} shades={1} lookX={16} lookY={6} sitUp={0.2} />
      </Beach>
    </VCamera>
    <rect width={1080} height={1920} fill="#FFE9A8" opacity={0.08} />
    <VVignette id="thv" strength={0.4} />
    <VacationTag x={260} y={300} pct={0} mode="404" age={20} s={1.15} />
    <g transform="rotate(-5 540 1560)">
      <rect x={110} y={1400} width={860} height={280} rx={30} fill="#FF6B6B" stroke="#111018" strokeWidth={12} />
      <text x={540} y={1520} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={110} fill="#111018" letterSpacing={-3}>OUT OF</text>
      <text x={540} y={1640} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={110} fill="#FFFFFF" letterSpacing={-3}>OFFICE.</text>
    </g>
  </VFrame>
);
