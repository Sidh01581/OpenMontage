import React from "react";
import {
  Camera, LightPool, Vignette, Room, ChairBack, Desk, Laptop, Lamp,
  TheoLegs, TheoUpper, Later, Mochi, lerp, ease,
} from "./art";

// Each shot is a pure function of (frame, duration) -> full 1920x1080 SVG.
export type ShotProps = { frame: number; duration: number };

const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect width={1920} height={1080} fill={bg} />
    {children}
  </svg>
);

// Shot 1 — ECU: Theo's panicked eyes at 11:58 PM, laptop light. Slow push-in, eyes dart.
export const Shot01: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const dart = Math.floor(frame / 11) % 3;
  const lookX = [-9, 9, 2][dart];
  return (
    <Frame>
      <Camera cx={lerp(1012, 1020, t)} cy={432} zoom={lerp(4.1, 4.7, t)}>
        <Room sky="night" frame={frame} clockH={11} clockM={58} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn />
        <TheoUpper pose="type" expr="panic" frame={frame} typeSpeed={1.7} lookX={lookX} lookY={2} />
        <LightPool id="s1" x={1300} y={500} r={700} dark="#070A24" darkness={0.92} glow="#4F7DFF" glowStrength={0.3} glowR={380} />
      </Camera>
      <Vignette id="s1v" strength={0.6} />
    </Frame>
  );
};

// Shot 3 — MS: frantic typing; pull back reveals Later's shadow on the wall.
export const Shot03: React.FC<ShotProps & { talk?: number }> = ({ frame, duration, talk }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(1010, 900, t)} cy={lerp(470, 520, t)} zoom={lerp(1.65, 1.18, t)}>
        <Room sky="night" frame={frame} clockH={11} clockM={58} mess />
        <Later x={560} y={330} s={2.3} mood="sly" frame={frame} layer="body" />
        <Mochi x={440} y={668} s={0.9} frame={frame} />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn />
        <TheoUpper pose="type" expr="panic" frame={frame} typeSpeed={1.8} lookX={10} lookY={4} talk={talk} />
        <LightPool id="s3" x={1280} y={500} r={900} dark="#070A24" darkness={0.93} glow="#4F7DFF" glowStrength={0.28} glowR={380} />
        {/* Later's eyes glow through the dark, brighter as the camera reveals it */}
        <g opacity={lerp(0.35, 1, t)}>
          <Later x={560} y={330} s={2.3} mood="sly" frame={frame} layer="glow" />
        </g>
      </Camera>
      <Vignette id="s3v" strength={0.55} />
    </Frame>
  );
};

// Shot 13 — CU: small, cute Later on the desk edge pushing Theo's phone forward. Morning.
export const Shot13: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const dust = Array.from({ length: 18 }).map((_, i) => {
    const x = 1150 + ((i * 137) % 600) + Math.sin(frame * 0.03 + i) * 12;
    const y = 360 + ((i * 89 + frame * 0.6) % 320);
    return <circle key={i} cx={x} cy={y} r={2.5} fill="#FFF6D6" opacity={0.7} />;
  });
  return (
    <Frame>
      <Camera cx={lerp(1440, 1450, t)} cy={lerp(520, 530, t)} zoom={lerp(2.9, 3.25, t)}>
        <Room sky="morning" frame={frame} clockH={10} clockM={4} />
        <Desk /><Laptop screenOn screenColor="#FFFFFF" /><Lamp on={false} />
        <Later x={1455} y={528} s={0.55} mood="sly" frame={frame} phone={t} />
        <path d="M360,170 L520,170 L1760,860 L1300,860 Z" fill="#FFF2C8" opacity={0.16} />
        <path d="M200,320 L330,320 L1240,860 L1020,860 Z" fill="#FFF2C8" opacity={0.12} />
        <LightPool id="s13" x={500} y={300} r={2200} dark="#FF9A4A" darkness={0.14} glow="#FFE3A8" glowStrength={0.2} glowR={1400} />
        {dust}
      </Camera>
      <Vignette id="s13v" strength={0.3} />
    </Frame>
  );
};

// Shot 38 — WS: rock bottom. Rain, Theo slumped, Later fills the room, grin pulsing.
export const Shot38: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const pulse = 1 + Math.sin(frame * 0.18) * 0.02;
  return (
    <Frame>
      <Camera cx={960} cy={500} zoom={lerp(1.0, 1.06, t)}>
        <Room sky="rain" frame={frame} clockH={0} clockM={1} mess />
        <Later x={770} y={290} s={3.3 * pulse} mood="grin" frame={frame} layer="body" />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FF6B6B" />
        <TheoUpper pose="slump" expr="sad" frame={frame} />
        <LightPool id="s38" x={1210} y={540} r={720} dark="#04030C" darkness={0.9} glow="#FF3B3B" glowStrength={0.26} glowR={430} />
        <Later x={770} y={290} s={3.3 * pulse} mood="grin" frame={frame} layer="glow" />
      </Camera>
      <Vignette id="s38v" strength={0.7} />
    </Frame>
  );
};

// Shot 49 — MS: Theo typing in flow under the warm lamp, Mochi asleep by the laptop.
export const Shot49: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  return (
    <Frame>
      <Camera cx={lerp(1140, 1170, t)} cy={500} zoom={lerp(1.5, 1.62, t)}>
        <Room sky="dusk" frame={frame} clockH={6} clockM={40} lampOn />
        <ChairBack /><TheoLegs /><Desk /><Laptop screenOn screenColor="#FFF1D0" />
        <Lamp on />
        <Mochi x={1472} y={594} s={0.6} frame={frame} />
        <TheoUpper pose="type" expr="focused" frame={frame} typeSpeed={0.85} lookX={11} lookY={7} />
        <LightPool id="s49" x={1600} y={480} r={lerp(820, 1150, t)} dark="#140C26" darkness={0.62} glow="#FFC870" glowStrength={0.38} glowR={lerp(450, 700, t)} />
      </Camera>
      <Vignette id="s49v" strength={0.35} />
    </Frame>
  );
};

export const SHOTS: { id: string; Component: React.FC<ShotProps>; duration: number }[] = [
  { id: "Shot01", Component: Shot01, duration: 96 },
  { id: "Shot03", Component: Shot03, duration: 96 },
  { id: "Shot13", Component: Shot13, duration: 96 },
  { id: "Shot38", Component: Shot38, duration: 120 },
  { id: "Shot49", Component: Shot49, duration: 96 },
];
