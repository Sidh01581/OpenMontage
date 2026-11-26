import React from "react";
import { VFrame, VCamera, VVignette, lerp, ease, easeOut } from "../we-need-to-talk/vart";
import { DevSeated } from "../busy/bart2";
import { DeskBack, DeskPartition, DEV, Monitor, Wallpaper, ExpiryPopup, PwWindow, Pointer, PatienceTag, Rule } from "./part";
import MOUTH from "./mouth_env.json";

// THE PASSWORD NIGHTMARE. — shots 1–6 (sample). Pure functions of (frame, duration).
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

// Rule texts, in the order they appear in the film.
export const RULES = [
  "Must contain a capital letter",
  "Must contain a number",
  "Must contain a symbol",
  "Cannot contain the word \"password\"",
  "Cannot contain your pet's name",
  "Must contain a hieroglyph + moon phase",
  "Cannot match your last 200 passwords",
];
// rules visible in a shot: first n are old; rule n (index) appears at frame `at` of the shot.
export const rulesUpTo = (n: number, frame: number, at = -999): Rule[] =>
  RULES.slice(0, n + 1).map((text, i) => ({ text, age: i < n ? 99 : frame - at }));
// typed text appearing letter by letter from frame `at` (every `every` frames), after a fixed prefix.
export const typeOut = (prefix: string, add: string, frame: number, at: number, every = 1.2) =>
  prefix + add.slice(0, Math.max(0, Math.min(add.length, Math.floor((frame - at) / every) + 1)));

// Dev's desk (BUSY. set) with Dev; screen-glow tint flashes red on every rejection.
export const Desk: React.FC<{ frame: number; dev?: Partial<React.ComponentProps<typeof DevSeated>>; before?: React.ReactNode }> = ({ frame, dev = {}, before }) => (
  <>
    <DeskBack frame={frame} />
    <DeskPartition />
    {before}
    <DevSeated x={DEV.x} y={DEV.y} s={DEV.s} frame={frame} pose="type" lookX={17} lookY={3} natural {...dev} />
  </>
);
export const OfficeLight: React.FC = () => <rect width={1080} height={1920} fill="#EAF2FF" opacity={0.06} />;
export const RedFlash: React.FC<{ k: number }> = ({ k }) => (k > 0 ? <rect width={1080} height={1920} fill="#FF3B3B" opacity={0.14 * k} /> : null);
export const Meter: React.FC<{ pct: number; age?: number; y?: number; hit?: number }> = ({ pct, age = 20, y = 270, hit = 0 }) => <PatienceTag x={260} y={y} pct={pct} age={age} hit={hit} />;
// red rejection pulse: 1 at frame `at`, fading over 10 frames
export const pulse = (frame: number, at: number) => (frame >= at ? Math.max(0, 1 - (frame - at) / 10) : 0);

// Shot 1 (0–1.75): ECU monitor. "Your password has expired." pops up; the pointer clicks Change password. PATIENCE 100%.
export const W01: React.FC<ShotProps> = ({ frame, duration }) => {
  const k = easeOut((frame - 3) / 6);
  const mv = ease((frame - 16) / 14);
  const press = frame >= 32 && frame <= 35;
  return (
    <VFrame bg="#C9CED6">
      <rect width={1080} height={1920} fill="#C9CED6" />
      <Monitor cx={540} cy={880} s={lerp(1.0, 1.03, frame / duration)} rot={-1}>
        <Wallpaper />
        <ExpiryPopup k={k} />
        {press && <rect x={480} y={392} width={270} height={60} rx={12} fill="#FFFFFF" opacity={0.35} />}
        <Pointer x={lerp(300, 640, mv)} y={lerp(560, 428, mv)} />
      </Monitor>
      <Meter pct={100} age={frame - 10} y={1360} />
      <VVignette id="w1v" strength={0.3} />
    </VFrame>
  );
};

// Shot 2 (1.75–3.0): Dev MS at his desk, cracks his knuckles, confident: "Easy."
export const W02: React.FC<ShotProps> = ({ frame }) => {
  const crack = clamp(frame / 12);
  return (
    <VFrame>
      <VCamera cx={590} cy={lerp(900, 890, frame / 30)} zoom={1.4}>
        <Desk frame={frame} dev={{ pose: crack < 1 ? "knuckles" : "type", crack, typeSpeed: crack < 1 ? 0 : 1.2, serious: false, talk: mouthAt("D01", frame, F(2.2, 1.75)), lookX: 17, lookY: 2 }} />
      </VCamera>
      <OfficeLight /><VVignette id="w2v" strength={0.25} />
    </VFrame>
  );
};

// Shot 3 (3.0–5.6): screen. Types "password", hits enter: red ✗ "Must contain a capital letter". PATIENCE 100 -> 90.
export const W03: React.FC<ShotProps> = ({ frame, duration }) => {
  const enter = 10;
  const err = frame >= enter;
  return (
    <VFrame bg="#1C1F28">
      <Monitor cx={540} cy={900} s={lerp(1.02, 1.08, ease(frame / duration))} rot={-1}>
        <PwWindow frame={frame} typed={typeOut("", "password", frame, 0)} rules={err ? rulesUpTo(0, frame, enter) : []} status={err ? "error" : "idle"} flash={pulse(frame, enter)} shake={pulse(frame, enter)} caret={!err} />
      </Monitor>
      <Meter pct={lerp(100, 90, easeOut((frame - 12) / 8))} hit={pulse(frame, 12)} />
      <VVignette id="w3v" strength={0.45} />
    </VFrame>
  );
};

// Shot 4 (5.6–7.0): Dev MCU, typing hard, eyes on the screen: "Capital P."
export const W04: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={480} cy={860} zoom={1.95}>
      <Desk frame={frame} dev={{ pose: "upright", typeSpeed: 1.6, talk: mouthAt("D02", frame, F(5.65, 5.6)), lookX: 18, lookY: 3 }} />
    </VCamera>
    <rect width={1080} height={1920} fill="#7FB0FF" opacity={0.08} />
    <OfficeLight /><VVignette id="w4v" strength={0.3} />
  </VFrame>
);

// Shot 5 (7.0–8.6): screen. "Password" -> enter -> ✗ "Must contain a number". PATIENCE 90 -> 85.
export const W05: React.FC<ShotProps> = ({ frame, duration }) => {
  const enter = 2;
  return (
    <VFrame bg="#1C1F28">
      <Monitor cx={540} cy={900} s={lerp(1.06, 1.1, ease(frame / duration))} rot={1}>
        <PwWindow frame={frame} typed="Password" rules={rulesUpTo(frame >= enter ? 1 : 0, frame, enter)} status="error" flash={pulse(frame, enter)} shake={pulse(frame, enter)} caret={false} />
      </Monitor>
      <Meter pct={lerp(90, 85, easeOut((frame - 4) / 8))} hit={pulse(frame, 4)} />
      <VVignette id="w5v" strength={0.45} />
    </VFrame>
  );
};

// Shot 6 (8.6–11.25): screen. (Dev: "Password one.") types "1", enter -> ✗ "Must contain a symbol". PATIENCE 85 -> 80.
export const W06: React.FC<ShotProps> = ({ frame, duration }) => {
  const typeAt = 10, enter = 27;
  const err = frame >= enter;
  return (
    <VFrame bg="#1C1F28">
      <Monitor cx={540} cy={900} s={lerp(1.08, 1.16, ease(frame / duration))} rot={-1}>
        <PwWindow frame={frame} typed={frame < typeAt ? "Password" : "Password1"} rules={rulesUpTo(err ? 2 : 1, frame, enter)} status={err || frame < typeAt ? "error" : "idle"} flash={pulse(frame, enter)} shake={pulse(frame, enter)} caret={!err} />
      </Monitor>
      <Meter pct={lerp(85, 80, easeOut((frame - enter - 2) / 8))} hit={pulse(frame, enter + 2)} />
      <RedFlash k={pulse(frame, enter) * 0.5} />
      <VVignette id="w6v" strength={0.45} />
    </VFrame>
  );
};

export const SAMPLE: ShotDef[] = [
  { id: "W01", Component: W01, duration: 42 }, // 0.00–1.75
  { id: "W02", Component: W02, duration: 30 }, // 1.75–3.00
  { id: "W03", Component: W03, duration: 62 }, // 3.00–5.58
  { id: "W04", Component: W04, duration: 34 }, // 5.58–7.00
  { id: "W05", Component: W05, duration: 38 }, // 7.00–7.58..8.58
  { id: "W06", Component: W06, duration: 64 }, // 8.58–11.25
];
