import React from "react";
import { ChairBack, TheoLegs } from "../later/art";
import { VFrame, VCamera, VVignette, OfficeBack, Partition, OfficeDesk, TheoSeated, lerp, ease, easeOut } from "../we-need-to-talk/vart";
import { DevWalker, BusyHUD, AisleSet, SpeedLines, DeskPile } from "./bart";
import MOUTH from "./mouth_env.json";

// BUSY. — shots 1–3 (sample). Pure functions of (frame, duration).
export type ShotProps = { frame: number; duration: number };
export type ShotDef = { id: string; Component: React.FC<ShotProps>; duration: number };

export const mouthAt = (key: string, frame: number, start: number) => {
  const e = (MOUTH as Record<string, number[]>)[key];
  if (!e) return 0;
  const i = Math.round(frame - start);
  const at = (k: number) => (k >= 0 && k < e.length ? e[k] : 0);
  return at(i - 1) * 0.25 + at(i) * 0.5 + at(i + 1) * 0.25;
};
export const F = (sec: number, shotStart: number) => Math.round((sec - shotStart) * 24);

// Dev's running tally (the scoreboard): steps climb with every step he takes in the film, work never moves.
export const STEPS0 = 4812;
const STEP_FRAMES = 6; // one step every 6 frames (4 steps/s: a speed-walk)

const MorningLight: React.FC = () => <rect width={1080} height={1920} fill="#FFF6DA" opacity={0.08} />;

// Theo's desk in the morning, with his real pile of work (shared by Theo shots).
export const TheoDesk: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <OfficeBack frame={frame} clockH={9} clockM={4} sky="day" />
    <Partition />
    <ChairBack /><TheoLegs />
    <OfficeDesk frame={frame} bag={false} />
    <DeskPile x={1262} n={8} />
    <DeskPile x={1560} n={5} />
  </>
);

// Shot 1 — MS tracking: Dev power-walks down the aisle (camera tracks him), coffee + papers, serious frown.
// The HUD pops at 0.4 s. At 1.6 s the camera stops and Dev speeds out of frame right.
export const B01: React.FC<ShotProps> = ({ frame, duration }) => {
  const stopAt = 38;
  const track = Math.min(frame, stopAt);
  const scroll = track * 28;
  const exit = Math.max(0, frame - stopAt);
  const devX = 470 + exit * 30 + exit * exit * 1.6;
  const steps = STEPS0 + Math.floor(frame / STEP_FRAMES);
  const tick = (frame % STEP_FRAMES) < 2 ? 1 : 0;
  const zoom = lerp(1.0, 1.04, ease(frame / duration));
  return (
    <VFrame>
      <VCamera cx={540} cy={960} zoom={zoom}>
        <AisleSet frame={frame} scroll={scroll} />
        <ellipse cx={devX + 10} cy={1560} rx={150} ry={22} fill="#000" opacity={0.15} />
        {exit > 0 && <SpeedLines x={devX - 40} y={1060} frame={frame} s={1.3} k={Math.min(1, exit / 4)} />}
        <DevWalker x={devX} y={1560 - 186 * 1.25} s={1.25} frame={frame} phase={frame / STEP_FRAMES} speed={1} lookX={15} lookY={3} serious />
      </VCamera>
      <BusyHUD x={260 + Math.max(0, devX - 470) * 0.9} y={452} steps={steps} coffee={3} work={0} age={frame - 9} tick={tick} />
      <MorningLight />
      <VVignette id="b1v" strength={0.22} />
    </VFrame>
  );
};

// Shot 2 — MCU: Theo at his desk (real work piled up) leans toward camera, narrating.
export const B02: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const lean = easeOut(frame / 10);
  const talk = mouthAt("T02", frame, F(1.7, 2.25));
  const glance = frame > 28 ? ease((frame - 28) / 5) : 0; // eyes flick toward the aisle on "in a hurry"
  return (
    <VFrame>
      <VCamera cx={lerp(1000, 990, lean)} cy={lerp(470, 452, lean)} zoom={lerp(2.5, 2.85, lean) + 0.12 * t}>
        <TheoDesk frame={frame} />
        <TheoSeated expr="smile" frame={frame} talk={talk} headRot={lerp(0, -7, lean)} typeSpeed={frame < 6 ? 0.9 : 0}
          lookX={lerp(-4, -16, glance)} lookY={lerp(0, -2, glance)} />
      </VCamera>
      <MorningLight />
      <VVignette id="b2v" strength={0.3} />
    </VFrame>
  );
};

// Shot 3 — MS: Theo, deadpan. Dev whips past in the extreme foreground (motion-smeared), the HUD ticks up.
export const B03: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const talk = mouthAt("T03", frame, F(3.85, 3.917));
  const passA = 12, passB = 28;
  const p = (frame - passA) / (passB - passA);
  const devX = lerp(-420, 1500, p);
  const follow = ease((frame - passA + 2) / (passB - passA));
  const steps = STEPS0 + Math.floor(54 / STEP_FRAMES) + (frame > passA ? Math.floor(Math.min(passB, frame) - passA) / 3 : 0);
  const ghosts = [0, 1, 2, 3];
  return (
    <VFrame>
      <VCamera cx={1040} cy={lerp(470, 462, t)} zoom={lerp(1.62, 1.72, t)}>
        <TheoDesk frame={frame} />
        <TheoSeated expr={frame > passB + 4 ? "blank" : "focused"} frame={frame} talk={talk} headRot={lerp(4, -4, follow)}
          lookX={frame < passA - 2 ? -2 : lerp(-16, 16, follow)} lookY={frame > passB + 4 ? 0 : 2} />
      </VCamera>
      {p > -0.05 && p < 1.05 && ghosts.map((g) => (
        <g key={g} opacity={g === 0 ? 1 : 0.28 - g * 0.06}>
          <DevWalker x={devX - g * 70} y={1500} s={2.3} frame={frame} phase={(frame - g * 0.6) / 4} speed={1} lookX={15} lookY={3} serious />
        </g>
      ))}
      {p > 0 && p < 1 && <SpeedLines x={devX - 120} y={960} frame={frame} s={2} />}
      <BusyHUD x={260} y={430} steps={Math.round(steps)} coffee={3} work={0} age={frame + 20} tick={frame > passA && frame < passB && frame % 3 === 0 ? 1 : 0} />
      <MorningLight />
      <VVignette id="b3v" strength={0.28} />
    </VFrame>
  );
};

export const SAMPLE: ShotDef[] = [
  { id: "B01", Component: B01, duration: 54 }, // 0:00–2.25
  { id: "B02", Component: B02, duration: 40 }, // 2.25–3.92
  { id: "B03", Component: B03, duration: 50 }, // 3.92–6.0
];
