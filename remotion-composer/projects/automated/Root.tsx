import React from "react";
import { AbsoluteFill, Audio, Composition, Series, staticFile, useCurrentFrame } from "remotion";
import { SAMPLE, ShotDef, ShotProps } from "./shots_a";
import { REST } from "./shots_b";
import { WordCaptions, HookCaption, CapGroup } from "../we-need-to-talk/captions";
import { Robot, RobotExpr, RobotPose } from "./robot";
import CAP_SAMPLE from "./captions_sample.json";
import CAP_FILM from "./captions_film.json";
import { RobotReferenceSheet, PoseSheet } from "./sheets";
import { ThumbnailV } from "./thumbnail";

// AUTOMATED. — vertical Short, 1080x1920, 24 fps. Hard cuts; one pre-mixed voices+SFX track (no music).
const FPS = 24;
export const COLORS: Record<string, string> = { theo: "#FFC93C", dev: "#7FE08A", priya: "#5FF0DF", robot: "#8FE3FF" };

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
      <HookCaption t={t} until={hookUntil}>POV: you automated<br />your entire job</HookCaption>
      <WordCaptions t={t} groups={groups} colors={COLORS} hideAfter={hideAfter} />
    </>
  );
};
const total = (l: ShotDef[]) => l.reduce((n, s) => n + s.duration, 0);
const Sample: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={SAMPLE} />
    <Overlay groups={CAP_SAMPLE as CapGroup[]} hookUntil={2.4} />
    <Audio src={staticFile("sample_mix.wav")} />
  </AbsoluteFill>
);
export const FILM: ShotDef[] = [...SAMPLE, ...REST];
const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Shots list={FILM} />
    <Overlay groups={CAP_FILM as CapGroup[]} hookUntil={2.4} hideAfter={58.4} />
    <Audio src={staticFile("film_mix.wav")} />
  </AbsoluteFill>
);
// Storyboard: one frame per shot (60% through), frame index = shot index.
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const s = FILM[Math.min(f, FILM.length - 1)];
  return <Live C={s.Component} duration={s.duration} frameOverride={Math.floor(s.duration * 0.6)} />;
};
// quick robot pose test
const RobotTest: React.FC = () => {
  const f = useCurrentFrame();
  const L: [RobotPose, RobotExpr, number][] = [["idle", "happy", 0], ["wave", "joy", -0.6], ["type", "focus", 0.6], ["thumbs", "proud", 0.3]];
  return (
    <AbsoluteFill style={{ backgroundColor: "#ECEFF3" }}>
      <svg width={2000} height={700}>
        {L.map(([p, e, fc], i) => <Robot key={i} x={250 + i * 500} y={600} s={1.5} frame={f} pose={p} expr={e} face={fc} typeSpeed={p === "type" ? 2 : 0} lanyard={i === 3 ? 1 : 0} />)}
      </svg>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <>
    <Composition id="AuThumb" component={ThumbnailV} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    <Composition id="AuFilm" component={Film} durationInFrames={total(FILM)} fps={FPS} width={1080} height={1920} />
    <Composition id="AuBoard" component={Board} durationInFrames={FILM.length} fps={FPS} width={1080} height={1920} />
    <Composition id="AuSample" component={Sample} durationInFrames={total(SAMPLE)} fps={FPS} width={1080} height={1920} />
    <Composition id="Au-robot-reference" component={RobotReferenceSheet} durationInFrames={1} fps={FPS} width={2400} height={1500} />
    <Composition id="Au-poses" component={PoseSheet} durationInFrames={1} fps={FPS} width={2400} height={1500} />
    <Composition id="Au-robot-test" component={RobotTest} durationInFrames={30} fps={FPS} width={2000} height={700} />
    {FILM.map((s) => (
      <Composition key={s.id} id={`Au-${s.id}`} component={() => <Live C={s.Component} duration={s.duration} />} durationInFrames={s.duration} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
