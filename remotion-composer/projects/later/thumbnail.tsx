import React from "react";
import { Camera, LightPool, Vignette, Room, ChairBack, Desk, Laptop, TheoUpper, TheoLegs, Later, C } from "./art";

// Thumbnail per bible: Theo's terrified face on the right third lit cold blue by the laptop;
// Later's huge magenta grin and eyes looming from the dark on the left; "LATER." huge, white, slight tilt, top-left.
export const Thumbnail: React.FC = () => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill="#000" />
    <defs>
      <radialGradient id="thm" cx="640" cy="560" r="700" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={C.magenta} stopOpacity={0.3} /><stop offset="1" stopColor={C.magenta} stopOpacity={0} />
      </radialGradient>
    </defs>
    <Camera cx={830} cy={440} zoom={3.1}>
      <Room sky="night" frame={30} clockH={11} clockM={59} />
      <ChairBack />
      <Later x={735} y={452} s={1.12} mood="grin" frame={30} layer="body" />
      <TheoLegs /><Desk /><Laptop screenOn />
      <TheoUpper pose="type" expr="panic" frame={30} typeSpeed={0} lookX={-11} lookY={2} />
      <LightPool id="th" x={1250} y={460} r={700} dark="#05061A" darkness={0.93} glow="#4F7DFF" glowStrength={0.4} glowR={330} />
      <rect x={-500} y={-500} width={3000} height={2000} fill="url(#thm)" />
      <Later x={735} y={452} s={1.12} mood="grin" frame={30} layer="body" />
      <Later x={735} y={452} s={1.12} mood="grin" frame={30} layer="glow" />
    </Camera>
    <Vignette id="thv" strength={0.6} />
    <g transform="translate(70 250) rotate(-6)">
      <text x={0} y={0} fill="#000" opacity={0.6} fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight={900} fontSize={250} letterSpacing={10} transform="translate(10 10)">LATER.</text>
      <text x={0} y={0} fill="#FFFFFF" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight={900} fontSize={250} letterSpacing={10}>LATER.</text>
    </g>
  </svg>
);
