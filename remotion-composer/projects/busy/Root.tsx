import React from "react";
import { AbsoluteFill, Audio, Composition, Series, staticFile, useCurrentFrame } from "remotion";
import { SAMPLE, ShotDef, ShotProps } from "./shots_a";
import { REST } from "./shots_b";
import { WordCaptions, HookCaption, CapGroup } from "../we-need-to-talk/captions";
import { loadSpaceGrotesk } from "../../src/lib/localFonts";
import CAP_SAMPLE from "./captions_sample.json";
import CAP_FILM from "./captions_film.json";
import { SheetDev, SheetCast } from "./modelsheet";
import { ThumbnailV } from "./thumbnail";

// BUSY. — vertical Short, 1080x1920, 24 fps. Hard cuts; one pre-mixed voices+SFX track (no music).
const FPS = 24;
const { fontFamily } = loadSpaceGrotesk(["700"]);
export const COLORS: Record<string, string> = { theo: "#FFC93C", dev: "#7FE08A", priya: "#5FF0DF", narrator: "#FFFFFF" };

const Live: React.FC<{ C: React.FC<ShotProps>; duration: number; frameOverride?: number }> = ({ C, duration, frameOverride }) => {
  const frame = useCurrentFrame();
  return <C frame={frameOverride ?? frame} duration={duration} />;
};
const Shots: React.FC<{ list: ShotDef[] }> = ({ list }) => (
  <Series>{list.map((s) => <Series.Sequence key={s.id} durationInFrames={s.duration}><Live C={s.Component} duration={s.duration} /></Series.Sequence>)}</Series>
);

// End-screen card (user script): "Employee of the Month – Master of Looking Busy! ☕😂"
const EndCard: React.FC<{ t: number; from: number }> = ({ t, from }) => {
  if (t < from + 0.15) return null;
  const age = t - from - 0.15;
  const pop = 1 + 0.12 * Math.exp(-age * 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 150, width: 780, top: 1300, padding: "24px 30px", boxSizing: "border-box",
        background: "#FFFFFF", borderRadius: 26, border: "6px solid #111018", boxShadow: "0 10px 0 rgba(17,16,24,0.85)",
        fontFamily, fontWeight: 700, fontSize: 50, lineHeight: 1.14, color: "#111018", textAlign: "center",
        letterSpacing: "-0.02em", transform: `rotate(-1.5deg) scale(${pop})`,
      }}>
        Employee of the Month –<br />Master of Looking Busy! ☕😂
      </div>
    </AbsoluteFill>
  );
};

const Overlay: React.FC<{ groups: CapGroup[]; hookUntil: number; hideAfter?: number; endAt?: number }> = ({ groups, hookUntil, hideAfter, endAt }) => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      <HookCaption t={t} until={hookUntil}>POV: the busiest guy in<br />the office does zero work</HookCaption>
      <WordCaptions t={t} groups={groups} colors={COLORS} hideAfter={hideAfter} />
      {endAt !== undefined && <EndCard t={t} from={endAt} />}
    </>
  );
};
const total = (l: ShotDef[]) => l.reduce((n, s) => n + s.duration, 0);

const Sample: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={SAMPLE} />
    <Overlay groups={CAP_SAMPLE as CapGroup[]} hookUntil={2.25} />
    <Audio src={staticFile("sample_mix.wav")} />
  </AbsoluteFill>
);

export const FILM: ShotDef[] = [...SAMPLE, ...REST];
const END_AT = total(FILM.slice(0, -1)) / FPS; // start of the end screen
const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={FILM} />
    <Overlay groups={CAP_FILM as CapGroup[]} hookUntil={2.25} hideAfter={END_AT} endAt={END_AT} />
    <Audio src={staticFile("film_mix.wav")} />
  </AbsoluteFill>
);
// Storyboard: one frame per shot (60% through), frame index = shot index.
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const s = FILM[Math.min(f, FILM.length - 1)];
  return <Live C={s.Component} duration={s.duration} frameOverride={Math.floor(s.duration * 0.6)} />;
};

export const Root: React.FC = () => (
  <>
    <Composition id="BusySample" component={Sample} durationInFrames={total(SAMPLE)} fps={FPS} width={1080} height={1920} />
    <Composition id="BusyFilm" component={Film} durationInFrames={total(FILM)} fps={FPS} width={1080} height={1920} />
    <Composition id="BusyBoard" component={Board} durationInFrames={FILM.length} fps={FPS} width={1080} height={1920} />
    <Composition id="BusyThumb" component={ThumbnailV} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    <Composition id="BusySheetA" component={SheetDev} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="BusySheetB" component={SheetCast} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    {FILM.map((s) => (
      <Composition key={s.id} id={`Busy-${s.id}`} component={() => <Live C={s.Component} duration={s.duration} />} durationInFrames={s.duration} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
