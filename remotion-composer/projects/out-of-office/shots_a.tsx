import React from "react";
import { VFrame, VCamera, VVignette, TheoSeated, lerp, ease, easeOut } from "../we-need-to-talk/vart";
import { TheoDesk } from "../busy/shots_a";
import { DevLounge, BeachSet, Umbrella, Palm, Crab, VacationTag } from "./oart";
import MOUTH from "./mouth_env.json";

// OUT OF OFFICE. — Scene 1 (sample): shots 1–5. Pure functions of (frame, duration).
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
const bump = (t: number) => (t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI));

// The beach with Dev in his chair (frame-space world). Shots frame it with VCamera.
export const LOUNGE = { x: 640, y: 1440, s: 1.25 };
export const Beach: React.FC<{ frame: number; children?: React.ReactNode; crab?: React.ReactNode; pan?: number }> = ({ frame, children, crab, pan = 0 }) => (
  <>
    <BeachSet frame={frame} pan={pan} />
    <Palm x={60} y={1300} s={1.1} frame={frame} />
    <Umbrella x={500} y={1580} s={1.05} />
    <ellipse cx={LOUNGE.x} cy={LOUNGE.y + 120 * LOUNGE.s} rx={300} ry={30} fill="#000" opacity={0.12} />
    {children}
    {crab}
  </>
);
const SunWarm: React.FC = () => <rect width={1080} height={1920} fill="#FFE9A8" opacity={0.08} />;

// Shot 1 — wide (0–2.5): Dev reclined, sunglasses, sipping a coconut; waves roll in; VACATION: 100%.
export const C01: React.FC<ShotProps> = ({ frame, duration }) => {
  const sip = bump((frame - 10) / 40);
  return (
    <VFrame>
      <VCamera cx={560} cy={lerp(1060, 1080, ease(frame / duration))} zoom={lerp(1.18, 1.24, ease(frame / duration))}>
        <Beach frame={frame}>
          <DevLounge {...LOUNGE} frame={frame} id="c1" arm="sip" k={sip} wiggle={frame * 0.3} />
        </Beach>
      </VCamera>
      <VacationTag x={260} y={470} pct={100} age={frame - 8} />
      <SunWarm />
      <VVignette id="c1v" strength={0.2} />
    </VFrame>
  );
};

// Shot 2 — MCU (2.5–4.5): Theo at his desk narrating, glancing at the window, a little jealous.
export const C02: React.FC<ShotProps> = ({ frame, duration }) => {
  const talk = mouthAt("T01", frame, F(0.3, 2.5));
  return (
    <VFrame>
      <VCamera cx={990} cy={455} zoom={lerp(2.6, 2.8, ease(frame / duration))}>
        <TheoDesk frame={frame} />
        <TheoSeated expr="neutral" frame={frame} talk={talk} headRot={-4} lookX={frame < 24 ? -2 : -16} lookY={-2} />
      </VCamera>
      <VVignette id="c2v" strength={0.3} />
    </VFrame>
  );
};

// Shot 3 — CU (4.5–6.75): the ocean in his sunglasses, a long happy slurp.
export const C03: React.FC<ShotProps> = ({ frame, duration }) => {
  const sip = easeOut(frame / 10) * (frame < 44 ? 1 : 1 - (frame - 44) / 10);
  return (
    <VFrame>
      <VCamera cx={400} cy={lerp(1130, 1120, ease(frame / duration))} zoom={lerp(2.5, 2.7, ease(frame / duration))}>
        <Beach frame={frame}>
          <DevLounge {...LOUNGE} frame={frame} id="c3" arm="sip" k={Math.max(0, sip)} wiggle={frame * 0.3} />
        </Beach>
      </VCamera>
      <SunWarm />
      <VVignette id="c3v" strength={0.3} />
    </VFrame>
  );
};

// Shot 4 — CU (6.75–8.25): toes wiggle in the sun; a tiny crab scuttles in and waves.
export const C04: React.FC<ShotProps> = ({ frame }) => {
  const cx = lerp(1180, 1010, easeOut(frame / 18));
  return (
    <VFrame>
      <VCamera cx={950} cy={1420} zoom={2.2}>
        <Beach frame={frame} crab={<Crab x={cx} y={1530} s={0.7} frame={frame} wave={frame > 20 ? Math.abs(Math.sin(frame * 0.5)) : 0} />}>
          <DevLounge {...LOUNGE} frame={frame} id="c4" arm="rest" wiggle={frame * 0.6} />
        </Beach>
      </VCamera>
      <SunWarm />
      <VVignette id="c4v" strength={0.3} />
    </VFrame>
  );
};

// Shot 5 — wide (8.25–9.75): "…zero responsibilities!" Dev raises his coconut in a toast to the sea.
export const C05: React.FC<ShotProps> = ({ frame, duration }) => {
  const k = easeOut((frame - 4) / 8);
  return (
    <VFrame>
      <VCamera cx={520} cy={1080} zoom={lerp(1.2, 1.26, ease(frame / duration))}>
        <Beach frame={frame}>
          <DevLounge {...LOUNGE} frame={frame} id="c5" arm="toast" k={k} wiggle={frame * 0.3} lookY={-6} />
        </Beach>
      </VCamera>
      <VacationTag x={260} y={330} pct={100} age={20} />
      <SunWarm />
      <VVignette id="c5v" strength={0.2} />
    </VFrame>
  );
};

export const SAMPLE: ShotDef[] = [
  { id: "C01", Component: C01, duration: 60 }, // 0.00–2.50
  { id: "C02", Component: C02, duration: 48 }, // 2.50–4.50
  { id: "C03", Component: C03, duration: 54 }, // 4.50–6.75
  { id: "C04", Component: C04, duration: 36 }, // 6.75–8.25
  { id: "C05", Component: C05, duration: 36 }, // 8.25–9.75
];
