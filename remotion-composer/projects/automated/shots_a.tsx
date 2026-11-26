import React from "react";
import { VFrame, VCamera, VVignette, lerp, ease, easeOut } from "../we-need-to-talk/vart";
import { Monitor, Wallpaper, Pointer } from "../password-nightmare/part";
import { AutoDesk, InstallWindow, EffortTag, ROBOT_X, KEY_X } from "./aset";
import { R } from "./robot";
import MOUTH from "./mouth_env.json";

// AUTOMATED. — shots 1–7 (sample, bible shots 1–6). Pure functions of (frame, duration).
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
export const clamp = (t: number) => Math.max(0, Math.min(1, t));
export const OfficeLight: React.FC = () => <rect width={1080} height={1920} fill="#FFE9C7" opacity={0.07} />;

// Shot 1 (0–1.6): ECU monitor. "AutoWork AI: I'll do your job for you." Pointer clicks INSTALL; progress bar races to 100%.
export const A01: React.FC<ShotProps> = ({ frame, duration }) => {
  const clickAt = 20;
  const mv = ease((frame - 4) / 14);
  return (
    <VFrame bg="#C9CED6">
      <rect width={1080} height={1920} fill="#C9CED6" />
      <Monitor cx={540} cy={900} s={lerp(1.0, 1.05, frame / duration)} rot={-1} id="a1mon">
        <Wallpaper />
        <InstallWindow frame={frame} clickAt={clickAt} progress={ease((frame - clickAt) / 13)} />
        <Pointer x={lerp(700, 470, mv)} y={lerp(600, 440, mv)} />
      </Monitor>
      <VVignette id="a1v" strength={0.3} />
    </VFrame>
  );
};

// Shot 2 (1.6–2.9): Dev's desk MS. The box on the desk pops open and the robot rises out of it, eyes lighting up.
export const A02: React.FC<ShotProps> = ({ frame }) => {
  const k = easeOut((frame - 1) / 5);
  const rise = clamp(easeOut((frame - 4) / 12) * 1.0) + (frame > 12 && frame < 22 ? Math.sin(((frame - 12) / 10) * Math.PI) * 0.06 : 0);
  const on = frame >= 15;
  return (
    <VFrame>
      <VCamera cx={560} cy={lerp(930, 920, frame / 30)} zoom={1.35}>
        <AutoDesk frame={frame} box={{ k, rise }} dev={{ pose: "upright", lookX: 18, lookY: 8, serious: false }}
          robot={{ pose: on ? "wave" : "idle", wave: easeOut((frame - 17) / 8), expr: on ? "joy" : "blink", face: -0.5, antenna: on ? 1 - clamp((frame - 15) / 10) : 0 }} />
      </VCamera>
      <OfficeLight /><VVignette id="a2v" strength={0.25} />
    </VFrame>
  );
};

// Shot 3 (2.9–4.6): robot MCU, waving at Dev: "Hello, Dev." (R01 starts 3.0)
export const A03: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={lerp(690, 696, frame / 40)} cy={1010} zoom={lerp(2.6, 2.7, frame / 40)}>
      <AutoDesk frame={frame} dev={{ pose: "upright", lookX: 18, lookY: 8, serious: false }}
        robot={{ pose: "wave", expr: frame < 16 ? "happy" : "happy", face: -0.55, talk: mouthAt("R01", frame, F(3.0, 2.9)) }} />
    </VCamera>
    <OfficeLight /><VVignette id="a3v" strength={0.28} />
  </VFrame>
);

// Shot 4 (4.6–6.3): two-shot over the desk. Robot, hands together: "I will do your job now." Dev's grin grows.
export const A04: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={lerp(540, 550, frame / duration)} cy={900} zoom={lerp(1.55, 1.62, frame / duration)}>
      <AutoDesk frame={frame} dev={{ pose: "upright", lookX: 18, lookY: 8, serious: false }}
        robot={{ pose: "idle", expr: "happy", face: -0.6, talk: mouthAt("R01", frame, F(3.0, 4.6)) }} />
    </VCamera>
    <OfficeLight /><VVignette id="a4v" strength={0.25} />
  </VFrame>
);

// Shot 5 (6.3–7.3): Dev MCU, smug: "Perfect." (D01 at 6.4)
export const A05: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={450} cy={800} zoom={2.1}>
      <AutoDesk frame={frame} dev={{ pose: "upright", lookX: 18, lookY: 7, serious: false, talk: mouthAt("D01", frame, F(6.4, 6.3)) }}
        robot={{ pose: "idle", expr: "happy", face: -0.6 }} />
    </VCamera>
    <OfficeLight /><VVignette id="a5v" strength={0.28} />
  </VFrame>
);

// Shot 6 (7.3–9.5): wide two-shot. The robot types in a blur; Dev rolls back, phone out. EFFORT 100% -> 0%.
export const A06: React.FC<ShotProps> = ({ frame, duration }) => {
  const roll = ease(frame / 14);
  const phone = frame >= 7;
  const drain = easeOut((frame - 16) / 22);
  return (
    <VFrame>
      <VCamera cx={lerp(560, 570, frame / duration)} cy={930} zoom={1.32}>
        <AutoDesk frame={frame} devDx={-70 * roll} typing={1}
          dev={{ pose: phone ? "phone" : "upright", lookX: phone ? 14 : 18, lookY: phone ? 12 : 8, serious: false }}
          robot={{ pose: "type", typeSpeed: 2.4, expr: "focus", face: 0.6, antenna: (frame % 10) < 3 ? 1 : 0 }} />
      </VCamera>
      <EffortTag pct={lerp(100, 0, drain)} age={frame - 10} y={300} hit={frame > 16 && frame < 38 ? 0.6 : 0} />
      <OfficeLight /><VVignette id="a6v" strength={0.25} />
    </VFrame>
  );
};

// Shot 7 (9.5–10.75): ECU on the keyboard: the robot's hands are a blur, keycaps flying.
export const A07: React.FC<ShotProps> = ({ frame, duration }) => {
  const kx = 330 + (KEY_X + 56) * 1.5, ky = 1250 - 50 * 1.5;
  return (
    <VFrame>
      <VCamera cx={lerp(kx - 40, kx - 30, frame / duration)} cy={ky - 90} zoom={3.1}>
        <AutoDesk frame={frame} devDx={-70} typing={1} dev={{ pose: "phone", lookX: 14, lookY: 12, serious: false }}
          robot={{ pose: "type", typeSpeed: 3.2, expr: "focus", face: 0.6, antenna: (frame % 8) < 3 ? 1 : 0 }} />
        {/* speed lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = ky - 70 + i * 14, x0 = kx - 120 + ((frame * 40 + i * 53) % 220);
          return <line key={i} x1={x0} y1={y} x2={x0 + 36} y2={y} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.7} />;
        })}
      </VCamera>
      <rect width={1080} height={1920} fill={R.accent} opacity={0.05} />
      <VVignette id="a7v" strength={0.35} />
    </VFrame>
  );
};
void ROBOT_X;

export const SAMPLE: ShotDef[] = [
  { id: "A01", Component: A01, duration: 38 }, // 0.00–1.58
  { id: "A02", Component: A02, duration: 32 }, // 1.58–2.92
  { id: "A03", Component: A03, duration: 40 }, // 2.92–4.58
  { id: "A04", Component: A04, duration: 41 }, // 4.58–6.29
  { id: "A05", Component: A05, duration: 24 }, // 6.29–7.29
  { id: "A06", Component: A06, duration: 53 }, // 7.29–9.50
  { id: "A07", Component: A07, duration: 30 }, // 9.50–10.75
];
