import React from "react";
import { VFrame, VCamera, VVignette } from "../we-need-to-talk/vart";
import { Epilogue } from "./shots_b";
import { EmailTag } from "./aset";

// Vertical thumbnail: the robot in Dev's chair, Dev holding the mop, the email counter, one big word.
export const ThumbnailV: React.FC = () => (
  <VFrame>
    <VCamera cx={300} cy={900} zoom={1.4}>
      <Epilogue frame={20} head={{ smile: false, serious: true, sweat: 2, lookX: 18, lookY: 4 }} robot={{ pose: "thumbs", typeSpeed: 0, expr: "proud", face: -0.4, antenna: 1 }} />
    </VCamera>
    <rect width={1080} height={1920} fill="#FFE2B0" opacity={0.06} />
    <VVignette id="thv" strength={0.35} />
    <EmailTag n={4800} age={20} y={110} />
    <g transform="rotate(-4 540 1620)">
      <rect x={90} y={1520} width={900} height={220} rx={30} fill="#6FF3FF" stroke="#111018" strokeWidth={12} />
      <text x={540} y={1675} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={124} fill="#111018" letterSpacing={-3}>AUTOMATED.</text>
    </g>
  </VFrame>
);
