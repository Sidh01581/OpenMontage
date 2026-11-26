import React from "react";
import { Mochi } from "../later/art";
import { VFrame, VCamera, VVignette, lerp, ease, easeOut } from "../we-need-to-talk/vart";
import { Monitor, PwWindow } from "./part";
import { MochiWalk, MochiYawn, PriyaOverWall, TheoRolledOver } from "./part2";
import { ShotDef, ShotProps, mouthAt, F, clamp, rulesUpTo, typeOut, Desk, Meter, OfficeLight, RedFlash, pulse } from "./shots_a";

// THE PASSWORD NIGHTMARE. — shots 7–23 + black. Pure functions of (frame, duration). Times in comments are film seconds.
// Dev's head world centre ~ (493, 760); desk top y 1190; keyboard x 510..690; monitor x ~870.

const Screen: React.FC<{ frame: number; duration: number; rot?: number; s0?: number; s1?: number; children: React.ReactNode; meter?: React.ReactNode; flash?: number }> =
  ({ frame, duration, rot = -1, s0 = 1.04, s1 = 1.1, children, meter, flash = 0 }) => (
    <VFrame bg="#1C1F28">
      <Monitor cx={540} cy={900} s={lerp(s0, s1, ease(frame / duration))} rot={rot}>{children}</Monitor>
      {meter}
      <RedFlash k={flash * 0.5} />
      <VVignette id={`sc${rot}`} strength={0.45} />
    </VFrame>
  );
const DevShot: React.FC<{ frame: number; cx: number; cy: number; zoom: number; dev: Parameters<typeof Desk>[0]["dev"]; before?: React.ReactNode; after?: React.ReactNode; tint?: string; id: string; overlay?: React.ReactNode }> =
  ({ frame, cx, cy, zoom, dev, before, after, tint, id, overlay }) => (
    <VFrame>
      <VCamera cx={cx} cy={cy} zoom={zoom}>
        <Desk frame={frame} dev={dev} before={before} />
        {after}
      </VCamera>
      {tint && <rect width={1080} height={1920} fill={tint} opacity={0.08} />}
      {overlay}
      <OfficeLight /><VVignette id={id} strength={0.28} />
    </VFrame>
  );

// W07 (11.25–13.58): Dev MCU, smug, typing "Password one, exclamation mark!" and slamming enter.
export const W07: React.FC<ShotProps> = ({ frame, duration }) => (
  <DevShot id="w7v" frame={frame} cx={480} cy={lerp(860, 850, ease(frame / duration))} zoom={1.95} tint="#7FB0FF"
    dev={{ pose: frame > 50 ? "upright" : "type", typeSpeed: frame > 50 ? 0 : 1.3, serious: false, talk: mouthAt("D04", frame, F(11.15, 11.25)), lookX: 18, lookY: 3 }} />
);

// W08 (13.58–16.25): screen. "Password1!" -> ✗ Cannot contain the word "password". PATIENCE 80 -> 60.
export const W08: React.FC<ShotProps> = ({ frame, duration }) => (
  <Screen frame={frame} duration={duration} rot={1} flash={pulse(frame, 2)}
    meter={<Meter pct={lerp(80, 60, easeOut((frame - 8) / 10))} hit={pulse(frame, 8)} />}>
    <PwWindow frame={frame} typed="Password1!" rules={rulesUpTo(frame >= 2 ? 3 : 2, frame, 2)} status="error" flash={pulse(frame, 2)} shake={pulse(frame, 2)} caret={false} />
  </Screen>
);

// W09 (16.25–17.25): Dev stares at the screen. Slow push (no meter: it would cover his face).
export const W09: React.FC<ShotProps> = ({ frame, duration }) => (
  <DevShot id="w9v" frame={frame} cx={493} cy={820} zoom={lerp(2.3, 2.6, ease(frame / duration))} tint="#7FB0FF"
    dev={{ pose: "type", typeSpeed: 0, serious: true, lookX: 18, lookY: 2 }} />
);

// W10 (17.25–19.25): Theo rolls his chair over with a coffee: "Just use your cat's name." Dev types "Mochi".
export const W10: React.FC<ShotProps> = ({ frame, duration }) => {
  const roll = easeOut(frame / 9);
  return (
    <DevShot id="w10v" frame={frame} cx={250} cy={900} zoom={lerp(1.35, 1.4, ease(frame / duration))}
      before={<TheoRolledOver frame={frame} x={lerp(-320, -40, roll)} talk={mouthAt("T01", frame, F(17.3, 17.25))} />}
      dev={{ pose: "type", typeSpeed: frame > 36 ? 1.2 : 0, serious: true, lookX: 18, lookY: 3 }} />
  );
};

// W11 (19.25–21.58): screen. "Mochi" -> ✗ Cannot contain your pet's name. PATIENCE 60 -> 40.
export const W11: React.FC<ShotProps> = ({ frame, duration }) => (
  <Screen frame={frame} duration={duration} rot={-1} flash={pulse(frame, 2)}
    meter={<Meter pct={lerp(60, 40, easeOut((frame - 8) / 10))} hit={pulse(frame, 8)} />}>
    <PwWindow frame={frame} typed="Mochi" rules={rulesUpTo(frame >= 2 ? 4 : 3, frame, 2)} status="error" flash={pulse(frame, 2)} shake={pulse(frame, 2)} caret={false} />
  </Screen>
);

// W12 (21.58–24.08): Dev alarmed, leaning back from the screen: "How does it know about Mochi?!"
export const W12: React.FC<ShotProps> = ({ frame }) => (
  <DevShot id="w12v" frame={frame} cx={480} cy={850} zoom={1.95} tint="#7FB0FF"
    dev={{ pose: "upright", typeSpeed: 0, serious: false, sweat: 2, talk: mouthAt("D05", frame, F(21.7, 21.583)), lookX: 18, lookY: 0 }} />
);

// W13 (24.08–26.33): screen. "M0ch1!" -> ✗ Must contain a hieroglyph + moon phase; a moon pops. PATIENCE 40 -> 30.
export const W13: React.FC<ShotProps> = ({ frame, duration }) => {
  const moon = easeOut((frame - 14) / 6);
  return (
    <Screen frame={frame} duration={duration} rot={1} flash={pulse(frame, 2)}
      meter={<Meter pct={lerp(40, 30, easeOut((frame - 8) / 10))} hit={pulse(frame, 8)} />}>
      <PwWindow frame={frame} typed="M0ch1!" rules={rulesUpTo(frame >= 2 ? 5 : 4, frame, 2)} status="error" flash={pulse(frame, 2)} shake={pulse(frame, 2)} caret={false} />
      {moon > 0 && <text x={790} y={120} textAnchor="middle" fontSize={90 * moon} transform={`rotate(${-10 + moon * 10} 790 100)`}>🌔</text>}
    </Screen>
  );
};

// W14 (26.33–28.25): Dev CU, listening, blank and very still ("…the current phase of the moon").
export const W14: React.FC<ShotProps> = ({ frame, duration }) => (
  <DevShot id="w14v" frame={frame} cx={493} cy={800} zoom={lerp(2.4, 2.55, ease(frame / duration))} tint="#7FB0FF"
    dev={{ pose: "type", typeSpeed: 0, serious: true, lookX: 16, lookY: 2 }} />
);

// W15 (28.25–30.25): Priya pops over the cubicle wall: "Ooh, mine had to rhyme!"
export const W15: React.FC<ShotProps> = ({ frame, duration }) => {
  const up = easeOut(frame / 6);
  return (
    <DevShot id="w15v" frame={frame} cx={1090} cy={860} zoom={lerp(1.4, 1.45, ease(frame / duration))}
      before={<PriyaOverWall x={1300} frame={frame} up={up} talk={mouthAt("P01", frame, F(28.4, 28.25))} headTilt={Math.sin(frame * 0.3) * 4} />}
      dev={{ pose: "type", typeSpeed: 0 }} />
  );
};

// W16 (30.25–33.08): Dev, dead-eyed, typing slowly: "It's a waxing gibbous. I checked."
export const W16: React.FC<ShotProps> = ({ frame }) => (
  <DevShot id="w16v" frame={frame} cx={480} cy={850} zoom={2.0} tint="#7FB0FF"
    dev={{ pose: "type", typeSpeed: 0.5, serious: true, talk: mouthAt("D06", frame, F(30.35, 30.25)), lookX: 16, lookY: 4 }} />
);

// W17 (33.08–36.25): screen. "W4x1ng🌔𓂀!" -> ✗ Cannot match your last 200 passwords. PATIENCE 20 -> 5 -> 0.
export const W17: React.FC<ShotProps> = ({ frame, duration }) => {
  const pct = frame < 60 ? lerp(20, 5, easeOut((frame - 8) / 10)) : lerp(5, 0, easeOut((frame - 60) / 8));
  return (
    <Screen frame={frame} duration={duration} rot={-1} s1={1.16} flash={pulse(frame, 3)}
      meter={<Meter pct={pct} hit={Math.max(pulse(frame, 8), pulse(frame, 60))} />}>
      <PwWindow frame={frame} typed="W4x1ng🌔𓂀!" rules={rulesUpTo(frame >= 3 ? 6 : 5, frame, 3)} status="error" flash={pulse(frame, 3)} shake={pulse(frame, 3)} caret={false} />
    </Screen>
  );
};

// W18 (36.25–37.0): PATIENCE 0%. Dev's head drops onto the desk beside the keyboard (thud at 36.4).
export const W18: React.FC<ShotProps> = ({ frame }) => {
  const down = easeOut(frame / 4);
  const shake = frame >= 4 && frame < 9 ? Math.sin(frame * 3) * 8 : 0;
  return (
    <VFrame>
      <VCamera cx={560} cy={1000} zoom={1.5} shakeY={shake}>
        <Desk frame={frame} dev={{ pose: "facedown", down }} />
      </VCamera>
      <Meter pct={0} y={270} hit={pulse(frame, 4)} />
      <OfficeLight /><VVignette id="w18v" strength={0.3} />
    </VFrame>
  );
};

// W19 (37.0–38.58): Mochi strolls across the keyboard past Dev's head (paw pats).
export const W19: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={640} cy={1060} zoom={lerp(1.6, 1.68, ease(frame / duration))}>
      <Desk frame={frame} dev={{ pose: "facedown", down: 1 }} />
      <MochiWalk x={lerp(1010, 470, frame / duration)} y={1166} s={1.1} frame={frame} phase={frame / 5} />
    </VCamera>
    <OfficeLight /><VVignette id="w19v" strength={0.3} />
  </VFrame>
);

// W20 (38.58–40.33): screen goes green: the gibberish is a "Strong password!"
export const W20: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame bg="#1C1F28">
    <Monitor cx={540} cy={900} s={lerp(1.06, 1.12, ease(frame / duration))} rot={1}>
      <PwWindow frame={frame} typed={typeOut("", "jk;LL@@8#%vvv𓃠", frame, -14, 1)} rules={[]} status="ok" flash={pulse(frame, 0)} caret={false} />
    </Monitor>
    {frame < 8 && <rect width={1080} height={1920} fill="#5BE37A" opacity={0.18 * (1 - frame / 8)} />}
    <VVignette id="w20v" strength={0.4} />
  </VFrame>
);

// W21 (40.33–41.75): Dev's head pops up (straight cut, no in-between); he looks down at Mochi: "…What did you type?"
export const W21: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={640} cy={960} zoom={1.5}>
      <Desk frame={frame} dev={{ pose: "upright", typeSpeed: 0, serious: false, talk: mouthAt("D07", frame, F(40.4, 40.333)), lookX: 14, lookY: 16 }} />
      <Mochi x={760} y={1190} s={1.1} frame={frame} pose="sit" mood="open" look={-3} />
    </VCamera>
    <OfficeLight /><VVignette id="w21v" strength={0.3} />
  </VFrame>
);

// W22 (41.75–43.71): screen. "Please confirm your password." Empty field, blinking caret.
export const W22: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame bg="#1C1F28">
    <Monitor cx={540} cy={900} s={lerp(1.06, 1.18, ease(frame / duration))} rot={-1}>
      <PwWindow frame={frame} typed="" rules={[]} status="idle" caret title="Confirm your password" />
    </Monitor>
    <VVignette id="w22v" strength={0.45} />
  </VFrame>
);

// W23 (43.71–44.5): Mochi yawns. HARD CUT.
export const W23: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={1000} cy={1060} zoom={2.6}>
      <Desk frame={frame} dev={{ pose: "upright", typeSpeed: 0, serious: false, lookX: 14, lookY: 16 }} />
      <MochiYawn x={1010} y={1190} s={1.1} frame={frame} k={easeOut(frame / 8)} />
    </VCamera>
    <OfficeLight /><VVignette id="w23v" strength={0.3} />
  </VFrame>
);

const Black: React.FC<ShotProps> = () => <VFrame bg="#000"><rect width={1080} height={1920} fill="#000" /></VFrame>;

export const REST: ShotDef[] = [
  { id: "W07", Component: W07, duration: 56 }, // 11.25–13.58
  { id: "W08", Component: W08, duration: 64 }, // 13.58–16.25
  { id: "W09", Component: W09, duration: 24 }, // 16.25–17.25
  { id: "W10", Component: W10, duration: 48 }, // 17.25–19.25
  { id: "W11", Component: W11, duration: 56 }, // 19.25–21.58
  { id: "W12", Component: W12, duration: 60 }, // 21.58–24.08
  { id: "W13", Component: W13, duration: 54 }, // 24.08–26.33
  { id: "W14", Component: W14, duration: 46 }, // 26.33–28.25
  { id: "W15", Component: W15, duration: 48 }, // 28.25–30.25
  { id: "W16", Component: W16, duration: 68 }, // 30.25–33.08
  { id: "W17", Component: W17, duration: 76 }, // 33.08–36.25
  { id: "W18", Component: W18, duration: 18 }, // 36.25–37.00
  { id: "W19", Component: W19, duration: 38 }, // 37.00–38.58
  { id: "W20", Component: W20, duration: 42 }, // 38.58–40.33
  { id: "W21", Component: W21, duration: 34 }, // 40.33–41.75
  { id: "W22", Component: W22, duration: 47 }, // 41.75–43.71
  { id: "W23", Component: W23, duration: 19 }, // 43.71–44.50
  { id: "BLK", Component: Black, duration: 8 }, // 44.50–44.83 hard cut to black
];
export { clamp };
