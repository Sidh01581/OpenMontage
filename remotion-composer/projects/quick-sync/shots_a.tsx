import React from "react";
import { INK, SW } from "../later/art";
import { VFrame, VCamera, VVignette, Priya, lerp, ease, easeOut } from "../we-need-to-talk/vart";
import { ConfBack, ConfTable, TheoAtTable, DevAtTable, TableLaptop, CalendarPopup, EnergyTag, SlideTitle, SlideAgenda } from "./qart";
import MOUTH from "./mouth_env.json";

// QUICK SYNC. — shots 1–5 (sample). Pure functions of (frame, duration).
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

// The room with everyone in it. Shots frame it with VCamera.
export const THEO_X = 235, DEV_X = 500, PRIYA = { x: 860, y: 850, s: 0.9 };
export const Room: React.FC<{ frame: number; screen?: React.ReactNode; clockM?: number; dim?: number;
  theo?: Partial<React.ComponentProps<typeof TheoAtTable>>; dev?: Partial<React.ComponentProps<typeof DevAtTable>>; priya?: Partial<React.ComponentProps<typeof Priya>>; laptopGlow?: string }> =
  ({ frame, screen, clockM = 0, dim = 0, theo = {}, dev = {}, priya = {}, laptopGlow }) => (
    <>
      <ConfBack frame={frame} clockM={clockM} screen={screen} dim={dim} />
      <Priya x={PRIYA.x} y={PRIYA.y} s={PRIYA.s} frame={frame} expr="smile" lookX={-8} lookY={4} {...priya} />
      <DevAtTable x={DEV_X} frame={frame} {...dev} />
      <TableLaptop x={DEV_X + 30} glow={laptopGlow} />
      <TheoAtTable x={THEO_X} frame={frame} expr="neutral" {...theo} />
      <ConfTable />
    </>
  );
export const Fluor: React.FC<{ k?: number }> = ({ k = 1 }) => <rect width={1080} height={1920} fill="#EAF2F0" opacity={0.06 * k} />;
export const Meter: React.FC<{ pct: number; age?: number; y?: number }> = ({ pct, age = 20, y = 470 }) => <EnergyTag x={260} y={y} pct={pct} age={age} />;

// Shot 1 (0–1.75): the calendar pop-up slides onto Theo's laptop: URGENT: Quick sync (60 min). ENERGY 100%.
export const Q01: React.FC<ShotProps> = ({ frame }) => {
  const k = easeOut((frame - 3) / 6);
  return (
    <VFrame bg="#2A2E38">
      <rect width={1080} height={1920} fill="#C9CED6" />
      <rect x={60} y={620} width={960} height={720} rx={30} fill="#2A2E38" stroke={INK} strokeWidth={SW} />
      <rect x={90} y={650} width={900} height={660} fill="#EEF2F8" />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={130} y={700 + i * 70} width={i % 3 === 0 ? 520 : 700} height={22} rx={6} fill="#C9D3E3" />)}
      <CalendarPopup cx={540} cy={lerp(1150, 960, k)} s={0.95} title="URGENT: Quick sync" sub="10:00 – 11:00 (60 min)" k={k} />
      <Meter pct={100} age={frame - 10} y={1360} />
      <VVignette id="q1v" strength={0.3} />
    </VFrame>
  );
};

// Shot 2 (1.75–5.0): wide room. Priya at the screen: "Thanks for joining, everyone! This will be quick."
export const Q02: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={540} cy={lerp(840, 825, ease(frame / duration))} zoom={lerp(1.0, 1.04, ease(frame / duration))}>
      <Room frame={frame} screen={<SlideTitle />} priya={{ talk: mouthAt("P01", frame, F(1.9, 1.75)), headTilt: Math.sin(frame * 0.2) * 3 }} dev={{ lookX: 16, lookY: 0 }} theo={{ lookX: 10, lookY: -4 }} />
    </VCamera>
    <Fluor /><VVignette id="q2v" strength={0.25} />
  </VFrame>
);

// Shot 3 (5.0–6.25): Theo MCU, deadpan. (V.O.: "It was not quick.")
export const Q03: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={THEO_X + 30} cy={TABLE_HEAD_Y} zoom={lerp(2.6, 2.75, ease(frame / duration))}>
      <Room frame={frame} screen={<SlideTitle />} theo={{ expr: "blank", lookX: 2, lookY: 0 }} />
    </VCamera>
    <Fluor /><VVignette id="q3v" strength={0.3} />
  </VFrame>
);
export const TABLE_HEAD_Y = 1100 - 167 * 0.85;

// Shot 4 (6.25–8.0): Priya clicks to the agenda: "Slide one: the agenda."
export const Q04: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={790} cy={lerp(730, 720, ease(frame / duration))} zoom={1.7}>
      <Room frame={frame} screen={frame < 10 ? <SlideTitle /> : <SlideAgenda k={0} />} priya={{ talk: mouthAt("P02", frame, F(6.4, 6.25)), lookX: -2, lookY: -10, headTilt: -4 }} />
    </VCamera>
    {frame >= 9 && frame <= 11 && <rect width={1080} height={1920} fill="#FFFFFF" opacity={0.15} />}
    <Fluor /><VVignette id="q4v" strength={0.3} />
  </VFrame>
);

// Shot 5 (8.0–10.75): the agenda slide. One bullet appears: "Discuss the agenda." ENERGY 100 -> 80.
export const Q05: React.FC<ShotProps> = ({ frame }) => {
  const k = easeOut((frame - 12) / 6);
  const drop = easeOut((frame - 30) / 10);
  return (
    <VFrame bg="#1C2130">
      <g transform={`translate(540 860) scale(${1.9 + frame * 0.002}) translate(-240 -185)`}>
        <rect x={-12} y={-12} width={504} height={394} rx={10} fill="#2A2E38" stroke={INK} strokeWidth={SW / 1.9} />
        <SlideAgenda k={k} />
      </g>
      <Meter pct={lerp(100, 80, drop)} y={270} />
      <VVignette id="q5v" strength={0.4} />
    </VFrame>
  );
};

export const SAMPLE: ShotDef[] = [
  { id: "Q01", Component: Q01, duration: 42 }, // 0.00–1.75
  { id: "Q02", Component: Q02, duration: 78 }, // 1.75–5.00
  { id: "Q03", Component: Q03, duration: 30 }, // 5.00–6.25
  { id: "Q04", Component: Q04, duration: 42 }, // 6.25–8.00
  { id: "Q05", Component: Q05, duration: 66 }, // 8.00–10.75
];
