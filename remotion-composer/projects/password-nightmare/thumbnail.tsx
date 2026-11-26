import React from "react";
import { VFrame, VCamera, VVignette } from "../we-need-to-talk/vart";
import { Desk } from "./shots_a";
import { Monitor, PwWindow, PatienceTag } from "./part";
import { rulesUpTo } from "./shots_a";

// Vertical thumbnail: the endless red rule list, PATIENCE 0%, Dev sweating, one big word.
export const ThumbnailV: React.FC = () => (
  <VFrame>
    <VCamera cx={470} cy={940} zoom={1.7}>
      <Desk frame={20} dev={{ pose: "upright", typeSpeed: 0, serious: true, sweat: 3, lookX: 18, lookY: 0 }} />
    </VCamera>
    <rect width={1080} height={1920} fill="#FF3B3B" opacity={0.06} />
    <VVignette id="thv" strength={0.35} />
    <Monitor cx={560} cy={1215} s={0.6} rot={4}>
      <PwWindow frame={20} typed="W4x1ng🌔𓂀!" rules={rulesUpTo(6, 20, -99)} status="error" caret={false} />
    </Monitor>
    <PatienceTag x={260} y={110} pct={0} age={20} s={1.0} />
    <g transform="rotate(-4 540 1620)">
      <rect x={110} y={1520} width={860} height={220} rx={30} fill="#FFC93C" stroke="#111018" strokeWidth={12} />
      <text x={540} y={1675} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={128} fill="#111018" letterSpacing={-3}>PASSWORD.</text>
    </g>
  </VFrame>
);
