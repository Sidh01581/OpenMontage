import React from "react";
import { ChairBack, TheoLegs, Expr } from "../later/art";
import { VFrame, VCamera, VVignette, OfficeBack, Partition, OfficeDesk, TheoSeated, lerp, ease, easeOut } from "../we-need-to-talk/vart";
import { Dev, Sure, TheoNotes, HoodiePocket } from "./sart";
import MOUTH from "./mouth_env.json";

// SURE. — shots 1–3 (sample). Pure functions of (frame, duration).
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

const MorningLight: React.FC = () => <rect width={1080} height={1920} fill="#FFF6DA" opacity={0.08} />;

// Shot 1 — MS: Dev leans in; Theo turns, beaming: "Sure!"
export const A01: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const devTalk = mouthAt("D01", frame, F(0.15, 0));
  const sureAt = F(2.78, 0);
  const turn = ease((frame - 8) / 30);
  const lean = easeOut(frame / 14);
  const expr: Expr = frame >= sureAt - 2 ? "grin" : turn > 0.6 ? "smile" : "neutral";
  return (
    <VFrame>
      <VCamera cx={lerp(990, 996, t)} cy={lerp(330, 336, t)} zoom={lerp(1.8, 1.88, t)}>
        <OfficeBack frame={frame} clockH={9} clockM={14} sky="day" />
        <Partition />
        <Dev x={lerp(820, 850, lean)} y={lerp(210, 196, lean)} s={0.95} frame={frame} talk={devTalk} lookX={8} lookY={8} headTilt={lerp(0, 8, lean)} />
        <ChairBack /><TheoLegs />
        <OfficeDesk frame={frame} bag={false} />
        <TheoSeated expr={expr} frame={frame} typeSpeed={frame < 10 ? 0.9 : 0}
          headRot={lerp(0, -4, turn)} lookX={lerp(6, -10, turn)} lookY={lerp(4, -8, turn)} />
      </VCamera>
      <MorningLight />
      <VVignette id="a1v" strength={0.25} />
    </VFrame>
  );
};

// Shot 2 — CU: a sticky note SLAPS onto Theo's forehead; he keeps smiling.
export const A02: React.FC<ShotProps> = ({ frame, duration }) => {
  const slap = 1;
  const hit = frame >= slap + 2;
  const shake = hit ? 14 * Math.exp(-(frame - slap - 2) / 3) : 0;
  const zoom = lerp(3.4, 3.9, easeOut(frame / 4)) + lerp(0, 0.15, frame / duration);
  return (
    <VFrame>
      <VCamera cx={990} cy={410} zoom={zoom} shakeX={Math.sin(frame * 3) * shake} shakeY={Math.cos(frame * 2.4) * shake * 0.6}>
        <OfficeBack frame={frame} clockH={9} clockM={14} sky="day" />
        <Partition />
        <ChairBack /><TheoLegs /><OfficeDesk frame={frame} bag={false} />
        <TheoSeated expr="grin" frame={frame} headRot={-4} lookX={-8} lookY={-6} eyesClosed={frame >= slap + 2 && frame <= slap + 5}
          headOverlay={<TheoNotes n={1} frame={frame} slapFrame={slap} />} />
      </VCamera>
      <MorningLight />
      <VVignette id="a2v" strength={0.3} />
    </VFrame>
  );
};

// Shot 3 — CU: Sure pops out of Theo's hoodie pocket, nodding, double thumbs up. "Say yes. Everyone will love you."
export const A03: React.FC<ShotProps> = ({ frame, duration }) => {
  const t = ease(frame / duration);
  const popAt = F(4.35, 4.25);
  const rise = easeOut((frame - popAt) / 7);
  const settle = frame < popAt + 7 ? 0 : Math.exp(-(frame - popAt - 7) / 4) * Math.sin((frame - popAt - 7) * 1.4);
  const sy = lerp(760, 596, rise) - settle * 12;
  const squash = frame < popAt + 7 ? lerp(1, 1.3, rise) : 1 - 0.25 * Math.exp(-(frame - popAt - 7) / 3) * Math.cos((frame - popAt - 7) * 0.9);
  const talk = mouthAt("S01", frame, F(4.85, 4.25));
  return (
    <VFrame>
      <VCamera cx={lerp(950, 946, t)} cy={lerp(560, 550, t)} zoom={lerp(3.2, 3.45, t)}>
        <OfficeBack frame={frame} clockH={9} clockM={14} sky="day" />
        <Partition />
        <ChairBack /><TheoLegs /><OfficeDesk frame={frame} bag={false} />
        <TheoSeated expr="smile" frame={frame} headRot={6} lookX={-2} lookY={14} headOverlay={<TheoNotes n={1} frame={frame} />} />
        <defs><clipPath id="pocketClip"><rect x={600} y={-400} width={800} height={1100} /></clipPath></defs>
        {frame >= popAt && <g clipPath="url(#pocketClip)"><Sure x={926} y={sy} s={0.5} frame={frame} squash={squash} mouth={talk} /></g>}
        <HoodiePocket />
      </VCamera>
      <MorningLight />
      <VVignette id="a3v" strength={0.3} />
    </VFrame>
  );
};

export const SAMPLE: ShotDef[] = [
  { id: "A01", Component: A01, duration: 78 }, // 0:00–3.25
  { id: "A02", Component: A02, duration: 24 }, // 3.25–4.25
  { id: "A03", Component: A03, duration: 78 }, // 4.25–7.50
];
