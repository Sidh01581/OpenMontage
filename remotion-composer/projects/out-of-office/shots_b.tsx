import React from "react";
import { INK, SW } from "../later/art";
import { VFrame, VCamera, VVignette, TheoSeated, lerp, ease, easeOut } from "../we-need-to-talk/vart";
import { PriyaOffice, PriyaDesk } from "../we-need-to-talk/sets2";
import { PhoneBody } from "../sure/sets";
import { TheoDesk } from "../busy/shots_a";
import { DevLounge, VacationTag, Crab, TagMode } from "./oart";
import { ManagerCall, PriyaPhone, AlarmWash, StatusScreen, ServerRoom, LapLaptop, LaptopScreen, BeachBag, DevBeachWalk, DevInSea, OpenSea, ITDept } from "./oart2";
import { ShotDef, ShotProps, mouthAt, F, Beach, LOUNGE } from "./shots_a";

// OUT OF OFFICE. — shots 6–31 + end screen. Pure functions of (frame, duration).
// Shot start times (s) are noted on each shot; mouthAt(line, frame, F(lineStart, shotStart)).

const SunWarm: React.FC = () => <rect width={1080} height={1920} fill="#FFE9A8" opacity={0.08} />;
const clamp = (t: number) => Math.max(0, Math.min(1, t));
const Meter: React.FC<{ pct: number; mode?: TagMode; age?: number; y?: number }> = ({ pct, mode = "vac", age = 20, y = 300 }) => <VacationTag x={260} y={y} pct={pct} mode={mode} age={age} />;

// Dev on the beach chair, framed by a camera. Shared by most Dev shots.
const DevShot: React.FC<{ frame: number; id: string; cam: [number, number, number]; children?: React.ReactNode; crab?: React.ReactNode } & Partial<React.ComponentProps<typeof DevLounge>>> = ({ frame, id, cam, children, crab, ...p }) => (
  <VCamera cx={cam[0]} cy={cam[1]} zoom={cam[2]}>
    <Beach frame={frame} crab={crab}>
      <DevLounge {...LOUNGE} frame={frame} id={id} {...p} />
      {children}
    </Beach>
  </VCamera>
);
const FACE: [number, number] = [495, 1100]; // Dev's head region in beach-world coords

// Priya at her desk on the phone (frame space world).
const PriyaShot: React.FC<{ frame: number; cam: [number, number, number]; alarm?: number; children?: React.ReactNode } & Partial<React.ComponentProps<typeof PriyaPhone>>> = ({ frame, cam, alarm = 0, children, ...p }) => (
  <>
    <VCamera cx={cam[0]} cy={cam[1]} zoom={cam[2]}>
      <PriyaOffice frame={frame} sun={0} />
      <PriyaPhone x={540} y={760} s={1.5} frame={frame} expr="neutral" {...p} />
      <PriyaDesk frame={frame} />
      {children}
    </VCamera>
    {alarm > 0 && <AlarmWash frame={frame} k={alarm} />}
  </>
);

// ---------------------------------------------------------------- Scene 2 — the call
// C06 (9.75): phone buzzing on the towel: MANAGER CALLING.
export const C06: React.FC<ShotProps> = ({ frame }) => {
  const buzz = Math.sin(frame * 3.2) * 10;
  return (
    <VFrame bg="#F2D59B">
      <rect width={1080} height={1920} fill="#F2D59B" />
      <rect x={-40} y={300} width={1160} height={1400} fill="#3DB6C8" transform="rotate(-6 540 960)" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-40} y={360 + i * 220} width={1160} height={90} fill="#FFFFFF" opacity={0.85} transform="rotate(-6 540 960)" />)}
      <PhoneBody x={540 + buzz} y={960} s={1.1} r={-8 + buzz * 0.2} id="c6ph"><ManagerCall frame={frame} /></PhoneBody>
      {[0, 1].map((i) => <path key={i} d={`M${200 - i * 40},${700 + i * 60} q-30,40 0,80 M${880 + i * 40},${700 + i * 60} q30,40 0,80`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" opacity={frame % 6 < 3 ? 1 : 0.3} />)}
      <VVignette id="c6v" strength={0.3} />
    </VFrame>
  );
};

// C07 (10.583): MCU Dev lowers his sunglasses: "Seriously?"
export const C07: React.FC<ShotProps> = ({ frame }) => {
  const low = easeOut((frame - 2) / 8);
  return (
    <VFrame>
      <DevShot frame={frame} id="c7" cam={[FACE[0], FACE[1], 2.5]} arm="rest" shades={low} serious={low > 0.5} smile={low < 0.5} talk={mouthAt("D01", frame, F(10.6, 10.583))} lookX={16} lookY={8} />
      <SunWarm /><VVignette id="c7v" strength={0.3} />
    </VFrame>
  );
};

// C08 (12.333): Dev answers on speaker: "Who calls someone at the beach?"
export const C08: React.FC<ShotProps> = ({ frame, duration }) => {
  const k = easeOut(frame / 6);
  return (
    <VFrame>
      <DevShot frame={frame} id="c8" cam={[500, 1120, lerp(1.9, 2.0, ease(frame / duration))]} arm="phone" k={k} serious smile={false} shades={1} talk={mouthAt("D01", frame, F(10.6, 12.333))} lookX={16} lookY={6} />
      <Meter pct={100} />
      <SunWarm /><VVignette id="c8v" strength={0.25} />
    </VFrame>
  );
};

// C09 (14.25): Priya under the red alarm, panicking: "Dev! The servers are down!"
export const C09: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <PriyaShot frame={frame} cam={[540, lerp(880, 860, ease(frame / duration)), 1.25]} alarm={1} expr="neutral" panic={1} talk={mouthAt("P01", frame, F(14.35, 14.25))} lookX={-2} lookY={-4} />
    <VVignette id="c9v" strength={0.35} />
  </VFrame>
);

// C10 (16.25): the status board, all red: "…we need you online, right now!"
export const C10: React.FC<ShotProps> = ({ frame }) => (
  <VFrame bg="#0E1116">
    <g transform={`translate(540 900) scale(${lerp(1.08, 1.16, frame / 48)}) rotate(2)`}>
      <rect x={-500} y={-360} width={1000} height={720} rx={30} fill="#2A2E38" stroke={INK} strokeWidth={SW} />
      <g transform="translate(-450 -310)"><StatusScreen frame={frame} up={0} /></g>
    </g>
    <AlarmWash frame={frame} k={0.8} />
    <VVignette id="c10v" strength={0.5} />
  </VFrame>
);

// C11 (18.25): Dev pleading: "But boss… I'm on vacation!" Meter drops to 60%.
export const C11: React.FC<ShotProps> = ({ frame, duration }) => {
  const drop = easeOut((frame - 4) / 10);
  return (
    <VFrame>
      <DevShot frame={frame} id="c11" cam={[480, 1130, lerp(2.1, 2.25, ease(frame / duration))]} arm="phone" k={1} serious={false} smile={false} shades={1} talk={mouthAt("D02", frame, F(18.4, 18.25))} lookX={16} lookY={4} sitUp={0.2} />
      <Meter pct={lerp(100, 60, drop)} />
      <SunWarm /><VVignette id="c11v" strength={0.28} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- Scene 3 — corporate emergency
// C12 (20.333): Priya, frantic: "I don't care!"
export const C12: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <PriyaShot frame={frame} cam={[560, 760, lerp(2.0, 2.2, ease(frame / duration))]} alarm={1.2} expr="neutral" panic={1.5} talk={mouthAt("P02", frame, F(20.5, 20.333))} lookX={-6} lookY={0} />
    <VVignette id="c12v" strength={0.4} />
  </VFrame>
);

// C13 (22.083): "The CEO is asking questions!" — chat pings from the CEO pile up next to her.
export const C13: React.FC<ShotProps> = ({ frame }) => {
  const n = Math.min(4, 1 + Math.floor(frame / 9));
  return (
    <VFrame>
      <PriyaShot frame={frame} cam={[540, 880, 1.25]} alarm={1} expr="neutral" panic={1.2} talk={mouthAt("P02", frame, F(20.5, 22.083))} lookX={-2} lookY={-2} />
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} transform={`translate(${250 + (i % 2) * 300} ${380 + i * 120})`}>
          <rect x={0} y={0} width={480} height={96} rx={22} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
          <circle cx={46} cy={48} r={28} fill="#3A3F4A" />
          <text x={46} y={58} textAnchor="middle" fontFamily="'Helvetica Neue', Arial" fontWeight={900} fontSize={22} fill="#FFFFFF">CEO</text>
          <text x={90} y={62} fontFamily="'Helvetica Neue', Arial" fontWeight={800} fontSize={34} fill="#141018">{["Why is it down??", "???", "Who's on it?", "CALL ME"][i]}</text>
        </g>
      ))}
      <VVignette id="c13v" strength={0.35} />
    </VFrame>
  );
};

// C14 (23.917): Theo narrating, deadpan: "Thousands of employees…"
export const C14: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={990} cy={455} zoom={lerp(2.6, 2.8, ease(frame / duration))}>
      <TheoDesk frame={frame} />
      <TheoSeated expr="blank" frame={frame} talk={mouthAt("T02", frame, F(24.05, 23.917))} headRot={-4} lookX={-4} lookY={0} />
    </VCamera>
    <VVignette id="c14v" strength={0.3} />
  </VFrame>
);

// C15 (25.25): "…an entire IT department…" — out to lunch, empty desks.
export const C15: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <g transform={`translate(540 960) scale(${lerp(1.0, 1.06, ease(frame / duration))}) translate(-540 -960)`}>
      <rect width={1080} height={1920} fill="#E6E9EC" />
      <rect y={1500} width={1080} height={420} fill="#71908C" />
      <ITDept frame={frame} />
    </g>
    <VVignette id="c15v" strength={0.3} />
  </VFrame>
);

// C16 (27.0): "…and it all depends on Dev's beach vacation!" Wide: Dev tiny on a big beach, a spotlight on him.
export const C16: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <DevShot frame={frame} id="c16" cam={[560, 1100, lerp(0.9, 0.82, ease(frame / duration))]} arm="phone" k={1} serious smile={false} shades={1} lookX={16} />
    <defs><radialGradient id="c16s" cx={430} cy={1250} r={420} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.45} /></radialGradient></defs>
    <rect width={1080} height={1920} fill="url(#c16s)" />
    <Meter pct={30} />
  </VFrame>
);

// C17 (29.0): beat — he looks at his coconut, then at the phone; his smile slowly disappears. Meter 10%.
export const C17: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = frame / duration;
  const toPhone = ease((frame - 14) / 8);
  return (
    <VFrame>
      <DevShot frame={frame} id="c17" cam={[FACE[0] + 30, FACE[1] + 20, lerp(2.4, 2.7, ease(t))]} arm="rest" shades={0.6} smile={t < 0.45} serious={t > 0.75}
        lookX={lerp(12, 18, toPhone)} lookY={lerp(10, 16, toPhone)} />
      <Meter pct={lerp(30, 10, clamp(t * 1.4))} />
      <SunWarm /><VVignette id="c17v" strength={0.3} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- Scene 4 — the fix
// C18 (30.583): resigned: "Okay, boss. I'll take care of it."
export const C18: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <DevShot frame={frame} id="c18" cam={[FACE[0], FACE[1], 2.5]} arm="phone" k={1} serious smile={false} shades={1} talk={mouthAt("D03", frame, F(30.7, 30.583))} lookX={16} lookY={6} sitUp={0.3} />
    <SunWarm /><VVignette id="c18v" strength={0.3} />
  </VFrame>
);

// C19 (32.083): the laptop opens on his lap; meter flips to WORK MODE: ON.
export const C19: React.FC<ShotProps> = ({ frame }) => {
  const open = easeOut((frame - 2) / 10);
  return (
    <VFrame>
      <DevShot frame={frame} id="c19" cam={[540, 1150, 1.8]} arm={open > 0.6 ? "laptop" : "rest"} k={1} typeSpeed={open > 0.9 ? 1.6 : 0} serious smile={false} shades={1} sitUp={0.5}
        talk={mouthAt("D03", frame, F(30.7, 32.083))} lookX={16} lookY={12} holding={<LapLaptop open={open} />} />
      <Meter pct={10} mode={open > 0.6 ? "work" : "vac"} age={open > 0.6 ? frame - 8 : 20} />
      <SunWarm /><VVignette id="c19v" strength={0.25} />
    </VFrame>
  );
};

// C20 (33.583): the laptop screen: terminal typing, progress bar.
export const C20: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame bg="#F2D59B">
    <rect width={1080} height={1920} fill="#F2D59B" />
    <g transform={`translate(540 900) scale(${lerp(1.04, 1.12, frame / duration)}) rotate(-3)`}>
      <rect x={-500} y={-350} width={1000} height={700} rx={30} fill="#A9B0BC" stroke={INK} strokeWidth={SW} />
      <g transform="translate(-450 -300)"><LaptopScreen frame={frame} t={clamp(frame / duration) * 0.85} /></g>
    </g>
    <VVignette id="c20v" strength={0.35} />
  </VFrame>
);

// C21 (34.833): server room flips red -> green, rack by rack.
export const C21: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <g transform={`translate(540 960) scale(${lerp(1.0, 1.08, ease(frame / duration))}) translate(-540 -960)`}><ServerRoom frame={frame} up={clamp(frame / (duration - 4))} /></g>
    <VVignette id="c21v" strength={0.4} />
  </VFrame>
);

// C22 (36.083): Priya overjoyed, alarm off: "You're a lifesaver, Dev!"
export const C22: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <PriyaShot frame={frame} cam={[540, 860, lerp(1.3, 1.4, ease(frame / duration))]} expr="smile" talk={mouthAt("P03", frame, F(36.1, 36.083))} headTilt={Math.sin(frame * 0.4) * 5} />
    <rect width={1080} height={1920} fill="#5BE37A" opacity={0.06} />
    <VVignette id="c22v" strength={0.3} />
  </VFrame>
);

// C23 (37.667): "…We'll remember this!" Laptop on his lap: ALL SYSTEMS ONLINE.
export const C23: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame bg="#F2D59B">
    <rect width={1080} height={1920} fill="#F2D59B" />
    <g transform={`translate(540 900) scale(${lerp(1.1, 1.14, frame / duration)}) rotate(-3)`}>
      <rect x={-500} y={-350} width={1000} height={700} rx={30} fill="#A9B0BC" stroke={INK} strokeWidth={SW} />
      <g transform="translate(-450 -300)"><LaptopScreen frame={frame} t={1} /></g>
    </g>
    <VVignette id="c23v" strength={0.3} />
  </VFrame>
);

// C24 (39.25): Dev, hopeful: "Great! Can I get a day off next week?"
export const C24: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <DevShot frame={frame} id="c24" cam={[500, 1120, lerp(2.0, 2.1, ease(frame / duration))]} arm="phone" k={1} smile serious={false} shades={0.4} talk={mouthAt("D04", frame, F(39.35, 39.25))} lookX={16} lookY={2} sitUp={0.4} />
    <Meter pct={lerp(10, 40, ease(frame / duration))} />
    <SunWarm /><VVignette id="c24v" strength={0.25} />
  </VFrame>
);

// C25 (41.0): closer: puppy-eyed hope (shades pushed down, eyes up).
export const C25: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <DevShot frame={frame} id="c25" cam={[FACE[0], FACE[1] - 10, lerp(2.7, 2.9, ease(frame / duration))]} arm="phone" k={1} smile serious={false} shades={1} talk={mouthAt("D04", frame, F(39.35, 41.0))} lookX={14} lookY={-6} sitUp={0.4} />
    <Meter pct={lerp(40, 70, ease(frame / duration))} />
    <SunWarm /><VVignette id="c25v" strength={0.3} />
  </VFrame>
);

// C26 (42.75): Priya, sweet: "Sure!"
export const C26: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <PriyaShot frame={frame} cam={[560, 760, lerp(2.0, 2.1, ease(frame / duration))]} expr="smile" talk={mouthAt("P04", frame, F(42.9, 42.75))} headTilt={6} />
    <VVignette id="c26v" strength={0.3} />
  </VFrame>
);

// C27 (44.25): "…Let's discuss it in Monday's meeting." Dev's face falls; meter crashes to 0%.
export const C27: React.FC<ShotProps> = ({ frame, duration }) => {
  const fall = ease((frame - 6) / 12);
  return (
    <VFrame>
      <DevShot frame={frame} id="c27" cam={[FACE[0], FACE[1], lerp(2.6, 2.8, ease(frame / duration))]} arm="phone" k={1} smile={fall < 0.3} serious={fall > 0.6} shades={1} lookX={16} lookY={lerp(-6, 8, fall)} sitUp={lerp(0.4, 0, fall)} />
      <Meter pct={lerp(70, 0, fall)} />
      <SunWarm /><VVignette id="c27v" strength={0.3} />
    </VFrame>
  );
};

// ---------------------------------------------------------------- Scene 5 — the punchline
// C28 (45.917): Theo: "Lesson learned: you can leave the office…"
export const C28: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={990} cy={455} zoom={lerp(2.7, 2.95, ease(frame / duration))}>
      <TheoDesk frame={frame} />
      <TheoSeated expr="smile" frame={frame} talk={mouthAt("T03", frame, F(46.0, 45.917))} headRot={-4} lookX={-2} lookY={0} />
    </VCamera>
    <VVignette id="c28v" strength={0.3} />
  </VFrame>
);

// C29 (47.75): "…but the office never leaves you!" He snaps the laptop shut and drops it in the beach bag.
export const C29: React.FC<ShotProps> = ({ frame }) => {
  const shut = easeOut(frame / 8);
  const drop = clamp((frame - 12) / 10);
  return (
    <VFrame>
      <DevShot frame={frame} id="c29" cam={[600, 1180, 1.6]} arm={frame < 12 ? "laptop" : "rest"} k={1} serious smile={false} shades={0} sitUp={0.5} lookX={16} lookY={12}
        holding={frame < 12 ? <LapLaptop open={1 - shut} glow={0} /> : undefined}>
        <BeachBag x={850} y={1580} s={0.9} laptopIn={drop} />
      </DevShot>
      <Meter pct={0} mode="work" />
      <SunWarm /><VVignette id="c29v" strength={0.25} />
    </VFrame>
  );
};

// C30 (49.583): he grabs his coconut and walks toward the water; meter: VACATION 404.
export const C30: React.FC<ShotProps> = ({ frame, duration }) => {
  const x = lerp(260, 760, frame / duration);
  return (
    <VFrame>
      <VCamera cx={560} cy={1120} zoom={1.15}>
        <Beach frame={frame} crab={<Crab x={180} y={1640} s={0.7} frame={frame} wave={Math.abs(Math.sin(frame * 0.4))} />}>
          <DevBeachWalk x={x} y={1560 - 186 * 1.2} s={1.2} frame={frame} phase={frame / 7} id="c30" />
        </Beach>
      </VCamera>
      <Meter pct={0} mode="404" age={frame - 4} />
      <SunWarm /><VVignette id="c30v" strength={0.2} />
    </VFrame>
  );
};

// C31 (50.583): waist-deep in the sea, to camera: "Next vacation… somewhere with NO WIFI!"
export const C31: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <g transform={`translate(540 960) scale(${lerp(1.0, 1.06, ease(frame / duration))}) translate(-540 -960)`}>
      <OpenSea frame={frame} />
      <DevInSea frame={frame} talk={mouthAt("D05", frame, F(50.6, 50.583))} raise={easeOut((frame - 40) / 8)} />
    </g>
    <SunWarm /><VVignette id="c31v" strength={0.25} />
  </VFrame>
);

// End screen (53.583): flash, the empty beach chair with the bag; the card is an HTML overlay in Root.
export const CEND: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={560} cy={lerp(1080, 1060, ease(frame / duration))} zoom={1.15}>
      <Beach frame={frame}><BeachBag x={820} y={1600} s={0.9} laptopIn={1} /></Beach>
    </VCamera>
    <rect width={1080} height={1920} fill="#141018" opacity={0.25} />
    <rect width={1080} height={1920} fill="#FFFFFF" opacity={Math.exp(-frame / 3)} />
    <VVignette id="cendv" strength={0.45} />
  </VFrame>
);

export const REST: ShotDef[] = [
  { id: "C06", Component: C06, duration: 20 }, //  9.750
  { id: "C07", Component: C07, duration: 42 }, // 10.583
  { id: "C08", Component: C08, duration: 46 }, // 12.333
  { id: "C09", Component: C09, duration: 48 }, // 14.250
  { id: "C10", Component: C10, duration: 48 }, // 16.250
  { id: "C11", Component: C11, duration: 50 }, // 18.250
  { id: "C12", Component: C12, duration: 42 }, // 20.333
  { id: "C13", Component: C13, duration: 44 }, // 22.083
  { id: "C14", Component: C14, duration: 32 }, // 23.917
  { id: "C15", Component: C15, duration: 42 }, // 25.250
  { id: "C16", Component: C16, duration: 48 }, // 27.000
  { id: "C17", Component: C17, duration: 38 }, // 29.000
  { id: "C18", Component: C18, duration: 36 }, // 30.583
  { id: "C19", Component: C19, duration: 36 }, // 32.083
  { id: "C20", Component: C20, duration: 30 }, // 33.583
  { id: "C21", Component: C21, duration: 30 }, // 34.833
  { id: "C22", Component: C22, duration: 38 }, // 36.083
  { id: "C23", Component: C23, duration: 38 }, // 37.667
  { id: "C24", Component: C24, duration: 42 }, // 39.250
  { id: "C25", Component: C25, duration: 42 }, // 41.000
  { id: "C26", Component: C26, duration: 36 }, // 42.750
  { id: "C27", Component: C27, duration: 40 }, // 44.250
  { id: "C28", Component: C28, duration: 44 }, // 45.917
  { id: "C29", Component: C29, duration: 44 }, // 47.750
  { id: "C30", Component: C30, duration: 24 }, // 49.583
  { id: "C31", Component: C31, duration: 72 }, // 50.583
  { id: "CEND", Component: CEND, duration: 72 }, // 53.583 – 56.583
];
