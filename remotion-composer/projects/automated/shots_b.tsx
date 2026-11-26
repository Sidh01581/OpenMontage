import React from "react";
import { VFrame, VCamera, VVignette, lerp, ease, easeOut } from "../we-need-to-talk/vart";
import { Monitor } from "../password-nightmare/part";
import { DEV } from "../password-nightmare/part";
import { AutoDesk, EmailTag, OutboxWindow } from "./aset";
import { DevStand, Bucket, TheoCoffee, PriyaReach, ChairSeat, RobotChair } from "./chars";
import { R } from "./robot";
import { ShotDef, ShotProps, mouthAt, F, clamp, OfficeLight } from "./shots_a";

// AUTOMATED. — shots 8–26 + black. Pure functions of (frame, duration). Cue times (s) from the approved script.
const T = { D02: 10.85, T01: 15.27, D03: 16.53, R02: 17.64, R03: 18.84, P01: 21.62, D04: 24.82, P02: 27.75, D05: 31.19, P03: 36.11, D06: 39.46, P04: 40.31, D07: 44.53, P05: 46.06, T02: 50.71, D08: 55.11 };
const PH = { pose: "phone" as const, lookX: 14, lookY: 12, serious: false };
// talking to Theo / Priya: head lifts off the phone (cancels the phone bow), eyes up toward their faces above the partition
const UP = { ...PH, headTilt: -16, lookX: 18, lookY: -6 };
const ROBOT_TYPING = { pose: "type" as const, typeSpeed: 2.4, expr: "focus" as const, face: 0.6 };
const blink = (frame: number, every = 10) => ((frame % every) < 3 ? 1 : 0);
// Theo / Priya behind the cubicle partition (world coords).
const THEO = { x: 840, y: 1000, s: 1.4 };
const PRI = { x: 860, y: 700, s: 1.2 };

// 8 (10.75–12.95): wide. Robot typing, Dev rolled back on his phone. Theo glides in behind the partition: "I automated my entire job."
export const A08: React.FC<ShotProps> = ({ frame }) => {
  const tx = lerp(1350, THEO.x, easeOut(frame / 18));
  return (
    <VFrame>
      <VCamera cx={600} cy={900} zoom={1.22}>
        <AutoDesk frame={frame} devDx={-70} typing={1} dev={{ ...UP, talk: mouthAt("D02", frame, F(T.D02, 10.75)) }} robot={{ ...ROBOT_TYPING, antenna: blink(frame) }}
          behind={<TheoCoffee x={tx} y={THEO.y + Math.abs(Math.sin(frame * 0.5)) * -6 * (1 - clamp(frame / 18))} s={THEO.s} frame={frame} h={{ expr: "neutral", lookX: -10, lookY: 4 }} flip />} />
      </VCamera>
      <OfficeLight /><VVignette id="a8v" strength={0.25} />
    </VFrame>
  );
};
// 9 (12.95–15.17): Dev MCU, proud, phone in hand: "…Now AI works for me."
export const A09: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={300} cy={820} zoom={1.9}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={{ ...UP, talk: mouthAt("D02", frame, F(T.D02, 12.95)) }} robot={{ ...ROBOT_TYPING }}
        behind={<TheoCoffee x={THEO.x} y={THEO.y} s={THEO.s} frame={frame} h={{ expr: "neutral", lookX: -10, lookY: 4 }} flip />} />
    </VCamera>
    <OfficeLight /><VVignette id="a9v" strength={0.28} />
  </VFrame>
);
// 10 (15.17–16.43): Theo MCU behind the partition, deadpan: "So what do you do now?"
export const A10: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={850} cy={680} zoom={2.0}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={PH} robot={{ ...ROBOT_TYPING }}
        behind={<TheoCoffee x={THEO.x} y={THEO.y} s={THEO.s} frame={frame} h={{ expr: "neutral", lookX: -12, lookY: 5, talk: mouthAt("T01", frame, F(T.T01, 15.17)) }} flip />} />
    </VCamera>
    <OfficeLight /><VVignette id="a10v" strength={0.28} />
  </VFrame>
);
// 11 (16.43–17.54): Dev MCU, eyes on the phone: "Nothing."
export const A11: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={270} cy={810} zoom={2.2}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={{ ...UP, talk: mouthAt("D03", frame, F(T.D03, 16.43)) }} robot={{ ...ROBOT_TYPING }} />
    </VCamera>
    <OfficeLight /><VVignette id="a11v" strength={0.28} />
  </VFrame>
);
// 12 (17.54–18.74): robot MCU, antenna flashes: "Email sent." EMAILS SENT 12.
export const A12: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={700} cy={1010} zoom={2.6}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={PH} robot={{ pose: "type", typeSpeed: 2.4, expr: "happy", face: 0.2, talk: mouthAt("R02", frame, F(T.R02, 17.54)), antenna: frame > 6 && frame < 14 ? 1 : 0 }} />
    </VCamera>
    <EmailTag n={frame < 8 ? 11 : 12} age={frame - 2} y={330} hit={frame >= 8 && frame < 14 ? 0.5 : 0} />
    <OfficeLight /><VVignette id="a12v" strength={0.28} />
  </VFrame>
);
// 13 (18.74–21.52): monitor ECU, outbox floods. Counter races 12 -> 500.
export const A13: React.FC<ShotProps> = ({ frame, duration }) => {
  const k = ease(frame / duration);
  const n = Math.round(12 + (500 - 12) * Math.pow(k, 1.6));
  return (
    <VFrame bg="#1C1F28">
      <Monitor cx={540} cy={1000} s={lerp(1.02, 1.1, k)} rot={-1} id="a13mon"><OutboxWindow frame={frame} n={n} /></Monitor>
      <EmailTag n={n} age={20} y={300} hit={0.3} />
      <rect width={1080} height={1920} fill={R.accent} opacity={0.04 + 0.04 * blink(frame, 6)} />
      <VVignette id="a13v" strength={0.45} />
    </VFrame>
  );
};
// 14 (21.52–24.72): wide. Priya storms in behind the partition, alarmed: "Dev, why is the system sending five hundred emails?"
export const A14: React.FC<ShotProps> = ({ frame }) => {
  const px = lerp(1400, PRI.x, easeOut(frame / 10));
  const bob = frame < 10 ? Math.abs(Math.sin(frame * 0.9)) * -10 : 0;
  return (
    <VFrame>
      <VCamera cx={600} cy={880} zoom={1.22}>
        <AutoDesk frame={frame} devDx={-70} typing={1} dev={frame > 16 ? UP : PH} robot={{ ...ROBOT_TYPING, antenna: blink(frame, 6) }}
          behind={<PriyaReach x={px} y={PRI.y + bob} s={PRI.s} frame={frame} expr="neutral" lookX={-12} lookY={6} talk={mouthAt("P01", frame, F(T.P01, 21.52))} />} />
      </VCamera>
      <OfficeLight /><VVignette id="a14v" strength={0.25} />
    </VFrame>
  );
};
// 15 (24.72–27.65): Dev MCU, unbothered, still on his phone: "My AI? It's working overtime."
export const A15: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={280} cy={810} zoom={2.1}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={{ ...UP, talk: mouthAt("D04", frame, F(T.D04, 24.72)) }} robot={{ ...ROBOT_TYPING }} />
    </VCamera>
    <OfficeLight /><VVignette id="a15v" strength={0.28} />
  </VFrame>
);
// 16 (27.65–30.49): Priya MCU holding up her phone, red alert: "It's emailing the entire company every ten seconds!"
export const A16: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={820} cy={700} zoom={1.9}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={PH} robot={{ ...ROBOT_TYPING }}
        behind={<PriyaReach x={PRI.x} y={PRI.y} s={PRI.s} frame={frame} expr="neutral" lookX={-12} lookY={4} arm="phone" buzz={blink(frame, 12)} talk={mouthAt("P02", frame, F(T.P02, 27.65))} />} />
    </VCamera>
    <rect width={1080} height={1920} fill="#FF3B3B" opacity={0.06 * blink(frame, 12)} />
    <OfficeLight /><VVignette id="a16v" strength={0.28} />
  </VFrame>
);
// 17 (30.49–31.09): ECU counter slams to 4,800; phones buzz (BZZT).
export const A17: React.FC<ShotProps> = ({ frame }) => (
  <VFrame bg="#1C1F28">
    <VCamera cx={700} cy={1000} zoom={2.9} shakeX={Math.sin(frame * 3) * 6}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={PH} robot={{ pose: "type", typeSpeed: 3.2, expr: "joy", face: 0.2, antenna: 1 }} />
    </VCamera>
    <EmailTag n={lerp(500, 4800, easeOut(frame / 6))} age={20} y={300} hit={1} />
    <text x={540} y={1500} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={900} fontSize={110} fill="#FFFFFF" stroke="#141018" strokeWidth={10} paintOrder="stroke" transform={`rotate(-6 540 1500)`}>BZZT! BZZT!</text>
    <VVignette id="a17v" strength={0.35} />
  </VFrame>
);
// 18 (31.09–33.20): Dev MCU, shrug of the head: "That's called productivity."
export const A18: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={280} cy={810} zoom={2.1}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={{ ...UP, talk: mouthAt("D05", frame, F(T.D05, 31.09)) }} robot={{ ...ROBOT_TYPING }} />
    </VCamera>
    <OfficeLight /><VVignette id="a18v" strength={0.28} />
  </VFrame>
);
// 19 (33.20–36.01): wide. Dev keeps talking ("Maybe we just have too much work."); Priya stares flat at him; robot types happily.
export const A19: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={600} cy={880} zoom={lerp(1.22, 1.3, frame / duration)}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={{ ...UP, talk: mouthAt("D05", frame, F(T.D05, 33.2)) }} robot={{ ...ROBOT_TYPING, expr: "happy", antenna: blink(frame, 8) }}
        behind={<PriyaReach x={PRI.x} y={PRI.y} s={PRI.s} frame={frame} expr="flat" lookX={-14} lookY={6} />} />
    </VCamera>
    <OfficeLight /><VVignette id="a19v" strength={0.25} />
  </VFrame>
);
// 20 (36.01–39.38): Priya MCU, cold. Looks at the robot, then at Dev: "Dev, we don't need you anymore. We're keeping the robot."
export const A20: React.FC<ShotProps> = ({ frame, duration }) => (
  <VFrame>
    <VCamera cx={840} cy={690} zoom={lerp(2.0, 2.2, frame / duration)}>
      <AutoDesk frame={frame} devDx={-70} typing={1} dev={PH} robot={{ ...ROBOT_TYPING }}
        behind={<PriyaReach x={PRI.x} y={PRI.y} s={PRI.s} frame={frame} expr="flat" lookX={frame < 14 ? -6 : -14} lookY={frame < 14 ? 9 : 4} talk={mouthAt("P03", frame, F(T.P03, 36.01))} />} />
    </VCamera>
    <rect width={1080} height={1920} fill="#9FB4D6" opacity={0.08} />
    <VVignette id="a20v" strength={0.32} />
  </VFrame>
);
// Standing-Dev desk set: empty chair pushed back, robot on the desk, Dev standing (world x).
const StandSet: React.FC<{ frame: number; dev: React.ComponentProps<typeof DevStand>; behind?: React.ReactNode; robot?: object }> = ({ frame, dev, behind, robot = {} }) => (
  <AutoDesk frame={frame} showDev={false} typing={1} robot={{ ...ROBOT_TYPING, ...robot }} behind={behind}
    seat={<><ChairSeat x={DEV.x - 70} y={DEV.y} s={DEV.s} /><DevStand {...dev} /></>} />
);
// 21 (39.38–40.21): Dev jumps up out of his chair: "WHAT?!"
export const A21: React.FC<ShotProps> = ({ frame }) => {
  const jump = Math.sin(clamp(frame / 10) * Math.PI) * 40;
  return (
    <VFrame>
      <VCamera cx={360} cy={800} zoom={1.6} shakeY={frame < 4 ? Math.sin(frame * 4) * 8 : 0}>
        <StandSet frame={frame} dev={{ x: 250, y: 1190, s: 1.5, frame, arms: "what", bounce: jump, head: { talk: Math.max(0.6, mouthAt("D06", frame, F(T.D06, 39.38))), lookX: 14, lookY: -2 } }} robot={{ expr: "happy", face: -0.5, typeSpeed: 0, pose: "idle" }} />
      </VCamera>
      <OfficeLight /><VVignette id="a21v" strength={0.28} />
    </VFrame>
  );
};
// 22 (40.21–44.43): Priya pats the robot's head: "The robot doesn't take breaks, doesn't complain, and works 24/7." Robot beams.
export const A22: React.FC<ShotProps> = ({ frame, duration }) => {
  const reach = easeOut((frame - 4) / 10);
  const pat = Math.sin(frame * 0.6) * 8 * reach;
  const priya = (part: "body" | "arm") => <PriyaReach x={1000} y={PRI.y} s={PRI.s} frame={frame} expr="smile" lookX={-12} lookY={8} part={part}
    arm={reach > 0.05 ? "pat" : "none"} target={[lerp(-150, -280, reach), lerp(240, 182 + pat, reach)]} talk={mouthAt("P04", frame, F(T.P04, 40.21))} />;
  return (
    <VFrame>
      <VCamera cx={lerp(760, 770, frame / duration)} cy={850} zoom={1.6}>
        <StandSet frame={frame} dev={{ x: 250, y: 1190, s: 1.5, frame, arms: "slump", head: { lookX: 16, lookY: 2, serious: true } }}
          robot={{ pose: "idle", typeSpeed: 0, expr: reach > 0.5 ? "joy" : "happy", face: 0.3, antenna: reach > 0.5 ? 0.6 : 0 }} behind={priya("body")} />
        {priya("arm")}
      </VCamera>
      <OfficeLight /><VVignette id="a22v" strength={0.28} />
    </VFrame>
  );
};
// 23 (44.43–45.96): Dev points at the robot, outraged: "But I created it!"
export const A23: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={420} cy={800} zoom={1.7}>
      <StandSet frame={frame} dev={{ x: 250, y: 1190, s: 1.5, frame, arms: "point", head: { serious: true, lookX: 16, lookY: 4, talk: mouthAt("D07", frame, F(T.D07, 44.43)) } }} robot={{ pose: "idle", typeSpeed: 0, expr: "happy", face: -0.5 }} />
    </VCamera>
    <OfficeLight /><VVignette id="a23v" strength={0.28} />
  </VFrame>
);
// 24 (45.96–49.40): two-shot. Priya, flat: "Exactly. That's your last successful contribution." Dev deflates.
export const A24: React.FC<ShotProps> = ({ frame }) => {
  const sag = frame > 30;
  return (
    <VFrame>
      <VCamera cx={560} cy={830} zoom={1.3}>
        <StandSet frame={frame} dev={{ x: 250, y: 1190, s: 1.5, frame, arms: sag ? "slump" : "point", head: { serious: !sag, lookX: 16, lookY: sag ? 6 : 2, sweat: sag ? 1 : 0 } }}
          robot={{ pose: "idle", typeSpeed: 0, expr: "happy", face: 0 }}
          behind={<PriyaReach x={PRI.x} y={PRI.y} s={PRI.s} frame={frame} expr="flat" lookX={-16} lookY={6} talk={mouthAt("P05", frame, F(T.P05, 45.96))} />} />
      </VCamera>
      <rect width={1080} height={1920} fill="#9FB4D6" opacity={0.06} />
      <VVignette id="a24v" strength={0.28} />
    </VFrame>
  );
};
// Epilogue set: the robot in Dev's chair typing at the (moved) keyboard; Dev standing at the left with a mop + bucket.
export const Epilogue: React.FC<{ frame: number; head?: object; behind?: React.ReactNode; robot?: object }> = ({ frame, head = {}, behind, robot = {} }) => (
  <AutoDesk frame={frame} showDev={false} robot={null} typing={1} keyX={145} behind={behind}
    seat={<>
      <RobotChair x={DEV.x + 150} y={DEV.y} s={DEV.s} frame={frame} robot={{ reach: 110, keyY: -98, ...robot }} />
      <Bucket x={195} y={1478} s={1.2} />
      <DevStand x={30} y={1190} s={1.5} frame={frame} arms="mop" head={{ lookX: 16, lookY: 4, ...head }} />
    </>} />
);
// 25 (49.40–52.00): wide. The robot in Dev's chair; Dev with the mop. Theo glides in: "Congratulations, Dev…"
export const A25: React.FC<ShotProps> = ({ frame }) => {
  const tx = lerp(1350, THEO.x, easeOut((frame - 10) / 16));
  return (
    <VFrame>
      <VCamera cx={470} cy={860} zoom={1.1}>
        <Epilogue frame={frame} behind={<TheoCoffee x={tx} y={THEO.y} s={THEO.s} frame={frame} h={{ expr: "smile", lookX: -12, lookY: 6, talk: mouthAt("T02", frame, F(T.T02, 49.4)) }} flip />} robot={{ antenna: blink(frame, 12) }} />
      </VCamera>
      <rect width={1080} height={1920} fill="#FFE2B0" opacity={0.06} />
      <VVignette id="a25v" strength={0.28} />
    </VFrame>
  );
};
// 26 (52.00–55.01): Theo MCU, smiling, coffee: "…You automated yourself out of a job."
export const A26: React.FC<ShotProps> = ({ frame }) => (
  <VFrame>
    <VCamera cx={850} cy={680} zoom={2.0}>
      <Epilogue frame={frame} behind={<TheoCoffee x={THEO.x} y={THEO.y} s={THEO.s} frame={frame} h={{ expr: "smile", lookX: -12, lookY: 6, talk: mouthAt("T02", frame, F(T.T02, 52.0)) }} flip />} />
    </VCamera>
    <OfficeLight /><VVignette id="a26v" strength={0.28} />
  </VFrame>
);
// 27 (55.01–58.40): Dev MCU with the mop, hopeful, to the robot: "Can the robot automate my new job too?" The robot turns, antenna blinks.
export const A27: React.FC<ShotProps> = ({ frame, duration }) => {
  const turn = frame > 66;
  return (
    <VFrame>
      <VCamera cx={lerp(290, 310, frame / duration)} cy={820} zoom={lerp(1.5, 1.6, frame / duration)}>
        <Epilogue frame={frame} head={{ smile: false, serious: false, lookX: 18, lookY: 6, talk: mouthAt("D08", frame, F(T.D08, 55.01)) }}
          robot={turn ? { pose: "idle", typeSpeed: 0, expr: "joy", face: -0.6, antenna: blink(frame, 6) } : {}} />
      </VCamera>
      <OfficeLight /><VVignette id="a27v" strength={0.28} />
    </VFrame>
  );
};
export const BLK: React.FC<ShotProps> = () => <VFrame bg="#000"><rect width={1080} height={1920} fill="#000" /></VFrame>;

// shot boundaries (s): 10.75 12.95 15.17 16.43 17.54 18.74 21.52 24.72 27.65 30.49 31.09 33.20 36.01 39.38 40.21 44.43 45.96 49.40 52.00 55.01 58.40 58.75
const B = [10.75, 12.95, 15.17, 16.43, 17.54, 18.74, 21.52, 24.72, 27.65, 30.49, 31.09, 33.2, 36.01, 39.38, 40.21, 44.43, 45.96, 49.4, 52.0, 55.01, 58.4, 58.75];
const C = [A08, A09, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23, A24, A25, A26, A27, BLK];
export const REST: ShotDef[] = C.map((Component, i) => ({
  id: i === C.length - 1 ? "BLK" : `A${String(i + 8).padStart(2, "0")}`,
  Component,
  duration: Math.round(B[i + 1] * 24) - Math.round(B[i] * 24),
}));
