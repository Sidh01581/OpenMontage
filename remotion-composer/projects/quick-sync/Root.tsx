import React from "react";
import { AbsoluteFill, Audio, Composition, Series, staticFile, useCurrentFrame } from "remotion";
import { SAMPLE, ShotDef, ShotProps } from "./shots_a";
import { WordCaptions, HookCaption, CapGroup } from "../we-need-to-talk/captions";
import CAP_SAMPLE from "./captions_sample.json";

// QUICK SYNC. — vertical Short, 1080x1920, 24 fps. Hard cuts; one pre-mixed voices+SFX track (no music).
const FPS = 24;
export const COLORS: Record<string, string> = { theo: "#FFC93C", dev: "#7FE08A", priya: "#5FF0DF" };

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
      <HookCaption t={t} until={hookUntil}>POV: "quick sync"<br />on your calendar</HookCaption>
      <WordCaptions t={t} groups={groups} colors={COLORS} hideAfter={hideAfter} />
    </>
  );
};
const total = (l: ShotDef[]) => l.reduce((n, s) => n + s.duration, 0);
const Sample: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={SAMPLE} />
    <Overlay groups={CAP_SAMPLE as CapGroup[]} hookUntil={2.5} />
    <Audio src={staticFile("sample_mix.wav")} />
  </AbsoluteFill>
);
export const Root: React.FC = () => (
  <>
    <Composition id="QsSample" component={Sample} durationInFrames={total(SAMPLE)} fps={FPS} width={1080} height={1920} />
    {SAMPLE.map((s) => (
      <Composition key={s.id} id={`Qs-${s.id}`} component={() => <Live C={s.Component} duration={s.duration} />} durationInFrames={s.duration} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
