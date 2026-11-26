import React from "react";
import { AbsoluteFill, Audio, Composition, Series, staticFile, useCurrentFrame } from "remotion";
import { SAMPLE, ShotDef, ShotProps } from "./shots_a";
import { REST } from "./shots_b";
import { WordCaptions, HookCaption, CapGroup } from "../we-need-to-talk/captions";
import { MODEL } from "./modelsheet";
import { DevReferenceSheet } from "./devref";
import { TheoReferenceSheet } from "./theoref";
import { ThumbnailV } from "./thumbnail";
import CAP_SAMPLE from "./captions_sample.json";
import CAP_FILM from "./captions_film.json";

// THE PASSWORD NIGHTMARE. — vertical Short, 1080x1920, 24 fps. Hard cuts; one pre-mixed voices+SFX track (no music).
const FPS = 24;
export const COLORS: Record<string, string> = { theo: "#FFC93C", dev: "#7FE08A", priya: "#5FF0DF", system: "#8FB8FF" };

const Live: React.FC<{ C: React.FC<ShotProps>; duration: number; frameOverride?: number }> = ({ C, duration, frameOverride }) => {
  const frame = useCurrentFrame();
  return <C frame={frameOverride ?? frame} duration={duration} />;
};
const Shots: React.FC<{ list: ShotDef[] }> = ({ list }) => (
  <Series>{list.map((s) => <Series.Sequence key={s.id} durationInFrames={s.duration}><Live C={s.Component} duration={s.duration} /></Series.Sequence>)}</Series>
);
const Overlay: React.FC<{ groups: CapGroup[]; hookUntil: number; hideAfter?: number }> = ({ groups, hookUntil, hideAfter }) => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      <HookCaption t={t} until={hookUntil}>POV: your<br />password expired</HookCaption>
      <WordCaptions t={t} groups={groups} colors={COLORS} hideAfter={hideAfter} />
    </>
  );
};
const total = (l: ShotDef[]) => l.reduce((n, s) => n + s.duration, 0);
const Sample: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={SAMPLE} />
    <Overlay groups={CAP_SAMPLE as CapGroup[]} hookUntil={2.2} />
    <Audio src={staticFile("sample_mix.wav")} />
  </AbsoluteFill>
);
export const FILM: ShotDef[] = [...SAMPLE, ...REST];
const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={FILM} />
    <Overlay groups={CAP_FILM as CapGroup[]} hookUntil={2.2} hideAfter={44.5} />
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
    <Composition id="Pw-dev-reference" component={() => <DevReferenceSheet frame={useCurrentFrame()} />} durationInFrames={1} fps={FPS} width={2400} height={1500} />
    <Composition id="Pw-theo-reference" component={TheoReferenceSheet} durationInFrames={1} fps={FPS} width={2400} height={1500} />
    <Composition id="PwThumb" component={ThumbnailV} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    <Composition id="PwFilm" component={Film} durationInFrames={total(FILM)} fps={FPS} width={1080} height={1920} />
    <Composition id="PwBoard" component={Board} durationInFrames={FILM.length} fps={FPS} width={1080} height={1920} />
    <Composition id="PwSample" component={Sample} durationInFrames={total(SAMPLE)} fps={FPS} width={1080} height={1920} />
    {[...FILM, ...MODEL].map((s) => (
      <Composition key={s.id} id={`Pw-${s.id}`} component={() => <Live C={s.Component} duration={s.duration} />} durationInFrames={s.duration} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
