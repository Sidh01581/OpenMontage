import React from "react";
import { AbsoluteFill, Audio, Composition, Series, staticFile, useCurrentFrame } from "remotion";
import { SAMPLE, ShotDef, ShotProps } from "./shots_a";
import { WordCaptions, HookCaption, CapGroup } from "../we-need-to-talk/captions";
import CAP_SAMPLE from "./captions_sample.json";
import { SheetDevSure, SheetTheo } from "./modelsheet";
import { REST } from "./shots_b";
import { ThumbnailV } from "./thumbnail";
import CAP_FILM from "./captions_film.json";

// SURE. — vertical Short, 1080x1920, 24 fps. Hard cuts; one pre-mixed voices+SFX track (no music).
const FPS = 24;
export const COLORS: Record<string, string> = { theo: "#FFC93C", sure: "#C8F25A", dev: "#7FE08A", priya: "#5FF0DF", mom: "#FF9FB8", narrator: "#FFFFFF" };

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
      <HookCaption t={t} until={hookUntil}>POV: you physically<br />can't say no</HookCaption>
      <WordCaptions t={t} groups={groups} colors={COLORS} hideAfter={hideAfter} />
    </>
  );
};

const Sample: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={SAMPLE} />
    <Overlay groups={CAP_SAMPLE as CapGroup[]} hookUntil={3.25} />
    <Audio src={staticFile("sample_mix.wav")} />
  </AbsoluteFill>
);
const total = (l: ShotDef[]) => l.reduce((n, s) => n + s.duration, 0);

export const FILM: ShotDef[] = [...SAMPLE, ...REST];
const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={FILM} />
    <Overlay groups={CAP_FILM as CapGroup[]} hookUntil={3.25} hideAfter={1011 / FPS} />
    <Audio src={staticFile("film_mix.wav")} />
  </AbsoluteFill>
);
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const s = FILM[Math.min(f, FILM.length - 1)];
  return <Live C={s.Component} duration={s.duration} frameOverride={Math.floor(s.duration * 0.6)} />;
};

export const Root: React.FC = () => (
  <>
    <Composition id="SureSample" component={Sample} durationInFrames={total(SAMPLE)} fps={FPS} width={1080} height={1920} />
    <Composition id="SureFilm" component={Film} durationInFrames={total(FILM)} fps={FPS} width={1080} height={1920} />
    <Composition id="SureBoard" component={Board} durationInFrames={FILM.length} fps={FPS} width={1080} height={1920} />
    <Composition id="SureThumb" component={ThumbnailV} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    <Composition id="SureSheetA" component={SheetDevSure} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="SureSheetB" component={SheetTheo} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    {FILM.map((s) => (
      <Composition key={s.id} id={`Sure-${s.id}`} component={() => <Live C={s.Component} duration={s.duration} />} durationInFrames={s.duration} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
